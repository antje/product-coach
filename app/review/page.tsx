'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { FilePlus2, History, Sparkles } from 'lucide-react'
import { BriefEditor } from '@/components/brief-editor'
import { SiteNav } from '@/components/site-nav'
import { CoachPanel } from '@/components/coach-panel'
import { requestReview } from '@/lib/client/review'
import type { ReviewResult } from '@/lib/coach/review'
import { EXPERIMENTS } from '@/lib/data/corpus'
import { DRAFT_BRIEF, EMPTY_BRIEF } from '@/lib/data/draft-brief'
import type { Brief, TeamResponse } from '@/lib/types'

type Status = 'idle' | 'reviewing' | 'done' | 'error'

export default function Page() {
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<TeamResponse | null>(null)

  const review = useCallback(async () => {
    setStatus('reviewing')
    setError(null)
    setResponse(null)
    try {
      setResult(await requestReview(brief))
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The review failed.')
      setStatus('error')
    }
  }, [brief])

  // The shortcut on the button is real. It was decorative before.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && status !== 'reviewing') {
        e.preventDefault()
        void review()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [review, status])

  // Editing the brief invalidates the review it produced, so clear it rather
  // than leaving an objection on screen that refers to text no longer shown.
  const updateBrief = (next: Brief) => {
    setBrief(next)
    if (status !== 'idle') {
      setStatus('idle')
      setResult(null)
      setResponse(null)
    }
  }

  return (
    <main className="app-shell">
      <SiteNav />

      <div className="page-wrap">
        <section className="page-heading">
          <div>
            <div className="eyebrow">
              <span className="status-dot" /> EXPERIMENT REVIEW <span className="slash">/</span> DRAFT
            </div>
            <h1>Write the brief. Then defend it.</h1>
            <p>
              Fill this in and hand it over. The coach checks it against every experiment your team
              has already finished, and objects if you are about to repeat one.
            </p>
          </div>
          <div className="heading-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={() => updateBrief(DRAFT_BRIEF)}
            >
              <FilePlus2 size={16} /> Load the example
            </button>
            <Link className="quiet-button" href="/history">
              <History size={16} /> Replay a past one
            </Link>
          </div>
        </section>

        <div className="workspace">
          <section className="brief-panel" id="brief">
            <div className="section-label">
              <span>01</span> EXPERIMENT BRIEF <span className="line" />
            </div>
            <BriefEditor brief={brief} onChange={updateBrief} disabled={status === 'reviewing'} />
            <div className="brief-note">
              <Sparkles size={15} />{' '}
              <span>Reviewed against {EXPERIMENTS.length} of your team&apos;s finished experiments.</span>
            </div>
          </section>

          <section
            className={`coach-panel ${status === 'done' ? 'has-review' : ''}`}
            aria-live="polite"
          >
            <div className="section-label">
              <span>02</span> COACH REVIEW <span className="line" />
            </div>
            <CoachPanel
              status={status}
              result={result}
              error={error}
              response={response}
              brief={brief}
              onReview={() => void review()}
              onRespond={setResponse}
            />
          </section>
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
