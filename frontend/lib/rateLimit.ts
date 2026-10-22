import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

// Vercel's "Upstash for Redis" marketplace integration names these
// KV_REST_API_URL / KV_REST_API_TOKEN (the legacy Vercel KV convention), not
// the UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN names @upstash/redis
// expects by default — support both so either setup path works.
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const hasUpstashConfig = !!REDIS_URL && !!REDIS_TOKEN;

// Without Upstash configured (e.g. local dev before setting up a database),
// allow every request rather than crashing — production always sets these.
const noopLimiter = { limit: async () => ({ success: true }) };

if (!hasUpstashConfig) {
  console.warn(
    '[rateLimit] No Redis credentials found (checked UPSTASH_REDIS_REST_URL/TOKEN and KV_REST_API_URL/TOKEN) — rate limiting is disabled.'
  );
}

export const rateLimiter = hasUpstashConfig
  ? new Ratelimit({
      redis: new Redis({ url: REDIS_URL!, token: REDIS_TOKEN! }),
      limiter: Ratelimit.slidingWindow(5, '1 m'),
    })
  : noopLimiter;

/** Best-effort client IP from the forwarding header Vercel sets; local dev has none. */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return 'unknown';
}
