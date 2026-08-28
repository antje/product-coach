/**
 * Core domain types.
 *
 * Units convention, enforced everywhere: every lift is expressed in
 * PERCENTAGE POINTS on the primary metric, never as a relative percentage.
 * A baseline of 42.0 with an actual lift of +3.1 means the metric read 45.1.
 * Mixing the two is the most common way an experiment readout gets
 * misreported, so the field names carry the unit.
 */

/** The lever an experiment pulls. Realistic platform metadata: teams tag tests. */
export type Mechanism =
  | 'personalization'
  | 'social-proof'
  | 'urgency'
  | 'incentive'
  | 'reduce-steps'
  | 'time-to-value'
  | 'defaults'
  | 'education'
  | 'notification'
  | 'pricing-display'

export type Audience =
  | 'new-workspaces'
  | 'trial-day-7'
  | 'activated-teams'
  | 'returning-users'
  | 'all-users'

export type ExperimentOutcome = 'shipped' | 'not-shipped' | 'inconclusive'

/** A completed experiment in the team's history. */
export interface Experiment {
  id: string
  name: string
  /** The team's own words, as written before the test ran. */
  hypothesis: string
  mechanism: Mechanism
  audience: Audience
  primaryMetric: string
  /** Percentage points. */
  baselinePp: number
  expectedLiftPp: number
  actualLiftPp: number
  outcome: ExperimentOutcome
  /** ISO date. Ordering matters: the backtest must never show a coach a later experiment. */
  startDate: string
  readDate: string
}

/** A brief a PM has drafted and is about to run. */
export interface Brief {
  id: string
  title: string
  hypothesis: string
  mechanism: Mechanism
  audience: Audience
  primaryMetric: string
  metricDefinition: string
  baselinePp: number
  expectedLiftPp: number
  testType: string
  splitDescription: string
  /** Users entering the test per week. Without it there is no power arithmetic. */
  weeklyVolume: number
  /** How long the team intends to run. Compared against what the power math needs. */
  plannedWeeks: number
  /** Absent is the point: the preflight refuses a brief without one. */
  readDate: string | null
  /** Each needs a numeric boundary, not a direction. */
  guardrails: Guardrail[]
  /** How the expected lift was arrived at. Asserted targets get refused. */
  targetDerivation: string | null
  author: string
}

export interface Guardrail {
  metric: string
  /** Percentage points. Null means the guardrail was written as a direction, not a boundary. */
  maxDropPp: number | null
  rawText: string
}

/**
 * What the coach is actually shown when it forms an objection.
 *
 * Narrower than a Brief on purpose. A Brief has 17 fields and an Experiment has
 * 12, and replay would otherwise have to invent the 8 that a historical row
 * does not carry. This is the intersection that both can satisfy honestly, so
 * the prompt takes it and neither path fabricates anything.
 */
export interface ReviewSubject {
  title: string
  hypothesis: string
  mechanism: Mechanism
  audience: Audience
  primaryMetric: string
  baselinePp: number
  expectedLiftPp: number
  /** Present on a drafted brief, absent on a historical experiment. */
  metricDefinition?: string
  testType?: string
  splitDescription?: string
  plannedWeeks?: number
  weeklyVolume?: number
}

export function briefToSubject(brief: Brief): ReviewSubject {
  return {
    title: brief.title,
    hypothesis: brief.hypothesis,
    mechanism: brief.mechanism,
    audience: brief.audience,
    primaryMetric: brief.primaryMetric,
    baselinePp: brief.baselinePp,
    expectedLiftPp: brief.expectedLiftPp,
    metricDefinition: brief.metricDefinition,
    testType: brief.testType,
    splitDescription: brief.splitDescription,
    plannedWeeks: brief.plannedWeeks,
    weeklyVolume: brief.weeklyVolume,
  }
}

export function experimentToSubject(experiment: Experiment): ReviewSubject {
  return {
    title: experiment.name,
    hypothesis: experiment.hypothesis,
    mechanism: experiment.mechanism,
    audience: experiment.audience,
    primaryMetric: experiment.primaryMetric,
    baselinePp: experiment.baselinePp,
    expectedLiftPp: experiment.expectedLiftPp,
  }
}

/** What kind of claim an objection is making. The track record is sliced by this. */
export type ObjectionType =
  | 'assumed-causation'
  | 'repeated-mechanism'
  | 'unpowered-metric'
  | 'audience-mismatch'
  | 'undevised-target'
  | 'guardrail-gap'

export type Confidence = 'high' | 'medium' | 'low'

/** The falsifiable prediction attached to every objection. */
export interface ExpectedEffect {
  metric: string
  direction: 'below' | 'above'
  /** Percentage points. */
  thresholdPp: number
}

export interface Objection {
  id: string
  briefId: string
  createdAt: string
  claim: string
  reasoning: string
  /** Must be non-empty and every id must resolve. Empty means the coach declined to object. */
  citedExperimentIds: string[]
  expectedEffect: ExpectedEffect
  /** When we find out. */
  checkDate: string
  confidence: Confidence
  objectionType: ObjectionType
  sharpenedHypothesis: string | null
  /** Which prompt produced this, so a score can be attributed to a version. */
  promptVersion: string
  model: string
}

/** What the team did with an objection. The correction-loop signal. */
export type TeamResponse = 'accepted' | 'shipped-anyway' | 'dismissed'

/**
 * Whether the coach's call turned out to be right.
 *
 * 'not-scored' is distinct from 'untested' and the distinction matters. Untested
 * means the outcome has not arrived yet. Not-scored means it has arrived and the
 * call still cannot be graded, because the coach declined and therefore made no
 * prediction. Collapsing the two would let a coach improve its hit rate by
 * staying quiet, which is the exact failure the scoreboard exists to prevent.
 */
export type CallOutcome = 'right' | 'wrong' | 'untested' | 'not-scored'

export interface LedgerEntry {
  objection: Objection
  teamResponse: TeamResponse | null
  respondedAt: string | null
  /** Set by the webhook when the experiment reads out. */
  actualLiftPp: number | null
  callOutcome: CallOutcome
  resolvedAt: string | null
}

export interface TrackRecord {
  objectionType: ObjectionType | 'all'
  flagged: number
  shippedAnyway: number
  resolved: number
  right: number
  /** right / resolved, or null when nothing has resolved yet. */
  hitRate: number | null
}
