# Ouija Context

## Glossary

### Ouija

The project name. The app should be called `Ouija` everywhere in UI, docs, code naming, and submission materials unless Rushil explicitly changes it.

### Student

The only primary user for the MVP. Ouija is built for students working through science labs, not for teachers, coaches, administrators, or parents.

### Lab Partner

The current product direction: a student-facing AI science lab assistant that helps students understand lab instructions, check data quality, graph results, catch reasoning/unit mistakes, and receive Socratic hints without writing the lab report for them.

### Experiment Interpreter

The broader product direction. Ouija should accept a student's experiment description, use AI to identify the experiment type and relevant scientific concepts, search the internet for grounded reference material, then show expected results and an explanation of how the experiment works.

### Middle/High School Science Experiments

The V1 coverage claim. Ouija should target middle-school and high-school science experiments, not college labs, professional research protocols, or unrestricted "all experiments" coverage.

### Balanced Science Set

The first supported experiment set. Ouija should prove breadth with one reliable school-lab demo from each core science area: projectile motion for physics, reaction rate versus temperature or concentration for chemistry, enzyme activity versus temperature or pH for biology, and water filtration/turbidity or soil erosion for earth science.

### Projectile Motion Lab

The first demo case, not the full product scope. Ouija can use projectile motion as a reliable proof case while still being designed for many kinds of student experiments.

### Table Input

The first MVP data input mode. Students should enter experiment data into an editable table before Ouija supports CSV upload, notebook photos, or OCR.

## Product Boundaries

- Ouija should not become a teacher grading dashboard.
- Ouija should not write complete lab reports for students.
- Ouija should focus on learning, data checking, graphing, safety awareness, and reasoning support.
- Ouija should support broad student science experiments, but V1 should still use a small set of reliable demo experiments instead of claiming perfect coverage.
- Ouija's V1 coverage should be middle/high school science experiments.
- Ouija's first supported set should balance physics, chemistry, biology, and earth science instead of overfitting to physics.
- Ouija should support table input first before adding CSV upload or photo/OCR input.
- Ouija's internet search should ground expected results and explanations in referenced content instead of inventing them from the model alone.

## Build Checkpoint - 2026-06-25

- Scaffolded Ouija as a React + Vite + TypeScript frontend with an Express API.
- App runs on `http://127.0.0.1:5188`; API runs on `http://127.0.0.1:8787`.
- Implemented deterministic fallback analysis for projectile motion, reaction rate vs temperature, enzyme activity vs temperature, and water filtration/turbidity.
- Implemented optional server-side OpenAI Responses API web-search enrichment when `OPENAI_API_KEY` is present.
- Visual direction follows the approved concept at `/Users/rushil/.codex/generated_images/019ef05b-cfd7-7630-8873-77bcc5bfc930/ig_09071c8be4eea0bd016a3dc0aacc048194b0603a5067ff96bd.png`.
- Verification passed: `npm run test`, `npm run build`, `npm run test:e2e`, and `npm audit --json`.
