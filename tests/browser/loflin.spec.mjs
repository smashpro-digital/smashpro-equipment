import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const path = '/equipment/attachments/sp-att-grp-001/';
for (const width of [360, 390, 768, 1440]) test(`passport evidence and layout at ${width}px`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width, height: 950 });
  await page.goto(path);
  await expect(page.locator('h1')).toHaveText('Loflin 42" Mini Root Grapple');
  await expect(page.locator('.attachment-v2-status')).toHaveText('Paid in full · Awaiting shipment');
  await expect(page.locator('.attachment-timeline li')).toHaveCount(10);
  await expect(page.locator('.attachment-timeline .is-completed')).toHaveCount(5);
  await expect(page.locator('[aria-current="step"]')).toContainText('Awaiting Shipment');
  await expect(page.locator('.attachment-timeline .is-upcoming')).toHaveCount(4);
  for (const selector of ['.attachment-passport-hero__visual img', '.attachment-host img']) {
    const img = page.locator(selector); await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await expect(page.getByRole('link', { name: /Explore the ARDHI passport/ })).toHaveAttribute('href', '/equipment/sp-ardhi-26.html');
  await page.locator('.attachment-commissioning summary').click();
  await expect(page.locator('.attachment-commissioning li')).toHaveCount(7);
  await expect(page.locator('.attachment-media-slot')).toHaveCount(11);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  mkdirSync('docs/release-captures/loflin-v2', { recursive: true });
  for (const section of await page.locator('main > section').all()) {
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveClass(/is-revealed/);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('.attachment-passport-hero').screenshot({ path: `docs/release-captures/loflin-v2/hero-${width}.png` });
  await page.locator('.attachment-procurement').screenshot({ path: `docs/release-captures/loflin-v2/timeline-${width}.png` });
  await page.screenshot({ path: `docs/release-captures/loflin-v2/passport-${width}.png`, fullPage: true });
  await page.reload(); await expect(page.locator('h1')).toHaveText('Loflin 42" Mini Root Grapple');
});
for (const featured of ['SP-ATT-GRP-001','SP-ATT-BKT-001']) test(`showroom shows one grapple with ${featured} featured`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(id => sessionStorage.setItem('smashpro-featured-attachment-v1', id), featured);
  await page.goto('/equipment/');
  const showroom = page.locator('#attachments');
  const card = featured === 'SP-ATT-GRP-001' ? showroom.locator('.attachment-feature') : showroom.locator('.attachment-passport-row').filter({ hasText: 'SP-ATT-GRP-001' });
  await expect(showroom.getByText('Loflin 42" Mini Root Grapple', { exact: true })).toHaveCount(1);
  await expect(card).toContainText('Paid in full · Awaiting shipment');
  await expect(card.locator('img')).toHaveAttribute('src', /sp-att-grp-001-loflin/);
  const link = featured === 'SP-ATT-GRP-001' ? card.getByRole('link', { name: 'View attachment passport' }) : card;
  await link.click(); await expect(page).toHaveURL(new RegExp(path));
});
