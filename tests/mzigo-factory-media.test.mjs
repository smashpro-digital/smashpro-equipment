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
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  }).outputText;
  new Function('require', 'module', 'exports', code)((name) => {
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

test('React output has five chapters, no placeholders, and one controlled inline video', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoBuildStory));
  assert.equal((html.match(/<article /g) || []).length, 5);
  assert.equal((html.match(/<video /g) || []).length, 1);
  assert.match(html, /controls=""/); assert.match(html, /playsinline=""/);
  assert.match(html, /preload="metadata"/); assert.ok(html.includes(`poster="${mzigoFactoryPhotos.complete.src}"`));
  assert.doesNotMatch(html, /autoplay|placeholder|server promotion/i);
  assert.match(html, /Your browser cannot play this video/);
  Object.values(mzigoFactoryPhotos).forEach(media => assert.ok(html.includes(media.src), media.src));
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
  assert.ok(html.includes(mzigoFactoryPhotos.complete.src));
  assert.match(html, /SmashPro<br\/>Electric Material<br\/>/);
  for (const anchor of ['passport', 'journey', 'history', 'service']) assert.ok(html.includes(`href="#${anchor}"`));
  assert.doesNotMatch(html, /Flagship|Asset #001|hero-artwork/);
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

test('page uses one native Factory Update and no Mzigo DOM replacement', () => {
  const page = readFileSync('src/pages/EquipmentDetailPage.tsx','utf8');
  assert.equal((page.match(/className="factory-update"/g) || []).length, 1);
  assert.equal((page.match(/<MzigoBuildStory \/>/g) || []).length, 1);
  assert.doesNotMatch(readFileSync('src/pages/MzigoPassportPage.tsx','utf8'), /innerHTML|querySelector|useEffect|createElement/);
});
