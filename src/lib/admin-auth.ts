import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth-edge'

export { ADMIN_COOKIE }
const ADMIN_MESSAGE = 'bhumisure-admin'

export function createAdminSessionToken(password: string): string {
  return createHmac('sha256', password).update(ADMIN_MESSAGE).digest('hex')
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !token) return false

  try {
    const expected = createAdminSessionToken(password)
    if (token.length !== expected.length) return false
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value)
}

export function setAdminSessionCookie(response: NextResponse): void {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return

  response.cookies.set(ADMIN_COOKIE, createAdminSessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearAdminSessionCookie(response: NextResponse): void {
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function requireAdminApi(req: NextRequest): NextResponse | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}