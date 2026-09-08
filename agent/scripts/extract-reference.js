/**
 * extract-reference.js — Pixel-Perfect Reference Extraction
 *
 * Extracts from a live website:
 *   1. CSS computed styles (exact values, not vision approximations)
 *   2. ALL text content (verbatim, every word)
 *   3. ALL images (src, alt, dimensions, including background-image)
 *   4. ALL links (text + href)
 *   5. ALL buttons and form elements
 *   6. Top bars / announcement banners
 *   7. Full footer structure
 *
 * Usage:
 *   node extract-reference.js <url> <output-dir>
 *
 * Output:
 *   <output-dir>/css-extraction.md      — exact CSS values
 *   <output-dir>/content-extraction.md  — verbatim content inventory
 *
 * Requires: playwright (npm install playwright)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = process.argv[2];
const OUTPUT_DIR = process.argv[3] || '.';

if (!URL) {
  console.error('Usage: node extract-reference.js <url> <output-dir>');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log(`Opening ${URL}...`);
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  // Scroll to load lazy content
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
  await page.waitForTimeout(2000);

  console.log('Extracting CSS + Content...');

  const data = await page.evaluate(() => {
    // Helper: rgb to hex
    function rgbToHex(rgb) {
      if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return 'transparent';
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return rgb;
      return '#' + [match[1], match[2], match[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    // Helper: get computed style object for an element
    function extractCSS(el, label) {
      const cs = window.getComputedStyle(el);
      return {
        label,
        tag: el.tagName.toLowerCase(),
        selector: el.id ? `#${el.id}` : el.className ? `.${el.className.split(' ').join('.')}` : el.tagName.toLowerCase(),
        color: rgbToHex(cs.color),
        backgroundColor: rgbToHex(cs.backgroundColor),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily.split(',')[0].trim().replace(/['"]/g, ''),
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        padding: cs.padding,
        margin: cs.margin,
        borderRadius: cs.borderRadius,
        border: cs.border,
        borderBottom: cs.borderBottom,
        boxShadow: cs.boxShadow === 'none' ? 'none' : cs.boxShadow,
        width: cs.width,
        height: cs.height,
        maxWidth: cs.maxWidth,
        display: cs.display,
        gap: cs.gap,
        textAlign: cs.textAlign,
        textTransform: cs.textTransform,
        textDecoration: cs.textDecoration,
      };
    }

    // ===== 1. CSS EXTRACTION =====
    const cssData = { body: {}, nav: [], hero: [], sections: [], buttons: [], footer: [], cards: [] };

    // Body
    cssData.body = extractCSS(document.body, 'body');

    // Nav
    document.querySelectorAll('nav, header, [class*="nav"], [class*="header"]').forEach(el => {
      if (el.offsetHeight > 0) cssData.nav.push(extractCSS(el, 'nav'));
    });

    // Top bar / announcement
    const topBars = document.querySelectorAll('[class*="top"], [class*="announce"], [class*="banner"], [class*="info-bar"], [class*="promo"]');
    cssData.topBars = [];
    topBars.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 200 && rect.height > 0 && rect.height < 100) {
        cssData.topBars.push(extractCSS(el, 'top-bar'));
      }
    });

    // Hero / main banner
    document.querySelectorAll('[class*="hero"], [class*="banner"], [class*="slider"], [class*="swiper"]').forEach(el => {
      if (el.offsetHeight > 100) cssData.hero.push(extractCSS(el, 'hero'));
    });

    // All sections
    document.querySelectorAll('section, [class*="section"], main > div').forEach((el, i) => {
      if (el.offsetHeight > 50) {
        const id = el.id || '';
        const cls = Array.from(el.classList).join(' ');
        cssData.sections.push({
          index: i,
          id,
          classes: cls,
          ...extractCSS(el, `section-${i}`),
        });
      }
    });

    // Buttons
    document.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"]').forEach(el => {
      const text = el.textContent.trim().substring(0, 50);
      if (text && el.offsetHeight > 0) {
        cssData.buttons.push({ text, ...extractCSS(el, `btn: ${text}`) });
      }
    });

    // Cards
    document.querySelectorAll('[class*="card"], article, [class*="item"]').forEach((el, i) => {
      if (el.offsetHeight > 50 && i < 20) {
        cssData.cards.push({ index: i, ...extractCSS(el, `card-${i}`) });
      }
    });

    // Footer
    document.querySelectorAll('footer, [class*="footer"]').forEach(el => {
      if (el.offsetHeight > 0) cssData.footer.push(extractCSS(el, 'footer'));
    });

    // ===== 2. CONTENT EXTRACTION =====
    const content = {
      topBars: [],
      nav: { logo: null, menuItems: [], phones: [], buttons: [] },
      sections: [],
      footer: { columns: [], copyright: '', links: [] },
      images: [],
      allLinks: [],
    };

    // Top bars
    topBars.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < 200 && rect.height > 0 && rect.height < 100) {
        content.topBars.push({
          text: el.textContent.trim(),
          links: Array.from(el.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href })),
        });
      }
    });

    // Nav
    const logoEl = document.querySelector('.logo img, [class*="logo"] img, header a:first-child img, nav a:first-child img');
    if (logoEl) {
      content.nav.logo = { type: 'image', src: logoEl.src, alt: logoEl.alt };
    } else {
      const logoText = document.querySelector('.logo, [class*="logo"], header a:first-child, nav a:first-child');
      if (logoText) content.nav.logo = { type: 'text', text: logoText.textContent.trim() };
    }

    // Menu items (desktop nav only, not mobile duplicates)
    const navEl = document.querySelector('nav, header nav, [class*="main-nav"], [class*="desktop-nav"]');
    if (navEl) {
      navEl.querySelectorAll(':scope > ul > li > a, :scope > div > a, :scope > a').forEach(a => {
        content.nav.menuItems.push({ text: a.textContent.trim(), href: a.href });
      });
    }
    // Fallback: broader selector
    if (content.nav.menuItems.length === 0) {
      document.querySelectorAll('nav a, header a').forEach(a => {
        const text = a.textContent.trim();
        const href = a.getAttribute('href');
        if (text && href && text.length < 50) {
          content.nav.menuItems.push({ text, href });
        }
      });
    }

    // Phones
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      content.nav.phones.push({ text: a.textContent.trim(), href: a.href });
    });

    // Nav buttons (cart, login, etc)
    document.querySelectorAll('nav button, header button, nav a[class*="btn"], header a[class*="btn"]').forEach(el => {
      const text = el.textContent.trim();
      if (text) content.nav.buttons.push({ text, href: el.getAttribute('href') });
    });

    // Form elements (input, select, textarea, form) — FIX: previously missed <input> (D-070)
    content.forms = [];
    document.querySelectorAll('form, input:not([type="hidden"]), select, textarea').forEach(el => {
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      content.forms.push({
        tag: el.tagName.toLowerCase(),
        type: el.getAttribute('type') || '',
        name: el.getAttribute('name') || '',
        placeholder: el.getAttribute('placeholder') || '',
        action: el.getAttribute('action') || '',
        value: el.value || '',
        parentClass: el.parentElement ? el.parentElement.className : '',
        computed: {
          display: cs.display,
          width: cs.width,
          height: cs.height,
          margin: cs.margin,
          color: cs.color,
          fontSize: cs.fontSize,
          fontFamily: cs.fontFamily,
          borderRadius: cs.borderRadius,
          border: cs.border,
          backgroundColor: cs.backgroundColor,
          padding: cs.padding,
        }
      });
    });

    // Header grid structure — FIX: extract grid-template-columns/rows (D-070)
    content.headerGrid = null;
    const headerContent = document.querySelector('.header__content, [class*="header__content"], header > div:first-child, header > .container');
    if (headerContent) {
      const hcs = window.getComputedStyle(headerContent);
      if (hcs.display === 'grid' || hcs.display === 'flex') {
        content.headerGrid = {
          display: hcs.display,
          gridTemplateColumns: hcs.gridTemplateColumns,
          gridTemplateRows: hcs.gridTemplateRows,
          gap: hcs.gap,
          children: Array.from(headerContent.children).map(c => ({
            tag: c.tagName,
            className: c.className,
            gridRow: window.getComputedStyle(c).gridRow,
            gridColumn: window.getComputedStyle(c).gridColumn,
            computed: {
              width: window.getComputedStyle(c).width,
              height: window.getComputedStyle(c).height,
              margin: window.getComputedStyle(c).margin,
              display: window.getComputedStyle(c).display,
            },
            childCount: c.children.length,
          })),
        };
      }
    }

    // Sections — verbatim text extraction
    const allSections = document.querySelectorAll('section, [class*="section"], main > div, [class*="hero"], [class*="banner"]');
    const sectionSet = new Set();

    allSections.forEach((section, idx) => {
      // Skip duplicates (nested sections)
      if (sectionSet.has(section)) return;
      sectionSet.add(section);

      const sd = {
        index: idx,
        id: section.id || '',
        classes: Array.from(section.classList).join(' '),
        // D-074: section-level CSS (padding, margin, bg)
        sectionCSS: (() => {
          const scs = window.getComputedStyle(section);
          return {
            padding: scs.padding,
            margin: scs.margin,
            backgroundColor: scs.backgroundColor,
            minHeight: scs.minHeight,
            // D-077: grid properties for section-level grids
            display: scs.display,
            gap: scs.gap,
            gridTemplateColumns: scs.gridTemplateColumns,
            gridTemplateRows: scs.gridTemplateRows,
          };
        })(),
        // D-077: find grid containers inside section (categories-top__list, categories-menu__list, etc.)
        grids: (() => {
          const gridEls = section.querySelectorAll('[class*="__list"], [class*="__grid"], [class*="grid"], [style*="grid"]');
          const result = [];
          gridEls.forEach(g => {
            const gcs = window.getComputedStyle(g);
            if (gcs.display === 'grid' || gcs.display === 'inline-grid') {
              result.push({
                classes: Array.from(g.classList).join(' '),
                display: gcs.display,
                gap: gcs.gap,
                gridTemplateColumns: gcs.gridTemplateColumns,
                gridTemplateRows: gcs.gridTemplateRows,
                childCount: g.children.length,
                // First child CSS for reference
                firstChildCSS: g.children[0] ? (() => {
                  const fcs = window.getComputedStyle(g.children[0]);
                  return { width: fcs.width, height: fcs.height, padding: fcs.padding, backgroundColor: fcs.backgroundColor, borderRadius: fcs.borderRadius };
                })() : null,
              });
            }
          });
          return result;
        })(),
        headings: [],
        paragraphs: [],
        buttons: [],
        links: [],
        images: [],
        stats: [], // counters, numbers
        tabs: [],  // filter tabs
        cards: [], // product cards
        backgroundImages: [],
      };

      // Headings — D-074: include CSS
      section.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        const hcs = window.getComputedStyle(h);
        sd.headings.push({
          tag: h.tagName,
          text: h.textContent.trim(),
          css: {
            fontSize: hcs.fontSize,
            fontWeight: hcs.fontWeight,
            lineHeight: hcs.lineHeight,
            margin: hcs.margin,
            color: hcs.color,
            textAlign: hcs.textAlign,
            letterSpacing: hcs.letterSpacing,
            textTransform: hcs.textTransform,
          }
        });
      });

      // Tab labels (role="tab", [class*="tab"], filter buttons)
      const tabs = section.querySelectorAll('[role="tab"], [class*="tab-btn"], [class*="filter-btn"], [class*="category"]');
      if (tabs.length > 0) {
        sd.tabs = Array.from(tabs).map(t => ({
          text: t.textContent.trim(),
          active: t.getAttribute('aria-selected') === 'true' || t.classList.contains('active') || t.classList.contains('tab-active'),
        }));
      }

      // Product/card-like items (title + price patterns)
      const cardEls = section.querySelectorAll('[class*="card"], [class*="item"], [class*="product"], article');
      if (cardEls.length > 0) {
        sd.cards = [];
        cardEls.forEach((card, ci) => {
          if (ci >= 25) return;
          const title = card.querySelector('h3, h4, [class*="title"], [class*="name"]');
          const price = card.querySelector('[class*="price"], [class*="cost"]');
          const btn = card.querySelector('button, a[class*="btn"], [class*="button"]');
          const img = card.querySelector('img');
          // FIX: extract info text (e.g. "145 позиций") and overlay links (D-070)
          const info = card.querySelector('[class*="info"], [class*="count"], [class*="meta"], [class*="subtitle"]');
          const overlayLink = card.querySelector('a[href]');
          const cs = window.getComputedStyle(card);
          // FIX: extract computed CSS of card children (D-072)
          const titleCSS = title ? window.getComputedStyle(title) : null;
          const infoCSS = info ? window.getComputedStyle(info) : null;
          const priceCSS = price ? window.getComputedStyle(price) : null;
          const overlayCSS = overlayLink ? window.getComputedStyle(overlayLink) : null;
          sd.cards.push({
            title: title ? title.textContent.trim() : '',
            titleCSS: titleCSS ? { fontSize: titleCSS.fontSize, fontWeight: titleCSS.fontWeight, color: titleCSS.color, lineHeight: titleCSS.lineHeight, margin: titleCSS.margin, fontFamily: titleCSS.fontFamily } : null,
            price: price ? price.textContent.trim() : '',
            priceCSS: priceCSS ? { fontSize: priceCSS.fontSize, fontWeight: priceCSS.fontWeight, color: priceCSS.color, margin: priceCSS.margin } : null,
            button: btn ? btn.textContent.trim() : '',
            info: info ? info.textContent.trim() : '',
            infoCSS: infoCSS ? { fontSize: infoCSS.fontSize, color: infoCSS.color, margin: infoCSS.margin, fontWeight: infoCSS.fontWeight } : null,
            image: img ? img.src : '',
            imageAlt: img ? img.alt : '',
            overlayHref: overlayLink ? overlayLink.href : '',
            overlayCSS: overlayCSS ? { position: overlayCSS.position, top: overlayCSS.top, left: overlayCSS.left, width: overlayCSS.width, height: overlayCSS.height, zIndex: overlayCSS.zIndex } : null,
            dimensions: {
              width: cs.width,
              height: cs.height,
              padding: cs.padding,
              position: cs.position,
              borderRadius: cs.borderRadius,
              overflow: cs.overflow,
              backgroundColor: cs.backgroundColor,
              imgWidth: img ? window.getComputedStyle(img).width : '',
              imgHeight: img ? window.getComputedStyle(img).height : '',
            },
          });
        });
      }

      // Paragraphs — VERBATIM + CSS (D-074)
      section.querySelectorAll('p, li, span:not([class*="icon"])').forEach(p => {
        const text = p.textContent.trim();
        if (text && text.length > 1 && text.length < 500) {
          // D-074: capture CSS for <p> elements
          if (p.tagName === 'P') {
            const pcs = window.getComputedStyle(p);
            sd.paragraphs.push({
              text,
              css: {
                fontSize: pcs.fontSize,
                fontWeight: pcs.fontWeight,
                lineHeight: pcs.lineHeight,
                color: pcs.color,
                margin: pcs.margin,
              }
            });
          } else {
            sd.paragraphs.push(text);
          }
        }
      });

      // Buttons
      section.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"]').forEach(btn => {
        const text = btn.textContent.trim();
        if (text) sd.buttons.push({ text, href: btn.getAttribute('href') || '', tag: btn.tagName });
      });

      // Links
      section.querySelectorAll('a[href]').forEach(a => {
        const text = a.textContent.trim();
        if (text && text.length < 100) sd.links.push({ text, href: a.href });
      });

      // Images
      section.querySelectorAll('img').forEach(img => {
        if (img.src) sd.images.push({ src: img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight });
      });

      // Background images
      section.querySelectorAll('*').forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none') {
          const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) sd.backgroundImages.push(match[1]);
        }
      });

      // Stats / counters — aggressive extraction
      // 1. By class name
      section.querySelectorAll('[class*="counter"], [class*="stat"], [class*="number"], [class*="count"], [class*="value"], [class*="digit"]').forEach(el => {
        sd.stats.push(el.textContent.trim());
      });
      // 2. By pattern: numbers + text (e.g., "10 лет", "200+ блюд", "> 10", "5 кафе")
      section.querySelectorAll('*').forEach(el => {
        // Only direct text nodes
        if (el.children.length === 0 || el.children.length <= 2) {
          const text = el.textContent.trim();
          if (text && /\d/.test(text) && text.length > 1 && text.length < 60) {
            // Match patterns: "10 лет", "200+", "> 10", "50 000+"
            if (/(\d+[\s+]*(лет|кафе|блюд|гост|минут|заведен|лет|час|дн|мес|лет|человек|₽|%|\+))/i.test(text) ||
                /^[>]?\s*\d+[\s+]*\w/.test(text)) {
              sd.stats.push(text);
            }
          }
        }
      });
      // 3. Large font-size elements (likely stats/headings)
      section.querySelectorAll('*').forEach(el => {
        const cs = window.getComputedStyle(el);
        const fontSize = parseFloat(cs.fontSize);
        if (fontSize >= 24 && el.children.length === 0) {
          const text = el.textContent.trim();
          if (text && text.length < 80 && !sd.headings.find(h => h.text === text)) {
            sd.stats.push(`[large ${fontSize}px] ${text}`);
          }
        }
      });

      if (sd.headings.length > 0 || sd.paragraphs.length > 0 || sd.images.length > 0 || sd.buttons.length > 0 || (sd.tabs && sd.tabs.length > 0) || (sd.cards && sd.cards.length > 0) || sd.stats.length > 0) {
        content.sections.push(sd);
      }
    });

    // Footer
    const footerEl = document.querySelector('footer, [class*="footer"]');
    if (footerEl) {
      // Columns — try multiple selectors
      let cols = footerEl.querySelectorAll(':scope > div > div, :scope > .container > div, :scope > [class*="grid"] > div');
      if (cols.length < 2) {
        // Try deeper: footer > div > div > div
        cols = footerEl.querySelectorAll(':scope > div > div > div');
      }
      if (cols.length < 2) {
        // Last resort: find grid children
        const grid = footerEl.querySelector('[class*="grid"], [class*="row"], [class*="columns"], [class*="flex"]');
        if (grid) cols = grid.querySelectorAll(':scope > div');
      }
      cols.forEach(col => {
        const heading = col.querySelector('h3, h4, h5, [class*="title"]');
        const items = Array.from(col.querySelectorAll('a, li, p, span')).map(el => ({
          text: el.textContent.trim(),
          href: el.getAttribute('href') || null,
        })).filter(i => i.text.length > 0 && i.text.length < 100);

        content.footer.columns.push({
          heading: heading ? heading.textContent.trim() : '',
          items,
        });
      });

      // Copyright
      const cpEl = footerEl.querySelector('[class*="copyright"], [class*="copy"]');
      if (cpEl) content.footer.copyright = cpEl.textContent.trim();
      else {
        const cpMatch = footerEl.textContent.match(/©[^\n]*/);
        if (cpMatch) content.footer.copyright = cpMatch[0].trim();
      }

      // Policy links
      footerEl.querySelectorAll('a[href*="polit"], a[href*="sogl"], a[href*="ofer"], a[href*="doc"], a[href*="pdf"]').forEach(a => {
        content.footer.links.push({ text: a.textContent.trim(), href: a.href });
      });

      // Social icons
      const socials = footerEl.querySelectorAll('a[href*="vk"], a[href*="telegram"], a[href*="t.me"], a[href*="whatsapp"], a[href*="instagram"], a[class*="social"]');
      content.footer.socials = Array.from(socials).map(a => ({ href: a.href, text: a.textContent.trim() }));

      // Payment icons
      const payments = footerEl.querySelectorAll('img[src*="visa"], img[src*="master"], img[src*="mir"], svg, [class*="pay"]');
      content.footer.payments = Array.from(payments).map(el => {
        if (el.tagName === 'IMG') return { type: 'image', src: el.src, alt: el.alt };
        if (el.tagName === 'SVG') return { type: 'svg' };
        return { type: 'other', text: el.textContent.trim() };
      });
    }

    // ALL images on page
    document.querySelectorAll('img').forEach(img => {
      if (img.src) content.images.push({ src: img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight });
    });

    // ALL links on page
    document.querySelectorAll('a[href]').forEach(a => {
      const text = a.textContent.trim();
      if (text && text.length < 100) content.allLinks.push({ text, href: a.href });
    });

    return { css: cssData, content };
  });

  // ===== BUILD css-extraction.md =====
  let css = `# CSS Extraction: ${URL}\n\n`;
  css += `> Extracted: ${new Date().toISOString()}\n`;
  css += `> Viewport: 1440×900\n\n`;

  css += `## Body\n\n`;
  css += `| Property | Value |\n|----------|-------|\n`;
  Object.entries(data.css.body).forEach(([k, v]) => { if (k !== 'label' && k !== 'tag' && k !== 'selector') css += `| ${k} | ${v} |\n`; });
  css += `\n`;

  css += `## Top Bars (${data.css.topBars.length})\n\n`;
  data.css.topBars.forEach((bar, i) => {
    css += `### Top bar ${i + 1}\n\n| Property | Value |\n|----------|-------|\n`;
    Object.entries(bar).forEach(([k, v]) => { if (k !== 'label' && k !== 'tag' && k !== 'selector') css += `| ${k} | ${v} |\n`; });
    css += `\n`;
  });

  css += `## Navigation (${data.css.nav.length})\n\n`;
  data.css.nav.forEach((nav, i) => {
    css += `### Nav ${i + 1}: \`${nav.selector}\`\n\n| Property | Value |\n|----------|-------|\n`;
    Object.entries(nav).forEach(([k, v]) => { if (k !== 'label' && k !== 'tag' && k !== 'selector') css += `| ${k} | ${v} |\n`; });
    css += `\n`;
  });

  css += `## Hero (${data.css.hero.length})\n\n`;
  data.css.hero.forEach((hero, i) => {
    css += `### Hero ${i + 1}: \`${hero.selector}\`\n\n| Property | Value |\n|----------|-------|\n`;
    Object.entries(hero).forEach(([k, v]) => { if (k !== 'label' && k !== 'tag' && k !== 'selector') css += `| ${k} | ${v} |\n`; });
    css += `\n`;
  });

  css += `## Buttons (${data.css.buttons.length})\n\n`;
  css += `| Label | Color | BG | Font Size | Font Weight | Padding | Border Radius | Height |\n`;
  css += `|-------|-------|-----|-----------|-------------|---------|---------------|--------|\n`;
  data.css.buttons.forEach(btn => {
    css += `| ${btn.text} | ${btn.color} | ${btn.backgroundColor} | ${btn.fontSize} | ${btn.fontWeight} | ${btn.padding} | ${btn.borderRadius} | ${btn.height} |\n`;
  });
  css += `\n`;

  css += `## Cards (${data.css.cards.length})\n\n`;
  css += `| # | Border Radius | Border | Box Shadow | Padding | BG | Display | Gap |\n`;
  css += `|---|--------------|--------|------------|---------|-----|---------|-----|\n`;
  data.css.cards.forEach((card, i) => {
    css += `| ${i + 1} | ${card.borderRadius} | ${card.border} | ${card.boxShadow} | ${card.padding} | ${card.backgroundColor} | ${card.display} | ${card.gap} |\n`;
  });
  css += `\n`;

  css += `## Sections (${data.css.sections.length})\n\n`;
  css += `| # | ID | Padding | BG Color | Max Width |\n`;
  css += `|---|-----|---------|----------|----------|\n`;
  data.css.sections.forEach(s => {
    css += `| ${s.index} | ${s.id || s.classes.substring(0, 30)} | ${s.padding} | ${s.backgroundColor} | ${s.maxWidth} |\n`;
  });
  css += `\n`;

  css += `## Footer (${data.css.footer.length})\n\n`;
  data.css.footer.forEach((ft, i) => {
    css += `### Footer ${i + 1}\n\n| Property | Value |\n|----------|-------|\n`;
    Object.entries(ft).forEach(([k, v]) => { if (k !== 'label' && k !== 'tag' && k !== 'selector') css += `| ${k} | ${v} |\n`; });
    css += `\n`;
  });

  // ===== BUILD content-extraction.md =====
  let ct = `# Content Extraction: ${URL}\n\n`;
  ct += `> Extracted: ${new Date().toISOString()}\n\n`;

  ct += `## Top Bars\n\n`;
  if (data.content.topBars.length === 0) {
    ct += `*No top bars found*\n\n`;
  } else {
    data.content.topBars.forEach((bar, i) => {
      ct += `### Bar ${i + 1}\n`;
      ct += `**Text:** ${bar.text}\n\n`;
      if (bar.links.length > 0) {
        ct += `Links:\n`;
        bar.links.forEach(l => { ct += `- "${l.text}" → ${l.href}\n`; });
      }
      ct += `\n`;
    });
  }

  ct += `## Navigation\n\n`;
  ct += `**Logo:** ${data.content.nav.logo ? (data.content.nav.logo.type === 'image' ? `[image] src: ${data.content.nav.logo.src}` : `"${data.content.nav.logo.text}"`) : 'not found'}\n\n`;
  ct += `**Menu items:**\n`;
  data.content.nav.menuItems.forEach(item => { ct += `- "${item.text}" → ${item.href}\n`; });
  ct += `\n`;
  ct += `**Phones:**\n`;
  data.content.nav.phones.forEach(p => { ct += `- "${p.text}" → ${p.href}\n`; });
  ct += `\n`;
  ct += `**Buttons:**\n`;
  data.content.nav.buttons.forEach(b => { ct += `- "${b.text}" (${b.tag}) → ${b.href || 'no href'}\n`; });
  ct += `\n`;

  // Header Grid structure (D-070)
  if (data.content.headerGrid) {
    const hg = data.content.headerGrid;
    ct += `**Header Grid (${hg.display}):**\n`;
    ct += `- grid-template-columns: ${hg.gridTemplateColumns}\n`;
    ct += `- grid-template-rows: ${hg.gridTemplateRows}\n`;
    ct += `- gap: ${hg.gap}\n`;
    ct += `- Children (${hg.children.length}):\n`;
    hg.children.forEach((c, i) => {
      ct += `  ${i + 1}. <${c.tag}> class="${c.className}" — ${c.computed.width}×${c.computed.height}, margin: ${c.computed.margin}, children: ${c.childCount}\n`;
    });
    ct += `\n`;
  }

  // Form elements (D-070)
  if (data.content.forms && data.content.forms.length > 0) {
    ct += `## Form Elements (${data.content.forms.length})\n\n`;
    data.content.forms.forEach((f, i) => {
      ct += `### ${i + 1}. <${f.tag}> parent=".${f.parentClass}"\n`;
      if (f.type) ct += `- type: ${f.type}\n`;
      if (f.name) ct += `- name: ${f.name}\n`;
      if (f.placeholder) ct += `- placeholder: "${f.placeholder}"\n`;
      if (f.action) ct += `- action: ${f.action}\n`;
      ct += `- CSS: ${f.computed.width}×${f.computed.height}, display: ${f.computed.display}\n`;
      ct += `- font: ${f.computed.fontSize} ${f.computed.fontFamily}\n`;
      ct += `- border: ${f.computed.border}, radius: ${f.computed.borderRadius}\n`;
      ct += `- bg: ${f.computed.backgroundColor}, color: ${f.computed.color}\n`;
      ct += `- padding: ${f.computed.padding}\n`;
      ct += `\n`;
    });
  }

  ct += `## Sections (${data.content.sections.length})\n\n`;
  data.content.sections.forEach(section => {
    ct += `---\n\n### Section ${section.index}: ${section.id || section.classes.substring(0, 40)}\n\n`;

    // D-074: section-level CSS
    if (section.sectionCSS) {
      const sc = section.sectionCSS;
      ct += `**Section CSS:** padding: ${sc.padding}, margin: ${sc.margin}, bg: ${sc.backgroundColor}`;
      if (sc.gridTemplateColumns && sc.gridTemplateColumns !== 'none') ct += `, grid-cols: ${sc.gridTemplateColumns}, grid-rows: ${sc.gridTemplateRows}, gap: ${sc.gap}`;
      ct += `\n\n`;
    }

    // D-077: grid containers inside section
    if (section.grids && section.grids.length > 0) {
      ct += `**Grid Containers:**\n`;
      section.grids.forEach((g, gi) => {
        ct += `- Grid ${gi + 1} (${g.classes}): display: ${g.display}, cols: ${g.gridTemplateColumns}, rows: ${g.gridTemplateRows}, gap: ${g.gap}, children: ${g.childCount}\n`;
        if (g.firstChildCSS) {
          ct += `  First child: width: ${g.firstChildCSS.width}, height: ${g.firstChildCSS.height}, padding: ${g.firstChildCSS.padding}, bg: ${g.firstChildCSS.backgroundColor}, radius: ${g.firstChildCSS.borderRadius}\n`;
        }
      });
      ct += `\n`;
    }

    if (section.headings.length > 0) {
      ct += `**Headings:**\n`;
      section.headings.forEach(h => {
        ct += `- ${h.tag}: "${h.text}"`;
        // D-074: heading CSS
        if (h.css) ct += ` [${h.css.fontSize}, ${h.css.fontWeight}, ${h.css.color}, margin: ${h.css.margin}, lineHeight: ${h.css.lineHeight}]`;
        ct += `\n`;
      });
      ct += `\n`;
    }

    if (section.tabs && section.tabs.length > 0) {
      ct += `**Tabs:**\n`;
      section.tabs.forEach(t => { ct += `- "${t.text}"${t.active ? ' [ACTIVE]' : ''}\n`; });
      ct += `\n`;
    }

    if (section.cards && section.cards.length > 0) {
      ct += `**Cards (${section.cards.length}):**\n`;
      section.cards.forEach((c, i) => {
        ct += `- Card ${i + 1}: "${c.title}"`;
        if (c.price) ct += ` | Price: ${c.price}`;
        if (c.button) ct += ` | Btn: "${c.button}"`;
        if (c.info) ct += ` | Info: "${c.info}"`;
        if (c.image) ct += ` | Img: ${c.image.substring(0, 80)}`;
        if (c.overlayHref) ct += ` | Link: ${c.overlayHref}`;
        if (c.dimensions) ct += ` [${c.dimensions.imgWidth}×${c.dimensions.imgHeight}]`;
        ct += `\n`;
        // D-072: print CSS of card children
        if (c.titleCSS) ct += `  Title CSS: ${c.titleCSS.fontSize}, ${c.titleCSS.fontWeight}, ${c.titleCSS.color}, margin: ${c.titleCSS.margin}\n`;
        if (c.infoCSS) ct += `  Info CSS: ${c.infoCSS.fontSize}, ${c.infoCSS.color}, margin: ${c.infoCSS.margin}\n`;
        if (c.priceCSS) ct += `  Price CSS: ${c.priceCSS.fontSize}, ${c.priceCSS.color}\n`;
        if (c.overlayCSS) ct += `  Overlay: ${c.overlayCSS.position}, ${c.overlayCSS.width}×${c.overlayCSS.height}, z: ${c.overlayCSS.zIndex}\n`;
        if (c.dimensions && c.dimensions.padding) ct += `  Container: padding: ${c.dimensions.padding}, position: ${c.dimensions.position}, radius: ${c.dimensions.borderRadius}, overflow: ${c.dimensions.overflow}, bg: ${c.dimensions.backgroundColor}\n`;
      });
      ct += `\n`;
    }

    if (section.paragraphs.length > 0) {
      ct += `**Text (verbatim):**\n`;
      // Deduplicate
      const seen = new Set();
      section.paragraphs.forEach(p => {
        // D-074: paragraph may be object with CSS or plain string
        const text = (typeof p === 'string') ? p : p.text;
        if (!seen.has(text)) {
          seen.add(text);
          ct += `- "${text}"`;
          if (typeof p !== 'string' && p.css) {
            ct += ` [${p.css.fontSize}, ${p.css.fontWeight}, ${p.css.color}, lineHeight: ${p.css.lineHeight}, margin: ${p.css.margin}]`;
          }
          ct += `\n`;
        }
      });
      ct += `\n`;
    }

    if (section.stats.length > 0) {
      ct += `**Stats/Counters:**\n`;
      const seenStats = new Set();
      section.stats.forEach(s => { if (!seenStats.has(s)) { seenStats.add(s); ct += `- "${s}"\n`; } });
      ct += `\n`;
    }

    if (section.buttons.length > 0) {
      ct += `**Buttons:**\n`;
      section.buttons.forEach(b => { ct += `- "${b.text}" (${b.tag}) → ${b.href || 'no href'}\n`; });
      ct += `\n`;
    }

    if (section.images.length > 0) {
      ct += `**Images:**\n`;
      section.images.forEach(img => { ct += `- src: ${img.src}\n  alt: "${img.alt}" | ${img.width}×${img.height}\n`; });
      ct += `\n`;
    }

    if (section.backgroundImages.length > 0) {
      ct += `**Background images:**\n`;
      section.backgroundImages.forEach(bg => { ct += `- ${bg}\n`; });
      ct += `\n`;
    }
  });

  ct += `## Footer\n\n`;
  ct += `**Columns (${data.content.footer.columns.length}):**\n\n`;
  data.content.footer.columns.forEach((col, i) => {
    ct += `### Column ${i + 1}: ${col.heading || '(no heading)'}\n`;
    col.items.forEach(item => {
      ct += `- "${item.text}"${item.href ? ` → ${item.href}` : ''}\n`;
    });
    ct += `\n`;
  });

  ct += `**Copyright:** ${data.content.footer.copyright || 'not found'}\n\n`;
  ct += `**Policy links:**\n`;
  data.content.footer.links.forEach(l => { ct += `- "${l.text}" → ${l.href}\n`; });
  ct += `\n`;

  if (data.content.footer.socials) {
    ct += `**Social links:**\n`;
    data.content.footer.socials.forEach(s => { ct += `- ${s.text || s.href} → ${s.href}\n`; });
    ct += `\n`;
  }

  if (data.content.footer.payments) {
    ct += `**Payment methods (${data.content.footer.payments.length}):**\n`;
    data.content.footer.payments.forEach(p => {
      if (p.type === 'image') ct += `- [image] ${p.src} (alt: ${p.alt})\n`;
      else ct += `- ${p.type}: ${p.text || '(svg)'}\n`;
    });
    ct += `\n`;
  }

  ct += `## All Images (${data.content.images.length})\n\n`;
  data.content.images.forEach(img => {
    ct += `- ${img.src}\n  alt: "${img.alt}" | ${img.width}×${img.height}\n`;
  });
  ct += `\n`;

  ct += `## All Links (${data.content.allLinks.length})\n\n`;
  data.content.allLinks.forEach(l => { ct += `- "${l.text}" → ${l.href}\n`; });

  // Write files
  const cssPath = path.join(OUTPUT_DIR, 'css-extraction.md');
  const contentPath = path.join(OUTPUT_DIR, 'content-extraction.md');

  fs.writeFileSync(cssPath, css, 'utf-8');
  fs.writeFileSync(contentPath, ct, 'utf-8');

  console.log(`\nDone!`);
  console.log(`  CSS:     ${cssPath} (${(css.length / 1024).toFixed(1)} KB)`);
  console.log(`  Content: ${contentPath} (${(ct.length / 1024).toFixed(1)} KB)`);
  console.log(`  Sections: ${data.content.sections.length}`);
  console.log(`  Images: ${data.content.images.length}`);
  console.log(`  Links: ${data.content.allLinks.length}`);
  console.log(`  Top bars: ${data.content.topBars.length}`);
  console.log(`  Footer columns: ${data.content.footer.columns.length}`);

  await browser.close();
})();
