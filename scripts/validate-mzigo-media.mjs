import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

// Validate the exact original names referenced by the media data before deployment.
const data = readFileSync('src/data/mzigoFactoryMedia.ts', 'utf8');
const septemberFiles = [...new Set([...data.matchAll(/sp-mzigo-26e-[a-z0-9-]+-2026-09-(?:09|14|15)\.(?:jpg|mp4)/g)].map(m => m[0]))];
assert.equal(septemberFiles.length, 21, 'Twenty September photos and one walkaround are required');
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
for (const heldConcept of [
  'sp-mzigo-27e-2027-market-direction-concept.png',
  'sp-mzigo-26e-green-option-study.png',
  'sp-mzigo-26e-red-option-study.png',
]) assert.equal(existsSync(`dist/images/${heldConcept}`), false, `${heldConcept}: held concept must not enter the public build`);

const catalogHero = 'sp-mzigo-27e-catalog-hero-concept-2026-09-15.png';
const catalogHeroHash = '5da1d47f0ea1a51ab6ae25aa5d3ad5747549315186008f2fd8de390d7c272b7c';
assert.ok(readdirSync('images').includes(catalogHero), `${catalogHero}: source filename and capitalization must match`);
assert.ok(readdirSync('dist/images').includes(catalogHero), `${catalogHero}: built filename and capitalization must match`);
const conceptSource = readFileSync('project_sources/sp-mzigo-26e/concepts/sp-mzigo-27e-2027-market-direction-concept.png');
const catalogSource = readFileSync(`images/${catalogHero}`);
const catalogBuilt = readFileSync(`dist/images/${catalogHero}`);
assert.ok(conceptSource.equals(catalogSource), `${catalogHero}: catalog copy must preserve the approved concept bytes`);
assert.ok(catalogSource.equals(catalogBuilt), `${catalogHero}: production build must preserve the catalog bytes`);
assert.equal(createHash('sha256').update(catalogBuilt).digest('hex'), catalogHeroHash);
assert.equal(catalogBuilt.subarray(1, 4).toString(), 'PNG');
assert.ok(statSync('dist/catalog/sp-mzigo-27e/index.html').size > 0, 'SP-MZIGO-27E physical catalog route must be built');
const builtScripts = readdirSync('dist/assets').filter(name => name.endsWith('.js')).map(name => readFileSync(`dist/assets/${name}`, 'utf8')).join('\n');
assert.ok(builtScripts.includes('/equipment/images/') && builtScripts.includes(catalogHero), 'built JavaScript must retain the deployment-safe catalog hero URL parts');
for (const mzigo26File of ['src/data/equipment.ts', 'src/data/mzigoFactoryMedia.ts', 'src/components/MzigoPassport.tsx', 'src/components/MzigoMediaArchive.tsx']) {
  assert.equal(readFileSync(mzigo26File, 'utf8').includes(catalogHero), false, `${catalogHero}: must not enter SP-MZIGO-26E evidence`);
}
console.log(`MZIGO media validation passed (${files.length} original factory files, including both videos; catalog-only 27E concept verified).`);
