import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'loflin.spec.mjs', workers: 1,
  timeout: 45000, use: { baseURL: 'http://127.0.0.1:4182', headless: true, reducedMotion: 'reduce' },
  outputDir: 'tmp/loflin-browser-results',
  webServer: { command: `${process.platform === 'win32' ? 'npm.cmd' : 'npm'} run preview -- --host 127.0.0.1 --port 4182 --strictPort`, url: 'http://127.0.0.1:4182/equipment/', reuseExistingServer: false, timeout: 60000 },
});
