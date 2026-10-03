import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "vite";

const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true }, appType: "custom" });
const { equipment } = await server.ssrLoadModule("/src/data/equipment.ts");
await server.close();
const item = equipment.find(row => row.fleetId === "SP-LIFTMATE-27");

test("LiftMate is a public data-driven showroom entry with local concept artwork", () => {
  assert.ok(item);
  assert.equal(item.publicPath, "/sp-liftmate-27.html");
  assert.equal(item.heroImage, "/equipment/images/sp-liftmate-27-official-concept.png");
  assert.equal(item.status, "planned");
  assert.equal(item.statusLabel, "Custom build planning");
  assert.equal(item.category, "Pairon Tools Glide200 · Mobile Powered Lifting Platform");
  assert.equal(item.capabilityStatement, "Proposed mobile powered lifting and truck-bed loading support for controlled SmashPro field evaluation.");
  assert.ok(existsSync("images/sp-liftmate-27-official-concept.png"));
  assert.equal(readFileSync("images/sp-liftmate-27-official-concept.png").subarray(1, 4).toString(), "PNG");
});

test("LiftMate card and Passport preserve proposal-stage truth and requested specs", () => {
  const card = readFileSync("src/components/EquipmentCard.tsx", "utf8");
  const passport = readFileSync("src/pages/LiftMatePassportPage.tsx", "utf8");
  const publicRecord = JSON.stringify(item);
  for (const [label, value] of [["OEM Model", "Glide200"], ["Rated Capacity", "440.9 lb published lift capacity"], ["Power", "48V LiFePO4"], ["Model Year", "2027"]]) {
    assert.equal(item.specifications.find(spec => spec.label === label)?.value, value);
  }
  assert.match(card, /item\.slug === "sp-liftmate-27"/);
  assert.match(card, /equipment-card--\$\{item\.slug\}/);
  for (const pattern of [/PassportHero/, /FleetLifecycleProgress/, /PassportEvidenceRecord/, /PassportDocumentRecord/, /View Partnership Case Study/, /Five planned chapters/]) assert.match(passport, pattern);
  assert.match(readFileSync("src/data/liftmateEquipment.ts", "utf8"), /Vehicle fitment not yet validated/i);
  assert.doesNotMatch(publicRecord, /partner price|deposit amount|refund amount|reimbursement mechanics|private correspondence|private (email|phone)/i);
  assert.match(item.statusDetail, /deposit, production, acquisition, modification, commissioning and field validation are not complete/);
  assert.match(readFileSync("sp-liftmate-27.html", "utf8"), /https:\/\/smashpro\.app\/equipment\/images\/sp-liftmate-27-official-concept\.png/);
});

test("LiftMate identifies the Pairon OEM platform with sourced local media", () => {
  const passport = readFileSync("src/pages/LiftMatePassportPage.tsx", "utf8");
  const thumbnail = "images/sp-liftmate-27-pairon-glide200-oem-thumbnail.jpg";
  assert.ok(existsSync(thumbnail));
  assert.equal(readFileSync(thumbnail).subarray(0, 3).toString("hex"), "ffd8ff");
  assert.match(passport, /\/equipment\/images\/sp-liftmate-27-pairon-glide200-oem-thumbnail\.jpg/);
  assert.doesNotMatch(passport, /pairontools\.com\/products/);
  assert.match(passport, /Official Pairon product image/);
});
