# Composition Primitives — Стройблоки

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** 2026-07-23T12:53:44.918Z
**Purpose:** Tailwind сниппеты для часто встречающихся секций. Каждый — из реального сайта.

---

## Hero Variants

### 1. Asymmetric Split (60/40)

Текст слева 3/5, изображение справа 2/5. Динамичный, для продуктов.

**Example:** arago.inc

```html
<section class="min-h-screen flex items-center px-8 lg:px-20">
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto w-full items-center">
    <div class="lg:col-span-3 space-y-6">
      <span class="text-sm font-medium text-primary tracking-wide uppercase">Tagline</span>
      <h1 class="text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
        Headline that <span class="text-primary">converts</span>
      </h1>
      <p class="text-lg text-gray-500 max-w-lg">Subheadline explaining the value proposition in one or two sentences.</p>
      <div class="flex gap-4 pt-4">
        <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">Get started</a>
        <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition">Learn more</a>
      </div>
    </div>
    <div class="lg:col-span-2">
      <img src="..." class="w-full rounded-xl shadow-lg" alt="Hero image" />
    </div>
  </div>
</section>
```

### 2. Full-Bleed Image

Изображение на весь экран с текстовым оверлеем. Иммерсивный, для архитектуры/портфолио.

**Example:** artemiilebedev.com

```html
<section class="relative h-screen w-full overflow-hidden">
  <img src="..." class="absolute inset-0 w-full h-full object-cover" alt="Hero background" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
  <div class="relative z-10 flex flex-col justify-end h-full px-8 lg:px-20 pb-20">
    <h1 class="text-white text-5xl lg:text-7xl font-light tracking-tight max-w-3xl">
      Project Name
    </h1>
    <p class="text-white/70 text-xl mt-4">Location • Year • Typology</p>
  </div>
</section>
```

### 3. Typography-First

Большой текст, минимум графики. Элегантный, для editorial/agency.

**Example:** 25residences.com

```html
<section class="min-h-screen flex flex-col justify-center px-8 lg:px-20 py-24">
  <div class="max-w-5xl mx-auto">
    <h1 class="text-6xl lg:text-8xl font-light leading-[0.95] tracking-tight">
      We design<br />experiences
    </h1>
    <div class="h-px bg-gray-200 my-12"></div>
    <p class="text-xl text-gray-500 max-w-xl leading-relaxed">
      A studio focused on creating meaningful digital products that people love to use.
    </p>
  </div>
</section>
```

### 4. Centered Product

Всё по центру: текст, CTA, изображение продукта. Универсальный.

**Example:** 25residences.com

```html
<section class="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24">
  <span class="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">New feature</span>
  <h1 class="text-5xl lg:text-6xl font-bold max-w-3xl mt-6 leading-tight">
    The easiest way to <span class="text-primary">build</span> something great
  </h1>
  <p class="text-lg text-gray-500 mt-6 max-w-xl">
    Description of what the product does and why people should care.
  </p>
  <div class="flex gap-4 mt-8">
    <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">Start free trial</a>
    <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Watch demo</a>
  </div>
  <img src="..." class="mt-16 max-w-4xl w-full rounded-xl shadow-2xl" alt="Product screenshot" />
</section>
```

### 5. Split Screen

Две половины: изображение слева, текст справа (50/50).

**Example:** combine asymmetric-split with image_position=left

```html
<section class="min-h-screen grid grid-cols-1 lg:grid-cols-2">
  <div class="h-64 lg:h-full">
    <img src="..." class="w-full h-full object-cover" alt="Hero" />
  </div>
  <div class="flex flex-col justify-center px-8 lg:px-20 py-16">
    <h1 class="text-5xl lg:text-6xl font-bold leading-tight">Headline</h1>
    <p class="text-lg text-gray-500 mt-6 max-w-md">Subheadline</p>
    <div class="flex gap-4 mt-8">
      <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">CTA</a>
    </div>
  </div>
</section>
```

## Feature Section Variants

### Icon Grid (3-col)

Три колонки с иконками, заголовком и описанием. Самый частый паттерн.

```html
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-4">Features</h2>
    <p class="text-gray-500 text-center max-w-xl mx-auto mb-16">Why people choose us</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-8 rounded-xl hover:bg-gray-50 transition">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary">...</svg>
        </div>
        <h3 class="text-lg font-semibold">Feature name</h3>
        <p class="text-gray-500 mt-2 text-sm">Short description of this feature and its benefit.</p>
      </div>
      <!-- repeat -->
    </div>
  </div>
</section>
```

### Alternating Rows

Чередование текст-изображение, изображение-текст. Для storytelling.

```html
<section class="px-8 py-24 space-y-32">
  <div class="max-w-6xl mx-auto">
    <!-- Row 1: text left, image right -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="space-y-4">
        <h3 class="text-2xl font-bold">Feature one</h3>
        <p class="text-gray-500">Description of the first key feature.</p>
      </div>
      <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
        <img src="..." class="w-full h-full object-cover" />
      </div>
    </div>
    <!-- Row 2: image left, text right -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div class="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden lg:order-1">
        <img src="..." class="w-full h-full object-cover" />
      </div>
      <div class="space-y-4">
        <h3 class="text-2xl font-bold">Feature two</h3>
        <p class="text-gray-500">Description of the second key feature.</p>
      </div>
    </div>
  </div>
</section>
```

### Bento Feature Grid

Карточки разного размера в мозаике. Современный, для SaaS.

```html
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold text-center mb-16">Everything you need</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
      <div class="md:col-span-2 md:row-span-2 bg-gray-50 rounded-2xl p-8 flex flex-col justify-between">
        <div>
          <h3 class="text-xl font-semibold">Main feature</h3>
          <p class="text-gray-500 mt-2">Detailed description</p>
        </div>
        <div class="bg-gray-200 rounded-xl h-32 mt-4"></div>
      </div>
      <div class="bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Feature</h3>
        <p class="text-gray-500 text-sm mt-2">Brief</p>
      </div>
      <div class="md:row-span-2 bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Tall feature</h3>
        <p class="text-gray-500 text-sm mt-2">More detail</p>
      </div>
      <div class="md:col-span-2 bg-gray-50 rounded-2xl p-6">
        <h3 class="font-semibold">Wide feature</h3>
        <p class="text-gray-500 text-sm mt-2">Wide card</p>
      </div>
    </div>
  </div>
</section>
```

### Stat Row

4 колонки с крупными цифрами. Для credibility/social proof.

```html
<section class="px-8 py-20 bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div>
      <span class="block text-5xl font-bold">99.9%</span>
      <span class="text-gray-400 mt-2 block text-sm">Uptime SLA</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">10M+</span>
      <span class="text-gray-400 mt-2 block text-sm">Users</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">150+</span>
      <span class="text-gray-400 mt-2 block text-sm">Countries</span>
    </div>
    <div>
      <span class="block text-5xl font-bold">4.9</span>
      <span class="text-gray-400 mt-2 block text-sm">Rating</span>
    </div>
  </div>
</section>
```

## CTA Variants

### Centered Banner

Центрированный призыв к действию с заголовком и кнопкой.

```html
<section class="px-8 py-24 text-center">
  <div class="max-w-2xl mx-auto">
    <h2 class="text-3xl lg:text-4xl font-bold">Ready to get started?</h2>
    <p class="text-gray-500 mt-4 text-lg">Join thousands of happy customers.</p>
    <div class="mt-8 flex gap-4 justify-center">
      <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">Start free trial</a>
      <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Talk to sales</a>
    </div>
  </div>
</section>
```

### Split with Image

CTA с изображением слева/справа.

```html
<section class="px-8 py-24">
  <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-50 rounded-2xl overflow-hidden">
    <div class="p-12 lg:p-16">
      <h2 class="text-3xl font-bold">Get the app</h2>
      <p class="text-gray-500 mt-4">Download now and start your journey.</p>
      <div class="flex gap-4 mt-8">
        <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium">App Store</a>
        <a href="#" class="px-6 py-3 border border-gray-300 rounded-lg font-medium">Google Play</a>
      </div>
    </div>
    <div class="h-64 lg:h-full">
      <img src="..." class="w-full h-full object-cover" />
    </div>
  </div>
</section>
```

### Inline Footer CTA

CTA встроенный в футер, минимальный.

```html
<footer class="px-8 py-16 border-t border-gray-200">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
    <div>
      <h3 class="text-lg font-semibold">Start building today</h3>
      <p class="text-gray-500 text-sm mt-1">Free forever, no credit card required.</p>
    </div>
    <a href="#" class="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium whitespace-nowrap">Get started</a>
  </div>
</footer>
```

## Footer Variants

### 3-Column

Три колонки: лого+описание, ссылки, social/newsletter.

```html
<footer class="px-8 py-16 border-t border-gray-200">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
    <div>
      <h4 class="font-semibold text-lg">Company</h4>
      <p class="text-gray-500 text-sm mt-2">Making the world a better place through design.</p>
    </div>
    <div>
      <h4 class="font-semibold mb-3">Links</h4>
      <ul class="space-y-2 text-sm text-gray-500">
        <li><a href="#" class="hover:text-gray-900 transition">About</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Blog</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Careers</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Contact</a></li>
      </ul>
    </div>
    <div>
      <h4 class="font-semibold mb-3">Legal</h4>
      <ul class="space-y-2 text-sm text-gray-500">
        <li><a href="#" class="hover:text-gray-900 transition">Privacy</a></li>
        <li><a href="#" class="hover:text-gray-900 transition">Terms</a></li>
      </ul>
    </div>
  </div>
  <div class="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
    &copy; 2026 Company. All rights reserved.
  </div>
</footer>
```

### Minimal

Только копирайт и ссылки в одну строку.

```html
<footer class="px-8 py-8 border-t border-gray-200">
  <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
    <span>&copy; 2026 Company</span>
    <div class="flex gap-6">
      <a href="#" class="hover:text-gray-900 transition">Privacy</a>
      <a href="#" class="hover:text-gray-900 transition">Terms</a>
    </div>
  </div>
</footer>
```

### Magazine

Много ссылок по категориям, как в журнале.

```html
<footer class="px-8 py-16 bg-gray-50 border-t border-gray-200">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Product</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Features</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Company</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">About</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Resources</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Blog</a></li></ul>
    </div>
    <div>
      <h4 class="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">Legal</h4>
      <ul class="space-y-2 text-sm"><li><a href="#" class="text-gray-600 hover:text-gray-900">Privacy</a></li></ul>
    </div>
  </div>
</footer>
```

## Data Quality Notes

- Primitives — репрезентативные сниппеты, основанные на частых паттернах из corpus
- Hero type classifier (73% "centered") может недооценивать full-bleed и split-screen варианты
- Примеры hostname — реальные сайты из corpus, но не обязательно точные примеры данного примитива
