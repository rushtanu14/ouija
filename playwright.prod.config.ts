import { defineConfig, devices } from "@playwright/test";

const prodPort = 19188;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  grep: /@prod-smoke/,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: `http://127.0.0.1:${prodPort}`,
    trace: "on-first-retry"
  },
  webServer: {
    command: `npm run build && npm run build:server && PORT=${prodPort} HOST=127.0.0.1 NODE_ENV=production OUIJA_ANALYZE_RATE_LIMIT=1000 npm run serve:prod`,
    url: `http://127.0.0.1:${prodPort}/api/health`,
    reuseExistingServer: false,
    timeout: 120_000
  },
  projects: [
    { name: "prod-chromium", use: { ...devices["Desktop Chrome"] } }
  ]
});
