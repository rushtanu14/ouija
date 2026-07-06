import { describe, expect, it } from "vitest";
import { buildRuntimeProof } from "../src/lib/runtimeProof";

describe("runtime proof", () => {
  it("reports fallback readiness honestly when OpenAI web search is not configured", () => {
    const proof = buildRuntimeProof({
      generatedAt: "2026-07-06T00:00:00.000Z",
      openAiConfigured: false,
      mcpBridgeMode: "server_dry_run"
    });

    expect(proof.status).toBe("fallback_ready");
    expect(proof.webSearchConfigured).toBe(false);
    expect(proof.templateCount).toBe(8);
    expect(proof.evaluationPassed).toBe(proof.evaluationCaseCount);
    expect(proof.signals.find((signal) => signal.id === "grounding")?.value).toBe("Trusted fallback active");
    expect(proof.signals.find((signal) => signal.id === "mcp")?.value).toBe("Server dry-run mode");
    expect(proof.judgeTakeaway).toContain("without credentials");
  });

  it("reports web-enriched readiness only when server configuration says it is available", () => {
    const proof = buildRuntimeProof({
      generatedAt: "2026-07-06T00:00:00.000Z",
      openAiConfigured: true,
      mcpBridgeMode: "server_mcp",
      model: "gpt-5.5"
    });

    expect(proof.status).toBe("web_enriched_ready");
    expect(proof.webSearchConfigured).toBe(true);
    expect(proof.model).toBe("gpt-5.5");
    expect(proof.signals.find((signal) => signal.id === "grounding")?.value).toBe("OpenAI web search configured");
    expect(proof.signals.find((signal) => signal.id === "mcp")?.value).toBe("Live export mode ready");
  });
});
