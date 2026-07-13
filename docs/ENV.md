# Environment Reference

<!-- AUTO-GENERATED:ENV:START -->
Generated from `server/index.ts`, `server/openaiGrounding.ts`, `server/mcpBridge.ts`, `scripts/capture-submission-assets.mjs`, `scripts/record-walkthrough.mjs`, and `playwright.config.ts`.

| Variable | Required | Description | Default / Example |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables optional server-side OpenAI Responses API web-search enrichment. If omitted, Ouija uses built-in trusted references. | `sk-proj-...` |
| `OPENAI_MODEL` | No | Model used by server-side OpenAI enrichment. | `gpt-5.6` |
| `PORT` | No | Port for `npm start` / `npm run serve:api`. | `8787`; local smoke uses `8799` |
| `HOST` | No | Host for the Express server. Defaults to `127.0.0.1` in development and `0.0.0.0` when `NODE_ENV=production`. | `127.0.0.1` |
| `NODE_ENV` | No | Standard Node environment flag; affects default host selection. | `production` |
| `OUIJA_ALLOWED_ORIGIN` | No | Comma-separated extra browser origins allowed by API CORS. The production origin and local Vite origin are allowed by default. Untrusted origins are not reflected. | `https://preview.example.com` |
| `OUIJA_ANALYZE_RATE_LIMIT` | No | Optional positive integer override for `/api/analyze` requests per client key per minute. Use only for trusted classrooms, demos, or E2E harnesses. | `1000` |
| `OUIJA_URL` | No | Base URL used by submission screenshot and walkthrough scripts. | capture: `http://127.0.0.1:5188`; walkthrough: `https://ouija-olive.vercel.app` |
| `OUIJA_CAPTION_MS` | No | Milliseconds each walkthrough caption remains visible during `npm run record:walkthrough`. | `8500` |
| `CI` | No | Used by Playwright config to decide whether to reuse an existing local server. | `true` |
| `COMPOSIO_API_KEY` | No | Enables future live server-side Composio MCP sessions. Not required for public dry-run validation. | Composio project API key |
| `COMPOSIO_LIVE_EXPORTS` | No | Must be `true` before any live Composio export path is considered ready. Omit or set anything else for dry-run only. | `true` |
| `COMPOSIO_SESSION_USER_ID` | No | Server-side Composio user id used when `/api/mcp/session` creates a scoped Composio session. Keep it non-PII for demos. | `ouija-demo-student` |
| `MCP_SESSION_AUTH_TOKEN` | No | Server-only bearer token required before `/api/mcp/session` can create a live Composio session. Dry-runs still work without it. | long random token |
| `COMPOSIO_API_BASE_URL` | No | Optional Composio API base URL override for tests or staging. | `https://backend.composio.dev/api/v3.1` |
| `COMPOSIO_<TOOLKIT>_AUTH_CONFIG_ID` | No | Auth config ID for a specific private-account connector route. Supported suffixes: `GOOGLE_DOCS`, `GOOGLE_SHEETS`, `GOOGLE_DRIVE`, `GOOGLE_CLASSROOM`, `GOOGLE_FORMS`, `GOOGLE_CALENDAR`, `NOTION`. Composio Search, Composio Browser source capture, and DeepWiki public-source proof do not need private account auth config IDs. | `ac_...` |
| `COMPOSIO_<TOOLKIT>_ALLOWED_TOOLS` | No | Comma-separated allowlist of Composio tool names for that connector route. The app displays recommended tools in `/api/mcp/status`; use `COMPOSIO_SEARCH_ALLOWED_TOOLS` for source-audit and Scholar claim-check routes, `COMPOSIO_BROWSER_ALLOWED_TOOLS` for Browser Tool source capture, and `COMPOSIO_DEEPWIKI_ALLOWED_TOOLS` for public source proof. | `COMPOSIO_SEARCH_WEB,COMPOSIO_SEARCH_SCHOLAR,COMPOSIO_SEARCH_FETCH_URL_CONTENT` |

There is no checked-in `.env.example` at the time this reference was generated. Keep credentials out of repo files; set optional secrets in the deployment environment.
<!-- AUTO-GENERATED:ENV:END -->

## Composio MCP Bridge

Ouija's public MCP Integration Coach uses server dry-run validation through `/api/mcp/status`, `/api/mcp/export`, and `/api/mcp/session`. Live sessions remain disabled unless `COMPOSIO_API_KEY`, `COMPOSIO_SESSION_USER_ID`, `COMPOSIO_LIVE_EXPORTS=true`, `MCP_SESSION_AUTH_TOKEN`, connector-specific allowed tools, and toolkit auth config IDs where required are configured server-side. Live session calls must include `Authorization: Bearer $MCP_SESSION_AUTH_TOKEN`. Composio Search source-audit, Scholar claim-check, Composio Browser source-capture, and DeepWiki public-source proof sessions need an allowed-tool allowlist but no private account auth config. Do not expose these values, auth config IDs, API keys, bearer tokens, or raw MCP URLs to the Vite client.
