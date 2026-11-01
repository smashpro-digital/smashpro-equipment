import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const update = JSON.parse(readFileSync('src/data/ardhiPostDelivery.json','utf8'));
test('post-delivery projection keeps reported evaluation separate from approved service',()=>{
  assert.equal(update.assetId,'SP-ARDHI-26');
  assert.match(update.readiness,/not a release for customer work/);
  assert.match(update.milestones.find(m=>m.key==='field').summary,/full pallet lift is not documented/);
  assert.match(update.nightOps[1].status,/not installed/);
  assert.match(update.nightOps[2].status,/not purchased or installed/);
  assert.match(update.nightOps[2].summary,/12V 30Ah LiFePO4/);
  assert.doesNotMatch(JSON.stringify(update),/Hailey|400–450|canonical_id|attachment_id|private_original_path|retaining screw|fuel-cap|tracking_number/);
});
test('private recovery records are not substituted for approved public media',()=>{
  assert.ok(update.milestones.every(m=>m.href.startsWith('#')));
  assert.match(update.mediaSummary,/awaits review/);
  assert.equal(update.evidence_manifest,undefined);
  assert.equal(update.records,undefined);
});
