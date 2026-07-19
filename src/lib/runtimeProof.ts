import { runEvaluationSuite } from "./evaluation.js";
import { EXPERIMENT_TEMPLATES } from "./templates.js";
import type { RuntimeProof } from "./types.js";

interface RuntimeProofOptions {
  generatedAt?: string;
  model?: string;
  openAiConfigured?: boolean;
  mcpBridgeMode?: RuntimeProof["mcpBridgeMode"];
}

export function buildRuntimeProof(options: RuntimeProofOptions = {}): RuntimeProof {
  const evaluation = runEvaluationSuite();
  const webSearchConfigured = options.openAiConfigured ?? (
    Boolean(process.env.OPENAI_API_KEY) &&
    process.env.OUIJA_EXTERNAL_GROUNDING_ENABLED === "true" &&
    process.env.NODE_ENV !== "production"
  );
  const model = options.model ?? process.env.OPENAI_MODEL ?? "gpt-5.6";
  const mcpBridgeMode = options.mcpBridgeMode ?? "server_dry_run";
  const status = webSearchConfigured ? "web_enriched_ready" : "fallback_ready";

  return {
    status,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    model,
    webSearchConfigured,
    templateCount: EXPERIMENT_TEMPLATES.length,
    evaluationCaseCount: evaluation.total,
    evaluationPassed: evaluation.passed,
    serverOnlyKeyBoundary: true,
    mcpBridgeMode,
    signals: [
      {
        id: "classifier",
        label: "Classifier",
        status: "active",
        value: `${EXPERIMENT_TEMPLATES.length} templates ranked`,
        detail: "Every run scores all supported middle/high school experiment templates before choosing a match."
      },
      {
        id: "grounding",
        label: "Grounding",
        status: webSearchConfigured ? "configured" : "ready",
        value: webSearchConfigured ? "OpenAI web search configured" : "Trusted fallback active",
        detail: webSearchConfigured
          ? "Server-side Responses API web_search can enrich explanations and citations only after per-request opt-in."
          : "Built-in trusted science references keep the public demo honest unless explicit opt-in, server enablement, and non-production mode are all present."
      },
      {
        id: "evaluation",
        label: "Regression suite",
        status: evaluation.status === "pass" ? "active" : "review",
        value: `${evaluation.passed}/${evaluation.total} cases passed`,
        detail: "The internal deterministic suite covers eight supported examples and the unsupported-lab boundary; it does not measure independent scientific accuracy or student outcomes."
      },
      {
        id: "privacy",
        label: "Privacy boundary",
        status: "active",
        value: "Server-only key boundary",
        detail: "Browser responses expose readiness booleans only, never OPENAI_API_KEY or Composio credentials."
      },
      {
        id: "integrity",
        label: "Integrity guard",
        status: "active",
        value: "No full lab reports",
        detail: "Ouija gives checks, blanks, and Socratic prompts instead of finished conclusions."
      },
      {
        id: "mcp",
        label: "MCP bridge",
        status: mcpBridgeMode === "server_mcp" ? "configured" : "ready",
        value: mcpBridgeMode === "server_mcp" ? "Live export mode ready" : "Server dry-run mode",
        detail: "Composio routes are validated as consent-gated packets before any external write can happen."
      }
    ],
    judgeTakeaway: webSearchConfigured
      ? "Ouija can run a request-opted web-enriched AI path with visible citations, a deterministic regression suite, and server-only secret handling."
      : "Ouija is still judge-demoable without credentials: deterministic classification, trusted fallback grounding, a regression suite, and explicit server-only boundaries are visible."
  };
}
