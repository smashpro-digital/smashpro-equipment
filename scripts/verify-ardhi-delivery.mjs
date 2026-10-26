import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const policy = JSON.parse(readFileSync(new URL('./ardhi-delivery-evidence.json', import.meta.url), 'utf8'));
export function verifyDeliveryArtifact(read = path => readFileSync(`dist/${path}`)) {
  const index = JSON.parse(read('equipment-index.json').toString());
  const assets = index.equipment.filter(asset => asset.fleet_id === policy.assetId);
  assert.equal(assets.length, 1, 'Exactly one canonical ARDHI public record required');
  assert.equal(assets[0].status_label, policy.statusLabel);
  assert.ok(!('rental_available' in assets[0]) && !('operational' in assets[0]), 'Public discovery index must not introduce readiness claims');
  assert.equal(Object.keys(policy.photos).length, 5);
  for (const [path, hash] of Object.entries(policy.photos)) {
    assert.equal(createHash('sha256').update(read(path)).digest('hex'), hash, `Reviewed privacy-safe photo changed: ${path}`);
  }
  return { policy: policy.policy, photos: 5, rentalAvailabilityPublished: false };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log('Reviewed delivery artifact passed:', verifyDeliveryArtifact());
}
