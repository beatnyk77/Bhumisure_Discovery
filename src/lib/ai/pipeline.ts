import { adminSupabase } from '../supabase/admin'
import { ExtractionResult, IngestionStatus } from '@/types/ingestion'
import { extractFieldsFromText } from './extract-fields'
import { checkDuplicates } from './dedup'

export async function updateJobStatus(
  jobId: string,
  status: IngestionStatus,
  progress: number,
  stepLabel?: string,
  result?: any,
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

export async function runIngestionPipeline(jobId: string, reelUrl: string, manualTranscript?: string) {
  try {
    await updateJobStatus(jobId, 'processing', 10, 'Fetching metadata')
    
    // Step 1: Metadata Extraction (Basic for now)
    const handle = reelUrl.split('/').find(p => p.startsWith('@')) || null
    
    let transcript = manualTranscript || ""
    
    if (!transcript) {
      await updateJobStatus(jobId, 'processing', 30, 'Transcribing audio')
      // Note: downloadReelAudio and transcribeAudio would be called here
      // For now, if no manual transcript, we fail gracefully
      throw new Error('Automated transcription requires local audio processing tools (yt-dlp). Please provide transcript manually.')
    }
    
    await updateJobStatus(jobId, 'processing', 60, 'Extracting fields')
    const extraction = await extractFieldsFromText(transcript, handle)

    // Step 2: Anti-spam check
    if (!extraction.has_price || !extraction.has_location) {
      await updateJobStatus(jobId, 'failed', 100, 'Rejected: Missing price or location', extraction, 'Anti-spam filter triggered')
      return
    }

    // Step 3: Duplicate detection
    await updateJobStatus(jobId, 'processing', 80, 'Checking duplicates')
    const dedup = await checkDuplicates(extraction, reelUrl)
    
    if (dedup.scenario === 'exact_duplicate') {
       await updateJobStatus(jobId, 'failed', 100, 'Rejected: Exact duplicate', extraction, `Matching listing: ${dedup.existing_listing_id}`)
       return
    }

    // Step 4: Success
    await updateJobStatus(jobId, 'completed', 100, dedup.scenario === 'repriced_repost' ? 'Repriced repost detected' : 'Ready for review', {
      ...extraction,
      dedup_info: dedup
    })

  } catch (error: any) {
    console.error(`[AI Pipeline] Pipeline failed for job ${jobId}:`, error)
    await updateJobStatus(jobId, 'failed', 100, 'Error in pipeline', null, error.message)
  }
}
