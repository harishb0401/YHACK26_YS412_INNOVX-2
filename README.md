# Eco-Link: Circular E-Waste Management & Material Recovery Platform

Eco-Link is a transparent, auditable digital marketplace and regulatory compliance platform connecting informal scrap collectors, CPCB-verified recyclers, and state environmental authorities (CPCB/TNPCB).

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│               React + Vite Frontend                   │
│ (src/services/api.js + Context + Protected Route Guard)│
└─────────────────────────┬──────────────────────────────┘
                          │ REST API (JSON / Bearer JWT)
                          ▼
┌────────────────────────────────────────────────────────┐
│            Node.js + Express.js Server                 │
│  - Helmet, Strict CORS (CLIENT_URL), Rate-Limiter      │
│  - Auth Middleware (JWT Verification)                  │
│  - Role Middleware (collector / recycler / admin)      │
│  - Centralized Error & Validation Middleware           │
│  - Deterministic Pricing & Matching Services           │
│  - Transaction & Verification Services                 │
└─────────────────────────┬──────────────────────────────┘
                          │ Supabase JS Client (Service Role Key)
                          ▼
┌────────────────────────────────────────────────────────┐
│              Supabase PostgreSQL Database              │
│  - profiles (bcrypt hashes, role, location)            │
│  - recycler_profiles (CPCB status, capacity, bounds)   │
│  - waste_lots (lot_id, quantity, pricing, status, QR)  │
│  - offers (rates, price status, distance, status)      │
│  - transactions (simulated escrow, QR signature)       │
│  - verification_records (CPCB audit logs, status)      │
│  - lot_timeline (audit event ledger)                   │
│  - Atomic RPC Function (accept_offer_atomic)           │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features & Capabilities

1. **Deterministic Rules & Pricing Engine**:
   - Classifies e-waste across 10 structured categories (PCBs, Copper, Aluminium, Batteries, Computers, etc.).
   - Authoritatively calculates benchmark scrap rates and fair price bands ($\text{Benchmark} \pm 25\%$).
   - Flags predatory below-band bids or excessive quotes with real-time feedback.

2. **Collector Request Flow & GPS Geolocation**:
   - Collectors declare volume, condition, and storage hubs.
   - Built-in `Detect My Location` GPS feature using the Browser Geolocation API.
   - Generates unique lot IDs (`REQ-2026-XXXXXX`) and secure QR verification payloads.

3. **Recycler Matching & Haversine Distance Engine**:
   - Filters lots based on CPCB verification status and accepted categories.
   - Calculates real geographic distance (in kilometers) between collector hubs and recycler recovery facilities using the Haversine formula.

4. **Atomic Offer Acceptance & Simulated Escrow**:
   - When a collector accepts an offer, an atomic multi-table operation occurs:
     - The selected offer is marked `ACCEPTED`.
     - All competing offers on that lot are marked `REJECTED`.
     - The waste lot updates to `OFFER_ACCEPTED`.
     - A transaction record is created with `ESCROW_LOCKED` status.
     - Traceability timeline logs are inserted.

5. **State Regulatory Administration (CPCB/TNPCB)**:
   - Live dashboard metrics computed directly from PostgreSQL tables.
   - Approval and rejection workflow for recycler facility CPCB licenses.
   - Audit trail tracking in `verification_records`.

6. **Bilingual & Responsive Interface**:
   - Seamless English and Tamil (`தமிழ்`) localization.
   - Tailored green/sand palette with accessible typography.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new Collector or Recycler | Public |
| `POST` | `/api/auth/login` | Login with email/phone & password | Public |
| `GET` | `/api/auth/me` | Get current authenticated user profile | Bearer JWT |
| `POST` | `/api/auth/logout` | Clear session | Public |

### Waste Lots (`/api/waste`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/waste` | Create e-waste request manifest | Collector |
| `GET` | `/api/waste/my` | Retrieve active collector's declared lots | Collector |
| `GET` | `/api/waste/available` | Browse open lots matched to recycler | Recycler / Admin |
| `GET` | `/api/waste/:lotId` | Get lot manifest & timeline details | Any Authenticated |
| `GET` | `/api/waste/:lotId/offers` | View incoming bids for a specific lot | Lot Owner / Admin |
| `POST` | `/api/waste/:lotId/cancel` | Cancel an active waste request | Lot Owner / Admin |

### Offers (`/api/offers`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/offers` | Submit price bid on an open lot | Verified Recycler |
| `GET` | `/api/offers/my` | View submitted bids & status | Recycler |
| `POST` | `/api/offers/:offerId/accept` | Accept bid (Atomic escrow lock) | Lot Owner / Admin |

### Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions/my` | View user's simulated escrow transactions | Authenticated |
| `GET` | `/api/transactions/:transactionId` | View transaction receipt & QR signature | Involved Parties / Admin |

### State Regulatory Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Live platform KPIs & statistics | Admin |
| `GET` | `/api/admin/collectors` | List registered scrap collectors | Admin |
| `GET` | `/api/admin/recyclers` | List authorized recycling facilities | Admin |
| `GET` | `/api/admin/verifications` | Pending CPCB approvals & flagged bids | Admin |
| `POST` | `/api/admin/recyclers/:id/verify` | Approve recycler CPCB credentials | Admin |
| `POST` | `/api/admin/recyclers/:id/reject` | Reject recycler application | Admin |
| `GET` | `/api/admin/transactions` | Global transaction manifest | Admin |
| `POST` | `/api/admin/offers/:id/cancel` | Cancel rule-flagged abnormal offer | Admin |

### Pricing (`/api/pricing`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/pricing/validate-quote` | Validate rate against ±25% fair bounds | Public |
| `GET` | `/api/pricing/categories` | Reference benchmark price list | Public |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Supabase account ([https://supabase.com](https://supabase.com))

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/harishb0401/YHACK26_YS412_INNOVX-2.git
cd YHACK26_YS412_INNOVX-2
npm install
```

### 2. Configure Database Schema
1. Open your Supabase Project > **SQL Editor**.
2. Run [`supabase/schema.sql`](supabase/schema.sql).

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=ecolink-production-jwt-super-secret-key-2026
CLIENT_URL=http://localhost:5173
```

### 4. Seed Demo Data
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 👤 Demo Accounts

| Role | Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **Collector** | `demo.collector@example.com` | `EcoLink@2026` | Active |
| **Recycler** | `demo.recycler@example.com` | `EcoLink@2026` | CPCB Verified |
| **Recycler** | `pending.recycler@example.com` | `EcoLink@2026` | CPCB Pending |
| **Admin** | `demo.admin@example.com` | `EcoLink@2026` | Master Regulatory |

---

## 🛡️ Security Architecture
- **No Client-Side Service Keys**: The Supabase service-role key exists exclusively on the Express backend and is never sent to the browser.
- **bcrypt Password Hashing**: Plaintext passwords are never stored in the database.
- **Role Enforcement**: Route-level middleware prevents privilege escalation (e.g., collectors accessing `/admin`).
- **Input Sanitization & Validation**: Powered by `express-validator` and `helmet`.