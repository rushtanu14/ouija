import { MCP_CONNECTOR_CATALOG } from "../src/lib/mcpIntegrationPlan.js";
import type {
  McpBridgeExportCheck,
  McpBridgeExportRequest,
  McpBridgeExportResponse,
  McpBridgeStatus,
  McpBridgeToolkitStatus,
  McpConnectorCatalogItem,
  SourceCard,
  StudentDataRow
} from "../src/lib/types.js";

type EnvMap = Record<string, string | undefined>;

interface BridgeResponse<T> {
  statusCode: number;
  body: T;
}

export function getMcpBridgeStatus(env: EnvMap = process.env): McpBridgeStatus {
  const apiKeyConfigured = hasValue(env.COMPOSIO_API_KEY);
  const liveExportsEnabled = env.COMPOSIO_LIVE_EXPORTS === "true";
  const toolkits = MCP_CONNECTOR_CATALOG.map((connector) => buildToolkitStatus(connector, apiKeyConfigured, env));
  const missingEnv = buildMissingEnv(apiKeyConfigured, liveExportsEnabled, toolkits);
  const ready = liveExportsEnabled && apiKeyConfigured && toolkits.every((toolkit) => toolkit.configured);

  return {
    status: ready ? "ready" : "server_dry_run",
    mode: ready ? "server_mcp" : "server_dry_run",
    liveExportsEnabled,
    apiKeyConfigured,
    summary: ready
      ? "Composio bridge is configured for server-side MCP sessions after consent."
      : "Server dry-run bridge is active; live Composio execution is disabled until credentials, auth configs, allowed tools, and COMPOSIO_LIVE_EXPORTS=true are present.",
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
        label: "MCP sessions migration",
        url: "https://docs.composio.dev/docs/migration-guide/mcp-servers-to-sessions"
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
        recommendedTools: toolkit.allowedTools.length > 0 ? toolkit.allowedTools : connector.recommendedTools,
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

function buildToolkitStatus(connector: McpConnectorCatalogItem, apiKeyConfigured: boolean, env: EnvMap): McpBridgeToolkitStatus {
  const authConfigEnv = `COMPOSIO_${connector.envSuffix}_AUTH_CONFIG_ID`;
  const allowedToolsEnv = `COMPOSIO_${connector.envSuffix}_ALLOWED_TOOLS`;
  const allowedTools = parseAllowedTools(env[allowedToolsEnv]);
  const authConfigConfigured = hasValue(env[authConfigEnv]);
  const allowedToolsConfigured = allowedTools.length > 0;
  const missingEnv = [
    authConfigConfigured ? "" : authConfigEnv,
    allowedToolsConfigured ? "" : allowedToolsEnv
  ].filter(Boolean);

  return {
    actionId: connector.id,
    toolkit: connector.toolkit,
    toolkitSlug: connector.toolkitSlug,
    docsUrl: connector.docsUrl,
    configured: apiKeyConfigured && authConfigConfigured && allowedToolsConfigured,
    authConfigEnv,
    allowedToolsEnv,
    authConfigConfigured,
    allowedToolsConfigured,
    allowedTools,
    recommendedTools: connector.recommendedTools,
    missingEnv
  };
}

function buildMissingEnv(apiKeyConfigured: boolean, liveExportsEnabled: boolean, toolkits: McpBridgeToolkitStatus[]) {
  return [
    apiKeyConfigured ? "" : "COMPOSIO_API_KEY",
    liveExportsEnabled ? "" : "COMPOSIO_LIVE_EXPORTS=true",
    ...toolkits.flatMap((toolkit) => toolkit.missingEnv)
  ].filter(Boolean);
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
