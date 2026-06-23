import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    const { data: job, error } = await adminSupabase
      .from('ingestion_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json(job)

  } catch (error: unknown) {
    console.error('[API Ingest Status] Failed to fetch:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
