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

### AI Architecture Map

The judge-visible system-design layer. It makes Ouija's AI path readable as intake, template classifier, grounding, data engine, learning guard, and evidence bridge, with explicit inputs, outputs, and evaluation contracts. It exists to strengthen AIYES Track 1 architecture clarity without adding more student-facing clutter.

### UX and Accessibility Proof

The judge-visible official User Experience and Design evidence layer. It stays hidden in default Student mode, then appears in Judge mode to show student-first workflow, judge scan path, responsive layout, accessible labels, clickable citations, and integrity-by-design prompts without cluttering the live lab workflow.

### AIYES Submission Gate

The judge-visible Devpost requirement gate. It converts eligibility, Track 1 fit, slide deck, walkthrough video, source/deploy link, problem/impact, AI design, and UX requirements into pass, review, or external statuses so submittability is auditable instead of only described in prose.

### Composio Browser Source Capture

The newest MCP route in the server dry-run bridge. It adds `composio-browser-source-capture` for public source-page context capture through Composio Browser Tool (`BROWSER_TOOL_CREATE_TASK`, `BROWSER_TOOL_WATCH_TASK`). It is source-context support only; it must not browse private accounts, write the student's final claim, or run live without server-side credentials, allowed tools, and explicit consent.

### Semantic Scholar Reference Check

The Composio-backed scientific source route. It adds `semanticscholar-reference-check` through Semantic Scholar tools (`SEMANTICSCHOLAR_SEARCH_PAPERS`, `SEMANTICSCHOLAR_GET_DETAILS_FOR_MULTIPLE_PAPERS_AT_ONCE`) so Ouija can inspect structured paper metadata and abstracts for experiment background without writing student conclusions or claiming a live connection before credentials exist.

### Canvas Assignment Context

The read-only classroom context route. It adds `canvas-assignment-context` through Canvas tools (`CANVAS_LIST_COURSES`, `CANVAS_LIST_PLANNER_ITEMS`, `CANVAS_GET_ASSIGNMENT2`, `CANVAS_GET_ASSIGNMENT_RUBRIC`) so a future consented session can import lab prompts, due dates, attached material metadata, and rubric criteria without submitting work, editing grades, or accessing private courses without explicit auth and consent.

### Gmail Teacher Review Draft

The consent-gated teacher-feedback route. It adds `gmail-teacher-review-draft` through Gmail draft creation (`GMAIL_CREATE_EMAIL_DRAFT`) so a future consented session can prepare an unsent teacher-review email asking for feedback on variables, controls, source trust, safety, data flags, and claim blanks. It must not send email automatically, read inbox content, delete messages, collect direct identifiers by default, or write the student's final conclusion.

### Google Slides Submission Deck Draft

The consent-gated AIYES presentation route. It adds `google-slides-submission-deck` through Composio's Google Slides toolkit (`GOOGLESLIDES_CREATE_SLIDES_MARKDOWN`, `GOOGLESLIDES_CREATE_PRESENTATION`, `GOOGLESLIDES_PRESENTATIONS_BATCH_UPDATE`) so a future consented session can turn the student-owned evidence packet, citations, proof links, and blank claim starter into an editable deck draft. It must not submit the presentation, share it publicly, or write the student's final conclusion or reflection answers.

### Composio Sessions Strategy

The judge-visible MCP planning layer that turns Ouija's connector story into scoped sessions instead of a vague integration list. The first planned session is read-only source verification across Composio Search, Semantic Scholar, Composio Browser, and DeepWiki public-source proof. A separate read-only assignment context session targets Canvas lab prompts/rubrics. Later student export sessions are consent-gated and can target Google Docs, Google Slides, Sheets, Drive, Classroom, Forms, Calendar, Gmail draft, and Notion only after server-side credentials, allowed tools, auth config, and consent are in place.

### Pilot Evidence Tracker

The browser-local student-testing evidence layer. It logs anonymous pilot observations for time to first graph, confidence before/after, issue spotting, exit-ticket readiness, and non-identifying notes. It starts empty with an explicit no-fake-testing warning and must not collect names, grades, faces, contact info, or private classroom details.

### Pilot Evidence Export

The copyable evidence handoff inside Pilot Evidence Tracker. It turns browser-local anonymous observations into a CSV-ready summary for Devpost, Sheets, Forms, or Notion and redacts direct contact strings before sharing, while still warning the team to review notes and avoid fake completed user-testing claims.

### Student Impact Brief

The first-scroll real-world relevance layer. It names the target student, lab-reasoning pain point, before/after benefit, why AI helps, evidence basis, and remaining anonymous-pilot proof gap before judges reach the deeper technical proof stack.

### Submission Hub

The one-click judge packet at `https://ouija-olive.vercel.app/submission/`. It gathers the live app, Judge view, slide deck, walkthrough, source code, screenshots, and public proof endpoints so Devpost judges do not have to hunt through README links or app panels.

## Product Boundaries

- Ouija should not become a teacher grading dashboard.
- Ouija should not write complete lab reports for students.
- Ouija should focus on learning, data checking, graphing, safety awareness, and reasoning support.
- Ouija should support broad student science experiments, but V1 should still use a small set of reliable demo experiments instead of claiming perfect coverage.
- Ouija's V1 coverage should be middle/high school science experiments.
- Ouija's first supported set should balance physics, chemistry, biology, and earth science instead of overfitting to physics.
- Ouija should support table input first before adding CSV upload or photo/OCR input.
- Ouija's internet search should ground expected results and explanations in referenced content instead of inventing them from the model alone.

## Composio Source Scout July 18 Production Refresh - 2026-07-18

- Council verdict: Ouija has reached a submittable stage for AIYES Track 1: the live app, source, hosted deck, hosted walkthrough, submission hub, Devpost pack, source ZIP fallback, Source Scout receipts, and judge proof surfaces are deployed and verified. First place/Gold still cannot be guaranteed because final judging, actual Devpost submission, final eligible 2-5 student roster/form behavior, real anonymous pilot observations, optional DeepWiki indexing, and optional live OpenAI/Composio credential setup remain external.
- Devpost MCP read-only checks on 2026-07-18 confirmed AIYES submissions are open through September 1, 2026 at 12:00 PM PDT, judging runs September 2-19, 2026, winners are announced September 20, 2026, Track 1 is judged on problem/relevance, AI technical design/model strategy, and UX/design, and deliverables include video plus ZIP metadata. `_list_my_projects` did not show Ouija yet, so Devpost project creation/submission is still external.
- Composio Search refreshed the judge-visible source proof: the app now shows July 18 Source Scout receipts and clickable links for the official AIYES/Devpost source path plus classroom-safe references for projectile motion, reaction rates, enzyme activity, and water filtration/turbidity. Semantic Scholar was not connected, and the public DeepWiki route still honestly says `rushtanu14/ouija` needs indexing before live architecture proof is claimed.
- Implementation changes: typed MCP proof links in `src/lib/types.ts`, July 18 proof receipts in `src/lib/mcpIntegrationPlan.ts`, receipt-link rendering in `src/App.tsx`, link styling in `src/styles.css`, updated E2E/submission tests, refreshed submission docs and public pages, regenerated the walkthrough, and switched Playwright webServer from `npm run dev:server` to `npm run serve:api` so the E2E harness no longer depends on `tsx watch` startup.
- Walkthrough proof: `docs/assets/ouija-walkthrough.webm` and `public/submission/assets/ouija-walkthrough.webm`, 1440x900, 238.00 seconds, 24,123,761 bytes, SHA-256 `73653219da2e69d998cc337920af8a77b7d35d52ba2d525151d620479618dcb2`.
- Verification: focused MCP/submission Vitest (`2` files / `7` tests), `npm run record:walkthrough`, `npm run sync:public-submission`, `npm run test` (`16` files / `100` tests), `npm run build` with the known Vite chunk-size warning, `npm run test:e2e` (`40` passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --audit-level=moderate` (`0` vulnerabilities), and `git diff --check`.
- Production: the `https://ouija-olive.vercel.app` alias reflects the July 18 Source Scout refresh after `main` deployments pass. Hosted smoke passed for `/api/evaluate` (`score: 100`, `9/9`), `/api/mcp/status` (`server_dry_run`), `/api/runtime-proof` (`fallback_ready`, `9/9`), `/submission/` size `9606`, `/submission/devpost-pack.html` size `14577`, `/submission/slide-deck.html` size `23363`, walkthrough HEAD `content-length: 24123761`, GitHub source ZIP download `200` / `80420753` bytes, and desktop/mobile Judge-mode browser smoke with Reaction Rate, Official AIYES Rules Snapshot, Source Scout classroom-lab receipt, no horizontal overflow, and zero console/page errors.
- Remaining external loops: create/submit Ouija on Devpost, handle the final eligible 2-5 student roster/form requirement, gather real anonymous pilot observations if the team wants stronger impact proof, optionally index DeepWiki, and optionally configure live OpenAI/Composio credentials only with explicit consent/server setup.

## AIYES Rules Snapshot 84-Participant Refresh - 2026-07-17

- Council verdict: Ouija works and remains submittable/Gold-competitive for AIYES Track 1, but first place cannot be guaranteed because judging, final Devpost submission, final roster behavior, optional DeepWiki indexing, and real anonymous pilot observations remain external.
- Live AIYES Devpost recheck on 2026-07-17 now shows `Participants (84)` / `84 participants`, and production now reflects the 84-participant snapshot.
- Devpost MCP read-only check on 2026-07-17 confirmed submissions are open, the judging criteria are problem/relevance, AI/model strategy, and UX/design, and deliverable metadata can require both a video and a ZIP. Added a visible GitHub main-branch source ZIP fallback at `https://github.com/rushtanu14/ouija/archive/refs/heads/main.zip` across Submission Gate, Judge Brief, Submission Hub, Devpost pack, docs, and tests.
- Updated the app, E2E expectations, recording script, README, submission docs, public submission pages, and Devpost copy to `July 17, 2026` and `84 participants shown on Devpost`, preserving the student-only scope, Pilot Protocol, Source Proof Receipts, and no-fake-pilot-evidence boundaries.
- Regenerated the walkthrough against `http://127.0.0.1:5188`; video proof is 1440x900, 277.84 seconds, 28,485,173 bytes, SHA-256 `fdc7f98e8580caf8ed3767a5b46d5a922a52e08732874a6c2ad2b545ec70b4ab`, synced to `public/submission/assets/ouija-walkthrough.webm`.
- Verification: `npm run test -- tests/submissionAssets.test.ts`, focused Chromium Judge/Submission Gate E2E (2 passed), `npm run test` (15 files, 99 tests), `npm run build`, `npm run test:e2e` (40 passed after serializing Playwright workers for stability), `npm audit --audit-level=moderate` (0 vulnerabilities), `git diff --check`, production deploy `dpl_2pHrqMjrvt22BE1sHuuA3Stczfde`, and hosted smoke for `/api/mcp/status`, `/api/runtime-proof`, `/api/evaluate`, submission hub size `9576`, Devpost pack size `14470`, slide deck size `23298`, walkthrough HEAD `content-length: 28485173`, GitHub source ZIP HEAD `200`, desktop Judge mode, and mobile Judge mode.
- Remaining loops: actual Devpost submission, final eligible 2-5 student roster/form behavior, real anonymous pilot observations, optional DeepWiki indexing, and optional live OpenAI/Composio credentials only with explicit consent/server setup.

## Pilot Protocol Hardening Checkpoint - 2026-07-17

- Council verdict: Ouija works and is still submittable/Gold-competitive for AIYES Track 1, but first place cannot be guaranteed because judging, final Devpost submission, roster behavior, optional DeepWiki indexing, and real anonymous pilot observations remain external.
- Live AIYES Devpost recheck on 2026-07-17 showed the September 1 2026 deadline, ages 13-18, students only, 2-5 team requirement, Track 1 app/deck/video/source-or-deploy requirements, judging criteria, Gold/Silver/Bronze/Honorable Mention certificate framing, and 84 participants.
- Highest controllable gap this pass: the app had a Student Pilot Study Kit and Pilot Evidence Tracker, but judges needed a formal protocol they could inspect before real student observations exist.
- Added a typed `Pilot Protocol` inside Student Pilot Study Kit with research question, three-session sample plan, run script, success thresholds, consent stop rules, and analysis plan. The Evidence Packet now exports the same protocol, and docs/deck/submission copy name the run script, thresholds, and stop rules.
- Regenerated the walkthrough against `http://127.0.0.1:5188`; superseded by the 84-participant refresh video proof above.
- Verification: focused unit/API/evidence/submission tests (71 passed), focused Chromium E2E (1 passed), `npm test` (15 files, 98 tests), `npm run build`, `npm run test:e2e` (40 passed), `npm audit --audit-level=moderate` (0 vulnerabilities), `git diff --check`, production deploy `dpl_6t6Fr72H8QtAcd51DfGe3HguyLQk`, live `/api/mcp/status`, `/api/runtime-proof`, `/api/evaluate`, submission hub, Devpost pack, slide deck, video HEAD `content-length: 23795526`, and hosted desktop/mobile browser smoke for Pilot Protocol, Source Proof Receipts, DeepWiki indexing receipt, prior rules snapshot, no horizontal overflow, and zero console errors. Superseded by 84-participant deployment `dpl_Bbn8ySJ38Zd1LpkWHgA6JZtCVjg9`.
- Remaining loops: actual Devpost submission, final eligible 2-5 student roster/form behavior, real anonymous pilot observations, optional DeepWiki indexing, and optional live OpenAI/Composio credentials only with explicit consent/server setup.

## AIYES Rules Snapshot 83-Participant Local Refresh - 2026-07-16

- Council verdict: the useful overnight slice was a judge-packaging freshness fix, not another feature. The public AIYES Devpost page now shows `Participants (83)` / `83 participants`, while the local app and submission packet still had the July 15 / 76-participant snapshot.
- Updated the local Official AIYES Rules Snapshot, submission docs, public submission pages, E2E expectations, and recording script to `July 16, 2026` and `83 participants shown on Devpost` while preserving student-only scope, academic-integrity limits, honest fallback/MCP proof, and no-fake-pilot-evidence boundaries.
- Regenerated the local walkthrough against `http://127.0.0.1:5188` so the video proof uses the July 16 rules snapshot instead of the stale hosted deployment. Video proof: 1440x900, 235.68 seconds, 23,795,526 bytes, SHA-256 `7f1516f9d3da6dc857f2af35d371e1fbc36ac2784485f359be88404b24b66b5b`; synced to `public/submission/assets/ouija-walkthrough.webm`.
- Verification: public Devpost read on 2026-07-16 showed ages 13-18, students only, 2-5 team requirement, September 1 2026 12:00 PM PDT deadline, Track 1 slide/video/source or deploy artifacts, Gold/Silver/Bronze/Honorable Mention certificates, judging criteria, and 83 participants. Local gates passed: focused submission/MCP tests (6 passed), `npm test` (15 files, 98 tests), `npm run build`, `npm run test:e2e` (40 passed after installing missing Playwright Firefox/WebKit browsers), `npm audit --audit-level=moderate` (0 vulnerabilities), and `git diff --check`.
- Production: `dpl_8FxVGmB1E9bmcBkm45XJMscA66dT`, aliased to `https://ouija-olive.vercel.app`; superseded on 2026-07-17 by `dpl_6t6Fr72H8QtAcd51DfGe3HguyLQk`.
- Scope boundary: no Devpost submission, team-roster change, credential configuration, or live Composio export was performed.

## Composio Source Proof Receipt Checkpoint - 2026-07-15

- Council verdict: Ouija still works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed first place/Gold because judging, final Devpost submission, final eligible roster behavior, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after Team Readiness: the app had a broad Composio/DeepWiki MCP story, but judges needed a live, honest source-proof receipt instead of more connector names.
- Composio live discovery on 2026-07-15 found active no-auth `composio_search` and `deepwiki_mcp`; Composio Search returned the official AIYES Devpost/AIYES source path for ages 13-18, Track 1, 2-5 team, September 1 2026 deadline, deck, video, and source/deploy requirements.
- DeepWiki MCP returned `Repository not found. Visit https://deepwiki.com to index it. Requested repo: rushtanu14/ouija`, so Ouija now shows a `DeepWiki public repo check` receipt with `Needs indexing` instead of claiming live DeepWiki architecture proof before the repo is indexed.
- Added `Source Proof Receipts` inside MCP Integration Coach, updated the MCP payload preview, type model, styles, unit/E2E/submission tests, README, API docs, AIYES brief, Devpost copy, slide deck, judging checklist, five-minute script, submission hub, Devpost pack, public submission assets, and walkthrough caption.
- Regenerated `docs/assets/ouija-walkthrough.webm` and synced `public/submission/assets/ouija-walkthrough.webm`; proof is 1440x900, 245.72 seconds, 24,735,459 bytes, SHA-256 `fc25d75344f90b8d6ddb4342794e385a9bc04143e883fdebb0d548291ff09b99`.
- Production: `dpl_2eQosMLxPLYQ46xpfD7dvS2fcRAZ`, aliased to `https://ouija-olive.vercel.app`; superseded on 2026-07-16 by `dpl_8FxVGmB1E9bmcBkm45XJMscA66dT`.
- Verification: Composio Search/DeepWiki tool pass; focused MCP unit test (3 passed); focused Source Proof Receipt E2E (4 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run record:walkthrough` against local current build; `ffprobe`; SHA-256 check; `npm run sync:public-submission`; production deploy; live `/api/mcp/status` (200, `server_dry_run` and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready` and `9/9`); live `/api/evaluate` (200, score `100`); hosted submission pages contain Source Proof Receipts, DeepWiki indexing receipt, and current hash; hosted walkthrough HEAD returned `content-length: 24735459`; hosted desktop/mobile Playwright smoke confirmed Source Proof Receipts, DeepWiki indexing receipt, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## AIYES Team Readiness Worksheet Checkpoint - 2026-07-15

- Council verdict: Ouija still works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed first place/Gold because judging, final Devpost submission, final eligible roster behavior, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after the 76-participant refresh: the app honestly marked the listed 2-5 student team requirement as external, but did not help the team prepare that requirement inside the judge workflow.
- Added `AIYES Team Readiness Worksheet` in Judge mode with anonymous Member 1-5 slots, role coverage, age/student eligibility checks, guardian/teacher okay checks, Devpost account/invite readiness, a copyable no-PII worksheet summary, and a clear boundary that final roster entry still happens on Devpost.
- Updated Top Award Radar, AIYES Submission Gate, Demo Rehearsal, Judge Brief, README, AIYES brief, slide deck, Devpost copy, submission hub, Devpost pack, five-minute script, judging checklist, public submission pages, E2E coverage, submission asset tests, and walkthrough recording script.
- Regenerated `docs/assets/ouija-walkthrough.webm` and synced `public/submission/assets/ouija-walkthrough.webm`; proof-frame check at `/tmp/ouija-team-proof/frame-168.png` confirmed `AIYES TEAM READINESS WORKSHEET` at caption `41/56`.
- Video proof: 1440x900, 236.84 seconds, 23,141,674 bytes, SHA-256 `339afb649cae9a5b6ac3a666434ef136e038e93c8f4123b5323b37ca9bb2c1cd`.
- Production: `dpl_61TwVjfaKNPxsbphggewKnc6kXjF`, aliased to `https://ouija-olive.vercel.app`.
- Verification: current AIYES/Devpost search rechecked on 2026-07-15 and still showed 76 participants; focused submission asset test (3 passed); focused Team/award E2E (8 passed); first broad E2E rerun (4 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run record:walkthrough`; `ffprobe`; SHA-256 check; proof-frame extraction; `npm run sync:public-submission`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, 15 routes and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready`, `9/9`); live `/api/evaluate` (200, score `100`); hosted walkthrough HEAD (200, `content-length: 23141674`); hosted submission pages contain Team Readiness, 76-participant proof, and final hash; hosted desktop/mobile Playwright smoke confirmed Team Readiness, No PII boundary, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## AIYES Rules Snapshot 76-Participant Refresh - 2026-07-15

- Council verdict: Ouija still works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed first place/Gold because judging, final Devpost submission, eligible team roster, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after the walkthrough proof refresh: the live Devpost participant snapshot moved from 74 to 76, making the judge-visible rules snapshot stale.
- Updated Official AIYES Rules Snapshot across the app, README, AIYES brief, slide deck, Devpost copy, judging checklist, five-minute demo script, submission hub, Devpost pack, public submission pages, E2E checks, and submission asset tests to `July 15, 2026` and `76 participants`.
- Regenerated `docs/assets/ouija-walkthrough.webm` from the current local app and synced `public/submission/assets/ouija-walkthrough.webm` so the hosted video proof now visibly says `76 participants`; proof-frame check confirmed the Official AIYES Rules Snapshot caption at 41/55.
- Video proof: 1440x900, 232.20 seconds, 22,224,667 bytes, SHA-256 `6facd5c0a636461b364523f78315f99da71d02a0b9d8ed74d0b438e1d05b15c2`.
- Production: `dpl_2YmEoJhRbQBf9cQxE8zgHbx1UJQk`, aliased to `https://ouija-olive.vercel.app`.
- Verification: current AIYES/Devpost search rechecked on 2026-07-15 and showed 76 participants; `npm run record:walkthrough`; `ffprobe`; SHA-256 check; proof-frame extraction; `npm run sync:public-submission`; focused `tests/submissionAssets.test.ts` (3 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, 15 routes and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready`, `9/9`); live `/api/evaluate` (200, score `100`); hosted submission hub/Devpost pack/slide deck (200 with July 15 / 76-participant proof); hosted walkthrough HEAD (200, `content-length: 22224667`); hosted desktop/mobile Playwright smoke confirmed Reaction Rate, the 76-participant Rules Snapshot, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## AIYES Walkthrough Proof Refresh - 2026-07-14 PDT

- Council verdict: Ouija still works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed first place/Gold because judging, final Devpost submission, eligible team roster, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after Judge Q&A Prep: the required walkthrough video still carried the older 3:48 proof path and did not visibly include the newest Official AIYES Rules Snapshot, AIYES Demo Rehearsal, and AIYES Judge Q&A Prep surfaces.
- Regenerated `docs/assets/ouija-walkthrough.webm` and synced `public/submission/assets/ouija-walkthrough.webm` so the hosted video now includes the Q&A proof section, rules snapshot, and demo rehearsal while staying under the five-minute cap.
- Video proof: 1440x900, 243.24 seconds, 25,445,715 bytes, SHA-256 `4bf155eb2b3e5936f96b2cdbf9998b5521d839f7aca34afe68e2d0700aa89817`; visual frame check confirmed `AIYES JUDGE Q&A PREP` at caption 43/55.
- Stabilized the Playwright race test by stubbing deterministic `/api/analyze` responses and using a direct textarea locator for the Firefox pilot-note path, removing the flaky server-delay dependency.
- Production: `dpl_2zGHbeqSJsxr3y8yz8BR41v9z4X8`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run record:walkthrough`; `ffprobe`; SHA-256 check; proof-frame extraction; `npm run sync:public-submission`; focused `tests/submissionAssets.test.ts` (3 passed); focused Playwright reruns for the prior Firefox/WebKit/mobile failures; `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, 15 routes and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready`, `9/9`); live `/api/evaluate` (200, score `100`); hosted submission hub/Devpost pack/slide deck (200 with refreshed proof labels); hosted walkthrough HEAD (200, `content-length: 25445715`); hosted desktop/mobile Playwright smoke confirmed Reaction Rate, AIYES Judge Q&A Prep, rules snapshot, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## AIYES Judge Q&A Prep And Rules Snapshot Refresh - 2026-07-14 PDT

- Council verdict: Ouija still works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed to win because judging, final Devpost submission, eligible team roster, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after Demo Rehearsal: live judging still needed one compact panel that turns likely questions into proof-backed answers instead of scattered feature claims.
- Added `AIYES Judge Q&A Prep` in Judge mode with proof-backed answers for problem relevance, AI depth, academic integrity, student UX, validation limits, and remaining external claims. It explicitly blocks promises of a Gold result, fake pilot data, or live connector access before credentials and consent exist.
- Refreshed the current AIYES snapshot to the July 14, 2026 Devpost state showing 74 participants, September 1, 2026 12:00 PM PDT deadline, ages 13-18/student-only eligibility, the listed 2-5 team requirement plus individual/team wording caveat, Track 1 artifacts, judging criteria, award bands, and source link.
- Updated README, AIYES brief, Devpost copy, judging checklist, five-minute script, slide deck, submission hub, Devpost pack, public submission pages, `docs/submission-assets.md`, E2E coverage, and submission asset tests.
- Production: `dpl_6RBBuc3U1xFcYAGAdDmehSZTe6tB`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-14; focused submission asset test (3 passed); focused Chromium Q&A/rules E2E (3 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run sync:public-submission`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, at least 15 toolkits/routes and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready`, `9/9`); live `/api/evaluate` (200, score `100`); hosted submission hub/Devpost pack/slide deck (200 with AIYES Judge Q&A Prep and 74-participant snapshot); hosted desktop/mobile Playwright smoke confirmed AIYES Judge Q&A Prep, rules snapshot, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## AIYES Demo Rehearsal And Rules Snapshot Refresh - 2026-07-14 PDT

- Council verdict: Ouija works, is submittable, and is Gold-competitive for AIYES Track 1, but cannot be guaranteed to win because judging, final Devpost submission, eligible team roster, and real anonymous pilot observations remain external.
- Highest-leverage controllable gap after Source Scout: Track 1 requires a slide presentation and up-to-5-minute video walkthrough/live demo, but the live app did not yet give judges a timed proof path for that required artifact.
- Added `AIYES Demo Rehearsal` in Judge mode with a `4:45` sequence for problem relevance, AI design, live student workflow, evaluation/integrity, and submission proof, while preserving the no-final-lab-report boundary.
- Refreshed the current AIYES snapshot to the July 14, 2026 Devpost state showing 74 participants, September 1, 2026 12:00 PM PDT deadline, ages 13-18/student-only eligibility, the listed 2-5 team requirement plus individual/team wording caveat, Track 1 artifacts, judging criteria, award bands, and source link.
- Updated README, AIYES brief, Devpost copy, judging checklist, five-minute script, slide deck, submission hub, Devpost pack, public submission pages, `docs/submission-assets.md`, E2E coverage, and submission asset tests.
- Production: `dpl_FvzPYRELgX7p4yfRbWzfHfpcSQ3k`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-14; focused submission asset test (3 passed); focused Chromium Demo Prep/rules E2E (3 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run sync:public-submission`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, at least 15 toolkits/routes and Composio Search proof); live `/api/runtime-proof` (200, `fallback_ready`, `9/9`); live `/api/evaluate` (200, score `100`); hosted submission hub/Devpost pack/slide deck (200 with AIYES Demo Rehearsal and 74-participant snapshot); hosted desktop/mobile Playwright smoke confirmed AIYES Demo Rehearsal, 4:45 proof path, rules snapshot, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## Composio Source Scout And AIYES Snapshot Checkpoint - 2026-07-14 PDT

- Council verdict: Ouija remains submittable and Gold-competitive for AIYES Track 1, but no app change can guarantee first place because judging, final Devpost submission, eligible team roster, and real anonymous pilot observations are external.
- Highest-leverage controllable gap after the Google Slides route: the app already had many Composio/MCP routes, so the useful improvement was not another export badge. It was making the read-only source-verification path judge-visible and grounding it in actual Composio tool discovery.
- Added `Composio Source Scout` inside MCP Integration Coach. It shows a verified read-only Composio Search/Browser chain: `COMPOSIO_SEARCH_WEB`, `COMPOSIO_SEARCH_FETCH_URL_CONTENT`, `COMPOSIO_SEARCH_SCHOLAR`, then `BROWSER_TOOL_CREATE_TASK`/`BROWSER_TOOL_WATCH_TASK` for public dynamic pages. The card names the student-reviewed query, output contract, and data boundary: no raw table rows, saved reflections, identifiers, or final claims.
- Refreshed `Official AIYES Rules Snapshot` to the July 14, 2026 Devpost check, including the 74-participant snapshot, September 1, 2026 12:00 PM PDT deadline, ages 13-18/student-only eligibility, listed 2-5 team requirement plus individual/team wording caveat, Track 1 artifacts, judging criteria, award bands, and source link.
- Updated README, API docs, AIYES brief, Devpost copy, judging checklist, five-minute script, slide deck, submission hub, Devpost pack, public submission pages, typed MCP plan/tests, and E2E coverage.
- Production: `dpl_9DkhhjaGjQQPW4cjyWRSqp7ojyj7`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-14; Composio discovery found active no-auth `composio_search` and `browser_tool` toolkits; focused MCP/API/serverless tests (3 files, 50 tests); focused Chromium Source Scout/rules E2E (3 passed); `npm run test` (15 files, 98 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run sync:public-submission`; production deploy; live `/api/mcp/status` (200, `server_dry_run`, 15 routes, Composio Search docs link, Search tools present); live `/api/runtime-proof` (200, `fallback_ready`, `server_dry_run`, `9/9`); live `/api/evaluate` (200, score `100`); hosted submission hub/Devpost pack/slide deck (200 with Source Scout, July 14, and participant snapshot copy); hosted desktop/mobile Playwright smoke confirmed Source Scout, rules snapshot, no horizontal overflow, and zero console/page errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## Official AIYES Rules Snapshot Checkpoint - 2026-07-13 PDT

- Council verdict: Ouija works, is submittable, and is Gold-competitive for AIYES Track 1, but no app change can guarantee Gold or first place because judging, final Devpost submit, team roster, and real pilot observations remain external.
- Highest-leverage controllable gap after the pilot evidence quality gate: judges needed the current official AIYES constraints visible inside Judge mode instead of scattered across docs.
- Added `Official AIYES Rules Snapshot` in Judge mode with verified source date, Devpost source link, ages 13-18/student-only eligibility, listed 2-5 team requirement plus individual/team wording caveat, September 1, 2026 12:00 PM PDT deadline, Track 1 artifacts, judging criteria, and Gold/Silver/Bronze/Honorable Mention award bands.
- Added Judge navigation, responsive styles, desktop overflow protection for narrow Judge-mode cards, E2E coverage, README/Devpost/brief/deck/script/checklist/submission-hub/submission-pack updates, public asset sync, and stale walkthrough-label tests.
- Production: `dpl_7mgvygcDqGr2WtekRNa8WycGEVm5`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-13; focused static and Chromium E2E checks; `npm run test` (15 files, 95 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/evaluate` (200, score 100); live `/api/runtime-proof` (200, `fallback_ready`, `server_dry_run`); live `/api/mcp/status` (200, `server_dry_run`, 14 routes); hosted submission pages (200 with rules snapshot and current video proof); hosted desktop browser smoke confirming rules snapshot content, Devpost source link, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final eligible student roster/form behavior, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## Gold Award Framing Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable/award-competitive, but a guaranteed first-place claim is impossible and mismatched to AIYES because the live Devpost page frames awards as Gold, Silver, Bronze, and Honorable Mention certificates.
- Highest-leverage controllable gap after Gmail MCP: the live app still used first-place language without showing the official award-band structure. That could make the pitch sound less tailored to AIYES.
- Updated Top Award Radar with an `Official AIYES award target` section that names Gold/Silver/Bronze/Honorable Mention, positions Ouija as targeting Gold-level evidence, and ties the Gold target to the three official criteria: problem relevance, AI/model strategy, and UX/design.
- Updated README, Devpost copy, AIYES brief, slide deck, five-minute demo script, judging checklist, public submission assets, and E2E/submission asset tests so the external packet matches the live app.
- Production: `dpl_3xb2mkkWVt9dBX3RWmVX9iULAzSg`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-13; focused submission asset test; focused Chromium award radar E2E; `npm run test` (15 files, 94 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/evaluate` (200, score 100); live `/api/mcp/status` (200, `server_dry_run`, 14 routes, Gmail route present); live `/api/runtime-proof` (200); hosted submission pages (200 with official award-band deck copy); and hosted desktop/mobile Playwright smoke confirming the official award-band target, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## Pilot Evidence Quality Gate Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija still works and is submittable/award-competitive, but not guaranteed Gold because judging, final Devpost submission, team roster, and actual student pilot observations are external.
- Highest-leverage controllable gap after award framing: anonymous pilot evidence could be filled with shallow rows, so judges still needed a visible reason to trust whether pilot evidence was submission-ready.
- Added a `Pilot evidence quality gate` inside Pilot Evidence Tracker. It scores evidence out of 100 across three anonymous observations, time-to-graph, paired confidence before/after, issue/reflection signals, and privacy scan status.
- Top Award Radar now treats impact evidence as strong only when the quality gate reaches `Submission ready`; one complete anonymous observation is capped at `80/100` and stays `Review before claiming`.
- Evidence Packet and CSV export now include quality status, quality score, quality checks, and direct-identifier risk count while keeping the browser-local/no-fake-testing boundary.
- Updated README, Devpost copy, AIYES brief, slide deck, five-minute demo script, judging checklist, public submission assets, recording script, unit tests, E2E tests, and submission asset tests.
- Regenerated the walkthrough video so it visibly shows the Pilot Evidence Quality Gate and quality-aware CSV export. Video proof: 1440x900, 228.92 seconds, 24,090,761 bytes, SHA-256 `1c3221d19508b61f7ddb86631a1d481549f2058188a349ba92b7c2828eb0e8f0`.
- Production: `dpl_CiAYrCC59JKSvNpicwDuKduUvG2g`, aliased to `https://ouija-olive.vercel.app`.
- Verification: focused pilot-evidence and submission-asset tests; focused Chromium quality-gate and Top Award Radar E2E; `npm run test` (15 files, 95 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/evaluate` (200, score 100, 9 cases); live `/api/mcp/status` (200, `server_dry_run`, 14 routes); live `/api/runtime-proof` (200, `fallback_ready`, `server_dry_run`); hosted submission pages (200 with quality-gate deck copy); hosted walkthrough HEAD (200, `content-length: 24090761`); hosted desktop browser smoke confirming `80/100` Pilot Evidence Quality Gate, Top Award Radar `quality gate 80/100`, no horizontal overflow, and zero console errors.
- Remaining loops: actual Devpost submission, final 2-5 student team roster, real anonymous pilot observations, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing.

## Gmail Teacher Review MCP Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: this is a practical Composio upgrade, not connector decoration. Teacher-review drafting improves the student lab workflow because students often need feedback on variables, controls, source trust, safety, and evidence before writing a final claim.
- Added `gmail-teacher-review-draft` as the fourteenth consent-gated Composio/MCP route. It uses toolkit slug `gmail`, env suffix `GMAIL`, and recommended tool `GMAIL_CREATE_EMAIL_DRAFT`.
- Safety boundary: the route prepares an unsent Gmail draft only. It does not send email automatically, read inbox content, delete messages, include direct identifiers by default, or write the student's conclusion.
- Updated MCP Integration Coach, readiness matrix, payload preview, Composio Sessions strategy, AI Model Card, Judge Brief, AI Architecture Map, README, API/ENV/RUNBOOK docs, Devpost copy, AIYES brief, judging checklist, slide deck, five-minute script, submission hub, Devpost pack, public submission assets, and unit/API/serverless/E2E tests.
- Production: `dpl_6s2WzuL4hUoEJZas4WeY3L4dRfQe`, aliased to `https://ouija-olive.vercel.app`.
- Verification: Composio tool discovery for Gmail draft creation, focused MCP/API/submission tests (4 files, 50 tests), `npm run test` (15 files, 94 tests), `npm run build`, `npm run test:e2e` (40 passed), `npm audit --audit-level=moderate` (0 vulnerabilities), `git diff --check`, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`, 14 routes, Gmail route present), live `/api/runtime-proof` (200), hosted submission pages (200 with 14-route/Gmail copy), hosted video HEAD (200, `content-length: 20807299`), and hosted desktop/mobile Playwright smoke confirming 14 connector routes, Gmail teacher-review draft, no horizontal overflow, and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## Walkthrough Submission Gate Refresh - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable/competitive for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and real anonymous student pilot observations are external.
- Highest-leverage controllable gap: the required walkthrough video needed to visibly include the latest UX proof, Top Award Radar, and AIYES Submission Gate instead of only listing them in docs.
- Updated `scripts/record-walkthrough.mjs` to include UX and Accessibility Proof, Top Award Radar, and AIYES Submission Gate beats, and shortened default caption timing so the full proof path stays under the five-minute cap.
- Regenerated `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`.
- Video proof: 1440x900, 214.64 seconds, 20,807,299 bytes, SHA-256 `59fb75c50692bcd6fb4ed7132b67543999fd59a6d18bd29e4565841beeb2d8a2`.
- Production: `dpl_9QynNE3L86uJuRYwBRGY9hqBAtnJ`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-13 for deadline, eligibility, Track 1 requirements, and judging criteria; `npm run record:walkthrough`; `ffprobe`; frame extraction/visual check for Submission Gate caption/panel; `npm run sync:public-submission`; `npm run test` (15 files, 91 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; production deploy; live `/api/evaluate` (200, score 100, 9/9 checks); live `/api/mcp/status` (200, `server_dry_run`, 13 routes); live `/api/runtime-proof` (200, `fallback_ready`, 8 templates); hosted submission pages (200 with Submission Gate copy); hosted video HEAD (200, `content-length: 20807299`); and hosted desktop/mobile Playwright smoke for Submission Gate with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## AIYES Submission Gate Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable/competitive for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and actual anonymous student pilot observations are external.
- Highest-leverage controllable gap after UX proof: the app said the submission package was ready, but judges still had to read prose to distinguish passed Devpost requirements from external steps.
- Added `AIYES Submission Gate` in Judge mode. It turns eligibility, Track 1 fit, slide presentation, video walkthrough, source/deploy link, problem/impact, AI design, and UX into pass, review, or external statuses.
- Updated top navigation, E2E coverage, README, Devpost copy, AIYES brief, judging checklist, five-minute script, slide deck, Submission Hub, Devpost Submission Pack, public submission pages, and submission-assets proof to reference the gate.
- Production: `dpl_9HfHYzyhGBno5pxWdbn1KKKuBTqj`, aliased to `https://ouija-olive.vercel.app`.
- Verification: official AIYES/Devpost page rechecked on 2026-07-13 for deadline, eligibility, Track 1 requirements, and judging criteria; focused Playwright Submission Gate test (4 passed across Chromium, Firefox, WebKit, and mobile Safari); `npm run test` (15 files, 91 tests); `npm run build`; `npm run test:e2e` (40 passed); `npm audit --audit-level=moderate` (0 vulnerabilities); `git diff --check`; `npm run sync:public-submission`; production deploy; live `/api/evaluate` (200, score 100, 9/9 checks); live `/api/mcp/status` (200, `server_dry_run`, 13 routes, Semantic Scholar and Canvas present); live `/api/runtime-proof` (200, `fallback_ready`, 8 templates); hosted submission pages (200 with Submission Gate copy); and hosted desktop/mobile Playwright smoke for Submission Gate with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## UX and Accessibility Proof Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable/competitive for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and actual anonymous student pilot observations are external.
- Highest-leverage controllable gap: the official User Experience and Design criterion needed a compact proof surface instead of relying on judges to infer UX quality from feature breadth.
- Added `UX and Accessibility Proof` in Judge mode. It maps the official criterion to student-first flow, judge navigation, responsive layout, named controls, clickable citations, and integrity prompts while keeping default Student mode focused on describe, graph, check, reflect, and student-owned claims.
- Updated Top Award Radar, Judge Brief, AI Model Card, README, Devpost copy, AIYES brief, judging checklist, five-minute demo script, slide deck, Submission Hub, Devpost Submission Pack, public submission pages, and E2E tests to expose the UX proof clearly.
- Production: `dpl_6JHHibi8Md7HSkGKuf9Lg19u8r2Y`, aliased to `https://ouija-olive.vercel.app`.
- Verification: focused Playwright UX proof test (4 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm run test` (15 files, 91 tests), `npm run build`, `npm run test:e2e` (40 passed), `npm audit --audit-level=moderate` (0 vulnerabilities), `git diff --check`, `npm run sync:public-submission`, production deploy, live `/api/evaluate` (200, score 100, 9/9 checks), live `/api/mcp/status` (200, `server_dry_run`, 13 routes, Semantic Scholar and Canvas present), live `/api/runtime-proof` (200, `fallback_ready`, 8 templates), hosted submission pages (200 with UX/MCP proof copy), and hosted desktop/mobile Playwright smoke for UX proof with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## AI Architecture Map Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija still works and is submittable/competitive for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and actual student pilot observations are external.
- Highest-leverage controllable gap: architecture clarity and technical depth beyond simple API use. The app had strong evidence, but the judge path could still make the system shape easier to read at speed.
- Added `AI Architecture Map` in Judge mode after Model Strategy. It shows intake, classifier, grounding, data engine, learning guard, evidence bridge, inputs, outputs, and evaluation contracts.
- Added Judge nav, Top Award Radar, Judge Brief, Model Card, README, Devpost copy, AIYES brief, slide deck, demo script, judging checklist, submission hub, Devpost pack, and public submission pages references to the architecture map.
- Production: `dpl_6KtahA3SR8vxEDL2po6bj7ysYhf3`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 91 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run sync:public-submission`, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`, 13 routes, Semantic Scholar and Canvas present), hosted submission pages (200, architecture copy visible), and hosted desktop/mobile Playwright smoke for AI Architecture Map with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## Semantic Scholar And Canvas MCP Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija is stronger and still submittable/competitive for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and actual student pilot observations are external.
- Added `semanticscholar-reference-check` as a Composio Semantic Scholar route for structured scientific paper metadata and abstract lookup. It is a reference-check path, not a student conclusion writer.
- Added `canvas-assignment-context` as a read-only Canvas route for lab prompt, due date, attachment metadata, and rubric context after explicit credentials/auth config/consent exist.
- Updated Composio Sessions Strategy so source verification now covers Composio Search, Semantic Scholar, Composio Browser, and DeepWiki, with Canvas split into a read-only assignment context session and student exports kept consent-gated.
- `/api/mcp/status` now reports 13 connector routes in server dry-run mode, including the new Semantic Scholar and Canvas readiness contracts.
- Updated README, API/env/runbook docs, Devpost copy, slide deck, submission hub, Devpost pack, demo script, judging checklist, public submission assets, UI copy, and tests so the submission story reflects the new practical MCP routes without claiming unconfigured live access.
- Production: `dpl_EVwWufmCGqrRt1veQp3vYnv9yv2y`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 91 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`, 13 routes), hosted submission pages (200), and hosted desktop/mobile browser smoke with Semantic Scholar, Canvas, 13-route proof, no horizontal overflow, and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## Pilot Evidence Export Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable for AIYES Track 1, but first place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, final 2-5 student roster, and actual student pilot observations are external.
- Added `buildPilotEvidenceExport` so anonymous pilot observations produce a CSV-ready export with status, summary metrics, observation rows, confidence deltas, and privacy boundary copy.
- Added direct-contact redaction for emails and phone-like strings in exported pilot notes. This does not replace human review, but it lowers the risk of accidentally sharing direct identifiers.
- Added a `Pilot evidence export` card inside Pilot Evidence Tracker with a copy button and read-only CSV preview for Devpost, Sheets, Forms, Notion, or Composio handoff.
- Updated README, Devpost copy, judging checklist, AIYES brief, and demo script so judges see a practical route from anonymous pilot protocol to exportable evidence.
- Added `OUIJA_ANALYZE_RATE_LIMIT` so trusted classroom/demo/E2E runs can raise deterministic `/api/analyze` throughput without changing the lower public paid-enrichment defaults. This fixed a Firefox full-matrix 429 in local Playwright without weakening production rate-limit behavior.
- Refreshed submission screenshots and walkthrough. New walkthrough proof is 1440x900, 201.36 seconds, 20,452,016 bytes, SHA-256 `bf7e6b5822ddb36b3c49eb239c02b217a5d4f1db89037f1a46035083ae1e0600`.
- Production: `dpl_2dx1LZH3XUSzwxtGyCN3G5JhZypq`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 88 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), focused Chromium and Firefox checks, local capture/record/sync submission assets, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`), hosted video HEAD (200, `content-length: 20452016`), and hosted desktop/mobile Playwright smoke for Pilot Evidence Export with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and real anonymous pilot observations if the team wants true user-testing evidence.

## Student Impact Brief Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable for AIYES Track 1. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, and the final 2-5 student roster are external, but this pass improves the weakest controllable judging area: first-scan problem definition and real-world relevance.
- Added typed `studentImpactBrief` to analysis output. It recomputes on fallback analysis, OpenAI enrichment merges, and table-row refreshes, and it degrades honestly for low-confidence/unsupported labs.
- Added the `Student Impact Brief` panel immediately after Run Snapshot. It shows target student, lab-reasoning pain point, before/after benefit, why AI helps, impact signals, and the remaining anonymous-pilot proof gap before the deeper technical proof stack.
- Added Student Impact Brief to Evidence Packet, Judge Brief proof copy, AI Model Card safeguards, README, Devpost copy, judging checklist, AIYES brief, slide deck, and walkthrough script.
- Refreshed submission screenshots and walkthrough. New walkthrough proof is 1440x900, 197.36 seconds, 19,577,913 bytes, SHA-256 `6854fb3510c61fe036cd7d4668943108b844352439b6a6c7a652493377683ee0`.
- Production: `dpl_HSt5n21ZmTifC1mcQSp7xiKQAPpW`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 86 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), local capture/record/sync submission assets, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`, 11 toolkits, Composio docs links), hosted video HEAD (200, `content-length: 19577913`), and hosted desktop/mobile Playwright smoke for Student Impact Brief with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, optional DeepWiki indexing, and actual anonymous pilot observations if the team wants real user-testing evidence.

## Composio Sessions Strategy Checkpoint - 2026-07-13 UTC / 2026-07-12 PDT

- Council verdict: Ouija works and is submittable for AIYES Track 1, and the Composio/MCP story is stronger now because it shows a session architecture judges can inspect. First place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, and the final 2-5 student roster are external.
- Added `Composio Sessions Strategy` inside MCP Integration Coach. It separates the first read-only source verification session from later consent-gated export sessions and lists toolkits, tools, data shared, consent gates, and why raw MCP URLs stay server-side.
- The first session bundles Composio Search source audit, Composio Scholar claim check, Composio Browser source capture, and DeepWiki public-source proof. Student export sessions remain behind Google Docs, Sheets, Drive, Classroom, Forms, Calendar, and Notion readiness/consent gates.
- Updated Judge Brief, AI Model Card, MCP payload preview, README, API/env/runbook docs, Devpost copy, slide deck, demo script, Submission Hub, Devpost pack, and public submission assets so the submission story says `Composio Sessions` instead of a fake live connector claim.
- Refreshed submission screenshots and walkthrough. New local walkthrough proof is 1440x900, 192.88 seconds, 17,890,513 bytes, SHA-256 `eee033b89da1862c87bd02ad37039476de7c9ab40dc6be1227f69ec417d77552`.
- Production: `dpl_3Ce63H5z2bSUwxmFVENQXXBN2LL9`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 86 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, focused Chromium/Firefox E2E for the long judge path, local capture/record/sync submission assets, official Composio docs check for Sessions as the preferred dynamic tool-access path, production deploy, live `/api/evaluate` (200, score 100), live `/api/mcp/status` (200, `server_dry_run`, Composio Sessions docs links), hosted submission/deck/Devpost/video checks, and hosted desktop/mobile Playwright smoke for Composio Session Strategy with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final team roster, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing if needed.

## Top Award Radar Checkpoint - 2026-07-12

- Council verdict: Ouija works and is submittable for AIYES Track 1. It is now stronger because the live app directly answers the top-award question, but first place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, and the team roster are external.
- Added `Top Award Radar` in Judge mode with a clear verdict: `Submittable and competitive`, plus explicit `Not a first-place guarantee` copy.
- The radar separates problem/relevance, AI/model strategy, UX/design, submission package, impact evidence, and external blockers, then lists next moves before judging: collect pilot observations, save progress evidence, confirm the team roster, use MCP dry-run proof, and only enable live OpenAI/Composio with explicit credentials and consent.
- Updated README, Devpost copy, and the five-minute demo script to include Top Award Radar in the submission story.
- Production: `dpl_BDvnaNhDZxKymjb9Zprj5MRkEFaX`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 86 tests), `npm run build`, `npm run test:e2e` (40 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, production deploy, live `/api/evaluate` (200, 100 score, 9/9 pass), live `/api/mcp/status` (200, `server_dry_run`, 11 routes, DeepWiki present), and hosted desktop/mobile Playwright smoke for Top Award Radar with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final 2-5 member team roster on Devpost, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing if the public repo route should become live proof.

## Pilot Evidence Tracker Checkpoint - 2026-07-11 PDT / 2026-07-12 UTC

- Council verdict: Ouija works and remains submittable for AIYES Track 1; first place/top-award outcome still cannot be guaranteed because judging, final Devpost submission, and the 2-5 student roster are external.
- Composio discovery confirmed the practical route: Forms/Sheets/Notion are most valuable when they carry real pilot evidence, not when Ouija adds more superficial connector names. DeepWiki did not find `rushtanu14/ouija` indexed yet, so the live app keeps that route as a public-source proof dry-run rather than claiming a live DeepWiki result.
- Added `Pilot Evidence Tracker` after Student Pilot Study Kit. It stores three anonymous browser-local observation rows, summarizes time-to-graph, confidence shift, issue spotting, exit-ticket readiness, and non-identifying notes, and starts with a warning not to claim completed student testing.
- Evidence Packet now includes a Pilot Evidence Tracker section. MCP payload previews now include `Pilot Evidence Tracker summary` so Google Forms, Google Sheets, and Notion handoffs can carry anonymous counts later without exposing student identifiers.
- Updated README, Devpost copy, five-minute demo script, AI Model Card, Judge Brief, unit tests, and E2E coverage for the tracker.
- Production: `dpl_2WURxeVkLJWMXB6ZVDgmG37WJ4zN`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (15 files, 86 tests), `npm run build`, `npm run test:e2e` (36 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, production deploy, live `/api/mcp/status` (200, `server_dry_run`, 11 routes, `deepwiki_mcp` present), live `/api/evaluate` (200, 100 score, 9/9 pass), and hosted desktop/mobile Playwright smoke for Pilot Evidence Tracker with no horizontal overflow and zero console errors.
- Remaining loops: commit/push, actual Devpost submission, final 2-5 member team roster on Devpost, optional live OpenAI/Composio credentials only with explicit approval and consent/server setup, and optional DeepWiki indexing if the public repo route should become live proof.

## Regression Wording Polish Checkpoint - 2026-07-11

- Council verdict: Ouija works and is submittable for AIYES Track 1. A literal first-place guarantee is still impossible; AIYES currently awards Gold/Silver/Bronze/Honorable Mention certificates, and final judging plus Devpost submission/team roster are external.
- Polished the remaining judge-visible wording from `Eval Bench`, `Evaluation bench`, `Bench passed`, and `9 live cases` to `Regression`, `Regression suite`, `Checks passed`, and `9 checks`.
- Removed the stale exact walkthrough duration from the Judge Brief and kept the claim to the official under-5-minute cap.
- Updated the hosted Submission Hub proof card and active Devpost copy to say deterministic checks instead of live cases.
- Deployment: `dpl_AWkD725mAuHVfhFRzrb8jiLv5Hp2`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (14 files, 82 tests), `npm run build`, `npm run test:e2e` (36 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, production deploy, public `/api/evaluate`, public `/api/runtime-proof`, hosted Submission Hub wording check, and judge-view smoke with no horizontal overflow and zero console issues.
- Remaining loops: commit/push, actual Devpost submission, 2-5 member team roster, optional live OpenAI/Composio credentials only with explicit approval.

## API Security + Composio Session Checkpoint - 2026-07-11

- Council verdict: Ouija is stronger with a real consent-gated Composio/MCP bridge than with more superficial integrations. First place still cannot be guaranteed because judging, Devpost submission, and team roster handling are external.
- Added bounded request validation for `/api/analyze`: descriptions max 2,000 characters, up to 200 rows, bounded row fields, and bounded cell text.
- Added in-memory rate limiting for `/api/analyze` and `/api/mcp/session` in both Express and Vercel adapters.
- Added allowlisted CORS via `OUIJA_ALLOWED_ORIGIN`; production and local Vite origins are allowed by default, untrusted origins are not reflected, and serverless routes allow `Authorization` for scoped MCP session preflights.
- Hardened live Composio session creation: public dry-runs still work, but real Tool Router session creation requires `COMPOSIO_API_KEY`, `COMPOSIO_LIVE_EXPORTS=true`, `COMPOSIO_SESSION_USER_ID`, connector allowed tools, required auth config IDs, student/teacher consent, and `Authorization: Bearer $MCP_SESSION_AUTH_TOKEN`.
- Kept Composio Search source audit, Scholar claim-check, and Browser public source-capture as the strongest MCP routes for a student science app; Docs, Sheets, Drive, Classroom, Forms, Calendar, and Notion remain classroom/portfolio handoff routes.
- Added plant-light etiolation context so dark-grown seedlings are interpreted as a scientific context note instead of automatically bad data.
- Renamed `/api/evaluate` wording to deterministic regression suite so judges do not mistake it for independent scientific accuracy or student-outcome validation.
- Updated docs for `MCP_SESSION_AUTH_TOKEN`, `OUIJA_ALLOWED_ORIGIN`, CORS, rate limits, and live MCP authorization.
- Deployment: `dpl_2n8ebnhWYboQ5zP8251ZiHWcQY8u`, aliased to `https://ouija-olive.vercel.app`.
- Verification: `npm run test` (14 files, 82 tests), `npm run build`, `npm run test:e2e` (36 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, production deploy, public `/api/evaluate`, `/api/runtime-proof`, `/api/mcp/status`, trusted/untrusted CORS checks, and hosted Submission Hub desktop/mobile smoke with no horizontal overflow and zero console issues.
- Remaining loops: commit/push, actual Devpost submission, 2-5 member team roster, optional live OpenAI/Composio credentials only with explicit approval.

## Submission Hub Checkpoint - 2026-07-09 local / 2026-07-10 UTC

- Council verdict: Ouija works and is submittable for AIYES Track 1; first place still cannot be guaranteed because judging, Devpost submission, and team roster handling are external. The next highest-leverage gap was judge-first packaging, not more superficial Composio breadth.
- Added `docs/submission-hub.html` and synced it to `public/submission/index.html`. The hosted hub links Judge view, student app, slide deck, walkthrough, source repo, screenshots, `/api/evaluate`, `/api/runtime-proof`, and `/api/mcp/status`.
- Updated Judge Brief to include Submission Hub as a hosted readiness item, hosted link, checklist item, and proof statement.
- Updated README, Devpost copy, AIYES submission brief, judging checklist, five-minute script, slide deck, and submission-assets proof to include `https://ouija-olive.vercel.app/submission/`.
- Redeployed production: `https://ouija-olive.vercel.app`, deployment `dpl_GpWKJmyACSNVnHRHcpc6ybH51QLd`.
- Public proof: `/submission/` returned HTTP 200 with content length `8310`; `/api/evaluate` returned `9/9 checks` and `9/9`; `/api/runtime-proof` returned `fallback_ready`, eight templates, 9/9 coverage, and `server_dry_run`; `/api/mcp/status` returned 10 connector routes.
- Verification passed: `npm run test` (12 files, 68 tests), `npm run build`, `npm run test:e2e` (9 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run sync:public-submission`, local and hosted Playwright hub smoke on desktop/mobile with no horizontal overflow and zero console errors, production deploy, and live endpoint checks.
- Remaining external loops: CSB update, commit, push, actual Devpost submission, 2-5 member team roster, optional live Composio credentials only after server-side allowed tools/auth config/consent setup, and optional OpenAI web-search demo only with explicit API-key approval.

## Student Pilot Study Kit Checkpoint - 2026-07-09

- Added `studentPilotStudyKit` to `AnalyzeResult` with ready/review status, consent boundary, pre/post prompts, three pilot tasks, four UX/impact metrics, observer checklist, evidence-to-collect list, and judge takeaway.
- Added a Student Pilot Study Kit panel after Learning Impact Loop in both Student and Judge flows, plus Pilot top-nav links, AI Model Card safeguard copy, and Judge Brief proof copy.
- Threaded the pilot kit through fallback analysis, web-enrichment merge, row-edit recomputation, Official Rubric Fit, AIYES Values Fit, Development Journey, Track Evidence, Deterministic Regression Suite evidence, Evidence Packet, and MCP Integration Coach payload previews. Google Forms readiness preview now includes pilot-study metrics.
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
- Public proof: `/api/evaluate` returned `9/9 checks` and `9/9`; `/api/mcp/status` returned server dry-run with 10 routes; hosted deck content length `18766`; hosted walkthrough content length `26688733`; hosted browser smoke confirmed Student mode hides judge proof, Judge mode shows Browser source capture, and desktop/mobile had no horizontal overflow.
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

## Deterministic Regression Suite Checkpoint - 2026-06-26

- Council verdict: Ouija works and remains submittable; first-place fit improved by making testing/evaluation visible inside the live app instead of only in terminal output.
- Added shared Deterministic Regression Suite logic in `src/lib/evaluation.ts`, local `/api/evaluate`, and Vercel `api/evaluate.ts`.
- Deterministic Regression Suite runs five deterministic live cases: physics projectile motion, chemistry reaction rate, biology enzyme activity, earth science water filtration, and unsupported density-layering boundary behavior.
- Added Deterministic Regression Suite UI to the lower workspace and Judge Brief proof list. Live result shows `9/9 checks` and `5/5 passed`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_83e6kkjRXdeY6CqSFV7D3YsjuhGT`.
- Production proof: `/api/evaluate` returned score `100`, `5/5 passed`, and case ids `eval-projectile`, `eval-reaction-rate`, `eval-enzyme`, `eval-turbidity`, and `eval-unsupported-boundary`.
- Refreshed screenshots and `docs/assets/ouija-walkthrough.webm` from the live deployment. Current video proof is 33.48 seconds, about 3.7 MB, 1440x900; frame checks show Deterministic Regression Suite/Judge Brief at 29 seconds.
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
- Regenerated `docs/assets/ouija-walkthrough.webm` from the live app and synced it to `public/submission/assets/ouija-walkthrough.webm`; current proof is 29.44 seconds, 3,045,571 bytes, 1440x900, with a 25-second frame check showing Deterministic Regression Suite, Judge Brief, hosted links, and the Devpost-only loop.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_r9m8euGVchBR4j77T9F2Jsm1oH5R`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted deck returned HTTP 200 with `text/html`, hosted video returned HTTP 200 with `video/webm` and content length `3045571`, and desktop/mobile browser QA found hosted links visible, no console errors, and no horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Full Walkthrough Upgrade - 2026-06-26

- Council verdict after checking the AIYES/Devpost submission shape: Ouija works and is submittable, but first-place fit improved by replacing the 29-second smoke-style walkthrough with a fuller paced video closer to the allowed up-to-five-minute live-demo format.
- Updated `scripts/record-walkthrough.mjs` so each caption stays readable, includes a progress counter, and adds a build-architecture segment covering React/TypeScript/Express, deterministic science templates, optional server-side OpenAI web-search enrichment, and safe fallback behavior.
- Regenerated `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; new proof is 1:55.36, 9,086,168 bytes, 1440x900.
- Frame proof: 22 seconds shows the build-architecture caption, 96 seconds shows Deterministic Regression Suite plus Judge Brief, and 106 seconds shows Judge Brief with hosted submission links.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_7ubnErXayLbxmL5YePN4XPJx1RuW`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted walkthrough returned HTTP 200 with `video/webm` and content length `9086168`, hosted deck returned HTTP 200 with `text/html`, and desktop/mobile browser QA found no console errors or horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, frame extraction, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## AI Model Card Checkpoint - 2026-06-26

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a live AI Model Card so judges can inspect the architecture, grounding mode, evaluation method, privacy boundary, and risk controls without reading code.
- Added top-nav `Model Card` and lower-workspace `AI Model Card` panel.
- Model Card shows hybrid strategy, current grounding mode, classifier type, evaluation coverage, privacy boundary, step-by-step flow, server-side API-key boundary, unsupported-lab guard, Claim Coach guard, and Deterministic Regression Suite guard.
- Updated README and AIYES docs so the Model Card is part of the submission story.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_4C5Aycn5fkVpwqU5tbGaJDAH7Jnw`.
- Public proof: `/api/health` passed, `/api/evaluate` returned `100` and `5/5`, hosted walkthrough still returned HTTP 200 with `video/webm` and content length `9086168`, and desktop/mobile public browser QA showed AI Model Card visible with no console errors or horizontal overflow.
- Fresh local verification passed: `npm run test` (`22 passed`), `npm run build`, `npm run test:e2e` (`3 passed`), `npm audit --json` (`0 vulnerabilities`), production-style local browser QA, and `git diff --check`.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Density Layering Coverage Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works, is externally deployed, and is stronger for AIYES because density layering is now a supported common middle/high school chemistry lab instead of an unsupported-boundary example.
- Added the `density-layering` template, sample chip, trusted Khan Academy density source, method-audit profile, density layer-order checks, and Deterministic Regression Suite case.
- Moved the unsupported-boundary demo to a bean seedling light-color lab so Ouija still visibly admits when a lab is outside V1 coverage.
- Deterministic Regression Suite now runs six deterministic live cases: projectile motion, reaction rate vs temperature, enzyme activity vs temperature, water filtration/turbidity, density layering, and unsupported-boundary behavior. Public `/api/evaluate` returned `100`, `6/6`, and case id `eval-density`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_AR3wo17f4XJxAu8AzqXGYUD9kFcK`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:55.88, 9,407,864 bytes, 1440x900. Frame checks showed `9/9 checks`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
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
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 1:56.08, 9,483,261 bytes, 1440x900. Frame checks showed pasted table import, recomputed warning, `9/9 checks`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `9483261`.
- Fresh verification passed: `npm run test` (`27 passed`), `npm run build`, `npm run test:e2e` (`4 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `6/6`), hosted slide/video checks, and desktop/mobile public browser QA for spreadsheet import, Judge Brief, Deterministic Regression Suite, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo.

## Evidence Packet Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a practical student output that is useful after analysis while still refusing to write the final lab report.
- Added `src/lib/evidencePacket.ts` with tested Markdown packet generation for classification, variables, expected pattern, table rows, method/data warnings, sources, blank claim starter, next reasoning question, and integrity boundary.
- Added the live `Evidence Packet` panel with selectable/copyable packet text and `Copy packet` action. The packet repeats the Claim Coach blanks and source trail but does not generate a final conclusion.
- Added a Judge Brief proof item: `Evidence Packet exports a student-owned reasoning handoff.`
- Updated submission docs, slide deck copy, and `scripts/record-walkthrough.mjs` so the walkthrough includes the Evidence Packet moment.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_4SytAJCh3eVZtWC8oqRCQWfBwtTu`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:04.80, 10,501,086 bytes, 1440x900. Frame checks showed Evidence Packet, pasted table import, `9/9 checks`, `6/6 passed`, `6 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `10501086`.
- Fresh verification passed: `npm run test` (`29 passed`), `npm run build`, `npm run test:e2e` (`4 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `6/6`), hosted slide/video checks, and desktop/mobile public browser QA for Evidence Packet, spreadsheet import, Judge Brief, Deterministic Regression Suite, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost 2-5 member team requirement if enforced, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Ohm's Law Coverage Checkpoint - 2026-06-27

- Council verdict after retry: Ouija works and is submittable; first-place fit improved again by adding another practical, common middle/high school physics lab with clear expected graph behavior.
- Added the `ohms-law-circuits` template, sample chip, trusted Khan Academy Ohm's law source, method-audit profile, current/voltage/resistance consistency checks, and Deterministic Regression Suite case.
- Deterministic Regression Suite now runs seven deterministic live cases: projectile motion, Ohm's law circuits, reaction rate vs temperature, enzyme activity vs temperature, water filtration/turbidity, density layering, and unsupported-boundary behavior. Public `/api/evaluate` returned score `100`, `7/7`, and case id `eval-ohms-law`.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_9SQeNfV32heQa8ThDZwp8Up3wCtQ`.
- Refreshed `docs/assets/ouija-walkthrough.webm` from the live deployment and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 2:05.92, 10,723,343 bytes, 1440x900, SHA-256 `84ed432cfc6a828fe89d79e2d2a37e3264cbd4ad661e5c4f1a59a9d7bcf8fbd6`. Frame checks showed circuits breadth, `9/9 checks`, `7/7 passed`, `7 live cases`, and hosted Judge Brief links.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `10723343`.
- Fresh verification passed: `npm run test` (`30 passed`), `npm run build`, `npm run test:e2e` (`5 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, frame extraction, public `/api/health`, public `/api/evaluate` (`100`, `7/7`), hosted slide/video checks, and desktop/mobile public browser QA for Ohm's Law, Evidence Packet, Judge Brief, Deterministic Regression Suite, no console errors, and no horizontal overflow.
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
- Added the live `AIYES Rubric Fit` panel, top-nav `Rubric Fit` link, Evidence Packet `## AIYES Rubric Fit` section, Deterministic Regression Suite evidence line, Judge Brief proof item, AI Model Card safeguard, and matching README/submission/deck/walkthrough updates.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_2zvopR3EAHLaoRdR66LRLzbtSCWv`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `3 official rubric criteria mapped`; `/api/analyze` for projectile motion returned Track 1 score `94`, readiness `competitive`, rubric score `96`, and all three labels: `Problem Definition and Real-World Relevance`, `AI Technical Design and Model Strategy`, and `User Experience and Design`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `9871`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `15956405`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:01.76, 15,956,405 bytes, 1440x900, SHA-256 `8cace5014831d85950f482302c0e97d6503b521b7af79ecb603578ac8e27355a`. Frame checks showed AIYES Rubric Fit with all three official criteria, Evidence Packet, Deterministic Regression Suite, Judge Brief, hosted links, and the new Judge Brief proof item.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA for AIYES Rubric Fit, Judge Brief proof, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Learning Impact Loop Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the student impact measurable inside the app instead of only described in submission copy.
- Added `impactSnapshot` to the shared analysis schema: score, headline, student outcome, five metrics (`Student outcome`, `Data quality`, `Concept learning`, `Integrity`, `Next trial`), and a diagnose-ground-check-improve-write evidence loop. It recomputes on fallback analysis, enrichment merges, and table edits.
- Added the live `Learning Impact Loop` panel, top-nav `Impact` link, Evidence Packet `## Learning Impact Loop` section, Deterministic Regression Suite impact evidence, Judge Brief proof item, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified deployment ID is `dpl_2W781ZxC8xhSkcKTWfPH1ycLDcpD`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `7/7`, and `96/100 learning impact score`; `/api/analyze` for projectile motion returned Track 1 score `94`, readiness `competitive`, rubric score `96`, impact score `96`, and all five impact metric labels.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10187`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `15517473`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:07.20, 15,517,473 bytes, 1440x900, SHA-256 `311a00879843d3942e36d932748fc5f631829f46f4ec05bd4105d9a0fa210b56`. Frame checks showed Learning Impact Loop, AIYES Rubric Fit, Evidence Packet, Deterministic Regression Suite, Judge Brief, hosted links, and the new impact proof item.
- Fresh verification passed: `npm run test` (`31 passed`), `npm run build`, `npm run test:e2e` (`6 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA for Learning Impact Loop, Judge Brief proof, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real `OPENAI_API_KEY` web-search demo. Do not create or configure an API key without explicit approval because that changes third-party credentials.

## Pendulum Coverage Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a safe, common, graphable pendulum lab with a square-root expected pattern instead of only adding more pitch polish.
- Added `pendulum-period-length` as a supported physics template with sample chip, trusted Physics Classroom source, concept coach, safety coach, method audit controls, next-trial guidance, period/length validators, and Deterministic Regression Suite case `eval-pendulum`.
- Ouija now supports seven common middle/high school demo labs: projectile motion, pendulum period vs length, Ohm's law circuits, reaction rate vs temperature, enzyme activity vs temperature, density layering, and water filtration/turbidity, with the unsupported-boundary demo still using a bean seedling light-color lab.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_87i38RCzQmtcR4AX6G7dWz8FvUzc`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and case ids `eval-projectile`, `eval-pendulum`, `eval-reaction-rate`, `eval-ohms-law`, `eval-enzyme`, `eval-turbidity`, `eval-density`, and `eval-unsupported-boundary`; `/api/analyze` for pendulum returned `pendulum-period-length`, Track 1 score `94`, readiness `competitive`, `7` model candidates, rubric score `96`, impact score `96`, and source `Pendulum motion`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10217`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `16453076`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:05.44, 16,453,076 bytes, 1440x900, SHA-256 `1a0c6fea9ffff3ea3972b657d92de843c409f8bebcc176268813cb6d9daac14d`. Frame checks showed Pendulum coverage in Deterministic Regression Suite, `9/9 checks`, `8/8 passed`, `8 live cases`, `7 demos`, Judge Brief, and hosted links.
- Fresh verification passed: `npm run test` (`32 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public API checks, hosted deck/video checks, and desktop/mobile public browser QA with no console errors or horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Pattern Evidence Engine Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved again by adding `Pattern Evidence Engine`, a deterministic whole-table scoring layer that judges whether the student dataset supports the expected science pattern before the claim-writing stage.
- Added `patternEvidence` to the shared analysis schema: status, score, method, observations, expected/observed details, whole-pattern summary, and student question.
- Added template-specific pattern checks: projectile and enzyme peak/shape checks, reaction-rate and filtration trend checks, pendulum square-root consistency, Ohm's law ratio consistency, and density bottom-to-top ordering.
- Added the live `Pattern Evidence Engine` panel, plus `Pattern evidence` in Learning Impact Loop, `Score whole pattern` in Reasoning Trail, Track Evidence criterion, Model Strategy signal/risk control, AIYES Rubric Fit evidence, Evidence Packet section, Deterministic Regression Suite evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, screenshots, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_GubBWjjCYjLbPgDT2vVKNusjttUV`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `9/9 checks pattern evidence` in supported cases; `/api/analyze` for a wrong-direction reaction-rate table returned `patternEvidence.status: "contradicts"`, score `18`, `pattern-evidence` impact metric, rubric evidence naming Pattern Evidence Engine, and a `pattern` pipeline step.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10678`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `18092340`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:21.68, 18,092,340 bytes, 1440x900, SHA-256 `b9bf13c4125fc83e385b430206f4bf42f9c6b7aee408897ff9a43b6e29e0d657`.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Pattern Evidence visible, Deterministic Regression Suite visible, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Reliability Coach Checkpoint - 2026-06-29

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding repeated-trial reliability because real middle/high school labs need repeats, averages, and spread checks before students trust a graph.
- Added `reliabilityCoach` to the shared analysis schema: status, score, x/y labels, repeat groups, counts, averages, spread, recommendation, and student question.
- Added deterministic grouping by the experiment independent variable. Ouija now flags under-repeated conditions, wide-spread repeated measurements, blocked invalid data, and strong repeat groups.
- Added the live `Reliability Coach` panel after Method Audit, plus `Repeat reliability` in Learning Impact Loop, `Check repeat reliability` in Reasoning Trail, Track Evidence criterion, Model Strategy signal/risk control, AIYES Rubric Fit evidence, Evidence Packet section, Deterministic Regression Suite evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_FdMqGWB3CJuJaJhsmf8FYVtundEm`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `68/100 repeat reliability` evidence; `/api/analyze` for reaction rate returned `reliabilityCoach.status: "needs_repeats"`, score `68`, rubric evidence naming Reliability Coach, and a `reliability` pipeline step.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `10422`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `17144530`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:15.32, 17,144,530 bytes, 1440x900, SHA-256 `47364a7e4dea65492579a1aac1cae3ad8bc5c5337276be6bd671780cda3b4b59`. Frame checks showed Reliability Coach caption, repeat groups, averages, spread, student question, Model Card proof, Deterministic Regression Suite, and Judge Brief proof.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run record:walkthrough`, `OUIJA_URL=https://ouija-olive.vercel.app npm run capture:submission`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, frame extraction, public `/api/health`, public `/api/evaluate`, public `/api/analyze`, hosted deck/video checks, and desktop/mobile public browser QA with Reliability Coach visible, no console errors, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the live page's 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Expected Overlay Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by adding a student-visible expected-pattern overlay directly on the graph, so students can compare their own measurements against the trusted expected pattern before reading Pattern Evidence or writing a claim.
- Added `expectedComparison` to the shared analysis schema. It returns observed/expected labels, a plain-language summary, row-level observed values, interpolated or matched expected values, deltas, and notes. It recomputes on fallback analysis, OpenAI enrichment merges, row edits, and spreadsheet imports.
- Added a dashed `Expected overlay` series to the live graph with a visible summary below the chart. Evidence Packet, Deterministic Regression Suite, Learning Impact Loop, Official Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now mention expected-overlay comparison.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_4iHMnyrze5sPJTpMJbGLfwTQJ3nB`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `expected overlay points`; `/api/analyze` for a wrong-direction reaction-rate table returned `patternEvidence.status: "contradicts"`, score `18`, `expectedComparison.summary` with `4 of 4 rows`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `17874221`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:21.52, 17,874,221 bytes, 1440x900, SHA-256 `d3a192e867d2b523454ebd11b5cce0a754ecc7b58d2616abe164208354938733`. Screenshot proof shows the dashed expected overlay and summary in the graph section.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with expected overlay visible, Pattern Evidence visible, Deterministic Regression Suite visible, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Grounding Audit Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making source trust, citation visibility, and mixed-evidence boundaries visible instead of burying them in expected-result prose.
- Added `groundingAudit` to the shared analysis schema. It scores visible citations, grounding mode, source agreement, and student-use boundaries, then returns a source-backed, mixed-evidence, or needs-review status plus a student source task.
- Added the live `Grounding Audit` panel in the right source rail. Evidence Packet, Deterministic Regression Suite, Model Strategy, AIYES Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now mention the source-trust audit.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_3HYtir2hQJmxS7JRg123ABCyECqX`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `92/100 grounding audit`; `/api/analyze` for a wrong-direction reaction-rate table returned `groundingAudit.score: 92`, `groundingAudit.status: "source_backed"`, `patternEvidence.status: "contradicts"`, score `18`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `18983280`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:31.48, 18,983,280 bytes, 1440x900, SHA-256 `cf5c8f359490cc0ef94ebf96c142f5d1c2f5f52c37f7e14e384dff661d61f4e5`. Screenshot proof shows the Grounding Audit in the right rail.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Grounding Audit, expected overlay, Pattern Evidence, Deterministic Regression Suite, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## AI Evaluation Harness Checkpoint - 2026-06-30

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by answering the strongest judge objection, "is this evaluated like an AI system or just presented like a polished demo?"
- Added `aiEvaluationHarness` to the shared analysis schema. It scores classifier confidence, coverage benchmark, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries, then returns a validated/review/blocked status plus judge-facing failure mode.
- Added the live `AI Evaluation Harness` panel after Model Strategy. Evidence Packet, Deterministic Regression Suite, AIYES Rubric Fit, Reasoning Trail/Track Evidence, Judge Brief, AI Model Card, README, submission docs, slide deck, and walkthrough script now include the harness.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_2FGxoqPJ1J4mBgpGLpZQ8VeWf9Wf`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `93/100 AI evaluation harness`; `/api/analyze` for a wrong-direction reaction-rate table returned `aiEvaluationHarness.score: 80`, `aiEvaluationHarness.status: "review"`, `groundingAudit.status: "source_backed"`, `patternEvidence.status: "contradicts"`, score `18`, and `4` expected overlay points.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`; hosted walkthrough returned HTTP 200 with `video/webm` and content length `19275329`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:38.48, 19,275,329 bytes, 1440x900, SHA-256 `41a2cb6908f33eba1e63bba7cf5a7e59d6062e628d20ea4c0ec68e651ba8bc40`. Screenshot proof shows the AI Evaluation Harness in the main analysis column.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed`), `npm audit --json` (`0 vulnerabilities`), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with AI Evaluation Harness, Grounding Audit, expected overlay, Pattern Evidence, Deterministic Regression Suite, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Judge Demo Path Checkpoint - 2026-07-01

- Council verdict after retry: Ouija works and is submittable; first-place fit improved by making the live judge walkthrough explicit instead of asking evaluators to infer the path through many proof panels.
- Added `judgeDemoPath` to the shared analysis schema. It returns ready/review/blocked status, headline, summary, next best action, and five steps: problem fit, AI design, student workflow, evidence handoff, and submission proof.
- Added the live `Judge Demo Path` panel directly below classification, plus `Judge demo path` Track Evidence criterion, `Guide judge demo` Reasoning Trail pipeline step, Official Rubric Fit evidence, Evidence Packet section, Deterministic Regression Suite evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, and tests.
- Redeployed to Vercel production at `https://ouija-olive.vercel.app`; latest verified production deployment ID is `dpl_4gcx4PQv8qEHQSnWBFD3Q3NjfBap`.
- Public proof: `/api/health` passed; `/api/evaluate` returned score `100`, `8/8`, and `5 judge demo steps (ready)` in supported cases; `/api/analyze` for a wrong-direction reaction-rate table returned `judgeDemoPath.status: "review"`, `5` judge demo steps, `demo` pipeline status `review`, `patternEvidence.status: "contradicts"`, `aiEvaluationHarness.score: 82`, and `groundingAudit.score: 92`.
- Hosted materials verified: slide deck returned HTTP 200 with `text/html`, content length `11583`; hosted walkthrough returned HTTP 200 with `video/webm`, content length `20942709`.
- Refreshed `docs/assets/ouija-walkthrough.webm` and synced it to `public/submission/assets/ouija-walkthrough.webm`; proof is 3:46.84, 20,942,709 bytes, 1440x900, SHA-256 `1ff9ceacaf92079c07769c9100388939bed31cd989e2b3afba9fe30fa89c7a70`. Screenshot proof shows Judge Demo Path near the top of the main analysis column.
- Fresh verification passed: `npm run test` (`33 passed`), `npm run build`, `npm run test:e2e` (`7 passed` after one locator fix), `npm audit --json` (`0 vulnerabilities`), `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production Vercel deploy, public API checks, hosted deck/video checks, and public browser QA with Judge Demo Path, AI Evaluation Harness, Grounding Audit, Deterministic Regression Suite, title `Ouija`, and no horizontal overflow.
- Remaining external loops: actual Devpost submission, resolving the Devpost 2-5 member team requirement ambiguity, and optional real OpenAI web-search demo only with explicit API-key approval.

## Custom Lab Triage Checkpoint - 2026-07-01

- Council verdict after retry: Ouija works and remains submittable; first-place fit improved by closing the "any kind of experiment" honesty gap with practical unsupported-lab triage instead of only showing a closest-supported warning.
- Added `customLabTriage` to the shared analysis schema: status, summary, inferred focus, suggested columns, source searches, clarifying questions, safety boundary, and student next action.
- Added the live `Custom Lab Triage` panel for low-confidence descriptions, plus Evidence Packet export, Deterministic Regression Suite evidence, Track Evidence criterion, Official Rubric Fit evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, tests, and `docs/assets/ouija-custom-triage.png`.
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
- Added the live `Data Handling Ledger` panel after AI Evaluation Harness, plus `Data ethics` Track Evidence criterion, `Audit data handling` Reasoning Trail step, Official Rubric Fit evidence, Evidence Packet section, Deterministic Regression Suite evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, API/serverless tests, and E2E tests.
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
- Added the live `Learning Exit Ticket` panel after Learning Impact Loop, plus `Learning exit ticket` Track Evidence criterion, `Check learning exit ticket` Reasoning Trail step, Official Rubric Fit evidence, Evidence Packet section, Deterministic Regression Suite evidence, Judge Brief proof, AI Model Card safeguard, README/submission/deck/walkthrough copy, API/serverless tests, and E2E tests.
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
- Added the live `Pre-Lab Design Coach` panel after Custom Lab Triage/Judge Demo Path, plus Track Evidence criterion `pre-lab-design`, Reasoning Trail step `Plan pre-lab setup`, Official Rubric Fit evidence, Deterministic Regression Suite evidence, Evidence Packet section, Judge Brief proof, AI Model Card safeguard, API docs, README, Devpost copy, AIYES brief, judging checklist, slide deck, and walkthrough script coverage.
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
- Added a live `Run Snapshot` panel immediately after classification. It shows rubric fit, Deterministic Regression Suite status, learning impact, data flags, expected pattern, and current action before judges/students reach the deeper evidence panels.
- Reordered the main analysis workflow so `Guided Lab Flow`, `Pre-Lab Design Coach`, the expected-pattern graph, editable data table, Pattern Evidence, and Comparison Insights appear before `Model Strategy`, `AI Evaluation Harness`, `Data Handling Ledger`, and `AIYES Rubric Fit`.
- Added E2E proof that `graph-card` and `data-card` render before `model-strategy`, keeping the practical student workflow ahead of the judge evidence stack.
- Refreshed submission screenshots, walkthrough script, and public submission assets. Video proof: 1:57.28, 11,675,369 bytes, 1440x900, SHA-256 `880e980d2921ba8ccb705c7492b6a374619975466269f7cd4779c5c6f89a414e`; frame proof at 10 seconds shows Run Snapshot with rubric fit, `9/9` Deterministic Regression Suite status, learning impact, data flags, expected pattern, and current action.
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
- Fresh verification passed: `npm run test` (66 passed), `npm run build`, `npm run test:e2e` (8 passed), `npm audit --json` (0 vulnerabilities), `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, public `/api/evaluate` (`9/9 checks`, `9/9`), public `/api/analyze` with `aiyesValuesFit.score: 96`, hosted deck/video HTTP 200, and desktop/mobile public smoke with no horizontal overflow.
- Remaining external loops: actual Devpost submission, Devpost team requirement ambiguity if enforced, and optional real OpenAI/Composio credentials only with explicit credential approval and consent/server setup.

## AIYES Development Journey Checkpoint - 2026-07-08

- Council verdict: Ouija works and remains submittable for AIYES Track 1. First place still cannot be guaranteed because judging, Devpost submission, and the team roster are external. The best practical hardening was not another fake live connector; it was making the required Track 1 development journey visible and inspectable in-app.
- Added typed `developmentJourney` to `AnalyzeResult`, with eight stages: problem identification, data handling, model selection/integration, application development, testing/evaluation, UX/design, ethics/impact, and constraints/submission. It recomputes for fallback analysis, OpenAI web-search enrichment, and table-row refresh.
- Added the live `AIYES Development Journey` panel, top-nav `Journey` anchor, Evidence Packet section, Model Card safeguard, Judge Brief proof item, updated docs/deck/copy/script/tests, and refreshed submission screenshots/video/public assets.
- Composio/MCP status after this pass: Ouija already has nine consent-gated Composio/MCP routes including Composio Search source audit and Scholar claim check, `/api/mcp/status`, `/api/mcp/export`, and scoped `/api/mcp/session`. Public mode remains credentials-safe server dry-run; live Composio should wait for explicit credentials and consent/server setup.
- Refreshed walkthrough proof: `docs/assets/ouija-walkthrough.webm`, 4:34.96 / 274.96 seconds, 24,966,897 bytes, SHA-256 `65c8bf2260b04b7d30139aac1ad7087d17a4921695e0c3cf0aaad122646a44e0`, synced to `public/submission/assets/ouija-walkthrough.webm`.
- Production: `dpl_7RBuYLSFNTMnYQjutM8H77EGCM3Z`, aliased at `https://ouija-olive.vercel.app`. Public proof: `/api/evaluate` returned `9/9 checks` and `9/9`; public projectile `/api/analyze` returned `developmentJourney.score: 96` and 8 stages; `/api/mcp/status` returned `server_dry_run` with 9 routes; hosted slide deck returned HTTP 200 content length `18555`; hosted walkthrough returned HTTP 200 `video/webm` content length `24966897`; desktop/mobile public smoke confirmed all 8 journey stages and no horizontal overflow.
- Verification passed: `npm run test` (66 passed), `npm run build`, `npm run test:e2e` (8 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run capture:submission`, `npm run record:walkthrough`, `npm run sync:public-submission`, production deploy, public endpoint/asset checks, and public desktop/mobile Playwright smoke.
- Remaining external loops: actual Devpost submission, Devpost 2-5 student team roster ambiguity, optional real OpenAI web-search enrichment only with explicit API-key approval, and optional live Composio credentials only after consent/server setup.

## Pattern Archetype Coach Checkpoint - 2026-07-08 PDT / 2026-07-09 UTC

- Council verdict after re-checking the Composio/MCP request: Ouija works and is submittable. First place still cannot be guaranteed because judging, team roster, and Devpost submission are external; the strongest next practical improvement was broader unsupported-lab usefulness rather than pretending another live connector is configured.
- Added typed `CustomPatternArchetype` support inside `CustomLabTriage`. Unsupported labs now infer comparison, trend, optimum, time-series, or teacher-review graph archetypes with confidence, graph suggestion, expected pattern wording, axes, repeat advice, source question, and student check.
- Paper towel absorbency now returns a high-confidence `comparison` archetype: bar chart by paper towel brand/type, average water absorbed on the y-axis, repeat-trial warning, and a source question about comparing group averages and controls.
- Added the live `Pattern Archetype Coach` panel inside Custom Lab Triage, plus Evidence Packet export content, MCP payload preview source-question section, Deterministic Regression Suite evidence, Official Rubric Fit evidence, AIYES Values Fit evidence, E2E/API/unit coverage, README/API/Devpost/AIYES brief/judging checklist/slide deck/demo script updates, and refreshed screenshots/video/public assets.
- Composio/MCP status after this pass: Ouija already has ten consent-gated MCP routes, including Composio Search source audit, Composio Scholar claim check, Composio Browser source capture, Google Workspace/Classroom/Forms/Calendar, and Notion. Composio discovery showed Semantic Scholar would require an active connection, so live external execution remains credentials-safe server dry-run until explicit setup and consent.
- Refreshed walkthrough proof: `docs/assets/ouija-walkthrough.webm`, 2:25.28 / 145.28 seconds, 14,658,970 bytes, 1440x900, SHA-256 `0fd14eeb0db268f4b8f84eefbc67d74265cebd885631ea84ae1e7076b5d8d1a9`; synced to `public/submission/assets/ouija-walkthrough.webm`. Public submission slide deck size is `18956`, and custom-triage screenshot size is `3219914`.
- Production: `dpl_CBMxPk4uE5eyQF1keHepSD1qZzaA`, aliased at `https://ouija-olive.vercel.app`.
- Public proof: `/api/evaluate` returns `100`, `9/9`, `pass`, with `Comparison experiment custom pattern archetype` in the unsupported boundary case; `/api/runtime-proof` returns `fallback_ready`, eight templates, `9/9`, and `server_dry_run`; `/api/mcp/status` returns server dry-run with 10 connector routes; hosted walkthrough returns HTTP 200 with `video/webm` and `content-length: 14658970`; public `/api/analyze` for paper towel absorbency returns `matchQuality: closest_supported`, `patternArchetype.id: comparison`, and graph suggestion `Bar chart by paper towel brand or type`.
- Public desktop/mobile Playwright smoke confirmed Pattern Archetype Coach is visible with `Comparison experiment`, no console errors, and no horizontal overflow.
- Fresh verification passed: `npm run test` (68 passed), `npm run build`, `npm run test:e2e` (9 passed), `npm audit --json` (0 vulnerabilities), `git diff --check`, `OUIJA_URL=http://127.0.0.1:5188 npm run capture:submission`, `OUIJA_URL=http://127.0.0.1:5188 OUIJA_CAPTION_MS=3000 npm run record:walkthrough`, `npm run sync:public-submission`, `ffprobe`, `shasum -a 256`, production deploy, public endpoint/asset checks, and public desktop/mobile Playwright smoke.
- Remaining external loops: actual Devpost submission, Devpost 2-5 student team roster ambiguity, optional real OpenAI web-search enrichment only with explicit API-key approval, and optional live Composio credentials only after consent/server setup.

## DeepWiki MCP + Devpost Pack Checkpoint - 2026-07-11

- Council verdict: Ouija works and is submittable for AIYES Track 1. First place/top award still cannot be guaranteed because judging, Devpost submission, and the final 2-5 student team roster are external.
- Composio discovery found active no-auth Composio Search and DeepWiki MCP toolkits. The practical improvement was not random connector breadth; it was adding a low-risk `deepwiki-source-proof` route for public source/codebase verification plus a hosted Devpost Submission Pack.
- Shipped `deepwiki-source-proof` as the eleventh consent-gated MCP route. It uses toolkit slug `deepwiki_mcp`, recommended tools `DEEPWIKI_MCP_READ_WIKI_STRUCTURE`, `DEEPWIKI_MCP_READ_WIKI_CONTENTS`, and `DEEPWIKI_MCP_ASK_QUESTION`, requires `COMPOSIO_DEEPWIKI_ALLOWED_TOOLS`, does not require a private account auth config, and shares only the public repo name plus a judge-facing architecture question.
- Added `docs/devpost-submission-pack.html`, synced `public/submission/devpost-pack.html`, linked it from the hosted Submission Hub and Judge Brief, and updated README, API/ENV/RUNBOOK docs, Devpost copy, AIYES brief, judging checklist, submission assets, tests, and public sync script.
- Production: `dpl_6aaeK6s3kZC1XaH8v7trTVUKzco8`, aliased at https://ouija-olive.vercel.app. Devpost pack: https://ouija-olive.vercel.app/submission/devpost-pack.html. Submission Hub: https://ouija-olive.vercel.app/submission/.
- Live proof: Devpost pack HTTP 200 with `Devpost Submission Pack`, `DeepWiki public repo audit`, and `Team Roster Worksheet`; Submission Hub HTTP 200 with `Open submission pack`, `11 routes`, and `DeepWiki`; `/api/mcp/status` returned `server_dry_run`, 11 routes, `deepwiki_mcp`, and missing `COMPOSIO_DEEPWIKI_ALLOWED_TOOLS`; `/api/evaluate` returned `100`, `9/9`, `pass`.
- Browser proof: hosted Devpost pack desktop `1440x900` and mobile `390x844` Playwright smoke showed heading `Ouija`, no horizontal overflow, and zero console errors.
- Verification passed: `npm run test` (14 files, 83 tests), `npm run build`, `npm run test:e2e` (36 passed across Chromium, Firefox, WebKit, and mobile Safari), `npm audit --json` (0 vulnerabilities), `git diff --check`, `npm run sync:public-submission`, local Node fetch smoke, production deploy, live HTTP smoke, and hosted desktop/mobile Playwright smoke.
- Remaining external loops: commit/push, actual Devpost submission, final 2-5 student team roster on Devpost, optional live OpenAI web-search enrichment only with explicit API-key approval, and optional live Composio credentials only after consent/server setup.
