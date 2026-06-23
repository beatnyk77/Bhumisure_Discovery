import { adminSupabase } from '../src/lib/supabase/admin'
import { runIngestionPipeline } from '../src/lib/ai/pipeline'

async function main() {
  const jobId = process.argv[2]

  if (jobId) {
    const { data: job, error } = await adminSupabase
      .from('ingestion_jobs')
      .select('id, reel_url, manual_transcript')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      console.error('[RunOnce] Job not found:', jobId)
      process.exit(1)
    }

    await adminSupabase
      .from('ingestion_jobs')
      .update({ status: 'processing', step_label: 'Manual run-once' })
      .eq('id', job.id)

    await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)
    process.exit(0)
  }

  const { data: jobs } = await adminSupabase
    .from('ingestion_jobs')
    .select('id, reel_url, manual_transcript')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1)

  const job = jobs?.[0]
  if (!job) {
    console.log('[RunOnce] No pending jobs')
    process.exit(0)
  }

  await adminSupabase
    .from('ingestion_jobs')
    .update({ status: 'processing', step_label: 'Manual run-once' })
    .eq('id', job.id)

  await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)
  process.exit(0)
}

main().catch((err) => {
  console.error('[RunOnce] Failed:', err)
  process.exit(1)
})