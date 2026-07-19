import { handleOptions, sendApiResult, sendError } from "../../server/httpResponse.js";
import { validateMcpExportRequest } from "../../server/mcpBridge.js";
import type { ApiRequestLike, ApiResponseLike } from "../../server/httpResponse.js";

const allowedMethods = "POST, OPTIONS";

export default function handler(req: ApiRequestLike & { body?: unknown }, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "POST") {
    sendError(res, 405, "Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet.");
    return;
  }

  const response = validateMcpExportRequest(req.body);
  sendApiResult(res, response.statusCode, response.body);
}
