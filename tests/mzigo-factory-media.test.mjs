import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
const { MzigoOemPlatform } = load('src/components/MzigoOemPlatform.tsx');
const { approvedMzigoMedia, mzigoEvidenceCategories, mzigoFinalConfiguration, mzigoMarketSegments, mzigoOptionGroups, mzigoShippingEvidenceSlots } = load('src/data/mzigoPlatform.ts');

test('six build chapters preserve the original build and approved revisions', () => {
  assert.deepEqual(mzigoBuildChapters.map(c => c.title), ['Factory Identity', 'SmashPro Branding', 'Electric Drive Architecture', 'Hydraulic Dump System', 'Approved Revisions', 'Build-Approved Machine']);
  assert.equal(mzigoBuildChapters[3].image.src, mzigoFactoryPhotos.approvedRaised.src);
  assert.equal(mzigoBuildChapters[3].supporting[0].src, mzigoFactoryPhotos.raisedDriveOverview.src);
  assert.deepEqual(mzigoBuildChapters[4].supporting.map(m => m.src), ['blackWheelDrive','tieDown'].map(k => mzigoFactoryPhotos[k].src));
  assert.equal(mzigoBuildChapters[5].image.src, mzigoFactoryPhotos.approvedProfile.src);
});

test('all September photographs are real JPEGs and the MP4 is not an LFS pointer', () => {
  for (const media of [...Object.values(mzigoFactoryPhotos), mzigoFactoryWalkaround]) {
    assert.ok(media.src.startsWith('/equipment/images/sp-mzigo-26e-'));
    const bytes = readFileSync(media.src.replace('/equipment/', ''));
    assert.ok(bytes.length > 4000, media.src);
    if (media.kind === 'video') {
      assert.ok(bytes.length > 1000000);
      assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
    } else {
      assert.equal(bytes[0], 0xff); assert.equal(bytes[1], 0xd8);
      assert.ok(media.alt.length > 30 && !media.alt.includes('.jpg'));
    }
  }
});

test('six build records link to canonical archive media without duplicate players or full photographs', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoBuildStory));
  assert.equal((html.match(/<article /g) || []).length, 6);
  assert.equal((html.match(/<video /g) || []).length, 0);
  assert.equal((html.match(/<img /g) || []).length, 6, 'Only compact record thumbnails remain');
  assert.doesNotMatch(html, /autoplay|placeholder|server promotion/i);
  for (const chapter of mzigoBuildChapters) for (const media of [chapter.image, ...chapter.supporting, ...(chapter.video ? [chapter.video] : [])]) {
    const anchor = mzigoMediaAnchor(media);
    assert.ok(html.includes(`href="#${anchor}"`));
    assert.ok(mzigoArchiveTarget(mzigo.gallery, `#${anchor}`), anchor);
  }
});

test('archive has one canonical home for all 24 authentic records, including both videos', () => {
  const records = mzigoArchiveChapters.flatMap(chapter => mzigoArchiveSelection(mzigo.gallery, chapter.id));
  assert.equal(records.length, 24);
  assert.equal(new Set(records.map(media => media.src)).size, records.length);
  assert.equal(new Set(records.map(mzigoMediaAnchor)).size, records.length);
  assert.equal(records.filter(media => media.kind === 'video').length, 2);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'factory-build').length, 10);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine').length, 14);
  for (const media of [...Object.values(mzigoFactoryPhotos), mzigoFactoryWalkaround]) assert.equal(records.filter(record => record.src === media.src).length, 1);
  for (const media of records) {
    assert.ok(existsSync(media.src.replace('/equipment/', '')));
    assert.match(media.capturedAt, /^2026-(08-31|09-(?:09|14|15))$/);
    if (media.kind === 'video') assert.ok(existsSync(media.poster.replace('/equipment/', '')));
  }
  assert.ok(!records.some(media => /hero/.test(media.src)), 'Concept artwork is separate from factory evidence');
  for (const id of ['export-journey', 'delivery', 'operation', 'maintenance']) assert.equal(mzigoArchiveSelection(mzigo.gallery, id).length, 0);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine', '', 'qc').length, 1);
  assert.equal(mzigoArchiveSelection(mzigo.gallery, 'finished-machine', '', 'shipping').length, 0);
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
  assert.match(html, /Evidence category/); assert.match(html, /All categories/);
  assert.match(html, /Open original video/); assert.match(html, /Factory photograph viewer/);
  assert.match(html, /Concept artwork, separate from factory evidence/);
  assert.doesNotMatch(html, /No branding media|No hydraulics media|No completed machine media/);
});

test('current canonical state records build approval while payment and transport remain incomplete', () => {
  assert.equal(mzigo.identity.factoryModel, 'K600');
  assert.equal(mzigo.identity.operatingHours, 0);
  assert.equal(mzigo.statusLabel, 'Build approved · final payment pending');
  assert.equal(mzigo.factoryUpdate.date, '2026-09-15');
  assert.deepEqual(mzigo.factoryUpdate.timeline.map(s => s.status), [...Array(7).fill('completed'), 'current', ...Array(4).fill('upcoming')]);
  assert.deepEqual(mzigo.factoryUpdate.timeline.slice(7).map(s => s.label), ['Final Payment','Export Crating','Port Delivery','Vessel Booking','Ocean Departure']);
  assert.ok(mzigo.factoryUpdate.images.every(m => /2026-09-(14|15)/.test(m.src)));
});

test('Mzigo uses the build-approved factory photograph as its documentary hero', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoPassportHeader, { item: mzigo }));
  assert.ok(html.indexOf('id="identity"') < html.indexOf('class="status-panel"'));
  assert.ok(html.indexOf('class="ardhi-v2-hero mzigo-passport-hero"') < html.indexOf('id="identity"'));
  assert.equal((html.match(/class="passport-summary-item"/g) || []).length, 3);
  assert.doesNotMatch(html, /Passport Number|Fleet Class|Current Owner/);
  assert.match(html, /src="\/equipment\/images\/sp-mzigo-26e-build-approved-left-profile-2026-09-15\.jpg"/);
  assert.match(html, /alt="Build-approved SP-MZIGO-26E factory profile/);
  assert.match(html, /September 15 factory-completion evidence/);
  assert.equal(mzigo.heroImage, mzigoFactoryPhotos.approvedProfile.src);
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
  assert.equal((html.match(/<details /g) || []).length, 6);
  assert.equal((html.match(/<summary>/g) || []).length, 6);
  assert.doesNotMatch(html, /<details[^>]* open/);
  for (const chapter of mzigoBuildChapters) {
    assert.ok(html.includes(`id="mzigo-record-${chapter.number}"`));
    chapter.verified.forEach(fact => assert.ok(html.includes(fact)));
  }
  assert.equal((html.match(/Verified in the media/g) || []).length, 6);
  assert.equal((html.match(/Operational meaning/g) || []).length, 6);
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
  assert.match(html, /Final Configuration/);
  assert.match(html, /Black wheels and rims/);
  assert.match(html, /Black battery boxes/);
  assert.match(html, /Tie-down anchors/);
  assert.match(html, /Future engineering/);
  assert.match(html, /Manufacturer verification pending/);
  assert.match(html, /Loading public documents/);
  assert.doesNotMatch(html, /Maintenance Score|Estimated Fleet Value|Nothing disappears|No package|No YouTube|No SmashPro-installed upgrades/);
  assert.ok(html.indexOf('Deposit recorded') < html.indexOf('Chassis assembly documented'));
  assert.equal((html.match(/id="journey"/g) || []).length, 1);
});

test('September 14 and 15 evidence is copied byte-for-byte under descriptive names', () => {
  const expected = new Map([
    ['sp-mzigo-26e-raised-bed-engineering-overview-2026-09-14.jpg', 'a08978f6e04845d4e87ac64f9907809505df5d660c1400fef02526a081053cfd'],
    ['sp-mzigo-26e-tie-down-anchor-detail-2026-09-14.jpg', '231d13423a9afe4fe977c64c3e31c02524aa430f0f4d0cca4367b7b9bf8b2305'],
    ['sp-mzigo-26e-black-battery-boxes-hydraulic-power-unit-2026-09-14.jpg', '8aebcea915ae65f51fb6550b1771a12549c4ce391d87aec9c1218191a6d605b1'],
    ['sp-mzigo-26e-black-wheel-drive-motor-2026-09-14.jpg', '6e696b762abf600e2221f4c076f398e20a980a40dad2bff80b6bd201cbabc492'],
    ['sp-mzigo-26e-raised-bed-drive-system-overview-2026-09-14.jpg', '6012d753689d33b9983fa9327a35008095423c15378b5a1cce1164d930130dd6'],
    ['sp-mzigo-26e-build-approved-left-profile-2026-09-15.jpg', '0d519da580fba50704d0b7198b956c105f4514adebb0a939bcc466e45a076e6f'],
  ]);
  for (const [filename, hash] of expected) {
    const bytes = readFileSync(`images/${filename}`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.equal(bytes[0], 0xff); assert.equal(bytes[1], 0xd8);
  }
});

test('OEM platform keeps catalog identity separate and covers requested segments and options', () => {
  const catalog = load('src/data/catalog.ts').catalogProducts.find(product => product.id === 'SP-MTC-001');
  assert.equal(catalog.sourceFleetId, 'SP-MZIGO-26E');
  assert.equal(catalog.status, 'prototype');
  assert.equal(catalog.availability, 'not-for-sale');
  assert.deepEqual(catalog.marketSegments, ['standard','commercial','fleet','government','municipal','dealer','rental','prototype']);
  assert.deepEqual(mzigoMarketSegments, ['Standard','Commercial','Fleet','Government','Municipal','Dealer','Rental','Prototype']);
  assert.deepEqual(mzigoOptionGroups.map(group => group.title), ['Exterior','Recovery','Protection','Wheels and tires','Electrical','Fleet technology']);
  assert.ok(existsSync('docs/catalog/machines/SP-MTC-001/SP-MTC-001.md'));
});

test('platform presentation includes engineering, collaboration, media, systems and roadmap without inventing availability', () => {
  const html = renderToStaticMarkup(React.createElement(MzigoOemPlatform, { item: mzigo }));
  for (const id of ['engineering','build-acceptance','tie-down-system','remote-control','qc-build-approval','production-notes','oem-collaboration','product-platform','platform-options','media-pipeline','fleet-integration','shipping-evidence','product-roadmap','passport-record']) assert.ok(html.includes(`id="${id}"`), id);
  for (const text of ['Battery boxes','Dual drive motors','Hydraulic power unit','Tie-Down System','Remote Control','QC / Build Approval','SP-MTC-001','Shandong Kylin Heavy Industry Machinery Co., Ltd.','SP-MZIGO-27E']) assert.ok(html.includes(text), text);
  assert.match(html, /No rated recovery point is documented/);
  assert.match(html, /no build, specification or availability is claimed/i);
  assert.match(html, /recorded only as transport securement hardware/i);
  assert.match(html, /final payment is planned this week/i);
  assert.equal((html.match(/<details/g) || []).length, mzigoOptionGroups.length + mzigoShippingEvidenceSlots.length + 11);
});

test('final configuration distinguishes photographed facts from supplier-stated payload', () => {
  assert.equal(mzigoFinalConfiguration.length, 13);
  assert.deepEqual(mzigoFinalConfiguration.find(fact => fact.label === 'Payload'), {
    label: 'Payload', value: '1,100 lb stated payload', evidence: 'Supplier-stated; manufacturer engineering confirmation pending',
  });
  assert.match(mzigoFinalConfiguration.find(fact => fact.label === 'Securement hardware').evidence, /no recovery rating claimed/i);
});

test('media categories and explicit channel allowlists preserve empty shipping evidence', () => {
  assert.deepEqual(mzigoEvidenceCategories.map(category => category.label), ['Exterior','Interior','Hydraulics','Electrical','Controls','Branding','Factory Progress','QC','Shipping']);
  for (const category of mzigoEvidenceCategories.filter(category => category.id !== 'shipping')) assert.ok(mzigo.gallery.some(media => media.evidenceCategory === category.id), category.label);
  assert.equal(mzigo.gallery.some(media => media.evidenceCategory === 'shipping'), false);
  assert.equal(approvedMzigoMedia(mzigo.gallery, 'social-media').length, 4);
  assert.ok(approvedMzigoMedia(mzigo.gallery, 'qr-pages').some(media => media.id === 'sp-mzigo-26e-build-approved-left-profile-2026-09-15'));
  assert.ok(mzigo.gallery.filter(media => media.group && media.approvedChannels).every(media => media.approvedChannels.includes('passport') && media.approvedChannels.includes('equipment-gallery')));
  const concept = mzigo.gallery.find(media => media.id === 'sp-mzigo-26e-earlier-concept');
  assert.deepEqual(concept.approvedChannels, ['passport']);
});

test('new marketing concepts are preserved as held source files and excluded from public data', () => {
  const held = new Map([
    ['project_sources/sp-mzigo-26e/concepts/sp-mzigo-27e-2027-market-direction-concept.png', '5da1d47f0ea1a51ab6ae25aa5d3ad5747549315186008f2fd8de390d7c272b7c'],
    ['project_sources/sp-mzigo-26e/concepts/sp-mzigo-26e-green-option-study.png', 'bc59b780deac84604ede3c4f97384e8b6419a991107cd122db70c32698f0a1c7'],
    ['project_sources/sp-mzigo-26e/concepts/sp-mzigo-26e-red-option-study.png', 'dccbb76dc17bfc35a014d292f68956297113f837d09f51f8a5ce7596012185b3'],
  ]);
  const publicData = `${readFileSync('src/data/equipment.ts','utf8')}\n${readFileSync('src/data/mzigoPlatform.ts','utf8')}`;
  for (const [path, hash] of held) {
    const bytes = readFileSync(path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
    assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    assert.ok(!publicData.includes(path.split('/').pop()));
  }
  assert.match(readFileSync('project_sources/sp-mzigo-26e/concepts/README.md','utf8'), /production build does not copy this directory/i);
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
