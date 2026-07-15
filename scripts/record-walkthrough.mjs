import { chromium } from "@playwright/test";
import { mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(repoRoot, "docs", "assets");
const baseUrl = process.env.OUIJA_URL ?? "https://ouija-olive.vercel.app";
const recordingDir = mkdtempSync(join(tmpdir(), "ouija-walkthrough-"));
const outputPath = resolve(assetDir, "ouija-walkthrough.webm");
const captionDurationMs = Number(process.env.OUIJA_CAPTION_MS ?? 4000);
let captionIndex = 0;
const captionTotal = 55;

mkdirSync(assetDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: {
    dir: recordingDir,
    size: { width: 1440, height: 900 }
  }
});
const page = await context.newPage();
page.setDefaultTimeout(10000);

await page.goto(withJudgeMode(baseUrl), { waitUntil: "networkidle" });
await installCaptionOverlay(page);

await caption(
  page,
  "Problem",
  "Students need help connecting experiment setup, table data, sources, and their own conclusion without turning the lab into a chatbot-written report."
);

await page.getByRole("button", { name: "Reaction Rate" }).click();
await page.getByRole("heading", { name: "Reaction Rate vs Temperature" }).waitFor();
await caption(page, "Input and classification", "A normal student description becomes a classified science experiment with concepts, variables, and confidence.");

await page.getByLabel("View mode").getByRole("button", { name: "Judge" }).waitFor();
await caption(
  page,
  "Student and Judge views",
  "The default app stays focused for students; the judge link opens the full proof stack for rubric, runtime, MCP, and submission evidence."
);

await page.getByRole("heading", { name: "Run Snapshot" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Run Snapshot",
  "Ouija now starts each run with rubric fit, evaluation status, learning impact, data flags, expected pattern, and the student's current action."
);

await page.getByRole("heading", { name: "Student Impact Brief" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Student Impact Brief",
  "Judges see the target student, lab-reasoning pain point, before-and-after benefit, why AI helps, and the remaining anonymous-pilot proof gap before the deeper panels."
);

await page.getByRole("heading", { name: "Judge Demo Path" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Judge Demo Path",
  "Ouija gives judges a five-step route through problem fit, AI design, student workflow, evidence handoff, and submission proof."
);

await page.getByRole("heading", { name: "AI Runtime Proof" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "AI Runtime Proof",
  "Judges can verify the active AI path, fallback or web-search readiness, live evaluation coverage, server-only key boundary, and MCP bridge mode through the app and /api/runtime-proof."
);

await page.getByRole("heading", { name: "Guided Lab Flow" }).scrollIntoViewIfNeeded();
await caption(page, "Guided Lab Flow", "Ouija gives the student one current next action across identify, prepare safely, understand, check data, plan, and claim stages.");

await page.getByLabel("Learning level").getByRole("button", { name: "High" }).click();
await page.getByRole("heading", { name: "Student Level Lens" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Student Level Lens",
  "The same lab switches from middle-school pattern reading to high-school quantitative evidence, controls, repeats, and uncertainty."
);

await page.getByRole("heading", { name: "Concept Mastery Check" }).scrollIntoViewIfNeeded();
await page
  .getByLabel("Concept Mastery Check")
  .locator(".mastery-question")
  .filter({ hasText: "Variable check" })
  .getByRole("button", { name: "Temperature (C)" })
  .click();
await page
  .getByLabel("Concept Mastery Check")
  .locator(".mastery-question")
  .filter({ hasText: "Pattern check" })
  .getByRole("button")
  .first()
  .click();
await page
  .getByLabel("Concept Mastery Check")
  .locator(".mastery-question")
  .filter({ hasText: "Integrity check" })
  .getByRole("button", { name: /final claim/i })
  .click();
await page.getByLabel("Concept Mastery Check").getByText("3/3 passed").waitFor();
await caption(
  page,
  "Concept Mastery Check",
  "Ouija makes learning measurable: students answer variable, pattern, and integrity checks before evidence export."
);

await page.getByRole("heading", { name: "Pre-Lab Design Coach" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Pre-Lab Design Coach",
  "Before data collection, Ouija plans variables, controls, repeats, table columns, source checks, and a safety gate without writing the student's hypothesis."
);

await page.locator(".graph-card").scrollIntoViewIfNeeded();
await caption(
  page,
  "Student graph first",
  "The practical workflow reaches the expected-pattern graph and editable table before the deeper judge evidence panels."
);

await page.getByRole("heading", { name: "Learning Impact Loop" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Learning Impact Loop",
  "Ouija measures whether the student is ready to reason, should review flags, or needs to fix the run before writing."
);

await page.getByRole("heading", { name: "Student Pilot Study Kit" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Student Pilot Study Kit",
  "Ouija gives a consent-safe 10-minute pilot protocol with anonymous tasks, metrics, observer notes, and evidence to collect before claiming student impact."
);

await page.getByLabel("Time to graph Observation 1").fill("90");
await page.getByLabel("Confidence before Observation 1").selectOption("2");
await page.getByLabel("Confidence after Observation 1").selectOption("4");
await page.getByLabel("Issue spotted Observation 1").selectOption("yes");
await page.getByLabel("Exit ticket Observation 1").selectOption("ready");
await page.getByLabel("Pilot note Observation 1").fill("Student found the graph warning before writing.");
await page.getByLabel("Pilot evidence quality gate").scrollIntoViewIfNeeded();
await caption(
  page,
  "Pilot Evidence Quality Gate",
  "Ouija scores pilot evidence quality before claims: observations, timing, paired confidence, issue and reflection signals, and privacy scan status."
);
await page.getByRole("textbox", { name: "Pilot evidence CSV export" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Pilot Evidence Export",
  "Real pilot observations can become a CSV-ready anonymous summary with quality checks for Devpost, Sheets, Forms, or Notion without claiming fake testing."
);

await page.getByRole("heading", { name: "Learning Exit Ticket" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Learning Exit Ticket",
  "Ouija turns AI feedback into student reflection prompts for variables, graph pattern, and next step, so judges can see learning rather than a generated answer."
);

await page.getByRole("heading", { name: "Student Reflection Workspace" }).scrollIntoViewIfNeeded();
await page
  .getByLabel("Reflection answer Variable check")
  .fill("The independent variable was water temperature and the dependent variable was reaction rate.");
await page
  .getByLabel("Reflection answer Pattern check")
  .fill("The graph shows rate increased as water temperature increased, matching the expected pattern.");
await page
  .getByLabel("Reflection answer Next-step check")
  .fill("I would repeat the hottest trial while keeping water volume and tablet size the same.");
await page.getByLabel("Student Reflection Workspace").getByText("3/3 ready").waitFor();
await caption(
  page,
  "Student Reflection Workspace",
  "Students type their own exit-ticket drafts; Ouija marks readiness and exports only student-authored answers."
);

await page.getByRole("heading", { name: "Grounding Audit" }).scrollIntoViewIfNeeded();
await caption(page, "Grounding Audit", "Ouija scores citation visibility and source agreement, then gives the student a source task before using the expected pattern.");

await caption(
  page,
  "How it is built",
  "Ouija is a full-stack React, TypeScript, and Express app with deterministic science templates, server-side OpenAI web-search enrichment when available, and safe fallback behavior."
);

await page.getByRole("heading", { name: "Reasoning trail" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "AI pipeline",
  "Reasoning Trail shows classification, model strategy, AI evaluation, judge demo guidance, variable mapping, pre-lab setup, source grounding audit, expected overlay, guided workflow, concept scaffolding, safety boundaries, table audit, pattern evidence, repeat reliability, next-trial planning, and claim coaching."
);

await page.getByRole("heading", { name: "Pattern Evidence Engine" }).scrollIntoViewIfNeeded();
await caption(page, "Expected overlay and pattern evidence", "Ouija overlays expected graph values, then scores whether the whole graph supports the expected trend, peak, or ratio before the student writes a claim.");

await page.getByRole("heading", { name: "Method Audit" }).scrollIntoViewIfNeeded();
await caption(page, "Method Audit", "Ouija checks controls, assumptions, reproducibility, confounds, and interpretation limits.");

await page.locator(".reliability-coach").scrollIntoViewIfNeeded();
await caption(page, "Reliability Coach", "Ouija checks repeated-trial counts, averages, and spread so students know which condition to retest before trusting the graph.");

await page.getByRole("heading", { name: "Safety Coach" }).scrollIntoViewIfNeeded();
await caption(page, "Safety Coach", "Ouija names PPE, material limits, cleanup, stop conditions, and adult-review boundaries for school labs.");

await page.getByRole("heading", { name: "Concept Coach" }).scrollIntoViewIfNeeded();
await caption(page, "Concept Coach", "Ouija turns the result into vocabulary, explanation steps, source tasks, and misconception checks for students.");

await page
  .getByLabel("Paste data table")
  .fill("Temperature (C)\tReaction time (s)\tRate (1/s)\n10\t50\t0.04\n40\t80\t0.01");
await page.getByRole("button", { name: "Import rows" }).click();
await page.getByText("Imported 2 rows using headers.").waitFor();
await page.getByLabel("Comparison insights").getByText("Rate trend does not match the expected temperature pattern", { exact: true }).waitFor();
await caption(
  page,
  "Spreadsheet data handling",
  "A pasted table becomes graph data with an expected overlay, then warnings update in Guided Lab Flow, Comparison Insights, Pattern Evidence, Method Audit, Reliability Coach, Safety Coach, Concept Mastery Check, Student Pilot Study Kit, Learning Exit Ticket, Student Reflection Workspace, Next Trial Planner, Claim Coach, and Reasoning Trail."
);

await page.getByRole("heading", { name: "Next Trial Planner" }).scrollIntoViewIfNeeded();
await caption(page, "Next Trial Planner", "Ouija suggests whether to extend the pattern or repeat a flagged measurement before the student writes a claim.");

await page.getByRole("heading", { name: "Claim Coach" }).scrollIntoViewIfNeeded();
await caption(page, "Academic integrity", "Claim Coach leaves blanks and asks the next evidence question instead of writing the lab conclusion.");

await page.getByRole("heading", { name: "Evidence Packet" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "Evidence Packet",
  "The output is a source-backed reasoning handoff with concept mastery prompts, student reflection drafts, blanks, and questions, not a completed lab report."
);

await page.getByRole("heading", { name: "Model Strategy" }).scrollIntoViewIfNeeded();
await caption(page, "Model Strategy", "Ouija exposes candidate ranking, matched signals, fallback behavior, validation layers, pattern evidence, repeat reliability, safety layer, and risk controls.");

await page.getByRole("heading", { name: "Technical Depth Proof" }).scrollIntoViewIfNeeded();
await caption(page, "Technical Depth Proof", "Judges see beyond-simple-API evidence: decision trace, evaluation harness, grounding quality, expected-pattern engine, privacy, and integrity signals.");

await page.getByRole("heading", { name: "AI Evaluation Harness" }).scrollIntoViewIfNeeded();
await caption(page, "AI Evaluation Harness", "Ouija scores classifier confidence, coverage, source grounding, pattern validation, row validators, safety, and fallback boundaries in the live run.");

await page.getByRole("heading", { name: "Data Handling Ledger" }).scrollIntoViewIfNeeded();
await caption(page, "Data Handling Ledger", "Ouija makes privacy, retention, browser-local saved labs, student controls, and the server-only API-key boundary visible for judges.");

await page.getByRole("heading", { name: "AIYES Rubric Fit" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "AIYES Rubric Fit",
  "Ouija maps the same run to the official criteria: problem relevance, AI technical design and model strategy, and user experience."
);

await page.getByRole("heading", { name: "AIYES Values Fit" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "AIYES Values Fit",
  "Ouija also maps the run to AIYES values: democracy, diversity, connectivity, innovation, and ethical inclusion."
);

await page.getByRole("heading", { name: "AIYES Development Journey" }).scrollIntoViewIfNeeded();
await caption(
  page,
  "AIYES Development Journey",
  "The required Track 1 story is visible too: problem, data, model strategy, testing, UX, ethics, impact, constraints, and submission proof."
);

await page.locator("#ux-proof").scrollIntoViewIfNeeded();
await page.getByLabel("UX and Accessibility Proof").getByText("User Experience and Design").waitFor();
await caption(
  page,
  "UX and Accessibility Proof",
  "Ouija maps the official UX criterion to student-first flow, judge navigation, responsive layout, labeled controls, clickable citations, and integrity prompts."
);

await page.locator("#top-award").scrollIntoViewIfNeeded();
await page.getByLabel("Top Award Radar").getByText("Submittable and competitive").waitFor();
await caption(
  page,
  "Top Award Radar",
  "The app answers the hard council question honestly: submittable and competitive, but not a first-place guarantee because judging and final Devpost steps are external."
);

await page.locator("#submission-gate").scrollIntoViewIfNeeded();
await page.getByLabel("AIYES Submission Gate").getByText("Submittability audit").waitFor();
await caption(
  page,
  "AIYES Submission Gate",
  "The required Devpost items are now visible as pass, review, or external: app, deck, video, source, impact, AI design, UX, and the external roster/final-submit step."
);

await page.locator("#aiyes-rules").scrollIntoViewIfNeeded();
await page.getByLabel("Official AIYES Rules Snapshot").getByText("76 participants visible").waitFor();
await caption(
  page,
  "Official AIYES Rules Snapshot",
  "The live judge path shows the July 15 Devpost snapshot: student eligibility, deadline, Track 1 artifacts, judging criteria, award bands, 76 participants, source link, and roster caveat."
);

await page.locator("#demo-rehearsal").scrollIntoViewIfNeeded();
await page.getByLabel("AIYES Demo Rehearsal").getByText("4:45", { exact: true }).waitFor();
await caption(
  page,
  "AIYES Demo Rehearsal",
  "The required video and live demo are rehearsed as a 4:45 proof path through problem relevance, AI design, live workflow, evaluation, integrity, and submission proof."
);

await page.locator("#judge-qa").scrollIntoViewIfNeeded();
await page.getByLabel("AIYES Judge Q&A Prep").getByText("Answer with proof, not promises").waitFor();
await caption(
  page,
  "AIYES Judge Q&A Prep",
  "Likely judge questions now point to proof surfaces for problem relevance, AI depth, academic integrity, UX, evidence limits, and external claims."
);

for (const sample of ["Projectile Motion", "Pendulum", "Ohm's Law", "Reaction Rate", "Enzyme Activity", "Plant Light", "Density Layers", "Water Filtration"]) {
  await page.getByRole("button", { name: sample }).click();
  await page.waitForTimeout(650);
}
await caption(page, "Breadth", "The same workflow covers projectile motion, pendulums, circuits, reaction rates, enzymes, plant light, density layers, and water filtration.");

await page.getByLabel("Describe your experiment").fill("We compared paper towel brands by measuring how much water each towel absorbed.");
await page.getByRole("button", { name: "Analyze" }).click();
await page.locator(".classification").getByText("Closest supported match", { exact: true }).waitFor();
await caption(page, "Honest coverage boundary", "Unsupported labs are marked as low confidence instead of being passed off as solved.");
await page.getByRole("heading", { name: "Custom Lab Triage" }).scrollIntoViewIfNeeded();
await page.getByLabel("Pattern Archetype Coach").getByText("Comparison experiment", { exact: true }).waitFor();
await page.getByLabel("Pattern Archetype Coach").scrollIntoViewIfNeeded();
await caption(
  page,
  "Custom Lab Triage",
  "Ouija still helps off-template labs with variable planning, repeat guidance, starter rows, and a Pattern Archetype Coach for comparison, bar-chart axes, source questions, and teacher confirmation."
);
await page.getByRole("button", { name: "Save current lab" }).click();

await page.getByRole("button", { name: "Water Filtration" }).click();
await page.getByRole("heading", { name: "Water Filtration and Turbidity" }).waitFor();
await page.getByRole("button", { name: "Save current lab" }).click();
await page.locator("#saved").scrollIntoViewIfNeeded();
await page.locator("#saved").getByText("Water Filtration and Turbidity", { exact: true }).waitFor();
await caption(page, "Saved lab snapshot", "A student can save checked runs locally and return to the evidence trail later.");
await page.locator("#progress").scrollIntoViewIfNeeded();
await caption(page, "Progress Portfolio", "Saved runs become progress evidence: run count, score trend, subject breadth, strongest run, and the next portfolio action.");
await page.getByLabel("Portfolio Story Builder").getByText("Story ready").waitFor();
await caption(
  page,
  "Portfolio Story Builder",
  "Ouija turns saved runs into prompts and blanks for a student-written progress story, not a generated essay."
);
await page.locator("#mcp-export").scrollIntoViewIfNeeded();
await page.getByLabel("Composio Session Strategy").getByText("Read-only source verification session").waitFor();
await caption(
  page,
  "MCP Integration Coach",
  "Ouija validates Composio Search source-audit, Scholar claim-check, Browser source-capture, and DeepWiki source-proof routes, then shows a Composio Sessions strategy: read-only verification first, export sessions only after consent."
);
await page.locator(".mcp-action-card").filter({ hasText: "Run Scholar claim check" }).getByRole("button", { name: "Validate route" }).click();
await page.getByLabel("MCP export dry-run result").getByText("Dry-run passed", { exact: true }).waitFor();
await page.getByLabel("MCP export dry-run result").scrollIntoViewIfNeeded();
await caption(
  page,
  "Scholar MCP dry-run",
  "The public app calls /api/mcp/export, validates the Scholar claim-check route, consent, payload, integrity blanks, and credential boundaries, then stops before any external source search or Composio write."
);
await page.getByLabel("MCP session ticket result").getByText("Session dry-run", { exact: true }).waitFor();
await page.getByLabel("MCP session ticket result").scrollIntoViewIfNeeded();
await caption(
  page,
  "Scoped Composio session ticket",
  "Ouija also prepares the /api/mcp/session scope: selected toolkit, allowed tools, session user env, and raw MCP URL withholding stay visible before any live connector runs."
);

await page.locator("#evaluation").scrollIntoViewIfNeeded();
await page.getByLabel("Deterministic Regression Suite").getByText("9/9").waitFor();
await caption(page, "Deterministic Regression Suite", "The live app runs nine checks: eight supported labs plus custom triage for the unsupported-lab boundary.");

await page.locator("#judge").scrollIntoViewIfNeeded();
await page.getByLabel("Judge Brief").getByText("AIYES Track 1").waitFor();
await caption(
  page,
  "Judge Brief",
  "The live app includes Track 1 fit, judge demo path, hosted source, deck, and video links, the AIYES submission checklist, official rubric fit, learning impact, student pilot protocol, concept mastery proof, progress portfolio, evaluation, and integrity constraints."
);

await page.getByRole("heading", { name: "Reasoning trail" }).scrollIntoViewIfNeeded();
await caption(page, "Submission point", "For AIYES Track 1, the live app demonstrates practical AI, official rubric fit, measured learning impact, UX, testing, constraints, and real-world student value.");

const video = page.video();
await page.close();
await context.close();

if (!video) {
  await browser.close();
  throw new Error("Playwright did not create a walkthrough video.");
}

await video.saveAs(outputPath);
await browser.close();

console.log(`Walkthrough video saved to ${outputPath}`);

async function installCaptionOverlay(targetPage) {
  await targetPage.addStyleTag({
    content: `
      #ouija-demo-caption {
        position: fixed;
        left: 24px;
        bottom: 24px;
        z-index: 10000;
        width: min(560px, calc(100vw - 48px));
        border: 1px solid rgba(20, 32, 51, 0.16);
        border-radius: 8px;
        padding: 16px 18px;
        color: #142033;
        background: rgba(255, 255, 255, 0.94);
        box-shadow: 0 18px 48px rgba(22, 34, 51, 0.18);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      #ouija-demo-caption strong {
        display: block;
        margin-bottom: 6px;
        color: #2368ff;
        font-size: 13px;
        font-weight: 850;
        text-transform: uppercase;
        letter-spacing: 0;
      }

      #ouija-demo-caption span {
        display: block;
        font-size: 18px;
        line-height: 1.35;
        font-weight: 720;
      }

      #ouija-demo-caption small {
        display: block;
        margin-bottom: 8px;
        color: #607087;
        font-size: 12px;
        font-weight: 820;
        letter-spacing: 0;
        text-transform: uppercase;
      }
    `
  });
  await targetPage.evaluate(() => {
    const caption = document.createElement("div");
    caption.id = "ouija-demo-caption";
    caption.setAttribute("aria-hidden", "true");
    caption.innerHTML = "<small>AIYES demo</small><strong>Ouija walkthrough</strong><span>Starting demo...</span>";
    document.body.appendChild(caption);
  });
}

async function caption(targetPage, title, body) {
  captionIndex += 1;
  await targetPage.evaluate(
    ({ title, body, captionIndex, captionTotal }) => {
      const caption = document.getElementById("ouija-demo-caption");
      if (!caption) return;
      caption.innerHTML = `<small>AIYES demo ${captionIndex}/${captionTotal}</small><strong>${escapeHtml(title)}</strong><span>${escapeHtml(body)}</span>`;

      function escapeHtml(value) {
        return value.replace(/[&<>"']/g, (character) => {
          const map = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          };
          return map[character];
        });
      }
    },
    { title, body, captionIndex, captionTotal }
  );
  await targetPage.waitForTimeout(captionDurationMs);
}

function withJudgeMode(url) {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("judge", "1");
    return parsed.toString();
  } catch {
    return url.includes("?") ? `${url}&judge=1` : `${url}?judge=1`;
  }
}
