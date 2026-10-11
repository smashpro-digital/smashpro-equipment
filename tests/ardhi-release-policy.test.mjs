import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { verifyArdhiReleasePolicy } from '../scripts/ardhi-release-policy.mjs';
const code = ts.transpileModule(readFileSync('src/data/ardhiPortArrival.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { ardhiPortArrival, ardhiJourneyStages } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const fixture = () => ({
  schemaVersion: 2, assetId: 'SP-ARDHI-26', stageVerification: 'confirmed',
  lifecycleState: 'ocean-transit', shipmentStatus: 'Departed Origin Port',
  etaState: 'estimated', eta: '2026-10-05',
  timeline: ['container-loaded', 'export-cleared', 'origin-departure'].map(milestone => ({ milestone })),
  map: { cargoAssociationConfirmed: false, positionRepresents: 'vessel-only', simulated: false },
  currentPosition: null, progressPercent: null, satelliteImagery: [],
});
test('historical cargo association may be false without rewriting arrival or shipment evidence', () => {
  for (const association of [false, true]) {
    const shipment = fixture(); shipment.map.cargoAssociationConfirmed = association;
    const before = JSON.stringify(shipment);
    assert.equal(verifyArdhiReleasePolicy(ardhiPortArrival, ardhiJourneyStages, shipment).historicalCargoAssociationConfirmed, association);
    assert.equal(JSON.stringify(shipment), before);
  }
});
test('release fails closed on identity, schema, live position, simulated map or invented milestones', () => {
  for (const mutate of [
    s => { s.assetId = 'OTHER-ASSET'; }, s => { s.schemaVersion = 1; },
    s => { s.stageVerification = 'unverified'; }, s => { s.lifecycleState = 'delivered'; },
    s => { s.currentPosition = { latitude: 1, longitude: 1 }; }, s => { s.progressPercent = 100; },
    s => { s.satelliteImagery = [{}]; }, s => { s.map.simulated = true; },
    s => { s.map.positionRepresents = 'cargo'; }, s => { delete s.map.cargoAssociationConfirmed; },
    s => { s.map.cargoAssociationConfirmed = 'false'; }, s => { s.timeline.push({ milestone: 'delivery' }); },
    s => { s.etaState = 'confirmed'; },
  ]) { const shipment = fixture(); mutate(shipment); assert.throws(() => verifyArdhiReleasePolicy(ardhiPortArrival, ardhiJourneyStages, shipment)); }
});
test('historical vessel status cannot satisfy missing manufacturer confirmation or downstream readiness', () => {
  for (const patch of [{ confidence: 'Pending' }, { source: 'AIS' }, { occurredAt: '2026-10-09' }, { currentStage: 'Delivered' }]) {
    assert.throws(() => verifyArdhiReleasePolicy({ ...ardhiPortArrival, ...patch }, ardhiJourneyStages, fixture()));
  }
  for (const id of ['customs', 'warehouse', 'delivery', 'commissioning', 'first-job']) {
    const stages = ardhiJourneyStages.map(stage => ({ ...stage, state: stage.id === id ? 'complete' : stage.state }));
    assert.throws(() => verifyArdhiReleasePolicy(ardhiPortArrival, stages, fixture()));
  }
});
