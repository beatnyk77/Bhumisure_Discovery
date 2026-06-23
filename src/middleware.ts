import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth-edge'

const ADMIN_MESSAGE = 'bhumisure-admin'

async function createAdminSessionToken(password: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(ADMIN_MESSAGE))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function isProtectedPath(pathname: string): boolean {
  if (pathname === '/admin/login') return false
  if (pathname === '/api/admin/login') return false
  if (pathname.startsWith('/admin')) return true
  if (pathname.startsWith('/api/admin')) return true
  if (pathname === '/api/ingest') return true
  if (pathname.startsWith('/api/ingest/')) return true
  if (pathname === '/api/listings/publish') return true
  return false
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!isProtectedPath(pathname)) return NextResponse.next()

  const password = process.env.ADMIN_PASSWORD
  if (!password) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Admin auth not configured' }, { status: 503 })
    }
    const login = new URL('/admin/login', req.url)
    login.searchParams.set('error', 'config')
    return NextResponse.redirect(login)
  }

  const cookie = req.cookies.get(ADMIN_COOKIE)?.value
  const expected = await createAdminSessionToken(password)

  if (cookie && safeEqual(cookie, expected)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const login = new URL('/admin/login', req.url)
  login.searchParams.set('next', pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/ingest', '/api/ingest/:path*', '/api/listings/publish'],
}