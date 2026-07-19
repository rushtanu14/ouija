# Ouija Review Hardening Implementation Plan

Status: completed historical implementation plan, retained as an engineering audit artifact for the July 2026 Ouija review-hardening pass.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Close the code-review security and scientific-correctness findings while preserving Ouija's public deterministic demo and existing submission work.

**Architecture:** Keep deterministic analysis public and bounded. Treat OpenAI enrichment and Composio session creation as privileged boundaries: validate every request, rate-limit expensive work, require server authorization before live third-party sessions, and expose only safe errors. Keep the current product architecture intact except for small shared boundary helpers and an honest relabeling of the self-regression suite.

**Tech Stack:** React 19, TypeScript, Express 4, Vercel functions, OpenAI Responses API, Vitest, Supertest, Playwright.

## Global Constraints

- Preserve all existing uncommitted user changes.
- Historical constraint during the original pass: do not commit, push, deploy, or alter external accounts until the requested release step.
- Keep credential-free deterministic analysis and MCP dry-runs functional.
- Use TDD for every behavior change.
- Do not claim independent scientific or learning validation from internal regression tests.

---

### Task 1: Bound and validate public analysis requests

**Files:**
- Create: `server/requestValidation.ts`
- Modify: `server/app.ts`
- Modify: `api/analyze.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`

**Interfaces:**
- Produces: `validateAnalyzeRequest(rawBody): { ok: true; value: AnalyzeRequest } | { ok: false; error: string }`.
- Preserves: valid descriptions and valid table rows continue to return the existing analysis result.

- [x] Add failing tests for descriptions over 2,000 characters, more than 200 rows, malformed row objects, and oversized cells.
- [x] Run `npm test -- tests/api.test.ts tests/vercelApi.test.ts` and confirm the new cases fail with the current permissive behavior.
- [x] Implement shared validation with explicit limits and safe 400 responses in both Express and Vercel paths.
- [x] Run the focused tests and confirm valid analysis remains green.

### Task 2: Protect expensive and third-party boundaries

**Files:**
- Create: `server/rateLimit.ts`
- Modify: `server/app.ts`
- Modify: `server/mcpBridge.ts`
- Modify: `api/analyze.ts`
- Modify: `api/mcp/session.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`

**Interfaces:**
- Produces: `consumeRateLimit(key, policy)` for best-effort process-local throttling.
- Changes: live Composio session creation requires `Authorization: Bearer $MCP_SESSION_AUTH_TOKEN`; unauthenticated dry-run behavior remains available.

- [x] Add failing tests showing repeated analysis requests are throttled and live MCP configuration cannot create a session without the authorization token.
- [x] Implement per-route limits and return `429` with `Retry-After` when exceeded.
- [x] Pass the authorization header through both HTTP adapters and verify it with timing-safe comparison before contacting Composio.
- [x] Restrict CORS to same-origin or `OUIJA_ALLOWED_ORIGIN`, while preserving requests without an `Origin` header.
- [x] Run the focused API tests.

### Task 3: Harden OpenAI enrichment and minor-facing privacy

**Files:**
- Modify: `server/openaiGrounding.ts`
- Modify: `server/app.ts`
- Modify: `api/analyze.ts`
- Modify: `src/lib/runtimeProof.ts`
- Modify: `README.md`
- Test: `tests/api.test.ts`
- Test: `tests/runtimeProof.test.ts`

**Interfaces:**
- Preserves: fallback analysis when no key is configured or enrichment fails.
- Produces: strict JSON-schema enrichment, HTTPS-only unique citations, bounded output, timeout, and generic client errors.

- [x] Add failing tests for unsafe citation schemes, duplicate URLs, malformed structured output, and provider-error disclosure.
- [x] Use Responses API Structured Outputs with `strict: true`, `max_output_tokens`, and an abort timeout.
- [x] Validate parsed fields and citation protocols before merging them.
- [x] Replace raw provider errors with a stable student-safe fallback note.
- [x] Document that descriptions may be sent to OpenAI only when enrichment is configured and must not contain names or personal information.

### Task 4: Correct science behavior and evaluation claims

**Files:**
- Modify: `src/lib/analysis.ts`
- Modify: `src/lib/evaluation.ts`
- Modify: `src/lib/types.ts`
- Modify: `src/lib/templates.ts`
- Modify: `src/App.tsx`
- Modify: submission documentation that calls the suite an evaluation bench
- Test: `tests/analysis.test.ts`
- Test: `tests/api.test.ts`
- Test: `tests/vercelApi.test.ts`

**Interfaces:**
- Changes: dark-grown seedling elongation becomes an etiolation explanation rather than a measurement-failure warning.
- Changes: the nine-case score is labeled a deterministic regression suite, not independent AI/scientific validation.

- [x] Add a failing plant-data regression test in which dark-grown seedlings are taller but receive an etiolation information note rather than a warning.
- [x] Implement the corrected plant interpretation and retain warnings for missing controls or unhealthy-growth claims.
- [x] Rename user-visible regression-suite labels and verdicts without changing the stable API field names.
- [x] Replace the two confirmed 404 LibreTexts URLs with live canonical sources.
- [x] Update affected assertions and submission copy.

### Task 5: Verification breadth and maintainability guardrails

**Files:**
- Modify: `package.json`
- Modify: `playwright.config.ts`
- Modify: `docs/RUNBOOK.md`
- Test: existing test suites

**Interfaces:**
- Produces: explicit `test:coverage` and cross-browser Playwright projects where installed.
- Defers: wholesale splitting of `App.tsx`, `analysis.ts`, and `styles.css` to a separate refactor because combining it with security fixes would increase regression risk.

- [x] Add coverage tooling and enforce 80% statements/functions/lines plus the current 75% branch baseline without excluding core analysis logic.
- [x] Configure Chromium desktop/mobile plus Firefox and WebKit projects.
- [x] Run unit/integration tests, type/build, Chromium E2E, available cross-browser E2E, npm audit, diff check, and focused security regressions.
- [x] Review the final diff to ensure all changes map to the review findings and no user work was overwritten.
