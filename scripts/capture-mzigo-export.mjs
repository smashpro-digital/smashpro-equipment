import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const base = process.argv[2] ?? 'http://127.0.0.1:4186/equipment';
const phase = process.argv[3] ?? 'after';
const out = `local-notes/mzigo-export-20261007/${phase}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = process.argv[4] && existsSync(`${out}/results.json`) ? JSON.parse(readFileSync(`${out}/results.json`, 'utf8')).filter(r => !process.argv[4].split(',').includes(r.asset)) : [];
try {
  for (const [asset, path] of [['ardhi', '/sp-ardhi-26.html'], ['mzigo', '/sp-mzigo-26.html'], ['27e', '/catalog/sp-mzigo-27e/']]) {
    if (process.argv[4] && !process.argv[4].split(',').includes(asset)) continue;
    for (const width of [320, 390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      // Compare source rendering under identical unavailable external services.
      await page.route(/https:\/\/(api\.)?smashpro\.app\/.*(?:api|shipment)/, route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":false,"error":"Controlled reference service unavailable"}' }));
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await page.locator('h1').waitFor();
      await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}' });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
        await Promise.all([...document.images].map(async img => { img.loading = 'eager'; try { await img.decode(); } catch {} }));
        scrollTo(0, 0);
      });
      if (asset === 'ardhi') {
        await page.locator('video').evaluateAll(videos => videos.forEach(v => { v.preload = 'auto'; }));
        await page.waitForFunction(() => [...document.querySelectorAll('video')].every(v => v.readyState >= 2 || v.error), null, { timeout: 120000 });
        assert.equal(await page.locator('video').evaluateAll(videos => videos.some(v => v.error)), false);
      }
      await page.waitForTimeout(1500);
      const record = await page.evaluate(() => ({
        text: document.body.innerText,
        headings: [...document.querySelectorAll('h1,h2,h3')].map(n => n.textContent),
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images].filter(i => !i.complete || !i.naturalWidth || !i.hasAttribute('alt')).map(i => i.src),
      }));
      assert.equal(record.overflow, false, `${asset} ${width}: overflow`);
      assert.deepEqual(record.broken, [], `${asset} ${width}: images`);
      assert.deepEqual(errors, [], `${asset} ${width}: page errors`);
      await page.screenshot({ path: `${out}/${asset}-${width}.png`, fullPage: true });
      if (asset === 'mzigo' && phase === 'after') {
        await page.locator('#export-evidence').screenshot({ path: `${out}/mzigo-evidence-${width}.png` });
        assert.match(record.text, /Paid in full.*Qingdao export staging/i);
        assert.match(record.text, /750 kg/); assert.match(record.text, /500 kg/);
        assert.match(record.text, /QLUP202609010001/);
        assert.doesNotMatch(record.text, /Final Payment Pending|SP-MZIGO-27E.*production started/i);
        await page.getByRole('button', { name: /Export Journey/ }).click();
        await page.locator('.mzigo-media-archive img').first().waitFor();
        await page.locator('.mzigo-media-archive img').evaluateAll(imgs => Promise.all(imgs.map(i => { i.loading = "eager"; return i.decode(); })));
        const sources = await page.locator('.mzigo-media-archive .archive-grid img').evaluateAll(imgs => imgs.map(i => i.src));
        assert.equal(sources.length, 14); assert.equal(new Set(sources).size, sources.length);
        assert.ok(sources.every(src => !/IMG-|27e|crate-complete/.test(src)));
        assert.equal(await page.locator('.mzigo-media-archive video').count(), 2);
        await page.getByRole('button', { name: /Enlarge KYLIN/ }).click();
        assert.equal(await page.getByRole('dialog', { name: 'Factory photograph viewer' }).isVisible(), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('dialog', { name: 'Factory photograph viewer' }).isVisible(), false);
        await page.screenshot({ path: `${out}/mzigo-export-${width}.png`, fullPage: true });
        record.exportImages = sources.length;
        console.log(`${width}: gallery and lightbox passed`);
        const search = page.getByRole('searchbox', { name: 'Search Export Journey media' });
        await search.fill('QLUP202609010001');
        assert.equal(await page.locator('.mzigo-media-archive .archive-grid img').count(), 1);
        await search.fill('');
        console.log(`${width}: search passed`);
        for (const video of await page.locator('.mzigo-media-archive video').all()) {
          await video.scrollIntoViewIfNeeded();
          await video.evaluate(async v => { v.muted = true; await Promise.race([v.play(), new Promise((_, reject) => setTimeout(() => reject(new Error(`Video playback timed out: readyState=${v.readyState}; networkState=${v.networkState}; error=${v.error?.message}`)), 15000))]); });
          await page.waitForFunction(v => v.currentTime > 0 && !v.error, await video.elementHandle(), { timeout: 15000 });
          await video.evaluate(v => v.pause());
        }
        console.log(`${width}: both videos played`);
        await page.getByRole('link', { name: 'View product certificate photograph' }).click();
        assert.ok(page.url().endsWith('#media-sp-mzigo-26e-product-certificate-2026-10-06'));
        assert.equal(await page.locator('#media-sp-mzigo-26e-product-certificate-2026-10-06').count(), 1);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.deepEqual(errors, []);
      }
      results.push({ asset, width, ...record, errors });
      writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
      console.log(`${phase}: ${asset} ${width} passed`);
      await page.close();
    }
  }
} finally { await browser.close(); }
