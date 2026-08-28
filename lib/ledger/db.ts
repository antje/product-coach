import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

/**
 * The database connection, and the one place that knows whether there is one.
 *
 * Neon's driver talks HTTP rather than holding a TCP connection. That matters
 * here: a serverless function opening a real Postgres connection per invocation
 * exhausts the connection limit under any traffic at all.
 *
 * Returns null when DATABASE_URL is unset. Callers degrade and say so rather
 * than throwing, because a missing database should not take down a screen that
 * can still do most of its job. The user is told plainly that nothing was
 * saved, which is better than a 500 and much better than a UI that claims to
 * have recorded something it did not.
 */

let cached: NeonQueryFunction<false, false> | null | undefined

export function db(): NeonQueryFunction<false, false> | null {
  if (cached !== undefined) return cached
  const url = process.env.DATABASE_URL
  cached = url ? neon(url) : null
  return cached
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

/** What a caller shows the user when there is nowhere to write. */
export const NO_DATABASE_MESSAGE =
  'No database is configured, so this call was not saved. Set DATABASE_URL and run lib/ledger/schema.sql to keep a record.'
