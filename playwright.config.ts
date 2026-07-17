import { defineConfig, devices } from "@playwright/test";

const e2eClientPort = 15188;
const e2eApiPort = 18787;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: `http://127.0.0.1:${e2eClientPort}`,
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: `PORT=${e2eApiPort} OUIJA_ANALYZE_RATE_LIMIT=1000 npm run dev:server`,
      url: `http://127.0.0.1:${e2eApiPort}/api/health`,
      reuseExistingServer: false,
      timeout: 120_000
    },
    {
      command: `OUIJA_CLIENT_PORT=${e2eClientPort} OUIJA_API_PORT=${e2eApiPort} npm run dev:client`,
      url: `http://127.0.0.1:${e2eClientPort}`,
      reuseExistingServer: false,
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
