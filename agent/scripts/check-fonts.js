const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://sitandeat.ru', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const result = await page.evaluate(() => {
    const data = {};
    
    // Nav items
    const navItems = document.querySelectorAll('.main-nav__item a, .main-nav a');
    data.navItems = Array.from(navItems).slice(0, 7).map(a => {
      const cs = getComputedStyle(a);
      return {
        text: a.textContent.trim(),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        padding: cs.padding,
        margin: cs.margin,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        display: cs.display,
        height: cs.height,
        width: cs.width,
      };
    });
    
    // Nav container
    const mainNav = document.querySelector('.main-nav');
    if (mainNav) {
      const ncs = getComputedStyle(mainNav);
      data.mainNav = {
        fontSize: ncs.fontSize,
        fontWeight: ncs.fontWeight,
        height: ncs.height,
        width: ncs.width,
        display: ncs.display,
        gap: ncs.gap,
        alignItems: ncs.alignItems,
      };
    }
    
    // Header logo exact size
    const logo = document.querySelector('.header__logo img, .header__logo');
    if (logo) {
      const lcs = getComputedStyle(logo);
      data.logo = {
        width: lcs.width,
        height: lcs.height,
        maxWidth: lcs.maxWidth,
        marginTop: lcs.marginTop,
        display: lcs.display,
        naturalWidth: logo.naturalWidth,
        naturalHeight: logo.naturalHeight,
      };
    }
    
    // Categories section items
    const catItems = document.querySelectorAll('.categories-menu__item');
    data.catItems = Array.from(catItems).slice(0, 3).map(item => {
      const title = item.querySelector('.categories-menu__title');
      const info = item.querySelector('.categories-menu__info');
      const img = item.querySelector('img');
      const link = item.querySelector('.categories-menu__link');
      const itemCs = getComputedStyle(item);
      return {
        title: title ? { text: title.textContent.trim(), fontSize: getComputedStyle(title).fontSize, fontWeight: getComputedStyle(title).fontWeight, marginBottom: getComputedStyle(title).marginBottom, lineHeight: getComputedStyle(title).lineHeight } : null,
        info: info ? { text: info.textContent.trim(), fontSize: getComputedStyle(info).fontSize, color: getComputedStyle(info).color, marginTop: getComputedStyle(info).marginTop } : null,
        img: img ? { width: getComputedStyle(img).width, height: getComputedStyle(img).height, objectFit: getComputedStyle(img).objectFit } : null,
        link: link ? { position: getComputedStyle(link).position, top: getComputedStyle(link).top, left: getComputedStyle(link).left, width: getComputedStyle(link).width, height: getComputedStyle(link).height, zIndex: getComputedStyle(link).zIndex } : null,
        container: { width: itemCs.width, height: itemCs.height, padding: itemCs.padding, position: itemCs.position },
      };
    });
    
    // Catalog grid
    const catGrid = document.querySelector('.categories-menu__list');
    if (catGrid) {
      data.catGrid = {
        display: getComputedStyle(catGrid).display,
        gridTemplateColumns: getComputedStyle(catGrid).gridTemplateColumns,
        gap: getComputedStyle(catGrid).gap,
        padding: getComputedStyle(catGrid).padding,
        maxWidth: getComputedStyle(catGrid).maxWidth,
        itemCount: catGrid.querySelectorAll('.categories-menu__item').length,
      };
    }
    
    // Search input
    const searchInput = document.querySelector('.header__search input');
    if (searchInput) {
      const scs = getComputedStyle(searchInput);
      data.searchInput = {
        fontSize: scs.fontSize,
        fontFamily: scs.fontFamily,
        padding: scs.padding,
        border: scs.border,
        borderRadius: scs.borderRadius,
        width: scs.width,
        height: scs.height,
        placeholder: searchInput.placeholder,
      };
    }
    
    return data;
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
