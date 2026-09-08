const fs = require('fs');
let content = fs.readFileSync('D:/pi/corpus/sources/analyze-corpus.js', 'utf8');

// Fix 1: moodDist initialization — use dynamic keys
content = content.replace(
  /const moodDist = \{\s*\n\s*radius: \{ 'sharp': 0, 'soft': 0, 'round': 0, 'pill': 0 \},\s*\n\s*density: \{ 'tight': 0, 'normal': 0, 'airy': 0 \},\s*\n\s*shadow: \{ 'none': 0, 'light': 0, 'medium': 0, 'heavy': 0 \},\s*\n\s*animation: \{ 'none': 0, 'some': 0, 'lots': 0 \},\s*\n\s*gradient: \{ 'yes': 0, 'no': 0 \},\s*\n\s*dark_mode: \{ 'yes': 0, 'no': 0 \},\s*\n\s*monochrome: \{ 'yes': 0, 'no': 0 \}\s*\n\};/,
  `const moodDist = {
  radius: {},
  density: {},
  shadow: {},
  animation: {},
  gradient: { 'yes': 0, 'no': 0 },
  dark_mode: { 'yes': 0, 'no': 0 },
  monochrome: { 'yes': 0, 'no': 0 }
};`
);

// Fix 2: moodDist.radius update
content = content.replace(
  'moodDist.radius[bucketRadius(r)]++;',
  'const rBkt = bucketRadius(r); moodDist.radius[rBkt] = (moodDist.radius[rBkt] || 0) + 1;'
);

// Fix 3: moodDist.density update
content = content.replace(
  'moodDist.density[bucketDensity(m.density_padding_avg_px)]++;',
  'const dBkt = bucketDensity(m.density_padding_avg_px); moodDist.density[dBkt] = (moodDist.density[dBkt] || 0) + 1;'
);

// Fix 4: moodDist.animation update
content = content.replace(
  'moodDist.animation[bucketAnimation(m.animation_count)]++;',
  'const aBkt = bucketAnimation(m.animation_count); moodDist.animation[aBkt] = (moodDist.animation[aBkt] || 0) + 1;'
);

// Fix 5: Add data quality note about empty section_sequence
content = content.replace(
  "hero_type_centered: '73% — возможно классификатор слишком грубый',",
  "hero_type_centered: '73% — возможно классификатор слишком грубый',\n    empty_section_sequence: '40/88 sites (45%) — section_sequence и section_types пустые. Классификатор секций отказал почти на половине сайтов.',\n    empty_section_types: '40/88 — те же сайты',\n    font_detection_rate: '55%',"
);

// Fix 6: Update the mood distribution output in report to handle dynamic keys
// The report loops moodDist and tries to total keys — this needs fixing too
// Let's find the mood distribution section in the report generation
const moodReportStart = content.indexOf('## 7. Mood Distribution');
const moodReportEnd = content.indexOf('## 8. Architecture-Realestate');
const moodReportSection = content.substring(moodReportStart, moodReportEnd);

// Replace the mood distribution table generation
const oldMoodTable = moodReportSection.match(/\$\{Object\.entries\(moodDist\)[\s\S]*?\.join\('\\n'\)\}/);
if (oldMoodTable) {
  const newMoodTable = `\${(() => {
  // Build mood distribution table with dynamic keys
  const rows = [];
  for (const [dim, vals] of Object.entries(moodDist)) {
    const total = Object.values(vals).reduce((a, b) => a + b, 0);
    for (const [cat, cnt] of Object.entries(vals).sort((a, b) => b[1] - a[1])) {
      rows.push(\`| \${dim} | \${cat} | \${cnt} | \${total > 0 ? ((cnt / total) * 100).toFixed(1) : '0'}% |\`);
    }
  }
  return rows.join('\\n');
})()}`;
  content = content.replace(oldMoodTable[0], newMoodTable);
}

// Fix 7: Also fix the mood distribution in the summary JSON
// The summary outputs moodDist directly — it's fine since we're now using dynamic keys

fs.writeFileSync('D:/pi/corpus/sources/analyze-corpus.js', content);
console.log('Fixed all issues');