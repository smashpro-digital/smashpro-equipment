import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/browser', testMatch: 'affiliate-rotation.spec.mjs', workers: 1, timeout: 90000,
  outputDir: 'tmp/affiliate-rotation-results',
  use: { baseURL: 'http://127.0.0.1:5187', headless: true, reducedMotion: 'no-preference' },
  webServer: { command: 'node node_modules/vite/bin/vite.js preview --configLoader runner --host 127.0.0.1 --port 5187 --strictPort', url: 'http://127.0.0.1:5187/equipment/', reuseExistingServer: true, timeout: 180000 },
});
