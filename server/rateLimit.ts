interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitState {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitState>();

export function consumeRateLimit(key: string, options: RateLimitOptions, now = Date.now()) {
  const existing = buckets.get(key);
  const current = existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + options.windowMs };
  const next = { ...current, count: current.count + 1 };

  buckets.set(key, next);

  if (next.count <= options.limit) {
    return { allowed: true, retryAfterSeconds: 0 };
  }

  return {
    allowed: false,
    retryAfterSeconds: Math.max(1, Math.ceil((next.resetAt - now) / 1000))
  };
}

export function resetRateLimitsForTests() {
  buckets.clear();
}

export function resolveAnalyzeRateLimit(env: Partial<Pick<NodeJS.ProcessEnv, "OPENAI_API_KEY" | "OUIJA_ANALYZE_RATE_LIMIT">> = process.env) {
  const configuredLimit = Number(env.OUIJA_ANALYZE_RATE_LIMIT);
  if (Number.isInteger(configuredLimit) && configuredLimit > 0) return configuredLimit;

  return env.OPENAI_API_KEY ? 20 : 120;
}
