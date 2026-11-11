import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/browser",
  testMatch: "loflin.spec.mjs",
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4192",
    headless: true,
    reducedMotion: "reduce",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
  },
  outputDir: "tmp/attachments-browser-results",
  webServer: {
    command: `${process.platform === "win32" ? "npm.cmd" : "npm"} run preview -- --host 127.0.0.1 --port 4192 --strictPort`,
    url: "http://127.0.0.1:4192/equipment/attachments/sp-att-grp-001/",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
