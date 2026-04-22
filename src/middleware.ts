import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'X-DNS-Prefetch-Control': 'off',
  'X-Download-Options': 'noopen',
  'X-Permitted-Cross-Domain-Policies': 'none',
}

function applySecurityHeaders(response: NextResponse): void {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
}

export default withAuth(
  function middleware(req: NextRequest) {
    const response = NextResponse.next()
    applySecurityHeaders(response)
    return response
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl

        if (pathname.startsWith('/api/professional') || pathname.startsWith('/api/financeiro') || pathname.startsWith('/api/appointments') || pathname.startsWith('/api/content') || pathname.startsWith('/api/availability') || pathname.startsWith('/api/lgpd')) {
          return !!token
        }

        if (pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/professional/:path*',
    '/api/financeiro/:path*',
    '/api/appointments/:path*',
    '/api/content/:path*',
    '/api/availability/:path*',
    '/api/lgpd/:path*',
  ],
}
