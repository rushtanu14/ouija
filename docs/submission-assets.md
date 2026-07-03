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

Current walkthrough proof: `docs/assets/ouija-walkthrough.webm` is a 2:06.08 captioned recording from the refreshed app. It includes the problem, Judge Demo Path, AI pipeline, Model Strategy, AI Evaluation Harness, Data Handling Ledger, AIYES Rubric Fit, Learning Impact Loop, Learning Exit Ticket, Guided Lab Flow, Grounding Audit, expected-pattern graph overlay, Pattern Evidence Engine, Method Audit, Reliability Coach, Safety Coach, Concept Coach, spreadsheet data import, live graph/check recomputation, Next Trial Planner, Claim Coach, Evidence Packet, academic-integrity boundary, breadth across seven supported demos including Pendulum and Ohm's Law circuits, low-confidence boundary, Custom Lab Triage with Custom Investigation Planner, Saved Labs, Progress Portfolio, Evaluation Bench, Settings, Judge Brief, and hosted submission links. `ffprobe` confirmed 1440x900 video, 12,465,085 bytes, and SHA-256 `2b20a2ad8e0b5cfc3effe198bba8bc1cc27c0e5198a2b294eccc74042d642660`; frame extraction confirmed the Progress Portfolio panel and caption are visible; public Vercel checks confirmed hosted video HTTP 200 with `video/webm` and content length `12465085`, hosted slide deck HTTP 200 with `text/html` and content length `13258`, live `/api/health` returns `ok`, live `/api/evaluate` returns `100/100` and `8/8 passed`, and public browser smoke confirmed Progress Portfolio with `2 saved runs`, `2 subjects`, repeated learning evidence, and no horizontal overflow.

## Final Submission Order

1. Run `npm run capture:submission`.
2. Run `npm run record:walkthrough`.
3. Run `npm run sync:public-submission`.
4. Paste `docs/devpost-submission-copy.md` into Devpost.
5. Use the hosted live demo, slide deck, and video walkthrough links above.
