import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
const base = process.env.EQUIPMENT_PREVIEW_URL ?? "http://127.0.0.1:5196/equipment";
const output = "tmp/nyasi-factory-browser";
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [360, 375, 390, 430, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(base + "/sp-nyasi-26.html", { waitUntil: "networkidle" });
    assert.match(await page.locator(".nyasi-status").innerText(), /Factory Build Complete/i);
    assert.match(await page.locator(".nyasi-status").innerText(), /1,565/);
    assert.equal(await page.locator('nav[aria-label="Passport sections"]').count(), 1);
    for (const link of await page.locator('nav[aria-label="Passport sections"] a').all()) {
      const href = await link.getAttribute("href");
      assert.equal(await page.locator(href).count(), 1);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    await page.locator("#evidence").scrollIntoViewIfNeeded();
    await page.locator(".passport-factory-gallery img").first().waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll(".passport-factory-gallery img")].every(i => i.complete && i.naturalWidth > 0));
    assert.equal(await page.locator(".passport-factory-gallery .archive-grid article").count(), 3);
    for (const trigger of await page.locator(".passport-factory-gallery .archive-grid button").all()) {
      await trigger.click();
      assert.equal(await page.locator("dialog[open]").count(), 1);
      assert.equal(await page.locator("dialog[open] a").count(), 0);
      await page.keyboard.press("Escape");
      assert.equal(await page.locator("dialog[open]").count(), 0);
      assert.ok(await trigger.evaluate(e => document.activeElement === e), "focus restored");
    }
    assert.equal(await page.locator(".passport-factory-gallery video").count(), 0);
    assert.equal(await page.locator(".passport-factory-gallery a").count(), 0);
    await page.reload({ waitUntil: "networkidle" });
    await page.locator(".passport-factory-gallery img").evaluateAll(imgs => { imgs.forEach(i => i.loading = "eager"); });
    await page.mouse.move(0, 0);
    await page.locator("#evidence").scrollIntoViewIfNeeded();
    await page.locator(".passport-factory-gallery img").evaluateAll(imgs => Promise.all(imgs.map(i => i.decode())));
    await page.waitForTimeout(400);
    await page.locator("#nyasi-factory-front-blade").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: output + "/nyasi-evidence-" + width + ".png" });
    await page.screenshot({ path: output + "/nyasi-passport-" + width + ".png", fullPage: true });
    const ids = await page.locator("[id]").evaluateAll(nodes => nodes.map(n => n.id));
    assert.equal(new Set(ids).size, ids.length, "no duplicate IDs");
    assert.equal(errors.length, 0, errors.join("; "));
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const card = page.locator("[data-fleet-id='SP-NYASI-26']");
    await card.scrollIntoViewIfNeeded();
    assert.match(await card.innerText(), /Factory Build Complete/i);
    assert.match(await card.locator("img").getAttribute("src"), /showroom-custom-v1.png/);
    await card.locator("img").evaluate(i => i.decode());
    await page.waitForTimeout(200);
    await card.screenshot({ path: output + "/nyasi-card-" + width + ".png" });
    results.push({ asset: "NYASI", width, overflow: false, galleryRecords: 3, dialogKeyboardAndFocus: true, videoOmitted: true, originalLinksOmitted: true, errors });
    await page.close();
  }
  for (const width of [360, 390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(base + "/sp-ardhi-26.html", { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.ok(await page.locator("h1").isVisible());
    assert.ok(await page.locator(".archive-grid").count());
    assert.equal(errors.length, 0);
    await page.screenshot({ path: output + "/ardhi-regression-" + width + ".png", fullPage: true });
    results.push({ asset: "ARDHI", width, overflow: false, archivePresent: true, errors });
    await page.close();
  }
  writeFileSync(output + "/results.json", JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }
