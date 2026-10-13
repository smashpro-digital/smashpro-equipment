import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const code = ts.transpileModule(readFileSync('src/domain/fleetCard.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { fleetCardSpecs } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
test('fleet cards select at most two confirmed source values without changing qualifications', () => {
  const specifications = [
    { label: 'Load', value: '280 kg, manufacturer-stated', confirmed: true },
    { label: 'Power', value: '23 HP', confirmed: true },
    { label: 'Speed', value: 'Unverified estimate', confirmed: false },
  ];
  const item = { specifications, showroomCard: { specLabels: ['Speed', 'Missing', 'Load', 'Power'] } };
  assert.deepEqual(fleetCardSpecs(item), specifications.slice(0, 2));
  assert.equal(specifications.length, 3);
});
test('new collection entries work without per-machine presentation metadata', () => {
  const specifications = ['Fleet ID', 'Load', 'Power', 'Speed'].map(label => ({ label, value: label, confirmed: true }));
  assert.deepEqual(fleetCardSpecs({ specifications }), specifications.slice(1, 3));
});
test('empty or unverified specifications are omitted, never replaced by invented values', () => {
  assert.deepEqual(fleetCardSpecs({ specifications: [{ label: 'Load', value: '', confirmed: true }, { label: 'Power', value: 'Planned', confirmed: false }] }), []);
});
