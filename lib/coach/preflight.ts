import type { Brief } from '@/lib/types'

/**
 * The four refusals, as deterministic checks.
 *
 * The /experiment-brief coach refuses a brief with no read date fixed before
 * launch, a primary metric the volume cannot power inside the window, a
 * guardrail without a numeric boundary, or a success target that is asserted
 * rather than derived. None of those needs a model to detect. They are
 * properties of the brief.
 *
 * Running them first means an unreviewable brief costs nothing, and the
 * product's opinions are the same every time rather than varying with a
 * sampling temperature. A refusal that only fires sometimes is not a refusal.
 */

export type PreflightCode =
  | 'no-read-date'
  | 'underpowered'
  | 'guardrail-without-boundary'
  | 'undevised-target'

export interface PreflightIssue {
  code: PreflightCode
  /** What the coach says. Written to be read by the PM, not logged. */
  message: string
  /** What would clear it. */
  remedy: string
  /** Shown when the check did arithmetic, so the PM can check the work. */
  arithmetic?: string
}

export interface PreflightResult {
  ok: boolean
  issues: PreflightIssue[]
}

/**
 * Users per arm needed to detect an absolute difference `deltaPp` on a
 * baseline rate, at 80% power and a 5% two-sided significance level.
 *
 *   n ≈ 16 · p(1−p) / δ²        with p and δ as proportions
 *
 * The 16 folds in (z(0.975) + z(0.80))² ≈ 7.85, doubled for two arms and
 * rounded up. That is the standard planning approximation. It is deliberately
 * the simple version. The comparison between two candidate metrics is usually
 * so lopsided that more precision would not change the decision.
 */
export function sampleSizePerArm(baselinePp: number, deltaPp: number): number {
  const p = baselinePp / 100
  const delta = Math.abs(deltaPp) / 100
  if (delta === 0) return Infinity
  return Math.ceil((16 * p * (1 - p)) / (delta * delta))
}

export function weeksToPower(brief: Brief): number {
  const perArm = sampleSizePerArm(brief.baselinePp, brief.expectedLiftPp)
  if (!Number.isFinite(perArm) || brief.weeklyVolume <= 0) return Infinity
  // Two arms, split evenly, so the whole weekly intake enrolls both.
  return (perArm * 2) / brief.weeklyVolume
}

export function preflight(brief: Brief): PreflightResult {
  const issues: PreflightIssue[] = []

  if (!brief.readDate) {
    issues.push({
      code: 'no-read-date',
      message:
        'This brief has no read date. A test without a date fixed before launch gets read when someone feels like looking, and significance reached early and acted on is a false positive machine.',
      remedy: 'Set the read date now, before the test starts, and do not look before it.',
    })
  }

  const weeks = weeksToPower(brief)
  if (!Number.isFinite(weeks)) {
    issues.push({
      code: 'underpowered',
      message:
        'This brief expects no change, or reports no weekly volume, so there is no window in which it could reach a conclusion.',
      remedy: 'State the expected lift and the weekly volume entering the test.',
    })
  } else if (weeks > brief.plannedWeeks) {
    const perArm = sampleSizePerArm(brief.baselinePp, brief.expectedLiftPp)
    issues.push({
      code: 'underpowered',
      message: `At ${brief.weeklyVolume.toLocaleString()} users a week, ${brief.primaryMetric} needs about ${weeks.toFixed(
        1
      )} weeks to detect ${brief.expectedLiftPp > 0 ? '+' : ''}${brief.expectedLiftPp}pp, but the test is planned for ${brief.plannedWeeks}. It would be read before it could say anything.`,
      remedy:
        'Either run it longer, or make the primary metric a leading indicator that is common enough to power inside the window and schedule the lagging outcome its own confirmatory read later.',
      arithmetic: `n per arm ≈ 16 × ${(brief.baselinePp / 100).toFixed(3)} × ${(
        1 -
        brief.baselinePp / 100
      ).toFixed(3)} ÷ ${(brief.expectedLiftPp / 100).toFixed(4)}² ≈ ${perArm.toLocaleString()}; ${perArm.toLocaleString()} × 2 ÷ ${brief.weeklyVolume.toLocaleString()} ≈ ${weeks.toFixed(
        1
      )} weeks`,
    })
  }

  const vague = brief.guardrails.filter((g) => g.maxDropPp == null)
  if (brief.guardrails.length === 0) {
    issues.push({
      code: 'guardrail-without-boundary',
      message: 'This brief has no guardrails, so nothing is protected while the change is live.',
      remedy: 'Name what must not degrade, and give each one a numeric boundary.',
    })
  } else if (vague.length > 0) {
    issues.push({
      code: 'guardrail-without-boundary',
      message: `${vague.length === 1 ? 'A guardrail is' : `${vague.length} guardrails are`} written as a direction rather than a boundary: ${vague
        .map((g) => `"${g.rawText}"`)
        .join(', ')}. "Watch it" is not a threshold anyone can breach.`,
      remedy:
        'Give each one a number. "Sign-up completion must not drop more than 2 points", not "watch sign-ups".',
    })
  }

  if (!brief.targetDerivation) {
    issues.push({
      code: 'undevised-target',
      message: `The ${brief.expectedLiftPp > 0 ? '+' : ''}${brief.expectedLiftPp}pp target is asserted, not derived. A number nobody can trace is a number nobody can defend when it is missed.`,
      remedy:
        'Show where it comes from: how much the change yields on volume alone, and which design element is supposed to supply the rest.',
    })
  }

  return { ok: issues.length === 0, issues }
}
