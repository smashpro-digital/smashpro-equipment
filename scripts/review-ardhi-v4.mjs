import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const phase = process.argv[2] || 'after';
const base = process.env.ARDHI_REVIEW_URL || 'http://127.0.0.1:4186';
const out = `docs/release-captures/ardhi-v4/${phase}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/api/**', route => route.fulfill({ status: 503, body: 'Local review: API offline' }));
    await page.route('**/tech_companion.php*', route => route.fulfill({ json: { ok: true, documents: [] } }));
    await page.goto(`${base}/equipment/sp-ardhi-26.html`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${width}-hero.png` });
    // Visit every section so viewport-triggered content and images are measured.
    for (const section of await page.locator('.ardhi-documentary > section').all()) await section.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${width}-full.png`, fullPage: true, style: '[data-manufacturer-profile-mount] { content-visibility: visible !important; }' });
    if (phase === 'after') {
      await page.locator('#mission-dashboard').screenshot({ path: `${out}/${width}-dashboard.png`, style: '.skip-link,.passport-rail { visibility: hidden !important; }' });
      await page.locator('#service').screenshot({ path: `${out}/${width}-service.png`, style: '.skip-link,.passport-rail { visibility: hidden !important; }' });
    }
    const metrics = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map(n => n.id);
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
        missingAlt: [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src),
        brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
        historyRows: document.querySelectorAll('.ardhi-expandable-timeline > li:not(.history-phase)').length,
        localBytes: performance.getEntriesByType('resource').filter(r => r.name.startsWith(location.origin)).reduce((n, r) => n + r.transferSize, 0),
        mediaRequests: performance.getEntriesByType('resource').filter(r => /\.(mp4|webm)(\?|$)/.test(r.name)).length };
    });
    results.push({ ...metrics, errors });
    if (phase === 'after' && [390, 1440].includes(width)) {
      await page.locator('#passport').screenshot({ path: `${out}/${width}-identity.png`, style: '.skip-link,.passport-rail { visibility: hidden !important; } [data-manufacturer-profile-mount] { content-visibility: visible !important; }' });
      await page.getByRole('button', { name: 'Equip Expo mode', exact: true }).click();
      await page.locator('.flagship-expo img').waitFor();
      await page.locator('.flagship-expo').screenshot({ path: `${out}/${width}-expo.png`, style: '.skip-link,.passport-rail { visibility: hidden !important; }' });
    }
    await page.close();
  }
} finally { await browser.close(); }
writeFileSync(`${out}/metrics.json`, JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.scrollWidth > r.width || r.errors.length || r.duplicateIds.length || r.missingAlt.length || r.brokenImages.length)) process.exitCode = 1;
