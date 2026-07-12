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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 2:27.76 captioned recording from the Student/Judge view and Student Pilot Study Kit build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Student Pilot Study Kit, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos including Pendulum, Ohm's Law circuits, and Plant Light, low-confidence paper towel absorbency boundary, Custom Lab Triage with Custom Investigation Planner, Pattern Archetype Coach with comparison experiment and bar-chart guidance, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, MCP Readiness Matrix, Composio Search source-audit route, Composio Scholar claim-check route, Composio Browser source-capture route, DeepWiki public-source proof route, server MCP dry-run validation through `/api/mcp/export`, scoped session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Deterministic Regression Suite with 9/9 internal behavior checks, Judge Brief, Submission Hub, Devpost pack, and hosted submission links. `ffprobe` confirmed 1440x900 video, 15,333,631 bytes, duration 147.76 seconds, and SHA-256 `f130cebc72c4ac784a7d78ad0b8082d4175892c173ab5e9edcb803c5d34640f3`. Local public package proof after sync is submission hub size `8800`, Devpost pack size `10655`, walkthrough size `15333631`, slide deck size `19486`, and custom-triage screenshot size `3550491`. Production deployment `dpl_AWkD725mAuHVfhFRzrb8jiLv5Hp2` is aliased to `https://ouija-olive.vercel.app`; hosted checks returned HTTP 200 for `/submission/` with `Regression suite` and no stale `live cases` wording, for the walkthrough with `content-type: video/webm` plus `content-length: 15333631`, for the slide deck with `content-length: 19435`, for `/api/evaluate` with 9/9 internal behavior checks plus pilot metrics in the evidence, for `/api/runtime-proof` with `fallback_ready`, eight templates, 9/9 regression coverage, and `server_dry_run`, and for `/api/mcp/status` with 11 connector routes after the DeepWiki route. Hosted browser smoke confirmed Submission Hub renders on desktop and mobile with no horizontal overflow and zero console errors; prior hosted browser smoke confirmed Student Pilot Study Kit renders on desktop and mobile, shows the "No names" consent boundary and "Time to first graph" metric, has no desktop/mobile horizontal overflow, and logs zero console errors.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Open the hosted Devpost pack and confirm the final team roster step.
5. Paste `docs/devpost-submission-copy.md` into Devpost.
6. Use the hosted submission hub, Devpost pack, live demo, slide deck, and video walkthrough links above.
