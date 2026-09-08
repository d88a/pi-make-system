import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2, // 2x = retina quality
});
const page = await context.newPage();
await page.goto('file:///D:/Anna/Сайты/usadba/prototype/index.html', { waitUntil: 'networkidle' });

// Trigger all scroll reveals
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
});
await page.waitForTimeout(500);

await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/full-desktop-2x.png', 
  fullPage: true,
  type: 'png'
});

console.log('Done — 2x retina screenshot');
await browser.close();
