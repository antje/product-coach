/**
 * Which model answers which question.
 *
 * Routing lives in its own file so that changing a model is a one-line edit
 * with a visible blast radius, and so the cost of each kind of work is
 * separable. A product that sends everything to one model cannot answer
 * "what does a review actually cost". The number would be an average over
 * unrelated jobs.
 */

export type Task =
  /** Cheap pass: is there anything in this team's history worth objecting about? */
  | 'triage'
  /** The objection itself. The one call where being right matters most. */
  | 'objection'
  /** Grading a produced objection during evaluation. */
  | 'judge'

export const MODEL_FOR_TASK: Record<Task, string> = {
  triage: 'claude-haiku-4-5',
  objection: 'claude-opus-5',
  judge: 'claude-sonnet-5',
}

/**
 * Base rates, USD per million tokens. Cache multipliers are applied in
 * gateway.ts. Verify against the published pricing page before these numbers
 * are used for anything but a rough per-review figure.
 */
export const PRICING: Record<string, { inputPerMTok: number; outputPerMTok: number }> = {
  'claude-opus-5': { inputPerMTok: 5, outputPerMTok: 25 },
  'claude-sonnet-5': { inputPerMTok: 2, outputPerMTok: 10 },
  'claude-haiku-4-5': { inputPerMTok: 1, outputPerMTok: 5 },
}
