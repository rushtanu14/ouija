# AIYES Judging Checklist

## Problem Definition And Real-World Relevance

- Primary user is students only.
- Problem is common in middle and high school labs: students struggle to connect experiment setup, data quality, expected scientific patterns, and evidence-backed reasoning.
- Impact is practical: faster debugging of lab data, better understanding, fewer report-writing shortcuts.
- Run Snapshot gives a first-scroll readout of rubric fit, evaluation status, learning impact, data flags, expected pattern, and current action.
- Student Impact Brief gives judges a first-scroll answer for target user, lab-reasoning pain point, before/after student benefit, evidence basis, and remaining proof gap.
- Student/Judge views keep the default app practical for students while `?judge=1` exposes the full judge proof stack.
- Submission Hub gives judges one hosted route for live app, judge view, deck, walkthrough, source, screenshots, and proof endpoints.
- Practical science behavior is visible: students see whether the whole graph supports the expected pattern and whether repeated trials have enough count, average, and spread to support a claim.
- AIYES Rubric Fit gives judges concrete problem/relevance evidence for each analyzed run.
- AIYES Values Fit gives judges concrete mission evidence for student agency, access, connected evidence, practical innovation, and ethical inclusion.
- AIYES Development Journey gives judges a required-submission story from problem identification through constraints and hosted links.
- Learning Impact Loop measures whether a run leaves the student ready to reason, watching flags, or needing fixes.
- Student Pilot Study Kit gives judges a consent-safe 10-minute protocol for collecting anonymous UX and impact evidence without claiming fake completed user testing.
- Pilot Evidence Tracker includes a CSV-ready anonymous export so the team can carry real pilot observations into Devpost or Composio-backed Sheets/Forms/Notion handoffs.
- Pre-Lab Design Coach helps students plan variables, controls, repeats, source checks, table columns, and safety before collecting data.
- Learning Exit Ticket asks the student to explain variables, graph pattern, and next step in their own words before writing.
- Student Level Lens adapts the same run for middle-school pattern reading or high-school quantitative evidence, controls, repeats, and uncertainty.
- Concept Mastery Check turns variable, expected-pattern, and integrity understanding into a visible score before evidence export.
- Student Reflection Workspace proves those exit-ticket answers are student-authored drafts, not generated conclusions.
- Progress Portfolio shows whether saved runs demonstrate learning trend, subject breadth, and a next portfolio action.
- Portfolio Story Builder turns saved-run evidence into prompts for a student-written progress story.
- MCP Integration Coach shows how the same student-owned evidence could move into a Composio Search source audit, Composio Scholar claim check, Semantic Scholar reference check, Composio Browser source capture, DeepWiki public-source proof, Canvas assignment-context import, and classroom tools, including a Google Classroom pre-lab checkpoint, Google Forms readiness check, and Google Calendar next-trial reminder, without sending data before consent. Composio Sessions Strategy separates read-only source verification and assignment-context bundles from later export sessions.
- Judge Demo Path gives evaluators a direct route through problem fit, AI design, student workflow, evidence handoff, and submission proof.
- Custom Lab Triage and Pattern Archetype Coach keep unsupported student experiments useful without claiming full V1 coverage, because they give students a concrete investigation planner plus comparison/trend/optimum/time-series graph guidance instead of a fake expected result.

## AI Technical Design And Model Strategy

- Hybrid design: deterministic science templates plus optional OpenAI Responses API `web_search`.
- Server-side grounding keeps the API key out of the browser.
- AI Runtime Proof shows fallback/web-search readiness, template count, evaluation coverage, server-only key boundary, and MCP bridge mode through the UI and `/api/runtime-proof`.
- Model Strategy exposes candidate rankings, matched signals, confidence, fallback behavior, validation layers, safety layer, and risk controls.
- Technical Depth Proof gives judges a compact beyond-simple-API scorecard for decision trace, evaluation harness, grounding quality, expected-pattern engine, privacy, and integrity.
- AI Evaluation Harness scores classifier confidence, coverage, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries.
- Data Handling Ledger exposes what student data is used, where it is stored, retention, local snapshots, student controls, and the server-only API-key boundary.
- Student Pilot Study Kit is included in the analysis schema, Evidence Packet, rubric fit, development journey, evaluation evidence, and Google Forms MCP preview.
- Pilot Evidence Tracker export redacts direct contact details and keeps the pilot evidence path browser-local until the team intentionally copies or validates a consent-gated handoff.
- MCP Integration Coach validates Composio-powered Search, Scholar claim checks, Semantic Scholar reference checks, Browser source capture, DeepWiki public-source proof, Canvas assignment context, Google Docs, Google Sheets, Google Drive, Google Classroom, Google Forms, Google Calendar, and Notion routes through `/api/mcp/export`, then prepares a scoped `/api/mcp/session` ticket while keeping `COMPOSIO_API_KEY`, auth config IDs where required, and raw MCP URLs server-side. Judge Mode shows the source-verification and Canvas assignment-context sessions before any write/export connector.
- Grounding Audit scores citation visibility, source agreement, mixed-evidence boundaries, and student source use.
- Result schema separates classification, expected result, citations, row checks, hints, and Claim Coach.
- Method Audit adds deterministic experiment-quality evaluation beyond plain text generation.
- Expected-pattern overlay gives a student-visible graph comparison instead of hiding the expected result in prose.
- Pattern Evidence Engine adds deterministic whole-table trend, peak, and ratio scoring beyond row-by-row warnings.
- Reliability Coach adds deterministic repeated-trial grouping, averages, spread checks, and retest recommendations.
- Safety Coach adds deterministic school-lab PPE, material, cleanup, stop-condition, and adult-review guidance.
- Concept Coach turns each supported lab into vocabulary, explanation steps, source tasks, and misconception checks.
- Learning Exit Ticket turns model feedback into inspectable student reflection prompts rather than generated conclusions.
- Student Reflection Workspace scores empty, short, and ready student-authored drafts without filling them in.
- Student Level Lens derives grade-band scaffolds from the same variables and expected pattern instead of requiring separate hand-written lesson copy.
- Concept Mastery Check derives scored questions from the current analysis result, so understanding proof changes with the classified lab.
- Pre-Lab Design Coach turns the same classification and triage output into a before-data checklist instead of waiting until after rows exist.
- Custom Lab Triage turns low-confidence descriptions into inferred focus, starter columns, variables, controls, repeat guidance, starter rows, source-search queries, clarifying questions, and a teacher-confirmation boundary; Pattern Archetype Coach adds graph type, axes, expected pattern language, source question, and a student repeat-check.
- Fallback mode keeps demos reliable without credentials.
- Guided Lab Flow turns the result schema into a student-facing next-action workflow.
- AIYES Rubric Fit connects model strategy, grounding mode, validators, and fallback behavior to the official AI technical design/model strategy criterion.
- AIYES Values Fit connects the same model, grounding, privacy, and student-control signals to AIYES's democracy, diversity, connectivity, innovation, and ethical-inclusion values.
- AIYES Development Journey connects model strategy, data handling, testing, UX, ethics, impact, and submission proof to the Track 1 development journey requirement.
- Learning Impact Loop derives measurable student-readiness output from the same analysis engine, not from manual copy.

## Technical Depth Beyond Simple API Use

- Eight supported demo labs across physics, chemistry, biology, and earth science.
- Model Strategy prevents the AI design from looking like a black-box chatbot or a simple prompt wrapper.
- Technical Depth Proof prevents the fallback demo from looking template-only by showing the live decision trace, validators, overlays, audits, and evaluation suite in one place.
- AI Runtime Proof gives judges a live endpoint for the deployed AI path instead of asking them to trust screenshots or prose.
- AI Evaluation Harness turns model behavior and safeguards into visible pass/review/fail checks.
- Judge Demo Path prevents the technical depth from becoming a maze during the live evaluation.
- Guided Lab Flow makes the workflow scannable before students dive into detailed panels.
- Grounding Audit prevents source trust from being hidden in prose.
- Data validation catches missing values, unit/number mismatches, outliers, and pattern conflicts.
- Expected-pattern overlay shows student data against trusted template values on the same graph.
- Method Audit scores reproducibility and exposes variables, controls, assumptions, confounds, and safety/interpretation limits.
- Pattern Evidence Engine scores whether the whole graph supports the expected science pattern and asks what repeat would test a mismatch.
- Reliability Coach checks repeated-trial count, average, spread, and which condition to repeat first.
- Safety Coach makes responsible classroom-use boundaries visible instead of hiding safety inside prose.
- Concept Coach makes the learning value visible instead of only showing correctness checks.
- Next Trial Planner turns row/method checks into an adaptive next measurement or repeat-trial suggestion.
- Spreadsheet/CSV paste import and editable table rows recompute graph comparison and Claim Coach state live.
- Reasoning Trail visibly maps the run to AIYES Track 1 evidence: problem/impact, AI technical design, testing/evaluation, and ethics/constraints.
- AIYES Rubric Fit visibly maps the run to the three official criteria: Problem Definition and Real-World Relevance, AI Technical Design and Model Strategy, and User Experience and Design.
- AIYES Values Fit visibly maps the run to democracy, diversity, connectivity, innovation, and ethical inclusion.
- AIYES Development Journey visibly maps the run to problem, data, model, build, testing, UX, ethics, impact, constraints, and submission proof.
- Technical Depth Proof visibly answers the AI technical design criterion with concrete run metrics before judges read the deeper model cards.
- Learning Impact Loop visibly scores outcome, data quality, concept learning, integrity, pattern evidence, repeat reliability, and next-trial readiness for every run.
- Pre-Lab Design Coach visibly scores setup readiness before data collection.
- Learning Exit Ticket visibly checks whether the student can explain variables, pattern evidence, and the next controlled step.
- Student Level Lens visibly switches between middle-school and high-school support for the same experiment.
- Concept Mastery Check visibly scores whether the student knows the independent variable, expected evidence pattern, and claim boundary.
- Student Reflection Workspace visibly captures the student's own variable, pattern, and next-step drafts.
- Progress Portfolio visibly turns Saved Labs into repeated learning evidence instead of only storage.
- Portfolio Story Builder visibly keeps the progress narrative student-owned through prompts, evidence references, and blanks.
- Expected graph and editable table now appear before Model Strategy, AI Evaluation Harness, Data Handling Ledger, and AIYES Rubric Fit, so the practical student workflow is visible before the deeper judge evidence stack.
- MCP Integration Coach visibly turns the Evidence Packet, Pre-Lab Design Coach, Next Trial Planner, and Progress Portfolio into a consent-gated source-audit, Scholar claim-check, Semantic Scholar reference-check, Browser source-capture, DeepWiki source-proof, Canvas assignment-context, and classroom handoff plan with a Composio Sessions strategy, readiness matrix for env vars, allowed tools, scopes, dry-run checks, and data shared.
- AI Model Card visibly summarizes architecture, grounding mode, evaluation method, privacy boundary, and risk controls.
- Data Handling Ledger visibly summarizes privacy, retention, browser-local saves, and student controls.
- Deterministic Regression Suite exposes nine deterministic checks through the app and `/api/evaluate`.
- Unsupported-boundary evaluation now proves Custom Lab Triage, Pattern Archetype Coach, and custom planner rows appear when a student asks about an off-template paper towel absorbency experiment.
- Saved Labs and Settings nav items render real workflow sections; no dead top-nav placeholders.
- Academic-integrity guard is implemented in both data model and UI.
- Production start path serves the built frontend and API from one Express server.

## User Experience And Design

- Three-region workspace: input, analysis/table/graph, and sources/explanation.
- Visible clickable citations.
- Grounding Audit gives students a source-trust score and a concrete source task before they write.
- Expected-pattern overlay makes the graph comparison visual, not just textual.
- Run Snapshot reduces first-scroll cognitive load by putting run status, expected pattern, and next action above the deeper evidence panels.
- Student Focus reduces overload in the default view by keeping next move, evidence check, repeat check, and before-claim guidance near the top while hiding judge-only proof panels.
- Guided Lab Flow reduces cognitive load by showing identify, prepare, understand, check, plan, and claim stages.
- Judge Demo Path reduces evaluator cognitive load by showing the intended five-step live walkthrough near the top of the analysis panel.
- AI Runtime Proof sits near the top of the analysis panel so evaluators can verify the runtime, tests, secret boundary, and MCP mode before the deeper Model Card.
- Claim Coach converts analysis into a student-owned reasoning checklist instead of a generated final paragraph.
- Evidence Packet exports the same reasoning scaffold with Judge Demo Path, Custom Lab Triage, Pattern Archetype Coach, Grounding Audit, AI Evaluation Harness, sources, safety coach, concept coach, pattern evidence, reliability coach, data, checks, next-trial plan, and blanks, not a completed report.
- Data Handling Ledger appears in the app and Evidence Packet so judges can inspect privacy and student-control claims during the demo or exported handoff.
- AIYES Rubric Fit appears in the app and Evidence Packet so judges can inspect the official UX/design fit during the live demo or exported handoff.
- AIYES Values Fit appears in the app and Evidence Packet so judges can inspect the values fit during the live demo or exported handoff.
- AIYES Development Journey appears in the app and Evidence Packet so judges can inspect the required slide/video story during the live demo or exported handoff.
- Student Impact Brief appears in the app and Evidence Packet so problem relevance is not buried in the slide deck.
- Learning Impact Loop appears in the app and Evidence Packet so the user's practical benefit is measurable inside the workflow.
- Pre-Lab Design Coach appears in the app and Evidence Packet so students can use Ouija before collecting data, not only after a table exists.
- Learning Exit Ticket appears in the app and Evidence Packet so judges can inspect student understanding prompts during the demo or exported handoff.
- Student Level Lens appears in the app and Evidence Packet so judges can inspect differentiated middle/high school UX.
- Concept Mastery Check appears in the app and Evidence Packet so judges can inspect measured understanding before export.
- Student Reflection Workspace appears in the app and Evidence Packet so judges can inspect student-authored answers without Ouija writing the conclusion.
- Progress Portfolio appears near Saved Labs so judges can inspect score trend, subject breadth, and strongest saved run.
- Portfolio Story Builder appears inside Progress Portfolio so judges can inspect student-authored impact prompts before any classroom export.
- MCP Integration Coach appears near Progress Portfolio so judges can inspect the exact source-audit/export payload, Composio Search route, Scholar claim-check route, Semantic Scholar reference-check route, Browser source-capture route, DeepWiki source-proof route, Canvas assignment-context route, Google Classroom pre-lab checkpoint route, Google Forms readiness route, Google Calendar next-trial reminder route, credential boundary, Composio route, and server dry-run readiness matrix before any live connector is enabled.
- Submission Hub keeps the external judging packet scannable instead of forcing evaluators to hunt through the README or Devpost copy.
- Desktop and mobile E2E checks verify no horizontal overflow.

## Remaining Submission Work

- Submit the hosted Submission Hub, live demo, slide deck, and video walkthrough on Devpost.
- Use `https://ouija-olive.vercel.app/submission/` as the one-click judge packet.
- Use `https://ouija-olive.vercel.app/?judge=1` for judge walkthroughs and `https://ouija-olive.vercel.app` for the student default view.
- Handle the live Devpost page's listed 2-5 member team requirement; the overview text also says participants may work individually, so verify the submission form behavior before final submit.
- Optionally configure a real OpenAI API key for one web-search-enriched demo and live Composio credentials for classroom exports.
- Use `/api/runtime-proof`, `/api/evaluate`, `/api/mcp/status`, and a consent-gated `/api/mcp/session` dry-run as quick public smoke checks after each deploy.
- In Judge Brief, verify the AIYES Submission Checklist shows slide presentation, video walkthrough, submission hub, source/deployment, and the external 2-5 student team step.
- Present or export `docs/aiyes-slide-deck.html`.
- Paste `docs/devpost-submission-copy.md` into Devpost.
