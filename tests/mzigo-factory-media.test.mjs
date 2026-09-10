import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

function load(relative) {
  const filename = resolve(relative), module = { exports: {} }, require = createRequire(filename);
  const code = ts.transpileModule(readFileSync(filename, 'utf8').replaceAll('import.meta.env', '({})'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  }).outputText;
  new Function('require', 'module', 'exports', code)((name) => {
    if (name.endsWith('.css')) return {};
    if (name.startsWith('.')) for (const suffix of ['.ts', '.tsx']) {
      const candidate = resolve(dirname(filename), name) + suffix;
      if (existsSync(candidate)) return load(candidate);
    }
    return require(name);
  }, module, module.exports);
  return module.exports;
}
const { mzigoBuildChapters, mzigoFactoryPhotos, mzigoFactoryWalkaround } = load('src/data/mzigoFactoryMedia.ts');
const { MzigoBuildStory } = load('src/components/MzigoBuildStory.tsx');
const { MzigoPassportHeader } = load('src/components/MzigoPassportHeader.tsx');
const { equipment } = load('src/data/equipment.ts');
const mzigo = equipment.find(item => item.fleetId === 'SP-MZIGO-26E');
const { mzigoArchiveChapters, mzigoArchiveSelection, mzigoArchiveTarget, mzigoMediaAnchor } = load('src/domain/mzigoArchive.ts');
const { MzigoMediaArchive } = load('src/components/MzigoMediaArchive.tsx');

test('the five chapters map to the specified September 9 evidence', () => {
  assert.deepEqual(mzigoBuildChapters.map(c => c.title), ['Factory Identity', 'SmashPro Branding', 'Electric Drive Architecture', 'Hydraulic Dump System', 'Factory-Complete Machine']);
  assert.deepEqual(mzigoBuildChapters.map(c => c.image.src), ['identity','controls','drive','raised','complete'].map(k => mzigoFactoryPhotos[k].src));
  assert.deepEqual(mzigoBuildChapters[3].supporting.map(m => m.src), ['pump','cylinder'].map(k => mzigoFactoryPhotos[k].src));
  assert.equal(mzigoBuildChapters[4].video.src, mzigoFactoryWalkaround.src);
});

test('all September photographs are real JPEGs and the MP4 is not an LFS pointer', () => {
  for (const media of [...Object.values(mzigoFactoryPhotos), mzigoFactoryWalkaround]) {
    assert.ok(media.src.startsWith('/equipment/images/sp-mzigo-26e-'));
    const bytes = readFileSync(media.src.replace('/equipment/', ''));
    assert.ok(bytes.length > 10000, media.src);
    if (media.kind === 'video') {
      assert.ok(bytes.length > 1000000);
      assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
    } else {
      assert.equal(bytes[0], 0xff); assert.equal(bytes[1], 0xd8);
      assert.ok(media.alt.length > 30 && !media.alt.includes('.jpg'));
    }
  }
});

test('five build records link to canonical archive media without duplicate players or full photographs', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoBuildStory));
  assert.equal((html.match(/<article /g) || []).length, 5);
  assert.equal((html.match(/<video /g) || []).length, 0);
  assert.equal((html.match(/<img /g) || []).length, 5, 'Only compact record thumbnails remain');
  assert.doesNotMatch(html, /autoplay|placeholder|server promotion/i);
  for (const chapter of mzigoBuildChapters) for (const media of [chapter.image, ...chapter.supporting, ...(chapter.video ? [chapter.video] : [])]) {
    const anchor = mzigoMediaAnchor(media);
    assert.ok(html.includes(`href="#${anchor}"`));
    assert.ok(mzigoArchiveTarget(mzigo.gallery, `#${anchor}`), anchor);
  }
});

test('archive has one canonical home for all 18 authentic records, including both videos', () => {
  const records = mzigoArchiveChapters.flatMap(chapter => mzigoArchiveSelection(mzigo.gallery, chapter.id));
  assert.equal(records.length, 18);
  assert.equal(new Set(records.map(media => media.src)).size, records.length);
  assert.equal(new Set(records.map(mzigoMediaAnchor)).size, records.length);
  assert.equal(records.filter(media => media.kind === 'video').length, 2);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'factory-build').length, 10);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine').length, 8);
  for (const media of [...Object.values(mzigoFactoryPhotos), mzigoFactoryWalkaround]) assert.equal(records.filter(record => record.src === media.src).length, 1);
  for (const media of records) {
    assert.ok(existsSync(media.src.replace('/equipment/', '')));
    assert.match(media.capturedAt, /^2026-(08-31|09-09)$/);
    if (media.kind === 'video') assert.ok(existsSync(media.poster.replace('/equipment/', '')));
  }
  assert.ok(!records.some(media => /hero/.test(media.src)), 'Concept artwork is separate from factory evidence');
  for (const id of ['export-journey', 'delivery', 'operation', 'maintenance']) assert.equal(mzigoArchiveSelection(mzigo.gallery, id).length, 0);
});

test('archive searches by subject, media type and date without mixing chapters', () => {
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'factory-build', '  2026-08-31  ').length, 3);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine', 'REMOTE CONTROLLER').length, 1);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'factory-build', 'remote controller').length, 0);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'factory-build', 'video').length, 1);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine', 'video').length, 1);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine', 'no-such-record').length, 0);
});

test('media deep links select their own chapter and preserve legacy August anchors', () => {
  assert.deepEqual(mzigoArchiveTarget(mzigo.gallery, '#media-mzigo-chassis-side-20260831'), {chapterId:'factory-build',anchor:'media-mzigo-chassis-side-20260831'});
  assert.equal(mzigoArchiveTarget(mzigo.gallery, `#${mzigoMediaAnchor(mzigoFactoryWalkaround)}`).chapterId, 'finished-machine');
  assert.equal(mzigoArchiveTarget(mzigo.gallery, '#mzigo-archive-finished-machine').chapterId, 'finished-machine');
  assert.equal(mzigoArchiveTarget(mzigo.gallery, '#history'), undefined);
  assert.equal(mzigoArchiveTarget(mzigo.gallery, '#media-unknown'), undefined);
});

test('archive renders chapter controls, search, enlargement, inline video and separate design history', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoMediaArchive, {item:mzigo}));
  assert.match(html, /Follow the machine&#x27;s story/);
  assert.equal((html.match(/aria-pressed=/g) || []).length, 6);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((html.match(/<article /g) || []).length, 10);
  assert.equal((html.match(/<video /g) || []).length, 1);
  assert.match(html, /controls=""/); assert.match(html, /playsinline=""/); assert.match(html, /preload="metadata"/);
  assert.match(html, /Search Factory Build media/); assert.match(html, /aria-label="Enlarge /);
  assert.match(html, /Open original video/); assert.match(html, /Factory photograph viewer/);
  assert.match(html, /Concept artwork, separate from factory evidence/);
  assert.doesNotMatch(html, /No branding media|No hydraulics media|No completed machine media/);
});

test('current canonical state keeps inspection and transport uncompleted', () => {
  assert.equal(mzigo.identity.factoryModel, 'K600');
  assert.equal(mzigo.identity.operatingHours, 0);
  assert.equal(mzigo.statusLabel, 'Factory build complete · pre-shipment verification');
  assert.equal(mzigo.factoryUpdate.date, '2026-09-09');
  assert.deepEqual(mzigo.factoryUpdate.timeline.map(s => s.status), [...Array(8).fill('completed'), 'current', ...Array(3).fill('upcoming')]);
  assert.deepEqual(mzigo.factoryUpdate.timeline.slice(8).map(s => s.label), ['Pre-Shipment Verification','Final Inspection','Ocean Freight','U.S. Delivery']);
  assert.ok(mzigo.factoryUpdate.images.every(m => m.src.includes('2026-09-09')));
});

test('Mzigo shares the documentary hero and keeps four asset destinations and three summary fields', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoPassportHeader, { item: mzigo }));
  assert.ok(html.indexOf('id="identity"') < html.indexOf('class="status-panel"'));
  assert.ok(html.indexOf('class="ardhi-v2-hero mzigo-passport-hero"') < html.indexOf('id="identity"'));
  assert.equal((html.match(/class="passport-summary-item"/g) || []).length, 3);
  assert.doesNotMatch(html, /Passport Number|Fleet Class|Current Owner/);
  assert.match(html, /src="\/equipment\/images\/sp-mzigo-26e-hero-artwork-2026-09-09\.png"/);
  assert.match(html, /alt="SP-MZIGO-26E brand illustration/);
  assert.ok(!html.includes(mzigoFactoryPhotos.complete.src));
  assert.match(html, /SmashPro<br\/>Electric Material<br\/>/);
  for (const anchor of ['passport', 'journey', 'history', 'service']) assert.ok(html.includes(`href="#${anchor}"`));
  assert.doesNotMatch(html, /Asset #001/);
});

test('shared hero preserves the ARDHI wrapper structure', () => {
  const { PassportHero } = load('src/components/PassportHero.tsx');
  const html = renderToStaticMarkup(React.createElement(PassportHero, {titleId:'test-title',image:'/test.jpg',alt:'Machine'}, React.createElement('h1',{id:'test-title'},'Machine')));
  assert.match(html, /class="ardhi-v2-hero"/);
  assert.match(html, /class="ardhi-v2-hero__shade"/);
  assert.match(html, /class="shell ardhi-v2-hero__copy"/);
  const ardhi = readFileSync('src/components/ArdhiPassportJourney.tsx','utf8');
  assert.match(ardhi, /<PassportHero titleId="ardhi-v2-title"/);
});

test('service destination reflects canonical events and preserves pre-commissioning empty state', () => {
  const { MzigoServiceRecord } = load('src/components/MzigoServiceRecord.tsx');
  const html = renderToStaticMarkup(React.createElement(MzigoServiceRecord, {item:{...mzigo,serviceHistory:[]}}));
  assert.match(html, /id="service"/); assert.match(html, /Awaiting commissioning/);
  const record = {id:'test',performedAt:'2026-09-10',serviceType:'Inspection',summary:'Documented check',status:'completed',operatingHours:0};
  const populated = renderToStaticMarkup(React.createElement(MzigoServiceRecord, {item:{...mzigo,serviceHistory:[record]}}));
  assert.match(populated, /Documented check/); assert.match(populated, /Service hours: 0/);
  assert.doesNotMatch(populated, /No completed service events/);
});

test('build chapters are compact dated records with observations separate from meaning', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoBuildStory));
  assert.equal((html.match(/<details /g) || []).length, 5);
  assert.equal((html.match(/<summary>/g) || []).length, 5);
  assert.doesNotMatch(html, /<details[^>]* open/);
  for (const chapter of mzigoBuildChapters) {
    assert.ok(html.includes(`id="mzigo-record-${chapter.number}"`));
    chapter.verified.forEach(fact => assert.ok(html.includes(fact)));
  }
  assert.equal((html.match(/Verified in the media/g) || []).length, 5);
  assert.equal((html.match(/Operational meaning/g) || []).length, 5);
});

test('August evidence and existing equipment identities remain available', () => {
  assert.deepEqual(equipment.map(e => e.fleetId), ['SP-ARDHI-26','SP-MZIGO-26E']);
  const earlier = mzigo.gallery.filter(m => m.src.includes('2026-08-31'));
  assert.equal(earlier.length, 3);
  earlier.forEach(m => assert.ok(existsSync(m.src.replace('/equipment/', ''))));
  assert.ok(earlier.find(m => m.kind === 'video').poster.includes('2026-08-31'));
  assert.ok(mzigo.timeline.some(e => e.id === 'mzigo-factory-build'));
});

test('page uses shared lifecycle and retains one build story without DOM replacement', () => {
  const page = readFileSync('src/components/MzigoPassport.tsx','utf8');
  assert.equal((page.match(/<FleetLifecycleProgress /g) || []).length, 1);
  assert.equal((page.match(/<MzigoBuildStory \/>/g) || []).length, 1);
  assert.doesNotMatch(readFileSync('src/pages/MzigoPassportPage.tsx','utf8'), /innerHTML|querySelector|useEffect|createElement/);
});

test('lean passport preserves its destinations and separates requests from confirmed configuration', () => {
  const { MzigoPassport } = load('src/components/MzigoPassport.tsx');
  const html = renderToStaticMarkup(React.createElement(MzigoPassport, {item:mzigo}));
  for (const id of ['passport','identity','journey','history','service','projects','configuration','verification','specifications','documents','evidence','mzigo-build-story','mzigo-configuration-document']) assert.ok(html.includes(`id="${id}"`), id);
  assert.match(html, /Configured for SmashPro/);
  assert.match(html, /QR graphics remain visible in the September 9/);
  assert.match(html, /black box was requested/);
  assert.match(html, /Neither is recorded as installed/);
  assert.match(html, /Manufacturer verification pending/);
  assert.match(html, /Loading public documents/);
  assert.doesNotMatch(html, /Maintenance Score|Estimated Fleet Value|Nothing disappears|No package|No YouTube|No SmashPro-installed upgrades/);
  assert.ok(html.indexOf('Deposit recorded') < html.indexOf('Chassis assembly documented'));
  assert.equal((html.match(/id="journey"/g) || []).length, 1);
});

test('manufacturer-unverified ratings remain recorded but are not marked confirmed', () => {
  for (const label of ['Platform','Payload','Battery','Battery runtime','Maximum speed','Maximum climbing grade','Remote control range']) assert.equal(mzigo.specifications.find(spec => spec.label === label).confirmed, false, label);
  for (const label of ['Fleet ID','Manufacturer','Operation','Dump bed','Factory finish']) assert.equal(mzigo.specifications.find(spec => spec.label === label).confirmed, true, label);
  const deposit = mzigo.timeline.find(event => event.id === 'mzigo-deposit');
  assert.equal(deposit.occurredAt, undefined);
  assert.doesNotMatch(deposit.detail, /\$\d/);
});

test('generated MZIGO record qualifies ratings while the shared ARDHI sticker retains its standard', () => {
  const { WindowSticker } = load('src/components/WindowSticker.tsx');
  const render = (item, evidenceMode) => renderToStaticMarkup(React.createElement(WindowSticker, {item, evidenceMode, packages:[], scores:{documentation:0,maintenance:0}}));
  const html = render(mzigo, true);
  assert.match(html, /not an OEM certificate/);
  assert.match(html, /K600 - verification pending/);
  assert.doesNotMatch(html, /Maintenance Score|No package currently qualified|Estimated Fleet Value/);
  assert.match(render(equipment[0], false), /Factory Specifications/);
});
