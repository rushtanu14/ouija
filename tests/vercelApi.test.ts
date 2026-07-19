import { describe, expect, it, afterEach, vi } from "vitest";

const { mockResponsesCreate } = vi.hoisted(() => ({
  mockResponsesCreate: vi.fn()
}));

vi.mock("openai", () => ({
  default: class MockOpenAI {
    responses = {
      create: mockResponsesCreate
    };
  }
}));

import analyzeHandler from "../api/analyze";
import evaluateHandler from "../api/evaluate";
import healthHandler from "../api/health";
import mcpExportHandler from "../api/mcp/export";
import mcpSessionHandler from "../api/mcp/session";
import mcpStatusHandler from "../api/mcp/status";
import runtimeProofHandler from "../api/runtime-proof";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildEvidencePacket } from "../src/lib/evidencePacket";
import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan";
import { genericApiErrorMessage, withApiBoundary } from "../server/httpResponse";
import { resetRateLimitsForTests } from "../server/rateLimit";
import type { McpBridgePayload, McpIntegrationActionId } from "../src/lib/types";

const originalKey = process.env.OPENAI_API_KEY;
const originalExternalGroundingEnabled = process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED;
const originalNodeEnv = process.env.NODE_ENV;
const originalAnalyzeRateLimit = process.env.OUIJA_ANALYZE_RATE_LIMIT;
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
const forbiddenMcpFields = {
  pilotNotes: "observer noted a direct identifier",
  finalClaim: "This is the student's final claim."
};
const mcpRouteContractCases: Array<{ actionId: McpIntegrationActionId; category: McpBridgePayload["category"] }> = [
  { actionId: "composio-search-source-audit", category: "source" },
  { actionId: "composio-scholar-claim-check", category: "source" },
  { actionId: "semanticscholar-reference-check", category: "source" },
  { actionId: "composio-browser-source-capture", category: "source" },
  { actionId: "deepwiki-source-proof", category: "source" },
  { actionId: "canvas-assignment-context", category: "assignment_context" },
  { actionId: "google-docs-evidence-packet", category: "document_export" },
  { actionId: "google-slides-submission-deck", category: "deck_export" },
  { actionId: "google-sheets-data-log", category: "table_export" },
  { actionId: "google-drive-portfolio-archive", category: "portfolio_archive" },
  { actionId: "google-classroom-prelab-checkpoint", category: "classroom_checkpoint" },
  { actionId: "google-forms-readiness-check", category: "readiness_form" },
  { actionId: "google-calendar-next-trial-reminder", category: "calendar_reminder" },
  { actionId: "gmail-teacher-review-draft", category: "teacher_review_draft" },
  { actionId: "notion-learning-record", category: "learning_record" }
];

afterEach(() => {
  mockResponsesCreate.mockReset();
  resetRateLimitsForTests();
  restoreEnv("OPENAI_API_KEY", originalKey);
  restoreEnv("OUIJA_EXTERNAL_GROUNDING_ENABLED", originalExternalGroundingEnabled);
  restoreEnv("NODE_ENV", originalNodeEnv);
  restoreEnv("OUIJA_ANALYZE_RATE_LIMIT", originalAnalyzeRateLimit);
  for (const key of composioEnvKeys) {
    const value = originalComposioEnv.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

describe("Vercel API functions", () => {
  it("uses shared no-store security headers and JSON error envelopes", async () => {
    const cases = [
      {
        method: "POST",
        handler: healthHandler,
        error: "Use GET /api/health to check the Ouija API."
      },
      {
        method: "POST",
        handler: evaluateHandler,
        error: "Use GET /api/evaluate to run the Ouija deterministic regression suite."
      },
      {
        method: "POST",
        handler: runtimeProofHandler,
        error: "Use GET /api/runtime-proof to inspect Ouija runtime proof."
      },
      {
        method: "POST",
        handler: mcpStatusHandler,
        error: "Use GET /api/mcp/status to inspect Composio MCP readiness."
      },
      {
        method: "GET",
        handler: analyzeHandler,
        error: "Use POST /api/analyze to analyze a student experiment."
      },
      {
        method: "GET",
        handler: mcpExportHandler,
        error: "Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet."
      },
      {
        method: "GET",
        handler: mcpSessionHandler,
        error: "Use POST /api/mcp/session with execution preview or create."
      }
    ];

    for (const testCase of cases) {
      const response = createMockResponse();

      await testCase.handler({ method: testCase.method }, response.res);

      expect(response.statusCode).toBe(405);
      expect(response.headers["Cache-Control"]).toBe("no-store");
      expect(response.headers["X-Content-Type-Options"]).toBe("nosniff");
      expect(response.headers["Referrer-Policy"]).toBe("no-referrer");
      expect(response.body).toEqual({
        ok: false,
        error: testCase.error
      });
    }
  });

  it("uses the shared generic 500 envelope for unexpected serverless errors", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = createMockResponse();
    const handler = withApiBoundary(() => {
      throw new Error("OPENAI_API_KEY=sk-secret COMPOSIO_API_KEY=ak-secret");
    }, "GET /api/serverless-throw", "GET, OPTIONS");

    await handler(
      {
        method: "GET",
        headers: { origin: "https://ouija-olive.vercel.app" }
      },
      response.res
    );

    expect(response.statusCode).toBe(500);
    expect(response.headers["Cache-Control"]).toBe("no-store");
    expect(response.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(response.headers["Referrer-Policy"]).toBe("no-referrer");
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://ouija-olive.vercel.app");
    expect(response.body).toEqual({
      ok: false,
      error: genericApiErrorMessage
    });
    expect(JSON.stringify(response.body)).not.toContain("sk-secret");
    expect(JSON.stringify(response.body)).not.toContain("ak-secret");
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("sk-secret");
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain("ak-secret");
    expect(errorSpy).toHaveBeenCalledWith("ouija api failure", {
      context: "GET /api/serverless-throw",
      diagnosticClass: "Error"
    });
    errorSpy.mockRestore();
  });

  it("returns health status from the serverless health function", () => {
    const response = createMockResponse();

    healthHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true, service: "ouija-api" });
  });

  it("analyzes experiments through the serverless analyze function", async () => {
    delete process.env.OPENAI_API_KEY;
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        body: { description: "Projectile motion lab using launch angle and range data." }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.templateId).toBe("projectile-motion");
    expect(response.body.guidedFlow.currentAction).toContain("Write your own claim");
    expect(response.body.modelStrategy.decisionSummary).toContain("Selected Projectile Motion");
    expect(response.body.officialRubricFit.score).toBeGreaterThanOrEqual(90);
    expect(response.body.officialRubricFit.criteria).toHaveLength(3);
    expect(response.body.aiyesValuesFit.score).toBeGreaterThanOrEqual(90);
    expect(response.body.aiyesValuesFit.values).toHaveLength(5);
    expect(response.body.aiyesValuesFit.values.some((value: { id: string }) => value.id === "connectivity")).toBe(true);
    expect(response.body.developmentJourney.score).toBeGreaterThanOrEqual(90);
    expect(response.body.developmentJourney.stages).toHaveLength(8);
    expect(response.body.impactSnapshot.score).toBeGreaterThanOrEqual(90);
    expect(response.body.impactSnapshot.metrics).toHaveLength(7);
    expect(response.body.studentPilotStudyKit.status).toBe("ready_to_pilot");
    expect(response.body.studentPilotStudyKit.evidenceToCollect).toContain("Time to first graph");
    expect(response.body.studentPilotStudyKit.protocol.analysisPlan).toContain("counts and averages only");
    expect(response.body.learningExitTicket.status).toBe("ready");
    expect(response.body.learningExitTicket.prompts).toHaveLength(3);
    expect(response.body.expectedComparison.points.length).toBeGreaterThan(0);
    expect(response.body.dataHandlingLedger.status).toBe("privacy_preserving");
    expect(response.body.dataHandlingLedger.flows.some((flow: { id: string }) => flow.id === "server-api-key")).toBe(true);
    expect(response.body.customLabTriage.status).toBe("supported_template");
    expect(response.body.customLabTriage.suggestedColumns.length).toBeGreaterThan(1);
    expect(response.body.customLabTriage.planner.starterRows.length).toBeGreaterThan(0);
    expect(response.body.customLabTriage.patternArchetype.id).toBe("supported_template");
    expect(response.body.patternEvidence.status).toBe("supports_expected");
    expect(response.body.reliabilityCoach.recommendation).toContain("repeat");
    expect(response.body.conceptCoach.explanationSteps[0]).toContain("Watch");
    expect(response.body.safetyCoach.summary).toContain("launch path");
    expect(response.body.nextTrialPlan.studentQuestion).toContain("next");
    expect(response.body.groundingStatus.mode).toBe("fallback");
  });

  it("handles serverless analysis preflights and rate limits", async () => {
    const preflight = createMockResponse();
    await analyzeHandler(
      {
        method: "OPTIONS",
        headers: { origin: "https://ouija-olive.vercel.app" }
      },
      preflight.res
    );

    process.env.OUIJA_ANALYZE_RATE_LIMIT = "1";
    const first = createMockResponse();
    const blocked = createMockResponse();
    await analyzeHandler(
      {
        method: "POST",
        headers: { "x-forwarded-for": "198.51.100.5" },
        body: { description: "Projectile motion lab using launch angle and range data." }
      },
      first.res
    );
    await analyzeHandler(
      {
        method: "POST",
        headers: { "x-forwarded-for": "198.51.100.5" },
        body: { description: "Projectile motion lab using launch angle and range data." }
      },
      blocked.res
    );

    expect(preflight.statusCode).toBe(204);
    expect(preflight.ended).toBe(true);
    expect(preflight.headers["Access-Control-Allow-Origin"]).toBe("https://ouija-olive.vercel.app");
    expect(first.statusCode).toBe(200);
    expect(blocked.statusCode).toBe(429);
    expect(blocked.headers["Retry-After"]).toBeDefined();
    expect(blocked.body).toEqual({ ok: false, error: "Too many analysis requests. Try again shortly." });
  });

  it("validates empty experiment descriptions through the serverless analyze function", async () => {
    const response = createMockResponse();

    await analyzeHandler({ method: "POST", body: { description: "   " } }, response.res);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain("Describe the experiment");
  });

  it("skips serverless external grounding without explicit request opt-in", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED = "true";
    process.env.NODE_ENV = "development";
    mockResponsesCreate.mockResolvedValue({
      output_text: '{"expectedSummary":"External","explanation":"External","confidenceNote":"High"}',
      output: []
    });
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        body: { description: "Projectile motion lab using launch angle and range data." }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(mockResponsesCreate).not.toHaveBeenCalled();
    expect(response.body.groundingStatus.mode).toBe("fallback");
    expect(response.body.groundingStatus.note).toContain("explicit opt-in");
  });

  it("skips serverless external grounding in production even with request opt-in", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED = "true";
    process.env.NODE_ENV = "production";
    mockResponsesCreate.mockResolvedValue({
      output_text: '{"expectedSummary":"External","explanation":"External","confidenceNote":"High"}',
      output: []
    });
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        body: { description: "Projectile motion lab using launch angle and range data.", allowExternalGrounding: true }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(mockResponsesCreate).not.toHaveBeenCalled();
    expect(response.body.groundingStatus.mode).toBe("fallback");
    expect(response.body.groundingStatus.note).toContain("disabled in production");
  });

  it("uses serverless web enrichment when request and server gates allow it", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED = "true";
    process.env.NODE_ENV = "development";
    mockResponsesCreate.mockResolvedValue({
      output_text: '{"expectedSummary":"External summary","explanation":"External explanation","confidenceNote":"Mixed evidence"}',
      output: [{
        type: "message",
        content: [{
          annotations: [{ type: "url_citation", url: "https://science.example/source", title: "Source" }]
        }]
      }]
    });
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        body: { description: "Projectile motion lab using launch angle and range data.", allowExternalGrounding: true }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.expectedResult.summary).toBe("External summary");
    expect(response.body.explanation).toBe("External explanation");
    expect(response.body.sources[0].url).toBe("https://science.example/source");
    expect(response.body.groundingStatus.mode).toBe("web_enriched");
  });

  it("falls back safely when serverless web enrichment throws", async () => {
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED = "true";
    process.env.NODE_ENV = "development";
    mockResponsesCreate.mockRejectedValue(new Error("provider secret detail"));
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        body: { description: "Projectile motion lab using launch angle and range data.", allowExternalGrounding: true }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.groundingStatus).toEqual({
      mode: "fallback",
      note: "Using built-in science references because web enrichment was unavailable."
    });
    expect(JSON.stringify(response.body)).not.toContain("provider secret detail");
  });

  it("bounds descriptions and table rows through the serverless analyze function", async () => {
    const longDescriptionResponse = createMockResponse();
    const malformedRowsResponse = createMockResponse();

    await analyzeHandler(
      { method: "POST", body: { description: "x".repeat(2_001) } },
      longDescriptionResponse.res
    );
    await analyzeHandler(
      { method: "POST", body: { description: "Projectile motion lab", rows: ["not-a-row"] } },
      malformedRowsResponse.res
    );

    expect(longDescriptionResponse.statusCode).toBe(400);
    expect(longDescriptionResponse.body.error).toContain("2,000 characters or fewer");
    expect(malformedRowsResponse.statusCode).toBe(400);
    expect(malformedRowsResponse.body.error).toContain("valid table rows");
  });

  it("does not allow untrusted origins on state-changing serverless routes", async () => {
    const response = createMockResponse();

    await analyzeHandler(
      {
        method: "POST",
        headers: { origin: "https://attacker.example" },
        body: { description: "Projectile motion lab using launch angle and range data." }
      },
      response.res
    );

    expect(response.headers["Access-Control-Allow-Origin"]).toBeUndefined();
  });

  it("allows the authorization header for scoped MCP session preflights from trusted origins", async () => {
    const response = createMockResponse();

    await mcpSessionHandler(
      {
        method: "OPTIONS",
        headers: { origin: "https://ouija-olive.vercel.app" }
      },
      response.res
    );

    expect(response.statusCode).toBe(204);
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://ouija-olive.vercel.app");
    expect(response.headers["Access-Control-Allow-Headers"]).toContain("Authorization");
  });

  it("runs the evaluation bench through the serverless evaluate function", () => {
    const response = createMockResponse();

    evaluateHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body.score).toBe(100);
    expect(response.body.passed).toBe(9);
    expect(response.body.total).toBe(9);
    expect(response.body.suiteLabel).toContain("regression suite");
    expect(response.body.verdict).toContain("deterministic regression checks");
    expect(response.body.verdict).not.toContain("source-backed reasoning");
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-pendulum")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-ohms-law")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-plant-light")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-density")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-unsupported-boundary")).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom lab triage"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom planner rows"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("data handling ledger"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("learning exit ticket"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("pilot metrics"))).toBe(true);
  });

  it("returns AI runtime proof from the serverless runtime function", () => {
    delete process.env.OPENAI_API_KEY;
    clearComposioEnv();
    const response = createMockResponse();

    runtimeProofHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("fallback_ready");
    expect(response.body.webSearchConfigured).toBe(false);
    expect(response.body.evaluationPassed).toBe(9);
    expect(response.body.evaluationCaseCount).toBe(9);
    expect(response.body.mcpBridgeMode).toBe("server_dry_run");
    expect(response.body.signals.some((signal: { id: string; value: string }) => signal.id === "privacy" && signal.value === "Server-only key boundary")).toBe(true);
    expect(JSON.stringify(response.body)).not.toContain("sk-");
  });

  it("returns Composio MCP dry-run status from the serverless status function", () => {
    clearComposioEnv();
    const response = createMockResponse();

    mcpStatusHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("server_dry_run");
    expect(response.body.toolkits).toHaveLength(15);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-search-source-audit")?.toolkitSlug).toBe("composio_search");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-scholar-claim-check")?.toolkitSlug).toBe("composio_search");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-scholar-claim-check")?.recommendedTools).toEqual([
      "COMPOSIO_SEARCH_SCHOLAR"
    ]);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-browser-source-capture")?.toolkitSlug).toBe("browser_tool");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "composio-browser-source-capture")?.recommendedTools).toEqual([
      "BROWSER_TOOL_CREATE_TASK",
      "BROWSER_TOOL_WATCH_TASK"
    ]);
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "semanticscholar-reference-check")?.toolkitSlug).toBe(
      "semanticscholar"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "semanticscholar-reference-check")?.recommendedTools).toContain(
      "SEMANTICSCHOLAR_SEARCH_PAPERS"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "canvas-assignment-context")?.toolkitSlug).toBe("canvas");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "canvas-assignment-context")?.recommendedTools).toContain(
      "CANVAS_GET_ASSIGNMENT2"
    );
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "deepwiki-source-proof")?.toolkitSlug).toBe("deepwiki_mcp");
    expect(response.body.toolkits.find((toolkit: { actionId: string }) => toolkit.actionId === "deepwiki-source-proof")?.recommendedTools).toContain(
      "DEEPWIKI_MCP_READ_WIKI_CONTENTS"
    );
    expect(response.body.toolkits.find((toolkit: { toolkit: string }) => toolkit.toolkit === "Google Calendar")?.toolkitSlug).toBe("googlecalendar");
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
  });

  it("validates a Composio MCP packet through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Temperature changes reaction rate for an effervescent tablet."
    });
    const response = createMockResponse();

    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "google-forms-readiness-check",
          consent: true,
          payload: mcpPayload("google-forms-readiness-check", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Google Forms");
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_GOOGLE_FORMS_AUTH_CONFIG_ID");
    expect(response.body.checks.find((check: { id: string }) => check.id === "payload")?.status).toBe("pass");
  });

  it("enforces category-specific MCP route contracts through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });

    for (const testCase of mcpRouteContractCases) {
      const validResponse = createMockResponse();
      mcpExportHandler(
        {
          method: "POST",
          body: {
            actionId: testCase.actionId,
            consent: true,
            payload: mcpPayload(testCase.actionId, result)
          }
        },
        validResponse.res
      );
      expect(validResponse.statusCode, `${testCase.actionId} valid: ${JSON.stringify(validResponse.body)}`).toBe(200);
      expect(validResponse.body.sanitizedPayload.payloadCategory).toBe(testCase.category);

      const forbiddenResponse = createMockResponse();
      mcpExportHandler(
        {
          method: "POST",
          body: {
            actionId: testCase.actionId,
            consent: true,
            payload: {
              ...mcpPayload(testCase.actionId, result),
              pilotNotes: forbiddenMcpFields.pilotNotes,
              finalClaim: forbiddenMcpFields.finalClaim
            }
          }
        },
        forbiddenResponse.res
      );

      expect(forbiddenResponse.statusCode, `${testCase.actionId} forbidden: ${JSON.stringify(forbiddenResponse.body)}`).toBe(400);
      expect(forbiddenResponse.body.ok).toBe(false);
      expect(forbiddenResponse.body.error).toBe("MCP payload fields are not allowed for this action.");
      expect(JSON.stringify(forbiddenResponse.body)).not.toContain("observer noted");
      expect(JSON.stringify(forbiddenResponse.body)).not.toContain("final claim");
    }
  });

  it("prepares a Composio MCP session dry-run through the serverless function", async () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Temperature changes reaction rate for an effervescent tablet."
    });
    const response = createMockResponse();

    await mcpSessionHandler(
      {
        method: "POST",
        body: {
          actionId: "google-forms-readiness-check",
          consent: true,
          execution: "preview",
          payload: mcpPayload("google-forms-readiness-check", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.sessionPlan.enabledToolkit).toBe("googleforms");
    expect(response.body.sessionPlan.mcpUrlIssued).toBe(false);
    expect(response.body.target.sessionUserEnv).toBe("COMPOSIO_SESSION_USER_ID");
  });

  it("rate-limits serverless MCP session attempts before ticket creation", async () => {
    let lastResponse = createMockResponse();

    for (let index = 0; index < 11; index += 1) {
      lastResponse = createMockResponse();
      await mcpSessionHandler(
        {
          method: "POST",
          headers: { "x-forwarded-for": "203.0.113.9" },
          body: {}
        },
        lastResponse.res
      );
    }

    expect(lastResponse.statusCode).toBe(429);
    expect(lastResponse.headers["Retry-After"]).toBeDefined();
    expect(lastResponse.body).toEqual({ ok: false, error: "Too many MCP session requests. Try again shortly." });
  });

  it("validates a Scholar claim-check route through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const response = createMockResponse();

    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "composio-scholar-claim-check",
          consent: true,
          payload: mcpPayload("composio-scholar-claim-check", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Composio Search");
    expect(response.body.target.recommendedTools).toEqual(["COMPOSIO_SEARCH_SCHOLAR"]);
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_SEARCH_AUTH_CONFIG_ID");
  });

  it("validates a Browser source-capture route through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const response = createMockResponse();

    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "composio-browser-source-capture",
          consent: true,
          payload: mcpPayload("composio-browser-source-capture", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Composio Browser");
    expect(response.body.target.recommendedTools).toEqual(["BROWSER_TOOL_CREATE_TASK", "BROWSER_TOOL_WATCH_TASK"]);
    expect(response.body.target.authConfigEnv).toBe("COMPOSIO_BROWSER_AUTH_CONFIG_ID");
  });

  it("validates Semantic Scholar and Canvas MCP routes through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });

    const semanticResponse = createMockResponse();
    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "semanticscholar-reference-check",
          consent: true,
          payload: mcpPayload("semanticscholar-reference-check", result)
        }
      },
      semanticResponse.res
    );

    expect(semanticResponse.statusCode).toBe(200);
    expect(semanticResponse.body.toolkit).toBe("Semantic Scholar");
    expect(semanticResponse.body.target.recommendedTools).toContain("SEMANTICSCHOLAR_SEARCH_PAPERS");

    const canvasResponse = createMockResponse();
    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "canvas-assignment-context",
          consent: true,
          payload: mcpPayload("canvas-assignment-context", result)
        }
      },
      canvasResponse.res
    );

    expect(canvasResponse.statusCode).toBe(200);
    expect(canvasResponse.body.toolkit).toBe("Canvas");
    expect(canvasResponse.body.target.recommendedTools).toContain("CANVAS_GET_ASSIGNMENT_RUBRIC");
  });

  it("validates a Gmail teacher-review draft route through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const response = createMockResponse();

    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "gmail-teacher-review-draft",
          consent: true,
          payload: mcpPayload("gmail-teacher-review-draft", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Gmail");
    expect(response.body.target.recommendedTools).toEqual(["GMAIL_CREATE_EMAIL_DRAFT"]);
  });

  it("validates a Google Slides deck draft route through the serverless export function", () => {
    clearComposioEnv();
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const response = createMockResponse();

    mcpExportHandler(
      {
        method: "POST",
        body: {
          actionId: "google-slides-submission-deck",
          consent: true,
          payload: mcpPayload("google-slides-submission-deck", result)
        }
      },
      response.res
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("dry_run");
    expect(response.body.toolkit).toBe("Google Slides");
    expect(response.body.target.recommendedTools).toContain("GOOGLESLIDES_CREATE_SLIDES_MARKDOWN");
  });
});

function createMockResponse() {
  const state: { statusCode: number; body: any; ended: boolean; headers: Record<string, string> } = {
    statusCode: 200,
    body: undefined,
    ended: false,
    headers: {}
  };

  return {
    get statusCode() {
      return state.statusCode;
    },
    get body() {
      return state.body;
    },
    get headers() {
      return state.headers;
    },
    get ended() {
      return state.ended;
    },
    res: {
      setHeader(name: string, value: string) {
        state.headers[name] = value;
      },
      status(code: number) {
        state.statusCode = code;
        return this;
      },
      json(body: unknown) {
        state.body = body;
      },
      end() {
        state.ended = true;
      }
    }
  };
}

function clearComposioEnv() {
  for (const key of composioEnvKeys) {
    delete process.env[key];
  }
}

function mcpPayload(actionId: McpIntegrationActionId, result: ReturnType<typeof analyzeExperiment>): McpBridgePayload {
  const title = `Ouija Evidence Packet: ${result.classification.title}`;
  const sourceUrls = result.sources.map((source) => source.url);
  const variables = result.variables;
  const prompts = result.learningExitTicket.prompts.map((prompt) => prompt.studentPrompt);
  const setupChecks = result.preLabDesignCoach.setupChecks.map((check) => check.label);
  const evidencePacket = buildEvidencePacket(result, result.rows, result.classification.title);

  if (
    actionId === "composio-search-source-audit"
    || actionId === "composio-scholar-claim-check"
    || actionId === "semanticscholar-reference-check"
    || actionId === "composio-browser-source-capture"
    || actionId === "deepwiki-source-proof"
  ) {
    return {
      category: "source",
      title,
      query: `${result.classification.title} ${variables.join(" ")} source quality`,
      variables,
      sourceUrls
    };
  }

  if (actionId === "canvas-assignment-context") {
    return {
      category: "assignment_context",
      title,
      query: "Import selected lab prompt, due date, file metadata, and rubric criteria only.",
      variables,
      sourceUrls
    };
  }

  if (actionId === "google-forms-readiness-check") {
    return {
      category: "readiness_form",
      title,
      prompts,
      setupChecks
    };
  }

  if (actionId === "google-docs-evidence-packet") {
    return {
      category: "document_export",
      title,
      markdown: evidencePacket,
      sourceUrls
    };
  }

  if (actionId === "google-sheets-data-log") {
    return {
      category: "table_export",
      title,
      columns: result.columns.map((column) => column.key),
      rows: result.rows
    };
  }

  if (actionId === "google-drive-portfolio-archive") {
    return {
      category: "portfolio_archive",
      title,
      summary: `${result.classification.title} saved run archive`,
      artifactUrls: sourceUrls
    };
  }

  if (actionId === "google-classroom-prelab-checkpoint") {
    return {
      category: "classroom_checkpoint",
      title,
      setupChecks,
      variablePlan: result.preLabDesignCoach.variablePlan,
      sourceUrls
    };
  }

  if (actionId === "gmail-teacher-review-draft") {
    return {
      category: "teacher_review_draft",
      title,
      subject: `Review request: ${result.classification.title}`,
      body: "Please review my variables, controls, source trust, safety checks, and evidence plan before I write my final claim.",
      sourceUrls
    };
  }

  if (actionId === "google-slides-submission-deck") {
    return {
      category: "deck_export",
      title,
      outline: ["Problem and student user", "AI workflow", "Evidence boundaries", "Student-owned next claim draft"],
      sourceUrls
    };
  }

  if (actionId === "notion-learning-record") {
    return {
      category: "learning_record",
      title,
      status: result.trackEvidence.readiness,
      nextAction: result.nextTrialPlan.nextMeasurement,
      reflectionPrompts: prompts
    };
  }

  return {
    category: "calendar_reminder",
    title,
    reminderTitle: `Next trial: ${result.classification.title}`,
    nextAction: result.nextTrialPlan.nextMeasurement,
    dueWindow: "Next lab block"
  };
}

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}
