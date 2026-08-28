import { NextResponse } from 'next/server'
import { GatewayError } from '@/lib/ai/gateway'
import { reviewBrief, ReviewError } from '@/lib/coach/review'
import { BriefInputSchema } from '@/lib/schemas'

export const runtime = 'nodejs'

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

  try {
    const result = await reviewBrief(parsed.data)
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
