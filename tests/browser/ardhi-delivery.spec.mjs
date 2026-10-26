import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { shipmentFixture } from '../fixtures/shipment.mjs';

for (const width of [390, 768, 1440]) test(`delivery, history, media and keyboard access at ${width}px`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 950 });
  await page.route('**/api/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/equipment/sp-ardhi-26.html');
  await expect(page.locator('#ardhi-v2-title')).toContainText('Fleet Asset');
  await expect(page.locator('.ardhi-v2-hero')).toContainText('Arrived October 26, 2026');
  await expect(page.locator('#journey')).toContainText('R+L Carriers');
  await expect(page.locator('#journey')).toContainText('IACO468333');
  await expect(page.locator('#mission-dashboard')).toContainText('Receiving inspection');
  await expect(page.locator('#delivery-media img')).toHaveCount(5);
  await page.locator('#delivery-media').scrollIntoViewIfNeeded();
  for (const image of await page.locator('#delivery-media img').all()) { await image.scrollIntoViewIfNeeded(); await image.evaluate(image => image.decode()); }
  await expect.poll(() => page.locator('#delivery-media img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  await expect(page.locator('#watch-ardhi iframe')).toHaveCount(0);
  await expect(page.locator('#check-in')).toHaveAttribute('href', '/k/ARDHI26-K01/');
  await expect(page.locator('#commissioning-first-start')).toContainText('Pending');
  await expect(page.locator('#commissioning-delivery')).toContainText('Documented');
  await expect(page.locator('#commissioning-crate-opened')).toContainText('Documented');
  await expect(page.locator('#commissioning-accessories')).toContainText('Pending');
  await expect(page.locator('#service')).toContainText('Awaiting Commissioning');
  await page.locator('#commissioning-plan summary').click();
  await expect(page.locator('.ardhi-commissioning-plan > li')).toHaveCount(12);
  await expect(page.locator('#operator-preparation')).toContainText('not connected on this Passport');
  await page.locator('#commissioning-plan summary').click();
  const link = page.getByRole('link', { name: 'Read the delivery event', exact: true });
  await link.focus(); await expect(link).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('#history-future-5 details')).toHaveAttribute('open', '');
  await expect(page.locator('#history-future-5')).toContainText('Final-mile delivery complete');
  await expect(page.locator('#history-unboxing-20261026')).toContainText('Crate opened and panels removed');
  for (const id of ['history-production-complete', 'history-factory-departure', 'history-port-arrival']) await expect(page.locator(`#${id}`)).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const section of ['.ardhi-v2-hero', '#journey', '#delivery-media', '#service']) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.locator(section).locator('img').evaluateAll(async images => { await Promise.all(images.map(image => image.decode())); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
    mkdirSync(process.env.ARDHI_CAPTURE_DIR ?? 'tmp/ardhi-captures', { recursive: true });
    await page.locator(section).screenshot({ style: ".passport-rail, .skip-link { visibility: hidden !important; }", path: `${process.env.ARDHI_CAPTURE_DIR ?? 'tmp/ardhi-captures'}/${width}-${section.replace(/[.#]/g, '')}.png` });
  }
  expect(errors).toEqual([]);
});

test('historical Atlas feed cannot regress delivery; Expo QR experience stays available', async ({ page }) => {
  await page.route('**/api/**', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.route('**/api/fleet/shipment/SP-ARDHI-26', route => route.fulfill({ json: shipmentFixture({ unverified: true }) }));
  await page.goto('/equipment/sp-ardhi-26.html?expo=true');
  await expect(page.locator('.is-expo')).toHaveCount(1);
  await expect(page.locator('#journey')).toContainText('Final-mile delivery');
  await expect(page.locator('#mission-dashboard')).toContainText('Delivered');
  await page.locator('.ardhi-historical-logistics > summary').click();
  await expect(page.locator('#shipment-history')).toBeVisible();
  await expect(page.locator('#journey')).not.toContainText('Awaiting Customs');
  await expect(page.getByRole('button', { name: 'Exit Equip Expo mode' })).toBeVisible();
});
