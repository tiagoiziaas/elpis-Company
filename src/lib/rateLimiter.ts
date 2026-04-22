import { NextRequest, NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number
  firstRequest: number
  blockedUntil?: number
}

const store = new Map<string, RateLimitEntry>()

const WINDOW_MS = 15 * 60 * 1000
const MAX_LOGIN_ATTEMPTS = 5
const MAX_REGISTER_ATTEMPTS = 3
const REGISTER_WINDOW_MS = 60 * 60 * 1000
const BLOCK_DURATION_MS = 30 * 60 * 1000

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIP) return realIP.trim()
  return 'unknown'
}

function cleanup() {
  const now = Date.now()
  store.forEach((entry, key) => {
    const windowExpired = now - entry.firstRequest > REGISTER_WINDOW_MS * 2
    const blockExpired = entry.blockedUntil && now > entry.blockedUntil
    if (windowExpired || blockExpired) store.delete(key)
  })
}

export function checkLoginRateLimit(
  request: NextRequest
): NextResponse | null {
  cleanup()
  const ip = getClientIP(request)
  const key = `login:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(MAX_LOGIN_ATTEMPTS),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.blockedUntil / 1000)),
        },
      }
    )
  }

  if (!entry || now - entry.firstRequest > WINDOW_MS) {
    store.set(key, { count: 1, firstRequest: now })
    return null
  }

  entry.count++

  if (entry.count > MAX_LOGIN_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS
    store.set(key, entry)
    return NextResponse.json(
      { error: 'Conta temporariamente bloqueada. Tente em 30 minutos.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(BLOCK_DURATION_MS / 1000)),
          'X-RateLimit-Limit': String(MAX_LOGIN_ATTEMPTS),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

  store.set(key, entry)
  return null
}

export function checkRegisterRateLimit(
  request: NextRequest
): NextResponse | null {
  cleanup()
  const ip = getClientIP(request)
  const key = `register:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (entry?.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000)
    return NextResponse.json(
      { error: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      }
    )
  }

  if (!entry || now - entry.firstRequest > REGISTER_WINDOW_MS) {
    store.set(key, { count: 1, firstRequest: now })
    return null
  }

  entry.count++

  if (entry.count > MAX_REGISTER_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS
    store.set(key, entry)
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 30 minutos.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(BLOCK_DURATION_MS / 1000)),
        },
      }
    )
  }

  store.set(key, entry)
  return null
}

export function clearRateLimit(request: NextRequest, type: 'login' | 'register') {
  const ip = getClientIP(request)
  const key = `${type}:${ip}`
  store.delete(key)
}
