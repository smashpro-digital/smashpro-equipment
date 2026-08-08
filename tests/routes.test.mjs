import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const entries = ["index.html", "sp-ardhi-26.html", "sp-mzigo-26.html", "admin.html"];

test("protected HTML entry files exist", () => {
  entries.forEach((entry) => assert.equal(existsSync(entry), true, `${entry} must exist`));
});

test("passport architecture separates public and private records", () => {
  const publicData = readFileSync("src/data/equipment.ts", "utf8");
  const migration = readFileSync("docs/sql/equipment_passport_v1.sql", "utf8");
  assert.doesNotMatch(publicData, /purchase_price_actual|shipping_actual|tax_actual|customs_actual/);
  ["equipment_factory_options", "equipment_upgrades", "equipment_packages", "equipment_package_rules", "equipment_attachments", "equipment_media", "equipment_documents", "equipment_service_history", "equipment_value_history", "equipment_purchase_records", "equipment_receipts", "equipment_timelines"].forEach((table) => assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`)));
});

test("package membership is calculated from installed upgrade tags", () => {
  const engine = readFileSync("src/domain/passport.ts", "utf8");
  assert.match(engine, /upgrade\.status === "installed"/);
  assert.match(engine, /requiredTags\.every/);
  assert.doesNotMatch(readFileSync("src/data/equipment.ts", "utf8"), /currentPackages|assignedPackages/);
});

test("valuation inputs stay in a server-only module not imported by public pages", () => {
  const valuation = readFileSync("src/domain/valuation.ts", "utf8");
  const publicPage = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(valuation, /currentMarketValue/);
  assert.match(valuation, /maintenanceScore/);
  assert.match(valuation, /documentationScore/);
  assert.match(valuation, /operatingHours/);
  assert.match(valuation, /rentalRevenueGenerated/);
  assert.match(valuation, /netAssetRoi/);
  assert.doesNotMatch(publicPage, /domain\/valuation|PrivateValuationInputs/);
});

test("phase two birth certificate features are wired", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const sticker = readFileSync("src/components/WindowSticker.tsx", "utf8");
  const passport = readFileSync("src/domain/passport.ts", "utf8");
  assert.match(data, /SPP-2026-0001/);
  assert.match(data, /SPP-2026-0002/);
  assert.match(sticker, /QRCode\.toDataURL/);
  assert.match(sticker, /window\.print/);
  assert.match(passport, /generateBuildStory/);
  assert.match(passport, /calculateOwnershipMetrics/);
});

test("passport IDs and upgrade records are immutable in the schema", () => {
  const migration = readFileSync("docs/sql/equipment_passport_v1.sql", "utf8");
  assert.match(migration, /passport_id[^\n]+UNIQUE[^\n]+PERMANENT AND IMMUTABLE/);
  assert.match(migration, /equipment_assets_passport_id_immutable/);
  assert.match(migration, /equipment_assets_no_delete/);
  assert.match(migration, /equipment_upgrades_no_delete/);
  assert.match(migration, /equipment_milestones/);
  assert.match(migration, /equipment_revenue_events/);
});

test("Vite is configured for the equipment base path and physical entries", () => {
  const config = readFileSync("vite.config.ts", "utf8");
  assert.match(config, /base:\s*["']\/equipment\/["']/);
  entries.forEach((entry) => assert.match(config, new RegExp(entry.replace(".", "\\."))));
});

test("protected equipment routes are registered", () => {
  const routes = readFileSync("src/app/App.tsx", "utf8");
  assert.match(routes, /sp-ardhi-26\.html/);
  assert.match(routes, /sp-mzigo-26\.html/);
});

test("equipment data does not claim public availability", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  assert.doesNotMatch(data, /available now|rent now|book now/i);
  assert.match(data, /availability not announced/);
});

test("shared navigation provides an obvious route to the main SmashPro site", () => {
  const header = readFileSync("src/components/SiteHeader.tsx", "utf8");
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf8");
  assert.match(header, /SmashPro Home/);
  assert.match(header, /href="https:\/\/smashpro\.app\/"/);
  assert.match(footer, /href="https:\/\/smashpro\.app\/"/);
});

test("public index and recommendations are metadata driven", () => {
  const config = readFileSync("vite.config.ts", "utf8");
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  const recommendations = readFileSync("src/domain/recommendations.ts", "utf8");
  assert.match(config, /equipment-index\.json/);
  assert.match(config, /capability_ids/);
  assert.match(config, /attachment_ids/);
  assert.doesNotMatch(detail, /fleetId\s*===\s*["']SP-ARDHI-26/);
  assert.match(recommendations, /required\.some/);
  assert.match(recommendations, /localeCompare/);
});
