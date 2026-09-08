#!/usr/bin/env node
/**
 * Alive Check — standalone script (runs from deduped.json)
 * Usage: node alive-check.js
 * Resumes from partial progress if alive-check.json exists
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'raw');
const DEDUPED_PATH = path.join(RAW_DIR, 'deduped.json');
const OUT_PATH = path.join(RAW_DIR, 'alive-check.json');
const PROGRESS_PATH = path.join(__dirname, '..', 'raw', 'alive-check-progress.txt');

const CONCURRENCY = 15;
const TIMEOUT_MS = 8000;

function hostname(url) {
  try {
    let h = new URL(url).hostname;
    return h.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].toLowerCase();
  }
}

async function checkSite(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    let resp = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 CorpusPipeline/1.0' },
    });
    clearTimeout(timeout);
    const alive = resp.status >= 200 && resp.status < 400;
    return {
      url, hostname: hostname(url), alive,
      http_status: resp.status, final_url: resp.url,
      checked_at: new Date().toISOString(),
    };
  } catch {
    const c2 = new AbortController();
    const t2 = setTimeout(() => c2.abort(), TIMEOUT_MS);
    try {
      let resp = await fetch(url, {
        method: 'GET', signal: c2.signal, redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0 CorpusPipeline/1.0' },
      });
      clearTimeout(t2);
      const alive = resp.status >= 200 && resp.status < 400;
      return {
        url, hostname: hostname(url), alive,
        http_status: resp.status, final_url: resp.url,
        checked_at: new Date().toISOString(),
      };
    } catch (e2) {
      clearTimeout(t2);
      return {
        url, hostname: hostname(url), alive: false,
        http_status: 0, final_url: url,
        error: e2.cause?.code || e2.message?.slice(0, 80) || 'unknown',
        checked_at: new Date().toISOString(),
      };
    }
  }
}

async function main() {
  console.log('Alive Check — starting...');
  const startTime = Date.now();

  // Load deduped sites
  const deduped = JSON.parse(fs.readFileSync(DEDUPED_PATH, 'utf-8'));
  const sites = deduped.sites;
  const total = sites.length;

  // Check for existing results (resume support)
  let results = [];
  let checkedHostnames = new Set();
  if (fs.existsSync(OUT_PATH)) {
    const existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf-8'));
    if (Array.isArray(existing) && existing.length > 0) {
      results = existing;
      for (const r of results) checkedHostnames.add(r.hostname);
      console.log(`  Resuming: ${results.length} already checked, ${total - results.length} remaining`);
    }
  }

  let aliveCount = results.filter(r => r.alive).length;
  let deadCount = results.filter(r => !r.alive).length;
  let done = results.length;

  const pending = sites.filter(s => !checkedHostnames.has(hostname(s.url)));
  console.log(`  Pending: ${pending.length} sites`);

  for (let i = 0; i < pending.length; i += CONCURRENCY) {
    const batch = pending.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(batch.map(s => checkSite(s.url)));

    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        results.push(r.value);
        if (r.value.alive) aliveCount++;
        else deadCount++;
      } else {
        const url = 'unknown';
        results.push({
          url, hostname: hostname(url), alive: false,
          http_status: 0, final_url: url,
          error: r.reason?.message?.slice(0, 80) || 'promise_rejected',
          checked_at: new Date().toISOString(),
        });
        deadCount++;
      }
    }

    done += batch.length;
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const pct = ((done / total) * 100).toFixed(1);
    const eta = done > 0 ? ((elapsed / done) * (total - done)).toFixed(0) : '?';
    process.stdout.write(`\r  ${done}/${total} (${pct}%) | alive=${aliveCount} dead=${deadCount} | ${elapsed}s | ETA ${eta}s`);

    // Save progress every 50 batches (~750 sites)
    if (i % 750 === 0 && i > 0) {
      fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
      fs.writeFileSync(PROGRESS_PATH, `${done}/${total} (${pct}%) | alive=${aliveCount} dead=${deadCount}`);
    }
  }

  // Final save
  fs.writeFileSync(OUT_PATH, JSON.stringify(results, null, 2));
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\nDone in ${elapsed}s`);
  console.log(`Alive: ${aliveCount} | Dead: ${deadCount}`);
  console.log(`→ ${OUT_PATH}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });