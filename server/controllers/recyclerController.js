import { supabase } from '../config/supabase.js';

/**
 * Recycler Dashboard Statistics
 * GET /api/recycler/dashboard
 */
export async function getRecyclerDashboard(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const userId = req.user.id;

    // Recycler profile
    const { data: profile } = await supabase
      .from('recycler_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    // Submitted offers count
    const { count: totalOffers } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('recycler_id', userId);

    // Accepted offers count
    const { count: acceptedOffers } = await supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('recycler_id', userId)
      .eq('status', 'ACCEPTED');

    // Total procurement amount from transactions
    const { data: txData } = await supabase
      .from('transactions')
      .select('amount, weight')
      .eq('recycler_id', userId);

    const totalProcuredAmount = (txData || []).reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const totalWeightProcured = (txData || []).reduce((sum, t) => sum + (parseFloat(t.weight) || 0), 0);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        cpcbStatus: profile?.status || 'PENDING',
        isVerified: profile?.status === 'VERIFIED',
        totalOffers: totalOffers || 0,
        acceptedOffers: acceptedOffers || 0,
        totalProcuredAmount,
        totalWeightProcured,
        monthlyCapacity: profile?.monthly_capacity_kg || 0,
        monthlyUsed: 0
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Recycler Facility Profile
 * GET /api/recycler/profile
 */
export async function getRecyclerProfile(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        *,
        recycler_profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'Recycler profile not found' });
    }

    const recData = profile.recycler_profiles?.[0] || profile.recycler_profiles;

    return res.status(200).json({
      success: true,
      data: {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        organizationName: recData?.facility_name || profile.full_name,
        companyName: recData?.facility_name || profile.full_name,
        facilityName: recData?.facility_name || profile.full_name,
        registrationNumber: recData?.cpcb_reg_number,
        cpcbRegistrationNumber: recData?.cpcb_reg_number,
        cpcbRegistrationNo: recData?.cpcb_reg_number,
        cpcbStatus: recData?.status || 'PENDING',
        verificationStatus: recData?.status || 'PENDING',
        isVerified: recData?.status === 'VERIFIED',
        acceptedCategories: recData?.categories || [],
        categories: recData?.categories || [],
        monthlyCapacity: recData?.monthly_capacity_kg || 0,
        monthlyCapacityKg: recData?.monthly_capacity_kg || 0,
        monthlyUsed: 0,
        facilityAddress: recData?.facility_address || profile.location,
        locationText: recData?.facility_address || profile.location,
        location: recData?.facility_address || profile.location
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update Recycler Facility Profile
 * PUT /api/recycler/profile
 */
export async function updateRecyclerProfile(req, res, next) {
  try {
    if (!supabase) return res.status(500).json({ success: false, message: 'Database client is unavailable' });

    const userId = req.user.id;
    const {
      fullName,
      contactPerson,
      organizationName,
      facilityName,
      companyName,
      locationText,
      location,
      address,
      facilityAddress,
      acceptedCategories,
      categories,
      monthlyCapacity,
      monthlyCapacityKg,
      cpcbRegistrationNo,
      cpcbRegistrationNumber,
      cpcbRegNumber,
      phone
    } = req.body;

    const userLoc = location || address || locationText;
    const resolvedPersonName = fullName || contactPerson;

    // Update user profile info
    if (phone || userLoc || resolvedPersonName) {
      await supabase
        .from('profiles')
        .update({
          ...(resolvedPersonName ? { full_name: resolvedPersonName } : {}),
          ...(phone ? { phone } : {}),
          ...(userLoc ? { location: userLoc } : {}),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }

    const resolvedFacilityName = facilityName || companyName || organizationName;
    const resolvedFacilityAddress = facilityAddress || address || location || locationText;
    const resolvedCategories = categories || acceptedCategories;
    const resolvedCapacity = monthlyCapacityKg !== undefined ? parseFloat(monthlyCapacityKg) : (monthlyCapacity !== undefined ? parseFloat(monthlyCapacity) : undefined);
    const resolvedCpcbReg = cpcbRegistrationNo || cpcbRegNumber || cpcbRegistrationNumber;

    // Update recycler profile
    const { data: updatedRecycler, error: recErr } = await supabase
      .from('recycler_profiles')
      .update({
        ...(resolvedFacilityName ? { facility_name: resolvedFacilityName } : {}),
        ...(resolvedFacilityAddress ? { facility_address: resolvedFacilityAddress } : {}),
        ...(resolvedCategories ? { categories: resolvedCategories } : {}),
        ...(resolvedCapacity !== undefined ? { monthly_capacity_kg: resolvedCapacity } : {}),
        ...(resolvedCpcbReg ? { cpcb_reg_number: resolvedCpcbReg } : {}),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (recErr) throw new Error(recErr.message);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedRecycler
    });
  } catch (err) {
    next(err);
  }
}
