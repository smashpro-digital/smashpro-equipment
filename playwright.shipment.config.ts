import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  testMatch: "shipment.spec.mjs",
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4175",
    headless: true,
    reducedMotion: "reduce",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
    screenshot: "only-on-failure",
  },
  outputDir: "tmp/shipment-browser-results",
  webServer: {
    command: `${process.platform === "win32" ? "npm.cmd" : "npm"} run preview -- --host 127.0.0.1 --port 4175 --strictPort`,
    url: "http://127.0.0.1:4175/equipment/sp-ardhi-26.html",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
