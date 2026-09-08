#!/usr/bin/env node

/**
 * build.js — SSOT Component Assembler for Pi Make System
 *
 * Reads HTML pages from pages/, finds <!-- @component name --> markers,
 * substitutes content from shared/components/name.html, and writes results
 * to dist/. Also supports <!-- @include path/to/file.html --> for arbitrary
 * includes.
 *
 * Usage:
 *   node build.js <project-dir> [--watch] [--dry-run]
 *
 * Example:
 *   node build.js projects/maksplit
 *   node build.js projects/maksplit --dry-run
 *   node build.js projects/maksplit --watch
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Types (JSDoc)
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} BuildResult
 * @property {string} page - Page name (e.g. "home.html")
 * @property {string[]} components - Components used in this page
 * @property {string[]} includes - Arbitrary includes used in this page
 * @property {string[]} missing - Components/includes not found
 */

/**
 * @typedef {Object} BuildSummary
 * @property {string} projectDir
 * @property {number} pagesBuilt
 * @property {number} totalPages
 * @property {string[]} allComponentsUsed
 * @property {string[]} allIncludesUsed
 * @property {BuildResult[]} results
 */

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/** Regex for @component markers: <!-- @component name --> */
const COMPONENT_RE = /<!--\s*@component\s+(\S+)\s*-->/g;

/** Regex for @include markers: <!-- @include path/to/file.html --> */
const INCLUDE_RE = /<!--\s*@include\s+(\S+)\s*-->/g;

/**
 * Load all component HTML files from shared/components/ into a Map.
 *
 * @param {string} componentsDir - Absolute path to shared/components/
 * @returns {Map<string, string>} Map of component name → HTML content
 */
function loadComponents(componentsDir) {
  /** @type {Map<string, string>} */
  const components = new Map();

  if (!fs.existsSync(componentsDir)) {
    return components;
  }

  const entries = fs.readdirSync(componentsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const name = entry.name.replace(/\.html$/, '');
      const filePath = path.join(componentsDir, entry.name);
      components.set(name, fs.readFileSync(filePath, 'utf-8').trim());
    }
  }

  return components;
}

/**
 * Find all markers in a string using a regex, deduplicated.
 *
 * @param {string} content - Page content
 * @param {RegExp} regex - Marker regex (must have capture group 1)
 * @returns {string[]} Unique marker values
 */
function findMarkers(content, regex) {
  const matches = new Set();
  let match;
  const re = new RegExp(regex.source, regex.flags);
  while ((match = re.exec(content)) !== null) {
    matches.add(match[1]);
  }
  return [...matches];
}

/**
 * Replace @component markers in content with actual component HTML.
 *
 * @param {string} content - Page HTML content
 * @param {Map<string, string>} components - Loaded components
 * @returns {{ result: string, used: string[], missing: string[] }}
 */
function replaceComponents(content, components) {
  const used = [];
  const missing = [];
  const re = new RegExp(COMPONENT_RE.source, COMPONENT_RE.flags);

  const result = content.replace(re, (fullMatch, name) => {
    const html = components.get(name);
    if (html !== undefined) {
      used.push(name);
      return html;
    }
    missing.push(name);
    console.warn(`  ⚠  Component "${name}" not found — marker left as-is`);
    return fullMatch;
  });

  return { result, used, missing };
}

/**
 * Replace @include markers in content with actual file content.
 *
 * @param {string} content - Page HTML content
 * @param {string} projectDir - Absolute path to project root
 * @returns {{ result: string, used: string[], missing: string[] }}
 */
function replaceIncludes(content, projectDir) {
  const used = [];
  const missing = [];
  const re = new RegExp(INCLUDE_RE.source, INCLUDE_RE.flags);

  const result = content.replace(re, (fullMatch, includePath) => {
    const resolved = path.resolve(projectDir, includePath);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
      used.push(includePath);
      return fs.readFileSync(resolved, 'utf-8').trim();
    }
    missing.push(includePath);
    console.warn(`  ⚠  Include "${includePath}" not found — marker left as-is`);
    return fullMatch;
  });

  return { result, used, missing };
}

/**
 * Build a single page: replace @component and @include markers.
 *
 * @param {string} pagePath - Absolute path to page HTML file
 * @param {string} pageName - File name (e.g. "home.html")
 * @param {Map<string, string>} components - Loaded components
 * @param {string} projectDir - Absolute path to project root
 * @returns {{ buildResult: BuildResult, content: string }}
 */
function buildPage(pagePath, pageName, components, projectDir) {
  let content = fs.readFileSync(pagePath, 'utf-8');

  // Step 1: replace @component markers
  const compResult = replaceComponents(content, components);
  content = compResult.result;

  // Step 2: replace @include markers (in already-substituted content,
  // so components can contain @include too)
  const inclResult = replaceIncludes(content, projectDir);
  content = inclResult.result;

  return {
    buildResult: {
      page: pageName,
      components: compResult.used,
      includes: inclResult.used,
      missing: [...compResult.missing, ...inclResult.missing],
    },
    content,
  };
}

/**
 * Write the built page to dist/.
 *
 * @param {string} distDir - Absolute path to dist/
 * @param {string} pageName - File name
 * @param {string} content - Built HTML content
 */
function writePage(distDir, pageName, content) {
  const outPath = path.join(distDir, pageName);
  fs.writeFileSync(outPath, content, 'utf-8');
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Main build function.
 *
 * @param {string} projectDir - Absolute path to the project directory
 * @param {Object} options
 * @param {boolean} [options.dryRun=false] - Print what would be built, no writes
 * @returns {BuildSummary}
 */
function build(projectDir, options = {}) {
  const { dryRun = false } = options;

  const pagesDir = path.join(projectDir, 'pages');
  const componentsDir = path.join(projectDir, 'shared', 'components');
  const distDir = path.join(projectDir, 'dist');

  // --- Validation ---
  if (!fs.existsSync(pagesDir) || !fs.statSync(pagesDir).isDirectory()) {
    throw new Error(`pages/ directory not found: ${pagesDir}`);
  }

  if (!fs.existsSync(componentsDir) || !fs.statSync(componentsDir).isDirectory()) {
    throw new Error(`shared/components/ directory not found: ${componentsDir}`);
  }

  // --- Load components ---
  const components = loadComponents(componentsDir);
  console.log(`Loaded ${components.size} component(s) from shared/components/`);

  // --- Collect page files ---
  const pageFiles = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.html'))
    .sort();

  if (pageFiles.length === 0) {
    console.warn('No .html files found in pages/');
    return {
      projectDir,
      pagesBuilt: 0,
      totalPages: 0,
      allComponentsUsed: [],
      allIncludesUsed: [],
      results: [],
    };
  }

  // --- Create dist/ (unless dry-run) ---
  if (!dryRun && !fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // --- Build each page ---
  /** @type {BuildResult[]} */
  const results = [];

  for (const pageName of pageFiles) {
    const pagePath = path.join(pagesDir, pageName);
    console.log(`Building ${pageName}...`);

    const { buildResult: result, content: finalContent } = buildPage(pagePath, pageName, components, projectDir);
    results.push(result);

    if (!dryRun) {
      writePage(distDir, pageName, finalContent);
      console.log(`  → dist/${pageName} (${result.components.length} components, ${result.includes.length} includes)`);
    } else {
      console.log(`  [DRY-RUN] would write dist/${pageName}`);
      console.log(`  Components: ${result.components.join(', ') || '(none)'}`);
      if (result.includes.length > 0) {
        console.log(`  Includes: ${result.includes.join(', ')}`);
      }
    }

    if (result.missing.length > 0) {
      console.warn(`  Missing: ${result.missing.join(', ')}`);
    }
  }

  // --- Summary ---
  const allComponentsUsed = [...new Set(results.flatMap(r => r.components))].sort();
  const allIncludesUsed = [...new Set(results.flatMap(r => r.includes))].sort();

  const summary = {
    projectDir,
    pagesBuilt: results.filter(r => r.missing.length === 0).length,
    totalPages: results.length,
    allComponentsUsed,
    allIncludesUsed,
    results,
  };

  console.log('');
  console.log('='.repeat(60));
  console.log(`Build complete: ${summary.pagesBuilt}/${summary.totalPages} page(s) built successfully`);
  console.log(`Components used: ${allComponentsUsed.join(', ') || '(none)'}`);
  if (allIncludesUsed.length > 0) {
    console.log(`Includes used: ${allIncludesUsed.join(', ')}`);
  }
  if (dryRun) {
    console.log('[DRY-RUN] No files were written');
  }
  console.log('='.repeat(60));

  return summary;
}

// ---------------------------------------------------------------------------
// Watch mode
// ---------------------------------------------------------------------------

/**
 * Watch project for changes and rebuild automatically.
 *
 * @param {string} projectDir - Absolute path to the project directory
 */
function watch(projectDir) {
  const pagesDir = path.join(projectDir, 'pages');
  const componentsDir = path.join(projectDir, 'shared', 'components');

  console.log(`Watching for changes in ${projectDir}...`);
  console.log('Press Ctrl+C to stop.\n');

  // Initial build
  build(projectDir);

  /**
   * Debounced rebuild trigger.
   * @type {NodeJS.Timeout | null}
   */
  let timeout = null;

  /**
   * @param {string} eventType
   * @param {string} filename
   */
  function handleChange(eventType, filename) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      console.log(`\n[${new Date().toLocaleTimeString()}] Change detected: ${filename}`);
      try {
        build(projectDir);
      } catch (err) {
        console.error(`Build error: ${err.message}`);
      }
    }, 200); // 200ms debounce
  }

  if (fs.existsSync(pagesDir)) {
    fs.watch(pagesDir, { recursive: true }, handleChange);
  }
  if (fs.existsSync(componentsDir)) {
    fs.watch(componentsDir, { recursive: true }, handleChange);
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node build.js <project-dir> [--watch] [--dry-run]');
    console.log('');
    console.log('Options:');
    console.log('  --watch    Watch for changes and rebuild automatically');
    console.log('  --dry-run  Show what would be built, without writing files');
    console.log('');
    console.log('Example:');
    console.log('  node build.js projects/maksplit');
    console.log('  node build.js projects/maksplit --dry-run');
    console.log('  node build.js projects/maksplit --watch');
    process.exit(0);
  }

  const projectDir = path.resolve(args[0]);
  const isWatch = args.includes('--watch');
  const isDryRun = args.includes('--dry-run');

  try {
    if (isWatch) {
      watch(projectDir);
    } else {
      const summary = build(projectDir, { dryRun: isDryRun });
      if (summary.pagesBuilt < summary.totalPages) {
        process.exit(1);
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { build, watch, loadComponents, replaceComponents, replaceIncludes, buildPage };