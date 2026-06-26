import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../server/app";

const originalKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  process.env.OPENAI_API_KEY = originalKey;
});

describe("POST /api/analyze", () => {
  it("returns analysis for sample descriptions", async () => {
    delete process.env.OPENAI_API_KEY;
    const app = createApp();
    const response = await request(app)
      .post("/api/analyze")
      .send({ description: "We measured catalase enzyme activity at several temperatures." })
      .expect(200);

    expect(response.body.templateId).toBe("enzyme-activity-temperature");
    expect(response.body.columns.length).toBeGreaterThan(1);
    expect(response.body.sources[0].url).toMatch(/^https:\/\//);
    expect(response.body.groundingStatus.mode).toBe("fallback");
  });

  it("returns a helpful validation error for empty descriptions", async () => {
    const app = createApp();
    const response = await request(app).post("/api/analyze").send({ description: "   " }).expect(400);

    expect(response.body.error).toContain("Describe the experiment");
  });

  it("does not crash without OPENAI_API_KEY", async () => {
    delete process.env.OPENAI_API_KEY;
    const app = createApp();
    const response = await request(app)
      .post("/api/analyze")
      .send({ description: "Projectile lab with angle and range data" })
      .expect(200);

    expect(response.body.groundingStatus.note).toContain("No OpenAI API key");
  });
});
