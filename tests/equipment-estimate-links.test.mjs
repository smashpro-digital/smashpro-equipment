import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("equipment estimate CTAs use the browser booking flow", () => {
  const projects = readFileSync("src/components/EquipmentProjects.tsx", "utf8");

  assert.match(projects, /return `\/book\/\?\$\{params\.toString\(\)\}`/);
  assert.match(projects, /params\.set\("equipment_source", fleetId\)/);
  assert.match(projects, /params\.set\("equipment_required", fleetId\)/);
  assert.match(projects, /params\.set\("service", service\.slug\)/);
  assert.match(projects, /const customerEstimateUrl = estimateUrl\(null, fleetId\)/);
  assert.match(projects, /href=\{estimateUrl\(service, fleetId\)\}/);
  assert.doesNotMatch(projects, /estimateUrl\(services\[0\]/);
  assert.doesNotMatch(projects, /smashpro-home:\/\/booking/);
  assert.doesNotMatch(projects, /selected_service/);
  assert.doesNotMatch(projects, /params\.set\("name"/);
});
