import { test, expect } from '@playwright/test';
import QRCode from 'qrcode';
import { mkdirSync } from 'node:fs';
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

for (const width of [320, 390, 768, 1440]) test(`Expo sponsor experience preserves evidence and layout at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await open(page, '?expo=true');
  await expect(page.locator('.flagship-hero-description')).toContainText('Welcome to the future of fleet management');
  await expect(page.locator('#expo-title')).toHaveText('What could your company become part of?');
  await expect(page.locator('.sponsor-selector option')).toHaveCount(12);
  await page.locator('.sponsor-selector select').selectOption('insurance');
  await expect(page.locator('.sponsor-status')).toHaveText('To confirm');
  await expect(page.locator('.sponsor-interest')).toContainText('Insurance');
  await page.locator('.sponsor-selector select').selectOption('attachments');
  await expect(page.locator('.sponsor-opportunity')).toContainText('Available');
  await expect(page.getByRole('link', { name: 'Discuss Partnership', exact: true })).toHaveAttribute('href', 'https://smashpro.app/contact');
  await expect(page.locator('.sponsor-video video,.sponsor-video iframe')).toHaveCount(0);
  await expect(page.locator('.flagship-partners')).toHaveCount(0);
  await expect(page.locator('.flagship-roadmap li.is-pending')).toHaveCount(8);
  await expect(page.locator('.flagship-roadmap')).toContainText('not booked jobs');
  await expect(page.locator('.ardhi-expandable-timeline > li:not(.history-phase)')).toHaveCount(52);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
  expect(new Set(ids).size).toBe(ids.length);
  await page.getByText('Share the Expo experience · QR', { exact: true }).click();
  const expected = await QRCode.toDataURL('https://smashpro.app/equipment/sp-ardhi-26.html?expo=true', { width: 320, margin: 4, errorCorrectionLevel: 'M' });
  await expect(page.locator('.flagship-expo img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  // Node and browser PNG encoders differ; compare decoded pixels, not PNG bytes.
  const actual = await page.locator('.flagship-expo img').getAttribute('src');
  expect(await page.evaluate(async ({ actual, expected }) => {
    const pixels = async src => {
      const img = new Image(); img.src = src; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const context = canvas.getContext('2d'); context.drawImage(img, 0, 0);
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const [a, b] = await Promise.all([pixels(actual), pixels(expected)]);
    return a.length === b.length && a.every((value, index) => value === b[index]);
  }, { actual, expected })).toBe(true);
  await page.getByText('Share the Expo experience · QR', { exact: true }).click();
  mkdirSync('docs/release-captures/expo-sponsor', { recursive: true });
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({ path: `docs/release-captures/expo-sponsor/${width}-entry.png` });
  await page.locator('#expo-experience').screenshot({ path: `docs/release-captures/expo-sponsor/${width}-experience.png` });
  expect(errors).toEqual([]);
});

test('Expo query and history links preserve the canonical identity', async ({ page }) => {
  await open(page, '?expo=true&source=review#history-port-arrival');
  await expect(page.locator('#history-port-arrival details')).toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Exit Equip Expo mode' }).click();
  expect(new URL(page.url()).searchParams.get('source')).toBe('review');
  expect(new URL(page.url()).hash).toBe('#history-port-arrival');
  await page.getByRole('button', { name: 'Equip Expo mode', exact: true }).click();
  expect(new URL(page.url()).searchParams.get('expo')).toBe('true');
  await open(page, '?expo=false');
  await expect(page.locator('#expo-experience')).toHaveCount(0);
});
