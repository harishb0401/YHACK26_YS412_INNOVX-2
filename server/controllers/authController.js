import jwt from 'jsonwebtoken';
import { supabase, authClient } from '../config/supabase.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecolink-production-jwt-super-secret-key-2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Generates JWT Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Format safe user object (never includes password_hash)
 */
function formatSafeUser(profile, recyclerProfile = null) {
  const userLocation = profile.location || null;
  return {
    id: profile.id,
    fullName: profile.full_name,
    name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role,
    address: userLocation,
    location: userLocation,
    locationText: userLocation,
    latitude: profile.latitude,
    longitude: profile.longitude,
    isActive: profile.is_active,
    createdAt: profile.created_at,
    phone_verified: true,
    ...(recyclerProfile ? {
      recyclerProfile: {
        id: recyclerProfile.id,
        organizationName: recyclerProfile.facility_name,
        companyName: recyclerProfile.facility_name,
        facilityName: recyclerProfile.facility_name,
        registrationNumber: recyclerProfile.cpcb_reg_number,
        cpcbRegistrationNumber: recyclerProfile.cpcb_reg_number,
        cpcbRegistrationNo: recyclerProfile.cpcb_reg_number,
        cpcbStatus: recyclerProfile.status,
        verificationStatus: recyclerProfile.status,
        status: recyclerProfile.status,
        acceptedCategories: recyclerProfile.categories || [],
        categories: recyclerProfile.categories || [],
        monthlyCapacity: recyclerProfile.monthly_capacity_kg,
        monthlyCapacityKg: recyclerProfile.monthly_capacity_kg,
        monthlyUsed: 0,
        facilityAddress: recyclerProfile.facility_address,
        location: recyclerProfile.facility_address || userLocation
      }
    } : {})
  };
}

/**
 * User Registration Controller
 * POST /api/auth/register
 * Creates user in Supabase Authentication (auth.users) and saves profile in public.profiles
 */
export async function register(req, res, next) {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, message: 'Database client is unavailable' });
    }

    const {
      fullName,
      email,
      phone,
      password,
      role,
      organizationName,
      facilityName,
      address,
      location,
      locationText,
      facilityAddress,
      latitude,
      longitude,
      cpcbRegistrationNumber,
      cpcbRegNumber,
      acceptedCategories,
      categories,
      monthlyCapacity,
      monthlyCapacityKg
    } = req.body;

    // Reject public admin signup
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Public administrator signup is disabled for security reasons.'
      });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check duplicate email in public.profiles
    const { data: existingEmail } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Check duplicate phone if provided
    if (phone) {
      const { data: existingPhone } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle();

      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: 'An account with this phone number already exists.'
        });
      }
    }

    // 1. Create User in Supabase Authentication (auth.users)
    const { data: authUser, error: authCreateErr } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role || 'collector'
      }
    });

    if (authCreateErr || !authUser?.user) {
      return res.status(400).json({
        success: false,
        message: authCreateErr?.message || 'Failed to create user in authentication system.'
      });
    }

    const userId = authUser.user.id;
    const resolvedProfileLocation = location || address || locationText || 'Chennai Hub';

    // 2. Insert corresponding record in public.profiles using matching Supabase Auth UUID
    const profilePayload = {
      id: userId,
      full_name: fullName,
      email: normalizedEmail,
      phone: phone || null,
      role: role || 'collector',
      location: resolvedProfileLocation,
      latitude: latitude || null,
      longitude: longitude || null,
      is_active: true
    };

    let { data: newProfile, error: profileInsertErr } = await supabase
      .from('profiles')
      .upsert([profilePayload])
      .select()
      .single();

    // If live table still enforces NOT NULL on password_hash prior to migration execution
    if (profileInsertErr && profileInsertErr.message && profileInsertErr.message.includes('password_hash')) {
      profilePayload.password_hash = '';
      const retry = await supabase.from('profiles').upsert([profilePayload]).select().single();
      newProfile = retry.data;
      profileInsertErr = retry.error;
    }

    if (profileInsertErr) {
      // Clean up Supabase Auth user if profile insertion failed
      await supabase.auth.admin.deleteUser(userId).catch(() => {});
      throw new Error(profileInsertErr.message);
    }

    let recyclerProfile = null;

    // 3. If recycler, create recycler_profiles entry
    if (role === 'recycler') {
      const resolvedFacilityName = facilityName || organizationName || fullName || 'Registered Recycler Facility';
      const resolvedFacilityAddress = facilityAddress || address || location || locationText || 'Tamil Nadu';
      const resolvedCpcbReg = cpcbRegNumber || cpcbRegistrationNumber || `CPCB-TN-${Date.now().toString().slice(-4)}`;
      const resolvedCategories = categories || acceptedCategories || [];
      const resolvedCapacity = parseFloat(monthlyCapacityKg || monthlyCapacity) || 1000;

      const { data: newRecycler, error: recInsertErr } = await supabase
        .from('recycler_profiles')
        .upsert([
          {
            user_id: newProfile.id,
            facility_name: resolvedFacilityName,
            cpcb_reg_number: resolvedCpcbReg,
            status: 'PENDING',
            categories: resolvedCategories,
            monthly_capacity_kg: resolvedCapacity,
            service_radius_km: 50,
            facility_address: resolvedFacilityAddress,
            latitude: latitude || null,
            longitude: longitude || null
          }
        ])
        .select()
        .single();

      if (recInsertErr) {
        console.warn('Recycler profile creation warning:', recInsertErr.message || recInsertErr);
      } else {
        recyclerProfile = newRecycler;
      }
    }

    // 4. Generate Session Token & Return format safe user
    const token = generateToken(newProfile);
    const safeUser = formatSafeUser(newProfile, recyclerProfile);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: safeUser
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * User Login Controller
 * POST /api/auth/login
 * Authenticates credentials via Supabase Authentication (signInWithPassword)
 */
export async function login(req, res, next) {
  try {
    if (!supabase || !authClient) {
      return res.status(500).json({ success: false, message: 'Authentication service is unavailable' });
    }

    const { email, identifier, password, role: requestedRole } = req.body;
    const loginIdentifier = (identifier || email || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password.'
      });
    }

    let authEmail = loginIdentifier;

    // If identifier is not an email (e.g. phone number), resolve corresponding profile email from public.profiles
    if (!loginIdentifier.includes('@')) {
      const { data: phoneProfile, error: phoneLookupErr } = await supabase
        .from('profiles')
        .select('email')
        .eq('phone', loginIdentifier)
        .maybeSingle();

      if (phoneLookupErr || !phoneProfile || !phoneProfile.email) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please check your email/phone and password.'
        });
      }
      authEmail = phoneProfile.email;
    }

    // 1. Authenticate with Supabase Auth (source of truth for passwords)
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: authEmail.toLowerCase(),
      password
    });

    if (authError || !authData?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.'
      });
    }

    const authUserId = authData.user.id;

    // 2. Retrieve corresponding public.profiles record using authenticated Supabase user UUID
    let { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUserId)
      .maybeSingle();

    // Fallback search by email if id needs sync
    if (!profile) {
      const { data: emailProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', authEmail.toLowerCase())
        .maybeSingle();

      if (emailProfile) {
        profile = emailProfile;
      }
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please contact support.'
      });
    }

    // 3. Validate is_active
    if (!profile.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // 4. Validate role if requested
    if (requestedRole && requestedRole !== 'public' && requestedRole !== profile.role) {
      return res.status(403).json({
        success: false,
        message: `Unauthorized. You are registered as ${profile.role}, not ${requestedRole}.`
      });
    }

    // 5. Fetch recycler profile if user is recycler
    let recyclerProfile = null;
    if (profile.role === 'recycler') {
      const { data: recData } = await supabase
        .from('recycler_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      recyclerProfile = recData;
    }

    // 6. Generate application JWT token
    const token = generateToken(profile);
    const safeUser = formatSafeUser(profile, recyclerProfile);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: safeUser
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get Current User Profile Controller
 * GET /api/auth/me
 */
export async function getMe(req, res, next) {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, message: 'Database client is unavailable' });
    }

    const userId = req.user.id;
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    let recyclerProfile = null;
    if (profile.role === 'recycler') {
      const { data: recData } = await supabase
        .from('recycler_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      recyclerProfile = recData;
    }

    return res.status(200).json({
      success: true,
      data: {
        user: formatSafeUser(profile, recyclerProfile)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Update Current User Profile Controller
 * PUT /api/auth/profile
 */
export async function updateProfile(req, res, next) {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, message: 'Database client is unavailable' });
    }

    const userId = req.user.id;
    const { fullName, name, phone, location, address, locationText } = req.body;
    const resolvedName = fullName || name;
    const resolvedLocation = location || address || locationText;

    const updates = {};
    if (resolvedName !== undefined) updates.full_name = resolvedName;
    if (phone !== undefined) updates.phone = phone || null;
    if (resolvedLocation !== undefined) updates.location = resolvedLocation;
    updates.updated_at = new Date().toISOString();

    const { data: updatedProfile, error: profileErr } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (profileErr) {
      throw new Error(profileErr.message);
    }

    let recyclerProfile = null;
    if (updatedProfile.role === 'recycler') {
      const { data: recData } = await supabase
        .from('recycler_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      recyclerProfile = recData;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: formatSafeUser(updatedProfile, recyclerProfile)
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout Controller
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
}

