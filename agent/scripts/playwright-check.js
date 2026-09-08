#!/usr/bin/env node
/**
 * Playwright regression check — автоматическая проверка HTML-страниц.
 *
 * Usage:
 *   node agent/scripts/playwright-check.js <path-to-html|URL>
 *   node agent/scripts/playwright-check.js projects/maksplit/dist/home.html
 *   node agent/scripts/playwright-check.js projects/maksplit/dist/*.html
 *   node agent/scripts/playwright-check.js --json *.html
 *
 * Desktop (1440px): page load, console errors, failed requests, horizontal
 * overflow, nav, main, CTA, images loaded.
 * Mobile (390px): all desktop checks + touch target size (WCAG 2.5.5 ≥ 44×44).
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Playwright resolve — try global npm path
// ---------------------------------------------------------------------------
let playwright;
try {
  playwright = require('playwright');
} catch (_first) {
  // Try global npm prefix (common on Windows)
  const candidates = [
    path.join(process.env.APPDATA || '', 'npm', 'node_modules'),
    path.join(process.env.HOME || '', '.npm-global', 'node_modules'),
    '/usr/local/lib/node_modules',
  ];
  let resolved = false;
  for (const cand of candidates) {
    try {
      const modPath = path.join(cand, 'playwright');
      playwright = require(modPath);
      resolved = true;
      break;
    } catch (_) { /* continue */ }
  }
  if (!resolved) {
    console.error(
      'Playwright не установлен. Установите:\n' +
      '  npm install -g playwright\n' +
      '  npx playwright install chromium\n'
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

let jsonOutput = false;
const patterns = [];

for (const arg of args) {
  if (arg === '--json') {
    jsonOutput = true;
  } else {
    patterns.push(arg);
  }
}

if (patterns.length === 0) {
  console.error('Usage: node playwright-check.js [--json] <file|glob|URL> [...]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Expand simple glob patterns (supports *.html and ** patterns) */
function expandGlobs(rawPatterns) {
  const files = [];
  for (const pat of rawPatterns) {
    if (pat.startsWith('http://') || pat.startsWith('https://')) {
      files.push(pat);
    } else if (pat.includes('*')) {
      // Simple glob: use directory + filter
      const dir = path.dirname(pat);
      const base = path.basename(pat);
      const absDir = path.resolve(dir);

      if (!fs.existsSync(absDir)) {
        console.error(`Directory not found: ${absDir}`);
        continue;
      }

      // Convert glob pattern to regex
      const regex = new RegExp(
        '^' + base.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
      );
      const entries = fs.readdirSync(absDir).filter(f => regex.test(f));
      entries.sort().forEach(f => {
        files.push(path.join(absDir, f));
      });
    } else {
      files.push(path.resolve(pat));
    }
  }
  return files;
}

/** Ensure screenshots directory exists */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Locate a usable Chromium executable in the Playwright browser cache.
 * Playwright normally downloads matching browsers, but on some networks
 * (CDN blocked) that fails — fall back to already-cached builds.
 */
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
      // Prefer full chromium over headless shell (full supports screenshots better)
      if (!entry.startsWith('chromium-') || entry.includes('headless_shell')) continue;
      const exe = path.join(
        cacheDir, entry, 'chrome-win64', 'chrome.exe'
      );
      const exeLinux = path.join(
        cacheDir, entry, 'chrome-linux', 'chrome'
      );
      if (fs.existsSync(exe)) {
        candidates.push(exe);
      } else if (fs.existsSync(exeLinux)) {
        candidates.push(exeLinux);
      }
    }

    // Fallback to headless shell if no full chromium found
    if (candidates.length === 0) {
      for (const entry of entries) {
        if (!entry.startsWith('chromium_headless_shell-')) continue;
        const exe = path.join(
          cacheDir, entry, 'chrome-headless-shell-win64', 'chrome-headless-shell.exe'
        );
        const exeLinux = path.join(
          cacheDir, entry, 'chrome-headless-shell-linux', 'chrome-headless-shell'
        );
        if (fs.existsSync(exe)) {
          candidates.push(exe);
        } else if (fs.existsSync(exeLinux)) {
          candidates.push(exeLinux);
        }
      }
    }
  }

  // Return the last (newest by build number) candidate
  return candidates.length > 0 ? candidates[candidates.length - 1] : null;
}

/** Check if element is <button>, <a>, or has role="button" */
function isCTA(element) {
  const tag = (element.tagName || '').toLowerCase();
  return tag === 'button' || tag === 'a' || element.getAttribute('role') === 'button';
}

/** Get page name from file path */
function pageName(filePath) {
  const base = path.basename(filePath, '.html');
  // Remove extension if present (for URLs)
  return base.replace(/[^a-zA-Z0-9_-]/g, '_') || 'index';
}

// ---------------------------------------------------------------------------
// Check runner
// ---------------------------------------------------------------------------

async function runChecks(page, viewportLabel) {
  const result = {};

  // 1. Page load
  result.pageLoad = true; // If we got here, page loaded

  // 2. Console errors (collected during page load — see runPage)
  result.consoleErrors = page._consoleErrors || [];

  // 3. Failed requests
  result.failedRequests = page._failedRequests || [];

  // 4. Horizontal overflow
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  result.horizontalOverflow = scrollWidth <= viewportWidth;
  result.scrollWidth = scrollWidth;
  result.viewportWidth = viewportWidth;

  // 5. Navigation
  const navCount = await page.evaluate(() => {
    const navs = document.querySelectorAll('nav, [role="navigation"]');
    return navs.length;
  });
  result.navigation = navCount > 0;
  result.navCount = navCount;

  // 6. Main content
  const mainCount = await page.evaluate(() => {
    const mains = document.querySelectorAll('main, [role="main"]');
    return mains.length;
  });
  result.mainContent = mainCount > 0;
  result.mainCount = mainCount;

  // 7. CTA
  const ctaCount = await page.evaluate(() => {
    const elements = document.querySelectorAll('button, a, [role="button"]');
    let count = 0;
    for (const el of elements) {
      const text = (el.textContent || '').trim().toLowerCase();
      // Relaxed: any button/link is a CTA
      if (text.length > 0) count++;
    }
    return count;
  });
  result.cta = ctaCount > 0;
  result.ctaCount = ctaCount;

  // 8. Images loaded
  const imgInfo = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    let loaded = 0;
    let failed = 0;
    const failedSrcs = [];
    for (const img of imgs) {
      if (img.naturalWidth > 0) {
        loaded++;
      } else {
        failed++;
        failedSrcs.push(img.src || img.getAttribute('src') || '(no src)');
      }
    }
    return { loaded, failed, total: imgs.length, failedSrcs };
  });
  result.imagesLoaded = imgInfo.failed === 0;
  result.imagesTotal = imgInfo.total;
  result.imagesLoadedCount = imgInfo.loaded;
  result.imagesFailed = imgInfo.failed;
  result.imagesFailedSrcs = imgInfo.failedSrcs;

  // 9. Touch targets (mobile only)
  if (viewportLabel === 'mobile') {
    const touchInfo = await page.evaluate(() => {
      const elements = document.querySelectorAll(
        'button, a, [role="button"], input[type="submit"], input[type="button"]'
      );
      let ok = 0;
      let fail = 0;
      const failedElements = [];
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue; // hidden
        if (rect.width >= 44 && rect.height >= 44) {
          ok++;
        } else {
          fail++;
          const text = (el.textContent || '').trim().substring(0, 30);
          failedElements.push({
            tag: el.tagName.toLowerCase(),
            text,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      }
      return { ok, fail, total: ok + fail, failedElements };
    });
    result.touchTargets = touchInfo.fail === 0;
    result.touchTargetsOk = touchInfo.ok;
    result.touchTargetsFail = touchInfo.fail;
    result.touchTargetsTotal = touchInfo.total;
    result.touchTargetsFailedElements = touchInfo.failedElements;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main page runner
// ---------------------------------------------------------------------------

async function runPage(browser, filePath, screenshotsDir) {
  const pname = pageName(filePath);
  const context = await browser.newContext();
  const page = await context.newPage();

  // Collect console errors and failed requests
  page._consoleErrors = [];
  page._failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      page._consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', request => {
    page._failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'unknown',
    });
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      page._failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  // ---- Desktop (1440px) ----
  await page.setViewportSize({ width: 1440, height: 900 });
  try {
    await page.goto(filePath, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (err) {
    // Page load failure
    context.close();
    return {
      page: pname,
      error: `Page load failed: ${err.message}`,
      desktop: { pageLoad: false },
      mobile: { pageLoad: false },
      screenshots: [],
      result: 'FAIL',
    };
  }

  const desktop = await runChecks(page, 'desktop');

  // Screenshot desktop
  ensureDir(screenshotsDir);
  const desktopScreenshot = path.join(screenshotsDir, `${pname}-desktop.png`);
  await page.screenshot({ path: desktopScreenshot, fullPage: true });

  // ---- Mobile (390px) ----
  await page.setViewportSize({ width: 390, height: 844 });
  // Re-collect after resize
  page._consoleErrors = [];
  page._failedRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      page._consoleErrors.push(msg.text());
    }
  });
  page.on('requestfailed', request => {
    page._failedRequests.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'unknown',
    });
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      page._failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
      });
    }
  });

  // Reload with mobile viewport
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 });

  const mobile = await runChecks(page, 'mobile');

  // Screenshot mobile
  const mobileScreenshot = path.join(screenshotsDir, `${pname}-mobile.png`);
  await page.screenshot({ path: mobileScreenshot, fullPage: true });

  await context.close();

  // Determine overall result
  const desktopPass = desktop.pageLoad &&
    desktop.consoleErrors.length === 0 &&
    desktop.failedRequests.length === 0 &&
    desktop.horizontalOverflow &&
    desktop.navigation &&
    desktop.mainContent &&
    desktop.cta &&
    desktop.imagesLoaded;

  const mobilePass = mobile.pageLoad &&
    mobile.consoleErrors.length === 0 &&
    mobile.horizontalOverflow &&
    (mobile.touchTargets === undefined || mobile.touchTargets);

  const overallPass = desktopPass && mobilePass;

  return {
    page: pname,
    file: filePath,
    desktop,
    mobile,
    screenshots: [desktopScreenshot, mobileScreenshot],
    result: overallPass ? 'PASS' : 'FAIL',
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function formatHuman(results) {
  const lines = [];

  for (const r of results) {
    lines.push('='.repeat(60));
    lines.push(`PLAYWRIGHT CHECK`);
    lines.push(`Page: ${r.page}`);
    if (r.error) {
      lines.push(`  ERROR: ${r.error}`);
      lines.push(`RESULT: FAIL ❌`);
      lines.push('');
      continue;
    }
    lines.push('');

    const d = r.desktop;
    lines.push('Desktop (1440px):');
    lines.push(`  Page load            ${d.pageLoad ? '✅' : '❌'}`);
    lines.push(`  Console errors       ${d.consoleErrors.length === 0 ? '✅' : '❌'} (${d.consoleErrors.length})`);
    if (d.consoleErrors.length > 0) {
      for (const err of d.consoleErrors.slice(0, 3)) {
        lines.push(`    - ${err.substring(0, 100)}`);
      }
      if (d.consoleErrors.length > 3) lines.push(`    ... and ${d.consoleErrors.length - 3} more`);
    }
    lines.push(`  Failed requests      ${d.failedRequests.length === 0 ? '✅' : '❌'} (${d.failedRequests.length})`);
    if (d.failedRequests.length > 0) {
      for (const fr of d.failedRequests.slice(0, 3)) {
        lines.push(`    - ${fr.url?.substring(0, 80)} [${fr.status || fr.failure}]`);
      }
      if (d.failedRequests.length > 3) lines.push(`    ... and ${d.failedRequests.length - 3} more`);
    }
    lines.push(`  Horizontal overflow  ${d.horizontalOverflow ? '✅' : '❌'} (scroll=${d.scrollWidth}, viewport=${d.viewportWidth})`);
    lines.push(`  Navigation           ${d.navigation ? '✅' : '❌'} (${d.navCount} found)`);
    lines.push(`  Main content         ${d.mainContent ? '✅' : '❌'} (${d.mainCount} found)`);
    lines.push(`  CTA                  ${d.cta ? '✅' : '❌'} (${d.ctaCount} found)`);
    lines.push(`  Images loaded        ${d.imagesLoaded ? '✅' : '❌'} (${d.imagesLoadedCount}/${d.imagesTotal})`);
    if (!d.imagesLoaded && d.imagesFailedSrcs.length > 0) {
      for (const src of d.imagesFailedSrcs.slice(0, 3)) {
        lines.push(`    - ${src.substring(0, 80)}`);
      }
    }

    lines.push('');
    const m = r.mobile;
    lines.push('Mobile (390px):');
    lines.push(`  Page load            ${m.pageLoad ? '✅' : '❌'}`);
    lines.push(`  Console errors       ${m.consoleErrors.length === 0 ? '✅' : '❌'} (${m.consoleErrors.length})`);
    lines.push(`  Horizontal overflow  ${m.horizontalOverflow ? '✅' : '❌'} (scroll=${m.scrollWidth}, viewport=${m.viewportWidth})`);
    if (m.touchTargets !== undefined) {
      lines.push(`  Touch targets        ${m.touchTargets ? '✅' : '❌'} (${m.touchTargetsOk}/${m.touchTargetsTotal} ≥ 44px)`);
      if (!m.touchTargets && m.touchTargetsFailedElements) {
        for (const el of m.touchTargetsFailedElements.slice(0, 3)) {
          lines.push(`    - <${el.tag}> "${el.text}" ${el.width}×${el.height}px`);
        }
      }
    }

    lines.push('');
    lines.push('Screenshots saved:');
    for (const ss of r.screenshots) {
      lines.push(`  ${ss}`);
    }

    lines.push('');
    lines.push(`RESULT: ${r.result === 'PASS' ? 'PASS ✅' : 'FAIL ❌'}`);
    lines.push('');
  }

  lines.push('='.repeat(60));
  return lines.join('\n');
}

function formatJSON(results) {
  return JSON.stringify(results, null, 2);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const files = expandGlobs(patterns);

  if (files.length === 0) {
    console.error('No files found matching:', patterns.join(', '));
    process.exit(1);
  }

  // Determine screenshots dir relative to CWD
  const screenshotsDir = path.join(process.cwd(), 'screenshots');

  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
  } catch (err) {
    // Default resolve failed — try a cached Chromium build
    const cachedExe = resolveCachedChromium();
    if (cachedExe) {
      try {
        browser = await playwright.chromium.launch({
          headless: true,
          executablePath: cachedExe,
        });
      } catch (err2) {
        console.error('Failed to launch Chromium:', err2.message);
        console.error('Cached executable:', cachedExe);
        console.error('Install browsers: npx playwright install chromium');
        process.exit(1);
      }
    } else {
      console.error('Failed to launch Chromium:', err.message);
      console.error('Install browsers: npx playwright install chromium');
      process.exit(1);
    }
  }

  const results = [];
  for (const file of files) {
    const absPath = file.startsWith('http') ? file : 'file:///' + file.replace(/\\/g, '/');
    const result = await runPage(browser, absPath, screenshotsDir);
    results.push(result);
  }

  await browser.close();

  if (jsonOutput) {
    console.log(formatJSON(results));
  } else {
    console.log(formatHuman(results));
  }

  const anyFail = results.some(r => r.result === 'FAIL');
  process.exit(anyFail ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});