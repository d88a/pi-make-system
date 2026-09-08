import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto('http://localhost:8080', { waitUntil: 'networkidle', timeout: 30000 });

// Trigger scroll reveals
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
});
await page.waitForTimeout(1000);

// Desktop full page
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/wp-desktop-2x.png', 
  fullPage: true,
  type: 'png'
});

// Mobile
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/wp-mobile-2x.png', 
  fullPage: true,
  type: 'png'
});

console.log('WordPress screenshots done!');
await browser.close();
