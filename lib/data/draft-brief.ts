import type { Brief } from '@/lib/types'

/**
 * The brief the review screen opens on.
 *
 * Written to pass every preflight check, so the default path shows the coach
 * doing its real work against the history rather than bouncing on a technicality.
 * The numbers line up with where the corpus leaves activation in Aug 2026.
 *
 * It is also the case the history has the most to say about: a feeling-led
 * change aimed at activation for new workspaces. Editing it is how you see the
 * other behaviours. Clear the read date and the coach refuses before spending
 * anything. Change the audience to activated teams and it should decline or
 * soften, because the record there points the other way.
 */
export const DRAFT_BRIEF: Brief = {
  id: 'brief-draft-1',
  title: 'Make the workspace feel like home',
  hypothesis:
    'If we add a personalized welcome message to the dashboard, new users will feel more invested and activate more often.',
  mechanism: 'personalization',
  audience: 'new-workspaces',
  primaryMetric: 'Activation rate',
  metricDefinition: 'Completes 3 key actions within 7 days of signup',
  baselinePp: 67.2,
  expectedLiftPp: 8.0,
  testType: 'A/B test',
  splitDescription: '50 / 50 split',
  weeklyVolume: 1400,
  plannedWeeks: 2,
  readDate: '2026-09-17',
  guardrails: [
    {
      metric: 'Signup completion',
      maxDropPp: 2,
      rawText: 'Signup completion must not drop more than 2 points',
    },
    {
      metric: 'Day-7 return rate',
      maxDropPp: 1.5,
      rawText: 'Day-7 return must not drop more than 1.5 points',
    },
  ],
  targetDerivation:
    'Activation sits at 67.2%. Of the 32.8% who do not activate, roughly a quarter stall on the empty dashboard rather than dropping out earlier, which is about 8 points of the funnel. The target assumes the welcome message recovers all of them.',
  author: 'Jordan Smith',
}
