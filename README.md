# BhumiSure - Real Estate Discovery Platform 🏠

BhumiSure is a specialized real estate discovery platform built to solve the "Social Media Supply" problem. It automatically ingests property reels from Instagram/YouTube, extracts structured data using AI (GPT-4o), and presents them in a premium, searchable discovery interface.

## 🚀 Core Features

- **AI Ingestion Pipeline**: Automatically converts video transcripts and captions into structured property listings.
- **Dual-Hash Deduplication**: 
    - **Strict Hash**: Detects exact duplicates of the same listing.
    - **Loose Hash**: Identifies "repriced reposts" (same property, different price/date) to maintain a clean timeline.
- **Premium Discovery UX**: media-first search results with SEO-optimized routing (`/[city]/[locality]`).
- **Verified Contact Methods**: One-tap access to brokers via Call or WhatsApp, with automated renewal tracking.
- **Trust Layer**: Automated listing expiry (45 days) and broker ownership claim flows.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + RLS)
- **Styling**: Tailwind CSS
- **AI Engine**: OpenAI GPT-4o (Extraction) & Whisper (Transcription)
- **State Management**: Zustand & TanStack Query
- **Background Jobs**: Custom Local Workers (Polling-based)

## 📁 Project Structure

```bash
├── src/
│   ├── app/                # Next.js Routes (Discovery, Admin, API)
│   ├── components/         # UI Primitives (ListingCard, Filters)
│   ├── lib/
│   │   ├── ai/             # Extraction & Dedup Engine
│   │   └── supabase/       # Client Singletons (Admin/Server/Browser)
│   └── types/              # Domain Models
├── worker/                 # Standalone Background Workers
│   ├── ingestion.ts        # AI Pipeline Poller
│   └── lifecycle.ts        # Expiry & Hygiene Tracker
└── supabase/
    └── migrations/         # Database Schema & RLS Policies
```

## ⚙️ Setup & Installation

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 2. Database Setup
Initialize Supabase and run migrations:
```bash
npx supabase init
npx supabase start
# Migrations are automatically applied in local start
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Running the App
Start the development server:
```bash
npm run dev
```

### 5. Running Workers
The ingestion and lifecycle workers run as separate processes to avoid serverless timeout limits:
```bash
# Start Ingestion Worker (Polls DB for new reels)
npx ts-node worker/ingestion.ts

# Run Lifecycle Worker (Manual or via Cron)
npx ts-node worker/lifecycle.ts
```

## 🛡 Security (RLS)
BhumiSure implements strict Row Level Security (RLS) in Supabase:
- **Public**: Can read active listings and localities.
- **Service Role**: Used by workers for ingestion and administrative updates.
- **Brokers**: Can only update listings they have successfully "claimed" via OTP.

## 📈 Roadmap
- [ ] Native video caching & hosting.
- [ ] Automated image generation for missing thumbnails.
- [ ] Map-based discovery (Indore pilot).
- [ ] WhatsApp notification engine for leads.

---
Built by **Vibecode** for the Indore Real Estate Market.
