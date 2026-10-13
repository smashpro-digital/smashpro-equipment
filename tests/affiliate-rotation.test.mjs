import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { rotationCatalog } from './fixtures/affiliate-rotation.mjs';
const code = ts.transpileModule(readFileSync('src/domain/affiliateCreatives.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { affiliateCreatives, creativeSchedule } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
test('five, one, zero banners and weighted ordering', () => {
  for (const count of [5, 1, 0]) { const now = Date.now(), p = rotationCatalog(count, now); assert.equal(affiliateCreatives(p.items[0].products[0].creatives, p.placement, 9003, now + 60000, now).length, count); }
  assert.deepEqual(creativeSchedule([{ id: 1, weight: 3 }, { id: 2, weight: 1 }]), [1, 2, 1, 1]);
});
test('expired, Garage, mismatched attribution, malformed and rewritten tracking are excluded', () => {
  const now = Date.now(), p = rotationCatalog(1, now), original = p.items[0].products[0].creatives[0];
  for (const patch of [{ valid_until: new Date(now).toISOString() }, { property: 'garage' }, { placement: 'garage' }, { campaign_id: 9 }, { tracking_url: original.tracking_url + '&r=999' }, { image_url: 'https://example.com/banner' }, { weight: 0 }, { width: 0 }, { alt: '' }]) assert.deepEqual(affiliateCreatives([{ ...original, ...patch }], p.placement, 9003, now + 60000, now), []);
  assert.equal(affiliateCreatives([original], p.placement, 9003, now + 60000, now)[0].tracking_url, original.tracking_url);
});
