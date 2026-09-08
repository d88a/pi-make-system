#!/usr/bin/env node

/**
 * link-check.js — Link Validator for Pi Make System
 *
 * Scans HTML files for broken / missing / stub links:
 *
 *   1. Internal links (`<a href="page.html">`) — verify file exists
 *   2. Anchor links (`<a href="#section">`) — verify `id="section"` exists
 *   3. Stub links (`<a href="#">`) — violation
 *   4. Empty links (`<a href="">`) — violation
 *   5. External links (`<a href="https://...">`) — optional HEAD request
 *
 * Usage:
 *   node link-check.js projects/maksplit/dist/*.html
 *   node link-check.js projects/maksplit/dist --check-external
 *   node link-check.js --help
 *
 * Exit code: 0 = no broken links, 1 = broken links found.
 *
 * Dependencies: none (fs, path, http/https — all built-in).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ── Glob expansion (shared with token-check.js) ─────────────────────────────

/**
 * Convert a forward-slash glob pattern into a RegExp.
 *
 * @param {string} glob - Normalized (forward-slash) glob pattern.
 * @returns {RegExp}
 */
function globToRegex(glob) {
  let out = '';
  let i = 0;
  while (i < glob.length) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
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
 * Recursively walk a directory.
 *
 * @param {string} dir
 * @param {(filePath: string) => void} cb
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
 * Expand a CLI argument into HTML file paths.
 *
 * @param {string} arg
 * @returns {string[]}
 */
function resolveFiles(arg) {
  const normArg = arg.replace(/\\/g, '/');
  const hasMagic = /[*?[\]]/.test(normArg);

  if (hasMagic) {
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

// ── Link extraction ─────────────────────────────────────────────────────────

/** Extract `<a href="...">` with line number. */
const A_HREF_RE = /<a\s[^>]*?\bhref\s*=\s*["']([^"']*)["'][^>]*>/gi;

/**
 * Extract all link references from HTML content.
 *
 * @param {string} content - Full HTML.
 * @returns {Array<{href: string, line: number, text: string}>}
 */
function extractLinks(content) {
  const links = [];
  A_HREF_RE.lastIndex = 0;
  let match;
  while ((match = A_HREF_RE.exec(content)) !== null) {
    const href = match[1];
    const offset = match.index;
    const line = content.slice(0, offset).split('\n').length;
    const text = match[0].replace(/<[^>]*>/g, '').trim().slice(0, 60);
    links.push({ href, line, text });
  }
  return links;
}

/**
 * Collect all `id="..."` values from HTML content.
 *
 * @param {string} content - Full HTML.
 * @returns {Set<string>}
 */
function collectIds(content) {
  const ids = new Set();
  const idRe = /\bid\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = idRe.exec(content)) !== null) {
    ids.add(match[1]);
  }
  return ids;
}

// ── External check (optional) ───────────────────────────────────────────────

/**
 * Send a HEAD request to an external URL.
 *
 * @param {string} url
 * @returns {Promise<number>} HTTP status code, or -1 on error.
 */
function headRequest(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      res.resume();
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(-1));
    req.on('timeout', () => { req.destroy(); resolve(-1); });
    req.end();
  });
}

// ── Core checker ────────────────────────────────────────────────────────────

/**
 * Compute the common ancestor directory of a set of files.
 * Used as the project root for resolving root-absolute paths (`/foo`).
 *
 * @param {string[]} files
 * @returns {string}
 */
function commonAncestor(files) {
  if (files.length === 0) return process.cwd();
  const dirs = files.map((f) => path.dirname(f).split(path.sep));
  let common = dirs[0];
  for (let i = 1; i < dirs.length; i += 1) {
    const d = dirs[i];
    let j = 0;
    while (j < common.length && j < d.length && common[j] === d[j]) j += 1;
    common = common.slice(0, j);
  }
  return common.join(path.sep) || path.parse(files[0]).root;
}

/**
 * Check whether a base path resolves to a real file, trying `.html` and
 * `/index.html` variants (covers clean URLs like `/catalog` → `catalog.html`).
 *
 * @param {string} basePath
 * @returns {string|null} The resolved existing path, or null.
 */
function fileExistsVariants(basePath) {
  const candidates = [
    basePath,
    basePath + '.html',
    path.join(basePath, 'index.html'),
  ];
  for (const c of candidates) {
    try {
      if (fs.statSync(c).isFile()) return c;
    } catch (_err) {
      // continue
    }
  }
  return null;
}

/**
 * Resolve an internal link path (relative or root-absolute) to a filesystem path.
 *
 * @param {string} linkPath - The path portion of the href (no fragment/query).
 * @param {string} dir - Directory of the linking file.
 * @param {string} projectRoot - Common ancestor of all checked files.
 * @returns {string}
 */
function resolveInternal(linkPath, dir, projectRoot) {
  if (linkPath.startsWith('/')) {
    return path.join(projectRoot, linkPath.slice(1));
  }
  return path.resolve(dir, linkPath || '');
}

/**
 * @typedef {Object} LinkViolation
 * @property {string} file
 * @property {number} line
 * @property {string} problem
 * @property {string} href
 * @property {string} [fix]
 */

/**
 * Check a list of HTML files for broken/missing links.
 *
 * @param {string[]} files - Absolute paths to HTML files.
 * @param {Object} options
 * @param {boolean} [options.checkExternal=false] - Enables HEAD requests.
 * @returns {Promise<{ violations: LinkViolation[], checked: number, externalChecked: number }>}
 */
async function checkLinks(files, options = {}) {
  const { checkExternal = false } = options;
  const violations = [];

  // Build a quick set of all known file paths (relative to their dirs).
  // For internal link resolution, look relative to the linking file's directory.
  const knownFiles = new Set(files.map((f) => f.toLowerCase()));

  // Project root: common ancestor of all checked files (for root-absolute paths).
  const projectRoot = commonAncestor(files);

  // Cache per-file IDs for anchor resolution.
  /** @type {Map<string, Set<string>>} */
  const fileIds = new Map();
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    fileIds.set(file, collectIds(content));
  }

  let externalChecked = 0;

  for (const file of files) {
    const name = path.basename(file);
    const dir = path.dirname(file);
    const content = fs.readFileSync(file, 'utf-8');
    const links = extractLinks(content);

    for (const link of links) {
      const { href, line, text } = link;

      // ── Empty href ─────────────────────────────────────────────────
      if (href === '') {
        violations.push({
          file: name,
          line,
          problem: 'Empty link',
          href,
          fix: 'Указать корректный href или удалить ссылку',
        });
        continue;
      }

      // ── Stub href="#" ─────────────────────────────────────────────
      if (href === '#') {
        violations.push({
          file: name,
          line,
          problem: 'Stub link (href="#")',
          href,
          fix: 'Заменить на реальный href или убрать ссылку',
        });
        continue;
      }

      // ── Anchor: href="#section" ───────────────────────────────────
      if (href.startsWith('#')) {
        const anchorId = href.slice(1);
        const ids = fileIds.get(file);
        if (!ids || !ids.has(anchorId)) {
          violations.push({
            file: name,
            line,
            problem: 'Broken anchor — id not found on page',
            href,
            fix: 'Добавить id="' + anchorId + '" на целевой элемент или исправить ссылку',
          });
        }
        continue;
      }

      // ── External ──────────────────────────────────────────────────
      if (href.startsWith('http://') || href.startsWith('https://')) {
        if (checkExternal) {
          const status = await headRequest(href);
          externalChecked += 1;
          if (status < 0 || status >= 400) {
            violations.push({
              file: name,
              line,
              problem: status < 0 ? 'External link unreachable' : 'External link returns ' + status,
              href,
              fix: 'Проверить URL: ' + href,
            });
          }
        }
        continue;
      }

      // ── Skip special protocols ─────────────────────────────────────
      if (/^(mailto|tel|javascript|ftp):/i.test(href)) {
        continue;
      }

      // ── Skip JS template-literal placeholders ──────────────────────
      if (href.includes('${')) {
        continue;
      }

      // ── Internal link ──────────────────────────────────────────────
      // Split fragment from path, then query string from path.
      const [pathAndQuery, fragment] = href.split('#', 2);
      const [linkPath] = pathAndQuery.split('?', 2);
      let resolved = resolveInternal(linkPath, dir, projectRoot);
      let resolvedLower = resolved.toLowerCase();

      if (linkPath && !knownFiles.has(resolvedLower)) {
        // Try .html / index.html variants (clean URLs like `/catalog`).
        const existing = fileExistsVariants(resolved);
        if (!existing) {
          violations.push({
            file: name,
            line,
            problem: 'Broken internal link — file not found',
            href,
            fix: 'Проверить путь: ' + linkPath + ' (не найден ' + resolved + ')',
          });
          continue;
        }
        // Use the actual existing file for subsequent fragment checks.
        resolved = existing;
        resolvedLower = existing.toLowerCase();
      }

      // If there's a fragment, verify it in the target file.
      if (fragment) {
        let targetFile = resolved;
        if (!linkPath) {
          // Same-file anchor.
          targetFile = file;
        }
        if (!fileIds.has(targetFile)) {
          try {
            const tc = fs.readFileSync(targetFile, 'utf-8');
            fileIds.set(targetFile, collectIds(tc));
          } catch (_err) {
            // File not readable — skip anchor check.
            continue;
          }
        }
        const ids = fileIds.get(targetFile);
        if (ids && !ids.has(fragment)) {
          const targetName = path.basename(targetFile);
          violations.push({
            file: name,
            line,
            problem: 'Broken anchor in target file — id not found',
            href,
            fix: 'Добавить id="' + fragment + '" в ' + targetName + ' или исправить ссылку',
          });
        }
      }
    }
  }

  return { violations, checked: files.length, externalChecked };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`Usage: node link-check.js <files-or-dirs...> [--check-external]

Checks HTML files for broken / missing / stub links.

Arguments:
  <html-file>       A single HTML file
  <directory>       All .html files under a directory (recursive)
  <glob pattern>    e.g. projects/maksplit/dist/*.html
  --check-external  Also HEAD-request external URLs (slow)

Exit codes:
  0 — No broken links
  1 — Broken links found`);
}

if (require.main === module) {
  (async () => {
    const rawArgs = process.argv.slice(2);
    const checkExternal = rawArgs.includes('--check-external');
    const args = rawArgs.filter((a) => a !== '--check-external' && a !== '-h' && a !== '--help');

    if (rawArgs.length === 0 || rawArgs.includes('--help') || rawArgs.includes('-h')) {
      printHelp();
      process.exit(0);
    }

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

    const { violations, checked, externalChecked } = await checkLinks(files, { checkExternal });

    // ── Output ───────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════');
    console.log('  Link Check Report');
    console.log('═══════════════════════════════════════════');
    console.log(`  Files checked:   ${checked}`);
    console.log(`  Broken links:    ${violations.length}`);
    if (checkExternal) {
      console.log(`  External URLs:   ${externalChecked} checked`);
    }
    console.log('═══════════════════════════════════════════');

    if (violations.length > 0) {
      console.log('');
      for (const v of violations) {
        console.log(`  ❌ ${v.file}:${v.line}`);
        console.log(`     problem: ${v.problem}`);
        console.log(`     href:    ${v.href}`);
        console.log(`     fix:     ${v.fix}`);
        console.log('');
      }
    }

    if (violations.length === 0) {
      console.log('\nPASS: No broken links found.');
      process.exit(0);
    } else {
      console.log(`FAIL: ${violations.length} broken link(s) found.`);
      process.exit(1);
    }
  })();
}

module.exports = { checkLinks, extractLinks, collectIds, resolveFiles };