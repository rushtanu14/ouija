# AIYES Judging Checklist

## Problem Definition And Real-World Relevance

- Primary user is students only.
- Problem is common in middle and high school labs: students struggle to connect experiment setup, data quality, expected scientific patterns, and evidence-backed reasoning.
- Impact is practical: faster debugging of lab data, better understanding, fewer report-writing shortcuts.
- Practical science behavior is visible: students see whether the whole graph supports the expected pattern and whether repeated trials have enough count, average, and spread to support a claim.
- AIYES Rubric Fit gives judges concrete problem/relevance evidence for each analyzed run.
- Learning Impact Loop measures whether a run leaves the student ready to reason, watching flags, or needing fixes.
- Learning Exit Ticket asks the student to explain variables, graph pattern, and next step in their own words before writing.
- Progress Portfolio shows whether saved runs demonstrate learning trend, subject breadth, and a next portfolio action.
- Judge Demo Path gives evaluators a direct route through problem fit, AI design, student workflow, evidence handoff, and submission proof.
- Custom Lab Triage keeps unsupported student experiments useful without claiming full V1 coverage, because it gives students a concrete investigation planner instead of a fake expected result.

## AI Technical Design And Model Strategy

- Hybrid design: deterministic science templates plus optional OpenAI Responses API `web_search`.
- Server-side grounding keeps the API key out of the browser.
- Model Strategy exposes candidate rankings, matched signals, confidence, fallback behavior, validation layers, safety layer, and risk controls.
- AI Evaluation Harness scores classifier confidence, coverage, source grounding, pattern validation, repeat reliability, row validators, safety/integrity, and fallback boundaries.
- Data Handling Ledger exposes what student data is used, where it is stored, retention, local snapshots, student controls, and the server-only API-key boundary.
- Grounding Audit scores citation visibility, source agreement, mixed-evidence boundaries, and student source use.
- Result schema separates classification, expected result, citations, row checks, hints, and Claim Coach.
- Method Audit adds deterministic experiment-quality evaluation beyond plain text generation.
- Expected-pattern overlay gives a student-visible graph comparison instead of hiding the expected result in prose.
- Pattern Evidence Engine adds deterministic whole-table trend, peak, and ratio scoring beyond row-by-row warnings.
- Reliability Coach adds deterministic repeated-trial grouping, averages, spread checks, and retest recommendations.
- Safety Coach adds deterministic school-lab PPE, material, cleanup, stop-condition, and adult-review guidance.
- Concept Coach turns each supported lab into vocabulary, explanation steps, source tasks, and misconception checks.
- Learning Exit Ticket turns model feedback into inspectable student reflection prompts rather than generated conclusions.
- Custom Lab Triage turns low-confidence descriptions into inferred focus, starter columns, variables, controls, repeat guidance, starter rows, source-search queries, clarifying questions, and a teacher-confirmation boundary.
- Fallback mode keeps demos reliable without credentials.
- Guided Lab Flow turns the result schema into a student-facing next-action workflow.
- AIYES Rubric Fit connects model strategy, grounding mode, validators, and fallback behavior to the official AI technical design/model strategy criterion.
- Learning Impact Loop derives measurable student-readiness output from the same analysis engine, not from manual copy.

## Technical Depth Beyond Simple API Use

- Seven supported demo labs across physics, chemistry, biology, and earth science.
- Model Strategy prevents the AI design from looking like a black-box chatbot or a simple prompt wrapper.
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
- Learning Impact Loop visibly scores outcome, data quality, concept learning, integrity, pattern evidence, repeat reliability, and next-trial readiness for every run.
- Learning Exit Ticket visibly checks whether the student can explain variables, pattern evidence, and the next controlled step.
- Progress Portfolio visibly turns Saved Labs into repeated learning evidence instead of only storage.
- AI Model Card visibly summarizes architecture, grounding mode, evaluation method, privacy boundary, and risk controls.
- Data Handling Ledger visibly summarizes privacy, retention, browser-local saves, and student controls.
- Evaluation Bench exposes eight live checks through the app and `/api/evaluate`.
- Unsupported-boundary evaluation now proves Custom Lab Triage and custom planner rows appear when a student asks about an off-template plant-light experiment.
- Saved Labs and Settings nav items render real workflow sections; no dead top-nav placeholders.
- Academic-integrity guard is implemented in both data model and UI.
- Production start path serves the built frontend and API from one Express server.

## User Experience And Design

- Three-region workspace: input, analysis/table/graph, and sources/explanation.
- Visible clickable citations.
- Grounding Audit gives students a source-trust score and a concrete source task before they write.
- Expected-pattern overlay makes the graph comparison visual, not just textual.
- Guided Lab Flow reduces cognitive load by showing identify, prepare, understand, check, plan, and claim stages.
- Judge Demo Path reduces evaluator cognitive load by showing the intended five-step live walkthrough near the top of the analysis panel.
- Claim Coach converts analysis into a student-owned reasoning checklist instead of a generated final paragraph.
- Evidence Packet exports the same reasoning scaffold with Judge Demo Path, Custom Lab Triage, Grounding Audit, AI Evaluation Harness, sources, safety coach, concept coach, pattern evidence, reliability coach, data, checks, next-trial plan, and blanks, not a completed report.
- Data Handling Ledger appears in the app and Evidence Packet so judges can inspect privacy and student-control claims during the demo or exported handoff.
- AIYES Rubric Fit appears in the app and Evidence Packet so judges can inspect the official UX/design fit during the live demo or exported handoff.
- Learning Impact Loop appears in the app and Evidence Packet so the user's practical benefit is measurable inside the workflow.
- Learning Exit Ticket appears in the app and Evidence Packet so judges can inspect student understanding prompts during the demo or exported handoff.
- Progress Portfolio appears near Saved Labs so judges can inspect score trend, subject breadth, and strongest saved run.
- Desktop and mobile E2E checks verify no horizontal overflow.

## Remaining Submission Work

- Submit the hosted live demo, slide deck, and video walkthrough on Devpost.
- Handle the live Devpost page's listed 2-5 member team requirement; the overview text also says participants may work individually, so verify the submission form behavior before final submit.
- Optionally configure a real OpenAI API key for one web-search-enriched demo.
- Present or export `docs/aiyes-slide-deck.html`.
- Paste `docs/devpost-submission-copy.md` into Devpost.
