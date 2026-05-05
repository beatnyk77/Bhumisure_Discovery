# BhumiSure — Full System Architecture
### Next.js + Supabase + Claude Code + MCP Stack
> **Stack:** Next.js 14 (App Router) · Supabase (DB + Auth + Realtime) · Claude Code · Antigravity IDE · MCP Servers

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Full File & Folder Structure](#2-full-file--folder-structure)
3. [Layer-by-Layer Breakdown](#3-layer-by-layer-breakdown)
   - 3.1 [Frontend — Next.js App Router](#31-frontend--nextjs-app-router)
   - 3.2 [API Layer — Route Handlers](#32-api-layer--route-handlers)
   - 3.3 [AI Ingestion Pipeline](#33-ai-ingestion-pipeline)
   - 3.4 [Database — Supabase / Postgres](#34-database--supabase--postgres)
   - 3.5 [Auth — Supabase Auth](#35-auth--supabase-auth)
   - 3.6 [Background Jobs & Lifecycle Engine](#36-background-jobs--lifecycle-engine)
   - 3.7 [MCP Server Integration](#37-mcp-server-integration)
4. [State Management](#4-state-management)
5. [Service Connection Map](#5-service-connection-map)
6. [Data Flow Diagrams](#6-data-flow-diagrams)
   - 6.1 [Reel Ingestion Flow](#61-reel-ingestion-flow)
   - 6.2 [Renter Search Flow](#62-renter-search-flow)
   - 6.3 [Listing Lifecycle Flow](#63-listing-lifecycle-flow)
7. [Environment Variables](#7-environment-variables)
8. [Claude Code + MCP Dev Workflow](#8-claude-code--mcp-dev-workflow)
9. [Supabase Schema — Full SQL](#9-supabase-schema--full-sql)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BHUMISURE SYSTEM                            │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   RENTER     │    │   BROKER /   │    │   INTERNAL OPS       │  │
│  │  (Web/PWA)   │    │  LANDLORD    │    │   (Admin Dashboard)  │  │
│  └──────┬───────┘    └──────┬───────┘    └──────────┬───────────┘  │
│         │                  │                        │              │
│  ───────┼──────────────────┼────────────────────────┼────────────  │
│         │        NEXT.JS 14 APP ROUTER (Vercel)      │              │
│  ───────┼──────────────────┼────────────────────────┼────────────  │
│         │                  │                        │              │
│  ┌──────▼──────────────────▼────────────────────────▼───────────┐  │
│  │               API ROUTE HANDLERS (/api/*)                    │  │
│  │   search · listings · ingest · lifecycle · auth · webhooks   │  │
│  └──────────────────────────┬────────────────────────────────────┘  │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                  │
│  ┌──────▼──────┐   ┌────────▼───────┐   ┌───────▼──────┐         │
│  │  SUPABASE   │   │  AI INGESTION  │   │  BACKGROUND  │         │
│  │  DB + Auth  │   │   PIPELINE     │   │     JOBS     │         │
│  │  Realtime   │   │  (Whisper +    │   │  (Lifecycle  │         │
│  │  Storage    │   │   GPT-4o +     │   │   Engine)    │         │
│  │             │   │   Claude)      │   │              │         │
│  └─────────────┘   └────────────────┘   └──────────────┘         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    MCP SERVERS                              │   │
│  │   supabase-mcp · whatsapp-mcp · openai-mcp · vercel-mcp    │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **App Router only** — no Pages Router. Every route is a Server Component by default; opt into `"use client"` explicitly.
- **Supabase is the single source of truth** — DB, Auth, Realtime, and Storage all from one provider. Zero infrastructure management for MVP.
- **AI pipeline is async** — ingestion is a job queue, not a synchronous API call. UI polls for status.
- **MCP servers power Claude Code** — Claude Code uses MCP to read/write the DB, run migrations, and deploy, meaning your AI dev assistant has full context of the system it's building.
- **State is colocated** — server state in Supabase, UI state in Zustand, form state in React Hook Form. No Redux.

---

## 2. Full File & Folder Structure

```
bhumisure/
│
├── .claude/                          # Claude Code configuration
│   ├── settings.json                 # MCP server declarations for this project
│   └── commands/                     # Custom slash commands for Claude Code
│       ├── ingest-reel.md            # /ingest-reel — ingests a reel URL end-to-end
│       ├── add-locality.md           # /add-locality — adds a locality to the dictionary
│       └── expire-listings.md        # /expire-listings — manually triggers lifecycle job
│
├── .env.local                        # Local secrets (never committed)
├── .env.example                      # Template — all required vars documented
│
├── next.config.ts                    # Next.js config: image domains, env vars, redirects
├── tailwind.config.ts                # Design tokens: colours, fonts, spacing
├── tsconfig.json
├── package.json
│
├── supabase/                         # Supabase local dev + migrations
│   ├── config.toml                   # Local Supabase instance config
│   ├── seed.sql                      # Dev seed data — 20 sample Indore listings
│   └── migrations/
│       ├── 001_initial_schema.sql    # Core tables: listings, brokers, localities
│       ├── 002_dedup_system.sql      # dedup_hashes table + trigger functions
│       ├── 003_lifecycle_system.sql  # status enum, expiry logic, price_history
│       ├── 004_search_index.sql      # Full-text search index + pg_trgm extension
│       └── 005_rls_policies.sql      # Row Level Security: who can read/write what
│
├── src/
│   ├── app/                          # Next.js App Router — every folder = a route
│   │   │
│   │   ├── layout.tsx                # Root layout: fonts, providers, nav shell
│   │   ├── page.tsx                  # Homepage: hero + search bar
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   │
│   │   ├── (marketing)/              # Route group — no shared layout with app
│   │   │   ├── about/page.tsx
│   │   │   └── blog/page.tsx
│   │   │
│   │   ├── search/                   # Search results page
│   │   │   ├── page.tsx              # Server Component: fetches listings from Supabase
│   │   │   ├── loading.tsx           # Skeleton cards while data loads
│   │   │   └── error.tsx
│   │   │
│   │   ├── listing/
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Listing detail — Server Component + OG meta
│   │   │       ├── loading.tsx
│   │   │       └── opengraph-image.tsx  # Dynamic OG image per listing
│   │   │
│   │   ├── broker/                   # Broker-facing dashboard
│   │   │   ├── layout.tsx            # Broker auth guard layout
│   │   │   ├── dashboard/page.tsx    # Active listings, stats, expiry alerts
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx          # All broker listings with status
│   │   │   │   ├── new/page.tsx      # Submit new listing (reel link or manual)
│   │   │   │   └── [id]/edit/page.tsx  # Edit listing fields
│   │   │   └── claim/[listingId]/page.tsx  # Claim a listing via OTP
│   │   │
│   │   ├── admin/                    # Internal ops dashboard
│   │   │   ├── layout.tsx            # Admin auth guard (role = 'admin')
│   │   │   ├── page.tsx              # Overview: stats, pending reviews, expiry queue
│   │   │   ├── ingest/page.tsx       # Paste reel link → AI pipeline → review form
│   │   │   ├── listings/
│   │   │   │   ├── page.tsx          # All listings table with filters + bulk actions
│   │   │   │   └── [id]/page.tsx     # Single listing review + edit
│   │   │   ├── duplicates/page.tsx   # Duplicate review queue
│   │   │   └── localities/page.tsx   # Manage Indore locality dictionary
│   │   │
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # OTP login (phone number)
│   │   │   ├── callback/route.ts     # Supabase auth callback handler
│   │   │   └── logout/route.ts
│   │   │
│   │   └── api/                      # API Route Handlers
│   │       ├── listings/
│   │       │   ├── route.ts          # GET: search listings with filters
│   │       │   └── [id]/
│   │       │       ├── route.ts      # GET: single listing, PATCH: update, DELETE: archive
│   │       │       ├── claim/route.ts      # POST: initiate broker claim (sends OTP)
│   │       │       ├── verify-claim/route.ts  # POST: verify OTP → transfer ownership
│   │       │       └── lifecycle/route.ts     # POST: mark-rented, renew, reprice
│   │       │
│   │       ├── ingest/
│   │       │   ├── route.ts          # POST: submit reel URL → queue job → return job_id
│   │       │   └── [jobId]/status/route.ts  # GET: poll ingestion job status
│   │       │
│   │       ├── search/route.ts       # GET: full-text + filter search endpoint
│   │       │
│   │       ├── dedup/check/route.ts  # POST: check URL + structural hash before ingestion
│   │       │
│   │       ├── lifecycle/
│   │       │   └── cron/route.ts     # POST: Vercel cron → run expiry + nudge jobs
│   │       │
│   │       └── webhooks/
│   │           └── whatsapp/route.ts # POST: inbound WhatsApp replies (broker renewals)
│   │
│   ├── components/                   # All React components
│   │   │
│   │   ├── ui/                       # Primitive UI components (design system)
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx             # Status badges: ACTIVE, EXPIRING, RENTED
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── listing/                  # Listing-specific components
│   │   │   ├── ListingCard.tsx       # Card in search results — video thumb + key fields
│   │   │   ├── ListingDetail.tsx     # Full listing view — embedded reel + all fields
│   │   │   ├── ListingGrid.tsx       # Responsive grid wrapper
│   │   │   ├── FreshnessSignal.tsx   # "Listed 3 days ago · Verified 1 day ago"
│   │   │   ├── ContactActions.tsx    # [Call] + [WhatsApp] buttons with tracking
│   │   │   ├── ListingForm.tsx       # Create/edit form — shared by admin + broker
│   │   │   └── StatusBadge.tsx       # Active / Expiring Soon / Rented etc
│   │   │
│   │   ├── search/                   # Search UI components
│   │   │   ├── SearchBar.tsx         # Homepage hero search
│   │   │   ├── SearchFilters.tsx     # BHK, budget, locality, tenant type filters
│   │   │   ├── SearchResults.tsx     # Results list + count + sort
│   │   │   └── EmptyState.tsx        # No results — suggest alternatives
│   │   │
│   │   ├── ingest/                   # Reel ingestion UI (admin)
│   │   │   ├── ReelLinkInput.tsx     # URL paste field + submit
│   │   │   ├── IngestionStatus.tsx   # Polling progress bar: fetching → processing → ready
│   │   │   ├── AutoFilledForm.tsx    # Pre-filled form from AI — editable fields
│   │   │   └── ConfidenceIndicator.tsx  # Per-field confidence score display
│   │   │
│   │   ├── broker/
│   │   │   ├── BrokerDashboard.tsx   # Stats: views, enquiries, active listings
│   │   │   ├── ExpiryAlert.tsx       # Banner: "2 listings expire in 7 days"
│   │   │   ├── ClaimFlow.tsx         # OTP claim wizard
│   │   │   └── ListingStats.tsx      # Per-listing: views, WA taps, call taps
│   │   │
│   │   ├── admin/
│   │   │   ├── DuplicateReview.tsx   # Side-by-side duplicate comparison
│   │   │   ├── ListingsTable.tsx     # Data table with bulk actions
│   │   │   └── IngestionQueue.tsx    # Live queue of pending ingestion jobs
│   │   │
│   │   └── layout/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── Providers.tsx         # Wraps app: QueryClient, Zustand, Supabase
│   │
│   ├── lib/                          # Pure logic — no React, no side effects
│   │   │
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client (singleton)
│   │   │   ├── server.ts             # Server-side Supabase client (cookies)
│   │   │   ├── admin.ts              # Service-role client (bypasses RLS — server only)
│   │   │   └── types.ts              # Generated types from Supabase schema
│   │   │
│   │   ├── ai/
│   │   │   ├── pipeline.ts           # Orchestrator: coordinates all AI steps
│   │   │   ├── fetch-reel.ts         # Resolve URL → metadata + video buffer
│   │   │   ├── transcribe.ts         # Whisper API → raw transcript
│   │   │   ├── extract-fields.ts     # GPT-4o → structured listing JSON
│   │   │   ├── vision-analysis.ts    # GPT-4o Vision on keyframes
│   │   │   ├── resolve-locality.ts   # Fuzzy match extracted place → locality_slug
│   │   │   └── prompts.ts            # All AI prompt templates (single source of truth)
│   │   │
│   │   ├── dedup/
│   │   │   ├── hash.ts               # Generate structural fingerprint hash
│   │   │   ├── check.ts              # Run Layer 1 + Layer 2 checks vs DB
│   │   │   └── resolve.ts            # Decision logic: block | queue | create
│   │   │
│   │   ├── lifecycle/
│   │   │   ├── expire.ts             # Query expiring listings → update status
│   │   │   ├── nudge.ts              # Send WhatsApp renewal messages
│   │   │   └── events.ts             # Log lifecycle events to listing_events table
│   │   │
│   │   ├── search/
│   │   │   ├── query-builder.ts      # Convert SearchParams → Supabase query
│   │   │   └── normalise-params.ts   # Sanitise + validate incoming search params
│   │   │
│   │   ├── whatsapp/
│   │   │   ├── send.ts               # Twilio/Interakt API wrapper
│   │   │   └── templates.ts          # Message templates: expiry nudge, renewal confirm
│   │   │
│   │   └── utils/
│   │       ├── phone.ts              # Normalise Indian phone numbers to E.164
│   │       ├── rent-bucket.ts        # Round rent to nearest ₹1,000 for dedup
│   │       ├── slug.ts               # Locality → URL slug conversion
│   │       └── date.ts               # Relative time: "3 days ago", TTL calcs
│   │
│   ├── hooks/                        # Client-side React hooks
│   │   ├── useListings.ts            # TanStack Query: fetch + cache listings
│   │   ├── useSearch.ts              # Debounced search with URL sync
│   │   ├── useIngestion.ts           # Poll ingestion job status (SSE or polling)
│   │   ├── useBrokerDashboard.ts     # Broker's listings + stats
│   │   └── useAuth.ts                # Supabase auth state + helpers
│   │
│   ├── store/                        # Zustand global state (UI state only)
│   │   ├── search.store.ts           # Active filters, sort, pagination
│   │   ├── ui.store.ts               # Modal open/close, toast queue, loading states
│   │   └── ingest.store.ts           # Current ingestion job state
│   │
│   ├── types/                        # TypeScript types — shared across app
│   │   ├── listing.ts                # Listing, ListingStatus, PropertyType enums
│   │   ├── broker.ts                 # Broker, BrokerStats
│   │   ├── search.ts                 # SearchParams, SearchResult
│   │   └── ingestion.ts              # IngestionJob, ExtractionResult, FieldConfidence
│   │
│   └── constants/
│       ├── localities.ts             # Indore locality dictionary with slugs + coords
│       ├── filters.ts                # Filter option arrays (BHK types, furnishing, etc)
│       └── config.ts                 # App-wide constants: TTL, rent buckets, etc
│
├── tests/
│   ├── unit/
│   │   ├── dedup/hash.test.ts
│   │   ├── ai/resolve-locality.test.ts
│   │   └── lifecycle/expire.test.ts
│   ├── integration/
│   │   ├── api/listings.test.ts
│   │   ├── api/ingest.test.ts
│   │   └── api/lifecycle.test.ts
│   └── e2e/
│       ├── search-flow.spec.ts       # Renter: search → open listing → tap contact
│       ├── ingest-flow.spec.ts       # Admin: paste URL → review → submit
│       └── lifecycle-flow.spec.ts    # Listing expires → broker renews via WhatsApp
│
└── docs/
    ├── ARCHITECTURE.md               # This file
    ├── MCP_SETUP.md                  # How to configure MCP servers for Claude Code
    ├── LOCALITIES.md                 # Indore locality dictionary maintenance guide
    └── AI_PIPELINE.md                # Prompt engineering notes + accuracy log
```

---

## 3. Layer-by-Layer Breakdown

### 3.1 Frontend — Next.js App Router

**Mental model:** Server Components fetch data. Client Components own interaction. The split is intentional and strict.

```
Server Component (default)          Client Component ("use client")
─────────────────────────           ─────────────────────────────
• search/page.tsx                   • SearchFilters.tsx
• listing/[id]/page.tsx             • ContactActions.tsx
• admin/ingest/page.tsx             • ReelLinkInput.tsx
• broker/dashboard/page.tsx         • ListingForm.tsx
                                    • IngestionStatus.tsx
Fetches directly from Supabase      Holds local state, handles events
No hydration cost                   Minimal — only what needs interactivity
SEO-friendly                        Uses hooks + Zustand
```

**Route groups explained:**

| Group | Path | Purpose |
|---|---|---|
| `(marketing)` | `/about`, `/blog` | Static pages, no auth |
| `search/` | `/search?q=...` | Renter discovery — public |
| `listing/[id]/` | `/listing/abc123` | Single listing — public + SEO |
| `broker/` | `/broker/*` | Auth-gated: broker role |
| `admin/` | `/admin/*` | Auth-gated: admin role |
| `auth/` | `/auth/*` | Login, callback, logout |
| `api/` | `/api/*` | All API Route Handlers |

**Page data flow pattern:**

```typescript
// search/page.tsx — Server Component
// Data fetched at request time, zero client JS for data fetching
export default async function SearchPage({ searchParams }) {
  const params = normaliseParams(searchParams)           // lib/search/normalise-params.ts
  const supabase = createServerClient()                 // lib/supabase/server.ts
  const listings = await queryListings(supabase, params) // direct DB call

  return (
    <div>
      <SearchFilters defaultValues={params} />           {/* Client Component */}
      <SearchResults listings={listings} />              {/* Server Component */}
    </div>
  )
}
```

---

### 3.2 API Layer — Route Handlers

Every route handler follows the same pattern: validate → authenticate → execute → respond.

```typescript
// Standard route handler shape
// app/api/listings/[id]/lifecycle/route.ts

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // 1. Auth check
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Validate input
  const body = await req.json()
  const parsed = LifecycleEventSchema.safeParse(body)   // Zod schema
  if (!parsed.success) return Response.json({ error: parsed.error }, { status: 400 })

  // 3. Business logic
  const result = await handleLifecycleEvent(params.id, parsed.data, user)

  // 4. Respond
  return Response.json(result)
}
```

**API route map:**

```
POST   /api/ingest                    Submit reel URL → returns { jobId }
GET    /api/ingest/[jobId]/status     Poll job: { status, progress, result? }

GET    /api/listings                  Search with filters → paginated results
GET    /api/listings/[id]             Single listing
PATCH  /api/listings/[id]             Update fields (broker/admin only)
DELETE /api/listings/[id]             Archive (admin only)

POST   /api/listings/[id]/claim       Send OTP to broker phone
POST   /api/listings/[id]/verify-claim  Verify OTP → transfer ownership
POST   /api/listings/[id]/lifecycle   mark-rented | renew | reprice

POST   /api/dedup/check               Pre-ingestion dedup check

POST   /api/lifecycle/cron            Vercel cron trigger (secured)

POST   /api/webhooks/whatsapp         Inbound WA reply → renewal action
```

---

### 3.3 AI Ingestion Pipeline

The pipeline is **async by design**. The API route enqueues a job and returns immediately. The UI polls for status.

```
Client                API Route              Pipeline                  Supabase
  │                       │                     │                         │
  │── POST /api/ingest ──►│                     │                         │
  │   { reelUrl }         │── createJob() ─────►│                         │
  │                       │                     │── INSERT ingestion_jobs ►│
  │◄── { jobId } ─────────│                     │                         │
  │                       │                     │                         │
  │── GET /status (poll) ─┤                     │                         │
  │                       │                     │ step 1: fetchReelMeta() │
  │                       │                     │ step 2: transcribe()    │
  │                       │                     │ step 3: extractFields() │
  │                       │                     │ step 4: dedupCheck()    │
  │                       │                     │── UPDATE job.status ───►│
  │                       │                     │                         │
  │── GET /status ────────┤                     │                         │
  │◄── { status: "ready", │                     │                         │
  │     result: {...} } ──┤                     │                         │
```

**Pipeline steps in `lib/ai/pipeline.ts`:**

```typescript
export async function runIngestionPipeline(reelUrl: string, jobId: string) {
  await updateJobStatus(jobId, 'fetching_metadata', 10)

  // Step 1: Resolve URL + fetch Instagram metadata
  const meta = await fetchReelMetadata(reelUrl)
  // meta = { caption, hashtags, authorHandle, timestamp, videoBuffer }

  await updateJobStatus(jobId, 'transcribing', 30)

  // Step 2: Speech-to-text on audio track
  const transcript = await transcribeAudio(meta.videoBuffer)

  await updateJobStatus(jobId, 'extracting_fields', 55)

  // Step 3: Visual analysis on 5 keyframes
  const visualData = await analyseKeyframes(meta.videoBuffer)

  // Step 4: Entity extraction — transcript + visual + caption → structured JSON
  const extracted = await extractListingFields({
    transcript,
    visualData,
    caption: meta.caption,
    hashtags: meta.hashtags,
  })
  // extracted = { propertyType, rent, locality, furnishing, ... confidence: {} }

  await updateJobStatus(jobId, 'resolving_locality', 75)

  // Step 5: Resolve extracted locality string → normalised locality_slug
  const locality = await resolveLocality(extracted.locality)

  await updateJobStatus(jobId, 'checking_duplicates', 85)

  // Step 6: Dedup check before presenting form
  const dedupResult = await checkDuplicate({
    reelUrl,
    locality: locality.slug,
    bhkType: extracted.propertyType,
    rent: extracted.rent,
    brokerPhone: extracted.brokerPhone,
  })

  await updateJobStatus(jobId, 'ready', 100, {
    extracted: { ...extracted, locality },
    dedupResult,
    meta,
  })
}
```

---

### 3.4 Database — Supabase / Postgres

**Core tables:**

```
listings                   # The primary table — every listing record
ingestion_jobs             # Async pipeline job queue
brokers                    # Broker/landlord accounts
listing_events             # Immutable audit log of all lifecycle events
dedup_hashes               # Structural fingerprints for Layer 2 dedup
localities                 # Indore locality dictionary
price_history              # All price changes per listing
enquiry_events             # Every Call/WA tap (for analytics)
```

**Supabase features used:**

| Feature | Usage |
|---|---|
| **PostgreSQL** | Core data store — full relational schema |
| **Row Level Security (RLS)** | Brokers can only edit their own listings; admins bypass |
| **Auth** | OTP phone login for brokers; email+password for admins |
| **Realtime** | Admin ingestion queue — live status updates without polling |
| **Edge Functions** | Lifecycle cron (alternative to Vercel cron) |
| **pgvector** | Phase 2 — semantic search; schema-ready from Day 1 |
| **pg_trgm** | Fuzzy text search for locality resolution |

**RLS policy logic:**

```sql
-- Listings: anyone can read ACTIVE listings
-- Brokers can update their own listings
-- Admins (service role) bypass all policies

CREATE POLICY "public_read_active"
  ON listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "broker_update_own"
  ON listings FOR UPDATE
  USING (broker_id = auth.uid());

CREATE POLICY "admin_all"
  ON listings FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

### 3.5 Auth — Supabase Auth

**Three user types, one auth system:**

```
User Type       Login Method        Role in JWT       Access
─────────────   ─────────────       ───────────       ────────────────────
Renter          None (anonymous)    null              Search + view only
Broker          OTP (phone)         'broker'          Own listings + claim
Admin/Ops       Email + password    'admin'           Everything
```

**Auth flow for broker claim:**

```
1. Broker visits /broker/claim/[listingId]
2. App calls POST /api/listings/[id]/claim
3. API sends OTP to broker_phone on the listing (via Twilio SMS)
4. Broker enters OTP in ClaimFlow.tsx
5. App calls POST /api/listings/[id]/verify-claim with OTP
6. API verifies OTP → creates Supabase user → sets listing.broker_id = user.id
7. Broker redirected to /broker/dashboard — now owns the listing
```

**Session handling:** Supabase handles refresh tokens automatically. `lib/supabase/server.ts` creates a server client that reads the session cookie on every request — no manual JWT management.

---

### 3.6 Background Jobs & Lifecycle Engine

**Cron schedule (Vercel Cron + `vercel.json`):**

```json
{
  "crons": [
    {
      "path": "/api/lifecycle/cron",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**What the daily cron does (`lib/lifecycle/expire.ts`):**

```
1. Query listings WHERE status = 'active' AND expiry_date <= NOW() + 7 days
   → Update status to 'expiring_soon'
   → Send WhatsApp nudge via lib/whatsapp/send.ts

2. Query listings WHERE status IN ('active','expiring_soon') AND expiry_date < NOW()
   → Update status to 'expired'
   → Remove from search index (status filter excludes expired)
   → Log to listing_events

3. Query listings WHERE status = 'expired' AND expiry_date < NOW() - 30 days
   → Update status to 'archived'
   → Log to listing_events
```

**WhatsApp inbound webhook (`/api/webhooks/whatsapp`):**

```
Broker replies "YES" to nudge message
→ Webhook fires from Twilio/Interakt
→ Parse broker phone from webhook payload
→ Find listing by broker_phone + status = 'expiring_soon'
→ Set expiry_date = NOW() + 30 days, status = 'active', last_verified_at = NOW()
→ Reply: "✅ Your listing for [address] has been renewed for 30 days."
```

---

### 3.7 MCP Server Integration

Claude Code connects to these MCP servers to give it full context while building BhumiSure.

**`.claude/settings.json`:**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest",
               "--supabase-url", "${SUPABASE_URL}",
               "--supabase-key", "${SUPABASE_SERVICE_KEY}"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem",
               "/path/to/bhumisure"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres",
               "${DATABASE_URL}"]
    }
  }
}
```

**What each MCP server enables for Claude Code:**

| MCP Server | What Claude Code Can Do |
|---|---|
| `supabase` | Run migrations, inspect schema, query data, manage auth users |
| `filesystem` | Read/write any file in the project — full codebase awareness |
| `postgres` | Direct SQL queries — debug data, verify dedup logic, inspect lifecycle |

**Custom Claude Code commands (`.claude/commands/`):**

```markdown
<!-- .claude/commands/ingest-reel.md -->
# /ingest-reel

Given a reel URL, test the full ingestion pipeline end-to-end:
1. Call lib/ai/fetch-reel.ts with the URL
2. Run transcription
3. Run field extraction
4. Show extracted JSON with confidence scores
5. Run dedup check against local Supabase
6. Report: what would be auto-filled, what needs operator review
```

---

## 4. State Management

**Principle: Right tool for right scope. No global state for data that belongs on the server.**

```
State Type          Where It Lives          Tool
──────────────────  ──────────────────────  ─────────────────────────
Server data         Supabase                TanStack Query (cache)
URL / navigation    URL search params       Next.js useSearchParams
Active filters      URL params + Zustand    search.store.ts
Modal / toast       Component / Zustand     ui.store.ts
Form state          Component               React Hook Form
Ingestion job       Zustand + polling       ingest.store.ts
Auth session        Supabase cookie         useAuth hook
```

**`store/search.store.ts` — the most important store:**

```typescript
interface SearchStore {
  // Filters — synced to URL params
  locality: string[]
  bhkType: PropertyType | null
  minRent: number
  maxRent: number
  furnishing: FurnishingType | null
  preferredFor: TenantType | null
  sortBy: 'newest' | 'rent_asc' | 'rent_desc' | 'verified_recent'

  // Actions
  setFilter: (key: keyof SearchFilters, value: any) => void
  resetFilters: () => void
  syncFromUrl: (params: URLSearchParams) => void
}
```

**TanStack Query — data fetching pattern:**

```typescript
// hooks/useListings.ts
export function useListings(params: SearchParams) {
  return useQuery({
    queryKey: ['listings', params],          // Cache key — invalidated on param change
    queryFn: () => fetchListings(params),    // Calls /api/search
    staleTime: 60 * 1000,                   // 1 min — listings don't change by the second
  })
}

// hooks/useIngestion.ts — polling pattern
export function useIngestionStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['ingestion', jobId],
    queryFn: () => fetchJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (data) =>
      data?.status === 'ready' || data?.status === 'error' ? false : 2000,
  })
}
```

---

## 5. Service Connection Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOW SERVICES CONNECT                    │
│                                                                 │
│  Next.js App (Vercel)                                           │
│  ├── Server Components ──────────────────► Supabase DB          │
│  │   (direct, server-side, uses cookies)   (via server client)  │
│  │                                                              │
│  ├── API Routes ─────────────────────────► Supabase DB          │
│  │   /api/ingest                           (via admin client)   │
│  │   /api/listings/*                                            │
│  │   /api/lifecycle/cron                                        │
│  │                                                              │
│  ├── API Routes ─────────────────────────► OpenAI API           │
│  │   /api/ingest (pipeline)               Whisper + GPT-4o      │
│  │                                                              │
│  ├── API Routes ─────────────────────────► Twilio/Interakt      │
│  │   /api/lifecycle/cron (nudges)         WhatsApp API          │
│  │   /api/listings/[id]/claim (OTP SMS)                         │
│  │                                                              │
│  ├── API Routes ◄────────────────────────── Twilio Webhook      │
│  │   /api/webhooks/whatsapp               Inbound WA replies    │
│  │                                                              │
│  └── Client Components ──────────────────► /api/* routes       │
│      (browser, via fetch)                 (same Next.js app)    │
│                                                                 │
│  Supabase                                                       │
│  ├── DB ◄──────────────────────────────── All server code       │
│  ├── Auth ──────────────────────────────► JWT in cookies        │
│  ├── Realtime ──────────────────────────► Admin ingestion queue │
│  └── Edge Functions (optional) ─────────► Lifecycle cron backup │
│                                                                 │
│  Vercel                                                         │
│  ├── Cron ──────────────────────────────► /api/lifecycle/cron   │
│  └── Edge Network ──────────────────────► Global CDN for static │
└─────────────────────────────────────────────────────────────────┘
```

**Client instantiation rules:**

```typescript
// lib/supabase/client.ts — BROWSER ONLY
// Used in Client Components and hooks
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// lib/supabase/server.ts — SERVER ONLY (Server Components + Route Handlers)
// Reads auth session from request cookies
export function createServerClient() {
  const cookieStore = cookies()
  return createSSRClient(url, anonKey, { cookies: ... })
}

// lib/supabase/admin.ts — SERVER ONLY, NEVER in browser
// Service role key — bypasses all RLS
// ONLY used in: cron jobs, webhook handlers, admin routes
export const adminSupabase = createClient(url, SERVICE_ROLE_KEY)
```

---

## 6. Data Flow Diagrams

### 6.1 Reel Ingestion Flow

```
Admin pastes Instagram Reel URL
         │
         ▼
POST /api/ingest
  ├── Validate URL format
  ├── Check DB: URL already exists? → BLOCK (return existing listing link)
  ├── Create ingestion_job record { status: 'queued' }
  └── Start async pipeline (non-blocking)
         │
         ▼ (async)
lib/ai/pipeline.ts
  ├── fetchReelMetadata()
  │     └── Instagram oEmbed → caption, hashtags, author, timestamp
  ├── transcribeAudio()       [Whisper API]
  │     └── Hindi + English transcript
  ├── extractListingFields()  [GPT-4o + prompts.ts]
  │     └── { propertyType, rent, locality, furnishing, ... }
  ├── analyseKeyframes()      [GPT-4o Vision]
  │     └── { roomCount, furnishingEvidence, amenityEvidence }
  ├── resolveLocality()
  │     └── fuzzy match → { slug: 'vijay-nagar', display: 'Vijay Nagar' }
  └── checkDuplicate()
        ├── Layer 1: URL hash → DB lookup
        └── Layer 2: Structural hash → DB lookup
              ├── BLOCK → return existing listing
              ├── REVIEW → flag, surface in queue
              └── CLEAR → proceed
         │
         ▼
Admin reviews pre-filled form
  ├── All fields editable
  ├── Confidence indicators per field
  └── Original reel embedded for reference
         │
         ▼
Admin submits
  ├── INSERT listings record
  ├── INSERT dedup_hash record
  ├── INSERT listing_event { type: 'created' }
  └── Listing status = 'active' — immediately searchable
```

### 6.2 Renter Search Flow

```
Renter types "1BHK Vijay Nagar under 14000"
         │
         ▼
SearchBar.tsx → updates URL params → triggers page re-render

GET /search?locality=vijay-nagar&bhk=1bhk&maxRent=14000
         │
         ▼
search/page.tsx (Server Component)
  └── lib/search/query-builder.ts
        └── Supabase query:
              SELECT * FROM listings
              WHERE status = 'active'
              AND locality_slug = 'vijay-nagar'
              AND bhk_type = '1bhk'
              AND rent_monthly <= 14000
              ORDER BY created_at DESC
              LIMIT 20
         │
         ▼
ListingGrid.tsx renders ListingCard × n
  Each card shows:
    - Embedded video thumbnail (or autoplay)
    - Rent, BHK, Locality
    - Freshness signals
    - [Call] [WhatsApp] buttons
         │
         ▼
Renter taps [WhatsApp]
  └── ContactActions.tsx
        ├── INSERT enquiry_event { listing_id, action: 'whatsapp', timestamp }
        └── window.open(`https://wa.me/${brokerPhone}?text=...`)
```

### 6.3 Listing Lifecycle Flow

```
Daily cron fires at 09:00 IST
POST /api/lifecycle/cron (secured with CRON_SECRET header)
         │
         ▼
lib/lifecycle/expire.ts

Step 1: Expiry warnings
  Query: status='active' AND expiry_date BETWEEN NOW() AND NOW()+7days
  → UPDATE status = 'expiring_soon'
  → lib/whatsapp/send.ts: "Your listing expires in X days. Reply YES to renew."
  → INSERT listing_event { type: 'expiry_warning_sent' }

Step 2: Expire overdue listings
  Query: status IN ('active','expiring_soon') AND expiry_date < NOW()
  → UPDATE status = 'expired'
  → INSERT listing_event { type: 'expired' }

Step 3: Archive old expired listings
  Query: status='expired' AND expiry_date < NOW()-30days
  → UPDATE status = 'archived'

         │
         ▼ (separately)
Broker receives WhatsApp: "Reply YES to renew"
Broker replies "YES"
         │
         ▼
POST /api/webhooks/whatsapp
  ├── Parse sender phone from Twilio payload
  ├── Find listing by broker_phone WHERE status = 'expiring_soon'
  ├── UPDATE: status='active', expiry_date=NOW()+30days, last_verified_at=NOW()
  ├── INSERT listing_event { type: 'renewed_via_whatsapp' }
  └── Reply: "✅ Renewed for 30 days."
```

---

## 7. Environment Variables

```bash
# .env.local — never commit this file

# ── Supabase ──────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # Safe to expose (RLS protects data)
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # SECRET — server only, bypasses RLS

# ── AI ────────────────────────────────────────────────────────────
OPENAI_API_KEY=sk-...                         # Whisper + GPT-4o

# ── WhatsApp ──────────────────────────────────────────────────────
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
# OR if using Interakt:
INTERAKT_API_KEY=...

# ── Cron security ─────────────────────────────────────────────────
CRON_SECRET=...                               # Shared secret for cron endpoint auth

# ── App ───────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=https://bhumisure.in
NEXT_PUBLIC_DEFAULT_CITY=indore
```

---

## 8. Claude Code + MCP Dev Workflow

**How to build features with Claude Code in Antigravity IDE:**

```bash
# 1. Start local Supabase
supabase start

# 2. Start Next.js dev server
npm run dev

# 3. Open Antigravity IDE — Claude Code has MCP context of:
#    - Your entire file system (filesystem MCP)
#    - Your live Supabase DB (supabase MCP + postgres MCP)
#    - Can run migrations, query data, generate types
```

**Typical Claude Code session — building the ingest pipeline:**

```
You: Build the reel ingestion pipeline. The API route should accept a 
     POST with { reelUrl }, create a job in the ingestion_jobs table, 
     and kick off lib/ai/pipeline.ts async. Use the schema in 
     supabase/migrations/001_initial_schema.sql

Claude Code:
  1. Reads 001_initial_schema.sql via filesystem MCP
  2. Queries ingestion_jobs table schema via postgres MCP
  3. Writes app/api/ingest/route.ts
  4. Writes lib/ai/pipeline.ts with all steps stubbed
  5. Writes lib/supabase/admin.ts for service role client
  6. Runs: supabase gen types typescript --local > src/lib/supabase/types.ts
```

**Generating Supabase types after schema changes:**

```bash
# Claude Code can run this automatically after any migration
supabase gen types typescript --local > src/lib/supabase/types.ts
```

**Running migrations in dev:**

```bash
supabase db push                    # Push local migrations to remote
supabase migration new add_field    # Create new migration file
```

---

## 9. Supabase Schema — Full SQL

```sql
-- ═══════════════════════════════════════════════════════════════
-- 001_initial_schema.sql
-- ═══════════════════════════════════════════════════════════════

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector";        -- pgvector (Phase 2 ready)

-- Enums
CREATE TYPE listing_status AS ENUM (
  'draft', 'active', 'expiring_soon', 'expired', 'rented', 'archived'
);
CREATE TYPE property_type AS ENUM (
  '1bhk', '2bhk', '3bhk', 'studio', 'pg', 'room', 'villa'
);
CREATE TYPE furnishing_type AS ENUM ('bare', 'semi', 'fully');
CREATE TYPE tenant_type AS ENUM ('family', 'bachelor', 'girls', 'boys', 'any');
CREATE TYPE listing_source AS ENUM ('operator', 'broker_native', 'user_submitted');

-- Localities dictionary
CREATE TABLE localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,           -- 'vijay-nagar'
  display_name TEXT NOT NULL,          -- 'Vijay Nagar'
  city TEXT NOT NULL DEFAULT 'indore',
  zone TEXT,                           -- 'west-indore'
  lat DECIMAL(9,6),
  lng DECIMAL(9,6),
  aliases TEXT[],                      -- ['VN', 'Vijay nagar', 'vijaynagar']
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brokers
CREATE TABLE brokers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  phone TEXT UNIQUE NOT NULL,
  instagram_handle TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Core listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Content
  reel_url TEXT NOT NULL,
  instagram_handle TEXT,
  property_type property_type NOT NULL,
  locality_id UUID REFERENCES localities(id),
  locality_slug TEXT NOT NULL,              -- denormalised for fast queries
  rent_monthly INTEGER NOT NULL,            -- INR
  furnishing furnishing_type,
  floor INTEGER,
  amenities TEXT[] DEFAULT '{}',
  preferred_for tenant_type DEFAULT 'any',
  available_from DATE,
  description TEXT,

  -- Broker
  broker_id UUID REFERENCES brokers(id),   -- NULL until claimed
  broker_name TEXT NOT NULL,
  broker_phone TEXT NOT NULL,
  broker_instagram TEXT,

  -- Lifecycle
  status listing_status NOT NULL DEFAULT 'draft',
  source listing_source NOT NULL DEFAULT 'operator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expiry_date DATE NOT NULL DEFAULT (CURRENT_DATE + 45),
  last_verified_at TIMESTAMPTZ,
  rented_at TIMESTAMPTZ,
  days_to_rent INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM rented_at - created_at)::INTEGER
  ) STORED,

  -- Dedup + AI
  dedup_hash TEXT,
  confidence_score INTEGER CHECK (confidence_score BETWEEN 0 AND 100),

  -- Analytics (denormalised counters — updated via triggers)
  view_count INTEGER DEFAULT 0,
  enquiry_count INTEGER DEFAULT 0,
  whatsapp_tap_count INTEGER DEFAULT 0,
  call_tap_count INTEGER DEFAULT 0
);

-- Price history
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  old_price INTEGER NOT NULL,
  new_price INTEGER NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id)
);

-- Enquiry events (every contact action)
CREATE TABLE enquiry_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  action TEXT NOT NULL CHECK (action IN ('call', 'whatsapp', 'view')),
  user_id UUID REFERENCES auth.users(id),  -- NULL for anonymous
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lifecycle audit log
CREATE TABLE listing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  event_type TEXT NOT NULL,     -- 'created','expired','renewed','rented','repriced', etc
  old_value JSONB,
  new_value JSONB,
  actor_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingestion jobs
CREATE TABLE ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reel_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  -- queued → fetching_metadata → transcribing → extracting_fields
  -- → resolving_locality → checking_duplicates → ready | error
  progress INTEGER DEFAULT 0,
  result JSONB,                  -- populated on 'ready'
  error TEXT,                    -- populated on 'error'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
-- 002_dedup_system.sql
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE dedup_hashes (
  hash TEXT PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES listings(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast hash lookups
CREATE INDEX idx_listings_reel_url ON listings(reel_url);
CREATE INDEX idx_dedup_hashes_hash ON dedup_hashes(hash);
CREATE INDEX idx_listings_broker_phone ON listings(broker_phone);

-- ═══════════════════════════════════════════════════════════════
-- 004_search_index.sql
-- ═══════════════════════════════════════════════════════════════

-- Composite index for the most common search query pattern
CREATE INDEX idx_listings_search ON listings(
  status, locality_slug, property_type, rent_monthly
) WHERE status = 'active';

-- Full-text search on description + locality
CREATE INDEX idx_listings_fts ON listings
  USING gin(to_tsvector('english', coalesce(description, '') || ' ' || locality_slug));

-- Trigram index for fuzzy locality matching
CREATE INDEX idx_localities_trgm ON localities
  USING gin(display_name gin_trgm_ops);

-- Updated_at trigger
CREATE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 10. Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                   PRODUCTION SETUP                   │
│                                                      │
│  bhumisure.in  ──► Vercel Edge Network               │
│                        │                            │
│                        ▼                            │
│              Next.js App (Serverless)                │
│              - Server Components                     │
│              - API Route Handlers                    │
│              - Vercel Cron (daily lifecycle)         │
│                        │                            │
│               ┌────────┴────────┐                   │
│               ▼                 ▼                   │
│        Supabase (hosted)    OpenAI API              │
│        - PostgreSQL         - Whisper               │
│        - Auth               - GPT-4o                │
│        - Realtime                                   │
│               │                                     │
│               ▼                                     │
│        Twilio / Interakt                            │
│        - WhatsApp Business API                      │
│        - Inbound webhook → Vercel                   │
│                                                      │
│  ─────────────────────────────────────────────────  │
│  BRANCH STRATEGY                                     │
│  main → production (bhumisure.in)                   │
│  dev  → preview (*.vercel.app — staging)            │
│  feat/* → preview per PR                            │
│                                                      │
│  SUPABASE ENVIRONMENTS                               │
│  Project: bhumisure-prod  ← production              │
│  Project: bhumisure-dev   ← local dev + staging     │
└──────────────────────────────────────────────────────┘
```

**Build commands:**

```bash
# Local dev
supabase start                    # Start local Postgres + Auth + Studio
npm run dev                       # Next.js on :3000

# Before committing
npm run type-check                # tsc --noEmit
npm run test                      # Vitest unit + integration
supabase db push                  # Sync migrations to remote dev project
supabase gen types typescript --local > src/lib/supabase/types.ts

# Deploy
git push origin main              # Vercel auto-deploys from main
```

---

*Architecture v1.0 — BhumiSure MVP · bhumisure.in · May 2025*
*Built with Next.js 14 · Supabase · Claude Code · Antigravity IDE*
