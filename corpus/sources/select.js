#!/usr/bin/env node
/**
 * Steps 3-5: Niche Normalization + Selection + Master Index
 * Reads deduped.json + alive-check.json, produces selected.json + index.json
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'raw');
const DEDUPED_PATH = path.join(OUT_DIR, 'deduped.json');
const ALIVE_PATH = path.join(OUT_DIR, 'alive-check.json');
const OUT_SELECTED = path.join(__dirname, '..', 'selected.json');
const OUT_INDEX = path.join(__dirname, '..', 'index.json');

// ─── Tag → Niche Mapping ──────────────────────────────────────────────────────
const TAG_TO_NICHE = {
  'minimal': 'minimal', 'one page': 'minimal',
  'portfolio': 'portfolio', 'personal': 'portfolio', 'branding': 'portfolio', 'photography': 'portfolio',
  'agency': 'agency', 'studio': 'agency', 'digital': 'agency', 'graphic design': 'agency',
  'marketing': 'agency', 'development': 'agency', 'production studio': 'agency',
  'e-commerce': 'ecommerce', 'ecommerce': 'ecommerce', 'eCommerce': 'ecommerce', 'fashion': 'ecommerce',
  'saas': 'saas-tech', 'SaaS': 'saas-tech', 'startup': 'saas-tech', 'product': 'saas-tech',
  'ai': 'saas-tech', 'AI': 'saas-tech', 'app': 'saas-tech', 'App': 'saas-tech',
  'software': 'saas-tech', 'technology': 'saas-tech', 'Technology': 'saas-tech',
  'platform': 'saas-tech', 'code library': 'saas-tech', 'programming': 'saas-tech',
  'tools': 'saas-tech', 'open source': 'saas-tech', 'security': 'saas-tech',
  'crypto & web3': 'saas-tech', 'crypto': 'saas-tech', 'web3': 'saas-tech',
  'nft': 'saas-tech', 'defi': 'saas-tech',
  'dark mode': 'dark', 'Dark Mode': 'dark', 'dark': 'dark',
  '3d website': 'creative-animation', '3D Website': 'creative-animation',
  'animation': 'creative-animation', 'Animation': 'creative-animation',
  'gradient': 'creative-animation', 'Gradient': 'creative-animation',
  'horizontal scroll': 'creative-animation', 'horizontal-scroll': 'creative-animation',
  'Horizontal Scroll': 'creative-animation',
  'architecture': 'architecture-realestate', 'Architecture': 'architecture-realestate',
  'architecture & interior design': 'architecture-realestate',
  'real estate': 'architecture-realestate', 'Real Estate': 'architecture-realestate',
  // other
  'food & drink': 'other', 'Food Drink': 'other', 'art': 'other', 'Art': 'other',
  'music': 'other', 'Music': 'other', 'sports': 'other', 'Sports': 'other',
  'travel': 'other', 'Travel': 'other', 'health': 'other', 'healthcare': 'other',
  'wellness': 'other', 'beauty': 'other', 'education': 'other', 'Education': 'other',
  'finance': 'other', 'Finance': 'other', 'gaming': 'other', 'games & gaming': 'other',
  'Gaming': 'other', 'entertainment': 'other', 'Entertainment': 'other',
  'lifestyle': 'other', 'Lifestyle': 'other', 'automotive': 'other', 'Automotive': 'other',
  'event': 'other', 'Event': 'other', 'film': 'other', 'Film': 'other',
  'books': 'other', 'Books': 'other', 'hardware': 'other', 'Hardware': 'other',
  'home living': 'other', 'Home Living': 'other', 'newsletter': 'other', 'Newsletter': 'other',
  'factory': 'other', 'manufacturing': 'other',
};

function hostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, '').toLowerCase(); }
  catch { return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase(); }
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

function hostnameBase(hn) {
  const parts = hn.split('.');
  return parts.length >= 2 ? parts.slice(-2).join('.') : hn;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const startTime = Date.now();

// Load
console.log('═══ Loading data ═══');
const deduped = JSON.parse(fs.readFileSync(DEDUPED_PATH, 'utf-8'));
const aliveData = JSON.parse(fs.readFileSync(ALIVE_PATH, 'utf-8'));
console.log(`  deduped.json: ${deduped.sites.length} sites`);
console.log(`  alive-check.json: ${aliveData.length} entries`);

// Build alive map
const aliveMap = new Map();
for (const r of aliveData) {
  aliveMap.set(r.hostname, r);
}
const aliveCount = aliveData.filter(r => r.alive).length;
const deadCount = aliveData.filter(r => !r.alive).length;
console.log(`  Alive: ${aliveCount} | Dead: ${deadCount}`);

// ─── Step 3: Niche Normalization ──────────────────────────────────────────────
console.log('\n═══ Step 3: Niche Normalization ═══');

const nicheCounts = {};
const enriched = [];

for (const site of deduped.sites) {
  const hn = hostname(site.url);
  const alive = aliveMap.get(hn);
  const isAlive = alive ? alive.alive : null;

  let niches = normalizeTags(site.tags);
  const catNiche = normalizeCategory(site.category);
  if (catNiche && !niches.includes(catNiche)) niches.push(catNiche);

  if (niches.length === 0 && site.sources) {
    for (const src of site.sources) {
      if (src === 'darkmodedesign') niches.push('dark');
      else if (src === 'bestagencysites') niches.push('agency');
      else if (src === 'minimal-gallery') niches.push('universal-creative');
      else if (src === 'tympanus-webzibition') niches.push('universal-creative');
    }
    if (niches.length === 0) niches.push('universal-creative');
  }

  niches = [...new Set(niches)];
  for (const n of niches) nicheCounts[n] = (nicheCounts[n] || 0) + 1;
  enriched.push({ ...site, niches, alive: isAlive, _hostname: hn });
}

console.log('  Niche distribution:');
for (const [niche, count] of Object.entries(nicheCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${niche}: ${count}`);
}

// ─── Step 4: Selection ────────────────────────────────────────────────────────
console.log('\n═══ Step 4: Selection (~80-120 sites) ═══');

const quotas = {
  'minimal': 20, 'saas-tech': 18, 'ecommerce': 15, 'portfolio': 15,
  'agency': 12, 'dark': 10, 'creative-animation': 8,
  'architecture-realestate': 8, 'universal-creative': 4,
};

// Group alive sites by niche
const byNiche = {};
for (const niche of Object.keys(quotas)) byNiche[niche] = [];

for (const site of enriched) {
  if (!site.alive) continue;
  for (const niche of site.niches) {
    if (byNiche[niche]) byNiche[niche].push(site);
  }
}

// Sort: prefer thumbnail + tags
for (const [niche, sites] of Object.entries(byNiche)) {
  sites.sort((a, b) => {
    const aThumb = a.thumbnail && !a.thumbnail.startsWith('data:') ? 1 : 0;
    const bThumb = b.thumbnail && !b.thumbnail.startsWith('data:') ? 1 : 0;
    if (aThumb !== bThumb) return bThumb - aThumb;
    const aTags = a.tags ? a.tags.length : 0;
    const bTags = b.tags ? b.tags.length : 0;
    return bTags - aTags;
  });
}

// Select with diversity + dedup across niches
// Each site selected once, counts toward its current niche quota only
const selected = [];
const selectedUrls = new Set();
const usedHostnameBase = new Map();
const nicheCount = {}; // How many unique sites selected for each niche
for (const n of Object.keys(quotas)) nicheCount[n] = 0;

// Process niches in priority order. For each niche, select sites that haven't been selected yet.
for (const [niche, quota] of Object.entries(quotas)) {
  const pool = byNiche[niche] || [];

  for (const site of pool) {
    if (nicheCount[niche] >= quota) break;
    const hn = site._hostname;

    // Skip if already selected for another niche
    if (selectedUrls.has(hn)) continue;

    const base = hostnameBase(hn);
    if ((usedHostnameBase.get(base) || 0) >= 2) continue;

    selected.push(site);
    selectedUrls.add(hn);
    usedHostnameBase.set(base, (usedHostnameBase.get(base) || 0) + 1);
    nicheCount[niche]++;
  }
}

const byNicheOut = {};
for (const site of selected) {
  for (const niche of site.niches) {
    byNicheOut[niche] = (byNicheOut[niche] || 0) + 1;
  }
}

console.log(`  Selected: ${selected.length} sites`);
console.log('  By niche (fact vs quota):');
for (const [niche, quota] of Object.entries(quotas)) {
  const fact = nicheCount[niche] || 0;
  const status = fact >= quota ? '✅' : fact > 0 ? '⚠️' : '❌';
  console.log(`    ${status} ${niche}: ${fact}/${quota}`);
}

// Write selected.json
const selectedOut = {
  selected_at: new Date().toISOString().split('T')[0],
  total: selected.length,
  by_niche: byNicheOut,
  sites: selected.map(s => {
    const { _hostname, ...rest } = s;
    return rest;
  }),
};

fs.writeFileSync(OUT_SELECTED, JSON.stringify(selectedOut, null, 2));
console.log(`  → selected.json (${selected.length} sites)`);

// ─── Step 5: Master Index ─────────────────────────────────────────────────────
console.log('\n═══ Step 5: Master Index ═══');

const index = {
  scraped_at: new Date().toISOString().split('T')[0],
  galleries: ['tympanus-webzibition', 'minimal-gallery', 'bestagencysites', 'landinglove', 'darkmodedesign'],
  total_input: deduped.total_input,
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

// ─── Death reasons ────────────────────────────────────────────────────────────
const deathReasons = {};
for (const r of aliveData) {
  if (!r.alive) {
    const reason = r.error || `HTTP ${r.http_status}`;
    deathReasons[reason] = (deathReasons[reason] || 0) + 1;
  }
}
console.log('\n═══ Death Reasons ═══');
const topReasons = Object.entries(deathReasons).sort((a, b) => b[1] - a[1]).slice(0, 10);
for (const [reason, count] of topReasons) {
  console.log(`  ${reason}: ${count}`);
}

// ─── Sample selected ──────────────────────────────────────────────────────────
console.log('\n═══ Sample Selected (1-2 per niche) ═══');
const niches = ['minimal', 'saas-tech', 'ecommerce', 'portfolio', 'agency', 'dark', 'creative-animation', 'architecture-realestate', 'universal-creative'];
for (const niche of niches) {
  const sites = selectedOut.sites.filter(s => s.niches.includes(niche)).slice(0, 2);
  for (const s of sites) {
    console.log(`  [${niche}] ${s.url} — ${s.title} (niches: ${s.niches.join(', ')})`);
  }
}

// ─── Architecture-realestate detail ───────────────────────────────────────────
console.log('\n═══ Architecture-Realestate Detail ═══');
const archSites = selectedOut.sites.filter(s => s.niches.includes('architecture-realestate'));
console.log(`  Selected: ${archSites.length}`);
for (const s of archSites) {
  console.log(`  ${s.url} — ${s.title} (sources: ${(s.sources||[]).join(', ')})`);
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`\n✅ Done in ${elapsed}s`);
console.log(`  Output: ${OUT_SELECTED}, ${OUT_INDEX}`);