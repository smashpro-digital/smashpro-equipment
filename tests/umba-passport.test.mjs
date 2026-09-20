import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
const { equipment } = await server.ssrLoadModule("/src/data/equipment.ts");
const { validatePassportIdentities } = await server.ssrLoadModule("/src/domain/passportIdentity.ts");
await server.close();
const item = equipment.find(row => row.fleetId === "SP-UMBA-26");

test("permanent allocations, operational identity and OEM are preserved", () => {
  validatePassportIdentities(equipment);
  assert.equal(equipment.find(row => row.fleetId === "SP-ARDHI-26").identity.passportId, "SPP-2026-0001");
  assert.equal(equipment.find(row => row.fleetId === "SP-MZIGO-26E").identity.passportId, "SPP-2026-0002");
  assert.equal(item.identity.passportId, "SPP-2026-0003");
  assert.equal(item.operationalAssetId, "SP-3DP-001");
  assert.equal(item.manufacturer, "FlashForge");
  assert.equal(item.identity.factoryModel, "AD5X");
  assert.equal(item.publicPath, "/sp-umba-26.html");
  assert.equal(item.status, "commissioning");
  for (const duplicate of [{ ...item, fleetId: "ANOTHER" }, { ...item, identity: { ...item.identity, passportId: "SPP-2026-9999" } }]) assert.throws(() => validatePassportIdentities([...equipment, duplicate]), /Duplicate/);
});

test("direct-load shell and router resolve the permanent public URL", () => {
  const html = readFileSync("sp-umba-26.html", "utf8");
  const url = "https://smashpro.app/equipment/sp-umba-26.html";
  assert.ok(html.includes(`<link rel="canonical" href="${url}"`));
  assert.ok(html.includes(`<meta property="og:url" content="${url}"`));
  assert.match(html, /<title>SP-UMBA-26 Equipment Passport/);
  assert.match(html, /name="viewport"/);
  assert.doesNotMatch(html, /build complete|pre-shipment|SP-MZIGO/);
  assert.match(readFileSync("vite.config.ts", "utf8"), /umba: resolve\(projectDirectory, "sp-umba-26.html"\)/);
  assert.match(readFileSync("src/app/App.tsx", "utf8"), /path="\/sp-umba-26.html".*slug="sp-umba-26"/);
  assert.match(readFileSync("src/pages/HomePage.tsx", "utf8"), /equipment.map/);
});

test("approved projection contains only public facts and does not advance validation", () => {
  const publicRecord = JSON.parse(readFileSync("src/data/umbaPassport.json", "utf8"));
  assert.deepEqual(Object.keys(publicRecord).sort(), ["asset_id", "fleet_id", "passport_id", "public_equipment_url", "manufacturer", "factory_model", "asset_class", "division", "model_year", "lifecycle_state", "configuration", "capabilities", "material_authorizations", "modifications"].sort());
  assert.deepEqual(Object.keys(publicRecord.configuration).sort(), ["multi_color", "filament_system", "enclosure_state"].sort());
  for (const row of publicRecord.material_authorizations) assert.deepEqual(Object.keys(row).sort(), ["material", "status"]);
  assert.equal(publicRecord.modifications.length, 1);
  assert.equal(publicRecord.modifications[0].id, "flashforge-ad5x-camera-kit");
  assert.equal(publicRecord.modifications[0].acquisition_status, "purchased");
  assert.equal(publicRecord.modifications[0].installation_status, "pending_verification");
  assert.equal(publicRecord.modifications[0].operational_status, "not_commissioned");
  assert.equal(publicRecord.modifications[0].qc_evidence, false);
  assert.equal(item.upgrades.find(row => row.id === "flashforge-ad5x-camera-kit").status, "ordered");
  assert.doesNotMatch(JSON.stringify(item), /camera_url|machine_credentials|exact_location|api_key|internal_cost|operator_private_data|network_details|serial_number/);
  assert.equal(publicRecord.configuration.enclosure_state, "not_verified");
  assert.equal(item.commissioning.materials.find(row => row.material === "PETG").status, "planned_validation");
  assert.equal(item.serviceHistory.length, 0);
  assert.equal(item.gallery.length, 0);
});
