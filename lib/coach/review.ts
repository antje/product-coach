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
import { briefToSubject, type Brief, type Objection, type ReviewSubject } from '@/lib/types'
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

export interface ObjectionOptions {
  /**
   * Only experiments that read out strictly before this date are shown.
   *
   * A live review passes today. A replay passes the read date of the experiment
   * under review, which is the entire reason this parameter exists: a coach
   * that can see what happened after the decision is not being tested, it is
   * being handed the answer.
   */
  asOf: string
  /** Used for the check date on the resulting objection. */
  checkDate: string
  subjectId: string
}

/**
 * The shared path. Both a drafted brief and a replayed experiment arrive here,
 * which is what keeps the two from drifting into two different coaches.
 */
export async function formObjection(
  subject: ReviewSubject,
  options: ObjectionOptions
): Promise<Exclude<ReviewResult, { kind: 'preflight-refused' }>> {
  const history = experimentsAsOf(options.asOf)
  const known = new Set(history.map((e) => e.id))

  const { data, usage } = await generateStructured<ObjectionOutput>({
    task: 'objection',
    system: systemBlocks(history),
    user: userMessage(subject),
    schema: ObjectionOutputSchema,
    promptVersion: PROMPT_VERSION,
  })

  // A cited id that does not resolve is this product's specific hallucination
  // mode. Drop those rather than showing a citation nobody can check, and
  // report what was dropped so the rate can be measured instead of absorbed.
  const cited = data.citedExperimentIds.filter((id) => known.has(id))
  const droppedCitations = data.citedExperimentIds.filter((id) => !known.has(id))

  if (data.verdict === 'decline' || cited.length === 0) {
    return {
      kind: 'declined',
      reason:
        data.declineReason ??
        'The history has nothing closely comparable to this experiment, so there is no evidence to object with.',
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
    briefId: options.subjectId,
    createdAt: new Date().toISOString(),
    claim: data.claim,
    reasoning: data.reasoning ?? '',
    citedExperimentIds: cited,
    expectedEffect: {
      metric: subject.primaryMetric,
      direction: data.expectedEffectDirection,
      thresholdPp: data.expectedEffectThresholdPp,
    },
    checkDate: options.checkDate,
    confidence: data.confidence,
    objectionType: data.objectionType,
    sharpenedHypothesis: data.sharpenedHypothesis,
    promptVersion: PROMPT_VERSION,
    model: MODEL_FOR_TASK.objection,
  }

  return { kind: 'objection', objection, usage, droppedCitations }
}

/** A brief someone is drafting. Preflight first, because it is free. */
export async function reviewBrief(brief: Brief): Promise<ReviewResult> {
  const checks = preflight(brief)
  if (!checks.ok) {
    return { kind: 'preflight-refused', issues: checks.issues }
  }

  return formObjection(briefToSubject(brief), {
    asOf: todayIso(),
    // Preflight has already guaranteed a read date is set.
    checkDate: brief.readDate!,
    subjectId: brief.id,
  })
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
