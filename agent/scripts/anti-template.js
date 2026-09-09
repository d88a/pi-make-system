#!/usr/bin/env node

/**
 * anti-template.js — Anti-Template QA for Pi Make System
 *
 * Checks generated HTML pages for "template signals" — visual patterns
 * that indicate the design is too close to the default AI template.
 *
 * Scores the project on UNIQUENESS (0-100%).
 * Higher = more individual, lower = more template-like.
 *
 * Usage:
 *   node agent/scripts/anti-template.js <project-dir>
 *   node agent/scripts/anti-template.js projects/maksplit
 *   node agent/scripts/anti-template.js projects/vetclinic --threshold 60
 *
 * Exit code: 0 = above threshold (PASS), 1 = below threshold (FAIL).
 *
 * Dependencies: none (fs, path — all built-in).
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Template signals ─────────────────────────────────────────────────────

/**
 * Each signal has a weight (0-1) and a check function.
 * Weight = how strongly this signal indicates template-ness.
 */
const SIGNALS = [
  {
    id: 'inter-display',
    weight: 0.8,
    desc: 'Inter as display font',
    detect: (html) => {
      // Check if Inter appears as a font-family for headings or display
      const hasInterDisplay = /(?:font-family|fontFamily)[^}]*['"]Inter['"]/i.test(html);
      const hasOtherDisplay = /(?:font-family|fontFamily)[^}]*['"](?!Inter['"])[A-Z][a-z]+(?: [A-Z][a-z]+)*['"]/i.test(html);
      return hasInterDisplay && !hasOtherDisplay;
    }
  },
  {
    id: 'centered-hero',
    weight: 0.7,
    desc: 'Centered hero (text-center in first section)',
    detect: (html) => {
      // Find the first <section> or <main> and check for centered layout
      const firstSection = html.match(/<(?:section|main)[^>]*>([\s\S]*?)(?=<(?:section|\/main|\/body))/i);
      if (!firstSection) return false;
      const section = firstSection[1] || firstSection[0];
      return /text-center/.test(section) &&
             /items-center/.test(section) &&
             !/md:grid-cols-2|md:flex-row|lg:grid-cols-[3-9]/.test(section);
    }
  },
  {
    id: 'default-hero-h1',
    weight: 0.5,
    desc: 'Hero h1 = text-5xl/6xl/7xl (standard range)',
    detect: (html) => {
      const h1Match = html.match(/<h1[^>]*class="([^"]*)"[^>]*>/i);
      if (!h1Match) return true; // no h1 = worse
      return /text-(?:5|6|7)xl/.test(h1Match[1]) && !/text-\[/.test(h1Match[1]);
    }
  },
  {
    id: 'default-section-sequence',
    weight: 0.9,
    desc: 'hero→features→grid→cta sequence',
    detect: (html) => {
      const sections = (html.match(/<(?:section|div)\s[^>]*?(?:id|class)="([^"]*(?:hero|feature|grid|cta|card|testimonial|footer)[^"]*)"[^>]*>/gi) || [])
        .map(s => {
          const m = s.match(/(?:id|class)="([^"]*?(?:hero|feature|grid|cta|card|testimonial|footer)[^"]*)"/i);
          return m ? m[1] : '';
        });
      // Check for the default sequence pattern
      const hasHero = sections.some(s => /hero/i.test(s));
      const hasFeatures = sections.some(s => /feature/i.test(s));
      const hasGrid = sections.some(s => /grid|card/i.test(s));
      const hasCta = sections.some(s => /cta/i.test(s));
      return hasHero && hasFeatures && hasGrid && hasCta && sections.length <= 6;
    }
  },
  {
    id: 'rounded-md-buttons',
    weight: 0.6,
    desc: 'All buttons = rounded-md (default)',
    detect: (html) => {
      const buttons = html.match(/class="[^"]*rounded-[^"]*"[^>]*button[^>]*>/gi) ||
                      html.match(/<button[^>]*class="([^"]*rounded[^"]*)"[^>]*>/gi);
      if (!buttons || buttons.length === 0) return false;
      const roundedMd = buttons.filter(b => /rounded-md/.test(b) && !/rounded-lg|rounded-xl|rounded-2xl|rounded-full|rounded-none|rounded-\[/.test(b));
      return roundedMd.length > 0 && roundedMd.length === buttons.length;
    }
  },
  {
    id: 'border-card-default',
    weight: 0.7,
    desc: 'Cards = border + subtle shadow (default AI pattern)',
    detect: (html) => {
      // Look for card patterns with both border and shadow
      const cardPatterns = html.match(/class="[^"]*(?:card|product-card|service-card)[^"]*"/gi) || [];
      if (cardPatterns.length === 0) return false;
      const withBorderShadow = cardPatterns.filter(c =>
        /border/.test(c) && /shadow/.test(c)
      );
      return withBorderShadow.length > 0 && withBorderShadow.length >= cardPatterns.length * 0.7;
    }
  },
  {
    id: 'same-section-padding',
    weight: 0.5,
    desc: 'All sections same vertical padding',
    detect: (html) => {
      const pyPatterns = html.match(/py-(?:16|20|24|28|32|36)\b/g) || [];
      if (pyPatterns.length < 3) return false;
      const unique = [...new Set(pyPatterns)];
      return unique.length <= 1;
    }
  },
  {
    id: 'no-distinctive-motif',
    weight: 0.9,
    desc: 'No visual motif detectable (no signature element)',
    detect: (html) => {
      // Check for common signature elements
      const hasGiantType = /text-(?:7|8|9)xl|text-\[(?:6[4-9]|[7-9]\d|\d{3})px\]/.test(html);
      const hasAsymmetry = /col-span-(?:[2-9]|1[0-9])|md:grid-cols-5/.test(html);
      const hasFullBleed = /h-screen|min-h-screen|absolute inset-0/.test(html);
      const hasAnimation = /animate-|@keyframes|transform transition/.test(html);
      const hasColorAccent = /from-\[|to-\[|via-\[|bg-gradient/.test(html);
      return !hasGiantType && !hasAsymmetry && !hasFullBleed && !hasAnimation && !hasColorAccent;
    }
  },
  {
    id: 'inter-body-only',
    weight: 0.4,
    desc: 'Inter as the only font on the page',
    detect: (html) => {
      const fonts = html.match(/font-family[^}]*['"]([^'"]+)['"]/gi) || [];
      const uniqueFonts = [...new Set(fonts.map(f => {
        const m = f.match(/['"]([^'"]+)['"]/);
        return m ? m[1].split(',')[0].trim() : '';
      }))];
      return uniqueFonts.length === 1 && uniqueFonts[0] === 'Inter';
    }
  },
];

// ── Main ──────────────────────────────────────────────────────────────────

/**
 * @param {string} projectDir
 * @returns {{ signals: Array, score: number, passed: boolean, threshold: number }}
 */
function runAntiTemplate(projectDir, threshold = 50) {
  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { signals: [], score: 100, passed: true, threshold, error: 'No HTML files found' };
  }

  // Combine all HTML for analysis
  let combinedHtml = '';
  for (const file of htmlFiles) {
    try {
      combinedHtml += fs.readFileSync(file, 'utf-8') + '\n';
    } catch (_) { /* skip unreadable */ }
  }

  // Detect each signal
  const results = [];
  let totalWeight = 0;
  let detectedWeight = 0;

  for (const signal of SIGNALS) {
    const detected = signal.detect(combinedHtml);
    totalWeight += signal.weight;
    if (detected) detectedWeight += signal.weight;
    results.push({
      signal: signal.id,
      desc: signal.desc,
      weight: signal.weight,
      detected,
      status: detected ? '⚠️ TEMPLATE' : '✅ UNIQUE'
    });
  }

  // Calculate uniqueness score: 100% - (detected_weight / total_weight * 100)
  const templateScore = totalWeight > 0 ? (detectedWeight / totalWeight) * 100 : 0;
  const uniquenessScore = Math.round(100 - templateScore);

  const passed = uniquenessScore >= threshold;

  return { signals: results, score: uniquenessScore, passed, threshold };
}

/**
 * Find HTML files in a project (root-level only, not subdirectories).
 */
function findHtmlFiles(projectDir) {
  // dist/
  const distDir = path.join(projectDir, 'dist');
  if (fs.existsSync(distDir) && fs.statSync(distDir).isDirectory()) {
    const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html')).map(f => path.join(distDir, f));
    if (files.length > 0) return files.sort();
  }
  // root-level
  return fs.readdirSync(projectDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(projectDir, f))
    .sort();
}

// ── CLI ──────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node anti-template.js <project-dir> [--threshold N] [--json]

Checks HTML pages for template-like design signals.
Scores the project on uniqueness (0-100%).

Arguments:
  <project-dir>     Path to project directory (required)
  --threshold N     Minimum uniqueness score for PASS (default: 50)
  --json            Output as JSON

Exit codes:
  0 = PASS (uniqueness >= threshold)
  1 = FAIL (too template-like, uniqueness < threshold)`);
    process.exit(0);
  }

  const projectDir = path.resolve(args[0]);
  const jsonMode = args.includes('--json');
  const thrIdx = args.indexOf('--threshold');
  const threshold = thrIdx !== -1 && thrIdx + 1 < args.length ? parseFloat(args[thrIdx + 1]) : 50;

  if (!fs.existsSync(projectDir)) {
    console.error('Error: Project directory not found: ' + projectDir);
    process.exit(1);
  }

  const result = runAntiTemplate(projectDir, threshold);

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    const icon = result.passed ? '✅' : '❌';
    console.log('═══════════════════════════════════════════');
    console.log('  ANTI-TEMPLATE QA');
    console.log('═══════════════════════════════════════════');
    console.log('  Project: ' + path.basename(projectDir));
    console.log('  Uniqueness: ' + result.score + '% (threshold: ' + threshold + '%)');
    console.log('  Result: ' + (result.passed ? 'PASS ' + icon : 'FAIL ' + icon));
    console.log('  ─────────────────────────────────────');
    console.log('  Template signals detected:');
    console.log('');

    let detectedCount = 0;
    for (const r of result.signals) {
      if (r.detected) {
        detectedCount++;
        console.log('  ⚠️  [' + r.signal + '] ' + r.desc + ' (weight: ' + (r.weight * 100) + '%)');
      }
    }

    if (detectedCount === 0) {
      console.log('  ✅ No template signals — design is individual');
    } else {
      console.log('');
      console.log('  ' + detectedCount + ' template signal(s) found.');
      console.log('  Fix: add distinctive motifs, change hero composition,');
      console.log('  use non-default fonts, vary section padding.');
    }

    console.log('');
  }

  process.exit(result.passed ? 0 : 1);
}

module.exports = { runAntiTemplate, SIGNALS };