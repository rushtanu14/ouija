# Ouija Context

## Glossary

### Ouija

The project name. The app should be called `Ouija` everywhere in UI, docs, code naming, and submission materials unless Rushil explicitly changes it.

### Student

The only primary user for the MVP. Ouija is built for students working through science labs, not for teachers, coaches, administrators, or parents.

### Lab Partner

The current product direction: a student-facing AI science lab assistant that helps students understand lab instructions, check data quality, graph results, catch reasoning/unit mistakes, and receive Socratic hints without writing the lab report for them.

### Experiment Interpreter

The broader product direction. Ouija should accept a student's experiment description, use AI to identify the experiment type and relevant scientific concepts, search the internet for grounded reference material, then show expected results and an explanation of how the experiment works.

### Middle/High School Science Experiments

The V1 coverage claim. Ouija should target middle-school and high-school science experiments, not college labs, professional research protocols, or unrestricted "all experiments" coverage.

### Balanced Science Set

The first supported experiment set. Ouija should prove breadth with one reliable school-lab demo from each core science area: projectile motion for physics, reaction rate versus temperature or concentration for chemistry, enzyme activity versus temperature or pH for biology, and water filtration/turbidity or soil erosion for earth science.

### Projectile Motion Lab

The first demo case, not the full product scope. Ouija can use projectile motion as a reliable proof case while still being designed for many kinds of student experiments.

### Table Input

The first MVP data input mode. Students can edit experiment rows directly or paste copied spreadsheet/CSV-style data into the active table before Ouija supports notebook photos or OCR.

### Claim Coach

The judge-visible student reasoning layer. Ouija turns classification, expected patterns, citations, and data-quality checks into a claim starter with blanks, an evidence checklist, source trail, and a Socratic next question. It must not fill in the final conclusion for the student.

### Method Audit

The technical-depth layer for experiment quality. Ouija evaluates independent/dependent variables, controlled variables, assumptions, likely confounds, safety/interpretation limits, and a reproducibility score. It should recompute when table data changes.

### AIYES Values Fit

The mission-alignment layer for AIYES. Ouija maps each run to democracy, diversity, connectivity, innovation, and ethics/inclusion using concrete evidence from the analysis result, not generic submission copy. It should recompute when grounding, classification confidence, or table-derived evidence changes.

### AIYES Development Journey

The Track 1 submission-story layer. Ouija maps each run to problem identification, data handling, model selection/integration, application development, testing/evaluation, UX/design, ethics/impact, constraints, and hosted submission proof so judges can inspect the required development journey inside the app, not only in the slide deck or video.

### Student/Judge Views

The UX split that keeps Ouija practical for students while preserving judge proof. The default app opens in Student mode with Student Focus, core lab workflow, graph/table comparison, and student-owned evidence. `?judge=1` opens Judge mode with the full proof stack, including model strategy, runtime proof, evaluation/data/rubric/development journey panels, MCP Integration Coach, and Judge Brief.

### Composio Browser Source Capture

The newest MCP route in the server dry-run bridge. It adds `composio-browser-source-capture` for public source-page context capture through Composio Browser Tool (`BROWSER_TOOL_CREATE_TASK`, `BROWSER_TOOL_WATCH_TASK`). It is source-context support only; it must not browse private accounts, write the student's final claim, or run live without server-side credentials, allowed tools, and explicit consent.

## Product Boundaries

- Ouija should not become a teacher grading dashboard.
- Ouija should not write complete lab reports for students.
- Ouija should focus on learning, data checking, graphing, safety awareness, and reasoning support.
- Ouija should support broad student science experiments, but V1 should still use a small set of reliable demo experiments instead of claiming perfect coverage.
- Ouija's V1 coverage should be middle/high school science experiments.
- Ouija's first supported set should balance physics, chemistry, biology, and earth science instead of overfitting to physics.
- Ouija should support table input first before adding CSV upload or photo/OCR input.
- Ouija's internet search should ground expected results and explanations in referenced content instead of inventing them from the model alone.

## Student Pilot Study Kit Checkpoint - 2026-07-09

- Added `studentPilotStudyKit` to `AnalyzeResult` with ready/review status, consent boundary, pre/post prompts, three pilot tasks, four UX/impact metrics, observer checklist, evidence-to-collect list, and judge takeaway.
- Added a Student Pilot Study Kit panel after Learning Impact Loop in both Student and Judge flows, plus Pilot top-nav links, AI Model Card safeguard copy, and Judge Brief proof copy.
- Threaded the pilot kit through fallback analysis, web-enrichment merge, row-edit recomputation, Official Rubric Fit, AIYES Values Fit, Development Journey, Track Evidence, Evaluation Bench evidence, Evidence Packet, and MCP Integration Coach payload previews. Google Forms readiness preview now includes pilot-study metrics.
- Updated docs and submission materials to describe the feature as a pilot-ready protocol, not completed user testing.
- Refreshed public submission assets. Walkthrough is 1440x900, 147.76s, 15,333,631 bytes, SHA-256 `f130cebc72c4ac784a7d78ad0b8082d4175892c173ab5e9edcb803c5d34640f3`; public slide deck size is 19,380 bytes.
- Redeployed production: `https://ouija-olive.vercel.app`, deployment `dpl_D6wK3nuMkazB8sJeMZvnAYtuUDCv`.
- Fresh verification passed: `npm run test` (12 files, 68 tests), `npm run build`, `npm run test:e2e` (9 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, public `/api/evaluate`, public `/api/runtime-proof`, public `/api/mcp/status`, public `/api/analyze`, hosted deck/video HEAD checks, and hosted desktop/mobile Playwright smoke for Student Pilot Study Kit/no overflow/no console errors.
- Remaining external loops: update CSB, commit, push, actual Devpost submission, 2-5 member team roster, optional live Composio credentials only after server-side allowed tools/auth config/consent setup, and optional OpenAI web-search demo only with explicit API-key approval.

## Student/Judge + Composio Browser MCP Checkpoint - 2026-07-08

- Added default Student mode with Student Focus: next move, evidence check, repeat check, and before-claim guidance near the top while judge-only proof panels stay hidden.
- Added Judge mode plus `?judge=1` so evaluators can open the full proof stack without making the student default view feel bloated.
- Added a bounded Composio Browser source-capture MCP route to the existing server dry-run bridge. `/api/mcp/status` now reports 10 routes including `composio-browser-source-capture`, `browser_tool`, `BROWSER_TOOL_CREATE_TASK`, `BROWSER_TOOL_WATCH_TASK`, and `COMPOSIO_BROWSER_ALLOWED_TOOLS`.
- Refreshed submission assets: `docs/assets/ouija-walkthrough.webm` is 1440x900, 280.16s, 26,688,733 bytes, SHA-256 `28b118f6f2c60e2ca80152a4dfc0c7bb6a68db204fd9dac6f2f283239239bc34`; synced to `public/submission/assets/ouija-walkthrough.webm`.
- Redeployed production: `https://ouija-olive.vercel.app`, deployment `dpl_B2nJ7CMszMUskwQHXzW4wigJU6P6`; judge view is `https://ouija-olive.vercel.app/?judge=1`.
- Public proof: `/api/evaluate` returned `100/100` and `9/9`; `/api/mcp/status` returned server dry-run with 10 routes; hosted deck content length `18766`; hosted walkthrough content length `26688733`; hosted browser smoke confirmed Student mode hides judge proof, Judge mode shows Browser source capture, and desktop/mobile had no horizontal overflow.
- Fresh verification passed: `npm run test` (68 passed), `npm run build`, `npm run test:e2e` (9 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, and `npm run sync:public-submission`.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement, optional live Composio credentials only after server-side allowed tools/auth config/consent setup, and optional real OpenAI web-search demo only with explicit API-key approval.

## Build Checkpoint - 2026-06-25

- Scaffolded Ouija as a React + Vite + TypeScript frontend with an Express API.
- App runs on `http://127.0.0.1:5188`; API runs on `http://127.0.0.1:8787`.
- Implemented deterministic fallback analysis for projectile motion, reaction rate vs temperature, enzyme activity vs temperature, and water filtration/turbidity.
- Implemented optional server-side OpenAI Responses API web-search enrichment when `OPENAI_API_KEY` is present.
- Visual direction follows the approved concept at `/Users/rushil/.codex/generated_images/019ef05b-cfd7-7630-8873-77bcc5bfc930/ig_09071c8be4eea0bd016a3dc0aacc048194b0603a5067ff96bd.png`.
- Verification passed: `npm run test`, `npm run build`, `npm run test:e2e`, and `npm audit --json`.

## Submission Readiness Checkpoint - 2026-06-26

- Added Claim Coach as a typed API/UI output: status, signal, claim starter with blanks, evidence checklist, source trail, next question, and integrity boundary.
- Added live row-edit recomputation so table changes update comparison issues and Claim Coach status.
- Added Method Audit as a typed API/UI output: reproducibility score, variables, controlled variables, assumptions, confounds, and safety/interpretation limits.
- Added Reasoning Trail and Track 1 evidence as typed API/UI output: pipeline steps, rubric criteria, readiness score, and verdict.
- Added Saved Labs and Settings sections so the top navigation is real; Saved Labs stores up to six browser-local checked-run snapshots.
- Added production start support: `npm run build` plus `npm start` serves the built frontend and API from one Express server.
- Added AIYES submission assets under `docs/`: `aiyes-submission-brief.md`, `aiyes-slide-deck.html`, `devpost-submission-copy.md`, `five-minute-demo-script.md`, `judging-checklist.md`, and `submission-assets.md`.
- Added `npm run capture:submission` to generate Devpost/slide screenshots in `docs/assets/`.
- Fresh verification passed: `npm run test`, `npm run build`, `npm run test:e2e`, browser visual QA on desktop/mobile, `npm audit --json`, and production smoke on `PORT=8799 HOST=127.0.0.1 npm start`.
- Remaining loops before submission: upload/finalize the walkthrough video URL and optionally configure a real OpenAI API key for a web-search-enriched demo.

## External Deployment Checkpoint - 2026-06-26

- Deployed Ouija to Vercel production at `https://ouija-olive.vercel.app`.
- Added `vercel.json` plus serverless API adapters in `api/` for `/api/health` and `/api/analyze`.
- Fixed Vercel Node ESM import resolution by using `.js` local import specifiers for serverless-runtime paths.
- Public checks passed against `https://ouija-olive.vercel.app`: `/api/health`, `/api/analyze`, desktop browser flow, mobile browser flow, source links, graph rendering, no console errors, and no horizontal overflow.
- Fresh local verification after deployment changes passed: `npm run test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, and `git diff --check`.

## First-Place Tailoring Checkpoint - 2026-06-26

- Council verdict: Ouija already works and is submittable, but the first-place gap was making the AI technical design/model strategy obvious enough for Track 1 judging.
- Added Reasoning Trail to the live product so each analysis shows classification, variable mapping, source grounding, data audit, Claim Coach, Track 1 evidence score, and rubric criteria.
- Reasoning Trail maps to AIYES judging criteria verified from the Devpost page: problem/impact, AI technical design/model strategy, UX/design, testing/evaluation, and ethics/constraints.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_95dpvo7ro6DMj4FMJAKt4ZSgmpSe`.
- Live `/api/analyze` now returns `trackEvidence.readiness: "competitive"`, `score: 91`, pipeline ids `classify`, `variables`, `ground`, `audit`, `coach`, and all criteria checked for the projectile-motion demo.
- Fresh verification passed: `npm run test`, `npm run build`, `npm run test:e2e`, public `/api/health`, public `/api/analyze`, desktop/mobile public browser QA, no console errors, no horizontal overflow, and `git diff --check`.

## Walkthrough Artifact Checkpoint - 2026-06-26

- Added `npm run record:walkthrough`, which records the live deployment with Playwright and on-screen captions.
- Generated `docs/assets/ouija-walkthrough.webm` from `https://ouija-olive.vercel.app`.
- Video proof: 22.84 seconds, 2.3 MB, 1440x900; frame check confirmed the live app, caption overlay, and Reasoning Trail are visible.
- Fresh verification after the recording tooling passed: `npm run test`, `npm run build`, `npm run test:e2e`, `npm audit --json`, generated walkthrough recording, `ffprobe`, frame extraction, and `git diff --check`.
- Remaining submission loop: optionally record a human voiceover or upload the captioned WebM, add the final video URL to Devpost copy, and handle Devpost's team requirement if it applies.

## Student Workflow Polish Checkpoint - 2026-06-26

- Fixed the top-nav polish gap: `Saved Labs` and `Settings` are now real sections instead of inactive links.
- Added browser-local Saved Labs snapshots for up to six checked runs. Each snapshot preserves title, subject, description, rows, readiness score, and flag count without requiring an account system.
- Added a Settings status panel for grounding mode, integrity lock, local snapshots, and subject coverage.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_DTydzLDFfJTHNLXmr1JUMLVZSJen`.
- Updated `npm run record:walkthrough` so the generated video includes the saved-lab workflow. Regenerated `docs/assets/ouija-walkthrough.webm`; updated proof is 28.04 seconds, 2.9 MB, 1440x900, with frame extraction showing Saved Labs and Settings.
- Refreshed submission screenshots from the live deployment with `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`.
- Fresh verification passed: `npm run test`, `npm run build`, `npm run test:e2e`, public `/api/health`, public browser QA for Saved Labs and Settings on desktop/mobile, public `/api/analyze`, `npm audit --json`, `npm run record:walkthrough`, `ffprobe`, frame extraction, `npm run capture:submission`, and `git diff --check`.

## Final External Deployment Checkpoint - 2026-06-26

- Redeployed the current finished tree to Vercel production at `https://ouija-olive.vercel.app`.
- Latest verified deployment ID is `dpl_AJZcyMTZVu9GqAbDaLyTTuwSVRND`.
- Fresh production verification passed after the final deploy: `npm run build`, remote Vercel build, `npm run test` (`18 passed`), `npm run test:e2e` (`2 passed`), `npm audit --json` (`0 vulnerabilities`), public `/api/health`, public `/api/analyze`, and desktop/mobile public browser QA with Judge Brief present, no console errors, and no horizontal overflow.
- Current captioned walkthrough artifact is `docs/assets/ouija-walkthrough.webm`: 25.40 seconds, about 2.4 MB, 1440x900, with a 20-second frame check showing Judge Brief, Saved Labs, and Settings.
- Remaining external submission loops: upload or finalize the video URL, satisfy Devpost's 2-5 member team requirement if enforced, and optionally configure a real `OPENAI_API_KEY` for one web-search-enriched demo.

## Coverage Boundary Retry - 2026-06-26

- Council verdict on retry: Ouija works and remains submittable, but first-place fit improved by fixing an honesty gap around unsupported experiment descriptions.
- Added low-confidence coverage handling: unsupported descriptions now render as `Closest supported match`, include a `Low-confidence description` note, add a `classification-low-confidence` warning, and downgrade Track 1 readiness to `needs_work` instead of pretending full coverage.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_7N94Qjjw3XTPGWmvhWojd4UBoUcL`.
- Production proof: projectile-motion analysis still returns `supported_template`, `competitive`, score `91`, and two sources; unsupported density-layering analysis returns `closest_supported`, `needs_work`, score `75`, `classification-low-confidence`, and classify step `review`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment. Current proof is 27.28 seconds, about 2.9 MB, 1440x900; frame checks show the honest coverage boundary at 20 seconds and Judge Brief/Saved Labs/Settings at 23 seconds.
- Refreshed live submission screenshots with `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`.
- Fresh verification passed: `npm run test` (`19 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, public `/api/health`, public `/api/analyze`, and desktop/mobile public browser QA with no console errors or horizontal overflow.

## Evaluation Bench Checkpoint - 2026-06-26

- Council verdict: Ouija works and remains submittable; first-place fit improved by making testing/evaluation visible inside the live app instead of only in terminal output.
- Added shared Evaluation Bench logic in `src/lib/evaluation.ts`, local `/api/evaluate`, and Vercel `api/evaluate.ts`.
- Evaluation Bench runs five deterministic live cases: physics projectile motion, chemistry reaction rate, biology enzyme activity, earth science water filtration, and unsupported density-layering boundary behavior.
- Added Evaluation Bench UI to the lower workspace and Judge Brief proof list. Live result shows `100/100` and `5/5 passed`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_83e6kkjRXdeY6CqSFV7D3YsjuhGT`.
- Production proof: `/api/evaluate` returned score `100`, `5/5 passed`, and case ids `eval-projectile`, `eval-reaction-rate`, `eval-enzyme`, `eval-turbidity`, and `eval-unsupported-boundary`.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm` from the live deployment. Current video proof is 33.48 seconds, about 3.7 MB, 1440x900; frame checks show Evaluation Bench/Judge Brief at 29 seconds.
- Fresh verification passed: `npm run test` (`21 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, local evaluation suite (`100`, `5/5`), public `/api/health`, public `/api/evaluate`, public `/api/analyze`, and desktop/mobile public browser QA with no console errors or horizontal overflow.
- Video-hosting loop was resolved later by the hosted submission links checkpoint; current external loops are actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Hosted Submission Links Checkpoint - 2026-06-26

- Council verdict: Ouija works and remains submittable; first-place/submission fit improved by turning local deck/video assets into hosted links usable directly in Devpost.
- Added `scripts/sync-public-submission-assets.mjs` and `npm run sync:public-submission`.
- Synced `docs/aiyes-slide-deck.html`, `docs/assets/ouija-walkthrough.webm`, and submission screenshots into `public/submission/`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_GtRSmucECugirrsGrUhFnkG54Bim`.
- Hosted material proof: `https://ouija-olive.vercel.app/submission/slide-deck.html` returned HTTP 200 with `text/html`, and `https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm` returned HTTP 200 with `video/webm` and content length `3685625`.
- Fresh verification passed: `npm run sync:public-submission`, `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, public `/api/evaluate` (`100`, `5/5`), hosted slide-deck browser QA, and mobile live app QA with no console errors or horizontal overflow.
- Remaining external loops: submit on Devpost, handle Devpost's 2-5 member team requirement if enforced, and optionally configure a real `OPENAI_API_KEY` web-search demo.

## Judge Brief Submission Polish - 2026-06-26

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by removing stale "video draft/final URL" language from the live Judge Brief and submission docs.
- Updated Judge Brief to show hosted `Slide deck` and `Video` status, direct hosted submission links, and a proof item that the deck and walkthrough are public.
- Updated `docs/devpost-submission-copy.md`, `docs/judging-checklist.md`, `docs/submission-assets.md`, `docs/five-minute-demo-script.md`, and `README.md` so they treat the deck/video as hosted assets instead of pending uploads.
- Regenerated `docs/assets/ouija-walkthrough.webm` from the live app and synced it to `public/submission/assets/ouija-walkthrough.webm`; current proof is 29.44 seconds, 3,045,571 bytes, 1440x900, with a 25-second frame check showing Evaluation Bench, Judge Brief, hosted links, and the Devpost-only loop.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_r9m8euGVchBR4j77T9F2Jsm1oH5R`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted deck returned HTTP 200 with `text/html`, hosted video returned HTTP 200 with `video/webm` and content length `3045571`, and desktop/mobile browser QA found hosted links visible, no console errors, and no horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Full Walkthrough Upgrade - 2026-06-26

- Council verdict after checking the AIYES/Devpost submission shape: Ouija works and is submittable, but first-place fit improved by replacing the 29-second smoke-style walkthrough with a fuller paced video closer to the allowed up-to-five-minute live-demo format.
- Updated `scripts/record-walkthrough.mjs` so each caption stays readable, includes a progress counter, and adds a build-architecture segment covering React/TypeScript/Express, deterministic science templates, optional server-side OpenAI web-search enrichment, and safe fallback behavior.
- Regenerated `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; new proof is 1:55.36, 9,086,168 bytes, 1440x900.
- Frame proof: 22 seconds shows the build-architecture caption, 96 seconds shows Evaluation Bench plus Judge Brief, and 106 seconds shows Judge Brief with hosted submission links.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_7ubnErXayLbxmL5YePN4XPJx1RuW`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted walkthrough returned HTTP 200 with `video/webm` and content length `9086168`, hosted deck returned HTTP 200 with `text/html`, and desktop/mobile browser QA found no console errors or horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## AI Model Card Checkpoint - 2026-06-26

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a live AI Model Card so judges can inspect the architecture, grounding mode, evaluation method, privacy boundary, and risk controls without reading code.
- Added top-nav `Model Card` and lower-workspace `AI Model Card` panel.
- Model Card shows hybrid strategy, current grounding mode, classifier type, evaluation coverage, privacy boundary, step-by-step flow, server-side API-key boundary, unsupported-lab guard, Claim Coach guard, and Evaluation Bench guard.
- Updated README and AIYES docs so the Model Card is part of the submission story.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_4C5Aycn5fkVpwqU5tbGaJDAH7Jnw`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted walkthrough still returned HTTP 200 with `video/webm` and content length `9086168`, and desktop/mobile public browser QA showed AI Model Card visible with no console errors or horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), production-style local browser QA, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Density Layering Coverage Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works, is externally deployed, and is stronger for AIYES because density layering is now a supported common middle/high school chemistry lab instead of an unsupported-boundary example.
- Added the `density-layering` template, sample chip, trusted Khan Academy density source, method-audit profile, density layer-order checks, and Evaluation Bench case.
- Moved the unsupported-boundary demo to a bean seedling light-color lab so Ouija still visibly admits when a lab is outside V1 coverage.
- Evaluation Bench now runs six deterministic live cases: projectile motion, reaction rate vs temperature, enzyme activity vs temperature, water filtration/turbidity, density layering, and unsupported-boundary behavior. Public `/api/evaluate` returned `100`, `6/6`, and case id `eval-density`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_AR3wo17f4XJxAu8AzqXGYUD9kFcK`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:55.88, 9,407,864 bytes, 1440x900. Frame checks showed `100/100`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `9407864`.
- Fresh verification passed: `npm run test` (`23 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate`, hosted slide/video checks, and desktop/mobile public browser QA with no console errors or horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Spreadsheet Data Handling Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making data handling practical instead of forcing students to manually retype every lab-table cell.
- Added `src/lib/dataImport.ts` with tested parsing for tab-separated spreadsheet paste, CSV/semicolon input, optional headers, quoted comma cells, blank rows, and deterministic imported row ids.
- Added a `Paste spreadsheet rows` data card in the live app. Imported rows immediately update the table, graph, Comparison Insights, Method Audit, Claim Coach, Reasoning Trail, and Judge Brief evidence.
- Added Track 1 `Data handling` evidence in Reasoning Trail and a Judge Brief proof item: `Spreadsheet paste/import flows into data checks.`
- Updated submission docs and the walkthrough script so the recorded demo shows pasted spreadsheet data becoming graph/check input.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_C1LMFQGszHbsNVH3kTtxQgPjTDUQ`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:56.08, 9,483,261 bytes, 1440x900. Frame checks showed pasted table import, recomputed warning, `100/100`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `9483261`.
- Fresh verification passed: `npm run test` (`27 passed`), `npm run build`, `npm run test:e2e` (`4 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `6/6`), hosted slide/video checks, and desktop/mobile public browser QA for spreadsheet import, Judge Brief, Evaluation Bench, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Evidence Packet Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a practical student output that is useful after analysis while still refusing to write the final lab report.
- Added `src/lib/evidencePacket.ts` with tested Markdown packet generation for classification, variables, expected pattern, table rows, method/data warnings, sources, blank claim starter, next reasoning question, and integrity boundary.
- Added the live `Evidence Packet` panel with selectable/copyable packet text and `Copy packet` action. The packet repeats the Claim Coach blanks and source trail but does not generate a final conclusion.
- Added a Judge Brief proof item: `Evidence Packet exports a student-owned reasoning handoff.`
- Updated submission docs, slide deck copy, and `scripts/record-walkthrough.mjs` so the walkthrough includes the Evidence Packet moment.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_4SytAJCh3eVZtWC8oqRCQWfBwtTu`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:04.80, 10,501,086 bytes, 1440x900. Frame checks showed Evidence Packet, pasted table import, `100/100`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `10501086`.
- Fresh verification passed: `npm run test` (`29 passed`), `npm run build`, `npm run test:e2e` (`4 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `6/6`), hosted slide/video checks, and desktop/mobile public browser QA for Evidence Packet, spreadsheet import, Judge Brief, Evaluation Bench, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Ohm's Law Coverage Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved again by adding another practical, common middle/high school physics lab with clear expected graph behavior.
- Added the `ohms-law-circuits` template, sample chip, trusted Khan Academy Ohm's law source, method-audit profile, current/voltage/resistance consistency checks, and Evaluation Bench case.
- Evaluation Bench now runs seven deterministic live cases: projectile motion, Ohm's law circuits, reaction rate vs temperature, enzyme activity vs temperature, water filtration/turbidity, density layering, and unsupported-boundary behavior. Public `/api/evaluate` returned score `100`, `7/7`, and case id `eval-ohms-law`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_9SQeNfV32heQa8ThDZwp8Up3wCtQ`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:05.92, 10,723,343 bytes, 1440x900, SHA-256 `84ed432cfc6a828fe89d79e2d2a37e3264cbd4ad661e5c4f1a59a9d7bcf8fbd6`. Frame checks showed circuits breadth, `100/100`, `7/7 passed`, `7 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `10723343`.
- Fresh verification passed: `npm run test` (`30 passed`), `npm run build`, `npm run test:e2e` (`5 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `7/7`), hosted slide/video checks, and desktop/mobile public browser QA for Ohm's Law, Evidence Packet, Judge Brief, Evaluation Bench, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Next Trial Planner Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making Ouija feel more like a practical AI lab partner instead of only a classifier/checker.
- Added `nextTrialPlan` to the shared analysis schema. It returns status, priority, next measurement, control to tighten, why it matters, safety reminder, student decision question, and a checklist.
- Added the live `Next Trial Planner` panel. Clean data suggests a safe next measurement; warning/error states tell students to repeat or fix flagged measurements before extending the experiment.
- Updated Reasoning Trail and Track 1 evidence with `Plan next trial` / `Adaptive planning`, updated Evidence Packet to include `## Next Trial Plan`, and updated Judge Brief / AI Model Card / submission docs.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_4vu3GwWtqvc5b6qU6qF9PMVe7ss5`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:14.04, 11,358,222 bytes, 1440x900, SHA-256 `1cedf6199adb599debf0971b08543614ad2abeb2b1369d32a8ddbcf3a327f00b`. Frame checks showed the Next Trial Planner, `7/7 passed`, the `7 live cases` AI Model Card metric, and hosted Judge Brief links.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and next-trial evidence; `/api/analyze` returned a `fix_first` planner for bad reaction-rate rows; hosted deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `11358222`.
- Fresh verification passed: `npm run test` (`30 passed`), `npm run build`, `npm run test:e2e` (`5 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and desktop/mobile public browser QA for Next Trial Planner, Evidence Packet, Reasoning Trail, Judge Brief, Model Card, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Concept Coach Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the app's education value explicit, not only its data-checking workflow.
- Added `conceptCoach` to the shared analysis schema: middle/high school level, vocabulary terms, explanation steps, misconception checks, and a source task.
- Added the live `Concept Coach` panel and updated Reasoning Trail / Track Evidence with `Build concept model` and `Learning scaffold`.
- Evidence Packet now includes `## Concept Coach`; Judge Brief and AI Model Card show concept-scaffold proof; submission docs and walkthrough script were updated.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_7AW8cDFkZejtXkFMqoQRCNycVCKX`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:22.80, 12,127,594 bytes, 1440x900, SHA-256 `e8e494217ba90229049b06e43480acd51cb190cc0aabdd904c31d417ea57a6c4`. Frame checks showed Concept Coach, `Build concept model`, `Learning scaffold`, `7/7 passed`, `7 live cases`, and hosted Judge Brief links.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `3 concept terms`; `/api/analyze` returned projectile Concept Coach vocabulary and `learning-scaffold`; hosted deck/video returned HTTP 200; video content length `12127594`.
- Fresh verification passed: `npm run test` (`30 passed`), `npm run build`, `npm run test:e2e` (`5 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and desktop/mobile public browser QA for Concept Coach, Evidence Packet, Reasoning Trail, Judge Brief, Model Card, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Safety Coach Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by directly addressing AIYES ethics/responsible-use expectations with visible school-lab safety boundaries.
- Added `safetyCoach` to the shared analysis schema: status, required checks, material notes, cleanup, stop condition, and teacher check. Low-confidence experiment matches force adult-review language.
- Added the live `Safety Coach` panel between Method Audit and Concept Coach. Reasoning Trail and Track Evidence now include `Check safety boundary` and `Safety and responsibility`.
- Evidence Packet now includes `## Safety Coach`; Judge Brief and AI Model Card show safety proof; README, Devpost copy, AIYES brief, judging checklist, slide deck, and walkthrough script were updated.
- Fixed a stale-response race where the initial Projectile analysis could overwrite a fast sample-chip selection; added a Playwright regression for delayed initial analysis.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_2XMgJRiURbeyzbcH6NTbBwUg1ecF`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:30.20, 12,598,701 bytes, 1440x900, SHA-256 `c6c1e7c5b7cdcfed552b12e80f90f186eafaf8d88e031320e67386918963c14a`. Frame checks showed Safety Coach, `Check safety boundary`, `Safety and responsibility`, Model Card, Judge Brief, and hosted links.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and safety-coach evidence; `/api/analyze` returned adult-review safety for unsupported labs; hosted deck/video returned HTTP 200; video content length `12598701`.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and desktop/mobile public browser QA for Safety Coach, Reasoning Trail, Judge Brief, Model Card, no console errors, no horizontal overflow, and the delayed-initial-analysis race.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Guided Lab Flow Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the dense AI analysis feel like a guided student workflow with one clear next action.
- Added `guidedFlow` to the shared analysis schema: current action plus six student stages for identifying the lab, preparing safely, understanding the pattern, checking data, planning the next move, and writing the student's own claim.
- Added the live `Guided Lab Flow` panel, `Guide student path` Reasoning Trail step, `UX and design` Track 1 criterion, and Guided Lab Flow sections in the Evidence Packet, Judge Brief, AI Model Card, submission docs, slide deck, and walkthrough script.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_3iKC7gQk3KisZ1JPTq4hBeGZM3dX`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:39.28, 13,836,071 bytes, 1440x900, SHA-256 `768f994a78fa41cd78e63f6002e4cffc07cfcecd556a48f2563d7e5136540323`. Frame checks showed Guided Lab Flow, `UX and design`, Model Card guided-flow proof, Judge Brief guided-flow proof, and hosted links.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `6 guided workflow steps`; `/api/analyze` for reaction rate returned `Get the teacher safety check before starting or extending the lab.`; hosted deck returned HTTP 200; hosted walkthrough returned HTTP 200 with `video/webm` and content length `13836071`.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and desktop/mobile public browser QA for Guided Lab Flow, UX evidence, Judge Brief, Model Card, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Model Strategy Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the AI technical design/model strategy inspectable instead of letting judges dismiss the app as a prompt wrapper.
- Live AIYES/Devpost check on 2026-06-29: contest deadline is September 1, 2026 at 12:00 PM PDT; the page lists `Team required: 2 to 5 members` while its overview also says participants may work individually or in teams, so the submission-form team requirement must be verified at final submit.
- Added `modelStrategy` to the shared analysis schema: classifier name, selected template, decision summary, fallback strategy, grounding mode, five strategy signals, six ranked classification candidates, and risk controls.
- Added the live `Model Strategy` panel, `Expose model strategy` Reasoning Trail step, `Model strategy` Track 1 criterion, and Model Strategy sections in the Evidence Packet, Judge Brief, AI Model Card, submission docs, slide deck, and walkthrough script.
- Strong supported runs now show `94/100` Track 1 evidence because model-strategy proof is visible; low-confidence unsupported labs remain capped at `75` and `needs_work`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_Fc1wbYikjxPbkhRiuSnFt4H7LPcK`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:46.72, 14,253,517 bytes, 1440x900, SHA-256 `c2f95e4697800306e4226c660c0105b3a06ddf3e7680b2ad51957d9e4fe023dc`. Frame checks showed Model Strategy candidate ranking, `Expose model strategy`, Guided Lab Flow, Judge Brief model-strategy proof, and hosted links.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, `94/100 Track 1 score`, and `6 model candidates ranked`; `/api/analyze` for reaction rate returned `94`, `competitive`, a Model Strategy decision summary, 6 candidates, `model-strategy` criterion, and `strategy` pipeline step; hosted deck/video returned HTTP 200 with video content length `14253517`.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, `git diff --check`, and desktop/mobile public browser QA for Model Strategy, candidate rankings, `94/100`, Judge Brief proof, listed 2-5 team loop, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Official Rubric Fit Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by directly mapping every run to the three visible AIYES judging criteria instead of asking judges to infer problem relevance, AI design/model strategy, and UX/design from scattered panels.
- Added `officialRubricFit` to the shared analysis schema: score, verdict, three official criteria, evidence bullets, and judge takeaway. It is recomputed in fallback analysis, OpenAI enrichment merges, and table-row refreshes.
- Added the live `AIYES Rubric Fit` panel, top-nav `Rubric Fit` link, Evidence Packet `## AIYES Rubric Fit` section, Evaluation Bench evidence line, Judge Brief proof item, AI Model Card safeguard, and matching README/submission/deck/walkthrough updates.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_2zvopR3EAHLaoRdR66LRLzbtSCWv`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `3 official rubric criteria mapped`; `/api/analyze` for projectile motion returned Track 1 score `94`, readiness `competitive`, rubric score `96`, and all three labels: `Problem Definition and Real-World Relevance`, `AI Technical Design and Model Strategy`, and `User Experience and Design`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `9871`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `15956405`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:01.76, 15,956,405 bytes, 1440x900, SHA-256 `8cace5014831d85950f482302c0e97d6503b521b7af79ecb603578ac8e27355a`. Frame checks showed AIYES Rubric Fit with all three official criteria, Evidence Packet, Evaluation Bench, Judge Brief, hosted links, and the new Judge Brief proof item.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA for AIYES Rubric Fit, Judge Brief proof, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Learning Impact Loop Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the student impact measurable inside the app instead of only described in submission copy.
- Added `impactSnapshot` to the shared analysis schema: score, headline, student outcome, five metrics (`Student outcome`, `Data quality`, `Concept learning`, `Integrity`, `Next trial`), and a diagnose-ground-check-improve-write evidence loop. It recomputes on fallback analysis, enrichment merges, and table edits.
- Added the live `Learning Impact Loop` panel, top-nav `Impact` link, Evidence Packet `## Learning Impact Loop` section, Evaluation Bench impact evidence, Judge Brief proof item, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_2W781ZxC8xhSkcKTWfPH1ycLDcpD`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `96/100 learning impact score`; `/api/analyze` for projectile motion returned Track 1 score `94`, readiness `competitive`, rubric score `96`, impact score `96`, and all five impact metric labels.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10187`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `15517473`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:07.20, 15,517,473 bytes, 1440x900, SHA-256 `311a00879843d3942e36d932748fc5f631829f46f4ec05bd4105d9a0fa210b56`. Frame checks showed Learning Impact Loop, AIYES Rubric Fit, Evidence Packet, Evaluation Bench, Judge Brief, hosted links, and the new impact proof item.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA for Learning Impact Loop, Judge Brief proof, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Pendulum Coverage Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a safe, common, graphable pendulum lab with a square-root expected pattern instead of only adding more pitch polish.
- Added `pendulum-period-length` as a supported physics template with sample chip, trusted Physics Classroom source, concept coach, safety coach, method audit controls, next-trial guidance, period/length validators, and Evaluation Bench case `eval-pendulum`.
- Ouija now supports seven common middle/high school demo labs: projectile motion, pendulum period vs length, Ohm's law circuits, reaction rate vs temperature, enzyme activity vs temperature, density layering, and water filtration/turbidity, with the unsupported-boundary demo still using a bean seedling light-color lab.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_87i38RCzQmtcR4AX6G7dWz8FvUzc`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and case ids `eval-projectile`, `eval-pendulum`, `eval-reaction-rate`, `eval-ohms-law`, `eval-enzyme`, `eval-turbidity`, `eval-density`, and `eval-unsupported-boundary`; `/api/analyze` for pendulum returned `pendulum-period-length`, Track 1 score `94`, readiness `competitive`, `7` model candidates, rubric score `96`, impact score `96`, and source `Pendulum motion`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10217`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `16453076`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:05.44, 16,453,076 bytes, 1440x900, SHA-256 `1a0c6fea9ffff3ea3972b657d92de843c409f8bebcc176268813cb6d9daac14d`. Frame checks showed Pendulum coverage in Evaluation Bench, `100/100`, `8/8 passed`, `8 live cases`, `7 demos`, Judge Brief, and hosted links.
- Fresh verification passed: `npm run test` (`32 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public API checks, hosted deck/video checks, and desktop/mobile public browser QA with no console errors or horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Pattern Evidence Engine Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved again by adding `Pattern Evidence Engine`, a deterministic whole-table scoring layer that judges whether the student dataset supports the expected science pattern before the claim-writing stage.
- Added `patternEvidence` to the shared analysis schema: status, score, method, observations, expected/observed details, whole-pattern summary, and student question.
- Added template-specific pattern checks: projectile and enzyme peak/shape checks, reaction-rate and filtration trend checks, pendulum square-root consistency, Ohm's law ratio consistency, and density bottom-to-top ordering.
- Added the live `Pattern Evidence Engine` panel, plus `Pattern evidence` in Learning Impact Loop, `Score whole pattern` in Reasoning Trail, Track Evidence criterion, Model Strategy signal/risk control, AIYES Rubric Fit evidence, Evidence Packet section, Evaluation Bench evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, screenshots, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_GubBWjjCYjLbPgDT2vVKNusjttUV`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `100/100 pattern evidence` in supported cases; `/api/analyze` for a wrong-direction reaction-rate table returned `patternEvidence.status: "contradicts"`, score `18`, `pattern-evidence` impact metric, rubric evidence naming Pattern Evidence Engine, and a `pattern` pipeline step.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10678`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `18092340`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:21.68, 18,092,340 bytes, 1440x900, SHA-256 `b9bf13c4125fc83e385b430206f4bf42f9c6b7aee408897ff9a43b6e29e0d657`.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Pattern Evidence visible, Evaluation Bench visible, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Reliability Coach Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding repeated-trial reliability because real middle/high school labs need repeats, averages, and spread checks before students trust a graph.
- Added `reliabilityCoach` to the shared analysis schema: status, score, x/y labels, repeat groups, counts, averages, spread, recommendation, and student question.
- Added deterministic grouping by the experiment independent variable. Ouija now flags under-repeated conditions, wide-spread repeated measurements, blocked invalid data, and strong repeat groups.
- Added the live `Reliability Coach` panel after Method Audit, plus `Repeat reliability` in Learning Impact Loop, `Check repeat reliability` in Reasoning Trail, Track Evidence criterion, Model Strategy signal/risk control, AIYES Rubric Fit evidence, Evidence Packet section, Evaluation Bench evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_FdMqGWB3CJuJaJhsmf8FYVtundEm`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `68/100 repeat reliability` evidence; `/api/analyze` for reaction rate returned `reliabilityCoach.status: "needs_repeats"`, score `68`, rubric evidence naming Reliability Coach, and a `reliability` pipeline step.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10422`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `17144530`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:15.32, 17,144,530 bytes, 1440x900, SHA-256 `47364a7e4dea65492579a1aac1cae3ad8bc5c5337276be6bd671780cda3b4b59`. Frame checks showed Reliability Coach caption, repeat groups, averages, spread, student question, Model Card proof, Evaluation Bench, and Judge Brief proof.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA with Reliability Coach visible, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Expected Overlay Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a student-visible expected-pattern overlay directly on the graph, so students can compare their own measurements against the trusted expected pattern before reading Pattern Evidence or writing a claim.
- Added `expectedComparison` to the shared analysis schema. It returns observed/expected labels, a plain-language summary, row-level observed values, interpolated or matched expected values, deltas, and notes. It recomputes on fallback analysis, OpenAI enrichment merges, row edits, and spreadsheet imports.
- Added a dashed `Expected overlay` series to the live graph with a visible summary below the chart. Evidence Packet, Evaluation Bench, Learning Impact Loop, Official Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now mention expected-overlay comparison.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_4iHMnyrze5sPJTpMJbGLfwTQJ3nB`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `expected overlay points`; `/api/analyze` for a wrong-direction reaction-rate table returned `patternEvidence.status: "contradicts"`, score `18`, `expectedComparison.summary` with `4 of 4 rows`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `17874221`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:21.52, 17,874,221 bytes, 1440x900, SHA-256 `d3a192e867d2b523454ebd11b5cce0a754ecc7b58d2616abe164208354938733`. Screenshot proof shows the dashed expected overlay and summary in the graph section.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with expected overlay visible, Pattern Evidence visible, Evaluation Bench visible, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Grounding Audit Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making source trust, citation visibility, and mixed-evidence boundaries visible instead of burying them in expected-result prose.
- Added `groundingAudit` to the shared analysis schema. It scores visible citations, grounding mode, source agreement, and student-use boundaries, then returns a source-backed, mixed-evidence, or needs-review status plus a student source task.
- Added the live `Grounding Audit` panel in the right source rail. Evidence Packet, Evaluation Bench, Model Strategy, AIYES Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now mention the source-trust audit.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_3HYtir2hQJmxS7JRg123ABCyECqX`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `92/100 grounding audit`; `/api/analyze` for a wrong-direction reaction-rate table returned `groundingAudit.score: 92`, `groundingAudit.status: "source_backed"`, `patternEvidence.status: "contradicts"`, score `18`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `18983280`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:31.48, 18,983,280 bytes, 1440x900, SHA-256 `cf5c8f359490cc0ef94ebf96c142f5d1c2f5f52c37f7e14e384dff661d61f4e5`. Screenshot proof shows the Grounding Audit in the right rail.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Grounding Audit, expected overlay, Pattern Evidence, Evaluation Bench, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## AI Evaluation Harness Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by answering the strongest judge objection, "is this evaluated like an AI system or just presented like a polished demo?"
- Added `aiEvaluationHarness` to the shared analysis schema. It scores classifier confidence, coverage benchmark, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries, then returns a validated/review/blocked status plus judge-facing failure mode.
- Added the live `AI Evaluation Harness` panel after Model Strategy. Evidence Packet, Evaluation Bench, AIYES Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now include the harness.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_2FGxoqPJ1J4mBgpGLpZQ8VeWf9Wf`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `93/100 AI evaluation harness`; `/api/analyze` for a wrong-direction reaction-rate table returned `aiEvaluationHarness.score: 80`, `aiEvaluationHarness.status: "review"`, `groundingAudit.status: "source_backed"`, `patternEvidence.status: "contradicts"`, score `18`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `19275329`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:38.48, 19,275,329 bytes, 1440x900, SHA-256 `41a2cb6908f33eba1e63bba7cf5a7e59d6062e628d20ea4c0ec68e651ba8bc40`. Screenshot proof shows the AI Evaluation Harness in the main analysis column.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with AI Evaluation Harness, Grounding Audit, expected overlay, Pattern Evidence, Evaluation Bench, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Judge Demo Path Checkpoint - 2026-07-01

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the live judge walkthrough explicit instead of asking evaluators to infer the path through many proof panels.
- Added `judgeDemoPath` to the shared analysis schema. It returns ready/review/blocked status, headline, summary, next best action, and five steps: problem fit, AI design, student workflow, evidence handoff, and submission proof.
- Added the live `Judge Demo Path` panel directly below classification, plus `Judge demo path` Track Evidence criterion, `Guide judge demo` Reasoning Trail pipeline step, Official Rubric Fit evidence, Evidence Packet section, Evaluation Bench evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_4gcx4PQv8qEHQSnWBFD3Q3NjfBap`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `5 judge demo steps (ready)` in supported cases; `/api/analyze` for a wrong-direction reaction-rate table returned `judgeDemoPath.status: "review"`, `5` judge demo steps, `demo` pipeline status `review`, `patternEvidence.status: "contradicts"`, `aiEvaluationHarness.score: 82`, and `groundingAudit.score: 92`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `11583`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `20942709`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:46.84, 20,942,709 bytes, 1440x900, SHA-256 `1ff9ceacaf92079c07769c9100388939bed31cd989e2b3afba9fe30fa89c7a70`. Screenshot proof shows Judge Demo Path near the top of the main analysis column.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed` after one locator fix), `npm audit --json` (`0 vulnerabilities`), `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Judge Demo Path, AI Evaluation Harness, Grounding Audit, Evaluation Bench, title `Ouija`, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Custom Lab Triage Checkpoint - 2026-07-01

- Council verdict after retry: Ouija works and remains submittable; first-place fit improved by closing the "any kind of experiment" honesty gap with practical unsupported-lab triage instead of only showing a closest-supported warning.
- Added `customLabTriage` to the shared analysis schema: status, summary, inferred focus, suggested columns, source searches, clarifying questions, safety boundary, and student next action.
- Added the live `Custom Lab Triage` panel for low-confidence descriptions, plus Evidence Packet export, Evaluation Bench evidence, Track Evidence criterion, Official Rubric Fit evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, tests, and `docs/assets/ouija-custom-triage.png`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_EQvtAJPx2xSNREjvKhmVHGm2ej9u`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, `5 judge demo steps (ready)`, and `needs student details custom lab triage`; `/api/analyze` for the bean seedling light-color lab returned `matchQuality: "closest_supported"`, `readiness: "needs_work"`, `customLabTriage.status: "needs_student_details"`, focus `plant growth light color`, and Custom Lab Triage criterion `review`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; walkthrough returned HTTP 200 with `video/webm`, content length `21786479`; Custom Lab Triage screenshot returned HTTP 200 with `image/png`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:55.88, 21,786,479 bytes, 1440x900, SHA-256 `9e9ecc42bd08490b37ec1b4521ecf54e86bbd90074f202b442e1bd892512f97e`. Screenshot proof shows the low-confidence plant-light lab plus Custom Lab Triage focus, source searches, clarifying questions, and teacher-confirmation boundary.
- Fresh verification passed: `npm run test` (`34 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video/screenshot checks, and public browser QA with Custom Lab Triage visible, title `Ouija`, and no horizontal overflow on desktop or mobile.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Custom Investigation Planner Checkpoint - 2026-07-01

- Council verdict after the next retry: Ouija works and remains submittable; first-place is still not guaranteed, but fit improved by making unsupported labs more practically usable for students instead of stopping at triage questions.
- Extended `customLabTriage` with a typed `planner`: title, independent/dependent variables, control variables, repeat plan, starter rows, quality checklist, and hypothesis starter with blanks.
- For the unsupported bean seedling light-color lab, Ouija now returns `Light color` as the independent variable, `Plant height` as the dependent variable, controls such as `water amount`, repeat guidance to use at least 3 plants per light color, and starter rows for `Red light`, `Blue light`, and `White light`.
- Added the planner into the live Custom Lab Triage panel, Evidence Packet, `/api/evaluate` evidence (`3 custom planner rows`), API/serverless tests, E2E tests, README, Devpost copy, AIYES brief, judging checklist, slide deck, screenshot capture, and walkthrough script.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_EMf94dhf32nKANzRJLHZBaEBVYpK`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, `5 judge demo steps (ready)`, `needs student details custom lab triage`, and `3 custom planner rows`; `/api/analyze` for the bean seedling light-color lab returned `matchQuality: "closest_supported"`, `readiness: "needs_work"`, `customLabTriage.status: "needs_student_details"`, independent `Light color`, dependent `Plant height`, rows `Red light`, `Blue light`, `White light`, and repeat-plan text.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `12075`; walkthrough returned HTTP 200 with `video/webm`, content length `21438290`; Custom Lab Triage screenshot returned HTTP 200 with `image/png`, content length `3836713`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:55.60, 21,438,290 bytes, 1440x900, SHA-256 `a9074078992e536499dc75e705a1cac1d0532005601a05153e32d999f4804acb`. Screenshot proof shows the planner variables, controls, repeat plan, and starter worksheet rows.
- Fresh verification passed: `npm run test` (`35 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video/screenshot checks, and public browser QA with the planner visible, title `Ouija`, and no horizontal overflow on desktop or mobile.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Data Handling Ledger And Docs Checkpoint - 2026-07-02

- Council verdict after retry: Ouija works and remains submittable; first-place is still not guaranteed, but fit improved by making AIYES data handling, privacy, retention, and ethics proof inspectable inside the live app instead of only described in copy.
- Added `dataHandlingLedger` to the shared analysis schema. It returns privacy-preserving/review status, score, summary, five data flows (`description`, `table-data`, `local-snapshot`, `grounding-sources`, `server-api-key`), safeguards, student rights, and judge takeaway.
- Added the live `Data Handling Ledger` panel after AI Evaluation Harness, plus `Data ethics` Track Evidence criterion, `Audit data handling` Reasoning Trail step, Official Rubric Fit evidence, Evidence Packet section, Evaluation Bench evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, API/serverless tests, and E2E tests.
- Ran the ECC `/update-docs` workflow from source-of-truth files. Added `docs/API.md`, `docs/ENV.md`, `docs/CONTRIBUTING.md`, and `docs/RUNBOOK.md` with `AUTO-GENERATED` sections for routes, env vars, scripts, and health checks. No docs older than 90 days were flagged by the staleness check.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_5gJrGRbTbjXfC8buP5X8kfT3MxQ9`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `96/100 data handling ledger` evidence; `/api/analyze` for the bean seedling light-color lab returned `matchQuality: "closest_supported"`, `readiness: "needs_work"`, `customLabTriage.status: "needs_student_details"`, `dataHandlingLedger.status: "privacy_preserving"`, independent `Light color`, dependent `Plant height`, and starter rows `Red light`, `Blue light`, `White light`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `12504`; walkthrough returned HTTP 200 with `video/webm`, content length `11406586`; Custom Lab Triage screenshot returned HTTP 200 with `image/png`, content length `4247966`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:54.76, 11,406,586 bytes, 1440x900, SHA-256 `6a7aed6d3c93fd15fabda460a32fbbe9f7369c4b7de2747b80f37288ad5049e4`. Frame check showed the refreshed app walkthrough after the Data Handling Ledger addition.
- Fresh verification passed: `npm run test` (`35 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, and hosted deck/video/screenshot checks.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Learning Exit Ticket Checkpoint - 2026-07-03

- Council verdict after retry: Ouija works and remains submittable; first-place is still not guaranteed, but fit improved by making student learning observable instead of only scoring internal readiness.
- Added `learningExitTicket` to the shared analysis schema. It returns ready/review/blocked status, summary, three prompts (`variable-check`, `pattern-check`, `next-step-check`), evidence-to-use guidance, teacher signals, integrity boundary, and judge takeaway.
- Added the live `Learning Exit Ticket` panel after Learning Impact Loop, plus `Learning exit ticket` Track Evidence criterion, `Check learning exit ticket` Reasoning Trail step, Official Rubric Fit evidence, Evidence Packet section, Evaluation Bench evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, API/serverless tests, and E2E tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_AA5UxT6HDBG99BzjSBDThtdHBraH`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `3 learning exit ticket prompts` evidence; `/api/analyze` for reaction rate returned `learningExitTicket.status: "ready"`, Track 1 score `94`, readiness `competitive`, official rubric score `96`, and a `learning-exit-ticket` checked Track Evidence criterion.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `12883`; walkthrough returned HTTP 200 with `video/webm`, content length `12617100`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:02.60, 12,617,100 bytes, 1440x900, SHA-256 `c47a0025242e320a811cfde2ede7c3b4e96dfd031e8e4137fe1de5378103176b`. Frame extraction showed the Learning Exit Ticket panel and caption.
- Fresh verification passed: `npm run test` (`35 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production Vercel deploy, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and public Playwright smoke showing Learning Exit Ticket with no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Progress Portfolio Checkpoint - 2026-07-03

- Council verdict after retry: Ouija works and remains submittable; first-place is still not guaranteed, but fit improved by showing repeated learning progress instead of only one-run readiness.
- Added `Progress Portfolio` as a local saved-run evidence layer. It turns Saved Labs into saved-run count, score trend, subject breadth, best readiness, milestones, next portfolio action, and judge takeaway.
- Added typed `ProgressPortfolio` / `ProgressPortfolioSnapshot` structures and `src/lib/progressPortfolio.ts`, plus unit tests and a Playwright flow that saves an unsupported plant-light run, saves a Water Filtration run, then verifies `2 saved runs`, `+19`, `2 subjects`, and repeated learning evidence.
- Added the live Progress Portfolio panel after Saved Labs, top-nav `Progress`, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, and refreshed public submission assets.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_GWQVsZ2tp8WM515jjqogEXJzRibk`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100` and `8/8`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `12465085`; hosted slide deck returned HTTP 200 with `text/html` and content length `13258`; public browser smoke confirmed Progress Portfolio with `2 saved runs`, `2 subjects`, repeated learning evidence, and no horizontal overflow.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:06.08, 12,465,085 bytes, 1440x900, SHA-256 `2b20a2ad8e0b5cfc3effe198bba8bc1cc27c0e5198a2b294eccc74042d642660`. Frame extraction showed the Progress Portfolio caption and panel area.
- Fresh verification passed: `npm run test` (`37 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production Vercel deploy, public `/api/health`, public `/api/evaluate`, hosted deck/video checks, and public Playwright smoke for Progress Portfolio.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## MCP Integration Coach Checkpoint - 2026-07-03

- Council verdict after Composio/MCP audit: adding a real live connector without OAuth/API-key setup would be integration theater; a credentials-safe export planner is the practical AIYES fit because it shows how student-owned evidence moves into classroom tools while preserving privacy and consent.
- Added `McpIntegrationPlan`, `McpIntegrationAction`, and `src/lib/mcpIntegrationPlan.ts`. The planner returns preview-only or server-MCP-ready status, Google Docs evidence packet action, Google Sheets row append action, Google Drive portfolio archive action, Notion learning record action, payload preview, safeguards, setup hint, privacy boundary, and judge takeaway.
- Added the live `MCP Integration Coach` panel after Progress Portfolio, top-nav `MCP Export`, copyable payload preview, credential boundary, Judge Brief proof item, AI Model Card safeguard, Settings status, unit tests, and Playwright coverage.
- Updated README, Devpost copy, AIYES brief, judging checklist, runbook, slide deck, five-minute demo script, submission-assets proof, walkthrough script, screenshots, and hosted public submission assets.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_3JCBJEpYW4BUFPHpMLsPdgP8CaRr`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100` and `8/8`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `12655346`; hosted slide deck returned HTTP 200 with `text/html` and content length `13692`; public Playwright smoke confirmed MCP Integration Coach, `Preview only`, Google Sheets action, `COMPOSIO_API_KEY` setup boundary, and no horizontal overflow.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:11.52, 12,655,346 bytes, 1440x900, SHA-256 `557f6a19b6c6436c5ad1fca4498b69e25a4df68ce359e943b967b79201cff5a5`. Frame extraction showed the MCP Integration Coach panel, payload preview, and credential boundary.
- Fresh verification passed: `npm run test` (`39 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production Vercel deploy, public `/api/health`, public `/api/evaluate`, hosted deck/video checks, and public Playwright MCP smoke.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio MCP bridge only after server-side credential setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Student Reflection Workspace Checkpoint - 2026-07-03

- Council verdict after retry: Ouija works and remains submittable; first-place is still not guaranteed, but fit improved by turning exit-ticket prompts into student-authored work inside the app instead of only displaying prompts.
- Added `src/lib/studentReflectionWorkspace.ts` plus typed `StudentReflectionWorkspace`, `StudentReflectionEntry`, and `StudentReflectionAnswers` models. The workspace scores empty, too-short, and ready student drafts without generating answers.
- Added the live `Student Reflection Workspace` panel after Learning Exit Ticket, with three textareas for variable, pattern, and next-step drafts, `0/3` to `3/3` readiness, next action guidance, and an integrity boundary that says Ouija does not write reflection answers or final conclusions.
- Updated Evidence Packet and MCP Integration Coach payloads so student reflection drafts export only when the student typed them. The packet now includes `## Student Reflection Drafts`, readiness status, word counts, evidence-to-use guidance, and teacher signals.
- Updated Judge Brief, AI Model Card, Settings, README, Devpost copy, AIYES brief, judging checklist, API docs, slide deck, five-minute script, walkthrough script, submission-assets proof, and public submission assets.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_HRL1mTrveRq2NctTMXkNt2C7RX1E`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100` and `8/8`; hosted slide deck returned HTTP 200 with `text/html`, content length `14059`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `13027396`; public browser smoke confirmed Student Reflection Workspace can reach `3/3 ready`, MCP payload includes `Student Reflection Drafts`, and desktop/mobile have no horizontal overflow.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:15.76, 13,027,396 bytes, 1440x900, SHA-256 `6565e5213c2e47bdb0ea62f0c3f3a7a3431db4be720703750ecf86decb04ecbd`. Frame extraction showed the Student Reflection Workspace integrity boundary, MCP Integration Coach, and evaluation/judge sequence.
- Fresh verification passed: `npm run test` (`42 passed`), `npm run build`, `npm run test:e2e` (`8 passed` after one test locator fix), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:8799 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:8799 OUIJA_CAPTION_MS=4000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production Vercel deploy, public API/asset checks, and public browser smoke.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio MCP bridge only after server-side credential setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Pre-Lab Design Coach And Google Classroom MCP Checkpoint - 2026-07-04

- Council verdict after the Composio/MCP pass: Ouija works and is submittable; first-place is still not guaranteed, but fit improved by making the product useful before data collection instead of only after table rows exist.
- Added `preLabDesignCoach` to the shared `AnalyzeResult` schema. It returns ready/teacher-review/blocked status, variable plan, repeat plan, table plan, hypothesis starter with blanks, six setup checks, source task, safety gate, student next action, and judge takeaway.
- Added the live `Pre-Lab Design Coach` panel after Custom Lab Triage/Judge Demo Path, plus Track Evidence criterion `pre-lab-design`, Reasoning Trail step `Plan pre-lab setup`, Official Rubric Fit evidence, Evaluation Bench evidence, Evidence Packet section, Judge Brief proof, AI Model Card safeguard, API docs, README, Devpost copy, AIYES brief, judging checklist, slide deck, and walkthrough script coverage.
- Extended `MCP Integration Coach` with a Google Classroom action: `google-classroom-prelab-checkpoint`. It previews a consent-gated Composio MCP path to draft a pre-lab checkpoint from the student-owned packet without auto-submitting work or writing conclusions. Existing Docs, Sheets, Drive, and Notion preview actions remain preview-only.
- Refreshed submission screenshots and `docs/assets/ouija-walkthrough.webm`, then synced to `public/submission`. Walkthrough proof is 1:49.20, 11,534,079 bytes, 1440x900, SHA-256 `89872a3b127efb7a20f93637664736eaf5d2da5f0a1dbb13bc34a9684e180ab0`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_4wf2aUr71C8kMp5zR6KTwspo8bkP`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `6 pre-lab setup checks` evidence across cases; `/api/analyze` for projectile motion returned `preLabDesignCoach.status: "ready_to_plan"`, variable plan `Launch Angle` to `Measured Range`, six setup checks, Track Evidence criterion `pre-lab-design`, and Reasoning Trail step `Plan pre-lab setup`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `14303`; walkthrough returned HTTP 200 with `video/webm`, content length `11534079`.
- Fresh verification passed: `npm run test` (`44 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, and hosted deck/video checks.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio MCP bridge only after server-side credential setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## MCP Readiness Matrix And Google Forms Route - 2026-07-05

- Council verdict after re-checking the AIYES Track 1 rubric: Ouija works and is submittable; first-place still cannot be guaranteed, but the highest-leverage Composio/MCP improvement is visible technical-depth proof, not pretending live OAuth actions are already wired.
- Verified current external criteria from the AIYES Devpost page: Track 1 asks for a deployed practical AI app with problem definition, data handling, model selection/integration, application development, testing, UX, performance, ethics, and real-world impact; required submission artifacts are slide presentation, up-to-5-minute walkthrough/live demo, and source/deployment link.
- Added `google-forms-readiness-check` to `MCP Integration Coach`, previewing a Google Forms self-check draft from Pre-Lab Design Coach setup checks and Learning Exit Ticket prompts while preserving student-authored answers.
- Added `readinessMatrix`, `dryRunChecks`, and `executionBoundary` to `McpIntegrationPlan`. The live UI now shows connector route status, required `COMPOSIO_<TOOLKIT>_AUTH_CONFIG_ID` / `COMPOSIO_<TOOLKIT>_ALLOWED_TOOLS`, least-privilege scopes, data shared, consent gate, payload completeness, least-privilege, consent, integrity, and server-only credential checks.
- Updated Judge Brief, AI Model Card, MCP payload preview, README, AIYES brief, Devpost copy, judging checklist, runbook, slide deck, five-minute script, walkthrough script, and E2E coverage for the Forms route and readiness matrix.
- Refreshed screenshots and walkthrough from the local updated app, then synced `public/submission`. Walkthrough proof is 1:49.44, 11,982,255 bytes, 1440x900, SHA-256 `1114d5539521fb92a1a30ad5a232915830a9db58a274100c84f57430f6bda577`; local public slide deck size is `14431`.
- Fresh verification passed before deploy: `npm run test` (`44 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, and `shasum -a 256`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_Rimq5tM9tgEhtLQTUv8wiyQZGsNK`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `6 pre-lab setup checks`; hosted slide deck returned HTTP 200 with `text/html`, content length `14431`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `11982255`; public browser smoke confirmed `MCP Readiness Matrix`, `Google Forms` route, `COMPOSIO_GOOGLE_FORMS_AUTH_CONFIG_ID`, dry-run checks, and no desktop/mobile horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio MCP bridge only after server-side credential setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Plant Light Coverage Checkpoint - 2026-07-05

- Council verdict after another first-place check: Ouija works and is submittable; first place still cannot be guaranteed, but the app is stronger for AIYES because a common biology lab is now fully supported instead of only triaged.
- Added `plant-growth-light-color` / `Plant Light` as the eighth supported middle/high school experiment template: light color, plant height, growth days, trusted Ask A Biologist and KidsGardening sources, expected overlay, pattern evidence, row validators, safety coach, concept coach, method audit, next-trial plan, sample chip, and evaluation case.
- Moved the honest unsupported boundary to paper towel absorbency. Custom Lab Triage now infers `paper towel absorbency`, plans paper towel brand/type vs water absorbed, keeps controls like towel size, water volume, soak time, drain time, and measurement method, and starts rows for Brand A/B/C.
- Updated README, API docs, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, walkthrough script, screenshot capture, tests, and public submission assets for eight supported demos and nine live evaluation cases.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:48.68, 11,151,846 bytes, 1440x900, SHA-256 `c3f7e9c318f9aa160855931bcdfa814b1b0ab64894602583bb0b91f1b5c49738`. Local public slide deck size is `14430`.
- Latest verified production deployment: `dpl_Buikn3aSV5aJzisEa2aN6btqBg8X`, aliased at https://ouija-olive.vercel.app.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `9/9`, and case ids `eval-projectile`, `eval-pendulum`, `eval-reaction-rate`, `eval-ohms-law`, `eval-enzyme`, `eval-plant-light`, `eval-turbidity`, `eval-density`, and `eval-unsupported-boundary`; `/api/analyze` for bean seedlings under white/red/blue/green/dark light returned `plant-growth-light-color`, `supported_template`, `competitive`, `8` model candidates, and sources `Ask A Biologist,KidsGardening`; `/api/analyze` for paper towel absorbency returned `closest_supported`, `paper towel absorbency`, `Paper towel brand or type`, and starter rows `Brand A,Brand B,Brand C`.
- Hosted materials verified: slide deck HTTP 200 with `text/html`; walkthrough HTTP 200 with `video/webm`; public browser smoke confirmed Plant Light sample chip, `9/9 passed`, no console errors, and no desktop/mobile horizontal overflow.
- Fresh verification passed: `npm run test` (`45 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production deploy, public API/asset checks, and public browser smoke.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio MCP bridge only after server-side credential setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Server Dry-Run Composio MCP Bridge - 2026-07-05

- Council verdict after the Composio/MCP request: Ouija works and is submittable; first place still cannot be guaranteed, but the app is stronger because the MCP story is now a testable server bridge instead of a static preview panel.
- Added a server-side Composio dry-run bridge: `server/mcpBridge.ts`, Express routes `/api/mcp/status` and `/api/mcp/export`, and matching Vercel functions under `api/mcp/`.
- Added a seventh MCP connector route: `google-calendar-next-trial-reminder`, which schedules the student's next measurement/repeat-trial reminder without writing results or conclusions.
- The live MCP Integration Coach now fetches bridge readiness, shows missing `COMPOSIO_*` env vars, docs links, recommended tools, and validates a selected route through `/api/mcp/export` after student-facing consent.
- Public mode remains safe: `/api/mcp/export` validates supported action, consent, payload completeness, academic-integrity blanks, and credential boundary, then stops before Composio/Google/Notion execution unless future live env vars are configured.
- Fixed a production ESM issue by using `.js` import specifiers in `server/mcpBridge.ts`; the first deploy made `/api/mcp/status` return `FUNCTION_INVOCATION_FAILED`, and the second deploy fixed it.
- Latest verified production deployment: `dpl_3sddZSpNR1hzee5Qyu4cR9wmHmJG`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/mcp/status` returns `status: "server_dry_run"`, `toolkits.length: 7`, and Google Calendar recommended tool `GOOGLECALENDAR_CREATE_EVENT`; `/api/mcp/export` for `google-calendar-next-trial-reminder` returns `status: "dry_run"`, `toolkit: "Google Calendar"`, `payload` and `integrity` checks passing, and `credentials` in review; `/api/evaluate` returns `100`, `9/9`, `pass`.
- Hosted assets verified: slide deck HTTP 200, content length `14518`; hosted walkthrough HTTP 200, `video/webm`, content length `11151846`.
- Fresh verification passed: `npm run test` (`51 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), production Vercel deploy, public `/api/mcp/status`, public `/api/mcp/export`, public `/api/evaluate`, hosted deck/video checks, and docs update.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio credentials/export execution only after server-side setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Walkthrough Proof Refresh For MCP Dry-Run - 2026-07-05

- Council verdict after the proof refresh: Ouija works and is submittable; first place still cannot be guaranteed, but the hosted walkthrough now better matches the strongest current feature set because it visibly demonstrates the server MCP dry-run result.
- Updated `scripts/record-walkthrough.mjs` so the MCP scene clicks the Google Calendar `Validate route` action, waits for `Dry-run passed`, scrolls the server validation card into view, and captions the `/api/mcp/export` consent/payload/integrity/credential-boundary proof.
- Regenerated `docs/assets/ouija-walkthrough.webm` from `https://ouija-olive.vercel.app` with `OUIJA_CAPTION_MS=3000`, then synced it to `public/submission/assets/ouija-walkthrough.webm`.
- Video proof: 1:51.32, 11,501,052 bytes, 1440x900, SHA-256 `5f6bf15589e94f1185e222d85dcb8892cc7dd8abd7a632bf245bb2132fa3dc1d`; frame proof at 102 seconds shows `Dry-run passed`, Google Calendar Composio tools, payload/integrity checks, and credential boundary.
- Latest verified production deployment: `dpl_AESRgcnQi6rbroHD3gxsUkzZDQ1Y`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: hosted walkthrough HTTP 200 with `video/webm` and content length `11501052`; hosted slide deck HTTP 200 with content length `14518`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run`, `7`, and `GOOGLECALENDAR_CREATE_EVENT`; `/api/mcp/export` for Google Calendar returns `dry_run` with supported-action/consent/payload/integrity checks passing and credentials in review.
- Fresh verification passed: `npm run test` (`51 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, production deploy, public endpoint checks, and hosted asset checks.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio credentials/export execution only after server-side setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Run Snapshot UX Hardening - 2026-07-06

- Council verdict after re-checking the app against AIYES Track 1 criteria: Ouija works and is submittable; first place still cannot be guaranteed, but the highest-leverage code improvement was UX density, not another integration.
- Added a live `Run Snapshot` panel immediately after classification. It shows rubric fit, Evaluation Bench status, learning impact, data flags, expected pattern, and current action before judges/students reach the deeper evidence panels.
- Reordered the main analysis workflow so `Guided Lab Flow`, `Pre-Lab Design Coach`, the expected-pattern graph, editable data table, Pattern Evidence, and Comparison Insights appear before `Model Strategy`, `AI Evaluation Harness`, `Data Handling Ledger`, and `AIYES Rubric Fit`.
- Added E2E proof that `graph-card` and `data-card` render before `model-strategy`, keeping the practical student workflow ahead of the judge evidence stack.
- Refreshed submission screenshots, walkthrough script, and public submission assets. Video proof: 1:57.28, 11,675,369 bytes, 1440x900, SHA-256 `880e980d2921ba8ccb705c7492b6a374619975466269f7cd4779c5c6f89a414e`; frame proof at 10 seconds shows Run Snapshot with rubric fit, `9/9` Evaluation Bench status, learning impact, data flags, expected pattern, and current action.
- Latest verified production deployment: `dpl_GAwDJq3LrMkCUpNBG6Dr4NshzKf5`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: hosted walkthrough HTTP 200 with `video/webm` and content length `11675369`; hosted slide deck HTTP 200 with content length `14518`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run`, `7`, and `GOOGLECALENDAR_CREATE_EVENT`; `/api/mcp/export` for Google Calendar returns `dry_run` with supported-action/consent/payload/integrity checks passing and credentials in review; public browser smoke shows Run Snapshot, `graph-card` index `6`, `data-card` index `7`, `model-strategy` index `20`, no horizontal overflow, and zero console errors.
- Fresh verification passed: `npm run test` (`51 passed`), `npm run build`, `npm run test:e2e` (`8 passed` after tightening one locator), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, first-screen Playwright visual QA, production deploy, public endpoint checks, hosted asset checks, and public browser smoke.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio credentials/export execution only after server-side setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## AI Runtime Proof Checkpoint - 2026-07-06

- Council verdict after the Composio/MCP ask: Ouija already has a credentials-safe MCP dry-run bridge, so the best next hardening was not fake live connector execution. The practical AIYES improvement was making the OpenAI/fallback runtime story inspectable in the same way as MCP.
- Added shared `RuntimeProof` and `RuntimeProofSignal` types plus `src/lib/runtimeProof.ts`.
- Added Express and Vercel `GET /api/runtime-proof`, returning fallback/web-search readiness, template count, live evaluation coverage, server-only key boundary, MCP bridge mode, runtime signals, and judge takeaway without exposing `OPENAI_API_KEY` or `COMPOSIO_API_KEY`.
- Added the live `AI Runtime Proof` panel near the top of the analysis workflow, plus top-nav `Runtime Proof` and public links to `/api/runtime-proof`, `/api/evaluate`, and `/api/mcp/status`.
- Updated README, API docs, AIYES brief, Devpost copy, judging checklist, five-minute script, walkthrough script, submission-assets proof, screenshots, and public submission assets.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:00.16, 12,347,598 bytes, 1440x900, SHA-256 `86e013c9b6f25ec35dbcba4d2977f1bf9fa72a1513a5f6652f327e168e162f98`.
- Latest verified production deployment: `dpl_BQeZLJFZiqgHfVv9J9coZeZ5ZB7U`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `webSearchConfigured: false`, `templateCount: 8`, `9/9` evaluation coverage, `mcpBridgeMode: server_dry_run`, and six runtime signals; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run` with seven toolkits; hosted deck and walkthrough return HTTP 200.
- Fresh verification passed: `npm run test` (`55 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public endpoint checks, hosted asset checks, and public desktop/mobile Playwright smoke for AI Runtime Proof with no overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, optional live Composio credentials/export execution only after server-side setup and consent flow, and optional real OpenAI web-search demo only with explicit API-key approval.

## Runtime Proof Slide Deck Sync - 2026-07-06

- Council follow-up verdict: Ouija is submittable; first-place cannot be guaranteed, and the next real gap was the required slide presentation lagging the live app/video after AI Runtime Proof shipped.
- Updated `docs/aiyes-slide-deck.html` with Runtime Proof, `/api/runtime-proof`, eight templates, 9/9 coverage, server-only key boundary, MCP bridge mode, and Plant Light biology coverage.
- Added `tests/submissionAssets.test.ts` assertions so the required deck must include `Runtime Proof`, `/api/runtime-proof`, and `plant growth vs light color`.
- Synced the corrected deck to `public/submission/slide-deck.html`.
- Latest verified production deployment: `dpl_B1pd2RvZNDmByzEsapFt347MfkXb`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: hosted slide deck HTTP 200 and contains `Runtime Proof`, `/api/runtime-proof`, and `plant growth vs light color`; `/api/runtime-proof` still returns `fallback_ready`, `8` templates, `9/9` evaluation, and `server_dry_run` MCP mode.
- Verification passed: focused `npx vitest run tests/submissionAssets.test.ts`, `npm run test` (`55 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, production deploy, hosted deck content check, and public `/api/runtime-proof`.
- Remaining external loops: Devpost submission, 2-5 member team ambiguity, optional live Composio credentials/export after consent/server setup, and optional OpenAI web-search demo only with explicit API-key approval.

## Composio Session Ticket Checkpoint - 2026-07-06

- Council verdict after re-auditing the Composio/MCP ask: Ouija was already submittable, but the MCP story was stronger after moving from export dry-run only to a scoped Composio Tool Router session ticket path.
- Added Express and Vercel `POST /api/mcp/session`. Public mode returns a dry-run session plan for the selected connector route; live mode can create a server-side Composio Tool Router session only when `COMPOSIO_API_KEY`, `COMPOSIO_SESSION_USER_ID`, `COMPOSIO_LIVE_EXPORTS=true`, the connector auth config, and allowed tools are configured.
- Kept the privacy boundary hard: `/api/mcp/session` withholds raw MCP URLs, API keys, and auth config values from browser responses. The visible UI shows the enabled toolkit, allowed tools, session endpoint, user-id env gate, and MCP URL issued/not-issued state.
- Updated MCP Integration Coach UI, API client/types, server bridge, Vercel route, tests, README, API/ENV/RUNBOOK docs, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, walkthrough script, submission assets, and source-code links.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:02.88, 12,819,100 bytes, 1440x900, SHA-256 `a6a837d3ff999d9cbf6936b089238f0143196f4fa37227cf0e1b4949d44de297`.
- Latest verified production deployment: `dpl_HuQrD3DEm352Q5ww3b7NQobAUiRh`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `8` templates, `9/9`, and `server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run`, seven toolkits, and missing `COMPOSIO_SESSION_USER_ID`; `/api/mcp/session` for Google Calendar returns `dry_run`, `/api/v3.1/tool_router/session`, `googlecalendar`, `GOOGLECALENDAR_CREATE_EVENT`, and `mcpUrlIssued: false`.
- Hosted assets verified: slide deck HTTP 200, content length `16022`, contains `/api/mcp/session`, `Runtime Proof`, and `plant growth vs light color`; walkthrough HTTP 200, `video/webm`, content length `12819100`.
- Fresh verification passed: focused Vitest (`26 passed`), `npm run test` (`58 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, and public browser smoke with session dry-run visible, MCP URL withheld, no overflow, and zero console errors.
- Remaining external loops: Devpost submission, 2-5 member team ambiguity, optional live Composio credentials/session/export only after consent/server setup, and optional OpenAI web-search demo only with explicit API-key approval.

## Composio Search Source Audit And Submission Checklist - 2026-07-06

- Council verdict after checking current AIYES Track 1 criteria: Ouija works and is submittable; first place still cannot be guaranteed, but the practical Composio improvement was a real source-audit route plus visible submission readiness, not fake private-account execution.
- Added `composio-search-source-audit` to the MCP connector catalog. It validates a Composio Search route for public web, scholar, and fetched-page source audits with `authConfigRequired: false`, `COMPOSIO_SEARCH_ALLOWED_TOOLS`, consent gating, server dry-run validation, and scoped session-ticket preview.
- Updated MCP Integration Coach, readiness matrix, payload preview, server bridge, API/serverless tests, E2E tests, README, API/ENV/RUNBOOK docs, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, and walkthrough script to include Composio Search source audits alongside Docs, Sheets, Drive, Classroom, Forms, Calendar, and Notion.
- Added a Judge Brief AIYES submission checklist showing slide deck, video walkthrough, source/deployment, and the external 2-5 student team requirement, plus a visible GitHub source-code link.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm`, synced public assets, and updated `docs/submission-assets.md`. Walkthrough proof: 2:02.80, 12,471,685 bytes, 1440x900, SHA-256 `2c2b8b96b6ae16553fdd46705a87b94138b6367c77b2895d9ac081cc4e0ca1c8`.
- Latest verified production deployment: `dpl_HSGsz3gKzrm7y4munEu3yGEMfLpM`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `8` templates, `9/9`, and `server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns eight toolkits with `Composio Search`, `authConfigRequired:false`, and `COMPOSIO_SEARCH_ALLOWED_TOOLS`; `/api/mcp/export` and `/api/mcp/session` for `composio-search-source-audit` return `dry_run`, `composio_search`, and the expected Search tools without live execution.
- Hosted assets verified: slide deck HTTP 200, content length `16091`; walkthrough HTTP 200, `video/webm`, content length `12471685`; public desktop/mobile browser smoke confirmed `Run source audit search`, `8 connector routes checked`, AIYES Submission Checklist, source-code link, no console errors, and no horizontal overflow.
- Fresh verification passed: `npm run test` (`60 passed`), `npm run build`, `npm run test:e2e` (`8 passed` after tightening two strict locators), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, and public browser smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio credentials/session/export only after consent/server setup, and optional OpenAI web-search demo only with explicit API-key approval.

## Technical Depth Proof Checkpoint - 2026-07-06

- Council verdict after re-checking the live app against AIYES Track 1: Ouija is submittable; first place still cannot be guaranteed, but the remaining first-place risk was judges mistaking fallback/demo mode for a simple template or API wrapper.
- Added live `Technical Depth Proof` after Model Strategy. It summarizes beyond-simple-API evidence from the current run: decision trace, evaluation harness score, grounding quality, expected-pattern engine, privacy, and integrity.
- Added `## Technical Depth Proof` to the Evidence Packet so the same decision trace/eval/grounding/pattern/privacy evidence is exported with the student-owned handoff.
- Updated Judge Brief proof list, AI Model Card safeguards, README, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, walkthrough script, tests, screenshots, public submission assets, and submission-assets proof.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced public assets. Walkthrough proof: 2:05.84, 12,856,485 bytes, 1440x900, SHA-256 `946914c3eb4c744dc0e48fea2be3f5eab0edb1d288d0f232107a63ec0db36efc`.
- Latest verified production deployment: `dpl_6j3f9wwp2rKStDLCXDNrGE7f15ZF`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `8` templates, `9/9`, and `server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; hosted slide deck contains `Technical Depth Proof`, `Composio Search`, and `9/9`; hosted walkthrough returns HTTP 200 with `video/webm` and content length `12856485`.
- Public desktop/mobile browser smoke confirmed live `Technical Depth Proof`, `Beyond simple API use`, `Decision trace`, `9-case regression suite`, no console errors, and no horizontal overflow.
- Fresh verification passed: focused Vitest (`7 passed`), `npm run test` (`60 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, and public browser smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio/OpenAI credentials only after explicit approval and consent.

## Student Level Lens UX Checkpoint - 2026-07-06

- Council verdict after checking the Composio ask and AIYES Track 1 fit: Ouija already has a practical Composio/MCP bridge, so the strongest next hardening was student-facing UX differentiation rather than another connector. Ouija works and is submittable; first place still cannot be guaranteed.
- Added `Student Level Lens` after Guided Lab Flow. The left rail now has a `Learning level` segmented control for `Middle` and `High`; the panel adapts the same analyzed lab for middle-school pattern reading or high-school quantitative evidence, controls, repeats, and uncertainty.
- Added the Student Level Lens to the Evidence Packet, Judge Brief proof list, AI Model Card risk controls, E2E tests, submission docs, slide deck, and walkthrough script.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm`, then synced public submission assets. Walkthrough proof: 2:09.08, 13,578,666 bytes, 1440x900, SHA-256 `6691fd4f3cddb932a4d9a045ce191ef88cd8e0e6e439eacce4f47bde7909e2e8`.
- Latest verified production deployment: `dpl_G7GaqjceuwgaZ1RqKZ8G8MYndrcB`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `templateCount: 8`, and `mcpBridgeMode: server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run` with eight toolkits; hosted walkthrough returns HTTP 200 with `video/webm` and content length `13578666`; hosted slide deck returns HTTP 200 with content length `16930`; public desktop/mobile browser smoke confirms High school lens, no horizontal overflow, and zero console errors.
- Fresh verification passed: `npm run test` (`60 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, local desktop/mobile Playwright QA, production deploy, public endpoint checks, hosted asset checks, and public desktop/mobile Playwright smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio/OpenAI credentials only after explicit approval and consent.

## Concept Mastery Checkpoint - 2026-07-06 PDT

- Council verdict after re-checking the Composio/MCP request and AIYES Track 1 fit: Ouija is submittable and already has a credentials-safe Composio/MCP dry-run bridge; the stronger first-place improvement was measurable student learning before evidence export, not fake live connector execution. First place still cannot be guaranteed.
- Added `Concept Mastery Check` after Student Level Lens. It scores three student answers derived from the current analysis: independent variable, expected evidence pattern, and academic-integrity boundary.
- Added `src/lib/conceptMasteryCheck.ts` with deterministic scoring, UI state, E2E coverage, Evidence Packet section, Judge Brief proof item, AI Model Card safeguard, slide/deck/docs updates, and walkthrough script coverage.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm`, then synced public submission assets. Walkthrough proof: 2:12.76, 13,552,256 bytes, 1440x900, SHA-256 `6e7df30919eefac1b530f19b400c96b8ab76b232461e169a29a340b880113698`.
- Latest verified production deployment: `dpl_EjF3z6RJF5Fd9yuVe8PHq6qmPKy2`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `templateCount: 8`, `evaluationPassed: 9`, and `mcpBridgeMode: server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run` with eight connector/toolkit routes; hosted slide deck returns HTTP 200 with content length `17321`; hosted walkthrough returns HTTP 200 with `video/webm` and content length `13552256`; public desktop/mobile Playwright smoke confirms Concept Mastery Check reaches `3/3 passed` with no horizontal overflow.
- Fresh verification passed: `npm run test` (`63 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, local screenshot review, and public desktop/mobile Playwright smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio/OpenAI credentials only after explicit approval and consent.

## Portfolio Story Builder Checkpoint - 2026-07-06 PDT

- Council verdict after re-checking the AIYES Track 1 criteria: Ouija is submittable; first place still cannot be guaranteed. The next best hardening was turning saved runs into student-authored impact evidence rather than adding more connector surface.
- Added `Portfolio Story Builder` inside Progress Portfolio. It waits for two saved runs, then gives prompts, evidence references, a draft starter with blanks, and an integrity boundary for a student-written progress story.
- Updated Progress Portfolio types/helper, UI, MCP payload preview, Judge Brief, AI Model Card, E2E coverage, unit tests, README, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, walkthrough script, screenshots, and public submission assets.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm`, then synced public submission assets. Walkthrough proof: 2:16.20, 13,961,925 bytes, 1440x900, SHA-256 `af3fa9db660a6e5664be72a34a1f377feba383899b8b8f1c9dfaddbc923e0ea2`.
- Latest verified production deployment: `dpl_E5WnWg47LNkGmnYP234gEv6mQbrw`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `templateCount: 8`, `evaluationPassed: 9`, and `mcpBridgeMode: server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run` with eight connector/toolkit routes; hosted slide deck returns HTTP 200 with content length `17676`; hosted walkthrough returns HTTP 200 with `video/webm` and content length `13961925`; public desktop/mobile Playwright smoke confirms Portfolio Story Builder reaches `Story ready` with no horizontal overflow.
- Fresh verification passed: `npm run test` (`63 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, local screenshot review, and public desktop/mobile Playwright smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio/OpenAI credentials only after explicit approval and consent.

## Composio Scholar Claim Checkpoint - 2026-07-06 PDT / 2026-07-07 UTC

- Council verdict after the Composio/MCP request: Ouija is submittable; first place still cannot be guaranteed. The practical improvement was a science-specific Composio Scholar claim-check route, not fake live OAuth execution.
- Added `composio-scholar-claim-check` as a ninth MCP connector route. It uses the Composio Search toolkit with `COMPOSIO_SEARCH_SCHOLAR`, requires `COMPOSIO_SEARCH_ALLOWED_TOOLS`, does not require an account auth config, and keeps consent plus server dry-run/session-ticket boundaries.
- Tightened the MCP bridge so duplicate Composio Search env vars are deduped in global missing-env output and session creation scopes each route to its intended tools.
- Updated MCP Integration Coach, readiness matrix, payload preview, Judge Brief, AI Model Card, API/serverless tests, E2E coverage, README, API/ENV/RUNBOOK docs, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, walkthrough script, screenshots, public assets, and submission-assets proof.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm`, then synced public submission assets. Walkthrough proof: 2:15.52, 14,135,505 bytes, 1440x900, SHA-256 `40fc1b28c57e219dc445206dc515bafffb17b3b44bcdc5344f668a47939f78a9`.
- Latest verified production deployment: `dpl_8T5UNx1NJd21Nbr9HfFaCoJwMM15`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/runtime-proof` returns `fallback_ready`, `templateCount: 8`, `evaluationPassed: 9`, and `mcpBridgeMode: server_dry_run`; `/api/evaluate` returns `100`, `9/9`, `pass`; `/api/mcp/status` returns `server_dry_run` with nine connector/toolkit routes including `composio-scholar-claim-check`; `/api/mcp/export` and `/api/mcp/session` for `composio-scholar-claim-check` return `dry_run`, `composio_search`, and `COMPOSIO_SEARCH_SCHOLAR`; hosted slide deck returns HTTP 200 with content length `17730`; hosted walkthrough returns HTTP 200 with `video/webm` and content length `14135505`.
- Public desktop/mobile Playwright smoke confirmed `Run Scholar claim check`, `9 connector routes checked`, Scholar dry-run validation, `COMPOSIO_SEARCH_SCHOLAR`, no console errors, and no horizontal overflow.
- Fresh verification passed: focused Vitest (`31 passed`), `npm run test` (`66 passed`), `npm run build`, `npm run test:e2e` (`8 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint checks, hosted asset checks, local screenshot review, and public desktop/mobile Playwright smoke.
- Remaining external loops: Devpost submission, 2-5 member team roster on Devpost, optional live Composio/OpenAI credentials only after explicit approval and consent.

## AIYES Values Fit Checkpoint - 2026-07-08

- Added typed `aiyesValuesFit` to `AnalyzeResult` for democracy, diversity, connectivity, innovation, and ethics/inclusion signals with scores, evidence, and student actions.
- Added the live `AIYES Values Fit` panel, top-nav anchor, Evidence Packet export section, Model Card safeguard, Judge Brief proof item, updated docs, slide deck, and walkthrough script.
- Refreshed screenshots, regenerated the hosted walkthrough at 4:29.88 / 269.88 seconds, 24,177,369 bytes, SHA-256 `16d7c6b4df8d739e31381c89f0b8ab17358d54b12a39b7a41dea8f637ad8ed3b`, and synced public submission assets.
- Deployed to `https://ouija-olive.vercel.app`; latest verified Vercel deployment ID is `dpl_7oNLvN1oHq5WXwjGgP2AHaYkFqmT`.
- Fresh verification passed: `npm run test` (66 passed), `npm run build`, `npm run test:e2e` (8 passed), `npm audit --json` (0 vulnerabilities), `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, public `/api/evaluate` (`100/100`, `9/9`), public `/api/analyze` with `aiyesValuesFit.score: 96`, hosted deck/video HTTP 200, and desktop/mobile public smoke with no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost team requirement ambiguity if enforced, and optional real OpenAI/Composio credentials only with explicit credential approval and consent/server setup.

## AIYES Development Journey Checkpoint - 2026-07-08

- Council verdict: Ouija works and remains submittable for AIYES Track 1. First place still cannot be guaranteed because judging, Devpost submission, and the team roster are external. The best practical hardening was not another fake live connector; it was making the required Track 1 development journey visible and inspectable in-app.
- Added typed `developmentJourney` to `AnalyzeResult`, with eight stages: problem identification, data handling, model selection/integration, application development, testing/evaluation, UX/design, ethics/impact, and constraints/submission. It recomputes for fallback analysis, OpenAI web-search enrichment, and table-row refresh.
- Added the live `AIYES Development Journey` panel, top-nav `Journey` anchor, Evidence Packet section, Model Card safeguard, Judge Brief proof item, updated docs/deck/copy/script/tests, and refreshed submission screenshots/video/public assets.
- Composio/MCP status after this pass: Ouija already has nine consent-gated Composio/MCP routes including Composio Search source audit and Scholar claim check, `/api/mcp/status`, `/api/mcp/export`, and scoped `/api/mcp/session`. Public mode remains credentials-safe server dry-run; live Composio should wait for explicit credentials and consent/server setup.
- Refreshed walkthrough proof: `docs/assets/ouija-walkthrough.webm`, 4:34.96 / 274.96 seconds, 24,966,897 bytes, SHA-256 `65c8bf2260b04b7d30139aac1ad7087d17a4921695e0c3cf0aaad122646a44e0`, synced to `public/submission/assets/ouija-walkthrough.webm`.
- Production: `dpl_7RBuYLSFNTMnYQjutM8H77EGCM3Z`, aliased at `https://ouija-olive.vercel.app`. Public proof: `/api/evaluate` returned `100/100` and `9/9`; public projectile `/api/analyze` returned `developmentJourney.score: 96` and 8 stages; `/api/mcp/status` returned `server_dry_run` with 9 routes; hosted slide deck returned HTTP 200 content length `18555`; hosted walkthrough returned HTTP 200 `video/webm` content length `24966897`; desktop/mobile public smoke confirmed all 8 journey stages and no horizontal overflow.
- Verification passed: `npm run test` (66 passed), `npm run build`, `npm run test:e2e` (8 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, production deploy, public endpoint/asset checks, and public desktop/mobile Playwright smoke.
- Remaining external loops: actual Devpost submission, Devpost 2-5 student team roster ambiguity, optional real OpenAI web-search enrichment only with explicit API-key approval, and optional live Composio credentials only after consent/server setup.

## Pattern Archetype Coach Checkpoint - 2026-07-08 PDT / 2026-07-09 UTC

- Council verdict after re-checking the Composio/MCP request: Ouija works and is submittable. First place still cannot be guaranteed because judging, team roster, and Devpost submission are external; the strongest next practical improvement was broader unsupported-lab usefulness rather than pretending another live connector is configured.
- Added typed `CustomPatternArchetype` support inside `CustomLabTriage`. Unsupported labs now infer comparison, trend, optimum, time-series, or teacher-review graph archetypes with confidence, graph suggestion, expected pattern wording, axes, repeat advice, source question, and student check.
- Paper towel absorbency now returns a high-confidence `comparison` archetype: bar chart by paper towel brand/type, average water absorbed on the y-axis, repeat-trial warning, and a source question about comparing group averages and controls.
- Added the live `Pattern Archetype Coach` panel inside Custom Lab Triage, plus Evidence Packet export content, MCP payload preview source-question section, Evaluation Bench evidence, Official Rubric Fit evidence, AIYES Values Fit evidence, E2E/API/unit coverage, README/API/Devpost/AIYES brief/judging checklist/slide deck/demo script updates, and refreshed screenshots/video/public assets.
- Composio/MCP status after this pass: Ouija already has ten consent-gated MCP routes, including Composio Search source audit, Composio Scholar claim check, Composio Browser source capture, Google Workspace/Classroom/Forms/Calendar, and Notion. Composio discovery showed Semantic Scholar would require an active connection, so live external execution remains credentials-safe server dry-run until explicit setup and consent.
- Refreshed walkthrough proof: `docs/assets/ouija-walkthrough.webm`, 2:25.28 / 145.28 seconds, 14,658,970 bytes, 1440x900, SHA-256 `0fd14eeb0db268f4b8f84eefbc67d74265cebd885631ea84ae1e7076b5d8d1a9`; synced to `public/submission/assets/ouija-walkthrough.webm`. Public submission slide deck size is `18956`, and custom-triage screenshot size is `3219914`.
- Production: `dpl_CBMxPk4uE5eyQF1keHepSD1qZzaA`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/evaluate` returns `100`, `9/9`, `pass`, with `Comparison experiment custom pattern archetype` in the unsupported boundary case; `/api/runtime-proof` returns `fallback_ready`, eight templates, `9/9`, and `server_dry_run`; `/api/mcp/status` returns server dry-run with 10 connector routes; hosted walkthrough returns HTTP 200 with `video/webm` and `content-length: 14658970`; public `/api/analyze` for paper towel absorbency returns `matchQuality: closest_supported`, `patternArchetype.id: comparison`, and graph suggestion `Bar chart by paper towel brand or type`.
- Public desktop/mobile Playwright smoke confirmed Pattern Archetype Coach is visible with `Comparison experiment`, no console errors, and no horizontal overflow.
- Fresh verification passed: `npm run test` (68 passed), `npm run build`, `npm run test:e2e` (9 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint/asset checks, and public desktop/mobile Playwright smoke.
- Remaining external loops: actual Devpost submission, Devpost 2-5 student team roster ambiguity, optional real OpenAI web-search enrichment only with explicit API-key approval, and optional live Composio credentials only after consent/server setup.
