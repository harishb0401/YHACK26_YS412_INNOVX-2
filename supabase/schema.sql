-- ====================================================================
-- ECO-LINK POSTGRESQL DATABASE SCHEMA FOR SUPABASE
-- Transparent, auditable, and regulatory compliant e-waste infrastructure
-- ====================================================================

-- 1. Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing tables if needed (in reverse dependency order)
DROP TABLE IF EXISTS lot_timeline CASCADE;
DROP TABLE IF EXISTS verification_records CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS waste_lots CASCADE;
DROP TABLE IF EXISTS recycler_profiles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ====================================================================
-- 2. PROFILES TABLE
-- ====================================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('collector', 'recycler', 'admin')),
    address TEXT,
    location_text TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 3. RECYCLER PROFILES TABLE
-- ====================================================================
CREATE TABLE recycler_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    organization_name TEXT NOT NULL,
    registration_number TEXT,
    cpcb_registration_number TEXT,
    cpcb_status TEXT DEFAULT 'PENDING' CHECK (cpcb_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    accepted_categories JSONB DEFAULT '[]'::jsonb,
    monthly_capacity NUMERIC DEFAULT 0,
    monthly_used NUMERIC DEFAULT 0,
    location_text TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_recycler UNIQUE (user_id)
);

-- ====================================================================
-- 4. WASTE LOTS TABLE
-- ====================================================================
CREATE TABLE waste_lots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id TEXT UNIQUE NOT NULL,
    collector_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    material_type TEXT,
    description TEXT,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    unit TEXT DEFAULT 'kg',
    condition TEXT,
    notes TEXT,
    location_text TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    benchmark_price NUMERIC,
    lower_price NUMERIC,
    upper_price NUMERIC,
    estimated_value NUMERIC,
    status TEXT DEFAULT 'AWAITING_OFFERS' CHECK (status IN (
        'AWAITING_OFFERS',
        'OFFERS_RECEIVED',
        'OFFER_ACCEPTED',
        'PICKUP_SCHEDULED',
        'COLLECTED',
        'COMPLETED',
        'CANCELLED'
    )),
    selected_offer_id UUID,
    accepted_recycler_id UUID REFERENCES profiles(id),
    pickup_date TIMESTAMPTZ,
    qr_payload TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 5. OFFERS TABLE
-- ====================================================================
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id TEXT UNIQUE NOT NULL,
    lot_id UUID REFERENCES waste_lots(id) ON DELETE CASCADE,
    recycler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rate_per_kg NUMERIC NOT NULL CHECK (rate_per_kg > 0),
    total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
    pickup_date TIMESTAMPTZ,
    benchmark_price NUMERIC,
    lower_limit NUMERIC,
    upper_limit NUMERIC,
    price_status TEXT CHECK (price_status IN ('FAIR', 'BELOW_FAIR_RANGE', 'ABOVE_FAIR_RANGE')),
    distance_km NUMERIC,
    notes TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foreign key link for waste_lots.selected_offer_id
ALTER TABLE waste_lots
    ADD CONSTRAINT fk_selected_offer
    FOREIGN KEY (selected_offer_id)
    REFERENCES offers(id)
    ON DELETE SET NULL;

-- ====================================================================
-- 6. TRANSACTIONS TABLE
-- ====================================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT UNIQUE NOT NULL,
    lot_id UUID REFERENCES waste_lots(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    collector_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    recycler_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    rate_per_kg NUMERIC,
    weight NUMERIC,
    payment_status TEXT DEFAULT 'ESCROW_LOCKED' CHECK (payment_status IN ('ESCROW_LOCKED', 'PAID', 'CANCELLED')),
    receipt_id TEXT,
    qr_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 7. VERIFICATION RECORDS TABLE
-- ====================================================================
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recycler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    registration_number TEXT,
    cpcb_registration_number TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 8. LOT TIMELINE TABLE
-- ====================================================================
CREATE TABLE lot_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lot_id UUID REFERENCES waste_lots(id) ON DELETE CASCADE,
    event TEXT NOT NULL CHECK (event IN (
        'CREATED',
        'CLASSIFIED',
        'OFFERS_RECEIVED',
        'OFFER_ACCEPTED',
        'PICKUP_SCHEDULED',
        'COLLECTED',
        'COMPLETED',
        'CANCELLED'
    )),
    role TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 9. PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_recycler_profiles_user_id ON recycler_profiles(user_id);
CREATE INDEX idx_recycler_profiles_cpcb_status ON recycler_profiles(cpcb_status);
CREATE INDEX idx_waste_lots_lot_id ON waste_lots(lot_id);
CREATE INDEX idx_waste_lots_collector_id ON waste_lots(collector_id);
CREATE INDEX idx_waste_lots_status ON waste_lots(status);
CREATE INDEX idx_waste_lots_category ON waste_lots(category);
CREATE INDEX idx_offers_offer_id ON offers(offer_id);
CREATE INDEX idx_offers_lot_id ON offers(lot_id);
CREATE INDEX idx_offers_recycler_id ON offers(recycler_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_price_status ON offers(price_status);
CREATE INDEX idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX idx_transactions_collector_id ON transactions(collector_id);
CREATE INDEX idx_transactions_recycler_id ON transactions(recycler_id);
CREATE INDEX idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX idx_verification_records_recycler_id ON verification_records(recycler_id);
CREATE INDEX idx_verification_records_status ON verification_records(status);
CREATE INDEX idx_lot_timeline_lot_id ON lot_timeline(lot_id);

-- ====================================================================
-- 10. ATOMIC OFFER ACCEPTANCE RPC FUNCTION
-- ====================================================================
CREATE OR REPLACE FUNCTION accept_offer_atomic(
    p_collector_id UUID,
    p_offer_id UUID,
    p_lot_id UUID,
    p_transaction_id TEXT,
    p_receipt_id TEXT,
    p_qr_signature TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_lot RECORD;
    v_offer RECORD;
    v_recycler RECORD;
    v_transaction RECORD;
BEGIN
    -- 1. Check lot existence and ownership
    SELECT * INTO v_lot FROM waste_lots WHERE id = p_lot_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Waste lot not found';
    END IF;

    IF v_lot.collector_id != p_collector_id THEN
        RAISE EXCEPTION 'Unauthorized: You do not own this waste lot';
    END IF;

    IF v_lot.status NOT IN ('AWAITING_OFFERS', 'OFFERS_RECEIVED') THEN
        RAISE EXCEPTION 'Waste lot is not accepting offers at this stage';
    END IF;

    -- 2. Check offer existence and status
    SELECT * INTO v_offer FROM offers WHERE id = p_offer_id AND lot_id = p_lot_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Offer not found for this waste lot';
    END IF;

    IF v_offer.status != 'PENDING' THEN
        RAISE EXCEPTION 'Offer is not in PENDING status';
    END IF;

    -- 3. Mark selected offer as ACCEPTED
    UPDATE offers
    SET status = 'ACCEPTED', updated_at = NOW()
    WHERE id = p_offer_id;

    -- 4. Mark all other competing offers on this lot as REJECTED
    UPDATE offers
    SET status = 'REJECTED', updated_at = NOW()
    WHERE lot_id = p_lot_id AND id != p_offer_id AND status = 'PENDING';

    -- 5. Update waste lot
    UPDATE waste_lots
    SET 
        status = 'OFFER_ACCEPTED',
        selected_offer_id = p_offer_id,
        accepted_recycler_id = v_offer.recycler_id,
        pickup_date = v_offer.pickup_date,
        updated_at = NOW()
    WHERE id = p_lot_id;

    -- 6. Create simulated escrow transaction
    INSERT INTO transactions (
        transaction_id,
        lot_id,
        offer_id,
        collector_id,
        recycler_id,
        amount,
        rate_per_kg,
        weight,
        payment_status,
        receipt_id,
        qr_signature
    ) VALUES (
        p_transaction_id,
        p_lot_id,
        p_offer_id,
        p_collector_id,
        v_offer.recycler_id,
        v_offer.total_amount,
        v_offer.rate_per_kg,
        v_lot.quantity,
        'ESCROW_LOCKED',
        p_receipt_id,
        p_qr_signature
    ) RETURNING * INTO v_transaction;

    -- 7. Add timeline events
    INSERT INTO lot_timeline (lot_id, event, role, details)
    VALUES 
        (p_lot_id, 'OFFER_ACCEPTED', 'collector', 'Collector accepted offer of ₹' || v_offer.rate_per_kg || '/kg (Total: ₹' || v_offer.total_amount || ')'),
        (p_lot_id, 'PICKUP_SCHEDULED', 'system', 'Simulated Escrow locked and pickup scheduled for ' || COALESCE(TO_CHAR(v_offer.pickup_date, 'YYYY-MM-DD HH24:MI'), 'upcoming date'));

    RETURN jsonb_build_object(
        'success', true,
        'lot_id', p_lot_id,
        'offer_id', p_offer_id,
        'transaction_id', v_transaction.id,
        'payment_status', 'ESCROW_LOCKED'
    );
END;
$$;
