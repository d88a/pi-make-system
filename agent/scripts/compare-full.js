const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://sitandeat.ru', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  const result = await page.evaluate(() => {
    const data = {};
    
    // 1. ALL headings on page with CSS
    data.headings = [];
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      const cs = getComputedStyle(h);
      const parent = h.closest('section, main > div');
      data.headings.push({
        tag: h.tagName,
        text: h.textContent.trim().substring(0, 60),
        parentClass: parent ? parent.className.substring(0, 50) : '',
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        margin: cs.margin,
        color: cs.color,
        textAlign: cs.textAlign,
        letterSpacing: cs.letterSpacing,
      });
    });
    
    // 2. ALL sections with padding/margin/bg
    data.sections = [];
    document.querySelectorAll('section, main > div').forEach(s => {
      const cs = getComputedStyle(s);
      data.sections.push({
        tag: s.tagName,
        id: s.id,
        className: s.className.substring(0, 60),
        padding: cs.padding,
        margin: cs.margin,
        backgroundColor: cs.backgroundColor,
        height: cs.height,
      });
    });
    
    // 3. Categories cards (Завтраки, Обеды, Ужины)
    const catSection = document.querySelector('section.categories');
    if (catSection) {
      const items = catSection.querySelectorAll('[class*="item"]');
      const scs = getComputedStyle(catSection);
      data.categoriesSection = {
        sectionPadding: scs.padding,
        sectionMargin: scs.margin,
        sectionBg: scs.backgroundColor,
        items: Array.from(items).map(item => {
          const ics = getComputedStyle(item);
          const title = item.querySelector('h3, h4, [class*="title"]');
          const btn = item.querySelector('button, a');
          const img = item.querySelector('img');
          const stat = item.querySelector('[class*="stat"]');
          return {
            container: { width: ics.width, height: ics.height, padding: ics.padding, margin: ics.margin, borderRadius: ics.borderRadius, position: ics.position, overflow: ics.overflow },
            title: title ? { text: title.textContent.trim(), fontSize: getComputedStyle(title).fontSize, fontWeight: getComputedStyle(title).fontWeight, lineHeight: getComputedStyle(title).lineHeight, margin: getComputedStyle(title).margin, color: getComputedStyle(title).color } : null,
            button: btn ? { text: btn.textContent.trim(), fontSize: getComputedStyle(btn).fontSize, padding: getComputedStyle(btn).padding, borderRadius: getComputedStyle(btn).borderRadius, backgroundColor: getComputedStyle(btn).backgroundColor, color: getComputedStyle(btn).color, fontWeight: getComputedStyle(btn).fontWeight } : null,
            img: img ? { width: getComputedStyle(img).width, height: getComputedStyle(img).height, objectFit: getComputedStyle(img).objectFit, borderRadius: getComputedStyle(img).borderRadius } : null,
            stat: stat ? { text: stat.textContent.trim(), fontSize: getComputedStyle(stat).fontSize, fontWeight: getComputedStyle(stat).fontWeight, color: getComputedStyle(stat).color } : null,
          };
        }),
      };
    }
    
    // 4. Hero slider
    const hero = document.querySelector('section.main-banner');
    if (hero) {
      const hcs = getComputedStyle(hero);
      const slides = hero.querySelectorAll('.swiper-slide');
      data.hero = {
        sectionHeight: hcs.height,
        sectionPadding: hcs.padding,
        slides: Array.from(slides).map(s => {
          const scs = getComputedStyle(s);
          const bg = s.querySelector('[class*="bg"]');
          const title = s.querySelector('[class*="title"], h1, h2, h3');
          const btn = s.querySelector('a');
          return {
            height: scs.height,
            width: scs.width,
            bg: bg ? { width: getComputedStyle(bg).width, height: getComputedStyle(bg).height, position: getComputedStyle(bg).position } : null,
            title: title ? { text: title.textContent.trim(), fontSize: getComputedStyle(title).fontSize, fontWeight: getComputedStyle(title).fontWeight, color: getComputedStyle(title).color, lineHeight: getComputedStyle(title).lineHeight, margin: getComputedStyle(title).margin, textShadow: getComputedStyle(title).textShadow } : null,
            button: btn ? { text: btn.textContent.trim(), fontSize: getComputedStyle(btn).fontSize, padding: getComputedStyle(btn).padding, borderRadius: getComputedStyle(btn).borderRadius, backgroundColor: getComputedStyle(btn).backgroundColor, color: getComputedStyle(btn).color, fontWeight: getComputedStyle(btn).fontWeight } : null,
          };
        }),
      };
    }
    
    // 5. About section
    const about = document.querySelector('section.about');
    if (about) {
      const acs = getComputedStyle(about);
      const title = about.querySelector('h2');
      const texts = about.querySelectorAll('p');
      const stats = about.querySelectorAll('[class*="stat"], [class*="count"], [class*="number"]');
      data.about = {
        padding: acs.padding,
        bgColor: acs.backgroundColor,
        title: title ? { text: title.textContent.trim(), fontSize: getComputedStyle(title).fontSize, fontWeight: getComputedStyle(title).fontWeight, lineHeight: getComputedStyle(title).lineHeight, margin: getComputedStyle(title).margin, color: getComputedStyle(title).color } : null,
        texts: Array.from(texts).map(p => ({ text: p.textContent.trim().substring(0, 80), fontSize: getComputedStyle(p).fontSize, lineHeight: getComputedStyle(p).lineHeight, color: getComputedStyle(p).color })),
        stats: Array.from(stats).map(s => {
          const scs = getComputedStyle(s);
          return { text: s.textContent.trim(), fontSize: scs.fontSize, fontWeight: scs.fontWeight, color: scs.color };
        }),
      };
    }
    
    // 6. Advantages
    const adv = document.querySelector('section.advantages');
    if (adv) {
      const advcs = getComputedStyle(adv);
      const items = adv.querySelectorAll('[class*="item"]');
      data.advantages = {
        padding: advcs.padding,
        bgColor: advcs.backgroundColor,
        items: Array.from(items).map(item => {
          const ics = getComputedStyle(item);
          const title = item.querySelector('h4, h3, [class*="title"]');
          const desc = item.querySelector('p, [class*="desc"]');
          const icon = item.querySelector('img, svg, [class*="icon"]');
          return {
            width: ics.width,
            title: title ? { text: title.textContent.trim(), fontSize: getComputedStyle(title).fontSize, fontWeight: getComputedStyle(title).fontWeight, color: getComputedStyle(title).color, lineHeight: getComputedStyle(title).lineHeight } : null,
            desc: desc ? { text: desc.textContent.trim().substring(0, 60), fontSize: getComputedStyle(desc).fontSize, color: getComputedStyle(desc).color } : null,
            icon: icon ? { tagName: icon.tagName, width: getComputedStyle(icon).width, height: getComputedStyle(icon).height } : null,
          };
        }),
      };
    }
    
    return data;
  });
  
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
