# Heterogeneous Product Images: 7 Professional Approaches
## Research: How e-commerce handles photos of different sizes/quality

**Date:** 2026-07-22
**Context:** MakSplit tile factory - 1-4 photos per product, mixed ratios, non-professional, owner objects to cropping.

---

## Sources consulted

| Source | URL | Key finding |
|--------|-----|-------------|
| CSS-Tricks: object-fit | css-tricks.com/almanac/properties/o/object-fit/ | 5 values: fill/contain/cover/none/scale-down. Cover=crops, contain=padding |
| CSS-Tricks: aspect-ratio | css-tricks.com/almanac/properties/a/aspect-ratio/ | aspect-ratio: 1/1 forces square. auto uses intrinsic ratio |
| MDN: object-position | developer.mozilla.org/Web/CSS/object-position | Controls crop focal point: top/bottom/left/right |
| web.dev: Optimize CLS | web.dev/articles/optimize-cls | width+height attrs prevent layout shift via aspect-ratio |
| WooCommerce source | github.com/woocommerce/woocommerce | 3 image sizes, crop toggle, background regeneration |
| WP CSS presets | woocommerce.com/document/product-images-woocommerce-theme/ | Preset ratios: 1, 4/3, 3/4, 16/9, 9/16 |
| Current maksplit | product.html | Main: aspect-square+contain. Cards: h-28+cover |

---

## 7 Concrete Approaches

### Approach 1: Uniform Container + object-contain + Neutral BG

**AKA:** "The Amazon / Contain Approach"

**When:** Product page main image. Non-professional photos, owner objects to cropping.

**Code:**
```html
<div class="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
  <img src="product.jpg" class="max-w-full max-h-full object-contain" alt="Product" />
</div>
```

**Pros:** Zero cropping, works with ANY ratio, owner-friendly
**Cons:** Empty space when ratio mismatch, non-uniform visual weight
**Examples:** Amazon, eBay, AliExpress product detail pages

---

### Approach 2: Uniform aspect-ratio + object-cover (Grid-First)

**AKA:** "The Shopify / IKEA Approach"

**When:** Catalog grid (3-4 columns) where consistency > showing 100% of photo.

**Code:**
```html
<div class="aspect-square overflow-hidden rounded-xl">
  <img src="product.jpg" class="h-full w-full object-cover" alt="Product" />
</div>
```

**Pros:** Perfect grid, no layout shift, dense catalog-friendly
**Cons:** CROPS edges, owner complaints if important details at edges
**Examples:** IKEA catalog, Shopify Dawn, Zara/H&M

**Mitigation:** `object-position: top` for products where top matters.

---

### Approach 3: Contain + Surface BG (Letterbox Frame)

**AKA:** "The Apple / Gallery Approach"

**When:** Product page when photos are heterogeneous and quality varies.

**Code (dark theme):**
```html
<div class="aspect-square bg-slate-900/50 border border-slate-700 rounded-2xl p-4 flex items-center justify-center">
  <img src="product.jpg" class="max-w-full max-h-full object-contain" alt="" />
</div>
```

**Difference from #1:** `p-4` GUARANTEES space around image. Deliberate frame, not accidental whitespace.

**Pros:** Elegant gallery feel, zero cropping, consistent padding
**Cons:** Smaller effective image size, more gallery than shop
**Examples:** Apple product pages, Grainger, McMaster-Carr

---

### Approach 4: Smart Crop with object-position (Focal Point)

**AKA:** "The Focal Point Approach"

**When:** Catalog grid where you want cover + control over what gets cropped.

**Tailwind object-position utilities:**
| Class | CSS | Use case |
|-------|-----|----------|
| `object-center` | `center center` | Default, centered subjects |
| `object-top` | `center top` | Products photographed from above |
| `object-bottom` | `center bottom` | Important base/bottom |
| `object-left` | `left center` | Text/labels on left |
| `object-right` | `right center` | Details on right |

**Code:**
```html
<div class="aspect-square overflow-hidden rounded-xl">
  <img src="product.jpg" class="h-full w-full object-cover object-top" alt="" />
</div>
```

**Pros:** Grid consistency + crop control, automatable via CMS metafield
**Cons:** Requires per-image metadata, still crops
**Examples:** Shopify (focal point metafield), Cloudinary (AI g_auto)

---

### Approach 5: Natural Aspect Ratio (Masonry / Flexible Grid)

**AKA:** "The Pinterest / Etsy Approach"

**When:** Portfolio/lookbook sections that embrace variety.

**Code:**
```html
<div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
  <div class="break-inside-avoid">
    <img src="product1.jpg" class="w-full rounded-xl" alt="" />
    <p class="mt-2 text-sm">Product Name</p>
  </div>
</div>
```

**Pros:** Zero distortion, zero cropping, organic feel
**Cons:** Different card heights, ragged grid, messy for B2B
**Examples:** Pinterest, Etsy, Unsplash

---

### Approach 6: Responsive picture + srcset

**AKA:** "The Performance-First Approach"

**When:** Same image at different sizes across breakpoints.

**Code:**
```html
<picture>
  <source media="(max-width: 768px)" srcset="product-400x400.webp" type="image/webp" />
  <source media="(max-width: 1024px)" srcset="product-600x450.webp" type="image/webp" />
  <img src="product-800x800.jpg"
       srcset="product-400.jpg 400w, product-800.jpg 800w"
       sizes="(max-width: 768px) 100vw, 33vw"
       class="w-full h-auto rounded-xl"
       alt="Product" width="800" height="800" loading="lazy" />
</picture>
```

**WooCommerce context:**
- Auto-generates: woocommerce_thumbnail (300x300), woocommerce_single (600xauto), woocommerce_gallery_thumbnail (100x100)
- Crop toggle: Appearance > Customize > WooCommerce > Product Images
- "Uncropped" option = height:auto, preserves ratio
- Plugin: "Regenerate Thumbnails" after changing crop settings

**Premium WP themes:**
| Theme | Strategy |
|-------|----------|
| Flatsome | Configurable ratio (1:1, 4:3, 3:4, 16:9) + object-cover |
| Astra | object-contain + bg + max-width, no crop |
| Storefront | Uncropped by default, contain |
| WoodMart | Hybrid: cover grid + contain detail + zoom on hover |

**Pros:** Optimal per-device size (50-80% bandwidth savings), CLS=0
**Cons:** Requires server-side processing, complex HTML

---

### Approach 7: Hybrid - Contain on Detail, Cover on Grid

**AKA:** "The Industry Standard (RECOMMENDED for maksplit)"

**When:** RECOMMENDED for CMS-driven product sites with heterogeneous photos.

**Product page (main image):**
```html
<div class="aspect-square bg-slate-900/50 border border-slate-700 rounded-2xl
            flex items-center justify-center p-4 max-w-md mx-auto">
  <img id="mainImage" src="product-main.jpg"
       class="max-w-full max-h-full object-contain" alt="Product" />
</div>

<!-- Thumbnail strip -->
<div class="flex gap-2 mt-4 overflow-x-auto">
  <button class="w-16 h-16 rounded-lg overflow-hidden shrink-0
                 border-2 border-amber-500">
    <img src="thumb1.jpg" class="h-full w-full object-cover" alt="" />
  </button>
  <button class="w-16 h-16 rounded-lg overflow-hidden shrink-0
                 border-2 border-transparent opacity-70 hover:opacity-100">
    <img src="thumb2.jpg" class="h-full w-full object-cover" alt="" />
  </button>
</div>
```

**Catalog grid card:**
```html
<div class="rounded-2xl border border-slate-700 bg-slate-800/30 overflow-hidden">
  <div class="h-32 md:h-40 overflow-hidden">
    <img src="product.jpg" class="h-full w-full object-cover" alt="" />
  </div>
  <div class="p-5">
    <h3 class="text-lg font-semibold text-slate-50">Product Name</h3>
    <span class="font-mono text-lg font-bold text-amber-500">1200/m2</span>
  </div>
</div>
```

**Why this works for maksplit:**
1. Product page: Owner sees full photo (contain, no crop)
2. Catalog grid: Clean uniform rows (cover, consistent height)
3. Thumbnails: Small enough that cover crop is acceptable (64x64)
4. Photo strip height (h-32/h-40): Compact, not dominant

**Examples:** Amazon, Ozon, Wildberries, Leroy Merlin - ALL use this hybrid.

---

## 5 RULES for tokens.md (Images Section)

### RULE I-1: Product Detail Page - CONTAIN, Never Cover

```
IF: rendering product page (detail view)
THEN:
  - Container: aspect-square OR aspect-[4/3], bg-surface, p-4
  - Image: max-w-full max-h-full object-contain
  - Max height: max-h-[320px] md:max-h-[400px]
  - Max width: max-w-md (28rem) on desktop
FORBIDDEN:
  - object-cover on main product image
  - aspect-auto (container stretches with photo)
  - h-full w-full without max-h (photo takes entire screen)
```

### RULE I-2: Catalog Grid - Fixed Height Strip + Cover

```
IF: rendering product card in catalog grid
THEN:
  - Photo: h-32 (128px) OR h-36 (144px), w-full, object-cover
  - Container: overflow-hidden, NO aspect-ratio on whole card
  - Content: p-5 or p-6, takes MORE space than photo
FORBIDDEN:
  - aspect-square + object-cover on whole card (photo dominates)
  - h-full on photo (height from content = crooked cards)
  - object-contain in catalog (different heights = ragged grid)
```

### RULE I-3: Thumbnail Strip - Small Square + Cover

```
IF: rendering gallery thumbnail
THEN:
  - Size: w-14 h-14 (56px) mobile, w-16 h-16 (64px) desktop
  - object-cover, overflow-hidden, rounded-lg
  - Active: border-2 border-accent
  - Inactive: border-2 border-transparent opacity-70
FORBIDDEN:
  - Size > 80px (thumbnails must be small)
  - object-contain (visual noise at small size)
```

### RULE I-4: Branch Logic for Unknown/Mixed Photos

```
IF: photo from CMS with unknown ratio:
  STEP 1: Determine rendering context:
  | Context             | Approach              |
  |---------------------|-----------------------|
  | Product page main   | CONTAIN (I-1)         |
  | Thumbnail           | COVER (I-3)           |
  | Catalog card        | COVER + fixed h (I-2) |
  | Hero/banner         | COVER + position (I-5)|
  | About/testimonials  | Natural ratio         |

  STEP 2: For CONTAIN: always set bg + padding + flex center
  STEP 3: For COVER: always set height/aspect + overflow-hidden
  STEP 4: If photo < 200px: do NOT stretch, use object-contain
```

### RULE I-5: Hero/Banner - Cover + Explicit object-position

```
IF: rendering hero section with image OR banner
THEN:
  - Container: min-h-[400px] md:min-h-[500px], overflow-hidden
  - Image: h-full w-full object-cover
  - object-position REQUIRED: object-top / object-bottom / object-center
FORBIDDEN:
  - object-contain on hero (empty bands = amateur)
  - Missing object-position (center crop may cut top)
```

---

## Anti-Patterns (FORBIDDEN)

| Don't | Do instead | Why |
|-------|-----------|-----|
| object-fill (no object-fit) | Always specify contain or cover | Stretches/distorts |
| aspect-auto with unknown image | aspect-square or aspect-[4/3] | Layout shift |
| h-full w-full without parent height | max-w-full max-h-full bounded | Takes over section |
| No width/height on img tag | width=800 height=600 (approx) | Prevents CLS |
| Mixed cover+contain in same grid | Same approach per grid | Ragged heights |
| bg-white on dark theme | Match bg to theme surface | Alien white box |
| object-cover on product detail | object-contain (Rule I-1) | Owner complains |
| No overflow-hidden on cover | overflow-hidden rounded-XX | Spills outside border |
| Loading all eagerly | loading=lazy except first visible | Performance |

---

## Quick Decision Tree

```
Product Page (detail) --> object-contain + bg + padding + max-h-[400px]
Catalog Grid (cards)  --> h-32 strip + object-cover + overflow-hidden
Thumbnails (gallery)  --> w-16 h-16 + object-cover + border-active
Hero/Banner           --> object-cover + object-position (REQUIRED)
About/Portfolio       --> natural ratio, w-full, h-auto
```

---

## Applicability to MakSplit (Tile Factory)

Given:
- Photos: 1-4 per product, mixed ratios (JPG + PNG), non-professional
- Owner: No cropping on product pages, compact display
- Theme: industrial-dark (#0B2653 bg, slate borders)

**Recommended combination:**
1. Product page main: Rule I-1 (Contain + dark surface bg + p-4)
2. Thumbnails: Rule I-3 (Small square 64x64 + cover)
3. Catalog cards: Rule I-2 (h-32 strip + cover + content-dominant)
4. Similar products: Rule I-2 (same as catalog)
5. Hero (if any): Rule I-5 (Cover + object-position: top)

**bg color for contain containers (dark theme):**
- bg-slate-900/50 (current, good)
- bg-slate-800/40 (slightly lighter, shows tile better)
- bg-[#0D2E5E] (slightly lighter than page bg, subtle)

**NEVER:** bg-white on dark theme, bg-transparent (unpredictable)