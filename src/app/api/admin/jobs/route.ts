import { NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { data, error } = await adminSupabase
      .from('ingestion_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ data })

  } catch (error: unknown) {
    console.error('[API Admin Jobs] Failed to fetch:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
