const fs = require('fs');
let content = fs.readFileSync('D:/pi/corpus/sources/analyze-corpus.js', 'utf8');

// Fix 1: Architecture palette — filter out pure black/white from bg_main/text_main mode
// Currently mode() returns #FFFFFF/#000000. We need to look at non-trivial colors.
// Replace the arch palette section to use more meaningful colors

const archPaletteSection = `// Architecture representative palette
const archHexCounts = {};
archTopPalettes.forEach(p => {
  archHexCounts[p.hex] = (archHexCounts[p.hex] || 0) + p.pct;
});
const archSortedHexes = Object.entries(archHexCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);`;

const newArchPaletteSection = `// Architecture representative palette
// Filter out pure black/white to find non-trivial colors
const archHexCounts = {};
archTopPalettes.forEach(p => {
  archHexCounts[p.hex] = (archHexCounts[p.hex] || 0) + p.pct;
});
const archSortedHexes = Object.entries(archHexCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// Find non-trivial BG and text from architecture sites (not pure black/white)
const isTrivial = (hex) => {
  const h = hex.toUpperCase();
  return h === '#FFFFFF' || h === '#000000' || h === '#FFF' || h === '#000';
};
const archNonTrivialBg = archBgMains.filter(h => !isTrivial(h));
const archNonTrivialText = archTextMains.filter(h => !isTrivial(h));
const archBgMode = archNonTrivialBg.length > 0 ? mode(archNonTrivialBg) : mode(archBgMains);
const archTextMode = archNonTrivialText.length > 0 ? mode(archNonTrivialText) : mode(archTextMains);

// Also collect non-trivial hexes from palette
const archNonTrivialHexes = archSortedHexes.filter(([h]) => !isTrivial(h));`;

content = content.replace(archPaletteSection, newArchPaletteSection);

// Fix 2: Update arch palette output in summary JSON
// Replace the mode() calls with the filtered versions
content = content.replace(
  `bg_main_mode: mode(archBgMains),
      text_main_mode: mode(archTextMains),`,
  `bg_main_mode: archBgMode,
      text_main_mode: archTextMode,`
);

// Fix 3: Update architecture palette in the report
content = content.replace(
  `- **BG main**: \${mode(archBgMains)}
- **Text main**: \${mode(archTextMains)}`,
  `- **BG main (non-trivial)**: \${archBgMode}
- **Text main (non-trivial)**: \${archTextMode}`
);

// Fix 4: Update palette-patterns.md for architecture section
// Find the arch palette section in the MD generation
const paletteMDArchStart = content.indexOf(`paletteMD += \`### Palette\\n\\n\`;`);
// Search around the architecture palette section
const archPaletteMD = content.indexOf("paletteMD += `## 🏗️ Architecture-Realestate Palette (DETAILED)");
if (archPaletteMD > 0) {
  // Find the section that writes arch palette and update bg/text modes
  const archBgModeLine = content.indexOf("const archBg = mode(archBgMains);", archPaletteMD - 200);
  const archTextModeLine = content.indexOf("const archText = mode(archTextMains);", archPaletteMD - 200);
  
  if (archBgModeLine > 0) {
    content = content.replace(
      "const archBg = mode(archBgMains);",
      "const archBg = archBgMode;"
    );
  }
  if (archTextModeLine > 0) {
    content = content.replace(
      "const archText = mode(archTextMains);",
      "const archText = archTextMode;"
    );
  }
  
  // Also update the hex display to use non-trivial hexes
  content = content.replace(
    "archSortedHexes.slice(0, 6).forEach(([hex, w], j) => {",
    "archNonTrivialHexes.slice(0, 6).forEach(([hex, w], j) => {"
  );
}

// Fix 5: Fix the Architecture Portfolio layout pattern structure
// Find the section where arch struct is computed (around line where topArchStruct is used)
const emptyStructFix = content.indexOf(
  "topArchStruct ? topArchStruct[0] : 'hero→gallery→content→gallery→cta→footer'"
);
if (emptyStructFix > 0) {
  // The issue: topArchStruct[0] is empty string because most arch sites have empty section_sequence
  // Fix: provide a sensible default structure
  content = content.replace(
    "topArchStruct ? topArchStruct[0] : 'hero→gallery→content→gallery→cta→footer'",
    "(topArchStruct && topArchStruct[0] && topArchStruct[0].length > 0) ? topArchStruct[0] : 'hero(full-image)→gallery→content→gallery→cta→footer'"
  );
}

// Fix 6: Fix empty palette hexes in Architecture Portfolio
const archPaletteHexes = content.indexOf(
  "palette_hexes: archHexTop.map(h => h.hex)",
);
if (archPaletteHexes > 0) {
  content = content.replace(
    "palette_hexes: archHexTop.map(h => h.hex),",
    "palette_hexes: archNonTrivialHexes.slice(0, 5).map(h => h[0]),"
  );
}

// Fix 7: Update the arch palette hexes reference used in layout pattern
const archHexTopRef = content.indexOf("const archHexTop = archSortedHexes.slice(0, 5);");
if (archHexTopRef > 0) {
  content = content.replace(
    "const archHexTop = archSortedHexes.slice(0, 5);",
    "const archHexTop = archNonTrivialHexes.slice(0, 5);"
  );
}

fs.writeFileSync('D:/pi/corpus/sources/analyze-corpus.js', content);
console.log('Fixed v2');