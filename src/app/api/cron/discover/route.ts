import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/cron-auth'
import { INDORE_BROKER_HANDLES } from '@/lib/discovery/broker-handles'
import { discoverFromBrokerHandles, discoverFromSerp } from '@/lib/discovery/serp'
import { promoteSourcingToIngestion, queueDiscoveredUrls } from '@/lib/discovery/queue'
import { adminSupabase } from '@/lib/supabase/admin'
import { runIngestionPipeline } from '@/lib/ai/pipeline'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const unauthorized = verifyCronSecret(req)
  if (unauthorized) return unauthorized

  try {
    const serpUrls = await discoverFromSerp()
    const handleUrls = await discoverFromBrokerHandles([...INDORE_BROKER_HANDLES])
    const queued = await queueDiscoveredUrls([...serpUrls, ...handleUrls])
    const promoted = await promoteSourcingToIngestion(3)

    const { data: pendingJobs } = await adminSupabase
      .from('ingestion_jobs')
      .select('id, reel_url, manual_transcript')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(2)

    let processed = 0
    for (const job of pendingJobs ?? []) {
      await adminSupabase
        .from('ingestion_jobs')
        .update({ status: 'processing', step_label: 'Starting pipeline' })
        .eq('id', job.id)

      await runIngestionPipeline(job.id, job.reel_url, job.manual_transcript)
      processed++
    }

    return NextResponse.json({
      discovered: serpUrls.length + handleUrls.length,
      queued,
      promoted,
      processed,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Discovery cron failed'
    console.error('[Cron Discover]', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}