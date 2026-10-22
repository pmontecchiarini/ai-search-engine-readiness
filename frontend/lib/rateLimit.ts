import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

const hasUpstashConfig = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Without Upstash configured (e.g. local dev before setting up a database),
// allow every request rather than crashing — production always sets these.
const noopLimiter = { limit: async () => ({ success: true }) };

if (!hasUpstashConfig) {
  console.warn('[rateLimit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is disabled.');
}

export const rateLimiter = hasUpstashConfig
  ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '1 m') })
  : noopLimiter;

/** Best-effort client IP from the forwarding header Vercel sets; local dev has none. */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return 'unknown';
}
