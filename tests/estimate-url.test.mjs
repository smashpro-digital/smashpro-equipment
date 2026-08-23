import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const helper = readFileSync("src/domain/estimateUrl.ts", "utf8");
const projects = readFileSync("src/components/EquipmentProjects.tsx", "utf8");

test("estimate URL helper preserves the browser booking contract", () => {
  assert.match(helper, /return `\/book\/\?\$\{params\.toString\(\)\}`/);
  assert.match(helper, /params\.set\("equipment_source", fleetId\)/);
  assert.match(helper, /params\.set\("equipment_required", fleetId\)/);
  assert.match(helper, /if \(serviceSlug\) params\.set\("service", serviceSlug\)/);
  assert.doesNotMatch(helper, /smashpro-home:|selected_service/);
});

test("generic hero stays service-neutral while service cards carry their slug", () => {
  assert.match(projects, /estimateUrl\(undefined, fleetId, `equipment-\$\{fleetSlug\}-hero-estimate`\)/);
  assert.match(projects, /estimateUrl\(service, fleetId, `equipment-\$\{fleetSlug\}-\$\{service\.slug\}-estimate`\)/);
  assert.doesNotMatch(projects, /estimateUrl\(services\[0\]/);
});

test("attribution fallback does not override inbound utm_content", () => {
  assert.match(helper, /if \(key === "utm_content"\) hasUtmContent = true/);
  assert.match(helper, /if \(!hasUtmContent\) params\.set\("utm_content", utmContentFallback\)/);
});
