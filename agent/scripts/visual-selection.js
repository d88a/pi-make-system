#!/usr/bin/env node

/**
 * visual-selection.js — Visual Selection for Pi Make System
 *
 * Evaluates 3 visual directions by weighted criteria and selects the best.
 * Selection is deterministic + documented rationale. Not subjective only.
 *
 * Criteria (weights):
 *   Content clarity   25%
 *   Visual hierarchy  20%
 *   Aesthetics        20%
 *   Brand fit         15%
 *   Composition       10%
 *   Individuality     10%
 *
 * Before scoring — Content Clarity Gate: if a direction fails clarity,
 * it's rejected regardless of aesthetic score.
 *
 * Usage:
 *   node visual-selection.js <directions.json> [--pick A|B|C]
 *
 * Dependencies: none.
 */

'use strict';
const fs = require('fs');

const WEIGHTS = {
  contentClarity: 0.25,
  visualHierarchy: 0.20,
  aesthetics: 0.20,
  brandFit: 0.15,
  composition: 0.10,
  individuality: 0.10,
};

/**
 * Content Clarity Gate — hard filter before scoring.
 * Returns { pass: boolean, reason: string }
 */
function contentClarityGate(direction) {
  const failures = [];

  // Must have a one_liner (what is this site?)
  if (!direction.one_liner || direction.one_liner.length < 10) {
    failures.push('No clear one_liner — cannot describe the site');
  }
  // Must have content_clarity_check that is positive
  if (!direction.content_clarity_check) {
    failures.push('No content_clarity_check provided');
  }
  // Must have a rationale tied to brief
  if (!direction.rationale) {
    failures.push('No rationale — direction is not justified');
  }

  return failures.length === 0
    ? { pass: true, reason: '' }
    : { pass: false, reason: failures.join('; ') };
}

/**
 * Score a direction on the 6 criteria (0-10 each).
 * In practice scoring is deterministic heuristics + human/agent judgement.
 * This reference implementation uses documented scores passed in the JSON.
 */
function scoreDirection(direction) {
  // Scores come from the direction's optional "scores" field (agent judgement)
  // Fallback: equal neutral score.
  const s = direction.scores || {
    contentClarity: 7,
    visualHierarchy: 7,
    aesthetics: 7,
    brandFit: 7,
    composition: 7,
    individuality: 7,
  };
  return s;
}

function weightedTotal(scores) {
  let total = 0;
  for (const [k, w] of Object.entries(WEIGHTS)) {
    total += (scores[k] || 7) * w * 10; // scale to 0-100
  }
  return Math.round(total);
}

/**
 * Run selection on a directions JSON.
 * @param {object} data - { project, directions: [...] }
 * @param {string|null} forcePick - optional forced pick (A/B/C)
 */
function runSelection(data, forcePick = null) {
  const results = [];
  const rejected = [];

  for (const d of data.directions) {
    const gate = contentClarityGate(d);
    if (!gate.pass) {
      rejected.push({ direction: d.direction, name: d.name, reason: gate.reason });
      continue;
    }
    const scores = scoreDirection(d);
    results.push({
      direction: d.direction,
      name: d.name,
      scores,
      total: weightedTotal(scores),
      one_liner: d.one_liner,
    });
  }

  // Sort by total desc
  results.sort((a, b) => b.total - a.total);

  let selected = results.length > 0 ? results[0] : null;
  if (forcePick) {
    const forced = results.find((r) => r.direction === forcePick);
    if (forced) selected = forced;
  }

  return { project: data.project, results, rejected, selected };
}

if (require.main === module) {
  const file = process.argv[2];
  const forceIdx = process.argv.indexOf('--pick');
  const forcePick = forceIdx !== -1 ? process.argv[forceIdx + 1] : null;

  if (!file || file === '--help') {
    console.log('Usage: node visual-selection.js <directions.json> [--pick A|B|C]');
    process.exit(0);
  }

  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const { results, rejected, selected } = runSelection(data, forcePick);

  console.log('═══════════════════════════════════════════');
  console.log('  VISUAL SELECTION');
  console.log('═══════════════════════════════════════════');
  console.log('  Project: ' + data.project);
  console.log('');

  for (const r of results) {
    console.log('  ' + r.direction + ' — ' + r.name + ' — ' + r.total + '%');
    console.log('      ' + r.one_liner.slice(0, 70));
  }
  for (const rj of rejected) {
    console.log('  ✗ ' + rj.direction + ' — ' + rj.name + ' — REJECTED: ' + rj.reason);
  }

  console.log('');
  if (selected) {
    console.log('  ✓ SELECTED: ' + selected.direction + ' — ' + selected.name + ' (' + selected.total + '%)');
  } else {
    console.log('  No valid directions.');
  }

  console.log('');
  console.log('  Criteria weights: Content 25% · Hierarchy 20% · Aesthetics 20% · Brand 15% · Composition 10% · Individuality 10%');
}

module.exports = { runSelection, WEIGHTS, contentClarityGate };