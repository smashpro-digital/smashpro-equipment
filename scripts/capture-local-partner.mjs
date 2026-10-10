import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, mkdirSync } from 'node:fs';

const base='http://127.0.0.1:4179/partners/tri-lift/';
const output='docs/partners/screenshots';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  for(const width of [320,390,768,1440]){
    const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
    const errors=[];
    const requests=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('request',request=>requests.push(request.url()));
    await page.goto(base);
    await page.waitForSelector('html[data-ready="true"]');
    assert.equal(await page.locator('.card').count(),4);
    assert.equal(await page.locator('.timeline-entry').count(),8);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
    for(const link of await page.locator('a[href^="#"]').all()){
      const target=await link.getAttribute('href');
      assert.equal(await page.locator(target).count(),1,target);
    }
    await page.locator('.timeline-entry summary').first().click();
    assert.equal(await page.locator('.timeline-entry').first().getAttribute('open'),'');
    await page.locator('.timeline-entry summary').first().click();
    const body=await page.locator('body').innerText();
    assert.ok(!body.includes('SP-ARDHI-26'));
    assert.ok(!body.includes('$465'));
    assert.ok(!requests.some(url=>url.includes('.private.json') || url.includes('/previews/') || url.endsWith('.pdf')));
    assert.deepEqual(errors,[]);
    if([390,1440].includes(width)){
      await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`${output}/tri-lift-${width}.png`,fullPage:true});
      await page.screenshot({path:`${output}/tri-lift-${width}-overview.png`});
    }
    await page.close();
  }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(base+'?internal=1');
  await page.waitForSelector('html[data-ready="true"]');
  assert.match(await page.locator('#project-list').innerText(),/SP-ARDHI-26 Delivery Support/);
  assert.match(await page.locator('#project-list').innerText(),/Pending/);
  assert.match(await page.locator('#quote-list').innerText(),/\$465\.00/);
  const documents=JSON.parse(readFileSync('partners/tri-lift/documents.json','utf8'));
  for(const doc of documents){
    const link=page.locator(`#doc-${doc.id} a`);
    const response=await page.request.get(new URL(await link.getAttribute('href'),base).href);
    assert.equal(response.status(),200,doc.id);
    assert.equal(createHash('sha256').update(await response.body()).digest('hex'),doc.sha256);
    const thumbnail=await page.request.get(new URL(doc.thumbnail,base).href);
    assert.equal(thumbnail.status(),200);
    assert.equal((await thumbnail.body()).subarray(1,4).toString(),'PNG');
  }
  assert.equal((await page.request.get('http://127.0.0.1:4179/.git/config')).status(),404);
  assert.equal((await page.request.get('http://127.0.0.1:4179/package.json')).status(),404);
  console.log('PASS: 320/390/768/1440 layout, anchors, timeline, sanitized requests, private project, 4 PDF links/hashes, 4 thumbnails, local server scope.');
} finally {await browser.close();}
