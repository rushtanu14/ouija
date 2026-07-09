# Submission Assets

## Required AIYES Materials

- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
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
- `public/submission/slide-deck.html`
- `public/submission/assets/ouija-walkthrough.webm`
- `public/submission/assets/ouija-custom-triage.png`

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 4:40.16 captioned recording from the Student/Judge view and Composio Browser MCP build. It includes the problem, classification, default Student view, Student Focus, Judge view path, Run Snapshot, Judge Demo Path, AI Runtime Proof with `/api/runtime-proof`, Guided Lab Flow, Student Level Lens, Concept Mastery Check, Pre-Lab Design Coach, early expected-pattern graph and table placement, Learning Impact Loop, Learning Exit Ticket, Student Reflection Workspace, Grounding Audit, AI pipeline, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, Model Strategy, Technical Depth Proof, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, AIYES Values Fit, AIYES Development Journey, breadth across eight supported demos including Pendulum, Ohm's Law circuits, and Plant Light, low-confidence paper towel absorbency boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, Portfolio Story Builder, MCP Integration Coach, MCP Readiness Matrix, Composio Search source-audit route, Composio Scholar claim-check route, Composio Browser source-capture route, server MCP dry-run validation through `/api/mcp/export`, scoped session-ticket validation through `/api/mcp/session`, AIYES submission checklist, Evaluation Bench with 9/9 live checks, Judge Brief, and hosted submission links. `ffprobe` confirmed 1440x900 video, 26,688,733 bytes, duration 280.16 seconds, and SHA-256 `28b118f6f2c60e2ca80152a4dfc0c7bb6a68db204fd9dac6f2f283239239bc34`. Local public package proof after sync is walkthrough size `26688733` and slide deck size `18766`. Production deployment `dpl_B2nJ7CMszMUskwQHXzW4wigJU6P6` is aliased to `https://ouija-olive.vercel.app`; hosted checks returned HTTP 200 for the slide deck with `content-length: 18766`, for the walkthrough with `content-type: video/webm` plus `content-length: 26688733`, and for `/api/evaluate` with 100/100 and 9/9 live checks. Hosted browser smoke confirmed `https://ouija-olive.vercel.app` defaults to Student mode with Student Focus visible and judge proof hidden, `https://ouija-olive.vercel.app/?judge=1` opens Judge mode with the Composio Browser source-capture route visible, and desktop/mobile had no horizontal overflow.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
