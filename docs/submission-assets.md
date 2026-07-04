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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 2:15.76 captioned recording from the refreshed app. It includes the problem, Judge Demo Path, AI pipeline, Model Strategy, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, Learning Impact Loop, Learning Exit Ticket, Student Reflection Workspace, Guided Lab Flow, Grounding Audit, expected-pattern graph overlay, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, academic-integrity boundary, breadth across seven supported demos including Pendulum and Ohm's Law circuits, low-confidence boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, MCP Integration Coach, Evaluation Bench, Settings, Judge Brief, and hosted submission links. `ffprobe` confirmed 1440x900 video, 13,027,396 bytes, and SHA-256 `6565e5213c2e47bdb0ea62f0c3f3a7a3431db4be720703750ecf86decb04ecbd`; frame extraction confirmed the Student Reflection Workspace integrity boundary, the MCP Integration Coach panel, payload preview, and the judge/evaluation proof sequence are visible. Public Vercel checks should be refreshed after the next production deploy.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
