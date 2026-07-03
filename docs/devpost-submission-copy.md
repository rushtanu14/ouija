# Devpost Submission Copy

## Project Title

Ouija

## Tagline

A student-safe AI experiment interpreter for middle and high school science labs.

## Inspiration

Students often leave a lab with a table of numbers, a graph, and no clear way to reason from evidence. Generic chatbots can jump straight to writing the lab report, which hurts learning and academic integrity. Ouija was built to help students understand the experiment, check their data, and write their own claim.

## What It Does

Ouija lets a student describe a science experiment, identifies the likely lab type, shows expected scientific patterns with citations, exposes a Judge Demo Path for evaluators, exposes Model Strategy with candidate ranking and risk controls, runs an AI Evaluation Harness for model behavior and safeguards, maps the run to the official AIYES rubric, scores student readiness through a Learning Impact Loop, gives a Learning Exit Ticket with variable, graph-pattern, and next-step prompts, gives a Guided Lab Flow with the student's current next action, audits source grounding and mixed evidence, exposes a Data Handling Ledger for privacy, retention, student controls, and server-only API-key boundaries, imports or edits the student's table data, graphs the data with a dashed expected-pattern overlay, scores whether the whole table supports the expected pattern, audits the method, checks repeated-trial reliability, checks classroom safety boundaries, teaches key concepts with vocabulary and misconception checks, detects data issues, plans the next safe measurement or repeat trial, shows a Reasoning Trail for the AI pipeline, exposes an AI Model Card for judge trust, saves browser-local lab snapshots, turns saved runs into a Progress Portfolio, and gives a Claim Coach plus Evidence Packet with blanks and questions instead of a finished conclusion.

If a student describes an unsupported lab, Ouija marks the result as a low-confidence closest supported match instead of pretending it can classify everything. Custom Lab Triage then keeps the interaction practical by inferring the likely focus, suggesting starter table columns, building a Custom Investigation Planner with variables, controls, repeat guidance, starter rows, and hypothesis blanks, offering source-search queries, asking clarifying questions, and requiring teacher confirmation before the student treats the guidance as a full match. A live Evaluation Bench runs eight checks in the app: seven supported lab demos plus the unsupported-lab boundary.

## How It Uses AI

Ouija uses a hybrid strategy. Deterministic templates make seven common school-lab demos reliable without credentials. Judge Demo Path condenses each run into five evaluator-visible steps: problem fit, AI design, student workflow, evidence handoff, and submission proof. Model Strategy ranks candidate templates, shows matched signals, reports confidence and candidate gaps, names fallback behavior, and lists risk controls. AI Evaluation Harness scores classifier confidence, coverage, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries for each run. Data Handling Ledger makes the privacy model inspectable by showing how descriptions, table data, browser-local saved labs, grounding sources, and the server API key are used, retained, and controlled by the student. AIYES Rubric Fit turns those same signals into concrete evidence for the three official criteria: problem/relevance, AI technical design/model strategy, and UX/design. Learning Impact Loop converts the result into measurable student-readiness signals: outcome, data quality, concept learning, integrity, whole-pattern evidence, repeat reliability, and next-trial status. Learning Exit Ticket turns that feedback into student reflection prompts judges can inspect: variables, graph pattern, and next step. Progress Portfolio turns Saved Labs into repeated learning evidence by showing saved-run count, score trend, subject breadth, strongest run, milestones, and next portfolio action. Grounding Audit scores citation visibility, source agreement, and mixed-evidence boundaries before students use the expected pattern. Expected overlay points are generated from each trusted template pattern, so students visually compare their data against the expected result before reading the coaching text. Pattern Evidence Engine applies deterministic trend, peak, and ratio checks tailored to the classified lab, so a student sees whether the dataset actually supports the expected science pattern before writing a claim. Custom Lab Triage turns low-confidence descriptions into a structured investigation planner instead of a fake answer. When `OPENAI_API_KEY` is configured, the server can call the OpenAI Responses API `web_search` tool to enrich expected-results explanations and citations. The frontend never receives the API key. A live Reasoning Trail exposes the pipeline: classify the experiment, expose model strategy, run AI evaluation, guide the judge demo, map variables, audit source grounding, audit data handling, overlay expected graph values, guide the student's next action, build a concept scaffold, check the learning exit ticket, check school-lab safety boundaries, import or audit table data, score whole-pattern evidence, check repeated-trial averages and spread, plan the next trial, and coach a student-owned claim. A server-side Evaluation Bench proves the supported-template and boundary behavior through `/api/evaluate`.

## Built With

React, Vite, TypeScript, Express, OpenAI Responses API, Recharts, Lucide React, Vitest, Playwright, and Supertest.

## Accomplishments

- Built a full-stack app with local fallback and optional web-search grounding.
- Covered physics, chemistry, biology, and earth science demos.
- Added pendulum period vs length as a supported middle/high school physics lab.
- Added Ohm's law circuits as a supported middle/high school physics lab.
- Added Guided Lab Flow so students see the next action and stage sequence instead of navigating disconnected analysis panels.
- Added Judge Demo Path so evaluators get a five-step walkthrough through problem fit, AI design, student workflow, evidence handoff, and submission proof.
- Added Model Strategy so judges can inspect candidate ranking, matched signals, confidence, fallback behavior, validators, and risk controls.
- Added AI Evaluation Harness so judges can inspect model-behavior checks, coverage, validators, safety, and fallback boundaries in the live run.
- Added Data Handling Ledger so judges can inspect privacy, retention, student controls, local snapshots, and server-only API-key boundaries.
- Added AIYES Rubric Fit so the live app maps all three official judging criteria to concrete run evidence.
- Added Learning Impact Loop so the live app measures student readiness instead of only describing intended impact.
- Added Learning Exit Ticket so students must explain variables, graph patterns, and next steps themselves before writing a conclusion.
- Added Progress Portfolio so saved lab snapshots become visible learning-progress evidence for judges.
- Added Grounding Audit so students and judges can see citation trust, source agreement, and mixed-evidence boundaries.
- Added expected-pattern graph overlay so students can visually compare their data against the trusted template pattern.
- Added Pattern Evidence Engine so the app scores whether the whole table supports the expected trend, peak, or ratio pattern.
- Added Method Audit for reproducibility, variables, controls, assumptions, confounds, and limits.
- Added Reliability Coach so students see repeated-trial counts, averages, spread, and retest recommendations.
- Added Concept Coach so each lab includes vocabulary, explanation steps, and misconception checks for middle/high school students.
- Added Safety Coach so school-lab PPE, material limits, cleanup, stop conditions, and adult-review boundaries are visible.
- Added Claim Coach so students get reasoning support without generated lab-report conclusions.
- Added Next Trial Planner so students know whether to extend the pattern or repeat/fix a flagged row.
- Added Evidence Packet so students can copy a source-backed reasoning handoff without receiving a completed conclusion paragraph.
- Added spreadsheet/CSV paste import so copied lab tables immediately drive graphing, pattern evidence, warnings, Method Audit, and Claim Coach.
- Added Reasoning Trail and Track 1 evidence score so judges can see the AI pipeline, rubric fit, and constraints in the live app.
- Added AI Model Card so judges can inspect the architecture, grounding mode, evaluation method, privacy boundary, and safeguards in the live product.
- Added Custom Lab Triage plus Custom Investigation Planner so unsupported labs still produce practical variables, controls, repeat guidance, starter rows, source searches, clarifying questions, and a teacher-confirmation boundary.
- Added Saved Labs and Settings so the top navigation supports real student workflow instead of inactive sections.
- Added Judge Brief so evaluators can immediately see Track 1 fit, live readiness, and remaining external submission loops.
- Added low-confidence boundary handling for unsupported experiment descriptions.
- Added Evaluation Bench with eight live cases for supported coverage and boundary behavior.
- Added density layering as a supported middle/high school chemistry lab instead of leaving it as an unsupported boundary example.
- Added a paced captioned walkthrough showing the problem, architecture, live app workflow, concept coaching, next-trial planning, evaluation, and hosted submission links.
- Verified unit/API tests, production build, E2E, audit, production start, and desktop/mobile browser QA.
- Deployed a live Vercel build with working same-origin API endpoints.

## What I Learned

The hardest part was making an AI science helper useful without turning it into an answer machine. The product became stronger when it focused on whole-pattern evidence, method quality, repeated trials, safety, concept understanding, and student-owned claims.

## What Is Next

Submit the hosted deck/video package on Devpost, handle the live page's listed 2-5 member team requirement, optionally add a real OpenAI web-search-enriched demo, and keep expanding middle/high school experiment templates and adaptive next-trial profiles after the seven-demo foundation.

## Links

- Source code or deployment link: https://ouija-olive.vercel.app
- Live demo: https://ouija-olive.vercel.app
- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
