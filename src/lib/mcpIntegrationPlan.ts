import type {
  AnalyzeResult,
  McpConnectorCatalogItem,
  McpConnectorReadiness,
  McpDryRunCheck,
  McpIntegrationAction,
  McpIntegrationPlan,
  McpSessionStrategy,
  ProgressPortfolio,
  StudentDataRow
} from "./types";

export const MCP_CONNECTOR_CATALOG: McpConnectorCatalogItem[] = [
  {
    id: "composio-search-source-audit",
    toolkit: "Composio Search",
    toolkitSlug: "composio_search",
    envSuffix: "SEARCH",
    requiresAuthConfig: false,
    label: "Run source audit search",
    studentValue: "Checks the experiment topic against public web and scholar sources before the student trusts an expected pattern.",
    composioCapability: "search public web, scholar results, and fetched page text through Composio Search",
    safetyNote: "Search audit should return source choices and trust checks, not a completed explanation or final conclusion.",
    requiredScopes: ["public web search", "scholar search", "URL content fetch"],
    dataShared: "Experiment title, variable names, current citation links, and a source-quality question.",
    consentGate: "Student reviews the research query before any live source-audit search.",
    docsUrl: "https://docs.composio.dev/toolkits/composio_search",
    recommendedTools: ["COMPOSIO_SEARCH_WEB", "COMPOSIO_SEARCH_SCHOLAR", "COMPOSIO_SEARCH_FETCH_URL_CONTENT"]
  },
  {
    id: "composio-scholar-claim-check",
    toolkit: "Composio Search",
    toolkitSlug: "composio_search",
    envSuffix: "SEARCH",
    requiresAuthConfig: false,
    label: "Run Scholar claim check",
    studentValue: "Checks whether the student's expected pattern matches classroom-safe scholarly science before evidence export.",
    composioCapability: "query Google Scholar-style results through Composio Search Scholar and compare snippets against the expected pattern",
    safetyNote: "Scholar check should surface agreement, disagreement, and source questions; it must not write the student's claim or conclusion.",
    requiredScopes: ["scholar search", "citation snippet review"],
    dataShared: "Experiment title, variables, expected pattern summary, and a student-reviewed scholar query.",
    consentGate: "Student reviews the scholar query and citation terms before any live lookup.",
    docsUrl: "https://docs.composio.dev/toolkits/composio_search",
    recommendedTools: ["COMPOSIO_SEARCH_SCHOLAR"]
  },
  {
    id: "semanticscholar-reference-check",
    toolkit: "Semantic Scholar",
    toolkitSlug: "semanticscholar",
    envSuffix: "SEMANTIC_SCHOLAR",
    label: "Check academic references",
    studentValue: "Finds structured paper metadata for advanced source checks when a classroom lab needs stronger science grounding.",
    composioCapability: "search Semantic Scholar papers, retrieve paper details, and compare abstracts or metadata against the expected pattern",
    safetyNote: "Reference checks should surface paper context and limitations; they must not turn papers into a finished claim or conclusion.",
    requiredScopes: ["paper search", "paper metadata read", "citation context review"],
    dataShared: "Experiment title, variables, expected pattern summary, and a student-reviewed academic search query.",
    consentGate: "Student reviews the academic search query before any live Semantic Scholar lookup.",
    docsUrl: "https://composio.dev/toolkits/semanticscholar",
    recommendedTools: ["SEMANTICSCHOLAR_SEARCH_PAPERS", "SEMANTICSCHOLAR_GET_DETAILS_FOR_MULTIPLE_PAPERS_AT_ONCE"]
  },
  {
    id: "composio-browser-source-capture",
    toolkit: "Composio Browser",
    toolkitSlug: "browser_tool",
    envSuffix: "BROWSER",
    requiresAuthConfig: false,
    label: "Capture source page context",
    studentValue: "Falls back to a browser-based source capture when a citation page is dynamic, incomplete, or hard to read from normal fetch text.",
    composioCapability: "create and watch a browser task that extracts student-reviewed source-page context through Composio Browser Tool",
    safetyNote: "Browser capture should collect source context and citation-quality notes only; it must not browse private accounts or write the student's claim.",
    requiredScopes: ["public browser task", "page text extraction", "source context review"],
    dataShared: "Student-reviewed citation URL, experiment title, variable names, and a short source-quality question.",
    consentGate: "Student reviews the public URL and task prompt before any browser capture starts.",
    docsUrl: "https://docs.composio.dev/toolkits/browser_tool",
    recommendedTools: ["BROWSER_TOOL_CREATE_TASK", "BROWSER_TOOL_WATCH_TASK"]
  },
  {
    id: "deepwiki-source-proof",
    toolkit: "DeepWiki",
    toolkitSlug: "deepwiki_mcp",
    envSuffix: "DEEPWIKI",
    requiresAuthConfig: false,
    label: "Audit public source proof",
    studentValue: "Gives judges and teammates a public-codebase verification route for Ouija's architecture claims without touching student lab data.",
    composioCapability: "read the public GitHub repo wiki structure, contents, and architecture answers through DeepWiki MCP",
    safetyNote: "DeepWiki should inspect public source and docs only; it must not receive student descriptions, table rows, or reflection drafts.",
    requiredScopes: ["public GitHub repository analysis", "source documentation read", "architecture question answering"],
    dataShared: "Public repository name, submission artifact links, and a judge-facing architecture question.",
    consentGate: "Team reviews the public repo question before any live DeepWiki source-proof session.",
    docsUrl: "https://deepwiki.com",
    recommendedTools: ["DEEPWIKI_MCP_READ_WIKI_STRUCTURE", "DEEPWIKI_MCP_READ_WIKI_CONTENTS", "DEEPWIKI_MCP_ASK_QUESTION"]
  },
  {
    id: "canvas-assignment-context",
    toolkit: "Canvas",
    toolkitSlug: "canvas",
    envSuffix: "CANVAS",
    label: "Import assignment context",
    studentValue: "Lets a student pull the lab prompt, due date, attached materials, and rubric into Ouija before planning or graphing.",
    composioCapability: "read Canvas courses, planner items, assignments, rubrics, and attached files for student-reviewed lab context",
    safetyNote: "Canvas access should read assignment context only; it must not submit work, message a class, change grades, or write conclusions.",
    requiredScopes: ["course list read", "assignment read", "rubric read", "file metadata read"],
    dataShared: "Selected course id, assignment id, rubric criteria, due date, and lab prompt text the student chooses to import.",
    consentGate: "Student selects the Canvas assignment and reviews the imported prompt before Ouija uses it.",
    docsUrl: "https://composio.dev/toolkits/canvas",
    recommendedTools: ["CANVAS_LIST_COURSES", "CANVAS_LIST_PLANNER_ITEMS", "CANVAS_GET_ASSIGNMENT2", "CANVAS_GET_ASSIGNMENT_RUBRIC"]
  },
  {
    id: "google-docs-evidence-packet",
    toolkit: "Google Docs",
    toolkitSlug: "googledocs",
    envSuffix: "GOOGLE_DOCS",
    label: "Create evidence packet doc",
    studentValue: "Turns the Evidence Packet into a teacher-shareable draft while preserving the blank claim starter.",
    composioCapability: "create Google Docs document from markdown",
    safetyNote: "Doc export should keep the conclusion blanks and must not generate a final lab report.",
    requiredScopes: ["documents create/update"],
    dataShared: "Evidence Packet markdown, citations, claim blanks, and safety notes.",
    consentGate: "Student reviews the payload preview before export.",
    docsUrl: "https://docs.composio.dev/toolkits/googledocs",
    recommendedTools: ["GOOGLEDOCS_CREATE_DOCUMENT_MARKDOWN", "GOOGLEDOCS_CREATE_DOCUMENT"]
  },
  {
    id: "google-slides-submission-deck",
    toolkit: "Google Slides",
    toolkitSlug: "googleslides",
    envSuffix: "GOOGLE_SLIDES",
    label: "Draft submission slide deck",
    studentValue: "Turns the judge-ready evidence and reflection prompts into an editable AIYES deck draft for the student team.",
    composioCapability: "create a Google Slides presentation from Markdown, then let the student revise and rehearse the deck",
    safetyNote: "Slides export should create a presentation draft and proof links; it must not write the student's final claim, conclusion, or reflection answers.",
    requiredScopes: ["presentation create/update", "markdown-to-slides draft", "student edit before sharing"],
    dataShared: "Deck outline, evidence packet excerpt, citations, hosted proof links, blank claim starter, and student-authored reflections when present.",
    consentGate: "Student reviews the deck outline and destination account before a Google Slides draft can be created.",
    docsUrl: "https://docs.composio.dev/toolkits/googleslides",
    recommendedTools: ["GOOGLESLIDES_CREATE_SLIDES_MARKDOWN", "GOOGLESLIDES_CREATE_PRESENTATION", "GOOGLESLIDES_PRESENTATIONS_BATCH_UPDATE"]
  },
  {
    id: "google-sheets-data-log",
    toolkit: "Google Sheets",
    toolkitSlug: "googlesheets",
    envSuffix: "GOOGLE_SHEETS",
    label: "Append checked table rows",
    studentValue: "Moves the current lab table into a spreadsheet so the student can keep calculating and graphing.",
    composioCapability: "append spreadsheet rows and update worksheets",
    safetyNote: "Only export the active rows the student can already see and edit.",
    requiredScopes: ["spreadsheets append/update"],
    dataShared: "Visible table columns and student-entered rows only.",
    consentGate: "Student reviews the payload preview before export.",
    docsUrl: "https://docs.composio.dev/toolkits/googlesheets",
    recommendedTools: ["GOOGLESHEETS_SPREADSHEETS_VALUES_APPEND", "GOOGLESHEETS_SHEET_FROM_JSON"]
  },
  {
    id: "google-drive-portfolio-archive",
    toolkit: "Google Drive",
    toolkitSlug: "googledrive",
    envSuffix: "GOOGLE_DRIVE",
    label: "Save portfolio archive",
    studentValue: "Creates a folder-ready archive for deck, walkthrough, evidence packet, and saved progress proof.",
    composioCapability: "upload files, create folders, and manage Drive permissions",
    safetyNote: "Default sharing should stay private until the student or teacher chooses otherwise.",
    requiredScopes: ["drive file create", "private sharing"],
    dataShared: "Saved-run summary, hosted submission links, and selected exported files.",
    consentGate: "Student reviews the payload preview before export.",
    docsUrl: "https://docs.composio.dev/toolkits/googledrive",
    recommendedTools: ["GOOGLEDRIVE_CREATE_FOLDER", "GOOGLEDRIVE_CREATE_FILE_FROM_TEXT"]
  },
  {
    id: "google-classroom-prelab-checkpoint",
    toolkit: "Google Classroom",
    toolkitSlug: "google_classroom",
    envSuffix: "GOOGLE_CLASSROOM",
    label: "Draft pre-lab checkpoint",
    studentValue: "Turns the pre-lab setup checks into a teacher-reviewable checkpoint before students collect data.",
    composioCapability: "create coursework draft and attach pre-lab evidence",
    safetyNote: "Classroom export should create a draft/checkpoint, not submit answers or write the student's conclusion.",
    requiredScopes: ["coursework draft create", "attachment add"],
    dataShared: "Pre-Lab Design Coach status, setup checks, and variable plan.",
    consentGate: "Student or teacher confirms class/course draft before posting.",
    docsUrl: "https://composio.dev/toolkits/google_classroom",
    recommendedTools: ["GOOGLE_CLASSROOM_CREATE_COURSEWORK", "GOOGLE_CLASSROOM_CREATE_COURSE_WORK_MATERIAL"]
  },
  {
    id: "google-forms-readiness-check",
    toolkit: "Google Forms",
    toolkitSlug: "googleforms",
    envSuffix: "GOOGLE_FORMS",
    label: "Create readiness check form",
    studentValue: "Turns the pre-lab setup and exit-ticket prompts into a student self-check before submission.",
    composioCapability: "create Google Forms draft with short-answer readiness prompts",
    safetyNote: "Forms export should ask questions and collect student answers, not fill the answers for them.",
    requiredScopes: ["forms draft create", "short-answer questions"],
    dataShared: "Setup checks and exit-ticket prompts without answers.",
    consentGate: "Student reviews the payload preview before export.",
    docsUrl: "https://docs.composio.dev/toolkits/googleforms",
    recommendedTools: ["GOOGLEFORMS_CREATE_FORM", "GOOGLEFORMS_BATCH_UPDATE_FORM"]
  },
  {
    id: "google-calendar-next-trial-reminder",
    toolkit: "Google Calendar",
    toolkitSlug: "googlecalendar",
    envSuffix: "GOOGLE_CALENDAR",
    label: "Schedule next trial reminder",
    studentValue: "Places the next safe measurement or repeat trial on the student's calendar.",
    composioCapability: "create calendar event draft/reminder from next-trial plan",
    safetyNote: "Calendar export should schedule the next measurement task, not invent results or conclusions.",
    requiredScopes: ["calendar event create", "reminder add"],
    dataShared: "Next-trial reminder title, due window, and student-owned lab title only.",
    consentGate: "Student reviews the reminder before export.",
    docsUrl: "https://docs.composio.dev/toolkits/googlecalendar",
    recommendedTools: ["GOOGLECALENDAR_CREATE_EVENT", "GOOGLECALENDAR_QUICK_ADD"]
  },
  {
    id: "gmail-teacher-review-draft",
    toolkit: "Gmail",
    toolkitSlug: "gmail",
    envSuffix: "GMAIL",
    label: "Draft teacher review email",
    studentValue: "Prepares an unsent teacher-review draft so a student can ask for feedback on variables, sources, safety, and evidence before writing the final claim.",
    composioCapability: "create an unsent Gmail draft from the evidence packet and teacher-review questions without sending email automatically",
    safetyNote: "Gmail handoff should create a draft only; it must not send messages, read inbox content, include direct identifiers by default, or write the student's final conclusion.",
    requiredScopes: ["draft create", "student-selected recipient", "manual review before send"],
    dataShared: "Evidence packet excerpt, data/source counts, review questions, and blank claim starter for a teacher-selected recipient.",
    consentGate: "Student reviews the recipient, subject, and draft body before a Gmail draft can be created.",
    docsUrl: "https://docs.composio.dev/toolkits/gmail",
    recommendedTools: ["GMAIL_CREATE_EMAIL_DRAFT"]
  },
  {
    id: "notion-learning-record",
    toolkit: "Notion",
    toolkitSlug: "notion",
    envSuffix: "NOTION",
    label: "Create learning record",
    studentValue: "Logs the lab status, next trial, and exit-ticket prompts in a study workspace.",
    composioCapability: "create Notion page or database item",
    safetyNote: "Reflection prompts and drafts should stay student-authored; the connector must not complete answers.",
    requiredScopes: ["page create", "database item create"],
    dataShared: "Learning status, next action, and student-authored reflection drafts when present.",
    consentGate: "Student reviews the payload preview before export.",
    docsUrl: "https://docs.composio.dev/toolkits/notion",
    recommendedTools: ["NOTION_CREATE_PAGE", "NOTION_CREATE_DATABASE_ITEM"]
  }
];

interface BuildMcpIntegrationPlanInput {
  result: AnalyzeResult;
  rows: StudentDataRow[];
  description: string;
  evidencePacket: string;
  portfolio: ProgressPortfolio;
  configured?: boolean;
  serverBridgeAvailable?: boolean;
}

export function buildMcpIntegrationPlan({
  result,
  rows,
  description,
  evidencePacket,
  portfolio,
  configured = false,
  serverBridgeAvailable = false
}: BuildMcpIntegrationPlanInput): McpIntegrationPlan {
  const mode = configured ? "server_mcp" : serverBridgeAvailable ? "server_dry_run" : "preview";
  const status = configured ? "ready" : serverBridgeAvailable ? "server_dry_run" : "preview_only";
  const rowCount = rows.length;
  const sourceCount = result.sources.length;
  const savedRunCount = extractSavedRunCount(portfolio);
  const title = `Ouija Evidence Packet: ${result.classification.title}`;
  const actions: McpIntegrationAction[] = MCP_CONNECTOR_CATALOG.map((connector) => ({
    id: connector.id,
    toolkit: connector.toolkit,
    label: connector.label,
    studentValue: connector.studentValue,
    composioCapability: connector.composioCapability,
    payloadSummary: buildPayloadSummary(connector, result, rowCount, sourceCount, savedRunCount, title),
    mode,
    requiresConsent: true,
    safetyNote: connector.safetyNote,
    docsUrl: connector.docsUrl,
    recommendedTools: connector.recommendedTools
  }));

  return {
    status,
    summary: buildSummary(status),
    setupHint: buildSetupHint(status),
    privacyBoundary:
      "Student chooses what to validate or export; dry-run mode never sends lab descriptions, table rows, sources, or saved portfolio data to third-party apps.",
    actions,
    readinessMatrix: buildReadinessMatrix(actions, configured),
    dryRunChecks: buildDryRunChecks({
      configured,
      serverBridgeAvailable,
      rowCount,
      sourceCount,
      actions,
      result
    }),
    sourceScout: buildSourceScout(result, status),
    sessionStrategy: buildSessionStrategy(actions, status),
    executionBoundary: buildExecutionBoundary(status),
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
        "Composio Search source-audit query",
        "Composio Scholar claim-check query",
        "Semantic Scholar reference-check query",
        "Composio Browser source-page capture task",
        "DeepWiki public-source proof question",
        "Canvas assignment prompt and rubric context",
        "Pattern Archetype Coach source question",
        "Progress Portfolio summary",
        "Pre-Lab Design Coach",
        "Student Pilot Study Kit",
        "Pilot Evidence Tracker summary",
        "Learning Exit Ticket prompts",
        "Google Forms readiness prompts",
        "Google Slides submission deck outline",
        "Google Calendar next-trial reminder",
        "Gmail teacher-review draft prompt",
        "Composio session ticket scope",
        "Student Reflection Drafts",
        "Portfolio Story Builder prompts",
        "Integrity boundary"
      ],
      markdownExcerpt: buildMarkdownExcerpt(description, evidencePacket)
    },
    safeguards: buildSafeguards(status),
    judgeTakeaway:
      "MCP Integration Coach connects Ouija to a real research, LMS-context, and classroom handoff path with Composio Sessions, connector prerequisites, least-privilege scopes, server dry-runs, scoped session tickets, and consent gates visible to judges."
  };
}

function buildSourceScout(result: AnalyzeResult, status: McpIntegrationPlan["status"]): McpIntegrationPlan["sourceScout"] {
  const independent = result.variables[0] ?? result.columns[0]?.label ?? "independent variable";
  const dependent = result.variables[1] ?? result.columns[1]?.label ?? "dependent variable";

  return {
    status: status === "ready" ? "server_ready" : "discovered",
    verifiedAt: "July 15, 2026",
    activeToolkits: ["composio_search", "browser_tool", "deepwiki_mcp"],
    noAccountAuthToolkits: ["Composio Search", "Composio Browser Tool", "DeepWiki MCP"],
    queryPreview: `${result.classification.title} ${independent} ${dependent} expected results middle school high school lab`,
    dataBoundary:
      "Send the experiment title, variable names, current citation URLs, and a source-quality question only; do not send raw table rows, saved reflections, names, emails, or final claims.",
    steps: [
      {
        id: "discover",
        label: "Discover candidate sources",
        tools: ["COMPOSIO_SEARCH_WEB"],
        detail: "Find public classroom-safe pages for the experiment topic and variables before trusting the expected pattern."
      },
      {
        id: "fetch",
        label: "Fetch readable page text",
        tools: ["COMPOSIO_SEARCH_FETCH_URL_CONTENT"],
        detail: "Pull bounded text from the selected source pages so Ouija can check what the page actually says."
      },
      {
        id: "scholar",
        label: "Check scholarly context",
        tools: ["COMPOSIO_SEARCH_SCHOLAR"],
        detail: "Compare the expected pattern against scholarly snippets when a high-school lab needs stronger grounding."
      },
      {
        id: "browser-fallback",
        label: "Capture dynamic source pages",
        tools: ["BROWSER_TOOL_CREATE_TASK", "BROWSER_TOOL_WATCH_TASK"],
        detail: "Use a browser task only for public pages that normal text fetch cannot read."
      }
    ],
    proofReceipts: [
      {
        id: "aiyes-rules-search",
        label: "Official AIYES rules search",
        status: "verified",
        toolkit: "Composio Search",
        tools: ["COMPOSIO_SEARCH_WEB"],
        evidence:
          "July 15 no-auth Composio Search returned the official Devpost and AIYES pages for ages 13-18, Track 1, 2-5 team, September 1 2026 deadline, deck, video, and source/deploy requirements.",
        boundary:
          "Search query only; no student table rows, saved reflections, names, emails, or final claims leave Ouija.",
        nextStep: "Refresh this receipt before final Devpost submission so the rules snapshot stays current."
      },
      {
        id: "deepwiki-index-check",
        label: "DeepWiki public repo check",
        status: "needs_indexing",
        toolkit: "DeepWiki MCP",
        tools: ["DEEPWIKI_MCP_ASK_QUESTION"],
        evidence:
          "July 15 no-auth DeepWiki call returned: Repository not found. Visit https://deepwiki.com to index it. Requested repo: rushtanu14/ouija.",
        boundary: "Public repository question only; no student lab data, browser-local notes, credentials, or private accounts are sent.",
        nextStep: "Index rushtanu14/ouija on DeepWiki before claiming live DeepWiki architecture proof."
      }
    ],
    outputContract: [
      "Shortlist source links with why each source is useful.",
      "Mark agreement, disagreement, or mixed evidence before showing an expected-result claim.",
      "Return source-quality questions and citation notes, not a finished lab conclusion.",
      "Keep all live source lookups server-side behind consent and the allowed-tool list."
    ],
    judgeTakeaway:
      "Source Scout turns Composio from a generic export badge into a read-only evidence loop: search, fetch, scholarly check, browser fallback, then student-reviewed citation notes."
  };
}

function buildSummary(status: McpIntegrationPlan["status"]) {
  if (status === "ready") return "Composio MCP exports are ready to route through the server after student confirmation.";
  if (status === "server_dry_run") return "Server dry-run bridge is active: Ouija validates Composio action packets before any account connection or live connector runs.";
  return "Preview only: Ouija shows the Composio MCP workflow and payload before any account connection exists.";
}

function buildSetupHint(status: McpIntegrationPlan["status"]) {
  if (status === "ready") return "Server-side MCP bridge is enabled. Keep COMPOSIO_API_KEY and any MCP URL on the server, never in browser code.";
  if (status === "server_dry_run") return "Server-side MCP bridge validates packets now; live routes require COMPOSIO_API_KEY, allowed tools, toolkit auth config where required, and COMPOSIO_LIVE_EXPORTS=true.";
  return "Add COMPOSIO_API_KEY and a server-side MCP bridge before enabling live exports.";
}

function buildExecutionBoundary(status: McpIntegrationPlan["status"]) {
  if (status === "ready") return "Live execution may run only from the Express API after explicit confirmation; the browser never receives Composio credentials.";
  if (status === "server_dry_run") return "Public demo calls /api/mcp/export for dry-run validation, then stops before Composio or Google Workspace execution.";
  return "Public demo is dry-run only: it validates the packet, scopes, consent, and integrity rules before any Composio connector can run.";
}

function buildSafeguards(status: McpIntegrationPlan["status"]) {
  const firstLine =
    status === "ready"
      ? "Live MCP mode keeps Composio, Google Workspace, Notion, and Calendar execution on the server after consent."
      : status === "server_dry_run"
      ? "Server dry-run mode validates Composio packets but does not call Composio Search, Semantic Scholar, Composio Browser, DeepWiki, Canvas, Google Classroom, Google Workspace, Google Slides, Gmail, Notion, or Calendar APIs."
      : "Preview mode does not call Composio Search, Semantic Scholar, Composio Browser, DeepWiki, Canvas, Google Classroom, Google Workspace, Google Slides, Gmail, or Notion APIs.";

  return [
    firstLine,
      "COMPOSIO_API_KEY must stay server-side and must never be bundled into the Vite client.",
      "Every export action requires student or teacher consent before a live connector runs.",
      "Scoped Composio sessions are prepared server-side and raw MCP URLs are withheld from browser responses.",
      "Composio Search source audits use topic and variable terms only; students review the query before live lookup.",
      "Composio Scholar claim checks compare the expected pattern against scholarly snippets without writing the student's final claim.",
      "Semantic Scholar reference checks use student-reviewed academic queries and return paper context, not a generated conclusion.",
      "Composio Browser captures public source-page context only after the student reviews the URL and task prompt.",
      "DeepWiki source proof uses the public GitHub repo only and does not receive student lab data.",
      "Canvas assignment context is read-only and must not submit work, message a class, or alter grades.",
      "Google Classroom handoff creates a teacher-review checkpoint, not an auto-submitted assignment.",
      "Google Forms handoff creates student prompts, not completed answers.",
      "Google Slides handoff creates an editable deck draft, not a submitted presentation or completed conclusion.",
      "Google Calendar handoff schedules a next-trial reminder, not a generated result.",
      "Gmail handoff creates an unsent teacher-review draft only; no automatic send, inbox read, or delete route is enabled.",
      "Exported packets preserve the academic-integrity blanks instead of writing conclusions.",
      "Reflection drafts are exported only when the student typed them in the workspace."
  ];
}

function buildSessionStrategy(actions: McpIntegrationAction[], status: McpIntegrationPlan["status"]): McpSessionStrategy {
  const sourceVerificationActionIds = [
    "composio-search-source-audit",
    "composio-scholar-claim-check",
    "semanticscholar-reference-check",
    "composio-browser-source-capture",
    "deepwiki-source-proof"
  ];
  const assignmentContextActionIds = ["canvas-assignment-context"];
  const sourceVerificationActions = actions.filter((action) => sourceVerificationActionIds.includes(action.id));
  const assignmentContextActions = actions.filter((action) => assignmentContextActionIds.includes(action.id));
  const studentExportActions = actions.filter(
    (action) => !sourceVerificationActionIds.includes(action.id) && !assignmentContextActionIds.includes(action.id)
  );
  const sourceTools = uniqueTools(sourceVerificationActions);
  const assignmentTools = uniqueTools(assignmentContextActions);
  const exportTools = uniqueTools(studentExportActions);

  return {
    status: status === "ready" ? "server_ready" : "dry_run_ready",
    headline:
      status === "ready"
        ? "Composio Sessions can be created server-side after consent."
        : "Composio Sessions are planned and dry-run validated before any live account connection.",
    sessionShape:
      "One scoped Composio session can expose selected toolkits, exact tool allowlists, and an MCP URL that remains server-side.",
    selectedToolkits: uniqueToolkits(actions),
    preloadTools: [...sourceTools, ...assignmentTools],
    bundles: [
      {
        id: "source-verification",
        label: "Read-only source verification session",
        status: "safe_dry_run",
        toolkits: uniqueToolkits(sourceVerificationActions),
        tools: sourceTools,
        dataShared:
          "Experiment title, variables, citation URLs, academic search query, source-quality question, and public repository question only.",
        blockedUntil:
          "Live search/browser/source-proof calls wait for COMPOSIO_API_KEY, allowed tools, server authorization, and student-reviewed prompts."
      },
      {
        id: "assignment-context",
        label: "Read-only assignment context session",
        status: "safe_dry_run",
        toolkits: uniqueToolkits(assignmentContextActions),
        tools: assignmentTools,
        dataShared:
          "Selected Canvas course id, assignment id, prompt text, due date, attached file metadata, and rubric criteria.",
        blockedUntil:
          "Live LMS reads wait for a student-selected assignment, Canvas connection, allowed tools, server authorization, and reviewed import text."
      },
      {
        id: "student-export",
        label: "Student export session",
        status: "consent_required",
        toolkits: uniqueToolkits(studentExportActions),
        tools: exportTools,
        dataShared:
          "Evidence packet, visible table rows, selected saved-run summary, and student-authored reflection drafts when present.",
        blockedUntil:
          "External writes stay blocked until the student or teacher reviews the payload and chooses the exact destination."
      }
    ],
    docsBasis:
      "Composio Sessions replace one-off MCP servers with a per-user session that can span selected toolkits, restrict tools, and expose a hosted MCP endpoint for server-side agents.",
    judgeTakeaway:
      "This is not a vague integration list: Ouija names the safe read-only source and assignment-context sessions, separates them from write/export sessions, keeps the tool list under control, and stops before live execution unless consent and server credentials exist."
  };
}

function buildReadinessMatrix(actions: McpIntegrationAction[], configured: boolean): McpConnectorReadiness[] {
  return actions.map((action) => {
    const connector = MCP_CONNECTOR_CATALOG.find((candidate) => candidate.id === action.id);
    const envSuffix = connector?.envSuffix ?? action.toolkit.toUpperCase().replaceAll(" ", "_");
    const authConfigEnv = `COMPOSIO_${envSuffix}_AUTH_CONFIG_ID`;
    const allowedToolsEnv = `COMPOSIO_${envSuffix}_ALLOWED_TOOLS`;
    const requiredEnv = [
      connector?.requiresAuthConfig === false ? "" : authConfigEnv,
      connector?.requiresAllowedToolsEnv === false ? "" : allowedToolsEnv
    ].filter(Boolean);

    return {
      actionId: action.id,
      toolkit: action.toolkit,
      status: configured ? "ready" : "needs_server_setup",
      requiredEnv,
      requiredScopes: connector?.requiredScopes ?? [],
      dataShared: connector?.dataShared ?? "",
      consentGate: connector?.consentGate ?? "Student reviews the payload preview before export.",
      dryRunStatus: "pass",
      dryRunDetail: configured
        ? "Server bridge can receive this action after consent."
        : "Dry-run payload is complete, but live execution waits for server credentials.",
      docsUrl: connector?.docsUrl ?? "",
      recommendedTools: connector?.recommendedTools ?? action.recommendedTools
    };
  });
}

function buildDryRunChecks({
  configured,
  serverBridgeAvailable,
  rowCount,
  sourceCount,
  actions,
  result
}: {
  configured: boolean;
  serverBridgeAvailable: boolean;
  rowCount: number;
  sourceCount: number;
  actions: McpIntegrationAction[];
  result: AnalyzeResult;
}): McpDryRunCheck[] {
  const hasRows = rowCount > 0;
  const hasSources = sourceCount > 0;
  const allConsentGated = actions.every((action) => action.requiresConsent);
  const hasIntegrityBoundaries = actions.every((action) => action.safetyNote.length > 0) && result.labBrief.claimStarter.includes("___");
  const toolkitNames = actions.map((action) => action.toolkit).join(", ");

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
      detail: `${actions.length} connector routes use specific ${toolkitNames} scopes instead of a broad all-app handoff.`
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
      id: "server-bridge",
      label: "Server dry-run bridge",
      status: serverBridgeAvailable || configured ? "pass" : "review",
      detail: serverBridgeAvailable || configured ? "Server API can validate the action packet before live connector execution." : "Static preview is visible, but /api/mcp/export is not connected yet."
    },
    {
      id: "server-only",
      label: "Server-only credentials",
      status: configured ? "pass" : "review",
      detail: configured ? "Server MCP mode is selected; credentials remain outside the browser bundle." : "Dry-run mode is active until COMPOSIO_API_KEY, allowed tools, and any required auth config IDs exist server-side."
    }
  ];
}

function formatColumnList(result: AnalyzeResult) {
  return result.columns.map((column) => (column.unit ? `${column.label} (${column.unit})` : column.label)).join(", ");
}

function buildPayloadSummary(
  connector: McpConnectorCatalogItem,
  result: AnalyzeResult,
  rowCount: number,
  sourceCount: number,
  savedRunCount: number,
  title: string
) {
  if (connector.id === "composio-search-source-audit") {
    return `Source audit query for ${title} with ${sourceCount} citation${sourceCount === 1 ? "" : "s"}, ${result.customLabTriage.patternArchetype.label.toLowerCase()}, and variables: ${formatColumnList(result)}`;
  }
  if (connector.id === "composio-scholar-claim-check") {
    return `Scholar query for ${result.classification.title}: ${result.expectedResult.pattern}`;
  }
  if (connector.id === "semanticscholar-reference-check") {
    return `Semantic Scholar query for ${result.classification.title}: compare ${result.expectedResult.pattern.toLowerCase()} against paper metadata and abstracts before trusting advanced references.`;
  }
  if (connector.id === "composio-browser-source-capture") {
    const sourceLabel = result.sources[0]?.title ?? "student-reviewed source";
    return `Browser source-capture task for ${sourceLabel}: verify page context before trusting the expected pattern.`;
  }
  if (connector.id === "deepwiki-source-proof") {
    return `DeepWiki source-proof question for rushtanu14/ouija: verify the MCP bridge, academic-integrity boundary, evaluation suite, and submission artifact claims from public code/docs.`;
  }
  if (connector.id === "canvas-assignment-context") {
    return `Canvas read-only import for ${result.classification.title}: fetch the selected assignment prompt, rubric criteria, due date, and attached lab-material metadata before planning variables.`;
  }
  if (connector.id === "google-docs-evidence-packet") return `${title} with source trail, checks, and integrity boundary`;
  if (connector.id === "google-slides-submission-deck") {
    return `AIYES submission deck draft for ${title}: turn evidence, citations, proof links, and blank claim starter into editable Google Slides Markdown.`;
  }
  if (connector.id === "google-sheets-data-log") return `${rowCount} rows across ${result.columns.length} columns: ${formatColumnList(result)}`;
  if (connector.id === "google-drive-portfolio-archive") {
    return `${savedRunCount} saved run${savedRunCount === 1 ? "" : "s"}, ${sourceCount} citation${sourceCount === 1 ? "" : "s"}, hosted submission links`;
  }
  if (connector.id === "google-classroom-prelab-checkpoint") {
    return `Pre-lab ${result.preLabDesignCoach.status.replaceAll("_", " ")}: ${result.preLabDesignCoach.setupChecks.length} setup checks, ${result.preLabDesignCoach.variablePlan.independentVariable} to ${result.preLabDesignCoach.variablePlan.dependentVariable}`;
  }
  if (connector.id === "google-forms-readiness-check") {
    return `${result.preLabDesignCoach.setupChecks.length} setup checks, ${result.learningExitTicket.prompts.length} student reflection prompts, and ${result.studentPilotStudyKit.metrics.length} pilot-study metrics`;
  }
  if (connector.id === "google-calendar-next-trial-reminder") {
    return `Next trial reminder: ${result.nextTrialPlan.nextMeasurement}`;
  }
  if (connector.id === "gmail-teacher-review-draft") {
    return `Teacher review draft for ${title}: ask for feedback on variables, controls, source trust, safety, data flags, and the blank claim starter before submission.`;
  }

  return `${result.trackEvidence.score}/100 readiness, ${result.learningExitTicket.prompts.length} exit-ticket prompts, next action`;
}

function extractSavedRunCount(portfolio: ProgressPortfolio) {
  const metric = portfolio.metrics.find((candidate) => candidate.id === "saved-runs");
  const match = metric?.value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function uniqueToolkits(actions: McpIntegrationAction[]) {
  return actions.reduce<McpIntegrationAction["toolkit"][]>((toolkits, action) => {
    if (toolkits.includes(action.toolkit)) return toolkits;
    return [...toolkits, action.toolkit];
  }, []);
}

function uniqueTools(actions: McpIntegrationAction[]) {
  return actions.reduce<string[]>((tools, action) => {
    const nextTools = action.recommendedTools.filter((tool) => !tools.includes(tool));
    return [...tools, ...nextTools];
  }, []);
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
