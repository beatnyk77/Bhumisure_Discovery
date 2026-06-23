import { adminSupabase } from '@/lib/supabase/admin'
import { DiscoveredUrl, isSupportedReelUrl } from './serp'

export async function queueDiscoveredUrls(urls: DiscoveredUrl[]) {
  let inserted = 0

  for (const item of urls) {
    if (!isSupportedReelUrl(item.source_url)) continue

    const { data: existingListing } = await adminSupabase
      .from('listings')
      .select('id')
      .eq('reel_url', item.source_url)
      .maybeSingle()

    if (existingListing) continue

    const { data: existingSourcing } = await adminSupabase
      .from('sourcing_jobs')
      .select('id')
      .eq('source_url', item.source_url)
      .maybeSingle()

    if (existingSourcing) continue

    const { error } = await adminSupabase.from('sourcing_jobs').insert({
      source_url: item.source_url,
      source_type: item.source_type,
      discovery_query: item.discovery_query,
      status: 'pending',
    })

    if (!error) inserted++
  }

  return inserted
}

export async function promoteSourcingToIngestion(limit = 5) {
  const { data: pending, error } = await adminSupabase
    .from('sourcing_jobs')
    .select('*')
    .eq('status', 'pending')
    .order('discovered_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  if (!pending?.length) return 0

  let promoted = 0

  for (const job of pending) {
    const { data: existingJob } = await adminSupabase
      .from('ingestion_jobs')
      .select('id')
      .eq('reel_url', job.source_url)
      .maybeSingle()

    if (existingJob) {
      await adminSupabase
        .from('sourcing_jobs')
        .update({ status: 'ingested', ingestion_job_id: existingJob.id })
        .eq('id', job.id)
      continue
    }

    const { data: ingestionJob, error: insertError } = await adminSupabase
      .from('ingestion_jobs')
      .insert({
        reel_url: job.source_url,
        status: 'pending',
        progress: 0,
        step_label: 'Queued from discovery',
        source_type: 'discovered_url',
      })
      .select('id')
      .single()

    if (insertError || !ingestionJob) continue

    await adminSupabase
      .from('sourcing_jobs')
      .update({ status: 'ingested', ingestion_job_id: ingestionJob.id })
      .eq('id', job.id)

    promoted++
  }

  return promoted
}