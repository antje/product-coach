import type { CallOutcome, Objection } from '@/lib/types'

/**
 * Whether a call was right.
 *
 * The rule is deliberately narrow, and the narrowness is the point.
 *
 * An objection carries an explicit, falsifiable prediction: a metric, a
 * direction, and a number. That can be checked against what happened, and it
 * is checked exactly as stated with no interpretation.
 *
 * A decline carries no prediction. The coach looked at the history and said it
 * had nothing to go on. Scoring that as right or wrong would mean inventing a
 * prediction it never made, and a scoreboard built on invented predictions is
 * the thing this product exists to replace. Declines are counted and shown, so
 * the flag rate stays visible, but they never move the hit rate.
 */
export function scoreCall(
  objection: Objection | null,
  actualLiftPp: number
): { outcome: CallOutcome; explanation: string } {
  if (!objection) {
    return {
      outcome: 'not-scored',
      explanation:
        'The coach declined to object, so it made no prediction. A decline is counted in the flag rate but never scored, because scoring a prediction that was never made would be inventing signal.',
    }
  }

  const { direction, thresholdPp, metric } = objection.expectedEffect
  const right = direction === 'below' ? actualLiftPp < thresholdPp : actualLiftPp > thresholdPp
  const actual = fmt(actualLiftPp)
  const threshold = fmt(thresholdPp)

  return {
    outcome: right ? 'right' : 'wrong',
    explanation: right
      ? `The coach predicted ${metric} would land ${direction} ${threshold}. It landed ${actual}. The call was right.`
      : `The coach predicted ${metric} would land ${direction} ${threshold}. It landed ${actual}. The call was wrong.`,
  }
}

function fmt(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}pp`
}
