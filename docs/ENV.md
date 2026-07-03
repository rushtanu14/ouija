# Environment Reference

<!-- AUTO-GENERATED:ENV:START -->
Generated from `server/index.ts`, `server/openaiGrounding.ts`, `scripts/capture-submission-assets.mjs`, `scripts/record-walkthrough.mjs`, and `playwright.config.ts`.

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

There is no checked-in `.env.example` at the time this reference was generated. Keep credentials out of repo files; set optional secrets in the deployment environment.
<!-- AUTO-GENERATED:ENV:END -->
