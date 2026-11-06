import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: 'custom' });
const { attachments } = await server.ssrLoadModule('/src/data/attachments.ts');
await server.close();
const grapple = attachments.find(a => a.passportId === 'SP-ATT-GRP-001');
test('one purchased grapple retains its route, official image and gated lifecycle', () => {
  assert.equal(attachments.filter(a => a.passportId === grapple.passportId).length, 1);
  assert.equal(new Set(attachments.map(a => a.passportId)).size, attachments.length);
  assert.equal(grapple.status, 'ordered');
  assert.equal(grapple.statusLabel, 'Paid in full · Awaiting shipment');
  assert.equal(grapple.publicPath, '/equipment/attachments/sp-att-grp-001/');
  assert.equal(grapple.image, '/equipment/images/sp-att-grp-001-loflin-42-inch-mini-root-grapple.webp');
  assert.equal(grapple.manufacturerPart, '0012006042');
  assert.deepEqual(grapple.intendedHostIds, ['SP-ARDHI-26']);
  assert.equal(grapple.verifiedFleetIds, undefined);
  assert.equal(grapple.commissionedAt, undefined);
});
test('payment and timeline stop at awaiting shipment', () => {
  const stages = grapple.procurementMilestones;
  assert.equal(stages.length, 10);
  assert.deepEqual(stages.filter(s => s.status === 'completed').map(s => s.id), ['configuration','order','deposit','fabrication','payment']);
  assert.deepEqual(stages.filter(s => s.status === 'current').map(s => s.id), ['shipment']);
  assert.deepEqual(stages.filter(s => s.status === 'upcoming').map(s => s.id), ['transit','delivery','fitment','commissioned']);
  assert.equal(stages.find(s => s.id === 'payment').date, '2026-11-05');
  assert.match(grapple.procurement.paymentStructure, /\$0 balance/);
  assert.doesNotMatch(JSON.stringify(grapple), /2026-11-07|Nov(?:ember)? 7|card number|billing address|gmail\.com/);
});
test('field evaluation remains empty and physical fitment is pending', () => {
  assert.equal(grapple.fieldTest.objectives.length, 8);
  assert.equal(grapple.fieldTest.commissioningCriteria.length, 7);
  assert.equal(grapple.fieldTest.mediaSlots.length, 11);
  assert.ok(grapple.fieldTest.mediaSlots.every(s => s.mediaIds.length === 0));
  assert.deepEqual(grapple.fieldTest.gallery, []);
  assert.deepEqual(grapple.fieldTest.videos, []);
  for (const key of ['plate-geometry','jaw-opening','steel-tines','couplers']) assert.equal(grapple.fitmentChecklist.find(c => c.key === key).status, 'pending');
});
