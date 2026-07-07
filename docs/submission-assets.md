# Submission Assets

## Required AIYES Materials

- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
- Live demo: https://ouija-olive.vercel.app
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
- `public/submission/slide-deck.html`
- `public/submission/assets/ouija-walkthrough.webm`
- `public/submission/assets/ouija-custom-triage.png`

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 2:12.76 captioned recording from the refreshed Concept Mastery Check build. It includes the problem, classification, Run Snapshot, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, breadth across eight supported demos including Pendulum, Ohm's Law circuits, and Plant Light, low-confidence paper towel absorbency boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, MCP Integration Coach, MCP Readiness Matrix, Composio Search source-audit route, Google Forms readiness route, Google Calendar next-trial reminder route, server MCP dry-run validation through `/api/mcp/export`, scoped session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Evaluation Bench with 9/9 live checks, Judge Brief, and hosted submission links. `ffprobe` confirmed 1440x900 video, 13,552,256 bytes, and SHA-256 `6e7df30919eefac1b530f19b400c96b8ab76b232461e169a29a340b880113698`. Local public package proof after sync is walkthrough size `13552256`; hosted checks should be refreshed after the next production deploy.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
