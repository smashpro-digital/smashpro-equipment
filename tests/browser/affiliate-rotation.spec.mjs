import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { rotationCatalog } from '../fixtures/affiliate-rotation.mjs';
const endpoint = '**/dashboard/api/public_gear.php?*';
async function setup(page, count = 5, patch = p => p) {
  const events = [];
  await page.route(endpoint, route => route.fulfill({ json: patch(rotationCatalog(count)) }));
  await page.route('**/dashboard/api/affiliate_creative_event.php', route => { events.push(route.request().postDataJSON()); return route.fulfill({ status: 202, json: { ok: true } }); });
  await page.route('https://www.awin1.com/cshow.php?*', route => {
    const id = new URL(route.request().url()).searchParams.get('s');
    return route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="2160" height="2700"><rect width="2160" height="2700" fill="#193e32"/><text x="100" y="400" font-size="130" fill="white">AKASO fixture ${id}</text></svg>` });
  });
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#field-technology')).toBeVisible();
  return events;
}
test('five banners rotate at eight seconds; primary product and tracking stay fixed', async ({ page }) => {
  const events = await setup(page);
  const banner = page.locator('.affiliate-rotator'); await banner.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0);
  await expect(banner.locator('img')).toHaveAttribute('alt', /banner 1/);
  await page.waitForTimeout(9200);
  await expect(banner.locator('img')).toHaveAttribute('alt', /banner 2/);
  const height = (await banner.boundingBox()).height;
  await banner.getByRole('button', { name: 'Next affiliate banner' }).click();
  await expect(banner.locator('img')).toHaveAttribute('alt', /banner 3/);
  await page.waitForTimeout(17000); await expect(banner.locator('img')).toHaveAttribute('alt', /banner 3/);
  await expect(banner.locator('a')).toHaveAttribute('href', 'https://www.awin1.com/cread.php?s=9000002&v=69454&q=542867&r=3121518');
  await expect(page.locator('.field-technology__visual img')).toHaveAttribute('src', /s=4587303&/);
  expect((await banner.boundingBox()).height).toBe(height);
  expect(events.some(e => e.event === 'impression')).toBe(true);
  expect(events.some(e => e.event === 'click')).toBe(false);
  await banner.getByRole('button', { name: 'Play affiliate banners' }).click();
  await page.evaluate(() => document.activeElement?.blur()); await page.mouse.move(0, 0);
  await page.waitForTimeout(8500); await expect(banner.locator('img')).toHaveAttribute('alt', /banner 4/);
});
test('offscreen and reduced motion pause; manual navigation remains available', async ({ page }) => {
  await page.clock.install(); await setup(page); const banner = page.locator('.affiliate-rotator');
  await page.clock.runFor(16000); await expect(banner.locator('img')).toHaveAttribute('alt', /banner 1/);
  await page.emulateMedia({ reducedMotion: 'reduce' }); await banner.scrollIntoViewIfNeeded(); await page.clock.runFor(16000);
  await expect(banner.locator('img')).toHaveAttribute('alt', /banner 1/);
  await expect(banner.getByText('Motion paused')).toBeDisabled();
  await banner.getByRole('button', { name: 'Next affiliate banner' }).click(); await expect(banner.locator('img')).toHaveAttribute('alt', /banner 2/);
});
for (const count of [0, 1]) test(`${count} active creatives preserves product showcase`, async ({ page }) => {
  await setup(page, count); await expect(page.getByRole('link', { name: 'Explore AKASO 360' })).toBeVisible();
  await expect(page.locator('.affiliate-rotator img')).toHaveCount(count);
  await expect(page.locator('.affiliate-rotator button')).toHaveCount(0);
});
test('expired creative is absent', async ({ page }) => {
  await setup(page, 2, p => { p.items[0].products[0].creatives[0].valid_until = new Date(0).toISOString(); return p; });
  await expect(page.locator('.affiliate-rotator img')).toHaveAttribute('alt', /banner 2/);
});
test('broken image fallback preserves frame and main CTA', async ({ page }) => {
  await setup(page, 1); await page.route('https://www.awin1.com/cshow.php?s=9000000*', route => route.abort()); await page.reload();
  const banner = page.locator('.affiliate-rotator'); await banner.scrollIntoViewIfNeeded();
  await expect(banner).toContainText('Banner unavailable'); expect((await banner.locator('.affiliate-rotator__frame').boundingBox()).height).toBeGreaterThanOrEqual(260);
  await expect(page.getByRole('link', { name: 'Explore AKASO 360' })).toHaveCount(1);
});
test('unavailable API fails closed and preserves Equipment layout', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ status: 503, json: { ok: false } })); await page.goto('/equipment/');
  await expect(page.locator('#field-technology')).toHaveCount(0); await expect(page.locator('#rental-process')).toHaveCount(1); await expect(page.locator('#contractors')).toHaveCount(1);
});
test('Garage catalog cannot publish', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: { ...rotationCatalog(), property: 'garage' } })); await page.goto('/equipment/'); await expect(page.locator('#field-technology')).toHaveCount(0);
});
test('click records creative assignment while preserving direct Awin navigation', async ({ page }) => {
  const events = await setup(page, 1); await page.route('https://www.awin1.com/cread.php?*', route => route.fulfill({ body: 'Synthetic destination' }));
  const banner = page.locator('.affiliate-rotator'); await banner.scrollIntoViewIfNeeded();
  const popup = page.waitForEvent('popup'); await banner.locator('a').click(); const tab = await popup; await tab.close();
  await expect.poll(() => events.filter(e => e.event === 'click').length).toBe(1); expect(events.find(e => e.event === 'click').assignment_id).toBe(1);
});
for (const width of [390, 1440]) test(`responsive rotation at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 }); await page.emulateMedia({ reducedMotion: 'reduce' }); await setup(page, 5);
  const section = page.locator('#field-technology'); await section.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.evaluate(() => { const a = document.querySelector('#rental-process'), b = document.querySelector('#field-technology'), c = document.querySelector('#contractors'); return Boolean(a.compareDocumentPosition(b) & 4) && Boolean(b.compareDocumentPosition(c) & 4); })).toBe(true);
  for (const button of await page.locator('.affiliate-rotator button').all()) expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await expect(section).toContainText('may earn a commission'); await expect(section.getByRole('link', { name: 'Watch SmashPro Equipment' })).toHaveCount(1);
  const box = await section.boundingBox(); await page.setViewportSize({ width, height: Math.ceil(box.height + 200) }); await section.scrollIntoViewIfNeeded();
  mkdirSync('docs/release-captures/affiliate-rotation', { recursive: true }); await section.screenshot({ path: `docs/release-captures/affiliate-rotation/local-fixture-${width}.png` });
});
