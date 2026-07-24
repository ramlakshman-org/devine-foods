import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

const PUBLIC = ['/login', '/api/auth/login', '/api/leads/submit', '/api/seed']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next()

  const token = req.cookies.get('devine_token')?.value
  const session = token ? verifyToken(token) : null

  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const headers = new Headers(req.headers)
  headers.set('x-user-id', session.id)
  headers.set('x-user-role', session.role)
  headers.set('x-user-name', session.name)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
