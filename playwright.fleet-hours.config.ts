import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  testMatch: "fleet-hours.spec.mjs",
  workers: 1,
  timeout: 45000,
  outputDir: "artifacts/fleet-hours-browser-results",
  use: {
    baseURL: "http://127.0.0.1:4176",
    headless: true,
    reducedMotion: "reduce",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
  },
  webServer: {
    command: `${process.platform === "win32" ? "npm.cmd" : "npm"} run preview -- --host 127.0.0.1 --port 4176 --strictPort`,
    url: "http://127.0.0.1:4176/equipment/sp-ardhi-26.html",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
