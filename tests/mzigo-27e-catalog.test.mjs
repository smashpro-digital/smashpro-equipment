import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';

const filename = 'sp-mzigo-27e-catalog-hero-concept-2026-09-15.png';
const url = `/equipment/images/${filename}`;
const expectedHash = '5da1d47f0ea1a51ab6ae25aa5d3ad5747549315186008f2fd8de390d7c272b7c';

test('SP-MZIGO-27E catalog hero preserves the approved concept source and exact filename', () => {
  assert.ok(readdirSync('images').includes(filename), 'source filename and capitalization must match exactly');
  const held = readFileSync('project_sources/sp-mzigo-26e/concepts/sp-mzigo-27e-2027-market-direction-concept.png');
  const publicCopy = readFileSync(`images/${filename}`);
  assert.ok(held.equals(publicCopy), 'catalog copy must be byte-identical to the approved concept source');
  assert.equal(createHash('sha256').update(publicCopy).digest('hex'), expectedHash);
  assert.equal(publicCopy.subarray(1, 4).toString(), 'PNG');
});

test('SP-MZIGO-27E uses a deployment-safe catalog-only hero reference', () => {
  const data = readFileSync('src/data/mzigo27eCatalog.ts', 'utf8');
  const helper = readFileSync('src/lib/equipmentAssets.ts', 'utf8');
  const page = readFileSync('src/pages/Mzigo27eCatalogPage.tsx', 'utf8');
  assert.match(helper, /`\/equipment\/images\/\$\{filename\}`/);
  assert.match(data, new RegExp(filename.replaceAll('.', '\\.')));
  assert.match(data, /classification: "future-catalog-concept"/);
  assert.match(data, /approvedChannel: "sp-mzigo-27e-catalog"/);
  assert.match(data, /alt: "SmashPro SP-MZIGO-27E Electric Material Carrier"/);
  assert.doesNotMatch(data, /src:\s*["'`]\.\.\//);
  assert.match(page, /src=\{mzigo27eCatalog\.hero\.src\}/);
  assert.match(page, /alt=\{mzigo27eCatalog\.hero\.alt\}/);
});

test('SP-MZIGO-27E has a physical Vite entry and route without entering 26E evidence', () => {
  const app = readFileSync('src/app/App.tsx', 'utf8');
  const vite = readFileSync('vite.config.ts', 'utf8');
  assert.ok(existsSync('catalog/sp-mzigo-27e/index.html'));
  assert.match(app, /path="\/catalog\/sp-mzigo-27e\/" component=\{Mzigo27eCatalogPage\}/);
  assert.match(vite, /mzigo27eCatalog: resolve\(projectDirectory, "catalog\/sp-mzigo-27e\/index\.html"\)/);
  for (const path of ['src/data/equipment.ts', 'src/data/mzigoFactoryMedia.ts', 'src/components/MzigoPassport.tsx', 'src/components/MzigoMediaArchive.tsx']) {
    assert.equal(readFileSync(path, 'utf8').includes(filename), false, `${path} must not reference the 27E catalog concept`);
  }
});
