#!/usr/bin/env node
/**
 * Playwright scraper for SPA web design galleries.
 *
 * Targets:
 *   landinglove   — https://www.landing.love/ (~2107 sites, 2-phase: list→detail)
 *   darkmodedesign — https://www.darkmodedesign.com/ (~80 sites, direct from cards)
 *
 * Usage:
 *   NODE_PATH="C:/Users/Ваня/.pi/agent/node_modules" node sources/scraper-playwright.js <gallery> [opts]
 *
 * Options:
 *   --categories=Cat1,Cat2   Only these categories (landinglove)
 *   --max-per-category=N     Max sites per category (default: 50)
 *   --max=N                  Max total sites (darkmodedesign, default: 200)
 *   --pages=N                Max pages (darkmodedesign, default: 5)
 *   --start-category=X       Resume from category X (landinglove)
 *   --resume                 Skip already-scraped hostnames from existing JSON
 *   --no-detail              Skip detail page visits (landinglove, dev only)
 *   --dry-run                Don't write output, just print summary
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.resolve(__dirname, "..", "raw", "links");
const RATE_MS = 250;
const DETAIL_RATE_MS = 300;
const TIMEOUT_MS = 20_000;
const SCROLL_DELAY = 350;
const SCROLL_STEP = 600;
const MAX_SCROLLS = 30;
const STALE_SCROLLS = 3;
const SETTLE_MS = 4000;

const EXCLUDE_HOSTS = new Set([
  "landing.love", "www.landing.love",
  "darkmodedesign.com", "www.darkmodedesign.com",
  "twitter.com", "x.com", "facebook.com", "instagram.com",
  "linkedin.com", "youtube.com", "github.com",
  "dribbble.com", "behance.net",
  "webflow.com", "framer.com", "framer.link",
  "vercel.app", "netlify.app",
  "cdn.landing.love", "img.landing.love", "static.landing.love",
  "lapa.ninja", "uistore.design", "bookmarks.design",
  "lottie.link", "lemonsqueezy.com", "screenstudio.com",
  "mobbin.com",
]);

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeUrl(raw) {
  if (!raw) return null;
  try {
    let u = new URL(raw);
    u.hash = "";
    const stripParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
      "ref", "fbclid", "gclid", "via", "source", "utm",
    ];
    for (const p of stripParams) u.searchParams.delete(p);
    let result = u.origin + u.pathname.replace(/\/$/, "") + u.search;
    return result.replace(/\/$/, "");
  } catch {
    return raw;
  }
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return (url || "").toLowerCase();
  }
}

function isExternal(url) {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    return !EXCLUDE_HOSTS.has(host) && !host.endsWith(".landing.love");
  } catch {
    return false;
  }
}

function loadExisting(filepath) {
  if (fs.existsSync(filepath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));
      return new Set((data.sites || []).map((s) => hostnameOf(s.url)));
    } catch {
      return new Set();
    }
  }
  return new Set();
}

function saveJson(filepath, data) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n  💾 Saved: ${filepath} (${data.sites.length} sites)`);
}

// ── Browser ─────────────────────────────────────────────────────────────────

async function launchBrowser() {
  return chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

async function newPage(browser) {
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT_MS);
  return { page, context };
}

// ── GALLERY: landing.love ───────────────────────────────────────────────────

async function scrapeLandingLove(browser, args) {
  const categoriesArg = args["categories"];
  const maxPerCategory = parseInt(args["max-per-category"] || "50", 10);
  const startCategory = args["start-category"] || null;
  const noDetail = args["no-detail"] === true;
  const resume = args["resume"] === true;
  const dryRun = args["dry-run"] === true;

  const outputPath = path.join(OUTPUT_DIR, "landinglove-links.json");
  const existingHosts = resume ? loadExisting(outputPath) : new Set();
  const allSites = [];
  const seenHosts = new Set(existingHosts);

  const { page, context } = await newPage(browser);

  // ── Step 1: Discover categories ──
  console.log("[landing.love] Opening main page to discover categories...");
  await page.goto("https://www.landing.love/", {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT_MS,
  });
  await sleep(5000);

  const categoryLinks = await page.evaluate(() => {
    const results = [];
    const seen = new Set();
    for (const el of document.querySelectorAll(
      "a[href*='/categories/'], a[href*='/style/']",
    )) {
      const href = el.getAttribute("href");
      const text = (el.textContent || "").trim();
      if (href && text && !seen.has(href)) {
        seen.add(href);
        results.push({ href, text });
      }
    }
    return results;
  });

  console.log(
    `[landing.love] Found ${categoryLinks.length} category links`,
  );
  categoryLinks.forEach((c) =>
    console.log(`    ${c.href} → "${c.text}"`),
  );

  const skipPatterns = /^(home|about|contact|login|sign|pricing|blog|faq|submit|add|upload|account|profile)$/i;

  let targetCategories = categoryLinks
    .filter((c) => {
      const name = c.text.replace(/\n\d+$/, "").trim();
      return name.length > 1 && !skipPatterns.test(name);
    })
    .map((c) => {
      // Clean name: "Minimal\n1368" → "Minimal"
      const name = c.text.replace(/\n\d+$/, "").trim();
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const url = c.href.startsWith("http")
        ? c.href
        : "https://www.landing.love" + c.href;
      return { name, slug, url };
    });

  // Filter by user-specified categories
  if (categoriesArg) {
    const wanted = categoriesArg.split(",").map((s) =>
      s.trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
    );
    targetCategories = targetCategories.filter((c) => {
      const nameKey = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const slugKey = c.slug.replace(/[^a-z0-9]/g, "");
      return wanted.some((w) => nameKey.includes(w) || slugKey.includes(w));
    });
    console.log(
      `[landing.love] Filtered to ${targetCategories.length} categories: ${targetCategories.map((c) => c.name).join(", ")}`,
    );
  }

  // Resume from start-category
  if (startCategory) {
    const idx = targetCategories.findIndex(
      (c) =>
        c.name.toLowerCase() === startCategory.toLowerCase() ||
        c.slug === startCategory.toLowerCase(),
    );
    if (idx > 0) {
      targetCategories = targetCategories.slice(idx);
      console.log(`[landing.love] Resuming from: ${targetCategories[0].name}`);
    }
  }

  // Deduplicate categories
  const seenSlugs = new Set();
  targetCategories = targetCategories.filter((c) => {
    if (seenSlugs.has(c.slug)) return false;
    seenSlugs.add(c.slug);
    return true;
  });

  console.log(
    `\n[landing.love] Will scrape ${targetCategories.length} categories`,
  );

  // ── Step 2: Collect cards from each category (paginated) ──
  const allCards = []; // { slug, title, thumbnail, tags, category }
  const MAX_PAGES_PER_CATEGORY = 10; // safety limit

  function extractCardsFromPage() {
    return page.evaluate(() => {
      const results = [];
      const overlayLinks = document.querySelectorAll(
        'a.absolute.inset-0[href^="/sites/"]',
      );
      for (const link of overlayLinks) {
        const href = link.getAttribute("href");
        const titleAttr = link.getAttribute("title") || "";
        const card = link.closest(".flex.flex-col.h-full");
        if (!card) continue;

        const video = card.querySelector("video");
        const thumbnail = video
          ? video.getAttribute("poster") || ""
          : "";

        const titleLink = card.querySelector('.pt-3 a[href^="/sites/"]');
        const title = titleLink
          ? (titleLink.textContent || "").trim()
          : titleAttr;

        const tags = [];
        const tagLinks = card.querySelectorAll(
          'a[href*="/categories/"], a[href*="/style/"]',
        );
        for (const t of tagLinks) {
          const tagText = (t.textContent || "").trim();
          if (tagText && tagText.length > 1) tags.push(tagText);
        }

        results.push({ href, title, thumbnail, tags });
      }
      return results;
    });
  }

  async function getNextPageUrl() {
    return page.evaluate(() => {
      // Find the "Next" pagination link (usually an arrow or "Next" text)
      const links = document.querySelectorAll("a[href*='/page/']");
      for (const link of links) {
        const href = link.getAttribute("href") || "";
        const text = (link.textContent || "").trim();
        // Match "Next" or arrow symbols
        if (text === "Next" || text === "›" || text === "→" || text === "»") {
          return href.startsWith("http") ? href : "https://www.landing.love" + href;
        }
      }
      // Fallback: find the highest page number link and check if we're on the last page
      return null;
    });
  }

  for (let ci = 0; ci < targetCategories.length; ci++) {
    const cat = targetCategories[ci];
    console.log(
      `\n[landing.love] 📂 ${ci + 1}/${targetCategories.length}: ${cat.name}`,
    );

    const catCardSet = new Map();

    try {
      // Page 1
      await page.goto(cat.url, {
        waitUntil: "domcontentloaded",
        timeout: TIMEOUT_MS,
      });
      await sleep(SETTLE_MS);

      for (let pg = 0; pg < MAX_PAGES_PER_CATEGORY; pg++) {
        const cards = await extractCardsFromPage();
        let newCount = 0;
        for (const c of cards) {
          if (!catCardSet.has(c.href)) {
            catCardSet.set(c.href, c);
            newCount++;
          }
        }

        console.log(
          `    📄 page ${pg + 1}: ${cards.length} cards, ${newCount} new (total: ${catCardSet.size})`,
        );

        if (catCardSet.size >= maxPerCategory) {
          console.log(`    ✅ Reached max-per-category (${maxPerCategory})`);
          break;
        }

        // Try next page
        const nextUrl = await getNextPageUrl();
        if (!nextUrl) {
          console.log(`    ⏹ No more pages`);
          break;
        }

        await page.goto(nextUrl, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_MS,
        });
        await sleep(RATE_MS + 1000);
      }
    } catch (err) {
      console.error(`    ❌ Error: ${err.message}`);
    }

    const cards = [...catCardSet.values()].slice(0, maxPerCategory);
    for (const card of cards) {
      card.category = cat.name;
      card.slug = card.href.replace("/sites/", "").replace(/\/$/, "");
    }
    allCards.push(...cards);

    console.log(
      `    ✅ ${cards.length} cards in "${cat.name}" (total: ${allCards.length})`,
    );

    await sleep(RATE_MS);
  }

  // Deduplicate across categories (same slug may appear in multiple)
  const uniqueCards = [];
  const seenSlugs2 = new Set();
  for (const card of allCards) {
    if (!seenSlugs2.has(card.slug)) {
      seenSlugs2.add(card.slug);
      uniqueCards.push(card);
    }
  }
  console.log(
    `\n[landing.love] Total unique cards: ${uniqueCards.length} (${allCards.length - uniqueCards.length} cross-category dups removed)`,
  );

  // ── Step 3: Visit detail pages for external URLs ──
  if (noDetail) {
    console.log(
      "[landing.love] --no-detail: skipping detail visits.",
    );
    for (const card of uniqueCards) {
      allSites.push({
        url: `https://www.landing.love/sites/${card.slug}/`,
        title: card.title,
        thumbnail: card.thumbnail,
        tags: card.tags,
        category: card.category,
        gallery_entry: `https://www.landing.love/sites/${card.slug}/`,
      });
    }
  } else {
    console.log(
      `[landing.love] Visiting ${uniqueCards.length} detail pages for external URLs...`,
    );

    for (let i = 0; i < uniqueCards.length; i++) {
      const card = uniqueCards[i];
      const detailUrl = `https://www.landing.love/sites/${card.slug}/`;
      const prog = `${i + 1}/${uniqueCards.length}`;

      try {
        await page.goto(detailUrl, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_MS,
        });
        await sleep(1500);

        const detail = await page.evaluate(() => {
          // "Visit Site" button
          let externalUrl = "";
          for (const el of document.querySelectorAll("a")) {
            if (el.textContent.trim() === "Visit Site") {
              externalUrl = el.getAttribute("href") || "";
              break;
            }
          }
          // Fallback: any external link with target=_blank (not template)
          if (!externalUrl) {
            for (const el of document.querySelectorAll("a[target='_blank']")) {
              const href = el.getAttribute("href") || "";
              if (
                href.startsWith("http") &&
                !href.includes("landing.love") &&
                !href.includes("webflow.com") &&
                !href.includes("framer.link") &&
                !href.includes("lapa.ninja") &&
                !href.includes("uistore.design") &&
                !href.includes("bookmarks.design") &&
                !href.includes("lottie.link") &&
                !href.includes("lemonsqueezy") &&
                !href.includes("screenstudio")
              ) {
                externalUrl = href;
                break;
              }
            }
          }
          return { externalUrl };
        });

        const normalized = normalizeUrl(detail.externalUrl);

        if (!detail.externalUrl || !isExternal(detail.externalUrl)) {
          console.log(
            `    [${prog}] ⏭ SKIP (no external URL): ${card.slug}`,
          );
          continue;
        }

        const host = hostnameOf(normalized);
        if (seenHosts.has(host)) {
          console.log(`    [${prog}] ⏭ DUP: ${host}`);
          continue;
        }

        seenHosts.add(host);
        allSites.push({
          url: normalized,
          title: card.title,
          thumbnail: card.thumbnail,
          tags: card.tags,
          category: card.category,
          gallery_entry: detailUrl,
        });

        console.log(
          `    [${prog}] ✅ ${host} | "${card.title.slice(0, 40)}" | tags: ${card.tags.join(", ")}`,
        );
      } catch (err) {
        console.error(`    [${prog}] ❌ ${card.slug}: ${err.message}`);
      }

      await sleep(DETAIL_RATE_MS);
    }
  }

  await context.close();

  const output = {
    gallery: "landinglove",
    gallery_url: "https://www.landing.love/",
    gallery_niche: "universal-animation",
    scraped_at: new Date().toISOString().split("T")[0],
    count: allSites.length,
    sites: allSites,
  };

  if (!dryRun) {
    saveJson(outputPath, output);
  }

  console.log(`\n[landing.love] 🏁 DONE. ${allSites.length} sites.`);
  return output;
}

// ── GALLERY: darkmodedesign.com ─────────────────────────────────────────────

async function scrapeDarkModeDesign(browser, args) {
  const maxTotal = parseInt(args["max"] || "200", 10);
  const maxPages = parseInt(args["pages"] || "5", 10);
  const resume = args["resume"] === true;
  const dryRun = args["dry-run"] === true;

  const outputPath = path.join(OUTPUT_DIR, "darkmodedesign-links.json");
  const existingHosts = resume ? loadExisting(outputPath) : new Set();
  const allSites = [];
  const seenHosts = new Set(existingHosts);

  const { page, context } = await newPage(browser);

  console.log("[darkmodedesign] Opening main page...");
  await page.goto("https://www.darkmodedesign.com/", {
    waitUntil: "domcontentloaded",
    timeout: TIMEOUT_MS,
  });
  await sleep(5000);

  // ── Discover pagination ──
  let paginationBase = "";
  const pageLinks = await page.evaluate(() => {
    const results = [];
    for (const el of document.querySelectorAll(
      "a[href*='page='], a[href*='/page/'], a[href*='?p=']",
    )) {
      const href = el.getAttribute("href");
      const text = (el.textContent || "").trim();
      if (href && text) results.push({ href, text });
    }
    return results;
  });
  console.log(
    `[darkmodedesign] Pagination: ${pageLinks.length} links`,
    pageLinks.slice(0, 10),
  );

  // Detect pagination pattern
  if (pageLinks.length > 0) {
    const sample = pageLinks[0].href;
    if (sample.includes("_page=")) {
      // Pattern: ?xxxx_page=2
      const match = sample.match(/(\?[^=]+_page)=/);
      if (match) paginationBase = match[1];
      else paginationBase = "_page";
    }
  }

  for (let p = 0; p < maxPages; p++) {
    if (allSites.length >= maxTotal) break;

    let pageUrl;
    if (p === 0) {
      pageUrl = "https://www.darkmodedesign.com/";
    } else if (paginationBase) {
      // paginationBase is like "?60a99e98_page" (already has ?)
      const param = paginationBase.startsWith("?")
        ? paginationBase
        : `?${paginationBase}`;
      pageUrl = `https://www.darkmodedesign.com/${param}=${p + 1}`;
    } else {
      pageUrl = `https://www.darkmodedesign.com/page/${p + 1}/`;
    }

    console.log(`\n[darkmodedesign] 📄 Page ${p + 1}: ${pageUrl}`);

    try {
      if (p > 0) {
        await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
          timeout: TIMEOUT_MS,
        });
        await sleep(SETTLE_MS);
      }

      const cards = await page.evaluate(() => {
        const results = [];
        const seen = new Set();

        // Strategy: find all external links in cards
        const cardSelectors = [
          "article a[href^='http']",
          "[class*='card'] a[href^='http']",
          "[class*='item'] a[href^='http']",
          "main a[href^='http']",
          "a[href^='http']",
        ];

        for (const sel of cardSelectors) {
          for (const el of document.querySelectorAll(sel)) {
            const href = el.getAttribute("href");
            if (
              !href ||
              href.includes("darkmodedesign.com") ||
              seen.has(href)
            )
              continue;

            seen.add(href);

            const card = el.closest(
              "article, [class*='card'], [class*='item'], li, div",
            );
            const title =
              (
                card?.querySelector(
                  "h2, h3, h4, [class*='title'], [class*='name']",
                )?.textContent ||
                el.textContent ||
                ""
              ).trim().slice(0, 200);

            const img = card?.querySelector("img");
            const thumbnail = img
              ? img.getAttribute("src") ||
                img.getAttribute("data-src") ||
                ""
              : "";

            results.push({ url: href, title, thumbnail });
          }
          if (results.length > 0) break; // stop after first working selector
        }
        return results;
      });

      console.log(`    Found ${cards.length} cards`);

      let added = 0;
      for (const card of cards) {
        if (allSites.length >= maxTotal) break;

        const normalized = normalizeUrl(card.url);
        const host = hostnameOf(normalized);

        if (!isExternal(card.url)) continue;
        if (seenHosts.has(host)) continue;

        seenHosts.add(host);
        allSites.push({
          url: normalized,
          title: card.title,
          thumbnail: card.thumbnail,
          tags: [],
          category: "Dark Mode",
          gallery_entry: pageUrl,
        });
        added++;
      }

      console.log(
        `    ✅ Added ${added} (total: ${allSites.length})`,
      );

      if (cards.length === 0) {
        console.log("    ⏹ No more cards, stopping.");
        break;
      }

      await sleep(RATE_MS);
    } catch (err) {
      console.error(`    ❌ Page ${p + 1}: ${err.message}`);
    }
  }

  await context.close();

  const output = {
    gallery: "darkmodedesign",
    gallery_url: "https://www.darkmodedesign.com/",
    gallery_niche: "dark-theme",
    scraped_at: new Date().toISOString().split("T")[0],
    count: allSites.length,
    sites: allSites,
  };

  if (!dryRun) {
    saveJson(outputPath, output);
  }

  console.log(`\n[darkmodedesign] 🏁 DONE. ${allSites.length} sites.`);
  return output;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = {};
  const gallery = process.argv[2];

  for (let i = 3; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith("--")) {
      const eqIdx = arg.indexOf("=");
      if (eqIdx > 0) {
        args[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
      } else {
        args[arg.slice(2)] = true;
      }
    }
  }

  if (!gallery || !["landinglove", "darkmodedesign"].includes(gallery)) {
    console.error(
      "Usage: node scraper-playwright.js <landinglove|darkmodedesign> [opts]",
    );
    console.error("  --categories=X,Y    Filter categories (landinglove)");
    console.error("  --max-per-category=N Sites per category (landinglove, default 50)");
    console.error("  --max=N             Max total sites (darkmodedesign)");
    console.error("  --pages=N           Max pages (darkmodedesign, default 5)");
    console.error("  --start-category=X  Resume from category (landinglove)");
    console.error("  --resume            Skip already-scraped hostnames");
    console.error("  --no-detail         Skip detail visits (landinglove, dev)");
    console.error("  --dry-run           Don't save output");
    process.exit(1);
  }

  console.log(`🚀 Playwright Scraper — ${gallery}`);
  console.log(`   Args:`, JSON.stringify(args));
  console.log(`   Output: ${OUTPUT_DIR}`);

  const browser = await launchBrowser();

  try {
    if (gallery === "landinglove") {
      await scrapeLandingLove(browser, args);
    } else if (gallery === "darkmodedesign") {
      await scrapeDarkModeDesign(browser, args);
    }
  } finally {
    await browser.close();
    console.log("\n🔒 Browser closed.");
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});