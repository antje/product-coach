import { cookies } from 'next/headers'

/**
 * Spend limits for a deployment anyone can reach.
 *
 * Two independent caps, because they fail differently. The per-session cap
 * stops one visitor looping the button. The daily ceiling stops many visitors,
 * or one determined one with a fresh cookie each time, from running up a bill
 * overnight while nobody is watching.
 *
 * Both are off when unset, which is what you want locally.
 *
 * The counters live in memory, so they reset on redeploy and are per instance.
 * That is deliberate for now: a real limiter belongs in the database once the
 * ledger lands, and a half-real one backed by a store that does not exist yet
 * would be worse than an honest in-memory approximation. It is a speed bump
 * sized to a demo, not a defence against a determined attacker. Deployment
 * Protection is what actually keeps strangers out.
 */

const SESSION_COOKIE = 'pc_session'

function limitFromEnv(name: string): number | null {
  const raw = process.env[name]
  if (!raw) return null
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : null
}

const reviewsBySession = new Map<string, number>()
let spendToday = 0
let spendDate = ''

export type GuardrailVerdict =
  | { allowed: true; sessionId: string }
  | { allowed: false; reason: string; retryable: boolean }

export async function checkGuardrails(): Promise<GuardrailVerdict> {
  const store = await cookies()
  let sessionId = store.get(SESSION_COOKIE)?.value

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    store.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
  }

  const dailyCeiling = limitFromEnv('DEMO_DAILY_COST_CEILING_USD')
  if (dailyCeiling != null) {
    rollDateIfNeeded()
    if (spendToday >= dailyCeiling) {
      return {
        allowed: false,
        reason:
          'This demo has reached its spending limit for today. It resets at midnight UTC. Run it locally with your own key to keep going.',
        retryable: true,
      }
    }
  }

  const perSession = limitFromEnv('DEMO_REVIEWS_PER_SESSION')
  if (perSession != null && (reviewsBySession.get(sessionId) ?? 0) >= perSession) {
    return {
      allowed: false,
      reason: `This demo allows ${perSession} reviews per visit, so you have seen what it does. Run it locally with your own key to keep going.`,
      retryable: false,
    }
  }

  return { allowed: true, sessionId }
}

/** Called after a review, with what it actually cost. */
export function recordSpend(sessionId: string, costUsd: number): void {
  rollDateIfNeeded()
  spendToday += costUsd
  reviewsBySession.set(sessionId, (reviewsBySession.get(sessionId) ?? 0) + 1)
}

function rollDateIfNeeded(): void {
  const today = new Date().toISOString().slice(0, 10)
  if (today !== spendDate) {
    spendDate = today
    spendToday = 0
    reviewsBySession.clear()
  }
}

/** For /api/health, so a deployment can say whether it is capped. */
export function guardrailStatus() {
  return {
    reviewsPerSession: limitFromEnv('DEMO_REVIEWS_PER_SESSION'),
    dailyCostCeilingUsd: limitFromEnv('DEMO_DAILY_COST_CEILING_USD'),
  }
}
