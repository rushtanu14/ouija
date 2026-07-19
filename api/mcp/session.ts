import { handleOptions, sendApiResult, sendError } from "../../server/httpResponse.js";
import { readRequestHeader, requestClientKey } from "../../server/httpSecurity.js";
import { createMcpSessionTicket } from "../../server/mcpBridge.js";
import { consumeRateLimit } from "../../server/rateLimit.js";
import type { ApiRequestLike, ApiResponseLike } from "../../server/httpResponse.js";

const allowedMethods = "POST, OPTIONS";

export default async function handler(req: ApiRequestLike & { body?: unknown }, res: ApiResponseLike) {
  if (handleOptions(req, res, allowedMethods)) return;

  if (req.method !== "POST") {
    sendError(res, 405, "Use POST /api/mcp/session with execution preview or create.");
    return;
  }

  const limit = consumeRateLimit(`mcp-session:${requestClientKey(req.headers)}`, { limit: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    res.setHeader("Retry-After", String(limit.retryAfterSeconds));
    sendError(res, 429, "Too many MCP session requests. Try again shortly.");
    return;
  }

  const authorization = readRequestHeader(req.headers, "authorization");
  const response = await createMcpSessionTicket(req.body, process.env, fetch, authorization);
  sendApiResult(res, response.statusCode, response.body);
}
