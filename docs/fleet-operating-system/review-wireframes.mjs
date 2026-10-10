import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const output = new URL('./review/', import.meta.url);
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [], network = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(new URL('./wireframes.html', import.meta.url).href);
    for (const screen of ['public', 'operator', 'checkin', 'checkout', 'mechanic', 'command']) {
      await page.locator(`[data-view="${screen}"]`).focus();
      await page.keyboard.press('Enter');
      const panel = page.locator(`[data-screen="${screen}"]`);
      assert.equal(await panel.isVisible(), true);
      assert.equal(await page.locator('[data-screen]:visible').count(), 1);
      assert.equal(await page.locator(`[data-view="${screen}"]`).getAttribute('aria-pressed'), 'true');
      assert.equal(await panel.evaluate(el => el === document.activeElement), true);
      const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
      assert.ok(metrics.scrollWidth <= width, `${screen} overflows at ${width}`);
      if (screen === 'public') assert.equal(await panel.locator('button,input,textarea,select').count(), 0);
      for (const field of await panel.locator('input,textarea,select').all()) assert.equal(await field.evaluate(el => el.labels.length > 0), true);
      if ([390, 1440].includes(width)) await page.screenshot({ path: fileURLToPath(new URL(`${screen}-${width}.png`, output)), fullPage: true });
      results.push({ screen, ...metrics, keyboardFocus: 'pass', labels: 'pass' });
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(network, []);
    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(new URL('wireframes.json', output), JSON.stringify({ checks: results, runtimeErrors: 0, networkRequests: 0 }, null, 2) + '\n');
console.log(`${results.length} responsive screen checks passed; 12 captures saved; no external requests or runtime errors.`);
