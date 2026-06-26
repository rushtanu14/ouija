import type { AnalyzeRequest, AnalyzeResult } from "./types";

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
