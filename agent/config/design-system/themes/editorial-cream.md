# Editorial Cream

> Magazine-grade editorial premium. Роскошь через ТИПОГРАФИКУ и тёплый cream.
> Accent = desaturated mocha/taupe, не цвет и не жёлто-коричневый. Серьёзность New Yorker + эстетика Kinfolk.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема **light-only** — cream раскрывается только на светлом фоне.
5. Шрифты — **SERIF**: Playfair Display (заголовки) + Source Serif 4 (body). НЕ Inter.

---

## CSS Custom Properties (ОБЯЗАТЕЛЬНО для `<head>`)

```html
<style>
:root {
  --color-bg-page: #FBF9F4;
  --color-bg-alt: #F5F2EB;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #FBF9F4;
  --color-text-primary: #2A2520;
  --color-text-secondary: #6B5D4F;
  --color-text-muted: #57534E; /* WCAG AA fix: stone-600, ~6.5:1 on #FBF9F4 */
  --color-primary: #6B5D4F;
  --color-primary-hover: #544A3E;
  --color-primary-glow: rgba(107, 93, 79, 0.35);
  --color-primary-subtle: rgba(107, 93, 79, 0.07);
  --color-success: #4A7C59;
  --color-danger: #B44040;
  --color-warning: #B8860B;
  --color-border: #E8E2D8;
  --color-border-hover: #D4CCC0;
  --color-border-accent-hover: rgba(107, 93, 79, 0.45);
  --gradient-primary: linear-gradient(135deg, #6B5D4F, #544A3E);
  --gradient-subtle: linear-gradient(180deg, #FBF9F4, #F5F2EB);
  --shadow-brand: 0 10px 30px -10px rgba(107, 93, 79, 0.25);
  --shadow-card: 0 1px 3px rgba(42, 37, 32, 0.04), 0 1px 2px rgba(42, 37, 32, 0.03);
  --shadow-card-hover: 0 8px 24px -8px rgba(107, 93, 79, 0.14);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body: 'Source Serif 4', 'Georgia', serif;
  --font-mono: 'JetBrains Mono', monospace;
}
</style>
```

### Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

---

## Mood

**Editorial, literate, warm, authoritative.**

Роскошь через типографику и тепло. Не холодный минимализм Linear, а тёплая серьёзность The New Yorker.
Kinfolk — не потому что бежевый, а потому что serif-заголовки дышат на cream-фоне.
Editorial Cream = самый книжный, самый «бумажный». Цвета нет — есть только тёплый нейтрал mocha, типографика и воздух.

### Когда использовать

- Editorial / magazine / content-first сайты
- Премиальные издательства и медиа (The New Yorker, The Atlantic)
- Книжные магазины, литературные журналы
- Бутиковые бренды с историей (heritage brands)
- Портфолио писателей, журналистов, эссеистов
- Культурные институции (музеи, галереи, театры)
- Premium lifestyle и slow-living блоги
- Юридические, консалтинговые, академические сайты

### Когда НЕ использовать

- Gaming / киберпанк / neon (для этого bold-tech, dark-tech)
- Tech SaaS и dev-tools (лучше modern-clean или graphite-mono)
- E-commerce с эмоциональными товарами (нужен цвет)
- Детские / развлекательные проекты
- Крипто / финтех (лучше modern-clean)

---

## Цветовая палитра

### Light mode (единственный режим)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | #FBF9F4 | bg-[#FBF9F4] | основной фон страницы (тёплый cream, НЕ чистый #FFF) |
| bg (alt surface) | #F5F2EB | bg-[#F5F2EB] | альтернативный фон для секций, footer |
| bg (surface / cards) | #FFFFFF | bg-white | карточки, панели, модальные окна |
| bg (elevated) | #FBF9F4 | bg-[#FBF9F4] | hover states, subtle highlight |
| text (headings) | #2A2520 | text-[#2A2520] | заголовки, hero title (deep brown-black) |
| text (body) | #4A4239 | text-[#4A4239] | основной текст, параграфы |
| text (secondary / accent) | #6B5D4F | text-[#6B5D4F] | secondary text, accent elements, mocha |
| text (muted) | #57534E | text-stone-600 | placeholder, disabled, tertiary (WCAG AA: ~6.5:1) |
| **accent primary** | #6B5D4F | text-[#6B5D4F] / bg-[#6B5D4F] | CTA, links, active states (desaturated mocha/taupe) |
| **accent hover** | #544A3E | hover:bg-[#544A3E] | hover на accent-элементах (deeper mocha) |
| accent subtle bg | rgba(107,93,79,0.07) | bg-[#6B5D4F]/[0.07] | иконки в карточках, tinted фоны |
| success / positive | #4A7C59 | text-[#4A7C59] | positive metrics, checkmarks (forest green) |
| danger / negative | #B44040 | text-[#B44040] | negative metrics, warnings (muted red) |
| warning | #B8860B | text-[#B8860B] | caution states (goldenrod, не amber) |
| border (default) | #E8E2D8 | border-[#E8E2D8] | card border, divider, input border |
| border (hover) | #D4CCC0 | border-[#D4CCC0] | border на hover карточек без accent |
| border (accent hover) | rgba(107,93,79,0.45) | border-[#6B5D4F]/45 | border карточки при hover с акцентом |

### Mocha accent — главное правило

**#6B5D4F — единственный акцент.** Это desaturated taupe/mocha, НЕ жёлто-коричневый.
HSL ~ (26 deg, 14%, 36%) — минимальная насыщенность, читается как премиум-нейтрал.
CTA не «выделяется цветом» — он просто темнее и теплее основного текста. Это осознанное решение: editorial = сдержанность.

```css
/* Accent glow — ТОНКИЙ, mocha, едва заметный */
.glow-mocha-subtle {
  box-shadow: 0 0 0 1px rgba(107, 93, 79, 0.10), 0 0 6px rgba(107, 93, 79, 0.04);
}

/* Hover glow на карточках */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(107, 93, 79, 0.18), 0 8px 24px -8px rgba(107, 93, 79, 0.12);
}
```

Tailwind (inline):
- Покой: shadow-none
- Hover: hover:shadow-[0_0_0_1px_rgba(107,93,79,0.18),0_8px_24px_-8px_rgba(107,93,79,0.12)]

**НЕ использовать яркие тёплые акценты:**
- NO #FDB900 (amber) — жёлтый
- NO #B45309 (terracotta) — оранжево-коричневый, слишком тёплый
- NO #F59E0B (яркий amber) — жёлто-оранжевый
- NO #D97706 (dark amber) — тёплый жёлто-коричневый
- NO #92400E (brown amber) — насыщенный коричневый
- NO #4F46E5 (indigo) — холодный цвет
- NO #06b6d4 (cyan) — неоновый
- YES #6B5D4F (mocha/taupe) — desaturated neutral
- YES #544A3E (deep mocha) — hover, глубже
- YES #2A2520 (brown-black) — headings, основной текст

---

## Типографика

### Семейства шрифтов

| Элемент | Шрифт | Tailwind | Почему |
|---------|-------|----------|--------|
| Заголовки (h1-h6) | Playfair Display | `font-display` | Контрастный serif с элегантными засечками. Magazine-grade. |
| Body text | Source Serif 4 | `font-body` | Читабельный serif для длинных текстов. Оптические размеры. |
| Тех. данные, код, цифры | JetBrains Mono | `font-mono tabular-nums` | Контраст к serif-основе |
| Надзаголовки (eyebrow) | Source Serif 4 | `font-body` | Согласованность с body, uppercase |
| Italic акценты | Playfair Display Italic | `font-display italic` | Pull quotes, emphasis |
| Badge, labels | Source Serif 4 | `font-body font-medium` | Читабельные бейджи |

### Веса

| Weight | Tailwind | Применение |
|--------|----------|-----------|
| 300 | `font-light` | декоративные подзаголовки, pull quotes |
| 400 | `font-normal` | body text, параграфы |
| 500 | `font-medium` | UI labels, nav links, кнопки |
| 600 | `font-semibold` | card titles, section headings (Playfair) |
| 700 | `font-bold` | hero titles (Playfair) |
| 800-900 | `font-extrabold` / `font-black` | ultra-large display (Playfair, sparingly) |

### Letter-spacing

- Hero: `tracking-tight` (-0.02em) — Playfair требует tight для элегантности
- Section headings: `tracking-tight` (-0.01em)
- Eyebrow/labels: `tracking-widest` (0.1em) + `uppercase` — классический editorial приём
- Body: `tracking-normal` — Source Serif 4 оптимизирован для чтения
- Pull quotes: `tracking-normal` + `italic`

### Размеры и межстрочный

| Элемент | Размер | Line-height | Tailwind |
|---------|--------|-------------|----------|
| Hero h1 | 56-72px | 1.05-1.1 | `text-6xl..7xl leading-tight` |
| Section h2 | 36-44px | 1.15-1.2 | `text-4xl..5xl leading-tight` |
| Subsection h3 | 24-30px | 1.25 | `text-2xl..3xl leading-snug` |
| Body | 16-18px | 1.65-1.75 | `text-base..lg leading-relaxed` |
| Small / caption | 13-14px | 1.5 | `text-sm leading-normal` |
| Eyebrow | 11-12px | 1 | `text-xs tracking-widest uppercase` |

**Editorial правило:** line-height body >= 1.65 — serif требует больше воздуха для читаемости.

### Tailwind config

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          display: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
          body: ['"Source Serif 4"', 'Georgia', 'serif'],
        },
      }
    }
  }
</script>
```

---

## Композиция (Layout Patterns)

### Hero Layouts (3 варианта)

**A. Centered Editorial (default)**
max-w-3xl mx-auto text-center. Eyebrow -> h1 (Playfair 6xl-7xl) -> subtitle (Source Serif 4) -> CTA.
Классический magazine-cover: крупный serif заголовок, тонкий подзаголовок, элегантная кнопка.

**B. Split 60/40 (feature article)**
grid lg:grid-cols-12, left (col-span-7) = текст, right (col-span-5) = изображение.
Асимметричная editorial-сетка, как в The Atlantic. Изображение чуть меньше текста.

**C. Full-bleed text (manifesto / about)**
max-w-2xl mx-auto, выравнивание по левому краю. Large italic pull-quote -> body text.
Книжный, интимный формат. Идеально для эссе, философии бренда.

### Whitespace Rhythm

Editorial Cream = щедрые отступы, как в печатных журналах. Текст дышит.

| Секция | Padding (y) | Tailwind | Характер |
|--------|------------|----------|----------|
| Hero | top: 112-144px, bottom: 80-96px | pt-28..36 pb-20..24 | Величественный вход |
| Feature article | 96-128px | py-24..32 | Простор для чтения |
| Magazine grid | 80-96px | py-20..24 | Карточная сетка |
| Pull quote / divider | 64-80px | py-16..20 | Визуальная пауза |
| CTA / Subscribe | 80-96px | py-20..24 | Акцент на подписке |
| Footer | top: 64px, bottom: 48px | pt-16 pb-12 | Завершение |

### Depth Layering (4+ уровня)

| Level | Цвет | Tailwind | Назначение |
|-------|------|----------|-----------|
| Level 0 | #FBF9F4 | bg-[#FBF9F4] | Page background (cream) |
| Level 1 | #F5F2EB | bg-[#F5F2EB] | Alt sections, footer |
| Level 2 | #FFFFFF | bg-white | Cards, panels |
| Level 3 | rgba(107,93,79,0.04) | bg-[#6B5D4F]/[0.04] | Hover states, subtle highlights |
| Level 4 | #6B5D4F | bg-[#6B5D4F] | Accent (<=5% площади) |

Главная фишка: cream (#FBF9F4) и alt (#F5F2EB) — едва различимы. Это создаёт
мягкие переходы между секциями без резких границ. Бумажная теплота.

### Hero Typography Scale

| Элемент | Размер | Tailwind | Вес | Особенность |
|---------|--------|----------|-----|-------------|
| Eyebrow | 11px | text-xs tracking-widest uppercase | font-medium | Source Serif 4, text-[#9B9088] |
| h1 | 56-72px | text-6xl..7xl tracking-tight | font-bold | Playfair Display, text-[#2A2520] |
| h1 italic span | 56-72px | text-6xl..7xl italic | font-bold | Playfair Italic, text-[#6B5D4F] |
| Subtitle | 18-20px | text-lg..xl leading-relaxed | font-normal | Source Serif 4, text-[#4A4239] |
| Drop cap | 72px | text-7xl float-left | font-bold | Playfair, first letter |
| Stats (числа) | 30px | text-3xl | font-bold | font-mono tabular-nums |
| Stats (подписи) | 12px | text-xs tracking-wider uppercase | font-medium | text-[#9B9088] |

**Editorial фишка:** italic span в заголовке — классический magazine-приём.
Playfair Italic мгновенно создаёт ощущение редакционной верстки.

---

## Компоненты

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-[#E8E2D8] bg-[#FBF9F4]/85 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-[#2A2520]">
      <!-- logo mark — editorial serif monogram -->
      <span class="flex h-8 w-8 items-center justify-center rounded-sm bg-[#6B5D4F] font-display text-sm font-bold text-[#FBF9F4]">
        E
      </span>
      Editorial
    </a>

    <!-- Nav links -->
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#stories" class="font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:text-[#2A2520]">
        Stories
      </a>
      <a href="#essays" class="font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:text-[#2A2520]">
        Essays
      </a>
      <a href="#archive" class="font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:text-[#2A2520]">
        Archive
      </a>
      <a href="#about" class="font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:text-[#2A2520]">
        About
      </a>
    </div>

    <!-- CTA -->
    <a href="#subscribe" class="rounded-md bg-[#6B5D4F] px-5 py-2.5 font-body text-sm font-medium text-[#FBF9F4] transition-all duration-150 hover:bg-[#544A3E]">
      Subscribe
    </a>
  </nav>
</header>
```

Ключевые моменты:
- `bg-[#FBF9F4]/85` — cream полупрозрачный, backdrop-blur.
- `border-[#E8E2D8]` — тёплый, едва заметный border.
- Логотип — serif monogram на mocha-фоне (editorial branding).
- Nav links: `font-body` (Source Serif 4), hover -> darken до #2A2520.
- CTA: mocha фон + cream текст (НЕ белый — cream мягче).

### Hero (Editorial Centered)

```html
<section class="relative overflow-hidden bg-[#FBF9F4] pt-32 pb-24">
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <!-- eyebrow -->
      <span class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">
        Issue No. 47 — Summer 2025
      </span>
      <!-- hero title -->
      <h1 class="mt-8 font-display text-6xl font-bold tracking-tight text-[#2A2520] sm:text-7xl lg:text-7xl">
        The Quiet Art of<br>
        <span class="italic text-[#6B5D4F]">Thoughtful Design</span>
      </h1>
      <!-- subtitle -->
      <p class="mx-auto mt-8 max-w-xl font-body text-lg leading-relaxed text-[#4A4239]">
        An exploration of restraint, warmth, and the enduring power of serif typography
        in an age of sans-serif uniformity.
      </p>
      <!-- CTA buttons -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#read" class="rounded-md bg-[#6B5D4F] px-7 py-3 font-body text-base font-medium text-[#FBF9F4] transition-all duration-150 hover:bg-[#544A3E] hover:shadow-[0_0_0_1px_rgba(107,93,79,0.2),0_8px_24px_-8px_rgba(107,93,79,0.15)]">
          Read the essay
        </a>
        <a href="#browse" class="rounded-md border border-[#E8E2D8] bg-transparent px-7 py-3 font-body text-base font-medium text-[#6B5D4F] transition-all duration-150 hover:border-[#6B5D4F] hover:text-[#544A3E]">
          Browse archive
        </a>
      </div>
      <!-- decorative rule -->
      <div class="mx-auto mt-16 h-px w-24 bg-[#E8E2D8]"></div>
    </div>
  </div>
</section>
```

Ключевые особенности:
- `bg-[#FBF9F4]` — тёплый cream (не чистый #FFF).
- `italic text-[#6B5D4F]` — Playfair Italic для второй строки (editorial accent).
- `font-body` на кнопках — serif кнопки, не sans-serif!
- Decorative rule (hr) — классический magazine-разделитель.
- `text-[#FBF9F4]` на CTA — cream текст мягче чистого белого.

### Hero (Split — Feature Article)

```html
<section class="relative overflow-hidden bg-[#FBF9F4] pt-24 pb-20">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid items-center gap-12 lg:grid-cols-12">
      <!-- Text column -->
      <div class="lg:col-span-7">
        <span class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">
          Feature
        </span>
        <h1 class="mt-4 font-display text-5xl font-bold tracking-tight text-[#2A2520] lg:text-6xl">
          Why the world needs
          <span class="italic text-[#6B5D4F]">slower</span> interfaces
        </h1>
        <p class="mt-6 max-w-lg font-body text-lg leading-relaxed text-[#4A4239]">
          In a landscape obsessed with speed and efficiency, a growing movement
          of designers is choosing depth over velocity. We spoke to five studios
          leading this quiet revolution.
        </p>
        <div class="mt-8 flex items-center gap-4">
          <a href="#read" class="rounded-md bg-[#6B5D4F] px-6 py-3 font-body text-sm font-medium text-[#FBF9F4] transition-all duration-150 hover:bg-[#544A3E]">
            Read more
          </a>
          <span class="font-body text-sm text-[#9B9088]">12 min read</span>
        </div>
      </div>
      <!-- Image column -->
      <div class="lg:col-span-5">
        <div class="aspect-[3/4] overflow-hidden rounded-2xl bg-[#F5F2EB]">
          <img src="/images/feature-hero.jpg" alt="Feature image" class="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  </div>
</section>
```

Ключевые моменты:
- Асимметричная сетка 7/5 — editorial пропорции (не 50/50).
- `aspect-[3/4]` — портретный формат, magazine-стандарт.
- Reading time — классический editorial элемент.
- `italic text-[#6B5D4F]` — акцентное слово курсивом.

### Article Cards

```html
<div class="group rounded-2xl border border-[#E8E2D8] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6B5D4F]/40 hover:shadow-[0_0_0_1px_rgba(107,93,79,0.12),0_8px_24px_-8px_rgba(107,93,79,0.1)]">
  <div class="flex items-center gap-3">
    <span class="rounded-sm bg-[#6B5D4F]/[0.07] px-2.5 py-1 font-body text-xs font-medium tracking-wide uppercase text-[#6B5D4F]">
      Essay
    </span>
    <time class="font-body text-xs text-[#9B9088]">June 14, 2025</time>
  </div>
  <h3 class="mt-4 font-display text-xl font-semibold tracking-tight text-[#2A2520] group-hover:text-[#6B5D4F] transition-colors duration-200">
    The Tyranny of Flat Design
  </h3>
  <p class="mt-3 font-body text-sm leading-relaxed text-[#4A4239]">
    When every app looks the same, what does it mean to have a visual identity?
    A meditation on the loss of texture in modern interfaces.
  </p>
  <div class="mt-5 flex items-center gap-3 border-t border-[#E8E2D8] pt-4">
    <div class="h-8 w-8 rounded-full bg-[#F5F2EB] flex items-center justify-center font-display text-xs font-bold text-[#6B5D4F]">
      AK
    </div>
    <div>
      <span class="font-body text-xs font-medium text-[#2A2520]">Anna Kowalski</span>
      <span class="ml-2 font-body text-xs text-[#9B9088]">8 min read</span>
    </div>
  </div>
</div>
```

Card features:
- Category badge with uppercase tracking
- Playfair Display titles, hover -> mocha
- Author avatar with serif monogram
- Border-top divider (magazine style)
- Source Serif 4 for excerpts

### Magazine Grid (Featured + Supporting)

```html
<section class="bg-[#FBF9F4] py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="flex items-baseline justify-between border-b border-[#E8E2D8] pb-4 mb-10">
      <h2 class="font-display text-3xl font-bold tracking-tight text-[#2A2520]">
        Latest Stories
      </h2>
      <a href="#archive" class="font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:text-[#544A3E]">
        View all
      </a>
    </div>

    <!-- Grid: 1 featured + 3 supporting -->
    <div class="grid gap-8 lg:grid-cols-12">
      <!-- Featured article (large) -->
      <article class="group lg:col-span-7">
        <div class="aspect-[16/10] overflow-hidden rounded-2xl bg-[#F5F2EB]">
          <img src="/images/featured.jpg" alt="Featured" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>
        <div class="mt-5">
          <span class="font-body text-xs font-medium tracking-widest uppercase text-[#6B5D4F]">Feature</span>
          <h3 class="mt-2 font-display text-3xl font-bold tracking-tight text-[#2A2520] group-hover:text-[#6B5D4F] transition-colors duration-200">
            In Defence of Ornamentation
          </h3>
          <p class="mt-3 max-w-lg font-body text-base leading-relaxed text-[#4A4239]">
            After decades of minimalism, decorative elements are making a quiet comeback
            in the work of designers who believe beauty is not a distraction.
          </p>
          <div class="mt-4 flex items-center gap-3">
            <span class="font-body text-sm font-medium text-[#2A2520]">James Chen</span>
            <span class="text-[#E8E2D8]">&middot;</span>
            <span class="font-body text-sm text-[#9B9088]">15 min read</span>
          </div>
        </div>
      </article>

      <!-- Supporting articles (stacked) -->
      <div class="space-y-8 lg:col-span-5">
        <article class="group flex gap-4">
          <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F2EB]">
            <img src="/images/article-1.jpg" alt="" class="h-full w-full object-cover" />
          </div>
          <div>
            <span class="font-body text-xs font-medium tracking-wider uppercase text-[#9B9088]">Interview</span>
            <h4 class="mt-1 font-display text-lg font-semibold tracking-tight text-[#2A2520] group-hover:text-[#6B5D4F] transition-colors duration-200">
              Conversations with a Bookbinder
            </h4>
            <span class="mt-1 block font-body text-xs text-[#9B9088]">6 min read</span>
          </div>
        </article>

        <article class="group flex gap-4">
          <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F2EB]">
            <img src="/images/article-2.jpg" alt="" class="h-full w-full object-cover" />
          </div>
          <div>
            <span class="font-body text-xs font-medium tracking-wider uppercase text-[#9B9088]">Review</span>
            <h4 class="mt-1 font-display text-lg font-semibold tracking-tight text-[#2A2520] group-hover:text-[#6B5D4F] transition-colors duration-200">
              The Best Typography Books of 2025
            </h4>
            <span class="mt-1 block font-body text-xs text-[#9B9088]">10 min read</span>
          </div>
        </article>

        <article class="group flex gap-4">
          <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F2EB]">
            <img src="/images/article-3.jpg" alt="" class="h-full w-full object-cover" />
          </div>
          <div>
            <span class="font-body text-xs font-medium tracking-wider uppercase text-[#9B9088]">Opinion</span>
            <h4 class="mt-1 font-display text-lg font-semibold tracking-tight text-[#2A2520] group-hover:text-[#6B5D4F] transition-colors duration-200">
              Why Serif Fonts Feel More Honest
            </h4>
            <span class="mt-1 block font-body text-xs text-[#9B9088]">4 min read</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>
```

Key points:
- Section header with border-bottom (newspaper/magazine style)
- Featured 7/12 + stacked 5/12 (editorial asymmetric layout)
- Thumbnails 96x96 for supporting articles
- Dot separator between author and reading time
- Hover: scale 1.02 on featured image + color shift on titles

### Pull Quote (Editorial Signature)

```html
<figure class="my-16 border-l-2 border-[#6B5D4F] pl-8">
  <blockquote class="font-display text-2xl font-medium italic leading-snug tracking-tight text-[#2A2520] sm:text-3xl">
    &ldquo;Good typography is not about being seen. It&rsquo;s about the reader
    <span class="text-[#6B5D4F]">forgetting the medium</span>
    and remembering only the idea.&rdquo;
  </blockquote>
  <figcaption class="mt-4 font-body text-sm text-[#9B9088]">
    &mdash; Erik Spiekermann, <cite class="italic">Stop Stealing Sheep</cite>
  </figcaption>
</figure>
```

Key points:
- `border-l-2 border-[#6B5D4F]` — thin mocha line
- `font-display italic` — Playfair Italic for pull quotes
- Accent span inside quote — mocha italic
- `font-body` for attribution
- Large margin (my-16) — quote needs breathing room

### Buttons

**Primary (solid mocha):**

```html
<button class="rounded-md bg-[#6B5D4F] px-7 py-3 font-body text-sm font-medium text-[#FBF9F4] transition-all duration-150 hover:bg-[#544A3E] hover:shadow-[0_0_0_1px_rgba(107,93,79,0.2),0_8px_24px_-8px_rgba(107,93,79,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6B5D4F] focus:ring-offset-2 focus:ring-offset-[#FBF9F4]">
  Subscribe
</button>
```

**Secondary (outline):**

```html
<button class="rounded-md border border-[#E8E2D8] bg-transparent px-7 py-3 font-body text-sm font-medium text-[#6B5D4F] transition-all duration-150 hover:border-[#6B5D4F] hover:text-[#544A3E] focus:outline-none focus:ring-2 focus:ring-[#6B5D4F] focus:ring-offset-2 focus:ring-offset-[#FBF9F4]">
  Browse archive
</button>
```

**Ghost (editorial link):**

```html
<button class="rounded-md bg-transparent px-4 py-2 font-body text-sm font-medium text-[#6B5D4F] transition-colors duration-150 hover:bg-[#F5F2EB] hover:text-[#544A3E]">
  Read more
</button>
```

**Text-only (inline editorial link):**

```html
<a href="#" class="font-body text-sm font-medium text-[#6B5D4F] underline decoration-[#E8E2D8] decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[#544A3E] hover:decoration-[#6B5D4F]">
  Continue reading
</a>
```

Button priority:

| Variant | Tailwind | When |
|---------|----------|------|
| Primary | bg-[#6B5D4F] text-[#FBF9F4] | Main CTA (subscribe, read) |
| Secondary | border-[#E8E2D8] text-[#6B5D4F] | Secondary action |
| Ghost | text-[#6B5D4F] hover:bg-[#F5F2EB] | In-section navigation |
| Text-only | text-[#6B5D4F] underline | Inline editorial links |

**Rule:** buttons are serif (`font-body` or `font-display`), NOT sans-serif. Rounded-md, NOT rounded-full. Text on buttons = cream (#FBF9F4), not pure white.

### Badge / Category Tag

```html
<!-- Standard badge -->
<span class="rounded-sm bg-[#6B5D4F]/[0.07] px-2.5 py-1 font-body text-xs font-medium tracking-wide uppercase text-[#6B5D4F]">
  Feature
</span>

<!-- Muted badge -->
<span class="rounded-sm bg-[#F5F2EB] px-2.5 py-1 font-body text-xs font-medium tracking-wide uppercase text-[#9B9088]">
  Interview
</span>

<!-- Accent badge -->
<span class="rounded-sm bg-[#6B5D4F] px-2.5 py-1 font-body text-xs font-medium tracking-wide uppercase text-[#FBF9F4]">
  Editor's Pick
</span>
```

Key points:
- `rounded-sm` — angular, editorial (not rounded-full)
- `tracking-wide uppercase` — classic magazine badge
- `font-body` (Source Serif 4) — serif in badges

### Newsletter Subscribe Form

```html
<form class="rounded-2xl border border-[#E8E2D8] bg-white p-8 sm:p-10">
  <div class="text-center">
    <h3 class="font-display text-2xl font-bold tracking-tight text-[#2A2520]">
      The Weekly Dispatch
    </h3>
    <p class="mt-2 font-body text-sm leading-relaxed text-[#4A4239]">
      A curated selection of essays, interviews, and reviews — delivered every Sunday morning.
    </p>
  </div>

  <div class="mt-8 space-y-4">
    <div>
      <label for="email" class="block font-body text-sm font-medium text-[#4A4239]">Email address</label>
      <input
        id="email" type="email" placeholder="reader@example.com"
        class="mt-1.5 block w-full rounded-md border border-[#E8E2D8] bg-white px-4 py-3 font-body text-sm text-[#2A2520] placeholder:text-[#9B9088] transition-colors duration-150 focus:border-[#6B5D4F] focus:outline-none focus:ring-1 focus:ring-[#6B5D4F]"
      />
    </div>
    <div>
      <label for="name" class="block font-body text-sm font-medium text-[#4A4239]">Name <span class="text-[#9B9088]">(optional)</span></label>
      <input
        id="name" type="text" placeholder="Your name"
        class="mt-1.5 block w-full rounded-md border border-[#E8E2D8] bg-white px-4 py-3 font-body text-sm text-[#2A2520] placeholder:text-[#9B9088] transition-colors duration-150 focus:border-[#6B5D4F] focus:outline-none focus:ring-1 focus:ring-[#6B5D4F]"
      />
    </div>
  </div>

  <button type="submit" class="mt-6 w-full rounded-md bg-[#6B5D4F] px-6 py-3 font-body text-sm font-medium text-[#FBF9F4] transition-all duration-150 hover:bg-[#544A3E] hover:shadow-[0_0_0_1px_rgba(107,93,79,0.2),0_8px_24px_-8px_rgba(107,93,79,0.15)] focus:outline-none focus:ring-2 focus:ring-[#6B5D4F] focus:ring-offset-2 focus:ring-offset-white">
    Subscribe
  </button>

  <p class="mt-4 text-center font-body text-xs text-[#9B9088]">
    Free forever. No spam. Unsubscribe anytime.
  </p>
</form>
```

Key points:
- Inputs: `bg-white` + `border-[#E8E2D8]` (warm cream border)
- Focus: `border-[#6B5D4F]` + `ring-1 ring-[#6B5D4F]` (mocha)
- `font-body` everywhere — serif forms
- Padding `px-4 py-3` — editorial spaciousness

### Footer

```html
<footer class="bg-[#F5F2EB] pt-16 pb-12">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-12">
      <!-- Brand -->
      <div class="md:col-span-4">
        <a href="/" class="font-display text-2xl font-bold tracking-tight text-[#2A2520]">
          Editorial
        </a>
        <p class="mt-3 max-w-xs font-body text-sm leading-relaxed text-[#4A4239]">
          A journal of design, typography, and the art of making things that last.
          Published since 2019.
        </p>
        <div class="mt-5 flex gap-4">
          <a href="#" class="text-[#9B9088] transition-colors duration-150 hover:text-[#6B5D4F]" aria-label="Twitter">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" class="text-[#9B9088] transition-colors duration-150 hover:text-[#6B5D4F]" aria-label="Instagram">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
      </div>

      <!-- Nav columns -->
      <div class="md:col-span-2">
        <h4 class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">Sections</h4>
        <ul class="mt-4 space-y-3">
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Essays</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Interviews</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Reviews</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Features</a></li>
        </ul>
      </div>

      <div class="md:col-span-2">
        <h4 class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">About</h4>
        <ul class="mt-4 space-y-3">
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Our Story</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Contributors</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Contact</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Careers</a></li>
        </ul>
      </div>

      <div class="md:col-span-2">
        <h4 class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">Legal</h4>
        <ul class="mt-4 space-y-3">
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Privacy</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Terms</a></li>
          <li><a href="#" class="font-body text-sm text-[#4A4239] transition-colors duration-150 hover:text-[#6B5D4F]">Cookies</a></li>
        </ul>
      </div>

      <!-- Newsletter mini -->
      <div class="md:col-span-2">
        <h4 class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">Subscribe</h4>
        <p class="mt-4 font-body text-sm text-[#4A4239]">Weekly dispatch to your inbox.</p>
        <a href="#subscribe" class="mt-3 inline-block font-body text-sm font-medium text-[#6B5D4F] underline decoration-[#E8E2D8] decoration-1 underline-offset-4 transition-colors duration-150 hover:text-[#544A3E] hover:decoration-[#6B5D4F]">
          Sign up
        </a>
      </div>
    </div>

    <div class="mt-12 border-t border-[#E8E2D8] pt-8">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="font-body text-sm text-[#9B9088]">
          &copy; 2025 Editorial. All rights reserved.
        </p>
        <p class="font-body text-xs text-[#9B9088]">
          Set in Playfair Display &amp; Source Serif 4
        </p>
      </div>
    </div>
  </div>
</footer>
```

Key points:
- `bg-[#F5F2EB]` — alt cream for footer (slightly deeper)
- Brand column wider (col-span-4) — editorial branding emphasis
- Social icons: muted -> mocha on hover
- Footer attribution: "Set in [font names]" — classic editorial touch
- All links hover -> `text-[#6B5D4F]` (mocha, not different hue)
- `font-body` everywhere — serif footer

---

## Wow-patterns (editorial, restrained)

### 1. Stagger Reveal (cascade appearance)

```html
<style>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 100ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 200ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 300ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 400ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 500ms; }
</style>

<div class="stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  <div class="reveal rounded-2xl border border-[#E8E2D8] bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-[#E8E2D8] bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-[#E8E2D8] bg-white p-6">...</div>
</div>
```

### 2. Drop Cap (bukvitsa — editorial signature)

```html
<style>
.drop-cap::first-letter {
  float: left;
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: 4.5em;
  line-height: 0.8;
  padding-right: 0.1em;
  padding-top: 0.05em;
  color: var(--color-primary);
}
</style>

<p class="drop-cap font-body text-lg leading-relaxed text-[#4A4239]">
  Typography has always been more than the arrangement of letters. It is the
  visual voice of language itself, carrying meaning before a single word is read.
  In the hands of a skilled designer, type becomes invisible — a transparent
  vessel through which ideas flow unimpeded.
</p>
```

### 3. Subtle Hover Lift (NOT glow, NOT shimmer)

```html
<style>
.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -4px rgba(107, 93, 79, 0.1);
}
</style>
```

### 4. Decorative Rules (dividers)

```html
<!-- Thin centered rule -->
<div class="mx-auto my-16 h-px w-24 bg-[#E8E2D8]"></div>

<!-- Ornamental divider -->
<div class="my-12 flex items-center justify-center gap-3">
  <div class="h-px w-12 bg-[#E8E2D8]"></div>
  <span class="font-display text-lg text-[#9B9088]">&sect;</span>
  <div class="h-px w-12 bg-[#E8E2D8]"></div>
</div>

<!-- Section border (full width) -->
<div class="border-b border-[#E8E2D8]"></div>
```

### DO NOT use

| Pattern | Why |
|---------|-----|
| Text Shimmer (any color) | Color glow contradicts editorial |
| Gradient Border on Hover | Too tech for magazine |
| Spotlight Follow Cursor | Neon — absolutely not |
| Animated Gradient Border | Requires color |
| Morphing Blob | Playful, not for editorial |
| Number Counter | OK but without flashy animation |
| Parallax scrolling | OK in moderation, be careful |
| Any glow effects | Editorial = typography, not glow |

---

## Anti-patterns (FORBIDDEN)

| Do NOT | Instead |
|--------|---------|
| Bright warm accents (#FDB900, #B45309, #F59E0B, #D97706) | Only desaturated mocha #6B5D4F / #544A3E |
| Amber #FDB900, #F59E0B | NO — yellow, looks bad |
| Terracotta #B45309 | NO — orange-brown, too warm |
| Indigo / blue / cyan / violet | NO — cold colors |
| Inter / Sora / sans-serif for hero | Playfair Display (`font-display`) for headings |
| Gradient buttons | Solid mocha only |
| Glow effects of any color | Only light mocha shadows (opacity <= 0.14) |
| `rounded-full` on buttons | `rounded-md` |
| `font-sans` for hero | `font-display` (Playfair Display) |
| Color icons | Monochrome mocha icons |
| Heavy shadows (blur > 12px) | Light shadows |
| `bg-white` for page | `bg-[#FBF9F4]` (warm cream) |
| Pure white text on buttons | `text-[#FBF9F4]` (cream, softer) |
| `tracking-tighter` for Playfair | `tracking-tight` (not tighter — serif needs room) |
| Tight line-height on body (< 1.5) | `leading-relaxed` (>= 1.65) for serif body |

---

## Theme-specific exceptions

| Base rule | Exception in editorial-cream | Justification |
|-----------|------------------------------|---------------|
| Sans-serif fonts | **CORE of theme.** Playfair Display + Source Serif 4 | Editorial = serif |
| Italic in headings | Playfair Italic for emphasis and pull quotes | Magazine convention |
| Larger padding on inputs | `px-4 py-3` instead of `px-3 py-2.5` | Editorial spaciousness |
| Decorative elements | Thin rules, section dividers, drop caps | Editorial ornamentation |
| `tracking-widest` on labels | Yes, for eyebrows and badges | Magazine metadata style |
| Asymmetric grids (7/5, 8/4) | Yes, for feature layouts | Editorial proportions |

### What is NOT overridden (strictly as in tokens):

- Buttons — `rounded-md`, NOT `rounded-full`.
- Section padding >= `py-20`.
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Card border — `border border-[#E8E2D8] rounded-2xl`.

---

## Section Examples

### Statistics / By-the-Numbers Section

```html
<section class="bg-[#F5F2EB] py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">
        By the Numbers
      </span>
      <h2 class="mt-4 font-display text-4xl font-bold tracking-tight text-[#2A2520]">
        Five Years of <span class="italic text-[#6B5D4F]">Thoughtful</span> Writing
      </h2>
    </div>

    <div class="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
      <div class="text-center">
        <div class="font-display text-4xl font-bold text-[#2A2520]">247</div>
        <div class="mt-1 font-body text-sm text-[#9B9088]">Essays Published</div>
      </div>
      <div class="text-center">
        <div class="font-display text-4xl font-bold text-[#2A2520]">89</div>
        <div class="mt-1 font-body text-sm text-[#9B9088]">Contributors</div>
      </div>
      <div class="text-center">
        <div class="font-display text-4xl font-bold text-[#2A2520]">34K</div>
        <div class="mt-1 font-body text-sm text-[#9B9088]">Subscribers</div>
      </div>
      <div class="text-center">
        <div class="font-display text-4xl font-bold text-[#2A2520]">12</div>
        <div class="mt-1 font-body text-sm text-[#9B9088]">Awards Won</div>
      </div>
    </div>
  </div>
</section>
```

Key points:
- `bg-[#F5F2EB]` — alt bg for visual break
- Stats numbers in `font-display` (Playfair) — serif numbers look editorial
- Italic accent in heading
- Grid 2x2 / 4x1 responsive

### Testimonial / Praise Section

```html
<section class="bg-[#FBF9F4] py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="font-body text-xs font-medium tracking-widest uppercase text-[#9B9088]">
        Praise
      </span>
      <h2 class="mt-4 font-display text-4xl font-bold tracking-tight text-[#2A2520]">
        What Readers Say
      </h2>
    </div>

    <div class="mt-16 grid gap-8 md:grid-cols-3">
      <figure class="rounded-2xl border border-[#E8E2D8] bg-white p-8">
        <blockquote class="font-display text-lg italic leading-snug text-[#2A2520]">
          "The only newsletter I read cover to cover. Every issue feels like holding
          a beautifully printed magazine."
        </blockquote>
        <figcaption class="mt-6 flex items-center gap-3 border-t border-[#E8E2D8] pt-4">
          <div class="h-10 w-10 rounded-full bg-[#F5F2EB] flex items-center justify-center font-display text-sm font-bold text-[#6B5D4F]">
            SR
          </div>
          <div>
            <div class="font-body text-sm font-medium text-[#2A2520]">Sarah Richardson</div>
            <div class="font-body text-xs text-[#9B9088]">Design Director, Pentagram</div>
          </div>
        </figcaption>
      </figure>

      <figure class="rounded-2xl border border-[#E8E2D8] bg-white p-8">
        <blockquote class="font-display text-lg italic leading-snug text-[#2A2520]">
          "In a world of hot takes and listicles, Editorial is a refuge. Long-form
          writing that respects the reader's intelligence."
        </blockquote>
        <figcaption class="mt-6 flex items-center gap-3 border-t border-[#E8E2D8] pt-4">
          <div class="h-10 w-10 rounded-full bg-[#F5F2EB] flex items-center justify-center font-display text-sm font-bold text-[#6B5D4F]">
            MH
          </div>
          <div>
            <div class="font-body text-sm font-medium text-[#2A2520]">Marcus Holloway</div>
            <div class="font-body text-xs text-[#9B9088]">Editor-in-Chief, It's Nice That</div>
          </div>
        </figcaption>
      </figure>

      <figure class="rounded-2xl border border-[#E8E2D8] bg-white p-8">
        <blockquote class="font-display text-lg italic leading-snug text-[#2A2520]">
          "The typography alone is worth subscribing for. Every detail considered,
          every margin intentional."
        </blockquote>
        <figcaption class="mt-6 flex items-center gap-3 border-t border-[#E8E2D8] pt-4">
          <div class="h-10 w-10 rounded-full bg-[#F5F2EB] flex items-center justify-center font-display text-sm font-bold text-[#6B5D4F]">
            LT
          </div>
          <div>
            <div class="font-body text-sm font-medium text-[#2A2520]">Lena Torres</div>
            <div class="font-body text-xs text-[#9B9088]">Type Designer, Monotype</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</section>
```

Key points:
- `font-display italic` for blockquotes — Playfair Italic
- Avatar circles with serif monograms
- Border-top divider for attribution
- 3-column responsive grid

### Full Editorial Page Skeleton

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Editorial — Design Journal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            display: ['"Playfair Display"', 'Georgia', 'serif'],
            body: ['"Source Serif 4"', 'Georgia', 'serif'],
          },
        }
      }
    }
  </script>
  <style>
    :root {
      --color-bg-page: #FBF9F4;
      --color-bg-alt: #F5F2EB;
      --color-surface: #FFFFFF;
      --color-text-primary: #2A2520;
      --color-text-secondary: #6B5D4F;
      --color-text-muted: #57534E; /* WCAG AA fix */
      --color-primary: #6B5D4F;
      --color-primary-hover: #544A3E;
      --color-border: #E8E2D8;
      --shadow-brand: 0 10px 30px -10px rgba(107, 93, 79, 0.25);
      --shadow-card: 0 1px 3px rgba(42, 37, 32, 0.04), 0 1px 2px rgba(42, 37, 32, 0.03);
      --shadow-card-hover: 0 8px 24px -8px rgba(107, 93, 79, 0.14);
      --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --font-display: 'Playfair Display', 'Georgia', serif;
      --font-body: 'Source Serif 4', 'Georgia', serif;
    }
  </style>
</head>
<body class="bg-[#FBF9F4] font-body text-[#4A4239] antialiased">
  <!-- Navbar -->
  <!-- Hero -->
  <!-- Featured Article -->
  <!-- Magazine Grid -->
  <!-- Pull Quote -->
  <!-- Newsletter CTA -->
  <!-- Footer -->
</body>
</html>
```

---

## Tailwind Classes Mapping

### Backgrounds

| Token | Tailwind | Usage |
|-------|----------|-------|
| --color-bg-page | bg-[#FBF9F4] | Page background |
| --color-bg-alt | bg-[#F5F2EB] | Alt sections, footer |
| --color-surface | bg-white | Cards, panels, modals |
| --color-bg-elevated | bg-[#FBF9F4] | Hover highlights |
| --color-primary-subtle | bg-[#6B5D4F]/[0.07] | Icon backgrounds, tinted |

### Text

| Token | Tailwind | Usage |
|-------|----------|-------|
| --color-text-primary | text-[#2A2520] | Headings, primary text |
| --color-text-secondary | text-[#6B5D4F] | Accent text, links |
| --color-text-muted | text-stone-600 | Muted, placeholder |
| --color-primary | text-[#6B5D4F] | Accent elements |
| --color-primary-hover | text-[#544A3E] | Hover accent |

### Borders

| Token | Tailwind | Usage |
|-------|----------|-------|
| --color-border | border-[#E8E2D8] | Default borders |
| --color-border-hover | border-[#D4CCC0] | Hover borders |
| --color-border-accent-hover | border-[#6B5D4F]/45 | Accent hover |

### Fonts

| Token | Tailwind | Usage |
|-------|----------|-------|
| --font-display | font-display | Playfair Display (headings) |
| --font-body | font-body | Source Serif 4 (body, UI) |
| --font-mono | font-mono | JetBrains Mono (code, data) |

### Shadows

| Token | Tailwind | Usage |
|-------|----------|-------|
| --shadow-brand | shadow-[0_10px_30px_-10px_rgba(107,93,79,0.25)] | Brand elements |
| --shadow-card | shadow-[0_1px_3px_rgba(42,37,32,0.04),0_1px_2px_rgba(42,37,32,0.03)] | Card rest |
| --shadow-card-hover | shadow-[0_8px_24px_-8px_rgba(107,93,79,0.14)] | Card hover |

---

## Checklist editorial-cream

- [ ] Page bg = `bg-[#FBF9F4]`, NOT `bg-white`.
- [ ] Alt sections = `bg-[#F5F2EB]`.
- [ ] Cards = `bg-white border border-[#E8E2D8] rounded-2xl`.
- [ ] CTA = solid `bg-[#6B5D4F] text-[#FBF9F4]` (NOT white text, cream is softer).
- [ ] Headings = Playfair Display (`font-display`) — SERIF.
- [ ] Body = Source Serif 4 (`font-body`) — SERIF.
- [ ] **NO Inter** — this theme is serif-only.
- [ ] Italic span in hero = Playfair Italic.
- [ ] Accent = #6B5D4F (desaturated mocha/taupe), NOT amber/terracotta.
- [ ] **NO #FDB900, NO #B45309, NO #F59E0B** — yellow-brown colors forbidden.
- [ ] Links hover -> `text-[#6B5D4F]` (mocha, not different hue).
- [ ] **NO glow effects** — only light mocha shadows.
- [ ] Hero = NO radial gradient.
- [ ] Buttons = `rounded-md`, NOT `rounded-full`.
- [ ] Footer = `bg-[#F5F2EB]`.
- [ ] **Accent <= 5% of area** — mocha only on CTA, badges, key elements.
- [ ] Line-height body >= 1.65 — serif needs air.
- [ ] `tracking-widest uppercase` on eyebrows/labels.
- [ ] Decorative rules for editorial dividers.
- [ ] Drop cap for opening paragraphs.
- [ ] All CSS custom properties present in :root.
- [ ] --shadow-brand with mocha tint (rgba(107, 93, 79, 0.25)).
- [ ] --gradient-primary: linear-gradient(135deg, #6B5D4F, #544A3E).
- [ ] --transition-smooth: cubic-bezier(0.4, 0, 0.2, 1).
- [ ] No hardcoded hex in components (use var(--color-*) or Tailwind arbitrary values).
