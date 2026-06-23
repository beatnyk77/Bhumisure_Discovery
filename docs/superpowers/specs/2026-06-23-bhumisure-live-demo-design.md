# BhumiSure Live Demo — Design Spec

**Date:** 2026-06-23  
**Goal:** Staging demo with 15+ real Indore rental listings  
**Timeline:** ~7 days  
**Repo:** [beatnyk77/Bhumisure_Discovery](https://github.com/beatnyk77/Bhumisure_Discovery)

---

## 1. Success Criteria

A renter can complete the **3-click trust test** on a staging URL:

1. Search `1BHK, Vijay Nagar, ₹10k–14k` → see relevant results
2. Open a listing → see price, locality, furnishing, freshness signal, video link
3. Tap Call or WhatsApp → reach a real broker

**Quantitative bar:**

| Metric | Target |
|--------|--------|
| Active listings | ≥ 15 |
| Localities covered | ≥ 5 |
| Listings with verified phone | 100% |
| Discovery automation | Cron adds 3–5 candidates/day |
| Environment | Vercel staging + Supabase Cloud |

---

## 2. Supply Strategy

### Phase 0 — Demo seed (this sprint)

Conservative automated discovery only:

- **SerpAPI / Google CSE** daily queries for public Instagram reel URLs
- **Curated broker handle list** (~30 Indore brokers) polled for new reels
- **yt-dlp** downloads audio from discovered URLs
- **Whisper + GPT-4o** extracts structured fields
- **Human review gate** — every listing approved before publish

No Instagram login scraping. No Apify.

### Phase 1 — Post-demo (architected, not built this week)

Brokers become primary supply via:

- **URL paste** (preferred) — same ingestion pipeline
- **File upload** (fallback) — Supabase Storage → Whisper direct

Schema hooks added this week; broker UI ships after demo.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     STAGING DEMO (Week 1)                   │
├─────────────────────────────────────────────────────────────┤
│  Discovery Worker (cron)                                    │
│    SerpAPI queries + broker handle poll                     │
│    → sourcing_jobs table                                    │
│                                                             │
│  Ingestion Worker (poll)                                    │
│    sourcing_jobs / ingestion_jobs                           │
│    → yt-dlp → Whisper → GPT-4o → dedup                     │
│    → ingestion_jobs.result (JSON)                           │
│                                                             │
│  Admin Review UI                                             │
│    Review extracted fields → publish → listings table       │
│                                                             │
│  Renter UX                                                   │
│    Homepage → /indore/{locality} → /listing/{slug}          │
│    Call + WhatsApp buttons                                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 New / modified tables

**`sourcing_jobs` (new)**

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | PK |
| source_url | TEXT | Discovered reel URL |
| source_type | TEXT | `serp` \| `broker_handle` |
| discovery_query | TEXT | SerpAPI query or handle name |
| status | TEXT | `pending` \| `ingested` \| `rejected` |
| discovered_at | TIMESTAMPTZ | |
| ingestion_job_id | UUID | FK, set after job created |

**`ingestion_jobs` (extend)**

| Column | Type | Notes |
|--------|------|-------|
| source_type | TEXT | `discovered_url` \| `broker_url` \| `broker_file` |
| file_path | TEXT | Nullable; Supabase Storage path (Phase 1) |
| submitted_by | UUID | Nullable broker_id (Phase 1) |
| manual_transcript | TEXT | Ops override fallback |

**`listings` (extend)**

| Column | Type | Notes |
|--------|------|-------|
| video_url | TEXT | Nullable; hosted video (Phase 1) |
| title | TEXT | Generated: `{property_type} in {locality_name}` |

Remove references to non-existent `description` column; use generated copy on detail page.

### 3.2 Storage (hooks only)

- Create Supabase Storage bucket `broker-videos` with RLS
- No upload UI this week

---

## 4. Critical Bug Fixes (Day 1–2)

| Bug | Fix |
|-----|-----|
| `search_listings()` references `l.title` | Add `title` column or generate in RPC |
| `searchListings()` uses browser client in Server Component | Switch to `createServerClient()` |
| `manualTranscript` dropped by `/api/ingest` | Store on job, pass to worker |
| Ingestion completes but never creates listing | Build publish flow |
| Pipeline requires manual transcript | Wire `yt-dlp` + Whisper |
| Homepage is Next.js default | Replace with Indore search hero |
| No seed listings | Discovery cron + manual publish |
| `lifecycle.ts` references non-existent columns | Fix or disable for demo |
| Layout metadata says "Create Next App" | Update to BhumiSure branding |

---

## 5. Discovery Queries (SerpAPI)

Daily rotation (~6 queries/day):

```
site:instagram.com/reel "indore" "rent" "1bhk"
site:instagram.com/reel "indore" "flat" "rent"
site:instagram.com/reel "vijay nagar" "rent"
site:instagram.com/reel "scheme 54" "bhk"
site:instagram.com/reel "nipania" "flat"
site:instagram.com/reel "palasia" "rent"
site:youtube.com/shorts "indore" "flat rent"
```

Broker handle list: seed from public Indore broker Instagram accounts (manual bootstrap once, ~30 handles).

### Auto-reject (no human review)

- Duplicate URL
- Dedup hash match (active listing)
- No `rent_monthly` extracted
- No locality match in dictionary
- Property type not in enum
- Anti-spam: missing price AND location

### Human review required

- Missing broker phone
- Low confidence (< 70)
- Repriced repost flagged by dedup
- Ambiguous locality (multiple matches)

---

## 6. Publish Flow (new)

```
ingestion_jobs (status: completed)
  → Admin opens /admin/review/[jobId]
  → Pre-filled form from job.result
  → Operator edits required fields
  → POST /api/listings/publish
      → compute dedup hashes
      → INSERT listings (status: active)
      → UPDATE ingestion_jobs.listing_id
      → INSERT listing_events (created)
```

**Required fields to publish:** property_type, rent_monthly, locality_slug, broker_phone

---

## 7. Renter UX (minimal polish)

### Homepage (`/`)

- Hero: "Find verified rental reels in Indore"
- Locality quick-picks (Vijay Nagar, Scheme 54, Nipania, Palasia, Bhawarkua)
- Budget + BHK filter chips
- CTA → `/indore/{locality}?bhk=1BHK&min=10000&max=15000`

### Listing card

- Thumbnail or placeholder
- Rent, locality, BHK, furnishing
- Freshness: "Listed X days ago" (dynamic, not hardcoded "Just Listed")
- Link to detail + Instagram icon

### Listing detail

- Price, locality, furnishing, available from
- "Watch Reel" → external Instagram/YouTube
- Call + WhatsApp (track tap in `enquiry_events`)

---

## 8. Deployment

| Service | Config |
|---------|--------|
| **Supabase Cloud** | Run migrations, seed localities, enable RLS |
| **Vercel** | Staging preview URL (e.g. `bhumisure-staging.vercel.app`) |
| **Workers** | Run ingestion + discovery as Vercel cron or Railway/Fly.io process |
| **Secrets** | `OPENAI_API_KEY`, `SERPAPI_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Workers cannot run indefinitely on Vercel serverless — deploy discovery + ingestion workers on **Railway** (free tier) or trigger via cron hitting API routes.

**Recommended for 1-week sprint:** API route `/api/cron/discover` + `/api/cron/ingest` secured by `CRON_SECRET`, triggered by Vercel Cron or external cron-job.org.

---

## 9. 7-Day Sprint Plan

| Day | Engineering | Target |
|-----|-------------|--------|
| **1** | Clone repo, fix schema, server-side search, deploy Supabase | DB live |
| **2** | yt-dlp + Whisper pipeline, fix transcript wiring | End-to-end ingest works |
| **3** | Publish review UI + `/api/listings/publish` | Manual publish works |
| **4** | SerpAPI discovery cron + sourcing_jobs | Auto-discovery running |
| **5** | Homepage + listing polish + staging deploy | Staging URL live |
| **6** | Run discovery, review queue, publish 10+ listings | 10 listings live |
| **7** | Publish to 15+, smoke test 3-click flow, fix blockers | Demo ready |

---

## 10. Explicitly Out of Scope (Week 1)

- Broker file upload UI
- Broker dashboard
- OTP claim flow
- WhatsApp expiry nudges
- Embedded video hosting
- Production domain (`bhumisure.in`)
- Instagram login scraping / Apify
- Map-based discovery
- Auth / saved listings

---

## 11. Environment Variables (additions)

```bash
# Existing
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# New
SERPAPI_KEY=
CRON_SECRET=           # Secures cron API routes
YT_DLP_PATH=yt-dlp    # Path to yt-dlp binary (or bundled)
```

---

## 12. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| SerpAPI finds few URLs | Bootstrap 30 broker handles; run 8 queries/day |
| yt-dlp blocked by Instagram | Manual transcript fallback in admin UI |
| Whisper fails on Hindi/Hinglish | GPT-4o extraction tolerates noisy transcripts |
| Broker phone not in reel | Human review gate; skip if no phone after review |
| 15 listings in 7 days tight | Lower to 12 acceptable; prioritize phone-verified |
| Worker hosting complexity | Cron API routes on Vercel + 60s timeout budget per job |

---

## 13. Post-Demo Roadmap (ordered)

1. Broker URL submit form (public, no auth)
2. Broker phone OTP auth
3. File upload fallback + Supabase video hosting
4. Auto-publish for high-confidence broker submissions
5. Production domain + SEO
6. WhatsApp renewal nudges
7. Broker dashboard (views, enquiries, mark rented)

---

*Approved by: pending user review*