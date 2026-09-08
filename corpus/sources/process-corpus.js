#!/usr/bin/env node
/**
 * Corpus Pipeline — Wave B: Dedup + Alive Filter + Selection
 * 
 * Steps:
 *   1. Cross-gallery deduplication (hostname key)
 *   2. Alive check (parallel HEAD/GET, 15 concurrent)
 *   3. Niche normalization (tag unification)
 *   4. Selection (~80-120 sites, balanced by niche)
 *   5. Master index (index.json)
 */

const fs = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────
const RAW_DIR = path.join(__dirname, '..', 'raw', 'links');
const OUT_DIR = path.join(__dirname, '..', 'raw');
const OUT_SELECTED = path.join(__dirname, '..', 'selected.json');
const OUT_INDEX = path.join(__dirname, '..', 'index.json');

const CONCURRENCY = 15;
const TIMEOUT_MS = 8000;

const GALLERY_FILES = [
  'tympanus-webzibition-links.json',
  'minimal-gallery-links.json',
  'bestagencysites-links.json',
  'landinglove-links.json',
  'darkmodedesign-links.json',
];

// ─── Tag → Niche Mapping ──────────────────────────────────────────────────────
const TAG_TO_NICHE = {
  // minimal
  'minimal': 'minimal',
  'one page': 'minimal',

  // portfolio
  'portfolio': 'portfolio',
  'personal': 'portfolio',
  'branding': 'portfolio',
  'photography': 'portfolio',

  // agency
  'agency': 'agency',
  'studio': 'agency',
  'digital': 'agency',
  'graphic design': 'agency',
  'marketing': 'agency',
  'development': 'agency',
  'production studio': 'agency',

  // ecommerce
  'e-commerce': 'ecommerce',
  'ecommerce': 'ecommerce',
  'eCommerce': 'ecommerce',
  'fashion': 'ecommerce',

  // saas-tech
  'saas': 'saas-tech',
  'SaaS': 'saas-tech',
  'startup': 'saas-tech',
  'product': 'saas-tech',
  'ai': 'saas-tech',
  'AI': 'saas-tech',
  'app': 'saas-tech',
  'App': 'saas-tech',
  'software': 'saas-tech',
  'technology': 'saas-tech',
  'Technology': 'saas-tech',
  'platform': 'saas-tech',
  'code library': 'saas-tech',
  'programming': 'saas-tech',
  'tools': 'saas-tech',
  'open source': 'saas-tech',
  'security': 'saas-tech',
  'crypto & web3': 'saas-tech',
  'crypto': 'saas-tech',
  'web3': 'saas-tech',
  'nft': 'saas-tech',
  'defi': 'saas-tech',

  // dark
  'dark mode': 'dark',
  'Dark Mode': 'dark',
  'dark': 'dark',

  // creative-animation
  '3d website': 'creative-animation',
  '3D Website': 'creative-animation',
  'animation': 'creative-animation',
  'Animation': 'creative-animation',
  'gradient': 'creative-animation',
  'Gradient': 'creative-animation',
  'horizontal scroll': 'creative-animation',
  'horizontal-scroll': 'creative-animation',
  'Horizontal Scroll': 'creative-animation',

  // architecture-realestate
  'architecture': 'architecture-realestate',
  'Architecture': 'architecture-realestate',
  'architecture & interior design': 'architecture-realestate',
  'real estate': 'architecture-realestate',
  'Real Estate': 'architecture-realestate',
  'Real Estate': 'architecture-realestate',

  // other
  'food & drink': 'other',
  'Food Drink': 'other',
  'art': 'other',
  'Art': 'other',
  'music': 'other',
  'Music': 'other',
  'sports': 'other',
  'Sports': 'other',
  'travel': 'other',
  'Travel': 'other',
  'health': 'other',
  'healthcare': 'other',
  'wellness': 'other',
  'beauty': 'other',
  'education': 'other',
  'Education': 'other',
  'finance': 'other',
  'Finance': 'other',
  'gaming': 'other',
  'games & gaming': 'other',
  'Gaming': 'other',
  'entertainment': 'other',
  'Entertainment': 'other',
  'lifestyle': 'other',
  'Lifestyle': 'other',
  'automotive': 'other',
  'Automotive': 'other',
  'event': 'other',
  'Event': 'other',
  'film': 'other',
  'Film': 'other',
  'books': 'other',
  'Books': 'other',
  'hardware': 'other',
  'Hardware': 'other',
  'home living': 'other',
  'Home Living': 'other',
  'newsletter': 'other',
  'Newsletter': 'other',
  'factory': 'other',
  'manufacturing': 'other',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hostname(url) {
  try {
    let h = new URL(url).hostname;
    return h.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

function normalizeTags(tags) {
  if (!tags || tags.length === 0) return [];
  const niches = new Set();
  for (const t of tags) {
    const key = typeof t === 'string' ? t.trim().toLowerCase() : '';
    const mapped = TAG_TO_NICHE[key] || TAG_TO_NICHE[t] || null;
    if (mapped) niches.add(mapped);
  }
  return [...niches];
}

function normalizeCategory(cat) {
  if (!cat) return null;
  const key = cat.trim();
  return TAG_TO_NICHE[key] || TAG_TO_NICHE[key.toLowerCase()] || null;
}

function metadataScore(site) {
  // Higher = richer metadata
  let score = 0;
  if (site.tags && site.tags.length > 0) score += site.tags.length * 2;
  if (site.category && site.category.length > 0) score += 5;
  if (site.thumbnail && !site.thumbnail.startsWith('data:')) score += 3;
  if (site.gallery_entry && site.gallery_entry.length > 0) score += 2;
  return score;
}

function galleryNicheRank(gallery) {
  const ranks = {
    'landinglove': 10,       // richest: 11 categories + tags
    'minimal-gallery': 8,     // 2400 with tags
    'darkmodedesign': 6,      // niche-specific
    'bestagencysites': 5,     // small but niche
    'tympanus-webzibition': 1, // no tags at all
  };
  return ranks[gallery] || 0;
}

// ─── Step 1: Load & Dedup ─────────────────────────────────────────────────────

function loadAll() {
  console.log('═══ Step 1: Loading & Deduplication ═══');
  const allSites = [];
  let totalInput = 0;

  for (const file of GALLERY_FILES) {
    const data = JSON.parse(fs.readFileSync(path.join(RAW_DIR, file), 'utf-8'));
    const gallery = data.gallery;
    console.log(`  Loaded ${file}: ${data.sites.length} sites (gallery: ${gallery})`);
    totalInput += data.sites.length;

    for (const site of data.sites) {
      allSites.push({
        ...site,
        _gallery: gallery,
        _gallery_url: data.gallery_url,
        _gallery_niche: data.gallery_niche,
      });
    }
  }

  console.log(`\n  Total input: ${totalInput} sites from ${GALLERY_FILES.length} galleries\n`);

  // Dedup by hostname
  const byHostname = new Map();
  let duplicates = 0;

  for (const site of allSites) {
    const h = hostname(site.url);
    if (!h) continue;

    const existing = byHostname.get(h);
    if (existing) {
      duplicates++;
      // Keep the richer one
      const existingScore = metadataScore(existing) + galleryNicheRank(existing._gallery);
      const newScore = metadataScore(site) + galleryNicheRank(site._gallery);

      if (newScore > existingScore) {
        // New site is better — merge sources
        byHostname.set(h, {
          ...site,
          sources: [...(existing.sources || [existing._gallery]), site._gallery],
        });
      } else {
        // Existing is better — add source
        existing.sources = [...new Set([...(existing.sources || [existing._gallery]), site._gallery])];
      }
    } else {
      byHostname.set(h, { ...site, sources: [site._gallery] });
    }
  }

  console.log(`  Unique hostnames: ${byHostname.size}`);
  console.log(`  Duplicates removed: ${duplicates}`);

  // Write deduped.json
  const deduped = {
    total_input: totalInput,
    unique_hostnames: byHostname.size,
    duplicates_removed: duplicates,
    sites: [...byHostname.values()].map(s => {
      const { _gallery, _gallery_url, _gallery_niche, ...rest } = s;
      return rest;
    }),
  };

  fs.writeFileSync(path.join(OUT_DIR, 'deduped.json'), JSON.stringify(deduped, null, 2));
  console.log(`  → raw/deduped.json (${deduped.sites.length} sites)`);

  return { deduped, byHostname, totalInput };
}

// ─── Step 2: Alive Check ──────────────────────────────────────────────────────

async function checkSite(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    // Try HEAD first
    let resp = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 CorpusPipeline/1.0' },
    });

    clearTimeout(timeout);
    const alive = resp.status >= 200 && resp.status < 400;
    return {
      url,
      hostname: hostname(url),
      alive,
      http_status: resp.status,
      final_url: resp.url,
      checked_at: new Date().toISOString(),
    };
  } catch (e) {
    // HEAD failed — try GET with no body
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), TIMEOUT_MS);
    try {
      let resp = await fetch(url, {
        method: 'GET',
        signal: controller2.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 CorpusPipeline/1.0' },
      });
      // Read just headers, don't consume body
      clearTimeout(timeout2);
      const alive = resp.status >= 200 && resp.status < 400;
      return {
        url,
        hostname: hostname(url),
        alive,
        http_status: resp.status,
        final_url: resp.url,
        checked_at: new Date().toISOString(),
      };
    } catch (e2) {
      clearTimeout(timeout2);
      return {
        url,
        hostname: hostname(url),
        alive: false,
        http_status: 0,
        final_url: url,
        error: e2.cause?.code || e2.message?.slice(0, 80) || 'unknown',
        checked_at: new Date().toISOString(),
      };
    }
  }
}

async function runAliveCheck(sites) {
  console.log('\n═══ Step 2: Alive Check (parallel, 15 concurrent) ═══');

  const results = [];
  const urls = sites.map(s => s.url);
  const total = urls.length;
  let done = 0;
  let aliveCount = 0;
  let deadCount = 0;

  const startTime = Date.now();

  // Process in batches of CONCURRENCY
  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = urls.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map(url => checkSite(url)));

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value);
        if (r.value.alive) aliveCount++;
        else deadCount++;
      } else {
        const url = 'unknown';
        results.push({
          url,
          hostname: hostname(url),
          alive: false,
          http_status: 0,
          final_url: url,
          error: r.reason?.message?.slice(0, 80) || 'promise_rejected',
          checked_at: new Date().toISOString(),
        });
        deadCount++;
      }
    }

    done += batch.length;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const pct = ((done / total) * 100).toFixed(1);
    process.stdout.write(`\r  Progress: ${done}/${total} (${pct}%) | alive=${aliveCount} dead=${deadCount} | ${elapsed}s`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n  Done in ${elapsed}s`);
  console.log(`  Alive: ${aliveCount} | Dead: ${deadCount}`);

  // Write alive-check.json
  fs.writeFileSync(path.join(OUT_DIR, 'alive-check.json'), JSON.stringify(results, null, 2));
  console.log(`  → raw/alive-check.json (${results.length} entries)`);

  // Build a map for quick lookup
  const aliveMap = new Map();
  for (const r of results) {
    aliveMap.set(r.hostname, r);
  }

  return { results, aliveMap, aliveCount, deadCount };
}

// ─── Step 3: Niche Normalization ──────────────────────────────────────────────

function normalizeNiches(sites, aliveMap) {
  console.log('\n═══ Step 3: Niche Normalization ═══');

  const nicheCounts = {};
  const enriched = [];

  for (const site of sites) {
    const hn = hostname(site.url);
    const alive = aliveMap.get(hn);
    const isAlive = alive ? alive.alive : null;

    // Get niches from tags + category
    let niches = normalizeTags(site.tags);
    const catNiche = normalizeCategory(site.category);
    if (catNiche && !niches.includes(catNiche)) {
      niches.push(catNiche);
    }

    // If no niches from tags, try gallery inference
    if (niches.length === 0) {
      if (site.sources) {
        for (const src of site.sources) {
          if (src === 'darkmodedesign') niches.push('dark');
          else if (src === 'bestagencysites') niches.push('agency');
          else if (src === 'minimal-gallery') niches.push('universal-creative');
          else if (src === 'tympanus-webzibition') niches.push('universal-creative');
        }
      }
      if (niches.length === 0) niches.push('universal-creative');
    }

    // Deduplicate
    niches = [...new Set(niches)];

    for (const n of niches) {
      nicheCounts[n] = (nicheCounts[n] || 0) + 1;
    }

    enriched.push({ ...site, niches, alive: isAlive });
  }

  console.log('  Niche distribution:');
  for (const [niche, count] of Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${niche}: ${count}`);
  }

  return { enriched, nicheCounts };
}

// ─── Step 4: Selection ────────────────────────────────────────────────────────

function selectSites(enriched, nicheCounts) {
  console.log('\n═══ Step 4: Selection (~80-120 sites) ═══');

  // Quotas (priority order)
  const quotas = {
    'minimal': 20,
    'saas-tech': 18,
    'ecommerce': 15,
    'portfolio': 15,
    'agency': 12,
    'dark': 10,
    'creative-animation': 8,
    'architecture-realestate': 8,
    'universal-creative': 4,
  };

  // Group alive sites by niche
  const byNiche = {};
  for (const niche of Object.keys(quotas)) {
    byNiche[niche] = [];
  }

  for (const site of enriched) {
    if (!site.alive) continue; // Only alive
    for (const niche of site.niches) {
      if (byNiche[niche]) {
        byNiche[niche].push(site);
      }
    }
  }

  // Sort each niche group: prefer thumbnail + tags
  for (const [niche, sites] of Object.entries(byNiche)) {
    sites.sort((a, b) => {
      // Thumbnail bonus
      const aThumb = a.thumbnail && !a.thumbnail.startsWith('data:') ? 1 : 0;
      const bThumb = b.thumbnail && !b.thumbnail.startsWith('data:') ? 1 : 0;
      if (aThumb !== bThumb) return bThumb - aThumb;

      // Tags bonus
      const aTags = a.tags ? a.tags.length : 0;
      const bTags = b.tags ? b.tags.length : 0;
      if (aTags !== bTags) return bTags - aTags;

      return 0;
    });
  }

  // Select from each niche, enforce diversity
  const selected = [];
  const usedHostnameBase = new Map(); // Track hostname patterns

  function hostnameBase(hn) {
    // Extract base: "xxx.tld" from "sub.xxx.tld" or just "xxx.tld"
    const parts = hn.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return hn;
  }

  function isTooSimilar(hn) {
    const base = hostnameBase(hn);
    return (usedHostnameBase.get(base) || 0) >= 2;
  }

  for (const [niche, quota] of Object.entries(quotas)) {
    const pool = byNiche[niche] || [];
    let selectedForNiche = 0;

    for (const site of pool) {
      if (selectedForNiche >= quota) break;
      const hn = hostname(site.url);
      if (isTooSimilar(hn)) continue;

      selected.push(site);
      usedHostnameBase.set(hostnameBase(hn), (usedHostnameBase.get(hostnameBase(hn)) || 0) + 1);
      selectedForNiche++;
    }
  }

  // Build output
  const byNicheOut = {};
  for (const site of selected) {
    for (const niche of site.niches) {
      byNicheOut[niche] = (byNicheOut[niche] || 0) + 1;
    }
  }

  console.log(`  Selected: ${selected.length} sites`);
  console.log('  By niche (fact vs quota):');
  for (const [niche, quota] of Object.entries(quotas)) {
    const fact = selected.filter(s => s.niches.includes(niche)).length;
    const status = fact >= quota ? '✅' : fact > 0 ? '⚠️' : '❌';
    console.log(`    ${status} ${niche}: ${fact}/${quota}`);
  }

  // Write selected.json
  const selectedOut = {
    selected_at: new Date().toISOString().split('T')[0],
    total: selected.length,
    by_niche: byNicheOut,
    sites: selected.map(s => {
      const { _gallery, _gallery_url, _gallery_niche, ...rest } = s;
      return rest;
    }),
  };

  fs.writeFileSync(OUT_SELECTED, JSON.stringify(selectedOut, null, 2));
  console.log(`  → selected.json (${selected.length} sites)`);

  return { selected, byNicheOut, selectedOut };
}

// ─── Step 5: Master Index ─────────────────────────────────────────────────────

function writeIndex(totalInput, deduped, aliveCount, deadCount, selectedOut) {
  console.log('\n═══ Step 5: Master Index ═══');

  const index = {
    scraped_at: new Date().toISOString().split('T')[0],
    galleries: [
      'tympanus-webzibition',
      'minimal-gallery',
      'bestagencysites',
      'landinglove',
      'darkmodedesign',
    ],
    total_input: totalInput,
    unique_hostnames: deduped.unique_hostnames,
    duplicates_removed: deduped.duplicates_removed,
    alive_count: aliveCount,
    dead_count: deadCount,
    selected_for_extraction: selectedOut.total,
    files: {
      deduped: 'raw/deduped.json',
      alive: 'raw/alive-check.json',
      selected: 'selected.json',
    },
  };

  fs.writeFileSync(OUT_INDEX, JSON.stringify(index, null, 2));
  console.log(`  → index.json`);
  console.log(JSON.stringify(index, null, 2));

  return index;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═'.repeat(60));
  console.log('  CORPUS PIPELINE — Wave B: Dedup + Alive + Selection');
  console.log('═'.repeat(60));

  const totalStart = Date.now();

  // Step 1
  const step1Start = Date.now();
  const { deduped, byHostname, totalInput } = loadAll();
  const step1Time = ((Date.now() - step1Start) / 1000).toFixed(1);

  // Step 2
  const step2Start = Date.now();
  const { results, aliveMap, aliveCount, deadCount } = await runAliveCheck(deduped.sites);
  const step2Time = ((Date.now() - step2Start) / 1000).toFixed(1);

  // Step 3
  const step3Start = Date.now();
  const { enriched, nicheCounts } = normalizeNiches(deduped.sites, aliveMap);
  const step3Time = ((Date.now() - step3Start) / 1000).toFixed(1);

  // Step 4
  const step4Start = Date.now();
  const { selected, byNicheOut, selectedOut } = selectSites(enriched, nicheCounts);
  const step4Time = ((Date.now() - step4Start) / 1000).toFixed(1);

  // Step 5
  const step5Start = Date.now();
  const index = writeIndex(totalInput, deduped, aliveCount, deadCount, selectedOut);
  const step5Time = ((Date.now() - step5Start) / 1000).toFixed(1);

  const totalTime = ((Date.now() - totalStart) / 1000).toFixed(1);

  // ─── Final Report ───────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60));
  console.log('  FINAL REPORT');
  console.log('═'.repeat(60));

  console.log(`\n  ⏱ Timing:`);
  console.log(`    Step 1 (dedup):  ${step1Time}s`);
  console.log(`    Step 2 (alive):  ${step2Time}s`);
  console.log(`    Step 3 (niches): ${step3Time}s`);
  console.log(`    Step 4 (select): ${step4Time}s`);
  console.log(`    Step 5 (index):  ${step5Time}s`);
  console.log(`    TOTAL:           ${totalTime}s`);

  console.log(`\n  📊 Numbers:`);
  console.log(`    Input:    ${totalInput}`);
  console.log(`    Unique:   ${deduped.unique_hostnames}`);
  console.log(`    Dups:     ${deduped.duplicates_removed}`);
  console.log(`    Alive:    ${aliveCount}`);
  console.log(`    Dead:     ${deadCount}`);
  console.log(`    Selected: ${selectedOut.total}`);

  // Death reasons
  const deathReasons = {};
  for (const r of results) {
    if (!r.alive) {
      const reason = r.error || `HTTP ${r.http_status}`;
      deathReasons[reason] = (deathReasons[reason] || 0) + 1;
    }
  }
  console.log(`\n  ☠ Top death reasons:`);
  const topReasons = Object.entries(deathReasons)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  for (const [reason, count] of topReasons) {
    console.log(`    ${reason}: ${count}`);
  }

  // Sample selected
  console.log(`\n  📸 Sample selected (1-2 per niche):`);
  const niches = ['minimal', 'saas-tech', 'ecommerce', 'portfolio', 'agency', 'dark', 'creative-animation', 'architecture-realestate', 'universal-creative'];
  for (const niche of niches) {
    const sites = selectedOut.sites.filter(s => s.niches.includes(niche)).slice(0, 2);
    for (const s of sites) {
      console.log(`    [${niche}] ${s.url} — ${s.title} (niches: ${s.niches.join(', ')})`);
    }
  }

  console.log(`\n  ✅ Ready for Wave C (bulk extract-reference.js)`);
  console.log(`  Output files:`);
  console.log(`    ${path.join(OUT_DIR, 'deduped.json')}`);
  console.log(`    ${path.join(OUT_DIR, 'alive-check.json')}`);
  console.log(`    ${OUT_SELECTED}`);
  console.log(`    ${OUT_INDEX}`);
}

main().catch(err => {
  console.error('Pipeline failed:', err);
  process.exit(1);
});