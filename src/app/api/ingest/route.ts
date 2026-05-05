import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { reelUrl } = body

    if (!reelUrl) {
      return NextResponse.json({ error: 'reelUrl is required' }, { status: 400 })
    }

    // 1. Basic URL validation (Simple regex)
    if (!reelUrl.includes('instagram.com/reel/') && !reelUrl.includes('youtube.com/shorts/')) {
       return NextResponse.json({ error: 'Only Instagram Reels or YouTube Shorts are supported' }, { status: 400 })
    }

    // 2. Dedup Check Layer 1: Exact URL Match
    const { data: existingListing } = await adminSupabase
      .from('listings')
      .select('id')
      .eq('reel_url', reelUrl)
      .single()

    if (existingListing) {
      return NextResponse.json({ 
        error: 'Duplicate detected', 
        existingListingId: existingListing.id 
      }, { status: 409 })
    }

    // 3. Insert into ingestion_jobs
    const { data: job, error } = await adminSupabase
      .from('ingestion_jobs')
      .insert({
        reel_url: reelUrl,
        status: 'pending',
        progress: 0,
        step_label: 'Queued'
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ jobId: job.id })

  } catch (error: any) {
    console.error('[API Ingest] Failed to submit:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
