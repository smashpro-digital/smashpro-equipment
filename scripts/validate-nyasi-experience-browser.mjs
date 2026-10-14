import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdirSync,writeFileSync } from 'node:fs';
const base=process.env.EQUIPMENT_PREVIEW_URL??'http://127.0.0.1:5196/equipment';
const out='tmp/nyasi-experience';mkdirSync(out,{recursive:true});const browser=await chromium.launch();const results=[];
try {
 for(const width of [360,375,390,412,430,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/**',route=>route.abort()); // Public Passport must survive optional backend failure.
  await page.goto(base+'/sp-nyasi-26.html',{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').innerText(),'NYASI');assert.equal(await page.locator('.passport-journey li').count(),10);
  assert.doesNotMatch(await page.locator('.nyasi-passport').textContent(),/\$\d|1,565|2,165/);
  assert.equal(await page.locator('iframe,video').count(),0);
  assert.equal(await page.locator('.nyasi-related [data-fleet-id]').count(),2);
  assert.equal(await page.locator('.nyasi-related [data-fleet-id="SP-UMBA-26"]').count(),0);
  for(const a of await page.locator('.passport-journey a').all()) {await a.click();const id=await a.getAttribute('href');assert.equal(await page.locator(id).count(),1);if(await page.locator(id).evaluate(e=>e.tagName==='DETAILS'))assert.equal(await page.locator(id).getAttribute('open'),'');}
  await page.locator('.nyasi-accordion').evaluateAll(es=>es.forEach(e=>e.open=false));
  await page.locator('#configuration summary').click();assert.equal(await page.locator('#configuration').getAttribute('open'),'');await page.locator('#configuration summary').click();
  const quote=new URL(await page.locator('#work-with-nyasi .button').getAttribute('href'));assert.equal(quote.searchParams.get('equipment_source'),'SP-NYASI-26');assert.equal(quote.searchParams.has('customer_id'),false);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);assert.deepEqual(errors,[]);
  await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
  for(const id of ['#evidence','#related-equipment']){await page.locator(id).scrollIntoViewIfNeeded();await page.waitForTimeout(250);}
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(300);
  await page.screenshot({path:`${out}/after-${width}.png`,fullPage:true});
  if([390,1440].includes(width)){await page.screenshot({path:`${out}/hero-${width}.png`});for(const id of ['evidence','work-with-nyasi','technical']){await page.locator('#'+id).scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${id}-${width}.png`});}}
  results.push({width,anonymous:true,apiFailure:true,overflow:false,journeyEvidence:true,privatePricing:false,errors});await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 for(const path of ['/','/sp-ardhi-26.html','/sp-mzigo-26.html','/catalog/','/attachments/sp-att-bkt-001/']){const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);assert.doesNotMatch(await page.locator('h1').innerText(),/not found/i);results.push({route:path,status:response.status()});}
 await page.close();
 writeFileSync(out+'/validation.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close()}

