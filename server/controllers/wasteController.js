import { supabase } from '../config/supabase.js';
import { generateLotId, generateEventId } from '../utils/generateId.js';
import { classifyEWaste, calculateFairPriceRange } from '../services/pricingService.js';
import { matchLotsToRecycler } from '../services/matchingService.js';

/**
 * Create Waste Lot (Collector only)
 * POST /api/waste
 */
export async function createWasteLot(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const collectorId = req.user.id;
    const {
      clientOperationId,
      category,
      material,
      materialType,
      description,
      quantity,
      unit = 'kg',
      condition = 'Non-working / Scrap',
      notes,
      location,
      locationText,
      latitude,
      longitude
    } = req.body;

    const parsedQuantity = parseFloat(quantity);
    if (!parsedQuantity || parsedQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be greater than 0' });
    }

    // Idempotency check: if clientOperationId provided, check if this lot was already synced
    if (clientOperationId) {
      const { data: existingLot } = await supabase
        .from('waste_lots')
        .select('*')
        .eq('collector_id', collectorId)
        .ilike('description', `%[OpId: ${clientOperationId}]%`)
        .maybeSingle();

      if (existingLot) {
        return res.status(200).json({
          success: true,
          message: 'Lot already synchronized (idempotent)',
          data: {
            ...existingLot,
            id: existingLot.id,
            lotId: existingLot.lot_id,
            material: existingLot.material_type,
            location: existingLot.location,
            locationText: existingLot.location,
            totalWeightKg: existingLot.quantity,
            benchmarkPrice: existingLot.benchmark_rate,
            estimatedLotValue: Math.round((existingLot.benchmark_rate || 0) * (existingLot.quantity || 0))
          }
        });
      }
    }

    // 1. Authoritative server-side classification and pricing calculation
    const classification = classifyEWaste(material || category);
    const resolvedBenchmark = classification.benchmarkPrice || 350;
    const resolvedTolerance = classification.tolerance || 0.25;
    const pricingRange = calculateFairPriceRange(resolvedBenchmark, resolvedTolerance, parsedQuantity);

    // 2. Generate unique Lot ID
    const lotId = generateLotId();

    const finalLocationText = locationText || location || 'Chennai Hub';
    const baseDescription = description || notes || `${parsedQuantity} ${unit} declared`;
    const finalDescription = clientOperationId 
      ? `${baseDescription} [OpId: ${clientOperationId}]`
      : baseDescription;

    // 3. Insert waste lot into Supabase
    const { data: newLot, error: insertErr } = await supabase
      .from('waste_lots')
      .insert([
        {
          lot_id: lotId,
          collector_id: collectorId,
          category: classification.category,
          material_type: material || classification.material,
          description: finalDescription,
          quantity: parsedQuantity,
          unit: unit || 'kg',
          condition: condition || 'Non-working / Scrap',
          location: finalLocationText,
          latitude: latitude !== undefined ? parseFloat(latitude) : null,
          longitude: longitude !== undefined ? parseFloat(longitude) : null,
          benchmark_rate: resolvedBenchmark,
          min_fair_price: pricingRange.lowerLimit,
          max_fair_price: pricingRange.upperLimit,
          status: 'AWAITING_OFFERS',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertErr) {
      throw new Error(insertErr.message);
    }

    // 5. Insert timeline event
    await supabase.from('lot_timeline').insert([
      {
        lot_id: newLot.id,
        event_type: 'CREATED',
        title: 'Waste Lot Registered',
        description: `${parsedQuantity} ${unit} ${classification.material} declared. Benchmark ₹${resolvedBenchmark}/${unit} (Fair Range ₹${pricingRange.lowerLimit}–₹${pricingRange.upperLimit}/${unit}).`,
        created_at: new Date().toISOString()
      },
      {
        lot_id: newLot.id,
        event_type: 'CLASSIFIED',
        title: 'Automatic Material Classification',
        description: `Categorized as ${classification.category} (${classification.hazardLevel || 'Medium'} Hazard Level)`,
        created_at: new Date().toISOString()
      }
    ]);

    return res.status(201).json({
      success: true,
      data: {
        ...newLot,
        id: newLot.id,
        lotId: newLot.lot_id,
        material: newLot.material_type,
        location: newLot.location,
        locationText: newLot.location,
        totalWeightKg: newLot.quantity,
        benchmarkPrice: newLot.benchmark_rate,
        estimatedLotValue: Math.round((newLot.benchmark_rate || 0) * (newLot.quantity || 0)),
        allowedPriceRange: {
          minPrice: newLot.min_fair_price,
          maxPrice: newLot.max_fair_price,
          rangeLabel: `₹${newLot.min_fair_price}–₹${newLot.max_fair_price}/${newLot.unit}`
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get My Waste Lots (Collector only)
 * GET /api/waste/my
 */
export async function getMyWasteLots(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const collectorId = req.user.id;

    // Fetch lots along with offers and timeline
    const { data: lots, error: lotsErr } = await supabase
      .from('waste_lots')
      .select(`
        *,
        lot_timeline(*),
        offers(*)
      `)
      .eq('collector_id', collectorId)
      .order('created_at', { ascending: false });

    if (lotsErr) throw new Error(lotsErr.message);

    // Format for frontend consumption
    const formattedLots = (lots || []).map(lot => {
      const activeOffers = (lot.offers || []).filter(o => o.status !== 'CANCELLED');
      return {
        ...lot,
        id: lot.lot_id, // Frontend uses lot_id (e.g. REQ-2026-XXXXXX) as primary id for routing
        dbId: lot.id,
        lotId: lot.lot_id,
        material: lot.material_type,
        location: lot.location,
        locationText: lot.location,
        totalWeightKg: lot.quantity,
        benchmarkPrice: lot.benchmark_rate,
        estimatedLotValue: Math.round((lot.benchmark_rate || 0) * (lot.quantity || 0)),
        allowedPriceRange: {
          minPrice: lot.min_fair_price,
          maxPrice: lot.max_fair_price,
          rangeLabel: `₹${lot.min_fair_price}–₹${lot.max_fair_price}/${lot.unit}`
        },
        offersCount: activeOffers.length,
        offers: activeOffers,
        timeline: (lot.lot_timeline || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedLots
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Available Waste Lots for Recyclers
 * GET /api/waste/available
 */
export async function getAvailableWasteLots(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    // Fetch recycler profile
    const { data: recyclerProfile } = await supabase
      .from('recycler_profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .maybeSingle();

    // Fetch open lots
    const { data: openLots, error: lotsErr } = await supabase
      .from('waste_lots')
      .select(`
        *,
        profiles!waste_lots_collector_id_fkey(full_name, phone, location)
      `)
      .in('status', ['AWAITING_OFFERS', 'OFFERS_RECEIVED'])
      .order('created_at', { ascending: false });

    if (lotsErr) throw new Error(lotsErr.message);

    // Run matching engine
    const matchedLots = matchLotsToRecycler(openLots || [], recyclerProfile);

    // Format for frontend
    const formatted = matchedLots.map(lot => ({
      ...lot,
      id: lot.lot_id,
      dbId: lot.id,
      lotId: lot.lot_id,
      material: lot.material_type,
      location: lot.location,
      locationText: lot.location,
      totalWeightKg: lot.quantity,
      benchmarkPrice: lot.benchmark_rate,
      estimatedLotValue: Math.round((lot.benchmark_rate || 0) * (lot.quantity || 0)),
      collectorName: lot.profiles?.full_name || 'Registered Collector',
      collectorPhone: lot.profiles?.phone
    }));

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Specific Waste Lot by ID
 * GET /api/waste/:lotId
 */
export async function getWasteLotById(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const { lotId } = req.params;

    // Support lookup by UUID or human lot_id
    let query = supabase
      .from('waste_lots')
      .select(`
        *,
        lot_timeline(*),
        offers(*),
        profiles!waste_lots_collector_id_fkey(full_name, email, phone, location)
      `);

    if (lotId.includes('-') && lotId.startsWith('REQ-')) {
      query = query.eq('lot_id', lotId);
    } else {
      query = query.or(`id.eq.${lotId},lot_id.eq.${lotId}`);
    }

    const { data: lot, error: lotErr } = await query.maybeSingle();

    if (lotErr || !lot) {
      return res.status(404).json({ success: false, message: 'Waste lot not found' });
    }

    // Role verification: Collectors can only view their own lots
    if (req.user.role === 'collector' && lot.collector_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access restricted to lot owner' });
    }

    const formatted = {
      ...lot,
      id: lot.lot_id,
      dbId: lot.id,
      lotId: lot.lot_id,
      material: lot.material_type,
      location: lot.location,
      locationText: lot.location,
      totalWeightKg: lot.quantity,
      benchmarkPrice: lot.benchmark_rate,
      estimatedLotValue: Math.round((lot.benchmark_rate || 0) * (lot.quantity || 0)),
      collectorName: lot.profiles?.full_name,
      allowedPriceRange: {
        minPrice: lot.min_fair_price,
        maxPrice: lot.max_fair_price,
        rangeLabel: `₹${lot.min_fair_price}–₹${lot.max_fair_price}/${lot.unit}`
      },
      timeline: (lot.lot_timeline || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
      offers: (lot.offers || [])
    };

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Offers for a specific Waste Lot (Collector only)
 * GET /api/waste/:lotId/offers
 */
export async function getWasteLotOffers(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const { lotId } = req.params;

    // Find the lot
    let lotQuery = supabase.from('waste_lots').select('id, lot_id, collector_id');
    if (lotId.startsWith('REQ-')) {
      lotQuery = lotQuery.eq('lot_id', lotId);
    } else {
      lotQuery = lotQuery.or(`id.eq.${lotId},lot_id.eq.${lotId}`);
    }

    const { data: lot, error: lotErr } = await lotQuery.maybeSingle();
    if (lotErr || !lot) {
      return res.status(404).json({ success: false, message: 'Waste lot not found' });
    }

    // Check ownership
    if (lot.collector_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only the lot owner can view these offers' });
    }

    // Fetch offers with recycler profile
    const { data: offers, error: offersErr } = await supabase
      .from('offers')
      .select(`
        *,
        profiles!offers_recycler_id_fkey(
          full_name,
          email,
          phone,
          recycler_profiles(organization_name, cpcb_status, registration_number, cpcb_registration_number)
        )
      `)
      .eq('lot_id', lot.id)
      .order('created_at', { ascending: false });

    if (offersErr) throw new Error(offersErr.message);

    const formattedOffers = (offers || []).map(o => {
      const recProfile = o.profiles?.recycler_profiles?.[0] || o.profiles?.recycler_profiles;
      return {
        id: o.offer_id || o.id,
        dbId: o.id,
        offerId: o.offer_id,
        lotId: lot.lot_id,
        recyclerId: o.recycler_id,
        recyclerName: recProfile?.organization_name || o.profiles?.full_name || 'Verified Recycler',
        cpcbStatus: recProfile?.cpcb_status || 'VERIFIED',
        ratePerKg: o.rate_per_kg,
        pricePerUnit: o.rate_per_kg,
        totalPrice: o.total_amount,
        totalAmount: o.total_amount,
        pickupDate: o.pickup_date,
        proposedPickupDate: o.pickup_date ? new Date(o.pickup_date).toLocaleDateString() : 'Within 48h',
        priceStatus: o.price_status,
        distanceKm: o.distance_km,
        notes: o.notes,
        status: o.status,
        createdAt: o.created_at
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedOffers
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Cancel Waste Lot (Collector only)
 * POST /api/waste/:lotId/cancel
 */
export async function cancelWasteLot(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const { lotId } = req.params;

    let lotQuery = supabase.from('waste_lots').select('*');
    if (lotId.startsWith('REQ-')) {
      lotQuery = lotQuery.eq('lot_id', lotId);
    } else {
      lotQuery = lotQuery.or(`id.eq.${lotId},lot_id.eq.${lotId}`);
    }

    const { data: lot, error: lotErr } = await lotQuery.maybeSingle();
    if (lotErr || !lot) {
      return res.status(404).json({ success: false, message: 'Waste lot not found' });
    }

    if (lot.collector_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not own this lot' });
    }

    if (['COLLECTED', 'COMPLETED'].includes(lot.status)) {
      return res.status(400).json({ success: false, message: 'Completed waste lots cannot be cancelled' });
    }

    const { data: updatedLot, error: updateErr } = await supabase
      .from('waste_lots')
      .update({ status: 'CANCELLED', updated_at: new Date().toISOString() })
      .eq('id', lot.id)
      .select()
      .single();

    if (updateErr) throw new Error(updateErr.message);

    await supabase.from('lot_timeline').insert([
      {
        lot_id: lot.id,
        event: 'CANCELLED',
        role: req.user.role,
        details: 'Waste lot request was cancelled by user',
        created_at: new Date().toISOString()
      }
    ]);

    return res.status(200).json({
      success: true,
      message: 'Waste lot successfully cancelled',
      data: updatedLot
    });
  } catch (err) {
    next(err);
  }
}
