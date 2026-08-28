import { NextResponse } from 'next/server'
import { z } from 'zod'
import { GatewayError } from '@/lib/ai/gateway'
import { checkGuardrails, recordSpend } from '@/lib/coach/guardrails'
import { assertNoLeakage, replayExperiment } from '@/lib/coach/replay'
import { ReviewError } from '@/lib/coach/review'
import { saveCall } from '@/lib/ledger/calls'
import { hasDatabase, NO_DATABASE_MESSAGE } from '@/lib/ledger/db'
import { experimentToSubject } from '@/lib/types'

export const runtime = 'nodejs'

const Body = z.object({ experimentId: z.string().min(1).max(40) })

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Expected { experimentId }.' }, { status: 400 })
  }

  const gate = await checkGuardrails()
  if (!gate.allowed) {
    return NextResponse.json(
      { error: gate.reason, kind: 'demo-limit', retryable: gate.retryable },
      { status: 429 }
    )
  }

  try {
    const result = await replayExperiment(parsed.data.experimentId)
    if (result.kind === 'not-found') {
      return NextResponse.json({ error: 'No such experiment.' }, { status: 404 })
    }

    const { experiment, review } = result
    recordSpend(gate.sessionId, review.usage.costUsd)

    // The integrity of the entire exercise. If the coach cited anything that
    // read out on or after the experiment under review, it saw the future and
    // the result is void. Fail loudly.
    if (review.kind === 'objection') {
      assertNoLeakage(review.objection.citedExperimentIds, experiment.readDate)
    }

    const callId = crypto.randomUUID()
    const saved = await saveCall({
      id: callId,
      sessionId: gate.sessionId,
      kind: 'replay',
      experimentId: experiment.id,
      subject: experimentToSubject(experiment),
      objection: review.kind === 'objection' ? review.objection : null,
      promptVersion:
        review.kind === 'objection' ? review.objection.promptVersion : review.usage.promptVersion,
      model: review.usage.model,
      costUsd: review.usage.costUsd,
    })

    return NextResponse.json({
      callId,
      saved,
      savedMessage: saved ? null : NO_DATABASE_MESSAGE,
      hasDatabase: hasDatabase(),
      // The outcome is deliberately absent. It is revealed only after the user
      // has committed to an answer, which is the whole point of a blind replay.
      experiment: {
        id: experiment.id,
        name: experiment.name,
        hypothesis: experiment.hypothesis,
        mechanism: experiment.mechanism,
        audience: experiment.audience,
        primaryMetric: experiment.primaryMetric,
        baselinePp: experiment.baselinePp,
        expectedLiftPp: experiment.expectedLiftPp,
        readDate: experiment.readDate,
        startDate: experiment.startDate,
      },
      review,
    })
  } catch (err) {
    if (err instanceof GatewayError) {
      const status = err.kind === 'missing-credentials' ? 503 : err.kind === 'rate-limited' ? 429 : 502
      return NextResponse.json({ error: err.message, kind: err.kind }, { status })
    }
    if (err instanceof ReviewError) {
      return NextResponse.json({ error: err.message, kind: 'invalid-objection' }, { status: 502 })
    }
    if (err instanceof Error && err.message.startsWith('As-of guard violated')) {
      return NextResponse.json({ error: err.message, kind: 'leakage' }, { status: 500 })
    }
    console.error('replay failed', err)
    return NextResponse.json({ error: 'The replay failed.' }, { status: 500 })
  }
}
