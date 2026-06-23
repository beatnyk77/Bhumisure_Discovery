import { adminSupabase } from '../src/lib/supabase/admin'
import { runIngestionPipeline } from '../src/lib/ai/pipeline'

const LIMIT = 15

async function main() {
  const { data: pendingJobs } = await adminSupabase
    .from('ingestion_jobs')
    .select('id, reel_url, manual_transcript')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(LIMIT)

  let completed = 0
  let failed = 0

  for (const job of pendingJobs ?? []) {
    console.log(`[Continue] ${job.reel_url}`)
    await adminSupabase
      .from('ingestion_jobs')
      .update({ status: 'processing', step_label: 'Continue ingest' })
      .eq('id', job.id)

    await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)

    const { data: updated } = await adminSupabase
      .from('ingestion_jobs')
      .select('status, step_label')
      .eq('id', job.id)
      .single()

    if (updated?.status === 'completed') completed++
    else failed++
    console.log(`  → ${updated?.status}: ${updated?.step_label}`)
  }

  console.log(`Done: ${completed} completed, ${failed} failed`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})