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
      "composio-search-source-audit",
      "composio-scholar-claim-check",
      "composio-browser-source-capture",
      "google-docs-evidence-packet",
      "google-sheets-data-log",
      "google-drive-portfolio-archive",
      "google-classroom-prelab-checkpoint",
      "google-forms-readiness-check",
      "google-calendar-next-trial-reminder",
      "notion-learning-record"
    ]);
    expect(plan.actions.find((action) => action.id === "composio-search-source-audit")?.toolkit).toBe("Composio Search");
    expect(plan.actions.find((action) => action.id === "composio-search-source-audit")?.payloadSummary).toContain("Source audit query");
    expect(plan.actions.find((action) => action.id === "composio-search-source-audit")?.payloadSummary).toContain("supported template pattern");
    expect(plan.actions.find((action) => action.id === "composio-scholar-claim-check")?.recommendedTools).toEqual(["COMPOSIO_SEARCH_SCHOLAR"]);
    expect(plan.actions.find((action) => action.id === "composio-scholar-claim-check")?.payloadSummary).toContain("Scholar query");
    expect(plan.actions.find((action) => action.id === "composio-browser-source-capture")?.toolkit).toBe("Composio Browser");
    expect(plan.actions.find((action) => action.id === "composio-browser-source-capture")?.recommendedTools).toEqual([
      "BROWSER_TOOL_CREATE_TASK",
      "BROWSER_TOOL_WATCH_TASK"
    ]);
    expect(plan.actions.find((action) => action.id === "composio-browser-source-capture")?.payloadSummary).toContain("Browser source-capture task");
    expect(plan.actions.find((action) => action.id === "google-docs-evidence-packet")?.toolkit).toBe("Google Docs");
    expect(plan.actions.find((action) => action.id === "google-sheets-data-log")?.payloadSummary).toContain("4 rows");
    expect(plan.actions.find((action) => action.id === "google-classroom-prelab-checkpoint")?.toolkit).toBe("Google Classroom");
    expect(plan.actions.find((action) => action.id === "google-classroom-prelab-checkpoint")?.payloadSummary).toContain("Pre-lab");
    expect(plan.actions.find((action) => action.id === "google-forms-readiness-check")?.toolkit).toBe("Google Forms");
    expect(plan.actions.find((action) => action.id === "google-forms-readiness-check")?.payloadSummary).toContain("student reflection prompts");
    expect(plan.actions.find((action) => action.id === "google-forms-readiness-check")?.payloadSummary).toContain("pilot-study metrics");
    expect(plan.actions.find((action) => action.id === "google-calendar-next-trial-reminder")?.toolkit).toBe("Google Calendar");
    expect(plan.actions.find((action) => action.id === "google-calendar-next-trial-reminder")?.payloadSummary).toContain("Next trial reminder");
    expect(plan.actions.every((action) => action.requiresConsent)).toBe(true);
    expect(plan.readinessMatrix).toHaveLength(10);
    expect(plan.readinessMatrix.every((connector) => connector.status === "needs_server_setup")).toBe(true);
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Composio Search")?.requiredEnv).toEqual(["COMPOSIO_SEARCH_ALLOWED_TOOLS"]);
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Composio Search")?.recommendedTools).toContain("COMPOSIO_SEARCH_SCHOLAR");
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Composio Browser")?.requiredEnv).toEqual(["COMPOSIO_BROWSER_ALLOWED_TOOLS"]);
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Composio Browser")?.recommendedTools).toContain("BROWSER_TOOL_CREATE_TASK");
    expect(plan.readinessMatrix.find((connector) => connector.actionId === "composio-scholar-claim-check")?.requiredEnv).toEqual([
      "COMPOSIO_SEARCH_ALLOWED_TOOLS"
    ]);
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Google Forms")?.requiredEnv).toContain("COMPOSIO_GOOGLE_FORMS_AUTH_CONFIG_ID");
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Google Calendar")?.recommendedTools).toContain("GOOGLECALENDAR_CREATE_EVENT");
    expect(plan.readinessMatrix.find((connector) => connector.toolkit === "Google Classroom")?.consentGate).toContain("class/course draft");
    expect(plan.dryRunChecks).toHaveLength(6);
    expect(plan.dryRunChecks.find((check) => check.id === "least-privilege")?.detail).toContain("Composio Search");
    expect(plan.dryRunChecks.find((check) => check.id === "server-bridge")?.status).toBe("review");
    expect(plan.dryRunChecks.find((check) => check.id === "server-only")?.status).toBe("review");
    expect(plan.executionBoundary).toContain("dry-run only");
    expect(plan.payloadPreview.title).toBe("Ouija Evidence Packet: Reaction Rate vs Temperature");
    expect(plan.payloadPreview.rowCount).toBe(4);
    expect(plan.payloadPreview.sourceCount).toBeGreaterThanOrEqual(1);
    expect(plan.payloadPreview.savedRunCount).toBe(1);
    expect(plan.payloadPreview.includedSections).toContain("Evidence Packet markdown");
    expect(plan.payloadPreview.includedSections).toContain("Pre-Lab Design Coach");
    expect(plan.payloadPreview.includedSections).toContain("Student Pilot Study Kit");
    expect(plan.payloadPreview.includedSections).toContain("Composio Scholar claim-check query");
    expect(plan.payloadPreview.includedSections).toContain("Composio Browser source-page capture task");
    expect(plan.payloadPreview.includedSections).toContain("Pattern Archetype Coach source question");
    expect(plan.payloadPreview.includedSections).toContain("Google Forms readiness prompts");
    expect(plan.payloadPreview.includedSections).toContain("Google Calendar next-trial reminder");
    expect(plan.payloadPreview.includedSections).toContain("Composio session ticket scope");
    expect(plan.payloadPreview.includedSections).toContain("Student Reflection Drafts");
    expect(plan.payloadPreview.includedSections).toContain("Portfolio Story Builder prompts");
    expect(plan.payloadPreview.markdownExcerpt).toContain("## Student Description");
    expect(plan.safeguards).toContain("Preview mode does not call Composio Search, Composio Browser, Google Classroom, Google Workspace, or Notion APIs.");
    expect(plan.safeguards).toContain("Scoped Composio sessions are prepared server-side and raw MCP URLs are withheld from browser responses.");
    expect(plan.safeguards).toContain("Composio Search source audits use topic and variable terms only; students review the query before live lookup.");
    expect(plan.safeguards).toContain("Composio Scholar claim checks compare the expected pattern against scholarly snippets without writing the student's final claim.");
    expect(plan.safeguards).toContain("Composio Browser captures public source-page context only after the student reviews the URL and task prompt.");
    expect(plan.safeguards).toContain("Google Calendar handoff schedules a next-trial reminder, not a generated result.");
    expect(plan.safeguards).toContain("Reflection drafts are exported only when the student typed them in the workspace.");
    expect(plan.privacyBoundary).toContain("Student chooses");
    expect(plan.judgeTakeaway).toContain("scoped session tickets");
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
    expect(plan.readinessMatrix.every((connector) => connector.status === "ready")).toBe(true);
    expect(plan.dryRunChecks.find((check) => check.id === "server-only")?.status).toBe("pass");
    expect(plan.executionBoundary).toContain("Express API");
    expect(plan.actions.find((action) => action.toolkit === "Google Sheets")?.composioCapability).toContain("append");
    expect(plan.actions.find((action) => action.toolkit === "Composio Search")?.composioCapability).toContain("scholar");
    expect(plan.actions.find((action) => action.id === "composio-scholar-claim-check")?.composioCapability).toContain("Composio Search Scholar");
    expect(plan.actions.find((action) => action.toolkit === "Composio Browser")?.composioCapability).toContain("browser task");
    expect(plan.actions.find((action) => action.toolkit === "Google Classroom")?.composioCapability).toContain("create coursework draft");
    expect(plan.actions.find((action) => action.toolkit === "Google Forms")?.composioCapability).toContain("Forms draft");
    expect(plan.actions.find((action) => action.toolkit === "Google Calendar")?.composioCapability).toContain("calendar event");
    expect(plan.payloadPreview.savedRunCount).toBe(0);
  });

  it("marks the public bridge as server dry-run when the API can validate packets without live credentials", () => {
    const result = analyzeExperiment({
      description: "Projectile launch angle and measured range."
    });
    const plan = buildMcpIntegrationPlan({
      result,
      rows: result.rows,
      description: "Projectile launch angle and measured range.",
      evidencePacket: buildEvidencePacket(result, result.rows, "Projectile launch angle and measured range."),
      portfolio: buildProgressPortfolio([]),
      serverBridgeAvailable: true
    });

    expect(plan.status).toBe("server_dry_run");
    expect(plan.summary).toContain("Server dry-run bridge");
    expect(plan.actions.every((action) => action.mode === "server_dry_run")).toBe(true);
    expect(plan.dryRunChecks.find((check) => check.id === "server-bridge")?.status).toBe("pass");
    expect(plan.executionBoundary).toContain("/api/mcp/export");
  });
});
