import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';

const [base = 'http://127.0.0.1:4186/equipment', phase = 'before', onlyAsset] = process.argv.slice(2);
const output = `docs/release-captures/passport-automation/${phase}`;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const asset of (onlyAsset ? [onlyAsset] : ['ardhi', 'liftmate'])) for (const width of [390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (['reference','after'].includes(phase)) {
      // Deterministic outage parity; confirmed/unverified states are covered by
      // the existing shipment browser suite. Production captures remain live.
      await page.route('**/api/fleet/shipment/SP-ARDHI-26',route=>route.fulfill({status:503,contentType:'application/json',body:'{"error":"regression outage fixture"}'}));
    }
    await page.goto(`${base}/sp-${asset}-${asset === 'ardhi' ? '26' : '27'}.html`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.locator('h1').waitFor();
    await page.waitForTimeout(2500);
    // Load lazy media and reveal each viewport before taking a full-page reference.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 850) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
    await page.waitForTimeout(1000);
    if (asset==='ardhi' && ['reference','after'].includes(phase)) await page.locator('.leaflet-container').waitFor({state:'attached',timeout:20000});
    if (['reference','after'].includes(phase)) await page.evaluate(async()=>{
      await Promise.all([...document.images].map(async img=>{img.loading='eager';try{await img.decode();}catch{/* Report missing images below. */}}));
    });
    const record = await page.evaluate(() => ({
      text: document.body.textContent,
      headings: [...document.querySelectorAll('h1,h2,h3')].map(n => n.textContent),
      ids: [...document.querySelectorAll('[id]')].map(n => n.id),
      links: [...document.querySelectorAll('main a[href]')].map(n => n.getAttribute('href')),
      overflow: document.documentElement.scrollWidth > innerWidth,
      images: [...document.images].map(n => ({ src: n.getAttribute('src'), loaded: n.complete && n.naturalWidth > 0 })),
      history: [...document.querySelectorAll('.ardhi-expandable-timeline > li')].map(n => n.textContent),
    }));
    record.errors = errors;
    record.networkMode = ['reference','after'].includes(phase)?'controlled-shipment-outage':'live-dependencies';
    if (['reference','after'].includes(phase)) for(const img of record.images.filter(i=>i.src?.startsWith('/equipment/images/'))) assert.ok(img.loaded,`Reference media did not decode: ${img.src}`);
    writeFileSync(`${output}/${asset}-${width}.json`, JSON.stringify(record, null, 2));
    await page.screenshot({ path: `${output}/${asset}-${width}.png`, fullPage: true });
    await page.screenshot({ path: `${output}/${asset}-${width}-hero.png` });
    assert.deepEqual(errors, [], `${asset} runtime errors`);
    if (asset === 'ardhi') {
      for (const value of ['SP-ARDHI-26', 'YF380', 'RAL 6018', 'Three-pump', 'Operator Manual']) assert.ok(record.text.includes(value), value);
      if (phase === 'after') {
        const reference=`docs/release-captures/passport-automation/reference/${asset}-${width}.json`;
        const before = JSON.parse(readFileSync(existsSync(reference)?reference:`docs/release-captures/passport-automation/before/${asset}-${width}.json`));
        assert.deepEqual(record.headings, before.headings);
        assert.deepEqual(record.ids, before.ids);
        assert.deepEqual(record.links, before.links);
        assert.deepEqual(record.history, before.history);
        assert.equal(record.overflow, before.overflow);
        await page.getByRole('button', { name: 'View Full Sticker', exact: true }).first().click();
        assert.ok((await page.getByRole('dialog').textContent()).includes('SPP-2026-0001'));
        await page.keyboard.press('Escape');
        assert.equal(await page.getByRole('dialog').count(), 0);
        await page.evaluate(() => { location.hash='history-production-started'; });
        await page.waitForTimeout(300);
        assert.equal(await page.locator('#history-production-started details').getAttribute('open'), '');
        await page.locator('#documents').screenshot({path:`${output}/${asset}-${width}-documents.png`});
      }
    }
    if (asset === 'liftmate' && phase === 'after') {
      assert.equal(await page.locator('[data-passport-renderer="generic"]').count(),1);
      assert.equal(record.overflow,false);
      for (const image of record.images.filter(i=>i.src?.includes('sp-liftmate'))) assert.ok(image.loaded,image.src);
      assert.equal(await page.locator('.liftmate-hero > img').evaluate(n=>getComputedStyle(n).objectFit),'contain');
      await page.getByRole('button',{name:'Open configuration record'}).click();
      assert.ok((await page.getByRole('dialog').textContent()).includes('SPP-2027-0001'));
      await page.keyboard.press('Escape');
      assert.equal(await page.getByRole('dialog').isVisible(),false);
      const broken=await page.locator('.liftmate-passport a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash));
      assert.deepEqual(broken,[]);
    }
    console.log(JSON.stringify({ phase, asset, width, overflow: record.overflow, history: record.history.length, errors }));
    await page.close();
  }
} finally { await browser.close(); }
