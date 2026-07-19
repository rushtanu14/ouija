import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan.js";
import { timingSafeEqual } from "node:crypto";
import type {
  McpBridgeExportCheck,
  McpBridgeExportRequest,
  McpBridgeExportResponse,
  McpBridgePayload,
  McpBridgePayloadCategory,
  McpBridgeSessionRequest,
  McpBridgeSessionResponse,
  McpBridgeStatus,
  McpBridgeToolkitStatus,
  McpConnectorCatalogItem,
  PreLabVariablePlan,
  StudentDataRow
} from "../src/lib/types.js";

type EnvMap = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

interface BridgeResponse<T> {
  statusCode: number;
  body: T;
}

const composioSessionUserEnv = "COMPOSIO_SESSION_USER_ID";
const composioApiBaseUrlEnv = "COMPOSIO_API_BASE_URL";
const defaultComposioApiBaseUrl = "https://backend.composio.dev/api/v3.1";
const mcpSessionAuthTokenEnv = "MCP_SESSION_AUTH_TOKEN";

export function getMcpBridgeStatus(env: EnvMap = process.env): McpBridgeStatus {
  const apiKeyConfigured = hasValue(env.COMPOSIO_API_KEY);
  const liveExportsEnabled = env.COMPOSIO_LIVE_EXPORTS === "true";
  const toolkits = MCP_CONNECTOR_CATALOG.map((connector) => buildToolkitStatus(connector, apiKeyConfigured, env));
  const sessionUserConfigured = hasValue(env[composioSessionUserEnv]);
  const sessionAuthConfigured = hasValue(env[mcpSessionAuthTokenEnv]);
  const missingEnv = buildMissingEnv(apiKeyConfigured, liveExportsEnabled, sessionUserConfigured, sessionAuthConfigured, toolkits);
  const ready = liveExportsEnabled && apiKeyConfigured && sessionUserConfigured && sessionAuthConfigured && toolkits.every((toolkit) => toolkit.configured);

  return {
    status: ready ? "ready" : "server_dry_run",
    mode: ready ? "server_mcp" : "server_dry_run",
    liveExportsEnabled,
    apiKeyConfigured,
    summary: ready
      ? "Composio bridge is configured for server-side MCP sessions after consent."
      : "Server dry-run bridge is active; live Composio execution is disabled until credentials, allowed tools, required auth configs, and COMPOSIO_LIVE_EXPORTS=true are present.",
    executionBoundary: ready
      ? "The browser can request validation, but Composio credentials and MCP session details remain server-side."
      : "The public app validates action packets and reports connector readiness without calling Composio or third-party apps.",
    missingEnv,
    toolkits,
    docs: [
      {
        label: "Composio sessions",
        url: "https://docs.composio.dev/docs/how-composio-works"
      },
      {
        label: "Configuring sessions",
        url: "https://docs.composio.dev/docs/configuring-sessions"
      },
      {
        label: "MCP sessions migration",
        url: "https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions"
      },
      {
        label: "Composio Search toolkit",
        url: "https://docs.composio.dev/toolkits/composio_search"
      },
      {
        label: "Composio Browser Tool",
        url: "https://docs.composio.dev/toolkits/browser_tool"
      },
      {
        label: "DeepWiki MCP",
        url: "https://deepwiki.com"
      },
      {
        label: "Google Calendar toolkit",
        url: "https://docs.composio.dev/toolkits/googlecalendar"
      },
      {
        label: "Google Slides toolkit",
        url: "https://docs.composio.dev/toolkits/googleslides"
      }
    ]
  };
}

export function validateMcpExportRequest(rawBody: unknown, env: EnvMap = process.env): BridgeResponse<McpBridgeExportResponse | { error: string }> {
  const request = parseRequest(rawBody);

  if (!request.ok) {
    return {
      statusCode: 400,
      body: { error: request.error }
    };
  }

  const connector = MCP_CONNECTOR_CATALOG.find((candidate) => candidate.id === request.value.actionId);

  if (!connector) {
    return {
      statusCode: 400,
      body: { error: "Choose one of Ouija's supported Composio MCP actions." }
    };
  }

  if (!request.value.consent) {
    return {
      statusCode: 400,
      body: { error: "Student or teacher consent is required before validating an MCP export packet." }
    };
  }

  const bridge = getMcpBridgeStatus(env);
  const toolkit = bridge.toolkits.find((candidate) => candidate.actionId === connector.id) ?? buildToolkitStatus(connector, bridge.apiKeyConfigured, env);
  const payload = request.value.payload;
  const checks = buildExportChecks({
    payload,
    bridge,
    toolkit
  });
  const blocked = checks.some((check) => check.status === "blocked");

  return {
    statusCode: 200,
    body: {
      status: blocked ? "blocked" : bridge.status === "ready" ? "ready" : "dry_run",
      actionId: connector.id,
      toolkit: connector.toolkit,
      mode: bridge.mode,
      summary: blocked
        ? "MCP packet needs review before any live connector can run."
        : bridge.status === "ready"
          ? "MCP packet is ready for a consent-gated server-side Composio session."
          : "MCP packet passed server dry-run validation; no Composio, Google Workspace, Calendar, or Notion action was called.",
      executionBoundary: bridge.executionBoundary,
      checks,
      target: {
        toolkitSlug: connector.toolkitSlug,
        authConfigEnv: toolkit.authConfigEnv,
        allowedToolsEnv: toolkit.allowedToolsEnv,
        recommendedTools: selectEnabledTools(connector, toolkit),
        docsUrl: connector.docsUrl
      },
      sanitizedPayload: sanitizePayload(payload),
      nextStep: bridge.status === "ready"
        ? "Create a Composio session with this toolkit, auth config, allowed tools, and explicit user confirmation."
        : "Add the missing server env vars shown by /api/mcp/status, then keep the same consent-gated validation step before live execution."
    }
  };
}

export async function createMcpSessionTicket(
  rawBody: unknown,
  env: EnvMap = process.env,
  fetchImpl: FetchLike = fetch,
  authorizationHeader?: string
): Promise<BridgeResponse<McpBridgeSessionResponse | { error: string }>> {
  const request = parseRequest(rawBody);

  if (!request.ok) {
    return {
      statusCode: 400,
      body: { error: request.error }
    };
  }
  const sessionRequest = normalizeSessionRequest(request.value, rawBody);

  if (!sessionRequest.ok) {
    return {
      statusCode: 400,
      body: { error: sessionRequest.error }
    };
  }

  const connector = MCP_CONNECTOR_CATALOG.find((candidate) => candidate.id === sessionRequest.value.actionId);

  if (!connector) {
    return {
      statusCode: 400,
      body: { error: "Choose one of Ouija's supported Composio MCP actions." }
    };
  }

  if (!sessionRequest.value.consent) {
    return {
      statusCode: 400,
      body: { error: "Student or teacher consent is required before preparing a Composio MCP session." }
    };
  }

  const bridge = getMcpBridgeStatus(env);
  const toolkit = bridge.toolkits.find((candidate) => candidate.actionId === connector.id) ?? buildToolkitStatus(connector, bridge.apiKeyConfigured, env);
  const payload = sessionRequest.value.payload;
  const checks = buildExportChecks({
    payload,
    bridge,
    toolkit
  });
  const sessionReady = isToolkitReadyForSession({
    bridge,
    toolkit,
    env
  });
  const sessionChecks = sessionReady ? markSelectedSessionCredentialsReady(checks, toolkit) : checks;
  const blocked = sessionChecks.some((check) => check.status === "blocked");

  if (blocked) {
    return {
      statusCode: 200,
      body: buildSessionResponse({
        status: "blocked",
        connector,
        toolkit,
        payload,
        bridgeMode: bridge.mode,
        bridge,
        env,
        checks: sessionChecks,
        sessionCreated: false,
        sessionId: undefined
      })
    };
  }

  if (sessionRequest.value.execution === "preview") {
    return {
      statusCode: 200,
      body: buildSessionResponse({
        status: sessionReady ? "ready" : "dry_run",
        connector,
        toolkit,
        payload,
        bridgeMode: sessionReady ? "server_mcp" : "server_dry_run",
        bridge,
        env,
        checks: sessionChecks,
        sessionCreated: false,
        sessionId: undefined
      })
    };
  }

  if (!sessionReady) {
    return {
      statusCode: 200,
      body: buildSessionResponse({
        status: "dry_run",
        connector,
        toolkit,
        payload,
        bridgeMode: "server_dry_run",
        bridge,
        env,
        checks: sessionChecks,
        sessionCreated: false,
        sessionId: undefined
      })
    };
  }

  if (!hasValidSessionAuthorization(authorizationHeader, env[mcpSessionAuthTokenEnv])) {
    return {
      statusCode: 403,
      body: { error: "Live MCP session creation requires authorized server access." }
    };
  }

  let sessionResult: Awaited<ReturnType<typeof createComposioSession>>;
  try {
    sessionResult = await createComposioSession({
      connector,
      toolkit,
      env,
      fetchImpl
    });
  } catch {
    return {
      statusCode: 502,
      body: { error: "Composio session creation was unavailable." }
    };
  }

  if (!sessionResult.ok) {
    return {
      statusCode: 502,
      body: { error: "Composio session creation was unavailable." }
    };
  }

  return {
    statusCode: 200,
    body: buildSessionResponse({
      status: "created",
      connector,
      toolkit,
      payload,
      bridgeMode: "server_mcp",
      bridge,
      env,
      checks: sessionChecks,
      sessionCreated: sessionResult.mcpUrlIssued,
      sessionId: sessionResult.sessionId
    })
  };
}

function buildToolkitStatus(connector: McpConnectorCatalogItem, apiKeyConfigured: boolean, env: EnvMap): McpBridgeToolkitStatus {
  const authConfigEnv = `COMPOSIO_${connector.envSuffix}_AUTH_CONFIG_ID`;
  const allowedToolsEnv = `COMPOSIO_${connector.envSuffix}_ALLOWED_TOOLS`;
  const authConfigRequired = connector.requiresAuthConfig !== false;
  const allowedToolsRequired = connector.requiresAllowedToolsEnv !== false;
  const allowedTools = parseAllowedTools(env[allowedToolsEnv]);
  const authConfigConfigured = hasValue(env[authConfigEnv]);
  const allowedToolsConfigured = !allowedToolsRequired || connector.recommendedTools.some((tool) => allowedTools.includes(tool));
  const missingEnv = [
    !authConfigRequired || authConfigConfigured ? "" : authConfigEnv,
    !allowedToolsRequired || allowedToolsConfigured ? "" : allowedToolsEnv
  ].filter(Boolean);

  return {
    actionId: connector.id,
    toolkit: connector.toolkit,
    toolkitSlug: connector.toolkitSlug,
    docsUrl: connector.docsUrl,
    configured: apiKeyConfigured && (!authConfigRequired || authConfigConfigured) && (!allowedToolsRequired || allowedToolsConfigured),
    authConfigRequired,
    allowedToolsRequired,
    authConfigEnv,
    allowedToolsEnv,
    authConfigConfigured: authConfigRequired ? authConfigConfigured : true,
    allowedToolsConfigured: allowedToolsRequired ? allowedToolsConfigured : true,
    allowedTools,
    recommendedTools: connector.recommendedTools,
    missingEnv
  };
}

function buildMissingEnv(
  apiKeyConfigured: boolean,
  liveExportsEnabled: boolean,
  sessionUserConfigured: boolean,
  sessionAuthConfigured: boolean,
  toolkits: McpBridgeToolkitStatus[]
) {
  return [
    apiKeyConfigured ? "" : "COMPOSIO_API_KEY",
    liveExportsEnabled ? "" : "COMPOSIO_LIVE_EXPORTS=true",
    sessionUserConfigured ? "" : composioSessionUserEnv,
    sessionAuthConfigured ? "" : mcpSessionAuthTokenEnv,
    ...toolkits.flatMap((toolkit) => toolkit.missingEnv)
  ].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index);
}

function buildExportChecks({
  payload,
  bridge,
  toolkit
}: {
  payload: McpBridgeExportRequest["payload"];
  bridge: McpBridgeStatus;
  toolkit: McpBridgeToolkitStatus;
}): McpBridgeExportCheck[] {
  const payloadComplete = isPayloadComplete(payload);
  const hasIntegrityBlank = hasAcademicIntegrityBoundary(payload);

  return [
    {
      id: "supported-action",
      label: "Supported action",
      status: "pass",
      detail: `${toolkit.toolkit} is in Ouija's allowlisted Composio connector catalog.`
    },
    {
      id: "consent",
      label: "Consent gate",
      status: "pass",
      detail: "This dry-run request came from an explicit student-facing validation action."
    },
    {
      id: "payload",
      label: "Payload completeness",
      status: payloadComplete ? "pass" : "blocked",
      detail: payloadComplete
        ? `${formatPayloadCategory(payload.category)} payload uses its action-specific allowlist.`
        : "Required action-specific MCP payload fields are missing or empty."
    },
    {
      id: "integrity",
      label: "Academic integrity",
      status: hasIntegrityBlank ? "pass" : "review",
      detail: hasIntegrityBlank
        ? "Evidence packet preserves the blank claim/conclusion boundary."
        : "Review the packet before live export because the blank claim boundary was not detected."
    },
    {
      id: "credentials",
      label: "Credential boundary",
      status: bridge.status === "ready" && toolkit.configured ? "pass" : "review",
      detail: bridge.status === "ready" && toolkit.configured
        ? "Server-side Composio env vars are configured without exposing values to the browser."
        : "Dry-run stopped before external execution because live Composio env vars are incomplete or disabled."
    }
  ];
}

function markSelectedSessionCredentialsReady(checks: McpBridgeExportCheck[], toolkit: McpBridgeToolkitStatus): McpBridgeExportCheck[] {
  return checks.map((check) =>
    check.id === "credentials"
      ? {
          ...check,
          status: "pass",
          detail: `${toolkit.toolkit} has server-side Composio env vars configured for this scoped session without exposing values to the browser.`
        }
      : check
  );
}

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

function parseRequest(rawBody: unknown): ParseResult<McpBridgeExportRequest> {
  const body = typeof rawBody === "string" ? parseJson(rawBody) : rawBody;
  if (!isRecord(body) || typeof body.actionId !== "string" || typeof body.consent !== "boolean" || !isRecord(body.payload)) {
    return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
  }
  const expectedCategory = getPayloadCategoryForAction(body.actionId);
  if (!expectedCategory) {
    return {
      ok: true,
      value: {
        actionId: body.actionId as McpBridgeExportRequest["actionId"],
        consent: body.consent,
        payload: body.payload as unknown as McpBridgePayload
      }
    };
  }
  const payload = normalizePayload(body.payload, expectedCategory);
  if (!payload.ok) return payload;

  return {
    ok: true,
    value: {
      actionId: body.actionId as McpBridgeExportRequest["actionId"],
      consent: body.consent,
      payload: payload.value
    }
  };
}

function normalizeSessionRequest(request: McpBridgeExportRequest, rawBody: unknown): ParseResult<McpBridgeSessionRequest> {
  const body = typeof rawBody === "string" ? parseJson(rawBody) : rawBody;
  if (!isRecord(body) || (body.execution !== "preview" && body.execution !== "create")) {
    return { ok: false, error: "Choose preview or create execution for MCP sessions." };
  }

  return {
    ok: true,
    value: {
      ...request,
      execution: body.execution
    }
  };
}

function normalizePayload(payload: unknown, expectedCategory: McpBridgePayloadCategory): ParseResult<McpBridgePayload> {
  if (!isRecord(payload)) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
  if (payload.category !== expectedCategory) return { ok: false, error: "MCP payload category does not match this action." };

  const allowedKeys = allowedPayloadKeys(expectedCategory);
  if (!hasOnlyAllowedKeys(payload, allowedKeys)) {
    return { ok: false, error: "MCP payload fields are not allowed for this action." };
  }

  const title = boundedString(payload.title, 200);
  if (title === null) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };

  if (expectedCategory === "source") {
    const query = boundedString(payload.query, 1_000);
    const variables = normalizeStringArray(payload.variables, 20, 100);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (query === null || !variables || !sourceUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "source", title, query, variables, sourceUrls } };
  }

  if (expectedCategory === "assignment_context") {
    const query = boundedString(payload.query, 1_000);
    const variables = normalizeStringArray(payload.variables, 20, 100);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (query === null || !variables || !sourceUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "assignment_context", title, query, variables, sourceUrls } };
  }

  if (expectedCategory === "document_export") {
    const markdown = boundedString(payload.markdown, 100_000);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (markdown === null || !sourceUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "document_export", title, markdown, sourceUrls } };
  }

  if (expectedCategory === "deck_export") {
    const outline = normalizeStringArray(payload.outline, 20, 2_000);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (!outline || !sourceUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "deck_export", title, outline, sourceUrls } };
  }

  if (expectedCategory === "table_export") {
    const columns = normalizeStringArray(payload.columns, 32, 100);
    if (!columns || !Array.isArray(payload.rows) || payload.rows.length > 200 || !payload.rows.every(isValidStudentRow)) {
      return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    }
    return { ok: true, value: { category: "table_export", title, columns, rows: payload.rows } };
  }

  if (expectedCategory === "portfolio_archive") {
    const summary = boundedString(payload.summary, 2_000);
    const artifactUrls = normalizeUrlArray(payload.artifactUrls, 20);
    if (summary === null || !artifactUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "portfolio_archive", title, summary, artifactUrls } };
  }

  if (expectedCategory === "classroom_checkpoint") {
    const setupChecks = normalizeStringArray(payload.setupChecks, 20, 500);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (!setupChecks || !sourceUrls || !isValidVariablePlan(payload.variablePlan)) {
      return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    }
    return { ok: true, value: { category: "classroom_checkpoint", title, setupChecks, variablePlan: payload.variablePlan, sourceUrls } };
  }

  if (expectedCategory === "readiness_form") {
    const prompts = normalizeStringArray(payload.prompts, 20, 1_000);
    const setupChecks = normalizeStringArray(payload.setupChecks, 20, 500);
    if (!prompts || !setupChecks) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "readiness_form", title, prompts, setupChecks } };
  }

  if (expectedCategory === "calendar_reminder") {
    const reminderTitle = boundedString(payload.reminderTitle, 200);
    const nextAction = boundedString(payload.nextAction, 1_000);
    const dueWindow = boundedString(payload.dueWindow, 200);
    if (reminderTitle === null || nextAction === null || dueWindow === null) {
      return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    }
    return { ok: true, value: { category: "calendar_reminder", title, reminderTitle, nextAction, dueWindow } };
  }

  if (expectedCategory === "teacher_review_draft") {
    const subject = boundedString(payload.subject, 200);
    const body = boundedString(payload.body, 5_000);
    const sourceUrls = normalizeUrlArray(payload.sourceUrls, 20);
    if (subject === null || body === null || !sourceUrls) return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
    return { ok: true, value: { category: "teacher_review_draft", title, subject, body, sourceUrls } };
  }

  const status = boundedString(payload.status, 100);
  const nextAction = boundedString(payload.nextAction, 1_000);
  const reflectionPrompts = normalizeStringArray(payload.reflectionPrompts, 20, 1_000);
  if ((status !== "competitive" && status !== "submittable" && status !== "needs_work") || nextAction === null || !reflectionPrompts) {
    return { ok: false, error: "Send a valid MCP action, consent flag, and action-specific payload." };
  }
  return { ok: true, value: { category: "learning_record", title, status, nextAction, reflectionPrompts } };
}

function boundedString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length <= maxLength ? normalized : null;
}

function isValidStudentRow(value: unknown): value is StudentDataRow {
  if (!isRecord(value) || typeof value.id !== "string" || value.id.length > 100) return false;
  return Object.entries(value).length <= 32 && Object.entries(value).every(([key, cell]) => {
    if (!key || key.length > 100) return false;
    if (typeof cell === "number") return Number.isFinite(cell);
    return typeof cell === "string" && cell.length <= 500;
  });
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function parseAllowedTools(value: string | undefined) {
  return value
    ? value
        .split(",")
        .map((tool) => tool.trim())
        .filter(Boolean)
    : [];
}

function parseJson(value: string) {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasValue(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeStringArray(value: unknown, maxItems: number, maxItemLength: number) {
  if (!Array.isArray(value) || value.length > maxItems) return null;
  const items = value.map((item) => boundedString(item, maxItemLength));
  if (items.some((item) => item === null)) return null;
  return items as string[];
}

function normalizeUrlArray(value: unknown, maxItems: number) {
  const urls = normalizeStringArray(value, maxItems, 1_000);
  if (!urls || !urls.every(isHttpsUrl)) return null;
  return urls;
}

function isValidVariablePlan(value: unknown): value is PreLabVariablePlan {
  if (!isRecord(value)) return false;
  return boundedString(value.independentVariable, 200) !== null
    && boundedString(value.dependentVariable, 200) !== null
    && Boolean(normalizeStringArray(value.controlVariables, 20, 200));
}

function getPayloadCategoryForAction(actionId: string): McpBridgePayloadCategory | null {
  if (
    actionId === "composio-search-source-audit"
    || actionId === "composio-scholar-claim-check"
    || actionId === "semanticscholar-reference-check"
    || actionId === "composio-browser-source-capture"
    || actionId === "deepwiki-source-proof"
  ) {
    return "source";
  }
  if (actionId === "canvas-assignment-context") return "assignment_context";
  if (actionId === "google-docs-evidence-packet") return "document_export";
  if (actionId === "google-slides-submission-deck") return "deck_export";
  if (actionId === "google-sheets-data-log") return "table_export";
  if (actionId === "google-drive-portfolio-archive") return "portfolio_archive";
  if (actionId === "google-classroom-prelab-checkpoint") return "classroom_checkpoint";
  if (actionId === "google-forms-readiness-check") return "readiness_form";
  if (actionId === "google-calendar-next-trial-reminder") return "calendar_reminder";
  if (actionId === "gmail-teacher-review-draft") return "teacher_review_draft";
  if (actionId === "notion-learning-record") return "learning_record";
  return null;
}

function allowedPayloadKeys(category: McpBridgePayloadCategory) {
  if (category === "source") return ["category", "title", "query", "variables", "sourceUrls"];
  if (category === "assignment_context") return ["category", "title", "query", "variables", "sourceUrls"];
  if (category === "document_export") return ["category", "title", "markdown", "sourceUrls"];
  if (category === "deck_export") return ["category", "title", "outline", "sourceUrls"];
  if (category === "table_export") return ["category", "title", "columns", "rows"];
  if (category === "portfolio_archive") return ["category", "title", "summary", "artifactUrls"];
  if (category === "classroom_checkpoint") return ["category", "title", "setupChecks", "variablePlan", "sourceUrls"];
  if (category === "readiness_form") return ["category", "title", "prompts", "setupChecks"];
  if (category === "calendar_reminder") return ["category", "title", "reminderTitle", "nextAction", "dueWindow"];
  if (category === "teacher_review_draft") return ["category", "title", "subject", "body", "sourceUrls"];
  return ["category", "title", "status", "nextAction", "reflectionPrompts"];
}

function hasOnlyAllowedKeys(value: Record<string, unknown>, allowedKeys: string[]) {
  return Object.keys(value).every((key) => allowedKeys.includes(key));
}

function isPayloadComplete(payload: McpBridgePayload) {
  if (payload.category === "source" || payload.category === "assignment_context") {
    return payload.title.length > 0 && payload.query.length > 0 && payload.variables.length > 0 && payload.sourceUrls.length > 0;
  }
  if (payload.category === "document_export") return payload.title.length > 0 && payload.markdown.length > 0;
  if (payload.category === "deck_export") return payload.title.length > 0 && payload.outline.length > 0;
  if (payload.category === "table_export") return payload.title.length > 0 && payload.columns.length > 0 && payload.rows.length > 0;
  if (payload.category === "portfolio_archive") return payload.title.length > 0 && payload.summary.length > 0;
  if (payload.category === "classroom_checkpoint") return payload.title.length > 0 && payload.setupChecks.length > 0;
  if (payload.category === "readiness_form") return payload.title.length > 0 && payload.prompts.length > 0;
  if (payload.category === "calendar_reminder") return payload.title.length > 0 && payload.reminderTitle.length > 0 && payload.nextAction.length > 0;
  if (payload.category === "teacher_review_draft") return payload.title.length > 0 && payload.subject.length > 0 && payload.body.length > 0;
  return payload.title.length > 0 && payload.nextAction.length > 0;
}

function hasAcademicIntegrityBoundary(payload: McpBridgePayload) {
  if (payload.category === "document_export") return payload.markdown.includes("___");
  if (payload.category === "teacher_review_draft") return !/final\s+claim/i.test(payload.body);
  return true;
}

function formatPayloadCategory(category: McpBridgePayloadCategory) {
  return category.replaceAll("_", " ");
}

function sanitizePayload(payload: McpBridgePayload): McpBridgeExportResponse["sanitizedPayload"] {
  const urls = "sourceUrls" in payload
    ? payload.sourceUrls
    : "artifactUrls" in payload
      ? payload.artifactUrls
      : [];
  return {
    title: payload.title,
    payloadCategory: payload.category,
    fieldCount: Object.keys(payload).filter((key) => key !== "category").length,
    sourceCount: urls.length
  };
}

function isToolkitReadyForSession({
  bridge,
  toolkit,
  env
}: {
  bridge: McpBridgeStatus;
  toolkit: McpBridgeToolkitStatus;
  env: EnvMap;
}) {
  return bridge.liveExportsEnabled
    && bridge.apiKeyConfigured
    && toolkit.configured
    && hasValue(env[composioSessionUserEnv])
    && hasValue(env[mcpSessionAuthTokenEnv]);
}

function hasValidSessionAuthorization(header: string | undefined, expectedToken: string | undefined) {
  const prefix = "Bearer ";
  if (!header?.startsWith(prefix) || !hasValue(expectedToken)) return false;
  const supplied = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(expectedToken as string);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function buildSessionResponse({
  status,
  connector,
  toolkit,
  payload,
  bridgeMode,
  bridge,
  env,
  checks,
  sessionCreated,
  sessionId
}: {
  status: McpBridgeSessionResponse["status"];
  connector: McpConnectorCatalogItem;
  toolkit: McpBridgeToolkitStatus;
  payload: McpBridgeExportRequest["payload"];
  bridgeMode: McpBridgeStatus["mode"];
  bridge: McpBridgeStatus;
  env: EnvMap;
  checks: McpBridgeExportCheck[];
  sessionCreated: boolean;
  sessionId: string | undefined;
}): McpBridgeSessionResponse {
  return {
    status,
    actionId: connector.id,
    toolkit: connector.toolkit,
    mode: bridgeMode,
    summary:
      status === "created"
        ? "A scoped Composio Tool Router session was created server-side for this consent-gated action."
        : status === "ready"
          ? "Session preview is ready; live creation remains server-owned and requires bearer authorization."
        : status === "blocked"
          ? "The session ticket is blocked until the packet has enough student-visible evidence."
          : "Session dry-run only: Ouija shows the exact Composio session scope but does not contact Composio without live server credentials.",
    executionBoundary:
      status === "created"
        ? "The server created the session and withheld the raw MCP URL from browser code."
        : status === "ready"
          ? "Preview stops before Composio; only an authorized server-side create request may issue a live MCP session."
        : bridge.executionBoundary,
    checks,
    target: {
      toolkitSlug: connector.toolkitSlug,
      authConfigEnv: toolkit.authConfigEnv,
      allowedToolsEnv: toolkit.allowedToolsEnv,
      recommendedTools: selectEnabledTools(connector, toolkit),
      docsUrl: connector.docsUrl,
      sessionUserEnv: composioSessionUserEnv,
      apiBaseUrlEnv: composioApiBaseUrlEnv
    },
    sessionPlan: {
      endpoint: "/api/v3.1/tool_router/session",
      userIdConfigured: hasValue(env[composioSessionUserEnv]),
      authConfigConfigured: toolkit.authConfigConfigured,
      allowedToolsConfigured: toolkit.allowedToolsConfigured,
      enabledToolkit: connector.toolkitSlug,
      enabledTools: selectEnabledTools(connector, toolkit),
      mcpUrlIssued: sessionCreated,
      sessionIdPreview: sessionId ? previewIdentifier(sessionId) : undefined
    },
    sanitizedPayload: sanitizePayload(payload),
    nextStep:
      status === "created"
        ? "Attach the server-side agent runner to the issued MCP session; do not paste the raw MCP URL into client code."
        : status === "ready"
          ? "Keep the browser in preview mode; live session creation requires a bearer-authorized server action."
        : "Configure COMPOSIO_API_KEY, COMPOSIO_SESSION_USER_ID, live exports, allowed tools, and this toolkit auth config when required before creating a live session."
  };
}

async function createComposioSession({
  connector,
  toolkit,
  env,
  fetchImpl
}: {
  connector: McpConnectorCatalogItem;
  toolkit: McpBridgeToolkitStatus;
  env: EnvMap;
  fetchImpl: FetchLike;
}): Promise<{ ok: true; sessionId: string | undefined; mcpUrlIssued: boolean } | { ok: false; error: string }> {
  const apiKey = env.COMPOSIO_API_KEY?.trim();
  const userId = env[composioSessionUserEnv]?.trim();
  const authConfigId = env[toolkit.authConfigEnv]?.trim();

  if (!apiKey || !userId || (toolkit.authConfigRequired && !authConfigId) || (toolkit.allowedToolsRequired && toolkit.allowedTools.length === 0)) {
    return { ok: false, error: "Composio session creation requires API key, session user id, required auth config, and allowed tools." };
  }

  const baseUrl = (env[composioApiBaseUrlEnv]?.trim() || defaultComposioApiBaseUrl).replace(/\/$/, "");
  const requestBody: Record<string, unknown> = {
    user_id: userId,
    toolkits: {
      enable: [connector.toolkitSlug]
    },
    tools: {
      [connector.toolkitSlug]: {
        enable: selectEnabledTools(connector, toolkit)
      }
    },
    preload: {
      tools: selectEnabledTools(connector, toolkit)
    },
    manage_connections: {
      enable: true,
      enable_wait_for_connections: false,
      enable_connection_removal: true
    }
  };

  if (authConfigId) {
    requestBody.auth_configs = {
      [connector.toolkitSlug]: authConfigId
    };
  }

  const response = await fetchImpl(`${baseUrl}/tool_router/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify(requestBody)
  });
  const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    console.warn("Composio session creation failed", {
      actionId: connector.id,
      toolkitSlug: connector.toolkitSlug,
      status: response.status
    });
    return { ok: false, error: "Composio session creation was unavailable." };
  }

  const mcp = isRecord(body.mcp) ? body.mcp : {};
  return {
    ok: true,
    sessionId: typeof body.session_id === "string" ? body.session_id : undefined,
    mcpUrlIssued: typeof mcp.url === "string" && mcp.url.length > 0
  };
}

function previewIdentifier(value: string) {
  if (value.length <= 10) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function selectEnabledTools(connector: McpConnectorCatalogItem, toolkit: McpBridgeToolkitStatus) {
  if (toolkit.allowedTools.length === 0) return connector.recommendedTools;
  const scopedTools = connector.recommendedTools.filter((tool) => toolkit.allowedTools.includes(tool));
  return scopedTools.length > 0 ? scopedTools : connector.recommendedTools;
}
