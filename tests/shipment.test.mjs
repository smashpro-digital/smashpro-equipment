import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { shipmentFixture } from './fixtures/shipment.mjs';
const code = ts.transpileModule(readFileSync('src/domain/shipment.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { parseShipment, loadShipment, cacheWire, readCache, CACHE_KEY, stageText, positionStale, safePublicUrl } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const storage = () => { const rows = new Map(); return { getItem: key => rows.get(key) ?? null, setItem: (k, v) => rows.set(k, v), removeItem: k => rows.delete(k) }; };
const response = d => async () => new Response(JSON.stringify(d), { status: 200 });
const pending = () => ({ factoryModel: 'YF380', vesselDisplayReference: 'EVER MAX', voyageDisplayReference: '1374-016E', vesselIdentityVerification: 'pending', voyageVerification: 'pending', cargoAssociation: 'unconfirmed', recordedAt: '2026-09-12T06:10:49.225Z', source: 'operator-supplied reference' });

test('pending references are selected separately, never cached or promoted into evidence', async () => {
  const d = shipmentFixture({ unverified: true }); d.pendingReferences = { ...pending(), notes: 'PRIVATE', auditActor: 'PRIVATE', rawPayload: 'PRIVATE' };
  const s = storage(), r = await loadShipment('/api/test', s, response(d));
  assert.deepEqual(r.data.pendingReferences, pending());
  assert.equal(r.data.vessel, null); assert.equal(r.data.voyage, null); assert.equal(r.data.currentPosition, null);
  assert.equal(r.data.stageVerification, 'unverified'); assert.deepEqual(r.data.timeline, []);
  assert.equal(JSON.stringify(r).includes('PRIVATE'), false); assert.equal(s.getItem(CACHE_KEY), null);
});

test('pending verification states fail closed and cannot follow a confirmed record', () => {
  for (const key of ['vesselIdentityVerification', 'voyageVerification', 'cargoAssociation']) {
    const d = shipmentFixture({ unverified: true }); d.pendingReferences = { ...pending(), [key]: 'confirmed' };
    assert.throws(() => parseShipment(d));
  }
  const d = shipmentFixture(); d.pendingReferences = pending(); assert.equal(parseShipment(d).pendingReferences, null);
});
test('no API or valid cache means explicit unavailable without static shipment truth', async () => {
  const r = await loadShipment('/api/test', storage(), async () => new Response('', { status: 503 }));
  assert.equal(stageText(r), 'Shipment update unavailable.'); assert.equal(r.data, null);
});
test('unverified HQ response does not confirm ocean voyage or invent a position', async () => {
  const r = await loadShipment('/api/test', storage(), response(shipmentFixture({ unverified: true })));
  assert.equal(stageText(r), 'Ocean departure awaiting confirmation'); assert.equal(r.data.currentPosition, null);
});
test('current data is projected before cache; private extension fields never survive', async () => {
  const s = storage(), d = shipmentFixture(); d.rawPayload = { secret: 'PRIVATE' }; d.notes = 'PRIVATE'; d.vessel.internal = 'PRIVATE'; d.timeline[0].proof = { reference: 'PRIVATE' };
  const r = await loadShipment('/api/test', s, response(d)); assert.equal(JSON.stringify(r).includes('PRIVATE'), false); assert.equal(s.getItem(CACHE_KEY).includes('PRIVATE'), false);
  assert.equal(readCache(s).stageVerification, 'confirmed');
});
test('unavailable API preserves only last verified public state', async () => {
  const s = storage(); await loadShipment('/api/test', s, response(shipmentFixture()));
  const r = await loadShipment('/api/test', s, async () => { throw Error('offline'); }); assert.equal(r.status, 'cached'); assert.equal(r.data.shipmentStatus, 'Departed Origin Port');
});
test('successful unverified update clears an older confirmed snapshot', async () => {
  const s = storage(); s.setItem(CACHE_KEY, JSON.stringify(cacheWire(parseShipment(shipmentFixture()))));
  await loadShipment('/api/test', s, response(shipmentFixture({ unverified: true }))); assert.equal(readCache(s), null);
});
test('invalid identity, schema, coordinates, states and corrupt cache fail closed', async () => {
  for (const overrides of [{ schemaVersion: 1 }, { assetId: 'OTHER' }, { positionState: 'simulated' }, { ports: null }, { map: { simulated: true } }]) assert.throws(() => parseShipment({ ...shipmentFixture(), ...overrides }));
  const s = storage(); s.setItem(CACHE_KEY, '{broken'); assert.equal(readCache(s), null);
  const r = await loadShipment('/api/test', s, response({})); assert.equal(r.status, 'unavailable');
});
test('precise private delivery coordinates are rejected', () => {
  const d = shipmentFixture(); d.map.inlandDestination = { region: 'Coarse only', precision: 'whole-degree', coordinates: { latitude: 35.123456, longitude: -78.123456 } }; assert.throws(() => parseShipment(d));
});
test('imagery failure does not block shipment state; no license or unlinked media are excluded', () => {
  for (const overrides of [{ license: '' }, { eventId: 'missing' }, { url: 'https://example.com/private/image' }, { role: 'basemap' }, { vesselIdentified: true }]) {
    const d = shipmentFixture({ satellite: true }); Object.assign(d.satelliteImagery[0], overrides); const p = parseShipment(d); assert.equal(p.satelliteImagery.length, 0); assert.equal(p.stageVerification, 'confirmed');
  }
});
test('regional imagery preserves separate capture and AIS times and identification status', () => {
  const p = parseShipment(shipmentFixture({ satellite: true })); assert.equal(p.satelliteImagery[0].vesselIdentified, false); assert.notEqual(p.satelliteImagery[0].captureTime, p.currentPosition.timestamp);
});
test('staleness is recomputed from AIS time even if cached flag says observed', () => {
  const p = parseShipment(shipmentFixture({ stale: true })); p.positionState = 'observed'; assert.equal(positionStale(p), true);
});
test('timeout aborts request and returns available fallback', async () => {
  let signal; const r = await loadShipment('/api/test', storage(), async (_, opts) => { signal = opts.signal; return new Promise(() => {}); }, 5); assert.equal(signal.aborted, true); assert.equal(r.status, 'unavailable');
});
test('blocked storage does not prevent fresh public shipment response', async () => {
  const denied = { getItem() { throw Error(); }, setItem() { throw Error(); }, removeItem() { throw Error(); } }; const r = await loadShipment('/api/test', denied, response(shipmentFixture())); assert.equal(r.status, 'current');
});
test('credentialed, signed and protected URLs are rejected', () => {
  for (const url of ['http://example.com', 'https://u:p@example.com/x', 'https://example.com/x?key=SECRET', 'https://example.com/%70rivate/x']) assert.throws(() => safePublicUrl(url));
});
