import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = resolve(repoRoot, "docs", "assets");
const baseUrl = process.env.OUIJA_URL ?? "http://127.0.0.1:5188";

mkdirSync(assetDir, { recursive: true });

const browser = await chromium.launch();

async function capture({ name, width, height, afterOpen }) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await page.getByRole("heading", { name: "Pattern Evidence Engine" }).waitFor();
  await page.getByRole("heading", { name: "Method Audit" }).waitFor();
  if (afterOpen) {
    await afterOpen(page);
  }
  await page.screenshot({
    path: resolve(assetDir, name),
    fullPage: true
  });
  await page.close();
}

await capture({
  name: "ouija-demo-desktop.png",
  width: 1440,
  height: 900
});

await capture({
  name: "ouija-demo-mobile.png",
  width: 390,
  height: 844
});

await capture({
  name: "ouija-warning-state.png",
  width: 1440,
  height: 900,
  afterOpen: async (page) => {
    await page.getByLabel("Rate row c1").fill("0.09");
    await page.getByLabel("Pattern Evidence Engine").getByText("Mixed evidence").waitFor();
    await page.getByLabel("Method Audit").getByText("Needs review").waitFor();
  }
});

await capture({
  name: "ouija-custom-triage.png",
  width: 1440,
  height: 900,
  afterOpen: async (page) => {
    await page.getByLabel("Describe your experiment").fill("We grew bean seedlings under red, blue, and white light and measured plant height.");
    await page.getByRole("button", { name: "Analyze" }).click();
    await page.getByRole("heading", { name: "Custom Lab Triage" }).waitFor();
    await page.getByRole("heading", { name: "Custom Lab Triage" }).scrollIntoViewIfNeeded();
    await page.getByLabel("Custom Lab Triage").getByText("What exact condition did you change on purpose?").waitFor();
    await page.getByLabel("Custom Lab Triage").getByText("Red light").waitFor();
  }
});

await browser.close();

console.log(`Submission screenshots saved to ${assetDir}`);
