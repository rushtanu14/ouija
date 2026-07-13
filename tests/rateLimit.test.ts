import { beforeEach, describe, expect, it } from "vitest";
import { consumeRateLimit, resetRateLimitsForTests, resolveAnalyzeRateLimit } from "../server/rateLimit";

describe("rate limiting", () => {
  beforeEach(() => resetRateLimitsForTests());

  it("blocks requests after the configured budget and reports retry timing", () => {
    expect(consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 })).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 })).toEqual({ allowed: true, retryAfterSeconds: 0 });

    const blocked = consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resolves analysis budgets for fallback, OpenAI, and explicit classroom test overrides", () => {
    expect(resolveAnalyzeRateLimit({})).toBe(120);
    expect(resolveAnalyzeRateLimit({ OPENAI_API_KEY: "sk-test" })).toBe(20);
    expect(resolveAnalyzeRateLimit({ OPENAI_API_KEY: "sk-test", OUIJA_ANALYZE_RATE_LIMIT: "1000" })).toBe(1000);
    expect(resolveAnalyzeRateLimit({ OUIJA_ANALYZE_RATE_LIMIT: "0" })).toBe(120);
  });
});
