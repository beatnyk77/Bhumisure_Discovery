import { NextRequest, NextResponse } from 'next/server'
import { setAdminSessionCookie } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD not configured' }, { status: 503 })
  }

  const body = await req.json()
  const submitted = body.password as string | undefined

  if (!submitted || submitted !== password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  setAdminSessionCookie(response)
  return response
}