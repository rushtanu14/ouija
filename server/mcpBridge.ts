import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan.js";
import type {
  McpBridgeExportCheck,
  McpBridgeExportRequest,
  McpBridgeExportResponse,
  McpBridgeSessionResponse,
  McpBridgeStatus,
  McpBridgeToolkitStatus,
  McpConnectorCatalogItem,
  SourceCard,
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

export function getMcpBridgeStatus(env: EnvMap = process.env): McpBridgeStatus {
  const apiKeyConfigured = hasValue(env.COMPOSIO_API_KEY);
  const liveExportsEnabled = env.COMPOSIO_LIVE_EXPORTS === "true";
  const toolkits = MCP_CONNECTOR_CATALOG.map((connector) => buildToolkitStatus(connector, apiKeyConfigured, env));
  const sessionUserConfigured = hasValue(env[composioSessionUserEnv]);
  const missingEnv = buildMissingEnv(apiKeyConfigured, liveExportsEnabled, sessionUserConfigured, toolkits);
  const ready = liveExportsEnabled && apiKeyConfigured && sessionUserConfigured && toolkits.every((toolkit) => toolkit.configured);

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
        label: "Composio Browser Tool",
        url: "https://docs.composio.dev/toolkits/browser_tool"
      },
      {
        label: "Google Calendar toolkit",
        url: "https://docs.composio.dev/toolkits/googlecalendar"
      }
    ]
  };
}

export function validateMcpExportRequest(rawBody: unknown, env: EnvMap = process.env): BridgeResponse<McpBridgeExportResponse | { error: string }> {
  const request = parseRequest(rawBody);

  if (!request) {
    return {
      statusCode: 400,
      body: { error: "Send an MCP export action, consent flag, and payload for server dry-run validation." }
    };
  }

  const connector = MCP_CONNECTOR_CATALOG.find((candidate) => candidate.id === request.actionId);

  if (!connector) {
    return {
      statusCode: 400,
      body: { error: "Choose one of Ouija's supported Composio MCP actions." }
    };
  }

  if (!request.consent) {
    return {
      statusCode: 400,
      body: { error: "Student or teacher consent is required before validating an MCP export packet." }
    };
  }

  const bridge = getMcpBridgeStatus(env);
  const toolkit = bridge.toolkits.find((candidate) => candidate.actionId === connector.id) ?? buildToolkitStatus(connector, bridge.apiKeyConfigured, env);
  const payload = normalizePayload(request.payload);
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
      sanitizedPayload: {
        title: payload.title,
        rowCount: payload.rows.length,
        sourceCount: payload.sources.length,
        descriptionPreview: previewText(payload.description, 180),
        evidenceExcerpt: previewText(payload.evidencePacket, 500)
      },
      nextStep: bridge.status === "ready"
        ? "Create a Composio session with this toolkit, auth config, allowed tools, and explicit user confirmation."
        : "Add the missing server env vars shown by /api/mcp/status, then keep the same consent-gated validation step before live execution."
    }
  };
}

export async function createMcpSessionTicket(
  rawBody: unknown,
  env: EnvMap = process.env,
  fetchImpl: FetchLike = fetch
): Promise<BridgeResponse<McpBridgeSessionResponse | { error: string }>> {
  const request = parseRequest(rawBody);

  if (!request) {
    return {
      statusCode: 400,
      body: { error: "Send an MCP session action, consent flag, and payload for a scoped Composio session ticket." }
    };
  }

  const connector = MCP_CONNECTOR_CATALOG.find((candidate) => candidate.id === request.actionId);

  if (!connector) {
    return {
      statusCode: 400,
      body: { error: "Choose one of Ouija's supported Composio MCP actions." }
    };
  }

  if (!request.consent) {
    return {
      statusCode: 400,
      body: { error: "Student or teacher consent is required before preparing a Composio MCP session." }
    };
  }

  const bridge = getMcpBridgeStatus(env);
  const toolkit = bridge.toolkits.find((candidate) => candidate.actionId === connector.id) ?? buildToolkitStatus(connector, bridge.apiKeyConfigured, env);
  const payload = normalizePayload(request.payload);
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

  const sessionResult = await createComposioSession({
    connector,
    toolkit,
    env,
    fetchImpl
  });

  if (!sessionResult.ok) {
    return {
      statusCode: 502,
      body: { error: sessionResult.error }
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
  toolkits: McpBridgeToolkitStatus[]
) {
  return [
    apiKeyConfigured ? "" : "COMPOSIO_API_KEY",
    liveExportsEnabled ? "" : "COMPOSIO_LIVE_EXPORTS=true",
    sessionUserConfigured ? "" : composioSessionUserEnv,
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
  const payloadComplete = payload.title.length > 0 && payload.description.length > 0 && payload.evidencePacket.length > 0 && payload.rows.length > 0 && payload.sources.length > 0;
  const hasIntegrityBlank = payload.evidencePacket.includes("___");

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
        ? `${payload.rows.length} rows and ${payload.sources.length} source links are present.`
        : "Title, description, evidence packet, rows, and sources are required before export."
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

function parseRequest(rawBody: unknown): McpBridgeExportRequest | null {
  const body = typeof rawBody === "string" ? parseJson(rawBody) : rawBody;
  if (!isRecord(body) || typeof body.actionId !== "string" || typeof body.consent !== "boolean" || !isRecord(body.payload)) return null;

  return {
    actionId: body.actionId as McpBridgeExportRequest["actionId"],
    consent: body.consent,
    payload: normalizePayload(body.payload)
  };
}

function normalizePayload(payload: unknown): McpBridgeExportRequest["payload"] {
  const body = isRecord(payload) ? payload : {};

  return {
    title: typeof body.title === "string" ? body.title.trim() : "",
    description: typeof body.description === "string" ? body.description.trim() : "",
    evidencePacket: typeof body.evidencePacket === "string" ? body.evidencePacket.trim() : "",
    rows: Array.isArray(body.rows) ? (body.rows as StudentDataRow[]) : [],
    sources: Array.isArray(body.sources) ? (body.sources as SourceCard[]) : [],
    reflectionAnswers: isRecord(body.reflectionAnswers) ? body.reflectionAnswers : undefined
  };
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

function previewText(value: string, length: number) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 3)}...` : compact;
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
  return bridge.liveExportsEnabled && bridge.apiKeyConfigured && toolkit.configured && hasValue(env[composioSessionUserEnv]);
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
        : status === "blocked"
          ? "The session ticket is blocked until the packet has enough student-visible evidence."
          : "Session dry-run only: Ouija shows the exact Composio session scope but does not contact Composio without live server credentials.",
    executionBoundary:
      status === "created"
        ? "The server created the session and withheld the raw MCP URL from browser code."
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
    sanitizedPayload: {
      title: payload.title,
      rowCount: payload.rows.length,
      sourceCount: payload.sources.length,
      descriptionPreview: previewText(payload.description, 180),
      evidenceExcerpt: previewText(payload.evidencePacket, 500)
    },
    nextStep:
      status === "created"
        ? "Attach the server-side agent runner to the issued MCP session; do not paste the raw MCP URL into client code."
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
    const error = isRecord(body.error) && typeof body.error.message === "string" ? body.error.message : "Composio session creation failed.";
    return { ok: false, error };
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
