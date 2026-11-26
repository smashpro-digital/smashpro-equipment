import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const options = { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } };
const domainSource = readFileSync("src/domain/liveviewCommerce.ts", "utf8");
const domainUrl = "data:text/javascript;base64," + Buffer.from(ts.transpileModule(domainSource, options).outputText).toString("base64");
const lv = await import(domainUrl);
const dataCode = ts.transpileModule(readFileSync("src/data/liveviewProducts.ts", "utf8"), options).outputText.replace("../domain/liveviewCommerce", domainUrl);
const { liveViewProducts, liveViewPartners } = await import("data:text/javascript;base64," + Buffer.from(dataCode).toString("base64"));

const page = readFileSync("src/pages/LiveVestCatalogPage.tsx", "utf8");
const components = readFileSync("src/components/LiveViewCommerce.tsx", "utf8");
const app = readFileSync("src/app/App.tsx", "utf8");
const vite = readFileSync("vite.config.ts", "utf8");
const catalog = readFileSync("src/data/catalog.ts", "utf8");
const shelleyes = readFileSync("src/pages/ShelleyesEvaluationPages.tsx", "utf8");

test("the six explicit availability states exist and map onto catalog lifecycle", () => {
  assert.deepEqual(Object.keys(lv.availabilityLabels), ["CONCEPT", "PARTNER_EVALUATION", "PROTOTYPE", "FIELD_TESTING", "COMING_SOON", "AVAILABLE"]);
  for (const s of Object.keys(lv.availabilityLabels)) assert.ok(lv.availabilityToCatalogStatus[s], s);
});

test("product line covers the requested catalog and nothing is purchasable", () => {
  const names = liveViewProducts.map((p) => p.name).join("|");
  for (const n of ["SP-LiveVest 01", "Premium partner safety vests", "Snake Eyes", "QuickDock", "transport case", "Charging", "starter kit"]) assert.match(names, new RegExp(n, "i"));
  for (const p of liveViewProducts) {
    assert.notEqual(p.availability, "AVAILABLE", p.sku);
    assert.equal(lv.callToActionFor(p, true).kind, "interest", p.sku);
    assert.ok(!("priceCents" in p) && !("affiliateUrl" in p), p.sku);
  }
  assert.equal(liveViewProducts.find((p) => p.sku === "SP-LIVEVEST-01").availability, "CONCEPT");
});

test("checkout needs AVAILABLE, every readiness gate and the checkout flag", () => {
  const ready = { pricingApproved: true, inventoryConfirmed: true, fulfillmentDefined: true, partnerTermsSigned: "not-applicable", productApproved: true };
  const p = { ...liveViewProducts[0], availability: "AVAILABLE", readiness: ready };
  assert.equal(lv.callToActionFor(p, true).kind, "checkout");
  assert.equal(lv.callToActionFor(p, false).kind, "interest");
  for (const gate of Object.keys(ready)) assert.equal(lv.callToActionFor({ ...p, readiness: { ...ready, [gate]: false } }, true).kind, "interest", gate);
  assert.equal(lv.callToActionFor({ ...p, availability: "COMING_SOON" }, true).kind, "interest");
  assert.match(components, /const checkoutEnabled = false/);
});

test("partners never imply sponsorship, endorsement or unapproved logos", () => {
  for (const p of liveViewPartners) {
    assert.notEqual(p.status, "confirmed", p.id);
    assert.equal(p.approvedLogo, undefined, p.id);
    assert.match(lv.partnerDisclosure(p), /not a sponsor, endorser or confirmed partner/);
  }
  assert.match(liveViewPartners.find((p) => p.id === "hologram").relationship, /not signed/);
  assert.doesNotMatch(page + components, /discount code|coupon|promo code|amzn\.to|\?tag=/i);
});

test("interest payload follows the Digital HQ equipment_preorder contract with category and campaign", () => {
  const payload = lv.buildInterestPayload({ sku: "SP-LIVEVEST-01", category: "fleet-manager", productInterest: "SP-LiveVest 01", fullName: " A ", email: "a@b.co", phone: "", postalCode: "", quantity: 99, notes: "crew of 12", consentTerms: true, consentMarketing: false, website: "", search: "?utm_source=linkedin&utm_campaign=vest-launch", defaultCampaign: "sp-livevest-01-catalog" });
  for (const k of ["product_sku", "full_name", "email", "phone", "postal_code", "quantity_interest", "intended_use", "consent_terms", "consent_marketing", "deposit_interest", "utm_source", "utm_medium", "utm_campaign"]) assert.ok(k in payload, k);
  assert.equal(payload.deposit_interest, false);
  assert.equal(payload.quantity_interest, 20);
  assert.equal(payload.utm_campaign, "vest-launch");
  assert.equal(payload.utm_medium, "catalog");
  assert.match(payload.intended_use, /^\[fleet-manager\] \[SP-LiveVest 01\] crew of 12$/);
  assert.equal(lv.buildInterestPayload({ ...payload, sku: "SP-LIVEVIEW", category: "bogus", productInterest: "x", fullName: "", email: "", phone: "", postalCode: "", quantity: 1, notes: "", consentTerms: true, consentMarketing: false, website: "", search: "", defaultCampaign: "c" }).intended_use.startsWith("[early-access]"), true);
  assert.match(components, /fetch\("\/api\/equipment_preorder\.php"/);
  for (const label of ["Home-service customer", "Contractor", "Equipment operator", "Safety workwear manufacturer", "Fleet manager", "Technology partner", "Product early access"]) assert.ok(Object.values(lv.interestCategoryLabels).includes(label), label);
});

test("interest form is feature-flagged and falls back to the existing contact pattern", () => {
  assert.match(components, /import\.meta\.env\.VITE_LIVEVIEW_PRODUCT_INTEREST === "1"/);
  assert.match(components, /if \(!liveViewInterestEnabled\)/);
  assert.match(lv.interestMailto("SP-LIVEVEST-01", "c"), /^mailto:smashprohq@gmail\.com\?subject=SP-LIVEVEST-01%20interest/);
  assert.match(components, /not a preorder, reservation, deposit or purchase/);
  assert.doesNotMatch(components + page, /woocommerce|add.to.cart|payment_intent|stripe/i);
});

test("LiveVest page covers every required section and labels concept media", () => {
  for (const s of ["The concept", "Camera mounting requirements", "Field evaluation plan", "Development status", "Partnership opportunities", "Related products and accessories", "Interest registration"]) assert.match(page, new RegExp(s), s);
  assert.match(page, /Concept · In product development · Not for sale/);
  assert.match(page, /Concept illustration only\. Not a product render or photograph\./);
  assert.match(page, /Stay Visible\. Stay Connected\./);
  assert.match(readFileSync("images/sp-livevest-01-concept.svg", "utf8"), /CONCEPT ILLUSTRATION/);
  assert.doesNotMatch(page, /<main/);
});

test("route follows the existing catalog convention with a static entry for direct loads", () => {
  assert.match(app, /path="\/catalog\/sp-livevest-01"/);
  assert.match(app, /path="\/catalog\/sp-livevest-01\/"/);
  assert.match(vite, /catalog\/sp-livevest-01\/index\.html/);
  assert.ok(existsSync("catalog/sp-livevest-01/index.html"));
  const shell = readFileSync("catalog/sp-livevest-01/index.html", "utf8");
  assert.match(shell, /https:\/\/smashpro\.app\/equipment\/catalog\/sp-livevest-01\//);
  assert.match(catalog, /id: "SP-LIVEVEST-01"[\s\S]*status: "concept"[\s\S]*availability: "not-for-sale"/);
  assert.doesNotMatch(app, /\/technology\//);
});

test("public camera evaluation no longer advertises RTMPS or hardware push-to-talk", () => {
  assert.doesNotMatch(shelleyes, /value: 'RTMP \/ RTMPS'/);
  assert.match(shelleyes, /RTMPS is reserved/);
  assert.doesNotMatch(page + components, /push.to.talk|two.way audio is (live|available)|encrypted (video|stream)/i);
});

// ---- Sprint 2: commercial readiness guards ----
const confirmedPartner = { id: "maker", name: "Example Workwear", category: "safety-workwear", status: "confirmed", agreementRef: "AGR-2027-001", relationship: "Manufacturing partner." };
const approvedImage = { src: "/equipment/images/x.webp", alt: "Vest front", kind: "render", stage: "concept", approvalRef: "EMAIL-1", approvedBy: "Owner", approvedAt: "2027-01-05" };
const base = () => ({ ...liveViewProducts[0] });

test("shipped LiveView data has no unbacked commercial claims", () => {
  for (const p of liveViewProducts) assert.deepEqual(lv.commercialRecordErrors(p, liveViewPartners), [], p.sku);
  for (const p of liveViewPartners) assert.deepEqual(lv.partnerRecordErrors(p), [], p.id);
  for (const p of liveViewProducts) for (const k of ["images", "manufacturer", "affiliate", "pricing"]) assert.equal(p[k], undefined, `${p.sku}.${k}`);
});

test("partner confirmation, sponsorship and logos need recorded approvals", () => {
  assert.ok(lv.partnerRecordErrors({ ...confirmedPartner, agreementRef: undefined }).length);
  assert.ok(lv.partnerRecordErrors({ ...liveViewPartners[0], sponsorship: { approvalRef: "X", description: "d" } }).length, "sponsorship needs confirmed partner");
  assert.ok(lv.partnerRecordErrors({ ...confirmedPartner, approvedLogo: { ...approvedImage, kind: "logo", approvalRef: "" } }).length);
  assert.deepEqual(lv.partnerRecordErrors({ ...confirmedPartner, approvedLogo: { ...approvedImage, kind: "logo" } }), []);
  assert.match(lv.partnerDisclosure({ ...confirmedPartner, agreementRef: undefined }), /not a sponsor, endorser or confirmed partner/);
  assert.match(lv.partnerDisclosure(confirmedPartner), /confirmed SmashPro partner\. Not a sponsorship\./);
});

test("manufacturer attribution depends on a signed agreement", () => {
  const info = { partnerId: "shelleyes", productName: "S7+", specs: [], verified: false };
  assert.match(lv.manufacturerAttribution(info, liveViewPartners), /^Candidate supplier: Shelleyes \(under evaluation\)$/);
  assert.equal(lv.manufacturerAttribution({ ...info, partnerId: "maker" }, [confirmedPartner]), "Manufactured by Example Workwear");
  assert.equal(lv.manufacturerAttribution({ ...info, partnerId: "ghost" }, liveViewPartners), null);
});

test("images, specs, pricing and affiliate links are rejected without evidence", () => {
  const partners = [...liveViewPartners, confirmedPartner];
  assert.deepEqual(lv.commercialRecordErrors({ ...base(), images: [approvedImage] }, partners), []);
  assert.ok(lv.commercialRecordErrors({ ...base(), images: [{ ...approvedImage, approvalRef: "" }] }, partners).length);
  assert.ok(lv.commercialRecordErrors({ ...base(), manufacturer: { partnerId: "maker", productName: "V", specs: [{ label: "Class", value: "3", source: "" }], verified: true } }, partners).length, "verified spec needs source");
  assert.ok(lv.commercialRecordErrors({ ...base(), pricing: { display: "$149", approvalRef: "PRICE-1" } }, partners).length, "pricing needs pricingApproved gate");
  const aff = { partnerId: "maker", url: "https://retailer.example/vest?ref=smashpro", programTermsRef: "AFF-TERMS-1", disclosure: "SmashPro may earn an affiliate commission." };
  assert.deepEqual(lv.commercialRecordErrors({ ...base(), affiliate: aff }, partners), []);
  assert.ok(lv.commercialRecordErrors({ ...base(), affiliate: { ...aff, partnerId: "shelleyes" } }, partners).length, "unconfirmed partner");
  assert.ok(lv.commercialRecordErrors({ ...base(), affiliate: { ...aff, url: aff.url + "&coupon=SAVE10" } }, partners).length, "no discount codes");
  assert.ok(lv.commercialRecordErrors({ ...base(), affiliate: { ...aff, programTermsRef: "" } }, partners).length);
  assert.ok(lv.commercialRecordErrors({ ...base(), affiliate: { ...aff, disclosure: "Great deal!" } }, partners).length);
  assert.ok(lv.commercialRecordErrors({ ...base(), availability: "AVAILABLE" }, partners).length, "AVAILABLE needs gates");
});

test("cards fail closed and affiliate links are marked sponsored", () => {
  assert.match(components, /commercialRecordErrors\(product, partners\)\.length === 0/);
  assert.match(components, /rel="sponsored nofollow noopener"/);
  assert.match(components, /partnerRecordErrors\(partner\)\.length === 0/);
});

test("fleet inquiries route to interest registration with fleet-manager preselected", () => {
  assert.equal(lv.fleetInquiryHref("SP-LiveVest 01"), "?interest=fleet-manager&product=SP-LiveVest%2001#interest");
  assert.ok(liveViewProducts.filter((p) => p.fleetInquiry).every((p) => p.plannedModels.includes("b2b-fleet-inquiry")));
  assert.match(components, /q\.get\("interest"\)/);
});

test("production build never enables the interest form or checkout implicitly", () => {
  const deploy = readFileSync(".github/workflows/deploy.yml", "utf8");
  assert.doesNotMatch(deploy, /VITE_LIVEVIEW_PRODUCT_INTEREST/);
  assert.doesNotMatch(readFileSync(".env.example", "utf8"), /VITE_LIVEVIEW_PRODUCT_INTEREST=1/);
  assert.match(components, /const checkoutEnabled = false/);
});
