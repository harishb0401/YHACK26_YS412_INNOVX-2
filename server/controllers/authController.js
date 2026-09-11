import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

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
 * Format safe user object (removes password_hash)
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

    // Check duplicate email
    const { data: existingEmail, error: emailCheckErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.toLowerCase())
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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Map submitted address/location value to the 'location' database column
    const resolvedProfileLocation = location || address || locationText || 'Chennai Hub';

    // Insert profile strictly using valid schema columns:
    // id, full_name, email, phone, password_hash, role, location, latitude, longitude, is_active
    const { data: newProfile, error: profileInsertErr } = await supabase
      .from('profiles')
      .insert([
        {
          full_name: fullName,
          email: email.toLowerCase(),
          phone: phone || null,
          password_hash: passwordHash,
          role: role || 'collector',
          location: resolvedProfileLocation,
          latitude: latitude || null,
          longitude: longitude || null,
          is_active: true
        }
      ])
      .select()
      .single();

    if (profileInsertErr) {
      throw new Error(profileInsertErr.message);
    }

    let recyclerProfile = null;

    // If recycler, create recycler_profiles entry using valid columns:
    // user_id, facility_name, cpcb_reg_number, status, categories, monthly_capacity_kg, service_radius_km, facility_address, latitude, longitude
    if (role === 'recycler') {
      const resolvedFacilityName = facilityName || organizationName || fullName || 'Registered Recycler Facility';
      const resolvedFacilityAddress = facilityAddress || address || location || locationText || 'Tamil Nadu';
      const resolvedCpcbReg = cpcbRegNumber || cpcbRegistrationNumber || `CPCB-TN-${Date.now().toString().slice(-4)}`;
      const resolvedCategories = categories || acceptedCategories || [];
      const resolvedCapacity = parseFloat(monthlyCapacityKg || monthlyCapacity) || 1000;

      const { data: newRecycler, error: recInsertErr } = await supabase
        .from('recycler_profiles')
        .insert([
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

    // Generate JWT
    const token = generateToken(newProfile);
    const safeUser = formatSafeUser(newProfile, recyclerProfile);

    return res.status(201).json({
      success: true,
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
 */
export async function login(req, res, next) {
  try {
    if (!supabase) {
      return res.status(500).json({ success: false, message: 'Database client is unavailable' });
    }

    const { email, identifier, password, role: requestedRole } = req.body;
    const loginIdentifier = (identifier || email || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password.'
      });
    }

    // Search profile by email or phone
    let query = supabase.from('profiles').select('*');
    if (loginIdentifier.includes('@')) {
      query = query.eq('email', loginIdentifier);
    } else {
      query = query.or(`email.eq.${loginIdentifier},phone.eq.${loginIdentifier}`);
    }

    const { data: profile, error: fetchErr } = await query.maybeSingle();

    if (fetchErr || !profile) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.'
      });
    }

    // Check if account is active
    if (!profile.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify bcrypt password
    const isPasswordValid = await bcrypt.compare(password, profile.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/phone and password.'
      });
    }

    // Optional check for role mismatch if specified
    if (requestedRole && requestedRole !== profile.role) {
      // Role note: allow login but inform
    }

    // Fetch recycler profile if recycler
    let recyclerProfile = null;
    if (profile.role === 'recycler') {
      const { data: recData } = await supabase
        .from('recycler_profiles')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();
      recyclerProfile = recData;
    }

    const token = generateToken(profile);
    const safeUser = formatSafeUser(profile, recyclerProfile);

    return res.status(200).json({
      success: true,
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

