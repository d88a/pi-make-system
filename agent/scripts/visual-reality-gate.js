#!/usr/bin/env node
/**
 * V6.1 Visual Reality Gate
 *
 * Objective pre-vision check: the rendered HTML must not contain placeholder
 * image providers or empty image sources when image assets are required.
 * Usage: node agent/scripts/visual-reality-gate.js <index.html> [image-art-direction.json]
 */

const fs = require('fs');
const path = require('path');

const htmlPath = process.argv[2];
const manifestPath = process.argv[3];

if (!htmlPath) {
  console.error('Usage: node agent/scripts/visual-reality-gate.js <index.html> [image-art-direction.json]');
  process.exit(2);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const failures = [];

const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
const srcValues = imgTags.map(tag => {
  const match = tag.match(/\bsrc\s*=\s*["']([^"']*)["']/i);
  return match ? match[1].trim() : '';
});

const forbiddenProviders = [
  /placehold\.co/i,
  /picsum\.photos/i,
  /via\.placeholder\.com/i,
  /placeholder\.com/i,
  /dummyimage\.com/i
];

srcValues.forEach((src, index) => {
  if (!src) failures.push(`IMG_${index + 1}: missing/empty src`);
  if (forbiddenProviders.some(re => re.test(src))) {
    failures.push(`IMG_${index + 1}: placeholder provider is forbidden: ${src}`);
  }
});

imgTags.forEach((tag, index) => {
  const alt = tag.match(/\balt\s*=\s*["']([^"']*)["']/i);
  if (!alt || !alt[1].trim()) failures.push(`IMG_${index + 1}: missing alt text`);
  if (alt && /placeholder|заглуш/i.test(alt[1])) {
    failures.push(`IMG_${index + 1}: alt text identifies a placeholder: ${alt[1]}`);
  }
});

if (manifestPath) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const required = Array.isArray(manifest.assets) ? manifest.assets.filter(a => a.source_requirement !== 'existing_source' || a.role === 'hero') : [];
  const primary = required.filter(a => ['hero', 'primary'].includes(a.role));
  if (primary.length && imgTags.length < primary.length) {
    failures.push(`ASSET_COUNT: ${primary.length} primary/hero assets required, only ${imgTags.length} <img> tags found`);
  }
}

const result = {
  gate: 'visual-reality',
  status: failures.length ? 'FAIL' : 'PASS',
  image_count: imgTags.length,
  failures
};

console.log(JSON.stringify(result, null, 2));
process.exit(failures.length ? 1 : 0);
