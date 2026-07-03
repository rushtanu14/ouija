# Contributing

## Development Setup

1. Install Node.js 22+.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.
4. Open the Vite frontend at `http://127.0.0.1:5188`; the API runs at `http://127.0.0.1:8787`.

## Available Scripts

<!-- AUTO-GENERATED:SCRIPTS:START -->
Generated from `package.json`.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API and Vite frontend together for local development. |
| `npm run dev:client` | Start only the Vite frontend on `127.0.0.1`. |
| `npm run dev:server` | Start the Express API in watch mode with `tsx`. |
| `npm run serve:api` | Start the Express API once with `tsx`. |
| `npm start` | Start the Express server; serves `dist/` too when a production build exists. |
| `npm run capture:submission` | Capture desktop, mobile, warning-state, and custom-triage submission screenshots. |
| `npm run record:walkthrough` | Record the captioned AIYES walkthrough video. |
| `npm run sync:public-submission` | Copy slide deck, walkthrough, and screenshots into `public/submission`. |
| `npm run build` | Type-check with `tsc --noEmit` and build the Vite frontend. |
| `npm run test` | Run the Vitest unit/API/documentation suite. |
| `npm run test:e2e` | Run Playwright end-to-end browser tests. |
<!-- AUTO-GENERATED:SCRIPTS:END -->

## Testing Procedures

Run the core gates before a submission or deployment:

```bash
npm run test
npm run build
npm run test:e2e
npm audit --json
```

When adding a new behavior, add or update a Vitest or Playwright test first, then implement the smallest code change that makes it pass.

## Code Style

- TypeScript is checked by `npm run build`.
- The project does not currently define a separate lint or format script.
- Keep student-facing copy aligned with the academic-integrity boundary: hints and scaffolds are allowed; full lab reports or final conclusions are not.
- Keep server-side secrets out of frontend code and documentation.

## Pull Request Checklist

- Tests updated for new behavior.
- `npm run test`, `npm run build`, and `npm run test:e2e` pass.
- `npm audit --json` reviewed.
- Submission assets refreshed when judge-facing UI changes.
- Docs updated when scripts, routes, env vars, or deployment steps change.
