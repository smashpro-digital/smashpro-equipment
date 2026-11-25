import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(readFileSync('src/data/ardhiMediaCollection.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { ardhiMediaCollection, ardhiJourneyChapters, ardhiStories, ardhiMediaWithheld } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const local = url => url.replace('/equipment/images/', 'images/');

test('media collection manifest is structurally sound and self-consistent', () => {
  const ids = new Set(ardhiMediaCollection.map(item => item.id));
  assert.equal(ids.size, ardhiMediaCollection.length, 'ids must be unique');
  const stages = new Set(ardhiJourneyChapters.map(chapter => chapter.id));
  const stories = new Set(ardhiStories.map(story => story.id));
  for (const item of ardhiMediaCollection) {
    assert.equal(item.assetId, 'SP-ARDHI-26', item.id);
    assert.ok(stages.has(item.stage), `${item.id} stage`);
    assert.ok(item.caption.trim().length > 20, `${item.id} caption`);
    assert.ok(item.alt.trim().length > 10, `${item.id} alt`);
    assert.ok(Number.isInteger(item.width) && item.width > 0 && Number.isInteger(item.height) && item.height > 0, `${item.id} dimensions`);
    assert.match(item.capturedAt, /^(\d{4}-\d{2}-\d{2}|unknown)$/, `${item.id} capturedAt`);
    if (item.story) assert.ok(stories.has(item.story), `${item.id} story ref`);
    for (const url of [item.source, item.web, item.thumb, item.poster].filter(Boolean)) {
      assert.match(url, /^\/equipment\/images\/[a-z0-9.-]+$/, `${item.id} url shape: ${url}`);
      assert.ok(existsSync(local(url)), `${item.id} missing file ${url}`);
    }
    if (item.type === 'video') {
      assert.ok(item.poster, `${item.id} video poster`);
      assert.ok(item.durationSeconds > 0, `${item.id} duration`);
      assert.match(item.source, /\.mp4$/);
    } else {
      assert.match(item.web, /-web\.jpg$/, `${item.id} web derivative`);
      assert.match(item.thumb, /-thumb\.jpg$/, `${item.id} thumbnail`);
    }
  }
  // Every chapter has content; every story maps to at least one media item.
  for (const chapter of ardhiJourneyChapters) assert.ok(ardhiMediaCollection.some(item => item.stage === chapter.id), chapter.id);
  for (const story of ardhiStories) assert.ok(ardhiMediaCollection.some(item => item.story === story.id), story.id);
});

test('collection excludes withheld media and private material', () => {
  const published = new Set(ardhiMediaCollection.map(item => item.source));
  for (const withheld of ardhiMediaWithheld) assert.ok(!published.has(withheld.source), withheld.source);
  const text = JSON.stringify(ardhiMediaCollection) + JSON.stringify(ardhiStories);
  for (const secret of ['operator-2026-10-31', 'Hopkins', 'kinematrailerdepot@gmail.com', '576.72', '1746.22', 'Hailey'])
    assert.ok(!text.includes(secret), secret);
  // Guardrails: no float claims; reported hours must carry the meter disclaimer.
  assert.doesNotMatch(text, /float/i);
  assert.match(text, /no verified hour-meter reading/i);
});

test('media collection page is registered as a physical route with reciprocal links', () => {
  assert.match(readFileSync('vite.config.ts', 'utf8'), /sp-ardhi-26-media\.html/);
  assert.match(readFileSync('src/app/App.tsx', 'utf8'), /sp-ardhi-26-media\.html/);
  const entryHtml = readFileSync('sp-ardhi-26-media.html', 'utf8');
  assert.match(entryHtml, /canonical" href="https:\/\/smashpro\.app\/equipment\/sp-ardhi-26-media\.html"/);
  assert.doesNotMatch(entryHtml, /noindex/);
  const collection = readFileSync('src/components/ArdhiMediaCollection.tsx', 'utf8');
  assert.match(collection, /\/equipment\/sp-ardhi-26\.html/, 'collection links back to the passport');
  const flagship = readFileSync('src/components/ArdhiFlagship.tsx', 'utf8');
  assert.match(flagship, /sp-ardhi-26-media\.html/, 'passport links to the collection');
  // The prepared stories are not exposed as external links before they exist.
  assert.doesNotMatch(collection, /smashpro\.app\/(blog|stories|\d{4})/, 'no premature article URLs');
});
