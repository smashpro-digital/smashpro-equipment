import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'fleet-layout.spec.mjs', workers: 1, timeout: 240000,
  expect: { timeout: 30000 }, outputDir: 'tmp/fleet-layout-results',
  use: { baseURL: 'http://127.0.0.1:5196', headless: true, reducedMotion: 'reduce' },
  webServer: { command: 'node node_modules/vite/bin/vite.js --configLoader runner --host 127.0.0.1 --port 5196 --strictPort', url: 'http://127.0.0.1:5196/equipment/', reuseExistingServer: false, timeout: 180000 },
});
