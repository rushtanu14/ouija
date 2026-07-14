# Runbook

## Local Production Smoke

```bash
npm run build
PORT=8799 HOST=127.0.0.1 npm start
curl -sSf http://127.0.0.1:8799/api/health
```

## Deployment Procedure

1. Run verification:

```bash
npm run test
npm run build
npm run test:e2e
npm audit --json
```

2. Refresh judge-facing assets when UI or submission copy changes:

```bash
OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission
OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough
npm run sync:public-submission
```

3. Deploy to Vercel production:

```bash
vercel deploy --prod --yes
```

4. Verify the public app:

```bash
curl -sSf https://ouija-olive.vercel.app/api/health
curl -sSf https://ouija-olive.vercel.app/api/evaluate
```

## Health Checks And Monitoring

<!-- AUTO-GENERATED:HEALTH:START -->
Generated from `server/app.ts`, `api/health.ts`, and `api/evaluate.ts`.

| Check | Expected |
| --- | --- |
| `GET /api/health` | `200` with `{ "ok": true, "service": "ouija-api" }` |
| `GET /api/evaluate` | `200` with `score: 100`, `passed: 9`, and `total: 9` for the current evaluation suite. |
| `GET /api/mcp/status` | `200` with `status: "server_dry_run"` unless live Composio env vars are configured. |
| `POST /api/mcp/session` | `200` dry-run for a consent-gated packet; live mode creates a server-side Composio session and withholds raw MCP URLs. |
| Hosted video | `https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm` returns `200` and a non-trivial `video/webm` asset. |
| Hosted slide deck | `https://ouija-olive.vercel.app/submission/slide-deck.html` returns `200`. |
<!-- AUTO-GENERATED:HEALTH:END -->

## Common Issues

| Issue | Fix |
| --- | --- |
| `/api/analyze` returns fallback grounding | Set `OPENAI_API_KEY` in the server environment if a web-search-enriched demo is required; fallback mode is expected without credentials. |
| MCP Integration Coach shows server dry-run | Expected for the public demo. Enable live exports only after keeping `COMPOSIO_API_KEY` out of the Vite client, configuring `COMPOSIO_SESSION_USER_ID`, `COMPOSIO_LIVE_EXPORTS=true`, `MCP_SESSION_AUTH_TOKEN`, `COMPOSIO_<TOOLKIT>_ALLOWED_TOOLS`, toolkit auth config IDs where required, and preserving the consent step. Composio Search source-audit, Scholar claim-check, Composio Browser source-capture, and DeepWiki public-source proof routes use allowed-tool env vars without private account auth config IDs. Semantic Scholar reference checks, Canvas assignment-context imports, Google Slides deck drafts, and Gmail teacher-review drafts require their own auth config IDs plus allowed-tool allowlists before live use. |
| Browser request has no CORS access | Add the trusted preview origin to `OUIJA_ALLOWED_ORIGIN`; untrusted origins are intentionally not reflected. |
| Empty description returns `400` | Enter a non-empty experiment description before analyzing. |
| Walkthrough recording hangs | Run with `OUIJA_CAPTION_MS=4000`; the script sets a Playwright default timeout to avoid infinite waits. |
| Vercel API works but frontend is stale | Run `npm run build`, refresh submission assets, sync `public/submission`, then redeploy. |
| Public submission assets 404 | Run `npm run sync:public-submission` before deployment and verify files under `public/submission`. |

## Verification gates

- `npm test` runs the deterministic unit and API regression suite.
- `npm run test:coverage` enforces at least 80% statements, functions, and lines plus 75% branch coverage across `src/lib`, `server`, and `api` logic. The current branch baseline is tracked explicitly instead of hiding untested decision paths.
- `npm run test:e2e` runs Chromium, Firefox, WebKit, and mobile Safari projects on dedicated local ports `15188` and `18787` so stale dev servers do not bypass the E2E rate-limit override.
- `npm run build`, `npm audit --json`, and `git diff --check` remain required before release.

Analysis throttling is intentionally mode-aware: deployments with `OPENAI_API_KEY` allow 20 analysis requests per client key per minute to protect paid web-search usage; credential-free deterministic deployments allow 120 per minute so classrooms and browser matrices sharing an address do not trip the cost-oriented budget. Trusted classroom, demo, or E2E environments can set `OUIJA_ANALYZE_RATE_LIMIT` to a positive integer override; do not raise it on public paid-enrichment deployments without a cost reason. `/api/mcp/session` allows 10 session-ticket requests per client key per minute.

## Rollback Procedure

1. Identify the last known good Vercel deployment in the Vercel dashboard or CLI output.
2. Promote or redeploy that deployment.
3. Re-run public health checks for `/api/health`, `/api/evaluate`, slide deck, and video.
4. Save the rollback note in `CONTEXT.md` and the CSB project note.

## Escalation

This is a hackathon project owned by Rushil. Escalate external blockers that require credentials, Devpost submission access, Vercel account actions beyond deploy, or OpenAI API-key setup.
