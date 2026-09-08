# Layout Patterns — Corpus-Driven Skeletons

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** 2026-07-23T12:53:44.918Z
**Purpose:** Применимые скелеты сайтов с конкретными CSS/Tailwind классами и примерами.

> Каждый паттерн извлечён из реальных сайтов corpus. Частоты — от 88 успешных extractions.
> ⚠️ **Hero type "centered" = 73%** — классификатор грубый. Многие "centered" на самом деле full-bleed или product-showcase. Паттерны ниже используют hero_type как один из сигналов, но не единственный.

---

## 1. Asymmetric Hero Split (60/40)

**Vibe:** Динамичный, для продуктов и SaaS

**Когда использовать:** SaaS, tech, product landing — когда нужно показать продукт + ценность одновременно

**Структура:** `hero(asymmetric)→logos→features→stats→cta→footer`

**Hero type:** asymmetric-split

**Частота в corpus:** 11 сайтов (12.5%)

**Примеры из corpus:** arago.inc, blueyard.com, dancerobotphl.com, faces.app, kzero.com

**Tailwind скелет:**
```html
<section class="min-h-screen flex items-center px-8 lg:px-20">
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto w-full">
    <div class="lg:col-span-3 flex flex-col justify-center">
      <h1 class="text-5xl lg:text-6xl font-bold leading-tight">...</h1>
      <p class="text-lg text-gray-500 mt-6 max-w-lg">...</p>
      <div class="flex gap-4 mt-8">...</div>
    </div>
    <div class="lg:col-span-2 relative">
      <img src="..." class="w-full rounded-xl shadow-lg" />
    </div>
  </div>
</section>
```

**Signature element:** 60/40 grid split, image справа на 2/5, текст слева на 3/5

---

## 2. Full-Bleed Product Showcase

**Vibe:** Иммерсивный, визуальный — продукт занимает весь экран

**Когда использовать:** Архитектура, real estate, премиум-продукты, портфолио

**Структура:** `hero(full-image)→features→gallery→content→cta→footer`

**Hero type:** product-showcase

**Частота в corpus:** 9 сайтов (10.2%)

**Примеры из corpus:** artemiilebedev.com, chems.studio, cinedept.com, clouarchitects.com, diamondrosesanctuary.com

**Tailwind скелет:**
```html
<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/30"></div>
  <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
    <h1 class="text-white text-5xl lg:text-7xl font-bold max-w-4xl">...</h1>
    <p class="text-white/80 text-xl mt-6 max-w-2xl">...</p>
  </div>
</section>
```

**Signature element:** full-bleed image hero, text overlay centred, dark overlay 30%

---

## 3. Typography-First Editorial

**Vibe:** Минималистичный, элегантный — текст главный герой

**Когда использовать:** Editorial, agency, portfolio, architecture — когда контент важнее картинок

**Структура:** `hero(typography)→content→gallery→content→cta→footer`

**Hero type:** typography

**Частота в corpus:** 4 сайтов (4.5%)

**Примеры из corpus:** 25residences.com, cerealbnb.com, raycast.com, studioherrstrom.com

**Tailwind скелет:**
```html
<section class="min-h-screen flex flex-col justify-center px-8 lg:px-20 py-24">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-6xl lg:text-8xl font-light leading-[0.95] tracking-tight">...</h1>
    <div class="h-px bg-gray-200 my-12"></div>
    <p class="text-xl text-gray-500 max-w-xl">...</p>
  </div>
</section>
```

**Signature element:** h1 > 60px, font-light, разделительная линия, минимум графики

---

## 4. Bento Mosaic Grid

**Vibe:** Современный, tech-стиль — карточки разного размера в мозаике

**Когда использовать:** SaaS, tech, product features — когда много фич/продуктов нужно показать компактно

**Структура:** `hero→features(bento)→stats→cta→footer`

**Hero type:** centered

**Частота в corpus:** 13 сайтов (14.8%)

**Примеры из corpus:** alias.studio, ch-projects.com, clearwater.london, cushion.so, dragonfly.xyz

**Tailwind скелет:**
```html
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <div class="md:col-span-2 md:row-span-2 bg-gray-100 rounded-2xl p-8">...</div>
      <div class="bg-gray-100 rounded-2xl p-6">...</div>
      <div class="md:row-span-2 bg-gray-100 rounded-2xl p-6">...</div>
      <div class="md:col-span-2 bg-gray-100 rounded-2xl p-6">...</div>
      <div class="bg-gray-100 rounded-2xl p-6">...</div>
    </div>
  </div>
</section>
```

**Signature element:** bento grid, карточки с разным span, rounded-2xl, gap-4

---

## 5. Gallery-Heavy Story

**Vibe:** Визуальное повествование — картинки рассказывают историю

**Когда использовать:** Архитектура, портфолио, travel, lifestyle — когда изображения главный контент

**Структура:** `hero→gallery→gallery→content→gallery→cta→footer`

**Hero type:** product-showcase

**Частота в corpus:** 33 сайтов (37.5%)

**Примеры из corpus:** alias.studio, artemiilebedev.com, blueyard.com, cellag.org, cerealbnb.com

**Tailwind скелет:**
```html
<!-- Gallery grid -->
<section class="px-8 py-24">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <!-- repeat for N images -->
    </div>
  </div>
</section>

<!-- Full-width image -->
<section class="w-full">
  <img src="..." class="w-full h-[60vh] object-cover" />
</section>
```

**Signature element:** много image секций, full-width images, 2-3 column gallery grids

---

## 6. Stats-Heavy Credibility

**Vibe:** Цифры убеждают — для B2B и enterprise

**Когда использовать:** B2B, SaaS enterprise, finance — когда нужно показать масштаб и доверие

**Структура:** `hero→logos→stats→features→stats→cta→footer`

**Hero type:** centered

**Частота в corpus:** 4 сайтов (4.5%)

**Примеры из corpus:** blueyard.com, operate.so, raycast.com, shopify.com

**Tailwind скелет:**
```html
<!-- Stats row -->
<section class="px-8 py-20 bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div>
      <span class="block text-5xl font-bold text-white">99.9%</span>
      <span class="text-gray-400 mt-2 block text-sm">Uptime</span>
    </div>
    <!-- repeat -->
  </div>
</section>
```

**Signature element:** stats как тёмная полоса, 4 колонки, крупные цифры, muted label

---

## 7. Single CTA Landing

**Vibe:** Минималистичный, сфокусированный — одно действие

**Когда использовать:** Coming soon, waitlist, simple product, event page

**Структура:** `hero→cta→footer`

**Hero type:** centered

**Частота в corpus:** 10 сайтов из выборки минимальных (11.4%)

**Примеры из corpus:** aboutluca.com, artemiilebedev.com, becaneparis.com, ch-projects.com, chems.studio

**Tailwind скелет:**
```html
<section class="min-h-screen flex flex-col items-center justify-center text-center px-6">
  <h1 class="text-5xl lg:text-7xl font-bold max-w-2xl">...</h1>
  <p class="text-xl text-gray-500 mt-6 max-w-lg">...</p>
  <form class="flex gap-3 mt-10 max-w-md w-full">
    <input type="email" class="flex-1 px-5 py-3 border border-gray-300 rounded-lg" placeholder="Email" />
    <button class="px-6 py-3 bg-black text-white rounded-lg font-medium">Join</button>
  </form>
</section>
```

**Signature element:** hero → cta, без промежуточных секций, форма в hero

---

## 8. Magazine Editorial Layout

**Vibe:** Контент-центричный, как журнал — статьи, карточки, категории

**Когда использовать:** Блог, media, editorial, content-heavy сайты

**Структура:** `hero→content→content→gallery→content→content→footer`

**Hero type:** typography

**Частота в corpus:** 14 сайтов (15.9%)

**Примеры из corpus:** arago.inc, blueyard.com, cerealbnb.com, clearwater.london, diamondrosesanctuary.com

**Tailwind скелет:**
```html
<!-- Article grid -->
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-12">Latest</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article class="group">
        <div class="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img src="..." class="w-full h-full object-cover group-hover:scale-105 transition" />
        </div>
        <span class="text-sm text-gray-400">Category</span>
        <h3 class="text-xl font-semibold mt-2">...</h3>
        <p class="text-gray-500 mt-2">...</p>
      </article>
    </div>
  </div>
</section>
```

**Signature element:** 3-col article grid, 16/9 images, category label + title + excerpt

---

## 9. 🏗️ Architecture Portfolio

**Vibe:** Пространство, свет, текстура — сайт как архитектурный проект

**Когда использовать:** Архитектура, real estate, строительство, интерьерный дизайн

**Структура:** `hero(full-image)→gallery→content→gallery→cta→footer`

**Hero type:** centered

**Частота в corpus:** 20 сайтов (22.7%) — отдельный architecture-realestate кластер

**Palette hexes:** #322018, #9C9C9C, #F0F0F0, #00FFE5, #252525

**BG:** #F0F0F0 | **Text:** #1C1C1C

**Примеры из corpus:** 25residences.com, archi-malinstudio.com, batcloud.art, biga.cat, ch-projects.com

**Tailwind скелет:**
```html
<!-- Architecture hero: full-bleed image -->
<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  <div class="relative z-10 flex flex-col justify-end h-full px-8 lg:px-20 pb-20">
    <h1 class="text-white text-5xl lg:text-7xl font-light tracking-tight max-w-3xl">Project Name</h1>
    <p class="text-white/70 text-xl mt-4 max-w-xl">Location • Year • Typology</p>
  </div>
</section>

<!-- Project gallery: masonry-like grid -->
<section class="px-8 py-24">
  <div class="max-w-7xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img src="..." class="w-full h-full object-cover hover:scale-105 transition duration-700" />
      </div>
      <div class="aspect-[4/5] bg-gray-100 overflow-hidden">
        <img src="..." class="w-full h-full object-cover hover:scale-105 transition duration-700" />
      </div>
    </div>
  </div>
</section>
```

**Signature element:** full-bleed hero image, bottom-left text overlay, gallery grid с разными aspect ratios, minimal UI, акцент на изображениях

---

## Data Quality Notes

- **Font detection rate:** 55% — font pairs в паттернах приблизительные
- **Hero type classifier:** 73% "centered" — требует ручной доработки
- **Section sequence:** извлечён автоматически, возможны ошибки классификации секций
- **Где сигнал слабый — отмечено.** Не выдумываем.
