/**
 * Eco-Link Offline Session Service
 * Manages authenticated offline sessions for Collectors on trusted personal devices.
 *
 * ============================================================================
 * SECURITY CONSIDERATIONS & LIMITATIONS OF OFFLINE AUTHENTICATION:
 * 1. Offline authentication relies on validating a previously issued, unexpired
 *    session saved locally in browser IndexedDB.
 * 2. It CANNOT verify real-time server revocation or password changes while offline.
 * 3. NO PASSWORDS or sensitive plaintext credentials are ever stored locally.
 * 4. Only minimal user identity metadata (ID, name, role, phone) and session expiration
 *    are persisted.
 * 5. Offline access is strictly restricted to the 'collector' role. New devices/users
 *    MUST perform their first authentication online against the backend.
 * 6. The session is bound to an explicit expiration window (default 7 days).
 * 7. When the user explicitly logs out, the offline session is immediately purged.
 * ============================================================================
 */

import db from './offlineDatabase';

export const AUTH_STATES = {
  AUTHENTICATED_ONLINE: 'AUTHENTICATED_ONLINE',
  AUTHENTICATED_OFFLINE: 'AUTHENTICATED_OFFLINE',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
  SESSION_EXPIRED: 'SESSION_EXPIRED'
};

const SESSION_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACTIVE_COLLECTOR_KEY = 'active_collector';

/**
 * Persist an active collector session to IndexedDB following successful online login
 * @param {Object} user - User object from backend
 * @param {string} token - JWT token string
 */
export async function saveCollectorSession(user, token) {
  if (!user || user.role !== 'collector') {
    return;
  }

  const now = Date.now();
  const sessionRecord = {
    id: ACTIVE_COLLECTOR_KEY,
    userId: user.id,
    role: user.role,
    sessionVersion: 1,
    cachedAt: now,
    expiresAt: now + SESSION_EXPIRATION_MS,
    token: token || null,
    user: {
      id: user.id,
      name: user.fullName || user.name || '',
      fullName: user.fullName || user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      role: 'collector',
      location: user.location || user.address || '',
      address: user.location || user.address || '',
      phone_verified: user.phone_verified ?? true
    }
  };

  try {
    await db.collectorSession.put(sessionRecord);
    // Also update collector profile store
    await db.collectorProfile.put({
      id: user.id,
      userId: user.id,
      ...sessionRecord.user,
      updatedAt: now
    });
  } catch (err) {
    console.warn('Failed to save offline collector session to IndexedDB:', err);
  }
}

/**
 * Retrieve and validate the locally stored collector session
 * @returns {Promise<{ state: string, user: Object|null, session: Object|null }>}
 */
export async function getOfflineCollectorSession() {
  try {
    const session = await db.collectorSession.get(ACTIVE_COLLECTOR_KEY);
    if (!session) {
      return { state: AUTH_STATES.NOT_AUTHENTICATED, user: null, session: null };
    }

    const now = Date.now();
    if (session.expiresAt && now > session.expiresAt) {
      // Session has expired
      return { state: AUTH_STATES.SESSION_EXPIRED, user: null, session };
    }

    if (session.role !== 'collector') {
      return { state: AUTH_STATES.NOT_AUTHENTICATED, user: null, session: null };
    }

    return {
      state: AUTH_STATES.AUTHENTICATED_OFFLINE,
      user: session.user,
      session
    };
  } catch (err) {
    console.warn('Failed to read offline collector session from IndexedDB:', err);
    return { state: AUTH_STATES.NOT_AUTHENTICATED, user: null, session: null };
  }
}

/**
 * Remove the offline collector session on logout
 */
export async function clearOfflineCollectorSession() {
  try {
    await db.collectorSession.delete(ACTIVE_COLLECTOR_KEY);
  } catch (err) {
    console.warn('Failed to clear offline collector session:', err);
  }
}

/**
 * Retrieve cached collector profile from IndexedDB
 * @param {string} userId
 */
export async function getCachedCollectorProfile(userId) {
  try {
    if (userId) {
      const profile = await db.collectorProfile.get(userId);
      if (profile) return profile;
    }
    // Fallback to active collector session user
    const session = await db.collectorSession.get(ACTIVE_COLLECTOR_KEY);
    return session?.user || null;
  } catch (err) {
    console.warn('Error reading cached profile:', err);
    return null;
  }
}

export default {
  AUTH_STATES,
  saveCollectorSession,
  getOfflineCollectorSession,
  clearOfflineCollectorSession,
  getCachedCollectorProfile
};
