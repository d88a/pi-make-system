# Sage Stone

> Organic premium. Природная надёжность через sage green и натуральный stone.
> Accent = muted sage `#4A5D4F` — спокойный, естественный, надёжный.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема **light-only** — природная палитра раскрывается только на светлом фоне.


---


## CSS Custom Properties (ОБЯЗАТЕЛЬНО для `<head>`)

```html
<style>
:root {
  --color-bg-page: #F7F6F3;
  --color-bg-alt: #EFEDE9;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #F7F6F3;
  --color-text-primary: #1C1917;
  --color-text-secondary: #57534E;
  --color-text-muted: #57534E; /* WCAG AA fix: stone-600, ~6.5:1 on #F7F6F3 */
  --color-primary: #4A5D4F;
  --color-primary-hover: #3A4A3F;
  --color-primary-glow: rgba(74, 93, 79, 0.4);
  --color-primary-subtle: rgba(74, 93, 79, 0.08);
  --color-success: #059669;
  --color-danger: #DC2626;
  --color-warning: #CA8A04;
  --color-border: #E7E5E4;
  --color-border-hover: #D6D3D1;
  --color-border-accent-hover: rgba(74, 93, 79, 0.5);
  --gradient-primary: linear-gradient(135deg, #4A5D4F, #3A4A3F);
  --gradient-subtle: linear-gradient(180deg, #F7F6F3, #EFEDE9);
  --shadow-brand: 0 10px 30px -10px rgba(74, 93, 79, 0.3);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 8px 24px -8px rgba(74, 93, 79, 0.15);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --font-display: 'Sora', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
</style>
```

### Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Sora:wght@600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```


---


## Mood

**Organic, natural, calm, reliable, grounded.**

Роскошь через природную сдержанность. Sage Stone — это тишина леса, а не тишина офиса.
Sage green `#4A5D4F` — не яркий, не кричащий. Это цвет мха на камне, шалфея на рассвете.
Stone palette — земля, глина, песок. Всё вместе = ощущение надёжности и естественности.

### Когда использовать

- Эко-бренды и sustainable products (Patagonia, Allbirds)
- Строительные и архитектурные компании (натуральные материалы)
- Органические продукты, фермерские хозяйства
- Wellness, spa, натуральная косметика
- Ландшафтный дизайн, эко-туризм
- Любые проекты с ценностями «натуральность, устойчивость, забота»
- Премиальные бренды с природным позиционированием

### Когда НЕ использовать

- Gaming / киберпанк / neon (для этого bold-tech, dark-tech)
- Крипто / финтех / tech startups (лучше modern-clean или graphite-mono)
- Детские / развлекательные проекты (нужны яркие цвета)
- E-commerce с яркими товарами (fashion, beauty)
- Проекты где нужна агрессивная энергетика


---


## Цветовая палитра

### Light mode (единственный режим)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#F7F6F3` | `bg-[#F7F6F3]` | основной фон страницы (натуральный off-white, НЕ чистый #FFF) |
| bg (alt surface) | `#EFEDE9` | `bg-[#EFEDE9]` | альтернативный фон для секций, footer |
| bg (surface / cards) | `#FFFFFF` | `bg-white` | карточки, панели, модальные окна |
| bg (elevated) | `#F7F6F3` | `bg-[#F7F6F3]` | hover states, subtle highlight |
| text (headings) | `#1C1917` | `text-stone-900` | заголовки, hero title |
| text (body) | `#57534E` | `text-stone-600` | основной текст, параграфы |
| text (muted) | `#57534E` | `text-stone-600` | secondary, placeholder, disabled |
| **accent primary** | `#4A5D4F` | `bg-[#4A5D4F] / text-[#4A5D4F]` | CTA, links, active states (sage green) |
| **accent hover** | `#3A4A3F` | `hover:bg-[#3A4A3F]` | hover на accent-элементах |
| accent subtle bg | `rgba(74,93,79,0.08)` | `bg-[#4A5D4F]/[0.08]` | иконки в карточках, tinted фоны |
| success / positive | `#059669` | `text-emerald-600` | positive metrics, checkmarks |
| danger / negative | `#DC2626` | `text-red-600` | negative metrics, warnings |
| warning | `#CA8A04` | `text-yellow-700` | caution states (приглушённый, НЕ amber) |
| border (default) | `#E7E5E4` | `border-stone-200` | card border, divider, input border |
| border (hover) | `#D6D3D1` | `border-stone-300` | border на hover карточек без accent |
| border (accent hover) | `rgba(74,93,79,0.5)` | `border-[#4A5D4F]/50` | border карточки при hover с акцентом |

### Sage accent — главное правило

**#4A5D4F — единственный акцент.** Это muted sage green — природный, приглушённый, надёжный.
CTA выделяется естественно: sage green на stone фоне = органичный контраст.
Hover углубляется до `#3A4A3F` — как тень листвы.

```css
/* Accent glow — ТОНКИЙ, sage, природный */
.glow-sage-subtle {
  box-shadow: 0 0 0 1px rgba(74, 93, 79, 0.12), 0 0 6px rgba(74, 93, 79, 0.04);
}

/* Hover glow на карточках */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(74, 93, 79, 0.2), 0 8px 24px -8px rgba(74, 93, 79, 0.12);
}
```

Tailwind (inline):
- Покой: `shadow-none`
- Hover: `hover:shadow-[0_0_0_1px_rgba(74,93,79,0.2),0_8px_24px_-8px_rgba(74,93,79,0.12)]`

**⚠️ НЕ использовать warm/цветные акценты:**
- ❌ `#FDB900` (amber) — запрещён
- ❌ `#B45309` (terracotta) — запрещён
- ❌ `#F59E0B` (yellow-500) — слишком тёплый
- ❌ `#D97706` (amber-600) — оранжевый оттенок
- ❌ `#4F46E5` (indigo) — слишком tech
- ❌ `#06b6d4` (cyan) — слишком tech
- ✅ `#4A5D4F` (sage green) — природный, cool/natural
- ✅ `#3A4A3F` (sage dark) — hover, глубже
- ✅ `#059669` (emerald-600) — success (холодный зелёный)
- ✅ `#CA8A04` (yellow-700) — warning (приглушённый)


---


## Типографика

### Семейства шрифтов

| Элемент | Шрифт | Tailwind | Почему |
|---------|-------|----------|--------|
| Заголовки (h1–h6) | Sora | `font-display` | Геометрический, чистый. Премиальный natural-стиль. |
| Body text | Inter | `font-body` | Стандарт для веба, отличная читаемость |
| Тех. данные, код, цифры | JetBrains Mono | `font-mono tabular-nums` | Точность |
| Надзаголовки (eyebrow) | Sora | `font-display` | Согласованность с заголовками |
| Badge, labels | Inter | `font-body font-medium` | Чистые бейджи |

### Веса

| Weight | Tailwind | Применение |
|--------|----------|-----------|
| 400 | `font-normal` | body text |
| 500 | `font-medium` | UI labels, nav links, кнопки, тех. данные в mono |
| 600 | `font-semibold` | card titles, section headings (Sora) |
| 700 | `font-bold` | hero titles (Sora) |

### Letter-spacing

- Hero: `tracking-tighter` (Sora требует tighter для слитности)
- Section headings: `tracking-tight`
- Eyebrow/labels: `tracking-wider` (0.05em) + `uppercase`
- Body / UI: `tracking-normal`

### Tailwind config для Sora

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          display: ['Sora', 'sans-serif'],
          body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        },
      }
    }
  }
</script>
```


---


## Композиция (Layout Patterns)

### Hero Layouts (3 варианта)

**A. Centered (default)**
max-w-2xl mx-auto text-center. Eyebrow → h1 (6xl-7xl tracking-tighter, Sora) → subtitle → CTAs.
Природный вход — спокойный, уверенный, с воздухом.

**B. Split 50/50 (продуктовые страницы)**
grid lg:grid-cols-2 gap-16, left = текст, right = изображение.
Идеально для «о продукте», «о материале», «о процессе».

**C. Editorial (текстовый hero)**
max-w-3xl mx-auto, выравнивание по левому краю. Заголовок-манифест + длинный подзаголовок.
Идеально для about, philosophy, sustainability manifesto.

### Whitespace Rhythm

Sage Stone = щедрый whitespace, как пространство в природе. Отступы воздушные.

| Секция | Padding (y) | Tailwind | Характер |
|--------|------------|----------|----------|
| Hero | top: 120-144px, bottom: 96-112px | pt-30..36 pb-24..28 | Воздушный вход |
| Features / Advantages | 128-144px | py-32..36 | Максимально просторно |
| Comparison / Specs | 80px | py-20 | Компактно, по делу |
| CTA / Form | 96px | py-24 | Акцент на действии |
| Catalog grid | 80px | py-20 | Плотно, много карточек |
| Footer | top: 64px, bottom: 48px | pt-16 pb-12 | Завершение |

### Depth Layering (4+ уровня)

| Level | Цвет | Tailwind | Назначение |
|-------|------|----------|-----------|
| Level 0 | #F7F6F3 | bg-[#F7F6F3] | Page background |
| Level 1 | #EFEDE9 | bg-[#EFEDE9] | Alt sections, footer |
| Level 2 | #FFFFFF | bg-white | Cards, panels |
| Level 3 | rgba(74,93,79,0.04) | bg-[#4A5D4F]/[0.04] | Hover states, subtle highlights |
| Level 4 | #4A5D4F | bg-[#4A5D4F] | Accent (≤5% площади) |

Главная фишка: разница между Level 0 и Level 1 — едва заметная, как два оттенка песка.
Это осознанно: природная палитра не должна «пестрить». Только приглядевшись замечаешь глубину.

### Hero Typography Scale

| Элемент | Размер | Tailwind | Вес | Особенность |
|---------|--------|----------|-----|-------------|
| Eyebrow | 12px | text-xs tracking-widest uppercase | font-semibold | Sora, text-stone-400 |
| h1 | 64-80px | text-6xl..8xl tracking-tighter | font-bold | Sora, text-stone-900 |
| Subtitle | 18px | text-lg | font-normal | Inter, text-stone-500, max-w-xl |
| Stats (числа) | 30px | text-3xl | font-bold | font-mono text-stone-800 |
| Stats (подписи) | 12px | text-xs | font-medium | text-stone-400 |

Контраст hero: 80px / 12px = 6.7x → ultra-premium. Sage Stone дышит.


---


## Компоненты

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-stone-200 bg-[#F7F6F3]/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[#4A5D4F]">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-0.5 4-1.5C12 18 8 14 8 10c0-3 2-6 4-8z" fill="currentColor"/>
      </svg>
      Brand
    </a>

    <!-- Nav links -->
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#features" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">Features</a>
      <a href="#materials" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">Materials</a>
      <a href="#about" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">About</a>
    </div>

    <!-- CTA -->
    <a href="#start" class="rounded-md bg-[#4A5D4F] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#3A4A3F]">
      Get started
    </a>
  </nav>
</header>
```

Ключевые моменты:
- `bg-[#F7F6F3]/80` — натуральный off-white, полупрозрачный.
- `border-stone-200` — едва заметная граница.
- Ссылки hover → `text-stone-900` (темнеют, не меняют hue).
- CTA: sage green фон + белый текст.

---

### Hero

```html
<section class="relative overflow-hidden bg-[#F7F6F3] pt-32 pb-24">
  <div class="absolute inset-0 opacity-[0.03]" style="background: radial-gradient(ellipse 80% 60% at 50% 0%, #4A5D4F, transparent);"></div>
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-stone-400">
        Built with nature in mind
      </span>
      <h1 class="mt-8 font-display text-6xl font-bold tracking-tighter text-stone-900 sm:text-7xl lg:text-8xl">
        Sustainable by<br>
        <span class="text-[#4A5D4F]">design</span>
      </h1>
      <p class="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-stone-500">
        Materials and processes that respect the planet.
        Built to last, designed to endure.
      </p>
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[#4A5D4F] px-6 py-3 text-base font-semibold text-white transition-all duration-150 hover:bg-[#3A4A3F] hover:shadow-[0_0_0_1px_rgba(74,93,79,0.25),0_8px_24px_-8px_rgba(74,93,79,0.15)]">
          Explore materials
        </a>
        <a href="#docs" class="rounded-md border border-stone-200 bg-transparent px-6 py-3 text-base font-medium text-stone-500 transition-all duration-150 hover:border-[#4A5D4F] hover:text-[#4A5D4F]">
          Our process
        </a>
      </div>
    </div>
  </div>
</section>
```

Ключевые особенности:
- `bg-[#F7F6F3]` — натуральный off-white (не чистый #FFF).
- Subtle radial gradient — ЕДИНСТВЕННЫЙ декоративный элемент, opacity 0.03, sage tint.
- h1 в Sora `tracking-tighter` — геометрическая слитность.
- Цветной span — sage green `#4A5D4F`.
- CTA: sage solid + sage-тень на hover.

---

### Карточки

```html
<div class="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A5D4F]/40 hover:shadow-[0_0_0_1px_rgba(74,93,79,0.15),0_8px_24px_-8px_rgba(74,93,79,0.1)]">
  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A5D4F]/[0.08]">
    <svg class="h-5 w-5 text-[#4A5D4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
    </svg>
  </div>
  <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-stone-900">
    Solar Powered
  </h3>
  <p class="mt-2 text-sm leading-relaxed text-stone-500">
    100% renewable energy in every step of production.
    Carbon-negative by 2025.
  </p>
  <a href="#" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-stone-400 transition-colors duration-150 hover:text-[#4A5D4F]">
    Learn more
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </a>
</div>
```

Отличия sage-stone:
- Иконки на `bg-[#4A5D4F]/[0.08]` — едва заметный sage tint.
- Заголовки в Sora (`font-display`).
- Hover border → sage green с низкой opacity (природно).
- Тень hover — sage-tinted, приглушённая.
- Ссылки меняют цвет на sage green (природный акцент).

---

### Кнопки

**Primary (solid sage):**

```html
<button class="rounded-md bg-[#4A5D4F] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#3A4A3F] hover:shadow-[0_10px_30px_-10px_rgba(74,93,79,0.3)] focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] focus:ring-offset-2 focus:ring-offset-[#F7F6F3]">
  Get started
</button>
```

**Secondary (outline):**

```html
<button class="rounded-md border border-stone-200 bg-transparent px-6 py-3 text-sm font-medium text-stone-500 transition-all duration-150 hover:border-[#4A5D4F] hover:text-[#4A5D4F] focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] focus:ring-offset-2 focus:ring-offset-[#F7F6F3]">
  Learn more
</button>
```

**Ghost:**

```html
<button class="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-stone-400 transition-colors duration-150 hover:bg-stone-100 hover:text-stone-700">
  View all →
</button>
```

Варианты по приоритету:
| Вариант | Tailwind | Когда |
|---------|----------|-------|
| Primary | `bg-[#4A5D4F] text-white` | Основной CTA |
| Secondary | `border-stone-200 text-stone-500` | Второстепенное действие |
| Ghost | `text-stone-400 hover:text-stone-700` | Навигация внутри секции |

**Правило:** gradient на кнопках НЕ использовать. Sage Stone = solid, природа не нуждается в градиентах.

---

### Badges

```html
<!-- Sage badge -->
<span class="inline-flex items-center rounded-md bg-[#4A5D4F]/[0.08] px-2.5 py-0.5 text-xs font-medium text-[#4A5D4F]">Sustainable</span>

<!-- Success badge -->
<span class="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Carbon Neutral</span>

<!-- Neutral badge -->
<span class="inline-flex items-center rounded-md bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">Certified</span>
```

---

### Форма

```html
<form class="rounded-2xl border border-stone-200 bg-white p-8">
  <h3 class="font-display text-xl font-semibold tracking-tight text-stone-900">Get early access</h3>
  <p class="mt-2 text-sm text-stone-500">Join the waitlist. We will send you an invite.</p>
  <div class="mt-6 space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-stone-600">Name</label>
      <input id="name" type="text" placeholder="John Doe"
        class="mt-1.5 block w-full rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:border-[#4A5D4F] focus:outline-none focus:ring-1 focus:ring-[#4A5D4F]" />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-stone-600">Email</label>
      <input id="email" type="email" placeholder="john@company.com"
        class="mt-1.5 block w-full rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:border-[#4A5D4F] focus:outline-none focus:ring-1 focus:ring-[#4A5D4F]" />
    </div>
  </div>
  <button type="submit" class="mt-6 w-full rounded-md bg-[#4A5D4F] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#3A4A3F] hover:shadow-[0_10px_30px_-10px_rgba(74,93,79,0.3)] focus:outline-none focus:ring-2 focus:ring-[#4A5D4F] focus:ring-offset-2 focus:ring-offset-white">
    Request access
  </button>
  <p class="mt-3 text-center text-xs text-stone-400">No spam. Unsubscribe anytime.</p>
</form>
```

Ключевые моменты:
- Inputs: `bg-white` + `border-stone-200`.
- Focus: `border-[#4A5D4F]` + `ring-1 ring-[#4A5D4F]` (sage).
- Placeholder: `text-stone-400`.
- Submit: sage solid.

---

### Таблица

```html
<div class="overflow-hidden rounded-2xl border border-stone-200 bg-white">
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-stone-200">
        <th class="px-6 py-4 font-medium text-stone-500">Material</th>
        <th class="px-6 py-4 font-medium text-stone-500">Source</th>
        <th class="px-6 py-4 font-medium text-stone-500">CO2 Impact</th>
        <th class="px-6 py-4 font-medium text-stone-500">Certification</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-stone-200/50 transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Bamboo Composite</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">Vietnam</td>
        <td class="px-6 py-4 font-mono tabular-nums text-emerald-600">-2.4 kg</td>
        <td class="px-6 py-4 text-stone-500">FSC Certified</td>
      </tr>
      <tr class="border-b border-stone-200/50 transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Recycled Stone</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">Italy</td>
        <td class="px-6 py-4 font-mono tabular-nums text-emerald-600">-1.8 kg</td>
        <td class="px-6 py-4 text-stone-500">Cradle to Cradle</td>
      </tr>
      <tr class="transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Hemp Fiber</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">France</td>
        <td class="px-6 py-4 font-mono tabular-nums text-emerald-600">-3.1 kg</td>
        <td class="px-6 py-4 text-stone-500">GOTS Organic</td>
      </tr>
    </tbody>
  </table>
</div>
```

Ключевые моменты:
- `bg-white` — чистый белый для таблицы.
- Тех. значения в `font-mono tabular-nums` — точность.
- `hover:bg-stone-50` — тонкий hover строк.
- CO2 Impact выделен emerald — positive metric.
- Границы: `border-stone-200`.

---

### Footer

```html
<footer class="bg-[#EFEDE9] py-16">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
      <!-- Brand -->
      <div>
        <a href="/" class="font-display text-xl font-bold text-stone-900">Brand</a>
        <p class="mt-3 text-sm leading-relaxed text-stone-500">
          Built with nature in mind. Sustainable materials for a better tomorrow.
        </p>
      </div>
      <!-- Links -->
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Product</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Materials</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Process</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Certifications</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Company</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">About</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Sustainability</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Careers</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Legal</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Privacy</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-[#4A5D4F]">Terms</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 border-t border-stone-200 pt-8 text-center">
      <p class="text-sm text-stone-400">
        &copy; 2024 Company. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

Ключевые моменты:
- `bg-[#EFEDE9]` — альтернативный фон (footer утапливается).
- Ссылки hover → `text-[#4A5D4F]` (sage green акцент).
- Разделитель `border-stone-200`.
- Sage accent на hover ссылок — единственный цветной элемент в footer.

---

## Section Examples

### Features Grid (3 колонки)

```html
<section class="bg-[#F7F6F3] py-32">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <!-- Section header -->
    <div class="mx-auto max-w-2xl text-center">
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-[#4A5D4F]">Why choose us</span>
      <h2 class="mt-4 font-display text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Nature-first approach
      </h2>
      <p class="mt-4 text-lg text-stone-500">
        Every decision starts with the planet. Here is what that means in practice.
      </p>
    </div>

    <!-- Cards grid -->
    <div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A5D4F]/40 hover:shadow-[0_0_0_1px_rgba(74,93,79,0.15),0_8px_24px_-8px_rgba(74,93,79,0.1)]">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A5D4F]/[0.08]">
          <svg class="h-5 w-5 text-[#4A5D4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-stone-900">Solar Powered</h3>
        <p class="mt-2 text-sm leading-relaxed text-stone-500">100% renewable energy across all production facilities.</p>
      </div>

      <!-- Card 2 -->
      <div class="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A5D4F]/40 hover:shadow-[0_0_0_1px_rgba(74,93,79,0.15),0_8px_24px_-8px_rgba(74,93,79,0.1)]">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A5D4F]/[0.08]">
          <svg class="h-5 w-5 text-[#4A5D4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.211.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.788-.394c-.54-.27-.54-1.048 0-1.318l.128-.064a2.25 2.25 0 012.414.282l.064.049c.54.42 1.282.42 1.822 0l.064-.049a2.25 2.25 0 012.414-.282l.128.064c.54.27.54 1.048 0 1.318l-.788.394a1.125 1.125 0 00-.578 1.315l.208.73a1.125 1.125 0 001.302.795l1.178-.236a2.25 2.25 0 012.37 1.048l.09.15a2.25 2.25 0 01.29.787l.007.042a2.25 2.25 0 01-1.383 2.46l-.655.261a2.253 2.253 0 00-1.414 2.089v1.172c0 .584-.473 1.055-1.055 1.055a2.11 2.11 0 01-1.81-1.025"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-stone-900">Zero Waste</h3>
        <p class="mt-2 text-sm leading-relaxed text-stone-500">Closed-loop manufacturing. Every offcut finds a second life.</p>
      </div>

      <!-- Card 3 -->
      <div class="group rounded-2xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4A5D4F]/40 hover:shadow-[0_0_0_1px_rgba(74,93,79,0.15),0_8px_24px_-8px_rgba(74,93,79,0.1)]">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A5D4F]/[0.08]">
          <svg class="h-5 w-5 text-[#4A5D4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-stone-900">Certified Safe</h3>
        <p class="mt-2 text-sm leading-relaxed text-stone-500">Independently tested. Exceeds EU and US safety standards.</p>
      </div>
    </div>
  </div>
</section>
```

### CTA Section

```html
<section class="bg-[#EFEDE9] py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
        Ready to build sustainably?
      </h2>
      <p class="mt-4 text-lg text-stone-500">
        Join hundreds of companies choosing nature-first materials.
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[#4A5D4F] px-8 py-3.5 text-base font-semibold text-white transition-all duration-150 hover:bg-[#3A4A3F] hover:shadow-[0_10px_30px_-10px_rgba(74,93,79,0.3)]">
          Start your project
        </a>
        <a href="#contact" class="rounded-md border border-stone-300 bg-transparent px-8 py-3.5 text-base font-medium text-stone-600 transition-all duration-150 hover:border-[#4A5D4F] hover:text-[#4A5D4F]">
          Talk to us
        </a>
      </div>
    </div>
  </div>
</section>
```

---

## Wow-паттерны (сдержанные, природные)

### 1. Stagger Reveal (каскадное появление) — ВСЕГДА

```html
<style>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 500ms ease, transform 500ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 80ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 160ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 240ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 320ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 400ms; }
</style>

<div class="stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="reveal rounded-2xl border border-stone-200 bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-stone-200 bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-stone-200 bg-white p-6">...</div>
</div>
```

### 2. Subtle Lift on Hover (природная мягкость)

```html
<style>
.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -4px rgba(74, 93, 79, 0.1);
}
</style>
```

### 3. Fade-in Section Title

Простое появление заголовка секции при скролле — только opacity + translateY.

```html
<style>
.section-title-reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 700ms ease 100ms, transform 700ms ease 100ms;
}
.section-title-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

### 4. Organic Breathing (subtle sage pulse)

```html
<style>
@keyframes sage-breathe {
  0%, 100% { opacity: 0.03; }
  50% { opacity: 0.06; }
}
.sage-glow-bg {
  animation: sage-breathe 6s ease-in-out infinite;
}
</style>
```

### НЕ использовать

| ❌ Паттерн | Почему |
|-----------|--------|
| Text Shimmer (любого цвета) | Цветное свечение противоречит природной палитре |
| Gradient Border on Hover | Слишком ярко для sage-stone |
| Spotlight Follow Cursor | Неон — категорически нет |
| Animated Gradient Border | Требует цвета |
| Morphing Blob | Игриво, не для organic premium |
| Любые glow-эффекты >0.15 opacity | Природная сдержанность |

---

## Anti-patterns (ЗАПРЕЩЕНО)

| ❌ Нельзя | ✅ Вместо |
|----------|----------|
| Любой warm accent (#FDB900, #B45309, #F59E0B, #D97706) | Только sage #4A5D4F / #3A4A3F |
| Amber #FDB900, #F59E0B | НЕТ — «какашечный» |
| Terracotta #B45309 | НЕТ — «какашечный» |
| Indigo / blue / cyan / violet (насыщенный) | НЕТ — слишком tech, не природный |
| Gradient buttons | Solid sage только |
| Glow-эффекты >0.15 opacity | Только лёгкие тени (opacity ≤ 0.15) |
| `rounded-full` на кнопках | `rounded-md` |
| `font-sans` для hero | `font-display` (Sora) |
| Цветные иконки (indigo, cyan, amber) | Sage green иконки `text-[#4A5D4F]` |
| Heavy shadows (blur > 12px, высокая opacity) | Лёгкие тени с sage tint |
| `bg-white` для page | `bg-[#F7F6F3]` (натуральный off-white) |
| Цветной hover на ссылках (indigo, blue) | Sage green hover `hover:text-[#4A5D4F]` |
| Насыщенный orange / red как акцент | Sage green — единственный акцент |

---

## Theme-specific exceptions

| Базовый запрет | Исключение в sage-stone | Обоснование |
|---------------|---------------------------|-------------|
| Heavy shadows (blur > 15px) | Лёгкое sage-свечение на hover (`blur: 24px, opacity 0.10`) | Природное «дыхание» — едва заметное |
| Gradient buttons | **НЕ переопределяется.** Gradient ЗАПРЕЩЁН. | Solid sage = природная чистота |
| Карточки без border, только shadow | Карточки = `border border-stone-200` + sage тень на hover | Stone border для читаемости |
| `font-sans` для заголовков | `font-display` (Sora) для h1-h6 | Геометрический шрифт = часть brand |
| `bg-white` на page-контейнерах | `bg-white` ОК для карточек | bg-page #F7F6F3 → cards bg-white = контраст |

### Что НЕ переопределяется (строго как в tokens):

- Кнопки — `rounded-md`, НЕ `rounded-full`.
- Section padding ≥ `py-20`.
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Hero titles — `tracking-tighter` (для Sora).

---

## Tailwind Classes Mapping

Быстрый справочник для копирования:

| Назначение | Tailwind класс |
|-----------|----------------|
| Фон страницы | `bg-[#F7F6F3]` |
| Фон секций (alt) | `bg-[#EFEDE9]` |
| Карточки | `bg-white border border-stone-200 rounded-2xl` |
| CTA кнопка | `bg-[#4A5D4F] text-white rounded-md` |
| CTA hover | `hover:bg-[#3A4A3F]` |
| Secondary кнопка | `border border-stone-200 text-stone-500 rounded-md` |
| Ghost кнопка | `text-stone-400 hover:bg-stone-100 hover:text-stone-700` |
| Заголовок (hero) | `font-display text-6xl font-bold tracking-tighter text-stone-900` |
| Заголовок секции | `font-display text-4xl font-bold tracking-tight text-stone-900` |
| Body текст | `text-stone-500` |
| Muted текст | `text-stone-400` |
| Eyebrow | `font-display text-xs font-semibold tracking-widest uppercase text-[#4A5D4F]` |
| Badge (sage) | `bg-[#4A5D4F]/[0.08] text-[#4A5D4F] rounded-md` |
| Badge (success) | `bg-emerald-50 text-emerald-700 rounded-md` |
| Input | `border border-stone-200 rounded-md focus:border-[#4A5D4F] focus:ring-1 focus:ring-[#4A5D4F]` |
| Hover карточки | `hover:border-[#4A5D4F]/40 hover:shadow-[0_0_0_1px_rgba(74,93,79,0.15),0_8px_24px_-8px_rgba(74,93,79,0.1)]` |
| Footer | `bg-[#EFEDE9]` |
| Navbar | `bg-[#F7F6F3]/80 backdrop-blur-md border-b border-stone-200` |
| Brand shadow | `shadow-[0_10px_30px_-10px_rgba(74,93,79,0.3)]` |
| Card shadow (hover) | `shadow-[0_8px_24px_-8px_rgba(74,93,79,0.15)]` |

---

## Чек-лист sage-stone

- [ ] Фон страницы = `bg-[#F7F6F3]`, НЕ `bg-white`.
- [ ] Карточки = `bg-white border border-stone-200 rounded-2xl`.
- [ ] CTA = solid `bg-[#4A5D4F] text-white` (НЕ gradient!).
- [ ] Заголовки = Sora (`font-display`).
- [ ] Body = Inter (`font-body`).
- [ ] Accent = sage green `#4A5D4F` — единственный цветной акцент.
- [ ] Hover accent = `#3A4A3F` (глубже sage).
- [ ] Ссылки hover → sage green `hover:text-[#4A5D4F]`.
- [ ] Тени — sage-tinted, opacity ≤ 0.15.
- [ ] Hero = subtle radial gradient (opacity 0.03).
- [ ] Кнопки = `rounded-md`, НЕ `rounded-full`.
- [ ] Footer = `bg-[#EFEDE9]`.
- [ ] CSS :root блок с --shadow-brand (sage-tinted цветной тенью).
- [ ] --transition-smooth с cubic-bezier(0.4, 0, 0.2, 1).
- [ ] `--font-display` и `--font-body` в :root.
- [ ] **Акцент ≤5% площади** — sage только на CTA и ключевых элементах.
- [ ] **НЕ #FDB900, НЕ #B45309, НЕ #F59E0B, НЕ #D97706** — только sage-700/stone.
- [ ] Warning цвет = `#CA8A04` (yellow-700, приглушённый, НЕ amber).
- [ ] NO hardcoded hex в компонентах с CSS variables — только var(--color-*) или Tailwind.
- [ ] --shadow-brand ЦВЕТНОЙ (sage green tint, не neutral grey).

