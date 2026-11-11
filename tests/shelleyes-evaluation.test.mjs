import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../src/pages/ShelleyesEvaluationPages.tsx', import.meta.url), 'utf8');
const editorialRules = readFileSync(new URL('../docs/media-equipment/shelleyes-s7p-evaluation.md', import.meta.url), 'utf8');
const routing = readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8');
const buildConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');

test('research reference is visibly distinct from assigned fleet and passport IDs', () => {
  assert.match(source, /SP-MED-S7P-EVAL-26/);
  assert.match(source, /Permanent passport ID/);
  assert.match(source, /Fleet asset/);
  assert.match(source, /Not assigned/);
  assert.match(editorialRules, /SPP-YYYY-NNNN/);
  assert.match(editorialRules, /SP-MED-CAM-001.*AKASO/);
});

test('public text does not disclose the private sample quote or imply completed field tests', () => {
  assert.doesNotMatch(source, /\$148|\$232\.50|\$84\.50|Leon|leon@shelleyes\.com/);
  assert.match(source, /not purchased, received, deployed or field-tested/i);
  assert.match(source, /not currently offered for sale or deployment/i);
  assert.match(source, /manufacturer-reported/i);
});

test('equipment passport points to the standalone WordPress case study', () => {
  assert.match(source, /https:\/\/smashpro\.app\/smashpro-live-view-contractor-camera-case-study\//);
  const legacy = readFileSync(new URL('../shelleyes-s7p-field-study.html', import.meta.url), 'utf8');
  assert.match(legacy, /http-equiv="refresh"/);
  assert.match(legacy, /rel="canonical" href="https:\/\/smashpro\.app\/smashpro-live-view-contractor-camera-case-study\//);
});

test('both study routes have physical production HTML entries', () => {
  for (const file of ['shelleyes-s7p-evaluation.html', 'shelleyes-s7p-field-study.html']) {
    assert.ok(routing.includes(file));
    assert.ok(buildConfig.includes(file));
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /<div id="root"><\/div>/);
  }
});
