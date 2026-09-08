const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://sitandeat.ru', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const result = await page.evaluate(() => {
    // 1. Search element
    const search = document.querySelector('.header__search');
    const searchInfo = search ? {
      outerHTML: search.outerHTML,
      display: getComputedStyle(search).display,
      height: getComputedStyle(search).height,
    } : { error: 'NOT FOUND' };
    
    // 2. Header grid structure
    const hc = document.querySelector('.header__content');
    const grid = hc ? {
      display: getComputedStyle(hc).display,
      gridTemplateColumns: getComputedStyle(hc).gridTemplateColumns,
      gridTemplateRows: getComputedStyle(hc).gridTemplateRows,
      children: Array.from(hc.children).map(c => ({
        tag: c.tagName,
        className: c.className,
        gridRow: getComputedStyle(c).gridRow,
        gridColumn: getComputedStyle(c).gridColumn,
      })),
    } : { error: 'NOT FOUND' };
    
    // 3. First catalog item structure
    const catItem = document.querySelector('.categories-menu__item');
    const catInfo = catItem ? {
      outerHTML: catItem.outerHTML.substring(0, 1000),
      children: Array.from(catItem.querySelectorAll('*')).map(c => ({
        tag: c.tagName,
        className: c.className,
        text: c.textContent?.trim().substring(0, 100),
        computed: {
          display: getComputedStyle(c).display,
          width: getComputedStyle(c).width,
          height: getComputedStyle(c).height,
          margin: getComputedStyle(c).margin,
          borderRadius: getComputedStyle(c).borderRadius,
        }
      })),
    } : { error: 'NOT FOUND' };
    
    // 4. Categories list grid
    const catList = document.querySelector('.categories-menu__list');
    const catGrid = catList ? {
      display: getComputedStyle(catList).display,
      gridTemplateColumns: getComputedStyle(catList).gridTemplateColumns,
      gap: getComputedStyle(catList).gap,
      itemCount: catList.querySelectorAll('.categories-menu__item').length,
    } : { error: 'NOT FOUND' };
    
    return { search: searchInfo, grid, catItem: catInfo, catGrid };
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
