import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ardhiPortArrival, ardhiJourneyStages, ardhiPortArrivalPhoto } from '../src/data/ardhiPortArrival.ts';
import { verifyArdhiReleasePolicy } from './ardhi-release-policy.mjs';

assert.equal(ardhiPortArrivalPhoto.src, '/equipment/images/sp-ardhi-26-savannah-port-arrival.png');
const photograph = readFileSync('dist/images/sp-ardhi-26-savannah-port-arrival.png');
assert.equal(createHash('sha256').update(photograph).digest('hex'), '559747c2542162a2dad2f39aa36e675d566014483aecf2e31bff631efcbc132b', 'The reviewed arrival photograph must be preserved in the release artifact');
// This hash verifies preservation; the photograph alone does not prove cargo identity.
const response = await fetch('https://api.smashpro.app/api/fleet/shipment/SP-ARDHI-26', {
  headers: { Origin: 'https://smashpro.app' }, redirect: 'error', signal: AbortSignal.timeout(20000),
});
assert.equal(response.status, 200);
assert.equal(response.headers.get('access-control-allow-origin'), 'https://smashpro.app');
assert.match(response.headers.get('content-type') ?? '', /^application\/json/);
const result = verifyArdhiReleasePolicy(ardhiPortArrival, ardhiJourneyStages, await response.json());
console.log('Evidence-separated ARDHI release prerequisite passed:', JSON.stringify(result));
