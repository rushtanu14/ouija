import { beforeEach, describe, expect, it } from "vitest";
import { consumeRateLimit, resetRateLimitsForTests } from "../server/rateLimit";

describe("rate limiting", () => {
  beforeEach(() => resetRateLimitsForTests());

  it("blocks requests after the configured budget and reports retry timing", () => {
    expect(consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 })).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 })).toEqual({ allowed: true, retryAfterSeconds: 0 });

    const blocked = consumeRateLimit("student-1", { limit: 2, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });
});
