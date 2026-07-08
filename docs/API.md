# API Reference

<!-- AUTO-GENERATED:API:START -->
Generated from `server/app.ts` and `api/*.ts`.

| Endpoint | Methods | Purpose | Success Response | Error Response |
| --- | --- | --- | --- | --- |
| `/api/health` | `GET`, `OPTIONS` | Health check for the Ouija API. | `{ "ok": true, "service": "ouija-api" }` | `405` with `Use GET /api/health to check the Ouija API.` |
| `/api/evaluate` | `GET`, `OPTIONS` | Runs the deterministic Ouija evaluation bench: eight supported demos plus the unsupported-boundary case. | `EvaluationReport` with `score`, `passed`, `total`, `status`, `verdict`, and `cases`. | `405` with `Use GET /api/evaluate to run the Ouija evaluation bench.` |
| `/api/runtime-proof` | `GET`, `OPTIONS` | Reports the active AI runtime path, fallback/web-search readiness, evaluation coverage, server-only key boundary, and MCP bridge mode without exposing secret values. | `RuntimeProof` from `src/lib/types.ts`. | `405` with `Use GET /api/runtime-proof to inspect Ouija runtime proof.` |
| `/api/analyze` | `POST`, `OPTIONS` | Analyzes a student experiment description and optional rows. Returns classification, citations, pre-lab design checks, expected overlay, checks, Data Handling Ledger, Learning Exit Ticket inputs, Student Level Lens variables, Concept Mastery Check inputs, Student Reflection Workspace prompts, Evidence Packet inputs, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, and Track 1 evidence. | `AnalyzeResult` from `src/lib/types.ts`. | `400` when `description` is empty; `405` with `Use POST /api/analyze to analyze a student experiment.` |
| `/api/mcp/status` | `GET`, `OPTIONS` | Reports the Composio MCP bridge mode, missing server env vars, connector readiness, docs links, and allowed-tool plan without exposing secret values. | `McpBridgeStatus` from `src/lib/types.ts`. | `405` with `Use GET /api/mcp/status to inspect Composio MCP readiness.` |
| `/api/mcp/export` | `POST`, `OPTIONS` | Validates a consent-gated Composio packet for Composio Search source audit, Composio Scholar claim check, Google Docs, Sheets, Drive, Classroom, Forms, Calendar, or Notion. The public mode is server dry-run and stops before external writes. | `McpBridgeExportResponse` from `src/lib/types.ts`. | `400` for missing action, missing payload, or missing consent; `405` with `Use POST /api/mcp/export to dry-run a consent-gated Composio MCP packet.` |
| `/api/mcp/session` | `POST`, `OPTIONS` | Prepares a scoped Composio Tool Router session ticket for the selected connector route. Public mode returns a dry-run plan; live mode creates the session server-side and withholds raw MCP URLs from browser responses. | `McpBridgeSessionResponse` from `src/lib/types.ts`. | `400` for missing action, missing payload, or missing consent; `502` if Composio rejects live session creation; `405` with `Use POST /api/mcp/session to prepare a scoped Composio MCP session.` |

`POST /api/analyze` input:

```json
{
  "description": "Projectile motion lab using launch angle and range data.",
  "rows": [
    { "id": "trial-1", "angleDeg": 45, "rangeM": 14.6 }
  ]
}
```

`POST /api/mcp/export` input:

```json
{
  "actionId": "google-calendar-next-trial-reminder",
  "consent": true,
  "payload": {
    "title": "Ouija Evidence Packet: Projectile Motion",
    "description": "Projectile motion lab using launch angle and range data.",
    "evidencePacket": "Claim starter: ___",
    "rows": [
      { "id": "trial-1", "angleDeg": 45, "rangeM": 14.6 }
    ],
    "sources": [
      {
        "id": "source-1",
        "publisher": "Physics Classroom",
        "title": "Projectile Motion",
        "url": "https://www.physicsclassroom.com/",
        "note": "Projectile range pattern."
      }
    ]
  }
}
```

`POST /api/mcp/session` uses the same consent-gated input as `/api/mcp/export`. Without complete Composio env gates it returns `status: "dry_run"` and the scoped toolkit/tool plan. With `COMPOSIO_API_KEY`, `COMPOSIO_SESSION_USER_ID`, `COMPOSIO_LIVE_EXPORTS=true`, connector allowed tools, and toolkit auth config where required, it calls Composio's Tool Router session endpoint from the server and returns `status: "created"` without exposing the raw MCP URL. The `composio-search-source-audit` and `composio-scholar-claim-check` routes require `COMPOSIO_SEARCH_ALLOWED_TOOLS` but no account auth config.

`GET /api/runtime-proof` is intended for judges and deployment smoke checks. It returns booleans and counts only: no `OPENAI_API_KEY`, no `COMPOSIO_API_KEY`, and no connector auth values.

The Vercel serverless API handlers set CORS headers and `Cache-Control: no-store`. The local Express app uses CORS and serves the built frontend when `dist/` exists.
<!-- AUTO-GENERATED:API:END -->
