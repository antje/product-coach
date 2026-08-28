import { db } from './db'
import type { CallOutcome, Objection, ReviewSubject, TeamResponse, TrackRecord } from '@/lib/types'

/**
 * Six queries against one table. Written as SQL because at this size an ORM
 * would be more machinery than it removes.
 */

export type CallKind = 'draft' | 'replay'

export interface Call {
  id: string
  sessionId: string
  kind: CallKind
  experimentId: string | null
  subject: ReviewSubject
  objection: Objection | null
  promptVersion: string
  model: string
  costUsd: number
  teamResponse: TeamResponse | null
  respondedAt: string | null
  actualLiftPp: number | null
  callOutcome: CallOutcome
  resolvedAt: string | null
  createdAt: string
}

export async function saveCall(call: {
  id: string
  sessionId: string
  kind: CallKind
  experimentId: string | null
  subject: ReviewSubject
  objection: Objection | null
  promptVersion: string
  model: string
  costUsd: number
}): Promise<boolean> {
  const sql = db()
  if (!sql) return false
  await sql`
    INSERT INTO calls (id, session_id, kind, experiment_id, subject_json, objection_json,
                       prompt_version, model, cost_usd, call_outcome)
    VALUES (${call.id}, ${call.sessionId}, ${call.kind}, ${call.experimentId},
            ${JSON.stringify(call.subject)}, ${call.objection ? JSON.stringify(call.objection) : null},
            ${call.promptVersion}, ${call.model}, ${call.costUsd},
            ${call.objection ? 'untested' : 'not-scored'})
  `
  return true
}

export async function recordResponse(
  id: string,
  sessionId: string,
  response: TeamResponse
): Promise<boolean> {
  const sql = db()
  if (!sql) return false
  const rows = await sql`
    UPDATE calls SET team_response = ${response}, responded_at = now()
    WHERE id = ${id} AND session_id = ${sessionId}
    RETURNING id
  `
  return rows.length > 0
}

export async function resolveCall(
  id: string,
  sessionId: string,
  actualLiftPp: number,
  outcome: CallOutcome
): Promise<boolean> {
  const sql = db()
  if (!sql) return false
  const rows = await sql`
    UPDATE calls SET actual_lift_pp = ${actualLiftPp}, call_outcome = ${outcome}, resolved_at = now()
    WHERE id = ${id} AND session_id = ${sessionId}
    RETURNING id
  `
  return rows.length > 0
}

export async function getCall(id: string, sessionId: string): Promise<Call | null> {
  const sql = db()
  if (!sql) return null
  const rows = await sql`
    SELECT * FROM calls WHERE id = ${id} AND session_id = ${sessionId}
  `
  return rows.length ? toCall(rows[0]) : null
}

export async function listCalls(sessionId: string): Promise<Call[]> {
  const sql = db()
  if (!sql) return []
  const rows = await sql`
    SELECT * FROM calls WHERE session_id = ${sessionId} ORDER BY created_at DESC LIMIT 200
  `
  return rows.map(toCall)
}

/**
 * The scoreboard. Declines count toward flagged-versus-not but never toward the
 * hit rate, so a coach cannot improve its score by staying quiet.
 */
export async function trackRecord(sessionId: string): Promise<TrackRecord> {
  const sql = db()
  if (!sql) {
    return { objectionType: 'all', flagged: 0, shippedAnyway: 0, resolved: 0, right: 0, hitRate: null }
  }
  const rows = await sql`
    SELECT
      count(*) FILTER (WHERE objection_json IS NOT NULL)                      AS flagged,
      count(*) FILTER (WHERE team_response = 'shipped-anyway')                AS shipped_anyway,
      count(*) FILTER (WHERE call_outcome IN ('right', 'wrong'))              AS resolved,
      count(*) FILTER (WHERE call_outcome = 'right')                          AS right_calls
    FROM calls WHERE session_id = ${sessionId}
  `
  const r = rows[0] ?? {}
  const flagged = Number(r.flagged ?? 0)
  const shippedAnyway = Number(r.shipped_anyway ?? 0)
  const resolved = Number(r.resolved ?? 0)
  const right = Number(r.right_calls ?? 0)
  return {
    objectionType: 'all',
    flagged,
    shippedAnyway,
    resolved,
    right,
    hitRate: resolved > 0 ? right / resolved : null,
  }
}

function toCall(r: Record<string, unknown>): Call {
  return {
    id: String(r.id),
    sessionId: String(r.session_id),
    kind: r.kind as CallKind,
    experimentId: (r.experiment_id as string | null) ?? null,
    subject: parse<ReviewSubject>(r.subject_json)!,
    objection: parse<Objection>(r.objection_json),
    promptVersion: String(r.prompt_version),
    model: String(r.model),
    costUsd: Number(r.cost_usd ?? 0),
    teamResponse: (r.team_response as TeamResponse | null) ?? null,
    respondedAt: asIso(r.responded_at),
    actualLiftPp: r.actual_lift_pp == null ? null : Number(r.actual_lift_pp),
    callOutcome: r.call_outcome as CallOutcome,
    resolvedAt: asIso(r.resolved_at),
    createdAt: asIso(r.created_at) ?? new Date().toISOString(),
  }
}

// JSONB comes back already parsed; a text column would not. Handle both.
function parse<T>(value: unknown): T | null {
  if (value == null) return null
  return typeof value === 'string' ? (JSON.parse(value) as T) : (value as T)
}

function asIso(value: unknown): string | null {
  if (value == null) return null
  return value instanceof Date ? value.toISOString() : String(value)
}
