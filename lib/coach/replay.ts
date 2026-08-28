import { experimentById } from '@/lib/data/corpus'
import { experimentToSubject, type Experiment } from '@/lib/types'
import { formObjection, type ReviewResult } from './review'

/**
 * Review an experiment that already ran, as if it had not.
 *
 * Preflight is skipped, and that is deliberate rather than a shortcut. The four
 * preflight checks are about brief hygiene: is there a read date, is the metric
 * powered, does each guardrail carry a number, was the target derived. Those
 * are questions for a document being drafted. A historical experiment was
 * written and run years ago and carries none of those fields, so running the
 * checks would mean inventing eight values and then grading the invention.
 *
 * What replay tests is the only thing worth testing here: given what this team
 * knew at the time, would the coach have objected, and would it have been right.
 */
export type ReplayResult =
  | { kind: 'not-found' }
  | {
      kind: 'reviewed'
      experiment: Experiment
      review: Exclude<ReviewResult, { kind: 'preflight-refused' }>
    }

export async function replayExperiment(id: string): Promise<ReplayResult> {
  const experiment = experimentById(id)
  if (!experiment) return { kind: 'not-found' }

  const review = await formObjection(experimentToSubject(experiment), {
    // Strictly before this experiment read out. experimentsAsOf uses `<`, so
    // the experiment under review is excluded from its own evidence.
    asOf: experiment.readDate,
    checkDate: experiment.readDate,
    subjectId: experiment.id,
  })

  return { kind: 'reviewed', experiment, review }
}

/**
 * The guard, as an assertion rather than a comment.
 *
 * Called by the API route on every replay. If it ever throws, the result of
 * every backtest this product has ever produced is void, so it fails loudly
 * rather than logging a warning nobody reads.
 */
export function assertNoLeakage(citedIds: string[], asOf: string): void {
  const leaked = citedIds.filter((id) => {
    const e = experimentById(id)
    return e != null && e.readDate >= asOf
  })
  if (leaked.length > 0) {
    throw new Error(
      `As-of guard violated: the coach cited ${leaked.join(', ')}, which read out on or after ${asOf}. The replay saw the future and the result is void.`
    )
  }
}
