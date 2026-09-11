import { supabase } from '../config/supabase.js';

/**
 * Verifies a recycler facility and logs verification record
 */
export async function verifyRecyclerFacility({ recyclerUserId, adminId }) {
  if (!supabase) throw new Error('Supabase client is not configured');

  // Update recycler_profiles
  const { data: updatedProfile, error: profileErr } = await supabase
    .from('recycler_profiles')
    .update({
      status: 'VERIFIED',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', recyclerUserId)
    .select()
    .single();

  if (profileErr) throw new Error(profileErr.message);

  // Insert verification_records log
  const { data: verificationRecord, error: recErr } = await supabase
    .from('verification_records')
    .insert([
      {
        recycler_id: updatedProfile.id,
        admin_id: adminId,
        previous_status: 'PENDING',
        new_status: 'VERIFIED',
        remarks: 'Approved by regulatory administrator'
      }
    ])
    .select()
    .maybeSingle();

  if (recErr) console.warn('Verification record log warning:', recErr.message);

  return {
    profile: updatedProfile,
    verification: verificationRecord
  };
}

/**
 * Rejects a recycler application and logs reason
 */
export async function rejectRecyclerFacility({ recyclerUserId, adminId, reason }) {
  if (!supabase) throw new Error('Supabase client is not configured');

  // Update recycler_profiles
  const { data: updatedProfile, error: profileErr } = await supabase
    .from('recycler_profiles')
    .update({
      status: 'REJECTED',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', recyclerUserId)
    .select()
    .single();

  if (profileErr) throw new Error(profileErr.message);

  // Insert verification_records log
  const { data: verificationRecord, error: recErr } = await supabase
    .from('verification_records')
    .insert([
      {
        recycler_id: updatedProfile.id,
        admin_id: adminId,
        previous_status: 'PENDING',
        new_status: 'REJECTED',
        remarks: reason || 'Facility documentation does not meet regulatory CPCB threshold'
      }
    ])
    .select()
    .maybeSingle();

  if (recErr) console.warn('Verification record log warning:', recErr.message);

  return {
    profile: updatedProfile,
    verification: verificationRecord
  };
}
