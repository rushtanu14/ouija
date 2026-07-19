import cors from "cors";
import express from "express";
import path from "node:path";
import { analyzeExperiment, mergeEnrichment } from "../src/lib/analysis";
import { runEvaluationSuite } from "../src/lib/evaluation";
import { buildRuntimeProof } from "../src/lib/runtimeProof";
import { createMcpSessionTicket, getMcpBridgeStatus, validateMcpExportRequest } from "./mcpBridge";
import { enrichWithOpenAIWebSearch, externalGroundingFallbackNote, shouldUseExternalGrounding } from "./openaiGrounding";
import { validateAnalyzeRequest } from "./requestValidation";
import { consumeRateLimit, resolveAnalyzeRateLimit } from "./rateLimit";
import { isAllowedOrigin } from "./httpSecurity";
import { applyApiHeaders, handleOptions, sendApiResult, sendError, sendJson, sendUnexpectedApiError } from "./httpResponse";
import type { NextFunction, Request, Response } from "express";

interface AppOptions {
  staticDir?: string;
  enrichExperiment?: typeof enrichWithOpenAIWebSearch;
}

export function createApp(options: AppOptions = {}) {
  const app = express();
  const enrichExperiment = options.enrichExperiment ?? enrichWithOpenAIWebSearch;

  app.use(cors({ origin: allowCorsOrigin, preflightContinue: true }));
  app.use(express.json({ limit: "1mb" }));

  registerApiRoute(app, {
    path: "/api/health",
    method: "GET",
    allowedMethods: "GET, OPTIONS",
    methodError: "Use GET /api/health to check the Ouija API.",
    handler: (_req, res) => {
      sendJson(res, 200, { ok: true, service: "ouija-api" });
    }
  });

  registerApiRoute(app, {
    path: "/api/evaluate",
    method: "GET",
    allowedMethods: "GET, OPTIONS",
    methodError: "Use GET /api/evaluate to run the Ouija deterministic regression suite.",
    handler: (_req, res) => {
      sendJson(res, 200, runEvaluationSuite());
    }
  });

  registerApiRoute(app, {
    path: "/api/runtime-proof",
    method: "GET",
    allowedMethods: "GET, OPTIONS",
    methodError: "Use GET /api/runtime-proof to inspect Ouija runtime proof.",
    handler: (_req, res) => {
      sendJson(
        res,
        200,
        buildRuntimeProof({
          mcpBridgeMode: getMcpBridgeStatus().mode
        })
      );
    }
  });

  registerApiRoute(app, {
    path: "/api/mcp/status",
    method: "GET",
    allowedMethods: "GET, OPTIONS",
    methodError: "Use GET /api/mcp/status to inspect Composio MCP readiness.",
    handler: (_req, res) => {
      sendJson(res, 200, getMcpBridgeStatus());
    }
  });

  registerApiRoute(app, {
    path: "/api/mcp/export",
    method: "POST",
    allowedMethods: "POST, OPTIONS",
    methodError: "Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet.",
    handler: (req, res) => {
      const response = validateMcpExportRequest(req.body);
      sendApiResult(res, response.statusCode, response.body);
    }
  });

  registerApiRoute(app, {
    path: "/api/mcp/session",
    method: "POST",
    allowedMethods: "POST, OPTIONS",
    methodError: "Use POST /api/mcp/session with execution preview or create.",
    handler: async (req, res) => {
      const limit = consumeRateLimit(`mcp-session:${req.ip}`, { limit: 10, windowMs: 60_000 });
      if (!limit.allowed) {
        res.setHeader("Retry-After", String(limit.retryAfterSeconds));
        sendError(res, 429, "Too many MCP session requests. Try again shortly.");
        return;
      }
      const response = await createMcpSessionTicket(req.body, process.env, fetch, req.header("authorization"));
      sendApiResult(res, response.statusCode, response.body);
    }
  });

  registerApiRoute(app, {
    path: "/api/analyze",
    method: "POST",
    allowedMethods: "POST, OPTIONS",
    methodError: "Use POST /api/analyze to analyze a student experiment.",
    handler: async (req, res) => {
      const requestLimit = resolveAnalyzeRateLimit();
      const limit = consumeRateLimit(`analyze:${req.ip}`, { limit: requestLimit, windowMs: 60_000 });
      if (!limit.allowed) {
        res.setHeader("Retry-After", String(limit.retryAfterSeconds));
        sendError(res, 429, "Too many analysis requests. Try again shortly.");
        return;
      }
      const validation = validateAnalyzeRequest(req.body);
      if (!validation.ok) {
        sendError(res, 400, validation.error);
        return;
      }
      const requestBody = validation.value;
      const { description, rows } = requestBody;

      const fallback = analyzeExperiment({
        description,
        rows
      });

      if (shouldUseExternalGrounding(requestBody)) {
        try {
          const enrichment = await enrichExperiment(description, fallback);
          sendJson(res, 200, mergeEnrichment(fallback, enrichment));
          return;
        } catch {
          sendJson(res, 200, {
            ...fallback,
            groundingStatus: {
              mode: "fallback",
              note: "Using built-in science references because web enrichment was unavailable."
            }
          });
          return;
        }
      }

      sendJson(res, 200, {
        ...fallback,
        groundingStatus: {
          mode: "fallback",
          note: externalGroundingFallbackNote(requestBody)
        }
      });
    }
  });

  if (options.staticDir) {
    app.use(express.static(options.staticDir));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/")) {
        return next();
      }

      return res.sendFile(path.join(options.staticDir as string, "index.html"));
    });
  }

  app.use("/api", apiErrorMiddleware);

  app.use("/api", (req, res) => {
    applyApiHeaders(req, res, "GET, POST, OPTIONS");
    sendError(res, 404, "API route not found.");
  });

  return app;
}

function allowCorsOrigin(origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
  return callback(null, isAllowedOrigin(origin));
}

export function apiErrorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction) {
  sendUnexpectedApiError(req, res, "GET, POST, OPTIONS", `${req.method} ${req.originalUrl}`, error);
}

type ApiMethod = "GET" | "POST";
type ApiRouteHandler = (req: Request, res: Response) => void | Promise<void>;

interface ApiRouteRegistration {
  path: string;
  method: ApiMethod;
  allowedMethods: string;
  methodError: string;
  handler: ApiRouteHandler;
}

function registerApiRoute(app: express.Express, route: ApiRouteRegistration) {
  app.options(route.path, (req, res) => {
    handleOptions(req, res, route.allowedMethods);
  });

  const register = route.method === "GET" ? app.get.bind(app) : app.post.bind(app);
  register(route.path, async (req: Request, res: Response, next: NextFunction) => {
    applyApiHeaders(req, res, route.allowedMethods);
    try {
      await route.handler(req, res);
    } catch (error) {
      next(error);
    }
  });

  app.all(route.path, (req, res) => {
    applyApiHeaders(req, res, route.allowedMethods);
    sendError(res, 405, route.methodError);
  });
}
