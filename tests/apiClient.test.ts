import { afterEach, describe, expect, it, vi } from "vitest";
import {
  requestAnalysis,
  requestEvaluation,
  requestMcpExport,
  requestMcpSession,
  requestMcpStatus,
  requestRuntimeProof
} from "../src/lib/api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("browser API client", () => {
  it("posts analysis, export, and session payloads as JSON", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ templateId: "projectile-motion" }))
      .mockResolvedValueOnce(jsonResponse({ status: "dry_run" }))
      .mockResolvedValueOnce(jsonResponse({ status: "ready" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestAnalysis({ description: "Projectile motion lab" })).resolves.toMatchObject({ templateId: "projectile-motion" });
    await expect(requestMcpExport({ actionId: "google-forms-readiness-check", consent: true, payload: readinessPayload() })).resolves.toMatchObject({
      status: "dry_run"
    });
    await expect(requestMcpSession({ actionId: "google-forms-readiness-check", consent: true, execution: "preview", payload: readinessPayload() })).resolves.toMatchObject({
      status: "ready"
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/analyze", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "Projectile motion lab" })
    }));
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/mcp/export", expect.objectContaining({ method: "POST" }));
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/mcp/session", expect.objectContaining({ method: "POST" }));
  });

  it("loads read-only API resources", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(jsonResponse({ score: 100 }))
      .mockResolvedValueOnce(jsonResponse({ status: "fallback_ready" }))
      .mockResolvedValueOnce(jsonResponse({ mode: "server_dry_run" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(requestEvaluation()).resolves.toEqual({ score: 100 });
    await expect(requestRuntimeProof()).resolves.toEqual({ status: "fallback_ready" });
    await expect(requestMcpStatus()).resolves.toEqual({ mode: "server_dry_run" });

    expect(fetchMock).toHaveBeenNthCalledWith(1, "/api/evaluate");
    expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/runtime-proof");
    expect(fetchMock).toHaveBeenNthCalledWith(3, "/api/mcp/status");
  });

  it("uses server JSON errors when write requests fail", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(jsonResponse({ error: "Describe the experiment first." }, false))
      .mockResolvedValueOnce(jsonResponse({ error: "MCP payload fields are not allowed." }, false))
      .mockResolvedValueOnce(jsonResponse({ error: "Live session creation is disabled." }, false)));

    await expect(requestAnalysis({ description: "" })).rejects.toThrow("Describe the experiment first.");
    await expect(requestMcpExport({ actionId: "google-forms-readiness-check", consent: false, payload: readinessPayload() })).rejects.toThrow("MCP payload fields are not allowed.");
    await expect(requestMcpSession({ actionId: "google-forms-readiness-check", consent: true, execution: "create", payload: readinessPayload() })).rejects.toThrow("Live session creation is disabled.");
  });

  it("falls back to client-safe messages when error bodies are not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(nonJsonError())
      .mockResolvedValueOnce(nonJsonError())
      .mockResolvedValueOnce(nonJsonError())
      .mockResolvedValueOnce(nonJsonError())
      .mockResolvedValueOnce(nonJsonError())
      .mockResolvedValueOnce(nonJsonError()));

    await expect(requestAnalysis({ description: "Projectile" })).rejects.toThrow("Ouija could not analyze this experiment.");
    await expect(requestEvaluation()).rejects.toThrow("Ouija could not load the deterministic regression suite.");
    await expect(requestRuntimeProof()).rejects.toThrow("Ouija could not load the AI runtime proof.");
    await expect(requestMcpStatus()).rejects.toThrow("Ouija could not load the MCP bridge status.");
    await expect(requestMcpExport({ actionId: "google-forms-readiness-check", consent: true, payload: readinessPayload() })).rejects.toThrow("Ouija could not validate this MCP export packet.");
    await expect(requestMcpSession({ actionId: "google-forms-readiness-check", consent: true, execution: "preview", payload: readinessPayload() })).rejects.toThrow("Ouija could not prepare this MCP session ticket.");
  });
});

function readinessPayload() {
  return {
    category: "readiness_form" as const,
    title: "Ready",
    prompts: ["What changed?"],
    setupChecks: ["Variables named"]
  };
}

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: vi.fn().mockResolvedValue(body)
  };
}

function nonJsonError() {
  return {
    ok: false,
    json: vi.fn().mockRejectedValue(new Error("not json"))
  };
}
