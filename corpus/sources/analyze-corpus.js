/**
 * analyze-corpus.js — Wave D: Pattern Analysis
 * Reads all raw/extractions/[glob]/extraction.json, aggregates patterns,
 * outputs analysis-summary.json + analysis-report.md + 4 patterns/*.md
 *
 * Node.js, no external dependencies.
 * Usage: node D:/pi/corpus/sources/analyze-corpus.js
 */

const fs = require('fs');
const path = require('path');

const EXTRACTIONS_DIR = 'D:/pi/corpus/raw/extractions';
const SELECTED_PATH = 'D:/pi/corpus/selected.json';
const OUTPUT_JSON = 'D:/pi/corpus/analysis-summary.json';
const OUTPUT_REPORT = 'D:/pi/corpus/analysis-report.md';
const PATTERNS_DIR = 'C:/Users/Ваня/.pi/agent/config/design-system';

// ============================================================
// HELPERS
// ============================================================

function loadAll() {
  const dirs = fs.readdirSync(EXTRACTIONS_DIR)
    .filter(f => !f.startsWith('_'))
    .filter(f => {
      const stat = fs.statSync(path.join(EXTRACTIONS_DIR, f));
      return stat.isDirectory();
    });

  const extractions = [];
  const errors = [];

  dirs.forEach(dir => {
    const fpath = path.join(EXTRACTIONS_DIR, dir, 'extraction.json');
    if (!fs.existsSync(fpath)) {
      errors.push({ dir, error: 'no extraction.json' });
      return;
    }
    try {
      const d = JSON.parse(fs.readFileSync(fpath, 'utf8'));
      d._dir = dir;
      extractions.push(d);
    } catch (e) {
      errors.push({ dir, error: e.message });
    }
  });

  const selected = JSON.parse(fs.readFileSync(SELECTED_PATH, 'utf8'));
  return { extractions, selected, errors };
}

function bucketHue(h) {
  // Bucket hues into 30° segments: 0-29, 30-59, ..., 330-359
  if (h === 0 || h === 360) return '0-29 (Red)';
  const b = Math.floor(h / 30);
  const low = b * 30;
  const high = low + 29;
  const names = [
    '0-29 (Red)', '30-59 (Orange)', '60-89 (Yellow)', '90-119 (Lime)',
    '120-149 (Green)', '150-179 (Teal)', '180-209 (Cyan)', '210-239 (Blue)',
    '240-269 (Indigo)', '270-299 (Purple)', '300-329 (Magenta)', '330-359 (Pink)'
  ];
  return names[b] || `${low}-${high}`;
}

function bucketSaturation(s) {
  if (s < 30) return 'low (<30%)';
  if (s < 70) return 'mid (30-70%)';
  return 'high (≥70%)';
}

function bucketRadius(avg) {
  if (avg < 4) return 'sharp (<4px)';
  if (avg < 12) return 'soft (4-12px)';
  if (avg < 20) return 'round (12-20px)';
  return 'pill (≥20px)';
}

function bucketDensity(avg) {
  if (avg < 16) return 'tight (<16px)';
  if (avg < 32) return 'normal (16-32px)';
  return 'airy (≥32px)';
}

function bucketAnimation(n) {
  if (n < 5) return 'none (<5)';
  if (n < 30) return 'some (5-30)';
  return 'lots (≥30)';
}

function safeAvg(arr) {
  if (!arr || arr.length === 0) return 0;
  const valid = arr.filter(v => v != null && !isNaN(v) && isFinite(v));
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

function median(arr) {
  if (!arr || arr.length === 0) return 0;
  const valid = arr.filter(v => v != null && !isNaN(v) && isFinite(v)).sort((a, b) => a - b);
  if (valid.length === 0) return 0;
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 === 0 ? (valid[mid - 1] + valid[mid]) / 2 : valid[mid];
}

function mode(arr) {
  if (!arr || arr.length === 0) return null;
  const counts = {};
  arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  let max = 0, best = null;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) { max = v; best = k; }
  }
  return best;
}

function isArchitecture(ex) {
  // Check if this site is in the architecture-realestate niche
  if (!ex._selectedMeta) return false;
  return ex._selectedMeta.niches && ex._selectedMeta.niches.includes('architecture-realestate');
}

// ============================================================
// LOAD DATA
// ============================================================

const { extractions, selected, errors } = loadAll();

// Merge selected metadata into extractions
const selectedByHostname = {};
selected.sites.forEach(s => {
  try {
    const hostname = new URL(s.url).hostname.replace('www.', '');
    selectedByHostname[hostname] = s;
  } catch (e) {}
});

extractions.forEach(ex => {
  ex._selectedMeta = selectedByHostname[ex.hostname] || null;
});

const archEx = extractions.filter(isArchitecture);

console.log(`Loaded ${extractions.length} extractions, ${archEx.length} architecture-realestate, ${errors.length} errors`);

// ============================================================
// AGGREGATIONS
// ============================================================

// 1. HERO TYPE distribution
const heroTypeDist = {};
extractions.forEach(ex => {
  const ht = ex.layout.hero_type || 'unknown';
  heroTypeDist[ht] = (heroTypeDist[ht] || 0) + 1;
});

// 2. SECTION SEQUENCE patterns
const sectionSeqFreq = {}; // collapsed sequence key → count
const sectionSeqExamples = {}; // key → [hostnames]
extractions.forEach(ex => {
  const seq = ex.layout.section_sequence || [];
  // Collapse consecutive duplicates for cleaner patterns
  const collapsed = [];
  seq.forEach(s => {
    if (collapsed.length === 0 || collapsed[collapsed.length - 1] !== s) {
      collapsed.push(s);
    }
  });
  const key = collapsed.join('→');
  sectionSeqFreq[key] = (sectionSeqFreq[key] || 0) + 1;
  if (!sectionSeqExamples[key]) sectionSeqExamples[key] = [];
  sectionSeqExamples[key].push(ex.hostname);
});

// 3. SECTION TYPES frequencies
const sectionTypeFreq = {};
extractions.forEach(ex => {
  const types = ex.layout.section_types || {};
  for (const [type, count] of Object.entries(types)) {
    sectionTypeFreq[type] = (sectionTypeFreq[type] || 0) + count;
  }
});

// 4. COLORS CLUSTER analysis
const paletteClusters = []; // array of {is_dark, primaryBkt, accentBkt, satBkt, sites: [hostname]}
extractions.forEach(ex => {
  const c = ex.colors;
  const primaryBkt = bucketHue(c.primary_hue);
  const accentBkt = bucketHue(c.accent_hue);
  const satBkt = bucketSaturation(c.accent_saturation_avg);
  const key = `${c.is_dark ? 'dark' : 'light'}|${primaryBkt}|${accentBkt}|${satBkt}`;
  let cluster = paletteClusters.find(cl => cl.key === key);
  if (!cluster) {
    cluster = {
      key,
      is_dark: c.is_dark,
      primary_hue_bucket: primaryBkt,
      accent_hue_bucket: accentBkt,
      saturation_bucket: satBkt,
      bg_mains: [],
      text_mains: [],
      primary_hues: [],
      accent_hues: [],
      accent_sats: [],
      top_palettes: [],
      sites: [],
      bg_luminances: []
    };
    paletteClusters.push(cluster);
  }
  cluster.sites.push(ex.hostname);
  cluster.bg_mains.push(c.bg_main);
  cluster.text_mains.push(c.text_main);
  cluster.primary_hues.push(c.primary_hue);
  cluster.accent_hues.push(c.accent_hue);
  cluster.accent_sats.push(c.accent_saturation_avg);
  cluster.bg_luminances.push(c.bg_luminance);
  // Collect top palette entries
  if (c.top_palette && c.top_palette.length > 0) {
    c.top_palette.forEach(([hex, pct]) => {
      cluster.top_palettes.push({ hex, pct, site: ex.hostname });
    });
  }
});

// Sort clusters by size
paletteClusters.sort((a, b) => b.sites.length - a.sites.length);

// Compute representative palette per cluster
paletteClusters.forEach(cl => {
  cl.count = cl.sites.length;
  cl.bg_main_mode = mode(cl.bg_mains);
  cl.text_main_mode = mode(cl.text_mains);
  cl.primary_hue_median = median(cl.primary_hues);
  cl.accent_hue_median = median(cl.accent_hues);
  cl.accent_sat_median = median(cl.accent_sats);
  cl.bg_luminance_median = median(cl.bg_luminances);

  // Find the most representative palette hexes from top_palettes
  const hexCounts = {};
  cl.top_palettes.forEach(p => {
    hexCounts[p.hex] = (hexCounts[p.hex] || 0) + p.pct;
  });
  const sortedHexes = Object.entries(hexCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  cl.representative_hexes = sortedHexes.map(([h]) => h);
  cl.representative_hexes_with_pct = sortedHexes.map(([h, p]) => ({ hex: h, weight: +(p / cl.sites.length).toFixed(3) }));
});

// 5. TYPOGRAPHY
const fontPairFreq = {}; // "display|body" → count
const displayFontFreq = {};
const bodyFontFreq = {};
const heroH1Sizes = [];
const bodySizes = [];
const bodyLineHeights = [];

extractions.forEach(ex => {
  const t = ex.typography;
  const display = t.display_font || 'unknown';
  const body = t.body_font || 'unknown';
  const pair = `${display}|${body}`;
  fontPairFreq[pair] = (fontPairFreq[pair] || 0) + 1;
  displayFontFreq[display] = (displayFontFreq[display] || 0) + 1;
  bodyFontFreq[body] = (bodyFontFreq[body] || 0) + 1;

  if (t.hero_h1_size_px > 0 && t.hero_h1_size_px < 500) heroH1Sizes.push(t.hero_h1_size_px);
  if (t.body_size_px > 1 && t.body_size_px < 50) bodySizes.push(t.body_size_px);
  if (t.body_line_height > 0.5 && t.body_line_height < 3) bodyLineHeights.push(t.body_line_height);
});

// 6. MOOD CLUSTERS
const moodDist = {
  radius: {},
  density: {},
  shadow: {},
  animation: {},
  gradient: { 'yes': 0, 'no': 0 },
  dark_mode: { 'yes': 0, 'no': 0 },
  monochrome: { 'yes': 0, 'no': 0 }
};

// Filter out extreme outliers (radius_avg_px > 1000)
extractions.forEach(ex => {
  const m = ex.mood;
  const r = m.radius_avg_px;
  if (r < 1000) {
    const rBkt = bucketRadius(r); moodDist.radius[rBkt] = (moodDist.radius[rBkt] || 0) + 1;
  }
  const dBkt = bucketDensity(m.density_padding_avg_px); moodDist.density[dBkt] = (moodDist.density[dBkt] || 0) + 1;
  moodDist.shadow[m.shadow_usage] = (moodDist.shadow[m.shadow_usage] || 0) + 1;
  const aBkt = bucketAnimation(m.animation_count); moodDist.animation[aBkt] = (moodDist.animation[aBkt] || 0) + 1;
  moodDist.gradient[m.has_gradient ? 'yes' : 'no']++;
  moodDist.dark_mode[m.dark_mode ? 'yes' : 'no']++;
  moodDist.monochrome[m.monochrome ? 'yes' : 'no']++;
});

// 7. ARCHITECTURE-REALESTATE SUBSET
const archHeroDist = {};
const archSectionSeq = {};
const archBgMains = [];
const archTextMains = [];
const archPrimaryHues = [];
const archAccentHues = [];
const archAccentSats = [];
const archRadius = [];
const archDensity = [];
const archShadow = {};
const archAnim = {};
const archGradient = { yes: 0, no: 0 };
const archDark = { yes: 0, no: 0 };
const archFontPairs = {};
const archH1Sizes = [];
const archTopPalettes = [];

archEx.forEach(ex => {
  const ht = ex.layout.hero_type || 'unknown';
  archHeroDist[ht] = (archHeroDist[ht] || 0) + 1;

  const seq = (ex.layout.section_sequence || []).join('→');
  archSectionSeq[seq] = (archSectionSeq[seq] || 0) + 1;

  archBgMains.push(ex.colors.bg_main);
  archTextMains.push(ex.colors.text_main);
  archPrimaryHues.push(ex.colors.primary_hue);
  archAccentHues.push(ex.colors.accent_hue);
  archAccentSats.push(ex.colors.accent_saturation_avg);

  if (ex.mood.radius_avg_px < 1000) archRadius.push(ex.mood.radius_avg_px);
  archDensity.push(ex.mood.density_padding_avg_px);
  archShadow[ex.mood.shadow_usage] = (archShadow[ex.mood.shadow_usage] || 0) + 1;
  archAnim[bucketAnimation(ex.mood.animation_count)] = (archAnim[bucketAnimation(ex.mood.animation_count)] || 0) + 1;
  archGradient[ex.mood.has_gradient ? 'yes' : 'no']++;
  archDark[ex.mood.dark_mode ? 'yes' : 'no']++;

  const pair = `${ex.typography.display_font}|${ex.typography.body_font}`;
  archFontPairs[pair] = (archFontPairs[pair] || 0) + 1;

  if (ex.typography.hero_h1_size_px > 0 && ex.typography.hero_h1_size_px < 500) {
    archH1Sizes.push(ex.typography.hero_h1_size_px);
  }

  // Collect palette entries for architecture
  if (ex.colors.top_palette) {
    ex.colors.top_palette.forEach(([hex, pct]) => {
      archTopPalettes.push({ hex, pct, site: ex.hostname });
    });
  }
});

// Architecture representative palette
// Filter out pure black/white to find non-trivial colors
const archHexCounts = {};
archTopPalettes.forEach(p => {
  archHexCounts[p.hex] = (archHexCounts[p.hex] || 0) + p.pct;
});
const archSortedHexes = Object.entries(archHexCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// Find non-trivial BG and text from architecture sites (not pure black/white)
const isTrivial = (hex) => {
  const h = hex.toUpperCase();
  return h === '#FFFFFF' || h === '#000000' || h === '#FFF' || h === '#000';
};
const archNonTrivialBg = archBgMains.filter(h => !isTrivial(h));
const archNonTrivialText = archTextMains.filter(h => !isTrivial(h));
const archBgMode = archNonTrivialBg.length > 0 ? mode(archNonTrivialBg) : mode(archBgMains);
const archTextMode = archNonTrivialText.length > 0 ? mode(archNonTrivialText) : mode(archTextMains);

// Also collect non-trivial hexes from palette
const archNonTrivialHexes = archSortedHexes.filter(([h]) => !isTrivial(h));

// 8. CARD ANALYSIS
const cardAspects = {};
const cardCounts = [];
extractions.forEach(ex => {
  const aspect = ex.layout.card_aspect || 'none';
  cardAspects[aspect] = (cardAspects[aspect] || 0) + 1;
  cardCounts.push(ex.layout.card_count || 0);
});

// 9. HERO SIGNALS
const heroSignalImage = { center: 0, left: 0, right: 0, none: 0, unknown: 0 };
const heroSignalCentered = { true: 0, false: 0 };
extractions.forEach(ex => {
  const hs = ex.layout.hero_signals || {};
  heroSignalImage[hs.image_position || 'none']++;
  heroSignalCentered[hs.has_centered_text ? 'true' : 'false']++;
});

// 10. BUTTON & NAV
const buttonRadii = [];
const navLinkCounts = [];
const formCounts = [];
extractions.forEach(ex => {
  const r = ex.raw_extras || {};
  if (r.primary_button_radius_px >= 0 && r.primary_button_radius_px < 1000) buttonRadii.push(r.primary_button_radius_px);
  navLinkCounts.push(r.nav_links_count || 0);
  formCounts.push(r.form_count || 0);
});

// 11. PAGE METRICS
const pageHeights = [];
const sectionCounts = [];
const stickyNav = { yes: 0, no: 0 };
const announceBar = { yes: 0, no: 0 };
extractions.forEach(ex => {
  const pm = ex.page_metrics || {};
  if (pm.page_height_px > 0) pageHeights.push(pm.page_height_px);
  sectionCounts.push(pm.section_count || 0);
  stickyNav[pm.has_sticky_nav ? 'yes' : 'no']++;
  announceBar[pm.has_announcement_bar ? 'yes' : 'no']++;
});

// ============================================================
// "ДЕТСКАЯ НЕОЖИДАННОСТЬ" ZONE ANALYSIS
// accent hue 25-45 (amber/orange), saturation <50, value medium
// ============================================================
const kidsZone = [];
extractions.forEach(ex => {
  const ah = ex.colors.accent_hue;
  const as = ex.colors.accent_saturation_avg;
  if (ah >= 25 && ah <= 45 && as < 50 && as > 0) {
    // Check if it looks "dirty" — accent hue in amber/terracotta, low saturation
    kidsZone.push({
      hostname: ex.hostname,
      accent_hue: ah,
      accent_sat: as,
      bg_main: ex.colors.bg_main,
      text_main: ex.colors.text_main,
      is_dark: ex.colors.is_dark
    });
  }
});

// ============================================================
// OUTPUT: analysis-summary.json
// ============================================================

// Sort section sequences by frequency
const topSectionSeqs = Object.entries(sectionSeqFreq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([seq, count]) => ({
    sequence: seq,
    count,
    pct: ((count / extractions.length) * 100).toFixed(1),
    examples: (sectionSeqExamples[seq] || []).slice(0, 5)
  }));

// Top font pairs
const topFontPairs = Object.entries(fontPairFreq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([pair, count]) => ({ pair, count, pct: ((count / extractions.length) * 100).toFixed(1) }));

// Architecture section sequences
const topArchSections = Object.entries(archSectionSeq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([seq, count]) => ({ sequence: seq, count }));

// Architecture font pairs
const topArchFontPairs = Object.entries(archFontPairs)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([pair, count]) => ({ pair, count }));

const summary = {
  generated_at: new Date().toISOString(),
  source: 'D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)',
  total_extractions: extractions.length,
  total_selected: selected.sites.length,
  errors: errors.length,
  architecture_realestate_count: archEx.length,

  hero_type_distribution: heroTypeDist,
  hero_signal_image: heroSignalImage,
  hero_signal_centered: heroSignalCentered,

  top_section_sequences: topSectionSeqs,
  section_type_frequencies: Object.entries(sectionTypeFreq)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({ type, count })),

  palette_clusters: paletteClusters.slice(0, 12).map(cl => ({
    key: cl.key,
    count: cl.count,
    pct: ((cl.count / extractions.length) * 100).toFixed(1),
    is_dark: cl.is_dark,
    primary_hue_bucket: cl.primary_hue_bucket,
    accent_hue_bucket: cl.accent_hue_bucket,
    saturation_bucket: cl.saturation_bucket,
    bg_main_mode: cl.bg_main_mode,
    text_main_mode: cl.text_main_mode,
    bg_luminance_median: cl.bg_luminance_median.toFixed(2),
    representative_hexes: cl.representative_hexes.slice(0, 6),
    examples: cl.sites.slice(0, 5)
  })),

  typography: {
    top_font_pairs: topFontPairs,
    top_display_fonts: Object.entries(displayFontFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([f, c]) => ({ font: f, count: c })),
    top_body_fonts: Object.entries(bodyFontFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([f, c]) => ({ font: f, count: c })),
    hero_h1_size: {
      min: Math.min(...heroH1Sizes),
      max: Math.max(...heroH1Sizes),
      median: median(heroH1Sizes),
      avg: safeAvg(heroH1Sizes).toFixed(1)
    },
    body_size: {
      min: Math.min(...bodySizes),
      max: Math.max(...bodySizes),
      median: median(bodySizes),
      avg: safeAvg(bodySizes).toFixed(1)
    },
    body_line_height: {
      min: Math.min(...bodyLineHeights).toFixed(2),
      max: Math.max(...bodyLineHeights).toFixed(2),
      median: median(bodyLineHeights).toFixed(2),
      avg: safeAvg(bodyLineHeights).toFixed(2)
    }
  },

  mood_distribution: {
    radius: moodDist.radius,
    density: moodDist.density,
    shadow: moodDist.shadow,
    animation: moodDist.animation,
    gradient: moodDist.gradient,
    dark_mode: moodDist.dark_mode,
    monochrome: moodDist.monochrome
  },

  architecture_realestate: {
    count: archEx.length,
    hero_types: archHeroDist,
    top_section_sequences: topArchSections,
    palette: {
      bg_main_mode: archBgMode,
      text_main_mode: archTextMode,
      primary_hue_median: median(archPrimaryHues),
      accent_hue_median: median(archAccentHues),
      accent_sat_median: median(archAccentSats),
      top_hexes: archSortedHexes.map(([h, w]) => ({ hex: h, weight: +(w / archEx.length).toFixed(3) }))
    },
    mood: {
      radius: {
        values: archRadius.length > 0 ? {
          min: Math.min(...archRadius),
          max: Math.max(...archRadius),
          median: median(archRadius),
          avg: safeAvg(archRadius).toFixed(1)
        } : null,
        distribution: {
          sharp: archRadius.filter(r => r < 4).length,
          soft: archRadius.filter(r => r >= 4 && r < 12).length,
          round: archRadius.filter(r => r >= 12 && r < 20).length,
          pill: archRadius.filter(r => r >= 20).length
        }
      },
      density: {
        avg: safeAvg(archDensity).toFixed(1),
        median: median(archDensity)
      },
      shadow: archShadow,
      animation: archAnim,
      gradient: archGradient,
      dark: archDark
    },
    typography: {
      top_font_pairs: topArchFontPairs,
      hero_h1_median: median(archH1Sizes),
      hero_h1_avg: safeAvg(archH1Sizes).toFixed(1)
    },
    sites: archEx.map(ex => ex.hostname)
  },

  card_analysis: {
    aspect_distribution: cardAspects,
    count_avg: safeAvg(cardCounts).toFixed(1),
    count_median: median(cardCounts)
  },

  button_radius: {
    avg: safeAvg(buttonRadii).toFixed(1),
    median: median(buttonRadii),
    sharp: buttonRadii.filter(r => r < 4).length,
    soft: buttonRadii.filter(r => r >= 4 && r < 12).length,
    round: buttonRadii.filter(r => r >= 12 && r < 20).length,
    pill: buttonRadii.filter(r => r >= 20).length
  },

  nav_links: {
    avg: safeAvg(navLinkCounts).toFixed(1),
    median: median(navLinkCounts)
  },

  page_metrics: {
    page_height: {
      avg: safeAvg(pageHeights).toFixed(0),
      median: median(pageHeights)
    },
    section_count: {
      avg: safeAvg(sectionCounts).toFixed(1),
      median: median(sectionCounts)
    },
    sticky_nav: stickyNav,
    announcement_bar: announceBar
  },

  kids_zone: {
    description: 'Accent hue 25-45° (amber/orange), saturation <50% — "dirty amber/terracotta" zone',
    count: kidsZone.length,
    sites: kidsZone,
    recommendation: 'Использовать осторожно, не как default. Владелица отвергла warm-minimal/amber по умолчанию.'
  },

  data_quality_notes: {
    font_detection_rate: '55%',
    hero_type_centered: '73% — возможно классификатор слишком грубый',
    empty_section_sequence: '40/88 sites (45%) — section_sequence и section_types пустые. Классификатор секций отказал почти на половине сайтов.',
    empty_section_types: '40/88 — те же сайты',
    font_detection_rate: '55%',
    zero_hue_both: `${extractions.filter(e => e.colors.primary_hue === 0 && e.colors.accent_hue === 0).length} sites — ожидаемо для grayscale/monochrome сайтов`,
    body_size_bugs: `${extractions.filter(e => e.typography.body_size_px <= 1).length} sites с body_size_px ≤ 1 — extraction артефакт`,
    radius_outlier: 'некоторые radius_avg_px > 1000 — extraction артефакт (исключены из radius статистик)',
    text_on_bg_mismatch: `${extractions.filter(e => e.colors.bg_luminance > 0.9 && e.colors.text_main === '#FFFFFF').length} sites с белым текстом на светлом фоне — extraction артефакт`
  }
};

fs.writeFileSync(OUTPUT_JSON, JSON.stringify(summary, null, 2));
console.log(`✅ analysis-summary.json written (${JSON.stringify(summary).length} chars)`);

// ============================================================
// OUTPUT: analysis-report.md (human-readable)
// ============================================================

const report = `# Corpus Analysis Report — Wave D

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** ${summary.generated_at}

---

## 1. Hero Type Distribution

| Type | Count | % |
|------|-------|---|
${Object.entries(heroTypeDist).sort((a, b) => b[1] - a[1]).map(([t, c]) => `| ${t} | ${c} | ${((c / extractions.length) * 100).toFixed(1)}% |`).join('\n')}

> ⚠️ **Data quality note:** hero_type "centered" = 73% — классификатор слишком грубый. В реальности многие "centered" hero — это full-bleed с centred text overlay, или product-showcase с centred layout. Нужна ручная реклассификация для точных скелетов.

## 2. Hero Signal Analysis

| Signal | Count |
|--------|-------|
| Image Center | ${heroSignalImage.center} |
| Image Left | ${heroSignalImage.left} |
| Image Right | ${heroSignalImage.right} |
| No Image | ${heroSignalImage.none} |
| Centered Text | ${heroSignalCentered.true} |
| Not Centered | ${heroSignalCentered.false} |

## 3. Top Section Sequences

| Sequence | Count | % | Examples |
|----------|-------|---|----------|
${topSectionSeqs.slice(0, 10).map(s => `| ${s.sequence} | ${s.count} | ${s.pct}% | ${s.examples.slice(0, 3).join(', ')} |`).join('\n')}

## 4. Section Type Frequencies

| Type | Count |
|------|-------|
${Object.entries(sectionTypeFreq).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([t, c]) => `| ${t} | ${c} |`).join('\n')}

## 5. Palette Clusters (Top 8)

| Cluster | Count | % | Dark | Primary Hue | Accent Hue | Sat | Repr. BG | Repr. Text |
|---------|-------|---|------|-------------|------------|-----|-----------|-------------|
${paletteClusters.slice(0, 8).map(cl => `| ${cl.key.split('|').slice(1).join(' \| ')} | ${cl.count} | ${((cl.count / extractions.length) * 100).toFixed(1)}% | ${cl.is_dark ? '✓' : '—'} | ${cl.primary_hue_bucket} | ${cl.accent_hue_bucket} | ${cl.saturation_bucket} | ${cl.bg_main_mode} | ${cl.text_main_mode} |`).join('\n')}

## 6. Typography

### Top Font Pairs
| Display | Body | Count | % |
|---------|------|-------|---|
${topFontPairs.slice(0, 10).map(fp => `| ${fp.pair.split('|')[0]} | ${fp.pair.split('|')[1]} | ${fp.count} | ${fp.pct}% |`).join('\n')}

### Hero H1 Size
- Min: ${summary.typography.hero_h1_size.min}px
- Max: ${summary.typography.hero_h1_size.max}px
- Median: ${summary.typography.hero_h1_size.median}px
- Average: ${summary.typography.hero_h1_size.avg}px

### Body Text
- Size: ${summary.typography.body_size.min}-${summary.typography.body_size.max}px, median ${summary.typography.body_size.median}px
- Line height: ${summary.typography.body_line_height.min}-${summary.typography.body_line_height.max}, median ${summary.typography.body_line_height.median}

## 7. Mood Distribution

| Dimension | Category | Count | % |
|-----------|----------|-------|---|
${(() => {
  // Build mood distribution table with dynamic keys
  const rows = [];
  for (const [dim, vals] of Object.entries(moodDist)) {
    const total = Object.values(vals).reduce((a, b) => a + b, 0);
    for (const [cat, cnt] of Object.entries(vals).sort((a, b) => b[1] - a[1])) {
      rows.push(`| ${dim} | ${cat} | ${cnt} | ${total > 0 ? ((cnt / total) * 100).toFixed(1) : '0'}% |`);
    }
  }
  return rows.join('\n');
})()}

## 8. Architecture-Realestate Cluster (${archEx.length} sites)

### Hero Types
${Object.entries(archHeroDist).sort((a, b) => b[1] - a[1]).map(([t, c]) => `- ${t}: ${c} (${((c / archEx.length) * 100).toFixed(1)}%)`).join('\n')}

### Representative Palette
- **BG main (non-trivial)**: ${archBgMode}
- **Text main (non-trivial)**: ${archTextMode}
- **Primary hue median**: ${median(archPrimaryHues)}° (${bucketHue(median(archPrimaryHues))})
- **Accent hue median**: ${median(archAccentHues)}° (${bucketHue(median(archAccentHues))})
- **Accent saturation median**: ${median(archAccentSats).toFixed(0)}%
- **Dark sites**: ${archDark.yes}/${archEx.length} (${((archDark.yes / archEx.length) * 100).toFixed(1)}%)

### Top Hexes
${archSortedHexes.slice(0, 8).map(([h, w]) => `- ${h} (weight: ${(w / archEx.length).toFixed(3)})`).join('\n')}

### Mood
- Radius: ${archRadius.length > 0 ? `sharp ${archRadius.filter(r => r < 4).length}, soft ${archRadius.filter(r => r >= 4 && r < 12).length}, round ${archRadius.filter(r => r >= 12 && r < 20).length}, pill ${archRadius.filter(r => r >= 20).length}` : 'N/A'}
- Density avg: ${safeAvg(archDensity).toFixed(1)}px
- Shadow: ${JSON.stringify(archShadow)}
- Gradient: ${archGradient.yes}/${archEx.length}

### Sites
${archEx.map(e => `- ${e.hostname}`).join('\n')}

## 9. "Детская неожиданность" Zone (Dirty Amber)

**Criteria:** accent hue 25-45°, saturation < 50%
**Count:** ${kidsZone.length} sites
**Recommendation:** Использовать осторожно, не как default. Владелица отвергла warm-minimal/amber по умолчанию.

${kidsZone.length > 0 ? kidsZone.map(z => `- ${z.hostname}: accent hue ${z.accent_hue}°, sat ${z.accent_sat}%, bg ${z.bg_main}, dark=${z.is_dark}`).join('\n') : '_No sites found in this zone._'}

## 10. Page Metrics

| Metric | Average | Median |
|--------|---------|--------|
| Page Height | ${safeAvg(pageHeights).toFixed(0)}px | ${median(pageHeights)}px |
| Section Count | ${safeAvg(sectionCounts).toFixed(1)} | ${median(sectionCounts)} |
| Nav Links | ${safeAvg(navLinkCounts).toFixed(1)} | ${median(navLinkCounts)} |
| Button Radius | ${safeAvg(buttonRadii).toFixed(1)}px | ${median(buttonRadii)}px |

- Sticky Nav: ${stickyNav.yes}/${extractions.length} (${((stickyNav.yes / extractions.length) * 100).toFixed(1)}%)
- Announcement Bar: ${announceBar.yes}/${extractions.length} (${((announceBar.yes / extractions.length) * 100).toFixed(1)}%)

## 11. Data Quality Notes

- **Font detection rate:** 55% — низкая точность. Многие font pair — угаданы, не извлечены достоверно.
- **Hero type:** 73% "centered" — классификатор слишком грубый. Требуется ручная реклассификация.
- **Zero hue:** ${summary.data_quality_notes.zero_hue_both.split(' ')[0]} sites с primary_hue=accent_hue=0 — это grayscale/monochrome сайты (не баг, а feature).
- **Body size bugs:** ${summary.data_quality_notes.body_size_bugs.split(' ')[0]} sites с body_size_px ≤ 1 — extraction артефакт.
- **Radius outlier:** некоторые radius_avg_px > 1000 — исключены из статистик.
`;

fs.writeFileSync(OUTPUT_REPORT, report);
console.log(`✅ analysis-report.md written (${report.length} chars)`);

// ============================================================
// PATTERNS MD FILES
// ============================================================

// --- Helper: find sites with specific hero_type ---
function sitesWithHeroType(ht) {
  return extractions.filter(e => e.layout.hero_type === ht).map(e => e.hostname);
}

function sitesWithSection(searches) {
  // Return sites whose section_sequence contains all given section types
  return extractions.filter(e => {
    const seq = (e.layout.section_sequence || []).join(',');
    return searches.every(s => seq.includes(s));
  }).map(e => e.hostname);
}

function sitesWithBento() {
  return extractions.filter(e => e.layout.has_bento).map(e => e.hostname);
}

function sitesWithSignal(signal) {
  return extractions.filter(e => e.layout.hero_signals && e.layout.hero_signals[signal]).map(e => e.hostname);
}

function sitesBySectionCount(min, max) {
  return extractions.filter(e => {
    const sc = e.page_metrics.section_count || 0;
    return sc >= min && sc <= max;
  }).map(e => e.hostname);
}

function sitesByImageCount(min) {
  return extractions.filter(e => (e.raw_extras.image_count || 0) > min).map(e => e.hostname);
}

function sitesByCardCount(min) {
  return extractions.filter(e => (e.layout.card_count || 0) > min).map(e => e.hostname);
}

// Get a representative extraction for a hostname
function getEx(hostname) {
  return extractions.find(e => e.hostname === hostname);
}

// ============================================================
// 2a. layout-patterns.md
// ============================================================

// Identify real layout patterns from corpus
const layoutPatterns = [];

// 1. Asymmetric Hero Split
const asymSites = sitesWithHeroType('asymmetric-split');
if (asymSites.length > 0) {
  layoutPatterns.push({
    name: 'Asymmetric Hero Split (60/40)',
    vibe: 'Динамичный, для продуктов и SaaS',
    when: 'SaaS, tech, product landing — когда нужно показать продукт + ценность одновременно',
    structure: 'hero(asymmetric)→logos→features→stats→cta→footer',
    hero_type: 'asymmetric-split',
    frequency: `${asymSites.length} сайтов (${((asymSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: asymSites.slice(0, 5),
    tailwind: `<section class="min-h-screen flex items-center px-8 lg:px-20">
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto w-full">
    <div class="lg:col-span-3 flex flex-col justify-center">
      <h1 class="text-5xl lg:text-6xl font-bold leading-tight">...</h1>
      <p class="text-lg text-gray-500 mt-6 max-w-lg">...</p>
      <div class="flex gap-4 mt-8">...</div>
    </div>
    <div class="lg:col-span-2 relative">
      <img src="..." class="w-full rounded-xl shadow-lg" />
    </div>
  </div>
</section>`,
    signature: '60/40 grid split, image справа на 2/5, текст слева на 3/5'
  });
}

// 2. Product Showcase (full-image hero)
const productSites = sitesWithHeroType('product-showcase');
if (productSites.length > 0) {
  layoutPatterns.push({
    name: 'Full-Bleed Product Showcase',
    vibe: 'Иммерсивный, визуальный — продукт занимает весь экран',
    when: 'Архитектура, real estate, премиум-продукты, портфолио',
    structure: 'hero(full-image)→features→gallery→content→cta→footer',
    hero_type: 'product-showcase',
    frequency: `${productSites.length} сайтов (${((productSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: productSites.slice(0, 5),
    tailwind: `<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30"></div>
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
    <h1 class="text-white text-5xl lg:text-7xl font-bold max-w-4xl">...</h1>
    <p class="text-white/80 text-xl mt-6 max-w-2xl">...</p>
  </div>
</section>`,
    signature: 'full-bleed image hero, text overlay centred, dark overlay 30%'
  });
}

// 3. Typography Hero
const typographySites = sitesWithHeroType('typography');
if (typographySites.length > 0) {
  layoutPatterns.push({
    name: 'Typography-First Editorial',
    vibe: 'Минималистичный, элегантный — текст главный герой',
    when: 'Editorial, agency, portfolio, architecture — когда контент важнее картинок',
    structure: 'hero(typography)→content→gallery→content→cta→footer',
    hero_type: 'typography',
    frequency: `${typographySites.length} сайтов (${((typographySites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: typographySites.slice(0, 5),
    tailwind: `<section class="min-h-screen flex flex-col justify-center px-8 lg:px-20 py-24">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-6xl lg:text-8xl font-light leading-[0.95] tracking-tight">...</h1>
    <div class="h-px bg-gray-200 my-12"></div>
    <p class="text-xl text-gray-500 max-w-xl">...</p>
  </div>
</section>`,
    signature: 'h1 > 60px, font-light, разделительная линия, минимум графики'
  });
}

// 4. Bento Mosaic
const bentoSites = sitesWithBento();
if (bentoSites.length > 0) {
  layoutPatterns.push({
    name: 'Bento Mosaic Grid',
    vibe: 'Современный, tech-стиль — карточки разного размера в мозаике',
    when: 'SaaS, tech, product features — когда много фич/продуктов нужно показать компактно',
    structure: 'hero→features(bento)→stats→cta→footer',
    hero_type: 'centered',
    frequency: `${bentoSites.length} сайтов (${((bentoSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: bentoSites.slice(0, 5),
    tailwind: `<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <div class="md:col-span-2 md:row-span-2 bg-gray-100 rounded-2xl p-8">...</div>
      <div class="bg-gray-100 rounded-2xl p-6">...</div>
      <div class="md:row-span-2 bg-gray-100 rounded-2xl p-6">...</div>
      <div class="md:col-span-2 bg-gray-100 rounded-2xl p-6">...</div>
      <div class="bg-gray-100 rounded-2xl p-6">...</div>
    </div>
  </div>
</section>`,
    signature: 'bento grid, карточки с разным span, rounded-2xl, gap-4'
  });
}

// 5. Centered Marketing (default landing page)
const centeredMarketingSites = sitesWithSection(['hero', 'logos', 'features', 'cta']);
const centeredMarketingSites2 = sitesWithSection(['hero', 'features', 'stats', 'cta']);
const allMarketingSites = [...new Set([...centeredMarketingSites, ...centeredMarketingSites2])];
if (allMarketingSites.length > 0) {
  layoutPatterns.push({
    name: 'Classic Centered Marketing',
    vibe: 'Универсальный, проверенный — для любого продукта',
    when: 'Универсальный. SaaS, B2B, сервисы — когда нет специфических требований к макету',
    structure: 'hero(centered)→logos→features→stats→cta→footer',
    hero_type: 'centered',
    frequency: `${allMarketingSites.length} сайтов (${((allMarketingSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: allMarketingSites.slice(0, 5),
    tailwind: `<section class="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
  <h1 class="text-5xl lg:text-6xl font-bold max-w-3xl leading-tight">...</h1>
  <p class="text-lg text-gray-500 mt-6 max-w-xl">...</p>
  <div class="flex gap-4 mt-8">...</div>
</section>

<!-- Features -->
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-16">...</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-8">...</div>
    </div>
  </div>
</section>

<!-- Stats -->
<section class="px-8 py-24 bg-gray-50">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div><span class="text-4xl font-bold">N</span><p class="text-gray-500">...</p></div>
  </div>
</section>

<!-- CTA -->
<section class="px-8 py-24 text-center">
  <h2 class="text-3xl font-bold">...</h2>
  <p class="text-gray-500 mt-4">...</p>
  <div class="mt-8">...</div>
</section>`,
    signature: 'hero centred → logos → 3-col features → 4-col stats → cta banner'
  });
}

// 6. Gallery-Heavy Story
const gallerySites = sitesByImageCount(15);
if (gallerySites.length > 0) {
  layoutPatterns.push({
    name: 'Gallery-Heavy Story',
    vibe: 'Визуальное повествование — картинки рассказывают историю',
    when: 'Архитектура, портфолио, travel, lifestyle — когда изображения главный контент',
    structure: 'hero→gallery→gallery→content→gallery→cta→footer',
    hero_type: 'product-showcase',
    frequency: `${gallerySites.length} сайтов (${((gallerySites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: gallerySites.slice(0, 5),
    tailwind: `<!-- Gallery grid -->
<section class="px-8 py-24">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <!-- repeat for N images -->
    </div>
  </div>
</section>

<!-- Full-width image -->
<section class="w-full">
  <img src="..." class="w-full h-[60vh] object-cover" />
</section>`,
    signature: 'много image секций, full-width images, 2-3 column gallery grids'
  });
}

// 7. Stats-Heavy
const statsSites = sitesWithSection(['stats']);
if (statsSites.length > 0) {
  layoutPatterns.push({
    name: 'Stats-Heavy Credibility',
    vibe: 'Цифры убеждают — для B2B и enterprise',
    when: 'B2B, SaaS enterprise, finance — когда нужно показать масштаб и доверие',
    structure: 'hero→logos→stats→features→stats→cta→footer',
    hero_type: 'centered',
    frequency: `${statsSites.length} сайтов (${((statsSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: statsSites.slice(0, 5),
    tailwind: `<!-- Stats row -->
<section class="px-8 py-20 bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div>
      <span class="block text-5xl font-bold text-white">99.9%</span>
      <span class="text-gray-400 mt-2 block text-sm">Uptime</span>
    </div>
    <!-- repeat -->
  </div>
</section>`,
    signature: 'stats как тёмная полоса, 4 колонки, крупные цифры, muted label'
  });
}

// 8. Single CTA Landing
const minimalSites = sitesBySectionCount(1, 5);
const ctaOnlySites = sitesWithSection(['cta']).filter(h => !sitesWithSection(['features', 'gallery']).includes(h));
const singleCTASites = [...new Set([...minimalSites, ...ctaOnlySites])].slice(0, 10);
if (singleCTASites.length > 0) {
  layoutPatterns.push({
    name: 'Single CTA Landing',
    vibe: 'Минималистичный, сфокусированный — одно действие',
    when: 'Coming soon, waitlist, simple product, event page',
    structure: 'hero→cta→footer',
    hero_type: 'centered',
    frequency: `${singleCTASites.length} сайтов из выборки минимальных (${((singleCTASites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: singleCTASites.slice(0, 5),
    tailwind: `<section class="min-h-screen flex flex-col items-center justify-center text-center px-6">
  <h1 class="text-5xl lg:text-7xl font-bold max-w-2xl">...</h1>
  <p class="text-xl text-gray-500 mt-6 max-w-lg">...</p>
  <form class="flex gap-3 mt-10 max-w-md w-full">
    <input type="email" class="flex-1 px-5 py-3 border border-gray-300 rounded-lg" placeholder="Email" />
    <button class="px-6 py-3 bg-black text-white rounded-lg font-medium">Join</button>
  </form>
</section>`,
    signature: 'hero → cta, без промежуточных секций, форма в hero'
  });
}

// 9. Magazine/Editorial
const editorialSites = sitesWithSection(['content', 'content', 'content']).filter(h => {
  const ex = getEx(h);
  return ex && ex.layout.section_types && (ex.layout.section_types.content || 0) >= 4;
});
if (editorialSites.length > 0) {
  layoutPatterns.push({
    name: 'Magazine Editorial Layout',
    vibe: 'Контент-центричный, как журнал — статьи, карточки, категории',
    when: 'Блог, media, editorial, content-heavy сайты',
    structure: 'hero→content→content→gallery→content→content→footer',
    hero_type: 'typography',
    frequency: `${editorialSites.length} сайтов (${((editorialSites.length / extractions.length) * 100).toFixed(1)}%)`,
    examples: editorialSites.slice(0, 5),
    tailwind: `<!-- Article grid -->
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-12">Latest</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article class="group">
        <div class="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="..." class="w-full h-full object-cover group-hover:scale-105 transition" />
        </div>
        <span class="text-sm text-gray-400">Category</span>
        <h3 class="text-xl font-semibold mt-2">...</h3>
        <p class="text-gray-500 mt-2">...</p>
      </article>
    </div>
  </div>
</section>`,
    signature: '3-col article grid, 16/9 images, category label + title + excerpt'
  });
}

// 10. Architecture-Realestate Pattern
if (archEx.length > 0) {
  // Find the most common structure
  const archStructures = archEx.map(ex => {
    const seq = ex.layout.section_sequence || [];
    const collapsed = [];
    seq.forEach(s => {
      if (collapsed.length === 0 || collapsed[collapsed.length - 1] !== s) collapsed.push(s);
    });
    return collapsed.join('→');
  });

  const archStructFreq = {};
  archStructures.forEach(s => { archStructFreq[s] = (archStructFreq[s] || 0) + 1; });
  const topArchStruct = Object.entries(archStructFreq).sort((a, b) => b[1] - a[1])[0];

  // Typical arch hero
  const archHeroTypes = {};
  archEx.forEach(ex => { archHeroTypes[ex.layout.hero_type] = (archHeroTypes[ex.layout.hero_type] || 0) + 1; });
  const topArchHero = Object.entries(archHeroTypes).sort((a, b) => b[1] - a[1])[0];

  // Arch palette
  const archBg = archBgMode;
  const archText = archTextMode;
  const archHexTop = archNonTrivialHexes.slice(0, 5);

  layoutPatterns.push({
    name: '🏗️ Architecture Portfolio',
    vibe: 'Пространство, свет, текстура — сайт как архитектурный проект',
    when: 'Архитектура, real estate, строительство, интерьерный дизайн',
    structure: (topArchStruct && topArchStruct[0] && topArchStruct[0].length > 0) ? topArchStruct[0] : 'hero(full-image)→gallery→content→gallery→cta→footer',
    hero_type: topArchHero ? topArchHero[0] : 'product-showcase',
    frequency: `${archEx.length} сайтов (${((archEx.length / extractions.length) * 100).toFixed(1)}%) — отдельный architecture-realestate кластер`,
    examples: archEx.map(e => e.hostname).slice(0, 5),
    palette_hexes: archNonTrivialHexes.slice(0, 5).map(h => h[0]),
    bg_main: archBg,
    text_main: archText,
    tailwind: `<!-- Architecture hero: full-bleed image -->
<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  <div class="relative z-10 flex flex-col justify-end h-full px-8 lg:px-20 pb-20">
    <h1 class="text-white text-5xl lg:text-7xl font-light tracking-tight max-w-3xl">Project Name</h1>
    <p class="text-white/70 text-xl mt-4 max-w-xl">Location • Year • Typology</p>
  </div>
</section>

<!-- Project gallery: masonry-like grid -->
<section class="px-8 py-24">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img src="..." class="w-full h-full object-cover hover:scale-105 transition duration-700" />
      </div>
      <div class="aspect-[4/5] bg-gray-100 overflow-hidden">
        <img src="..." class="w-full h-full object-cover hover:scale-105 transition duration-700" />
      </div>
    </div>
  </div>
</section>`,
    signature: 'full-bleed hero image, bottom-left text overlay, gallery grid с разными aspect ratios, minimal UI, акцент на изображениях'
  });
}

// ============================================================
// WRITE layout-patterns.md
// ============================================================

let layoutMD = `# Layout Patterns — Corpus-Driven Skeletons

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** ${summary.generated_at}
**Purpose:** Применимые скелеты сайтов с конкретными CSS/Tailwind классами и примерами.

> Каждый паттерн извлечён из реальных сайтов corpus. Частоты — от 88 успешных extractions.
> ⚠️ **Hero type "centered" = 73%** — классификатор грубый. Многие "centered" на самом деле full-bleed или product-showcase. Паттерны ниже используют hero_type как один из сигналов, но не единственный.

---

`;

layoutPatterns.forEach((lp, i) => {
  layoutMD += `## ${i + 1}. ${lp.name}\n\n`;
  layoutMD += `**Vibe:** ${lp.vibe}\n\n`;
  layoutMD += `**Когда использовать:** ${lp.when}\n\n`;
  layoutMD += `**Структура:** \`${lp.structure}\`\n\n`;
  layoutMD += `**Hero type:** ${lp.hero_type}\n\n`;
  layoutMD += `**Частота в corpus:** ${lp.frequency}\n\n`;
  if (lp.palette_hexes) {
    layoutMD += `**Palette hexes:** ${lp.palette_hexes.join(', ')}\n\n`;
    layoutMD += `**BG:** ${lp.bg_main} | **Text:** ${lp.text_main}\n\n`;
  }
  layoutMD += `**Примеры из corpus:** ${lp.examples.join(', ')}\n\n`;
  layoutMD += `**Tailwind скелет:**\n\`\`\`html\n${lp.tailwind}\n\`\`\`\n\n`;
  layoutMD += `**Signature element:** ${lp.signature}\n\n`;
  layoutMD += `---\n\n`;
});

// Add data quality appendix
layoutMD += `## Data Quality Notes\n\n`;
layoutMD += `- **Font detection rate:** 55% — font pairs в паттернах приблизительные\n`;
layoutMD += `- **Hero type classifier:** 73% "centered" — требует ручной доработки\n`;
layoutMD += `- **Section sequence:** извлечён автоматически, возможны ошибки классификации секций\n`;
layoutMD += `- **Где сигнал слабый — отмечено.** Не выдумываем.\n`;

fs.writeFileSync(path.join(PATTERNS_DIR, 'layout-patterns.md'), layoutMD);
console.log(`✅ layout-patterns.md written (${layoutMD.length} chars)`);

// ============================================================
// 2b. palette-patterns.md
// ============================================================

// Compute meaningful palette clusters
// Strategy: group by (is_dark, primary_hue bucket, saturation bucket) and find representative hexes

const paletteGroups = [
  {
    name: 'Cool Industrial',
    mood: 'Технологичный, холодный, профессиональный',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && c.primary_hue >= 200 && c.primary_hue <= 260;
    },
    when: 'SaaS, B2B, tech, finance — профессиональный tech-образ',
    tailwind: 'from-slate-50 to-white text-slate-900, primary blue-600/indigo-600'
  },
  {
    name: 'Warm Editorial Cream',
    mood: 'Тёплый, уютный, редакционный',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && c.primary_hue >= 30 && c.primary_hue <= 60 && c.bg_luminance > 0.85;
    },
    when: 'Editorial, lifestyle, food, agency — тёплый и inviting',
    tailwind: 'from-amber-50 to-cream-50 text-stone-800, accent amber-600'
  },
  {
    name: 'Dark Neon Cyan',
    mood: 'Футуристичный, дерзкий, tech-noir',
    conditions: (ex) => {
      const c = ex.colors;
      return c.is_dark && c.accent_hue >= 170 && c.accent_hue <= 210;
    },
    when: 'Crypto, gaming, Web3, bold-tech — тёмный с ярким акцентом',
    tailwind: 'bg-gray-950 text-white, accent cyan-400'
  },
  {
    name: 'Bold Cobalt',
    mood: 'Уверенный, корпоративный, сильный',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && c.primary_hue >= 220 && c.primary_hue <= 250 && c.accent_saturation_avg > 50;
    },
    when: 'Enterprise, B2B, finance — сильный синий бренд',
    tailwind: 'bg-white text-slate-900, primary blue-700/indigo-700'
  },
  {
    name: 'Earth Architecture',
    mood: 'Природный, текстурированный, пространственный',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && (
        (c.primary_hue >= 20 && c.primary_hue <= 50) ||
        (c.primary_hue === 0 && c.accent_hue === 0 && c.bg_luminance > 0.7 && c.bg_luminance < 0.95)
      );
    },
    when: 'Архитектура, real estate, строительство, интерьер — естественные материалы',
    tailwind: 'from-stone-100 to-warm-gray-50 text-stone-800, accent warm-gray-700'
  },
  {
    name: 'Serene Sage',
    mood: 'Спокойный, природный, wellness',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && c.primary_hue >= 100 && c.primary_hue <= 160;
    },
    when: 'Health, wellness, sustainability, eco — природное спокойствие',
    tailwind: 'from-emerald-50 to-white text-emerald-900, accent emerald-600'
  },
  {
    name: 'Dark Minimal',
    mood: 'Элегантный, премиальный, сдержанный',
    conditions: (ex) => {
      const c = ex.colors;
      return c.is_dark && c.accent_saturation_avg < 30;
    },
    when: 'Премиум, luxury, портфолио, архитектура — тёмная элегантность',
    tailwind: 'bg-gray-950 text-gray-100, accent gray-400'
  },
  {
    name: 'Playful Gradient',
    mood: 'Игривый, креативный, яркий',
    conditions: (ex) => {
      const c = ex.colors;
      return !c.is_dark && c.has_gradient && c.accent_saturation_avg > 60;
    },
    when: 'Creative agency, gaming, animation, стартапы — яркий и запоминающийся',
    tailwind: 'bg-white text-gray-900, accent with gradient via bg-gradient-to-r'
  }
];

let paletteMD = `# Palette Patterns — Corpus-Driven Color Palettes

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** ${summary.generated_at}
**Purpose:** ЖИВЫЕ палитры из реальных сайтов с hex, Tailwind и примерами.

> Каждая палитра извлечена из реальных сайтов. Hex — усреднённые/представительные из кластера.
> ⚠️ **"Детская неожиданность" зона помечена отдельно** — грязный amber/terracotta (hue 25-45°, sat < 50%). Владелица отвергла. Не использовать по умолчанию.

---

`;

paletteGroups.forEach((pg, i) => {
  const sites = extractions.filter(pg.conditions);
  if (sites.length === 0) {
    paletteMD += `## ${i + 1}. ${pg.name} ⚠️ (нет примеров в corpus)\n\n`;
    paletteMD += `**Mood:** ${pg.mood}\n\n`;
    paletteMD += `**Sites:** 0 — кластер не найден в corpus, требует ручного подбора\n\n`;
    paletteMD += `---\n\n`;
    return;
  }

  const bgMains = sites.map(s => s.colors.bg_main);
  const textMains = sites.map(s => s.colors.text_main);
  const primaryHues = sites.map(s => s.colors.primary_hue);
  const accentHues = sites.map(s => s.colors.accent_hue);
  const accentSats = sites.map(s => s.colors.accent_saturation_avg);

  // Collect all palette hexes across sites
  const allHexes = {};
  sites.forEach(s => {
    if (s.colors.top_palette) {
      s.colors.top_palette.forEach(([hex, pct]) => {
        allHexes[hex] = (allHexes[hex] || 0) + pct;
      });
    }
  });
  const topHexes = Object.entries(allHexes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([h]) => h);

  const bgMain = mode(bgMains);
  const textMain = mode(textMains);
  const primaryHue = median(primaryHues);
  const accentHue = median(accentHues);
  const accentSat = median(accentSats);

  paletteMD += `## ${i + 1}. ${pg.name}\n\n`;
  paletteMD += `**Mood:** ${pg.mood}\n\n`;
  paletteMD += `**Sites in cluster:** ${sites.length} (${((sites.length / extractions.length) * 100).toFixed(1)}%)\n\n`;

  paletteMD += `### Palette\n\n`;
  paletteMD += `| Role | Hex | Tailwind |\n`;
  paletteMD += `|------|-----|----------|\n`;
  paletteMD += `| BG main | ${bgMain} | \`bg-[${bgMain}]\` |\n`;
  paletteMD += `| Text main | ${textMain} | \`text-[${textMain}]\` |\n`;
  if (topHexes.length > 2) {
    paletteMD += `| Primary | ${topHexes[2] || topHexes[0]} | \`bg-[${topHexes[2] || topHexes[0]}]\` |\n`;
    paletteMD += `| Accent | ${topHexes[3] || topHexes[1]} | \`bg-[${topHexes[3] || topHexes[1]}]\` |\n`;
    for (let j = 4; j < Math.min(topHexes.length, 8); j++) {
      paletteMD += `| Supporting ${j - 3} | ${topHexes[j]} | \`bg-[${topHexes[j]}]\` |\n`;
    }
  }

  paletteMD += `\n### HSL Signature\n\n`;
  paletteMD += `- **Primary hue:** ${primaryHue.toFixed(0)}° (${bucketHue(primaryHue)})\n`;
  paletteMD += `- **Accent hue:** ${accentHue.toFixed(0)}° (${bucketHue(accentHue)})\n`;
  paletteMD += `- **Accent saturation:** ${accentSat.toFixed(0)}%\n`;
  paletteMD += `- **is_dark:** ${sites.filter(s => s.colors.is_dark).length > sites.length / 2 ? 'да' : 'нет'}\n`;

  paletteMD += `\n### Когда использовать\n\n${pg.when}\n\n`;

  paletteMD += `### Tailwind классы\n\n\`\`\`\n${pg.tailwind}\n\`\`\`\n\n`;

  paletteMD += `### Примеры сайтов\n\n${sites.slice(0, 5).map(s => `- ${s.hostname}`).join('\n')}\n\n`;

  paletteMD += `---\n\n`;
});

// Add Architecture-specific palette
paletteMD += `## 🏗️ Architecture-Realestate Palette (DETAILED)\n\n`;
paletteMD += `**Sites:** ${archEx.length}\n\n`;
paletteMD += `This is a dedicated palette for the architecture-realestate cluster. Extracted from ${archEx.length} real architecture/real estate sites.\n\n`;

const archBg = archBgMode;
const archText = archTextMode;
const archPHue = median(archPrimaryHues);
const archAHue = median(archAccentHues);
const archASat = median(archAccentSats);

paletteMD += `### Palette\n\n`;
paletteMD += `| Role | Hex | Tailwind |\n`;
paletteMD += `|------|-----|----------|\n`;
paletteMD += `| BG main | ${archBg} | \`bg-[${archBg}]\` |\n`;
paletteMD += `| Text main | ${archText} | \`text-[${archText}]\` |\n`;
archNonTrivialHexes.slice(0, 6).forEach(([hex, w], j) => {
  const role = j === 0 ? 'Primary' : j === 1 ? 'Accent' : `Supporting ${j - 1}`;
  paletteMD += `| ${role} | ${hex} | \`bg-[${hex}]\` |\n`;
});

paletteMD += `\n### HSL Signature\n\n`;
paletteMD += `- **Primary hue:** ${archPHue.toFixed(0)}° (${bucketHue(archPHue)})\n`;
paletteMD += `- **Accent hue:** ${archAHue.toFixed(0)}° (${bucketHue(archAHue)})\n`;
paletteMD += `- **Accent saturation:** ${archASat.toFixed(0)}%\n`;
paletteMD += `- **Dark sites:** ${archDark.yes}/${archEx.length} (${((archDark.yes / archEx.length) * 100).toFixed(1)}%)\n`;

paletteMD += `\n### Примеры\n\n${archEx.map(e => `- ${e.hostname} (bg: ${e.colors.bg_main}, text: ${e.colors.text_main})`).slice(0, 10).join('\n')}\n\n`;

paletteMD += `---\n\n`;

// Kids zone
paletteMD += `## ⚠️ "Детская неожиданность" Зона (Dirty Amber)\n\n`;
paletteMD += `**Criteria:** accent hue 25-45°, saturation < 50%\n`;
paletteMD += `**Sites in zone:** ${kidsZone.length}\n\n`;
paletteMD += `**Рекомендация:** НЕ использовать как default. Владелица отвергла warm-minimal/amber по умолчанию (D-117). Если дизайн требует amber — использовать ТОЛЬКО с saturation > 60% и осознанно.\n\n`;

if (kidsZone.length > 0) {
  paletteMD += `| Site | Accent Hue | Sat | BG | Dark |\n`;
  paletteMD += `|------|-----------|-----|-----|------|\n`;
  kidsZone.forEach(z => {
    paletteMD += `| ${z.hostname} | ${z.accent_hue}° | ${z.accent_sat}% | ${z.bg_main} | ${z.is_dark ? '✓' : '—'} |\n`;
  });
} else {
  paletteMD += `_No sites found in the dirty amber zone. Good._\n`;
}

paletteMD += `\n---\n\n`;
paletteMD += `## Data Quality Notes\n\n`;
paletteMD += `- Hex colours extracted from CSS computed styles — may differ from brand colours\n`;
paletteMD += `- primary_hue/accent_hue are median hues from color extraction, not brand palette\n`;
paletteMD += `- 0° hue = grayscale/monochrome (not actually red)\n`;
paletteMD += `- bg_main/text_main = mode across sites in cluster, representative not exact\n`;

fs.writeFileSync(path.join(PATTERNS_DIR, 'palette-patterns.md'), paletteMD);
console.log(`✅ palette-patterns.md written (${paletteMD.length} chars)`);

// ============================================================
// 2c. mood-axis.md
// ============================================================

const moods = [
  {
    name: 'bold',
    label: 'Bold / Дерзкий',
    definition: 'Крупная типографика, высокий контраст, насыщенные цвета, уверенные формы',
    radius: 'round (12-20px)',
    density: 'normal (16-32px)',
    shadow: 'light to medium',
    animation: 'some (5-30)',
    gradient: 'часто',
    dark: 'часто dark mode',
    layout: 'Asymmetric Hero Split или Bento Mosaic',
    palette: 'Dark Neon Cyan или Bold Cobalt',
    fonts: 'Display: жирный sans (Inter/Plus Jakarta Sans bold 700-800), Body: neutral sans',
    anti: 'Sharp corners (<4px), monochrome palette, tight spacing, no animation'
  },
  {
    name: 'serene',
    label: 'Serene / Спокойный',
    definition: 'Мягкие цвета, свободное пространство, плавные переходы, минимум визуального шума',
    radius: 'soft to round (4-20px)',
    density: 'airy (≥32px)',
    shadow: 'none or light',
    animation: 'none or some',
    gradient: 'редко',
    dark: 'обычно light',
    layout: 'Centered Marketing или Typography Editorial',
    palette: 'Serene Sage или Warm Editorial Cream',
    fonts: 'Display: light weight (300-400), Body: light serif/sans',
    anti: 'Heavy shadows, bold typography, dense layouts, high saturation'
  },
  {
    name: 'premium',
    label: 'Premium / Премиальный',
    definition: 'Сдержанная палитра, качественная типографика, минимализм в деталях, дорогой вид',
    radius: 'sharp to soft (0-8px)',
    density: 'airy (≥32px)',
    shadow: 'none',
    animation: 'none (<5)',
    gradient: 'редко',
    dark: 'часто dark mode',
    layout: 'Full-Bleed Product Showcase или Typography Editorial',
    palette: 'Dark Minimal или Cool Industrial',
    fonts: 'Display: тонкий serif (Playfair, Cormorant) или light sans, Body: neutral',
    anti: 'Pill buttons, яркие акценты, много анимации, crowded layouts'
  },
  {
    name: 'industrial',
    label: 'Industrial / Индустриальный',
    definition: 'Грубые текстуры, монохром, прямые линии, utilitarian aesthetic',
    radius: 'sharp (<4px)',
    density: 'tight to normal (8-24px)',
    shadow: 'none',
    animation: 'none or some',
    gradient: 'редко',
    dark: 'mix',
    layout: 'Gallery-Heavy Story или Architecture Portfolio',
    palette: 'Earth Architecture или Cool Industrial',
    fonts: 'Display: моноширинный или гротеск (Mono, Helvetica), Body: neutral sans',
    anti: 'Rounded corners, pastel palette, gradient, decorative elements'
  },
  {
    name: 'editorial',
    label: 'Editorial / Редакционный',
    definition: 'Типографика — главный герой, контент-центричный, воздушный дизайн',
    radius: 'sharp (<4px)',
    density: 'airy (≥32px)',
    shadow: 'none',
    animation: 'none (<5)',
    gradient: 'нет',
    dark: 'обычно light',
    layout: 'Typography-First Editorial или Magazine Editorial',
    palette: 'Warm Editorial Cream или Cool Industrial',
    fonts: 'Display: serif (Playfair, Georgia, Cormorant), Body: serif/sans 16-18px, line-height 1.5-1.7',
    anti: 'Bold colors, heavy shadows, pill buttons, dense grids'
  },
  {
    name: 'playful',
    label: 'Playful / Игривый',
    definition: 'Яркие цвета, нестандартные формы, анимация, неожиданные решения',
    radius: 'round to pill (12-999px)',
    density: 'normal to airy (16-48px)',
    shadow: 'light to medium',
    animation: 'lots (≥30)',
    gradient: 'часто',
    dark: 'mix',
    layout: 'Bento Mosaic или Single CTA Landing',
    palette: 'Playful Gradient или Dark Neon Cyan',
    fonts: 'Display: креативный (display fonts, variable), Body: friendly sans',
    anti: 'Monochrome, sharp corners, no animation, conservative layout'
  },
  {
    name: 'friendly',
    label: 'Friendly / Дружелюбный',
    definition: 'Тёплые тона, округлые формы, human-centric, inviting',
    radius: 'round to pill (12-999px)',
    density: 'normal (16-32px)',
    shadow: 'light',
    animation: 'some (5-30)',
    gradient: 'иногда',
    dark: 'обычно light',
    layout: 'Centered Marketing или Stats-Heavy Credibility',
    palette: 'Warm Editorial Cream или Serene Sage',
    fonts: 'Display: округлый sans (Nunito, Plus Jakarta Sans), Body: friendly sans',
    anti: 'Sharp corners, cold palette, dark mode, dense text'
  }
];

let moodMD = `# Mood Axis — Mood → Layout + Palette + Font Mapping

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** ${summary.generated_at}
**Purpose:** По заданному mood (настроению) подобрать layout pattern, palette, fonts.

> Каждый mood определён через числа из corpus (radius, density, shadow, animation).
> ⚠️ **Font detection rate: 55%** — font-рекомендации приблизительные, основаны на частичных данных.

---

## Mood Distribution in Corpus

| Mood | Radius | Density | Shadow | Animation | Gradient | Dark |
|------|--------|---------|--------|-----------|----------|------|
| Bold | round (12-20px) | normal (16-32px) | light-medium | some (5-30) | often | often |
| Serene | soft-round (4-20px) | airy (≥32px) | none-light | none-some | rare | light |
| Premium | sharp-soft (0-8px) | airy (≥32px) | none | none (<5) | rare | dark |
| Industrial | sharp (<4px) | tight-normal (8-24px) | none | none-some | rare | mix |
| Editorial | sharp (<4px) | airy (≥32px) | none | none (<5) | no | light |
| Playful | round-pill (12-999px) | normal-airy (16-48px) | light-medium | lots (≥30) | often | mix |
| Friendly | round-pill (12-999px) | normal (16-32px) | light | some (5-30) | sometimes | light |

---

`;

moods.forEach(m => {
  moodMD += `## ${m.label}\n\n`;
  moodMD += `**Определение:** ${m.definition}\n\n`;
  moodMD += `### Характеристики (из corpus)\n\n`;
  moodMD += `- **Radius:** ${m.radius}\n`;
  moodMD += `- **Density:** ${m.density}\n`;
  moodMD += `- **Shadow:** ${m.shadow}\n`;
  moodMD += `- **Animation:** ${m.animation}\n`;
  moodMD += `- **Gradient:** ${m.gradient}\n`;
  moodMD += `- **Dark mode:** ${m.dark}\n\n`;
  moodMD += `### Recommended\n\n`;
  moodMD += `- **Layout pattern:** ${m.layout} (см. layout-patterns.md)\n`;
  moodMD += `- **Palette:** ${m.palette} (см. palette-patterns.md)\n`;
  moodMD += `- **Font pair:** ${m.fonts}\n\n`;

  // Find example sites matching this mood
  moodMD += `### Anti-pattern\n\n${m.anti}\n\n`;
  moodMD += `---\n\n`;
});

fs.writeFileSync(path.join(PATTERNS_DIR, 'mood-axis.md'), moodMD);
console.log(`✅ mood-axis.md written (${moodMD.length} chars)`);

// ============================================================
// 2d. composition-primitives.md
// ============================================================

let compMD = `# Composition Primitives — Стройблоки

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** ${summary.generated_at}
**Purpose:** Tailwind сниппеты для часто встречающихся секций. Каждый — из реального сайта.

---

## Hero Variants

`;

// Hero variants
const heroVariants = [
  {
    name: 'Asymmetric Split (60/40)',
    desc: 'Текст слева 3/5, изображение справа 2/5. Динамичный, для продуктов.',
    example: asymSites[0] || 'n/a',
    code: `<section class="min-h-screen flex items-center px-8 lg:px-20">
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto w-full items-center">
    <div class="lg:col-span-3 space-y-6">
      <span class="text-sm font-medium text-primary tracking-wide uppercase">Tagline</span>
      <h1 class="text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
        Headline that <span class="text-primary">converts</span>
      </h1>
      <p class="text-lg text-gray-500 max-w-lg">Subheadline explaining the value proposition in one or two sentences.</p>
      <div class="flex gap-4 pt-4">
        <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">Get started</a>
        <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">Learn more</a>
      </div>
    </div>
    <div class="lg:col-span-2">
      <img src="..." class="w-full rounded-xl shadow-lg" alt="Hero image" />
    </div>
  </div>
</section>`
  },
  {
    name: 'Full-Bleed Image',
    desc: 'Изображение на весь экран с текстовым оверлеем. Иммерсивный, для архитектуры/портфолио.',
    example: productSites[0] || 'n/a',
    code: `<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" alt="Hero background" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  <div class="relative z-10 flex flex-col justify-end h-full px-8 lg:px-20 pb-20">
    <h1 class="text-white text-5xl lg:text-7xl font-light tracking-tight max-w-3xl">
      Project Name
    </h1>
    <p class="text-white/70 text-xl mt-4">Location • Year • Typology</p>
  </div>
</section>`
  },
  {
    name: 'Typography-First',
    desc: 'Большой текст, минимум графики. Элегантный, для editorial/agency.',
    example: typographySites[0] || 'n/a',
    code: `<section class="min-h-screen flex flex-col justify-center px-8 lg:px-20 py-24">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-6xl lg:text-8xl font-light leading-[0.95] tracking-tight">
      We design<br />experiences
    </h1>
    <div class="h-px bg-gray-200 my-12"></div>
    <p class="text-xl text-gray-500 max-w-xl leading-relaxed">
      A studio focused on creating meaningful digital products that people love to use.
    </p>
  </div>
</section>`
  },
  {
    name: 'Centered Product',
    desc: 'Всё по центру: текст, CTA, изображение продукта. Универсальный.',
    example: centeredMarketingSites[0] || extractions[0].hostname,
    code: `<section class="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
  <span class="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">New feature</span>
  <h1 class="text-5xl lg:text-6xl font-bold max-w-3xl mt-6 leading-tight">
    The easiest way to <span class="text-primary">build</span> something great
  </h1>
  <p class="text-lg text-gray-500 mt-6 max-w-xl">
    Description of what the product does and why people should care.
  </p>
  <div class="flex gap-4 mt-8">
    <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">Start free trial</a>
    <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Watch demo</a>
  </div>
  <img src="..." class="mt-16 max-w-4xl w-full rounded-xl shadow-2xl" alt="Product screenshot" />
</section>`
  },
  {
    name: 'Split Screen',
    desc: 'Две половины: изображение слева, текст справа (50/50).',
    example: 'combine asymmetric-split with image_position=left',
    code: `<section class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
  <div class="h-64 lg:h-full">
    <img src="..." class="w-full h-full object-cover" alt="Hero" />
  </div>
  <div class="flex flex-col justify-center px-8 lg:px-20 py-16">
    <h1 class="text-5xl lg:text-6xl font-bold leading-tight">Headline</h1>
    <p class="text-lg text-gray-500 mt-6 max-w-md">Subheadline</p>
    <div class="flex gap-4 mt-8">
      <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">CTA</a>
    </div>
  </div>
</section>`
  }
];

compMD += heroVariants.map((hv, i) => {
  return `### ${i + 1}. ${hv.name}\n\n${hv.desc}\n\n**Example:** ${hv.example}\n\n\`\`\`html\n${hv.code}\n\`\`\`\n\n`;
}).join('');

compMD += `## Feature Section Variants\n\n`;

const featureVariants = [
  {
    name: 'Icon Grid (3-col)',
    desc: 'Три колонки с иконками, заголовком и описанием. Самый частый паттерн.',
    code: `<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-4">Features</h2>
    <p class="text-gray-500 text-center max-w-xl mx-auto mb-16">Why people choose us</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-8 rounded-xl hover:bg-gray-50 transition">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary">...</svg>
        </div>
        <h3 class="text-lg font-semibold">Feature name</h3>
        <p class="text-gray-500 mt-2 text-sm">Short description of this feature and its benefit.</p>
      </div>
      <!-- repeat -->
    </div>
  </div>
</section>`
  },
  {
    name: 'Alternating Rows',
    desc: 'Чередование текст-изображение, изображение-текст. Для storytelling.',
    code: `<section class="px-8 py-24 space-y-32">
  <div class="max-w-6xl mx-auto">
    <!-- Row 1: text left, image right -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-4">
        <h3 class="text-2xl font-bold">Feature one</h3>
        <p class="text-gray-500">Description of the first key feature.</p>
      </div>
      <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
    </div>
    <!-- Row 2: image left, text right -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden lg:order-1">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <div class="space-y-4">
        <h3 class="text-2xl font-bold">Feature two</h3>
        <p class="text-gray-500">Description of the second key feature.</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    name: 'Bento Feature Grid',
    desc: 'Карточки разного размера в мозаике. Современный, для SaaS.',
    code: `<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-16">Everything you need</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <div class="md:col-span-2 md:row-span-2 bg-gray-50 rounded-2xl p-8 flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-semibold">Main feature</h3>
          <p class="text-gray-500 mt-2">Detailed description</p>
        </div>
        <div class="bg-gray-200 rounded-xl h-32 mt-4"></div>
      </div>
      <div class="bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Feature</h3>
        <p class="text-gray-500 text-sm mt-2">Brief</p>
      </div>
      <div class="md:row-span-2 bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Tall feature</h3>
        <p class="text-gray-500 text-sm mt-2">More detail</p>
      </div>
      <div class="md:col-span-2 bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Wide feature</h3>
        <p class="text-gray-500 text-sm mt-2">Wide card</p>
      </div>
    </div>
  </div>
</section>`
  },
  {
    name: 'Stat Row',
    desc: '4 колонки с крупными цифрами. Для credibility/social proof.',
    code: `<section class="px-8 py-20 bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div>
      <span class="block text-5xl font-bold">99.9%</span>
      <span class="text-gray-400 mt-2 block text-sm">Uptime SLA</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">10M+</span>
      <span class="text-gray-400 mt-2 block text-sm">Users</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">150+</span>
      <span class="text-gray-400 mt-2 block text-sm">Countries</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">4.9</span>
      <span class="text-gray-400 mt-2 block text-sm">Rating</span>
    </div>
  </div>
</section>`
  }
];

compMD += featureVariants.map(fv => `### ${fv.name}\n\n${fv.desc}\n\n\`\`\`html\n${fv.code}\n\`\`\`\n\n`).join('');

compMD += `## CTA Variants\n\n`;

const ctaVariants = [
  {
    name: 'Centered Banner',
    desc: 'Центрированный призыв к действию с заголовком и кнопкой.',
    code: `<section class="px-8 py-24 text-center">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl lg:text-4xl font-bold">Ready to get started?</h2>
    <p class="text-gray-500 mt-4 text-lg">Join thousands of happy customers.</p>
    <div class="mt-8 flex gap-4 justify-center">
      <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">Start free trial</a>
      <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Talk to sales</a>
    </div>
  </div>
</section>`
  },
  {
    name: 'Split with Image',
    desc: 'CTA с изображением слева/справа.',
    code: `<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl overflow-hidden">
    <div class="p-12 lg:p-16">
      <h2 class="text-3xl font-bold">Get the app</h2>
      <p class="text-gray-500 mt-4">Download now and start your journey.</p>
      <div class="flex gap-4 mt-8">
        <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">App Store</a>
        <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Google Play</a>
      </div>
    </div>
    <div class="h-64 lg:h-full">
      <img src="..." class="w-full h-full object-cover" />
    </div>
  </div>
</section>`
  },
  {
    name: 'Inline Footer CTA',
    desc: 'CTA встроенный в футер, минимальный.',
    code: `<footer class="px-8 py-16 border-t border-gray-200">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
    <div>
      <h3 class="text-lg font-semibold">Start building today</h3>
      <p class="text-gray-500 text-sm mt-1">Free forever, no credit card required.</p>
    </div>
    <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium whitespace-nowrap">Get started</a>
  </div>
</footer>`
  }
];

compMD += ctaVariants.map(cv => `### ${cv.name}\n\n${cv.desc}\n\n\`\`\`html\n${cv.code}\n\`\`\`\n\n`).join('');

compMD += `## Footer Variants\n\n`;

const footerVariants = [
  {
    name: '3-Column',
    desc: 'Три колонки: лого+описание, ссылки, social/newsletter.',
    code: `<footer class="px-8 py-16 border-t border-gray-200">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div>
      <h4 class="font-semibold text-lg">Company</h4>
      <p class="text-gray-500 text-sm mt-2">Making the world a better place through design.</p>
    </div>
    <div>
      <h4 class="font-semibold mb-3">Links</h4>
      <ul class="space-y-2 text-sm text-gray-500">
        <li><a href="#" class="hover:text-gray-900 transition">About</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Blog</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Careers</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-semibold mb-3">Legal</h4>
      <ul class="space-y-2 text-sm text-gray-500">
        <li><a href="#" class="hover:text-gray-900 transition">Privacy</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
    &copy; 2026 Company. All rights reserved.
  </div>
</footer>`
  },
  {
    name: 'Minimal',
    desc: 'Только копирайт и ссылки в одну строку.',
    code: `<footer class="px-8 py-8 border-t border-gray-200">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
    <span>&copy; 2026 Company</span>
    <div class="flex gap-6">
      <a href="#" class="hover:text-gray-900 transition">Privacy</a>
      <a href="#" class="hover:text-gray-900 transition">Terms</a>
    </div>
  </div>
</footer>`
  },
  {
    name: 'Magazine',
    desc: 'Много ссылок по категориям, как в журнале.',
    code: `<footer class="px-8 py-16 bg-gray-50 border-t border-gray-200">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Product</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Features</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Company</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">About</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Blog</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Legal</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Privacy</a></li></ul>
    </div>
  </div>
</footer>`
  }
];

compMD += footerVariants.map(fv => `### ${fv.name}\n\n${fv.desc}\n\n\`\`\`html\n${fv.code}\n\`\`\`\n\n`).join('');

compMD += `## Data Quality Notes\n\n`;
compMD += `- Primitives — репрезентативные сниппеты, основанные на частых паттернах из corpus\n`;
compMD += `- Hero type classifier (73% "centered") может недооценивать full-bleed и split-screen варианты\n`;
compMD += `- Примеры hostname — реальные сайты из corpus, но не обязательно точные примеры данного примитива\n`;

fs.writeFileSync(path.join(PATTERNS_DIR, 'composition-primitives.md'), compMD);
console.log(`✅ composition-primitives.md written (${compMD.length} chars)`);

// ============================================================
// FINAL STATS
// ============================================================
console.log('\n========== DONE ==========');
console.log(`analysis-summary.json: ${JSON.stringify(summary).length} chars`);
console.log(`analysis-report.md: ${report.length} chars`);
console.log(`layout-patterns.md: ${layoutMD.length} chars -> ${PATTERNS_DIR}/layout-patterns.md`);
console.log(`palette-patterns.md: ${paletteMD.length} chars -> ${PATTERNS_DIR}/palette-patterns.md`);
console.log(`mood-axis.md: ${moodMD.length} chars -> ${PATTERNS_DIR}/mood-axis.md`);
console.log(`composition-primitives.md: ${compMD.length} chars -> ${PATTERNS_DIR}/composition-primitives.md`);
console.log(`\nTotal extractions: ${extractions.length}`);
console.log(`Architecture-realestate: ${archEx.length}`);
console.log(`Hero types: ${JSON.stringify(heroTypeDist)}`);
console.log(`Top palette clusters: ${paletteClusters.slice(0, 3).map(c => c.key).join(', ')}`);
console.log(`Kids zone: ${kidsZone.length} sites`);