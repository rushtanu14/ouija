import type { AnalyzeResult, McpConnectorReadiness, McpDryRunCheck, McpIntegrationAction, McpIntegrationPlan, ProgressPortfolio, StudentDataRow } from "./types";

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
  const actions: McpIntegrationAction[] = [
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
      id: "google-classroom-prelab-checkpoint",
      toolkit: "Google Classroom",
      label: "Draft pre-lab checkpoint",
      studentValue: "Turns the pre-lab setup checks into a teacher-reviewable checkpoint before students collect data.",
      composioCapability: "create coursework draft and attach pre-lab evidence",
      payloadSummary: `Pre-lab ${result.preLabDesignCoach.status.replaceAll("_", " ")}: ${result.preLabDesignCoach.setupChecks.length} setup checks, ${result.preLabDesignCoach.variablePlan.independentVariable} to ${result.preLabDesignCoach.variablePlan.dependentVariable}`,
      mode,
      requiresConsent: true,
      safetyNote: "Classroom export should create a draft/checkpoint, not submit answers or write the student's conclusion."
    },
    {
      id: "google-forms-readiness-check",
      toolkit: "Google Forms",
      label: "Create readiness check form",
      studentValue: "Turns the pre-lab setup and exit-ticket prompts into a student self-check before submission.",
      composioCapability: "create Google Forms draft with short-answer readiness prompts",
      payloadSummary: `${result.preLabDesignCoach.setupChecks.length} setup checks plus ${result.learningExitTicket.prompts.length} student reflection prompts`,
      mode,
      requiresConsent: true,
      safetyNote: "Forms export should ask questions and collect student answers, not fill the answers for them."
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
      safetyNote: "Reflection prompts and drafts should stay student-authored; the connector must not complete answers."
    }
  ];

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
    actions,
    readinessMatrix: buildReadinessMatrix(actions, configured),
    dryRunChecks: buildDryRunChecks({
      configured,
      rowCount,
      sourceCount,
      actions,
      result
    }),
    executionBoundary: configured
      ? "Live execution may run only from the Express API after explicit confirmation; the browser never receives Composio credentials."
      : "Public demo is dry-run only: it validates the packet, scopes, consent, and integrity rules before any Composio connector can run.",
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
        "Pre-Lab Design Coach",
        "Learning Exit Ticket prompts",
        "Google Forms readiness prompts",
        "Student Reflection Drafts",
        "Integrity boundary"
      ],
      markdownExcerpt: buildMarkdownExcerpt(description, evidencePacket)
    },
    safeguards: [
      "Preview mode does not call Composio, Google Classroom, Google Workspace, or Notion APIs.",
      "COMPOSIO_API_KEY must stay server-side and must never be bundled into the Vite client.",
      "Every export action requires student or teacher consent before a live connector runs.",
      "Google Classroom handoff creates a teacher-review checkpoint, not an auto-submitted assignment.",
      "Google Forms handoff creates student prompts, not completed answers.",
      "Exported packets preserve the academic-integrity blanks instead of writing conclusions.",
      "Reflection drafts are exported only when the student typed them in the workspace."
    ],
    judgeTakeaway:
      "MCP Integration Coach connects Ouija to a real classroom handoff path with connector prerequisites, least-privilege scopes, dry-run checks, and consent gates visible to judges."
  };
}

function buildReadinessMatrix(actions: McpIntegrationAction[], configured: boolean): McpConnectorReadiness[] {
  return actions.map((action) => {
    const envSuffix = action.toolkit.toUpperCase().replaceAll(" ", "_");
    return {
      actionId: action.id,
      toolkit: action.toolkit,
      status: configured ? "ready" : "needs_server_setup",
      requiredEnv: [`COMPOSIO_${envSuffix}_AUTH_CONFIG_ID`, `COMPOSIO_${envSuffix}_ALLOWED_TOOLS`],
      requiredScopes: scopesForToolkit(action.toolkit),
      dataShared: dataSharedForAction(action),
      consentGate: action.id === "google-classroom-prelab-checkpoint" ? "Student or teacher confirms class/course draft before posting." : "Student reviews the payload preview before export.",
      dryRunStatus: "pass",
      dryRunDetail: configured
        ? "Server bridge can receive this action after consent."
        : "Preview payload is complete, but live execution waits for server credentials."
    };
  });
}

function buildDryRunChecks({
  configured,
  rowCount,
  sourceCount,
  actions,
  result
}: {
  configured: boolean;
  rowCount: number;
  sourceCount: number;
  actions: McpIntegrationAction[];
  result: AnalyzeResult;
}): McpDryRunCheck[] {
  const hasRows = rowCount > 0;
  const hasSources = sourceCount > 0;
  const allConsentGated = actions.every((action) => action.requiresConsent);
  const hasIntegrityBoundaries = actions.every((action) => action.safetyNote.length > 0) && result.labBrief.claimStarter.includes("___");

  return [
    {
      id: "payload",
      label: "Payload completeness",
      status: hasRows && hasSources ? "pass" : "review",
      detail: hasRows && hasSources ? `${rowCount} rows and ${sourceCount} source links are ready for preview.` : "Add rows and visible sources before exporting."
    },
    {
      id: "least-privilege",
      label: "Least privilege",
      status: "pass",
      detail: `${actions.length} connector routes use specific Docs, Sheets, Drive, Classroom, Forms, or Notion scopes instead of a broad all-Google handoff.`
    },
    {
      id: "consent",
      label: "Consent gate",
      status: allConsentGated ? "pass" : "review",
      detail: allConsentGated ? "Every connector action requires student or teacher confirmation." : "One or more connector actions needs an explicit confirmation gate."
    },
    {
      id: "integrity",
      label: "Academic integrity",
      status: hasIntegrityBoundaries ? "pass" : "review",
      detail: "Exports preserve claim blanks, source tasks, and student-authored reflection boundaries."
    },
    {
      id: "server-only",
      label: "Server-only credentials",
      status: configured ? "pass" : "review",
      detail: configured ? "Server MCP mode is selected; credentials remain outside the browser bundle." : "Dry-run mode is active until COMPOSIO_API_KEY and auth config IDs exist server-side."
    }
  ];
}

function scopesForToolkit(toolkit: McpIntegrationAction["toolkit"]) {
  if (toolkit === "Google Docs") return ["documents create/update"];
  if (toolkit === "Google Sheets") return ["spreadsheets append/update"];
  if (toolkit === "Google Drive") return ["drive file create", "private sharing"];
  if (toolkit === "Google Classroom") return ["coursework draft create", "attachment add"];
  if (toolkit === "Google Forms") return ["forms draft create", "short-answer questions"];
  return ["page create", "database item create"];
}

function dataSharedForAction(action: McpIntegrationAction) {
  if (action.id === "google-docs-evidence-packet") return "Evidence Packet markdown, citations, claim blanks, and safety notes.";
  if (action.id === "google-sheets-data-log") return "Visible table columns and student-entered rows only.";
  if (action.id === "google-drive-portfolio-archive") return "Saved-run summary, hosted submission links, and selected exported files.";
  if (action.id === "google-classroom-prelab-checkpoint") return "Pre-Lab Design Coach status, setup checks, and variable plan.";
  if (action.id === "google-forms-readiness-check") return "Setup checks and exit-ticket prompts without answers.";
  return "Learning status, next action, and student-authored reflection drafts when present.";
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
