import { NextResponse } from 'next/server'
import { EXPERIMENTS } from '@/lib/data/corpus'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Says whether a deployment is actually configured.
 *
 * Missing environment variables do not break a Next.js build, so a deploy can
 * go green and still be unable to run a review. Hitting /api/health after a
 * deploy answers that in one request, without exposing any value.
 */
export async function GET() {
  const configured = {
    anthropicApiKey: Boolean(process.env.ANTHROPIC_API_KEY),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    webhookSigningSecret: Boolean(process.env.WEBHOOK_SIGNING_SECRET),
  }

  return NextResponse.json({
    ok: configured.anthropicApiKey,
    configured,
    experimentsLoaded: EXPERIMENTS.length,
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local',
    environment: process.env.VERCEL_ENV ?? 'development',
  })
}
