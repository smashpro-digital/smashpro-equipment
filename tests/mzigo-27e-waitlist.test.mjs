import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/pages/Mzigo27eCatalogPage.tsx", "utf8");
const css = readFileSync("src/styles/mzigo27e-catalog.css", "utf8");

test("SP-MZIGO-27E has a linked and accessible, nonbinding waitlist", () => {
  assert.match(page, /href="#early-access"/);
  assert.match(page, /id="early-access"/);
  assert.match(page, /<form[^>]+onSubmit=\{joinWaitlist\}/);
  assert.match(page, /name="email"[^>]+required/);
  assert.match(page, /name="consent_terms"[^>]+required/);
  assert.match(page, /No deposit required/);
  assert.match(page, /Joining is not a preorder, reservation, purchase commitment/);
  assert.match(page, /Catalog concept/);
  assert.doesNotMatch(page, /woocommerce|checkout|add.to.cart|payment_intent/i);
});

test("Signup payload matches the Digital HQ equipment_preorder contract", () => {
  for (const key of [
    "product_sku", "full_name", "email", "phone", "postal_code",
    "quantity_interest", "intended_use", "consent_terms", "consent_marketing",
    "deposit_interest", "utm_source", "utm_medium", "utm_campaign",
  ]) {
    assert.match(page, new RegExp(`\\b${key}:`), `missing API payload key: ${key}`);
  }
  assert.match(page, /fetch\("\/api\/equipment_preorder\.php"/);
  assert.match(page, /credentials: "same-origin"/);
  assert.match(page, /if \(!response\.ok \|\| result\.ok !== true\)/);
  assert.match(page, /form\.reset\(\)/);
  assert.match(page, /setSubmitting\(false\)/);
  assert.match(page, /role="status"/);
  assert.match(css, /@media\(max-width:520px\)/);
});
