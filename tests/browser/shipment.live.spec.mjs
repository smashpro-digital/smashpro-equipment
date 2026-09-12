import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// Opt-in only. No response fixture or shipment route interception: Vite proxies
// this single public GET to SHIPMENT_PREVIEW_UPSTREAM on the live test service.
const endpoint = process.env.SHIPMENT_LIVE_ENDPOINT;
for (const width of [1440, 390]) test(`live API through local preview proxy at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  const responsePromise = page.waitForResponse(r => new URL(r.url()).pathname === '/api/fleet/shipment/SP-ARDHI-26');
  await page.goto('/equipment/sp-ardhi-26.html');
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const raw = await response.json();
  expect(raw.stageVerification).toBe('unverified');
  expect(raw.vessel).toBeNull(); expect(raw.voyage).toBeNull(); expect(raw.currentPosition).toBeNull();
  expect(raw.satelliteImagery).toEqual([]); expect(raw.timeline).toEqual([]);
  const forbidden = /^(rawPayload|rawProviderPayload|providerRecord|notes|privateNotes|evidencePath|auditActor|secret|token|credentials|documents|preciseDeliveryCoordinates)$/i;
  function check(value) { if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) { expect(key).not.toMatch(forbidden); check(child); } }
  check(raw);
  await page.locator('#journey').scrollIntoViewIfNeeded();
  await expect(page.locator('.shipment-status-line')).toContainText('Ocean departure awaiting confirmation');
  for (const label of ['EVER MAX — identity verification pending', 'Voyage 1374-016E — verification pending', 'Cargo association not yet confirmed', 'Factory model YF380']) await expect(page.locator('.shipment-pending')).toContainText(label);
  await expect(page.locator('.shipment-pending')).toContainText('operator-supplied reference');
  await expect(page.locator('.shipment-pending')).toContainText('Reference recorded');
  await expect(page.locator('.shipment-facts')).toContainText('Last shipment update');
  await expect(page.locator('.shipment-facts')).not.toContainText('EVER MAX');
  await expect(page.locator('.shipment-map-empty')).toBeVisible();
  await expect(page.locator('.shipment-marker')).toHaveCount(0);
  await expect(page.locator('.shipment-imagery-empty')).toContainText('No approved satellite observation available');
  await expect(page.locator('.shipment-badge.is-confirmed')).toHaveCount(0);
  for (const id of ['history-factory-departure', 'history-export-crate', 'history-freight-forwarder']) await expect(page.locator(`#${id}`)).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const refresh = page.getByRole('button', { name: 'Refresh update' });
  await refresh.focus(); await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await expect(refresh).toBeFocused();
  const refreshed = page.waitForResponse(r => new URL(r.url()).pathname === '/api/fleet/shipment/SP-ARDHI-26');
  await page.keyboard.press('Enter'); expect((await refreshed).status()).toBe(200);
  expect(await page.evaluate(() => sessionStorage.getItem('smashpro.public-shipment.v2.SP-ARDHI-26'))).toBeNull();
  await mkdir('tmp/shipment-captures', { recursive: true });
  await page.locator('#journey').screenshot({ path: `tmp/shipment-captures/live-${width}.png`, style: '.mini-passport,.now-viewing,.skip-link{visibility:hidden!important}' });
  await page.screenshot({ path: `tmp/shipment-captures/live-${width}-viewport.png` });
});

test('direct cross-origin request records the current CORS blocker', async ({ page }) => {
  await page.goto('/equipment/sp-ardhi-26.html');
  const result = await page.evaluate(async url => { try { const r = await fetch(url, { credentials: 'omit' }); return { readable: true, status: r.status }; } catch { return { readable: false }; } }, endpoint);
  // Change this acceptance assertion when HQ explicitly permits the Equipment origin.
  expect(result).toEqual({ readable: false });
});
