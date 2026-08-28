import type { ReviewResult } from '@/lib/coach/review'
import type { Brief } from '@/lib/types'

/**
 * The typed call the review screen makes.
 *
 * Pages never fetch directly. Keeping the call here means the screen above it
 * can be redrawn or regenerated wholesale without anyone having to remember
 * what the API expects back.
 */

export type ReviewFailure = { error: string; kind?: string }

export async function requestReview(brief: Brief): Promise<ReviewResult> {
  const response = await fetch('/api/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(brief),
  })

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as ReviewFailure | null
    throw new Error(failure?.error ?? 'The review failed.')
  }

  return (await response.json()) as ReviewResult
}
