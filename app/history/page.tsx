import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { EXPERIMENTS } from '@/lib/data/corpus'

export const metadata = { title: 'Team history' }

/**
 * Every experiment the team has finished.
 *
 * A server component: the corpus is static, so there is nothing to fetch and no
 * reason to ship it twice.
 *
 * Each row carries id={experiment.id}, which is what finally makes the evidence
 * citations in a review resolve. They have always linked to #ex-0xx and that
 * anchor has never existed until now.
 */
export default function HistoryPage() {
  const ordered = [...EXPERIMENTS].reverse()

  return (
    <main className="app-shell">
      <SiteNav />
      <div className="page-wrap">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> TEAM HISTORY
            </div>
            <h1>{EXPERIMENTS.length} finished experiments.</h1>
            <p>
              What the coach reads. Replay any of them to see whether it would have objected at the
              time, using only what was known before that experiment read out.
            </p>
          </div>
        </section>

        <div className="section-label">
          <span>01</span> EVERY EXPERIMENT, NEWEST FIRST <span className="line" />
        </div>

        <div className="evidence-list history-list">
          {ordered.map((e) => (
            <div className="evidence-row history-row" key={e.id} id={e.id}>
              <div className="evidence-info">
                <strong>{e.name}</strong>
                <small>
                  {e.readDate} <span>·</span> {e.mechanism} <span>·</span> {e.audience}{' '}
                  <span>·</span> {e.outcome === 'shipped' ? 'Shipped' : e.outcome === 'not-shipped' ? 'Did not ship' : 'Inconclusive'}
                </small>
              </div>
              <div className={`result ${tone(e.actualLiftPp)}`}>
                {fmt(e.actualLiftPp)}
                <small>{e.primaryMetric}</small>
              </div>
              <Link className="replay-link" href={`/replay/${e.id}`}>
                Replay <ArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        <footer className="page-footer">
          <span>product-coach learns from your team&apos;s experiments, not the internet.</span>
          <span>
            {EXPERIMENTS.length} experiments indexed <span className="sync-dot" />
          </span>
        </footer>
      </div>
    </main>
  )
}

function tone(liftPp: number): string {
  if (liftPp <= -0.5) return 'negative'
  if (liftPp >= 2) return 'positive'
  return ''
}

function fmt(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}pp`
}
