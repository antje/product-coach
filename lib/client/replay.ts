import type { ReviewResult } from '@/lib/coach/review'
import type { Call } from '@/lib/ledger/calls'
import type { CallOutcome, TeamResponse, TrackRecord } from '@/lib/types'

/**
 * The typed calls the replay and record screens make.
 *
 * Pages never fetch directly, so a screen can be redrawn without anyone having
 * to remember what the API expects back.
 */

/** The experiment as the coach sees it. No outcome: that is the point. */
export interface BlindExperiment {
  id: string
  name: string
  hypothesis: string
  mechanism: string
  audience: string
  primaryMetric: string
  baselinePp: number
  expectedLiftPp: number
  readDate: string
  startDate: string
}

export interface ReplayResponse {
  callId: string
  saved: boolean
  savedMessage: string | null
  hasDatabase: boolean
  experiment: BlindExperiment
  review: Exclude<ReviewResult, { kind: 'preflight-refused' }>
}

export interface Reveal {
  actualLiftPp: number
  expectedLiftPp: number
  shipped: string
  readDate: string
  outcome: CallOutcome
  explanation: string
}

export interface RespondResponse {
  persisted: boolean
  persistedMessage: string | null
  hasDatabase: boolean
  reveal: Reveal | null
}

export interface RecordResponse {
  calls: Call[]
  record: TrackRecord
  hasDatabase: boolean
}

export async function startReplay(experimentId: string): Promise<ReplayResponse> {
  return post('/api/replay', { experimentId })
}

export async function respondToCall(
  callId: string,
  response: TeamResponse,
  experimentId: string | null
): Promise<RespondResponse> {
  return post(`/api/calls/${encodeURIComponent(callId)}/respond`, { response, experimentId })
}

export async function fetchRecord(): Promise<RecordResponse> {
  const res = await fetch('/api/record', { cache: 'no-store' })
  if (!res.ok) throw new Error('Could not load the record.')
  return res.json()
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const failure = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(failure?.error ?? 'The request failed.')
  }
  return res.json()
}
