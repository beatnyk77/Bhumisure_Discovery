-- Enable extensions (gen_random_uuid is built-in on Supabase Postgres 15+)
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;

-- =====================
-- LOCALITIES
-- =====================
CREATE TABLE localities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,       -- e.g. 'vijay_nagar'
  name        TEXT NOT NULL,              -- e.g. 'Vijay Nagar'
  city        TEXT NOT NULL DEFAULT 'indore',
  zone        TEXT,                       -- e.g. 'West Indore'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- BROKERS
-- =====================
CREATE TABLE brokers (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id     UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name             TEXT,
  phone            TEXT UNIQUE NOT NULL,  -- E.164 normalised
  instagram_handle TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- LISTINGS
-- =====================
CREATE TYPE property_type_enum AS ENUM ('1BHK','2BHK','3BHK','PG','Studio','Room');
CREATE TYPE furnishing_enum    AS ENUM ('Bare','Semi','Full');
CREATE TYPE tenant_type_enum   AS ENUM ('Family','Bachelor','Girls','Boys','Any');
CREATE TYPE listing_status_enum AS ENUM ('draft','active','expiring_soon','expired','rented','archived');
CREATE TYPE listing_source_enum AS ENUM ('operator_ingestion','broker_native','user_submitted');

CREATE TABLE listings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Source
  reel_url          TEXT UNIQUE NOT NULL,
  instagram_handle  TEXT,
  source            listing_source_enum NOT NULL DEFAULT 'operator_ingestion',

  -- Property fields
  property_type     property_type_enum NOT NULL,
  locality_id       UUID REFERENCES localities(id),
  locality_slug     TEXT NOT NULL,
  rent_monthly      INTEGER NOT NULL,         -- INR
  furnishing        furnishing_enum,
  floor             INTEGER,                  -- 0 = Ground
  amenities         TEXT[] DEFAULT '{}',
  preferred_tenant  tenant_type_enum DEFAULT 'Any',
  available_from    DATE,

  -- Broker contact
  broker_id         UUID REFERENCES brokers(id) ON DELETE SET NULL,
  broker_name       TEXT NOT NULL,
  broker_phone      TEXT NOT NULL,
  broker_instagram  TEXT,

  -- Media
  thumbnail_url     TEXT,                     -- stored in Supabase Storage

  -- Lifecycle
  status            listing_status_enum NOT NULL DEFAULT 'draft',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  expiry_date       DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '45 days'),
  last_verified_at  TIMESTAMPTZ,
  rented_at         TIMESTAMPTZ,
  days_to_rent      INTEGER,

  -- Dedup
  structural_hash   TEXT,     -- locality + bhk + broker  (Loose)
  listing_hash      TEXT,     -- locality + bhk + broker + rent_bucket  (Strict)

  -- AI metadata
  confidence_score  INTEGER CHECK (confidence_score BETWEEN 0 AND 100),
  price_history     JSONB DEFAULT '[]',

  -- Analytics
  view_count        INTEGER DEFAULT 0,
  enquiry_count     INTEGER DEFAULT 0
);

-- Indexes for search
CREATE INDEX idx_listings_status         ON listings(status);
CREATE INDEX idx_listings_locality_slug  ON listings(locality_slug);
CREATE INDEX idx_listings_property_type  ON listings(property_type);
CREATE INDEX idx_listings_rent           ON listings(rent_monthly);
CREATE INDEX idx_listings_expiry         ON listings(expiry_date);
CREATE INDEX idx_listings_structural_hash ON listings(structural_hash);
CREATE INDEX idx_listings_listing_hash    ON listings(listing_hash);
CREATE INDEX idx_listings_broker_phone    ON listings(broker_phone);

-- Full-text search index
CREATE INDEX idx_listings_fts ON listings
  USING GIN (to_tsvector('english', coalesce(broker_name,'') || ' ' || coalesce(locality_slug,'')));

-- =====================
-- INGESTION JOBS
-- =====================
CREATE TYPE ingestion_status_enum AS ENUM (
  'pending','processing','partial_success','failed','completed'
);

CREATE TABLE ingestion_jobs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_url      TEXT NOT NULL,
  status        ingestion_status_enum NOT NULL DEFAULT 'pending',
  progress      INTEGER DEFAULT 0,  -- 0-100
  step_label    TEXT,               -- e.g. 'transcribing'
  result        JSONB,              -- extracted fields on success
  error_log     TEXT,               -- last error message
  retry_count   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  listing_id    UUID REFERENCES listings(id) ON DELETE SET NULL  -- set after commit
);

CREATE INDEX idx_ingestion_jobs_status ON ingestion_jobs(status);
CREATE INDEX idx_ingestion_jobs_created ON ingestion_jobs(created_at DESC);

-- =====================
-- LISTING EVENTS (audit log)
-- =====================
CREATE TABLE listing_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,   -- e.g. 'status_changed', 'price_updated', 'renewed'
  payload     JSONB,
  actor_id    UUID,            -- auth.users id or null for system
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listing_events_listing ON listing_events(listing_id, created_at DESC);

-- =====================
-- ENQUIRY EVENTS (analytics)
-- =====================
CREATE TABLE enquiry_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,  -- 'call_tap' | 'whatsapp_tap' | 'save'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enquiry_events_listing ON enquiry_events(listing_id);
