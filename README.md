# Ouija

Ouija is a student-facing AI experiment interpreter for middle and high school science labs. A student describes an experiment, Ouija identifies the likely lab type, grounds expected results in trusted references, lets the student enter table data, and compares the data against the expected pattern without writing the lab report.

## V1 Scope

- Physics: projectile motion.
- Chemistry: reaction rate vs temperature.
- Biology: enzyme activity vs temperature.
- Earth science: water filtration and turbidity.
- Input mode: editable table data.
- Academic integrity: hints, checks, and explanations only.

## Run

```bash
npm install
npm run dev
```

The app runs at `http://127.0.0.1:5188` and the API runs at `http://127.0.0.1:8787`.

## Verification

```bash
npm run test
npm run build
npm run test:e2e
npm audit --json
```

## AI Grounding

Ouija works without credentials through deterministic built-in experiment templates and trusted citations. When `OPENAI_API_KEY` is present in the environment, the server attempts OpenAI Responses API web-search enrichment and falls back safely if enrichment is unavailable.
