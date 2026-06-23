import { createClient } from '@supabase/supabase-js'

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function check(label: string, fn: () => Promise<void>) {
  try {
    await fn()
    console.log(`✅ ${label}`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log(`❌ ${label} — ${msg}`)
  }
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log('\n=== BhumiSure Launch Readiness Check ===\n')

  await check('Env: Supabase URL', async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error('missing')
  })
  await check('Env: OpenRouter key', async () => {
    if (!process.env.OPENROUTER_API_KEY) throw new Error('missing')
  })
  await check('Env: SerpAPI key', async () => {
    if (!process.env.SERPAPI_KEY) throw new Error('missing')
  })
  await check('Env: Cron secret', async () => {
    if (!process.env.CRON_SECRET || process.env.CRON_SECRET === 'change-me-before-deploy') {
      throw new Error('set a real CRON_SECRET before public launch')
    }
  })
  await check('Env: Admin password', async () => {
    if (!process.env.ADMIN_PASSWORD) throw new Error('missing ADMIN_PASSWORD')
  })

  await check('DB: active listings ≥ 15', async () => {
    const { count } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    if ((count ?? 0) < 15) throw new Error(`only ${count} active`)
  })

  await check('HTTP: homepage', async () => {
    const res = await fetch(`${BASE}/`)
    if (!res.ok) throw new Error(`status ${res.status}`)
  })

  await check('HTTP: search Vijay Nagar', async () => {
    const res = await fetch(`${BASE}/indore/vijay_nagar`)
    if (!res.ok) throw new Error(`status ${res.status}`)
    const html = await res.text()
    if (!html.includes('Properties for Rent')) throw new Error('missing heading')
  })

  await check('HTTP: admin ingest redirects to login', async () => {
    const res = await fetch(`${BASE}/admin/ingest`, { redirect: 'manual' })
    if (res.status !== 307 && res.status !== 302) throw new Error(`expected redirect, got ${res.status}`)
  })

  await check('API: ingest rejects unauthenticated', async () => {
    const res = await fetch(`${BASE}/api/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reelUrl: `https://www.youtube.com/shorts/verify-launch-${Date.now()}`,
        manualTranscript: '1BHK Vijay Nagar Indore rent 12500 broker 9826012345',
      }),
    })
    if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`)
  })

  await check('API: cron rejects unauthenticated', async () => {
    const res = await fetch(`${BASE}/api/cron/discover`, { method: 'POST' })
    if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`)
  })

  console.log('\n=== Gaps for public launch (manual review) ===')
  console.log('✅  Admin routes protected by ADMIN_PASSWORD login')
  console.log('✅  Search pagination: 20 per page, unlimited pages via ?page=N')
  console.log('⚠️  Broker claim flow is UI-only stub')
  console.log('⚠️  Multi-city: only Indore in CITIES registry today')
  console.log('✅  Map: OpenStreetMap + Leaflet on homepage (OSS, global-ready)\n')
}

main()