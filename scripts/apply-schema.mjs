/**
 * Applies lib/ledger/schema.sql to whatever DATABASE_URL points at.
 *
 * Uses the Neon driver rather than psql, so it works without a local Postgres
 * client installed. Statements are idempotent (CREATE TABLE IF NOT EXISTS), so
 * running this twice is safe.
 *
 *   node --env-file=.env scripts/apply-schema.mjs
 *
 * The connection string is read from the environment and never printed.
 */
import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Add it to .env, then re-run with --env-file=.env')
  process.exit(1)
}

const sql = neon(url)
const files = ['../lib/ledger/schema.sql', '../lib/ledger/limits.sql']
const source = files
  .map((f) => readFileSync(new URL(f, import.meta.url), 'utf8'))
  .join('\n')

// Split on semicolons at end of line, ignoring comment-only fragments.
const statements = source
  .split(/;\s*$/m)
  .map((s) => s.trim())
  .filter((s) => s && !s.split('\n').every((l) => l.trim().startsWith('--') || !l.trim()))

console.log(`applying ${statements.length} statements`)
for (const statement of statements) {
  const label = statement.split('\n').find((l) => l.trim() && !l.trim().startsWith('--')) ?? ''
  await sql.query(statement)
  console.log(`  ok  ${label.trim().slice(0, 60)}`)
}

const [{ count }] = await sql`SELECT count(*)::int AS count FROM calls`
console.log(`\ncalls table reachable, ${count} rows`)
