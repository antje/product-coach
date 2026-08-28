import { generateStructured, type UsageRecord } from '@/lib/ai/gateway'
import {
  ObjectionOutputSchema,
  PROMPT_VERSION,
  systemBlocks,
  userMessage,
  type ObjectionOutput,
} from '@/lib/ai/prompts/objection'
import { MODEL_FOR_TASK } from '@/lib/ai/router'
import { experimentsAsOf } from '@/lib/data/corpus'
import type { Brief, Objection } from '@/lib/types'
import { preflight, type PreflightIssue } from './preflight'

export type ReviewResult =
  /** The brief failed a deterministic check. No model was called and nothing was spent. */
  | { kind: 'preflight-refused'; issues: PreflightIssue[] }
  /** The history had nothing comparable. A correct and common answer. */
  | { kind: 'declined'; reason: string; usage: UsageRecord; droppedCitations: string[] }
  | { kind: 'objection'; objection: Objection; usage: UsageRecord; droppedCitations: string[] }

export class ReviewError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ReviewError'
  }
}

export interface ReviewOptions {
  /**
   * Only experiments that read out before this date are shown to the coach.
   * Live reviews pass today. The backtest passes the date of the brief under
   * review, which is the whole reason this parameter exists: a backtest that
   * lets the coach see the future is not measuring anything.
   */
  asOf?: string
}

export async function reviewBrief(brief: Brief, options: ReviewOptions = {}): Promise<ReviewResult> {
  const checks = preflight(brief)
  if (!checks.ok) {
    return { kind: 'preflight-refused', issues: checks.issues }
  }

  const asOf = options.asOf ?? todayIso()
  const history = experimentsAsOf(asOf)
  const known = new Set(history.map((e) => e.id))

  const { data, usage } = await generateStructured<ObjectionOutput>({
    task: 'objection',
    system: systemBlocks(history),
    user: userMessage(brief),
    schema: ObjectionOutputSchema,
    promptVersion: PROMPT_VERSION,
  })

  // A cited id that does not resolve is this product's specific hallucination
  // mode. Drop those rather than showing the reader a citation they cannot
  // check, and report what was dropped so the rate can be measured instead of
  // quietly absorbed.
  const cited = data.citedExperimentIds.filter((id) => known.has(id))
  const droppedCitations = data.citedExperimentIds.filter((id) => !known.has(id))

  if (data.verdict === 'decline' || cited.length === 0) {
    return {
      kind: 'declined',
      reason:
        data.declineReason ??
        'The history has nothing closely comparable to this brief, so there is no evidence to object with.',
      usage,
      droppedCitations,
    }
  }

  if (
    data.claim == null ||
    data.expectedEffectThresholdPp == null ||
    data.expectedEffectDirection == null ||
    data.objectionType == null
  ) {
    throw new ReviewError(
      'The coach returned an objection without a claim, a prediction, or a type. Nothing was recorded.'
    )
  }

  const objection: Objection = {
    id: crypto.randomUUID(),
    briefId: brief.id,
    createdAt: new Date().toISOString(),
    claim: data.claim,
    reasoning: data.reasoning ?? '',
    citedExperimentIds: cited,
    expectedEffect: {
      metric: brief.primaryMetric,
      direction: data.expectedEffectDirection,
      thresholdPp: data.expectedEffectThresholdPp,
    },
    // The date we find out is the brief's read date, not something the model
    // gets to invent. Preflight has already guaranteed it is set.
    checkDate: brief.readDate!,
    confidence: data.confidence,
    objectionType: data.objectionType,
    sharpenedHypothesis: data.sharpenedHypothesis,
    promptVersion: PROMPT_VERSION,
    model: MODEL_FOR_TASK.objection,
  }

  return { kind: 'objection', objection, usage, droppedCitations }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
