'use client'

import { use, useCallback, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Eye, Link2, ShieldAlert, Sparkles, X } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import {
  respondToCall,
  startReplay,
  type Reveal,
  type ReplayResponse,
} from '@/lib/client/replay'
import { experimentById } from '@/lib/data/corpus'
import type { TeamResponse } from '@/lib/types'

type Status = 'idle' | 'reviewing' | 'answering' | 'revealed' | 'error'

export default function ReplayPage({ params }: { params: Promise<{ id: string }> }) {
  // params is a Promise in this Next version. use() unwraps it in a client
  // component; awaiting is the server-component equivalent.
  const { id } = use(params)

  const [status, setStatus] = useState<Status>('idle')
  const [replay, setReplay] = useState<ReplayResponse | null>(null)
  const [reveal, setReveal] = useState<Reveal | null>(null)
  const [response, setResponse] = useState<TeamResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const known = experimentById(id)

  const run = useCallback(async () => {
    setStatus('reviewing')
    setError(null)
    try {
      setReplay(await startReplay(id))
      setStatus('answering')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The replay failed.')
      setStatus('error')
    }
  }, [id])

  const answer = useCallback(
    async (choice: TeamResponse) => {
      if (!replay) return
      setResponse(choice)
      try {
        const result = await respondToCall(replay.callId, choice, replay.experiment.id)
        setReveal(result.reveal)
        setNotice(result.persistedMessage)
        setStatus('revealed')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not record the answer.')
        setStatus('error')
      }
    },
    [replay]
  )

  // Deliberately NOT auto-run on mount. A replay costs a model call, so it
  // needs an explicit act. Firing on navigation meant anyone who opened a
  // replay URL spent money without asking for anything, which on a public
  // deployment is somebody else's money. It also made browsing the history
  // burn the per-session cap.

  if (!known) {
    return (
      <main className="app-shell">
        <SiteNav />
        <div className="page-wrap">
          <h1>No such experiment.</h1>
          <p className="objection-copy">
            <Link href="/history" className="replay-link">
              Back to the history
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const objection = replay?.review.kind === 'objection' ? replay.review.objection : null
  const cited = objection
    ? objection.citedExperimentIds.map(experimentById).filter((e) => e != null)
    : []

  return (
    <main className="app-shell">
      <SiteNav />
      <div className="page-wrap">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> REPLAY <span className="slash">/</span> {known.id}
            </div>
            <h1>{known.name}</h1>
            <p>
              Reviewed as if it had not run yet. The coach sees only experiments that read out before{' '}
              <strong>{known.readDate}</strong>.
            </p>
          </div>
          <Link className="quiet-button" href="/history">
            <ArrowLeft size={16} /> History
          </Link>
        </section>

        <div className="workspace">
          <section className="brief-panel">
            <div className="section-label">
              <span>01</span> THE EXPERIMENT, OUTCOME HIDDEN <span className="line" />
            </div>
            <div className="brief-card">
              <div className="hypothesis-block">
                <span className="field-label">HYPOTHESIS</span>
                <p>{known.hypothesis}</p>
              </div>
              <div className="brief-grid">
                <Field label="PRIMARY METRIC" value={known.primaryMetric} sub={`${known.baselinePp}pp baseline`} />
                <Field label="EXPECTED LIFT" value={`${known.expectedLiftPp > 0 ? '+' : ''}${known.expectedLiftPp}pp`} sub="as written at the time" />
                <Field label="AUDIENCE" value={known.audience.replace(/-/g, ' ')} sub={known.mechanism.replace(/-/g, ' ')} />
                <Field label="READ DATE" value={known.readDate} sub={`started ${known.startDate}`} />
              </div>
              <div className="brief-footer">
                <span>Outcome withheld until you answer.</span>
              </div>
            </div>
          </section>

          <section className="coach-panel" aria-live="polite">
            <div className="section-label">
              <span>02</span> COACH REVIEW <span className="line" />
            </div>

            {status === 'idle' && (
              <div className="waiting-card">
                <div className="coach-symbol">
                  <Sparkles size={22} />
                </div>
                <h2>Review this blind?</h2>
                <p>
                  The coach will see only what this team knew before {known.readDate}. You answer,
                  then the real outcome is revealed and the call is scored.
                </p>
                <button className="review-button" onClick={() => void run()} type="button">
                  <Sparkles size={16} /> Run the replay
                </button>
                <div className="waiting-meta">
                  <span className="pulse" /> One model call
                </div>
              </div>
            )}

            {status === 'reviewing' && (
              <div className="waiting-card reviewing">
                <div className="coach-symbol spinning">
                  <Sparkles size={22} />
                </div>
                <h2>Reading the history up to {known.readDate}.</h2>
                <p>Nothing after that date is visible to the coach.</p>
                <div className="loading-line">
                  <span />
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="waiting-card">
                <div className="coach-symbol error">
                  <ShieldAlert size={22} />
                </div>
                <h2>The replay could not run.</h2>
                <p>{error}</p>
                <button className="review-button" onClick={() => void run()} type="button">
                  <Sparkles size={16} /> Try again
                </button>
              </div>
            )}

            {replay && status !== 'reviewing' && status !== 'error' && (
              <div className="review-card">
                {objection ? (
                  <>
                    <div className="review-status">
                      <span className="warning-icon">!</span> ONE OBJECTION
                      <span className="review-date">{cost(replay)}</span>
                    </div>
                    <h2>{objection.claim}</h2>
                    <p className="objection-copy">{objection.reasoning}</p>

                    <div className={`prediction ${objection.confidence}`}>
                      <div className="prediction-label">THE PREDICTION</div>
                      <p>
                        {objection.expectedEffect.metric} lands{' '}
                        <strong>
                          {objection.expectedEffect.direction}{' '}
                          {fmt(objection.expectedEffect.thresholdPp)}
                        </strong>
                        .
                      </p>
                      <small>{objection.confidence.toUpperCase()} CONFIDENCE</small>
                    </div>

                    <div className="evidence-heading">
                      <span>THE EVIDENCE</span>
                      <span>all before {known.readDate}</span>
                    </div>
                    <div className="evidence-list">
                      {cited.map((e) => (
                        <Link className="evidence-row" href={`/history#${e.id}`} key={e.id}>
                          <div className="evidence-icon">
                            <Link2 size={13} />
                          </div>
                          <div className="evidence-info">
                            <strong>{e.name}</strong>
                            <small>
                              {e.readDate} <span>·</span>{' '}
                              {e.outcome === 'shipped' ? 'Shipped' : 'Did not ship'}
                            </small>
                          </div>
                          <div className={`result ${tone(e.actualLiftPp)}`}>{fmt(e.actualLiftPp)}</div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="review-status declined">
                      <span className="check-icon">
                        <Check size={11} strokeWidth={3} />
                      </span>{' '}
                      NO OBJECTION
                      <span className="review-date">{cost(replay)}</span>
                    </div>
                    <h2>Nothing in the history before {known.readDate} spoke to this.</h2>
                    <p className="objection-copy">
                      {replay.review.kind === 'declined' ? replay.review.reason : ''}
                    </p>
                  </>
                )}

                {status === 'answering' && (
                  <div className="sharpened">
                    <div className="sharpened-label">
                      <Sparkles size={14} /> WHAT WOULD YOU HAVE DONE
                    </div>
                    <p>Commit before the outcome is shown. That is what makes the record mean anything.</p>
                    <div className="decision-actions">
                      <button className="decision" onClick={() => void answer('accepted')} type="button">
                        <Check size={15} /> {objection ? 'Accept the objection' : 'Run it'}
                      </button>
                      <button
                        className="decision reject"
                        onClick={() => void answer('shipped-anyway')}
                        type="button"
                      >
                        <X size={15} /> {objection ? 'Ship anyway' : 'Hold it back'}
                      </button>
                    </div>
                  </div>
                )}

                {status === 'revealed' && reveal && (
                  <div className={`reveal ${reveal.outcome}`}>
                    <div className="reveal-label">
                      <Eye size={14} /> WHAT ACTUALLY HAPPENED
                    </div>
                    <div className="reveal-figure">
                      <strong className={tone(reveal.actualLiftPp)}>{fmt(reveal.actualLiftPp)}</strong>
                      <small>
                        against {fmt(reveal.expectedLiftPp)} expected ·{' '}
                        {reveal.shipped === 'shipped' ? 'shipped' : reveal.shipped === 'not-shipped' ? 'did not ship' : 'inconclusive'}
                      </small>
                    </div>
                    <p className="reveal-verdict">{reveal.explanation}</p>
                    <p className="decision-note">
                      You said {response === 'accepted' ? 'you would accept' : 'you would ship anyway'}.
                    </p>
                    {notice && <p className="dropped-note">{notice}</p>}
                    <div className="decision-actions">
                      <Link className="decision" href="/record">
                        See the record
                      </Link>
                      <Link className="decision reject" href="/history">
                        Replay another
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="brief-field">
      <span className="field-label">{label}</span>
      <strong>{value}</strong>
      <small>{sub}</small>
    </div>
  )
}

function cost(replay: ReplayResponse): string {
  const usd = replay.review.usage.costUsd
  return usd < 0.01 ? '<$0.01' : `$${usd.toFixed(3)}`
}

function tone(liftPp: number): string {
  if (liftPp <= -0.5) return 'negative'
  if (liftPp >= 2) return 'positive'
  return ''
}

function fmt(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}pp`
}
