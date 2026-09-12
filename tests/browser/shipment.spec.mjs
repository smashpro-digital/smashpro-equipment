import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { shipmentFixture } from '../fixtures/shipment.mjs';
const endpoint = '**/api/fleet/shipment/SP-ARDHI-26';
async function open(page, fixture, width = 1440) {
  await page.setViewportSize({ width, height: 1000 });
  await page.route('**/tech_companion.php*', route => route.fulfill({ json: { ok: true, documents: [] } }));
  await page.route('**/api/customer/catalog.php*', route => route.fulfill({ json: { ok: true, services: [] } }));
  await page.route(endpoint, route => fixture ? route.fulfill({ json: fixture }) : route.fulfill({ status: 503, body: 'unavailable' }));
  await page.goto('/equipment/sp-ardhi-26.html');
  await page.locator('#journey').scrollIntoViewIfNeeded();
  await expect(page.locator('.shipment-status-line')).not.toContainText('Checking shipment');
}
async function capture(page, name, fixture = false) {
  await mkdir('tmp/shipment-captures', { recursive: true });
  if (fixture) await page.locator('#journey').evaluate(section => {
    const label = document.createElement('p'); label.textContent = 'SYNTHETIC TEST FIXTURE — NOT ACTUAL SHIPMENT EVIDENCE'; label.style.cssText = 'padding:12px;background:#332912;color:#ffe3a5;text-align:center;font:12px sans-serif'; section.prepend(label);
  });
  // Exclude fixed page chrome from section-only captures; interaction checks use the normal page.
  await page.locator('#journey').screenshot({ path: `tmp/shipment-captures/${name}.png`, style: '.mini-passport,.now-viewing,.skip-link{visibility:hidden!important}' });
}
test('desktop API unavailable preserves archive and shows no fabricated route', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, null);
  await expect(page.locator('.shipment-status-line')).toContainText('Shipment update unavailable.');
  await expect(page.locator('.shipment-map-empty')).toContainText('Awaiting a verified location');
  await expect(page.locator('.shipment-imagery-empty')).toContainText('No approved satellite observation available');
  await expect(page.locator('.shipment-marker')).toHaveCount(0);
  await expect(page.locator('#history-factory-departure')).toBeAttached();
  await expect(page.locator('#history-export-crate')).toBeAttached();
  await expect(page.locator('#history-freight-forwarder')).toBeAttached();
  await expect(page.locator('main')).not.toContainText('EVER MAX');
  await expect(page.locator('main')).not.toContainText('0 media · 0 documents');
  await capture(page, 'desktop-unavailable'); assertNoErrors(errors);
});
function assertNoErrors(errors) { expect(errors).toEqual([]); }
test('an already-open unavailable passport recovers on its automatic retry', async ({ page }) => {
  await page.clock.install();
  await open(page, null);
  await expect(page.locator('.shipment-status-line')).toContainText('Shipment update unavailable.');
  await page.unroute(endpoint);
  await page.route(endpoint, route => route.fulfill({ json: shipmentFixture({ unverified: true }) }));
  await page.clock.fastForward(60001);
  await expect(page.locator('.shipment-status-line')).toContainText('Ocean departure awaiting confirmation');
  await expect(page.locator('.shipment-marker.vessel')).toHaveCount(0);
});
test('narrow mobile unverified record has no overflow and keyboard can refresh', async ({ page }) => {
  await open(page, shipmentFixture({ unverified: true }), 390);
  await expect(page.locator('.shipment-status-line')).toContainText('Ocean departure awaiting confirmation');
  await expect(page.locator('.shipment-status-line')).not.toContainText('Verified shipment record');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const refresh = page.getByRole('button', { name: 'Refresh update' }); await refresh.focus(); await expect(refresh).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('.shipment-status-line')).toContainText('Ocean departure awaiting confirmation');
  await capture(page, 'mobile-unverified', true);
});
test('stale position uses static marker, projected route and linked port/AIS records', async ({ page }) => {
  await open(page, shipmentFixture({ stale: true }));
  await expect(page.locator('.shipment-map-summary')).toContainText('Last known vessel position');
  await expect(page.locator('.shipment-marker.vessel')).toBeVisible();
  const before = await page.locator('.shipment-marker.vessel').getAttribute('style');
  await expect(page.locator('.shipment-map-legend')).toContainText('Projected / reported route');
  await page.getByRole('link', { name: 'View port-call record' }).click();
  await expect(page.locator('#shipment-event-fixture-port details')).toHaveAttribute('open', '');
  await page.locator('#shipment-event-fixture-port summary').focus(); await page.keyboard.press('Escape');
  await expect(page.locator('#shipment-event-fixture-port details')).not.toHaveAttribute('open', '');
  await page.locator('#journey').scrollIntoViewIfNeeded();
  expect(await page.locator('.shipment-marker.vessel').getAttribute('style')).toBe(before);
  await capture(page, 'desktop-stale-fixture', true);
});
test('satellite panel separates capture time from AIS and never identifies regional image', async ({ page }) => {
  const fixture = shipmentFixture({ satellite: true });
  await page.route('https://example.com/test-image.png', route => route.fulfill({ status: 404, body: 'No actual imagery used in test' }));
  await open(page, fixture, 390);
  await page.locator('#shipment-event-fixture-departure summary').click();
  await expect(page.locator('.shipment-satellite')).toContainText('Regional satellite imagery — vessel not independently identified');
  await expect(page.locator('.shipment-satellite')).toContainText('Captured'); await expect(page.locator('.shipment-satellite')).toContainText('AIS observation');
  await expect(page.locator('.shipment-satellite')).toContainText('10 m / pixel'); await expect(page.locator('.shipment-satellite')).toContainText('15%');
  await expect(page.locator('.shipment-satellite')).not.toContainText('Verified vessel satellite observation');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await capture(page, 'mobile-contextual-metadata-fixture', true);
});
test('verified public fallback survives an outage and hides cached imagery', async ({ page }) => {
  await open(page, shipmentFixture({ satellite: true, stale: true }));
  await page.unroute(endpoint); await page.route(endpoint, route => route.fulfill({ status: 503 }));
  await page.getByRole('button', { name: 'Refresh update' }).click();
  await expect(page.locator('.shipment-status-line')).toContainText('Last known record');
  await expect(page.locator('.shipment-status-line')).toContainText('Departed Origin Port');
  await expect(page.locator('.shipment-notice')).toContainText('Shipment update unavailable.');
  await expect(page.locator('.shipment-satellite')).toHaveCount(0);
  await expect(page.locator('.shipment-map-summary')).toContainText('Last known vessel position');
});

test('API timeout with no cache leaves an honest unavailable state', async ({ page }) => {
  await open(page, null);
  await page.unroute(endpoint);
  await page.route(endpoint, () => {});
  await page.getByRole('button', { name: 'Refresh update' }).click();
  await page.waitForTimeout(8500);
  await expect(page.locator('.shipment-status-line')).toContainText('Shipment update unavailable.');
  await expect(page.locator('.shipment-marker.vessel')).toHaveCount(0);
});
test('invalid response and satellite failures cannot crash the passport', async ({ page }) => {
  await open(page, { schemaVersion: 99, rawPayload: 'PRIVATE' });
  await expect(page.locator('.shipment-status-line')).toContainText('Shipment update unavailable.');
  await expect(page.locator('body')).not.toContainText('PRIVATE');
  await page.unroute(endpoint); const fixture = shipmentFixture({ satellite: true }); fixture.satelliteImagery = [{ privateNotes: 'PRIVATE', url: 'javascript:alert(1)' }];
  await page.route(endpoint, route => route.fulfill({ json: fixture })); await page.getByRole('button', { name: 'Refresh update' }).click();
  await expect(page.locator('.shipment-status-line')).toContainText('Departed Origin Port');
  await expect(page.locator('.shipment-imagery-empty')).toBeVisible();
});
