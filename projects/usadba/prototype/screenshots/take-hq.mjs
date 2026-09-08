import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///D:/Anna/Сайты/usadba/prototype/index.html', { waitUntil: 'networkidle' });

// Trigger all scroll reveals
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
});
await page.waitForTimeout(500);

// Desktop full-page 1440px, 2x quality
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(300);
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/full-desktop-hq.png', 
  fullPage: true,
  type: 'png'
});

console.log('HQ desktop screenshot done');
await browser.close();
