import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { shipmentFixture } from '../fixtures/shipment.mjs';
const endpoint = '**/api/fleet/shipment/SP-ARDHI-26';
function forwarderOceanFixture() {
  const fixture = shipmentFixture();
  fixture.vessel = { ...fixture.vessel, name: 'EVER MAX' };
  fixture.voyage = '1374-016E';
  fixture.currentPosition = null;
  fixture.positionState = 'unavailable';
  fixture.ports = [];
  fixture.route = { planned: [], completed: [], remaining: [], source: null, estimated: false };
  fixture.map = { ...fixture.map, trackSegments: [], originFacility: null, inlandDestination: null, routeState: 'unavailable' };
  fixture.timeline = fixture.timeline.filter(event => event.eventType === 'carrier-update');
  return fixture;
}
for (const width of [1440, 390]) test(`confirmed forwarder context and derived lifecycle stay honest at ${width}px`, async ({ page }) => {
  await open(page, forwarderOceanFixture(), width);
  await expect(page.locator('.shipment-facts')).toContainText('Forwarder-reported vessel');
  await expect(page.locator('.shipment-facts')).toContainText('EVER MAX');
  await expect(page.locator('.shipment-facts')).toContainText('Forwarder-reported voyage 1374-016E');
  await expect(page.locator('.mini-passport')).toContainText('Ocean transit confirmed · 4 phases pending');
  await expect(page.locator('.shipment-map-empty')).toContainText('Awaiting a verified location');
  await expect(page.locator('.shipment-map-summary')).toContainText('No public vessel-position observation is available');
  await expect(page.locator('.shipment-imagery-empty')).toContainText('No approved vessel-position observation available');
  await expect(page.locator('.shipment-marker')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText('Verified vessel');
  await expect(page.locator('main')).not.toContainText('satellite observations');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
for(const width of [1440,390]) test(`public context is distinct from cargo and projected completion at ${width}px`,async({page})=>{
 const fixture=shipmentFixture({unverified:true});fixture.vesselContext=JSON.parse(readFileSync('tests/fixtures/vessel-context.json','utf8'));
 fixture.pendingReferences={factoryModel:'YF380',vesselDisplayReference:'EVER MAX',voyageDisplayReference:'1374-016E',vesselIdentityVerification:'pending',voyageVerification:'pending',cargoAssociation:'unconfirmed',recordedAt:'2026-09-12T06:10:49.225Z',source:'operator-supplied reference'};
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page,fixture,width);
 await expect(page.locator('.journey-now')).toContainText('9935208');await expect(page.locator('.journey-now')).toContainText('563190500');await expect(page.locator('.journey-now')).toContainText('YF380');
 await expect(page.locator('.journey-truth')).toContainText('The voyage is forwarder-reported.');
 await expect(page.locator('.journey-vessel-summary')).toContainText('voyage reference 1374-016E');
 await expect(page.locator('.corridor-route')).toHaveCSS('stroke-dasharray','12px, 10px');
 await expect(page.locator('.shipment-marker.vessel')).toHaveCount(0);await expect(page.locator('.shipment-badge.is-confirmed')).toHaveCount(0);
 await expect(page.locator('.journey-observation')).toContainText('No timestamped AIS observation is approved');
 await page.locator('.journey-intelligence summary').focus();await page.keyboard.press('Enter');await expect(page.locator('.journey-intelligence')).toHaveAttribute('open','');
 const link=page.getByRole('link',{name:'Open vessel tracker ↗',exact:true}).first();await expect(link).toHaveAttribute('target','_blank');await link.focus();await expect(link).toBeFocused();
 await expect(page.locator('.shipment-status-line')).toContainText('Ocean departure awaiting confirmation');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await capture(page,`context-${width}`,true);expect(errors).toEqual([]);
});
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
  await expect(page.locator('.shipment-imagery-empty')).toContainText('No approved vessel-position observation available');
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
  await expect(page.locator('.shipment-status-line')).not.toContainText('Confirmed shipment record');
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
test('contextual imagery panel separates capture time from AIS and never overstates regional imagery', async ({ page }) => {
  const fixture = shipmentFixture({ satellite: true });
  await page.route('https://example.com/test-image.png', route => route.fulfill({ status: 404, body: 'No actual imagery used in test' }));
  await open(page, fixture, 390);
  await page.locator('#shipment-event-fixture-departure summary').click();
  await expect(page.locator('.shipment-satellite')).toContainText('Regional satellite imagery — vessel not independently identified');
  await expect(page.locator('.shipment-satellite')).toContainText('Captured'); await expect(page.locator('.shipment-satellite')).toContainText('AIS observation');
  await expect(page.locator('.shipment-satellite')).toContainText('10 m / pixel'); await expect(page.locator('.shipment-satellite')).toContainText('15%');
  await expect(page.locator('.shipment-satellite')).not.toContainText('Verified vessel');
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
