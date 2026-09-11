# Eco-Link Supabase PostgreSQL Setup Guide

This guide provides step-by-step instructions to configure and run the Eco-Link PostgreSQL database on Supabase with the Node.js + Express backend.

---

## 1. Create a Supabase Project

1. Navigate to [https://supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**.
3. Enter your project details:
   - **Name**: `Eco-Link` (or any preferred name)
   - **Database Password**: Choose a secure password (save this securely)
   - **Region**: Choose the region closest to your users (e.g., `ap-south-1` / Mumbai / Singapore)
4. Click **Create new project** and wait a moment for the database to be provisioned.

---

## 2. Execute the Database Schema

1. In the Supabase Dashboard sidebar, click on the **SQL Editor** icon (`>_`).
2. Click **New query**.
3. Open the file [`supabase/schema.sql`](file:///d:/YHACK26_YS412_INNOVX-2/supabase/schema.sql) from this repository.
4. Copy all of the SQL content and paste it into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl + Enter` / `Cmd + Enter`).
6. Verify that the following tables and RPC function are successfully created:
   - `profiles`
   - `recycler_profiles`
   - `waste_lots`
   - `offers`
   - `transactions`
   - `verification_records`
   - `lot_timeline`
   - `accept_offer_atomic` (Stored Procedure Function)

---

## 3. Retrieve Server Credentials

1. In your Supabase Dashboard, click on **Project Settings** (gear icon) > **API**.
2. Copy the following two configuration values:
   - **Project URL**: (e.g. `https://xyzproject.supabase.co`)
   - **service_role key (secret)**: Click reveal and copy the secret key.

> [!CAUTION]
> The **service_role key** bypasses Row Level Security and is intended **STRICTLY for the Node.js/Express server**. 
> Never commit this key to version control or expose it to the React/Vite frontend.

---

## 4. Configure Server Environment (`.env`)

1. In the root directory of the project, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   JWT_SECRET=ecolink-production-jwt-super-secret-key-2026
   CLIENT_URL=http://localhost:5173
   ```

---

## 5. Seed Demo Accounts & Reference Data

Run the automated seed script to populate demo users, lots, and offers:
```bash
npm run seed
```

This creates the following demo accounts:
| Role | Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **Collector** | `demo.collector@example.com` | `EcoLink@2026` | Active |
| **Recycler** | `demo.recycler@example.com` | `EcoLink@2026` | CPCB Verified |
| **Recycler** | `pending.recycler@example.com` | `EcoLink@2026` | CPCB Pending |
| **Admin** | `demo.admin@example.com` | `EcoLink@2026` | Master Regulatory |

---

## 6. Run the Application

Start both the Express backend and Vite frontend concurrently:
```bash
npm run dev
```

- **Backend API**: `http://localhost:5000/api`
- **Frontend App**: `http://localhost:5173`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 7. End-to-End Workflow Verification

1. **Collector Login**: Login as `demo.collector@example.com` or create a new collector account.
2. **Create Request**: Navigate to *Create E-Waste Request*, select category, test GPS "Detect My Location", review the live benchmark price range, and submit.
3. **Recycler Login**: Open a new browser tab/incognito window, log in as `demo.recycler@example.com`.
4. **Submit Offer**: Browse *Available Collector Requests*, open the lot, and submit a competitive price bid.
5. **Accept Offer**: Back in the Collector portal (*My Requests*), view incoming bids and click **Accept Offer**.
6. **Verify Escrow & Transaction**: Observe the atomic status update to `OFFER_ACCEPTED`, simulated escrow lock, and receipt QR generation.
7. **Admin Oversight**: Log in as `demo.admin@example.com`, inspect real-time dashboard KPIs, and approve pending recyclers.
