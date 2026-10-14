import { test, expect } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const captures = process.env.FLEET_CAPTURE_DIR ?? 'docs/release-captures/fleet-layout';
async function openFleet(page, width, count = 4) {
  await page.setViewportSize({ width, height: 1000 });
  await page.route('**/dashboard/api/public_gear.php?*', route => route.fulfill({ status: 503, json: { ok: false } }));
  if (count !== 4) {
    // Browser-only preview: extend the actual collection module before HomePage renders.
    // Nothing is written to production data; closing the page removes every test entry.
    await page.route('**/src/data/equipment.ts*', async route => {
      const response = await route.fetch();
      const growth = `
const previewSeeds = equipment.filter(item => item.showroomGroup === "field-fleet");
        for (let index = previewSeeds.length; index < ${count}; index++) {
          const original = previewSeeds[index % previewSeeds.length];
          equipment.push({ ...original, fleetId: "PREVIEW-" + index, slug: "preview-" + index,
            showroomOrder: 100 + index, name: "Layout preview " + index,
            showroomCard: { ...original.showroomCard, name: "Layout preview " + index } });
        }`;
      await route.fulfill({ response, body: await response.text() + growth });
    });
  }
  await page.goto('/equipment/', { waitUntil: 'domcontentloaded' });
  const section = page.locator('#fleet');
  await expect(section.locator('.fleet-card')).toHaveCount(count);
  await section.scrollIntoViewIfNeeded();
  return section;
}
async function geometry(page, section, count, columns) {
  const cards = await section.locator('.fleet-card').evaluateAll(nodes => nodes.map(node => {
    const box = node.getBoundingClientRect(), img = node.querySelector('.fleet-card__media').getBoundingClientRect(), link = node.querySelector('a').getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, imageRatio: img.width / img.height, linkBottom: link.bottom, bottom: box.bottom };
  }));
  expect(cards).toHaveLength(count);
  const rows = [];
  for (const card of cards) { let row = rows.find(r => Math.abs(r[0].y - card.y) < 1); if (!row) rows.push(row = []); row.push(card); }
  expect(rows[0]).toHaveLength(columns);
  expect(rows).toHaveLength(Math.ceil(count / columns));
  for (const card of cards) { expect(Math.abs(card.width - cards[0].width)).toBeLessThan(1); expect(Math.abs(card.imageRatio - 1.6)).toBeLessThan(.02); expect(card.linkBottom).toBeLessThanOrEqual(card.bottom); }
  for (const row of rows) for (const card of row) { expect(Math.abs(card.height - row[0].height)).toBeLessThan(1); expect(Math.abs(card.linkBottom - row[0].linkBottom)).toBeLessThan(1); }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  return { count, columns, rows: rows.length, cardWidth: cards[0].width, equalRowHeights: true, alignedLinks: true, noOverflow: true };
}
for (const width of [375, 768, 1024, 1440, 1920]) test(`fleet layout at ${width}`, async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const section = await openFleet(page, width);
  await expect(section.getByRole('heading', { level: 2 })).toHaveText('Purpose-built machines. One connected workflow.');
  await expect(section).toContainText('Meet the growing SmashPro fleet.');
  const result = await geometry(page, section, 4, width < 768 ? 1 : width < 1600 ? 2 : 4);
  for (const card of await section.locator('.fleet-card').all()) {
    expect(await card.locator('dt').count()).toBeLessThanOrEqual(2);
    expect(await card.locator('.fleet-card__description').evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    const body = card.locator('.fleet-card__body'); expect(await body.evaluate(el => getComputedStyle(el).backgroundColor)).toBe('rgb(15, 20, 17)');
    const link = card.getByRole('link'); await link.focus(); await expect(link).toBeFocused();
    expect(await link.evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  }
  await page.evaluate(() => document.activeElement?.blur());
  await section.locator('img').evaluateAll(imgs => { imgs.forEach(img => img.loading = 'eager'); return Promise.all(imgs.map(img => img.decode())); });
  const box = await section.boundingBox(); await page.setViewportSize({ width, height: Math.ceil(box.height + 220) });
  await section.evaluate(el => scrollTo(0, el.getBoundingClientRect().top + scrollY - 110));
  mkdirSync(captures, { recursive: true });
  await section.screenshot({ path: `${captures}/after-${width}.png` });
  writeFileSync(`${captures}/layout-${width}.json`, JSON.stringify(result, null, 2) + '\n');
  expect(errors).toEqual([]);
});
for (const count of [5, 7]) for (const width of [375, 768, 1024, 1440, 1920]) test(`${count} temporary collection entries at ${width}`, async ({ page }) => {
  const section = await openFleet(page, width, count);
  const result = await geometry(page, section, count, width < 768 ? 1 : width < 1600 ? 2 : 4);
  mkdirSync(captures, { recursive: true });
  writeFileSync(`${captures}/growth-${count}-${width}.json`, JSON.stringify({ ...result, previewOnly: true }, null, 2) + '\n');
});
test('every fleet link retains its real Passport destination', async ({ page, request }) => {
  const section = await openFleet(page, 1024);
  const links = await section.locator('.fleet-card').evaluateAll(cards => cards.map(card => ({ id: card.dataset.fleetId, href: card.querySelector('a').getAttribute('href') })));
  expect(links).toEqual(expect.arrayContaining([
    { id: 'SP-ARDHI-26', href: '/equipment/sp-ardhi-26.html' },
    { id: 'SP-MZIGO-26E', href: '/equipment/sp-mzigo-26.html' },
    { id: 'SP-NYASI-26', href: '/equipment/sp-nyasi-26.html' },
    { id: 'SP-LIFTMATE-27', href: '/equipment/sp-liftmate-27.html' },
  ]));
  for (const { id, href } of links) {
    expect((await request.get(href)).ok()).toBe(true);
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main').first()).toContainText(id);
    await expect(page.getByRole('heading', { name: /Page not found/i })).toHaveCount(0);
  }
});
