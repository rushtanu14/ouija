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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 3:17.36 captioned recording from the Student/Judge view and Student Impact Brief build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Student Impact Brief, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Student Pilot Study Kit, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos, low-confidence paper towel absorbency boundary, Custom Lab Triage, Pattern Archetype Coach, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, MCP Readiness Matrix, Composio Sessions Strategy, read-only source verification before student export sessions, Composio Search source-audit route, Composio Scholar claim-check route, Composio Browser source-capture route, DeepWiki public-source proof route, server MCP dry-run validation through `/api/mcp/export`, scoped Composio session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Deterministic Regression Suite with 9/9 internal behavior checks, Judge Brief, Submission Hub, Devpost pack, and hosted submission links. `ffprobe` confirmed 1440x900 video, 19,577,913 bytes, duration 197.36 seconds, and SHA-256 `6854fb3510c61fe036cd7d4668943108b844352439b6a6c7a652493377683ee0`. Local public package proof after sync is submission hub size `8817`, Devpost pack size `10760`, walkthrough size `19577913`, slide deck size `19774`, desktop screenshot size `4080529`, mobile screenshot size `2590022`, custom-triage screenshot size `4371388`, and warning-state screenshot size `4124914`. Production deployment `dpl_HSt5n21ZmTifC1mcQSp7xiKQAPpW` is aliased to `https://ouija-olive.vercel.app`; hosted checks returned HTTP 200 for `/api/evaluate` with score `100`, `/api/mcp/status` with `server_dry_run`, 11 toolkits, and Composio Sessions docs links, `/submission/`, `/submission/slide-deck.html`, and `/submission/assets/ouija-walkthrough.webm` with `content-type: video/webm` plus `content-length: 19577913`. Hosted desktop/mobile browser smoke confirmed Student Impact Brief, Remaining proof gap, Judge Brief proof copy, no horizontal overflow, and zero console errors.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Open the hosted Devpost pack and confirm the final team roster step.
5. Paste `docs/devpost-submission-copy.md` into Devpost.
6. Use the hosted submission hub, Devpost pack, live demo, slide deck, and video walkthrough links above.
