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

test("equipment projects distinguish loading, unavailable, and settled empty states", () => {
  const projects = readFileSync("src/components/EquipmentProjects.tsx", "utf8");
  assert.match(projects, /const \[loaded, setLoaded\] = useState\(false\)/);
  assert.match(projects, /Project recommendations have not been published/);
  assert.match(projects, /Project services are temporarily unavailable/);
  assert.match(projects, /Loading current project services/);
});

test("Ardhi public factory document has a deployable URL and cannot render as an empty document state", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(data, /ardhi-factory-specification-20260816[\s\S]*url: "\/equipment\/documents\/sp-ardhi-26\/yf380-manufacturer-promo-spec-sheet\.pdf"/);
  assert.match(detail, /downloads\.length \? <div className="public-document-list">/);
});

test("both fleet equipment passport markdown files exist with matching identity sections", () => {
  ["docs/fleet/SP-ARDHI-26-PASSPORT.md", "docs/fleet/SP-MZIGO-26E-PASSPORT.md"].forEach((file) => assert.equal(existsSync(file), true, `${file} must exist`));
  const ardhiPassport = readFileSync("docs/fleet/SP-ARDHI-26-PASSPORT.md", "utf8");
  const mzigoPassport = readFileSync("docs/fleet/SP-MZIGO-26E-PASSPORT.md", "utf8");
  ["# Identity", "# Mission", "# Factory Model", "# Build Summary", "# Specifications", "# Included Attachments", "# Future Attachments", "# Lighting", "# Branding", "# Color Scheme", "# Security", "# Planned Fleet Pairing", "# Primary Services", "# Factory Documentation", "# Shipping", "# Equipment Timeline", "# Maintenance Log", "# Asset Status", "# Motto", "# Fleet Legacy"]
    .forEach((heading) => { assert.match(ardhiPassport, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))); assert.match(mzigoPassport, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))); });
  assert.match(mzigoPassport, /\*\*SP-MZIGO-26E\*\*/);
  assert.match(mzigoPassport, /pending manufacturer specification sheet/);
});

test("SP-MZIGO-26E is classified as electric with a correctly converted published payload", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  assert.match(data, /fleetId: "SP-MZIGO-26E"/);
  assert.match(data, /powertrain: "Electric 4WD"/);
  assert.match(data, /\["Payload", "500 kg \(1,102 lb\)", "Capacity"\]/);
});

test("public equipment fleet IDs and slugs are unique", () => {
  const module = readFileSync("src/data/equipment.ts", "utf8");
  const fleetIds = [...module.matchAll(/fleetId: "([^"]+)"/g)].map(([, id]) => id);
  const slugs = [...module.matchAll(/slug: "([^"]+)"/g)].map(([, slug]) => slug);
  assert.equal(new Set(fleetIds).size, fleetIds.length, "fleet IDs must be unique");
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");
});

const futureAcquisitionFiles = ["docs/fleet/SP-BEBA-HD-26-PASSPORT.md", "docs/fleet/SP-INAMA-26-PASSPORT.md", "docs/fleet/SP-NYASI-26-PASSPORT.md"];
const futureAcquisitionIds = ["SP-BEBA-HD-26", "SP-INAMA-26", "SP-NYASI-26"];
const sharedPassportHeadings = ["# Identity", "# Mission", "# Specification Verification", "# Factory Model", "# Configuration Summary", "# Specifications", "# Included Equipment", "# Planned Options", "# Lighting", "# Branding", "# Color Scheme", "# Safety Systems", "# Security", "# Planned Fleet Pairing", "# Primary Services", "# Factory Documentation", "# Coupler, Hitch & Transport Requirements", "# Hydraulic System", "# Shipping", "# Registration, Title & Serial Information", "# Acquisition Timeline", "# Supplier and Procurement Status", "# Inspection and Commissioning", "# Maintenance Log", "# Parts and Consumables", "# Warranty and Support", "# Asset Status", "# Motto", "# Fleet Legacy", "# Media and Gallery", "# Supporting Documents", "# Valuation and Ownership", "# Open Information Requests", "# Revision History"];

test("future acquisition passport files exist for BEBA-HD, INAMA, and NYASI", () => {
  futureAcquisitionFiles.forEach((file) => assert.equal(existsSync(file), true, `${file} must exist`));
});

test("future acquisition fleet IDs are not renamed and share the required passport structure", () => {
  futureAcquisitionFiles.forEach((file, index) => {
    const content = readFileSync(file, "utf8");
    assert.match(content, new RegExp(`\\*\\*${futureAcquisitionIds[index]}\\*\\*`));
    sharedPassportHeadings.forEach((heading) => assert.match(content, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${file} must contain heading ${heading}`));
  });
});

test("future acquisitions are represented as planned, not active, owned, or rentable", () => {
  futureAcquisitionFiles.forEach((file) => {
    const content = readFileSync(file, "utf8");
    assert.match(content, /Planned Future Acquisition/);
    assert.doesNotMatch(content, /available now|rent now|book now|status: active/i);
  });
});

test("future acquisitions are not published to the public catalog, sitemap, or equipment data", () => {
  const equipmentData = readFileSync("src/data/equipment.ts", "utf8");
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  futureAcquisitionIds.forEach((id) => {
    assert.doesNotMatch(equipmentData, new RegExp(id));
    assert.doesNotMatch(sitemap, new RegExp(id));
  });
});

test("fleet passport index links resolve to existing files", () => {
  const index = readFileSync("docs/fleet/README.md", "utf8");
  const links = [...index.matchAll(/\]\(([^)]+\.md)\)/g)].map(([, link]) => link);
  assert.ok(links.length >= 5, "index should link to all five passport files");
  links.forEach((link) => assert.equal(existsSync(`docs/fleet/${link}`), true, `${link} must resolve`));
});
