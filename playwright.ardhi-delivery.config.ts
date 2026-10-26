import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'ardhi-delivery.spec.mjs', workers: 1, timeout: 60000,
  use: { baseURL: 'http://127.0.0.1:4196', headless: true, reducedMotion: 'reduce', screenshot: 'only-on-failure' },
  outputDir: 'tmp/ardhi-delivery-results',
  webServer: { command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --host 127.0.0.1 --port 4196 --strictPort`, url: 'http://127.0.0.1:4196/equipment/sp-ardhi-26.html', reuseExistingServer: false, timeout: 60000 },
});
