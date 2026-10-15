import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const endpoint='**/dashboard/api/public_media_equipment.php?*';
async function approved(page){if(!process.env.MEDIA_LIVE)await page.route(endpoint,async route=>{const response=await page.request.get('https://smashpro.app/dashboard/api/public_media_equipment.php?property=hq&asset=SP-MED-CAM-001');await route.fulfill({response});});}
for(const width of [390,768,1440])test(`media passport presentation ${width}`,async({page})=>{
 await approved(page);await page.setViewportSize({width,height:1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('h1')).toContainText('Capture the work.');
 const link=page.getByRole('link',{name:'Shop AKASO 360'});await expect(link).toHaveAttribute('rel','sponsored noopener noreferrer');
 expect(new URL(await link.getAttribute('href')).searchParams.get('awinaffid')).toBe('3121518');
 await expect(page.getByText('No kit is currently offered for sale or preorder.')).toBeVisible();
 await expect(page.locator('.media-passport__disclosure')).toContainText('at no additional cost to you');
 await expect(page.locator('.media-passport__visual img')).toBeVisible();
 await expect.poll(()=>page.locator('.media-passport__visual img').evaluate(e=>e.complete&&e.naturalWidth>0)).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(page.locator('header')).toHaveCount(1);await expect(page.locator('footer')).toHaveCount(1);
 await expect(page.locator('a[href*="garage"],a[href*="checkout"]')).toHaveCount(0);
 await link.focus();await expect(link).toBeFocused();expect(errors).toEqual([]);
 const dir='docs/release-captures/media-equipment';mkdirSync(dir,{recursive:true});await page.screenshot({path:`${dir}/${process.env.MEDIA_LIVE?'live':'local'}-${width}.png`,fullPage:true});
 await page.reload();await expect(page.locator('h1')).toContainText('Capture the work.',{timeout:25000});
});
test('API failure and publication withdrawal remove public details and purchase actions',async({page})=>{
 for(const status of [503,404]){await page.route(endpoint,route=>route.fulfill({status,json:{ok:false}}));await page.goto('/equipment/sp-med-cam-001.html');await expect(page.locator('h1')).toHaveText('Equipment passport unavailable');await expect(page.getByRole('link',{name:'Shop AKASO 360'})).toHaveCount(0);await page.unroute(endpoint);}
});
test('broken product image retains approved CTA with a stable fallback',async({page})=>{
 await approved(page);await page.route('https://www.awin1.com/cshow.php?*',route=>route.abort());await page.goto('/equipment/sp-med-cam-001.html');await expect(page.getByText('Product imagery unavailable')).toBeVisible();await expect(page.getByRole('link',{name:'Shop AKASO 360'})).toBeVisible();
});
