import { readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';

// Validate the exact original names referenced by the media data before deployment.
const data = readFileSync('src/data/mzigoFactoryMedia.ts', 'utf8');
const septemberFiles = [...new Set([...data.matchAll(/sp-mzigo-26e-[a-z0-9-]+-2026-09-09\.(?:jpg|mp4)/g)].map(m => m[0]))];
assert.equal(septemberFiles.length, 15, 'Fourteen September photos and one walkaround are required');
const equipmentData = readFileSync('src/data/equipment.ts', 'utf8');
const augustFiles = [...new Set([...equipmentData.matchAll(/sp-mzigo-26e-[a-z0-9-]+-2026-08-31\.(?:jpg|mp4)/g)].map(m => m[0]))];
assert.equal(augustFiles.length, 4, 'Two August photos, the assembly video and its poster are required');
const files = [...augustFiles, ...septemberFiles];
for (const name of files) {
  const source = readFileSync(`images/${name}`);
  const built = readFileSync(`dist/images/${name}`);
  assert.ok(source.equals(built), `${name}: build must retain the original bytes`);
  if (name.endsWith('.mp4')) {
    assert.ok(built.length > 1000000, 'Walkaround must be binary media, not an LFS pointer');
    assert.equal(built.subarray(4, 8).toString(), 'ftyp');
  } else {
    assert.equal(built[0], 0xff); assert.equal(built[1], 0xd8);
  }
}
assert.ok(statSync('dist/sp-mzigo-26.html').size > 0);
console.log(`MZIGO media validation passed (${files.length} original factory files, including both videos).`);
