import type { AnalyzeResult, McpIntegrationPlan, ProgressPortfolio, StudentDataRow } from "./types";

interface BuildMcpIntegrationPlanInput {
  result: AnalyzeResult;
  rows: StudentDataRow[];
  description: string;
  evidencePacket: string;
  portfolio: ProgressPortfolio;
  configured?: boolean;
}

export function buildMcpIntegrationPlan({
  result,
  rows,
  description,
  evidencePacket,
  portfolio,
  configured = false
}: BuildMcpIntegrationPlanInput): McpIntegrationPlan {
  const mode = configured ? "server_mcp" : "preview";
  const status = configured ? "ready" : "preview_only";
  const rowCount = rows.length;
  const sourceCount = result.sources.length;
  const savedRunCount = extractSavedRunCount(portfolio);
  const title = `Ouija Evidence Packet: ${result.classification.title}`;

  return {
    status,
    summary: configured
      ? "Composio MCP exports are ready to route through the server after student confirmation."
      : "Preview only: Ouija shows the Composio MCP workflow and payload before any account connection exists.",
    setupHint: configured
      ? "Server-side MCP bridge is enabled. Keep COMPOSIO_API_KEY and any MCP URL on the server, never in browser code."
      : "Add COMPOSIO_API_KEY and a server-side MCP bridge before enabling live exports.",
    privacyBoundary:
      "Student chooses what to export; preview mode never sends lab descriptions, table rows, sources, or saved portfolio data to third-party apps.",
    actions: [
      {
        id: "google-docs-evidence-packet",
        toolkit: "Google Docs",
        label: "Create evidence packet doc",
        studentValue: "Turns the Evidence Packet into a teacher-shareable draft while preserving the blank claim starter.",
        composioCapability: "create Google Docs document from markdown",
        payloadSummary: `${title} with source trail, checks, and integrity boundary`,
        mode,
        requiresConsent: true,
        safetyNote: "Doc export should keep the conclusion blanks and must not generate a final lab report."
      },
      {
        id: "google-sheets-data-log",
        toolkit: "Google Sheets",
        label: "Append checked table rows",
        studentValue: "Moves the current lab table into a spreadsheet so the student can keep calculating and graphing.",
        composioCapability: "append spreadsheet rows and update worksheets",
        payloadSummary: `${rowCount} rows across ${result.columns.length} columns: ${formatColumnList(result)}`,
        mode,
        requiresConsent: true,
        safetyNote: "Only export the active rows the student can already see and edit."
      },
      {
        id: "google-drive-portfolio-archive",
        toolkit: "Google Drive",
        label: "Save portfolio archive",
        studentValue: "Creates a folder-ready archive for deck, walkthrough, evidence packet, and saved progress proof.",
        composioCapability: "upload files, create folders, and manage Drive permissions",
        payloadSummary: `${savedRunCount} saved run${savedRunCount === 1 ? "" : "s"}, ${sourceCount} citation${sourceCount === 1 ? "" : "s"}, hosted submission links`,
        mode,
        requiresConsent: true,
        safetyNote: "Default sharing should stay private until the student or teacher chooses otherwise."
      },
      {
        id: "notion-learning-record",
        toolkit: "Notion",
        label: "Create learning record",
        studentValue: "Logs the lab status, next trial, and exit-ticket prompts in a study workspace.",
        composioCapability: "create Notion page or database item",
        payloadSummary: `${result.trackEvidence.score}/100 readiness, ${result.learningExitTicket.prompts.length} exit-ticket prompts, next action`,
        mode,
        requiresConsent: true,
        safetyNote: "Reflection prompts should ask the student to explain; they should not become completed answers."
      }
    ],
    payloadPreview: {
      title,
      rowCount,
      sourceCount,
      savedRunCount,
      tableColumns: result.columns.map((column) => column.label),
      includedSections: [
        "Evidence Packet markdown",
        "Student data table",
        "Trusted citation links",
        "Progress Portfolio summary",
        "Learning Exit Ticket prompts",
        "Integrity boundary"
      ],
      markdownExcerpt: buildMarkdownExcerpt(description, evidencePacket)
    },
    safeguards: [
      "Preview mode does not call Composio, Google, or Notion APIs.",
      "COMPOSIO_API_KEY must stay server-side and must never be bundled into the Vite client.",
      "Every export action requires student or teacher consent before a live connector runs.",
      "Exported packets preserve the academic-integrity blanks instead of writing conclusions."
    ],
    judgeTakeaway:
      "MCP Integration Coach connects Ouija to a real classroom handoff path while keeping the demo honest, privacy-preserving, and credentials-safe."
  };
}

function formatColumnList(result: AnalyzeResult) {
  return result.columns.map((column) => (column.unit ? `${column.label} (${column.unit})` : column.label)).join(", ");
}

function extractSavedRunCount(portfolio: ProgressPortfolio) {
  const metric = portfolio.metrics.find((candidate) => candidate.id === "saved-runs");
  const match = metric?.value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function buildMarkdownExcerpt(description: string, evidencePacket: string) {
  const lines = evidencePacket
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, 10);

  if (lines.some((line) => line.includes("## Student Description"))) {
    return lines.join("\n");
  }

  return [`## Student Description`, description.trim(), ...lines].join("\n");
}
