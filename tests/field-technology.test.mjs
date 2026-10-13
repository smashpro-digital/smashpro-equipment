import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { approvedCatalog } from './fixtures/field-technology.mjs';
const code = ts.transpileModule(readFileSync('src/domain/fieldTechnology.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { fieldTechnologyCard } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
test('approved equipment projection preserves the supplied URL and disclosure', () => {
  const now = Date.now(), payload = approvedCatalog(now), card = fieldTechnologyCard(payload, now);
  assert.equal(card.url, payload.items[0].products[0].links[0].url);
  assert.match(card.disclosure, /commission/);
});
test('missing, malformed, stale, wrong-property and wrong-placement projections fail closed', () => {
  const now = Date.now();
  for (const value of [null, [], {}, { ok: false }, ...[
    p => { p.property = 'garage'; }, p => { p.ok = false; }, p => { p.schema_version = 2; },
    p => { p.placement = 'gear'; }, p => { p.generated_at = new Date(now - 60001).toISOString(); },
    p => { p.generated_at = new Date(now + 60000).toISOString(); }, p => { p.items = []; },
    p => { p.items.push(p.items[0]); }, p => { p.items[0].products[0].stage = 'Owned'; },
    p => { p.items[0].products[0].links = []; },
  ].map(mutate => { const p = approvedCatalog(now); mutate(p); return p; })]) assert.equal(fieldTechnologyCard(value, now), null);
});
test('link identity, expiry, disclosure and URL safety are mandatory', () => {
  const now = Date.now();
  for (const patch of [{ property: 'garage' }, { placement: 'gear-akaso' }, { advertiser_id: '1' }, { publisher_id: '1' }, { disclosure: '' }, { campaign_id: 0 }, { valid_until: 'bad' }, { valid_until: new Date(now - 1).toISOString() }, { valid_until: new Date(now + 120000).toISOString() }, { url: 'javascript:alert(1)' }, { url: 'https://www.awin1.com.evil.test/' }, { url: approvedCatalog(now).items[0].products[0].links[0].url + '&awinmid=69454' }]) {
    const p = approvedCatalog(now); Object.assign(p.items[0].products[0].links[0], patch); assert.equal(fieldTechnologyCard(p, now), null);
  }
});
