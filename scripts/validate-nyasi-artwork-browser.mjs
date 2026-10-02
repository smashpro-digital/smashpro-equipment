import assert from "node:assert/strict";
import { createReadStream, existsSync, mkdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { chromium } from "@playwright/test";

const port = 4195;
const output = resolve("tmp/nyasi-artwork-browser");
mkdirSync(output, { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml" };
const server = createServer((request, response) => {
  if (request.url === "/favicon.ico") { response.statusCode = 204; response.end(); return; }
  const pathname = new URL(request.url || "/", `http://127.0.0.1:${port}`).pathname;
  const relative = pathname.startsWith("/equipment/") ? pathname.slice(11) : pathname.slice(1);
  const target = resolve("dist", relative || "index.html");
  if (!target.startsWith(`${resolve("dist")}${sep}`) || !existsSync(target) || !statSync(target).isFile()) { response.statusCode = 404; response.end("Not found"); return; }
  response.setHeader("Content-Type", types[extname(target)] || "application/octet-stream");
  createReadStream(target).pipe(response);
});
await new Promise(resolveListen => server.listen(port, "127.0.0.1", resolveListen));

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [360, 375, 390, 412, 430, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`http://127.0.0.1:${port}/equipment/`, { waitUntil: "networkidle" });
    const card = page.locator(".equipment-card--sp-nyasi-26");
    await card.scrollIntoViewIfNeeded();
    const cardImage = card.locator("img");
    const cardState = await cardImage.evaluate(image => ({ src: image.currentSrc, naturalWidth: image.naturalWidth, fit: getComputedStyle(image).objectFit, alt: image.alt }));
    assert.match(cardState.src, /sp-nyasi-26-showroom-hero-(640|960|1280|1672)\.webp/);
    assert.ok(cardState.naturalWidth > 0);
    assert.equal(cardState.fit, "contain");
    assert.match(cardState.alt, /remote-control tracked mower/i);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.equal(errors.length, 0);
    if (width === 390 || width === 1440) await card.screenshot({ path: `${output}/nyasi-showroom-card-${width}.png` });

    await page.goto(`http://127.0.0.1:${port}/equipment/sp-nyasi-26.html`, { waitUntil: "networkidle" });
    const heroImage = page.locator(".nyasi-hero > img");
    const heroState = await heroImage.evaluate(image => ({ src: image.currentSrc, naturalWidth: image.naturalWidth, fit: getComputedStyle(image).objectFit, alt: image.alt }));
    assert.match(heroState.src, /sp-nyasi-26-showroom-hero-(640|960|1280|1672)\.webp/);
    assert.ok(heroState.naturalWidth > 0);
    assert.match(heroState.alt, /remote-control tracked mower/i);
    assert.match(await page.locator(".nyasi-status").innerText(), /Production pending/i);
    assert.match(await page.locator("body").innerText(), /Identity \/ promotional artwork/i);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width);
    assert.equal(errors.length, 0);
    if (width === 390 || width === 1440) await page.screenshot({ path: `${output}/nyasi-passport-${width}.png`, fullPage: true });
    results.push({ width, cardSrc: cardState.src.split("/").pop(), heroSrc: heroState.src.split("/").pop(), heroFit: heroState.fit, errors });
    await page.close();
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  await new Promise(resolveClose => server.close(resolveClose));
}
