import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const data = readFileSync(new URL('../src/data/fleetLifecycle.ts', import.meta.url), 'utf8');
const flagship = readFileSync(new URL('../src/data/ardhiFlagship.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/ArdhiProduction.tsx', import.meta.url), 'utf8');
const compiledFlagship = ts.transpileModule(flagship, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { commissioningChecks } = await import('data:text/javascript;base64,' + Buffer.from(compiledFlagship).toString('base64'));
test('ARDHI maintenance renders lifecycle projection, not only legacy snapshots', () => {
  assert.match(ui, /mergePublicLifecycleEvents\('SP-ARDHI-26'/);
  assert.match(ui, /Active service items/);
  assert.match(ui, /Historical system baselines/);
  assert.match(ui, /Outstanding at snapshot/);
  assert.match(ui, /Reviewed Digital HQ database feed, supplemented by pending editorial records/);
});
test('track remains blocked and throttle is verified', () => {
  assert.match(data, /id:'DEF-003'[\s\S]*?status:'repair_pending'[\s\S]*?serviceRelease:'blocked'/);
  assert.match(data, /id:'DEF-001'[\s\S]*?status:'verified'/);
});
test('draft article links are excluded from public lifecycle projection', () => {
  assert.match(data, /e\.article\?\.state==='published'/);
  assert.match(data, /smashpro\\\.app/);
});
test('commissioning copy shows restored throttle travel without implying approval', () => {
  const engine = commissioningChecks.find(check => check.id === 'engine');
  const approval = commissioningChecks.find(check => check.id === 'passport-complete');
  assert.match(engine.notes, /Throttle travel was restored November 8/);
  assert.doesNotMatch(engine.notes, /throttle travel restriction is open/);
  assert.match(approval.notes, /unrepaired, service-blocking thrown track/);
  assert.match(approval.notes, /quick-change retention verification/);
  assert.match(ui, /Latest: lifecycle and open service items \(updated November 8\)/);
});
