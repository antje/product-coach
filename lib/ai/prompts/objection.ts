import { z } from 'zod'
import type { Experiment, ReviewSubject } from '@/lib/types'

/**
 * The objection prompt.
 *
 * Versioned, and the version is recorded on every ledger row. When the
 * scoreboard says the coach was right 71% of the time, that number belongs to
 * a specific prompt; without the stamp a regression is invisible and an
 * improvement is unattributable.
 *
 * Bump on any change to SYSTEM_RULES or the schema. Wording-only changes to
 * the corpus rendering still count, because they change what the model sees.
 */
export const PROMPT_VERSION = 'objection/2026-08-28.1'

export const ObjectionTypeEnum = z.enum([
  'assumed-causation',
  'repeated-mechanism',
  'unpowered-metric',
  'audience-mismatch',
  'undevised-target',
  'guardrail-gap',
])

export const ObjectionOutputSchema = z.object({
  verdict: z
    .enum(['object', 'decline'])
    .describe('object when the history supports a specific objection; decline when it does not'),
  declineReason: z
    .string()
    .nullable()
    .describe('When declining, what is missing from the history. Null when objecting.'),
  claim: z
    .string()
    .nullable()
    .describe('One sentence. The objection itself, stated as a claim about this brief.'),
  reasoning: z
    .string()
    .nullable()
    .describe('Two to four sentences connecting the cited experiments to this hypothesis.'),
  citedExperimentIds: z
    .array(z.string())
    .describe('Ids from the history that carry the argument. Empty only when declining.'),
  expectedEffectThresholdPp: z
    .number()
    .nullable()
    .describe('The prediction, in percentage points on the primary metric.'),
  expectedEffectDirection: z.enum(['below', 'above']).nullable(),
  confidence: z
    .enum(['high', 'medium', 'low'])
    .describe('high needs three or more closely comparable experiments'),
  objectionType: ObjectionTypeEnum.nullable(),
  sharpenedHypothesis: z
    .string()
    .nullable()
    .describe('A version of their hypothesis that avoids the problem. Null when declining.'),
})

export type ObjectionOutput = z.infer<typeof ObjectionOutputSchema>

const SYSTEM_RULES = `You review experiment briefs for a product team, before the experiment runs.

You are not a writing assistant and you do not produce documents. You have one job: say whether this team's own experiment history gives anyone a reason to expect this brief to fail, and if so, say it plainly and back it with the record.

## What you must do

- Ground every objection in specific past experiments from the history below, cited by id. An objection you cannot cite is an opinion, and this team has plenty of those already.
- Make a prediction with a number in it. "This will probably underperform" is not reviewable. "The lift will land below +2.0pp on activation rate" is, and you will be graded on it later.
- Give the reasoning in the team's own terms. Refer to what they tried, when, and what happened.

## When to decline

If the history has nothing closely comparable, meaning no similar mechanism, no similar audience and no similar metric, say so and decline. Set verdict to "decline", give the reason, and cite nothing.

Declining is a correct answer and it is common. A reviewer who always finds something is not reviewing, and every objection you file without evidence costs the team's trust in the ones you file with it.

Reserve "high" confidence for three or more closely comparable experiments. Two is "medium". One is usually "low", and one weak analogy is a decline.

## What not to do

- Do not object to a brief merely because it is ambitious, or because the target is large. Size is not evidence.
- Do not generalise a mechanism beyond what the record supports. If a mechanism failed on one audience and worked on another, say exactly that. A blanket verdict on a mechanism is almost always wrong and the history below will contradict it.
- Do not rewrite their brief. The sharpened hypothesis is one sentence showing what a testable version of their belief looks like, not a replacement document.
- Do not comment on read dates, guardrail thresholds, power, or whether the target was derived. Those are checked separately, before you are called. Confine yourself to what the history says.

## How to write

Plain English, short sentences, one idea each. The reader knows the job, so skip the basics, but spell out the reasoning step by step so they can follow the chain and disagree with a specific link.

Never use em dashes. Write two sentences instead, or use a comma, a colon, or brackets. This applies to every field you return.`

/**
 * The team's completed experiments, rendered for the model.
 *
 * The entire corpus goes in. With a history this size it fits comfortably, and
 * pre-selecting "relevant" rows would be the worst possible filter. It removes
 * exactly the disconfirming cases that stop the coach over-generalising a
 * mechanism. Retrieval becomes necessary somewhere in the low thousands of
 * experiments; until then, showing everything is both cheaper and more correct.
 */
export function renderHistory(experiments: Experiment[]): string {
  const rows = experiments
    .map(
      (e) =>
        `${e.id} | ${e.readDate} | ${e.name}\n` +
        `  hypothesis: ${e.hypothesis}\n` +
        `  mechanism: ${e.mechanism} | audience: ${e.audience} | metric: ${e.primaryMetric}\n` +
        `  baseline ${e.baselinePp}pp | expected ${fmt(e.expectedLiftPp)}pp | actual ${fmt(e.actualLiftPp)}pp | ${e.outcome}`
    )
    .join('\n\n')

  return `# This team's completed experiments\n\nAll lifts are in percentage points on the primary metric.\n\n${rows}`
}

export function systemBlocks(experiments: Experiment[]) {
  return [
    // Stable prefix. Both blocks are identical across every review, so they
    // cache; the brief goes in the user message, after the breakpoint.
    { text: SYSTEM_RULES, cacheable: false },
    { text: renderHistory(experiments), cacheable: true },
  ]
}

/**
 * Takes a ReviewSubject rather than a Brief, so a historical experiment can be
 * reviewed on the same path. Optional lines are omitted rather than filled with
 * a placeholder, because a fabricated "50/50 split" in the prompt is a fact the
 * model would reason from as though it were true.
 */
export function userMessage(subject: ReviewSubject): string {
  const lines = [
    'Review this experiment.',
    '',
    `Title: ${subject.title}`,
    `Hypothesis: ${subject.hypothesis}`,
    `Mechanism: ${subject.mechanism}`,
    `Audience: ${subject.audience}`,
    subject.metricDefinition
      ? `Primary metric: ${subject.primaryMetric} (${subject.metricDefinition})`
      : `Primary metric: ${subject.primaryMetric}`,
    `Baseline: ${subject.baselinePp}pp`,
    `Expected lift: ${fmt(subject.expectedLiftPp)}pp`,
  ]

  if (subject.testType && subject.plannedWeeks != null && subject.weeklyVolume != null) {
    lines.push(
      `Test: ${subject.testType}, ${subject.splitDescription ?? 'even split'}, ${subject.plannedWeeks} weeks at ~${subject.weeklyVolume.toLocaleString()} users/week`
    )
  }

  return lines.join('\n')
}

function fmt(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}`
}
