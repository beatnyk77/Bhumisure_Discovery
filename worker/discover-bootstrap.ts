import { INDORE_BROKER_HANDLES } from '../src/lib/discovery/broker-handles'
import { discoverAllFromSerp, discoverFromBrokerHandles } from '../src/lib/discovery/serp'
import { promoteSourcingToIngestion, queueDiscoveredUrls } from '../src/lib/discovery/queue'
import { adminSupabase } from '../src/lib/supabase/admin'
import { runIngestionPipeline } from '../src/lib/ai/pipeline'

const SERP_CALLS = 7
const HANDLE_CALLS = 10
const PROMOTE_LIMIT = 25
const INGEST_LIMIT = 20

async function main() {
  console.log('[Bootstrap] Starting full Indore discovery...')
  console.log(`[Bootstrap] Budget: ~${SERP_CALLS + HANDLE_CALLS} SerpAPI calls`)

  const serpUrls = await discoverAllFromSerp()
  console.log(`[Bootstrap] Serp queries found ${serpUrls.length} reel URLs`)

  const handleUrls = await discoverFromBrokerHandles([...INDORE_BROKER_HANDLES], HANDLE_CALLS)
  console.log(`[Bootstrap] Broker handle queries found ${handleUrls.length} reel URLs`)

  const queued = await queueDiscoveredUrls([...serpUrls, ...handleUrls])
  console.log(`[Bootstrap] Queued ${queued} new sourcing jobs`)

  let totalPromoted = 0
  while (totalPromoted < PROMOTE_LIMIT) {
    const promoted = await promoteSourcingToIngestion(10)
    if (promoted === 0) break
    totalPromoted += promoted
  }
  console.log(`[Bootstrap] Promoted ${totalPromoted} jobs to ingestion queue`)

  const { data: pendingJobs } = await adminSupabase
    .from('ingestion_jobs')
    .select('id, reel_url, manual_transcript')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(INGEST_LIMIT)

  let completed = 0
  let failed = 0

  for (const job of pendingJobs ?? []) {
    console.log(`[Bootstrap] Ingesting ${job.id} — ${job.reel_url}`)
    await adminSupabase
      .from('ingestion_jobs')
      .update({ status: 'processing', step_label: 'Bootstrap ingestion' })
      .eq('id', job.id)

    await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)

    const { data: updated } = await adminSupabase
      .from('ingestion_jobs')
      .select('status, step_label, error_log')
      .eq('id', job.id)
      .single()

    if (updated?.status === 'completed') completed++
    else failed++
    console.log(`[Bootstrap]   → ${updated?.status}: ${updated?.step_label}`)
  }

  const { count: reviewCount } = await adminSupabase
    .from('ingestion_jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .is('listing_id', null)

  const { count: activeCount } = await adminSupabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  console.log('\n[Bootstrap] Summary')
  console.log(`  Discovered URLs: ${serpUrls.length + handleUrls.length}`)
  console.log(`  New sourcing jobs: ${queued}`)
  console.log(`  Ingested: ${completed} completed, ${failed} failed`)
  console.log(`  Ready for review: ${reviewCount}`)
  console.log(`  Active listings: ${activeCount}`)
}

main().catch((err) => {
  console.error('[Bootstrap] Failed:', err)
  process.exit(1)
})