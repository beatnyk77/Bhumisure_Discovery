-- Row Level Security Policies

ALTER TABLE listings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_jobs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_events  ENABLE ROW LEVEL SECURITY;
ALTER TABLE localities      ENABLE ROW LEVEL SECURITY;

-- =====================
-- LISTINGS policies
-- =====================

-- Public: read active + expiring_soon listings
CREATE POLICY "public_read_active_listings"
  ON listings FOR SELECT
  USING (status IN ('active', 'expiring_soon'));

-- Brokers: update/view own listings
CREATE POLICY "broker_select_own_listings"
  ON listings FOR SELECT
  USING (broker_id = auth.uid());

CREATE POLICY "broker_update_own_listings"
  ON listings FOR UPDATE
  USING (broker_id = auth.uid());

-- Admin: full access (via service role key, bypasses RLS)
-- No policy needed — service role bypasses all RLS automatically.

-- =====================
-- BROKERS policies
-- =====================
CREATE POLICY "broker_read_own_profile"
  ON brokers FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "broker_update_own_profile"
  ON brokers FOR UPDATE
  USING (auth_user_id = auth.uid());

-- =====================
-- LOCALITIES policies
-- =====================
-- Anyone can read localities (needed for search filters)
CREATE POLICY "public_read_localities"
  ON localities FOR SELECT
  USING (true);

-- =====================
-- ENQUIRY EVENTS policies
-- =====================
-- Anyone can insert (anonymous enquiry tracking)
CREATE POLICY "public_insert_enquiry"
  ON enquiry_events FOR INSERT
  WITH CHECK (true);
