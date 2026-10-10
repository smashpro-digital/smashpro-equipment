import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'ardhi-v4.spec.mjs', workers: 1, timeout: 45000,
  use: { baseURL: 'http://127.0.0.1:4187', headless: true, reducedMotion: 'reduce', screenshot: 'only-on-failure' },
  outputDir: 'tmp/ardhi-v4-browser',
  webServer: { command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --host 127.0.0.1 --port 4187 --strictPort`, url: 'http://127.0.0.1:4187/equipment/sp-ardhi-26.html', reuseExistingServer: false },
});
