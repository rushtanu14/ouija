# Submission Assets

## Required AIYES Materials

- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
- Submission hub: https://ouija-olive.vercel.app/submission/
- Devpost pack: https://ouija-olive.vercel.app/submission/devpost-pack.html
- Live demo: https://ouija-olive.vercel.app
- Judge view: https://ouija-olive.vercel.app/?judge=1
- Source code: https://github.com/rushtanu14/ouija
- Source ZIP fallback: https://github.com/rushtanu14/ouija/archive/refs/heads/main.zip

## Screenshot Capture

Start the dev server:

```bash
npm run dev
```

Then capture submission images:

```bash
npm run capture:submission
```

Record a captioned walkthrough from the live deployment:

```bash
npm run record:walkthrough
```

Sync the deck, walkthrough, and screenshots into Vercel-hosted public submission paths:

```bash
npm run sync:public-submission
```

Generated files:

- `docs/assets/ouija-demo-desktop.png`
- `docs/assets/ouija-demo-mobile.png`
- `docs/assets/ouija-custom-triage.png`
- `docs/assets/ouija-warning-state.png`
- `docs/assets/ouija-walkthrough.webm`
- `public/submission/index.html`
- `public/submission/devpost-pack.html`
- `public/submission/slide-deck.html`
- `public/submission/assets/ouija-walkthrough.webm`
- `public/submission/assets/ouija-custom-triage.png`

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 3:58.00 captioned recording from the local Student/Judge view, Student Impact Brief, Pilot Evidence Quality Gate, Pilot Evidence Export, UX proof, Top Award Radar, AIYES Submission Gate, AIYES Team Readiness Worksheet, Official AIYES Rules Snapshot, AIYES Demo Rehearsal, and AIYES Judge Q&A Prep build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Student Impact Brief, Judge Demo Path, AIYES Team Readiness Worksheet, AIYES Demo Rehearsal, AIYES Judge Q&A Prep, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Student Pilot Study Kit with Pilot Protocol run script, thresholds, and stop rules, Pilot Evidence Quality Gate with 80/100 review status, Pilot Evidence Export with CSV-ready anonymous summary and quality checks, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, AI Architecture Map, UX and Accessibility Proof, Top Award Radar, AIYES Submission Gate with source ZIP fallback, Official AIYES Rules Snapshot, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos, low-confidence paper towel absorbency boundary, Custom Lab Triage, Pattern Archetype Coach, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, July 18 Composio Search rules receipt, classroom lab source receipt, DeepWiki indexing receipt, MCP Readiness Matrix, Composio Sessions Strategy, read-only source verification and Canvas assignment-context sessions before student export sessions, Composio Search source-audit route, Composio Scholar claim-check route, Semantic Scholar reference-check route, Composio Browser source-capture route, DeepWiki public-source proof route, Canvas assignment-context route, Google Slides deck-draft route, server MCP dry-run validation through `/api/mcp/export`, scoped Composio session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Deterministic Regression Suite with 9/9 internal behavior checks, Judge Brief, Submission Hub, Devpost pack, and hosted submission links.

`ffprobe` confirmed 1440x900 video, 24,123,761 bytes, duration 238.00 seconds, and SHA-256 `73653219da2e69d998cc337920af8a77b7d35d52ba2d525151d620479618dcb2`. Local public package proof after sync is submission hub size `9606`, Devpost pack size `14577`, walkthrough size `24123761`, slide deck size `23363`, desktop screenshot size `4141522`, mobile screenshot size `2629786`, custom-triage screenshot size `4012572`, and warning-state screenshot size `4208588`.

Production alias `https://ouija-olive.vercel.app` reflects the July 18 / Source Scout refresh, classroom lab source receipt, Pilot Protocol hardening, and Devpost ZIP fallback after `main` deployments pass. Hosted checks returned HTTP 200 for `/api/evaluate` with score `100` and `9/9`, `/api/mcp/status` with `server_dry_run`, `/api/runtime-proof` with `fallback_ready` and `9/9`, `/submission/` size `9606`, `/submission/devpost-pack.html` size `14577`, and `/submission/slide-deck.html` size `23363` with the July 18 rules snapshot, Source Scout classroom-lab receipt, Source Proof language, Pilot Protocol language, source ZIP fallback, DeepWiki indexing boundary, and current walkthrough hash. Hosted walkthrough HEAD returned `content-length: 24123761`, and the GitHub source ZIP fallback downloaded with HTTP `200` and `80420753` bytes. Hosted desktop/mobile browser smoke confirmed Reaction Rate Judge mode, Official AIYES Rules Snapshot, Source Scout classroom-lab receipt, no horizontal overflow, and zero console/page errors.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Open the hosted Devpost pack and confirm the final team roster step.
5. Paste `docs/devpost-submission-copy.md` into Devpost.
6. Use the hosted submission hub, Devpost pack, live demo, slide deck, and video walkthrough links above.
