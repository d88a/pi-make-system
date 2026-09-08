#!/usr/bin/env node
/**
 * corpus-extract.js — Bulk Corpus Extraction (Wave C) v2
 *
 * For each site in selected.json: screenshot + structured extraction.json
 * Optimized for pattern analysis (Wave D clustering), NOT pixel-perfect copy.
 *
 * v2 changes:
 *   - Font blocking REMOVED (was breaking typography detection)
 *   - Fonts.ready override + screenshot timeout as safety net
 *   - Concurrency=3 with per-worker browser contexts
 *   - Browser restart every 20 sites
 *   - Better SPA settling (scroll + wait)
 *   - Improved hero_type classification
 *   - Graceful font timeout (3s max wait)
 *
 * Usage:
 *   NODE_PATH="C:/Users/Ваня/.pi/agent/node_modules" node sources/corpus-extract.js
 *   NODE_PATH="..." node sources/corpus-extract.js --limit=3 --niche=minimal
 *   NODE_PATH="..." node sources/corpus-extract.js --resume
 *   NODE_PATH="..." node sources/corpus-extract.js --urls=https://a.com,https://b.com
 */

const { chromium } = require("C:/Users/Ваня/.pi/agent/node_modules/playwright");
const fs = require("fs");
const path = require("path");

// ── CLI flags ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const FLAGS = {
  limit: parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1]) || 0,
  niche: args.find((a) => a.startsWith("--niche="))?.split("=")[1] || null,
  resume: args.includes("--resume"),
  dryRun: args.includes("--dry-run"),
  urls: args.find((a) => a.startsWith("--urls="))?.split("=")[1] || null,
};

// ── Config ──────────────────────────────────────────────────────────────────

const SELECTED_PATH = path.resolve(__dirname, "..", "selected.json");
const OUTPUT_DIR = path.resolve(__dirname, "..", "raw", "extractions");
const SUMMARY_PATH = path.join(OUTPUT_DIR, "_summary.json");
const CONCURRENCY = 3;
const BROWSER_RESTART_EVERY = 20;
const GOTO_TIMEOUT_MS = 45_000;
const MAX_PAGE_HEIGHT = 40_000;
const SETTLE_MS = 5_000;
const RATE_MS = 500;
const VIEWPORT = { width: 1440, height: 900 };
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// ── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function hostnameOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, "").toLowerCase(); }
  catch { return (url || "").toLowerCase().replace(/^www\./, ""); }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function today() { return new Date().toISOString().slice(0, 10); }

// ── Extraction Logic (runs inside page.evaluate) ────────────────────────────

function buildExtractionPayload() {
  const EMPTY = {
    page_metrics: { page_height_px: 0, viewport_width: window.innerWidth, section_count: 0, has_sticky_nav: false, has_announcement_bar: false },
    colors: { top_palette: [], bg_main: "#FFFFFF", text_main: "#000000", is_dark: false, bg_luminance: 1, primary_hue: 0, accent_hue: 0, accent_saturation_avg: 0, palette_size: 0 },
    typography: { display_font: "unknown", body_font: "unknown", fonts_used: [], hero_h1_size_px: 0, body_size_px: 16, body_line_height: 1.5, display_weight: 400, font_count: 0 },
    layout: { hero_type: "centered", hero_signals: { has_large_image: false, image_position: "none", image_width_pct: 0, has_centered_text: false }, section_sequence: [], section_types: {}, has_asymmetric_grid: false, grid_cols_max: 0, card_count: 0, card_aspect: "1/1", has_bento: false },
    mood: { radius_avg_px: 0, radius_distribution: { "0": 0, "4": 0, "8": 0, "12": 0, "16": 0, "24": 0, "999": 0 }, density_padding_avg_px: 0, shadow_usage: "none", animation_count: 0, transition_durations_ms: [], has_gradient: false, dark_mode: false, monochrome: true },
    raw_extras: { nav_links_count: 0, button_count: 0, primary_button_radius_px: 0, image_count: 0, form_count: 0 },
  };
  if (!document.body) return EMPTY;

  // ── rgb→hex helper (in-page) ──────────────────────────────────────────
  function toHex(rgb) {
    if (!rgb || rgb === "transparent" || rgb === "rgba(0, 0, 0, 0)") return null;
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    return "#" + [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])]
      .map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function toHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) h = ((b - r) / d + 2) / 6;
      else h = ((r - g) / d + 4) / 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function lum(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // ── Colors ────────────────────────────────────────────────────────────
  const colorFreq = {};
  const bgColors = [];

  // Sample visible elements (limit to 2000 for performance)
  const colorEls = document.querySelectorAll(
    "body, header, footer, nav, section, main, div, a, button, span, h1, h2, h3, h4, h5, h6, p, li, article, aside, [class*='card'], [class*='hero']"
  );
  let sampled = 0;
  for (const el of colorEls) {
    if (sampled > 2000) break;
    const rect = el.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) continue;
    sampled++;
    const cs = getComputedStyle(el);
    const bgHex = toHex(cs.backgroundColor);
    const fgHex = toHex(cs.color);
    if (bgHex) {
      colorFreq[bgHex] = (colorFreq[bgHex] || 0) + 1;
      bgColors.push(bgHex);
    }
    if (fgHex && fgHex !== bgHex) {
      colorFreq[fgHex] = (colorFreq[fgHex] || 0) + 1;
    }
  }

  const sortedColors = Object.entries(colorFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalCF = sortedColors.reduce((s, [, c]) => s + c, 0) || 1;
  const topPalette = sortedColors.map(([hex, cnt]) => [hex, Math.round((cnt / totalCF) * 100) / 100]);

  // bg_main: most common bg on body-level elements
  const bgFreq = {};
  bgColors.forEach((h) => { bgFreq[h] = (bgFreq[h] || 0) + 1; });
  const bgSorted = Object.entries(bgFreq).sort((a, b) => b[1] - a[1]);
  const bgMain = bgSorted.length > 0 ? bgSorted[0][0] : "#FFFFFF";
  const bgLum = lum(bgMain);
  const isDark = bgLum < 0.3;

  // Accent: most saturated non-bg color
  const satColors = sortedColors
    .filter(([hex]) => hex !== bgMain)
    .map(([hex]) => ({ hex, ...toHsl(hex) }))
    .filter((c) => c.s > 10)
    .sort((a, b) => b.s - a.s);

  let primaryHue = 0, accentHue = 0, accentSatAvg = 0;
  if (satColors.length > 0) {
    accentHue = satColors[0].h;
    accentSatAvg = Math.round(satColors.reduce((s, c) => s + c.s, 0) / satColors.length);
    primaryHue = satColors.length > 1 ? satColors[1].h : satColors[0].h;
  }

  // ── Typography ────────────────────────────────────────────────────────
  const bodyCS = getComputedStyle(document.body);
  const bodyFont = bodyCS.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
  const bodySize = parseInt(bodyCS.fontSize) || 16;
  const bodyLH = parseFloat(bodyCS.lineHeight) / bodySize || 1.5;

  let displayFont = bodyFont;
  let heroH1Size = 0;
  let displayWeight = 400;

  // Find largest heading
  for (const h of document.querySelectorAll("h1, h2")) {
    const cs = getComputedStyle(h);
    const fs = parseInt(cs.fontSize) || 0;
    if (fs > heroH1Size) {
      heroH1Size = fs;
      displayFont = cs.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
      displayWeight = parseInt(cs.fontWeight) || 700;
    }
  }

  // Collect all fonts used (limit scan to 1000 elements)
  const allFonts = new Set();
  let fontScan = 0;
  for (const el of document.querySelectorAll("*")) {
    if (fontScan++ > 1000) break;
    const ff = getComputedStyle(el).fontFamily.split(",")[0].replace(/['"]/g, "").trim();
    if (ff && !["sans-serif", "serif", "monospace", "cursive", "fantasy", "system-ui"].includes(ff)) {
      allFonts.add(ff);
    }
  }
  const fontsUsed = [...allFonts].slice(0, 6);

  // ── Layout ────────────────────────────────────────────────────────────
  // Collect meaningful sections
  const sectionEls = [...document.querySelectorAll(
    "section, [class*='section'], [class*='Section'], main > div, header, footer, [class*='hero'], [class*='Hero']"
  )].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.height > 80 && r.width > 200;
  });

  function classifySection(el, idx) {
    const rect = el.getBoundingClientRect();
    const cls = ((el.className || "") + " " + (el.id || "")).toLowerCase();
    const tag = el.tagName.toLowerCase();
    const imgs = el.querySelectorAll("img, video, picture, [style*='background-image']").length;
    const btns = el.querySelectorAll("button, a[class*='btn'], a[class*='button'], [role='button']").length;
    const text = (el.textContent || "").slice(0, 500).toLowerCase();

    if (tag === "footer" || cls.includes("footer")) return "footer";
    if (tag === "header" || (cls.includes("nav") && rect.height < 120)) return "nav";
    if (cls.includes("hero") || cls.includes("banner")) return "hero";
    if (idx === 0 && rect.height > 300) return "hero";
    if (cls.includes("feature") || cls.includes("service")) return "features";
    if (cls.includes("testimonial") || cls.includes("review") || cls.includes("quote")) return "testimonial";
    if (cls.includes("faq") || cls.includes("accordion")) return "faq";
    if (cls.includes("cta") || cls.includes("call-to-action")) return "cta";
    if (cls.includes("gallery") || cls.includes("portfolio") || cls.includes("work") || cls.includes("project")) return "gallery";
    if (cls.includes("stat") || cls.includes("counter") || cls.includes("number") || cls.includes("metric")) return "stats";
    if (cls.includes("price") || cls.includes("pricing") || cls.includes("plan")) return "pricing";
    if (cls.includes("contact") || cls.includes("form") || el.querySelector("form")) return "contact";
    if (cls.includes("team") || cls.includes("about")) return "about";
    if (cls.includes("blog") || cls.includes("post") || cls.includes("article")) return "blog";
    if (cls.includes("logo") || cls.includes("client") || cls.includes("partner")) return "logos";

    // Content-based fallback
    const cards = el.querySelectorAll("[class*='card'], [class*='Card'], .grid > div, .grid > li, article").length;
    const hasIcons = el.querySelectorAll("svg, [class*='icon']").length > 2;
    const hasLargeNums = /\d{2,}[kKmM%+]?\s/.test(text);

    if (cards >= 3 && hasIcons) return "features";
    if (hasLargeNums && cards >= 2) return "stats";
    if (imgs >= 5) return "gallery";
    if (btns >= 1 && text.length < 150 && rect.height < 400) return "cta";
    if (cards >= 3 && imgs >= 2) return "gallery";
    if (cards >= 3) return "features";
    return "content";
  }

  const sectionSequence = [];
  const sectionTypes = {};
  sectionEls.forEach((el, i) => {
    const type = classifySection(el, i);
    sectionSequence.push(type);
    sectionTypes[type] = (sectionTypes[type] || 0) + 1;
  });

  // ── Hero type ─────────────────────────────────────────────────────────
  let heroType = "centered";
  let heroSignals = { has_large_image: false, image_position: "none", image_width_pct: 0, has_centered_text: false };

  const heroEl = sectionEls.length > 0 ? sectionEls[0] : null;
  if (heroEl) {
    const hr = heroEl.getBoundingClientRect();
    const heroImgs = heroEl.querySelectorAll("img, video, picture");
    const heroBgImg = getComputedStyle(heroEl).backgroundImage;
    const heroH1 = heroEl.querySelector("h1, h2");

    // Check full-bleed background
    if (heroBgImg && heroBgImg !== "none" && heroBgImg.includes("url")) {
      heroType = "full-bleed";
      heroSignals.has_large_image = true;
      heroSignals.image_position = "background";
      heroSignals.image_width_pct = 100;
    } else if (heroImgs.length > 0) {
      const firstImg = heroImgs[0];
      const ir = firstImg.getBoundingClientRect();
      if (ir.width > 0 && hr.width > 0) {
        const imgPct = Math.round((ir.width / hr.width) * 100);
        heroSignals.has_large_image = imgPct > 25;
        heroSignals.image_width_pct = imgPct;

        // Position
        const imgCenter = ir.left + ir.width / 2;
        const heroCenter = hr.left + hr.width / 2;
        const relPos = (imgCenter - hr.left) / hr.width;
        if (relPos < 0.35) heroSignals.image_position = "left";
        else if (relPos > 0.65) heroSignals.image_position = "right";
        else heroSignals.image_position = "center";

        // Classify
        if (imgPct >= 30 && imgPct <= 70 && heroSignals.image_position !== "center") {
          heroType = "asymmetric-split";
        } else if (heroSignals.image_position === "center" && imgPct > 40) {
          heroType = "product-showcase";
        } else if (Math.abs(ir.width - hr.width * 0.5) < hr.width * 0.1) {
          // Check for split-screen (50/50)
          heroType = "split-screen";
        } else if (heroSignals.image_position === "center") {
          heroType = "centered";
        } else {
          heroType = "asymmetric-split";
        }
      }
    } else if (heroH1) {
      // No images — typography or centered
      const h1FS = parseInt(getComputedStyle(heroH1).fontSize) || 0;
      const h1Rect = heroH1.getBoundingClientRect();
      const h1Center = h1Rect.left + h1Rect.width / 2;
      const heroCenter = hr.left + hr.width / 2;
      heroSignals.has_centered_text = Math.abs(h1Center - heroCenter) < hr.width * 0.2;
      heroType = h1FS > 60 ? "typography" : "centered";
    }

    // Centered text check
    if (heroH1) {
      const h1Rect = heroH1.getBoundingClientRect();
      const h1Center = h1Rect.left + h1Rect.width / 2;
      const heroCenter = hr.left + hr.width / 2;
      heroSignals.has_centered_text = Math.abs(h1Center - heroCenter) < hr.width * 0.2;
    }
  }

  // ── Grid + cards ──────────────────────────────────────────────────────
  let gridColsMax = 0;
  let hasBento = false;
  let hasAsym = false;

  for (const grid of document.querySelectorAll("[class*='grid'], [style*='grid'], .cards, [class*='cards'], [class*='masonry']")) {
    const cs = getComputedStyle(grid);
    if (cs.display === "grid" || cs.display === "inline-grid") {
      const cols = cs.gridTemplateColumns.split(" ").filter(Boolean).length;
      if (cols > gridColsMax) gridColsMax = cols;
    }
    if (cs.display === "flex" || cs.display === "inline-flex") {
      const children = [...grid.children].filter((c) => c.getBoundingClientRect().width > 50);
      if (children.length >= 3) {
        const widths = children.map((c) => Math.round(c.getBoundingClientRect().width));
        const unique = new Set(widths);
        if (unique.size > 1) hasAsym = true;
        if (unique.size > 2) hasBento = true;
      }
    }
    const kids = [...grid.children];
    if (kids.length > 2) {
      const sizes = kids.map((c) => Math.round(c.getBoundingClientRect().width));
      const uniq = new Set(sizes.filter((s) => s > 0));
      if (uniq.size > 1) hasAsym = true;
      if (uniq.size > 2) hasBento = true;
    }
  }

  const cardEls = document.querySelectorAll("[class*='card'], [class*='Card'], article, .grid > div, .grid > li, [class*='tile'], [class*='item']");
  const cardCount = cardEls.length;

  let cardAspect = "1/1";
  if (cardEls.length > 0) {
    const aspects = [...cardEls].slice(0, 12).map((c) => {
      const r = c.getBoundingClientRect();
      return r.width > 0 && r.height > 0 ? r.width / r.height : null;
    }).filter(Boolean);
    if (aspects.length > 0) {
      const avg = aspects.reduce((a, b) => a + b, 0) / aspects.length;
      if (avg > 1.5) cardAspect = "16/9";
      else if (avg > 1.2) cardAspect = "4/3";
      else if (avg > 0.9) cardAspect = "1/1";
      else if (avg > 0.6) cardAspect = "3/4";
      else cardAspect = "9/16";
    }
  }

  // ── Mood ──────────────────────────────────────────────────────────────
  const rBuckets = { 0: 0, 4: 0, 8: 0, 12: 0, 16: 0, 24: 0, 999: 0 };
  let rSum = 0, rCount = 0;

  for (const el of document.querySelectorAll(
    "[class*='card'], [class*='Card'], button, a[class*='btn'], a[class*='button'], [class*='box'], [class*='tile'], [class*='panel'], img[class*='rounded']"
  )) {
    const r = parseFloat(getComputedStyle(el).borderRadius) || 0;
    rSum += r;
    rCount++;
    const b = r <= 0 ? 0 : r <= 4 ? 4 : r <= 8 ? 8 : r <= 12 ? 12 : r <= 16 ? 16 : r <= 24 ? 24 : 999;
    rBuckets[b]++;
  }

  const totalRB = Object.values(rBuckets).reduce((a, b) => a + b, 0) || 1;
  const radiusDist = {};
  for (const [k, v] of Object.entries(rBuckets)) radiusDist[k] = Math.round((v / totalRB) * 100) / 100;

  // Padding density
  let pSum = 0, pCount = 0;
  for (const el of document.querySelectorAll("section, [class*='section'], [class*='container'], main > div")) {
    const p = parseFloat(getComputedStyle(el).paddingTop) || 0;
    if (p > 0) { pSum += p; pCount++; }
  }

  // Shadows
  let shCount = 0;
  for (const el of document.querySelectorAll("[class*='card'], [class*='Card'], [class*='box'], [class*='shadow']")) {
    const bs = getComputedStyle(el).boxShadow;
    if (bs && bs !== "none") shCount++;
  }

  // Animations
  let animCount = 0;
  const transDurs = [];
  let animScan = 0;
  for (const el of document.querySelectorAll("*")) {
    if (animScan++ > 3000) break;
    const cs = getComputedStyle(el);
    if (cs.transitionDuration && cs.transitionDuration !== "0s") {
      animCount++;
      const d = parseFloat(cs.transitionDuration);
      if (d > 0) transDurs.push(Math.round(d * 1000));
    }
    if (cs.animationName && cs.animationName !== "none") animCount++;
  }

  // Gradients
  let hasGrad = false;
  for (const el of document.querySelectorAll("body, header, section, [class*='hero'], main, footer, [class*='gradient']")) {
    const bg = getComputedStyle(el).backgroundImage;
    if (bg && bg.includes("gradient")) { hasGrad = true; break; }
  }

  // ── Sticky nav ────────────────────────────────────────────────────────
  let hasSticky = false;
  const navEl = document.querySelector("nav, header, [class*='nav'], [class*='Nav']");
  if (navEl) {
    const pos = getComputedStyle(navEl).position;
    hasSticky = pos === "fixed" || pos === "sticky";
  }

  // Announcement bar
  let hasAnnounce = false;
  for (const b of document.querySelectorAll("[class*='announce'], [class*='banner'], [class*='top-bar'], [class*='marquee']")) {
    const r = b.getBoundingClientRect();
    if (r.top < 50 && r.height < 80 && r.height > 10) { hasAnnounce = true; break; }
  }

  // ── Raw extras ────────────────────────────────────────────────────────
  const navLinks = document.querySelectorAll("nav a, header a, [class*='nav'] a");
  const buttons = document.querySelectorAll("button, a[class*='btn'], a[class*='button'], [role='button']");
  const images = document.querySelectorAll("img");
  const forms = document.querySelectorAll("form");
  let btnRadius = 0;
  if (buttons.length > 0) btnRadius = parseFloat(getComputedStyle(buttons[0]).borderRadius) || 0;

  // text_main: most common non-bg color
  let textMain = "#000000";
  const nonBgColors = sortedColors.filter(([h]) => h !== bgMain);
  if (nonBgColors.length > 0) textMain = nonBgColors[0][0];

  return {
    page_metrics: {
      page_height_px: document.body.scrollHeight,
      viewport_width: window.innerWidth,
      section_count: sectionEls.length,
      has_sticky_nav: hasSticky,
      has_announcement_bar: hasAnnounce,
    },
    colors: {
      top_palette: topPalette,
      bg_main: bgMain,
      text_main: textMain,
      is_dark: isDark,
      bg_luminance: Math.round(bgLum * 100) / 100,
      primary_hue: primaryHue,
      accent_hue: accentHue,
      accent_saturation_avg: accentSatAvg,
      palette_size: new Set(sortedColors.map(([h]) => h)).size,
    },
    typography: {
      display_font: displayFont,
      body_font: bodyFont,
      fonts_used: fontsUsed,
      hero_h1_size_px: heroH1Size,
      body_size_px: bodySize,
      body_line_height: Math.round(bodyLH * 10) / 10,
      display_weight: displayWeight,
      font_count: fontsUsed.length,
    },
    layout: {
      hero_type: heroType,
      hero_signals: heroSignals,
      section_sequence: sectionSequence.slice(0, 15),
      section_types: sectionTypes,
      has_asymmetric_grid: hasAsym,
      grid_cols_max: gridColsMax,
      card_count: cardCount,
      card_aspect: cardAspect,
      has_bento: hasBento,
    },
    mood: {
      radius_avg_px: rCount > 0 ? Math.round(rSum / rCount) : 0,
      radius_distribution: radiusDist,
      density_padding_avg_px: pCount > 0 ? Math.round(pSum / pCount) : 24,
      shadow_usage: shCount === 0 ? "none" : shCount < 5 ? "light" : shCount < 15 ? "medium" : "heavy",
      animation_count: animCount,
      transition_durations_ms: [...new Set(transDurs)].sort((a, b) => a - b).slice(0, 5),
      has_gradient: hasGrad,
      dark_mode: isDark,
      monochrome: new Set(sortedColors.map(([h]) => h)).size <= 3,
    },
    raw_extras: {
      nav_links_count: navLinks.length,
      button_count: buttons.length,
      primary_button_radius_px: Math.round(btnRadius),
      image_count: images.length,
      form_count: forms.length,
    },
  };
}

// ── Site Processor ──────────────────────────────────────────────────────────

async function processSite(browser, site) {
  const hostname = hostnameOf(site.url);
  const siteDir = path.join(OUTPUT_DIR, hostname);
  const extractionPath = path.join(siteDir, "extraction.json");

  // Resume check
  if (FLAGS.resume && fs.existsSync(extractionPath)) {
    return { status: "skipped", hostname, reason: "already extracted" };
  }

  ensureDir(siteDir);

  const context = await browser.newContext({
    viewport: VIEWPORT,
    userAgent: UA,
    bypassCSP: true,
    // Allow images but limit request count
  });

  // Block heavy resources that aren't needed for extraction
  await context.route("**/*", (route) => {
    const type = route.request().resourceType();
    if (type === "media" || type === "websocket") {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();

  try {
    // Navigate
    try {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: GOTO_TIMEOUT_MS });
    } catch (gotoErr) {
      // Fallback: commit-level
      try {
        await page.goto(site.url, { waitUntil: "commit", timeout: 30_000 });
      } catch (e2) {
        throw new Error(`goto failed: ${gotoErr.message}`);
      }
    }

    // Wait for page to settle (SPA rendering, lazy images, font loading)
    await sleep(SETTLE_MS);

    // Wait for fonts with timeout (DON'T override — it breaks font detection)
    await page.evaluate(() => {
      return Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ]);
    }).catch(() => {});

    // Scroll to trigger lazy loading (with safety checks)
    await page.evaluate(async () => {
      if (!document.body) return;
      await new Promise((resolve) => {
        let total = 0;
        const step = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, step);
          total += step;
          if (total >= document.body.scrollHeight || total > 50000) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 80);
      });
    }).catch(() => {});

    await sleep(1500);

    // Re-check page height for SPA — extra wait if tiny
    const h = await page.evaluate(() => document.body ? document.body.scrollHeight : 0).catch(() => 0);
    if (h > 0 && h < 500) {
      await sleep(4000);
    }

    // ── Screenshots ──────────────────────────────────────────────────────
    // Viewport screenshot
    try {
      await page.screenshot({
        path: path.join(siteDir, "screenshot-viewport.png"),
        type: "png",
        timeout: 15_000,
      });
    } catch (e) {
      console.log(`    ⚠️ viewport screenshot: ${e.message?.slice(0, 80)}`);
    }

    // Full page screenshot (skip if too tall)
    const fullH = await page.evaluate(() => document.body ? document.body.scrollHeight : 0).catch(() => 0);
    if (fullH > 0 && fullH < MAX_PAGE_HEIGHT) {
      try {
        await page.screenshot({
          path: path.join(siteDir, "screenshot-full.png"),
          type: "png",
          fullPage: true,
          timeout: 20_000,
        });
      } catch (e) {
        console.log(`    ⚠️ full screenshot: ${e.message?.slice(0, 80)}`);
      }
    } else if (fullH >= MAX_PAGE_HEIGHT) {
      console.log(`    ⚠️ full screenshot skipped (page ${fullH}px > ${MAX_PAGE_HEIGHT})`);
    }

    // ── Extraction ───────────────────────────────────────────────────────
    let payload;
    try {
      payload = await Promise.race([
        page.evaluate(buildExtractionPayload),
        sleep(15_000).then(() => { throw new Error("evaluate timeout"); }),
      ]);
    } catch (e) {
      console.log(`    ⚠️ extraction evaluate failed: ${e.message}`);
      // Minimal fallback
      payload = {
        page_metrics: { page_height_px: fullH, viewport_width: 1440, section_count: 0, has_sticky_nav: false, has_announcement_bar: false },
        colors: { top_palette: [], bg_main: "#FFFFFF", text_main: "#000000", is_dark: false, bg_luminance: 1, primary_hue: 0, accent_hue: 0, accent_saturation_avg: 0, palette_size: 0 },
        typography: { display_font: "unknown", body_font: "unknown", fonts_used: [], hero_h1_size_px: 0, body_size_px: 16, body_line_height: 1.5, display_weight: 400, font_count: 0 },
        layout: { hero_type: "centered", hero_signals: { has_large_image: false, image_position: "none", image_width_pct: 0, has_centered_text: false }, section_sequence: [], section_types: {}, has_asymmetric_grid: false, grid_cols_max: 0, card_count: 0, card_aspect: "1/1", has_bento: false },
        mood: { radius_avg_px: 0, radius_distribution: { "0": 0, "4": 0, "8": 0, "12": 0, "16": 0, "24": 0, "999": 0 }, density_padding_avg_px: 0, shadow_usage: "none", animation_count: 0, transition_durations_ms: [], has_gradient: false, dark_mode: false, monochrome: true },
        raw_extras: { nav_links_count: 0, button_count: 0, primary_button_radius_px: 0, image_count: 0, form_count: 0 },
      };
    }

    const extraction = {
      url: site.url,
      hostname,
      title: site.title || hostname,
      niches: site.niches || [],
      extracted_at: today(),
      extract_duration_ms: 0,
      ...payload,
    };

    return { status: "ok", hostname, extraction };
  } catch (err) {
    return { status: "failed", hostname, error: err.message };
  } finally {
    await context.close().catch(() => {});
  }
}

// ── Queue Runner ────────────────────────────────────────────────────────────

async function run(sites) {
  ensureDir(OUTPUT_DIR);

  let browser = await chromium.launch({ headless: true });
  const results = [];
  const queue = [...sites];
  let running = 0;
  let completed = 0;
  let failed = 0;
  let skipped = 0;
  let sinceRestart = 0;
  const startTime = Date.now();

  console.log(`[corpus-extract] v2 — Extracting ${queue.length} sites (concurrency=${CONCURRENCY})`);
  console.log(`[corpus-extract] Output: ${OUTPUT_DIR}`);
  console.log("");

  function progress() {
    const done = completed + failed + skipped;
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const eta = done > 0 ? Math.round(((queue.length - done) / done) * elapsed) : 0;
    const etaMin = Math.floor(eta / 60);
    console.log(
      `[${done}/${queue.length}] ✅${completed} ❌${failed} ⏭️${skipped} | ${Math.floor(elapsed / 60)}m${elapsed % 60}s elapsed | ETA ~${etaMin}m`
    );
  }

  async function restartBrowser() {
    try { await browser.close(); } catch (_) {}
    browser = await chromium.launch({ headless: true });
    sinceRestart = 0;
    console.log(`  🔄 Browser restarted`);
  }

  async function worker(site) {
    const t0 = Date.now();
    const result = await processSite(browser, site);
    const dur = Date.now() - t0;

    if (result.status === "ok") {
      result.extraction.extract_duration_ms = dur;
      const siteDir = path.join(OUTPUT_DIR, result.hostname);
      ensureDir(siteDir);
      fs.writeFileSync(path.join(siteDir, "extraction.json"), JSON.stringify(result.extraction, null, 2));
      completed++;
      console.log(`  [${completed + failed + skipped}/${queue.length}] ✅ ${result.hostname} ${Math.round(dur / 1000)}s`);
    } else if (result.status === "skipped") {
      skipped++;
      console.log(`  [${completed + failed + skipped}/${queue.length}] ⏭️ ${result.hostname} skipped`);
    } else {
      failed++;
      console.log(`  [${completed + failed + skipped}/${queue.length}] ❌ ${result.hostname} — ${result.error?.slice(0, 100)}`);
    }

    results.push(result);

    if ((completed + failed + skipped) % 5 === 0) progress();
  }

  // Slot-based concurrency with browser restarts
  const workers = [];
  for (let i = 0; i < queue.length; i++) {
    while (running >= CONCURRENCY) await sleep(200);

    // Restart browser periodically
    if (BROWSER_RESTART_EVERY > 0 && sinceRestart >= BROWSER_RESTART_EVERY) {
      while (running > 0) await sleep(500);
      await restartBrowser();
    }

    running++;
    sinceRestart++;
    const p = worker(queue[i]).finally(() => { running--; });
    workers.push(p);

    if (i < queue.length - 1) await sleep(RATE_MS);
  }

  await Promise.all(workers);
  await browser.close().catch(() => {});

  // ── Summary ────────────────────────────────────────────────────────────
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const durations = results.filter((r) => r.status === "ok" && r.extraction).map((r) => r.extraction.extract_duration_ms);
  const avgDur = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const failedList = results.filter((r) => r.status === "failed").map((r) => ({ hostname: r.hostname, error: r.error }));

  // Niche breakdown
  const nicheBreakdown = {};
  results.forEach((r) => {
    const site = queue.find((s) => hostnameOf(s.url) === r.hostname);
    if (site && site.niches) {
      site.niches.forEach((n) => {
        if (!nicheBreakdown[n]) nicheBreakdown[n] = { total: 0, ok: 0, failed: 0 };
        nicheBreakdown[n].total++;
        if (r.status === "ok") nicheBreakdown[n].ok++;
        else if (r.status === "failed") nicheBreakdown[n].failed++;
      });
    }
  });

  const summary = {
    total: sites.length,
    succeeded: completed,
    failed,
    skipped,
    failed_list: failedList,
    avg_duration_ms: avgDur,
    total_duration_min: Math.round(totalTime / 60 * 10) / 10,
    niche_breakdown: nicheBreakdown,
    completed_at: new Date().toISOString(),
  };

  fs.writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2));

  console.log("");
  console.log("=".repeat(60));
  console.log(`[corpus-extract] COMPLETE`);
  console.log(`  Total: ${summary.total} | OK: ${completed} | Failed: ${failed} | Skipped: ${skipped}`);
  console.log(`  Avg: ${avgDur}ms | Total: ${summary.total_duration_min}min`);
  console.log(`  Summary: ${SUMMARY_PATH}`);
  console.log("");
  console.log("  Niche breakdown:");
  for (const [n, d] of Object.entries(nicheBreakdown)) {
    console.log(`    ${n}: ${d.ok}/${d.total} ok`);
  }
  console.log("=".repeat(60));

  return summary;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  let sites;

  if (FLAGS.urls) {
    // Direct URL list
    sites = FLAGS.urls.split(",").map((url) => ({
      url: url.trim(),
      title: hostnameOf(url.trim()),
      niches: ["manual"],
    }));
    console.log(`[corpus-extract] Manual URLs: ${sites.length}`);
  } else {
    // Check for --input=file flag
    const inputArg = args.find((a) => a.startsWith("--input="));
    const inputPath = inputArg
      ? path.resolve(__dirname, "..", inputArg.split("=")[1])
      : SELECTED_PATH;
    const selected = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
    sites = selected.sites;
  }

  if (FLAGS.niche) {
    sites = sites.filter((s) => s.niches && s.niches.includes(FLAGS.niche));
    console.log(`[corpus-extract] Niche="${FLAGS.niche}": ${sites.length} sites`);
  }

  if (FLAGS.limit > 0) {
    sites = sites.slice(0, FLAGS.limit);
    console.log(`[corpus-extract] Limited to ${sites.length} sites`);
  }

  if (FLAGS.dryRun) {
    console.log(`[corpus-extract] DRY RUN — ${sites.length} sites:`);
    sites.forEach((s, i) => console.log(`  ${i + 1}. ${hostnameOf(s.url)} [${(s.niches || []).join(", ")}]`));
    return;
  }

  await run(sites);
}

main().catch((err) => {
  console.error("[corpus-extract] FATAL:", err.message);
  process.exit(1);
});
