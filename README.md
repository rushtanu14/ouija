# Ouija

Ouija is a student-facing AI experiment interpreter for middle and high school science labs. A student describes an experiment, Ouija identifies the likely lab type, grounds expected results in trusted references, lets the student enter table data, and compares the data against the expected pattern without writing the lab report.

## V1 Scope

- Physics: projectile motion, pendulum period vs length, and Ohm's law circuits.
- Chemistry: reaction rate vs temperature and density layering.
- Biology: enzyme activity vs temperature and plant growth vs light color.
- Earth science: water filtration and turbidity.
- Input mode: editable table data plus spreadsheet/CSV paste import.
- Academic integrity and safety: hints, whole-pattern evidence checks, repeat reliability, safety boundaries, next-trial planning, explanations, and Claim Coach prompts only.

## Core Workflow

1. Describe or choose a middle/high school experiment.
2. Review Ouija's classification, Run Snapshot, variables, expected pattern, expected-overlay graph, and citations.
3. Use Judge Demo Path to walk evaluators through problem fit, AI design, student workflow, evidence handoff, and submission proof.
4. Use AI Runtime Proof to verify the active AI path, fallback/web-search readiness, live evaluation coverage, server-only key boundary, and MCP bridge mode.
5. Use Guided Lab Flow and Pre-Lab Design Coach to see the current next action, variables, controls, repeats, source task, table plan, and safety gate.
6. Paste spreadsheet rows or edit table data near the top of the workflow.
7. Use Grounding Audit, the expected overlay, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, Comparison Insights, Custom Lab Triage, and Claim Coach to find source-trust gaps, visual pattern mismatches, whole-graph support, control-variable issues, repeat-trial gaps, safety boundaries, data problems, vocabulary gaps, evidence gaps, unsupported-lab next questions, and the next reasoning question.
8. Use Pattern Evidence Engine, Reliability Coach, and Next Trial Planner to decide what to repeat, average, tighten, or measure next before writing the claim.
9. Review Learning Impact Loop, Learning Exit Ticket, and Student Reflection Workspace to see whether the student is ready to plan, reason, and explain answers themselves before writing.
10. Copy the Evidence Packet as a student-owned reasoning handoff with judge demo path, Custom Lab Triage, Pre-Lab Design Coach, AIYES rubric fit, learning impact, Learning Exit Ticket, student reflection drafts, guided flow, Grounding Audit, AI Evaluation Harness, Data Handling Ledger, sources, checks, safety notes, concept vocabulary, pattern evidence, repeat reliability, data table, next-trial plan, blanks, and next question.
11. Inspect Model Strategy, AI Evaluation Harness, Data Handling Ledger, and AIYES Rubric Fit to show candidate ranking, matched signals, fallback logic, validators, model-behavior checks, privacy flow, retention, student controls, risk controls, and official criteria mapping.
12. Use Reasoning Trail to show how Ouija classified the experiment, exposed model strategy, ran the AI evaluation harness, guided the judge demo, planned the pre-lab setup, audited source grounding, guided the student path, built the concept scaffold, checked the learning exit ticket, checked the safety boundary, audited student-data handling, audited the table data, scored whole-pattern evidence, checked repeat reliability, planned the next trial, and maps the run to AIYES Track 1 evidence.
13. Open Evaluation Bench to see nine live checks: eight supported lab demos plus the unsupported-lab boundary.
14. Save lab snapshots locally so a student can return to a checked run without sending data to an account system.
15. Use Progress Portfolio to show saved-run count, score trend, subject breadth, strongest run, and next portfolio action.
16. Use MCP Integration Coach to validate Composio-powered Google Docs, Google Sheets, Google Drive, Google Classroom, Google Forms, Google Calendar, and Notion handoffs through the server dry-run bridge, plus the readiness matrix, without exposing credentials or sending student data.
17. Open AI Model Card for the architecture, grounding, evaluation, privacy, MCP-export boundary, and guardrail summary.
18. Open Judge Brief for a compact Track 1 proof surface: live app, hosted deck/video, judge demo path, official rubric fit, learning impact, student reflection drafts, progress portfolio, MCP readiness plan, AI pipeline, model strategy, evaluation, data-handling ethics, tests, and integrity constraints.

Guided Lab Flow gives students one current next action and six stable stages so the interface feels like a lab workflow rather than separate AI outputs.

Run Snapshot gives students and judges a compact first-read of rubric fit, Evaluation Bench status, learning impact, data flags, expected pattern, and the current action before the deeper evidence panels.

Judge Demo Path gives evaluators a five-step route through the live app: problem fit, AI design, student workflow, evidence handoff, and submission proof.

AI Runtime Proof exposes the live deployment's AI mode through the UI and `/api/runtime-proof`: template count, fallback or OpenAI web-search readiness, evaluation coverage, server-only key boundary, and MCP bridge mode without leaking secrets.

Claim Coach intentionally keeps blanks in the claim starter so students must write their own conclusion.

Evidence Packet exports a structured, copyable reasoning handoff without writing the conclusion paragraph.

Concept Coach turns each supported lab into middle/high school vocabulary, explanation steps, and misconception checks.

Safety Coach turns each supported lab into classroom safety checks, material notes, cleanup instructions, stop conditions, and adult-review boundaries.

Reliability Coach checks repeated-trial counts, averages, and spread so students know whether a graph point is trustworthy before making a claim.

Expected overlay draws the trusted template pattern on the student's graph so the comparison is visible before any score or claim prompt.

Pattern Evidence Engine scores whether the full table supports the expected scientific pattern, using trend, peak, and ratio checks tailored to each lab.

Next Trial Planner gives adaptive measurement guidance: extend the pattern when data is clean, or repeat/fix flagged rows before the student writes a claim.

Reasoning Trail makes the AI pipeline visible for judging and student trust: classification, model strategy, variable mapping, citations, concept scaffolding, safety checks, table audit, whole-pattern evidence, repeat reliability, next-trial planning, and student-owned claim coaching.

Grounding Audit scores citation visibility, source agreement, and mixed-evidence boundaries before students use the expected pattern.

AI Evaluation Harness scores classifier confidence, coverage, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries inside each analysis run.

Data Handling Ledger makes student data flow inspectable: descriptions, table data, browser-local snapshots, grounding sources, retention, student controls, and server-only API-key boundaries are visible in the app and Evidence Packet.

Low-confidence descriptions are marked as closest supported matches, so Ouija shows its V1 coverage boundary instead of pretending every experiment is solved.

Custom Lab Triage keeps unsupported labs practical by inferring a likely focus, suggesting starter columns, building a Custom Investigation Planner with variables, controls, repeat guidance, starter rows, and hypothesis blanks, offering source-search queries, asking clarifying questions, and requiring teacher confirmation before students treat the guidance as a full match.

Pre-Lab Design Coach turns classification and triage into a before-data checklist: independent/dependent variables, controls, repeats, table columns, a source task, a safety gate, and a hypothesis starter that keeps blanks for the student.

Evaluation Bench runs a deterministic live suite against the same analysis engine used by students.

AI Model Card makes the model strategy inspectable: deterministic template matching, trusted fallback references, Grounding Audit, AI Evaluation Harness, Data Handling Ledger, Custom Lab Triage, Pre-Lab Design Coach, optional server-side OpenAI web-search enrichment, live evaluation, privacy boundaries, and academic-integrity safeguards.

AIYES Rubric Fit maps each run to the three visible official judging criteria using concrete app evidence, so judges see problem relevance, AI design/model strategy, and UX/design without guessing.

Learning Impact Loop measures student readiness for each run through outcome, data quality, concept learning, integrity, whole-pattern evidence, repeat reliability, and next-trial metrics.

Learning Exit Ticket turns AI feedback into three student reflection prompts for variables, graph pattern, and next step, so the app proves understanding without writing the conclusion.

Student Reflection Workspace lets students draft those exit-ticket answers in their own words, marks empty or too-short answers for revision, and exports only student-authored text.

Spreadsheet paste import turns copied lab-table rows into graph/check inputs without requiring students to retype every cell, and the expected overlay updates with the edited table.

Saved Labs stores up to six browser-local lab snapshots with the experiment, table rows, readiness score, and data flags.

Progress Portfolio turns those saved labs into repeated learning evidence: saved-run count, score trend, subject breadth, strongest run, milestones, and the next portfolio action.

MCP Integration Coach validates a practical Composio export path for the same student-owned evidence: create a Google Docs evidence packet, append table rows to Google Sheets, save a portfolio archive to Google Drive, draft a Google Classroom pre-lab checkpoint, create a Google Forms readiness check, schedule a Google Calendar next-trial reminder, or create a Notion learning record with student-authored reflection drafts. The readiness matrix shows required auth config env vars, allowed tools, least-privilege scopes, data shared, consent gates, and dry-run checks. The public app now includes `/api/mcp/status` and `/api/mcp/export` for server-side dry-run validation; live connector execution still requires `COMPOSIO_API_KEY`, connector auth config IDs, allowed tools, `COMPOSIO_LIVE_EXPORTS=true`, and student or teacher consent before export.

## Run

```bash
npm install
npm run dev
```

The app runs at `http://127.0.0.1:5188` and the API runs at `http://127.0.0.1:8787`.

For a production-style local smoke test:

```bash
npm run build
PORT=8799 HOST=127.0.0.1 npm start
```

`npm start` serves the built frontend and `/api/*` from one Express server.

## Verification

```bash
npm run test
npm run build
npm run test:e2e
npm audit --json
PORT=8799 HOST=127.0.0.1 npm start
```

## Deployment

The repo includes `vercel.json` and serverless API adapters under `api/` so Vercel can host the Vite app and the same-origin `/api/health`, `/api/evaluate`, `/api/runtime-proof`, `/api/analyze`, `/api/mcp/status`, and `/api/mcp/export` endpoints.

Production deployment: https://ouija-olive.vercel.app

## AI Grounding

Ouija works without credentials through deterministic built-in experiment templates and trusted citations. `GET /api/runtime-proof` reports whether the live deployment is using fallback or web-search-ready mode without exposing secret values. When `OPENAI_API_KEY` is present in the environment, the server attempts OpenAI Responses API web-search enrichment and falls back safely if enrichment is unavailable.

## Composio MCP Bridge

Ouija works without Composio credentials through server dry-run validation. `GET /api/mcp/status` reports connector readiness without leaking secret values. `POST /api/mcp/export` validates a consent-gated packet for Google Docs, Sheets, Drive, Classroom, Forms, Calendar, or Notion and stops before any external write unless a future live bridge is configured server-side.

## Submission Assets

- `docs/aiyes-submission-brief.md`
- `docs/API.md`
- `docs/CONTRIBUTING.md`
- `docs/aiyes-slide-deck.html`
- `docs/devpost-submission-copy.md`
- `docs/ENV.md`
- `docs/five-minute-demo-script.md`
- `docs/judging-checklist.md`
- `docs/RUNBOOK.md`
- `docs/submission-assets.md`

Generate screenshots for the deck and Devpost page with:

```bash
npm run capture:submission
npm run record:walkthrough
npm run sync:public-submission
```

Hosted submission links after deployment:

- Slide deck: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
