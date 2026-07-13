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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 3:12.88 captioned recording from the Student/Judge view and Composio Sessions Strategy build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Student Pilot Study Kit, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos, low-confidence paper towel absorbency boundary, Custom Lab Triage, Pattern Archetype Coach, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, MCP Readiness Matrix, Composio Sessions Strategy, read-only source verification before student export sessions, Composio Search source-audit route, Composio Scholar claim-check route, Composio Browser source-capture route, DeepWiki public-source proof route, server MCP dry-run validation through `/api/mcp/export`, scoped Composio session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Deterministic Regression Suite with 9/9 internal behavior checks, Judge Brief, Submission Hub, Devpost pack, and hosted submission links. `ffprobe` confirmed 1440x900 video, 17,890,513 bytes, duration 192.88 seconds, and SHA-256 `eee033b89da1862c87bd02ad37039476de7c9ab40dc6be1227f69ec417d77552`. Local public package proof after sync is submission hub size `8817`, Devpost pack size `10760`, walkthrough size `17890513`, slide deck size `19557`, desktop screenshot size `3811194`, mobile screenshot size `2571791`, custom-triage screenshot size `3731328`, and warning-state screenshot size `3481593`. Production deployment `dpl_3Ce63H5z2bSUwxmFVENQXXBN2LL9` is aliased to `https://ouija-olive.vercel.app`; hosted checks returned HTTP 200 for `/api/evaluate` with score `100`, `/api/mcp/status` with `server_dry_run` and Composio Sessions docs links, `/submission/` with `Regression suite` and read-only source verification copy, `/submission/devpost-pack.html` and `/submission/slide-deck.html` with `Composio Sessions`, and `/submission/assets/ouija-walkthrough.webm` with `content-type: video/webm` plus `content-length: 17890513`. Hosted desktop/mobile browser smoke confirmed MCP Integration Coach, Composio Session Strategy, read-only source verification, student export session, no horizontal overflow, and zero console errors.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Open the hosted Devpost pack and confirm the final team roster step.
5. Paste `docs/devpost-submission-copy.md` into Devpost.
6. Use the hosted submission hub, Devpost pack, live demo, slide deck, and video walkthrough links above.
