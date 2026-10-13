import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { approvedCatalog } from '../fixtures/field-technology.mjs';
const endpoint = '**/dashboard/api/public_gear.php?*';
const captures = 'docs/release-captures/akaso-field-technology';
const creative = { id: 1, creative_id: '4587303', url: 'https://www.awin1.com/cshow.php?s=4587303&v=69454&q=542867&r=3121518', width: 2160, height: 2700, alt: 'AKASO 360 action camera, front and rear views. Your First 360 Action Cam.' };
for (const width of [390, 768, 1440]) test(`reviewed visual local fixture at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1100 });
  await page.route(endpoint, route => { const payload = approvedCatalog(); payload.items[0].products[0].image = creative; return route.fulfill({ json: payload }); });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('#field-technology'), image = section.locator('img');
  await section.scrollIntoViewIfNeeded(); await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth === 2160)).toBe(true);
  expect(await image.evaluate(el => getComputedStyle(el).objectFit)).toBe('contain');
  const box = await image.boundingBox(); expect(Math.abs(box.width / box.height - .8)).toBeLessThan(.01);
  await expect(section.getByRole('link', { name: 'Watch SmashPro Equipment' })).toHaveAttribute('href', 'https://www.youtube.com/@SmashProHQ');
  for (const link of await section.getByRole('link').all()) { await link.focus(); await expect(link).toBeFocused(); expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44); }
  await expect(section).toContainText('may earn a commission'); await baseline(page); expect(errors).toEqual([]);
  const before = await section.boundingBox(); await page.waitForTimeout(500); const after = await section.boundingBox(); expect(after.height).toBe(before.height);
  await page.evaluate(() => document.activeElement?.blur());
  await page.setViewportSize({ width, height: Math.ceil(after.height + 200) });
  await section.evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 100));
  await image.evaluate(el => el.decode());
  await page.waitForTimeout(300);
  mkdirSync('docs/release-captures/akaso-premium', { recursive: true });
  await section.screenshot({ path: `docs/release-captures/akaso-premium/local-fixture-${width}.png` });
});
test('failed creative download keeps dimensions and approved actions available', async ({ page }) => {
  await page.route(endpoint, route => { const payload = approvedCatalog(); payload.items[0].products[0].image = creative; return route.fulfill({ json: payload }); });
  await page.route('https://www.awin1.com/cshow.php?*', route => route.abort());
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' }); const section = page.locator('#field-technology'); await section.scrollIntoViewIfNeeded();
  await expect(section.getByText('Product image unavailable')).toBeVisible(); await expect(section.locator('img')).toHaveCount(0);
  await expect(section.getByRole('link', { name: 'Explore AKASO 360' })).toBeVisible();
  expect((await section.locator('figure').boundingBox()).height).toBeGreaterThan(200);
});
async function baseline(page) {
  await expect(page.locator('#fleet .equipment-card')).toHaveCount(4);
  for (const id of ['passports','attachments','fabrication','development','rental-process','contractors']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  expect(await page.locator('a[href="/gear/"],a[href="https://smashpro.app/gear/"]').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}
for (const width of [390, 1440]) test(`approved local fixture at ${width}`, async ({ page }) => {
  const errors = [], thirdParty = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (/awin|shopakaso|tidd\.ly/.test(r.url())) thirdParty.push(r.url()); });
  await page.setViewportSize({ width, height: 1000 });
  await page.route(endpoint, route => { expect(route.request().url()).toContain('property=hq&placement=equipment.field-technology.akaso360'); return route.fulfill({ json: approvedCatalog() }); });
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('#field-technology'); await expect(section).toBeVisible();
  expect(await section.evaluate(el => [el.previousElementSibling.id, el.nextElementSibling.id])).toEqual(['rental-process','contractors']);
  const link = section.getByRole('link', { name: 'Explore AKASO 360' });
  await expect(link).toHaveAttribute('rel', 'sponsored noopener noreferrer');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(section).toContainText('at no additional cost to you');
  await link.focus(); await expect(link).toBeFocused();
  await baseline(page);
  await section.scrollIntoViewIfNeeded(); mkdirSync(captures, { recursive: true });
  await page.screenshot({ path: `${captures}/approved-fixture-${width}.png` });
  expect(errors).toEqual([]); expect(thirdParty).toEqual([]);
});
for (const scenario of ['503','network','malformed','empty','garage','stale','unapproved-link']) test(`fails closed: ${scenario}`, async ({ page }) => {
  await page.route(endpoint, route => {
    if (scenario === '503') return route.fulfill({ status: 503, json: { ok: false } });
    if (scenario === 'network') return route.abort();
    if (scenario === 'malformed') return route.fulfill({ contentType: 'application/json', body: '{invalid' });
    const p = approvedCatalog();
    if (scenario === 'empty') p.items = [];
    if (scenario === 'garage') p.property = 'garage';
    if (scenario === 'stale') p.generated_at = '2020-01-01T00:00:00Z';
    if (scenario === 'unapproved-link') p.items[0].products[0].links = [];
    return route.fulfill({ json: p });
  });
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(300);
  await expect(page.locator('#field-technology')).toHaveCount(0); await baseline(page);
});
test('revocation/API failure clears a previously approved card', async ({ page }) => {
  await page.clock.install(); let requests = 0;
  await page.route(endpoint, route => ++requests === 1 ? route.fulfill({ json: approvedCatalog() }) : route.fulfill({ status: 503, json: { ok: false } }));
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' }); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(15001); await expect(page.locator('#field-technology')).toHaveCount(0);
});
test('expiry removes the card without retaining stale approval', async ({ page }) => {
  const now = Date.now();
  await page.clock.install({ time: now - 60000 });
  await page.clock.pauseAt(now);
  let requests = 0;
  await page.route(endpoint, route => {
    if (++requests > 1) return new Promise(() => {});
    const p = approvedCatalog(now); p.items[0].products[0].links[0].valid_until = new Date(now + 2000).toISOString();
    return route.fulfill({ json: p });
  });
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' }); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(2100); await expect(page.locator('#field-technology')).toHaveCount(0);
});
for (const response of ['revoked','timeout']) test(`${response} clears a previously approved card`, async ({ page }) => {
  await page.clock.install(); let requests = 0;
  await page.route(endpoint, route => {
    if (++requests === 1) return route.fulfill({ json: approvedCatalog() });
    if (response === 'timeout') return new Promise(() => {});
    const p = approvedCatalog(); p.items = []; return route.fulfill({ json: p });
  });
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' }); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(15001);
  await expect.poll(() => requests).toBe(2);
  if (response === 'timeout') await page.clock.fastForward(5001);
  await expect(page.locator('#field-technology')).toHaveCount(0);
});
