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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 1:49.20 captioned recording from the refreshed app. It includes the problem, Judge Demo Path, AI pipeline, Model Strategy, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, Pre-Lab Design Coach, Learning Impact Loop, Learning Exit Ticket, Student Reflection Workspace, Guided Lab Flow, Grounding Audit, expected-pattern graph overlay, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, academic-integrity boundary, breadth across seven supported demos including Pendulum and Ohm's Law circuits, low-confidence boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, MCP Integration Coach with Google Classroom pre-lab checkpoint preview, Evaluation Bench, Settings, Judge Brief, and hosted submission links. `ffprobe` confirmed 1440x900 video, 11,534,079 bytes, and SHA-256 `89872a3b127efb7a20f93637664736eaf5d2da5f0a1dbb13bc34a9684e180ab0`. Public Vercel checks confirmed the hosted slide deck at content length `14303` and the hosted walkthrough at content length `11534079`.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
