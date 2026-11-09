import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const data = readFileSync(new URL('../src/data/fleetLifecycle.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/ArdhiProduction.tsx', import.meta.url), 'utf8');
test('ARDHI maintenance renders lifecycle projection, not only legacy snapshots', () => {
  assert.match(ui, /publicLifecycleForAsset\('SP-ARDHI-26'\)/);
  assert.match(ui, /Active service items/);
  assert.match(ui, /Historical system baselines/);
  assert.match(ui, /Outstanding at snapshot/);
});
test('track remains blocked and throttle is verified', () => {
  assert.match(data, /id:'DEF-003'[\s\S]*?status:'repair_pending'[\s\S]*?serviceRelease:'blocked'/);
  assert.match(data, /id:'DEF-001'[\s\S]*?status:'verified'/);
});
test('draft article links are excluded from public lifecycle projection', () => {
  assert.match(data, /e\.article\?\.state==='published'/);
  assert.match(data, /smashpro\\\.app/);
});
