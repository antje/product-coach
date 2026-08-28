'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  FlaskConical,
  History,
  Link2,
  MoreHorizontal,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react'

const pastExperiments = [
  {
    name: 'Personalized dashboard hero',
    date: 'Feb 14, 2024',
    result: '−1.8%',
    resultLabel: 'activation',
    outcome: 'Did not ship',
    tone: 'negative',
  },
  {
    name: 'Onboarding checklist prompt',
    date: 'Sep 08, 2023',
    result: '+0.4%',
    resultLabel: 'activation',
    outcome: 'Shipped',
    tone: 'neutral',
  },
  {
    name: 'Workspace invite nudge',
    date: 'May 22, 2023',
    result: '+3.1%',
    resultLabel: 'activation',
    outcome: 'Shipped',
    tone: 'positive',
  },
]

export default function Page() {
  const [reviewed, setReviewed] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false)
  const [decision, setDecision] = useState<'accept' | 'reject' | null>(null)

  const review = () => {
    setIsReviewing(true)
    window.setTimeout(() => {
      setIsReviewing(false)
      setReviewed(true)
    }, 850)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><FlaskConical size={17} strokeWidth={2.2} /></div>
          <span>product-coach</span>
          <span className="beta-pill">BETA</span>
        </div>
        <nav className="topnav" aria-label="Main navigation">
          <a className="active" href="#brief">Review</a>
          <a href="#history"><History size={14} /> Team history</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Help"><CircleHelp size={17} /></button>
          <div className="avatar">JS</div>
        </div>
      </header>

      <div className="page-wrap">
        <section className="page-heading">
          <div>
            <div className="eyebrow"><span className="status-dot" /> EXPERIMENT REVIEW <span className="slash">/</span> DRAFT</div>
            <h1>Ready to pressure-test your next bet?</h1>
            <p>Give product-coach your brief. It will look for assumptions your team has already tested.</p>
          </div>
          <button className="quiet-button"><MoreHorizontal size={17} /> Options</button>
        </section>

        <div className="workspace">
          <section className="brief-panel" id="brief">
            <div className="section-label"><span>01</span> EXPERIMENT BRIEF <span className="line" /></div>
            <div className="brief-card">
              <div className="brief-card-header">
                <div>
                  <span className="draft-tag">DRAFT</span>
                  <h2>Make the workspace feel like home</h2>
                </div>
                <button className="more-button" aria-label="More brief options"><MoreHorizontal size={18} /></button>
              </div>
              <div className="hypothesis-block">
                <span className="field-label">HYPOTHESIS</span>
                <p>If we add a personalized welcome message to the dashboard, new users will feel more invested and activate more often.</p>
              </div>
              <div className="brief-grid">
                <div className="brief-field"><span className="field-label"><Target size={13} /> PRIMARY METRIC</span><strong>Activation rate</strong><small>Complete 3 key actions in 7 days</small></div>
                <div className="brief-field"><span className="field-label"><Zap size={13} /> EXPECTED LIFT</span><strong>+8.0%</strong><small>from 42.0% baseline</small></div>
                <div className="brief-field"><span className="field-label"><Users size={13} /> AUDIENCE</span><strong>New workspaces</strong><small>Created in the last 14 days</small></div>
                <div className="brief-field"><span className="field-label"><FlaskConical size={13} /> TEST TYPE</span><strong>A/B test</strong><small>50 / 50 split · 2 weeks</small></div>
              </div>
              <div className="brief-footer"><span><span className="tiny-avatar">JS</span> Prepared by Jordan Smith</span><span>Last edited just now <ChevronDown size={14} /></span></div>
            </div>
            <div className="brief-note"><Sparkles size={15} /> <span>Coach reviews your hypothesis against 2 years of team experiments.</span></div>
          </section>

          <section className={`coach-panel ${reviewed ? 'has-review' : ''}`} aria-live="polite">
            <div className="section-label"><span>02</span> COACH REVIEW <span className="line" /></div>
            {!reviewed && !isReviewing ? (
              <div className="waiting-card">
                <div className="coach-symbol"><Sparkles size={22} /></div>
                <h2>Your coach is waiting.</h2>
                <p>One focused challenge, backed by what your team has already learned. No generic advice.</p>
                <button className="review-button" onClick={review}>
                  <Sparkles size={16} /> Review experiment <span className="shortcut">⌘ ↵</span>
                </button>
                <div className="waiting-meta"><span className="pulse" /> Ready to review <span className="meta-divider" /> 24 past experiments indexed</div>
              </div>
            ) : isReviewing ? (
              <div className="waiting-card reviewing"><div className="coach-symbol spinning"><Sparkles size={22} /></div><h2>Looking through your history…</h2><p>Comparing this assumption with experiments your team has run.</p><div className="loading-line"><span /></div></div>
            ) : (
              <div className="review-card">
                <div className="review-status"><span className="warning-icon">!</span> ONE OBJECTION <span className="review-date">Reviewed just now</span></div>
                <h2>Personalization hasn&apos;t moved activation for this audience.</h2>
                <p className="objection-copy">Your hypothesis assumes that feeling invested causes new users to activate. In your last three tests using personalization or encouragement, the treatment changed behavior by <strong>+0.6% on average</strong>, well below your +8% target.</p>
                <div className="track-record"><div className="track-heading"><span>On objections about assumed causation</span><a href="#history">View all calls <ArrowUpRight size={13} /></a></div><div className="track-stats"><div><strong>18</strong><small>flagged</small></div><div><strong>7</strong><small>shipped anyway</small></div><div><strong>71%</strong><small>were right</small></div><div className="track-bar"><div><span style={{ width: '71%' }} /></div><small>13 of 18 calls validated by results</small></div></div></div>
                <div className="evidence-heading"><span>THE EVIDENCE</span><span>3 matching experiments</span></div>
                <div className="evidence-list">
                  {pastExperiments.map((experiment) => <a className="evidence-row" href="#history" key={experiment.name}><div className="evidence-icon"><Link2 size={13} /></div><div className="evidence-info"><strong>{experiment.name}</strong><small>{experiment.date} <span>·</span> {experiment.outcome}</small></div><div className={`result ${experiment.tone}`}>{experiment.result}<small>{experiment.resultLabel}</small></div><ArrowUpRight size={15} className="row-arrow" /></a>)}
                </div>
                <div className="sharpened"><div className="sharpened-label"><Sparkles size={14} /> SHARPENED HYPOTHESIS</div><p>If we reduce the time to first value for new workspaces, activation will increase by 8%, regardless of whether the welcome message is personalized.</p><div className="decision-actions"><button className={decision === 'accept' ? 'decision selected' : 'decision'} onClick={() => setDecision('accept')}><Check size={15} /> Accept sharpened version</button><button className={decision === 'reject' ? 'decision reject selected' : 'decision reject'} onClick={() => setDecision('reject')}><X size={15} /> Keep original</button></div></div>
              </div>
            )}
          </section>
        </div>
        <footer className="page-footer"><span>product-coach learns from your team&apos;s experiments, not the internet.</span><span>Last synced <strong>2 min ago</strong> <span className="sync-dot" /></span></footer>
      </div>
    </main>
  )
}
