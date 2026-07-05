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
| Hosted video | `https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm` returns `200` and a non-trivial `video/webm` asset. |
| Hosted slide deck | `https://ouija-olive.vercel.app/submission/slide-deck.html` returns `200`. |
<!-- AUTO-GENERATED:HEALTH:END -->

## Common Issues

| Issue | Fix |
| --- | --- |
| `/api/analyze` returns fallback grounding | Set `OPENAI_API_KEY` in the server environment if a web-search-enriched demo is required; fallback mode is expected without credentials. |
| MCP Integration Coach shows server dry-run | Expected for the public demo. Enable live exports only after keeping `COMPOSIO_API_KEY` out of the Vite client, configuring `COMPOSIO_LIVE_EXPORTS=true`, `COMPOSIO_<TOOLKIT>_AUTH_CONFIG_ID`, `COMPOSIO_<TOOLKIT>_ALLOWED_TOOLS`, and preserving the consent step. |
| Empty description returns `400` | Enter a non-empty experiment description before analyzing. |
| Walkthrough recording hangs | Run with `OUIJA_CAPTION_MS=4000`; the script sets a Playwright default timeout to avoid infinite waits. |
| Vercel API works but frontend is stale | Run `npm run build`, refresh submission assets, sync `public/submission`, then redeploy. |
| Public submission assets 404 | Run `npm run sync:public-submission` before deployment and verify files under `public/submission`. |

## Rollback Procedure

1. Identify the last known good Vercel deployment in the Vercel dashboard or CLI output.
2. Promote or redeploy that deployment.
3. Re-run public health checks for `/api/health`, `/api/evaluate`, slide deck, and video.
4. Save the rollback note in `CONTEXT.md` and the CSB project note.

## Escalation

This is a hackathon project owned by Rushil. Escalate external blockers that require credentials, Devpost submission access, Vercel account actions beyond deploy, or OpenAI API-key setup.
