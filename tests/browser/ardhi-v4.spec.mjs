import { test, expect } from '@playwright/test';
async function open(page, suffix = '') {
  await page.route('**/api/**', route => route.fulfill({ status: 503, body: 'Local offline review' }));
  await page.route('**/tech_companion.php*', route => route.fulfill({ json: { ok: true, documents: [] } }));
  await page.goto(`/equipment/sp-ardhi-26.html${suffix}`);
  await expect(page.locator('#mission-dashboard')).toBeVisible();
}
for (const width of [320, 390, 768, 1440]) test(`flagship narrative, evidence and responsive layout at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await open(page);
  await expect(page.locator('.passport-rail a')).toHaveText(['Identity', 'Journey', 'History', 'Service', 'Documents']);
  const order = await page.evaluate(() => ['.ardhi-v2-hero', '#mission-dashboard', '.passport-rail', '#passport', '.flagship-roadmap', '#journey', '#history', '#service', '#documents'].map(selector => document.querySelector(selector).getBoundingClientRect().top));
  expect(order).toEqual([...order].sort((a, b) => a - b));
  await expect(page.locator('#mission-dashboard')).toContainText('Awaiting Release');
  await expect(page.locator('#journey')).toContainText('Verified');
  await expect(page.locator('.flagship-checklist > li')).toHaveCount(12);
  await expect(page.locator('.flagship-first-job')).toContainText('Awaiting Commissioning');
  await expect(page.locator('.flagship-service-grid [role=cell]')).toHaveCount(0);
  await expect(page.locator('.flagship-capabilities .is-future li')).toHaveCount(6);
  await expect(page.locator('#documents .window-sticker-library-card')).toHaveCount(1);
  await expect(page.locator('.shipment-map')).toHaveCount(0);
  await page.locator('#commissioning-hydraulics summary').click();
  await expect(page.locator('#commissioning-hydraulics')).toContainText('Evidence slot');
  await page.locator('.passport-rail a[href="#documents"]').click();
  await page.getByRole('button', { name: 'View Full Sticker', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'View Full Sticker', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
test('arrival and factory deep links retain their full history, including injected archive', async ({ page }) => {
  await open(page, '#history-port-arrival');
  await expect(page.locator('.flagship-history-disclosure')).toHaveAttribute('open', '');
  await expect(page.locator('#history-port-arrival details')).toHaveAttribute('open', '');
  await expect(page.locator('.ardhi-expandable-timeline > li:not(.history-phase)')).toHaveCount(52);
  await page.goto('/equipment/sp-ardhi-26.html#history-production-complete');
  await expect(page.locator('#history-production-complete details')).toHaveAttribute('open', '');
  await page.goto('/equipment/sp-ardhi-26.html#drive-low-price-offer-review');
  await expect(page.locator('#drive-low-price-offer-review details')).toHaveAttribute('open', '');
});
test('Expo mode is shareable, QR is generated, and archive lightbox is keyboard accessible', async ({ page }) => {
  await open(page, '?expo=1');
  await expect(page.locator('.flagship-expo img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  await expect(page.locator('.flagship-expo a')).toHaveAttribute('href', 'https://smashpro.app/equipment/sp-ardhi-26.html');
  await page.locator('.ardhi-archive > details > summary').click();
  const image = page.locator('.archive-grid button').first(); await image.click();
  await expect(page.getByRole('button', { name: 'Close media lightbox' })).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('button', { name: 'Close media lightbox' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(image).toBeFocused();
  await page.getByRole('button', { name: 'Exit Equip Expo mode' }).click();
  await expect(page.locator('.flagship-expo')).toHaveCount(0);
  expect(new URL(page.url()).searchParams.has('expo')).toBe(false);
});
