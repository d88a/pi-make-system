#!/usr/bin/env node
/**
 * HTTP scraper for 3 web design galleries (Wave A, corpus-pipeline).
 *
 * Usage:
 *   node sources/scraper-http.js <gallery> [--pages=N] [--start-page=N] [--no-tags]
 *
 * Gallery slugs: tympanus, minimal, bestagency
 *
 * Output: D:/pi/corpus/raw/links/{gallery-slug}-links.json
 */

const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.join(__dirname, "..", "raw", "links");
const DELAY_MS = 200;
const TIMEOUT_MS = 15000;
const MAX_RETRIES = 1;

// ── Helpers ─────────────────────────────────────────────────────────────────

function normalizeUrl(url) {
  try {
    const u = new URL(url);
    const stripParams = [
      "ref", "utm_source", "utm_medium", "utm_campaign",
      "utm_content", "utm_term", "fbclid", "gclid",
    ];
    for (const p of stripParams) u.searchParams.delete(p);
    let host = u.hostname.toLowerCase().replace(/^www\./, "");
    let pathname = u.pathname.replace(/\/$/, "");
    return `https://${host}${pathname}${u.search}`;
  } catch {
    return url;
  }
}

function normalizeHost(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return url;
  }
}

function isInternalUrl(url, galleryDomain) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const blocked = [
      galleryDomain, "twitter.com", "x.com", "facebook.com",
      "instagram.com", "linkedin.com", "pinterest.com", "youtube.com",
      "wordpress.com", "wordpress.org",
    ];
    return blocked.some(
      (d) => host === d || host.endsWith("." + d)
    );
  } catch {
    return true;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const resp = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 corpus-pipeline/1.0",
        },
      });
      clearTimeout(timer);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.text();
    } catch (err) {
      if (attempt < retries) {
        console.error(`  Retry ${attempt + 1}/${retries}: ${err.message}`);
        await sleep(1000);
      } else {
        throw err;
      }
    }
  }
}

// ── Resume / Save ──────────────────────────────────────────────────────────

function loadExisting(slug) {
  const filePath = path.join(OUTPUT_DIR, `${slug}-links.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return { sites: data.sites || [], count: data.count || 0 };
    } catch { /* ignore */ }
  }
  return { sites: [], count: 0 };
}

function saveOutput(slug, baseUrl, niche, sites) {
  const filePath = path.join(OUTPUT_DIR, `${slug}-links.json`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    filePath,
    JSON.stringify(
      {
        gallery: slug,
        gallery_url: baseUrl,
        gallery_niche: niche,
        scraped_at: new Date().toISOString().split("T")[0],
        count: sites.length,
        sites,
      },
      null,
      2
    ),
    "utf-8"
  );
  return filePath;
}

// ── Gallery-specific parsers ────────────────────────────────────────────────

function parseTympanus(root) {
  const sites = [];
  const articles = root.querySelectorAll("article.ct-webzibition");
  for (const article of articles) {
    const thumbLink = article.querySelector("a.ct-latest-thumb-webzibition");
    if (!thumbLink) continue;
    const rawUrl = thumbLink.getAttribute("href");
    if (!rawUrl || isInternalUrl(rawUrl, "tympanus.net")) continue;
    if (rawUrl.includes("readymag.com")) continue; // sponsored

    // Title: second <a> with same href, no class
    const allLinks = article.querySelectorAll("a");
    let title = "";
    for (const a of allLinks) {
      const cls = a.getAttribute("class") || "";
      if (!cls && a.getAttribute("href") === rawUrl) {
        title = (a.text || "").trim();
        break;
      }
    }

    const img = article.querySelector("img");
    const thumbnail = img ? img.getAttribute("src") || "" : "";

    // Gallery entry (detail page link)
    let galleryEntry = "";
    const badgeLink = article.querySelector("a.link-badge");
    if (badgeLink) {
      const bh = badgeLink.getAttribute("href");
      if (bh && bh.includes("tympanus.net")) galleryEntry = bh;
    }

    sites.push({ url: normalizeUrl(rawUrl), title, thumbnail, tags: [], category: "", gallery_entry: galleryEntry });
  }
  return sites;
}

function parseMinimalListing(root) {
  const sites = [];
  const posts = root.querySelectorAll("div.post.website");
  for (const post of posts) {
    const refLink = post.querySelector('a[href*="?ref=minimal.gallery"]');
    if (!refLink) continue;
    const rawUrl = refLink.getAttribute("href");
    if (!rawUrl || isInternalUrl(rawUrl, "minimal.gallery")) continue;

    const titleEl = post.querySelector("h2, h3");
    const title = titleEl ? titleEl.text.trim() : "";

    const img = post.querySelector("img");
    const thumbnail = img ? img.getAttribute("src") || "" : "";

    // Detail page URL for tag extraction
    const detailLink = post.querySelector('a[href*="/"][aria-label*="View details"]');
    let detailUrl = "";
    if (detailLink) {
      const dh = detailLink.getAttribute("href");
      if (dh && dh.includes("minimal.gallery")) detailUrl = dh;
    }

    sites.push({
      url: normalizeUrl(rawUrl),
      title,
      thumbnail,
      tags: [],
      category: "",
      gallery_entry: detailUrl,
      _detailUrl: detailUrl,
    });
  }
  return sites;
}

async function scrapeMinimalTags(sites, allSites, slug, baseUrl, niche, existingHosts) {
  let enriched = 0;
  let processed = 0;
  for (const site of sites) {
    if (!site._detailUrl && site.tags.length > 0) {
      // Already enriched, count it
      if (site.tags.length > 0) enriched++;
      processed++;
      continue;
    }
    if (!site._detailUrl) {
      processed++;
      continue;
    }
    try {
      await sleep(DELAY_MS);
      const html = await fetchWithRetry(site._detailUrl);
      const root = parse(html);
      // Only per-site tags from .meta-tags container, skip global footer tags
      const tagLinks = root.querySelectorAll('.meta-tags a[href*="/tag/"]');
      site.tags = tagLinks.map((t) => t.text.trim().toLowerCase());
      if (site.tags.length > 0) enriched++;
      // Clean up internal field
      delete site._detailUrl;
      processed++;
      if (processed % 50 === 0) {
        console.log(`  Tags enriched: ${enriched}/${sites.length} (processed: ${processed})`);
        saveOutput(slug, baseUrl, niche, allSites);
      }
    } catch (err) {
      delete site._detailUrl;
      processed++;
      // Keep going, tags remain empty
    }
  }
  return enriched;
}

function parseBestAgency(root) {
  const sites = [];
  const seen = new Set();

  // Find all cards by looking for the title link pattern
  const titleLinks = root.querySelectorAll('a.block[href*="/websites/"]');
  for (const titleLink of titleLinks) {
    const href = titleLink.getAttribute("href") || "";
    const text = (titleLink.text || "").trim();
    // Skip: View/Visit buttons, industry links, empty
    if (!text || text === "View" || text === "Visit" || text === "ViewView" || text === "VisitVisit") continue;
    if (href.includes("industry") || href.includes("?ref=")) continue;
    if (!href.includes("bestagencysites.com/websites/")) continue;

    // Walk up to find the card container
    let card = titleLink.parentNode;
    for (let d = 0; d < 6 && card; d++) {
      const cls = card.getAttribute("class") || "";
      if ((cls.includes("w-full") && cls.includes("px-4")) || card.tagName === "ARTICLE") {
        // Find the external visit link
        const visitLink = card.querySelector('a[href*="?ref=bestagencysites.com"]');
        if (!visitLink) break;
        const rawUrl = visitLink.getAttribute("href");
        if (!rawUrl || isInternalUrl(rawUrl, "bestagencysites.com")) break;
        const normalized = normalizeUrl(rawUrl);
        if (seen.has(normalized)) break;
        seen.add(normalized);

        // Thumbnail
        const img = card.querySelector("img");
        const thumbnail = img ? img.getAttribute("src") || "" : "";

        // Industry tags
        const industryLinks = card.querySelectorAll('a[href*="/websites/industry/"]');
        const tags = industryLinks.map((t) => t.text.trim().toLowerCase());

        sites.push({ url: normalized, title: text, thumbnail, tags, category: "", gallery_entry: "" });
        break;
      }
      card = card.parentNode;
    }
  }
  return sites;
}

// ── Gallery definitions ─────────────────────────────────────────────────────

const GALLERIES = {
  tympanus: {
    slug: "tympanus-webzibition",
    name: "Tympanus Webzibition",
    baseUrl: "https://tympanus.net/codrops/webzibition",
    niche: "universal",
    pageUrl: (p) =>
      p === 1
        ? "https://tympanus.net/codrops/webzibition/"
        : `https://tympanus.net/codrops/webzibition/page/${p}/`,
    totalPages: 46,
    parsePage: parseTympanus,
    needsTagScrape: false,
  },

  minimal: {
    slug: "minimal-gallery",
    name: "Minimal Gallery",
    baseUrl: "https://minimal.gallery",
    niche: "minimal",
    pageUrl: (p) =>
      p === 1
        ? "https://minimal.gallery/"
        : `https://minimal.gallery/websites/page/${p}/`,
    totalPages: 128,
    parsePage: parseMinimalListing,
    needsTagScrape: true,
  },

  bestagency: {
    slug: "bestagencysites",
    name: "Best Agency Sites",
    baseUrl: "https://bestagencysites.com",
    niche: "agency",
    pageUrl: (p) =>
      p === 1
        ? "https://bestagencysites.com/"
        : `https://bestagencysites.com/websites/page/${p}/`,
    totalPages: 3,
    parsePage: parseBestAgency,
    needsTagScrape: false,
  },
};

// ── Main scraper ────────────────────────────────────────────────────────────

async function scrape(gallery, maxPages, startPage, skipTags) {
  console.log(`\n=== ${gallery.name} ===`);
  console.log(`Base: ${gallery.baseUrl}`);

  const existing = loadExisting(gallery.slug);
  const existingHosts = new Set(existing.sites.map((s) => normalizeHost(s.url)));
  const allSites = [...existing.sites];
  let newCount = 0;
  let dupCount = 0;

  if (existing.sites.length > 0) {
    console.log(`Resume: ${existing.sites.length} sites, starting from page ${startPage}`);
  }

  let page = startPage;
  let emptyPages = 0;
  const maxP = Math.min(maxPages, gallery.totalPages);

  // Phase 1: scrape listing pages (skip if all sites have detail URLs or tags)
  const allHaveDetailOrTags = existing.sites.length > 0 &&
    existing.sites.every(s => s._detailUrl || s.tags.length > 0);
  if (allHaveDetailOrTags && gallery.needsTagScrape && !skipTags) {
    console.log(`All ${existing.sites.length} sites already have detail URLs or tags — skipping Phase 1.`);
  }

  while (page <= maxP && !allHaveDetailOrTags) {
    const url = gallery.pageUrl(page);
    console.log(`Page ${page}/${maxP}: ${url}`);

    let html;
    try {
      html = await fetchWithRetry(url);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      page++;
      continue;
    }

    const root = parse(html);
    const pageSites = gallery.parsePage(root);

    if (pageSites.length === 0) {
      emptyPages++;
      console.log(`  No sites (empty #${emptyPages})`);
      if (emptyPages >= 3) {
        console.log(`  3 empty pages — stopping.`);
        break;
      }
    } else {
      emptyPages = 0;
    }

    let pageNew = 0;
    for (const site of pageSites) {
      const host = normalizeHost(site.url);
      if (existingHosts.has(host)) {
        dupCount++;
        continue;
      }
      existingHosts.add(host);
      allSites.push(site);
      newCount++;
      pageNew++;
    }

    console.log(`  ${pageSites.length} found, ${pageNew} new (total: ${allSites.length}, dups: ${dupCount})`);
    saveOutput(gallery.slug, gallery.baseUrl, gallery.niche, allSites);
    page++;
    await sleep(DELAY_MS);
  }

  // Phase 2: enrich tags from detail pages (Minimal only)
  if (gallery.needsTagScrape && !skipTags) {
    console.log(`\n--- Phase 2: Enriching tags from detail pages ---`);
    const sitesNeedingTags = allSites.filter((s) => s._detailUrl && s.tags.length === 0);
    console.log(`  Sites needing tags: ${sitesNeedingTags.length}`);
    const enriched = await scrapeMinimalTags(sitesNeedingTags, allSites, gallery.slug, gallery.baseUrl, gallery.niche, existingHosts);
    console.log(`  Tags enriched: ${enriched}/${sitesNeedingTags.length}`);
    saveOutput(gallery.slug, gallery.baseUrl, gallery.niche, allSites);
  }

  // Clean up _detailUrl only if tags were scraped (or no tags needed)
  if (!gallery.needsTagScrape || skipTags) {
    for (const s of allSites) delete s._detailUrl;
  }
  saveOutput(gallery.slug, gallery.baseUrl, gallery.niche, allSites);

  return { sites: allSites, newCount, dupCount };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const galleryName = args[0];
  let maxPages = Infinity;
  let startPage = 1;
  let skipTags = false;

  for (const arg of args.slice(1)) {
    if (arg.startsWith("--pages=")) maxPages = parseInt(arg.split("=")[1], 10);
    else if (arg.startsWith("--start-page=")) startPage = parseInt(arg.split("=")[1], 10);
    else if (arg === "--no-tags") skipTags = true;
  }

  return { galleryName, maxPages, startPage, skipTags };
}

async function main() {
  const { galleryName, maxPages, startPage, skipTags } = parseArgs();

  if (!galleryName || !GALLERIES[galleryName]) {
    console.error("Usage: node sources/scraper-http.js <gallery> [--pages=N] [--start-page=N] [--no-tags]");
    console.error("Galleries: tympanus, minimal, bestagency");
    process.exit(1);
  }

  const gallery = GALLERIES[galleryName];
  const startTime = Date.now();

  try {
    const result = await scrape(gallery, maxPages, startPage, skipTags);
    const filePath = saveOutput(gallery.slug, gallery.baseUrl, gallery.niche, result.sites);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`\n=== ${gallery.name} COMPLETE ===`);
    console.log(`  File: ${filePath}`);
    console.log(`  Total: ${result.sites.length} sites`);
    console.log(`  New: ${result.newCount}, Dups: ${result.dupCount}`);
    console.log(`  Time: ${elapsed}s`);
  } catch (err) {
    console.error(`FATAL: ${err.message}`);
    process.exit(1);
  }
}

main();