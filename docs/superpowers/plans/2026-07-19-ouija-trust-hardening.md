# Ouija Trust Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent demo data, private student text, and overbroad connector payloads from being represented or transmitted as student evidence, while making browser persistence and release verification reliable.

**Architecture:** Add explicit provenance to the analysis result and enforce it at every evidence handoff. Centralize privacy/CSV/storage boundaries in small pure modules, make browser MCP calls preview-only with route-specific payloads, and reuse shared HTTP behavior across Express and Vercel adapters. Preserve endpoint paths and the existing monolithic UI structure.

**Tech Stack:** React 19, TypeScript, Vite, Express, Vercel functions, Vitest, Playwright.

## Global Constraints

- Public production analysis remains deterministic fallback-only; external grounding is opt-in and development-only.
- Demo sample rows must never be represented, persisted, exported, or handed to MCP as student evidence.
- Raw pilot free text must remain browser-local and must never appear in CSV, evidence packets, MCP payloads, or external grounding.
- Browser MCP operations are preview-only; live execution stays server-owned and bearer-authorized.
- Source-oriented MCP routes accept only title, query, variables, and source URLs.
- Preserve existing endpoint paths and avoid a broad `App.tsx`, `analysis.ts`, or stylesheet refactor.
- Every behavior change follows RED/GREEN/REFACTOR and receives task review before the next task.

---

### Task 1: Data provenance and evidence gates

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/analysis.ts`
- Modify: `src/lib/evidencePacket.ts`
- Modify: `src/lib/progressPortfolio.ts`
- Modify: `src/App.tsx`
- Test: `tests/analysis.test.ts`
- Test: `tests/evidencePacket.test.ts`
- Test: `tests/progressPortfolio.test.ts`

**Interfaces:**
- `DataOrigin = "demo_sample" | "student_supplied"`.
- `AnalyzeResult.dataOrigin: DataOrigin`.
- Saved snapshots add `dataOrigin: DataOrigin | "legacy_unknown"`; missing persisted values normalize to `legacy_unknown`.
- Omitted/empty request rows produce `demo_sample`; a non-empty caller-supplied row array produces `student_supplied`.

- [ ] Add failing analysis tests proving omitted rows are `demo_sample`, supplied rows are `student_supplied`, and demo output does not describe sample rows as student observations.
- [ ] Add failing Evidence Packet and portfolio tests proving demo/legacy results are visibly marked and excluded from student-evidence readiness.
- [ ] Add the provenance types and deterministic origin calculation in `analyzeExperiment`.
- [ ] Propagate provenance through snapshots and normalize older storage records to `legacy_unknown`.
- [ ] Add a persistent demo banner and disable save, pilot/evidence handoff, and MCP actions unless origin is `student_supplied`.
- [ ] Keep demo Evidence Packet preview available only with `DEMO SAMPLE — not student evidence` labeling.
- [ ] Run the three focused suites, then the full unit suite.

### Task 2: Privacy, pilot exports, and grounding consent

**Files:**
- Create: `src/lib/privacyText.ts`
- Modify: `src/lib/pilotEvidence.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/App.tsx`
- Modify: `server/openaiGrounding.ts`
- Modify: `server/app.ts`
- Modify: `api/analyze.ts`
- Test: `tests/pilotEvidence.test.ts`
- Test: `tests/openaiGrounding.test.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`

**Interfaces:**
- `AnalyzeRequest.allowExternalGrounding?: boolean`, default false.
- `scanPrivateText(value): { safe: boolean; reasons: PrivateTextRisk[] }` covers contact data, addresses, student/class IDs, grades, class periods, access codes, coordinates, and photo/face references.
- Pilot entries retain optional `note` for local editing but export only structured observation metrics; CSV contains no raw or redacted note column.
- `formatCsvCell` prefixes formula-leading values with an apostrophe before normal CSV quoting.

- [ ] Add failing tests for broader private-text detection and spreadsheet-formula neutralization.
- [ ] Add failing tests proving raw pilot notes never appear in CSV and privacy copy does not claim complete PII detection.
- [ ] Add failing API tests proving external grounding is skipped without explicit opt-in and in production.
- [ ] Implement the shared scanner and use it for local pilot-quality review.
- [ ] Remove pilot note content from every export and evidence handoff while retaining aggregate note counts.
- [ ] Gate OpenAI grounding on explicit request opt-in, `OUIJA_EXTERNAL_GROUNDING_ENABLED=true`, and non-production execution; construct prompts from allowlisted structured analysis fields rather than raw evidence/reflections/rows.
- [ ] Update privacy/runtime copy and docs to match the implemented boundary.
- [ ] Run focused privacy/API suites, then the full unit suite.

### Task 3: MCP route minimization and preview/execution split

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/api.ts`
- Modify: `src/lib/mcpIntegrationPlan.ts`
- Modify: `src/App.tsx`
- Modify: `server/mcpBridge.ts`
- Modify: `server/app.ts`
- Modify: `api/mcp/export.ts`
- Modify: `api/mcp/session.ts`
- Test: `tests/mcpIntegrationPlan.test.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`

**Interfaces:**
- Replace the generic payload with a discriminated `McpBridgePayload` keyed by action category.
- Source actions accept `{ title, query, variables, sourceUrls }` only.
- Export actions receive only their explicit allowlist and never pilot notes.
- `McpBridgeSessionRequest` adds `execution: "preview" | "create"`; browser requests always use `preview`.
- Preview returns `status: "ready" | "blocked" | "dry_run"`; live `create` remains bearer-authorized and server-owned.

- [ ] Add failing route-contract tests for accepted and forbidden fields on every connector category.
- [ ] Add a failing browser API test proving preview needs no bearer and never requests a live session.
- [ ] Implement payload normalization as action-specific allowlists; reject overbroad source payloads.
- [ ] Separate session preview from live creation and remove live creation from `App.tsx` validation.
- [ ] Return stable public error codes/messages while logging only sanitized upstream context server-side.
- [ ] Run focused MCP/API suites, then the full unit suite.

### Task 4: Storage, CSV parsing, HTTP parity, and submission proof

**Files:**
- Create: `src/lib/browserStorage.ts`
- Create: `server/httpResponse.ts`
- Modify: `src/App.tsx`
- Modify: `src/lib/dataImport.ts`
- Modify: `server/index.ts`
- Modify: `server/app.ts`
- Modify: `api/*.ts`
- Modify: `docs/API.md`
- Modify: submission/rules copy under `docs/` and `public/`
- Create: `docs/assets/asset-manifest.json`
- Test: `tests/dataImport.test.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`
- Test: `tests/submissionAssets.test.ts`

**Interfaces:**
- Browser storage functions return `{ ok: true, value } | { ok: false, error }`, validate schemas, and never throw quota/security exceptions into React handlers.
- Deleting saved evidence stages one in-memory undo record before permanent replacement.
- CSV parsing supports quoted multiline fields, CRLF, escaped quotes, empty fields, and clear malformed-input errors.
- All API adapters use the same security/cache headers and error-envelope helpers.
- Asset manifest records relative path, bytes, SHA-256, width/height when applicable, and duration for video.

- [ ] Add failing storage, parser, API-parity, and asset-manifest tests.
- [ ] Implement validated storage reads/writes, persistence status UI, and undo for destructive saved-evidence actions.
- [ ] Replace line-first pasted CSV parsing with a quote-aware state machine.
- [ ] Centralize handler headers and error envelopes without changing route paths.
- [ ] Remove volatile participant counts from app/docs/tests; keep the official rules URL, verification date, and stable rules.
- [ ] Fix the API source example by adding required `confidence`.
- [ ] Generate and test the canonical asset manifest against files and documentation.
- [ ] Run focused suites, then the full unit suite and build.

### Task 5: CI, coverage, production E2E, and final review

**Files:**
- Modify: `package.json`
- Modify: `vitest.config.ts`
- Modify: `playwright.config.ts`
- Modify: `tests/e2e/ouija.spec.ts`
- Create: `.github/workflows/ci.yml`
- Add tests for `src/lib/api.ts` and low-coverage server handlers.

**Interfaces:**
- Executable source uses per-file thresholds of 80% statements, functions, and lines and 75% branches; static sample/manifest data may be excluded.
- Production E2E builds and serves `dist` before running critical judge, provenance, storage, and MCP-preview flows.
- CI runs clean install, unit tests, coverage, build, moderate dependency audit, production smoke tests, and the Playwright browser matrix.

- [ ] Add focused API-client tests until request/error paths are covered.
- [ ] Enable per-file thresholds and fill critical handler gaps rather than lowering thresholds.
- [ ] Split the oversized Firefox judge-path E2E into independent flows; do not increase the global timeout.
- [ ] Add production-build E2E scripts/configuration and critical smoke coverage.
- [ ] Add GitHub Actions CI with Playwright browser installation and all required gates.
- [ ] Run `npm test`, coverage, build, audit, full E2E, production E2E, and `git diff --check`.
- [ ] Request whole-branch correctness/security review, fix Critical/Important findings, and re-run the complete gate.
