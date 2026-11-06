import {test,expect} from '@playwright/test';import {mkdirSync} from 'node:fs';
for(const width of [360,390,768,1440])test(`bucket passport ${width}px`,async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setViewportSize({width,height:950});
 const response=await page.goto('/equipment/attachments/sp-att-bkt-001/');expect(response.status()).toBe(200);
 await expect(page.locator('h1')).toHaveText('ARDHI General-Purpose Bucket #1');
 const identity=page.locator('.attachment-passport-hero + .section .spec-grid');
 await expect(identity.locator('dt')).toHaveCount(6);
 await expect(identity).not.toContainText('Manufacturer');
 await expect(identity).not.toContainText('Model');
 await expect(page.locator('main')).not.toContainText('Not assigned');
 await expect(page.locator('.bucket-passport-hero img')).toHaveAttribute('src','https://smashpro.app/wp-content/uploads/2026/11/20261031_131720.jpg');
 await expect.poll(()=>page.locator('.bucket-passport-hero img').evaluate(i=>i.complete&&i.naturalWidth>0),{timeout:20000}).toBe(true);
 await expect(page.locator('.bucket-upgrade')).toHaveCount(1);await expect(page.locator('.bucket-upgrade-state').last()).toHaveText('ordered');
 await expect(page.locator('.bucket-upgrade')).toContainText('6684447');await expect(page.locator('.bucket-upgrade')).toContainText('$107.99');
 await expect(page.locator('.bucket-upgrade-timeline .is-completed')).toHaveCount(2);await expect(page.locator('.bucket-upgrade-timeline [aria-current="step"]')).toContainText('Delivery pending verification');
 await expect(page.locator('.bucket-upgrade-timeline .is-upcoming')).toHaveCount(5);await expect(page.locator('iframe')).toHaveCount(0);
 await expect(page.getByRole('link',{name:'Read the six-tooth upgrade journal'})).toHaveAttribute('href','https://smashpro.app/ardhi-six-tooth-bucket-upgrade/');
 for(const section of await page.locator('main>section').all()){await section.scrollIntoViewIfNeeded();await expect(section).toHaveClass(/is-revealed/);}
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
 const dir=process.env.BUCKET_CAPTURE_DIR ?? (process.env.BUCKET_LIVE?'local-notes/live-bucket':'docs/release-captures/bucket-v2');mkdirSync(dir,{recursive:true});
 await page.screenshot({path:`${dir}/bucket-${width}.png`,fullPage:true});await page.locator('.bucket-passport-hero').screenshot({path:`${dir}/hero-${width}.png`});
 await page.reload();await expect(page.locator('.bucket-upgrade')).toHaveCount(1);
});
