# Image Analysis & Decision System (IADS)
## Automated image classification + handling strategy selection

**Date:** 2026-07-22
**Author:** Researcher agent
**Scope:** Reusable across all Pi Make projects (not maksplit-specific)
**Status:** Design complete, ready for implementation

---

## Table of Contents
1. Content Categories
2. Quality Criteria
3. Crop Safety & Large-OK Logic
4. Handling Strategies
5. Decision Matrix (40 rules)
6. JSON Schema
7. Vision Model Prompt
8. MakSplit Application (6 photos)
9. gen_image.py Integration
10. Implementation Plan

---
## 1. Content Categories

10 mutually-exclusive categories. Vision model picks exactly ONE.

| # | ID | Description | Examples |
|---|----|------------|---------|
| 1 | `single-product-clean` | One object on neutral/clean background | Product shot, tile on white |
| 2 | `single-product-context` | One object in real environment | Tile on patio, installed product |
| 3 | `product-group` | Multiple items together | Tile collection, lineup |
| 4 | `texture-macro` | Close-up material surface fills frame | Concrete, stone, wood grain |
| 5 | `lifestyle` | People using product or aspirational scene | Paved terrace dinner |
| 6 | `banner-hero` | Wide composed marketing image | Panoramic with product |
| 7 | `portrait-person` | Person(s) as primary subject | Team photo, craftsman |
| 8 | `abstract-pattern` | Abstract/geometric/decorative | Gradients, geometric shapes |
| 9 | `icon-illustration` | Vector graphic, icon, diagram | SVG icon, technical diagram |
| 10 | `document-screenshot` | Text-heavy, screenshot, certificate | Spec sheet, certificate |

### Disambiguation
- Product on busy street = `single-product-context` (product is subject)
- Close-up tile filling frame = `texture-macro` (no object isolation)
- Wide paved area no people = `banner-hero` if aspect >16:9, else `single-product-context`
- Person holding product = `portrait-person` if face visible, else `single-product-context`

---
## 2. Quality Criteria

### 2.1 Resolution (based on shortest side)
| Bucket | Range | Label |
|--------|-------|-------|
| Low | <400px | `low` |
| Medium | 400-1000px | `med` |
| High | >1000px | `high` |

### 2.2 Lighting
| Value | Score impact |
|-------|-------------|
| `poor` | -2 |
| `ok` | 0 |
| `good` | +2 |

### 2.3 Background
| Value | Description |
|-------|------------|
| `clean` | Neutral solid/light color |
| `busy` | Cluttered, noisy |
| `none` | Transparent PNG |

### 2.4 Sharpness
- `blurry` (-2): out of focus, compression artifacts
- `ok` (0): acceptable
- `sharp` (+1): crisp details

### 2.5 White Balance
- `warm`: yellowish cast (distorts material colors)
- `neutral`: accurate (+1 bonus)
- `cool`: bluish cast

### 2.6 Composite Score (0-10)

```
score = clamp(base + lighting + sharpness + bg + wb, 0, 10)
base: low=2, med=5, high=7
lighting: poor=-2, ok=0, good=+2
sharpness: blurry=-2, ok=0, sharp=+1
background: none=+1, clean=0, busy=-1
white_balance: neutral=+1, warm=0, cool=0
```

Thresholds: 8-10 excellent, 5-7 acceptable, 0-4 poor

---
## 3. Crop Safety & Large-OK Logic

### 3.1 crop_safe (boolean | "partial")

| Value | Conditions | CSS |
|-------|-----------|-----|
| `true` | Subject 30-70% frame, centered, clean edges, no text near borders | object-cover safe |
| `false` | Subject >80% frame, details at edges, texture, icon, document | object-contain only |
| `"partial"` | Subject off-center, can crop from one direction | object-cover + object-position |

### 3.2 large_ok (boolean)

```
large_ok = true IF ALL:
  resolution=high AND sharpness in [sharp,ok] AND lighting in [ok,good]
  AND background in [clean,none] AND score >= 6

large_ok = false IF ANY:
  resolution=low OR sharpness=blurry OR score<5
  OR (background=busy AND usage needs clean presentation)
```

---
## 4. Handling Strategies

| # | Strategy | CSS/Action | When |
|---|---------|-----------|------|
| 1 | `contain` | object-contain | Product detail, icons |
| 2 | `cover` | object-cover | Textures, catalog cards |
| 3 | `contain-pad` | contain + p-4 + bg-surface | Gallery, product showcase |
| 4 | `cover-position` | cover + object-position | Hero banners with focal point |
| 5 | `thumbnail-cover` | small cover (w-16 h-16) | Thumbnail strips |
| 6 | `natural` | w-full h-auto | About, portfolio |
| 7 | `regenerate-similar` | AI gen (gen_image.py) | Product OK, bg/quality bad |
| 8 | `generate-new` | AI gen (gen_image.py) | No photo, need mood/scene |
| 9 | `enhance` | Post-process (future) | Good photo, minor tweaks |
| 10 | `reject` | Don't use | Unsalvageable |

### Regenerate-similar triggers (ALL must be true):
1. content_type in {single-product-clean, single-product-context, product-group}
2. At least ONE: background=busy+score<7, resolution=low, lighting=poor, WB!=neutral+color-sensitive
3. Subject identifiable and worth keeping

### Generate-new triggers (ANY):
1. No suitable photo for usage context
2. Need hero/banner mood shot and none available
3. Need abstract texture/background
4. All photos scored <4 and can't regenerate

---
## 5. Decision Matrix (40 rules)

Deterministic. First match wins. Ordered by priority (most specific first).

### Group A: Reject (R01-R03)
| Rule | Condition | Result |
|------|----------|--------|
| R01 | sharpness=blurry AND resolution=low | reject |
| R02 | composite_score <= 2 | reject |
| R03 | document-screenshot AND usage in {hero,catalog,lifestyle} | reject |

### Group B: Regenerate/Generate (R04-R12)
| Rule | Condition | Result |
|------|----------|--------|
| R04 | single-product-clean + res=low + usage=product-main | regenerate-similar |
| R05 | single-product-clean + bg=busy + usage=product-main | regenerate-similar |
| R06 | single-product-context + bg=busy + usage=product-main + score<6 | regenerate-similar |
| R07 | single-product-clean + lighting=poor + usage in {product-main,catalog} | regenerate-similar |
| R08 | single-product-clean + WB!=neutral + score<6 + usage=product-main | regenerate-similar |
| R09 | usage=hero-banner + no banner-hero available | generate-new |
| R10 | usage=lifestyle-block + no lifestyle available | generate-new |
| R11 | single-product-clean + res=low + score<4 | regenerate-similar |
| R12 | texture-macro + res=low + usage in {hero,category-cover} | regenerate-similar |

### Group C: Contain (R13-R19)
| Rule | Condition | Result |
|------|----------|--------|
| R13 | single-product-clean + usage=product-main + crop_safe=false | contain-pad |
| R14 | single-product-clean + usage=product-main + crop_safe=true + score>=6 | contain-pad |
| R15 | single-product-clean + usage=product-main + score>=5 | contain-pad |
| R16 | icon-illustration + usage in {product-main,catalog-card} | contain |
| R17 | document-screenshot (not rejected) | contain |
| R18 | single-product-clean + res=low + score>=3 + usage=thumbnail | contain |
| R19 | portrait-person + usage in {lifestyle-block,og-image} | contain |

### Group D: Cover (R20-R29)
| Rule | Condition | Result |
|------|----------|--------|
| R20 | texture-macro + usage in {catalog-card,inline-texture} | cover |
| R21 | texture-macro + usage=hero + score>=6 | cover-position |
| R22 | banner-hero + usage=hero + score>=6 | cover-position |
| R23 | lifestyle + usage=hero + res=high | cover-position |
| R24 | lifestyle + usage=lifestyle-block + score>=5 | cover |
| R25 | single-product-context + usage=catalog-card | cover |
| R26 | product-group + usage=catalog-card | cover |
| R27 | product-group + usage=category-cover + score>=6 | cover-position |
| R28 | single-product-clean + usage=catalog-card + score>=5 | cover |
| R29 | portrait-person + usage=catalog-card | cover-position (top) |

### Group E: Thumbnail & Special (R30-R35)
| Rule | Condition | Result |
|------|----------|--------|
| R30 | usage=product-thumbnail + score>=3 | thumbnail-cover |
| R31 | usage=product-thumbnail + score<3 | reject |
| R32 | abstract-pattern + usage in {hero,category-cover} | cover |
| R33 | abstract-pattern + usage=inline-texture | cover |
| R34 | usage=og-image + content in {banner-hero,lifestyle} + score>=6 | cover-position |
| R35 | usage=og-image + single-product-clean | contain-pad |

### Group F: Fallbacks (R36-R40)
| Rule | Condition | Result |
|------|----------|--------|
| R36 | crop_safe=true + usage in {catalog-card,category-cover} | cover |
| R37 | crop_safe=false | contain |
| R38 | crop_safe="partial" | cover-position |
| R39 | large_ok=false + usage needs large display | regenerate-similar |
| R40 | DEFAULT (no match) | contain |

### Quick Reference Matrix

```
                      | prod-main | thumbnail | catalog | cat-cover | hero      | inline-tex | lifestyle | og-image |
----------------------|-----------|-----------|---------|-----------|-----------|-----------|-----------|---------|
single-product-clean  | cont-pad  | thumb-cov | cover*  | cover*    | gen-new   | contain   | gen-new   | cont-pad |
single-product-ctx    | cont/reg  | thumb-cov | cover   | cover-pos | gen-new   | cover     | cover     | cover-pos|
product-group         | cont-pad  | thumb-cov | cover   | cover-pos | gen-new   | cover     | cover     | cover-pos|
texture-macro         | cont-pad  | thumb-cov | cover   | cover     | cover-pos | cover     | cover     | cover    |
lifestyle             | gen-new   | thumb-cov | cover   | cover-pos | cover-pos | cover     | cover     | cover-pos|
banner-hero           | reject    | reject    | reject  | cover-pos | cover-pos | reject    | reject    | cover-pos|
portrait-person       | contain   | thumb-cov | cover-p | contain   | gen-new   | contain   | contain   | contain  |
abstract-pattern      | reject    | reject    | cover   | cover     | cover     | cover     | cover     | cover    |
icon-illustration     | contain   | contain   | contain | contain   | reject    | contain   | reject    | contain  |
document-screenshot   | contain   | contain   | reject  | reject    | reject    | contain   | reject    | reject   |
```
* cover only if score>=5, else regenerate-similar

---
## 6. JSON Schema

Strict output format for vision model. All fields REQUIRED unless marked optional.

### Schema Definition

```json
{
  "url": "string - original image URL",
  "filename": "string - filename from URL",
  "content_type": "enum[10 values - see Section 1]",
  "quality": {
    "resolution": "low | med | high",
    "resolution_px": {
      "width": "integer (estimated)",
      "height": "integer (estimated)",
      "shortest_side": "integer"
    },
    "lighting": "poor | ok | good",
    "background": "clean | busy | none",
    "sharpness": "blurry | ok | sharp",
    "white_balance": "warm | neutral | cool",
    "score": "number 0-10"
  },
  "crop_safe": "boolean | partial",
  "crop_safe_reason": "string",
  "object_position": "center|top|bottom|left|right (required if crop_safe=partial)",
  "large_ok": "boolean",
  "recommended_handling": "enum[10 values - see Section 4]",
  "usage_context_suggestions": ["array of usage contexts"],
  "regenerate": {
    "needed": "boolean",
    "mode": "similar | new | none",
    "prompt": "English prompt for gen_image.py",
    "preserve_subject": "boolean",
    "reason": "string",
    "suggested_size": "1024*1024 | 1280*720 | 720*1280 | 768*1152"
  },
  "css_recommendation": {
    "object_fit": "contain | cover | none | scale-down",
    "object_position": "string (optional)",
    "container_classes": "Tailwind classes for container div",
    "image_classes": "Tailwind classes for img element"
  },
  "confidence": "number 0.0-1.0",
  "reasoning": "string - explanation"
}
```

### TypeScript Interface

```typescript
interface ImageAnalysis {
  url: string;
  filename: string;
  content_type: ContentType;
  quality: {
    resolution: "low" | "med" | "high";
    resolution_px?: { width: number; height: number; shortest_side: number };
    lighting: "poor" | "ok" | "good";
    background: "clean" | "busy" | "none";
    sharpness: "blurry" | "ok" | "sharp";
    white_balance: "warm" | "neutral" | "cool";
    score: number;
  };
  crop_safe: boolean | "partial";
  crop_safe_reason: string;
  object_position?: ObjectPosition;
  large_ok: boolean;
  recommended_handling: HandlingStrategy;
  usage_context_suggestions: UsageContext[];
  regenerate: {
    needed: boolean;
    mode: "similar" | "new" | "none";
    prompt: string;
    preserve_subject: boolean;
    reason: string;
    suggested_size?: ImageSize;
  };
  css_recommendation: {
    object_fit: "contain" | "cover" | "none" | "scale-down";
    object_position?: string;
    container_classes: string;
    image_classes: string;
  };
  confidence: number;
  reasoning: string;
}

type ContentType = "single-product-clean" | "single-product-context" |
  "product-group" | "texture-macro" | "lifestyle" | "banner-hero" |
  "portrait-person" | "abstract-pattern" | "icon-illustration" | "document-screenshot";

type HandlingStrategy = "contain" | "cover" | "contain-pad" | "cover-position" |
  "thumbnail-cover" | "natural" | "regenerate-similar" | "generate-new" |
  "enhance" | "reject";

type UsageContext = "product-main" | "product-thumbnail" | "catalog-card" |
  "category-cover" | "hero-banner" | "inline-texture" | "lifestyle-block" | "og-image";

type ObjectPosition = "center" | "top" | "bottom" | "left" | "right" |
  "top-left" | "top-right" | "bottom-left" | "bottom-right";

type ImageSize = "1024*1024" | "1280*720" | "720*1280" | "768*1152";
```

---
## 7. Vision Model Prompt

**Model:** clipproxy/vl/qwen3-vl-plus or dashscope/qwen-vl-max
**Use:** Send image + this prompt. Expect pure JSON response.

### System Prompt (copy-paste ready)

```
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
}
```

### Caller Metadata (prepend when known)

```
Image URL: {url}
Filename: {filename}
Known dimensions: {width}x{height}
Product: {product_name}
Project theme: {theme}
```

---
## 8. MakSplit Application (6 photos)

Based on known dimensions. Vision model would refine.

### Photo 1: insMind.jpg (1600x1153, landscape)
Featured image, AI-enhanced.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/insMind.jpg",
  "filename": "insMind.jpg",
  "content_type": "single-product-clean",
  "quality": {
    "resolution": "high",
    "resolution_px": {
      "width": 1600,
      "height": 1153,
      "shortest_side": 1153
    },
    "lighting": "good",
    "background": "clean",
    "sharpness": "sharp",
    "white_balance": "neutral",
    "score": 10
  },
  "crop_safe": true,
  "large_ok": true,
  "recommended_handling": "contain-pad",
  "usage_context_suggestions": [
    "product-main",
    "og-image",
    "catalog-card"
  ],
  "regenerate": {
    "needed": false,
    "mode": "none",
    "prompt": "",
    "preserve_subject": false,
    "reason": "Quality sufficient"
  },
  "confidence": 0.85,
  "reasoning": "Featured image, AI-enhanced. 1600x1153 (landscape)."
}
```

### Photo 2: Kirpichik1-1.png (509x378, landscape)
Secondary gallery.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/Kirpichik1-1.png",
  "filename": "Kirpichik1-1.png",
  "content_type": "single-product-clean",
  "quality": {
    "resolution": "med",
    "resolution_px": {
      "width": 509,
      "height": 378,
      "shortest_side": 378
    },
    "lighting": "ok",
    "background": "clean",
    "sharpness": "ok",
    "white_balance": "neutral",
    "score": 5
  },
  "crop_safe": true,
  "large_ok": false,
  "recommended_handling": "contain-pad",
  "usage_context_suggestions": [
    "product-main",
    "product-thumbnail",
    "catalog-card"
  ],
  "regenerate": {
    "needed": true,
    "mode": "similar",
    "prompt": "rectangular paving brick tile grey brick pattern clean white bg studio lighting highres top-down e-commerce",
    "preserve_subject": true,
    "reason": "378px below 400px threshold",
    "suggested_size": "1024*1024"
  },
  "confidence": 0.7,
  "reasoning": "Secondary gallery. 509x378 (landscape)."
}
```

### Photo 3: Kirpichik-1.png (445x386, near-square)
Third gallery.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/Kirpichik-1.png",
  "filename": "Kirpichik-1.png",
  "content_type": "single-product-clean",
  "quality": {
    "resolution": "med",
    "resolution_px": {
      "width": 445,
      "height": 386,
      "shortest_side": 386
    },
    "lighting": "ok",
    "background": "clean",
    "sharpness": "ok",
    "white_balance": "neutral",
    "score": 5
  },
  "crop_safe": true,
  "large_ok": false,
  "recommended_handling": "contain-pad",
  "usage_context_suggestions": [
    "product-main",
    "product-thumbnail"
  ],
  "regenerate": {
    "needed": true,
    "mode": "similar",
    "prompt": "paving brick tile arrangement grey-brown clean white bg studio lighting highres top-down e-commerce",
    "preserve_subject": true,
    "reason": "386px borderline quality",
    "suggested_size": "1024*1024"
  },
  "confidence": 0.7,
  "reasoning": "Third gallery. 445x386 (near-square)."
}
```

### Photo 4: Domino.jpg (342x335, square)
Domino product main.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/Domino.jpg",
  "filename": "Domino.jpg",
  "content_type": "single-product-clean",
  "quality": {
    "resolution": "low",
    "resolution_px": {
      "width": 342,
      "height": 335,
      "shortest_side": 335
    },
    "lighting": "ok",
    "background": "clean",
    "sharpness": "ok",
    "white_balance": "neutral",
    "score": 3
  },
  "crop_safe": true,
  "large_ok": false,
  "recommended_handling": "regenerate-similar",
  "usage_context_suggestions": [
    "product-thumbnail"
  ],
  "regenerate": {
    "needed": true,
    "mode": "similar",
    "prompt": "domino pattern paving tiles grey concrete alternating brick pattern clean white bg studio lighting highres top-down e-commerce professional",
    "preserve_subject": true,
    "reason": "335px low. Only thumbnail usable. HIGH PRIORITY.",
    "suggested_size": "1024*1024"
  },
  "confidence": 0.75,
  "reasoning": "Domino product main. 342x335 (square)."
}
```

### Photo 5: Staryj-gorod.png (387x387, square)
Staryj Gorod main.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/Staryj-gorod.png",
  "filename": "Staryj-gorod.png",
  "content_type": "texture-macro",
  "quality": {
    "resolution": "low",
    "resolution_px": {
      "width": 387,
      "height": 387,
      "shortest_side": 387
    },
    "lighting": "ok",
    "background": "clean",
    "sharpness": "ok",
    "white_balance": "warm",
    "score": 3
  },
  "crop_safe": false,
  "large_ok": false,
  "recommended_handling": "regenerate-similar",
  "usage_context_suggestions": [
    "product-thumbnail"
  ],
  "regenerate": {
    "needed": true,
    "mode": "similar",
    "prompt": "old town cobblestone paving pattern irregular natural stone grey-brown weathered texture clean neutral bg studio lighting highres top-down e-commerce",
    "preserve_subject": true,
    "reason": "387px low + warm WB. HIGH PRIORITY.",
    "suggested_size": "1024*1024"
  },
  "confidence": 0.7,
  "reasoning": "Staryj Gorod main. 387x387 (square)."
}
```

### Photo 6: Krakovskij-klever.png (346x346, square)
Krakovskij Klever main.

```json
{
  "url": "https://maksplit.ru/wp-content/uploads/2024/09/Krakovskij-klever.png",
  "filename": "Krakovskij-klever.png",
  "content_type": "texture-macro",
  "quality": {
    "resolution": "low",
    "resolution_px": {
      "width": 346,
      "height": 346,
      "shortest_side": 346
    },
    "lighting": "ok",
    "background": "clean",
    "sharpness": "ok",
    "white_balance": "neutral",
    "score": 3
  },
  "crop_safe": false,
  "large_ok": false,
  "recommended_handling": "regenerate-similar",
  "usage_context_suggestions": [
    "product-thumbnail"
  ],
  "regenerate": {
    "needed": true,
    "mode": "similar",
    "prompt": "clover-shaped paving stones Krakow style interlocking clover shapes grey concrete clean white bg studio lighting highres top-down e-commerce",
    "preserve_subject": true,
    "reason": "346px low. Pattern details lost. HIGH PRIORITY.",
    "suggested_size": "1024*1024"
  },
  "confidence": 0.7,
  "reasoning": "Krakovskij Klever main. 346x346 (square)."
}
```

### Summary

| # | File | Size | Score | Handling | Regen? | Priority |
|---|------|------|-------|----------|--------|----------|
| 1 | insMind.jpg | 1600x1153 | 10 | contain-pad | No | - |
| 2 | Kirpichik1-1.png | 509x378 | 5 | contain-pad | Yes | Medium |
| 3 | Kirpichik-1.png | 445x386 | 5 | contain-pad | Yes | Medium |
| 4 | Domino.jpg | 342x335 | 3 | REGEN | Yes | HIGH |
| 5 | Staryj-gorod | 387x387 | 3 | REGEN | Yes | HIGH |
| 6 | Krakovskij-klever | 346x346 | 3 | REGEN | Yes | HIGH |

### Batch Regeneration Prompts

All 5 low/med photos should be regenerated at 1024x1024 via gen_image.py.
Prompts included in each photo JSON above (regenerate.prompt field).

---
## 9. gen_image.py Integration

### Flow: image-analyzer -> gen_image.py

```
image-analyzer.js
  |
  +-> Analyze image (vision model) -> ImageAnalysis JSON
  |
  +-> Check recommended_handling
  |     |
  |     +-> regenerate-similar / generate-new:
  |     |     Build: python D:/pi/scripts/gen_image.py   |     |       --prompt "{regenerate.prompt}"   |     |       --size "{regenerate.suggested_size}"   |     |       --model "wanx2.1-t2i-turbo"   |     |       --output "{output_dir}/{filename}-regen.png"
  |     |
  |     +-> reject: Log warning, skip
  |     +-> enhance: Queue for future post-processing
  |     +-> others: Use as-is with CSS recommendation
  |
  +-> Return updated ImageAnalysis with regenerated path
```

### Parameter Mapping

| ImageAnalysis field | gen_image.py param | Notes |
|---------------------|-------------------|-------|
| regenerate.prompt | --prompt | English, subject + quality keywords |
| regenerate.suggested_size | --size | 1024*1024 products, 1280*720 banners |
| (default) | --model | wanx2.1-t2i-turbo (fast), wan2.7-image-pro (quality retry) |
| computed | --output | {project}/images/regen/{filename}-regen.png |

### Output Naming Convention

```
original:     insMind.jpg
regenerated:  insMind-regen.png
generated:    hero-banner-gen.png
```

### Batch Regeneration Flow

```javascript
// 1. Collect images needing regeneration
const toRegen = analyses.filter(a => a.regenerate.needed);

// 2. Build batch JSON
const batch = toRegen.map(a => ({
  name: a.filename.replace(/\.[^.]+$/, '') + '-regen',
  prompt: a.regenerate.prompt,
  size: a.regenerate.suggested_size || '1024*1024'
}));

// 3. Write batch file
fs.writeFileSync('regen-batch.json', JSON.stringify(batch, null, 2));

// 4. Execute batch
execSync('python D:/pi/scripts/gen_image.py --batch regen-batch.json --output-dir images/regen/');

// 5. Update analyses
toRegen.forEach(a => {
  a.regenerated_path = 'images/regen/' + a.filename.replace(/\.[^.]+$/, '') + '-regen.png';
  a.recommended_handling = 'contain-pad'; // Now has high-res version
});
```

### Project Model Integration (image metadata in project.json)

```json
{
  "images": {
    "insMind.jpg": {
      "analysis": { "... ImageAnalysis JSON ..." : true },
      "original_path": "images/insMind.jpg",
      "regen_path": null,
      "handling": "contain-pad",
      "css": {
        "product-main": {
          "container": "aspect-square bg-slate-900/50 rounded-2xl p-4 flex items-center justify-center max-w-sm mx-auto",
          "image": "max-w-full max-h-full object-contain"
        },
        "catalog-card": {
          "container": "h-32 md:h-40 overflow-hidden",
          "image": "h-full w-full object-cover"
        },
        "thumbnail": {
          "container": "w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 border-transparent opacity-70",
          "image": "h-full w-full object-cover"
        }
      }
    }
  }
}
```

---

## 10. Implementation Plan

### Phase 1: image-analyzer.js (Core)

**Location:** `~/.pi/agent/scripts/image-analyzer.js`
**Runtime:** Node.js (with fetch or axios for API calls)

**Inputs:**
- Image URL or local path (required)
- Known dimensions (optional, from HTTP headers / CMS)
- Product context (optional, from project data)
- Project theme (optional)
- Usage context (optional, or "auto" to suggest)

**Outputs:**
- ImageAnalysis JSON (Section 6 schema)
- Regenerated image path (if handling = regenerate/generate)

**Steps:**
1. Accept input (URL, optional metadata)
2. Load image into vision model (clipproxy/vl/qwen3-vl-plus or dashscope/qwen-vl-max)
3. Send image as base64 or URL + system prompt from Section 7
4. Parse JSON response, validate against schema
5. Fill url/filename if model left empty
6. Apply decision matrix (Section 5) if usage_context provided
7. If regeneration needed: build gen_image.py command, execute, update analysis
8. Compute CSS recommendations per usage context (from tokens.md I-1..I-5)
9. Return complete ImageAnalysis JSON

**Error handling:**
- Vision timeout: retry once, return partial (dimensions only)
- Invalid JSON: retry with stricter prompt
- gen_image.py failure: mark regenerate.needed=true, mode=pending
- Image 404: mark reject, reason=unreachable

### Phase 2: batch-analyzer.js

**Input:** Array of image URLs + project context
**Output:** Array of ImageAnalysis + batch regen file

1. Accept images array (from products.json gallery fields)
2. Process each through image-analyzer.js (sequential, rate limit aware)
3. Collect all regenerate-needed images
4. Build regen-batch.json for gen_image.py
5. Execute batch generation
6. Write results to project model (images section)
7. Generate summary report

### Phase 3: ui-coder Integration

How ui-coder uses analysis results:
1. Before generating HTML, check project.json images section
2. For each image: look up analysis, use css_recommendation for target context
3. If regenerated version exists, use regen_path instead of original
4. Apply handling strategy (contain-pad, cover, etc.)
5. Never override analysis without re-running analyzer

### Phase 4: Periodic Re-analysis

- New images added to CMS: auto-analyze
- Theme changes: re-evaluate CSS recommendations only
- gen_image.py model upgraded: re-generate pending items
- Manual: `node image-analyzer.js --reanalyze --project maksplit`

### File Structure

```
~/.pi/agent/scripts/
  image-analyzer.js          # Single image analysis
  batch-analyzer.js          # Bulk processing
  image-analysis-prompt.md   # Vision prompt (Section 7)

<project>/
  images/
    original/                # Original photos
    regen/                   # AI-regenerated versions
    gen/                     # AI-generated new images
  image-analysis.json        # All analyses for this project
  regen-batch.json           # Pending regeneration queue
```

### Agent Contract (for subagent definition)

```yaml
name: image-analyzer
description: >
  Analyzes images using vision model. Returns structured JSON with
  content type, quality score, crop safety, recommended CSS handling,
  and regeneration prompts. Reusable across all projects.
model: dashscope/qwen-vl-max
fallbackModel: clipproxy/vl/qwen3-vl-plus
tools: bash, read, write
thinking: low
```

---

## Appendix A: Comparison with Current tokens.md Rules

| Current Rule | IADS Equivalent | Improvement |
|-------------|----------------|-------------|
| I-1 (product page = contain) | R13-R15 | Same + quality-aware regen |
| I-2 (catalog = cover + fixed h) | R25-R28 | Score threshold + regen for low quality |
| I-3 (thumbnail = cover) | R30-R31 | Reject for score<3 |
| I-4 (branch logic) | Full decision matrix | 40 rules vs 5 branches |
| I-5 (hero = cover + position) | R21-R23, R32 | Content-type aware + generate-new fallback |

**IADS supersedes I-1..I-5** but is backward-compatible.
tokens.md rules become the CSS layer; IADS adds the intelligence layer above.

## Appendix B: Future Enhancements

1. **Super-resolution:** Real-ESRGAN for photos that are good but small (replace some regenerate-similar)
2. **Background removal:** rembg for contain-pad without bg mismatch
3. **Color calibration:** Use white_balance data for auto CSS filter correction
4. **Smart object-position:** Vision focal point detection instead of manual
5. **Batch optimization:** Parallel processing with queue management
6. **CMS webhook:** Auto-analyze on WordPress media upload
7. **Confidence threshold:** If confidence < 0.6, flag for human review
8. **A/B testing:** Compare AI-regenerated vs original in catalog cards

---

## Appendix C: CSS Class Reference by Handling Strategy

| Strategy | Container classes | Image classes |
|----------|------------------|---------------|
| contain | `aspect-square bg-surface rounded-2xl flex items-center justify-center` | `max-w-full max-h-full object-contain` |
| cover | `h-32 md:h-40 overflow-hidden` | `h-full w-full object-cover` |
| contain-pad | `aspect-square bg-slate-900/50 rounded-2xl p-4 flex items-center justify-center max-w-sm` | `max-w-full max-h-full object-contain` |
| cover-position | `min-h-[400px] md:min-h-[500px] overflow-hidden` | `h-full w-full object-cover object-[position]` |
| thumbnail-cover | `w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden` | `h-full w-full object-cover` |
| natural | (none) | `w-full h-auto rounded-xl` |

Where `bg-surface` = theme-dependent (dark: bg-slate-900/50, light: bg-gray-100).

---

*End of Image Analysis & Decision System design document.*
