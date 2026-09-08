#!/usr/bin/env node

/**
 * Image Analysis & Decision System (IADS)
 * =========================================
 * Analyzes images using DashScope qwen-vl-max vision model.
 * Applies 40-rule decision matrix to determine optimal CSS handling strategy.
 *
 * Usage:
 *   node image-analyzer.js path/to/img1.jpg path/to/img2.jpg
 *   node image-analyzer.js --dir path/to/images
 *   node image-analyzer.js --dir path/to/images --usage catalog-card
 *   node image-analyzer.js --help
 *
 * Output: JSON array to stdout, progress to stderr.
 * Writes image-analysis-report.json by default.
 *
 * Environment: DASHSCOPE_API_KEY (required)
 */

"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

// ============================================================================
// 1. Constants
// ============================================================================

const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY || "";
const DASHSCOPE_ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const VISION_MODEL = "qwen-vl-max";

const CONTENT_TYPES = [
  "single-product-clean", "single-product-context", "product-group",
  "texture-macro", "lifestyle", "banner-hero", "portrait-person",
  "abstract-pattern", "icon-illustration", "document-screenshot",
];

const HANDLING_STRATEGIES = [
  "contain", "cover", "contain-pad", "cover-position", "thumbnail-cover",
  "natural", "regenerate-similar", "generate-new", "enhance", "reject",
];

const USAGE_CONTEXTS = [
  "product-main", "product-thumbnail", "catalog-card", "category-cover",
  "hero-banner", "inline-texture", "lifestyle-block", "og-image",
];

const IMG_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff",
]);

// ============================================================================
// 2. Image dimension readers (no external dependencies)
// ============================================================================

/**
 * Read JPEG dimensions from binary header.
 * Looks for SOF0 marker (0xFF 0xC0) and reads height/width.
 * @param {Buffer} buf - File buffer (first 64KB enough)
 * @returns {{width: number, height: number}|null}
 */
function readJPEGDimensions(buf) {
  if (buf[0] !== 0xFF || buf[1] !== 0xD8) return null; // Not JPEG

  let pos = 2;
  const len = buf.length;

  while (pos < len - 1) {
    if (buf[pos] !== 0xFF) return null; // Corrupt

    const marker = buf[pos + 1];
    pos += 2;

    // SOF markers: C0-C3, C5-C7, C9-CB, CD-CF
    if ((marker >= 0xC0 && marker <= 0xC3) ||
        (marker >= 0xC5 && marker <= 0xC7) ||
        (marker >= 0xC9 && marker <= 0xCB) ||
        (marker >= 0xCD && marker <= 0xCF)) {
      if (pos + 7 > len) return null;
      const height = buf.readUInt16BE(pos + 3);
      const width = buf.readUInt16BE(pos + 5);
      return { width, height };
    }

    // Skip marker
    if (pos + 2 > len) return null;
    const segmentLen = buf.readUInt16BE(pos);
    if (segmentLen < 2) return null;
    pos += segmentLen;
  }
  return null;
}

/**
 * Read PNG dimensions from IHDR chunk.
 * @param {Buffer} buf - File buffer (first 64KB enough)
 * @returns {{width: number, height: number}|null}
 */
function readPNGDimensions(buf) {
  // PNG signature: 8 bytes
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!buf.slice(0, 8).equals(PNG_SIG)) return null;

  // IHDR is the first chunk, starts at offset 8
  // 4 bytes length, 4 bytes "IHDR", then 4 bytes width, 4 bytes height
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  return { width, height };
}

/**
 * Read WebP dimensions from RIFF header.
 * @param {Buffer} buf
 * @returns {{width: number, height: number}|null}
 */
function readWebPDimensions(buf) {
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  const chunkType = buf.toString("ascii", 12, 16);
  if (chunkType === "VP8 " && buf.length >= 30) {
    // Lossy: dimensions in 16-bit little-endian at offset 26
    const w = buf.readUInt16LE(26) & 0x3FFF;
    const h = buf.readUInt16LE(28) & 0x3FFF;
    return { width: w, height: h };
  } else if (chunkType === "VP8L" && buf.length >= 25) {
    // Lossless: 14-bit dimensions packed in 4 bytes at offset 21
    const bits = buf.readUInt32LE(21);
    const w = (bits & 0x3FFF) + 1;
    const h = ((bits >> 14) & 0x3FFF) + 1;
    return { width: w, height: h };
  }
  return null;
}

/**
 * Get image dimensions. Supports JPEG, PNG, WebP.
 * @param {string} filePath
 * @returns {{width: number, height: number}|null}
 */
function getImageDimensions(filePath) {
  try {
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(65536);
    const bytesRead = fs.readSync(fd, buf, 0, 65536, 0);
    fs.closeSync(fd);

    const data = buf.slice(0, bytesRead);

    // Try each format
    const dims = readJPEGDimensions(data) ||
                 readPNGDimensions(data) ||
                 readWebPDimensions(data);

    return dims;
  } catch (err) {
    return null;
  }
}

// ============================================================================
// 3. Vision model API call
// ============================================================================

/**
 * Get MIME type from file extension.
 * @param {string} filePath
 * @returns {string}
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".png": "image/png", ".webp": "image/webp",
    ".gif": "image/gif", ".bmp": "image/bmp",
  };
  return map[ext] || "image/jpeg";
}

/**
 * Build the vision model system prompt (from spec Section 7).
 * @param {string} imagePath
 * @param {{width: number, height: number}|null} dims
 * @returns {string}
 */
function buildVisionPrompt(imagePath, dims) {
  const filename = path.basename(imagePath);
  let metadata = `Image URL: ${imagePath}\nFilename: ${filename}\n`;
  if (dims) {
    metadata += `Known dimensions: ${dims.width}x${dims.height}\n`;
  }

  return metadata + `
You are an expert image analyst for e-commerce and web design.
Analyze the provided image and return ONLY a valid JSON object.
No markdown fences, no explanation text, no commentary outside JSON.

ANALYZE THESE DIMENSIONS:

1. CONTENT_TYPE - pick exactly ONE:
   "single-product-clean" = one object on white/gray/solid background
   "single-product-context" = one object in real environment (street, room, installed)
   "product-group" = multiple items together (collection, lineup)
   "texture-macro" = close-up material surface, pattern fills most of frame
   "lifestyle" = people using product or aspirational scene
   "banner-hero" = wide composed marketing image with composition
   "portrait-person" = person(s) as primary subject
   "abstract-pattern" = abstract/geometric/decorative, no real object
   "icon-illustration" = vector graphic, icon, diagram, logo
   "document-screenshot" = text-heavy content, screenshot, certificate

2. QUALITY - assess each:
   resolution: "low" (shortest side <400px), "med" (400-1000px), "high" (>1000px)
   Estimate width/height in pixels.
   lighting: "poor" (dark, harsh shadows, uneven), "ok" (acceptable), "good" (studio/pro)
   background: "clean" (neutral/solid), "busy" (cluttered/noisy), "none" (transparent PNG)
   sharpness: "blurry" (out of focus, compressed), "ok" (acceptable), "sharp" (crisp)
   white_balance: "warm" (yellow cast), "neutral" (accurate), "cool" (blue cast)
   score: 0-10 where: base(res:low=2,med=5,high=7) + light(poor=-2,ok=0,good=+2) +
     sharp(blurry=-2,ok=0,sharp=+1) + bg(none=+1,clean=0,busy=-1) + wb(neutral=+1,else=0)

3. CROP_SAFE - can CSS object-cover safely crop this?
   true = subject centered 30-70% of frame, clean edges, no text near borders
   false = subject >80% frame, details at edges, texture, icon, document
   "partial" = subject off-center, can crop from one direction

4. LARGE_OK - can display >600px wide? true only if res=high, sharp!=blurry, score>=6

5. RECOMMENDED_HANDLING - pick ONE:
   contain, cover, contain-pad, cover-position, thumbnail-cover, natural,
   regenerate-similar, generate-new, enhance, reject

6. USAGE_CONTEXT_SUGGESTIONS - pick 1-3 where this works best:
   product-main, product-thumbnail, catalog-card, category-cover,
   hero-banner, inline-texture, lifestyle-block, og-image

7. REGENERATE - if handling is regenerate-similar or generate-new:
   needed: true/false
   mode: "similar" | "new" | "none"
   prompt: detailed English prompt for AI image generator
   preserve_subject: true for similar, false for new
   reason: why needed
   suggested_size: "1024*1024" | "1280*720" | "720*1280" | "768*1152"

8. CSS_RECOMMENDATION - ready-to-use Tailwind classes:
   object_fit: contain | cover | none | scale-down
   container_classes: Tailwind classes for parent div
   image_classes: Tailwind classes for img tag

9. CONFIDENCE - 0.0 to 1.0

10. REASONING - brief explanation

RETURN THIS EXACT JSON STRUCTURE (fill all fields, leave url/filename empty):
{
  "url": "",
  "filename": "",
  "content_type": "",
  "quality": {
    "resolution": "",
    "resolution_px": {"width": 0, "height": 0, "shortest_side": 0},
    "lighting": "",
    "background": "",
    "sharpness": "",
    "white_balance": "",
    "score": 0
  },
  "crop_safe": true,
  "crop_safe_reason": "",
  "object_position": "center",
  "large_ok": false,
  "recommended_handling": "",
  "usage_context_suggestions": [],
  "regenerate": {
    "needed": false,
    "mode": "none",
    "prompt": "",
    "preserve_subject": false,
    "reason": "",
    "suggested_size": "1024*1024"
  },
  "css_recommendation": {
    "object_fit": "contain",
    "object_position": "",
    "container_classes": "",
    "image_classes": ""
  },
  "confidence": 0.8,
  "reasoning": ""
}`;
}

/**
 * Make HTTPS request.
 * @param {string} url
 * @param {object} options
 * @param {string|object|null} body
 * @returns {Promise<object>}
 */
function httpsRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOpts = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DASHSCOPE_API_KEY}`,
        ...(options.headers || {}),
      },
      timeout: 60000,
    };

    const req = https.request(reqOpts, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timeout")); });

    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

/**
 * Extract JSON from model response. Handles ```json fences.
 * @param {string} text
 * @returns {object|null}
 */
function extractJSON(text) {
  // Try direct parse
  try {
    return JSON.parse(text);
  } catch {}

  // Try ```json ... ``` block
  const fenceMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch {}
  }

  // Try finding first { and last }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    } catch {}
  }

  return null;
}

/**
 * Analyze a single image with the vision model.
 * @param {string} imagePath
 * @returns {Promise<object>}
 */
async function analyzeWithVision(imagePath) {
  const dims = getImageDimensions(imagePath);
  const mimeType = getMimeType(imagePath);
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const prompt = buildVisionPrompt(imagePath, dims);

  const payload = {
    model: VISION_MODEL,
    messages: [{
      role: "user",
      content: [
        { type: "image_url", image_url: { url: dataUrl } },
        { type: "text", text: prompt },
      ],
    }],
    max_tokens: 2000,
    temperature: 0.1,
  };

  const response = await httpsRequest(DASHSCOPE_ENDPOINT, { method: "POST" }, payload);

  if (response.status !== 200) {
    throw new Error(`API error ${response.status}: ${JSON.stringify(response.body)}`);
  }

  const content = response.body?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error(`No content in response: ${JSON.stringify(response.body)}`);
  }

  const analysis = extractJSON(content);
  if (!analysis) {
    throw new Error(`Failed to parse JSON from model response: ${content.slice(0, 200)}`);
  }

  // Fill in url/filename if model left empty
  analysis.url = imagePath;
  analysis.filename = path.basename(imagePath);

  // Fill in actual dimensions if known
  if (dims && analysis.quality?.resolution_px) {
    analysis.quality.resolution_px.width = dims.width;
    analysis.quality.resolution_px.height = dims.height;
    analysis.quality.resolution_px.shortest_side = Math.min(dims.width, dims.height);
  }

  return analysis;
}

// ============================================================================
// 4. Decision Matrix (40 rules from spec Section 5)
// ============================================================================

/**
 * Check if a value is in a set (array or string).
 * @param {*} value
 * @param {string|string[]} set
 * @returns {boolean}
 */
function inSet(value, set) {
  if (Array.isArray(set)) return set.includes(value);
  return set === value;
}

/**
 * Apply the 40-rule decision matrix to determine handling strategy.
 * First match wins. Ordered by priority.
 *
 * @param {object} analysis - The vision model analysis JSON
 * @param {string} usage - The usage context (e.g. "catalog-card", "product-main")
 * @param {object} allAnalyses - All analyses (needed for R09/R10 cross-image checks)
 * @returns {object} { strategy, rule, css }
 */
function applyDecisionMatrix(analysis, usage, allAnalyses = []) {
  const ct = analysis.content_type;
  const q = analysis.quality || {};
  const res = q.resolution;
  const score = q.score || 0;
  const bg = q.background;
  const lighting = q.lighting;
  const wb = q.white_balance;
  const sharp = q.sharpness;
  const cropSafe = analysis.crop_safe;
  const largeOk = analysis.large_ok;

  // Group A: Reject
  if (sharp === "blurry" && res === "low") return { strategy: "reject", rule: "R01" };
  if (score <= 2) return { strategy: "reject", rule: "R02" };
  if (ct === "document-screenshot" && inSet(usage, ["hero-banner", "catalog-card", "lifestyle-block"])) {
    return { strategy: "reject", rule: "R03" };
  }

  // Group B: Regenerate/Generate
  if (ct === "single-product-clean" && res === "low" && usage === "product-main") {
    return { strategy: "regenerate-similar", rule: "R04" };
  }
  if (ct === "single-product-clean" && bg === "busy" && usage === "product-main") {
    return { strategy: "regenerate-similar", rule: "R05" };
  }
  if (ct === "single-product-context" && bg === "busy" && usage === "product-main" && score < 6) {
    return { strategy: "regenerate-similar", rule: "R06" };
  }
  if (ct === "single-product-clean" && lighting === "poor" && inSet(usage, ["product-main", "catalog-card"])) {
    return { strategy: "regenerate-similar", rule: "R07" };
  }
  if (ct === "single-product-clean" && wb !== "neutral" && score < 6 && usage === "product-main") {
    return { strategy: "regenerate-similar", rule: "R08" };
  }
  if (inSet(usage, ["hero-banner"])) {
    const hasBanner = allAnalyses.some(a => a.content_type === "banner-hero");
    if (!hasBanner) return { strategy: "generate-new", rule: "R09" };
  }
  if (inSet(usage, ["lifestyle-block"])) {
    const hasLifestyle = allAnalyses.some(a => a.content_type === "lifestyle");
    if (!hasLifestyle) return { strategy: "generate-new", rule: "R10" };
  }
  if (ct === "single-product-clean" && res === "low" && score < 4) {
    return { strategy: "regenerate-similar", rule: "R11" };
  }
  if (ct === "texture-macro" && res === "low" && inSet(usage, ["hero-banner", "category-cover"])) {
    return { strategy: "regenerate-similar", rule: "R12" };
  }

  // Group C: Contain
  if (ct === "single-product-clean" && usage === "product-main" && cropSafe === false) {
    return { strategy: "contain-pad", rule: "R13" };
  }
  if (ct === "single-product-clean" && usage === "product-main" && cropSafe === true && score >= 6) {
    return { strategy: "contain-pad", rule: "R14" };
  }
  if (ct === "single-product-clean" && usage === "product-main" && score >= 5) {
    return { strategy: "contain-pad", rule: "R15" };
  }
  if (ct === "icon-illustration" && inSet(usage, ["product-main", "catalog-card"])) {
    return { strategy: "contain", rule: "R16" };
  }
  if (ct === "document-screenshot") {
    return { strategy: "contain", rule: "R17" };
  }
  if (ct === "single-product-clean" && res === "low" && score >= 3 && usage === "product-thumbnail") {
    return { strategy: "contain", rule: "R18" };
  }
  if (ct === "portrait-person" && inSet(usage, ["lifestyle-block", "og-image"])) {
    return { strategy: "contain", rule: "R19" };
  }

  // Group D: Cover
  if (ct === "texture-macro" && inSet(usage, ["catalog-card", "inline-texture"])) {
    return { strategy: "cover", rule: "R20" };
  }
  if (ct === "texture-macro" && usage === "hero-banner" && score >= 6) {
    return { strategy: "cover-position", rule: "R21" };
  }
  if (ct === "banner-hero" && usage === "hero-banner" && score >= 6) {
    return { strategy: "cover-position", rule: "R22" };
  }
  if (ct === "lifestyle" && usage === "hero-banner" && res === "high") {
    return { strategy: "cover-position", rule: "R23" };
  }
  if (ct === "lifestyle" && usage === "lifestyle-block" && score >= 5) {
    return { strategy: "cover", rule: "R24" };
  }
  if (ct === "single-product-context" && usage === "catalog-card") {
    return { strategy: "cover", rule: "R25" };
  }
  if (ct === "product-group" && usage === "catalog-card") {
    return { strategy: "cover", rule: "R26" };
  }
  if (ct === "product-group" && usage === "category-cover" && score >= 6) {
    return { strategy: "cover-position", rule: "R27" };
  }
  if (ct === "single-product-clean" && usage === "catalog-card" && score >= 5) {
    return { strategy: "cover", rule: "R28" };
  }
  if (ct === "portrait-person" && usage === "catalog-card") {
    return { strategy: "cover-position", rule: "R29" };
  }

  // Group E: Thumbnail & Special
  if (usage === "product-thumbnail" && score >= 3) {
    return { strategy: "thumbnail-cover", rule: "R30" };
  }
  if (usage === "product-thumbnail" && score < 3) {
    return { strategy: "reject", rule: "R31" };
  }
  if (ct === "abstract-pattern" && inSet(usage, ["hero-banner", "category-cover"])) {
    return { strategy: "cover", rule: "R32" };
  }
  if (ct === "abstract-pattern" && usage === "inline-texture") {
    return { strategy: "cover", rule: "R33" };
  }
  if (usage === "og-image" && inSet(ct, ["banner-hero", "lifestyle"]) && score >= 6) {
    return { strategy: "cover-position", rule: "R34" };
  }
  if (usage === "og-image" && ct === "single-product-clean") {
    return { strategy: "contain-pad", rule: "R35" };
  }

  // Group F: Fallbacks
  if (cropSafe === true && inSet(usage, ["catalog-card", "category-cover"])) {
    return { strategy: "cover", rule: "R36" };
  }
  if (cropSafe === false) {
    return { strategy: "contain", rule: "R37" };
  }
  if (cropSafe === "partial") {
    return { strategy: "cover-position", rule: "R38" };
  }
  if (largeOk === false && inSet(usage, ["hero-banner", "product-main", "lifestyle-block", "og-image"])) {
    return { strategy: "regenerate-similar", rule: "R39" };
  }

  // R40: Default
  return { strategy: "contain", rule: "R40" };
}

// ============================================================================
// 5. CSS class reference per strategy (from spec Appendix C)
// ============================================================================

/**
 * Get CSS classes for a given handling strategy.
 * @param {string} strategy
 * @param {string} objectPosition
 * @returns {{container: string, image: string}}
 */
function getCSSForStrategy(strategy, objectPosition = "center") {
  const map = {
    "contain": {
      container: "aspect-square bg-slate-800 rounded-2xl flex items-center justify-center",
      image: "max-w-full max-h-full object-contain",
    },
    "cover": {
      container: "h-32 md:h-40 overflow-hidden",
      image: "h-full w-full object-cover",
    },
    "contain-pad": {
      container: "aspect-square bg-slate-900/50 rounded-2xl p-4 flex items-center justify-center max-w-sm",
      image: "max-w-full max-h-full object-contain",
    },
    "cover-position": {
      container: `min-h-[400px] md:min-h-[500px] overflow-hidden`,
      image: `h-full w-full object-cover object-${objectPosition}`,
    },
    "thumbnail-cover": {
      container: "w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden",
      image: "h-full w-full object-cover",
    },
    "natural": {
      container: "",
      image: "w-full h-auto rounded-xl",
    },
    "reject": {
      container: "hidden",
      image: "hidden",
    },
  };
  return map[strategy] || map["contain"];
}

// ============================================================================
// 6. gen_image.py command builder
// ============================================================================

/**
 * Build gen_image.py command for regeneration.
 * @param {object} analysis
 * @returns {string|null}
 */
function buildGenImageCommand(analysis, outputDir) {
  const regen = analysis.regenerate;
  if (!regen || !regen.needed) return null;

  const name = analysis.filename.replace(/\.[^.]+$/, "");
  let outName;

  if (regen.mode === "new") {
    outName = `${name}-gen.png`;
  } else {
    outName = `${name}-regen.png`;
  }

  const outputPath = path.join(outputDir || "images/regen", outName);
  const size = regen.suggested_size || "1024*1024";
  const prompt = regen.prompt.replace(/"/g, '\\"');

  return `python D:/pi/scripts/gen_image.py --prompt "${prompt}" --size ${size} --output "${outputPath}"`;
}

// ============================================================================
// 7. Main entry point
// ============================================================================

/**
 * Collect image paths from arguments.
 * @param {string[]} args - Command line arguments
 * @returns {{images: string[], usage: string|null, outputDir: string|null}}
 */
function parseArgs(args) {
  const images = [];
  let usage = null;
  let outputDir = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--help" || args[i] === "-h") {
      printUsage();
      process.exit(0);
    } else if (args[i] === "--dir") {
      const dirPath = args[++i];
      if (!dirPath || !fs.existsSync(dirPath)) {
        console.error(`Error: directory not found: ${dirPath}`);
        process.exit(1);
      }
      const files = fs.readdirSync(dirPath)
        .filter(f => IMG_EXTENSIONS.has(path.extname(f).toLowerCase()))
        .map(f => path.join(dirPath, f));
      images.push(...files);
    } else if (args[i] === "--usage") {
      usage = args[++i];
      if (!USAGE_CONTEXTS.includes(usage)) {
        console.error(`Error: unknown usage "${usage}". Valid: ${USAGE_CONTEXTS.join(", ")}`);
        process.exit(1);
      }
    } else if (args[i] === "--output-dir") {
      outputDir = args[++i];
    } else if (!args[i].startsWith("--")) {
      // Glob expansion
      if (args[i].includes("*")) {
        // Simple glob: expand in current directory
        const dir = path.dirname(args[i]) || ".";
        const pattern = path.basename(args[i]);
        const regex = new RegExp("^" + pattern.replace(/\*/g, ".*").replace(/\?/g, ".") + "$", "i");
        try {
          const files = fs.readdirSync(dir)
            .filter(f => regex.test(f) && IMG_EXTENSIONS.has(path.extname(f).toLowerCase()))
            .map(f => path.join(dir, f));
          images.push(...files);
        } catch {}
      } else if (fs.existsSync(args[i])) {
        images.push(args[i]);
      }
    }
  }

  return { images, usage, outputDir };
}

function printUsage() {
  console.log(`
Image Analysis & Decision System (IADS)
=======================================

Usage:
  node image-analyzer.js [options] <image paths...>
  node image-analyzer.js --dir <directory> [options]

Options:
  --dir <path>         Analyze all images in a directory
  --usage <context>    Apply decision matrix for specific usage context
                       Valid: ${USAGE_CONTEXTS.join(", ")}
  --output-dir <path>  Directory for regenerated images (default: images/regen)
  --help, -h           Show this help

Examples:
  node image-analyzer.js photo1.jpg photo2.png
  node image-analyzer.js --dir ./images --usage catalog-card
  node image-analyzer.js *.jpg --usage product-main

Output:
  JSON array to stdout, progress to stderr.
  Writes image-analysis-report.json.

Environment:
  DASHSCOPE_API_KEY  (required) - DashScope API key
`);
}

/**
 * Analyze a single image with progress output.
 * @param {string} imagePath
 * @param {number} index
 * @param {number} total
 * @returns {Promise<object>}
 */
async function analyzeOne(imagePath, index, total) {
  const basename = path.basename(imagePath);
  console.error(`[${index}/${total}] analyzing ${basename}...`);

  const result = {
    url: imagePath,
    filename: basename,
    dimensions: getImageDimensions(imagePath),
    status: "pending",
  };

  try {
    const analysis = await analyzeWithVision(imagePath);
    result.analysis = analysis;
    result.status = "ok";
  } catch (err) {
    result.status = "error";
    result.error = err.message;
    console.error(`  ERROR: ${err.message}`);
  }

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const { images, usage, outputDir } = parseArgs(args);

  if (images.length === 0) {
    console.error("Error: no images specified. Use --help for usage.");
    process.exit(1);
  }

  if (!DASHSCOPE_API_KEY) {
    console.error("Error: DASHSCOPE_API_KEY environment variable not set.");
    console.error("  Set it: export DASHSCOPE_API_KEY=your-key-here");
    process.exit(1);
  }

  console.error(`Analyzing ${images.length} image(s)...`);
  console.error(`Vision model: ${VISION_MODEL}`);
  if (usage) console.error(`Usage context: ${usage}`);
  console.error("");

  // Analyze all images sequentially (rate limit aware)
  const results = [];
  for (let i = 0; i < images.length; i++) {
    const result = await analyzeOne(images[i], i + 1, images.length);
    results.push(result);
  }

  // Apply decision matrix for each image
  const allAnalyses = results
    .filter(r => r.status === "ok")
    .map(r => r.analysis);

  for (const result of results) {
    if (result.status !== "ok") continue;

    const analysis = result.analysis;

    // Apply matrix for specified usage
    if (usage) {
      const decision = applyDecisionMatrix(analysis, usage, allAnalyses);
      result.decision = decision;
      result.decision.css = getCSSForStrategy(decision.strategy, analysis.object_position);

      // Override recommended_handling with matrix result
      analysis.recommended_handling = decision.strategy;
    }

    // Apply matrix for all suggested usages
    result.usage_matrix = {};
    const suggestions = analysis.usage_context_suggestions || [];
    for (const ctx of suggestions) {
      const decision = applyDecisionMatrix(analysis, ctx, allAnalyses);
      result.usage_matrix[ctx] = {
        strategy: decision.strategy,
        rule: decision.rule,
        css: getCSSForStrategy(decision.strategy, analysis.object_position),
      };
    }

    // Build gen_image.py commands
    if (analysis.regenerate?.needed) {
      result.gen_image_command = buildGenImageCommand(analysis, outputDir);
    }
  }

  // Output report
  const report = {
    generated_at: new Date().toISOString(),
    model: VISION_MODEL,
    usage_context: usage || null,
    total_images: images.length,
    analyzed: results.filter(r => r.status === "ok").length,
    errors: results.filter(r => r.status === "error").length,
    results: results,
  };

  // Write to file
  const reportPath = "image-analysis-report.json";
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.error(`\nReport written to ${reportPath}`);

  // Print to stdout
  console.log(JSON.stringify(report, null, 2));

  // Print regen commands
  const regenCommands = results
    .filter(r => r.gen_image_command)
    .map(r => r.gen_image_command);

  if (regenCommands.length > 0) {
    console.error(`\n--- Regeneration commands (${regenCommands.length}) ---`);
    for (const cmd of regenCommands) {
      console.error(`  ${cmd}`);
    }
  }

  // Summary
  console.error(`\nDone: ${report.analyzed}/${report.total_images} analyzed, ${report.errors} errors.`);
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});