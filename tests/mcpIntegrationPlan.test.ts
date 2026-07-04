import { describe, expect, it } from "vitest";
import { analyzeExperiment } from "../src/lib/analysis";
import { buildEvidencePacket } from "../src/lib/evidencePacket";
import { buildMcpIntegrationPlan } from "../src/lib/mcpIntegrationPlan";
import { buildProgressPortfolio } from "../src/lib/progressPortfolio";

describe("MCP integration plan", () => {
  it("builds a preview-only Composio export plan without credentials", () => {
    const result = analyzeExperiment({
      description: "Temperature changes reaction rate for an effervescent tablet."
    });
    const packet = buildEvidencePacket(result, result.rows, "Temperature changes reaction rate for an effervescent tablet.");
    const portfolio = buildProgressPortfolio([
      {
        id: "saved-run-1",
        title: result.classification.title,
        subject: result.classification.subject,
        savedAt: "2026-07-03T12:00:00.000Z",
        score: result.trackEvidence.score,
        readiness: result.trackEvidence.readiness,
        issueCount: 0
      }
    ]);

    const plan = buildMcpIntegrationPlan({
      result,
      rows: result.rows,
      description: "Temperature changes reaction rate for an effervescent tablet.",
      evidencePacket: packet,
      portfolio,
      configured: false
    });

    expect(plan.status).toBe("preview_only");
    expect(plan.summary).toContain("Preview only");
    expect(plan.setupHint).toContain("COMPOSIO_API_KEY");
    expect(plan.setupHint).toContain("server-side");
    expect(plan.actions.map((action) => action.id)).toEqual([
      "google-docs-evidence-packet",
      "google-sheets-data-log",
      "google-drive-portfolio-archive",
      "notion-learning-record"
    ]);
    expect(plan.actions.find((action) => action.id === "google-docs-evidence-packet")?.toolkit).toBe("Google Docs");
    expect(plan.actions.find((action) => action.id === "google-sheets-data-log")?.payloadSummary).toContain("4 rows");
    expect(plan.actions.every((action) => action.requiresConsent)).toBe(true);
    expect(plan.payloadPreview.title).toBe("Ouija Evidence Packet: Reaction Rate vs Temperature");
    expect(plan.payloadPreview.rowCount).toBe(4);
    expect(plan.payloadPreview.sourceCount).toBeGreaterThanOrEqual(1);
    expect(plan.payloadPreview.savedRunCount).toBe(1);
    expect(plan.payloadPreview.includedSections).toContain("Evidence Packet markdown");
    expect(plan.payloadPreview.markdownExcerpt).toContain("## Student Description");
    expect(plan.safeguards).toContain("Preview mode does not call Composio, Google, or Notion APIs.");
    expect(plan.privacyBoundary).toContain("Student chooses");
    expect(plan.judgeTakeaway).toContain("real classroom handoff");
  });

  it("marks the same workflow ready only when a server-side MCP bridge is configured", () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const plan = buildMcpIntegrationPlan({
      result,
      rows: result.rows,
      description: "Projectile launch angle and measured range.",
      evidencePacket: buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range."),
      portfolio: buildProgressPortfolio([]),
      configured: true
    });

    expect(plan.status).toBe("ready");
    expect(plan.summary).toContain("ready to route");
    expect(plan.actions.every((action) => action.mode === "server_mcp")).toBe(true);
    expect(plan.actions.find((action) => action.toolkit === "Google Sheets")?.composioCapability).toContain("append");
    expect(plan.payloadPreview.savedRunCount).toBe(0);
  });
});
