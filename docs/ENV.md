# Environment Reference

<!-- AUTO-GENERATED:ENV:START -->
Generated from `server/index.ts`, `server/openaiGrounding.ts`, `server/mcpBridge.ts`, `scripts/capture-submission-assets.mjs`, `scripts/record-walkthrough.mjs`, and `playwright.config.ts`.

| Variable | Required | Description | Default / Example |
| --- | --- | --- | --- |
| `OPENAI_API_KEY` | No | Enables optional server-side OpenAI Responses API web-search enrichment. If omitted, Ouija uses built-in trusted references. | `sk-proj-...` |
| `OPENAI_MODEL` | No | Model used by server-side OpenAI enrichment. | `gpt-5.5` |
| `PORT` | No | Port for `npm start` / `npm run serve:api`. | `8787`; local smoke uses `8799` |
| `HOST` | No | Host for the Express server. Defaults to `127.0.0.1` in development and `0.0.0.0` when `NODE_ENV=production`. | `127.0.0.1` |
| `NODE_ENV` | No | Standard Node environment flag; affects default host selection. | `production` |
| `OUIJA_URL` | No | Base URL used by submission screenshot and walkthrough scripts. | capture: `http://127.0.0.1:5188`; walkthrough: `https://ouija-olive.vercel.app` |
| `OUIJA_CAPTION_MS` | No | Milliseconds each walkthrough caption remains visible during `npm run record:walkthrough`. | `8500` |
| `CI` | No | Used by Playwright config to decide whether to reuse an existing local server. | `true` |
| `COMPOSIO_API_KEY` | No | Enables future live server-side Composio MCP sessions. Not required for public dry-run validation. | Composio project API key |
| `COMPOSIO_LIVE_EXPORTS` | No | Must be `true` before any live Composio export path is considered ready. Omit or set anything else for dry-run only. | `true` |
| `COMPOSIO_<TOOLKIT>_AUTH_CONFIG_ID` | No | Auth config ID for a specific connector route. Supported suffixes: `GOOGLE_DOCS`, `GOOGLE_SHEETS`, `GOOGLE_DRIVE`, `GOOGLE_CLASSROOM`, `GOOGLE_FORMS`, `GOOGLE_CALENDAR`, `NOTION`. | `ac_...` |
| `COMPOSIO_<TOOLKIT>_ALLOWED_TOOLS` | No | Comma-separated allowlist of Composio tool names for that connector route. The app displays recommended tools in `/api/mcp/status`. | `GOOGLECALENDAR_CREATE_EVENT,GOOGLECALENDAR_QUICK_ADD` |

There is no checked-in `.env.example` at the time this reference was generated. Keep credentials out of repo files; set optional secrets in the deployment environment.
<!-- AUTO-GENERATED:ENV:END -->

## Composio MCP Bridge

Ouija's public MCP Integration Coach uses server dry-run validation through `/api/mcp/status` and `/api/mcp/export`. Live exports remain disabled unless `COMPOSIO_API_KEY`, `COMPOSIO_LIVE_EXPORTS=true`, connector-specific auth config IDs, and connector-specific allowed tools are configured server-side. Do not expose these values to the Vite client.
