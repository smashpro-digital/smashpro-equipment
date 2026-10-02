import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const base = process.env.PASSPORT_PREVIEW_URL || 'http://127.0.0.1:4173';
const output = 'tmp/mzigo-payment-browser';
mkdirSync(output, {recursive:true});
const browser = await chromium.launch({headless:true});
const results = [];
try {
  for (const width of [320,390,768,1440]) {
    const page = await browser.newPage({viewport:{width,height:1000}, reducedMotion:'reduce'});
    const errors=[];
    page.on('pageerror', e=>errors.push({kind:'exception',text:e.message}));
    page.on('console', m=>{if(m.type()==='error') errors.push({kind:'console',text:m.text(),url:m.location().url});});
    await page.goto(`${base}/equipment/sp-mzigo-26.html`, {waitUntil:'networkidle'});
    await page.locator('.mzigo-passport').waitFor();
    const body = await page.locator('body').textContent();
    assert.match(body,/Paid in full/);
    assert.doesNotMatch(body,/final payment pending|final payment is current|final payment is planned/i);
    assert.equal(await page.locator('.fleet-lifecycle-stages .is-complete').count(),2);
    assert.match(await page.locator('.fleet-lifecycle-stages .is-current').innerText(),/Shipping Preparation/);
    assert.equal(await page.locator('.fleet-lifecycle-stages .is-pending').count(),14);
    assert.match(await page.locator('meta[name="description"]').getAttribute('content'),/Paid in full/);
    const images=[]; const videos=[];
    for (const chapter of ['Factory Build','Finished Machine']) {
      await page.getByRole('button',{name:new RegExp(chapter)}).click();
      for(const img of await page.locator('img:visible').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(i=>i.decode());
        images.push(await img.getAttribute('src'));
      }
      const video=page.locator('#mzigo-archive-panel video');
      await video.scrollIntoViewIfNeeded();
      await video.evaluate(async v=>{v.muted=true; await v.play();});
      await page.waitForFunction(()=>document.querySelector('#mzigo-archive-panel video')?.currentTime>0.2);
      videos.push(await video.evaluate(v=>({src:v.currentSrc,time:v.currentTime,error:v.error?.message??null})));
      await video.evaluate(v=>v.pause());
    }
    await page.getByRole('button',{name:/Export Journey/}).click();
    assert.match(await page.locator('#mzigo-archive-panel').innerText(),/No crate, port, shipment or vessel record/);
    await page.getByRole('button',{name:'Open configuration record',exact:true}).click();
    assert.match(await page.locator('.passport-document-dialog').innerText(),/Paid in full/);
    await page.getByRole('button',{name:'Close record',exact:true}).click();
    assert.equal(await page.locator('[src*="sp-mzigo-27e"], [href*="project_sources"]').count(),0);
    const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    assert.ok(overflow.scrollWidth<=width,JSON.stringify(overflow));
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`${output}/${width}-hero.png`});
    await page.locator('#journey').screenshot({path:`${output}/${width}-journey.png`});
    // Preserve all console evidence. Only the existing external document endpoint may fail in local preview.
    assert.deepEqual(errors.filter(e=>e.kind==='exception' || !e.url?.startsWith('https://smashpro.app/api/tech_companion.php?resource=fleet_public_asset_passport&')),[]);
    results.push({width,imagesChecked:images.length,videos,overflow,errors});
    console.log(JSON.stringify(results.at(-1)));
    writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:1000}});
  await page.goto(`${base}/equipment/sp-ardhi-26.html`,{waitUntil:'networkidle'});
  assert.match(await page.locator('body').innerText(),/SP-ARDHI-26/);
  assert.doesNotMatch(await page.locator('body').innerText(),/Paid in full . shipping preparation/);
  await page.screenshot({path:`${output}/ardhi-390.png`});
  const publicIndex=JSON.parse(readFileSync('dist/equipment-index.json','utf8'));
  assert.match(publicIndex.equipment.find(e=>e.fleet_id==='SP-MZIGO-26E').status_label,/Paid in full/);
  for(const name of readdirSync('dist/assets').filter(n=>n.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(`dist/assets/${name}`,'utf8'),/I020261001784090010205|880\.57|855\.00|25\.57|final payment pending/i);
  }
  writeFileSync(`${output}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
