/**
 * Eco-Link Local IndexedDB Storage
 * Built with Dexie.js for structured, fast, robust offline storage on Android & web.
 *
 * Stores:
 * - collectorSession: Authenticated collector session tokens & metadata (NO passwords)
 * - collectorProfile: Cached profile details of the collector
 * - wasteLots: Locally declared and synchronized e-waste lots
 * - cachedPrices: Benchmark prices and acceptable range caches
 * - cachedSafetyGuidance: Pictorial/textual e-waste sorting protocols
 * - syncQueue: Offline creation queue with idempotency keys
 */
import Dexie from 'dexie';

export const db = new Dexie('EcoLinkDB');

// Database Schema Version 1
db.version(1).stores({
  collectorSession: 'id, userId, role, expiresAt',
  collectorProfile: 'id, userId, phone',
  wasteLots: 'localId, serverId, lot_id, collectorId, category, syncStatus, createdAt',
  cachedPrices: 'category, lastUpdated',
  cachedSafetyGuidance: 'category, lastUpdated',
  syncQueue: '++id, localId, type, status, createdAt'
});

export default db;
