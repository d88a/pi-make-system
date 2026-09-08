import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file:///D:/Anna/Сайты/usadba/prototype/index.html', { waitUntil: 'networkidle' });

// Desktop full-page 1440px
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(1000);
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/desktop-full.png', 
  fullPage: true 
});

// Mobile full-page 390px
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/mobile-full.png', 
  fullPage: true 
});

// Hero only desktop
await page.setViewportSize({ width: 1440, height: 900 });
await page.waitForTimeout(300);
await page.screenshot({ 
  path: 'D:/Anna/Сайты/usadba/prototype/screenshots/hero-desktop.png',
  clip: { x: 0, y: 0, width: 1440, height: 900 }
});

await browser.close();
console.log('Screenshots done');
