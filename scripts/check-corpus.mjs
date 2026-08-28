/**
 * Recomputes the corpus separation stated in lib/data/corpus.ts.
 *
 * The /signal-read rule applied to our own repo: any number that goes into a
 * document gets recomputed from the rows before it is believed. Run with:
 *   node scripts/check-corpus.mjs
 */
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../lib/data/corpus.ts', import.meta.url), 'utf8')

const FEELING = ['personalization', 'social-proof', 'urgency', 'incentive']
const FRICTION = ['reduce-steps', 'time-to-value', 'defaults']
const EARLY_METRICS = ['Activation rate', 'Trial conversion']

// Parse each object literal in the EXPERIMENTS array.
const rows = [...src.matchAll(/\{\s*id: '(ex-\d+)',[\s\S]*?readDate: '([\d-]+)',\s*\}/g)].map(
  ([block, id, readDate]) => ({
    id,
    readDate,
    mechanism: block.match(/mechanism: '([^']+)'/)[1],
    audience: block.match(/audience: '([^']+)'/)[1],
    primaryMetric: block.match(/primaryMetric: '([^']+)'/)[1],
    actualLiftPp: Number(block.match(/actualLiftPp: (-?[\d.]+)/)[1]),
  })
)

const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN)
const lifts = (rs) => rs.map((r) => r.actualLiftPp)

const newWsActivation = rows.filter(
  (r) => r.audience === 'new-workspaces' && r.primaryMetric === 'Activation rate'
)
const feelingEarly = newWsActivation.filter((r) => FEELING.includes(r.mechanism))
const frictionEarly = newWsActivation.filter((r) => FRICTION.includes(r.mechanism))
const feelingEstablished = rows.filter(
  (r) =>
    FEELING.includes(r.mechanism) &&
    !EARLY_METRICS.includes(r.primaryMetric) &&
    r.audience !== 'new-workspaces'
)

const f = (n) => (n >= 0 ? '+' : '') + n.toFixed(2)

console.log(`rows parsed: ${rows.length}`)
console.log(`unique ids:  ${new Set(rows.map((r) => r.id)).size}`)
console.log(`date range:  ${rows[0].readDate} → ${rows[rows.length - 1].readDate}`)
console.log()
console.log(`new-workspaces x activation, feeling-led   n=${feelingEarly.length}   mean ${f(mean(lifts(feelingEarly)))}pp`)
console.log(`new-workspaces x activation, friction-led  n=${frictionEarly.length}   mean ${f(mean(lifts(frictionEarly)))}pp`)
console.log(`established accounts, feeling-led          n=${feelingEstablished.length}    mean ${f(mean(lifts(feelingEstablished)))}pp`)
console.log()
console.log(`separation on the early funnel: ${f(mean(lifts(frictionEarly)) - mean(lifts(feelingEarly)))}pp`)

// Chronological ordering is what the backtest's as-of guard relies on.
const outOfOrder = rows.filter((r, i) => i > 0 && r.readDate < rows[i - 1].readDate)
console.log(`\nreadDate monotonically increasing: ${outOfOrder.length === 0 ? 'yes' : 'NO: ' + outOfOrder.map((r) => r.id).join(', ')}`)
