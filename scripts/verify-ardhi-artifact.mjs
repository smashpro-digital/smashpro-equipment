import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { ardhiPortArrival, ardhiJourneyStages, ardhiPortArrivalPhoto } from '../src/data/ardhiPortArrival.ts';
import { verifyArdhiArrivalPolicy } from './ardhi-release-policy.mjs';

// Required for every frontend release. No external service or fabricated response.
assert.equal(ardhiPortArrivalPhoto.src, '/equipment/images/sp-ardhi-26-savannah-port-arrival.png');
const photograph = readFileSync('dist/images/sp-ardhi-26-savannah-port-arrival.png');
assert.equal(createHash('sha256').update(photograph).digest('hex'), '559747c2542162a2dad2f39aa36e675d566014483aecf2e31bff631efcbc132b', 'Preserve the reviewed arrival photograph');
console.log('Local ARDHI artifact and evidence checks passed:', verifyArdhiArrivalPolicy(ardhiPortArrival, ardhiJourneyStages));
