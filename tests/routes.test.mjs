import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const entries = ["index.html", "catalog/index.html", "sp-ardhi-26.html", "sp-mzigo-26.html", "admin.html"];

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

test("product catalog has a physical route, navigation, status model, and sitemap entry", () => {
  const routes = readFileSync("src/app/App.tsx", "utf8");
  const header = readFileSync("src/components/SiteHeader.tsx", "utf8");
  const footer = readFileSync("src/components/SiteFooter.tsx", "utf8");
  const catalogData = readFileSync("src/data/catalog.ts", "utf8");
  const catalogTypes = readFileSync("src/types/catalog.ts", "utf8");
  const catalogPage = readFileSync("src/pages/CatalogPage.tsx", "utf8");
  const sitemap = readFileSync("public/sitemap.xml", "utf8");
  assert.match(routes, /path="\/catalog"/);
  assert.match(routes, /path="\/catalog\/"/);
  assert.match(header, /Product Catalog/);
  assert.match(footer, /Product Catalog/);
  assert.match(sitemap, /\/equipment\/catalog\//);
  assert.match(catalogData, /id: "SP-PCM-001"/);
  assert.doesNotMatch(catalogData, /SP-ARDHI-26|SP-MZIGO-26E/);
  ["concept", "in-development", "prototype", "field-testing", "production-candidate", "available", "archived"].forEach((status) => assert.match(catalogTypes, new RegExp(`"${status}"`)));
  assert.match(catalogPage, /aria-pressed/);
  assert.match(catalogPage, /Product IDs are distinct from SmashPro Fleet asset IDs/);
  assert.match(readFileSync("vite.config.ts", "utf8"), /public\/equipment\/images\/sp-pcm-001-feature\.jpg/);
  assert.match(catalogData, /sp-pcm-001-feature\.jpg/);
  const catalogImage = readFileSync("public/equipment/images/sp-pcm-001-feature.jpg");
  assert.equal(catalogImage[0], 0xff, "deployed catalog image must begin with a JPEG signature");
  assert.equal(catalogImage[1], 0xd8, "deployed catalog image must begin with a JPEG signature");
});

test("catalog product specifications and design packages are revision controlled", () => {
  const catalogTypes = readFileSync("src/types/catalog.ts", "utf8");
  const catalogData = readFileSync("src/data/catalog.ts", "utf8");
  const pcmRecord = readFileSync("docs/catalog/electrical/SP-PCM-001/SP-PCM-001.md", "utf8");
  const designManifest = readFileSync("docs/catalog/electrical/SP-PCM-001/drawings/nameplates/rev-a/README.md", "utf8");
  const publicBase = "public/documents/catalog/sp-pcm-001/rev-a/nameplates";
  assert.match(catalogTypes, /interface CatalogSpecification/);
  assert.match(catalogTypes, /interface CatalogDesignPackage/);
  assert.match(catalogTypes, /interface CatalogCustomizationOption/);
  assert.match(catalogData, /verification: "tbd"/);
  assert.match(catalogData, /status: "design-review"/);
  assert.match(catalogData, /build-specific personalization component, not the canonical SP-PCM-001 product data plate/);
  assert.doesNotMatch(catalogData, /\.ai"/);
  assert.match(pcmRecord, /custom battery box plate for the 2018 F-150 Project Rebirth build/);
  assert.match(catalogData, /Custom Battery Box Nameplate/);
  assert.match(catalogData, /availability: "planned"/);
  assert.match(catalogData, /required product identity, electrical, safety, and regulatory markings remain controlled/);
  assert.match(designManifest, /Production data plate: Not released/);
  ["pdf", "png", "svg"].forEach((extension) => assert.equal(existsSync(`${publicBase}/sp-pcm-001-2018-f150-custom-battery-box-plate-rev-a.${extension}`), true));
  assert.equal(existsSync("docs/catalog/electrical/SP-PCM-001/drawings/nameplates/rev-a/source/sp-pcm-001-2018-f150-custom-battery-box-plate-rev-a.ai"), true);
  const preview = readFileSync(`${publicBase}/sp-pcm-001-2018-f150-custom-battery-box-plate-rev-a.png`);
  assert.deepEqual([...preview.subarray(0, 8)], [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
});

test("golf cart dream project uses one canonical concept image and route", () => {
  const home = readFileSync("src/pages/HomePage.tsx", "utf8");
  const dreamPage = readFileSync("src/pages/GolfCartTechBuildPage.tsx", "utf8");
  const dreamPageStyles = readFileSync("src/styles/dream-build-fixes.css", "utf8");
  const conceptPath = "public/equipment/images/sp-gari-26e-concept.png";
  const publicPath = "/equipment/images/sp-gari-26e-concept.png";
  assert.equal(existsSync(conceptPath), true, `${conceptPath} must exist`);
  assert.equal(home.includes(`src="${publicPath}"`), true);
  assert.equal(dreamPage.includes(`src="${publicPath}"`), true);
  assert.match(home, /href="\/equipment\/golf-cart-tech-build\.html"/);
  assert.match(dreamPageStyles, /\.gc-concept img \{[^}]*object-fit:contain/);
  assert.doesNotMatch(`${home}\n${dreamPage}\n${dreamPageStyles}`, /sp-golf-cart-tech-build-concept|golf-cart-dream-project-concept/);
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
  assert.match(data, /fleetId: "SP-MZIGO-26E", name: "SP-MZIGO-26E"/);
  assert.match(data, /model: "SP-MZIGO-26E", factoryModel: "K600"/);
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(detail, /<h1>\{item\.fleetId\}<\/h1>/);
  assert.match(detail, /Factory Model: \{item\.identity\.factoryModel/);
  assert.match(detail, /<span>Fleet Name<\/span><strong>\{item\.fleetId\}<\/strong>/);
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
const sharedPassportSections = [
  ["Identity", /^# Identity$/m],
  ["Mission", /^# Mission$/m],
  ["Specification Verification", /^# Specification Verification$/m],
  ["Factory Model", /^# Factory Model$/m],
  ["Configuration Summary", /^# Configuration Summary$/m],
  ["Specifications", /^# Specifications$/m],
  ["Included Equipment", /^# Included Equipment$/m],
  ["planned options or explicit exclusions", /^# (?:Planned Options|Explicit Exclusions)$/m],
  ["Lighting", /^# Lighting$/m],
  ["Branding", /^# Branding$/m],
  ["Color Scheme", /^# Color Scheme$/m],
  ["Safety Systems", /^# Safety Systems$/m],
  ["Security", /^# Security$/m],
  ["Planned Fleet Pairing", /^# Planned Fleet Pairing$/m],
  ["Primary Services", /^# Primary Services(?: and Intended Roles)?$/m],
  ["Factory Documentation", /^# Factory Documentation$/m],
  ["Coupler and transport requirements", /^#{1,2} Coupler, Hitch(?:, and Electrical| & Transport Requirements)$/m],
  ["Hydraulic System", /^#{1,2} Hydraulic (?:Loading )?System$/m],
  ["Shipping", /^# Shipping$/m],
  ["Registration and serial information", /^# Registration, Title(?:, Compliance)?(?:, and| &)? Serial Information$/m],
  ["Acquisition Timeline", /^# (?:Acquisition|Equipment) Timeline$/m],
  ["Supplier and Procurement Status", /^# (?:Supplier and Procurement Status|Procurement Snapshot)$/m],
  ["Inspection and Commissioning", /^# Inspection and Commissioning$/m],
  ["Maintenance Log", /^# Maintenance Log$/m],
  ["Parts and Consumables", /^# Parts and Consumables$/m],
  ["Warranty and Support", /^# Warranty and Support$/m],
  ["Asset Status", /^# Asset Status$/m],
  ["Motto", /^# Motto$/m],
  ["Fleet Legacy", /^# Fleet Legacy$/m],
  ["Media and Gallery", /^# Media and Gallery$/m],
  ["Supporting Documents", /^# Supporting Documents$/m],
  ["Valuation and Ownership", /^# Valuation and Ownership$/m],
  ["Open Information Requests", /^# Open Information Requests$/m],
  ["Revision History", /^# Revision History$/m],
];

test("future acquisition passport files exist for BEBA-HD, INAMA, and NYASI", () => {
  futureAcquisitionFiles.forEach((file) => assert.equal(existsSync(file), true, `${file} must exist`));
});

test("future acquisition fleet IDs are not renamed and share the required passport structure", () => {
  futureAcquisitionFiles.forEach((file, index) => {
    const content = readFileSync(file, "utf8");
    assert.match(content, new RegExp(`\\*\\*${futureAcquisitionIds[index]}\\*\\*`));
    sharedPassportSections.forEach(([section, pattern]) => assert.match(content, pattern, `${file} must contain the ${section} section`));
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

test("SP-GARI-26E is a canonical reserved future acquisition and not public fleet inventory", () => {
  const passport = readFileSync("docs/fleet/SP-GARI-26E-PASSPORT.md", "utf8");
  const procurement = readFileSync("docs/fleet/SP-GARI-26E-PROCUREMENT.md", "utf8");
  const legacyPointer = readFileSync("docs/fleet/SMASHPRO-GOLF-CART-TECH-BUILD-PASSPORT.md", "utf8");
  const equipmentData = readFileSync("src/data/equipment.ts", "utf8");
  const sitemap = readFileSync("public/sitemap.xml", "utf8");

  assert.match(passport, /\*\*SP-GARI-26E\*\*/);
  assert.match(passport, /Status: Planned Future Acquisition/);
  assert.match(passport, /DONOR SPECIFICATION/);
  assert.match(passport, /SMASHPRO BUILD SPECIFICATION/);
  assert.match(passport, /Not listed, rentable, bookable, or in service/);
  assert.match(procurement, /No donor has been selected/);
  assert.match(procurement, /Buy \/ Negotiate \/ Pass/);
  assert.match(legacyPointer, /canonical records/);
  assert.doesNotMatch(equipmentData, /SP-GARI-26E/);
  assert.doesNotMatch(sitemap, /SP-GARI-26E/);
});

test("fleet passport index links resolve to existing files", () => {
  const index = readFileSync("docs/fleet/README.md", "utf8");
  const links = [...index.matchAll(/\]\(([^)]+\.md)\)/g)].map(([, link]) => link);
  assert.ok(links.length >= 5, "index should link to all five passport files");
  links.forEach((link) => assert.equal(existsSync(`docs/fleet/${link}`), true, `${link} must resolve`));
});

test("SP-ARDHI-26 export logistics tracker is canonical and media-ready", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(data, /status: "shipping", statusLabel: "Container Loaded"/);
  assert.match(data, /shippingStatus: \{ status: "Container Loaded", vessel: "EVER MAX", voyage: "1374-016E"/);
  assert.match(data, /occurredAt: "2026-08-21"[\s\S]*title: "Shipping Phase Started"/);
  assert.match(data, /title: "Final Payment Completed"[\s\S]*photos: \[\], videos: \[\]/);
  assert.match(data, /title: "Delivered to Freight Forwarder"[\s\S]*photos: \[\], videos: \[\]/);
  assert.match(data, /title: "Export Crate Documented"[\s\S]*photos: \[\], videos: \[image\("sp-ardhi-26-export-crate-documentation-2026-09-02\.mp4"\)\]/);
  assert.match(data, /title: "Export Container Loaded"[\s\S]*Tracking Reference: YFC260717B==BZHYF0822BMT1[\s\S]*photos: \[\], videos: \[\]/);
  assert.match(detail, /Shipping Journey/);
  assert.match(detail, /Tracking Visuals/);
  assert.match(detail, /logistics-visual-card/);
  assert.match(detail, /Where is \{item\.fleetId\}\?/);
  assert.match(detail, /journey-milestones-heading/);
  assert.match(detail, /gallerySections\.map/);
  for (const suffix of ["01", "02", "03"]) {
    const filename = `sp-ardhi-26-shipping-2026-08-21-${suffix}.png`;
    assert.match(data, new RegExp(filename.replaceAll(".", "\\.")));
    assert.equal(existsSync(`images/${filename}`), true, `${filename} must exist`);
  }
  for (const filename of [
    "sp-ardhi-26-logistics-infront-factory-facility.png",
    "sp-ardhi-26-logistics-ever-max-vessel.png",
    "sp-ardhi-26-logistics-route-geography.png",
  ]) {
    assert.match(data, new RegExp(filename.replaceAll(".", "\\.")));
    assert.equal(existsSync(`images/${filename}`), true, `${filename} must exist`);
  }
  assert.doesNotMatch(`${data}\n${detail}`, /factory address|warehouse location|container yard|home address/i);
});

test("SP-ARDHI-26 export crate video uses a semantic name and advances the verified story", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const filename = "sp-ardhi-26-export-crate-documentation-2026-09-02.mp4";
  assert.match(data, new RegExp(filename.replaceAll(".", "\\.")));
  assert.match(data, /title: "Export Crate Documented"[\s\S]*videos: \[image\("sp-ardhi-26-export-crate-documentation-2026-09-02\.mp4"\)\]/);
  assert.match(data, /group: "export"/);
  assert.equal(existsSync(`images/${filename}`), true, `${filename} must exist`);
  assert.equal(existsSync("images/4280678537767.PNM.mp4"), false, "raw phone filename must not remain in source media");
});

test("SP-PCM-001 prototype story images are deployable originals", () => {
  const page = readFileSync("src/pages/PowerControlModulePage.tsx", "utf8");
  const filenames = [
    "sp-pcm-001-engine-bay-prototype.jpg",
    "sp-pcm-001-cardboard-enclosure-fitment.jpg",
    "sp-pcm-001-terminal-clearance-prototype.jpg",
    "sp-pcm-001-ml-rbs-fitment.jpg",
    "sp-pcm-001-remote-switch-control.jpg",
  ];
  filenames.forEach((filename) => {
    assert.match(page, new RegExp(filename.replaceAll(".", "\\.")));
    const bytes = readFileSync(`public/equipment/images/sp-pcm-001/${filename}`);
    assert.equal(bytes[0], 0xff, `${filename} must begin with a JPEG signature`);
    assert.equal(bytes[1], 0xd8, `${filename} must begin with a JPEG signature`);
  });
});

test("SP-MZIGO-26E factory update keeps passport identity, dated media, and manufacturing status in sync", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(data, /\["Platform", "K600", "Identity"/);
  assert.match(data, /\["Fleet ID", "SP-MZIGO-26E", "Identity"/);
  assert.match(data, /\["Manufacturer", "Shandong Kylin Heavy Industry Machinery Co\., Ltd\.", "Identity"/);
  assert.match(data, /heading: "Latest Factory Production Update"/);
  assert.match(data, /label: "Chassis Assembly", status: "completed"/);
  assert.match(data, /label: "Body Assembly", status: "current"/);
  assert.match(data, /label: "U\.S\. Delivery", status: "upcoming"/);
  assert.match(detail, /className="factory-update"/);
  assert.match(detail, /loading="lazy" decoding="async"/);
  assert.match(detail, /<video controls preload="metadata"/);
  assert.match(detail, /poster=\{item\.factoryUpdate\.video\.poster\}/);
  for (const filename of [
    "sp-mzigo-26e-production-chassis-drivetrain-assembly-2026-08-31.jpg",
    "sp-mzigo-26e-production-battery-electrical-assembly-top-view-2026-08-31.jpg",
    "sp-mzigo-26e-production-chassis-assembly-video-poster-2s-2026-08-31.jpg",
    "sp-mzigo-26e-production-chassis-assembly-video-2026-08-31.mp4",
  ]) {
    assert.match(data, new RegExp(filename.replaceAll(".", "\\.")));
    assert.equal(existsSync(`images/${filename}`), true, `${filename} must exist`);
  }
});

test("SP-MZIGO-26E factory update keeps passport identity, dated media, and manufacturing status in sync", () => {
  const data = readFileSync("src/data/equipment.ts", "utf8");
  const detail = readFileSync("src/pages/EquipmentDetailPage.tsx", "utf8");
  assert.match(data, /\["Platform", "K600", "Identity"/);
  assert.match(data, /\["Fleet ID", "SP-MZIGO-26E", "Identity"/);
  assert.match(data, /\["Manufacturer", "Shandong Kylin Heavy Industry Machinery Co\., Ltd\.", "Identity"/);
  assert.match(data, /heading: "Latest Factory Production Update"/);
  assert.match(data, /label: "Chassis Assembly", status: "completed"/);
  assert.match(data, /label: "Body Assembly", status: "current"/);
  assert.match(data, /label: "U\.S\. Delivery", status: "upcoming"/);
  assert.match(detail, /className="factory-update"/);
  assert.match(detail, /loading="lazy" decoding="async"/);
  assert.match(detail, /<video controls preload="metadata"/);
  for (const filename of [
    "sp-mzigo-26e-production-chassis-drivetrain-assembly-2026-08-31.jpg",
    "sp-mzigo-26e-production-battery-electrical-assembly-top-view-2026-08-31.jpg",
    "sp-mzigo-26e-production-chassis-assembly-video-2026-08-31.mp4",
  ]) {
    assert.match(data, new RegExp(filename.replaceAll(".", "\\.")));
    assert.equal(existsSync(`images/${filename}`), true, `${filename} must exist`);
  }
});

test("equipment media uses standardized fleet-prefixed filenames", () => {
  const mediaFiles = readdirSync("images", { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `${entry.parentPath.replaceAll("\\", "/")}/${entry.name}`.replace(/^images\//, ""));
  assert.ok(mediaFiles.length >= 26, "the full equipment media set should remain present");
  mediaFiles.forEach((relativePath) => {
    assert.match(relativePath, /^sp-[a-z0-9-]+\.(?:jpg|png|webp|mp4)$/);
    assert.doesNotMatch(relativePath, /Alibaba|PNM|[ ()]|[A-Z]/);
  });
  const repoReferences = ["index.html", "sp-ardhi-26.html", "sp-mzigo-26.html", "src/data/equipment.ts", "src/pages/HomePage.tsx"]
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  assert.doesNotMatch(repoReferences, /ardhibanner|mzigobanner|sideProfile|Alibaba|\.PNM/);
});
