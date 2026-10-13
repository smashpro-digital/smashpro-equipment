import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'field-technology.spec.mjs', workers: 1, timeout: 60000,
  outputDir: 'tmp/field-technology-results',
  use: { baseURL: 'http://127.0.0.1:4183', headless: true, reducedMotion: 'reduce' },
  webServer: { command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --host 127.0.0.1 --port 4183 --strictPort`, url: 'http://127.0.0.1:4183/equipment/', reuseExistingServer: false, timeout: 60000 },
});
