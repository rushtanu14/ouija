import { expect, test } from "@playwright/test";

test("student can analyze a sample experiment, edit table data, and see citations", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Reaction Rate" }).click();
  await expect(page.getByRole("heading", { name: "Reaction Rate vs Temperature" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Factors that affect reaction rates/i })).toBeVisible();
  await expect(page.getByText("Student data table")).toBeVisible();

  const firstRate = page.getByLabel("Rate row c1");
  await firstRate.fill("0.09");
  await expect(page.getByText("Rate trend does not match the expected temperature pattern")).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Water Filtration" }).click();
  await expect(page.getByRole("heading", { name: "Water Filtration and Turbidity" })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
