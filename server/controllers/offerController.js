import { supabase } from '../config/supabase.js';
import { generateOfferId } from '../utils/generateId.js';
import { evaluateOfferFairPrice, calculateFairPriceRange } from '../services/pricingService.js';
import { computeDistanceBetween } from '../services/matchingService.js';
import { acceptOfferAtomic } from '../services/transactionService.js';

/**
 * Submit Price Offer on a Waste Lot (Recycler only)
 * POST /api/offers
 */
export async function createOffer(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const recyclerUserId = req.user.id;
    const {
      lotId,
      ratePerKg,
      pricePerUnit,
      pickupDate,
      proposedPickupDate,
      notes
    } = req.body;

    const rate = parseFloat(ratePerKg || pricePerUnit);
    if (!rate || rate <= 0) {
      return res.status(400).json({ success: false, message: 'Offer rate per kg must be greater than 0' });
    }

    // 1. Verify recycler profile & CPCB verification status
    const { data: recyclerProfile, error: profErr } = await supabase
      .from('recycler_profiles')
      .select('*')
      .eq('user_id', recyclerUserId)
      .maybeSingle();

    if (profErr || !recyclerProfile) {
      return res.status(403).json({
        success: false,
        message: 'Recycler profile not found. Please complete facility profile registration.'
      });
    }

    if (recyclerProfile.status !== 'VERIFIED' && recyclerProfile.cpcb_status !== 'VERIFIED') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: Only CPCB Verified Recyclers are authorized to submit price bids.'
      });
    }

    // 2. Find the target waste lot
    let lotQuery = supabase.from('waste_lots').select('*');
    if (typeof lotId === 'string' && lotId.startsWith('REQ-')) {
      lotQuery = lotQuery.eq('lot_id', lotId);
    } else {
      lotQuery = lotQuery.or(`id.eq.${lotId},lot_id.eq.${lotId}`);
    }

    const { data: lot, error: lotErr } = await lotQuery.maybeSingle();
    if (lotErr || !lot) {
      return res.status(404).json({ success: false, message: 'Waste lot not found' });
    }

    if (!['AWAITING_OFFERS', 'OFFERS_RECEIVED'].includes(lot.status)) {
      return res.status(400).json({
        success: false,
        message: `Waste lot is currently in ${lot.status} status and is not accepting offers.`
      });
    }

    // 3. Evaluate Fair Price Bounds
    const benchmark = lot.benchmark_rate || lot.benchmark_price || 350;
    const fairBounds = calculateFairPriceRange(benchmark, 0.25, lot.quantity);
    const evaluation = evaluateOfferFairPrice(rate, benchmark, 0.25);

    // 4. Calculate total amount & distance
    const totalAmount = Math.round(rate * (lot.quantity || 1));
    const distanceKm = computeDistanceBetween(recyclerProfile, lot);

    // 5. Generate unique offer ID & insert
    const offerId = generateOfferId();

    const { data: newOffer, error: insertErr } = await supabase
      .from('offers')
      .insert([
        {
          offer_id: offerId,
          lot_id: lot.id,
          recycler_id: recyclerUserId,
          rate_per_unit: rate,
          total_amount: totalAmount,
          benchmark_rate: benchmark,
          min_fair_price: fairBounds.lowerLimit,
          max_fair_price: fairBounds.upperLimit,
          price_status: evaluation.status,
          distance_km: distanceKm,
          remarks: notes || 'Direct factory pickup arranged with certified weighing scales.',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertErr) throw new Error(insertErr.message);

    // 6. Update lot status to OFFERS_RECEIVED if it was AWAITING_OFFERS
    if (lot.status === 'AWAITING_OFFERS') {
      await supabase
        .from('waste_lots')
        .update({ status: 'OFFERS_RECEIVED', updated_at: new Date().toISOString() })
        .eq('id', lot.id);
    }

    // 7. Add timeline event
    await supabase.from('lot_timeline').insert([
      {
        lot_id: lot.id,
        event_type: 'OFFERS_RECEIVED',
        title: 'New Recycler Offer Received',
        description: `Offer submitted: ₹${rate}/kg (Total: ₹${totalAmount.toLocaleString()}) by ${recyclerProfile.facility_name || 'Verified Recycler'}`,
        created_at: new Date().toISOString()
      }
    ]);

    return res.status(201).json({
      success: true,
      data: {
        ...newOffer,
        id: newOffer.offer_id,
        dbId: newOffer.id,
        offerId: newOffer.offer_id,
        lotId: lot.lot_id,
        pricePerUnit: newOffer.rate_per_unit,
        ratePerKg: newOffer.rate_per_unit,
        totalPrice: newOffer.total_amount,
        proposedPickupDate: pickupDate || proposedPickupDate || 'Within 48h',
        fairPriceStatus: newOffer.price_status,
        distanceKm: newOffer.distance_km
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get My Submitted Offers (Recycler only)
 * GET /api/offers/my
 */
export async function getMyOffers(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const recyclerUserId = req.user.id;

    const { data: offers, error: offersErr } = await supabase
      .from('offers')
      .select(`
        *,
        waste_lots!offers_lot_id_fkey(
          lot_id,
          category,
          material_type,
          quantity,
          unit,
          location,
          status
        )
      `)
      .eq('recycler_id', recyclerUserId)
      .order('created_at', { ascending: false });

    if (offersErr) throw new Error(offersErr.message);

    const formatted = (offers || []).map(o => ({
      id: o.offer_id,
      dbId: o.id,
      offerId: o.offer_id,
      lotId: o.waste_lots?.lot_id,
      lotCategory: o.waste_lots?.category,
      lotMaterial: o.waste_lots?.material_type,
      lotWeight: o.waste_lots?.quantity,
      lotStatus: o.waste_lots?.status,
      ratePerKg: o.rate_per_kg,
      pricePerUnit: o.rate_per_kg,
      totalPrice: o.total_amount,
      totalAmount: o.total_amount,
      pickupDate: o.pickup_date,
      priceStatus: o.price_status,
      status: o.status,
      createdAt: o.created_at
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
 * Accept Offer Controller (Collector only)
 * POST /api/offers/:offerId/accept
 */
export async function acceptOffer(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const collectorId = req.user.id;
    const { offerId } = req.params;

    // Resolve offer database ID if passed as OFF-2026-XXXX
    let targetOfferId = offerId;
    if (offerId.startsWith('OFF-')) {
      const { data: offRec } = await supabase
        .from('offers')
        .select('id')
        .eq('offer_id', offerId)
        .maybeSingle();

      if (offRec) {
        targetOfferId = offRec.id;
      }
    }

    const result = await acceptOfferAtomic({
      collectorId,
      offerId: targetOfferId
    });

    return res.status(200).json({
      success: true,
      message: 'Offer accepted successfully. Simulated Escrow has been locked.',
      data: result
    });
  } catch (err) {
    next(err);
  }
}
