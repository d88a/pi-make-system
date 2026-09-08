#!/usr/bin/env node
/**
 * Screenshot regression — попиксельное сравнение скриншотов с baseline.
 *
 * Usage:
 *   # Создать baseline (desktop 1440px + mobile 390px)
 *   node agent/scripts/screenshot-diff.js --baseline projects/maksplit/dist/*.html
 *
 *   # Сравнить с baseline
 *   node agent/scripts/screenshot-diff.js --compare projects/maksplit/dist/*.html
 *
 *   # Проверить конкретную страницу
 *   node agent/scripts/screenshot-diff.js --compare projects/maksplit/dist/home.html
 *
 * Options:
 *   --threshold <n>   порог в % (default: 5)
 *   --json            вывод в JSON
 *   --save-diff       сохранить diff-изображения в screenshots/diff/
 *
 * Dependencies: pixelmatch, pngjs, playwright (global or local)
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Resolve dependencies — try local first, then global npm prefix
// ---------------------------------------------------------------------------
function resolveModule(name) {
  try {
    return require(name);
  } catch (_first) { /* fall through to global */ }

  const candidates = [
    path.join(process.env.APPDATA || '', 'npm', 'node_modules'),
    path.join(process.env.HOME || '', '.npm-global', 'node_modules'),
    '/usr/local/lib/node_modules',
  ];
  for (const cand of candidates) {
    try {
      return require(path.join(cand, name));
    } catch (_) { /* continue */ }
  }
  return null;
}

const playwright = resolveModule('playwright');
const pixelmatchModule = resolveModule('pixelmatch');
// pixelmatch v7+ ships ESM; support both `module.exports` and `{ default }`
const pixelmatch = pixelmatchModule && pixelmatchModule.default ? pixelmatchModule.default : pixelmatchModule;
const pngjs = resolveModule('pngjs');
const PNG = pngjs ? pngjs.PNG : null;

// ---------------------------------------------------------------------------
// Dependency check
// ---------------------------------------------------------------------------
const missing = [];
if (!playwright) missing.push('playwright');
if (!pixelmatch) missing.push('pixelmatch');
if (!pngjs) missing.push('pngjs');

if (missing.length > 0) {
  console.error('Missing dependencies: ' + missing.join(', '));
  console.error('\nInstall with:\n  npm install ' + missing.join(' '));
  console.error('\nFor playwright (chromium) also run:\n  npx playwright install chromium');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

let mode = null; // 'baseline' | 'compare'
let threshold = 5;
let jsonOutput = false;
let saveDiff = false;
const patterns = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--baseline') {
    mode = 'baseline';
  } else if (a === '--compare') {
    mode = 'compare';
  } else if (a === '--threshold') {
    threshold = parseFloat(args[++i]);
  } else if (a === '--json') {
    jsonOutput = true;
  } else if (a === '--save-diff') {
    saveDiff = true;
  } else if (a.startsWith('-')) {
    console.error('Unknown option: ' + a);
    process.exit(1);
  } else {
    patterns.push(a);
  }
}

if (!mode || patterns.length === 0) {
  console.error(
    'Usage: node screenshot-diff.js [--baseline|--compare] [--threshold n] [--json] [--save-diff] <file|glob> [...]'
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Expand simple glob patterns (supports * and **) */
function expandGlobs(rawPatterns) {
  const files = [];
  for (const pat of rawPatterns) {
    if (pat.startsWith('http://') || pat.startsWith('https://')) {
      files.push(pat);
      continue;
    }
    const resolved = path.resolve(pat);
    const dir = path.dirname(resolved);
    const base = path.basename(resolved);

    if (!base.includes('*')) {
      if (fs.existsSync(resolved)) files.push(resolved);
      else console.error('File not found: ' + resolved);
      continue;
    }

    // Convert glob to regex
    const regex = new RegExp(
      '^' + base.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$'
    );
    if (!fs.existsSync(dir)) {
      console.error('Directory not found: ' + dir);
      continue;
    }
    const entries = fs.readdirSync(dir).filter((f) => regex.test(f));
    entries.sort().forEach((f) => files.push(path.join(dir, f)));
  }
  return files;
}

/** Page name from file path or URL (without extension / protocol) */
function pageName(input) {
  if (input.startsWith('http://') || input.startsWith('https://')) {
    const u = new URL(input);
    const p = u.pathname === '/' ? 'index' : u.pathname.replace(/^\//, '').replace(/\.html$/, '');
    return (p || 'index').replace(/\//g, '-');
  }
  return path.basename(input).replace(/\.html$/, '');
}

/** Resolve the newest cached Chromium executable (fallback when the pinned
 * version cannot be downloaded, e.g. CDN restricted). */
function resolveCachedChromium() {
  const cacheDirs = [
    path.join(process.env.LOCALAPPDATA || '', 'ms-playwright'),
    path.join(process.env.HOME || '', '.cache', 'ms-playwright'),
    path.join(process.env.HOME || '', 'Library', 'Caches', 'ms-playwright'),
  ];

  const candidates = [];
  for (const cacheDir of cacheDirs) {
    if (!cacheDir || !fs.existsSync(cacheDir)) continue;
    let entries;
    try {
      entries = fs.readdirSync(cacheDir);
    } catch (_) { continue; }

    for (const entry of entries) {
      if (!entry.startsWith('chromium-') || entry.includes('headless_shell')) continue;
      const exe = path.join(cacheDir, entry, 'chrome-win64', 'chrome.exe');
      const exeLinux = path.join(cacheDir, entry, 'chrome-linux', 'chrome');
      if (fs.existsSync(exe)) candidates.push(exe);
      else if (fs.existsSync(exeLinux)) candidates.push(exeLinux);
    }
  }

  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

/** Launch chromium, falling back to a cached executable if the pinned one is missing. */
async function launchChromium() {
  try {
    return await playwright.chromium.launch({ headless: true });
  } catch (err) {
    const cachedExe = resolveCachedChromium();
    if (cachedExe) {
      try {
        return await playwright.chromium.launch({
          headless: true,
          executablePath: cachedExe,
        });
      } catch (_) { /* fall through to original error */ }
    }
    throw err;
  }
}

const BASE_DIR = path.join(process.cwd(), 'screenshots');
const BASELINE_DIR = path.join(BASE_DIR, 'baseline');
const DIFF_DIR = path.join(BASE_DIR, 'diff');
const MANIFEST_PATH = path.join(BASELINE_DIR, 'manifest.json');

// ---------------------------------------------------------------------------
// Screenshot capture
// ---------------------------------------------------------------------------

/**
 * Capture desktop (1440px) + mobile (390px) screenshots for a single page.
 * Returns Promise<{ desktop: Buffer, mobile: Buffer }>
 */
async function captureScreenshots(browser, input) {
  const sizes = {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 },
  };

  const result = {};
  for (const [name, viewport] of Object.entries(sizes)) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();

    if (input.startsWith('http://') || input.startsWith('https://')) {
      await page.goto(input, { waitUntil: 'networkidle', timeout: 30000 });
    } else {
      await page.goto('file://' + path.resolve(input), { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(300); // allow fonts/layout to settle
    }

    result[name] = await page.screenshot({ fullPage: false });
    await context.close();
  }
  return result;
}

// ---------------------------------------------------------------------------
// Baseline mode
// ---------------------------------------------------------------------------
async function runBaseline(files) {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });

  const manifest = { pages: {}, createdAt: new Date().toISOString() };
  const browser = await launchChromium();

  for (const file of files) {
    const name = pageName(file);
    try {
      const shots = await captureScreenshots(browser, file);
      const desktopPath = path.join(BASELINE_DIR, `${name}-desktop.png`);
      const mobilePath = path.join(BASELINE_DIR, `${name}-mobile.png`);
      fs.writeFileSync(desktopPath, shots.desktop);
      fs.writeFileSync(mobilePath, shots.mobile);

      manifest.pages[name] = {
        source: file,
        desktop: path.relative(BASE_DIR, desktopPath).replace(/\\/g, '/'),
        mobile: path.relative(BASE_DIR, mobilePath).replace(/\\/g, '/'),
      };
      console.log(`✓ ${name}: saved desktop + mobile`);
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`);
    }
  }

  await browser.close();
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log('\nBaseline saved to: ' + MANIFEST_PATH);
}

// ---------------------------------------------------------------------------
// Compare mode
// ---------------------------------------------------------------------------
async function runCompare(files) {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error('Baseline manifest not found: ' + MANIFEST_PATH);
    console.error('Run first:\n  node screenshot-diff.js --baseline <file|glob> [...]');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const report = { threshold, pages: {}, passed: true, changedPages: [] };

  const browser = await launchChromium();

  for (const file of files) {
    const name = pageName(file);
    const baselinePage = manifest.pages[name];

    if (!baselinePage) {
      report.pages[name] = { error: `No baseline for "${name}". Run --baseline first.` };
      report.passed = false;
      report.changedPages.push(name);
      console.error(`✗ ${name}: no baseline found`);
      continue;
    }

    try {
      const shots = await captureScreenshots(browser, file);
      const pageReport = { desktop: null, mobile: null };

      for (const view of ['desktop', 'mobile']) {
        const baselinePath = path.join(BASE_DIR, baselinePage[view]);
        if (!fs.existsSync(baselinePath)) {
          pageReport[view] = { error: 'baseline image missing' };
          report.passed = false;
          continue;
        }

        const baselinePng = PNG.sync.read(fs.readFileSync(baselinePath));
        const currentPng = PNG.sync.read(shots[view]);

        // Resize current to baseline dimensions if they differ
        const width = baselinePng.width;
        const height = baselinePng.height;
        const diff = new PNG({ width, height });

        let numDiffPixels;
        if (currentPng.width === width && currentPng.height === height) {
          numDiffPixels = pixelmatch(
            baselinePng.data, currentPng.data, diff.data,
            width, height,
            { threshold: 0.1 }
          );
        } else {
          // Fallback: mismatch size -> treat as fully changed
          numDiffPixels = width * height;
        }

        const diffPercent = (numDiffPixels / (width * height)) * 100;
        const passed = diffPercent <= threshold;

        pageReport[view] = {
          diffPercent: round2(diffPercent),
          threshold,
          passed,
          baselineSize: `${width}x${height}`,
          currentSize: `${currentPng.width}x${currentPng.height}`,
        };

        if (!passed) {
          report.passed = false;
          if (!report.changedPages.includes(name)) report.changedPages.push(name);
        }

        if (saveDiff && !passed) {
          fs.mkdirSync(DIFF_DIR, { recursive: true });
          const diffName = path.join(DIFF_DIR, `${name}-${view}-diff.png`);
          fs.writeFileSync(diffName, PNG.sync.write(diff));
        }
      }

      report.pages[name] = pageReport;
    } catch (err) {
      report.pages[name] = { error: err.message };
      report.passed = false;
      report.changedPages.push(name);
      console.error(`✗ ${name}: ${err.message}`);
    }
  }

  await browser.close();

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printTextReport(report);
  }

  process.exitCode = report.passed ? 0 : 1;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function printTextReport(report) {
  console.log('\nSCREENSHOT REGRESSION\n');

  for (const [name, page] of Object.entries(report.pages)) {
    console.log(`${name}:`);
    if (page.error) {
      console.log(`  ${page.error}`);
      continue;
    }
    for (const view of ['desktop', 'mobile']) {
      const v = page[view];
      if (!v) continue;
      if (v.error) {
        console.log(`  ${view[0].toUpperCase() + view.slice(1)}:  error`);
        continue;
      }
      const icon = v.passed ? '✅' : '❌';
      console.log(
        `  ${view[0].toUpperCase() + view.slice(1)}:  ${v.diffPercent}% diff ${icon} (threshold: ${v.threshold}%)`
      );
    }
  }

  const changed = report.changedPages.length;
  console.log(`\nRESULT: ${report.passed ? 'PASS' : 'FAIL'} ${report.passed ? '✅' : '❌'}` +
    (changed > 0 ? ` (${changed} page${changed > 1 ? 's' : ''} changed)` : ''));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
(async () => {
  const files = expandGlobs(patterns);
  if (files.length === 0) {
    console.error('No files matched. Verify path or glob pattern.');
    process.exit(1);
  }

  if (mode === 'baseline') {
    await runBaseline(files);
  } else if (mode === 'compare') {
    await runCompare(files);
  }
})().catch((err) => {
  console.error('Fatal error: ' + err.message);
  process.exit(1);
});