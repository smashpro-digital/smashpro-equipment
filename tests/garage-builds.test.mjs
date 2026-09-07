import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import test from "node:test";
const source = readFileSync("src/components/BuildConnections.tsx", "utf8");
test("Garage connections retain canonical project and product routes", () => {
  for (const route of ["/garage/builds/", "/rebirth/", "/golf-cart-tech-build.html", "/catalog/sp-pcm-001"]) assert.ok(source.includes(route));
  const frame = readFileSync("src/components/PageFrame.tsx", "utf8");
  assert.ok(frame.includes("<BuildConnections />{children}"));
});
test("Build status reads only the public projection with bounded failure behavior", () => {
  assert.ok(source.includes('fetch("/wp-json/smashpro/v1/garage-builds"'));
  assert.ok(source.includes('credentials: "omit"'));
  assert.ok(source.includes("controller.abort(), 4000"));
  assert.ok(source.includes("if (!canonicalPath) return null"));
  assert.ok(source.includes("Array.isArray(records)"));
  assert.ok(!source.includes("dangerouslySetInnerHTML"));
  assert.ok(!source.includes('method: "POST"'));
});
test("Private operational records and partner CRM are not mirrored", () => {
  for (const forbidden of ["asset_reference", "shipping_address", "crm_", "safety_hold"]) assert.ok(!source.includes(forbidden));
  assert.ok(source.includes("build?.canonical_path === canonicalPath"));
});
