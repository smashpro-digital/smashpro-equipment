import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const server = await createServer({ configFile: false, esbuild: { jsx: "automatic" }, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false }, appType: "custom" });
const { attachments } = await server.ssrLoadModule("/src/data/attachments.ts");
const { AttachmentPassportPage } = await server.ssrLoadModule("/src/pages/AttachmentPassportPage.tsx");
const { AttachmentShowroom } = await server.ssrLoadModule("/src/components/AttachmentShowroom.tsx");
const { AttachmentReceiving } = await server.ssrLoadModule("/src/components/AttachmentReceiving.tsx");
await server.close();
const grapple = attachments.find(item => item.passportId === "SP-ATT-GRP-001");
const render = (component, props) => renderToStaticMarkup(React.createElement(MemoryRouter, {}, React.createElement(component, props)));

test("one received serial-numbered grapple with distinct weight and lifecycle records", () => {
  assert.equal(attachments.filter(item => item.passportId === grapple.passportId || item.assetTag === grapple.assetTag).length, 1);
  assert.equal(grapple.assetTag, "SP-GRP-ARDHI-01");
  assert.equal(grapple.model, "SMPRMINIRG");
  assert.equal(grapple.receiving.serialNumber, "2459685");
  assert.equal(grapple.receiving.manufacturedAt, "2026-10-22");
  assert.equal(grapple.receiving.manufacturerJobId, "16486-0001-001");
  assert.equal(grapple.receiving.nameplateMount, "TORODINGO");
  assert.match(grapple.receiving.nameplateWeight, /^Blank/);
  assert.match(grapple.weight, /370 lbs.*specification, not measured/);
  assert.match(grapple.receiving.freight.shipment, /390 lbs freight shipment weight/);
  assert.match(grapple.hydraulicRequirement.pressure, /Max 3,200 PSI/);
  assert.equal(grapple.receiving.factoryTest, "TESTED 3200 PSI");
  assert.equal(grapple.receiving.freight.deliveredAt, "2026-11-11");
  assert.equal(grapple.status, "commissioning");
  assert.equal(grapple.commissionedAt, undefined);
  assert.deepEqual(grapple.verifiedFleetIds, []);
  assert.equal(grapple.serviceUrl, undefined);
});

test("passport renders verified identity, paid delivery, nine pending checks and planned test", () => {
  const html = render(AttachmentPassportPage, { slug: grapple.slug });
  assert.match(html, /Received · Identification Verified · Commissioning Pending/);
  for (const value of ["2459685", "SMPRMINIRG", "2026-10-22", "16486-0001-001", "3,200 PSI", "ACME Logistics", "0178760094", "Front Door Service", "Hopkins, South Carolina", "$0 balance"]) {
    assert.ok(html.includes(value), `Missing ${value}`);
  }
  assert.equal(grapple.receiving.commissioningChecklist.length, 9);
  assert.match(html, /throttle.control issue/);
  assert.match(html, /Field Test 001 · Planned/);
  assert.match(html, /No test performed and no results recorded/);
  assert.doesNotMatch(html, /Awaiting Shipment|In transit|shipment pending|balance due|ZIP 29061|803-217|estes\.delivery|Discover|card number/i);
  assert.match(html, /Not operational or customer-ready/);
});

test("authentic receiving hero and ten missing photographs, manufacturer image secondary only", () => {
  assert.equal(grapple.image, "https://smashpro.app/wp-content/uploads/2026/11/20261111_092910.jpg");
  assert.equal(grapple.fieldEvidence.length, 11);
  assert.equal(new Set(grapple.fieldEvidence.map(entry => entry.id)).size, 11);
  assert.equal(grapple.fieldEvidence[0].image, grapple.image);
  assert.ok(grapple.fieldEvidence.slice(1).every(entry => entry.status === "pending" && !entry.image));
  const html = render(AttachmentReceiving, { item: grapple });
  assert.equal((html.match(/Public photograph missing/g) ?? []).length, 10);
  assert.match(html, /<details class="attachment-manufacturer-reference">/);
  assert.match(html, /not the delivered serial-numbered SmashPro attachment/);
  assert.equal((html.match(/<img /g) ?? []).length, 2);
});

test("approved receiving image uses existing gallery; unapproved or missing-alt media stays a slot", () => {
  const entry = grapple.fieldEvidence[0];
  const approved = { ...entry, status: "verified", image: grapple.receiving.manufacturerReference.src, imageAlt: "Test fixture for gallery wiring" };
  const html = render(AttachmentReceiving, { item: { ...grapple, fieldEvidence: [approved] } });
  assert.match(html, /Enlarge Actual delivered grapple hero/);
  assert.match(html, /Test fixture for gallery wiring/);
  assert.doesNotMatch(html, /Public photograph missing/);
  for (const invalid of [{ ...approved, status: "pending" }, { ...approved, imageAlt: undefined }]) {
    assert.match(render(AttachmentReceiving, { item: { ...grapple, fieldEvidence: [invalid] } }), /Public photograph missing/);
  }
});

test("showroom links the existing grapple once in both featured and category positions", () => {
  for (const items of [[grapple, ...attachments.filter(item => item !== grapple)], [...attachments.filter(item => item !== grapple), grapple]]) {
    const html = render(AttachmentShowroom, { attachments: items.map((item, index) => ({ ...item, featured: index === 0 })) });
    assert.equal((html.match(/href="\/equipment\/attachments\/sp-att-grp-001\/"/g) ?? []).length, 1);
    assert.match(html, /LOFLIN 42&quot; MINI ROOT GRAPPLE/);
    assert.match(html, /Received · Commissioning Pending/);
    assert.doesNotMatch(html, /In transit · Estes freight/);
  }
});
