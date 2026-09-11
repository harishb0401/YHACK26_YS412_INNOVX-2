# EcoLink Offline-First Collector Experience Walkthrough

## Summary of Changes
We have implemented a production-grade, offline-first workflow specifically designed for E-Waste Collectors in the EcoLink web application. The implementation adheres strictly to security requirements, ensures initial online verification before permitting offline usage, integrates IndexedDB caching via Dexie.js, provides continuous network status awareness with automatic synchronization, and introduces PWA service worker capabilities.

---

## 1. Files Created & Modified

### New Services & Hooks
- [`src/services/offline/offlineDatabase.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/offline/offlineDatabase.js): Dexie.js IndexedDB instance (`EcoLinkDB`) with versioned stores: `collectorSession`, `collectorProfile`, `wasteLots`, `cachedPrices`, `cachedSafetyGuidance`, `syncQueue`.
- [`src/services/offline/networkStatus.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/offline/networkStatus.js): Reactive network monitor using `navigator.onLine` and `online`/`offline` window events, plus testing simulation capabilities.
- [`src/services/offline/offlineSession.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/offline/offlineSession.js): Safe session persistence with a 7-day expiration window, session versioning, and zero password storage.
- [`src/services/offline/syncManager.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/offline/syncManager.js): Background sync runner that detects network reconnection, processes pending queues sequentially, uses idempotent `clientOperationId` keys, and notifies UI subscribers.
- [`src/services/offline/offlineContentService.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/offline/offlineContentService.js): Price benchmark cache and safety guidance store with pre-seeding.
- [`src/hooks/useOnlineStatus.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/hooks/useOnlineStatus.js): React hook subscribing to live browser connectivity.
- [`src/hooks/useOfflineSession.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/hooks/useOfflineSession.js): React hook evaluating `AUTHENTICATED_ONLINE`, `AUTHENTICATED_OFFLINE`, `NOT_AUTHENTICATED`, and `SESSION_EXPIRED`.
- [`src/components/OfflineIndicator.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/components/OfflineIndicator.jsx): Status pill in navigation bar displaying Online (🟢), Offline (🟠), Syncing (🔄), and pending record counts with quick simulation controls.
- [`public/manifest.json`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/public/manifest.json): Progressive Web App manifest.
- [`public/sw.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/public/sw.js): Service Worker providing app-shell caching, asset caching, and security exclusions for auth endpoints.

### Modified Files
- [`src/services/authService.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/authService.js): Caches collector session on successful online login/registration, preserves credentials if offline during session verification, and clears offline session on logout.
- [`src/services/wasteService.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/services/wasteService.js): Directly saves lot to IndexedDB with `syncStatus = 'pending'` when offline; merges local pending lots with server lots.
- [`src/components/Layout/CollectorLayout.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/components/Layout/CollectorLayout.jsx): Permits offline authenticated collectors to access dashboard/routes, shows required message when unauthenticated offline ("Internet connection is required for your first login"), and alerts when offline session has expired.
- [`src/components/Navbar/Navbar.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/components/Navbar/Navbar.jsx): Mounts `<OfflineIndicator />` in desktop toolbar and mobile drawer.
- [`src/pages/collector/RegisterWaste.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/pages/collector/RegisterWaste.jsx): Offline pricing banner with timestamp (`Offline price — last updated: [time]`), offline notification on submit (`Saved offline. It will sync automatically when internet connection returns.`), and offline cached safety guidance.
- [`src/pages/collector/MyRequests.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/pages/collector/MyRequests.jsx): Displays sync summary banner (`X records waiting to sync` / `All records synced`) and sync badges (`✓ Synced`, `🟠 Pending sync`, `❌ Sync failed`) on cards and table rows.
- [`src/pages/collector/CollectorDashboard.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/pages/collector/CollectorDashboard.jsx): Displays sync status tags on recent declared lot cards.
- [`src/components/Auth/LoginForm.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/components/Auth/LoginForm.jsx): Detects existing offline collector sessions and warns users attempting unauthenticated offline login.
- [`server/controllers/wasteController.js`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/server/controllers/wasteController.js): Implemented backend idempotency via `clientOperationId` to safely prevent duplicate lot creation upon sync retries.
- [`src/App.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/App.jsx): Subscribes to sync completion events and merges offline lot creation.
- [`src/main.jsx`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/src/main.jsx): Registers PWA service worker and pre-seeds offline database.
- [`index.html`](file:///c:/Project/YHACK26/YHACK26_YS412_INNOVX-2/index.html): Links `/manifest.json` and sets theme color.

---

## 2. Architecture & Data Flow

```
+-----------------------------------------------------------------------------------+
|                                FIRST LOGIN (ONLINE)                               |
|                                                                                   |
|  Collector enters credentials -> Server Auth (/api/auth/login)                    |
|             |                                                                     |
|             v                                                                     |
|    Auth Succeeds -> JWT in localStorage + Collector Session in IndexedDB (EcoLinkDB)|
|             |                                                                     |
|             v                                                                     |
|     Collector Dashboard Loaded + Benchmark Prices & Safety Guidelines Cached     |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             OFFLINE MODE (NO INTERNET)                            |
|                                                                                   |
|  Collector opens EcoLink:                                                         |
|  1. Service Worker serves App Shell from Cache                                    |
|  2. Layout checks IndexedDB: Valid prior session found?                           |
|     - YES -> Allow Collector Workspace (AUTHENTICATED_OFFLINE)                    |
|     - NO  -> "Internet connection is required for your first login."             |
|  3. Collector declares e-waste:                                                   |
|     - Uses offline cached benchmark rates (marked with last updated time)        |
|     - Views cached safety guidelines                                             |
|     - Generates client UUID (LOT-OFFLINE-<timestamp>-<hash>)                      |
|     - Saves to IndexedDB with syncStatus = "pending"                             |
|     - Alert: "Saved offline. It will sync automatically when connection returns." |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             AUTOMATIC RECONNECTION & SYNC                         |
|                                                                                   |
|  Browser fires 'online' event:                                                    |
|  1. syncManager reads pending queue from IndexedDB                                |
|  2. Sends records to /api/waste with clientOperationId                            |
|  3. Backend verifies idempotency (prevents duplicate records)                     |
|  4. On 200/201 success: mark local record as SYNCED, store server ID              |
|  5. UI indicator updates from "🟠 X pending" to "✓ All records synced"           |
+-----------------------------------------------------------------------------------+
```

---

## 3. How to Test

### Test 1: First Online Login & Session Creation
1. Navigate to `http://localhost:3000/login`.
2. Click **Collector →** under "Instant Demo Login" (or enter `demo.collector@example.com` / `EcoLink@2026`).
3. You will be authenticated online and redirected to `/collector/dashboard`.
4. The system automatically initializes your offline session in IndexedDB (`EcoLinkDB`).

### Test 2: Simulating Offline Mode
1. Click the status pill in the top navigation bar (currently showing **🟢 Online**).
2. In the dropdown, click **Simulate Offline Mode (Test)** (or toggle "Offline" in Chrome DevTools Network tab).
3. Notice:
   - Status changes to **🟠 Offline**.
   - An amber notification bar appears at the top of the Collector layout.

### Test 3: Creating Waste Lot Offline
1. While simulated offline, click **Register E-Waste** in the navigation or dashboard.
2. Select **Mobile / Small Electronics** or **Lithium / Lead Batteries**.
3. Notice:
   - The pricing engine displays: `Offline price — last updated: [time] (IndexedDB Cached Rate)`.
   - Click **View Safety Guidance** to verify that handling Do's and Don'ts load from local cache.
4. Enter `15` kg and submit the request.
5. Notice:
   - Alert modal displays: `"Saved offline. It will sync automatically when internet connection returns."`
   - You are redirected to `/collector/requests`.
   - The new record appears immediately with a **🟠 Pending sync** badge.
   - The top banner shows: `"1 record waiting to sync"`.
   - The navbar pill displays: `🟠 Offline • 1 pending`.

### Test 4: Automatic Synchronization on Reconnect
1. Click the navbar status pill and click **Disable Offline Simulation** (or disable offline in DevTools).
2. The browser automatically fires the `online` event.
3. Within 1.5 seconds, the background `syncManager` picks up the pending lot, sends it to the backend API with the client operation ID, and assigns a server ID.
4. The banner dynamically switches to: **`✓ All records synced`**.
5. The request badge updates to **`✓ Synced`**.

### Test 5: Offline Unauthenticated Protection
1. Log out.
2. Simulate Offline Mode.
3. Attempt to access `http://localhost:3000/collector/dashboard`.
4. You are presented with the exact required notice:
   > **Internet Connection Required**
   > *Internet connection is required for your first login.*
   > [ Retry Connection ]
