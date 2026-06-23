import { adminSupabase } from '../supabase/admin'
import { ExtractionResult, IngestionStatus } from '@/types/ingestion'
import { extractFieldsFromText } from './extract-fields'
import { checkDuplicates } from './dedup'
import { buildTranscriptFromReel, cleanupReelTemp, fetchReelContent } from './transcribe'

export async function updateJobStatus(
  jobId: string,
  status: IngestionStatus,
  progress: number,
  stepLabel?: string,
  result?: ExtractionResult | Record<string, unknown> | null,
  errorLog?: string
) {
  const { error } = await adminSupabase
    .from('ingestion_jobs')
    .update({
      status,
      progress,
      step_label: stepLabel,
      result,
      error_log: errorLog,
      updated_at: new Date().toISOString(),
      completed_at: status === 'completed' || status === 'failed' ? new Date().toISOString() : null,
    })
    .eq('id', jobId)

  if (error) {
    console.error(`[AI Pipeline] Failed to update job ${jobId}:`, error)
  }
}

export async function runIngestionPipeline(
  jobId: string,
  reelUrl: string,
  manualTranscript?: string | null
) {
  let tmpDir: string | null = null

  try {
    await updateJobStatus(jobId, 'processing', 10, 'Fetching metadata')

    let transcript = manualTranscript?.trim() || ''
    let instagramHandle: string | null = reelUrl.split('/').find((p) => p.startsWith('@')) || null

    if (!transcript) {
      await updateJobStatus(jobId, 'processing', 30, 'Downloading captions & subtitles')
      const content = await fetchReelContent(reelUrl)
      tmpDir = content.tmpDir
      instagramHandle = instagramHandle || content.instagramHandle
      transcript = buildTranscriptFromReel(content)
    }

    if (!transcript) {
      throw new Error(
        'No transcript available. Provide manual transcript, or ensure yt-dlp can fetch captions/subtitles.'
      )
    }

    await updateJobStatus(jobId, 'processing', 55, 'Extracting fields (OpenRouter)')
    const extraction = await extractFieldsFromText(transcript, instagramHandle)

    if (!extraction.has_price || !extraction.has_location) {
      await updateJobStatus(
        jobId,
        'failed',
        100,
        'Rejected: Missing price or location',
        extraction,
        'Anti-spam filter triggered'
      )
      return
    }

    await updateJobStatus(jobId, 'processing', 80, 'Checking duplicates')
    const dedup = await checkDuplicates(extraction, reelUrl)

    if (dedup.scenario === 'exact_duplicate') {
      await updateJobStatus(
        jobId,
        'failed',
        100,
        'Rejected: Exact duplicate',
        { ...extraction, dedup_info: dedup },
        `Matching listing: ${dedup.existing_listing_id}`
      )
      return
    }

    await updateJobStatus(
      jobId,
      'completed',
      100,
      dedup.scenario === 'repriced_repost' ? 'Repriced repost detected' : 'Ready for review',
      { ...extraction, dedup_info: dedup, reel_url: reelUrl }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown pipeline error'
    console.error(`[AI Pipeline] Pipeline failed for job ${jobId}:`, error)
    await updateJobStatus(jobId, 'failed', 100, 'Error in pipeline', null, message)
  } finally {
    if (tmpDir) cleanupReelTemp(tmpDir)
  }
}