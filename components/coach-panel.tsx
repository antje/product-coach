'use client'

import { ArrowUpRight, Check, Link2, ShieldAlert, Sparkles, X } from 'lucide-react'
import type { ReviewResult } from '@/lib/coach/review'
import { experimentById } from '@/lib/data/corpus'
import type { Confidence, TeamResponse } from '@/lib/types'

/**
 * Confidence changes what the coach is allowed to say, not just a badge colour.
 * High states a prediction. Medium raises a question. Low is a refusal to
 * opine, and never reaches this component as an objection at all.
 */
const CONFIDENCE_COPY: Record<Confidence, string> = {
  high: 'Three or more closely comparable experiments back this.',
  medium: 'Two comparable experiments. Worth weighing, not decisive.',
  low: 'Thin evidence. Treat as a question rather than a finding.',
}

const fmtPp = (n: number) => `${n > 0 ? '+' : ''}${n.toFixed(1)}pp`

export function CoachPanel({
  status,
  result,
  error,
  response,
  onReview,
  onRespond,
}: {
  status: 'idle' | 'reviewing' | 'done' | 'error'
  result: ReviewResult | null
  error: string | null
  response: TeamResponse | null
  onReview: () => void
  onRespond: (r: TeamResponse) => void
}) {
  if (status === 'reviewing') {
    return (
      <div className="waiting-card reviewing">
        <div className="coach-symbol spinning">
          <Sparkles size={22} />
        </div>
        <h2>Reading your history.</h2>
        <p>Comparing this assumption against every experiment your team has finished.</p>
        <div className="loading-line">
          <span />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="waiting-card">
        <div className="coach-symbol error">
          <ShieldAlert size={22} />
        </div>
        <h2>The review could not run.</h2>
        <p>{error}</p>
        <button className="review-button" onClick={onReview} type="button">
          <Sparkles size={16} /> Try again
        </button>
      </div>
    )
  }

  if (status === 'idle' || !result) {
    return (
      <div className="waiting-card">
        <div className="coach-symbol">
          <Sparkles size={22} />
        </div>
        <h2>Your coach is waiting.</h2>
        <p>One focused challenge, backed by what your team has already learned. No generic advice.</p>
        <button className="review-button" onClick={onReview} type="button">
          <Sparkles size={16} /> Review experiment <span className="shortcut">⌘ ↵</span>
        </button>
        <div className="waiting-meta">
          <span className="pulse" /> Ready to review <span className="meta-divider" /> 50 past experiments
          indexed
        </div>
      </div>
    )
  }

  // The brief failed a check that needs no model. Nothing was spent.
  if (result.kind === 'preflight-refused') {
    return (
      <div className="review-card">
        <div className="review-status">
          <span className="warning-icon">!</span> {result.issues.length}{' '}
          {result.issues.length === 1 ? 'PROBLEM' : 'PROBLEMS'} WITH THE BRIEF
          <span className="review-date">No model was called</span>
        </div>
        <h2>This brief is not ready to review.</h2>
        <p className="objection-copy">
          These are checked before the coach reads your history, so fixing them costs nothing and the
          answer is the same every time.
        </p>
        <div className="issue-list">
          {result.issues.map((issue) => (
            <div className="issue" key={issue.code}>
              <p className="issue-message">{issue.message}</p>
              {issue.arithmetic && <code className="issue-arithmetic">{issue.arithmetic}</code>}
              <p className="issue-remedy">{issue.remedy}</p>
            </div>
          ))}
        </div>
        <div className="brief-footer">
          <span>Edit the brief and review again.</span>
        </div>
      </div>
    )
  }

  // A correct and common answer. The history had nothing comparable.
  if (result.kind === 'declined') {
    return (
      <div className="review-card">
        <div className="review-status declined">
          <span className="check-icon">
            <Check size={11} strokeWidth={3} />
          </span>{' '}
          NO OBJECTION
          <span className="review-date">{costLabel(result.usage.costUsd)}</span>
        </div>
        <h2>Nothing in your history speaks to this.</h2>
        <p className="objection-copy">{result.reason}</p>
        <p className="objection-copy quiet">
          A reviewer that always finds something is not reviewing. This is the coach declining to
          spend your trust on a guess.
        </p>
        <div className="brief-footer">
          <span>Reviewed against 50 experiments.</span>
        </div>
      </div>
    )
  }

  const { objection } = result
  const cited = objection.citedExperimentIds.map(experimentById).filter((e) => e != null)

  return (
    <div className="review-card">
      <div className="review-status">
        <span className="warning-icon">!</span> ONE OBJECTION
        <span className="review-date">{costLabel(result.usage.costUsd)}</span>
      </div>
      <h2>{objection.claim}</h2>
      <p className="objection-copy">{objection.reasoning}</p>

      <div className={`prediction ${objection.confidence}`}>
        <div className="prediction-label">THE PREDICTION</div>
        <p>
          {objection.expectedEffect.metric} lands{' '}
          <strong>
            {objection.expectedEffect.direction} {fmtPp(objection.expectedEffect.thresholdPp)}
          </strong>{' '}
          by {objection.checkDate}.
        </p>
        <small>
          {objection.confidence.toUpperCase()} CONFIDENCE. {CONFIDENCE_COPY[objection.confidence]}
        </small>
      </div>

      <div className="evidence-heading">
        <span>THE EVIDENCE</span>
        <span>
          {cited.length} {cited.length === 1 ? 'experiment' : 'experiments'}
        </span>
      </div>
      <div className="evidence-list">
        {cited.map((experiment) => (
          <a
            className="evidence-row"
            href={`#${experiment.id}`}
            key={experiment.id}
            title={experiment.hypothesis}
          >
            <div className="evidence-icon">
              <Link2 size={13} />
            </div>
            <div className="evidence-info">
              <strong>{experiment.name}</strong>
              <small>
                {experiment.readDate} <span>·</span>{' '}
                {experiment.outcome === 'shipped' ? 'Shipped' : 'Did not ship'}
              </small>
            </div>
            <div className={`result ${tone(experiment.actualLiftPp)}`}>
              {fmtPp(experiment.actualLiftPp)}
              <small>{experiment.primaryMetric}</small>
            </div>
            <ArrowUpRight size={15} className="row-arrow" />
          </a>
        ))}
      </div>

      {objection.sharpenedHypothesis && (
        <div className="sharpened">
          <div className="sharpened-label">
            <Sparkles size={14} /> SHARPENED HYPOTHESIS
          </div>
          <p>{objection.sharpenedHypothesis}</p>
          <div className="decision-actions">
            <button
              className={response === 'accepted' ? 'decision selected' : 'decision'}
              onClick={() => onRespond('accepted')}
              type="button"
            >
              <Check size={15} /> Accept sharpened version
            </button>
            <button
              className={response === 'shipped-anyway' ? 'decision reject selected' : 'decision reject'}
              onClick={() => onRespond('shipped-anyway')}
              type="button"
            >
              <X size={15} /> Ship anyway
            </button>
          </div>
          {response && (
            <p className="decision-note">
              {response === 'accepted'
                ? 'Recorded. The coach will check this call on the read date either way.'
                : 'Recorded as an override. That is the more useful outcome for the record, because it is the one that tests the coach.'}
            </p>
          )}
        </div>
      )}

      {result.droppedCitations.length > 0 && (
        <p className="dropped-note">
          {result.droppedCitations.length} cited{' '}
          {result.droppedCitations.length === 1 ? 'experiment' : 'experiments'} did not resolve and{' '}
          {result.droppedCitations.length === 1 ? 'was' : 'were'} dropped.
        </p>
      )}
    </div>
  )
}

function tone(liftPp: number): string {
  if (liftPp <= -0.5) return 'negative'
  if (liftPp >= 2) return 'positive'
  return ''
}

function costLabel(costUsd: number): string {
  return costUsd < 0.01 ? '<$0.01' : `$${costUsd.toFixed(3)}`
}
