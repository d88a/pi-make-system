#!/usr/bin/env node

/**
 * a11y-check.js — Accessibility Audit Script
 *
 * Checks an HTML page (local file or URL) for WCAG AA violations:
 *   - Color contrast (text/headings vs background)
 *   - Semantic landmarks (header, nav, main, footer, aside)
 *   - Missing alt attributes on images
 *   - Keyboard-focusable elements
 *   - ARIA roles on landmark regions
 *
 * Usage:
 *   node scripts/a11y-check.js <path-to-html|URL>
 *   node scripts/a11y-check.js --help
 *
 * Output:
 *   - Human-readable summary to stderr
 *   - Full JSON report to a11y-report.json in CWD
 *   - Exit code 0 = no critical/serious violations, 1 = violations found
 *
 * Requires: playwright (npm install playwright)
 * Optional:  axe-core (npm install axe-core) — falls back to manual checks
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ── CLI ──────────────────────────────────────────────────────────────────────

const arg = process.argv[2];

if (!arg || arg === '--help' || arg === '-h') {
  console.log(`Usage: node scripts/a11y-check.js <path-to-html|URL>

Checks an HTML page for WCAG AA accessibility violations.

Arguments:
  <path-to-html>   Local HTML file path (e.g. ./output/index.html)
  <URL>            Full URL (e.g. https://example.com)

Output:
  - Summary printed to stderr (violation counts by severity)
  - Full JSON report written to a11y-report.json in current directory

Exit codes:
  0 — No critical or serious violations found
  1 — Critical or serious violations found`);
  process.exit(0);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalize a path or URL for Playwright navigation.
 * Local paths get the file:// protocol.
 */
function normalizeTarget(raw) {
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^file:\/\//i.test(raw)) return raw;
  return 'file://' + path.resolve(raw);
}

/**
 * Compute WCAG relative luminance from an sRGB color.
 * @param {number} r - Red channel (0-255)
 * @param {number} g - Green channel (0-255)
 * @param {number} b - Blue channel (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Compute WCAG contrast ratio between two relative luminances.
 * @param {number} l1 - Lighter luminance
 * @param {number} l2 - Darker luminance
 * @returns {number} Contrast ratio (e.g. 4.5)
 */
function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse an rgb/rgba CSS color string into {r, g, b} or null.
 */
function parseRgb(colorStr) {
  if (!colorStr) return null;
  const match = colorStr.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
  );
  if (!match) return null;
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  const target = normalizeTarget(arg);
  const isLocal = target.startsWith('file://');

  console.error(`[a11y-check] Loading: ${target}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(target, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    // Allow any late-rendering JS to finish
    await page.waitForTimeout(1500);
  } catch (err) {
    console.error(`[a11y-check] ERROR: Failed to load page: ${err.message}`);
    await browser.close();
    process.exit(1);
  }

  const violations = [];

  // ── Optional: axe-core ─────────────────────────────────────────────────
  let axeUsed = false;
  try {
    const axeCore = require('axe-core');
    // Inject axe-core into the page
    await page.evaluate((source) => {
      eval(source);
    }, axeCore.source);
    const axeResults = await page.evaluate(() => {
      return window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa',
            'best-practice',
          ],
        },
      });
    });
    axeUsed = true;

    // Map axe-core severities to our categories
    const severityMap = {
      critical: 'critical',
      serious: 'serious',
      moderate: 'moderate',
      minor: 'minor',
    };

    for (const result of axeResults.violations) {
      for (const node of result.nodes) {
        const selector =
          node.target && node.target.length > 0
            ? node.target.join(' > ')
            : 'unknown';
        violations.push({
          severity: severityMap[result.impact] || 'moderate',
          selector,
          issue: result.help,
          description: result.description,
          wcag: (result.tags || [])
            .filter((t) => /^wcag/i.test(t))
            .join(', '),
          source: 'axe-core',
        });
      }
    }
    console.error(`[a11y-check] axe-core found ${violations.length} violations`);
  } catch (_err) {
    console.error(
      '[a11y-check] axe-core not available, using manual checks'
    );
  }

  // ── Manual checks (when axe-core unavailable or as supplement) ─────────
  if (!axeUsed) {
    const manual = await page.evaluate(() => {
      const results = [];

      /**
       * Build a short CSS selector string for an element.
       */
      function buildSelector(el) {
        if (el.id) return '#' + CSS.escape(el.id);
        const parts = [];
        let current = el;
        while (current && current !== document.body) {
          let segment = current.tagName.toLowerCase();
          if (current.id) {
            parts.unshift('#' + CSS.escape(current.id));
            break;
          }
          if (current.className && typeof current.className === 'string') {
            const cls = current.className
              .trim()
              .split(/\s+/)
              .filter((c) => c.length > 0)
              .slice(0, 2)
              .map((c) => '.' + CSS.escape(c))
              .join('');
            if (cls) segment += cls;
          }
          parts.unshift(segment);
          current = current.parentElement;
        }
        return parts.join(' > ') || el.tagName.toLowerCase();
      }

      /**
       * Walk up the DOM to find the effective background color
       * (skip transparent/opaque ancestors).
       */
      function getEffectiveBackground(el) {
        let current = el;
        while (current) {
          const cs = window.getComputedStyle(current);
          const bg = cs.backgroundColor;
          if (
            bg &&
            bg !== 'rgba(0, 0, 0, 0)' &&
            bg !== 'transparent'
          ) {
            const match = bg.match(
              /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+).*?\)/
            );
            if (match) {
              const alpha = bg.includes('rgba')
                ? parseFloat(bg.split(',')[3] || '1')
                : 1;
              if (alpha > 0.1) {
                return {
                  r: parseInt(match[1], 10),
                  g: parseInt(match[2], 10),
                  b: parseInt(match[3], 10),
                  alpha,
                };
              }
            }
          }
          current = current.parentElement;
        }
        // Default to white
        return { r: 255, g: 255, b: 255, alpha: 1 };
      }

      /**
       * Compute WCAG relative luminance.
       */
      function relLum(r, g, b) {
        const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
          c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      /**
       * Compute contrast ratio.
       */
      function cr(l1, l2) {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      // ── 1. Color contrast (text elements) ─────────────────────────────
      const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, label, figcaption, blockquote, dt, dd, div, button, input[type="text"], input[type="email"], input[type="password"], textarea, select'
      );

      const checkedContrast = new Set();

      for (const el of textElements) {
        // Skip hidden elements
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (el.offsetHeight === 0 && el.offsetWidth === 0) continue;

        // Skip elements with no direct text (only child-elements with text)
        const directText = Array.from(el.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent.trim())
          .join('');
        if (!directText && el.children.length > 0) continue;
        if (!directText && el.children.length === 0) continue;

        const textColor = cs.color;
        const textRgb = (() => {
          const m = textColor.match(
            /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
          );
          return m
            ? {
                r: parseInt(m[1], 10),
                g: parseInt(m[2], 10),
                b: parseInt(m[3], 10),
              }
            : null;
        })();
        if (!textRgb) continue;

        const bg = getEffectiveBackground(el);
        const textLum = relLum(textRgb.r, textRgb.g, textRgb.b);
        const bgLum = relLum(bg.r, bg.g, bg.b);
        const ratio = cr(textLum, bgLum);

        const fontSize = parseFloat(cs.fontSize);
        const fontWeight = parseInt(cs.fontWeight, 10) || 400;
        const isLargeText =
          fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
        const threshold = isLargeText ? 3.0 : 4.5;

        if (ratio < threshold) {
          const sel = buildSelector(el);
          const dedupKey = sel + ':' + textColor + ':' + ratio.toFixed(2);
          if (checkedContrast.has(dedupKey)) continue;
          checkedContrast.add(dedupKey);

          results.push({
            severity: ratio < 3.0 ? 'serious' : 'moderate',
            selector: sel,
            issue: `Low contrast: ${ratio.toFixed(2)}:1 (requires ${threshold}:1)`,
            description: `Text color ${textColor} on background rgb(${bg.r},${bg.g},${bg.b}) has contrast ratio ${ratio.toFixed(2)}:1. ` +
              `WCAG AA requires ${threshold}:1 for ${isLargeText ? 'large text' : 'normal text'}.`,
            wcag: 'WCAG 1.4.3 Contrast (Minimum) (AA)',
            source: 'manual',
          });
        }
      }

      // ── 2. Missing alt attributes on images ───────────────────────────
      const images = document.querySelectorAll('img');
      for (const img of images) {
        const cs = window.getComputedStyle(img);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (!img.hasAttribute('alt') || img.getAttribute('alt') === null) {
          results.push({
            severity: 'serious',
            selector: buildSelector(img),
            issue: 'Image missing alt attribute',
            description:
              'The <img> element lacks an alt attribute. Screen readers cannot convey the image content.',
            wcag: 'WCAG 1.1.1 Non-text Content (A)',
            source: 'manual',
          });
        }
      }

      // ── 3. Semantic landmarks ─────────────────────────────────────────
      // Map tag names to their full ARIA landmark role names (WCAG 1.3.1)
      const landmarkMap = {
        header: ['header', 'banner'],
        nav: ['nav', 'navigation'],
        main: ['main', 'main'],
        footer: ['footer', 'contentinfo'],
        aside: ['aside', 'complementary'],
      };
      const foundLandmarks = {};

      for (const [role, selectors] of Object.entries(landmarkMap)) {
        // Check both semantic elements and ARIA roles (full names)
        const semanticEls = document.querySelectorAll(selectors[0]);
        const ariaEls = document.querySelectorAll(`[role="${selectors[1]}"]`);
        foundLandmarks[role] = semanticEls.length + ariaEls.length;
      }

      // Missing main is critical
      if (foundLandmarks['main'] === 0) {
        results.push({
          severity: 'critical',
          selector: 'document',
          issue: 'Missing <main> landmark',
          description:
            'No <main> element or [role="main"] found. A main landmark is essential for screen reader navigation.',
          wcag: 'WCAG 1.3.1 Info and Relationships (A)',
          source: 'manual',
        });
      }

      // Missing nav is serious
      if (foundLandmarks['nav'] === 0) {
        results.push({
          severity: 'serious',
          selector: 'document',
          issue: 'Missing <nav> landmark',
          description:
            'No <nav> element or [role="navigation"] found. Navigation landmarks help users find site navigation.',
          wcag: 'WCAG 1.3.1 Info and Relationships (A)',
          source: 'manual',
        });
      }

      // Missing header is moderate
      if (foundLandmarks['header'] === 0) {
        results.push({
          severity: 'moderate',
          selector: 'document',
          issue: 'Missing <header> landmark',
          description:
            'No <header> element or [role="banner"] found. A header landmark helps identify the site header.',
          wcag: 'WCAG 1.3.1 Info and Relationships (A)',
          source: 'manual',
        });
      }

      // Missing footer is minor
      if (foundLandmarks['footer'] === 0) {
        results.push({
          severity: 'minor',
          selector: 'document',
          issue: 'Missing <footer> landmark',
          description:
            'No <footer> element or [role="contentinfo"] found. A footer landmark helps identify site footer info.',
          wcag: 'WCAG 1.3.1 Info and Relationships (A)',
          source: 'manual',
        });
      }

      // ── 4. Keyboard-focusable elements ────────────────────────────────
      const focusable = document.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        results.push({
          severity: 'serious',
          selector: 'document',
          issue: 'No keyboard-focusable elements found',
          description:
            'No interactive elements (links, buttons, inputs) are focusable. Keyboard users cannot navigate the page.',
          wcag: 'WCAG 2.1.1 Keyboard (A)',
          source: 'manual',
        });
      }

      // Check for positive tabindex values (anti-pattern)
      for (const el of focusable) {
        const tabindex = el.getAttribute('tabindex');
        if (tabindex !== null && parseInt(tabindex, 10) > 0) {
          results.push({
            severity: 'minor',
            selector: buildSelector(el),
            issue: `Positive tabindex="${tabindex}" disrupts natural tab order`,
            description:
              'Elements with tabindex > 0 create a non-standard tab order, confusing keyboard users.',
            wcag: 'WCAG 2.4.3 Focus Order (A)',
            source: 'manual',
          });
        }
      }

      return results;
    });

    violations.push(...manual);
    if (manual.length > 0) {
      console.error(`[a11y-check] Manual checks found ${manual.length} violations`);
    }
  }

  // ── Aggregate ─────────────────────────────────────────────────────────
  const severityOrder = ['critical', 'serious', 'moderate', 'minor'];
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };

  for (const v of violations) {
    if (counts.hasOwnProperty(v.severity)) {
      counts[v.severity]++;
    } else {
      counts.moderate++;
      v.severity = 'moderate';
    }
  }

  // Sort violations by severity
  violations.sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  // ── Output: Summary (stderr) ──────────────────────────────────────────
  const total = violations.length;
  const hasBlocking = counts.critical > 0 || counts.serious > 0;

  console.error('');
  console.error('═══════════════════════════════════════════');
  console.error('  Accessibility Audit Report');
  console.error('═══════════════════════════════════════════');
  console.error(`  Target:    ${target}`);
  console.error(`  Engine:    ${axeUsed ? 'axe-core' : 'manual (Playwright)'}`);
  console.error(`  Total:     ${total} violations`);
  console.error('  ─────────────────────────────────────');
  console.error(`  Critical:  ${counts.critical}`);
  console.error(`  Serious:   ${counts.serious}`);
  console.error(`  Moderate:  ${counts.moderate}`);
  console.error(`  Minor:     ${counts.minor}`);
  console.error('═══════════════════════════════════════════');

  if (total > 0) {
    console.error('');
    console.error('Violations detail:');
    for (const v of violations) {
      const icon =
        v.severity === 'critical'
          ? '🔴'
          : v.severity === 'serious'
          ? '🟠'
          : v.severity === 'moderate'
          ? '🟡'
          : '🔵';
      console.error(
        `  ${icon} [${v.severity.toUpperCase()}] ${v.issue}`
      );
      console.error(`     Selector: ${v.selector}`);
      console.error(`     ${v.wcag}`);
      console.error('');
    }
  }

  // ── Output: JSON report ───────────────────────────────────────────────
  const report = {
    timestamp: new Date().toISOString(),
    target,
    engine: axeUsed ? 'axe-core' : 'manual',
    summary: {
      total,
      critical: counts.critical,
      serious: counts.serious,
      moderate: counts.moderate,
      minor: counts.minor,
      pass: total === 0,
    },
    violations: violations.map((v) => ({
      severity: v.severity,
      selector: v.selector,
      issue: v.issue,
      description: v.description,
      wcag: v.wcag,
      source: v.source,
    })),
  };

  const reportPath = path.join(process.cwd(), 'a11y-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
  console.error(`\n[a11y-check] Full report saved to: ${reportPath}`);

  await browser.close();

  // Exit code: 0 = pass, 1 = blocking violations
  if (hasBlocking) {
    console.error(
      `\n[a11y-check] FAIL: ${counts.critical + counts.serious} critical/serious violations found.`
    );
    process.exit(1);
  } else {
    console.error(`\n[a11y-check] PASS: No critical or serious violations.`);
    process.exit(0);
  }
})();