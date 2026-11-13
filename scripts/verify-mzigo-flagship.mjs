import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const base = process.env.PASSPORT_BASE_URL ?? 'http://127.0.0.1:4193';
const browser = await chromium.launch({ headless:true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE} : {}) });
await mkdir('tmp/mzigo-flagship', {recursive:true});
try {
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors=[]; page.on('pageerror', error=>errors.push(error.message));
  let canonical;
  for (const width of [360,390,412,430,1440,1600,1920]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(`${base}/equipment/sp-mzigo-26.html`, {waitUntil:'domcontentloaded'});
    await page.locator('.mzigo-asset-number').waitFor();
    await page.locator('.mzigo-passport-hero>img').evaluate(image=>image.decode());
    const metrics = await page.evaluate(()=>{
      const hero=document.querySelector('.mzigo-passport-hero'), summary=document.querySelector('#passport'), image=hero.querySelector('img');
      return {overflow:document.documentElement.scrollWidth>innerWidth, imagePosition:getComputedStyle(image).position,heroBeforeSummary:hero.getBoundingClientRect().bottom<=summary.getBoundingClientRect().top+1,title:hero.querySelector('h1').textContent,location:document.querySelector('.fleet-location-panel').textContent,chapters:document.querySelectorAll('.mzigo-build-chapter').length};
    });
    assert.equal(metrics.overflow,false); assert.equal(metrics.imagePosition,'absolute'); assert.ok(metrics.heroBeforeSummary);
    assert.match(metrics.title,/Fleet Asset #002/); assert.equal(metrics.chapters,6);
    assert.match(metrics.location,/Supplier-reported/);
    if(width===390) canonical=metrics;
    await page.screenshot({path:`tmp/mzigo-flagship/hero-${width}.png`});
    for(const anchor of ['passport','journey','history','service']) {
      await page.locator(`.mzigo-passport-hero a[href="#${anchor}"]`).click();
      await page.waitForFunction(hash=>location.hash===hash,`#${anchor}`);
      assert.equal(await page.locator(`#${anchor}`).count(),1);
    }
    await page.locator('.fleet-location-panel').evaluate(element=>element.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('.passport-reading-status').textContent.includes('Journey'));
    await page.screenshot({path:`tmp/mzigo-flagship/journey-${width}.png`});
    await page.locator('.fleet-lifecycle-metrics').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>Number(document.querySelector('.fleet-lifecycle-metrics strong').textContent)>0);
    console.log(JSON.stringify({width,...metrics}));
  }
  await page.setViewportSize({width:390,height:1000});
  await page.goto(`${base}/equipment/sp-mzigo-26.html?utm_content=featured-fleet-sp-mzigo-26e`,{waitUntil:'domcontentloaded'});
  await page.locator('.mzigo-asset-number').waitFor();
  assert.equal(await page.locator('.mzigo-passport-hero h1').textContent(),canonical.title);
  assert.equal(await page.locator('.fleet-location-panel').textContent(),canonical.location);
  for(const width of [390,1600]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(`${base}/equipment/sp-ardhi-26.html`,{waitUntil:'domcontentloaded'});
    await page.locator('#ardhi-v2-title').waitFor();
    assert.match(await page.locator('#ardhi-v2-title').textContent(),/#001/);
    await page.locator('.ardhi-v2-hero>img').evaluate(image=>image.decode());
    await page.screenshot({path:`tmp/mzigo-flagship/ardhi-${width}.png`});
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: responsive hero placement, navigation, location, UTM parity, ARDHI hero');
} finally { await browser.close(); }
