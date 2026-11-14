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
  assert.match(grapple.receiving.nameplateWeight, /^Not specified.*blank/);
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
  assert.match(html, /Delivered · Fitment Review Required/);
  for (const value of ["2459685", "SMPRMINIRG", "2026-10-22", "16486-0001-001", "3,200 PSI", "ACME Logistics", "0178760094", "Front Door Service", "Hopkins, South Carolina", "$0 balance"]) {
    assert.ok(html.includes(value), `Missing ${value}`);
  }
  assert.equal(grapple.receiving.commissioningChecklist.length, 9);
  assert.match(html, /both pins are fully engaged, inspected, and corrective action is verified/);
  assert.match(html, /throttle.control issue/);
  assert.match(html, /Field Test 001 · Planned/);
  assert.match(html, /No test performed and no results recorded/);
  assert.doesNotMatch(html, /Awaiting Shipment|In transit|shipment pending|balance due|ZIP 29061|803-217|estes\.delivery|Discover|card number/i);
  assert.match(html, /Not operational or customer-ready/);
});

test("approved mounted hero preserves delivery and secondary mounting evidence", () => {
  assert.equal(grapple.image, "https://smashpro.app/wp-content/uploads/2026/11/20261113_152010.jpg");
  assert.equal(grapple.imageMetadata.wordpressMediaId, 1067);
  assert.equal(grapple.imageMetadata.width / grapple.imageMetadata.height, 0.75);
  assert.equal(grapple.fieldEvidence.length, 11);
  assert.equal(new Set(grapple.fieldEvidence.map(entry => entry.id)).size, 11);
  assert.equal(grapple.fieldEvidence[0].image, "https://smashpro.app/wp-content/uploads/2026/11/20261111_092910.jpg");
  const secondary = grapple.fieldEvidence.find(entry => entry.wordpressMediaId === 1063);
  assert.equal(secondary.evidenceDate, "2026-11-13");
  assert.match(secondary.image, /20261113_152047.jpg$/);
  assert.ok(grapple.fieldEvidence.every(entry => entry.status === "verified" && entry.image && entry.imageAlt));
  assert.equal(new Set(grapple.fieldEvidence.map(entry => entry.image)).size, 11);
  assert.match(grapple.fieldEvidence.find(entry => entry.wordpressMediaId === 1023).description, /factory pressure testing, not commissioning/);
  const html = render(AttachmentReceiving, { item: grapple });
  assert.equal((html.match(/Public photograph missing/g) ?? []).length, 0);
  assert.match(html, /<details class="attachment-manufacturer-reference">/);
  assert.match(html, /not the delivered serial-numbered SmashPro attachment/);
  assert.equal((html.match(/<img /g) ?? []).length, 12);
});

test("approved receiving image uses existing gallery; unapproved or missing-alt media stays a slot", () => {
  const entry = grapple.fieldEvidence[0];
  const approved = { ...entry, status: "verified", image: grapple.receiving.manufacturerReference.src, imageAlt: "Test fixture for gallery wiring" };
  const html = render(AttachmentReceiving, { item: { ...grapple, fieldEvidence: [approved] } });
  assert.match(html, /Enlarge Delivery and receiving photograph/);
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
    assert.ok(html.includes(grapple.image));
    assert.match(html, /Delivered · Fitment Review Required/);
    assert.doesNotMatch(html, /In transit · Estes freight/);
  }
});

test("seven procurement milestones are complete and operational milestones remain pending", () => {
  const completed = grapple.receiving.timeline.filter(event => event.status === "completed");
  assert.deepEqual(completed.map(event => [event.id, event.date]), [
    ["order", "2026-09-09"], ["manufacture", "2026-10-22"], ["fabrication", "2026-10-28"],
    ["paid", "2026-11-05"], ["shipped", "2026-11-05"], ["handoff", "2026-11-09"], ["received", "2026-11-11"],
  ]);
  assert.deepEqual(grapple.receiving.timeline.filter(event => event.status === "pending").map(event => event.id), ["commissioning", "field-test"]);
  const html = render(AttachmentReceiving, { item: grapple });
  assert.equal((html.match(/class="is-completed"/g) ?? []).length, 7);
  assert.equal((html.match(/class="is-pending"/g) ?? []).length, 2);
  assert.match(html, /November 9, 2026/);
});

test("four requested receiving groups preserve approved media and label preliminary measurements", () => {
  const html = render(AttachmentReceiving, { item: grapple });
  for (const category of ["Delivery", "Equipment Overview", "Manufacturer Identification", "Mounting and Fitment"]) {
    assert.ok(html.includes(`<h3>${category}</h3>`), `Missing ${category}`);
  }
  assert.match(html, /preliminary physical observations, not certified mounting dimensions/i);
  assert.match(html, /width="2000" height="1500"/);
});

test("two planned videos render working titles but no fake player or publication metadata", () => {
  assert.equal(grapple.receiving.videoSlots.length, 2);
  assert.ok(grapple.receiving.videoSlots.every(slot => !slot.publication));
  const html = render(AttachmentReceiving, { item: grapple });
  assert.match(html, /\$2,297 Later\.\.\. ARDHI&#x27;s New Grapple Is HERE!/);
  assert.match(html, /Can ARDHI Handle This Brush Pile\?/);
  assert.match(html, /Video production pending/);
  assert.match(html, /Field test pending/);
  assert.doesNotMatch(html, /<iframe|<video|youtube\.com\/watch|youtube-nocookie\.com/);
});

test("future reviewed video reuses consent player; private, future or wrong-asset publication is hidden", () => {
  const video = {
    equipmentId: grapple.passportId, videoId: "abc123DEF45", title: "Synthetic reviewed video",
    description: "Test fixture only", category: "Delivery", lifecycleStage: "Received",
    publishedAt: "2026-11-11", verifiedAt: "2026-11-11", visibility: "public",
  };
  const withVideo = publication => ({
    ...grapple, receiving: { ...grapple.receiving, videoSlots: [{ ...grapple.receiving.videoSlots[0], publication }] },
  });
  const html = render(AttachmentReceiving, { item: withVideo({ video, duration: "4:20", thumbnail: grapple.receiving.manufacturerReference }) });
  assert.match(html, /Load Synthetic reviewed video/);
  assert.match(html, /Duration: 4:20/);
  assert.match(html, /youtube\.com\/watch\?v=abc123DEF45/);
  assert.doesNotMatch(html, /<iframe/);
  for (const invalid of [{ ...video, visibility: "private" }, { ...video, publishedAt: "2099-01-01" }, { ...video, equipmentId: "SP-ARDHI-26" }]) {
    const markup = render(AttachmentReceiving, { item: withVideo({ video: invalid }) });
    assert.doesNotMatch(markup, /Synthetic reviewed video|4:20|youtube\.com\/watch|Load video|<iframe/);
    assert.match(markup, /Video production pending/);
  }
});
