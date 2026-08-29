import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import type { z } from 'zod'
import { MODEL_FOR_TASK, PRICING, type Task } from './router'

/**
 * The only file in this repo that imports a model provider's SDK.
 *
 * Everything else calls generateStructured() and never learns which provider
 * answered. That is what makes swapping providers a change to two files rather
 * than a search across the codebase. It is the difference between a technology
 * choice and a dependency.
 */

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    // Two different readers need two different messages. A developer running
    // this locally needs the file to edit. A visitor on a deployment cannot act
    // on that advice at all and should just be told the thing is not configured.
    throw new GatewayError(
      'missing-credentials',
      process.env.VERCEL
        ? 'This deployment has no model key configured, so it cannot run a review. Everything else on the site works.'
        : 'ANTHROPIC_API_KEY is not set. Copy .env.example to .env and fill it in.'
    )
  }
  client ??= new Anthropic()
  return client
}

export type GatewayErrorKind =
  | 'missing-credentials'
  | 'schema-mismatch'
  | 'rate-limited'
  | 'upstream'

export class GatewayError extends Error {
  constructor(
    readonly kind: GatewayErrorKind,
    message: string,
    readonly cause?: unknown
  ) {
    super(message)
    this.name = 'GatewayError'
  }
}

/** What one model call cost and how it behaved. Every call produces one. */
export interface UsageRecord {
  task: Task
  model: string
  promptVersion: string
  inputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
  latencyMs: number
  costUsd: number
}

export interface StructuredRequest<T> {
  task: Task
  /**
   * Ordered stable-to-volatile. Blocks marked cacheable form the prefix, so
   * anything that changes per request must come after them or the cache is
   * invalidated on every call.
   */
  system: { text: string; cacheable?: boolean }[]
  user: string
  schema: z.ZodType<T>
  promptVersion: string
  maxTokens?: number
}

export interface GatewayResult<T> {
  data: T
  usage: UsageRecord
}

/**
 * Ask a model for a value that satisfies a schema.
 *
 * Uses structured outputs rather than parsing prose, so a malformed objection
 * is a caught error rather than a plausible-looking string that fails later.
 */
export async function generateStructured<T>(
  req: StructuredRequest<T>
): Promise<GatewayResult<T>> {
  const model = MODEL_FOR_TASK[req.task]
  const startedAt = Date.now()

  let response
  try {
    response = await getClient().messages.parse({
      model,
      max_tokens: req.maxTokens ?? 4096,
      system: req.system.map((block) => ({
        type: 'text' as const,
        text: block.text,
        ...(block.cacheable ? { cache_control: { type: 'ephemeral' as const } } : {}),
      })),
      messages: [{ role: 'user', content: req.user }],
      output_config: { format: zodOutputFormat(req.schema as z.ZodType<object>) },
    })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw new GatewayError('rate-limited', 'The model is rate limited. Try again shortly.', err)
    }
    if (err instanceof GatewayError) throw err

    // Surface what actually happened. A bare "the model call failed" forces
    // whoever is debugging to guess between a bad key, a timeout, an
    // unavailable model and a network fault, which are four different fixes.
    const detail =
      err instanceof Anthropic.APIError
        ? `${err.status ?? 'no status'}: ${err.message}`
        : err instanceof Error
          ? err.message
          : String(err)
    console.error('[gateway] model call failed', { model, detail })
    throw new GatewayError('upstream', `The model call failed. ${detail}`, err)
  }

  // parsed_output is null when the response did not satisfy the schema.
  if (response.parsed_output == null) {
    throw new GatewayError(
      'schema-mismatch',
      'The model returned a response that did not match the expected shape.'
    )
  }

  const u = response.usage
  const cacheRead = u.cache_read_input_tokens ?? 0
  const cacheWrite = u.cache_creation_input_tokens ?? 0

  return {
    data: response.parsed_output as T,
    usage: {
      task: req.task,
      model,
      promptVersion: req.promptVersion,
      inputTokens: u.input_tokens,
      outputTokens: u.output_tokens,
      cacheReadTokens: cacheRead,
      cacheWriteTokens: cacheWrite,
      latencyMs: Date.now() - startedAt,
      costUsd: costOf(model, u.input_tokens, u.output_tokens, cacheRead, cacheWrite),
    },
  }
}

/**
 * Cost of one call in USD.
 *
 * Base rates live in router.ts. Cache-write is billed at 1.25x base input and
 * cache-read at 0.1x. Those are the standard multipliers. Re-check both
 * against the published pricing before either number goes into a
 * financial model.
 */
export function costOf(
  model: string,
  inputTokens: number,
  outputTokens: number,
  cacheReadTokens: number,
  cacheWriteTokens: number
): number {
  const rate = PRICING[model]
  if (!rate) return 0
  const perToken = (usd: number) => usd / 1_000_000
  return (
    inputTokens * perToken(rate.inputPerMTok) +
    outputTokens * perToken(rate.outputPerMTok) +
    cacheWriteTokens * perToken(rate.inputPerMTok * 1.25) +
    cacheReadTokens * perToken(rate.inputPerMTok * 0.1)
  )
}

export function hasCredentials(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}
