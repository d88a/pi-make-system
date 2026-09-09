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
  // ── STRUCTURAL template signals (high weight) ──
  {
    id: 'forbidden-skeleton',
    weight: 1.5,
    desc: 'NAV→HERO→FEATURES(griD)→CTA→FOOTER skeleton (forbidden)',
    detect: (html) => {
      // Count <section> elements
      const sectionCount = (html.match(/<section\s/g) || []).length;
      // Check if the page has exactly 2-3 sections (hero + features + cta)
      // And check for the classic pattern markers
      const hasShortStructure = sectionCount <= 3;
      const hasHero = /(?:min-h-\[?8|min-h-screen|hero)/i.test(html);
      const hasStandardCTA = /(?:Get Started|Start Free|Ready to|начните|записаться)/i.test(html) && /bg-\[?(?:#[a-f0-9]+|indigo|slate|var\(--color)/i.test(html);
      // Detect "3 cards in a row" pattern
      const gridCols3 = /grid-cols-(?:1|2|3)\s+(?:md:grid-cols-3|lg:grid-cols-3)/i.test(html) ||
                         /grid-cols-3/.test(html);
      return hasShortStructure && hasHero && gridCols3 && hasStandardCTA;
    }
  },
  {
    id: 'all-centered-sections',
    weight: 1.2,
    desc: 'All sections are centered (text-center + flex-col + items-center)',
    detect: (html) => {
      const sections = html.split(/<section\s/g).slice(1);
      if (sections.length < 2) return false;
      const centeredSections = sections.filter(s =>
        /text-center/.test(s) && /items-center/.test(s)
      );
      return centeredSections.length >= sections.length * 0.8;
    }
  },
  // ── CONTENT structure signals ──
  {
    id: 'only-2-content-types',
    weight: 1.0,
    desc: 'Only 2 types of content sections (features + cta) — no variety',
    detect: (html) => {
      const sections = html.split(/<section\s/g).slice(1);
      // Check if sections are very similar (same class patterns)
      if (sections.length <= 2) return true;
      const sectionClasses = sections.map(s => {
        const m = s.match(/class="([^"]{0,80})"/);
        return m ? m[1] : '';
      }).filter(Boolean);
      const unique = [...new Set(sectionClasses.map(c => c.replace(/py-\d+|px-\d+/g, '').trim()))];
      return unique.length <= 2 && sections.length >= 2;
    }
  },
  {
    id: 'inter-display',
    weight: 0.8,
    desc: 'Inter as display font',
    detect: (html) => {
      const hasInterDisplay = /(?:font-family|fontFamily)[^}]*['"]Inter['"]/i.test(html);
      const hasOtherDisplay = /(?:font-family|fontFamily)[^}]*['"](?!Inter['"])[A-Z][a-z]+(?: [A-Z][a-z]+)*['"]/i.test(html);
      return hasInterDisplay && !hasOtherDisplay;
    }
  },
  {
    id: 'centered-hero',
    weight: 0.8,
    desc: 'Centered hero (text-center + items-center, no split/asymmetry)',
    detect: (html) => {
      const firstSection = html.match(/<section[^>]*>([\s\S]*?)(?=<section|\/body)/i);
      if (!firstSection) return false;
      const section = firstSection[1] || firstSection[0];
      return /text-center/.test(section) &&
             /items-center/.test(section) &&
             !/md:grid-cols-2|md:flex-row|lg:grid-cols-[3-9]|absolute.*inset-0|min-h-screen/.test(section);
    }
  },
  {
    id: 'rounded-md-buttons',
    weight: 0.6,
    desc: 'Every button = rounded-md (default AI pattern)',
    detect: (html) => {
      const buttons = html.match(/<button[^>]*class="([^"]*rounded[^"]*)"[^>]*>/gi) || [];
      if (buttons.length === 0) return false;
      const roundedMd = buttons.filter(b => /rounded-md/.test(b) && !/rounded-lg|rounded-xl|rounded-2xl|rounded-full|rounded-none/.test(b));
      return roundedMd.length > 0 && roundedMd.length === buttons.length;
    }
  },
  {
    id: 'same-section-padding',
    weight: 0.6,
    desc: 'Every section has identical vertical padding',
    detect: (html) => {
      const pyPatterns = html.match(/py-(?:16|20|24|28|32|36)\b/g) || [];
      if (pyPatterns.length < 3) return false;
      const unique = [...new Set(pyPatterns)];
      return unique.length <= 1;
    }
  },
  {
    id: 'no-distinctive-motif',
    weight: 1.0,
    desc: 'Zero visual motifs — no signature element whatsoever',
    detect: (html) => {
      const hasGiantType = /text-(?:7|8|9)xl|text-\[(?:6[4-9]|[7-9]\d|\d{3})px\]/.test(html);
      const hasAsymmetry = /col-span-(?:[2-9]|1[0-9])|md:grid-cols-5/.test(html);
      const hasFullBleed = /h-screen|min-h-screen|absolute inset-0/.test(html);
      const hasAnimation = /animate-|@keyframes|transform transition/.test(html);
      const hasColorAccent = /from-\[|to-\[|via-\[|bg-gradient/.test(html);
      const hasNonFeatureSection = (html.match(/<(?:details|form|blockquote|pre|code)\s/g) || []).length > 2;
      return !hasGiantType && !hasAsymmetry && !hasFullBleed && !hasAnimation && !hasColorAccent && !hasNonFeatureSection;
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
  --threshold N     Minimum uniqueness score for PASS (default: 60)
  --json            Output as JSON

Exit codes:
  0 = PASS (uniqueness >= threshold)
  1 = FAIL (too template-like, uniqueness < threshold)`);
    process.exit(0);
  }

  const projectDir = path.resolve(args[0]);
  const jsonMode = args.includes('--json');
  const thrIdx = args.indexOf('--threshold');
  const threshold = thrIdx !== -1 && thrIdx + 1 < args.length ? parseFloat(args[thrIdx + 1]) : 60;

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