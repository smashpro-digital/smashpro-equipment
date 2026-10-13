import assert from 'node:assert/strict';
import { ardhiPortArrival, ardhiJourneyStages } from '../src/data/ardhiPortArrival.ts';
import { verifyArdhiReleasePolicy } from './ardhi-release-policy.mjs';

// Real monitoring: outages and unsafe responses fail this independent check.
const response = await fetch('https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26', {
  headers: { Origin: 'https://smashpro.app' }, redirect: 'error', signal: AbortSignal.timeout(20000),
});
assert.equal(response.status, 200, 'Shipment service unavailable');
assert.equal(response.headers.get('access-control-allow-origin'), 'https://smashpro.app');
assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
console.log('Live shipment policy passed:', verifyArdhiReleasePolicy(ardhiPortArrival, ardhiJourneyStages, await response.json()));
