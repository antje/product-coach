import { createHash } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/ledger/db'

/**
 * Spend limits for a deployment anyone can reach.
 *
 * These used to be in-memory counters keyed to a cookie. That was tested and it
 * failed: three requests sent with no cookie all succeeded, because each one
 * minted a fresh session id and the counter never applied. Every serverless
 * instance also kept its own tally, and a deploy reset them.
 *
 * They now count rows in the calls table, which is the same table every review
 * already writes to. That makes both caps shared across instances, durable
 * across deploys, and keyed to something a caller cannot simply discard.
 *
 * Two caps, because they fail differently:
 *   per caller  stops one person looping the button
 *   per day     stops many people, or one person rotating IPs, from running up
 *               a bill overnight while nobody is watching
 *
 * Both are off when unset, which is what you want locally.
 *
 * This is still not a substitute for a spend-capped key at the provider. A
 * distributed caller gets a fresh allowance per address. It raises the cost of
 * abuse from trivial to inconvenient; only Anthropic can make it bounded.
 */

const SESSION_COOKIE = 'pc_session'

function limitFromEnv(name: string): number | null {
  const raw = process.env[name]
  if (!raw) return null
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : null
}

export async function getSession(): Promise<string> {
  const store = await cookies()
  const existing = store.get(SESSION_COOKIE)?.value
  if (existing) return existing

  const fresh = crypto.randomUUID()
  store.set(SESSION_COOKIE, fresh, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  return fresh
}

/**
 * A salted hash of the caller's address, never the address itself.
 *
 * Enough to count against, not enough to read back into an IP. Vercel sets
 * x-forwarded-for; the first entry is the client, the rest are proxies.
 */
export function callerHash(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for') ?? ''
  const ip = forwarded.split(',')[0]?.trim() || 'unknown'
  const salt = process.env.WEBHOOK_SIGNING_SECRET ?? 'product-coach'
  return createHash('sha256').update(ip + salt).digest('hex').slice(0, 32)
}

export type GuardrailVerdict =
  | { allowed: true; sessionId: string; ipHash: string }
  | { allowed: false; reason: string; retryable: boolean }

export async function checkGuardrails(request: Request): Promise<GuardrailVerdict> {
  const sessionId = await getSession()
  const ipHash = callerHash(request)

  const sql = db()
  const perCaller = limitFromEnv('DEMO_REVIEWS_PER_SESSION')
  const dailyCeiling = limitFromEnv('DEMO_DAILY_COST_CEILING_USD')

  // With no database there is nowhere to count, so the caps cannot be enforced.
  // Say so rather than pretending they hold.
  if (!sql || (perCaller == null && dailyCeiling == null)) {
    return { allowed: true, sessionId, ipHash }
  }

  if (dailyCeiling != null) {
    const rows = await sql`
      SELECT COALESCE(sum(cost_usd), 0)::float AS spent
      FROM calls WHERE created_at > now() - interval '1 day'
    `
    if (Number(rows[0]?.spent ?? 0) >= dailyCeiling) {
      return {
        allowed: false,
        reason:
          'This demo has reached its spending limit for today. It resets on a rolling 24 hour window. Run it locally with your own key to keep going.',
        retryable: true,
      }
    }
  }

  if (perCaller != null) {
    const rows = await sql`
      SELECT count(*)::int AS used
      FROM calls
      WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 day'
    `
    if (Number(rows[0]?.used ?? 0) >= perCaller) {
      return {
        allowed: false,
        reason: `This demo allows ${perCaller} reviews per visitor per day, so you have seen what it does. Run it locally with your own key to keep going.`,
        retryable: false,
      }
    }
  }

  return { allowed: true, sessionId, ipHash }
}

/** For /api/health, so a deployment can say whether it is capped. */
export function guardrailStatus() {
  return {
    reviewsPerCallerPerDay: limitFromEnv('DEMO_REVIEWS_PER_SESSION'),
    dailyCostCeilingUsd: limitFromEnv('DEMO_DAILY_COST_CEILING_USD'),
    enforcedInDatabase: Boolean(process.env.DATABASE_URL),
  }
}
