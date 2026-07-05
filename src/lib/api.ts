import type { AnalyzeRequest, AnalyzeResult, EvaluationReport, McpBridgeExportRequest, McpBridgeExportResponse, McpBridgeStatus } from "./types";

export async function requestAnalysis(payload: AnalyzeRequest): Promise<AnalyzeResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Ouija could not analyze this experiment.");
  }

  return response.json() as Promise<AnalyzeResult>;
}

export async function requestEvaluation(): Promise<EvaluationReport> {
  const response = await fetch("/api/evaluate");

  if (!response.ok) {
    throw new Error("Ouija could not load the evaluation bench.");
  }

  return response.json() as Promise<EvaluationReport>;
}

export async function requestMcpStatus(): Promise<McpBridgeStatus> {
  const response = await fetch("/api/mcp/status");

  if (!response.ok) {
    throw new Error("Ouija could not load the MCP bridge status.");
  }

  return response.json() as Promise<McpBridgeStatus>;
}

export async function requestMcpExport(payload: McpBridgeExportRequest): Promise<McpBridgeExportResponse> {
  const response = await fetch("/api/mcp/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Ouija could not validate this MCP export packet.");
  }

  return response.json() as Promise<McpBridgeExportResponse>;
}
