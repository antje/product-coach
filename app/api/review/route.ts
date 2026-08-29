import { NextResponse } from 'next/server'
import { GatewayError } from '@/lib/ai/gateway'
import { checkGuardrails, recordSpend } from '@/lib/coach/guardrails'
import { reviewBrief, ReviewError } from '@/lib/coach/review'
import { BriefInputSchema } from '@/lib/schemas'

export const runtime = 'nodejs'
// A review takes about 15 seconds. Vercel's default function timeout is 10, so
// without this the call is killed mid-flight and surfaces as a generic upstream
// failure that looks like a model problem and is not one.
export const maxDuration = 60

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = BriefInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'That brief is not a shape we can review.', details: parsed.error.issues },
      { status: 400 }
    )
  }

  // Checked before the model call, so a blocked request costs nothing.
  const gate = await checkGuardrails()
  if (!gate.allowed) {
    return NextResponse.json(
      { error: gate.reason, kind: 'demo-limit', retryable: gate.retryable },
      { status: 429 }
    )
  }

  try {
    const result = await reviewBrief(parsed.data)
    // Preflight refusals never reach a model, so they are free and do not count.
    if (result.kind !== 'preflight-refused') {
      recordSpend(gate.sessionId, result.usage.costUsd)
    }
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof GatewayError) {
      // Credentials missing is a setup problem, not a server fault, and saying
      // so plainly saves someone reading logs.
      const status = err.kind === 'missing-credentials' ? 503 : err.kind === 'rate-limited' ? 429 : 502
      return NextResponse.json({ error: err.message, kind: err.kind }, { status })
    }
    if (err instanceof ReviewError) {
      return NextResponse.json({ error: err.message, kind: 'invalid-objection' }, { status: 502 })
    }
    console.error('review failed', err)
    return NextResponse.json({ error: 'The review failed.' }, { status: 500 })
  }
}
