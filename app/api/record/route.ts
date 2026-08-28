import { NextResponse } from 'next/server'
import { getSession } from '@/lib/coach/guardrails'
import { listCalls, trackRecord } from '@/lib/ledger/calls'
import { hasDatabase } from '@/lib/ledger/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const sessionId = await getSession()
  const [calls, record] = await Promise.all([listCalls(sessionId), trackRecord(sessionId)])
  return NextResponse.json({ calls, record, hasDatabase: hasDatabase() })
}
