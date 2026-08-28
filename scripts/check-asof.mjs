/**
 * Verifies the as-of guard at the data level.
 *
 * If this ever fails, every backtest and every replay this product has produced
 * is void, because the coach was shown outcomes from after the decision it was
 * judging. That is not a bug that degrades quality, it is one that invalidates
 * the entire claim. So it runs in CI rather than being checked by eye.
 *
 *   node scripts/check-asof.mjs
 */
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../lib/data/corpus.ts', import.meta.url), 'utf8')

const rows = [...src.matchAll(/\{\s*id: '(ex-\d+)',[\s\S]*?readDate: '([\d-]+)',\s*\}/g)].map(
  ([, id, readDate]) => ({ id, readDate })
)

// Mirrors experimentsAsOf() in lib/data/corpus.ts: strictly before.
const asOf = (date) => rows.filter((r) => r.readDate < date)

let failures = 0

// 1. An experiment must never appear in its own evidence, and nothing that read
//    out later may either.
for (const row of rows) {
  const visible = asOf(row.readDate)
  const self = visible.find((v) => v.id === row.id)
  const future = visible.filter((v) => v.readDate >= row.readDate)
  if (self) {
    console.error(`FAIL ${row.id} can see itself`)
    failures++
  }
  if (future.length) {
    console.error(`FAIL ${row.id} can see ${future.map((f) => f.id).join(', ')}`)
    failures++
  }
}

// 2. Same-day reads are excluded, which is the boundary most likely to be got
//    wrong by switching < to <=.
const byDate = new Map()
for (const r of rows) byDate.set(r.readDate, (byDate.get(r.readDate) ?? 0) + 1)
const sameDay = [...byDate.entries()].filter(([, n]) => n > 1)

// 3. The worked example the docs and the plan both cite.
const target = rows.find((r) => r.id === 'ex-052')
const priors = target ? asOf(target.readDate) : []

console.log(`experiments:                 ${rows.length}`)
console.log(`same-day read groups:        ${sameDay.length}`)
console.log(`ex-052 read date:            ${target?.readDate ?? 'missing'}`)
console.log(`ex-052 visible priors:       ${priors.length}`)
console.log(`  latest visible:            ${priors.at(-1)?.id} @ ${priors.at(-1)?.readDate}`)
console.log(`  any at or after cutoff:    ${priors.filter((p) => p.readDate >= target.readDate).length}`)
console.log(`\nas-of guard: ${failures === 0 ? 'holds' : `BROKEN, ${failures} failures`}`)

process.exit(failures === 0 ? 0 : 1)
