import { describe, expect, it } from "vitest";
import { validateAnalyzeRequest } from "../server/requestValidation";

describe("validateAnalyzeRequest", () => {
  it("accepts JSON string bodies and trims descriptions", () => {
    const result = validateAnalyzeRequest(JSON.stringify({
      description: "  Projectile motion lab  ",
      allowExternalGrounding: true,
      rows: [{ id: "row-1", angleDeg: 45, note: "safe" }]
    }));

    expect(result).toEqual({
      ok: true,
      value: {
        description: "Projectile motion lab",
        allowExternalGrounding: true,
        rows: [{ id: "row-1", angleDeg: 45, note: "safe" }]
      }
    });
  });

  it("rejects invalid body shapes before analysis", () => {
    expect(validateAnalyzeRequest("{not json")).toMatchObject({ ok: false, error: expect.stringContaining("Describe the experiment") });
    expect(validateAnalyzeRequest(JSON.stringify(["Projectile motion lab"]))).toMatchObject({ ok: false, error: expect.stringContaining("Describe the experiment") });
    expect(validateAnalyzeRequest({ description: "Projectile", rows: "not rows" })).toMatchObject({ ok: false, error: expect.stringContaining("array") });
    expect(validateAnalyzeRequest({ description: "Projectile", rows: Array.from({ length: 201 }, (_, index) => ({ id: `row-${index}` })) })).toMatchObject({
      ok: false,
      error: expect.stringContaining("200 rows")
    });
  });

  it("rejects rows with unsafe ids, field counts, keys, numbers, or text cells", () => {
    const cases = [
      [{ id: "   ", angleDeg: 45 }],
      [{ id: "row-1", angleDeg: Number.POSITIVE_INFINITY }],
      [{ id: "row-1", note: "x".repeat(501) }],
      [{ id: "row-1", ["x".repeat(101)]: "value" }],
      [Object.fromEntries(Array.from({ length: 33 }, (_, index) => [`field-${index}`, String(index)]))]
    ];

    for (const rows of cases) {
      expect(validateAnalyzeRequest({ description: "Projectile", rows })).toMatchObject({
        ok: false,
        error: expect.stringContaining("bounded text or numeric cells")
      });
    }
  });

  it("omits rows and opt-in when they are not explicitly provided", () => {
    expect(validateAnalyzeRequest({ description: "  Projectile motion lab  " })).toEqual({
      ok: true,
      value: {
        description: "Projectile motion lab",
        allowExternalGrounding: false
      }
    });
  });
});
