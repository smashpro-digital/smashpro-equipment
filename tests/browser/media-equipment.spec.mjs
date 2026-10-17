import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
import {creatorKitFixture} from '../fixtures/creator-kit.mjs';
import {showcaseFixture} from '../fixtures/media-showcase.mjs';
const endpoint='**/dashboard/api/public_media_equipment.php?*';
test('homepage preserves the showcase and discovers the media passport',async({page})=>{
 if(!process.env.MEDIA_LIVE)await page.route('**/dashboard/api/public_gear.php?*',async route=>{const response=await page.request.get('https://smashpro.app/dashboard/api/public_gear.php?property=hq&placement=equipment.field-technology.akaso360');await route.fulfill({response});});
 await page.goto('/equipment/',{waitUntil:'domcontentloaded'});
 const section=page.locator('#field-technology');await expect(section).toBeVisible({timeout:25000});
 await expect(section.getByRole('link',{name:'Explore the camera passport'})).toHaveAttribute('href','/equipment/sp-med-cam-001.html');
 await expect(section.getByRole('link',{name:'Explore AKASO 360',exact:true})).toHaveAttribute('rel','sponsored noopener noreferrer');
 expect(await section.evaluate(e=>[e.previousElementSibling.id,e.nextElementSibling.id])).toEqual(['rental-process','contractors']);
 for(const id of ['fleet','passports','attachments','fabrication','development','rental-process','contractors'])await expect(page.locator(`#${id}`)).toHaveCount(1);
});
async function approved(page){if(!process.env.MEDIA_LIVE)await page.route(endpoint,route=>route.fulfill({json:showcaseFixture()}));}
for(const width of [390,768,1024,1440])test(`media passport presentation ${width}`,async({page})=>{
 await approved(page);await page.setViewportSize({width,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('h1')).toContainText('Capture the work.');
 const link=page.getByRole('link',{name:'Shop AKASO 360'}).first();await expect(link).toHaveAttribute('rel','sponsored noopener noreferrer');
 expect(new URL(await link.getAttribute('href')).searchParams.get('awinaffid')).toBe('3121518');
 await expect(page.getByText('No kit is currently offered for sale or preorder.')).toBeVisible();
 await expect(page.locator('.media-passport__disclosure').first()).toContainText('at no additional cost to the buyer');
 await expect(page.locator('.media-passport__visual > img')).toBeVisible();
 await expect.poll(()=>page.locator('.media-passport__visual > img').evaluate(e=>e.complete&&e.naturalWidth>0),{timeout:20000}).toBe(true);
 const hero=page.locator('.media-passport__hero');
 await expect(hero.locator('img')).toHaveCount(1);
 await expect(hero.locator('.field-video,.media-passport__field-detail')).toHaveCount(0);
 const imageBox=await hero.locator('img').boundingBox();
 expect(imageBox.height/imageBox.width).toBeCloseTo(1.25,1);
 const heroBox=await hero.boundingBox(),unboxingBox=await page.locator('#unboxing').boundingBox();
 expect(unboxingBox.y).toBeGreaterThanOrEqual(heroBox.y+heroBox.height);
 const headlineSize=await hero.locator('h1').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
 expect(headlineSize).toBeCloseTo(Math.max(44.8,Math.min(width*.054,88)),1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('header')).toHaveCount(1);await expect(page.locator('footer')).toHaveCount(1);
 await expect(page.locator('a[href*="garage"],a[href*="checkout"]')).toHaveCount(0);
 await link.focus();await expect(link).toBeFocused();expect(errors).toEqual([]);
 const dir=process.env.MEDIA_CAPTURE_DIR||'docs/release-captures/akaso-passport-showcase';mkdirSync(dir,{recursive:true});await page.screenshot({path:`${dir}/${process.env.MEDIA_LIVE?'live':'local'}-${width}.png`,fullPage:true});
 await page.reload();await expect(page.locator('h1')).toContainText('Capture the work.',{timeout:25000});
});
test('API failure and publication withdrawal remove public details and purchase actions',async({page})=>{
 for(const status of [503,404]){await page.route(endpoint,route=>route.fulfill({status,json:{ok:false}}));await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('h1')).toHaveText('Equipment passport unavailable');await expect(page.getByRole('link',{name:'Shop AKASO 360'})).toHaveCount(0);await page.unroute(endpoint);}
});
test('broken product image retains approved CTA with a stable fallback',async({page})=>{
 await approved(page);await page.route('https://www.awin1.com/cshow.php?*',route=>route.abort());await page.goto('/equipment/sp-med-cam-001.html');await expect(page.getByText('Product imagery unavailable')).toBeVisible();await expect(page.getByRole('link',{name:'Shop AKASO 360'}).first()).toBeVisible();
});

test('video players require consent and preserve vertical frames and separate attribution',async({page})=>{
 await approved(page);const youtube=[];page.on('request',r=>{if(r.url().includes('youtube-nocookie'))youtube.push(r.url());});
 await page.route('https://www.youtube-nocookie.com/**',route=>route.fulfill({contentType:'text/html',body:'<html><body>Mock official player</body></html>'}));
 await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('#unboxing')).toBeVisible();await expect(page.locator('iframe')).toHaveCount(0);expect(youtube).toEqual([]);
 const play=page.getByRole('button',{name:'Load YouTube video: AKASO 360 Creator Combo Unboxing'});await play.focus();await page.keyboard.press('Enter');const frame=page.locator('iframe');await expect(frame).toHaveAttribute('src','https://www.youtube-nocookie.com/embed/UfznEcnYz5k?playsinline=1');await expect(frame).toHaveAttribute('allowfullscreen','');const box=await frame.boundingBox();expect(Math.abs(box.width/box.height-9/16)).toBeLessThan(.01);
 expect(await page.evaluate(()=>window.dataLayer.some(e=>e.event==='media_video_load'&&e.video_id==='UfznEcnYz5k'))).toBe(true);await expect(page.getByRole('link',{name:'Watch on YouTube'})).toHaveCount(2);
});
test('media and affiliate withdrawal do not fabricate substitute content',async({page})=>{
 await page.route(endpoint,route=>{const v=showcaseFixture();v.passport.catalog=[];v.passport.footage=v.passport.footage.map(x=>({...x,approval_status:'draft'}));return route.fulfill({json:v});});
 await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('h1')).toContainText('Capture the work.');await expect(page.locator('#unboxing')).toHaveCount(0);await expect(page.getByRole('link',{name:'Shop AKASO 360'})).toHaveCount(0);await expect(page.getByRole('button',{name:/Load YouTube/})).toHaveCount(0);
});

for(const width of [390,768,1440])test('Creator Kit grid and approved-image preview '+width,async({page})=>{
 await page.setViewportSize({width,height:1000});
 await page.route(endpoint,r=>r.fulfill({json:creatorKitFixture(Date.now(),true)}));
 await page.goto('/equipment/sp-med-cam-001.html');
 const kit=page.locator('#field-kit');await expect(kit.locator('.creator-kit-card')).toHaveCount(7);
 await expect(kit.getByText('IN OUR KIT',{exact:true})).toHaveCount(7);
 const carryingCase=kit.locator('.creator-kit-card').filter({has:page.getByRole('heading',{name:'AKASO 360 carrying case',exact:true})});
 await expect(carryingCase.getByText('IN OUR KIT',{exact:true})).toBeVisible();
 await expect(carryingCase.getByText('Purchased separately',{exact:true})).toBeVisible();
 await expect(carryingCase.getByRole('link',{name:/View on Amazon/})).toHaveAttribute('href','https://a.co/d/01Lk7JHj');
 await expect(carryingCase.getByText('Retailer link / Non-affiliate',{exact:true})).toBeVisible();
 await expect(carryingCase.locator('a')).not.toHaveAttribute('rel',/sponsored/);
 for(const img of await kit.locator('img').all()){await img.scrollIntoViewIfNeeded();await expect.poll(()=>img.evaluate(e=>e.complete&&e.naturalWidth>0),{timeout:20000}).toBe(true);}
 await expect(kit.locator('a[rel*="sponsored"]')).toHaveCount(1);
 await expect(kit.getByRole('link',{name:/View details/})).toHaveCount(3);
 await expect(kit.getByText('Product image unavailable',{exact:true})).toHaveCount(2);
 for(const link of await kit.locator('a').all()){await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel',/noopener/);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const boxes=await kit.locator('.creator-kit-card').evaluateAll(nodes=>nodes.map(n=>({x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width})));
 expect(new Set(boxes.map(b=>Math.round(b.x))).size).toBe(width===390?1:width===768?2:3);
 expect(Math.max(...boxes.map(b=>b.width))-Math.min(...boxes.map(b=>b.width))).toBeLessThan(1);
 await expect(page.getByRole('button',{name:/Load YouTube video/})).toHaveCount(2);
});
test('Creator Kit pending rights, image failure and nonavailable lifecycle fall back safely',async({page})=>{
 const value=creatorKitFixture();value.passport.field_kit[1].lifecycle='Prototype';
 await page.route(endpoint,r=>r.fulfill({json:value}));
 await page.route('https://www.awin1.com/cshow.php?*',r=>r.abort());
 await page.goto('/equipment/sp-med-cam-001.html');
 const kit=page.locator('#field-kit');await expect(kit.locator('.creator-kit-card')).toHaveCount(7);
 await kit.scrollIntoViewIfNeeded();await expect(kit.getByText('Product image unavailable',{exact:true})).toHaveCount(7);
 await expect(kit.locator('.creator-kit-card').nth(1).locator('a')).toHaveCount(0);
 await expect(kit.locator('.creator-kit-card').nth(1).getByText('IN OUR KIT',{exact:true})).toHaveCount(0);
 await expect(kit.getByText('DESIGNED BY SMASHPRO',{exact:true})).toHaveCount(0);
});
