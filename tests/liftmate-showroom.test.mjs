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
  assert.equal(item.heroImage, "/equipment/images/sp-liftmate-27-hero.png");
  assert.equal(item.status, "planned");
  assert.equal(item.statusLabel, "Proposed partner build");
  assert.equal(item.category, "Pairon Tools Glide200 · Mobile Powered Lifting Platform");
  assert.equal(item.capabilityStatement, "Mobile powered lifting and truck-bed loading support for real-world SmashPro field workflows.");
  assert.ok(existsSync("images/sp-liftmate-27-hero.png"));
  assert.equal(readFileSync("images/sp-liftmate-27-hero.png").subarray(1, 4).toString(), "PNG");
});

test("LiftMate card and Passport preserve proposal-stage truth and requested specs", () => {
  const card = readFileSync("src/components/EquipmentCard.tsx", "utf8");
  const passport = readFileSync("src/pages/LiftMatePassportPage.tsx", "utf8");
  const publicRecord = JSON.stringify(item);
  for (const [label, value] of [["OEM Model", "Glide200"], ["Rated Capacity", "440 lb"], ["Power", "48V Electric"], ["Model Year", "2027"]]) {
    assert.equal(item.specifications.find(spec => spec.label === label)?.value, value);
  }
  assert.match(card, /item\.slug === "sp-liftmate-27"/);
  assert.match(card, /equipment-card--\$\{item\.slug\}/);
  assert.match(passport, /features shown are planned and remain subject to partnership and factory confirmation/i);
  assert.doesNotMatch(publicRecord, /partner price|deposit|refund|reimbursement|private correspondence|contact information/i);
  assert.match(item.statusDetail, /No partnership, acquisition, SmashPro modification, commissioning, or field validation is represented as complete/);
});
