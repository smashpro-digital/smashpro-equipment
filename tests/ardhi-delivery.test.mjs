import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ configFile: false, esbuild: { jsx: 'automatic' }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const [delivery, records, domain, flagship, watch] = await Promise.all([
  '/src/data/ardhiDelivery.ts', '/src/data/passportRecords.ts', '/src/domain/passportAutomation.ts', '/src/data/ardhiFlagship.ts', '/src/components/EquipmentWatch.tsx',
].map(path => server.ssrLoadModule(path)));
await server.close();
const passport = domain.projectPassportPublicRecord(records.canonicalPassports.find(p => p.asset.id === 'SP-ARDHI-26'));

test('verified delivery advances receipt only and preserves manufacturer and vessel history', () => {
  assert.equal(passport.asset.status_label, 'Delivered / Receiving inspection');
  assert.equal(passport.asset.current_lifecycle_stage, 'receiving_inspection');
  assert.equal(delivery.ardhiDelivery.date, '2026-10-26');
  assert.equal(delivery.ardhiDelivery.pro, 'IACO468333');
  assert.equal(new Set(passport.records.map(r => r.id)).size, passport.records.length);
  const opened = passport.records.find(r => r.id === 'ardhi-unboxing-20261026');
  assert.equal(opened.event_type, 'crate_opened');
  assert.equal(opened.stage_id, 'receiving_inspection');
  assert.equal(opened.evidence_ids.length, 3);
  const event = passport.records.find(r => r.id === 'ardhi-delivery-20261026');
  assert.equal(event.occurred_at, '2026-10-26');
  assert.equal(event.evidence_state, 'verified');
  assert.deepEqual(event.evidence_ids, ['ardhi-delivery-confirmation-20261026']);
  for (const id of ['ardhi-manufacturer-port-arrival', 'ardhi-ocean-departure-reported', 'ardhi-factory-build', 'ardhi-export-customs-released']) assert.ok(passport.records.some(r => r.id === id), id);
  assert.deepEqual(flagship.commissioningChecks.filter(c => flagship.verifiedEvidence(c.evidence).length).map(c => c.id), ['delivery', 'crate-opened']);
  for (const id of ['crate-inspection','accessories','fluids','first-start','first-drive','operator','field-test']) assert.equal(flagship.commissioningChecks.find(c => c.id === id).evidence.length, 0);
  assert.equal(flagship.firstJobPresentation(flagship.firstJob, flagship.commissioningChecks).mission, 'Awaiting Commissioning');
  assert.equal(domain.hasMilestoneEvidence(passport, 'commissioning'), false);
});

test('delivery photographs preserve evidence identity; future videos are never fabricated', () => {
  assert.equal(delivery.ardhiDeliveryPhotos.length, 2);
  for (const photo of [...delivery.ardhiDeliveryPhotos, ...delivery.ardhiUnboxingPhotos]) {
    assert.ok(['delivery', 'commissioning'].includes(photo.group));
    assert.ok(readFileSync(photo.src.replace('/equipment/', '')).length > 0);
    const projected = passport.records.find(r => r.id === photo.id);
    assert.equal(projected.factoryEvidence, false);
    assert.equal(projected.fieldEvidence, false);
  }
  assert.deepEqual(delivery.ardhiDeliveryVideos, []);
  assert.deepEqual(delivery.ardhiMediaSlots.map(s => s.id), ['unboxing', 'first-start']);
  const source = readFileSync('src/components/ArdhiDelivery.tsx', 'utf8');
  assert.match(source, /Photograph pending publication/);
  assert.doesNotMatch(JSON.stringify(delivery), /latitude|longitude|phone|street|postal|custodian|operator_id/i);
  assert.doesNotMatch(source, /navigator\.geolocation|<form|fetch\(/);
});

test('Shorts and full-length videos retain consent, asset and publication gates', () => {
  const video = { equipmentId: 'SP-ARDHI-26', videoId: 'abcdefghijk', title: 'Test fixture only', description: 'Fixture', category: 'Unboxing', lifecycleStage: 'receiving', publishedAt: '2026-10-26', verifiedAt: '2026-10-26', visibility: 'public' };
  const now = Date.parse('2026-10-26T12:00:00Z');
  const bad = [{ ...video, equipmentId: 'OTHER' }, { ...video, visibility: 'private' }, { ...video, verifiedAt: '2099-01-01' }, { ...video, videoId: 'bad' }, { ...video, publishedAt: '2099-01-01' }];
  assert.deepEqual(watch.publishedEquipmentVideos(bad, 'SP-ARDHI-26', now), []);
  for (const format of ['short', 'video']) {
    const html = renderToStaticMarkup(React.createElement(watch.EquipmentWatch, { videos: [{ ...video, format }], equipmentId: 'SP-ARDHI-26', channelUrl: 'https://www.youtube.com/@SmashProHQ', emptyMessage: 'Pending' }));
    assert.doesNotMatch(html, /<iframe/);
    assert.match(html, /<button/);
    assert.equal(html.includes('is-short'), format === 'short');
    assert.match(html, /Watch directly on YouTube/);
  }
});

test('public delivery JPEG metadata contains orientation only, not GPS or vendor payloads', () => {
  for (const photo of [...delivery.ardhiDeliveryPhotos, ...delivery.ardhiUnboxingPhotos]) {
    const data = readFileSync(photo.src.replace('/equipment/', ''));
    let offset = 2, exifCount = 0;
    while (data[offset + 1] !== 0xda) {
      const marker = data[offset + 1], length = data.readUInt16BE(offset + 2);
      const payload = data.subarray(offset + 4, offset + 2 + length);
      if (marker >= 0xe0 && marker <= 0xef) {
        if (marker === 0xe1) {
          exifCount++;
          assert.equal(payload.toString('ascii', 0, 6), 'Exif\0\0');
          assert.equal(length, 34); // Minimal TIFF with one orientation entry.
          assert.equal(payload.readUInt16BE(14), 1);
          assert.equal(payload.readUInt16BE(16), 274);
        } else {
          assert.equal(marker, 0xe2);
          assert.equal(payload.toString('ascii', 0, 12), 'ICC_PROFILE\0');
        }
      }
      offset += 2 + length;
    }
    assert.equal(exifCount, 1);
    assert.equal(data.indexOf(Buffer.from([0xff, 0xd9]), offset), data.length - 2);
  }
});
