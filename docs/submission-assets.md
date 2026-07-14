# Submission Assets

## Required AIYES Materials

- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
- Submission hub: https://ouija-olive.vercel.app/submission/
- Devpost pack: https://ouija-olive.vercel.app/submission/devpost-pack.html
- Live demo: https://ouija-olive.vercel.app
- Judge view: https://ouija-olive.vercel.app/?judge=1
- Source code: https://github.com/rushtanu14/ouija

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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 3:48.92 captioned recording from the Student/Judge view, Student Impact Brief, Pilot Evidence Quality Gate, Pilot Evidence Export, UX proof, Top Award Radar, and AIYES Submission Gate build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Student Impact Brief, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Student Pilot Study Kit, Pilot Evidence Quality Gate with 80/100 review status, Pilot Evidence Export with CSV-ready anonymous summary and quality checks, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, AI Architecture Map, UX and Accessibility Proof, Top Award Radar, AIYES Submission Gate, Official AIYES Rules Snapshot, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos, low-confidence paper towel absorbency boundary, Custom Lab Triage, Pattern Archetype Coach, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, MCP Readiness Matrix, Composio Sessions Strategy, read-only source verification and Canvas assignment-context sessions before student export sessions, Composio Search source-audit route, Composio Scholar claim-check route, Semantic Scholar reference-check route, Composio Browser source-capture route, DeepWiki public-source proof route, Canvas assignment-context route, Google Slides deck-draft route, server MCP dry-run validation through `/api/mcp/export`, scoped Composio session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Deterministic Regression Suite with 9/9 internal behavior checks, Judge Brief, Submission Hub, Devpost pack, and hosted submission links.

`ffprobe` confirmed 1440x900 video, 24,090,761 bytes, duration 228.92 seconds, and SHA-256 `1c3221d19508b61f7ddb86631a1d481549f2058188a349ba92b7c2828eb0e8f0`. Local public package proof after sync is submission hub size `9003`, Devpost pack size `12020`, walkthrough size `24090761`, slide deck size `21697`, desktop screenshot size `4141522`, mobile screenshot size `2629786`, custom-triage screenshot size `4012572`, and warning-state screenshot size `4208588`.

Production deployment `dpl_9DkhhjaGjQQPW4cjyWRSqp7ojyj7` is aliased to `https://ouija-olive.vercel.app`; hosted checks returned HTTP 200 for `/api/evaluate` with score `100`, `/api/mcp/status` with `server_dry_run`, 15 routes, Composio Search docs link, and Search tools `COMPOSIO_SEARCH_WEB`, `COMPOSIO_SEARCH_SCHOLAR`, `COMPOSIO_SEARCH_FETCH_URL_CONTENT`, `/api/runtime-proof` with `9/9`, `/submission/`, `/submission/devpost-pack.html`, and `/submission/slide-deck.html` with Source Scout, July 14 AIYES rules snapshot, participant snapshot, and current walkthrough proof labels. Hosted desktop/mobile browser smoke confirmed Composio Source Scout, Official AIYES Rules Snapshot, no horizontal overflow, and zero console errors.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Open the hosted Devpost pack and confirm the final team roster step.
5. Paste `docs/devpost-submission-copy.md` into Devpost.
6. Use the hosted submission hub, Devpost pack, live demo, slide deck, and video walkthrough links above.
