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
  await expect(page.locator('#field-technology')).toBeVisible({ timeout: 30000 });
  return events;
}
// Equipment intentionally does not render the reusable advertiser rotator.
// Keep catalog creatives and their infrastructure available to other approved placements.
for (const count of [0, 1, 5]) test(`${count} approved creatives never adds a slideshow`, async ({ page }) => {
  const events = await setup(page, count);
  const section = page.locator('#field-technology');
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator('img')).toHaveCount(1);
  await expect(section.locator('.field-technology__visual img')).toHaveAttribute('src', /s=4587303&/);
  await expect(page.locator('.affiliate-rotator')).toHaveCount(0);
  await expect(section.getByRole('button')).toHaveCount(0);
  await expect(section.getByRole('link', { name: 'Explore AKASO 360' })).toHaveAttribute('href', rotationCatalog().items[0].products[0].links[0].url);
  await page.waitForTimeout(8500);
  expect(events).toEqual([]);
  await expect(section.locator('img')).toHaveCount(1);
  expect(await section.evaluate(el => el.lastElementChild.classList.contains('field-technology__card'))).toBe(true);
});
for (const scenario of ['unavailable', 'garage']) test(`${scenario} catalog fails closed`, async ({ page }) => {
  await page.route(endpoint, route => scenario === 'unavailable'
    ? route.fulfill({ status: 503, json: { ok: false } })
    : route.fulfill({ json: { ...rotationCatalog(), property: 'garage' } }));
  await page.goto('/equipment/');
  await expect(page.locator('#field-technology')).toHaveCount(0);
  await expect(page.locator('#rental-process')).toHaveCount(1);
  await expect(page.locator('#contractors')).toHaveCount(1);
});
for (const width of [390, 1440]) test(`single premium showcase at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1100 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await setup(page);
  const section = page.locator('#field-technology');
  await section.scrollIntoViewIfNeeded();
  await expect(section).toContainText('Every Angle.');
  await expect(section).toContainText('Exploring');
  await expect(section).toContainText('may earn a commission');
  await expect(section.getByRole('link', { name: 'Explore AKASO 360' })).toHaveAttribute('rel', 'sponsored noopener noreferrer');
  await expect(section.getByRole('link', { name: 'Watch SmashPro Equipment' })).toHaveAttribute('href', 'https://www.youtube.com/@SmashProHQ');
  await expect(section.locator('img')).toHaveCount(1);
  await expect(page.locator('.affiliate-rotator')).toHaveCount(0);
  expect(await section.evaluate(el => [el.previousElementSibling.id, el.nextElementSibling.id])).toEqual(['rental-process', 'contractors']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('#fleet .equipment-card')).toHaveCount(4);
  for (const id of ['passports', 'attachments', 'fabrication', 'development', 'rental-process', 'contractors']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  await expect(page.locator('footer')).toHaveCount(1);
  const box = await section.boundingBox();
  await page.setViewportSize({ width, height: Math.ceil(box.height + 200) });
  await section.scrollIntoViewIfNeeded();
  mkdirSync('docs/release-captures/akaso-refinement', { recursive: true });
  await section.screenshot({ path: `docs/release-captures/akaso-refinement/local-fixture-${width}.png` });
});
