import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/coach/guardrails'
import { experimentById } from '@/lib/data/corpus'
import { getCall, recordResponse, resolveCall } from '@/lib/ledger/calls'
import { hasDatabase, NO_DATABASE_MESSAGE } from '@/lib/ledger/db'
import { scoreCall } from '@/lib/ledger/scoring'

export const runtime = 'nodejs'

const Body = z.object({
  response: z.enum(['accepted', 'shipped-anyway', 'dismissed']),
  /** Present on a replay, so the reveal works even with no database attached. */
  experimentId: z.string().max(40).nullable().optional(),
})

/**
 * Record what the team did with a call, then reveal the outcome if there is one.
 *
 * The order matters. The answer is captured before the outcome is shown, so the
 * user commits without knowing. Reveal first and the record is worthless.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // params is a Promise in this Next version. Awaiting it is not optional.
  const { id } = await params

  const parsed = Body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Expected { response }.' }, { status: 400 })
  }

  const sessionId = await getSession()
  const persisted = await recordResponse(id, sessionId, parsed.data.response)

  // The stored call is the source of truth when a database exists. Without one
  // we fall back to the experiment id the client supplies, so the journey still
  // completes; it just leaves no trace, and says so.
  const call = await getCall(id, sessionId)
  const experimentId = call?.experimentId ?? parsed.data.experimentId ?? null
  const experiment = experimentId ? experimentById(experimentId) : undefined

  if (!experiment) {
    return NextResponse.json({
      persisted,
      persistedMessage: persisted ? null : NO_DATABASE_MESSAGE,
      hasDatabase: hasDatabase(),
      // A drafted brief has no outcome yet. That is the honest answer, and it
      // is why the record separates open calls from resolved ones.
      reveal: null,
    })
  }

  // Without a database there is no stored record of what the coach predicted,
  // so the call cannot be scored. Say that plainly rather than reporting
  // "not-scored", which would be indistinguishable from a genuine decline and
  // would quietly understate the flag rate.
  const scored = call
    ? scoreCall(call.objection, experiment.actualLiftPp)
    : {
        outcome: 'untested' as const,
        explanation:
          'The outcome is shown, but this call could not be scored. Nothing was stored, so there is no record of what the coach predicted to check it against. Set DATABASE_URL to keep score.',
      }

  const { outcome, explanation } = scored
  const resolved = await resolveCall(id, sessionId, experiment.actualLiftPp, outcome)

  return NextResponse.json({
    persisted: persisted && resolved,
    persistedMessage: persisted && resolved ? null : NO_DATABASE_MESSAGE,
    hasDatabase: hasDatabase(),
    reveal: {
      actualLiftPp: experiment.actualLiftPp,
      expectedLiftPp: experiment.expectedLiftPp,
      shipped: experiment.outcome,
      readDate: experiment.readDate,
      outcome,
      explanation,
    },
  })
}
