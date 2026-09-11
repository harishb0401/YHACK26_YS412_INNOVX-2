import { supabase } from '../config/supabase.js';
import { generateTransactionId, generateReceiptId } from '../utils/generateId.js';
import { generateTransactionQRSignature } from '../utils/qr.js';

/**
 * Handles atomic offer acceptance, competing offer rejection, status updates,
 * simulated escrow locking, transaction generation, and audit timeline tracking.
 */
export async function acceptOfferAtomic({ collectorId, offerId }) {
  if (!supabase) {
    throw new Error('Supabase client is not configured');
  }

  // 1. Fetch the offer to retrieve the lot_id
  const { data: offer, error: offerErr } = await supabase
    .from('offers')
    .select('*, waste_lots(*)')
    .eq('id', offerId)
    .single();

  if (offerErr || !offer) {
    throw new Error('Offer not found');
  }

  const lot = offer.waste_lots;
  if (!lot) {
    throw new Error('Associated waste lot not found');
  }

  // 2. Verify collector ownership
  if (lot.collector_id !== collectorId) {
    const error = new Error('Forbidden: You do not own this waste lot');
    error.status = 403;
    throw error;
  }

  // 3. Verify offer is PENDING
  if (offer.status !== 'PENDING') {
    const error = new Error(`Offer cannot be accepted because status is ${offer.status}`);
    error.status = 400;
    throw error;
  }

  // Generate unique IDs
  const transactionId = generateTransactionId();
  const receiptId = generateReceiptId();
  const qrSignature = generateTransactionQRSignature({
    transactionId,
    lotId: lot.id,
    amount: offer.total_amount
  });

  // 4. Try executing PostgreSQL atomic RPC function
  const { data: rpcData, error: rpcErr } = await supabase.rpc('accept_offer_atomic', {
    p_collector_id: collectorId,
    p_offer_id: offer.id,
    p_lot_id: lot.id,
    p_transaction_id: transactionId,
    p_receipt_id: receiptId,
    p_qr_signature: qrSignature
  });

  if (!rpcErr && rpcData) {
    // Fetch the newly created transaction
    const { data: createdTx } = await supabase
      .from('transactions')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    return {
      lotId: lot.id,
      offerId: offer.id,
      transaction: createdTx || {
        transaction_id: transactionId,
        payment_status: 'ESCROW_LOCKED',
        amount: offer.total_amount
      }
    };
  }

  // 5. Fallback sequential execution if RPC function is not yet installed in Supabase
  // a) Mark selected offer as ACCEPTED
  const { error: acceptOfferErr } = await supabase
    .from('offers')
    .update({ status: 'ACCEPTED', updated_at: new Date().toISOString() })
    .eq('id', offer.id);

  if (acceptOfferErr) throw new Error(acceptOfferErr.message);

  // b) Mark all other pending offers on this lot as REJECTED
  await supabase
    .from('offers')
    .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
    .eq('lot_id', lot.id)
    .neq('id', offer.id)
    .eq('status', 'PENDING');

  // c) Update waste lot
  const { error: updateLotErr } = await supabase
    .from('waste_lots')
    .update({
      status: 'OFFER_ACCEPTED',
      selected_offer_id: offer.id,
      accepted_recycler_id: offer.recycler_id,
      pickup_date: offer.pickup_date,
      updated_at: new Date().toISOString()
    })
    .eq('id', lot.id);

  if (updateLotErr) throw new Error(updateLotErr.message);

  // d) Create simulated escrow transaction
  const { data: newTx, error: txErr } = await supabase
    .from('transactions')
    .insert([
      {
        transaction_id: transactionId,
        lot_id: lot.id,
        offer_id: offer.id,
        collector_id: collectorId,
        recycler_id: offer.recycler_id,
        amount: offer.total_amount,
        rate_per_kg: offer.rate_per_kg,
        weight: lot.quantity,
        payment_status: 'ESCROW_LOCKED',
        receipt_id: receiptId,
        qr_signature: qrSignature,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (txErr) throw new Error(txErr.message);

  // e) Insert timeline records
  await supabase.from('lot_timeline').insert([
    {
      lot_id: lot.id,
      event_type: 'OFFER_ACCEPTED',
      title: 'Offer Accepted & Escrow Locked',
      description: `Collector accepted offer of ₹${offer.rate_per_kg}/kg (Total: ₹${offer.total_amount})`,
      created_at: new Date().toISOString()
    },
    {
      lot_id: lot.id,
      event_type: 'PICKUP_SCHEDULED',
      title: 'Pickup Scheduled',
      description: `Simulated Escrow locked and pickup scheduled for ${offer.pickup_date ? new Date(offer.pickup_date).toLocaleDateString() : 'upcoming date'}`,
      created_at: new Date().toISOString()
    }
  ]);

  return {
    lotId: lot.id,
    offerId: offer.id,
    transaction: newTx
  };
}
