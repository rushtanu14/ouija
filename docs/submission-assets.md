# Submission Assets

## Required AIYES Materials

- Slide presentation: https://ouija-olive.vercel.app/submission/slide-deck.html
- Video walkthrough: https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm
- Live demo: https://ouija-olive.vercel.app
- Source code or deployment link: https://ouija-olive.vercel.app

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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 1:48.68 captioned recording from the refreshed app. It includes the problem, Judge Demo Path, AI pipeline, Model Strategy, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, Pre-Lab Design Coach, Learning Impact Loop, Learning Exit Ticket, Student Reflection Workspace, Guided Lab Flow, Grounding Audit, expected-pattern graph overlay, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, academic-integrity boundary, breadth across eight supported demos including Pendulum, Ohm's Law circuits, and Plant Light, low-confidence paper towel absorbency boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, MCP Integration Coach with Google Classroom pre-lab checkpoint preview, MCP Readiness Matrix, Google Forms readiness route, Evaluation Bench with 9/9 live checks, Settings, Judge Brief, and hosted submission links. The app now additionally includes a server-dry-run Composio bridge, Google Calendar next-trial reminder route, `/api/mcp/status`, and `/api/mcp/export`; refresh the walkthrough after the next production deploy if the video must show those new route buttons. `ffprobe` confirmed 1440x900 video, 11,151,846 bytes, and SHA-256 `c3f7e9c318f9aa160855931bcdfa814b1b0ab64894602583bb0b91f1b5c49738`. Local public package proof before this change was slide deck size `14430` and walkthrough size `11151846`; hosted checks should be refreshed after the next production deploy.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
