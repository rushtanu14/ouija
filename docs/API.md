# API Reference

<!-- AUTO-GENERATED:API:START -->
Generated from `server/app.ts` and `api/*.ts`.

| Endpoint | Methods | Purpose | Success Response | Error Response |
| --- | --- | --- | --- | --- |
| `/api/health` | `GET`, `OPTIONS` | Health check for the Ouija API. | `{ "ok": true, "service": "ouija-api" }` | `405` with `Use GET /api/health to check the Ouija API.` |
| `/api/evaluate` | `GET`, `OPTIONS` | Runs the deterministic Ouija evaluation bench: seven supported demos plus the unsupported-boundary case. | `EvaluationReport` with `score`, `passed`, `total`, `status`, `verdict`, and `cases`. | `405` with `Use GET /api/evaluate to run the Ouija evaluation bench.` |
| `/api/analyze` | `POST`, `OPTIONS` | Analyzes a student experiment description and optional rows. Returns classification, citations, expected overlay, checks, Data Handling Ledger, Learning Exit Ticket, Student Reflection Workspace prompts, Evidence Packet inputs, and Track 1 evidence. | `AnalyzeResult` from `src/lib/types.ts`. | `400` when `description` is empty; `405` with `Use POST /api/analyze to analyze a student experiment.` |

`POST /api/analyze` input:

```json
{
  "description": "Projectile motion lab using launch angle and range data.",
  "rows": [
    { "id": "trial-1", "angleDeg": 45, "rangeM": 14.6 }
  ]
}
```

The Vercel serverless API handlers set CORS headers and `Cache-Control: no-store`. The local Express app uses CORS and serves the built frontend when `dist/` exists.
<!-- AUTO-GENERATED:API:END -->
