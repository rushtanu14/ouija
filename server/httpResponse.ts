import { apiAllowedHeaders, isAllowedOrigin, readRequestHeader } from "./httpSecurity";

export interface ApiRequestLike {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
}

export interface ApiResponseLike {
  setHeader(name: string, value: string): void;
  status(code: number): ApiResponseLike;
  json(body: unknown): void;
  end(): void;
}

export const genericApiErrorMessage = "Unexpected API error. Try again shortly.";

export type ApiHandler<TRequest extends ApiRequestLike = ApiRequestLike> = (req: TRequest, res: ApiResponseLike) => void | Promise<void>;

export function applyApiHeaders(req: ApiRequestLike, res: ApiResponseLike, allowedMethods: string) {
  const origin = readRequestHeader(req.headers, "origin");
  if (origin && isAllowedOrigin(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", allowedMethods);
  res.setHeader("Access-Control-Allow-Headers", apiAllowedHeaders);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

export function handleOptions(req: ApiRequestLike, res: ApiResponseLike, allowedMethods: string) {
  applyApiHeaders(req, res, allowedMethods);
  if (req.method !== "OPTIONS") return false;
  res.status(204).end();
  return true;
}

export function sendJson(res: ApiResponseLike, statusCode: number, body: unknown) {
  res.status(statusCode).json(body);
}

export function sendError(res: ApiResponseLike, statusCode: number, error: string) {
  sendJson(res, statusCode, { ok: false, error });
}

export function sendApiResult(res: ApiResponseLike, statusCode: number, body: unknown) {
  if (statusCode >= 400 && isStringErrorBody(body)) {
    sendError(res, statusCode, body.error);
    return;
  }

  sendJson(res, statusCode, body);
}

export function sendUnexpectedApiError(req: ApiRequestLike, res: ApiResponseLike, allowedMethods: string, context: string, error: unknown) {
  logApiError(context, error);
  applyApiHeaders(req, res, allowedMethods);
  sendError(res, 500, genericApiErrorMessage);
}

export function withApiBoundary<TRequest extends ApiRequestLike>(handler: ApiHandler<TRequest>, context: string, allowedMethods: string) {
  return async (req: TRequest, res: ApiResponseLike) => {
    try {
      await handler(req, res);
    } catch (error) {
      sendUnexpectedApiError(req, res, allowedMethods, context, error);
    }
  };
}

function isStringErrorBody(body: unknown): body is { error: string } {
  return typeof body === "object" && body !== null && typeof (body as { error?: unknown }).error === "string";
}

function logApiError(context: string, error: unknown) {
  const diagnosticClass = error instanceof Error ? "Error" : typeof error;
  console.error("ouija api failure", { context, diagnosticClass });
}
