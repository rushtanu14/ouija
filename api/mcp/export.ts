import { handleOptions, sendApiResult, sendError, withApiBoundary } from "../../server/httpResponse.js";
import { validateMcpExportRequest } from "../../server/mcpBridge.js";
import type { ApiRequestLike, ApiResponseLike } from "../../server/httpResponse.js";

const allowedMethods = "POST, OPTIONS";

function handler(req: ApiRequestLike & { body?: unknown }, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "POST") {
    sendError(res, 405, "Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet.");
    return;
  }

  const response = validateMcpExportRequest(req.body);
  sendApiResult(res, response.statusCode, response.body);
}

export default withApiBoundary(handler, "POST /api/mcp/export", allowedMethods);
