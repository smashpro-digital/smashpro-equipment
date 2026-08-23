import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("equipment estimate CTAs use the browser booking flow", () => {
  const projects = readFileSync("src/components/EquipmentProjects.tsx", "utf8");
  const helper = readFileSync("src/domain/estimateUrl.ts", "utf8");

  assert.match(helper, /return `\/book\/\?\$\{params\.toString\(\)\}`/);
  assert.match(helper, /params\.set\("equipment_source", fleetId\)/);
  assert.match(helper, /params\.set\("equipment_required", fleetId\)/);
  assert.match(helper, /if \(serviceSlug\) params\.set\("service", serviceSlug\)/);
  assert.match(projects, /const customerEstimateUrl = estimateUrl\(undefined, fleetId/);
  assert.match(projects, /href=\{estimateUrl\(service, fleetId/);
  assert.doesNotMatch(projects, /estimateUrl\(services\[0\]/);
  assert.doesNotMatch(`${projects}\n${helper}`, /smashpro-home:\/\/booking|selected_service|params\.set\("name"/);
});

test("capture harness validates browser booking links instead of the retired app scheme", () => {
  const capture = readFileSync("scripts/capture-ardhi-release.mjs", "utf8");
  assert.match(capture, /startsWith\('\/book\/'\)/);
  assert.match(capture, /noAppSchemeLinks/);
  assert.doesNotMatch(capture, /first=links\.find\(a=>a\.href\.startsWith\('smashpro-home:'\)\)/);
});
