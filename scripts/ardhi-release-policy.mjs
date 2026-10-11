import assert from 'node:assert/strict';

// Release contract for the reviewed October 9 arrival snapshot, not an HQ write.
// A future lifecycle change needs a reviewed policy update, not an inferred milestone.
export function verifyArdhiReleasePolicy(arrival, stages, shipment) {
  assert.equal(arrival.assetId, 'SP-ARDHI-26');
  assert.equal(arrival.status, 'Arrived at U.S. Port');
  assert.equal(arrival.currentStage, 'Awaiting Customs Clearance');
  assert.equal(arrival.oceanVoyage, 'Complete');
  assert.equal(arrival.confidence, 'Verified');
  assert.equal(arrival.source, 'Manufacturer confirmation');
  assert.equal(arrival.recordedAt, '2026-10-09');
  assert.equal(arrival.occurredAt, null, 'Do not invent an arrival timestamp');
  assert.deepEqual(stages.map(s => [s.id, s.state]), [
    ['planning', 'complete'], ['procurement', 'complete'], ['production', 'complete'],
    ['export', 'complete'], ['ocean', 'complete'], ['port', 'current'],
    ['customs', 'pending'], ['warehouse', 'pending'], ['delivery', 'pending'],
    ['commissioning', 'pending'], ['first-job', 'pending'],
  ], 'Only the reviewed manufacturer arrival may advance the public journey');

  // The HQ response remains historical. Preserve its identity, schema, provenance,
  // chronology and privacy guards without requiring the machine to remain aboard.
  assert.equal(shipment.schemaVersion, 2);
  assert.equal(shipment.assetId, arrival.assetId);
  assert.equal(shipment.stageVerification, 'confirmed');
  assert.equal(shipment.lifecycleState, 'ocean-transit');
  assert.equal(shipment.shipmentStatus, 'Departed Origin Port');
  assert.equal(shipment.etaState, 'estimated');
  assert.match(shipment.eta, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Number.isFinite(Date.parse(shipment.eta)), 'Historical ETA must be a date');
  assert.deepEqual(shipment.timeline.map(event => event.milestone), ['container-loaded', 'export-cleared', 'origin-departure']);
  assert.equal(typeof shipment.map.cargoAssociationConfirmed, 'boolean', 'Cargo association must be explicitly reported');
  assert.equal(shipment.map.positionRepresents, 'vessel-only');
  assert.equal(shipment.map.simulated, false);
  assert.equal(shipment.currentPosition, null, 'No current cargo/GPS position may be introduced by this release');
  assert.equal(shipment.progressPercent, null);
  assert.deepEqual(shipment.satelliteImagery, []);
  return { policy: 'ardhi-port-arrival-v1', currentStage: arrival.currentStage, historicalCargoAssociationConfirmed: shipment.map.cargoAssociationConfirmed };
}
