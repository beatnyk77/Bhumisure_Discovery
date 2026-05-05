{\rtf1\ansi\ansicpg1252\cocoartf2820
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Menlo-Regular;}
{\colortbl;\red255\green255\blue255;\red228\green231\blue235;\red34\green41\blue56;}
{\*\expandedcolortbl;;\cssrgb\c91373\c92549\c93725;\cssrgb\c17647\c21569\c28235;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\partightenfactor0

\f0\fs21 \cf2 \cb3 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 **BHUMISURE**\cb1 \
\
\cb3 _bhumisure.in_\cb1 \
\
\cb3 Product Requirements Document\cb1 \
\
\cb3 MVP v1.0 - Real Estate Discovery Platform\cb1 \
\
\cb3 _"Do users trust your listings after 3 clicks? If yes - we win."_\cb1 \
\
\cb3 - Product Thesis\cb1 \
\
\cb3 | **Version**              | 1.0 - MVP                                       |\cb1 \
\cb3 | ------------------------ | ----------------------------------------------- |\cb1 \
\cb3 | **Domain**               | bhumisure.in                                    |\cb1 \
\cb3 | **Target Vertical**      | Residential Real Estate - Flats, PGs, Rentals   |\cb1 \
\cb3 | **Pilot City**           | Indore, Madhya Pradesh                          |\cb1 \
\cb3 | **MVP Inventory Target** | 200 high-quality, deduplicated, recent listings |\cb1 \
\cb3 | **Document Date**        | May 2025                                        |\cb1 \
\cb3 | **Status**               | Draft - Founder Review                          |\cb1 \
\
\cb3 # 1\\. Executive Summary\cb1 \
\
\cb3 BhumiSure is a structured local real estate discovery platform that converts unstructured social media video content (Instagram Reels, YouTube Shorts) into high-trust, searchable property listings. The platform targets the structural gap between how local inventory is actually marketed in Tier 2/3 India - informally, via short-form video - and how renters need to discover it: intentionally, filtered, and trustworthy.\cb1 \
\
\cb3 **The Core Bet**\cb1 \
\
\cb3 Instagram and TikTok have become the de facto listing platforms for brokers and landlords in Tier 2/3 India.\cb1 \
\
\cb3 The discovery UX is broken - optimised for engagement, not transaction.\cb1 \
\
\cb3 BhumiSure extracts the supply that already exists, structures it, and makes it instantly actionable.\cb1 \
\
\cb3 Trust is the product. Speed to verification is the moat.\cb1 \
\
\cb3 ## 1.1 Problem Statement\cb1 \
\
\cb3 | **The User's Pain**                      | **Current Behaviour**                           | **Why It Fails**                                     |\cb1 \
\cb3 | ---------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- |\cb1 \
\cb3 | Find a 1BHK flat for rent in a new city  | Scroll Instagram reels, ask friends on WhatsApp | Incomplete coverage, no filters, no recency signal   |\cb1 \
\cb3 | Verify a listing before visiting         | DM broker, wait hours for reply                 | High dropout; brokers ghost; no structured data      |\cb1 \
\cb3 | Compare options across budget            | Open 6 apps + Instagram + WhatsApp groups       | Context-switching; duplicates everywhere; stale data |\cb1 \
\cb3 | Find family-friendly options vs bachelor | None - social has no such filter                | Entirely missing; word of mouth only                 |\cb1 \
\
\cb3 ## 1.2 The Insight\cb1 \
\
\cb3 The reel IS the product. It shows the actual flat, the actual vibe, the actual broker. BhumiSure does not replace that video - it organises it. The platform's job is to collapse the discovery journey from 40 minutes of scrolling to 3 intentional clicks.\cb1 \
\
\cb3 **Success Metric - The 3-Click Trust Test**\cb1 \
\
\cb3 Click 1: User searches '1BHK, \uc0\u8377 10k-14k, Vijay Nagar, family' \u8594  sees 8 relevant listings\cb1 \
\
\cb3 Click 2: User opens a listing \uc0\u8594  sees video, price, size, availability date, broker contact\cb1 \
\
\cb3 Click 3: User taps 'Call Broker' or 'WhatsApp' \uc0\u8594  conversation begins\cb1 \
\
\cb3 If all 3 clicks feel trustworthy and fast \uc0\u8594  MVP is validated.\cb1 \
\
\cb3 # 2\\. Product Scope & Guiding Principles\cb1 \
\
\cb3 ## 2.1 MVP Scope\cb1 \
\
\cb3 The MVP is a single-city (Indore), single-vertical (residential rental) web + mobile web platform. It is explicitly NOT a full marketplace or a SaaS tool for brokers at this stage. The goal is to prove the trust thesis with 200 listings.\cb1 \
\
\cb3 | **In Scope - MVP**                                    | **Out of Scope - Post MVP**             |\cb1 \
\cb3 | ----------------------------------------------------- | --------------------------------------- |\cb1 \
\cb3 | Reel link ingestion \uc0\u8594  AI auto-fill \u8594  listing DB       | Native Android/iOS app                  |\cb1 \
\cb3 | Structured listing cards with embedded video          | Builder/developer listings              |\cb1 \
\cb3 | Search + filter (BHK, budget, locality, tenant type)  | Pan-India rollout                       |\cb1 \
\cb3 | Duplicate detection and deduplication pipeline        | Payments / security deposit handling    |\cb1 \
\cb3 | Listing lifecycle management (expire, reprice, relet) | Verified broker badging program         |\cb1 \
\cb3 | Broker/landlord claim flow                            | AI chat assistant for queries           |\cb1 \
\cb3 | 200 listings - Indore pilot                           | Second vertical (restaurants, services) |\cb1 \
\
\cb3 ## 2.2 Design Principles\cb1 \
\
\cb3 - **P1** Trust over completeness - 200 verified, recent listings beat 2,000 stale ones\cb1 \
\cb3 - **P2** Speed to contact - every listing card must have a direct action within 2 taps\cb1 \
\cb3 - **P3** Video as proof - the reel is not decoration; it is the primary trust signal\cb1 \
\cb3 - **P4** Structured data is the moat - every field extracted from a reel is proprietary IP\cb1 \
\cb3 - **P5** Lifecycle honesty - a rented flat shown as available destroys trust permanently\cb1 \
\cb3 - **P6** Broker is a partner, not a target - make them successful first; monetise second\cb1 \
\
\cb3 # 3\\. User Personas\cb1 \
\
\cb3 ## 3.1 Primary - The Renter\cb1 \
\
\cb3 | **Archetype**         | Rohan, 24, IT professional relocating to Indore for a new job               |\cb1 \
\cb3 | --------------------- | --------------------------------------------------------------------------- |\cb1 \
\cb3 | **Need**              | Find a 1BHK flat, semi-furnished, \uc0\u8377 10k-\u8377 14k/month, within 3 km of Scheme 54 |\cb1 \
\cb3 | **Current Behaviour** | Searches Instagram, calls 6 brokers, visits 4 flats, takes 3 weeks          |\cb1 \
\cb3 | **Core Fear**         | "The listing I saw yesterday is already rented" / "Is this broker legit?"   |\cb1 \
\cb3 | **Job To Be Done**    | Collapse 3 weeks \uc0\u8594  3 days with confidence that options are real and current |\cb1 \
\
\cb3 ## 3.2 Secondary - The Broker / Landlord\cb1 \
\
\cb3 | **Archetype**         | Ramesh, broker, Vijay Nagar, 40 listings active, posts reels regularly |\cb1 \
\cb3 | --------------------- | ---------------------------------------------------------------------- |\cb1 \
\cb3 | **Need**              | More qualified leads. Fewer time-wasters. Zero extra work.             |\cb1 \
\cb3 | **Current Behaviour** | Posts reels on Instagram, gets DMs, manually follows up                |\cb1 \
\cb3 | **Core Fear**         | "Another app where I enter everything manually and get zero leads"     |\cb1 \
\cb3 | **Job To Be Done**    | Get 5 extra serious enquiries per month without changing workflow      |\cb1 \
\
\cb3 ## 3.3 Tertiary - The B2B Buyer (Post-MVP)\cb1 \
\
\cb3 | **Archetype** | Relocation manager at TCS Indore / Builder launching a project                             |\cb1 \
\cb3 | ------------- | ------------------------------------------------------------------------------------------ |\cb1 \
\cb3 | **Need**      | "Where is rental demand clustering? What is the real market rate for 1BHK in Vijay Nagar?" |\cb1 \
\cb3 | **Value**     | Aggregate demand signal + price benchmarks by micro-locality + recency                     |\cb1 \
\
\cb3 # 4\\. Core Feature: Reel \uc0\u8594  Listing Pipeline\cb1 \
\
\cb3 This is the defining technical feature of BhumiSure. It is the engine that converts social supply into structured inventory.\cb1 \
\
\cb3 ## 4.1 Input: Paste Reel Link\cb1 \
\
\cb3 The operator (internal team at Stage 0, broker at Stage 1) pastes any Instagram Reel or YouTube Short URL into the admin/broker dashboard. This is the single required action.\cb1 \
\
\cb3 **Stage 0 Operator Flow (Month 1-3)**\cb1 \
\
\cb3 Internal ops team identifies reels manually via Instagram search, hashtags, location tags\cb1 \
\
\cb3 Pastes link into internal ingestion dashboard\cb1 \
\
\cb3 AI pipeline processes within 60 seconds\cb1 \
\
\cb3 Operator reviews auto-filled fields, edits if needed, and submits\cb1 \
\
\cb3 Listing goes live after submit - no further approval step needed\cb1 \
\
\cb3 ## 4.2 AI Auto-Fill Pipeline - Field Extraction\cb1 \
\
\cb3 The pipeline processes the video and extracts structured data using a multi-modal AI model (speech-to-text + visual analysis + caption parsing).\cb1 \
\
\cb3 | **Field**                              | **Extraction Source**                   | **Confidence Handling**                     |\cb1 \
\cb3 | -------------------------------------- | --------------------------------------- | ------------------------------------------- |\cb1 \
\cb3 | Property Type (1BHK/2BHK/PG/Studio)    | Speech + Caption + Hashtags             | Low confidence \uc0\u8594  flag for human review      |\cb1 \
\cb3 | Monthly Rent (\uc0\u8377 )                       | Speech-to-text ("teen hazar", "15k")    | Not found \u8594  leave blank, mark Required      |\cb1 \
\cb3 | Locality / Area                        | Caption geotag + speech + hashtags      | Multi-match \uc0\u8594  show dropdown to confirm      |\cb1 \
\cb3 | Furnishing Status (Bare/Semi/Fully)    | Speech + visual frame analysis          | Visual-only \uc0\u8594  70% threshold before flagging |\cb1 \
\cb3 | Floor (Ground/1st/Top)                 | Speech                                  | Not found \uc0\u8594  blank, optional field           |\cb1 \
\cb3 | Amenities (Parking, Lift, AC, Geyser)  | Speech + visual                         | Checkboxes; all default to unchecked        |\cb1 \
\cb3 | Available From (Date)                  | Speech ("abhi available", "next month") | Parsed to date; "immediate" \uc0\u8594  today's date  |\cb1 \
\cb3 | Preferred Tenant (Family/Bachelor/Any) | Speech + hashtag                        | Default = Any if not found                  |\cb1 \
\cb3 | Broker Name & Contact                  | Caption link / speech / watermark OCR   | Not found \uc0\u8594  operator must enter manually    |\cb1 \
\cb3 | Original Reel URL                      | Input                                   | Always captured for dedup + claim flow      |\cb1 \
\cb3 | Instagram Handle                       | URL parsing                             | Always captured                             |\cb1 \
\
\cb3 ## 4.3 Output: Editable Listing Card (Pre-Submit)\cb1 \
\
\cb3 After the AI pipeline completes, the operator sees a pre-filled form - every field is editable. The goal is to reduce manual entry to less than 60 seconds of review and correction. The original reel is embedded in the form for reference.\cb1 \
\
\cb3 **Pre-Submit Form Fields**\cb1 \
\
\cb3 REQUIRED: Property Type | Rent | Locality | Broker/Landlord Contact\cb1 \
\
\cb3 RECOMMENDED: Furnishing | Floor | Available From | Preferred Tenant\cb1 \
\
\cb3 AUTO-CAPTURED: Reel URL | Instagram Handle | Extraction Date | Confidence Score\cb1 \
\
\cb3 Operator can flag the listing as 'Low Confidence' to queue for secondary review\cb1 \
\
\cb3 Submit button is disabled until all REQUIRED fields are filled\cb1 \
\
\cb3 ## 4.4 Post-Submit: Database Commit\cb1 \
\
\cb3 On submit, the listing is committed to the database with the following system-generated metadata:\cb1 \
\
\cb3 - listing_id: UUID\cb1 \
\cb3 - created_at: UTC timestamp\cb1 \
\cb3 - source: 'operator_ingestion' | 'broker_native' | 'user_submitted'\cb1 \
\cb3 - status: 'active'\cb1 \
\cb3 - expiry_date: created_at + 45 days (default; configurable per listing)\cb1 \
\cb3 - dedup_hash: generated from \\[locality + rent + BHK + broker_contact\\] - see Section 5\cb1 \
\cb3 - confidence_score: 0-100 from AI pipeline\cb1 \
\cb3 - last_verified_at: NULL until first verification event\cb1 \
\
\cb3 # 5\\. Solving Duplicate Pollution\cb1 \
\
\cb3 Duplicate listings are the single fastest trust-killer in any marketplace. A renter who sees the same flat listed three times with different prices loses confidence immediately. BhumiSure must solve this at ingestion, not post-hoc.\cb1 \
\
\cb3 ## 5.1 Sources of Duplication\cb1 \
\
\cb3 - Same broker reposts the same flat as a new reel after 7 days (most common)\cb1 \
\cb3 - Different brokers list the same property (sub-broker chains)\cb1 \
\cb3 - Same reel submitted twice via different URLs (story reshare vs original)\cb1 \
\cb3 - Price change repost: broker takes down old reel, posts new one with revised rent\cb1 \
\
\cb3 ## 5.2 Deduplication Architecture\cb1 \
\
\cb3 ### Layer 1 - Exact URL Match\cb1 \
\
\cb3 Before any processing, check if the reel URL (canonical, after redirect resolution) already exists in the DB. If yes, route to the Update flow, not the Create flow. Block duplicate submissions silently.\cb1 \
\
\cb3 ### Layer 2 - Content Hash (Structural Fingerprint)\cb1 \
\
\cb3 Generate a composite hash from normalised values of: \\[locality_slug + bhk_type + rent_bucket + broker_contact_normalised\\]. A 'rent bucket' rounds rent to the nearest \uc0\u8377 1,000 to absorb minor variations.\cb1 \
\
\cb3 **Hash Logic Example**\cb1 \
\
\cb3 Listing A: Vijay Nagar | 1BHK | \uc0\u8377 12,500 | 9826XXXXXX \u8594  hash('vijay_nagar:1bhk:12000:9826XXXXXX')\cb1 \
\
\cb3 Listing B (repost): Vijay Nagar | 1BHK | \uc0\u8377 13,000 | 9826XXXXXX \u8594  hash('vijay_nagar:1bhk:13000:9826XXXXXX')\cb1 \
\
\cb3 \uc0\u8594  Different hashes. Route Listing B to 'Possible Repost' queue for operator review.\cb1 \
\
\cb3 Operator confirms: mark Listing A as 'Repriced' \uc0\u8594  auto-archive A, activate B with price history.\cb1 \
\
\cb3 ### Layer 3 - Visual Similarity (Phase 2)\cb1 \
\
\cb3 Use frame-level perceptual hashing (pHash) on video keyframes to detect same-property reposts even when broker contact or rent has changed. Flag for human review with similarity score. Not required for MVP but should be architected from Day 1.\cb1 \
\
\cb3 ## 5.3 Duplicate Resolution Decision Tree\cb1 \
\
\cb3 | **Scenario**                                   | **System Action**                                                          |\cb1 \
\cb3 | ---------------------------------------------- | -------------------------------------------------------------------------- |\cb1 \
\cb3 | Exact URL match                                | Block. Show 'Already exists' with link to existing listing                 |\cb1 \
\cb3 | Same structural hash, same rent                | Block. Route to existing listing; trigger 'Repost detected' alert to owner |\cb1 \
\cb3 | Same structural hash, different rent (\'b1\uc0\u8377 2k)    | Queue as 'Repriced Repost' - operator reviews; archive old on confirm      |\cb1 \
\cb3 | Same broker contact, same locality, new reel   | Flag as 'Possible duplicate' - operator sees both side-by-side             |\cb1 \
\cb3 | Different broker, same property (visual match) | Phase 2 feature. MVP: allow; add source tag 'Multi-listed'                 |\cb1 \
\
\cb3 # 6\\. Listing Data Lifecycle System\cb1 \
\
\cb3 Stale listings are the second trust-killer. BhumiSure must be obsessive about data freshness. The lifecycle system ensures every listing is either current, updated, or cleanly retired.\cb1 \
\
\cb3 ## 6.1 Listing Status State Machine\cb1 \
\
\cb3 | **DRAFT** | **ACTIVE** | **EXPIRING SOON** | **EXPIRED** | **RENTED** | **ARCHIVED** |\cb1 \
\cb3 | --------- | ---------- | ----------------- | ----------- | ---------- | ------------ |\cb1 \
\
\cb3 | **Status**    | **Visible to Renters?**         | **Trigger**                             | **Action Required**                      |\cb1 \
\cb3 | ------------- | ------------------------------- | --------------------------------------- | ---------------------------------------- |\cb1 \
\cb3 | DRAFT         | No                              | Ingestion started, not submitted        | Operator submits                         |\cb1 \
\cb3 | ACTIVE        | Yes                             | Operator submits / Broker confirms      | None                                     |\cb1 \
\cb3 | EXPIRING SOON | Yes - with badge                | 7 days before expiry_date               | Broker/operator confirms still available |\cb1 \
\cb3 | EXPIRED       | No                              | expiry_date passed with no confirmation | Broker renews or listing archives        |\cb1 \
\cb3 | RENTED        | No - moved to 'Recently Rented' | Broker/operator marks as rented         | None                                     |\cb1 \
\cb3 | ARCHIVED      | No                              | Manual archive or 30 days post-expiry   | None                                     |\cb1 \
\
\cb3 ## 6.2 Lifecycle Events - Detailed\cb1 \
\
\cb3 ### 6.2.1 Expiry\cb1 \
\
\cb3 - Default TTL: 45 days from created_at\cb1 \
\cb3 - At T-7 days: system sends WhatsApp message to broker contact \uc0\u8594  'Your listing for \\[address\\] expires in 7 days. Reply YES to keep it active, or tap the link to update.'\cb1 \
\cb3 - At T-0: if no response \uc0\u8594  status changes to EXPIRED \u8594  removed from search index \u8594  retained in DB\cb1 \
\cb3 - Broker can renew with 1 tap \uc0\u8594  expiry_date extended by 30 days \u8594  last_verified_at updated\cb1 \
\
\cb3 ### 6.2.2 Price Change\cb1 \
\
\cb3 - Broker (or operator) edits rent field on existing listing \uc0\u8594  price_history\\[\\] array appended\cb1 \
\cb3 - Price change logged with: old_price | new_price | changed_at | changed_by\cb1 \
\cb3 - Listing card shows: '\uc0\u8377 12,000/mo - Updated 3 days ago' to signal freshness\cb1 \
\cb3 - If new reel is submitted for same property with new price \uc0\u8594  route to Repriced Repost flow (Section 5)\cb1 \
\
\cb3 ### 6.2.3 Rented / Taken\cb1 \
\
\cb3 - Broker taps 'Mark as Rented' in dashboard OR operator marks it\cb1 \
\cb3 - Status \uc0\u8594  RENTED. Listing removed from active search immediately.\cb1 \
\cb3 - Retained in 'Recently Rented' data layer - used for B2B market data (Section 8)\cb1 \
\cb3 - System records: rented_at timestamp, days_to_rent (created_at \uc0\u8594  rented_at), final_rent\cb1 \
\cb3 - Broker receives: 'Listing closed. It took X days and Y enquiries. Post a new one?' with direct link\cb1 \
\
\cb3 ### 6.2.4 Repost Detection\cb1 \
\
\cb3 - If a new reel is submitted by same broker_contact within 60 days \uc0\u8594  trigger dedup check (Section 5)\cb1 \
\cb3 - If confirmed as repost of an active listing \uc0\u8594  block and notify\cb1 \
\cb3 - If confirmed as repost of a RENTED listing \uc0\u8594  treat as new, distinct listing. Property is available again.\cb1 \
\cb3 - If confirmed as repost of an EXPIRED listing \uc0\u8594  reactivate with new expiry, update reel_url to new one\cb1 \
\
\cb3 ## 6.3 Automated Freshness Signals\cb1 \
\
\cb3 Renters should never see a listing and wonder 'is this still available?' The following signals are displayed on every listing card:\cb1 \
\
\cb3 | **Signal**                 | **Display Logic**                                                         |\cb1 \
\cb3 | -------------------------- | ------------------------------------------------------------------------- |\cb1 \
\cb3 | 'Listed X days ago'        | created_at delta from today                                               |\cb1 \
\cb3 | 'Verified X days ago'      | last_verified_at delta; shown only if < 30 days                           |\cb1 \
\cb3 | 'Price updated X days ago' | last_price_change delta; shown only if < 60 days                          |\cb1 \
\cb3 | '\uc0\u9889  Just Listed'           | Badge shown for listings < 3 days old                                     |\cb1 \
\cb3 | '\uc0\u9888 \u65039  Expiring Soon'         | Badge shown for listings with < 7 days to expiry; prompts broker to renew |\cb1 \
\
\cb3 # 7\\. User-Facing Product (Renter Experience)\cb1 \
\
\cb3 ## 7.1 Search & Discovery\cb1 \
\
\cb3 The renter experience is a structured search - not a feed. The homepage presents a search interface, not a scroll.\cb1 \
\
\cb3 | **Filter**      | **Type**                 | **Values**                                                |\cb1 \
\cb3 | --------------- | ------------------------ | --------------------------------------------------------- |\cb1 \
\cb3 | City / Locality | Multi-select with search | Indore \uc0\u8594  Vijay Nagar, Scheme 54, Palasia\'85                 |\cb1 \
\cb3 | Property Type   | Single-select            | 1BHK, 2BHK, 3BHK, PG, Studio, Room                        |\cb1 \
\cb3 | Budget          | Range slider             | \uc0\u8377 3,000 - \u8377 40,000                                          |\cb1 \
\cb3 | Preferred For   | Single-select            | Family, Bachelor, Girls, Boys, Any                        |\cb1 \
\cb3 | Furnishing      | Multi-select             | Bare Shell, Semi, Fully Furnished                         |\cb1 \
\cb3 | Available From  | Date picker              | Immediate / Specific date                                 |\cb1 \
\cb3 | Sort By         | Dropdown                 | Newest First (default), Rent: Low\uc0\u8594 High, Verified Recently |\cb1 \
\
\cb3 ## 7.2 Listing Card - Design Requirements\cb1 \
\
\cb3 The listing card is the primary trust surface. It must answer: Is this real? Is this current? Can I act right now? - in under 5 seconds.\cb1 \
\
\cb3 **Listing Card Must-Have Elements**\cb1 \
\
\cb3 \uc0\u55356 \u57260  Embedded video reel (autoplay muted in feed; full audio on tap)\cb1 \
\
\cb3 \uc0\u55357 \u56525  Locality + approx distance from searched area\cb1 \
\
\cb3 \uc0\u55357 \u56496  Monthly rent - bold, prominent\cb1 \
\
\cb3 \uc0\u55356 \u57312  Type + Floor + Furnishing in one line\cb1 \
\
\cb3 \uc0\u55357 \u56517  'Listed X days ago' + 'Verified X days ago' freshness signals\cb1 \
\
\cb3 \uc0\u55357 \u56420  Broker name + profile photo (scraped from Instagram)\cb1 \
\
\cb3 \uc0\u55357 \u56542  \\[Call\\] button + \\[WhatsApp\\] button - direct action, no interstitial\cb1 \
\
\cb3 \uc0\u55357 \u56598  \\[Save\\] bookmark - requires free account signup\cb1 \
\
\cb3 ## 7.3 Trust Architecture - The 3 Layers\cb1 \
\
\cb3 - Visual Proof: The reel shows the real flat. No stock photos. This alone is a 10x improvement over text-only listings on 99acres.\cb1 \
\cb3 - Data Freshness: Every card shows when it was listed and last verified. Old = flagged. Expired = hidden.\cb1 \
\cb3 - Direct Contact: No lead form. No interstitial. The broker's number is on the card. Tap to call or WhatsApp. Renters know someone is reachable.\cb1 \
\
\cb3 ## 7.4 Broker Claim Flow\cb1 \
\
\cb3 When a broker's reel is on BhumiSure (via Stage 0 ingestion), they can claim the listing to take ownership.\cb1 \
\
\cb3 - Broker sees their reel on BhumiSure (via Instagram story tag or word of mouth)\cb1 \
\cb3 - Taps 'Are you the owner of this listing?' \uc0\u8594  OTP sent to the phone number on the listing\cb1 \
\cb3 - On OTP verification \uc0\u8594  listing ownership transferred to broker's account\cb1 \
\cb3 - Broker can now: edit details, mark as rented, renew, change price\cb1 \
\cb3 - Broker's dashboard shows: total views, enquiry count, WhatsApp taps per listing\cb1 \
\
\cb3 # 8\\. Core Data Model\cb1 \
\
\cb3 ## 8.1 Listing Schema\cb1 \
\
\cb3 | **Field**            | **Type**     | **Required** | **Notes**                                              |\cb1 \
\cb3 | -------------------- | ------------ | ------------ | ------------------------------------------------------ |\cb1 \
\cb3 | **listing_id**       | UUID         | System       | Auto-generated                                         |\cb1 \
\cb3 | **reel_url**         | String       | Yes          | Canonical URL; used for dedup Layer 1                  |\cb1 \
\cb3 | **instagram_handle** | String       | Auto         | Parsed from URL                                        |\cb1 \
\cb3 | **property_type**    | Enum         | Yes          | 1BHK\\|2BHK\\|3BHK\\|PG\\|Studio\\|Room                     |\cb1 \
\cb3 | **locality**         | String+Geo   | Yes          | Normalised to locality_slug                            |\cb1 \
\cb3 | **rent_monthly**     | Integer      | Yes          | In INR                                                 |\cb1 \
\cb3 | **price_history**    | JSON Array   | System       | \\[\{amount, changed_at, changed_by\}\\]                   |\cb1 \
\cb3 | **furnishing**       | Enum         | No           | Bare\\|Semi\\|Full                                       |\cb1 \
\cb3 | **floor**            | Integer      | No           | 0=Ground                                               |\cb1 \
\cb3 | **amenities**        | String Array | No           | \\['parking','lift','ac'\\]                              |\cb1 \
\cb3 | **preferred_tenant** | Enum         | No           | Family\\|Bachelor\\|Girls\\|Boys\\|Any                     |\cb1 \
\cb3 | **available_from**   | Date         | No           | Defaults to created_at                                 |\cb1 \
\cb3 | **broker_name**      | String       | Yes          | Required for display                                   |\cb1 \
\cb3 | **broker_phone**     | String       | Yes          | Normalised E.164                                       |\cb1 \
\cb3 | **broker_instagram** | String       | No           | For claim flow                                         |\cb1 \
\cb3 | **status**           | Enum         | System       | Draft\\|Active\\|ExpiringSoon\\|Expired\\|Rented\\|Archived |\cb1 \
\cb3 | **created_at**       | Timestamp    | System       | UTC                                                    |\cb1 \
\cb3 | **expiry_date**      | Date         | System       | created_at + 45 days                                   |\cb1 \
\cb3 | **last_verified_at** | Timestamp    | System       | Updated on broker confirmation                         |\cb1 \
\cb3 | **rented_at**        | Timestamp    | System       | Set on 'Mark as Rented'                                |\cb1 \
\cb3 | **days_to_rent**     | Integer      | System       | Computed: rented_at \uc0\u8722  created_at                       |\cb1 \
\cb3 | **dedup_hash**       | String       | System       | SHA256 of normalised fingerprint                       |\cb1 \
\cb3 | **confidence_score** | Integer      | System       | 0-100 from AI pipeline                                 |\cb1 \
\cb3 | **source**           | Enum         | System       | operator\\|broker_native\\|user_submitted                |\cb1 \
\cb3 | **view_count**       | Integer      | System       | Incremented on card open                               |\cb1 \
\cb3 | **enquiry_count**    | Integer      | System       | Incremented on Call/WA tap                             |\cb1 \
\
\cb3 # 9\\. Technical Architecture\cb1 \
\
\cb3 ## 9.1 Recommended Stack - MVP\cb1 \
\
\cb3 | **Layer**              | **Choice**                                                    | **Rationale**                                                           |\cb1 \
\cb3 | ---------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |\cb1 \
\cb3 | Frontend               | Next.js 14 (App Router)                                       | SEO-critical for listing pages; fast mobile web; single repo            |\cb1 \
\cb3 | Backend / API          | Node.js + Fastify or Python FastAPI                           | Fast to build; Python preferred if AI pipeline is heavy                 |\cb1 \
\cb3 | Database               | PostgreSQL (Supabase hosted)                                  | Structured schema; full-text search; row-level security for broker auth |\cb1 \
\cb3 | Search                 | Postgres + pgvector (MVP) \uc0\u8594  Typesense (Scale)                 | Avoid Elasticsearch complexity at MVP; upgrade path clear               |\cb1 \
\cb3 | Video Storage          | Embed Instagram iframe (MVP) \uc0\u8594  R2/Cloudflare Stream (Stage 2) | Zero storage cost at MVP; own the video at Stage 2                      |\cb1 \
\cb3 | AI Pipeline            | OpenAI Whisper (STT) + GPT-4o Vision + Claude (extraction)    | Best-in-class multimodal; cost-effective at 200 listings/month          |\cb1 \
\cb3 | Auth                   | Supabase Auth (OTP via SMS)                                   | Broker claim flow; no password friction                                 |\cb1 \
\cb3 | WhatsApp Notifications | Twilio WhatsApp API or Interakt                               | Broker expiry alerts; renewal nudges                                    |\cb1 \
\cb3 | Hosting                | Vercel (frontend) + Supabase (backend)                        | Zero DevOps for MVP; scales to 10k listings without change              |\cb1 \
\cb3 | Analytics              | PostHog (self-hosted or cloud)                                | Funnel analysis; 3-click trust test measurement                         |\cb1 \
\
\cb3 ## 9.2 AI Ingestion Pipeline - Detailed\cb1 \
\
\cb3 The pipeline runs as an async job queue. Target: < 90 seconds from URL paste to pre-filled form ready for operator review.\cb1 \
\
\cb3 - URL normalisation: resolve short links, strip tracking params, extract canonical reel ID\cb1 \
\cb3 - Metadata fetch: Instagram oEmbed API \uc0\u8594  caption text, hashtags, timestamp, author handle\cb1 \
\cb3 - Video download: temporary buffer only (not stored) for AI processing\cb1 \
\cb3 - Speech-to-text: Whisper API on audio track \uc0\u8594  raw transcript\cb1 \
\cb3 - Visual analysis: GPT-4o Vision on 5 keyframes \uc0\u8594  room type, furnishing level, amenity detection\cb1 \
\cb3 - Entity extraction: Combined prompt \uc0\u8594  structured JSON with all listing fields + confidence per field\cb1 \
\cb3 - Locality resolution: Fuzzy match extracted place names against locality dictionary for Indore\cb1 \
\cb3 - Dedup check: Run Layer 1 + Layer 2 checks before presenting form\cb1 \
\cb3 - Form population: Return structured JSON to frontend \uc0\u8594  populate editable form\cb1 \
\
\cb3 ## 9.3 Performance Targets - MVP\cb1 \
\
\cb3 | **Metric**                          | **Target**                           |\cb1 \
\cb3 | ----------------------------------- | ------------------------------------ |\cb1 \
\cb3 | Search results load time            | < 1.5 seconds (mobile 4G)            |\cb1 \
\cb3 | Listing card open time              | < 1 second                           |\cb1 \
\cb3 | Reel ingestion pipeline             | < 90 seconds end-to-end              |\cb1 \
\cb3 | AI extraction accuracy (rent + BHK) | \\> 85% correct without operator edit |\cb1 \
\cb3 | Uptime                              | 99.5% (Vercel + Supabase SLAs)       |\cb1 \
\cb3 | Mobile Core Web Vitals (LCP)        | < 2.5 seconds                        |\cb1 \
\
\cb3 # 10\\. MVP Launch Plan - 90-Day Roadmap\cb1 \
\
\cb3 ## Phase 0: Foundation (Weeks 1-3)\cb1 \
\
\cb3 - Register bhumisure.in domain + basic landing page ('Coming Soon' + email capture)\cb1 \
\cb3 - Set up Supabase DB with full listing schema (build for scale from Day 1)\cb1 \
\cb3 - Build internal ingestion dashboard - URL paste \uc0\u8594  AI pipeline \u8594  editable form \u8594  submit\cb1 \
\cb3 - Hire 2 ops people in Indore familiar with local broker landscape\cb1 \
\cb3 - Define Indore locality dictionary (50 micro-localities, normalised slugs)\cb1 \
\
\cb3 ## Phase 1: Supply Build (Weeks 4-7)\cb1 \
\
\cb3 - Ops team begins manual reel discovery: target 10 new listings per day\cb1 \
\cb3 - Refine AI extraction accuracy based on Indore-specific speech patterns\cb1 \
\cb3 - Build dedup pipeline - test against first 100 listings\cb1 \
\cb3 - Internal QA: every listing reviewed for trust quality (video loads, contact works, data accurate)\cb1 \
\cb3 - Target: 200 active listings by end of Week 7\cb1 \
\
\cb3 ## Phase 2: Consumer Launch (Weeks 8-10)\cb1 \
\
\cb3 - Launch bhumisure.in - search + listing cards (mobile web first)\cb1 \
\cb3 - Soft launch: share in Indore Facebook groups, Reddit r/Indore, WhatsApp relocation groups\cb1 \
\cb3 - Track the 3-click trust test: measure drop-off at each step via PostHog\cb1 \
\cb3 - Set up broker claim flow - begin outreach to top 20 brokers on platform\cb1 \
\
\cb3 ## Phase 3: Validate & Iterate (Weeks 11-13)\cb1 \
\
\cb3 - Interview 20 renters: 'Did you trust what you saw? Did you contact the broker?'\cb1 \
\cb3 - Interview 10 brokers: 'Did you get leads? Would you post here natively?'\cb1 \
\cb3 - Measure: listings with video vs without \uc0\u8594  enquiry rate delta\cb1 \
\cb3 - Fix top 3 trust-breaking issues identified in user interviews\cb1 \
\cb3 - Decision gate: If > 30% of listing viewers tap Call/WhatsApp \uc0\u8594  proceed to City 2\cb1 \
\
\cb3 ## 10.1 Success Metrics - MVP Scorecard\cb1 \
\
\cb3 | **Metric**                          | **Target**                 | **Why It Matters**                           |\cb1 \
\cb3 | ----------------------------------- | -------------------------- | -------------------------------------------- |\cb1 \
\cb3 | Active listings at launch           | 200                        | Minimum viable density for Indore            |\cb1 \
\cb3 | Listings with all Required fields   | \\> 95%                     | Trust integrity - incomplete listings hidden |\cb1 \
\cb3 | Listing freshness (< 30 days old)   | \\> 80% of active listings  | Trust signal - stale = dead platform         |\cb1 \
\cb3 | Search \uc0\u8594  listing open rate          | \\> 50%                     | Discovery is working                         |\cb1 \
\cb3 | Listing open \uc0\u8594  Call/WA tap rate     | \\> 30%                     | Trust is working - this is THE metric        |\cb1 \
\cb3 | Duplicate rate in DB                | < 2%                       | Dedup pipeline is working                    |\cb1 \
\cb3 | Broker claim rate (after 60 days)   | \\> 25% of listings claimed | Organic supply pull is working               |\cb1 \
\cb3 | Expired listings removed within 24h | 100%                       | Lifecycle hygiene                            |\cb1 \
\
\cb3 # 11\\. Risks & Mitigations\cb1 \
\
\cb3 | **Risk**                                  | **Severity** | **Mitigation**                                                                                                                |\cb1 \
\cb3 | ----------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------- |\cb1 \
\cb3 | Instagram scraping violates Meta ToS      | High         | Stage 0: manual link submission only. No automated scraping. Transition to native broker posting by Month 4.                  |\cb1 \
\cb3 | Broker resists platform adoption          | Medium       | Lead with value: show them their reel is already on BhumiSure with real view data. Make claim effortless.                     |\cb1 \
\cb3 | AI extraction accuracy < 80%              | Medium       | Human review layer is mandatory for MVP. Every listing reviewed before going live. Accuracy improves as Indore corpus builds. |\cb1 \
\cb3 | Listings go stale / brokers don't respond | High         | WhatsApp renewal nudges at T-7. Aggressive auto-expiry. 'Freshness score' visible to ops team.                                |\cb1 \
\cb3 | Competitor copies the model               | Medium       | City density is the moat. Own Indore so completely (500+ listings, all brokers known) that copying is pointless.              |\cb1 \
\cb3 | Low renter discovery (traffic problem)    | Medium       | Hyper-local SEO ('1BHK for rent in Vijay Nagar Indore') + WhatsApp group distribution. Not a paid ads story at MVP.           |\cb1 \
\
\cb3 # 12\\. Monetisation Roadmap\cb1 \
\
\cb3 **Monetisation Principle**\cb1 \
\
\cb3 Renters always search and contact for free.\cb1 \
\
\cb3 Brokers get basic listing (1 active at a time) for free.\cb1 \
\
\cb3 Monetise at the point of value: leads, visibility, and data.\cb1 \
\
\cb3 | **Revenue Stream**      | **Who Pays**                      | **Model**                                                                         | **When to Activate**           |\cb1 \
\cb3 | ----------------------- | --------------------------------- | --------------------------------------------------------------------------------- | ------------------------------ |\cb1 \
\cb3 | Broker Pro Subscription | Broker                            | \uc0\u8377 499-\u8377 999/mo - unlimited listings, priority placement, lead analytics             | Month 4, post trust validation |\cb1 \
\cb3 | Featured Listing        | Broker/Builder                    | \uc0\u8377 199 per listing/week - top of search results                                     | Month 4                        |\cb1 \
\cb3 | Lead Pack               | Broker                            | Pay-per-lead for premium enquiries (verified phone + intent)                      | Month 6                        |\cb1 \
\cb3 | B2B Market Intelligence | Builders, Relocation firms, Banks | Monthly data report - demand clusters, price benchmarks, days-to-rent by locality | Month 9                        |\cb1 \
\cb3 | Relocation Partnerships | Corporate HR / Relocation firms   | Per-employee assisted search - curated shortlist delivered                        | Year 2                         |\cb1 \
\
\cb3 # 13\\. Open Questions - Founder Decisions Required\cb1 \
\
\cb3 | **Question**                                                                 | **Options**                                                                                     | **Deadline** |\cb1 \
\cb3 | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------ |\cb1 \
\cb3 | Do we allow user-submitted reels (anyone can submit) at launch, or ops-only? | Ops-only = quality control. Open = faster supply. Recommend: Ops-only for first 200, then open. | Week 1       |\cb1 \
\cb3 | What is the expiry TTL? 30 days vs 45 days vs 60 days?                       | Shorter = fresher but more ops burden. Recommend: 45 days with WhatsApp renewal at T-7.         | Week 2       |\cb1 \
\cb3 | Do we show broker phone number directly, or gate behind free account signup? | Direct = best UX. Gated = leads database. Recommend: Direct for MVP; gate at 500 listings.      | Week 2       |\cb1 \
\cb3 | Which AI provider for extraction pipeline? Cost vs accuracy tradeoff?        | GPT-4o: best accuracy, \uc0\u8377 2-4 per reel. Gemini Flash: cheaper, slightly lower accuracy.           | Week 3       |\cb1 \
\cb3 | Do we build iOS/Android app for MVP or mobile web only?                      | Mobile web = faster, SEO benefits, lower cost. Recommend: Mobile web only for 6 months.         | Week 1       |\cb1 \
\
\cb3 # Appendix A - Indore Locality Dictionary (Starter List)\cb1 \
\
\cb3 The following micro-localities form the initial taxonomy. All locality strings extracted by AI are fuzzy-matched against this list before storage.\cb1 \
\
\cb3 | **Zone**         | **Key Localities**                                    |\cb1 \
\cb3 | ---------------- | ----------------------------------------------------- |\cb1 \
\cb3 | West Indore      | Vijay Nagar, Scheme 54, Scheme 78, AB Road, Bhawarkua |\cb1 \
\cb3 | Central Indore   | Palasia, MG Road, Rajwada, Sarafa, Chhawni            |\cb1 \
\cb3 | South Indore     | Rau, Tejaji Nagar, Kanadiya, LIG Colony, Lasudia      |\cb1 \
\cb3 | North Indore     | Sindhi Colony, Bengali Square, Mhow Naka, Dewas Naka  |\cb1 \
\cb3 | East Indore      | Nipania, Aerodrome, Bicholi Mardana, Pardesipura      |\cb1 \
\cb3 | New Developments | Super Corridor, IIM Road, Bypass Road, Ring Road      |\cb1 \
\
\cb3 # Appendix B - AI Extraction Prompt Template (v1)\cb1 \
\
\cb3 The following is the base system prompt for the entity extraction step of the ingestion pipeline. Iterate on this as Indore-specific corpus grows.\cb1 \
\
\cb3 You are a real estate data extraction assistant for BhumiSure, an Indian property platform.\cb1 \
\
\cb3 Given a transcript and/or video frames from an Instagram Reel posted by a property broker or landlord,\cb1 \
\
\cb3 extract the following fields as a JSON object. All monetary values in INR integers.\cb1 \
\
\cb3 If a field cannot be determined with > 60% confidence, set it to null.\cb1 \
\
\cb3 Fields: property_type, rent_monthly, locality, furnishing, floor,\cb1 \
\
\cb3 amenities (array), preferred_tenant, available_from (ISO date or null),\cb1 \
\
\cb3 broker_name, broker_phone, confidence_score (0-100 overall)\cb1 \
\
\cb3 Locality must be a place in Indore, Madhya Pradesh. Common variations:\cb1 \
\
\cb3 "VN" = Vijay Nagar, "S54" = Scheme 54, "teen hazar" = 3000\cb1 \
\
\cb3 Return ONLY valid JSON. No explanation text.\
}