#!/usr/bin/env node

/**
 * quality-gate.js — Quality Gate Orchestrator for Pi Make System
 *
 * Runs a deterministic pipeline of static audits on a project directory
 * and produces a single PASS/FAIL report.
 *
 * Pipeline:
 *   1. Build              — run build.js (SKIP if no pages/ dir)
 *   2. Project model      — project.json ↔ pages.json ↔ components.json
 *   3. Token compliance   — token-check.js on dist/*.html
 *   4. Link check         — link-check.js on dist/*.html
 *   5. HTML validity      — duplicate IDs, basic malformed checks
 *   6. A11Y               — a11y-check.js (SKIP if --skip-a11y)
 *   7. Visual regression  — screenshot-diff.js --compare (SKIP if no baseline)
 *   8. Designer review    — ADVISORY (SKIP if --skip-designer or no screenshots)
 *   9. FINAL GATE         — aggregate PASS/FAIL
 *
 * Usage:
 *   node quality-gate.js <project-dir>
 *   node quality-gate.js projects/maksplit
 *   node quality-gate.js projects/maksplit --skip-designer --skip-a11y
 *   node quality-gate.js projects/maksplit --json --output report.json
 *
 * Exit code: 0 = PASS, 1 = FAIL.
 *
 * Dependencies: none (fs, path, child_process — all built-in).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * @typedef {'PASS'|'FAIL'|'SKIP'|'ERROR'|'ADVISORY'} StageStatus
 */

/**
 * @typedef {Object} StageResult
 * @property {string} name
 * @property {StageStatus} status
 * @property {string} details
 * @property {Array} violations
 */

/**
 * Recursively walk a directory, finding files matching a predicate.
 *
 * @param {string} dir
 * @param {(filePath: string) => boolean} pred
 * @returns {string[]}
 */
function walk(dir, pred) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (_err) {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full, pred));
    } else if (entry.isFile() && pred(full)) {
      results.push(full);
    }
  }
  return results;
}

/**
 * Find HTML page files in a project directory.
 * Checks dist/ (assembled output), then root-level .html, then pages/ (source).
 * Does NOT recurse into shared/, _utilities/, etc. — only actual site pages.
 *
 * @param {string} projectDir
 * @returns {string[]}
 */
function findHtmlFiles(projectDir) {
  // 1. dist/ — assembled pages (recurse, only real output)
  const distDir = path.join(projectDir, 'dist');
  if (fs.existsSync(distDir) && fs.statSync(distDir).isDirectory()) {
    const files = walk(distDir, (f) => f.toLowerCase().endsWith('.html'));
    if (files.length > 0) return files.sort();
  }

  // 2. Root-level .html — site pages only (no recursion into shared/, etc.)
  if (fs.existsSync(projectDir)) {
    const rootFiles = fs.readdirSync(projectDir)
      .filter((f) => f.toLowerCase().endsWith('.html'))
      .map((f) => path.join(projectDir, f))
      .sort();
    if (rootFiles.length > 0) return rootFiles;
  }

  // 3. pages/ — source pages with @component markers
  const pagesDir = path.join(projectDir, 'pages');
  if (fs.existsSync(pagesDir) && fs.statSync(pagesDir).isDirectory()) {
    const files = walk(pagesDir, (f) => f.toLowerCase().endsWith('.html'));
    if (files.length > 0) return files.sort();
  }

  return [];
}

/**
 * Find image files (for designer advisory check) in a project.
 *
 * @param {string} projectDir
 * @returns {string[]}
 */
function findScreenshots(projectDir) {
  const imgExts = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
  return walk(projectDir, (f) => imgExts.has(path.extname(f).toLowerCase()));
}

/**
 * Run a Node.js script from the scripts/ directory and return exit code + stdout.
 *
 * @param {string} scriptName - e.g. 'token-check.js'
 * @param {string[]} args
 * @returns {{ code: number, stdout: string, stderr: string }}
 */
function runScript(scriptName, args) {
  const scriptsDir = __dirname;
  const scriptPath = path.join(scriptsDir, scriptName);
  if (!fs.existsSync(scriptPath)) {
    return { code: -1, stdout: '', stderr: 'Script not found: ' + scriptPath };
  }
  const result = spawnSync('node', [scriptPath, ...args], {
    encoding: 'utf-8',
    timeout: 120000,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  return {
    code: result.status !== null ? result.status : -1,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

/**
 * Parse a JSON file safely.
 *
 * @param {string} filePath
 * @returns {{ ok: boolean, data?: any, error?: string }}
 */
function readJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ── Stage 1: Build ──────────────────────────────────────────────────────────

/**
 * Run build.js on the project.
 */
function stageBuild(projectDir) {
  const pagesDir = path.join(projectDir, 'pages');
  if (!fs.existsSync(pagesDir) || !fs.statSync(pagesDir).isDirectory()) {
    return { name: 'Build', status: 'SKIP', details: 'No pages/ directory', violations: [] };
  }

  const buildScript = path.join(__dirname, 'build.js');
  if (!fs.existsSync(buildScript)) {
    return { name: 'Build', status: 'SKIP', details: 'build.js not found', violations: [] };
  }

  const result = runScript('build.js', [projectDir]);
  if (result.code === 0) {
    return { name: 'Build', status: 'PASS', details: 'Built successfully', violations: [] };
  }
  return {
    name: 'Build',
    status: 'FAIL',
    details: 'build.js exited with code ' + result.code,
    violations: [{ file: 'build.js', line: 0, select: '', problem: result.stderr || result.stdout }],
  };
}

// ── Stage 2: Project model ─────────────────────────────────────────────────

/**
 * Verify project.json ↔ pages.json ↔ components.json consistency.
 */
function stageProjectModel(projectDir) {
  const violations = [];
  const projectJson = path.join(projectDir, 'project.json');
  const pagesJson = path.join(projectDir, 'pages.json');
  const componentsJson = path.join(projectDir, 'components.json');

  if (!fs.existsSync(projectJson)) {
    return { name: 'Project model', status: 'SKIP', details: 'No project.json', violations: [] };
  }

  const proj = readJson(projectJson);
  if (!proj.ok) {
    violations.push({ file: 'project.json', line: 0, selector: '', problem: 'Invalid JSON: ' + proj.error });
    return { name: 'Project model', status: 'FAIL', details: 'project.json invalid', violations };
  }

  const projectPages = proj.data.pages || [];
  const projectComponents = proj.data.components || [];

  // ── pages.json ──
  if (fs.existsSync(pagesJson)) {
    const pages = readJson(pagesJson);
    if (pages.ok) {
      const pageIds = Array.isArray(pages.data) ? pages.data.map((p) => p.id) : [];
      for (const id of projectPages) {
        if (!pageIds.includes(id)) {
          violations.push({
            file: 'pages.json',
            line: 0,
            selector: id,
            problem: 'Page declared in project.json but missing from pages.json',
            fix: 'Добавить запись для "' + id + '" в pages.json',
          });
        }
      }
      for (const page of (Array.isArray(pages.data) ? pages.data : [])) {
        if (!projectPages.includes(page.id)) {
          violations.push({
            file: 'pages.json',
            line: 0,
            selector: page.id,
            problem: 'Orphan page in pages.json — not in project.json',
            fix: 'Удалить "' + page.id + '" из pages.json или добавить в project.json',
          });
        }
      }
    } else {
      violations.push({ file: 'pages.json', line: 0, selector: '', problem: 'Invalid JSON: ' + pages.error });
    }
  } else {
    violations.push({ file: 'pages.json', line: 0, selector: '', problem: 'Missing pages.json', fix: 'Создать pages.json' });
  }

  // ── components.json ──
  if (fs.existsSync(componentsJson)) {
    const comps = readJson(componentsJson);
    if (comps.ok) {
      const compList = (comps.data.components || []).map((c) => c.name);
      const sharedDir = path.join(projectDir, 'shared', 'components');
      for (const name of projectComponents) {
        if (!compList.includes(name)) {
          violations.push({
            file: 'components.json',
            line: 0,
            selector: name,
            problem: 'Component declared in project.json but missing from components.json',
            fix: 'Добавить запись для "' + name + '" в components.json',
          });
        }
        if (fs.existsSync(sharedDir)) {
          const file = path.join(sharedDir, name + '.html');
          if (!fs.existsSync(file)) {
            violations.push({
              file: 'shared/components/' + name + '.html',
              line: 0,
              selector: name,
              problem: 'Component file missing on disk',
              fix: 'Создать файл shared/components/' + name + '.html',
            });
          }
        }
      }
      for (const comp of (comps.data.components || [])) {
        if (!projectComponents.includes(comp.name)) {
          violations.push({
            file: 'components.json',
            line: 0,
            selector: comp.name,
            problem: 'Orphan component in components.json — not in project.json',
            fix: 'Удалить "' + comp.name + '" из components.json или добавить в project.json',
          });
        }
      }
    } else {
      violations.push({ file: 'components.json', line: 0, selector: '', problem: 'Invalid JSON: ' + comps.error });
    }
  } else {
    violations.push({ file: 'components.json', line: 0, selector: '', problem: 'Missing components.json', fix: 'Создать components.json' });
  }

  if (violations.length === 0) {
    return {
      name: 'Project model',
      status: 'PASS',
      details: 'project.json ↔ pages.json ↔ components.json consistent',
      violations: [],
    };
  }
  return {
    name: 'Project model',
    status: 'FAIL',
    details: violations.length + ' inconsistency(ies) found',
    violations,
  };
}

// ── Stage 3: Token compliance ───────────────────────────────────────────────

function stageTokens(projectDir) {
  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { name: 'Tokens', status: 'SKIP', details: 'No HTML files found', violations: [] };
  }

  const result = runScript('token-check.js', htmlFiles);
  if (result.code === -1) {
    return { name: 'Tokens', status: 'ERROR', details: 'token-check.js not found', violations: [] };
  }

  if (result.code === 0) {
    return { name: 'Tokens', status: 'PASS', details: 'No token violations', violations: [] };
  }

  // Parse violations from stdout.
  const violations = parseViolationsFromOutput(result.stdout);
  return {
    name: 'Tokens',
    status: 'FAIL',
    details: (violations.length > 0 ? violations.length : '?') + ' violation(s)',
    violations,
  };
}

// ── Stage 4: Link check ─────────────────────────────────────────────────────

function stageLinks(projectDir) {
  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { name: 'Links', status: 'SKIP', details: 'No HTML files found', violations: [] };
  }

  const result = runScript('link-check.js', htmlFiles);
  if (result.code === -1) {
    return { name: 'Links', status: 'ERROR', details: 'link-check.js not found', violations: [] };
  }

  if (result.code === 0) {
    return { name: 'Links', status: 'PASS', details: '0 broken links', violations: [] };
  }

  const violations = parseViolationsFromOutput(result.stdout);
  return {
    name: 'Links',
    status: 'FAIL',
    details: (violations.length > 0 ? violations.length : '?') + ' broken link(s)',
    violations,
  };
}

// ── Stage 5: HTML validity ──────────────────────────────────────────────────

/**
 * Basic HTML validity: duplicate IDs, malformed markers.
 */
function stageHtml(projectDir) {
  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { name: 'HTML', status: 'SKIP', details: 'No HTML files found', violations: [] };
  }

  const violations = [];

  for (const file of htmlFiles) {
    const name = path.basename(file);
    const content = fs.readFileSync(file, 'utf-8');

    // ── Duplicate IDs ────────────────────────────────────────────────
    const idMap = new Map();
    const idRe = /\bid\s*=\s*["']([^"']+)["']/gi;
    let match;
    while ((match = idRe.exec(content)) !== null) {
      const id = match[1];
      const offset = match.index;
      const line = content.slice(0, offset).split('\n').length;
      if (idMap.has(id)) {
        violations.push({
          file: name,
          line,
          selector: '#' + id,
          problem: 'Duplicate ID',
          actual: id,
          fix: 'Remove duplicate id="' + id + '" (first occurrence on line ' + idMap.get(id) + ')',
        });
      } else {
        idMap.set(id, line);
      }
    }

    // ── Missing DOCTYPE ──────────────────────────────────────────────
    if (!/<!DOCTYPE\s+html/i.test(content.slice(0, 200))) {
      violations.push({
        file: name,
        line: 1,
        selector: 'document',
        problem: 'Missing <!DOCTYPE html>',
        fix: 'Add <!DOCTYPE html> at the top of the file',
      });
    }

    // ── Unclosed @component markers (leftover in dist) ────────────────
    const leftover = content.match(/<!--\s*@component\s+\S+\s*-->/g);
    if (leftover) {
      for (const marker of leftover) {
        const offset = content.indexOf(marker);
        const line = content.slice(0, offset).split('\n').length;
        violations.push({
          file: name,
          line,
          selector: marker,
          problem: 'Unresolved @component marker',
          actual: marker,
          fix: 'Run build.js or ensure component file exists',
        });
      }
    }
  }

  if (violations.length === 0) {
    return { name: 'HTML', status: 'PASS', details: 'No issues found', violations: [] };
  }
  return {
    name: 'HTML',
    status: 'FAIL',
    details: violations.length + ' issue(s) found',
    violations,
  };
}

// ── Stage 6: A11Y ───────────────────────────────────────────────────────────

function stageA11y(projectDir, skipA11y) {
  if (skipA11y) {
    return { name: 'A11Y', status: 'SKIP', details: 'Skipped via --skip-a11y', violations: [] };
  }

  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { name: 'A11Y', status: 'SKIP', details: 'No HTML files found', violations: [] };
  }

  // Try first file; a11y-check.js takes one file at a time.
  const firstHtml = htmlFiles[0];
  const result = runScript('a11y-check.js', [firstHtml]);

  if (result.code === -1) {
    return { name: 'A11Y', status: 'ERROR', details: 'a11y-check.js not found', violations: [] };
  }
  if (result.code === 0) {
    return { name: 'A11Y', status: 'PASS', details: '0 violations', violations: [] };
  }

  const violations = parseViolationsFromOutput(result.stderr);
  return {
    name: 'A11Y',
    status: 'FAIL',
    details: (violations.length > 0 ? violations.length : '?') + ' violation(s)',
    violations,
  };
}

// ── Stage 7: Visual regression ─────────────────────────────────────────────

/**
 * Run screenshot-diff.js --compare against an existing baseline.
 * SKIP if no baseline manifest exists (user must run --baseline first).
 */
function stageVisual(projectDir, skipVisual) {
  if (skipVisual) {
    return { name: 'Visual', status: 'SKIP', details: 'Skipped via --skip-visual', violations: [] };
  }

  const manifest = path.join(projectDir, 'screenshots', 'baseline', 'manifest.json');
  if (!fs.existsSync(manifest)) {
    return { name: 'Visual', status: 'SKIP', details: 'No baseline — run screenshot-diff.js --baseline first', violations: [] };
  }

  const htmlFiles = findHtmlFiles(projectDir);
  if (htmlFiles.length === 0) {
    return { name: 'Visual', status: 'SKIP', details: 'No HTML files found', violations: [] };
  }

  const result = runScript('screenshot-diff.js', ['--compare', ...htmlFiles]);
  if (result.code === -1) {
    return { name: 'Visual', status: 'ERROR', details: 'screenshot-diff.js not found', violations: [] };
  }

  // screenshot-diff.js exit 0 = all pages within threshold, 1 = regression found.
  if (result.code === 0) {
    const changed = parseDiffSummary(result.stdout);
    return { name: 'Visual', status: 'PASS', details: changed, violations: [] };
  }

  const changed = parseDiffSummary(result.stdout);
  return {
    name: 'Visual',
    status: 'FAIL',
    details: changed,
    violations: [{ file: 'screenshots', line: 0, selector: '', problem: changed }],
  };
}

/**
 * Extract the human summary line from screenshot-diff.js output.
 */
function parseDiffSummary(stdout) {
  const lines = stdout.split('\n').filter(Boolean);
  // Look for a line like "RESULT: PASS" or "RESULT: FAIL (N page(s) changed)".
  for (const line of lines) {
    const m = line.match(/RESULT:\s*(.+)/i);
    if (m) return m[1].trim();
  }
  // Fallback: last non-empty line.
  return lines.length > 0 ? lines[lines.length - 1] : 'unknown';
}

// ── Stage 8: Designer review ────────────────────────────────────────────────

function stageDesigner(projectDir, skipDesigner) {
  if (skipDesigner) {
    return { name: 'Designer', status: 'SKIP', details: 'Skipped via --skip-designer', violations: [] };
  }

  const screenshots = findScreenshots(projectDir);
  if (screenshots.length === 0) {
    return { name: 'Designer', status: 'SKIP', details: 'No screenshots found', violations: [] };
  }

  // In v1, designer review is advisory — cannot be automated.
  return {
    name: 'Designer',
    status: 'ADVISORY',
    details: screenshots.length + ' screenshot(s) found — run designer review manually',
    violations: [],
  };
}

// ── Violation parser ────────────────────────────────────────────────────────

/**
 * Best-effort parsing of violation lines from token/link/a11y output.
 * Handles the common format: `file:line (selector)` / `problem: ...` / `actual: ...`.
 *
 * @param {string} output
 * @returns {Array}
 */
function parseViolationsFromOutput(output) {
  const violations = [];
  const lines = output.split('\n');
  let current = null;

  for (const line of lines) {
    const fileMatch = line.match(/^\s*❌\s+(\S+):(\d+)(?:\s+(.*))?$/);
    if (fileMatch) {
      current = {
        file: fileMatch[1],
        line: parseInt(fileMatch[2], 10),
        selector: (fileMatch[3] || '').trim(),
        problem: '',
        actual: '',
        fix: '',
      };
      continue;
    }
    if (current) {
      const probMatch = line.match(/^\s*problem:\s+(.*)$/);
      if (probMatch) { current.problem = probMatch[1]; continue; }
      const actMatch = line.match(/^\s*actual:\s+(.*)$/);
      if (actMatch) { current.actual = actMatch[1]; continue; }
      const fixMatch = line.match(/^\s*fix:\s+(.*)$/);
      if (fixMatch) { current.fix = fixMatch[1]; continue; }
      const emptyLine = line.match(/^\s*$/);
      if (emptyLine && current.problem) {
        violations.push({ ...current });
        current = null;
      }
    }
  }
  if (current && current.problem) {
    violations.push({ ...current });
  }
  return violations;
}

// ── Main orchestrator ───────────────────────────────────────────────────────

/**
 * Run the full quality gate pipeline.
 *
 * @param {string} projectDir - Absolute path to the project.
 * @param {Object} options
 * @param {boolean} [options.skipDesigner=false]
 * @param {boolean} [options.skipA11y=false]
 * @returns {Promise<{ project: string, stages: StageResult[], final: 'PASS'|'FAIL' }>}
 */
async function runQualityGate(projectDir, options = {}) {
  const { skipDesigner = false, skipA11y = false, skipVisual = false } = options;

  const stages = [];

  // 1. Build
  stages.push(stageBuild(projectDir));

  // 2. Project model
  stages.push(stageProjectModel(projectDir));

  // 3. Tokens
  stages.push(stageTokens(projectDir));

  // 4. Links
  stages.push(stageLinks(projectDir));

  // 5. HTML
  stages.push(stageHtml(projectDir));

  // 6. A11Y
  stages.push(stageA11y(projectDir, skipA11y));

  // 7. Visual regression
  stages.push(stageVisual(projectDir, skipVisual));

  // 8. Designer
  stages.push(stageDesigner(projectDir, skipDesigner));

  // 9. Final gate
  const blockingStages = stages.filter((s) => s.status === 'FAIL');
  const final = blockingStages.length > 0 ? 'FAIL' : 'PASS';

  return { project: path.basename(projectDir), stages, final };
}

// ── Output formatters ───────────────────────────────────────────────────────

/**
 * Format a stage result as a text line.
 *
 * @param {StageResult} stage
 * @returns {string}
 */
function formatStage(stage) {
  const pad = ' '.repeat(22 - stage.name.length);
  return `${stage.name}${pad}${stage.status}${stage.details ? ' (' + stage.details + ')' : ''}`;
}

/**
 * Print the text report.
 *
 * @param {StageResult[]} stages
 * @param {'PASS'|'FAIL'} final
 * @param {string} projectName
 */
function printTextReport(stages, final, projectName) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log('PI MAKE SYSTEM — QUALITY GATE');
  console.log('Project: ' + projectName);
  console.log('Time: ' + now);
  console.log('');

  for (const stage of stages) {
    console.log(formatStage(stage));
  }

  console.log('');
  const finalIcon = final === 'PASS' ? '✅' : '❌';
  console.log('FINAL: ' + final + ' ' + finalIcon);

  // Print violations detail for failed stages.
  const failedStages = stages.filter((s) => s.status === 'FAIL' && s.violations && s.violations.length > 0);
  if (failedStages.length > 0) {
    console.log('');
    console.log('─'.repeat(60));
    console.log('VIOLATIONS DETAIL');
    console.log('─'.repeat(60));
    for (const stage of failedStages) {
      console.log('');
      console.log('[' + stage.name + ']');
      for (const v of stage.violations) {
        if (typeof v === 'string') {
          console.log('  • ' + v);
        } else {
          console.log('  • ' + (v.file || '') + ':' + (v.line || 0) +
            ' — ' + (v.problem || v.issue || ''));
          if (v.fix) console.log('    fix: ' + v.fix);
        }
      }
    }
  }
}

/**
 * Print the JSON report.
 *
 * @param {StageResult[]} stages
 * @param {'PASS'|'FAIL'} final
 * @param {string} projectName
 * @returns {Object}
 */
function buildJsonReport(stages, final, projectName) {
  return {
    timestamp: new Date().toISOString(),
    project: projectName,
    final,
    stages: stages.map((s) => ({
      name: s.name,
      status: s.status,
      details: s.details,
      violations: s.violations,
    })),
  };
}

// ── CLI ─────────────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`Usage: node quality-gate.js <project-dir> [options]

Arguments:
  <project-dir>       Path to the project directory (required).
  --skip-designer     Skip the designer review stage.
  --skip-a11y         Skip the a11y accessibility check.
  --skip-visual       Skip the visual regression check.
  --json              Output report as JSON instead of text.
  --output <file>     Write report to a file.
  --help, -h          Show this help.

Example:
  node quality-gate.js projects/maksplit
  node quality-gate.js projects/maksplit --skip-a11y --skip-designer
  node quality-gate.js projects/maksplit --skip-visual
  node quality-gate.js projects/maksplit --json --output report.json`);
}

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
      printHelp();
      process.exit(0);
    }

    const projectDir = path.resolve(args[0]);
    const skipDesigner = args.includes('--skip-designer');
    const skipA11y = args.includes('--skip-a11y');
    const skipVisual = args.includes('--skip-visual');
    const jsonMode = args.includes('--json');

    const outputIdx = args.indexOf('--output');
    const outputFile = outputIdx !== -1 && outputIdx + 1 < args.length ? args[outputIdx + 1] : null;

    if (!fs.existsSync(projectDir)) {
      console.error('Error: Project directory not found: ' + projectDir);
      process.exit(1);
    }

    const { project, stages, final } = await runQualityGate(projectDir, { skipDesigner, skipA11y, skipVisual });

    if (jsonMode) {
      const report = buildJsonReport(stages, final, project);
      const json = JSON.stringify(report, null, 2);
      console.log(json);
      if (outputFile) {
        fs.writeFileSync(outputFile, json, 'utf-8');
        console.error('Report saved to: ' + outputFile);
      }
    } else {
      printTextReport(stages, final, project);
      if (outputFile) {
        const report = buildJsonReport(stages, final, project);
        fs.writeFileSync(outputFile, JSON.stringify(report, null, 2), 'utf-8');
        console.error('\nReport saved to: ' + outputFile);
      }
    }

    process.exit(final === 'PASS' ? 0 : 1);
  })();
}

module.exports = { runQualityGate, findHtmlFiles, findScreenshots, stageBuild, stageProjectModel, stageTokens, stageLinks, stageHtml, stageA11y, stageVisual, stageDesigner };