import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, existsSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import test from "node:test";
import ts from "typescript";
function load(relative) {
  const filename = resolve(relative), module = { exports: {} }, require = createRequire(filename);
  const code = ts.transpileModule(readFileSync(filename, 'utf8').replaceAll('import.meta.env', '({})'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
  }).outputText;
  new Function('require', 'module', 'exports', code)((name) => {
    if (name.endsWith('.css')) return {};
    if (name.startsWith('.')) for (const suffix of ['.ts', '.tsx']) {
      const candidate = resolve(dirname(filename), name) + suffix;
      if (existsSync(candidate)) return load(candidate);
    }
    return require(name);
  }, module, module.exports);
  return module.exports;
}
const { nyasiEquipment: item, nyasiLifecycle } = load("src/data/nyasiEquipment.ts");
const { nyasiFactoryMedia: media } = load("src/data/nyasiFactoryMedia.ts");
const { publicEquipmentIndexRow } = load("src/domain/publicEquipmentIndex.ts");

test("supplier completion advances only supported gates and the public index", () => {
  assert.equal(item.status, "fleet-build");
  assert.match(publicEquipmentIndexRow(item).status_label, /Factory Build Complete/);
  assert.match(item.statusDetail, /not shipped or commissioned/i);
  assert.match(item.statusDetail, /1,565/);
  assert.deepEqual(nyasiLifecycle.filter(s => s.status === "complete").map(s => s.id), ["configuration-approved", "order-created", "initial-payment", "production-pending", "production"]);
  for (const id of ["branding", "balance-paid", "packing", "shipped", "international-transit", "commissioning", "operational"]) assert.equal(nyasiLifecycle.find(s => s.id === id).status, "pending");
  assert.equal(item.timeline.find(e => e.id === "nyasi-factory-build-complete").occurredAt, "2026-10-14");
  assert.equal(item.timeline.find(e => e.id === "nyasi-current").occurredAt, undefined);
  assert.equal(item.timeline.find(e => e.id === "nyasi-factory-build-complete").photos.length, 3);
});

test("factory evidence is separate from promotional media, date is receipt not capture", () => {
  assert.equal(media.length, 4);
  assert.equal(item.gallery.length, 4);
  for (const entry of media) {
    assert.equal(entry.equipmentId, item.fleetId);
    assert.equal(entry.evidenceDate, "2026-10-14");
    assert.equal(entry.capturedAt, undefined);
    assert.equal(entry.classification, "Supplier Factory Evidence");
    assert.deepEqual(entry.approvedChannels, ["passport"]);
    for (const url of [entry.src, entry.originalSrc, entry.poster].filter(Boolean)) assert.ok(existsSync(url.replace("/equipment/", "")), url);
  }
  assert.match(item.cardMedia.src, /showroom-custom-v1.png$/);
  assert.equal(item.heroMedia.factoryEvidence, false);
  assert.match(item.heroImage, /showroom-hero-1672.webp$/);
});

test("imported originals match recorded hashes and playback is real H264 MP4", () => {
  const manifest = JSON.parse(readFileSync("docs/fleet/nyasi-factory-media-2026-10-14.json"));
  for (const original of manifest) assert.equal(createHash("sha256").update(readFileSync("images/" + original.original)).digest("hex"), original.sha256);
  const video = media.find(m => m.kind === "video");
  const bytes = readFileSync(video.src.replace("/equipment/", ""));
  assert.ok(bytes.includes(Buffer.from("avc1")));
  assert.ok(bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat")), "fast-start metadata");
  assert.ok(statSync(video.src.replace("/equipment/", "")).size < 15000000);
});
