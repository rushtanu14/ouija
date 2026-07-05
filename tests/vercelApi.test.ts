import { describe, expect, it, afterEach } from "vitest";
import analyzeHandler from "../api/analyze";
import evaluateHandler from "../api/evaluate";
import healthHandler from "../api/health";
import mcpExportHandler from "../api/mcp/export";
import mcpStatusHandler from "../api/mcp/status";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildEvidencePacket } from "../src/lib/evidencePacket";
import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan";

const originalKey = process.env.OPENAI_API_KEY;
const composioEnvKeys = [
  "COMPOSIO_API_KEY",
  "COMPOSIO_LIVE_EXPORTS",
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

describe("Vercel API functions", () => {
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
    expect(response.body.impactSnapshot.score).toBeGreaterThanOrEqual(90);
    expect(response.body.impactSnapshot.metrics).toHaveLength(7);
    expect(response.body.learningExitTicket.status).toBe("ready");
    expect(response.body.learningExitTicket.prompts).toHaveLength(3);
    expect(response.body.expectedComparison.points.length).toBeGreaterThan(0);
    expect(response.body.dataHandlingLedger.status).toBe("privacy_preserving");
    expect(response.body.dataHandlingLedger.flows.some((flow: { id: string }) => flow.id === "server-api-key")).toBe(true);
    expect(response.body.customLabTriage.status).toBe("supported_template");
    expect(response.body.customLabTriage.suggestedColumns.length).toBeGreaterThan(1);
    expect(response.body.customLabTriage.planner.starterRows.length).toBeGreaterThan(0);
    expect(response.body.patternEvidence.status).toBe("supports_expected");
    expect(response.body.reliabilityCoach.recommendation).toContain("repeat");
    expect(response.body.conceptCoach.explanationSteps[0]).toContain("Watch");
    expect(response.body.safetyCoach.summary).toContain("launch path");
    expect(response.body.nextTrialPlan.studentQuestion).toContain("next");
    expect(response.body.groundingStatus.mode).toBe("fallback");
  });

  it("validates empty experiment descriptions through the serverless analyze function", async () => {
    const response = createMockResponse();

    await analyzeHandler({ method: "POST", body: { description: "   " } }, response.res);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain("Describe the experiment");
  });

  it("runs the evaluation bench through the serverless evaluate function", () => {
    const response = createMockResponse();

    evaluateHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body.score).toBe(100);
    expect(response.body.passed).toBe(9);
    expect(response.body.total).toBe(9);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-pendulum")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-ohms-law")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-plant-light")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-density")).toBe(true);
    expect(response.body.cases.some((testCase: { id: string }) => testCase.id === "eval-unsupported-boundary")).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom lab triage"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("custom planner rows"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("data handling ledger"))).toBe(true);
    expect(response.body.cases[0].evidence.some((item: string) => item.includes("learning exit ticket"))).toBe(true);
  });

  it("returns Composio MCP dry-run status from the serverless status function", () => {
    clearComposioEnv();
    const response = createMockResponse();

    mcpStatusHandler({ method: "GET" }, response.res);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("server_dry_run");
    expect(response.body.toolkits).toHaveLength(7);
    expect(response.body.toolkits.find((toolkit: { toolkit: string }) => toolkit.toolkit === "Google Calendar")?.toolkitSlug).toBe("googlecalendar");
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
          payload: {
            title: `Ouija Evidence Packet: ${result.classification.title}`,
            description: "Temperature changes reaction rate for an effervescent tablet.",
            evidencePacket: buildEvidencePacket(result, result.rows, "Temperature changes reaction rate for an effervescent tablet."),
            rows: result.rows,
            sources: result.sources
          }
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
