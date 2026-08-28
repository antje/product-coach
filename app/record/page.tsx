'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { SiteNav } from '@/components/site-nav'
import { fetchRecord, type RecordResponse } from '@/lib/client/replay'

/**
 * The scoreboard. This is the thing the product is sold on, so it is the one
 * screen that must never show a number it cannot derive from stored rows.
 */
export default function RecordPage() {
  const [data, setData] = useState<RecordResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRecord()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the record.'))
  }, [])

  const record = data?.record
  const hitRatePct = record?.hitRate == null ? null : Math.round(record.hitRate * 100)

  return (
    <main className="app-shell">
      <SiteNav />
      <div className="page-wrap">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> THE RECORD
            </div>
            <h1>Every call, and whether it held up.</h1>
            <p>
              The coach is graded on its own objections. A decline is counted but never scored,
              because it made no prediction to check.
            </p>
          </div>
        </section>

        {error && <p className="dropped-note">{error}</p>}

        {data && !data.hasDatabase && (
          <div className="issue">
            <p className="issue-message">
              No database is configured, so nothing has been recorded and this screen will stay
              empty.
            </p>
            <p className="issue-remedy">
              Set <code>DATABASE_URL</code> and run <code>lib/ledger/schema.sql</code> once.
            </p>
          </div>
        )}

        {record && (
          <div className="track-record">
            <div className="track-heading">
              <span>ALL OBJECTION TYPES</span>
              <Link href="/history">Replay another</Link>
            </div>
            <div className="track-stats">
              <div>
                <strong>{record.flagged}</strong>
                <small>flagged</small>
              </div>
              <div>
                <strong>{record.shippedAnyway}</strong>
                <small>shipped anyway</small>
              </div>
              <div>
                <strong>{hitRatePct == null ? '—' : `${hitRatePct}%`}</strong>
                <small>were right</small>
              </div>
              <div className="track-bar">
                <div>
                  <span style={{ width: `${hitRatePct ?? 0}%` }} />
                </div>
                <small>
                  {record.resolved === 0
                    ? 'nothing resolved yet'
                    : `${record.right} of ${record.resolved} calls validated by results`}
                </small>
              </div>
            </div>
          </div>
        )}

        <div className="section-label">
          <span>01</span> CALLS <span className="line" />
        </div>

        {data && data.calls.length === 0 && (
          <p className="objection-copy quiet">
            No calls yet.{' '}
            <Link href="/history" className="replay-link">
              Replay an experiment
            </Link>{' '}
            to make one.
          </p>
        )}

        <div className="evidence-list">
          {data?.calls.map((call) => (
            <div className="evidence-row" key={call.id}>
              <div className="evidence-info">
                <strong>{call.subject.title}</strong>
                <small>
                  {call.kind} <span>·</span>{' '}
                  {call.objection ? call.objection.objectionType : 'no objection'} <span>·</span>{' '}
                  {call.teamResponse ?? 'unanswered'} <span>·</span> {call.promptVersion}
                </small>
              </div>
              <div className={`call-outcome ${call.callOutcome}`}>
                {call.callOutcome === 'right'
                  ? 'Right'
                  : call.callOutcome === 'wrong'
                    ? 'Wrong'
                    : call.callOutcome === 'not-scored'
                      ? 'Not scored'
                      : 'Open'}
                {call.actualLiftPp != null && (
                  <small>
                    {call.actualLiftPp > 0 ? '+' : ''}
                    {call.actualLiftPp.toFixed(1)}pp
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>

        <footer className="page-footer">
          <span>A decline is counted in the flag rate and never in the hit rate.</span>
        </footer>
      </div>
    </main>
  )
}
