import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");

test("NYASI has a dedicated public route and build entry", () => {
  assert.match(read("src/app/App.tsx"), /sp-nyasi-26\.html/);
  assert.match(read("vite.config.ts"), /nyasi: resolve\(projectDirectory, "sp-nyasi-26\.html"\)/);
  assert.match(read("sp-nyasi-26.html"), /SP-NYASI-26 Equipment Passport/);
});

test("NYASI public data preserves procurement truth and explicit exclusions", () => {
  const data = read("src/data/nyasiEquipment.ts");
  assert.match(data, /SPP-2026-0004/);
  assert.match(data, /Production is expected after the current Chinese holiday/);
  assert.match(data, /\$600 initial payment is recorded as paid/);
  assert.match(data, /\$1,565 remains due before shipment/);
  assert.match(data, /Top storage \/ cargo rack/);
  assert.match(data, /status: "removed"/);
  assert.doesNotMatch(data, /status: "shipping"/);
});

test("NYASI page distinguishes identity artwork from production evidence", () => {
  const page = read("src/components/NyasiPassport.tsx");
  const image = read("images/sp-nyasi-26-identity.svg");
  assert.match(page, /production photography is pending/i);
  assert.match(page, /No conceptual accessory is represented as purchased/);
  assert.match(image, /IDENTITY ARTWORK · PRODUCTION MEDIA PENDING/);
});
