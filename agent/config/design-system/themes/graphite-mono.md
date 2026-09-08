# Graphite Mono

> Apple/Linear neutral premium. Премиум через МОНОХРОМ и whitespace.
> Accent = более тёмный graphite на CTA, не цвет. Строгость, минимализм, воздух.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема **light-only** — монохром раскрывается только на светлом фоне.

---

## CSS Custom Properties (ОБЯЗАТЕЛЬНО для `<head>`)

```html
<style>
:root {
  --color-bg-page: #FAFAF9;
  --color-bg-alt: #F5F5F4;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #FAFAF9;
  --color-text-primary: #1C1917;
  --color-text-secondary: #57534E;
  --color-text-muted: #57534E; /* WCAG AA fix: stone-600, ~6.5:1 on #FAFAF9 */
  --color-primary: #44403C;
  --color-primary-hover: #292524;
  --color-primary-glow: rgba(68, 64, 60, 0.4);
  --color-primary-subtle: rgba(68, 64, 60, 0.08);
  --color-success: #059669;
  --color-danger: #DC2626;
  --color-warning: #D97706;
  --color-border: #E7E5E4;
  --color-border-hover: #D6D3D1;
  --color-border-accent-hover: rgba(68, 64, 60, 0.5);
  --gradient-primary: linear-gradient(135deg, #44403C, #292524);
  --gradient-subtle: linear-gradient(180deg, #FAFAF9, #F5F5F4);
  --shadow-brand: 0 10px 30px -10px rgba(68, 64, 60, 0.3);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 8px 24px -8px rgba(68, 64, 60, 0.15);
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

**Premium, minimal, precise, quiet.**

Роскошь через отсутствие цвета. Apple — не потому что кнопка синяя, а потому что всё остальное — воздух.
Linear — не потому что accent яркий, а потому что интерфейс дышит.
Graphite Mono = самый тихий, самый дорогой. Цвета нет — есть ТОЛЬКО типографика, сетка, whitespace.

### Когда использовать

- Премиальные SaaS и dev-tools (Linear, Vercel, Railway)
- Архитектурные бюро и дизайн-студии
- Портфолио минималистов
- Финтех и banking (премиум через сдержанность)
- Корпоративные сайты уровня McKinsey/Bain
- Любой проект где «дизайн = отсутствие дизайна»

### Когда НЕ использовать

- Gaming / киберпанк / neon (для этого bold-tech, dark-tech)
- E-commerce с эмоциональными товарами (нужен цвет)
- Детские / развлекательные проекты
- Блоги с ярким контентом (лучше editorial-cream)

---

## Цветовая палитра

### Light mode (единственный режим)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#FAFAF9` | `bg-[#FAFAF9]` | основной фон страницы (тёплый off-white, НЕ чистый #FFF) |
| bg (alt surface) | `#F5F5F4` | `bg-stone-100` | альтернативный фон для секций, footer |
| bg (surface / cards) | `#FFFFFF` | `bg-white` | карточки, панели, модальные окна |
| bg (elevated) | `#FAFAF9` | `bg-[#FAFAF9]` | hover states, subtle highlight |
| text (headings) | `#1C1917` | `text-stone-900` | заголовки, hero title |
| text (body) | `#57534E` | `text-stone-600` | основной текст, параграфы |
| text (muted) | `#57534E` | `text-stone-600` | secondary, placeholder, disabled |
| **accent primary** | `#44403C` | `text-[#44403C]` / `bg-[#44403C]` | CTA, links, active states (graphite) |
| **accent hover** | `#292524` | `hover:bg-[#292524]` | hover на accent-элементах |
| accent subtle bg | `rgba(68,64,60,0.08)` | `bg-[#44403C]/[0.08]` | иконки в карточках, tinted фоны |
| success / positive | `#059669` | `text-emerald-600` | positive metrics, checkmarks |
| danger / negative | `#DC2626` | `text-red-600` | negative metrics, warnings |
| warning | `#D97706` | `text-amber-600` | caution states |
| border (default) | `#E7E5E4` | `border-stone-200` | card border, divider, input border |
| border (hover) | `#D6D3D1` | `border-stone-300` | border на hover карточек без accent |
| border (accent hover) | `rgba(68,64,60,0.5)` | `border-[#44403C]/50` | border карточки при hover с акцентом |

### Graphite accent — главное правило

**#44403C — единственный акцент.** Это graphite, не цвет. На 2-3 тона темнее основного текста.
CTA не «выделяется цветом» — он просто темнее. Это осознанное решение: premium = тишина.

```css
/* Accent glow — ТОНКИЙ, graphite, едва заметный */
.glow-graphite-subtle {
  box-shadow: 0 0 0 1px rgba(68, 64, 60, 0.12), 0 0 6px rgba(68, 64, 60, 0.04);
}

/* Hover glow на карточках */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(68, 64, 60, 0.2), 0 8px 24px -8px rgba(68, 64, 60, 0.12);
}
```

Tailwind (inline):
- Покой: `shadow-none`
- Hover: `hover:shadow-[0_0_0_1px_rgba(68,64,60,0.2),0_8px_24px_-8px_rgba(68,64,60,0.12)]`

**⚠️ НЕ использовать цветные акценты:**
- ❌ `#FDB900` (amber) — цвет, противоречит монохрому
- ❌ `#B45309` (terracotta) — слишком тёплый
- ❌ `#4F46E5` (indigo) — цвет!
- ❌ `#06b6d4` (cyan) — цвет!
- ✅ `#44403C` (stone-700) — graphite, почти neutral
- ✅ `#292524` (stone-800) — hover, глубже

---

## Типографика

### Семейства шрифтов

| Элемент | Шрифт | Tailwind | Почему |
|---------|-------|----------|--------|
| Заголовки (h1–h6) | Sora | `font-display` | Геометрический, чистый. Linear-стиль. |
| Body text | Inter | `font-body` | Стандарт для веба |
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
Минималистичный вход — много воздуха, мало слов.

**B. Split 50/50 (продуктовые страницы)**
grid lg:grid-cols-2 gap-16, left = текст, right = изображение.
Идеально для «о продукте».

**C. Editorial (текстовый hero)**
max-w-3xl mx-auto, выравнивание по левому краю. Заголовок-манифест + длинный подзаголовок.
Идеально для about, philosophy, manifesto.

### Whitespace Rhythm

Graphite Mono = максимальный whitespace. Отступы щедрые.

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
| Level 0 | #FAFAF9 | bg-[#FAFAF9] | Page background |
| Level 1 | #F5F5F4 | bg-stone-100 | Alt sections, footer |
| Level 2 | #FFFFFF | bg-white | Cards, panels |
| Level 3 | rgba(68,64,60,0.04) | bg-[#44403C]/[0.04] | Hover states, subtle highlights |
| Level 4 | #44403C | bg-[#44403C] | Accent (≤3% площади) |

Главная фишка: разница между Level 0 и Level 1 — минимальная (почти незаметна). Это осознанно:
монохромный сайт не должен «пестрить» оттенками серого. Только приглядевшись замечаешь разницу.

### Hero Typography Scale

| Элемент | Размер | Tailwind | Вес | Особенность |
|---------|--------|----------|-----|-------------|
| Eyebrow | 12px | text-xs tracking-widest uppercase | font-semibold | Sora, text-stone-400 |
| h1 | 64-80px | text-6xl..8xl tracking-tighter | font-bold | Sora, text-stone-900 |
| Subtitle | 18px | text-lg | font-normal | Inter, text-stone-500, max-w-xl |
| Stats (числа) | 30px | text-3xl | font-bold | font-mono text-stone-800 |
| Stats (подписи) | 12px | text-xs | font-medium | text-stone-400 |

Контраст hero: 80px / 12px = 6.7x → ultra-premium. Главное оружие graphite-mono.

---

## Компоненты

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-[#E7E5E4] bg-[#FAFAF9]/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-display text-xl font-bold text-stone-900">
      <!-- logo mark — simple geometric shape -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[#44403C]">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor"/>
      </svg>
      Company
    </a>

    <!-- Nav links -->
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#features" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">
        Features
      </a>
      <a href="#pricing" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">
        Pricing
      </a>
      <a href="#docs" class="text-sm font-medium text-stone-500 transition-colors duration-150 hover:text-stone-900">
        Docs
      </a>
    </div>

    <!-- CTA -->
    <a href="#start" class="rounded-md bg-[#44403C] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#292524]">
      Get started
    </a>
  </nav>
</header>
```

Ключевые моменты:
- `bg-[#FAFAF9]/80` — почти белый, полупрозрачный.
- `border-[#E7E5E4]` — едва заметная граница.
- Ссылки hover → `text-stone-900` (темнеют, не меняют цвет).
- CTA: graphite фон + белый текст.

### Hero

```html
<section class="relative overflow-hidden bg-[#FAFAF9] pt-32 pb-24">
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <!-- eyebrow -->
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-stone-400">
        Platform for builders
      </span>
      <!-- hero title -->
      <h1 class="mt-8 font-display text-6xl font-bold tracking-tighter text-stone-900 sm:text-7xl lg:text-8xl">
        Build products<br>
        <span class="text-[#44403C]">that matter</span>
      </h1>
      <!-- subtitle -->
      <p class="mx-auto mt-8 max-w-lg text-lg leading-relaxed text-stone-500">
        A minimal toolkit for teams who value clarity over clutter.
        No distractions. Just the essentials.
      </p>
      <!-- CTA buttons -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[#44403C] px-6 py-3 text-base font-semibold text-white transition-all duration-150 hover:bg-[#292524] hover:shadow-[0_0_0_1px_rgba(68,64,60,0.25),0_8px_24px_-8px_rgba(68,64,60,0.15)]">
          Start building
        </a>
        <a href="#docs" class="rounded-md border border-stone-200 bg-transparent px-6 py-3 text-base font-medium text-stone-500 transition-all duration-150 hover:border-[#44403C] hover:text-[#44403C]">
          Read the docs
        </a>
      </div>
    </div>
  </div>
</section>
```

Ключевые особенности:
- `bg-[#FAFAF9]` — тёплый off-white (не чистый #FFF).
- БЕЗ radial gradient — graphite-mono = чистота, отсутствие украшательств.
- h1 в Sora `tracking-tighter` — геометрическая слитность.
- Цветной span в заголовке — ЕДИНСТВЕННЫЙ цветной элемент, graphite.
- CTA: graphite solid + лёгкая тень на hover.

### Карточки

```html
<div class="group rounded-2xl border border-[#E7E5E4] bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#44403C]/40 hover:shadow-[0_0_0_1px_rgba(68,64,60,0.15),0_8px_24px_-8px_rgba(68,64,60,0.1)]">
  <!-- icon -->
  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#44403C]/[0.08]">
    <svg class="h-5 w-5 text-[#44403C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  </div>
  <!-- content -->
  <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-stone-900">
    Lightning Fast
  </h3>
  <p class="mt-2 text-sm leading-relaxed text-stone-500">
    Built on Rust for maximum performance. Sub-millisecond response times at any scale.
  </p>
  <!-- link -->
  <a href="#" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-stone-400 transition-colors duration-150 hover:text-[#44403C]">
    Learn more
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </a>
</div>
```

Отличия graphite-mono:
- Иконки на `bg-[#44403C]/[0.08]` — едва заметный graphite tint.
- Заголовки в Sora (`font-display`).
- Hover border → graphite с низкой opacity (сдержанно).
- Тень hover — едва заметная, graphite.
- Ссылки темнеют до graphite, не меняют цвет радикально.

### Кнопки

**Primary (solid graphite):**

```html
<button class="rounded-md bg-[#44403C] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#292524] hover:shadow-[0_0_0_1px_rgba(68,64,60,0.25),0_8px_24px_-8px_rgba(68,64,60,0.15)] focus:outline-none focus:ring-2 focus:ring-[#44403C] focus:ring-offset-2 focus:ring-offset-[#FAFAF9]">
  Get started
</button>
```

**Secondary (outline):**

```html
<button class="rounded-md border border-stone-200 bg-transparent px-6 py-3 text-sm font-medium text-stone-500 transition-all duration-150 hover:border-[#44403C] hover:text-[#44403C] focus:outline-none focus:ring-2 focus:ring-[#44403C] focus:ring-offset-2 focus:ring-offset-[#FAFAF9]">
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
| Primary | `bg-[#44403C] text-white` | Основной CTA |
| Secondary | `border-stone-200 text-stone-500` | Второстепенное действие |
| Ghost | `text-stone-400 hover:text-stone-700` | Навигация внутри секции |

**Правило:** gradient на кнопках НЕ использовать. Graphite Mono = solid, без украшательств.

### Таблица

```html
<div class="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white">
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-[#E7E5E4]">
        <th class="px-6 py-4 font-medium text-stone-500">Plan</th>
        <th class="px-6 py-4 font-medium text-stone-500">Price</th>
        <th class="px-6 py-4 font-medium text-stone-500">Requests</th>
        <th class="px-6 py-4 font-medium text-stone-500">Support</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[#E7E5E4]/50 transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Starter</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-700">$0/mo</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">1K</td>
        <td class="px-6 py-4 text-stone-500">Community</td>
      </tr>
      <tr class="border-b border-[#E7E5E4]/50 transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Pro</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-700">$29/mo</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">100K</td>
        <td class="px-6 py-4 text-stone-500">Email</td>
      </tr>
      <tr class="transition-colors duration-150 hover:bg-stone-50">
        <td class="px-6 py-4 font-medium text-stone-900">Enterprise</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-700">Custom</td>
        <td class="px-6 py-4 font-mono tabular-nums text-stone-500">Unlimited</td>
        <td class="px-6 py-4 text-stone-500">Dedicated</td>
      </tr>
    </tbody>
  </table>
</div>
```

Ключевые моменты:
- `bg-white` — чистый белый для таблицы.
- Тех. значения в `font-mono tabular-nums` — точность.
- `hover:bg-stone-50` — тонкий hover строк.
- Границы: `border-[#E7E5E4]` (монохромный border).

### Форма

```html
<form class="rounded-2xl border border-[#E7E5E4] bg-white p-8">
  <h3 class="font-display text-xl font-semibold tracking-tight text-stone-900">Get early access</h3>
  <p class="mt-2 text-sm text-stone-500">Join the waitlist. We'll send you an invite.</p>

  <div class="mt-6 space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-stone-600">Name</label>
      <input
        id="name" type="text" placeholder="John Doe"
        class="mt-1.5 block w-full rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:border-[#44403C] focus:outline-none focus:ring-1 focus:ring-[#44403C]"
      />
    </div>

    <div>
      <label for="email" class="block text-sm font-medium text-stone-600">Email</label>
      <input
        id="email" type="email" placeholder="john@company.com"
        class="mt-1.5 block w-full rounded-md border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 transition-colors duration-150 focus:border-[#44403C] focus:outline-none focus:ring-1 focus:ring-[#44403C]"
      />
    </div>
  </div>

  <button type="submit" class="mt-6 w-full rounded-md bg-[#44403C] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#292524] hover:shadow-[0_0_0_1px_rgba(68,64,60,0.25),0_8px_24px_-8px_rgba(68,64,60,0.15)] focus:outline-none focus:ring-2 focus:ring-[#44403C] focus:ring-offset-2 focus:ring-offset-white">
    Request access
  </button>

  <p class="mt-3 text-center text-xs text-stone-400">
    No spam. Unsubscribe anytime.
  </p>
</form>
```

Ключевые моменты:
- Inputs: `bg-white` + `border-stone-200` (монохромный).
- Focus: `border-[#44403C]` + `ring-1 ring-[#44403C]` (graphite).
- Placeholder: `text-stone-400`.
- Submit: graphite solid.

### Footer

```html
<footer class="bg-stone-100 py-16">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
      <!-- Brand -->
      <div>
        <a href="/" class="font-display text-xl font-bold text-stone-900">
          Company
        </a>
        <p class="mt-3 text-sm leading-relaxed text-stone-500">
          Build products that matter. Minimal toolkit for modern teams.
        </p>
      </div>

      <!-- Links -->
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Product</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Features</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Pricing</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Changelog</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Company</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">About</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Blog</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Careers</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-stone-400">Legal</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Privacy</a></li>
          <li><a href="#" class="text-sm text-stone-500 transition-colors duration-150 hover:text-stone-900">Terms</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-12 border-t border-[#E7E5E4] pt-8 text-center">
      <p class="text-sm text-stone-400">
        © 2024 Company. All rights reserved.
      </p>
    </div>
  </div>
</footer>
```

Ключевые моменты:
- `bg-stone-100` — альтернативный фон (footer утапливается в более тёмный).
- Ссылки hover → `text-stone-900` (темнеют, не меняют цвет!).
- Разделитель `border-[#E7E5E4]`.
- НИКАКИХ цветных акцентов в footer — только монохром.

---

## Wow-паттерны (максимально сдержанные)

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
  <div class="reveal rounded-2xl border border-[#E7E5E4] bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-[#E7E5E4] bg-white p-6">...</div>
  <div class="reveal rounded-2xl border border-[#E7E5E4] bg-white p-6">...</div>
</div>
```

### 2. Subtle Scale on Hover (НЕ glow, НЕ shimmer)

```html
<style>
.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.08);
}
</style>
```

### 3. Fade-in Section Title

Простое появление заголовка секции при скролле — без цвета, без shimmer, без градиентов.
Только opacity.

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

### НЕ использовать

| ❌ Паттерн | Почему |
|-----------|--------|
| Text Shimmer (любого цвета) | Цветное свечение противоречит монохрому |
| Gradient Border on Hover | Слишком ярко для graphite-mono |
| Spotlight Follow Cursor | Неон — категорически нет |
| Animated Gradient Border | Требует цвета |
| Morphing Blob | Игриво, не для premium minimal |
| Number Counter | Допустимо но без анимации |
| Любые glow-эффекты | Монохром = отсутствие свечения |

---

## Anti-patterns (ЗАПРЕЩЕНО)

| ❌ Нельзя | ✅ Вместо |
|----------|----------|
| Любой цветной accent (#FDB900, #B45309, #4F46E5, #06b6d4) | Только graphite #44403C / #292524 |
| Amber #FDB900, #F59E0B | НЕТ — цвет |
| Terracotta #B45309 | НЕТ — слишком тёплый |
| Indigo / blue / cyan / violet | НЕТ — любой насыщенный цвет |
| Gradient buttons | Solid graphite только |
| Glow-эффекты любого цвета | Только лёгкие тени (opacity ≤ 0.15) |
| `rounded-full` на кнопках | `rounded-md` |
| `font-sans` для hero | `font-display` (Sora) |
| Цветные иконки | Монохромные graphite иконки |
| Heavy shadows (blur > 12px) | Лёгкие тени |
| `bg-white` для page | `bg-[#FAFAF9]` (тёплый off-white) |
| Цветной hover на ссылках | Темнеют в graphite, не меняют hue |

---

## Theme-specific exceptions

| Базовый запрет | Исключение в graphite-mono | Обоснование |
|---------------|---------------------------|-------------|
| Heavy shadows (blur > 15px) | Лёгкое graphite-свечение на hover (`blur: 24px, opacity 0.12`) | Единственное «украшение» — и то едва заметное |
| Gradient buttons | **НЕ переопределяется.** Gradient ЗАПРЕЩЁН. | Монохром = solid |
| Карточки без border, только shadow | Карточки = `border border-[#E7E5E4]` + лёгкая тень на hover | Монохромный border для читаемости |
| `font-sans` для заголовков | `font-display` (Sora) для h1-h6 | Геометрический шрифт = часть brand |
| `bg-white` на contain-контейнерах | `bg-white` ОК для карточек | bg-page #FAFAF9 → cards bg-white = контраст |

### Что НЕ переопределяется (строго как в tokens):

- Кнопки — `rounded-md`, НЕ `rounded-full`.
- Section padding ≥ `py-20`.
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Hero titles — `tracking-tighter` (для Sora).

---

## Чек-лист graphite-mono

- [ ] Фон страницы = `bg-[#FAFAF9]`, НЕ `bg-white`.
- [ ] Карточки = `bg-white border border-[#E7E5E4] rounded-2xl`.
- [ ] CTA = solid `bg-[#44403C] text-white` (НЕ gradient!).
- [ ] Заголовки = Sora (`font-display`).
- [ ] Body = Inter (`font-body`).
- [ ] **НИКАКОГО цвета** — accent = graphite (темнее text-primary, не другой hue).
- [ ] Ссылки hover → темнеют, НЕ меняют цвет.
- [ ] **НИКАКИХ glow-эффектов** — только лёгкие тени.
- [ ] Hero = БЕЗ radial gradient.
- [ ] Кнопки = `rounded-md`, НЕ `rounded-full`.
- [ ] Footer = `bg-stone-100`.
- [ ] **Акцент ≤3% площади** — graphite только на CTA и ключевых элементах.
- [ ] **НЕ #FDB900, НЕ #B45309, НЕ #F59E0B** — только stone-700/800.
