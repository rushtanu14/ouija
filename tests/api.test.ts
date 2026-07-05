import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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
    expect(response.body.guidedFlow.steps.length).toBe(6);
    expect(response.body.modelStrategy.candidates.length).toBe(8);
    expect(response.body.modelStrategy.signals.some((signal: { label: string }) => signal.label === "Classifier confidence")).toBe(true);
    expect(response.body.officialRubricFit.criteria).toHaveLength(3);
    expect(response.body.officialRubricFit.criteria.some((criterion: { label: string }) => criterion.label === "Problem Definition and Real-World Relevance")).toBe(true);
    expect(response.body.impactSnapshot.metrics).toHaveLength(7);
    expect(response.body.impactSnapshot.evidenceLoop).toHaveLength(5);
    expect(response.body.learningExitTicket.status).toBe("ready");
    expect(response.body.learningExitTicket.prompts).toHaveLength(3);
    expect(response.body.learningExitTicket.prompts[0].studentPrompt).toContain("independent variable");
    expect(response.body.expectedComparison.summary).toContain("Dashed expected overlay");
    expect(response.body.expectedComparison.points.length).toBeGreaterThan(0);
    expect(response.body.groundingAudit.summary).toContain("visible citation");
    expect(response.body.groundingAudit.checks.some((check: { id: string }) => check.id === "source-agreement" || check.id === "agreement")).toBe(true);
    expect(response.body.dataHandlingLedger.status).toBe("privacy_preserving");
    expect(response.body.dataHandlingLedger.score).toBeGreaterThanOrEqual(90);
    expect(response.body.dataHandlingLedger.flows.some((flow: { id: string }) => flow.id === "local-snapshot")).toBe(true);
    expect(response.body.dataHandlingLedger.safeguards).toContain("API key stays server-side; the browser never receives OPENAI_API_KEY.");
    expect(response.body.aiEvaluationHarness.summary).toContain("AI evaluation checks");
    expect(response.body.aiEvaluationHarness.checks.some((check: { id: string }) => check.id === "coverage-benchmark")).toBe(true);
    expect(response.body.aiEvaluationHarness.judgeSignal).toContain("Judges");
    expect(response.body.judgeDemoPath.steps).toHaveLength(5);
    expect(response.body.judgeDemoPath.nextBestAction).toContain("Model Strategy");
    expect(response.body.customLabTriage.status).toBe("supported_template");
    expect(response.body.customLabTriage.suggestedColumns.length).toBeGreaterThan(1);
    expect(response.body.patternEvidence.summary).toContain("whole table");
    expect(response.body.reliabilityCoach.summary).toContain("repeat");
    expect(response.body.reliabilityCoach.repeatGroups.length).toBeGreaterThan(0);
    expect(response.body.conceptCoach.vocabulary.length).toBeGreaterThan(0);
    expect(response.body.safetyCoach.status).toBe("adult_review");
    expect(response.body.nextTrialPlan.nextMeasurement).toContain("temperature");
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

  it("returns a custom investigation planner for unsupported student experiments", async () => {
    delete process.env.OPENAI_API_KEY;
    const app = createApp();
    const response = await request(app)
      .post("/api/analyze")
      .send({ description: "We compared paper towel brands by measuring how much water each towel absorbed." })
      .expect(200);

    expect(response.body.classification.matchQuality).toBe("closest_supported");
    expect(response.body.customLabTriage.status).toBe("needs_student_details");
    expect(response.body.customLabTriage.planner.independentVariable).toBe("Paper towel brand or type");
    expect(response.body.customLabTriage.planner.dependentVariable).toBe("Water absorbed");
    expect(response.body.customLabTriage.planner.starterRows.map((row: { condition: string }) => row.condition)).toEqual([
      "Brand A",
      "Brand B",
      "Brand C"
    ]);
  });

  it("serves the built frontend for production deployments", async () => {
    const staticDir = mkdtempSync(join(tmpdir(), "ouija-static-"));
    writeFileSync(join(staticDir, "index.html"), "<main>Ouija production shell</main>");

    const app = createApp({ staticDir });
    const response = await request(app).get("/").expect(200);

    expect(response.text).toContain("Ouija production shell");
  });
});

describe("GET /api/evaluate", () => {
  it("returns the live evaluation bench for supported coverage and boundary behavior", async () => {
    const app = createApp();
    const response = await request(app).get("/api/evaluate").expect(200);

    expect(response.body.score).toBe(100);
    expect(response.body.passed).toBe(9);
    expect(response.body.total).toBe(9);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-pendulum")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-ohms-law")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-plant-light")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-density")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-unsupported-boundary")).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("guided workflow"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("model candidates"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("official rubric criteria"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("learning impact score"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("grounding audit"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("AI evaluation harness"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("judge demo steps"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("expected overlay points"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("pattern evidence"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("repeat reliability"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("safety coach"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom lab triage"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom planner rows"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("data handling ledger"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("learning exit ticket"))).toBe(true);
  });
});
