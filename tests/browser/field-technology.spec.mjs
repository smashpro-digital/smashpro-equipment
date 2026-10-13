import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { approvedCatalog } from '../fixtures/field-technology.mjs';
const endpoint = '**/dashboard/api/public_gear.php?*';
const captures = 'docs/release-captures/akaso-field-technology';
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
  await page.goto('/equipment/');
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
  await page.goto('/equipment/'); await page.waitForTimeout(300);
  await expect(page.locator('#field-technology')).toHaveCount(0); await baseline(page);
});
test('revocation/API failure clears a previously approved card', async ({ page }) => {
  await page.clock.install(); let requests = 0;
  await page.route(endpoint, route => ++requests === 1 ? route.fulfill({ json: approvedCatalog() }) : route.fulfill({ status: 503, json: { ok: false } }));
  await page.goto('/equipment/'); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(15001); await expect(page.locator('#field-technology')).toHaveCount(0);
});
test('expiry removes the card without retaining stale approval', async ({ page }) => {
  await page.clock.install(); let requests = 0;
  await page.route(endpoint, route => {
    if (++requests > 1) return new Promise(() => {});
    const p = approvedCatalog(); p.items[0].products[0].links[0].valid_until = new Date(Date.now() + 2000).toISOString();
    return route.fulfill({ json: p });
  });
  await page.goto('/equipment/'); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(2100); await expect(page.locator('#field-technology')).toHaveCount(0);
});
for (const response of ['revoked','timeout']) test(`${response} clears a previously approved card`, async ({ page }) => {
  await page.clock.install(); let requests = 0;
  await page.route(endpoint, route => {
    if (++requests === 1) return route.fulfill({ json: approvedCatalog() });
    if (response === 'timeout') return new Promise(() => {});
    const p = approvedCatalog(); p.items = []; return route.fulfill({ json: p });
  });
  await page.goto('/equipment/'); await expect(page.locator('#field-technology')).toBeVisible();
  await page.clock.fastForward(15001);
  await expect.poll(() => requests).toBe(2);
  if (response === 'timeout') await page.clock.fastForward(5001);
  await expect(page.locator('#field-technology')).toHaveCount(0);
});
