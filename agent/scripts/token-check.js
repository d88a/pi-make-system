#!/usr/bin/env node

/**
 * token-check.js — Design Token Compliance Checker for Pi Make System
 *
 * Verifies that HTML files adhere to the project's design-token system:
 *
 *   1. Hardcoded hex colors outside `:root` blocks → violation
 *      (colors must be declared in `:root` and referenced via `var(--color-*)`)
 *   2. Tailwind arbitrary color values (`text-[#...]`, `bg-[#...]`) → violation
 *   3. Hardcoded radius via arbitrary values (`rounded-[12px]`) → violation
 *      (should use token presets `rounded-sm/md/lg/xl`)
 *
 * Usage:
 *   node token-check.js projects/maksplit/dist/*.html
 *   node token-check.js projects/maksplit/dist
 *   node token-check.js --help
 *
 * Exit code: 0 = no violations, 1 = violations found.
 *
 * Dependencies: none (fs, path only).
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── Constants ────────────────────────────────────────────────────────────────

/** Hex color regex — matches #RGB, #RGBA, #RRGGBB, #RRGGBBAA. */
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;

/** Valid hex digit lengths (excluding the leading '#'): 3, 4, 6, 8. */
const VALID_HEX_LEN = new Set([3, 4, 6, 8]);

/** Selector-looking line inside a <style> block: `.foo {` or `#bar {`. */
const CSS_SELECTOR_RE = /^([.#][\w-]+[^{}]*)\s*\{/;

/** Tailwind arbitrary value for radius: rounded-[...]. */
const RADIUS_RE = /rounded-\[[^\]]*\]/g;

/** Tailwind arbitrary color utility: any `-[#...]` inside brackets. */
const ARBITRARY_COLOR_RE = /(?:text|bg|border|ring|from|to|via|fill|stroke|shadow|outline|decoration|accent|caret)-\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/;

// ── Glob expansion ───────────────────────────────────────────────────────────

/**
 * Convert a forward-slash glob pattern into a RegExp.
 * Supports `**`, `*`, `?`, and `[...]` character classes.
 *
 * @param {string} glob - Normalized (forward-slash) glob pattern.
 * @returns {RegExp} Anchored regular expression.
 */
function globToRegex(glob) {
  let out = '';
  let i = 0;
  while (i < glob.length) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // `**` crosses directory boundaries
        out += '.*';
        i += 2;
        if (glob[i] === '/') i += 1;
      } else {
        out += '[^/]*';
        i += 1;
      }
    } else if (c === '?') {
      out += '[^/]';
      i += 1;
    } else if (c === '[') {
      const close = glob.indexOf(']', i);
      if (close !== -1) {
        out += glob.slice(i, close + 1);
        i = close + 1;
      } else {
        out += '\\[';
        i += 1;
      }
    } else {
      out += c.replace(/[.+^${}()|\\]/g, '\\$&');
      i += 1;
    }
  }
  return new RegExp('^' + out + '$');
}

/**
 * Recursively walk a directory, invoking a callback for each file.
 *
 * @param {string} dir - Directory to walk.
 * @param {(filePath: string) => void} cb - Callback for each file.
 */
function walk(dir, cb) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_err) {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, cb);
    } else if (entry.isFile()) {
      cb(full);
    }
  }
}

/**
 * Expand a CLI argument (literal path, directory, or glob) into HTML files.
 *
 * @param {string} arg - Raw CLI argument.
 * @returns {string[]} Absolute paths to .html files.
 */
function resolveFiles(arg) {
  const normArg = arg.replace(/\\/g, '/');
  const hasMagic = /[*?[\]]/.test(normArg);

  if (hasMagic) {
    // Determine base directory: everything before the first magic segment.
    const abs = path.resolve(arg);
    const absNorm = abs.replace(/\\/g, '/');
    const segments = absNorm.split('/');
    const baseSegs = [];
    for (const seg of segments) {
      if (/[*?[\]]/.test(seg)) break;
      baseSegs.push(seg);
    }
    let baseDir = baseSegs.join('/');
    if (!baseDir || baseDir === segments[0]) baseDir = '/';
    if (baseDir === '/') baseDir = path.parse(abs).root;

    const regex = globToRegex(absNorm);
    const matches = [];
    walk(path.resolve(baseDir) === abs ? baseDir : baseDir, (file) => {
      if (regex.test(file.replace(/\\/g, '/'))) matches.push(file);
    });
    return matches.filter((f) => f.toLowerCase().endsWith('.html')).sort();
  }

  const abs = path.resolve(arg);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    const matches = [];
    walk(abs, (file) => {
      if (file.toLowerCase().endsWith('.html')) matches.push(file);
    });
    return matches.sort();
  }
  if (abs.toLowerCase().endsWith('.html')) return [abs];
  return [];
}

// ── Token lookup (optional, best-effort) ─────────────────────────────────────

/**
 * Read and cache design-tokens.json discovered upward from an HTML file.
 * Used to reverse-map hex values back to token names for `expected` hints.
 *
 * @param {string} htmlFile - Path to an HTML file.
 * @returns {Object|null} Parsed tokens or null.
 */
const tokensCache = new Map();
function loadTokens(htmlFile) {
  let dir = path.dirname(htmlFile);
  for (let i = 0; i < 6; i += 1) {
    const candidate = path.join(dir, 'design-tokens.json');
    if (tokensCache.has(candidate)) return tokensCache.get(candidate);
    if (fs.existsSync(candidate)) {
      try {
        const tokens = JSON.parse(fs.readFileSync(candidate, 'utf-8'));
        tokensCache.set(candidate, tokens);
        return tokens;
      } catch (_err) {
        tokensCache.set(candidate, null);
        return null;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

/**
 * Reverse-map a hex value to a `var(--color-*)` token name.
 *
 * @param {string} hex - Hex string (with leading '#').
 * @param {Object|null} tokens - design-tokens.json content.
 * @returns {string} A suggested `var(--*)` reference.
 */
function suggestColor(hex, tokens) {
  if (tokens && tokens.colors) {
    const lower = hex.toLowerCase();
    for (const [name, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'string' && value.toLowerCase() === lower) {
        // Strip a leading 'color-' prefix if present (colors map already keyed plainly)
        return 'var(--color-' + name.replace(/^color-/, '') + ')';
      }
    }
  }
  // Generic fallback — pick a plausible slot.
  return 'var(--color-primary)';
}

// ── Core checks ─────────────────────────────────────────────────────────────

/**
 * Compute line ranges (0-indexed, inclusive) of every `:root { ... }` block.
 *
 * @param {string[]} lines - File content split by line.
 * @returns {Array<{start: number, end: number}>} Ranges of :root blocks.
 */
function findRootBlocks(lines) {
  const ranges = [];
  for (let i = 0; i < lines.length; i += 1) {
    const rootIdx = lines[i].indexOf(':root');
    if (rootIdx === -1) continue;
    const braceIdx = lines[i].indexOf('{', rootIdx);
    if (braceIdx === -1) continue;

    let depth = 0;
    for (let j = braceIdx; j < lines[i].length; j += 1) {
      if (lines[i][j] === '{') depth += 1;
      else if (lines[i][j] === '}') depth -= 1;
    }
    let end = i;
    while (depth > 0 && end < lines.length - 1) {
      end += 1;
      const line = lines[end];
      for (let j = 0; j < line.length; j += 1) {
        if (line[j] === '{') depth += 1;
        else if (line[j] === '}') depth -= 1;
      }
    }
    ranges.push({ start: i, end });
  }
  return ranges;
}

/**
 * Determine whether a line index falls within any :root block range.
 *
 * @param {number} lineIndex - 0-indexed line number.
 * @param {Array<{start: number, end: number}>} ranges - :root ranges.
 * @returns {boolean}
 */
function isInRoot(lineIndex, ranges) {
  return ranges.some((r) => lineIndex >= r.start && lineIndex <= r.end);
}

/**
 * Best-effort CSS/element selector for a hex occurrence.
 * Looks for `class="..."`/`id="..."` on the same line, else the nearest
 * preceding CSS selector line inside a <style> block.
 *
 * @param {string[]} lines - All lines.
 * @param {string} line - The line containing the hex.
 * @param {number} lineIndex - 0-indexed line number.
 * @returns {string} Selector hint (or 'unknown').
 */
function extractSelector(lines, line, lineIndex) {
  const classMatch = line.match(/(?:class|id)=["']([^"']+)["']/);
  if (classMatch) return classMatch[1].trim();

  // Search backwards for a CSS selector line.
  for (let j = lineIndex - 1; j >= Math.max(0, lineIndex - 25); j -= 1) {
    const m = lines[j].match(CSS_SELECTOR_RE);
    if (m) return m[1].trim();
  }
  return 'unknown';
}

/**
 * Check a list of HTML files for token violations.
 *
 * @param {string[]} files - Absolute paths to HTML files.
 * @returns {{ violations: Array, checked: number }}
 */
function checkFiles(files) {
  const violations = [];

  for (const file of files) {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split(/\r?\n/);
    const rootRanges = findRootBlocks(lines);
    const tokens = loadTokens(file);

    // Track the number of var(--...) usages for the summary.
    const varUsages = (content.match(/var\(--[\w-]+\)/g) || []).length;

    // ── 1. Hardcoded hex colors (outside :root) ───────────────────────
    HEX_RE.lastIndex = 0;
    let hexMatch;
    while ((hexMatch = HEX_RE.exec(content)) !== null) {
      const hex = hexMatch[0];
      const len = hex.length - 1; // minus '#'
      if (!VALID_HEX_LEN.has(len)) continue;

      // Locate line number for this occurrence.
      const offset = hexMatch.index;
      const lineIndex = content.slice(0, offset).split('\n').length - 1;
      const line = lines[lineIndex] || '';

      // Tokens declared inside :root are allowed.
      if (isInRoot(lineIndex, rootRanges)) continue;

      const inArbitrary = /\[[^\]]*#[0-9a-fA-F]{3,8}[^\]]*\]/.test(line);

      if (inArbitrary) {
        violations.push({
          file: name,
          line: lineIndex + 1,
          selector: extractSelector(lines, line, lineIndex),
          problem: 'Tailwind arbitrary color value',
          expected: suggestColor(hex, tokens),
          actual: hex,
          fix: 'Заменить ' + hex + ' на ' + suggestColor(hex, tokens) +
            ' (или соответствующий токен из design-tokens.json)',
        });
      } else if (ARBITRARY_COLOR_RE.test(line)) {
        violations.push({
          file: name,
          line: lineIndex + 1,
          selector: extractSelector(lines, line, lineIndex),
          problem: 'Tailwind arbitrary color value',
          expected: suggestColor(hex, tokens),
          actual: hex,
          fix: 'Заменить arbitrary value на var(--color-*)',
        });
      } else {
        violations.push({
          file: name,
          line: lineIndex + 1,
          selector: extractSelector(lines, line, lineIndex),
          problem: 'Hardcoded hex',
          expected: suggestColor(hex, tokens),
          actual: hex,
          fix: 'Объявить цвет в :root и использовать ' + suggestColor(hex, tokens),
        });
      }
    }

    // ── 2. Hardcoded radius (rounded-[...]) ────────────────────────────
    RADIUS_RE.lastIndex = 0;
    let radiusMatch;
    while ((radiusMatch = RADIUS_RE.exec(content)) !== null) {
      const offset = radiusMatch.index;
      const lineIndex = content.slice(0, offset).split('\n').length - 1;
      const line = lines[lineIndex] || '';
      const raw = radiusMatch[0];

      violations.push({
        file: name,
        line: lineIndex + 1,
        selector: extractSelector(lines, line, lineIndex),
        problem: 'Hardcoded radius',
        expected: 'rounded-md / rounded-xl (token preset)',
        actual: raw,
        fix: 'Заменить ' + raw + ' на токен-пресет: rounded-sm | rounded-md | rounded-lg | rounded-xl',
      });
    }

    if (violations.length === 0 && varUsages === 0 && content.includes('<')) {
      // Informational only — no hard failure, but flag zero token usage.
      // Kept silent to avoid noise; tokens may legitimately be absent.
    }
  }

  return { violations, checked: files.length };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

/**
 * Print the module's help text.
 */
function printHelp() {
  console.log(`Usage: node token-check.js <files-or-dirs...>

Checks HTML files for design-token compliance.

Arguments:
  <html-file>       A single HTML file
  <directory>       All .html files under a directory (recursive)
  <glob pattern>    e.g. projects/maksplit/dist/*.html

Exit codes:
  0 — No violations found
  1 — Violations found`);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // Collect files from all args, deduplicated.
  const seen = new Set();
  const files = [];
  for (const arg of args) {
    for (const f of resolveFiles(arg)) {
      if (!seen.has(f)) {
        seen.add(f);
        files.push(f);
      }
    }
  }

  if (files.length === 0) {
    console.log('No HTML files found.');
    process.exit(0);
  }

  const { violations, checked } = checkFiles(files);

  // ── Output ───────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════');
  console.log('  Design Token Compliance Report');
  console.log('═══════════════════════════════════════════');
  console.log(`  Files checked: ${checked}`);
  console.log(`  Violations:    ${violations.length}`);
  console.log('═══════════════════════════════════════════');

  if (violations.length > 0) {
    console.log('');
    for (const v of violations) {
      console.log(`  ❌ ${v.file}:${v.line} (${v.selector})`);
      console.log(`     problem:  ${v.problem}`);
      console.log(`     expected: ${v.expected}`);
      console.log(`     actual:   ${v.actual}`);
      console.log(`     fix:      ${v.fix}`);
      console.log('');
    }
  }

  if (violations.length === 0) {
    console.log('\nPASS: No token violations found.');
    process.exit(0);
  } else {
    console.log(`FAIL: ${violations.length} token violation(s) found.`);
    process.exit(1);
  }
}

module.exports = { checkFiles, resolveFiles, findRootBlocks, HEX_RE };