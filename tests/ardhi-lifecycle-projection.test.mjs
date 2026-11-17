import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const data = readFileSync(new URL('../src/data/fleetLifecycle.ts', import.meta.url), 'utf8');
const attachments = readFileSync(new URL('../src/data/attachments.ts', import.meta.url), 'utf8');
const postDelivery = JSON.parse(readFileSync(new URL('../src/data/ardhiPostDelivery.json', import.meta.url), 'utf8'));
const flagship = readFileSync(new URL('../src/data/ardhiFlagship.ts', import.meta.url), 'utf8');
const ui = readFileSync(new URL('../src/components/ArdhiProduction.tsx', import.meta.url), 'utf8');
const passportNav = readFileSync(new URL('../src/components/ArdhiPassportJourney.tsx', import.meta.url), 'utf8');
const compiledLifecycle = ts.transpileModule(data, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { publicLifecycleForAsset } = await import('data:text/javascript;base64,' + Buffer.from(compiledLifecycle).toString('base64'));
const compiledFlagship = ts.transpileModule(flagship, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { commissioningChecks, maintenanceBaselines } = await import('data:text/javascript;base64,' + Buffer.from(compiledFlagship).toString('base64'));
test('ARDHI maintenance renders lifecycle projection, not only legacy snapshots', () => {
  assert.match(ui, /mergePublicLifecycleEvents\('SP-ARDHI-26'/);
  assert.match(ui, /Active service items/);
  assert.match(ui, /Historical system baselines/);
  assert.match(ui, /Outstanding at snapshot/);
  assert.match(ui, /Reviewed Digital HQ database feed, supplemented by pending editorial records/);
});
test('track repair is recorded complete and throttle is verified', () => {
  assert.match(data, /id:'DEF-003'[\s\S]*?status:'repaired'[\s\S]*?serviceRelease:'pending'/);
  assert.match(data, /id:'DEF-001'[\s\S]*?status:'verified'/);
});
test('published Field Repair 003 is linked while independent verification remains pending', () => {
  const event = publicLifecycleForAsset('SP-ARDHI-26').find(item => item.id === 'DEF-003');
  assert.equal(event.article?.state, 'published');
  assert.equal(event.article?.url, 'https://smashpro.app/ardhi-thrown-track-field-repair-003/');
  assert.equal(event.status, 'repaired');
  assert.equal(event.serviceRelease, 'pending');
  assert.match(event.summary, /Owner reports the rubber track was reinstalled/);
  assert.ok(event.evidence.some(item => item.label.includes('WP media 968')));
  assert.ok(event.evidence.some(item => item.label.includes('YouTube nCxpwNWVlsw')));
});
test('published Field Repair 003 is promoted in the maintenance overview', () => {
  assert.match(ui, /trackArticle\?\.state === 'published'/);
  assert.match(ui, /className="ardhi-field-journal-callout"/);
  assert.match(ui, /Read Field Repair 003/);
  assert.match(passportNav, /trackArticle\?\.state === "published"/);
  assert.match(passportNav, /className="passport-rail__repair-link"/);
});
test('maintenance baselines reserve an accessible thumbnail slot for future photos', () => {
  assert.equal(maintenanceBaselines.length, 8);
  assert.ok(maintenanceBaselines.every(item => item.thumbnailHint && !item.thumbnail));
  assert.match(ui, /className="ardhi-baseline-thumbnail"/);
  assert.match(ui, /role="img" aria-label=\{`Photo placeholder: \$\{baseline\.thumbnailHint\}`\}/);
  assert.match(ui, /baseline\.thumbnail\s*\?/);
});
test('pin repair has an unrecorded occurrence date and a separate report date', () => {
  assert.match(data, /id:'DEF-002'[\s\S]*?occurredOn:null,reportedOn:'2026-11-08'/);
  assert.match(data, /repair date was not separately recorded/);
  assert.match(ui, /Occurrence date not recorded/);
  assert.match(ui, /reported \$\{event\.reportedOn\}/);
});
test('draft article links are excluded from public lifecycle projection', () => {
  assert.match(data, /e\.article\?\.state==='published'/);
  assert.match(data, /smashpro\\\.app/);
  assert.match(data, /id:e\.id,assetId:e\.assetId,type:e\.type,status:e\.status/);
  assert.doesNotMatch(data, /\.\.\.e,/);
});
test('commissioning copy shows restored throttle travel without implying completion', () => {
  const engine = commissioningChecks.find(check => check.id === 'engine');
  const approval = commissioningChecks.find(check => check.id === 'passport-complete');
  assert.match(engine.notes, /Throttle travel was restored November 8/);
  assert.match(engine.notes, /full lever travel was owner-verified/);
  assert.doesNotMatch(engine.notes, /throttle travel restriction is open/);
  assert.match(approval.notes, /Inspection passed and commissioning approved November 16, 2026 \(owner-reported\)/);
  assert.match(approval.notes, /thrown track is reinstalled with the repair reported complete/);
  assert.match(approval.notes, /not completion of every commissioning procedure/);
  assert.match(ui, /Latest: lifecycle and service items \(updated November 16\)/);
});
test('bucket installation is reconciled while fitment safety and field testing remain pending', () => {
  assert.match(attachments, /status: "installed"/);
  assert.match(attachments, /Owner-reported installed November 7, 2026/);
  assert.match(attachments, /fieldTestStatus: "Pending; no digging or wear results recorded"/);
  assert.match(postDelivery.upgradeSummary, /six-tooth bucket configuration is owner-reported installed/);
  assert.match(postDelivery.upgradeSummary, /field performance testing and independent attachment safety review remain pending/);
});
