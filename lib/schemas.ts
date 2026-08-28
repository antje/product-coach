import { z } from 'zod'

/**
 * Validation for anything crossing the network boundary.
 *
 * Kept apart from lib/types.ts so the domain types stay plain TypeScript and
 * readable. These schemas exist to reject bad input at the edge, which is a
 * different job from describing the domain.
 */

export const GuardrailInputSchema = z.object({
  metric: z.string().min(1),
  maxDropPp: z.number().nullable(),
  rawText: z.string().min(1),
})

export const MechanismSchema = z.enum([
  'personalization',
  'social-proof',
  'urgency',
  'incentive',
  'reduce-steps',
  'time-to-value',
  'defaults',
  'education',
  'notification',
  'pricing-display',
])

export const AudienceSchema = z.enum([
  'new-workspaces',
  'trial-day-7',
  'activated-teams',
  'returning-users',
  'all-users',
])

export const BriefInputSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  // Capped because the public demo pays for every token that arrives here.
  hypothesis: z.string().min(1).max(2000),
  mechanism: MechanismSchema,
  audience: AudienceSchema,
  primaryMetric: z.string().min(1).max(120),
  metricDefinition: z.string().max(500),
  baselinePp: z.number().min(0).max(100),
  expectedLiftPp: z.number().min(-100).max(100),
  testType: z.string().max(120),
  splitDescription: z.string().max(200),
  weeklyVolume: z.number().int().min(0).max(100_000_000),
  plannedWeeks: z.number().min(0).max(520),
  readDate: z.string().nullable(),
  guardrails: z.array(GuardrailInputSchema).max(20),
  targetDerivation: z.string().max(2000).nullable(),
  author: z.string().max(120),
})

export type BriefInput = z.infer<typeof BriefInputSchema>
