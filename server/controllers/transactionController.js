import { supabase } from '../config/supabase.js';

/**
 * Get Current User's Transactions (Collector or Recycler)
 * GET /api/transactions/my
 */
export async function getMyTransactions(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const userId = req.user.id;
    const role = req.user.role;

    let query = supabase
      .from('transactions')
      .select(`
        *,
        waste_lots(lot_id, category, material_type, unit),
        collector:profiles!transactions_collector_id_fkey(full_name, phone, location),
        recycler:profiles!transactions_recycler_id_fkey(
          full_name, 
          recycler_profiles(facility_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (role === 'collector') {
      query = query.eq('collector_id', userId);
    } else if (role === 'recycler') {
      query = query.eq('recycler_id', userId);
    } // Admin sees all

    const { data: transactions, error: txErr } = await query;
    if (txErr) throw new Error(txErr.message);

    const formatted = (transactions || []).map(tx => {
      const recOrg = tx.recycler?.recycler_profiles?.[0]?.facility_name || tx.recycler?.full_name || 'Verified Recycler';
      return {
        id: tx.transaction_id,
        dbId: tx.id,
        transactionId: tx.transaction_id,
        lotId: tx.waste_lots?.lot_id || 'REQ-2026-000000',
        collectorId: tx.collector_id,
        collectorName: tx.collector?.full_name || 'Ramesh Kumar',
        recyclerId: tx.recycler_id,
        recyclerName: recOrg,
        totalWeightKg: tx.weight,
        ratePerKg: tx.rate_per_kg,
        totalValue: tx.amount,
        amount: tx.amount,
        status: tx.payment_status,
        paymentStatus: tx.payment_status,
        paymentMethod: 'Eco-Link Simulated Smart Escrow (UPI/NEFT)',
        date: tx.created_at ? tx.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        receiptId: tx.receipt_id,
        qrHash: tx.qr_signature || `TXN-VERIFIED-${tx.transaction_id}`,
        createdAt: tx.created_at
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Transaction Details by ID
 * GET /api/transactions/:transactionId
 */
export async function getTransactionById(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const { transactionId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    let query = supabase
      .from('transactions')
      .select(`
        *,
        waste_lots(lot_id, category, material_type, unit, location),
        collector:profiles!transactions_collector_id_fkey(full_name, phone, location),
        recycler:profiles!transactions_recycler_id_fkey(
          full_name, 
          recycler_profiles(facility_name, cpcb_reg_number)
        )
      `);

    if (transactionId.startsWith('TXN-')) {
      query = query.eq('transaction_id', transactionId);
    } else {
      query = query.or(`id.eq.${transactionId},transaction_id.eq.${transactionId}`);
    }

    const { data: tx, error: txErr } = await query.maybeSingle();
    if (txErr || !tx) {
      return res.status(404).json({ success: false, message: 'Transaction record not found' });
    }

    // Access authorization check
    if (role !== 'admin' && tx.collector_id !== userId && tx.recycler_id !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to view this transaction' });
    }

    const recOrg = tx.recycler?.recycler_profiles?.[0]?.facility_name || tx.recycler?.full_name || 'Verified Recycler';

    const formatted = {
      id: tx.transaction_id,
      dbId: tx.id,
      transactionId: tx.transaction_id,
      lotId: tx.waste_lots?.lot_id,
      collectorId: tx.collector_id,
      collectorName: tx.collector?.full_name,
      collectorPhone: tx.collector?.phone,
      recyclerId: tx.recycler_id,
      recyclerName: recOrg,
      cpcbRegistrationNo: tx.recycler?.recycler_profiles?.[0]?.cpcb_reg_number,
      totalWeightKg: tx.weight,
      ratePerKg: tx.rate_per_kg,
      totalValue: tx.amount,
      amount: tx.amount,
      status: tx.payment_status,
      paymentStatus: tx.payment_status,
      paymentMethod: 'Eco-Link Simulated Smart Escrow (UPI/NEFT)',
      date: tx.created_at ? tx.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      receiptId: tx.receipt_id,
      qrHash: tx.qr_signature,
      createdAt: tx.created_at
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
 * Get All Transactions (Admin only)
 * GET /api/admin/transactions
 */
export async function getAllTransactions(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const { data: transactions, error: txErr } = await supabase
      .from('transactions')
      .select(`
        *,
        waste_lots(lot_id, category, material_type, unit),
        collector:profiles!transactions_collector_id_fkey(full_name, phone, location),
        recycler:profiles!transactions_recycler_id_fkey(
          full_name, 
          recycler_profiles(facility_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (txErr) throw new Error(txErr.message);

    const formatted = (transactions || []).map(tx => {
      const recOrg = tx.recycler?.recycler_profiles?.[0]?.organization_name || tx.recycler?.full_name || 'Verified Recycler';
      return {
        id: tx.transaction_id,
        dbId: tx.id,
        transactionId: tx.transaction_id,
        lotId: tx.waste_lots?.lot_id,
        collectorId: tx.collector_id,
        collectorName: tx.collector?.full_name,
        recyclerId: tx.recycler_id,
        recyclerName: recOrg,
        totalWeightKg: tx.weight,
        ratePerKg: tx.rate_per_kg,
        totalValue: tx.amount,
        amount: tx.amount,
        status: tx.payment_status,
        paymentStatus: tx.payment_status,
        paymentMethod: 'Eco-Link Simulated Smart Escrow (UPI/NEFT)',
        date: tx.created_at ? tx.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
        receiptId: tx.receipt_id,
        qrHash: tx.qr_signature,
        createdAt: tx.created_at
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
}
