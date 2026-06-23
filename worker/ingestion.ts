import { adminSupabase } from '../src/lib/supabase/admin'
import { runIngestionPipeline } from '../src/lib/ai/pipeline'

const POLL_INTERVAL_MS = 5000

async function pollJobs() {
  console.log('[Worker] Polling for pending ingestion jobs...')

  const { data: jobs, error } = await adminSupabase
    .from('ingestion_jobs')
    .select('id, reel_url, manual_transcript')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(5)

  if (error) {
    console.error('[Worker] Error polling jobs:', error)
    return
  }

  if (!jobs || jobs.length === 0) {
    return
  }

  console.log(`[Worker] Found ${jobs.length} pending jobs. Processing...`)

  for (const job of jobs) {
    console.log(`[Worker] Starting job ${job.id} for ${job.reel_url}`)
    await adminSupabase
      .from('ingestion_jobs')
      .update({ status: 'processing', step_label: 'Worker picked up job' })
      .eq('id', job.id)

    await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)
  }
}

async function main() {
  console.log('[Worker] Ingestion worker started.')

  while (true) {
    try {
      await pollJobs()
    } catch (err) {
      console.error('[Worker] Unexpected error in poll loop:', err)
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS))
  }
}

main()