import request from "supertest";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../server/app";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildEvidencePacket } from "../src/lib/evidencePacket";
import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan";
import { createMcpSessionTicket } from "../server/mcpBridge";

const originalKey = process.env.OPENAI_API_KEY;
const composioEnvKeys = [
  "COMPOSIO_API_KEY",
  "COMPOSIO_LIVE_EXPORTS",
  "COMPOSIO_SESSION_USER_ID",
  "COMPOSIO_API_BASE_URL",
  "MCP_SESSION_AUTH_TOKEN",
  ...MCP_CONNECTOR_CATALOG.flatMap((connector) => [
    `COMPOSIO_${connector.envSuffix}_AUTH_CONFIG_ID`,
    `COMPOSIO_${connector.envSuffix}_ALLOWED_TOOLS`
  ])
];
const originalComposioEnv = new Map(composioEnvKeys.map((key) => [key, process.env[key]]));

afterEach(() => {
  process.env.OPENAI_API_KEY = originalKey;
  for (const key of composioEnvKeys) {
    const value = originalComposioEnv.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("POST /api/analyze", () => {
  it("does not expose provider errors to students", async () => {
    const app = createApp({
      enrichExperiment: async () => {
        throw new Error("OPENAI_API_KEY rejected for project secret-project-id");
      }
    });
    const response = await request(app)
      .post("/api/analyze")
      .send({ description: "Projectile motion lab using launch angle and range data." })
      .expect(200);

    expect(response.body.groundingStatus.note).toContain("web enrichment was unavailable");
    expect(response.body.groundingStatus.note).not.toContain("secret-project-id");
    expect(response.body.groundingStatus.note).not.toContain("OPENAI_API_KEY");
  });

  it("rejects oversized experiment descriptions", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/analyze")
      .send({ description: "x".repeat(2_001) })
      .expect(400);

    expect(response.body.error).toContain("2,000 characters or fewer");
  });

  it("rejects malformed and oversized student tables", async () => {
    const app = createApp();
    const malformed = await request(app)
      .post("/api/analyze")
      .send({ description: "Projectile motion lab", rows: ["not-a-row"] })
      .expect(400);
    const oversized = await request(app)
      .post("/api/analyze")
      .send({
        description: "Projectile motion lab",
        rows: Array.from({ length: 201 }, (_, index) => ({ id: String(index), angleDeg: 45 }))
      })
      .expect(400);

    expect(malformed.body.error).toContain("valid table rows");
    expect(oversized.body.error).toContain("200 rows or fewer");
  });

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
    expect(response.body.aiyesValuesFit.score).toBeGreaterThanOrEqual(90);
    expect(response.body.aiyesValuesFit.values).toHaveLength(5);
    expect(response.body.aiyesValuesFit.values.map((value: { id: string }) => value.id)).toContain("democracy");
    expect(response.body.aiyesValuesFit.values.map((value: { id: string }) => value.id)).toContain("innovation");
    expect(response.body.developmentJourney.score).toBeGreaterThanOrEqual(90);
    expect(response.body.developmentJourney.stages).toHaveLength(8);
    expect(response.body.developmentJourney.stages.map((stage: { id: string }) => stage.id)).toContain("testing-evaluation");
    expect(response.body.impactSnapshot.metrics).toHaveLength(7);
    expect(response.body.impactSnapshot.evidenceLoop).toHaveLength(5);
    expect(response.body.studentPilotStudyKit.status).toBe("ready_to_pilot");
    expect(response.body.studentPilotStudyKit.metrics).toHaveLength(4);
    expect(response.body.studentPilotStudyKit.consentBoundary).toContain("No names");
    expect(response.body.studentPilotStudyKit.protocol.researchQuestion).toContain("graph-backed next step");
    expect(response.body.studentPilotStudyKit.protocol.successThresholds).toContain("At least 3 anonymous observations are logged.");
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
    expect(response.body.customLabTriage.patternArchetype.id).toBe("comparison");
    expect(response.body.customLabTriage.patternArchetype.graphSuggestion).toContain("Bar chart");
    expect(response.body.customLabTriage.patternArchetype.expectedPattern).toContain("should not assume a winner");
    expect(response.body.studentPilotStudyKit.status).toBe("needs_review");
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
  it("returns the live deterministic regression suite for supported coverage and boundary behavior", async () => {
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

describe("GET /api/runtime-proof", () => {
  it("returns runtime proof without exposing OpenAI or Composio credentials", async () => {
    delete process.env.OPENAI_API_KEY;
    clearComposioEnv();
    const app = createApp();
    const response = await request(app).get("/api/runtime-proof").expect(200);

    expect(response.body.status).toBe("fallback_ready");
    expect(response.body.webSearchConfigured).toBe(false);
    expect(response.body.templateCount).toBe(8);
    expect(response.body.evaluationPassed).toBe(9);
    expect(response.body.evaluationCaseCount).toBe(9);
    expect(response.body.serverOnlyKeyBoundary).toBe(true);
    expect(response.body.mcpBridgeMode).toBe("server_dry_run");
    expect(response.body.signals.some((signal: { id: string; value: string }) => signal.id === "grounding" && signal.value === "Trusted fallback active")).toBe(true);
    expect(response.body.judgeTakeaway).toContain("judge-demoable without credentials");
    expect(JSON.stringify(response.body)).not.toContain("sk-");
    expect(JSON.stringify(response.body)).not.toContain("COMPOSIO_API_KEY=");
  });
});

describe("Composio MCP bridge API", () => {
  it("reports server dry-run readiness without exposing Composio credentials", async () => {
    clearComposioEnv();
    const app = createApp();
    const response = await request(app).get("/api/mcp/status").expect(200);

    expect(response.body.status).toBe("server_dry_run");
    expect(response.body.mode).toBe("server_dry_run");
    expect(response.body.apiKeyConfigured).toBe(false);
    expect(response.body.missingEnv).toContain("COMPOSIO_API_KEY");
    expect(response.body.toolkits).toHaveLength(15);
    expect(response.body.missingEnv.filter((value: string) => value === "COMPOSIO_SEARCH_ALLOWED_TOOLS")).toHaveLength(1);
    expect(response.body.missingEnv.filter((value: string) => value === "COMPOSIO_BROWSER_ALLOWED_TOOLS")).toHaveLength(1);
    expect(response.body.missingEnv.filter((value: string) => value === "COMPOSIO_DEEPWIKI_ALLOWED_TOOLS")).toHaveLength(1);
    expect(response.body.missingEnv.filter((value: string) => value === "COMPOSIO_SEMANTIC_SCHOLAR_AUTH_CONFIG_ID")).toHaveLength(1);
    expect(response.body.missingEnv.filter((value: string) => value === "COMPOSIO_CANVAS_AUTH_CONFIG_ID")).toHaveLength(1);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-search-source-audit")?.authConfigRequired).toBe(false);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-scholar-claim-check")?.recommendedTools).toEqual([
      "COMPOSIO_SEARCH_SCHOLAR"
    ]);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-scholar-claim-check")?.missingEnv).toEqual([
      "COMPOSIO_SEARCH_ALLOWED_TOOLS"
    ]);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "semanticscholar-reference-check")?.toolkitSlug).toBe(
      "semanticscholar"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "semanticscholar-reference-check")?.recommendedTools).toContain(
      "SEMANTICSCHOLAR_SEARCH_PAPERS"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "canvas-assignment-context")?.toolkitSlug).toBe("canvas");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "canvas-assignment-context")?.recommendedTools).toContain(
      "CANVAS_GET_ASSIGNMENT_RUBRIC"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-browser-source-capture")?.authConfigRequired).toBe(false);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-browser-source-capture")?.missingEnv).toEqual([
      "COMPOSIO_BROWSER_ALLOWED_TOOLS"
    ]);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "deepwiki-source-proof")?.toolkitSlug).toBe("deepwiki_mcp");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "deepwiki-source-proof")?.authConfigRequired).toBe(false);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "deepwiki-source-proof")?.recommendedTools).toContain(
      "DEEPWIKI_MCP_ASK_QUESTION"
    );
    expect(response.body.toolkits.find((toolkit: { toolkit: string }) => toolkit.toolkit === "Google Calendar")?.recommendedTools).toContain(
      "GOOGLECALENDAR_CREATE_EVENT"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "google-slides-submission-deck")?.toolkitSlug).toBe(
      "googleslides"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "google-slides-submission-deck")?.recommendedTools).toContain(
      "GOOGLESLIDES_CREATE_SLIDES_MARKDOWN"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "gmail-teacher-review-draft")?.toolkitSlug).toBe("gmail");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "gmail-teacher-review-draft")?.recommendedTools).toEqual([
      "GMAIL_CREATE_EMAIL_DRAFT"
    ]);
    expect(JSON.stringify(response.body)).not.toContain("sk-");
  });

  it("validates a consent-gated MCP action packet as a dry run", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Google Calendar");
    expect(response.body.summary).toContain("no Composio");
    expect(response.body.target.toolkitSlug).toBe("googlecalendar");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID");
    expect(response.body.sanitizedPayload.rowCount).toBe(result.rows.length);
    expect(response.body.checks.find((check: { id: string }) => check.id === "consent")?.status).toBe("pass");
    expect(response.body.checks.find((check: { id: string }) => check.id === "credentials")?.status).toBe("review");
  });

  it("rejects malformed MCP rows and unsafe source URLs", async () => {
    clearComposioEnv();
    const app = createApp();
    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: "Evidence packet",
          description: "Projectile motion lab",
          evidencePacket: "Claim: ___",
          rows: ["not-a-row"],
          sources: [{ id: "bad", title: "Bad", url: "javascript:alert(1)", publisher: "Bad", confidence: "web", note: "Bad" }]
        }
      })
      .expect(400);

    expect(response.body.error).toContain("valid MCP export action");
  });

  it("validates a Composio Search source-audit packet without requiring an account auth config", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "composio-search-source-audit",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Composio Search");
    expect(response.body.target.toolkitSlug).toBe("composio_search");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_SEARCH_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toContain("COMPOSIO_SEARCH_SCHOLAR");
    expect(response.body.checks.find((check: { id: string }) => check.id === "credentials")?.status).toBe("review");
  });

  it("validates a Scholar claim-check packet as a Composio Search dry run", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "composio-scholar-claim-check",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Composio Search");
    expect(response.body.target.toolkitSlug).toBe("composio_search");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_SEARCH_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toEqual(["COMPOSIO_SEARCH_SCHOLAR"]);
    expect(response.body.checks.find((check: { id: string }) => check.id === "integrity")?.status).toBe("pass");
  });

  it("validates a Composio Browser source-capture packet without requiring an account auth config", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "composio-browser-source-capture",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Composio Browser");
    expect(response.body.target.toolkitSlug).toBe("browser_tool");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_BROWSER_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toEqual(["BROWSER_TOOL_CREATE_TASK", "BROWSER_TOOL_WATCH_TASK"]);
    expect(response.body.checks.find((check: { id: string }) => check.id === "credentials")?.status).toBe("review");
  });

  it("validates a Semantic Scholar reference-check packet with scoped paper tools", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "semanticscholar-reference-check",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Semantic Scholar");
    expect(response.body.target.toolkitSlug).toBe("semanticscholar");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_SEMANTIC_SCHOLAR_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toContain("SEMANTICSCHOLAR_SEARCH_PAPERS");
    expect(response.body.checks.find((check: { id: string }) => check.id === "credentials")?.status).toBe("review");
  });

  it("validates a Canvas assignment-context packet as read-only LMS setup", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "canvas-assignment-context",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Canvas");
    expect(response.body.target.toolkitSlug).toBe("canvas");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_CANVAS_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toContain("CANVAS_GET_ASSIGNMENT_RUBRIC");
    expect(response.body.summary).toContain("no Composio");
  });

  it("validates a Gmail teacher-review draft packet without sending email", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "gmail-teacher-review-draft",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Gmail");
    expect(response.body.target.toolkitSlug).toBe("gmail");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_GMAIL_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toEqual(["GMAIL_CREATE_EMAIL_DRAFT"]);
    expect(response.body.summary).toContain("no Composio");
  });

  it("validates a Google Slides submission deck draft packet", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "google-slides-submission-deck",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Google Slides");
    expect(response.body.target.toolkitSlug).toBe("googleslides");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_GOOGLE_SLIDES_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toContain("GOOGLESLIDES_CREATE_SLIDES_MARKDOWN");
    expect(response.body.summary).toContain("no Composio");
  });

  it("validates a DeepWiki public-source proof packet without requiring an account auth config", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "deepwiki-source-proof",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("DeepWiki");
    expect(response.body.target.toolkitSlug).toBe("deepwiki_mcp");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_DEEPWIKI_AUTH_CONFIG_ID");
    expect(response.body.target.recommendedTools).toContain("DEEPWIKI_MCP_ASK_QUESTION");
    expect(response.body.checks.find((check: { id: string }) => check.id === "credentials")?.status).toBe("review");
  });

  it("prepares a scoped Composio session ticket as a dry run without credentials", async () => {
    clearComposioEnv();
    const app = createApp();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");

    const response = await request(app)
      .post("/api/mcp/session")
      .send({
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      })
      .expect(200);

    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Google Calendar");
    expect(response.body.sessionPlan.enabledToolkit).toBe("googlecalendar");
    expect(response.body.sessionPlan.enabledTools).toContain("GOOGLECALENDAR_CREATE_EVENT");
    expect(response.body.sessionPlan.mcpUrlIssued).toBe(false);
    expect(response.body.target.sessionUserEnv).toBe("COMPOSIO_SESSION_USER_ID");
    expect(JSON.stringify(response.body)).not.toContain("ak_");
  });

  it("does not create a live Composio session without server authorization", async () => {
    const result = analyzeExperiment({ description: "Projectile launch angle and measured range." });
    const fetchCalls: string[] = [];
    const response = await createMcpSessionTicket(
      {
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range."),
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID: "ac_calendar_secret",
        COMPOSIO_GOOGLE_CALENDAR_ALLOWED_TOOLS: "GOOGLECALENDAR_CREATE_EVENT",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      async (url) => {
        fetchCalls.push(url);
        throw new Error("must not be called");
      }
    );

    expect(response.statusCode).toBe(403);
    expect(response.body).toEqual({ error: "Live MCP session creation requires authorized server access." });
    expect(fetchCalls).toHaveLength(0);
  });

  it("returns a controlled gateway error when Composio is unreachable", async () => {
    const result = analyzeExperiment({ description: "Projectile launch angle and measured range." });
    const response = await createMcpSessionTicket(
      {
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range."),
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID: "ac_calendar_secret",
        COMPOSIO_GOOGLE_CALENDAR_ALLOWED_TOOLS: "GOOGLECALENDAR_CREATE_EVENT",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      async () => {
        throw new Error("network secret details");
      },
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(502);
    expect(response.body).toEqual({ error: "Composio session creation was unavailable." });
  });

  it("does not reflect untrusted origins in CORS", async () => {
    clearComposioEnv();
    const app = createApp();
    const response = await request(app).get("/api/mcp/status").set("Origin", "https://attacker.example").expect(200);

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("creates a live Composio session server-side when the selected toolkit is configured", async () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock = async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          session_id: "trs_abcdef123456",
          mcp: {
            url: "https://app.composio.dev/tool_router/v3/trs_abcdef123456/mcp"
          }
        })
      } as Response;
    };

    const response = await createMcpSessionTicket(
      {
        actionId: "google-calendar-next-trial-reminder",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_GOOGLE_CALENDAR_AUTH_CONFIG_ID: "ac_calendar_secret",
        COMPOSIO_GOOGLE_CALENDAR_ALLOWED_TOOLS: "GOOGLECALENDAR_CREATE_EVENT",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      fetchMock,
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(200);
    expect("sessionPlan" in response.body).toBe(true);
    if (!("sessionPlan" in response.body)) {
      throw new Error("Expected a Composio session response.");
    }
    expect(response.body.status).toBe("created");
    expect(response.body.mode).toBe("server_mcp");
    expect(response.body.sessionPlan.mcpUrlIssued).toBe(true);
    expect(response.body.sessionPlan.sessionIdPreview).toBe("trs_ab...3456");
    expect(response.body.checks.find((check) => check.id === "credentials")?.status).toBe("pass");
    expect(JSON.stringify(response.body)).not.toContain("ak_test_secret");
    expect(JSON.stringify(response.body)).not.toContain("ac_calendar_secret");
    expect(JSON.stringify(response.body)).not.toContain("https://app.composio.dev/tool_router");
    expect(fetchCalls).toHaveLength(1);
    expect(fetchCalls[0].url).toBe("https://backend.composio.dev/api/v3.1/tool_router/session");
    expect((fetchCalls[0].init?.headers as Record<string, string>)["x-api-key"]).toBe("ak_test_secret");
    const body = JSON.parse(fetchCalls[0].init?.body as string) as {
      user_id: string;
      toolkits: { enable: string[] };
      auth_configs: Record<string, string>;
      tools: Record<string, { enable: string[] }>;
    };
    expect(body.user_id).toBe("ouija-demo-student");
    expect(body.toolkits.enable).toEqual(["googlecalendar"]);
    expect(body.auth_configs.googlecalendar).toBe("ac_calendar_secret");
    expect(body.tools.googlecalendar.enable).toEqual(["GOOGLECALENDAR_CREATE_EVENT"]);
  });

  it("creates a live Composio Search session without sending an auth config", async () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock = async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          session_id: "trs_search123456",
          mcp: {
            url: "https://app.composio.dev/tool_router/v3/trs_search123456/mcp"
          }
        })
      } as Response;
    };

    const response = await createMcpSessionTicket(
      {
        actionId: "composio-search-source-audit",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_SEARCH_ALLOWED_TOOLS: "COMPOSIO_SEARCH_WEB,COMPOSIO_SEARCH_SCHOLAR,COMPOSIO_SEARCH_FETCH_URL_CONTENT",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      fetchMock,
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(200);
    expect("sessionPlan" in response.body).toBe(true);
    if (!("sessionPlan" in response.body)) {
      throw new Error("Expected a Composio Search session response.");
    }
    expect(response.body.status).toBe("created");
    expect(response.body.sessionPlan.enabledToolkit).toBe("composio_search");
    expect(response.body.sessionPlan.authConfigConfigured).toBe(true);
    expect(response.body.sessionPlan.enabledTools).toContain("COMPOSIO_SEARCH_SCHOLAR");
    expect(fetchCalls).toHaveLength(1);
    const body = JSON.parse(fetchCalls[0].init?.body as string) as {
      user_id: string;
      toolkits: { enable: string[] };
      auth_configs?: Record<string, string>;
      tools: Record<string, { enable: string[] }>;
    };
    expect(body.toolkits.enable).toEqual(["composio_search"]);
    expect(body.auth_configs).toBeUndefined();
    expect(body.tools.composio_search.enable).toEqual([
      "COMPOSIO_SEARCH_WEB",
      "COMPOSIO_SEARCH_SCHOLAR",
      "COMPOSIO_SEARCH_FETCH_URL_CONTENT"
    ]);
  });

  it("creates a live Composio Scholar-only session without sending an auth config", async () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock = async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          session_id: "trs_scholar123456",
          mcp: {
            url: "https://app.composio.dev/tool_router/v3/trs_scholar123456/mcp"
          }
        })
      } as Response;
    };

    const response = await createMcpSessionTicket(
      {
        actionId: "composio-scholar-claim-check",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_SEARCH_ALLOWED_TOOLS: "COMPOSIO_SEARCH_SCHOLAR",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      fetchMock,
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(200);
    expect("sessionPlan" in response.body).toBe(true);
    if (!("sessionPlan" in response.body)) {
      throw new Error("Expected a Composio Scholar session response.");
    }
    expect(response.body.status).toBe("created");
    expect(response.body.sessionPlan.enabledToolkit).toBe("composio_search");
    expect(response.body.sessionPlan.enabledTools).toEqual(["COMPOSIO_SEARCH_SCHOLAR"]);
    expect(fetchCalls).toHaveLength(1);
    const body = JSON.parse(fetchCalls[0].init?.body as string) as {
      toolkits: { enable: string[] };
      auth_configs?: Record<string, string>;
      tools: Record<string, { enable: string[] }>;
    };
    expect(body.toolkits.enable).toEqual(["composio_search"]);
    expect(body.auth_configs).toBeUndefined();
    expect(body.tools.composio_search.enable).toEqual(["COMPOSIO_SEARCH_SCHOLAR"]);
  });

  it("creates a live Gmail draft session server-side without exposing the MCP URL", async () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock = async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          session_id: "trs_gmail123456",
          mcp: {
            url: "https://app.composio.dev/tool_router/v3/trs_gmail123456/mcp"
          }
        })
      } as Response;
    };

    const response = await createMcpSessionTicket(
      {
        actionId: "gmail-teacher-review-draft",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_GMAIL_AUTH_CONFIG_ID: "ac_gmail_secret",
        COMPOSIO_GMAIL_ALLOWED_TOOLS: "GMAIL_CREATE_EMAIL_DRAFT",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      fetchMock,
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(200);
    expect("sessionPlan" in response.body).toBe(true);
    if (!("sessionPlan" in response.body)) {
      throw new Error("Expected a Gmail session response.");
    }
    expect(response.body.status).toBe("created");
    expect(response.body.sessionPlan.enabledToolkit).toBe("gmail");
    expect(response.body.sessionPlan.enabledTools).toEqual(["GMAIL_CREATE_EMAIL_DRAFT"]);
    expect(JSON.stringify(response.body)).not.toContain("ac_gmail_secret");
    expect(JSON.stringify(response.body)).not.toContain("https://app.composio.dev/tool_router");
    expect(fetchCalls).toHaveLength(1);
    const body = JSON.parse(fetchCalls[0].init?.body as string) as {
      toolkits: { enable: string[] };
      auth_configs?: Record<string, string>;
      tools: Record<string, { enable: string[] }>;
    };
    expect(body.toolkits.enable).toEqual(["gmail"]);
    expect(body.auth_configs?.gmail).toBe("ac_gmail_secret");
    expect(body.tools.gmail.enable).toEqual(["GMAIL_CREATE_EMAIL_DRAFT"]);
  });

  it("creates a live Google Slides deck session server-side without exposing credentials", async () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const packet = buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range.");
    const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
    const fetchMock = async (url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init });
      return {
        ok: true,
        json: async () => ({
          session_id: "trs_slides123456",
          mcp: {
            url: "https://app.composio.dev/tool_router/v3/trs_slides123456/mcp"
          }
        })
      } as Response;
    };

    const response = await createMcpSessionTicket(
      {
        actionId: "google-slides-submission-deck",
        consent: true,
        payload: {
          title: `Ouija Evidence Packet: ${result.classification.title}`,
          description: "Projectile launch angle and measured range.",
          evidencePacket: packet,
          rows: result.rows,
          sources: result.sources
        }
      },
      {
        COMPOSIO_API_KEY: "ak_test_secret",
        COMPOSIO_LIVE_EXPORTS: "true",
        COMPOSIO_SESSION_USER_ID: "ouija-demo-student",
        COMPOSIO_GOOGLE_SLIDES_AUTH_CONFIG_ID: "ac_slides_secret",
        COMPOSIO_GOOGLE_SLIDES_ALLOWED_TOOLS: "GOOGLESLIDES_CREATE_SLIDES_MARKDOWN",
        MCP_SESSION_AUTH_TOKEN: "server-only-token"
      },
      fetchMock,
      "Bearer server-only-token"
    );

    expect(response.statusCode).toBe(200);
    expect("sessionPlan" in response.body).toBe(true);
    if (!("sessionPlan" in response.body)) {
      throw new Error("Expected a Google Slides session response.");
    }
    expect(response.body.status).toBe("created");
    expect(response.body.sessionPlan.enabledToolkit).toBe("googleslides");
    expect(response.body.sessionPlan.enabledTools).toEqual(["GOOGLESLIDES_CREATE_SLIDES_MARKDOWN"]);
    expect(JSON.stringify(response.body)).not.toContain("ac_slides_secret");
    expect(JSON.stringify(response.body)).not.toContain("https://app.composio.dev/tool_router");
    expect(fetchCalls).toHaveLength(1);
    const body = JSON.parse(fetchCalls[0].init?.body as string) as {
      toolkits: { enable: string[] };
      auth_configs?: Record<string, string>;
      tools: Record<string, { enable: string[] }>;
    };
    expect(body.toolkits.enable).toEqual(["googleslides"]);
    expect(body.auth_configs?.googleslides).toBe("ac_slides_secret");
    expect(body.tools.googleslides.enable).toEqual(["GOOGLESLIDES_CREATE_SLIDES_MARKDOWN"]);
  });

  it("rejects MCP dry-runs without explicit consent", async () => {
    const app = createApp();
    const response = await request(app)
      .post("/api/mcp/export")
      .send({
        actionId: "google-docs-evidence-packet",
        consent: false,
        payload: {
          title: "Ouija Evidence Packet",
          description: "A lab",
          evidencePacket: "Claim: ___",
          rows: [{ id: "row-1" }],
          sources: [{ id: "source-1", publisher: "Demo", title: "Demo", url: "https://example.com", note: "Demo" }]
        }
      })
      .expect(400);

    expect(response.body.error).toContain("consent");
  });
});

function clearComposioEnv() {
  for (const key of composioEnvKeys) {
    delete process.env[key];
  }
}
