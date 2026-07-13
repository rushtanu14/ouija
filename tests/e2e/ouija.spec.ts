import { expect, test } from "@playwright/test";

test("student can analyze a sample experiment, edit table data, and see citations", async ({ page }) => {
  test.setTimeout(45_000);
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/?judge=1");

  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
  await expect(page.getByLabel("View mode").getByRole("button", { name: "Judge" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Run Snapshot" })).toBeVisible();
  await expect(page.getByLabel("Run Snapshot").getByText("Rubric fit", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Snapshot").getByText("Regression", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Snapshot").getByText("Expected pattern", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Run Snapshot").getByText("Current action", { exact: true })).toBeVisible();
  await expect(page.locator(".run-snapshot-header > span").getByText("Competitive", { exact: true })).toBeVisible();
  const coreWorkflowBeforeJudgeMeta = await page.locator(".analysis-panel").evaluate((panel) => {
    const children = Array.from(panel.children);
    const indexOf = (className: string) => children.findIndex((child) => child.classList.contains(className));

    return (
      indexOf("graph-card") > -1 &&
      indexOf("data-card") > -1 &&
      indexOf("model-strategy") > -1 &&
      indexOf("graph-card") < indexOf("model-strategy") &&
      indexOf("data-card") < indexOf("model-strategy")
    );
  });
  expect(coreWorkflowBeforeJudgeMeta).toBe(true);
  await expect(page.getByLabel("Sources and explanation").getByRole("link", { name: /Factors that affect reaction rates/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Grounding Audit" })).toBeVisible();
  await expect(page.getByLabel("Grounding Audit").getByText("Source trust")).toBeVisible();
  await expect(page.getByLabel("Grounding Audit").getByText("Student source task")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Guided Lab Flow" })).toBeVisible();
  await expect(page.getByLabel("Guided Lab Flow").getByText("Get the teacher safety check before starting or extending the lab.")).toBeVisible();
  await expect(page.getByLabel("Learning level").getByRole("button", { name: "Middle" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Student Level Lens" })).toBeVisible();
  await expect(page.getByLabel("Student Level Lens").getByText("Middle school lens")).toBeVisible();
  await expect(page.getByLabel("Student Level Lens").getByText(/goes up, goes down, peaks, or stays about the same/i)).toBeVisible();
  await page.getByLabel("Learning level").getByRole("button", { name: "High" }).click();
  await expect(page.getByLabel("Learning level").getByRole("button", { name: "High" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByLabel("Student Level Lens").getByText("High school lens")).toBeVisible();
  await expect(page.getByLabel("Student Level Lens").getByText(/with uncertainty from/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Concept Mastery Check" })).toBeVisible();
  await expect(page.getByLabel("Concept Mastery Check").getByText("0/3 passed")).toBeVisible();
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
  await expect(page.getByLabel("Concept Mastery Check").getByText("3/3 passed")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Model Strategy" })).toBeVisible();
  await expect(page.getByLabel("Model Strategy").getByText("Selected Reaction Rate vs Temperature")).toBeVisible();
  await expect(page.getByLabel("Model Strategy").getByText("Top candidates")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Technical Depth Proof" })).toBeVisible();
  await expect(page.getByLabel("Technical Depth Proof").getByText("Beyond simple API use")).toBeVisible();
  await expect(page.getByLabel("Technical Depth Proof").getByText("Decision trace")).toBeVisible();
  await expect(page.getByLabel("Technical Depth Proof").getByText("9-case regression suite")).toBeVisible();
  await expect(page.getByLabel("Technical Depth Proof").getByText("Fallback mode is still AI strategy proof")).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Evaluation Harness" })).toBeVisible();
  await expect(page.getByLabel("AI Evaluation Harness").getByText("Model evidence")).toBeVisible();
  await expect(page.getByLabel("AI Evaluation Harness").getByText("Coverage benchmark")).toBeVisible();
  await expect(page.getByLabel("AI Evaluation Harness").getByText("Judge signal")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Data Handling Ledger" })).toBeVisible();
  await expect(page.getByLabel("Data Handling Ledger").getByText("Student data", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Data Handling Ledger").getByText("Browser-local saved labs", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Data Handling Ledger").getByText("API key stays server-side")).toBeVisible();
  await expect(page.getByLabel("Data Handling Ledger").getByText("Student control")).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIYES Rubric Fit" })).toBeVisible();
  await expect(page.getByLabel("AIYES Rubric Fit").getByText("Problem Definition and Real-World Relevance")).toBeVisible();
  await expect(page.getByLabel("AIYES Rubric Fit").getByText("AI Technical Design and Model Strategy")).toBeVisible();
  await expect(page.getByLabel("AIYES Rubric Fit").getByText("User Experience and Design")).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIYES Values Fit" })).toBeVisible();
  await expect(page.getByLabel("AIYES Values Fit").getByText("Democracy", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Values Fit").getByText("Diversity", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Values Fit").getByText("Connectivity", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Values Fit").getByText("Innovation", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Values Fit").getByText("Ethics and inclusion", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIYES Development Journey" })).toBeVisible();
  await expect(page.getByLabel("AIYES Development Journey").getByText("Problem identification", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Development Journey").getByText("Testing and evaluation", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Development Journey").getByText("Constraints and submission", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning Impact Loop" })).toBeVisible();
  await expect(page.getByLabel("Learning Impact Loop").getByText("Student outcome")).toBeVisible();
  await expect(page.getByLabel("Learning Impact Loop").getByText("Data quality")).toBeVisible();
  await expect(page.getByLabel("Learning Impact Loop").getByText("Pattern evidence", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Learning Impact Loop").getByText("Repeat reliability")).toBeVisible();
  await expect(page.locator(".impact-metric").filter({ hasText: "Student outcome" }).getByText("Ready to reason", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Student Pilot Study Kit" })).toBeVisible();
  await expect(page.getByLabel("Student Pilot Study Kit").getByText("10-minute pilot")).toBeVisible();
  await expect(page.getByLabel("Student Pilot Study Kit").getByText("Ready to pilot")).toBeVisible();
  await expect(page.getByLabel("Student Pilot Study Kit").getByText("No names")).toBeVisible();
  await expect(page.getByLabel("Pilot tasks").getByText("Confirm the lab match")).toBeVisible();
  await expect(page.getByLabel("Pilot metrics").getByText("Time to first graph")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pilot Evidence Tracker" })).toBeVisible();
  await expect(page.getByLabel("Pilot Evidence Tracker").getByText("No pilot observations yet.")).toBeVisible();
  await expect(page.getByLabel("Pilot Evidence Tracker").getByText("Do not claim completed student testing yet")).toBeVisible();
  await page.getByLabel("Time to graph Observation 1").fill("90");
  await page.getByLabel("Confidence before Observation 1").selectOption("2");
  await page.getByLabel("Confidence after Observation 1").selectOption("4");
  await page.getByLabel("Issue spotted Observation 1").selectOption("yes");
  await page.getByLabel("Exit ticket Observation 1").selectOption("ready");
  await page.getByLabel("Pilot note Observation 1").fill("Student found the graph warning before writing.");
  await expect(page.getByLabel("Pilot evidence metrics").getByText("1/3")).toBeVisible();
  await expect(page.getByLabel("Pilot evidence metrics").getByText("1m 30s")).toBeVisible();
  await expect(page.getByLabel("Pilot evidence metrics").getByText("+2.0")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Learning Exit Ticket" })).toBeVisible();
  await expect(page.getByLabel("Learning Exit Ticket").getByText("Exit ticket prompts")).toBeVisible();
  await expect(page.getByLabel("Learning Exit Ticket").getByText(/Which part of your setup was the independent variable/i)).toBeVisible();
  await expect(page.getByLabel("Learning Exit Ticket").getByText("Teacher signal").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Student Reflection Workspace" })).toBeVisible();
  await expect(page.getByLabel("Student Reflection Workspace").getByText("0/3 ready")).toBeVisible();
  await expect(page.getByLabel("Student Reflection Workspace").getByText("Start with Variable check")).toBeVisible();
  await page
    .getByLabel("Reflection answer Variable check")
    .fill("The independent variable was water temperature and the dependent variable was reaction rate.");
  await page
    .getByLabel("Reflection answer Pattern check")
    .fill("The graph shows rate increased as the water temperature increased, which matches the expected pattern.");
  await page
    .getByLabel("Reflection answer Next-step check")
    .fill("I would repeat the hottest trial while keeping water volume and tablet size the same.");
  await expect(page.getByLabel("Student Reflection Workspace").getByText("3/3 ready")).toBeVisible();
  await expect(
    page
      .getByLabel("Student Reflection Workspace")
      .getByText("All exit-ticket responses are student-authored and ready for teacher review.", { exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Judge Demo Path" })).toBeVisible();
  await expect(page.getByLabel("Judge Demo Path").getByText("Next best action")).toBeVisible();
  await expect(page.getByLabel("Judge Demo Path").getByText("Problem fit", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Judge Demo Path").getByText("Submission proof", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Runtime Proof" })).toBeVisible();
  await expect(page.getByLabel("AI Runtime Proof").getByText("Deterministic fallback ready")).toBeVisible();
  await expect(page.getByLabel("AI Runtime Proof").getByText("Trusted fallback active")).toBeVisible();
  await expect(page.getByLabel("AI Runtime Proof").getByText("9/9 cases passed")).toBeVisible();
  await expect(page.getByLabel("AI Runtime Proof").getByText("Server-only key boundary")).toBeVisible();
  await expect(page.getByLabel("AI Runtime Proof").getByText("Server dry-run mode")).toBeVisible();
  await expect(page.getByLabel("Runtime proof endpoints").getByRole("link", { name: "/api/runtime-proof" })).toHaveAttribute(
    "href",
    "/api/runtime-proof"
  );
  await expect(page.getByRole("heading", { name: "Student data table" })).toBeVisible();
  await expect(page.getByLabel("Expected overlay summary").getByText("Dashed expected overlay")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Method Audit" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pattern Evidence Engine" })).toBeVisible();
  await expect(page.getByLabel("Pattern Evidence Engine").getByText("Whole-pattern support")).toBeVisible();
  await expect(page.getByLabel("Method Audit").getByText("Controlled variables", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Reliability Coach" })).toBeVisible();
  await expect(page.getByLabel("Reliability Coach").getByText("Repeat groups")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Safety Coach" })).toBeVisible();
  await expect(page.getByLabel("Safety Coach").getByText("Adult review", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Concept Coach" })).toBeVisible();
  await expect(page.getByLabel("Concept Coach").getByText("Vocabulary")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Claim Coach" })).toBeVisible();
  await expect(page.getByLabel("Claim Coach").getByText("I can claim that ___ because my graph shows ___")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Next Trial Planner" })).toBeVisible();
  await expect(page.getByLabel("Next Trial Planner").getByText("Next measurement")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Packet" })).toBeVisible();
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Ouija Evidence Packet: Reaction Rate vs Temperature/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Model Strategy/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Technical Depth Proof/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Beyond simple API use/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/AI Evaluation Harness/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Data Handling Ledger/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Browser-local saved labs/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Judge Demo Path/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Next best action/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/AIYES Rubric Fit/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/AIYES Values Fit/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/AIYES Development Journey/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Grounding Audit/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Expected Overlay/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Learning Impact Loop/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Pilot Evidence Tracker/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Anonymous observations: 1/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Average confidence shift: \+2.0 points/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Learning Exit Ticket/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Exit ticket prompt:/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Student Reflection Drafts/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Student draft: The independent variable was water temperature/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Reflection status: ready for review/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Student Level Lens/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/High school support: quantify the relationship/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Concept Mastery Check/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Boundary: students answer these checks themselves/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Pattern Evidence/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Guided Lab Flow/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Concept Coach/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Reliability Coach/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Safety Coach/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Next Trial Plan/);
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/I can claim that ___/);
  await expect(page.getByRole("heading", { name: "Reasoning trail" })).toBeVisible();
  await expect(page.getByText("Track 1 evidence")).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("AI technical design", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Model strategy", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("AI evaluation harness", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Run AI evaluation harness", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Judge demo path", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Guide judge demo", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Pattern evidence", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Score whole pattern", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Repeat reliability", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Audit data handling", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Data ethics", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Plan pre-lab setup", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Pre-lab design", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Check learning exit ticket", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Learning exit ticket", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pre-Lab Design Coach" })).toBeVisible();
  await expect(page.getByLabel("Pre-Lab Design Coach").getByText("Before data collection", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Pre-Lab Design Coach").getByText("Independent variable", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Pre-Lab Design Coach").locator(".section-label").filter({ hasText: "Repeat plan" })).toBeVisible();
  await expect(page.getByLabel("Pre-Lab Design Coach").getByText("Source task", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Regression" }).click();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("9/9")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("checks passed")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("Pendulum coverage")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("Circuit coverage")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("Plant light coverage")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("Density coverage")).toBeVisible();
  await expect(page.getByLabel("Deterministic Regression Suite").getByText("Coverage boundary")).toBeVisible();
  await page.getByRole("link", { name: "Model Card" }).click();
  await expect(page.getByLabel("AI Model Card").getByText("Hybrid and inspectable")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Trusted fallback")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("9 checks")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Server keeps API keys out of the browser.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Model Strategy exposes candidate ranking, signals, fallback behavior, and risk controls.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Technical Depth Proof summarizes decision trace, evaluation harness, grounding quality, pattern engine, privacy, and integrity signals.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("AI Evaluation Harness scores classifier confidence, coverage, grounding, validators, safety, and fallback boundaries.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Judge Demo Path reduces the live demo to problem fit, AI design, student workflow, evidence handoff, and submission proof.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Official Rubric Fit maps problem relevance, AI design, and UX to concrete app evidence.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("AIYES Values Fit ties the app to AIYES values without changing the student's work into a generated report.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("AIYES Development Journey turns the required slide and video story into inspectable run evidence.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Learning Impact Loop turns analysis into measurable student readiness and next-trial evidence.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Student Pilot Study Kit defines anonymous student-testing tasks, metrics, observer notes, and evidence to collect.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Pilot Evidence Tracker summarizes anonymous time-to-graph, confidence shift, issue spotting, and exit-ticket readiness without collecting student identifiers.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Pre-Lab Design Coach turns classification into variables, controls, repeats, source checks, and safety before data collection.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Learning Exit Ticket converts the AI feedback into student reflection prompts judges can inspect.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Student Reflection Workspace stores student-written drafts without generating answers.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Student Level Lens adapts the same analysis for middle school pattern reading or high school quantitative evidence and uncertainty.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Concept Mastery Check scores variable, pattern, and integrity understanding before students copy evidence forward.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Grounding Audit checks source agreement before students use the expected pattern.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Pattern Evidence Engine quantifies whether the dataset supports the expected science pattern.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Reliability Coach checks repeated trials, averages, and spread before students trust a claim.")).toBeVisible();
  await expect(
    page
      .getByLabel("AI Model Card")
      .getByText("MCP Integration Coach keeps Composio credentials server-side, validates packets with /api/mcp/export, prepares session tickets with /api/mcp/session, and requires student consent before any source audit, Scholar claim check, Browser source capture, DeepWiki source proof, or export.")
  ).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("MCP Readiness Matrix makes connector tools, scopes, dry-run checks, and least-privilege boundaries inspectable.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Safety Coach forces adult-review language when a lab match is uncertain.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Deterministic Regression Suite tests eight supported labs plus the unsupported boundary.")).toBeVisible();
  await expect(page.getByLabel("AI Model Card").getByText("Data Handling Ledger makes student data flow, retention, and controls inspectable.")).toBeVisible();
  await page.getByRole("button", { name: "Save current lab" }).click();
  await page.getByRole("link", { name: "Saved Labs" }).click();
  await expect(page.locator("#saved").getByText("Reaction Rate vs Temperature", { exact: true })).toBeVisible();
  await expect(page.locator("#saved").getByText(/Competitive .* 94\/100/)).toBeVisible();
  await page.getByRole("link", { name: "MCP Export" }).click();
  await expect(page.getByRole("heading", { name: "MCP Integration Coach" })).toBeVisible();
  await expect(page.locator(".mcp-summary").getByText("Server dry-run", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP server bridge").getByText("Server dry-run", { exact: true })).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Run source audit search" }).getByText("Composio Search", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Run source audit search")).toBeVisible();
  await expect(
    page.locator(".mcp-action-card").filter({ hasText: "Run source audit search" }).getByText("search public web, scholar results, and fetched page text through Composio Search")
  ).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Run Scholar claim check" }).getByText("Composio Search", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Run Scholar claim check")).toBeVisible();
  await expect(
    page
      .locator(".mcp-action-card")
      .filter({ hasText: "Run Scholar claim check" })
      .getByText("query Google Scholar-style results through Composio Search Scholar and compare snippets against the expected pattern")
  ).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Capture source page context" }).getByText("Composio Browser", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Capture source page context")).toBeVisible();
  await expect(
    page
      .locator(".mcp-action-card")
      .filter({ hasText: "Capture source page context" })
      .getByText("create and watch a browser task that extracts student-reviewed source-page context through Composio Browser Tool")
  ).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Audit public source proof" }).getByText("DeepWiki", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Audit public source proof")).toBeVisible();
  await expect(
    page
      .locator(".mcp-action-card")
      .filter({ hasText: "Audit public source proof" })
      .getByText("read the public GitHub repo wiki structure, contents, and architecture answers through DeepWiki MCP")
  ).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Docs" }).getByText("Google Docs", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Create evidence packet doc")).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Sheets" }).getByText("Google Sheets", { exact: true })).toBeVisible();
  await expect(
    page.locator(".mcp-action-card").filter({ hasText: "Google Sheets" }).getByText("append spreadsheet rows and update worksheets", {
      exact: true
    })
  ).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Drive" }).getByText("Google Drive", { exact: true })).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Classroom" }).getByText("Google Classroom", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Draft pre-lab checkpoint")).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Forms" }).getByText("Google Forms", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Create readiness check form")).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Google Calendar" }).getByText("Google Calendar", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText("Schedule next trial reminder")).toBeVisible();
  await expect(page.locator(".mcp-action-card").filter({ hasText: "Notion" }).getByText("Notion", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP Readiness Matrix").getByText("11 connector routes checked")).toBeVisible();
  await expect(page.getByLabel("MCP Readiness Matrix").getByText("COMPOSIO_SEARCH_ALLOWED_TOOLS")).toHaveCount(2);
  await expect(page.getByLabel("MCP Readiness Matrix").getByText("COMPOSIO_BROWSER_ALLOWED_TOOLS")).toBeVisible();
  await expect(page.getByLabel("MCP Readiness Matrix").getByText("COMPOSIO_DEEPWIKI_ALLOWED_TOOLS")).toBeVisible();
  await expect(page.getByLabel("MCP Readiness Matrix").getByText("COMPOSIO_GOOGLE_FORMS_AUTH_CONFIG_ID")).toBeVisible();
  await expect(page.getByLabel("MCP dry-run checks").getByText("Payload completeness")).toBeVisible();
  await expect(page.getByLabel("MCP dry-run checks").getByText("Least privilege")).toBeVisible();
  await expect(page.getByLabel("MCP dry-run checks").getByText("Server dry-run bridge")).toBeVisible();
  await expect(page.getByLabel("MCP dry-run checks").getByText("Server-only credentials")).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText(/Server-side MCP bridge validates packets now/)).toBeVisible();
  await expect(page.getByLabel("MCP Integration Coach").getByText(/Server dry-run mode validates Composio packets/)).toBeVisible();
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/# Ouija Evidence Packet: Reaction Rate vs Temperature/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Composio Search: search public web/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Composio Search: query Google Scholar-style results/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Composio Browser: create and watch a browser task/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/DeepWiki: read the public GitHub repo/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Google Sheets: append spreadsheet rows/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Google Classroom: create coursework draft/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Google Forms: create Google Forms draft/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Google Calendar: create calendar event draft/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/MCP readiness matrix/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Dry-run checks/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Pre-Lab Design Coach/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Pilot Evidence Tracker summary/);
  await expect(page.getByLabel("MCP payload preview")).toHaveValue(/Student Reflection Drafts/);
  await page.locator(".mcp-action-card").filter({ hasText: "Run Scholar claim check" }).getByRole("button", { name: "Validate route" }).click();
  await expect(page.getByLabel("MCP export dry-run result").getByText("Dry-run passed", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP export dry-run result").getByText("COMPOSIO_SEARCH_SCHOLAR")).toBeVisible();
  await expect(page.getByLabel("MCP session ticket result").getByText("Session dry-run", { exact: true })).toBeVisible();
  await expect(page.getByLabel("MCP session ticket result").getByText("/api/v3.1/tool_router/session")).toBeVisible();
  await expect(page.getByLabel("MCP session ticket result").getByText("MCP URL issued: no")).toBeVisible();
  await page.getByRole("link", { name: "Settings" }).click();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("Local snapshots")).toBeVisible();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("1/6")).toBeVisible();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("MCP exports")).toBeVisible();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("Server dry-run")).toBeVisible();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("Reflections")).toBeVisible();
  await expect(page.getByLabel("Settings", { exact: true }).getByText("3/3")).toBeVisible();
  await page.getByRole("link", { name: "Judge Brief" }).click();
  await expect(page.getByLabel("Judge Brief").getByText("AIYES Track 1")).toBeVisible();
  await expect(page.locator(".judge-status-grid").getByText("Hosted")).toHaveCount(4);
  await expect(page.locator(".judge-status-grid").getByText("Source code")).toBeVisible();
  await expect(page.locator(".judge-status-grid").getByText("Public")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Slide presentation")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Video walkthrough")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Source or deployment")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Submission hub")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Devpost form pack")).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("Student team", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("External step", { exact: true })).toBeVisible();
  await expect(page.getByLabel("AIYES Submission Checklist").getByText("2-5 student team")).toBeVisible();
  await expect(page.getByLabel("Hosted submission links").getByRole("link", { name: /Submission hub/i })).toHaveAttribute(
    "href",
    "https://ouija-olive.vercel.app/submission/"
  );
  await expect(page.getByLabel("Hosted submission links").getByRole("link", { name: /Devpost pack/i })).toHaveAttribute(
    "href",
    "https://ouija-olive.vercel.app/submission/devpost-pack.html"
  );
  await expect(page.getByLabel("Hosted submission links").getByRole("link", { name: /Source code/i })).toHaveAttribute(
    "href",
    "https://github.com/rushtanu14/ouija"
  );
  await expect(page.getByLabel("Hosted submission links").getByRole("link", { name: /Slide deck/i })).toHaveAttribute(
    "href",
    "https://ouija-olive.vercel.app/submission/slide-deck.html"
  );
  await expect(page.getByLabel("Hosted submission links").getByRole("link", { name: /Video walkthrough/i })).toHaveAttribute(
    "href",
    "https://ouija-olive.vercel.app/submission/assets/ouija-walkthrough.webm"
  );
  await expect(page.getByLabel("Judge Brief").getByText("AI pipeline is visible in Reasoning Trail.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Judge Demo Path gives evaluators a five-step walkthrough.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Model Strategy shows candidate ranking and risk controls.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Technical Depth Proof makes beyond-simple-API architecture evidence visible.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("AI Evaluation Harness scores model behavior and safeguards.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Official Rubric Fit maps all three visible AIYES criteria.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("AIYES Values Fit maps democracy, diversity, connectivity, innovation, and ethical inclusion to concrete product evidence.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("AIYES Development Journey maps problem, data, model, build, testing, UX, ethics, impact, constraints, and submission proof.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Learning Impact Loop measures the student's outcome for each run.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Pilot Evidence Tracker logs anonymous browser-local observations without letting the team claim fake completed testing.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Submission Hub gives judges one URL for live app, judge view, deck, video, source, Devpost pack, and proof endpoints.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Pre-Lab Design Coach helps students plan variables, controls, repeats, sources, and safety before collecting data.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Learning Exit Ticket proves students must explain variables, patterns, and next steps themselves.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Student Reflection Workspace captures student-authored exit-ticket drafts.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Student Level Lens switches the same lab guidance between middle-school plain language and high-school quantitative reasoning.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Concept Mastery Check measures whether students understand variables, evidence patterns, and integrity boundaries.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Grounding Audit makes citation trust and mixed evidence visible.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Pattern Evidence Engine scores the whole graph against the expected pattern.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Reliability Coach checks repeats, averages, and spread.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Guided Lab Flow gives students a clear next action.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Concept Coach turns results into student learning scaffolds.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Safety Coach makes school-lab risk checks visible.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Deterministic Regression Suite runs nine internal behavior checks.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Data Handling Ledger shows privacy, retention, and student controls.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Evidence Packet exports a student-owned reasoning handoff.")).toBeVisible();
  await expect(
    page
      .getByLabel("Judge Brief")
      .getByText("MCP Integration Coach validates Composio Search source audits, Scholar claim checks, Browser source capture, DeepWiki public-source proof, plus Docs, Sheets, Drive, Classroom, Forms, Calendar, and Notion handoffs through a server dry-run and scoped session ticket without exposing credentials.")
  ).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("MCP Readiness Matrix shows exact connector env vars, tools, scopes, data shared, dry-run checks, and consent gates.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Next Trial Planner gives adaptive measurement guidance.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("AIYES submission checklist makes deck, video, source/deploy link, Devpost form pack, and team requirement status visible.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Hosted deck and walkthrough are public.")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Low-confidence labs show a boundary warning.")).toBeVisible();

  const firstRate = page.getByLabel("Rate row c1");
  await firstRate.fill("0.09");
  await expect(page.getByLabel("Comparison insights").getByText("Rate trend does not match the expected temperature pattern")).toBeVisible();
  await expect(page.getByLabel("Method Audit").getByText("Needs review")).toBeVisible();
  await expect(page.getByLabel("Pattern Evidence Engine").getByText("Mixed evidence")).toBeVisible();
  await expect(page.getByLabel("Learning Impact Loop").getByText("Review first")).toBeVisible();
  await expect(page.getByLabel("Learning Exit Ticket").getByText("Review first", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Guided Lab Flow").getByText("Repeat or fix the flagged measurement before writing the claim.")).toBeVisible();
  await expect(page.locator(".next-trial-summary > span").getByText("Fix warnings first", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Claim Coach").getByText(/warning to resolve/i)).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("judge mode shows a top award radar with honest win gaps", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/?judge=1");

  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
  await page.getByLabel("Time to graph Observation 1").fill("90");
  await page.getByLabel("Confidence before Observation 1").selectOption("2");
  await page.getByLabel("Confidence after Observation 1").selectOption("4");
  await page.getByLabel("Issue spotted Observation 1").selectOption("yes");
  await page.getByLabel("Exit ticket Observation 1").selectOption("ready");
  await page.getByRole("link", { name: "Award Radar" }).click();

  await expect(page.getByRole("heading", { name: "Top Award Radar" })).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("Submittable and competitive")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("Not a first-place guarantee")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("Problem and relevance")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("AI and model strategy")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("UX and design")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("Impact evidence")).toBeVisible();
  await expect(page.getByLabel("Top Award Radar").getByText("1/3 anonymous pilot observations logged")).toBeVisible();
  await expect(page.getByLabel("Top award next moves").getByText("Collect 3 anonymous pilot observations before claiming user testing.")).toBeVisible();
  await expect(page.getByLabel("Top award next moves").getByText("Confirm the 2-5 student team roster in the Devpost submission flow.")).toBeVisible();
});

test("student mode keeps the core lab workflow focused before judge proof", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/");

  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
  await expect(page.getByLabel("View mode").getByRole("button", { name: "Student" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("heading", { name: "Student Focus" })).toBeVisible();
  await expect(page.getByLabel("Student Focus").getByText("Next move")).toBeVisible();
  await expect(page.getByLabel("Student Focus").getByText("Evidence check")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Student data table" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Evidence Packet" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Model Strategy" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Judge Brief" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "MCP Export" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Award Radar" })).toHaveCount(0);

  await page.getByLabel("View mode").getByRole("button", { name: "Judge" }).click();
  await expect(page).toHaveURL(/judge=1/);
  await expect(page.getByRole("heading", { name: "Judge Demo Path" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Model Strategy" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AIYES Development Journey" })).toBeVisible();
  await expect(page.getByRole("link", { name: "MCP Export" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Award Radar" })).toBeVisible();

  await page.getByLabel("View mode").getByRole("button", { name: "Student" }).click();
  await expect(page.getByLabel("View mode").getByRole("button", { name: "Student" })).toHaveAttribute("aria-pressed", "true");
  expect(new URL(page.url()).searchParams.has("judge")).toBe(false);
});

test("unsupported experiment descriptions show a low-confidence boundary", async ({ page }) => {
  await page.goto("/?judge=1");
  await expect(page.getByRole("heading", { name: "Projectile Motion" })).toBeVisible();
  await page.getByLabel("Describe your experiment").fill("We compared paper towel brands by measuring how much water each towel absorbed.");
  await page.getByRole("button", { name: "Analyze" }).click();

  await expect(page.locator(".classification").getByText("Closest supported match", { exact: true })).toBeVisible();
  await expect(page.locator(".classification-note").getByText("Low-confidence description", { exact: false })).toBeVisible();
  await expect(page.getByLabel("Comparison insights").getByText("Closest supported experiment only")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Custom Lab Triage" })).toBeVisible();
  await expect(page.locator(".triage-summary").getByText("paper towel absorbency", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Custom Lab Triage").getByText("Variable plan")).toBeVisible();
  await expect(page.locator(".triage-variable-grid article").filter({ hasText: "Independent variable" }).getByText("Paper towel brand or type", { exact: true })).toBeVisible();
  await expect(page.locator(".triage-variable-grid article").filter({ hasText: "Dependent variable" }).getByText("Water absorbed", { exact: true })).toBeVisible();
  await expect(page.locator(".triage-starter-table").getByText("Brand A", { exact: true })).toBeVisible();
  await expect(page.locator(".triage-variable-grid article").filter({ hasText: "Repeat plan" }).getByText("Use at least 3 towel pieces")).toBeVisible();
  await expect(page.getByLabel("Pattern Archetype Coach").getByText("Comparison experiment", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Pattern Archetype Coach").getByText("Bar chart by paper towel brand or type")).toBeVisible();
  await expect(page.getByLabel("Pattern Archetype Coach").getByText("should not assume a winner")).toBeVisible();
  await expect(page.getByLabel("Pattern Archetype Coach").getByText("Do the repeat trials for each group")).toBeVisible();
  await expect(page.getByLabel("Custom Lab Triage").getByText("What exact condition did you change on purpose?")).toBeVisible();
  await expect(page.getByLabel("Model Strategy").getByText("Closest supported match is")).toBeVisible();
  await expect(page.getByLabel("Guided Lab Flow").getByText("Confirm this is the right experiment before using the guidance.")).toBeVisible();
  await expect(page.getByLabel("Safety Coach").getByText("Adult review needed because this description is only a closest supported match.")).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Needs work")).toBeVisible();
});

test("student can paste spreadsheet data into the active table", async ({ page }) => {
  await page.goto("/?judge=1");
  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();

  await page
    .getByLabel("Paste data table")
    .fill("Temperature (C)\tReaction time (s)\tRate (1/s)\n10\t50\t0.04\n40\t80\t0.01");
  await page.getByRole("button", { name: "Import rows" }).click();

  await expect(page.getByText("Imported 2 rows using headers.")).toBeVisible();
  await expect(page.getByLabel("Rate row import-1")).toHaveValue("0.04");
  await expect(page.getByLabel("Comparison insights").getByText("Rate trend does not match the expected temperature pattern")).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Data handling", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Reasoning trail").getByText("Expose model strategy")).toBeVisible();
});

test("saved labs build a visible progress portfolio for judges", async ({ page }) => {
  await page.addInitScript(() => window.localStorage.clear());
  await page.goto("/?judge=1");
  await expect(page.getByRole("heading", { name: "Projectile Motion" })).toBeVisible();

  await page.getByLabel("Describe your experiment").fill("We compared paper towel brands by measuring how much water each towel absorbed.");
  await page.getByRole("button", { name: "Analyze" }).click();
  await expect(page.getByRole("heading", { name: "Custom Lab Triage" })).toBeVisible();
  await page.getByRole("button", { name: "Save current lab" }).click();
  await page.getByRole("link", { name: "Saved Labs" }).click();
  await expect(page.getByRole("heading", { name: "Progress Portfolio" })).toBeVisible();
  await expect(page.getByLabel("Progress Portfolio").getByText("1 saved run")).toBeVisible();
  await expect(page.getByLabel("Progress Portfolio").getByText("Portfolio building")).toBeVisible();
  await expect(page.getByLabel("Portfolio Story Builder").getByText("Needs saved evidence")).toBeVisible();

  await page.getByRole("button", { name: "Water Filtration" }).click();
  await expect(page.getByRole("heading", { name: "Water Filtration and Turbidity" })).toBeVisible();
  await page.getByRole("button", { name: "Save current lab" }).click();
  await page.getByRole("link", { name: "Saved Labs" }).click();

  await expect(page.getByLabel("Progress Portfolio").getByText("2 saved runs")).toBeVisible();
  await expect(page.locator(".progress-metric").filter({ hasText: "Score trend" }).getByText("+19", { exact: true })).toBeVisible();
  await expect(page.locator(".progress-metric").filter({ hasText: "Subject breadth" }).getByText("2 subjects", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Portfolio Story Builder").getByText("Story ready")).toBeVisible();
  await expect(page.getByLabel("Portfolio Story Builder").getByText("Across my saved labs, my evidence changed from 75/100 to 94/100")).toBeVisible();
  await expect(page.getByLabel("Portfolio Story Builder").getByText("student writes the progress story")).toBeVisible();
  await expect(page.getByLabel("Progress Portfolio").getByText("repeated learning evidence")).toBeVisible();
  await expect(page.getByLabel("Judge Brief").getByText("Progress Portfolio shows learning over multiple saved runs.")).toBeVisible();
});

test("sample chip analysis wins over a slower initial analysis", async ({ page }) => {
  let delayedInitial = false;

  await page.route("**/api/analyze", async (route) => {
    const body = JSON.parse(route.request().postData() ?? "{}") as { description?: string };
    if (!delayedInitial && body.description?.includes("launch angle")) {
      delayedInitial = true;
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    await route.continue();
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
});

test("student can analyze an Ohm's law circuit lab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Ohm's Law" }).click();

  await expect(page.getByRole("heading", { name: "Ohm's Law Circuits" })).toBeVisible();
  await expect(page.getByLabel("Sources and explanation").getByRole("link", { name: /Ohm's law/i })).toBeVisible();
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Ouija Evidence Packet: Ohm's Law Circuits/);
});

test("student can analyze a pendulum period lab", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pendulum" }).click();

  await expect(page.getByRole("heading", { name: "Pendulum Period vs Length" })).toBeVisible();
  await expect(page.getByLabel("Sources and explanation").getByRole("link", { name: /Pendulum motion/i })).toBeVisible();
  await expect(page.getByLabel("Concept Coach").getByText("small-angle swing")).toBeVisible();
  await expect(page.getByLabel("Student evidence packet")).toHaveValue(/Ouija Evidence Packet: Pendulum Period vs Length/);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Water Filtration" }).click();
  await expect(page.getByRole("heading", { name: "Water Filtration and Turbidity" })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
