import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:5188",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "npm run dev:server",
      url: "http://127.0.0.1:8787/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: "npm run dev:client",
      url: "http://127.0.0.1:5188",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ],
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } }
  ]
});
