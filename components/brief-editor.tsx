'use client'

import { useState } from 'react'
import { ChevronDown, FlaskConical, MoreHorizontal, Shield, Target, Users, Zap } from 'lucide-react'
import type { Audience, Brief, Mechanism } from '@/lib/types'

const MECHANISMS: Mechanism[] = [
  'personalization',
  'social-proof',
  'urgency',
  'incentive',
  'reduce-steps',
  'time-to-value',
  'defaults',
  'education',
  'notification',
  'pricing-display',
]

const AUDIENCES: Audience[] = [
  'new-workspaces',
  'trial-day-7',
  'activated-teams',
  'returning-users',
  'all-users',
]

const label = (value: string) => value.replace(/-/g, ' ')

export function BriefEditor({
  brief,
  onChange,
  disabled,
}: {
  brief: Brief
  onChange: (brief: Brief) => void
  disabled: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)
  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => onChange({ ...brief, [key]: value })

  return (
    <div className="brief-card">
      <div className="brief-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="draft-tag">DRAFT</span>
          <input
            className="edit-title"
            value={brief.title}
            disabled={disabled}
            onChange={(e) => set('title', e.target.value)}
            aria-label="Experiment title"
          />
        </div>
        <button className="more-button" aria-label="More brief options" type="button">
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="hypothesis-block">
        <span className="field-label">HYPOTHESIS</span>
        <textarea
          className="edit-hypothesis"
          value={brief.hypothesis}
          disabled={disabled}
          rows={3}
          maxLength={2000}
          onChange={(e) => set('hypothesis', e.target.value)}
          aria-label="Hypothesis"
        />
      </div>

      <div className="brief-grid">
        <div className="brief-field">
          <span className="field-label">
            <Target size={13} /> PRIMARY METRIC
          </span>
          <input
            className="edit-strong"
            value={brief.primaryMetric}
            disabled={disabled}
            onChange={(e) => set('primaryMetric', e.target.value)}
            aria-label="Primary metric"
          />
          <input
            className="edit-small"
            value={brief.metricDefinition}
            disabled={disabled}
            onChange={(e) => set('metricDefinition', e.target.value)}
            aria-label="Metric definition"
          />
        </div>

        <div className="brief-field">
          <span className="field-label">
            <Zap size={13} /> EXPECTED LIFT
          </span>
          <div className="edit-row">
            <input
              className="edit-strong edit-number"
              type="number"
              step="0.1"
              value={brief.expectedLiftPp}
              disabled={disabled}
              onChange={(e) => set('expectedLiftPp', Number(e.target.value))}
              aria-label="Expected lift in percentage points"
            />
            <span className="edit-unit">pp</span>
          </div>
          <div className="edit-row">
            <span className="edit-prefix">from</span>
            <input
              className="edit-small edit-number"
              type="number"
              step="0.1"
              value={brief.baselinePp}
              disabled={disabled}
              onChange={(e) => set('baselinePp', Number(e.target.value))}
              aria-label="Baseline in percentage points"
            />
            <span className="edit-prefix">pp baseline</span>
          </div>
        </div>

        <div className="brief-field">
          <span className="field-label">
            <Users size={13} /> AUDIENCE
          </span>
          <select
            className="edit-strong"
            value={brief.audience}
            disabled={disabled}
            onChange={(e) => set('audience', e.target.value as Audience)}
            aria-label="Audience"
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {label(a)}
              </option>
            ))}
          </select>
          <select
            className="edit-small"
            value={brief.mechanism}
            disabled={disabled}
            onChange={(e) => set('mechanism', e.target.value as Mechanism)}
            aria-label="Mechanism"
          >
            {MECHANISMS.map((m) => (
              <option key={m} value={m}>
                {label(m)}
              </option>
            ))}
          </select>
        </div>

        <div className="brief-field">
          <span className="field-label">
            <FlaskConical size={13} /> READ DATE
          </span>
          <input
            className="edit-strong"
            type="date"
            value={brief.readDate ?? ''}
            disabled={disabled}
            onChange={(e) => set('readDate', e.target.value || null)}
            aria-label="Read date"
          />
          <div className="edit-row">
            <input
              className="edit-small edit-number"
              type="number"
              min={0}
              value={brief.plannedWeeks}
              disabled={disabled}
              onChange={(e) => set('plannedWeeks', Number(e.target.value))}
              aria-label="Planned weeks"
            />
            <span className="edit-prefix">weeks at</span>
            <input
              className="edit-small edit-number edit-number-wide"
              type="number"
              min={0}
              value={brief.weeklyVolume}
              disabled={disabled}
              onChange={(e) => set('weeklyVolume', Number(e.target.value))}
              aria-label="Weekly volume"
            />
            <span className="edit-prefix">/wk</span>
          </div>
        </div>
      </div>

      <button
        className="details-toggle"
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        aria-expanded={showDetails}
      >
        <Shield size={13} /> Guardrails and how the target was derived
        <ChevronDown size={14} className={showDetails ? 'flipped' : ''} />
      </button>

      {showDetails && (
        <div className="details-body">
          <span className="field-label">GUARDRAILS</span>
          {brief.guardrails.map((g, i) => (
            <div className="guardrail-row" key={i}>
              <input
                className="edit-small"
                value={g.rawText}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...brief.guardrails]
                  next[i] = { ...g, rawText: e.target.value }
                  set('guardrails', next)
                }}
                aria-label={`Guardrail ${i + 1} text`}
              />
              <input
                className="edit-small edit-number"
                type="number"
                step="0.1"
                placeholder="none"
                value={g.maxDropPp ?? ''}
                disabled={disabled}
                onChange={(e) => {
                  const next = [...brief.guardrails]
                  next[i] = { ...g, maxDropPp: e.target.value === '' ? null : Number(e.target.value) }
                  set('guardrails', next)
                }}
                aria-label={`Guardrail ${i + 1} maximum drop in percentage points`}
              />
              <span className="edit-prefix">pp</span>
            </div>
          ))}

          <span className="field-label" style={{ marginTop: 18 }}>
            HOW THE TARGET WAS DERIVED
          </span>
          <textarea
            className="edit-hypothesis"
            rows={3}
            maxLength={2000}
            placeholder="Leave empty to see the coach refuse an asserted target."
            value={brief.targetDerivation ?? ''}
            disabled={disabled}
            onChange={(e) => set('targetDerivation', e.target.value || null)}
            aria-label="Target derivation"
          />
        </div>
      )}

      <div className="brief-footer">
        <span>
          <span className="tiny-avatar">JS</span> Prepared by {brief.author}
        </span>
        <span>Editable</span>
      </div>
    </div>
  )
}
