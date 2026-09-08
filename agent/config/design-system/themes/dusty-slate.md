# Dusty Slate

> Corporate tech, cool blue-grey. Профессиональный, технологичный, надёжный.
> Accent = slate-600 (#475569) — прохладный сине-серый. Не тёплый, не цветной — пыльный сланец.
> Light + Dark mode (light primary). SaaS / B2B / Enterprise / DevTools.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже — через CSS Custom Properties.
3. Компоненты собирай по примерам — они готовы к копированию.
4. **Light mode — primary.** Dark mode доступен через `[data-theme="dark"]` или `prefers-color-scheme`.
5. Все цвета в компонентах — через `var(--color-*)`. Никогда не хардкодь hex.

---

## CSS Custom Properties (ОБЯЗАТЕЛЬНО для `<head>`)

### Light Mode (default)

```html
<style>
:root {
  /* ── Backgrounds ── */
  --color-bg-page: #F8FAFC;
  --color-bg-alt: #F1F5F9;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #F8FAFC;

  /* ── Text ── */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #475569; /* WCAG AA fix: slate-600, ~6.8:1 on #F8FAFC */

  /* ── Accent (slate-600 family) ── */
  --color-primary: #475569;
  --color-primary-hover: #334155;
  --color-primary-glow: rgba(71, 85, 105, 0.4);
  --color-primary-subtle: rgba(71, 85, 105, 0.08);

  /* ── Semantic ── */
  --color-success: #059669;
  --color-danger: #DC2626;
  --color-warning: #D97706;
  --color-info: #2563EB;

  /* ── Borders ── */
  --color-border: #E2E8F0;
  --color-border-hover: #CBD5E1;
  --color-border-accent-hover: rgba(71, 85, 105, 0.5);

  /* ── Gradients ── */
  --gradient-primary: linear-gradient(135deg, #475569, #334155);
  --gradient-subtle: linear-gradient(180deg, #F8FAFC, #F1F5F9);

  /* ── Shadows ── */
  --shadow-brand: 0 10px 30px -10px rgba(71, 85, 105, 0.3);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.03);
  --shadow-card-hover: 0 8px 24px -8px rgba(71, 85, 105, 0.15);

  /* ── Transitions ── */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Fonts ── */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

/* ── Dark Mode ── */
[data-theme="dark"] {
  --color-bg-page: #0F172A;
  --color-bg-alt: #1E293B;
  --color-surface: #1E293B;
  --color-bg-elevated: #0F172A;

  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;

  --color-primary: #94A3B8;
  --color-primary-hover: #CBD5E1;
  --color-primary-glow: rgba(148, 163, 184, 0.3);
  --color-primary-subtle: rgba(148, 163, 184, 0.1);

  --color-success: #34D399;
  --color-danger: #F87171;
  --color-warning: #FBBF24;
  --color-info: #60A5FA;

  --color-border: #334155;
  --color-border-hover: #475569;
  --color-border-accent-hover: rgba(148, 163, 184, 0.5);

  --gradient-primary: linear-gradient(135deg, #475569, #64748B);
  --gradient-subtle: linear-gradient(180deg, #0F172A, #1E293B);

  --shadow-brand: 0 10px 30px -10px rgba(71, 85, 105, 0.5);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-card-hover: 0 8px 24px -8px rgba(71, 85, 105, 0.35);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg-page: #0F172A;
    --color-bg-alt: #1E293B;
    --color-surface: #1E293B;
    --color-bg-elevated: #0F172A;

    --color-text-primary: #F1F5F9;
    --color-text-secondary: #94A3B8;
    --color-text-muted: #64748B;

    --color-primary: #94A3B8;
    --color-primary-hover: #CBD5E1;
    --color-primary-glow: rgba(148, 163, 184, 0.3);
    --color-primary-subtle: rgba(148, 163, 184, 0.1);

    --color-success: #34D399;
    --color-danger: #F87171;
    --color-warning: #FBBF24;
    --color-info: #60A5FA;

    --color-border: #334155;
    --color-border-hover: #475569;
    --color-border-accent-hover: rgba(148, 163, 184, 0.5);

    --gradient-primary: linear-gradient(135deg, #475569, #64748B);
    --gradient-subtle: linear-gradient(180deg, #0F172A, #1E293B);

    --shadow-brand: 0 10px 30px -10px rgba(71, 85, 105, 0.5);
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
    --shadow-card-hover: 0 8px 24px -8px rgba(71, 85, 105, 0.35);
  }
}
</style>
```

### Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

---

## Mood

**Professional, corporate, technological, reliable, cool.**

Dusty Slate = прохладный корпоративный технологичный стиль. Не холодный стерильный — а «пыльный», с характером. Как серверная комната с приглушённым светом. Как дашборд Grafana на тёмном мониторе. Как Stripe Docs — чётко, понятно, ничего лишнего.

Accent #475569 — это slate-600, прохладный сине-серый. Он НЕ тёплый (никакого amber/terracotta), НЕ яркий (никакого indigo/cyan). Он — как камень в карьере: основательный, надёжный, немного пыльный.

### Когда использовать

- SaaS платформы и B2B продукты (Stripe, Twilio, Datadog)
- DevTools и infrastructure (Vercel, Cloudflare, HashiCorp)
- Корпоративные дашборды и admin panels
- Fintech и banking (прохладная надёжность)
- Технические документации и developer portals
- Enterprise CRM / ERP интерфейсы
- Любой проект где «дизайн = доверие + компетентность»

### Когда НЕ использовать

- Gaming / киберпанк / neon (для этого bold-tech, dark-tech)
- Lifestyle / fashion / beauty (нужен тёплый акцент)
- Детские / развлекательные проекты
- Food / restaurant (тёплые тона appetite)
- Блоги с эмоциональным контентом (лучше editorial-cream)

---

## Цветовая палитра

### Light Mode (primary)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#F8FAFC` | `bg-slate-50` | основной фон страницы (прохладный off-white, НЕ чистый #FFF) |
| bg (alt surface) | `#F1F5F9` | `bg-slate-100` | альтернативный фон для секций, footer |
| bg (surface / cards) | `#FFFFFF` | `bg-white` | карточки, панели, модальные окна |
| bg (elevated) | `#F8FAFC` | `bg-slate-50` | hover states, subtle highlight |
| text (headings) | `#0F172A` | `text-slate-900` | заголовки, hero title |
| text (body) | `#475569` | `text-slate-600` | основной текст, параграфы |
| text (muted) | `#475569` | `text-slate-600` | secondary, placeholder, disabled |
| **accent primary** | `#475569` | `text-slate-600` / `bg-slate-600` | CTA, links, active states (slate-600) |
| **accent hover** | `#334155` | `hover:bg-slate-700` | hover на accent-элементах (slate-700) |
| accent subtle bg | `rgba(71,85,105,0.08)` | `bg-slate-600/[0.08]` | иконки в карточках, tinted фоны |
| success / positive | `#059669` | `text-emerald-600` | positive metrics, checkmarks |
| danger / negative | `#DC2626` | `text-red-600` | negative metrics, errors |
| warning | `#D97706` | `text-amber-600` | caution states (единственный warm — semantic only) |
| info | `#2563EB` | `text-blue-600` | informational badges, links |
| border (default) | `#E2E8F0` | `border-slate-200` | card border, divider, input border |
| border (hover) | `#CBD5E1` | `border-slate-300` | border на hover карточек без accent |
| border (accent hover) | `rgba(71,85,105,0.5)` | `border-slate-600/50` | border карточки при hover с акцентом |

### Dark Mode

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#0F172A` | `bg-slate-900` | основной фон (deep navy-slate) |
| bg (alt surface) | `#1E293B` | `bg-slate-800` | альтернативный фон, footer |
| bg (surface / cards) | `#1E293B` | `bg-slate-800` | карточки, панели |
| bg (elevated) | `#0F172A` | `bg-slate-900` | hover highlight |
| text (headings) | `#F1F5F9` | `text-slate-100` | заголовки |
| text (body) | `#94A3B8` | `text-slate-400` | основной текст |
| text (muted) | `#64748B` | `text-slate-500` | secondary, placeholder |
| **accent primary** | `#94A3B8` | `text-slate-400` / `bg-slate-400` | CTA, links (lighter for dark bg) |
| **accent hover** | `#CBD5E1` | `hover:bg-slate-300` | hover на accent |
| success | `#34D399` | `text-emerald-400` | positive metrics |
| danger | `#F87171` | `text-red-400` | errors |
| warning | `#FBBF24` | `text-amber-400` | caution |
| info | `#60A5FA` | `text-blue-400` | informational |
| border (default) | `#334155` | `border-slate-700` | card borders |
| border (hover) | `#475569` | `border-slate-600` | hover borders |

### Slate accent — главное правило

**#475569 (slate-600) — primary accent в light mode.** Это прохладный сине-серый «пыльный сланец». На 2-3 тона светлее основного текста (#0F172A), но при этом достаточно контрастный для CTA.

В dark mode accent инвертируется: **#94A3B8 (slate-400)** — светлее на тёмном фоне.

```css
/* Accent glow — slate tint, прохладный */
.glow-slate-subtle {
  box-shadow: 0 0 0 1px rgba(71, 85, 105, 0.12), 0 0 6px rgba(71, 85, 105, 0.04);
}

/* Hover glow на карточках */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(71, 85, 105, 0.2), 0 8px 24px -8px rgba(71, 85, 105, 0.12);
}
```

Tailwind (inline):
- Покой: `shadow-none`
- Hover: `hover:shadow-[0_0_0_1px_rgba(71,85,105,0.2),0_8px_24px_-8px_rgba(71,85,105,0.12)]`

**⚠️ НЕ использовать warm accents:**
- ❌ `#FDB900` (amber) — тёплый, «какашечный»
- ❌ `#F59E0B` (amber-500) — тёплый
- ❌ `#B45309` (terracotta) — тёплый коричневый
- ❌ `#EA580C` (orange-600) — оранжевый
- ❌ `#EAB308` (yellow-500) — жёлтый
- ❌ `#D97706` (amber-600) — warm, допустим ТОЛЬКО для warning semantic
- ✅ `#475569` (slate-600) — cool blue-grey, primary accent
- ✅ `#334155` (slate-700) — hover, deeper slate
- ✅ `#94A3B8` (slate-400) — dark mode accent
- ✅ `#64748B` (slate-500) — muted text, icons

---

## Типографика

### Семейства шрифтов

| Элемент | Шрифт | Tailwind | Почему |
|---------|-------|----------|--------|
| Заголовки (h1–h6) | Space Grotesk | `font-display` | Technical, slightly condensed, modern. Vercel/Supabase-стиль. |
| Body text | Inter | `font-body` | Золотой стандарт для UI. Идеальная читаемость. |
| Тех. данные, код, цифры | JetBrains Mono | `font-mono tabular-nums` | Точность, developer-friendly |
| Надзаголовки (eyebrow) | Space Grotesk | `font-display` | Согласованность с заголовками |
| Badge, labels | Inter | `font-body font-medium` | Чистые, читаемые бейджи |

### Почему Space Grotesk

Space Grotesk — геометрический sans-serif с техническим характером. Менее «дружелюбный» чем Inter, более «инженерный». Идеален для SaaS/B2B:
- Vercel, Supabase, Railway — используют похожие гротески
- Читаем на любых размерах
- Характер без экстравагантности
- Отлично смотрится в `tracking-tight` / `tracking-tighter`

### Веса

| Weight | Tailwind | Применение |
|--------|----------|-----------|
| 400 | `font-normal` | body text, параграфы |
| 500 | `font-medium` | UI labels, nav links, кнопки, eyebrow, тех. данные |
| 600 | `font-semibold` | card titles, section headings (Space Grotesk) |
| 700 | `font-bold` | hero titles (Space Grotesk), key metrics |

### Letter-spacing

- Hero: `tracking-tighter` (-0.05em) — Space Grotesk любит плотную посадку
- Section headings: `tracking-tight` (-0.025em)
- Eyebrow/labels: `tracking-wider` (0.05em) + `uppercase`
- Body / UI: `tracking-normal`
- Metrics/numbers: `tracking-tight` — цифры выглядят плотнее

### Tailwind config

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          display: ['Space Grotesk', 'sans-serif'],
          body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        },
      }
    }
  }
</script>
```

---

## Композиция (Layout Patterns)

### Hero Layouts (3 варианта)

**A. Centered (default — SaaS landing)**
max-w-2xl mx-auto text-center. Eyebrow → h1 (5xl-7xl tracking-tighter, Space Grotesk) → subtitle → CTAs → trust bar.
Корпоративный вход — чётко, по делу, с социальным доказательством.

**B. Split 50/50 (product pages)**
grid lg:grid-cols-2 gap-16, left = текст + CTA, right = dashboard screenshot / product UI.
Идеально для «о продукте» / feature pages.

**C. Dashboard Preview (enterprise)**
Полноширинный hero с мини-навигацией сверху и скриншотом дашборда снизу.
h1 слева + «Request demo» CTA. Справа — floating dashboard mockup.
Для enterprise SaaS landing pages.

### Whitespace Rhythm

Dusty Slate = структурированный whitespace. Не такой щедрый как graphite-mono, но достаточно просторный для professional feel.

| Секция | Padding (y) | Tailwind | Характер |
|--------|------------|----------|----------|
| Hero | top: 96-120px, bottom: 80-96px | pt-24..30 pb-20..24 | Профессиональный вход |
| Features / Advantages | 96-112px | py-24..28 | Просторно, структурировано |
| Comparison / Specs | 80px | py-20 | Компактно, по делу |
| CTA / Form | 80-96px | py-20..24 | Акцент на действии |
| Catalog grid | 64-80px | py-16..20 | Плотно, много карточек |
| Footer | top: 48px, bottom: 40px | pt-12 pb-10 | Завершение |

### Depth Layering (Light mode)

| Level | Цвет | Tailwind | Назначение |
|-------|------|----------|-----------|
| Level 0 | #F8FAFC | bg-slate-50 | Page background |
| Level 1 | #F1F5F9 | bg-slate-100 | Alt sections, footer |
| Level 2 | #FFFFFF | bg-white | Cards, panels |
| Level 3 | rgba(71,85,105,0.04) | bg-slate-600/[0.04] | Hover states, subtle highlights |
| Level 4 | #475569 | bg-slate-600 | Accent (≤5% площади) |

### Depth Layering (Dark mode)

| Level | Цвет | Tailwind | Назначение |
|-------|------|----------|-----------|
| Level 0 | #0F172A | bg-slate-900 | Page background |
| Level 1 | #1E293B | bg-slate-800 | Alt sections, footer, cards |
| Level 2 | #1E293B | bg-slate-800 | Cards, panels |
| Level 3 | rgba(148,163,184,0.06) | bg-slate-400/[0.06] | Hover states |
| Level 4 | #94A3B8 | bg-slate-400 | Accent (lighter for contrast) |

### Hero Typography Scale

| Элемент | Размер | Tailwind | Вес | Особенность |
|---------|--------|----------|-----|-------------|
| Eyebrow | 12-13px | text-xs tracking-widest uppercase | font-medium | Space Grotesk, text-slate-400 |
| h1 | 48-72px | text-5xl..7xl tracking-tighter | font-bold | Space Grotesk, text-slate-900 |
| Subtitle | 18px | text-lg | font-normal | Inter, text-slate-500, max-w-xl |
| Stats (числа) | 30px | text-3xl | font-bold | font-mono text-slate-800 |
| Stats (подписи) | 12px | text-xs | font-medium | text-slate-400 |
| Trust bar | 13px | text-sm | font-medium | text-slate-400 |

Контраст hero: 72px / 12px = 6x → strong hierarchy. Space Grotesk + tracking-tighter = технологичная плотность.

---

## Компоненты

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-page)]/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-display text-xl font-bold text-[var(--color-text-primary)]">
      <!-- logo mark — geometric slate shape -->
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="text-[var(--color-primary)]">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor"/>
        <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Platform
    </a>

    <!-- Nav links -->
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#features" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">
        Features
      </a>
      <a href="#pricing" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">
        Pricing
      </a>
      <a href="#docs" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">
        Docs
      </a>
      <a href="#blog" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">
        Blog
      </a>
    </div>

    <!-- CTA -->
    <a href="#start" class="rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]">
      Get started
    </a>
  </nav>
</header>
```

Ключевые моменты:
- `bg-[var(--color-bg-page)]/80` — полупрозрачный фон с blur.
- `border-[var(--color-border)]` — slate-200 border, технологично.
- Ссылки hover → `text-[var(--color-text-primary)]` (темнеют, не меняют цвет).
- CTA: slate-600 фон + белый текст + brand shadow на hover.
- В dark mode всё автоматически переключается через CSS variables.

### Hero

```html
<section class="relative overflow-hidden bg-[var(--color-bg-page)] pt-28 pb-20">
  <!-- Subtle grid pattern (optional) -->
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><defs><pattern id=&quot;g&quot; width=&quot;60&quot; height=&quot;60&quot; patternUnits=&quot;userSpaceOnUse&quot;><path d=&quot;M60 0H0v60&quot; fill=&quot;none&quot; stroke=&quot;%23475569&quot; stroke-width=&quot;1&quot;/></pattern></defs><rect width=&quot;100%25&quot; height=&quot;100%25&quot; fill=&quot;url(%23g)&quot;/></svg>');"></div>

  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <!-- eyebrow -->
      <span class="font-display text-xs font-medium tracking-widest uppercase text-[var(--color-text-muted)]">
        Infrastructure for modern teams
      </span>
      <!-- hero title -->
      <h1 class="mt-6 font-display text-5xl font-bold tracking-tighter text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
        Ship faster with<br>
        <span class="text-[var(--color-primary)]">confidence</span>
      </h1>
      <!-- subtitle -->
      <p class="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]">
        The platform engineering team trusted by 2,000+ companies.
        Deploy, monitor, and scale — without the complexity.
      </p>
      <!-- CTA buttons -->
      <div class="mt-10 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]">
          Start building — free
        </a>
        <a href="#demo" class="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-accent-hover)] hover:text-[var(--color-primary)]">
          Book a demo
        </a>
      </div>
      <!-- trust bar -->
      <p class="mt-10 text-sm font-medium text-[var(--color-text-muted)]">
        Trusted by teams at Vercel, Linear, Stripe, and 2,000+ more
      </p>
    </div>
  </div>
</section>
```

Ключевые особенности:
- `bg-[var(--color-bg-page)]` — slate-50, прохладный фон.
- Subtle grid pattern (opacity 3%) — технологичный характер.
- h1 в Space Grotesk `tracking-tighter` — техническая плотность.
- Цветной span в заголовке — slate-600, ЕДИНСТВЕННЫЙ акцент.
- CTA: slate solid + brand shadow на hover.
- Trust bar — социальное доказательство (серый, ненавязчивый).
- Все цвета через `var(--color-*)` — работает в dark mode.

### Карточки

```html
<div class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-accent-hover)] hover:shadow-[var(--shadow-card-hover)]">
  <!-- icon -->
  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-subtle)]">
    <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
    </svg>
  </div>
  <!-- content -->
  <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">
    Lightning Deploys
  </h3>
  <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
    Push to production in under 10 seconds. Zero-downtime deployments with automatic rollbacks.
  </p>
  <!-- link -->
  <a href="#" class="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">
    Learn more
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </a>
</div>
```

Особенности dusty-slate:
- Иконки на `bg-[var(--color-primary-subtle)]` — slate tint (прохладный).
- Заголовки в Space Grotesk (`font-display`).
- Hover border → slate с opacity 0.5 (технологично).
- Тень hover — brand shadow (slate tint).
- Ссылки hover → slate accent, не меняют hue.

### Feature Card (с метрикой)

```html
<div class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-accent-hover)] hover:shadow-[var(--shadow-card-hover)]">
  <!-- metric -->
  <div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">
    99.99%
  </div>
  <div class="mt-1 text-xs font-medium tracking-wider uppercase text-[var(--color-text-muted)]">
    Uptime SLA
  </div>
  <!-- divider -->
  <div class="my-5 h-px bg-[var(--color-border)]"></div>
  <!-- description -->
  <p class="text-sm leading-relaxed text-[var(--color-text-secondary)]">
    Enterprise-grade reliability backed by a financially binding SLA. Multi-region failover included.
  </p>
</div>
```

### Кнопки

**Primary (solid slate):**

```html
<button class="rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  Get started
</button>
```

**Secondary (outline):**

```html
<button class="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-accent-hover)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  Book a demo
</button>
```

**Ghost:**

```html
<button class="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]">
  View all →
</button>
```

**Destructive:**

```html
<button class="rounded-md bg-[var(--color-danger)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  Delete project
</button>
```

Варианты по приоритету:
| Вариант | Tailwind | Когда |
|---------|----------|-------|
| Primary | `bg-[var(--color-primary)] text-white` | Основной CTA |
| Secondary | `border-[var(--color-border)] text-[var(--color-text-secondary)]` | Второстепенное действие |
| Ghost | `text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]` | Навигация внутри секции |
| Destructive | `bg-[var(--color-danger)] text-white` | Удаление, отмена |

**Правило:** gradient на кнопках НЕ использовать. Dusty Slate = solid, технологичность без украшательств.

### Badges

**Default (slate):**

```html
<span class="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
  <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"></span>
  Active
</span>
```

**Success:**

```html
<span class="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
  Operational
</span>
```

**Danger:**

```html
<span class="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
  <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
  Incident
</span>
```

**Info:**

```html
<span class="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
  <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
  Beta
</span>
```

**Version (code-style):**

```html
<span class="inline-flex items-center rounded-md bg-[var(--color-bg-alt)] px-2.5 py-1 font-mono text-xs font-medium text-[var(--color-text-secondary)] tabular-nums">
  v2.4.1
</span>
```

### Inputs

```html
<form class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
  <h3 class="font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Get early access</h3>
  <p class="mt-2 text-sm text-[var(--color-text-secondary)]">Join the waitlist. We'll send you an invite within 24 hours.</p>

  <div class="mt-6 space-y-4">
    <div>
      <label for="ds-name" class="block text-sm font-medium text-[var(--color-text-primary)]">Name</label>
      <input
        id="ds-name" type="text" placeholder="John Doe"
        class="mt-1.5 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
    </div>

    <div>
      <label for="ds-email" class="block text-sm font-medium text-[var(--color-text-primary)]">Work email</label>
      <input
        id="ds-email" type="email" placeholder="john@company.com"
        class="mt-1.5 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
    </div>

    <div>
      <label for="ds-company" class="block text-sm font-medium text-[var(--color-text-primary)]">Company</label>
      <input
        id="ds-company" type="text" placeholder="Acme Inc."
        class="mt-1.5 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      />
    </div>

    <div>
      <label for="ds-team" class="block text-sm font-medium text-[var(--color-text-primary)]">Team size</label>
      <select
        id="ds-team"
        class="mt-1.5 block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-primary)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
      >
        <option>1-10</option>
        <option>11-50</option>
        <option>51-200</option>
        <option>200+</option>
      </select>
    </div>
  </div>

  <button type="submit" class="mt-6 w-full rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]">
    Request access
  </button>

  <p class="mt-3 text-center text-xs text-[var(--color-text-muted)]">
    No spam. Unsubscribe anytime. SOC 2 compliant.
  </p>
</form>
```

Ключевые моменты:
- Inputs: `bg-[var(--color-surface)]` + `border-[var(--color-border)]` (slate).
- Focus: `border-[var(--color-primary)]` + `ring-1 ring-[var(--color-primary)]` (slate accent).
- Placeholder: `text-[var(--color-text-muted)]`.
- Submit: slate solid + brand shadow.
- Все через var() — dark mode работает автоматически.

### Таблица

```html
<div class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-[var(--color-border)]">
        <th class="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Plan</th>
        <th class="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Price</th>
        <th class="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Requests</th>
        <th class="px-6 py-4 font-medium text-[var(--color-text-secondary)]">Support</th>
        <th class="px-6 py-4 font-medium text-[var(--color-text-secondary)]"></th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--color-border)]/50 transition-colors duration-150 hover:bg-[var(--color-bg-alt)]">
        <td class="px-6 py-4 font-medium text-[var(--color-text-primary)]">Starter</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-primary)]">$0/mo</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-secondary)]">1K</td>
        <td class="px-6 py-4 text-[var(--color-text-secondary)]">Community</td>
        <td class="px-6 py-4">
          <a href="#" class="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Start free</a>
        </td>
      </tr>
      <tr class="border-b border-[var(--color-border)]/50 transition-colors duration-150 hover:bg-[var(--color-bg-alt)]">
        <td class="px-6 py-4 font-medium text-[var(--color-text-primary)]">Pro</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-primary)]">$29/mo</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-secondary)]">100K</td>
        <td class="px-6 py-4 text-[var(--color-text-secondary)]">Email (24h)</td>
        <td class="px-6 py-4">
          <a href="#" class="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Upgrade</a>
        </td>
      </tr>
      <tr class="transition-colors duration-150 hover:bg-[var(--color-bg-alt)]">
        <td class="px-6 py-4 font-medium text-[var(--color-text-primary)]">Enterprise</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-primary)]">Custom</td>
        <td class="px-6 py-4 font-mono tabular-nums text-[var(--color-text-secondary)]">Unlimited</td>
        <td class="px-6 py-4 text-[var(--color-text-secondary)]">Dedicated (1h)</td>
        <td class="px-6 py-4">
          <a href="#" class="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]">Contact sales</a>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

Ключевые моменты:
- `bg-[var(--color-surface)]` — белый/slate-800 для таблицы.
- Тех. значения в `font-mono tabular-nums` — точность, developer-friendly.
- `hover:bg-[var(--color-bg-alt)]` — тонкий hover строк.
- Action links — slate accent.
- Границы: `border-[var(--color-border)]`.

### Stats Section

```html
<section class="bg-[var(--color-bg-page)] py-20">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      <div class="text-center">
        <div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">2,847</div>
        <div class="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Companies</div>
      </div>
      <div class="text-center">
        <div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">99.99%</div>
        <div class="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Uptime</div>
      </div>
      <div class="text-center">
        <div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">14ms</div>
        <div class="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Avg latency</div>
      </div>
      <div class="text-center">
        <div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums">4.2M</div>
        <div class="mt-2 text-sm font-medium text-[var(--color-text-secondary)]">Deploys / month</div>
      </div>
    </div>
  </div>
</section>
```


### CTA Section

```html
<section class="bg-[var(--color-bg-alt)] py-20">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
        Ready to ship faster?
      </h2>
      <p class="mt-4 text-lg text-[var(--color-text-secondary)]">
        Start building for free. No credit card required. Deploy in 5 minutes.
      </p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]">
          Start building — free
        </a>
        <a href="#sales" class="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-border-accent-hover)] hover:text-[var(--color-primary)]">
          Talk to sales
        </a>
      </div>
    </div>
  </div>
</section>
```

### Footer

```html
<footer class="bg-[var(--color-bg-alt)] py-12">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-5">
      <!-- Brand -->
      <div class="md:col-span-2">
        <a href="/" class="font-display text-xl font-bold text-[var(--color-text-primary)]">
          Platform
        </a>
        <p class="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Infrastructure for modern engineering teams. Deploy, monitor, and scale with confidence.
        </p>
        <!-- Status badge -->
        <div class="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--color-primary-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]">
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          All systems operational
        </div>
      </div>

      <!-- Product Links -->
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Product</h4>
        <ul class="mt-4 space-y-2.5">
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Features</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Pricing</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Changelog</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Integrations</a></li>
        </ul>
      </div>

      <!-- Resources Links -->
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Resources</h4>
        <ul class="mt-4 space-y-2.5">
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Documentation</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">API Reference</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Guides</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Status</a></li>
        </ul>
      </div>

      <!-- Company Links -->
      <div>
        <h4 class="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Company</h4>
        <ul class="mt-4 space-y-2.5">
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">About</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Blog</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Careers</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Contact</a></li>
        </ul>
      </div>
    </div>

    <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 md:flex-row">
      <p class="text-sm text-[var(--color-text-muted)]">
        &copy; 2024 Platform Inc. All rights reserved.
      </p>
      <div class="flex items-center gap-6">
        <a href="#" class="text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Privacy</a>
        <a href="#" class="text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Terms</a>
        <a href="#" class="text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Security</a>
      </div>
    </div>
  </div>
</footer>
```

Ключевые моменты:
- `bg-[var(--color-bg-alt)]` — slate-100/slate-800 (footer утапливается).
- Ссылки hover → `text-[var(--color-text-primary)]` (темнеют, не меняют цвет).
- Status badge — operational indicator (emerald dot + slate tint bg).
- Разделитель `border-[var(--color-border)]`.
- Footer links — без warm акцентов, только slate.
- 5-column grid (brand col-span-2 + 3 link groups).

---

## Wow-паттерны (сдержанные, технологичные)

### 1. Stagger Reveal (каскадное появление)

```html
<style>
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
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
  <div class="reveal rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
  <div class="reveal rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
  <div class="reveal rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
</div>
```

### 2. Hover Lift (subtle elevation)

```html
<style>
.hover-lift {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}
</style>
```

### 3. Metric Counter (число набегает)

```html
<style>
@keyframes count-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.metric-animate {
  animation: count-up 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>

<div class="font-mono text-3xl font-bold tracking-tight text-[var(--color-text-primary)] tabular-nums metric-animate">
  99.99%
</div>
```

### 4. Subtle Grid Background (технологичный паттерн)

Используй на hero section как overlay — добавляет «инженерный» характер без визуального шума.
Opacity 3%, slate-600 stroke. См. hero example выше.

### 5. Code Block with Terminal Feel

```html
<div class="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-text-primary)]">
  <!-- terminal header -->
  <div class="flex items-center gap-2 border-b border-white/10 px-4 py-3">
    <span class="h-3 w-3 rounded-full bg-red-400/60"></span>
    <span class="h-3 w-3 rounded-full bg-amber-400/60"></span>
    <span class="h-3 w-3 rounded-full bg-emerald-400/60"></span>
    <span class="ml-4 font-mono text-xs text-white/40">terminal</span>
  </div>
  <!-- code -->
  <div class="p-4 font-mono text-sm leading-relaxed">
    <div class="text-emerald-400">$ npx deploy --production</div>
    <div class="mt-1 text-slate-400">Building... <span class="text-white">done</span> in 2.3s</div>
    <div class="text-slate-400">Deploying to <span class="text-slate-300">us-east-1</span>... <span class="text-white">done</span></div>
    <div class="mt-2 text-emerald-400">&#10003; Live at https://app.example.com</div>
  </div>
</div>
```

Тёмный фон (text-primary = slate-900) — terminal/code feel. Отлично для developer-facing секций.

### НЕ использовать

| ❌ Паттерн | Почему |
|-----------|--------|
| Text Shimmer (любого цвета) | Не для corporate tech стиля |
| Gradient Border on Hover | Слишком ярко для dusty-slate |
| Spotlight Follow Cursor | Neon / gaming vibes |
| Animated Gradient Border | Цветной gradient = нарушение mood |
| Morphing Blob | Игриво, не для B2B |
| Rainbow/Confetti effects | Противоречит professional tone |
| Любые glow-эффекты (neon) | Dusty slate = сдержанные тени |

---

## Anti-patterns (ЗАПРЕЩЕНО)

| ❌ Нельзя | ✅ Вместо |
|----------|----------|
| Warm accent (#FDB900, #B45309, #EA580C, #EAB308, #F59E0B) | Только slate #475569 / #334155 |
| Amber #FDB900, #F59E0B (кроме warning semantic) | НЕТ — «какашечный» |
| Terracotta #B45309 | НЕТ — тёплый |
| Orange #EA580C | НЕТ — тёплый |
| Yellow #EAB308 | НЕТ — тёплый |
| Gradient buttons | Solid slate только |
| Neon glow-эффекты | Только slate-tinted shadows |
| `rounded-full` на кнопках | `rounded-md` |
| `font-sans` для hero | `font-display` (Space Grotesk) |
| Цветные иконки (amber, orange) | Slate иконки (`text-[var(--color-primary)]`) |
| Heavy shadows (blur > 12px на покое) | Лёгкие тени (shadow-card) |
| `bg-white` для page | `bg-[var(--color-bg-page)]` (slate-50) |
| Hardcoded hex в компонентах | Только `var(--color-*)` |

---

## Theme-specific exceptions

| Базовый запрет | Исключение в dusty-slate | Обоснование |
|---------------|--------------------------|-------------|
| Heavy shadows (blur > 15px) | Brand shadow на CTA hover (`blur: 30px, opacity 0.3`) | Единственный «wow» — brand-colored shadow |
| Gradient buttons | **НЕ переопределяется.** Gradient ЗАПРЕЩЁН. | Tech/professional = solid |
| Карточки без border, только shadow | Карточки = `border border-[var(--color-border)]` + shadow on hover | Структурированный вид |
| `font-sans` для заголовков | `font-display` (Space Grotesk) для h1-h6 | Technical character = part of brand |
| `bg-white` на page | `bg-[var(--color-bg-page)]` (#F8FAFC) | Cool off-white, не sterile |
| Цветной hover на ссылках | Темнеют к text-primary, не меняют hue | Профессиональная сдержанность |

### Что НЕ переопределяется (строго как в tokens):

- Кнопки — `rounded-md`, НЕ `rounded-full`.
- Section padding ≥ `py-16` (минимум).
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Hero titles — `tracking-tighter` (для Space Grotesk).

---

## Tailwind Classes Mapping

### Backgrounds

| CSS Variable | Tailwind Class | Usage |
|-------------|---------------|-------|
| `var(--color-bg-page)` | `bg-slate-50` | Page background |
| `var(--color-bg-alt)` | `bg-slate-100` | Alt sections, footer |
| `var(--color-surface)` | `bg-white` | Cards, panels |
| `var(--color-primary-subtle)` | `bg-slate-600/[0.08]` | Icon backgrounds, tinted areas |

### Text

| CSS Variable | Tailwind Class | Usage |
|-------------|---------------|-------|
| `var(--color-text-primary)` | `text-slate-900` | Headings, primary content |
| `var(--color-text-secondary)` | `text-slate-600` | Body text, paragraphs |
| `var(--color-text-muted)` | `text-slate-600` | Placeholder, secondary |
| `var(--color-primary)` | `text-slate-600` | Accent text, links |

### Borders

| CSS Variable | Tailwind Class | Usage |
|-------------|---------------|-------|
| `var(--color-border)` | `border-slate-200` | Default borders |
| `var(--color-border-hover)` | `border-slate-300` | Hover borders |

### Buttons

| Variant | Tailwind Classes |
|---------|-----------------|
| Primary | `bg-slate-600 text-white hover:bg-slate-700` |
| Secondary | `border border-slate-200 text-slate-600 hover:border-slate-600/50 hover:text-slate-600` |
| Ghost | `text-slate-400 hover:text-slate-900 hover:bg-slate-100` |

### Typography

| Element | Tailwind Classes |
|---------|-----------------|
| Hero h1 | `font-display text-5xl..7xl font-bold tracking-tighter text-slate-900` |
| Section h2 | `font-display text-3xl..4xl font-bold tracking-tight text-slate-900` |
| Card title | `font-display text-lg font-semibold tracking-tight text-slate-900` |
| Body | `font-body text-sm..base text-slate-600` |
| Eyebrow | `font-display text-xs font-medium tracking-widest uppercase text-slate-400` |
| Metric | `font-mono text-3xl font-bold tracking-tight tabular-nums text-slate-900` |

---

## Чек-лист dusty-slate

- [ ] Фон страницы = `bg-[var(--color-bg-page)]` (#F8FAFC), НЕ `bg-white`.
- [ ] Карточки = `bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl`.
- [ ] CTA = solid `bg-[var(--color-primary)] text-white` (НЕ gradient!).
- [ ] Заголовки = Space Grotesk (`font-display`).
- [ ] Body = Inter (`font-body`).
- [ ] **НИКАКИХ warm accents** — только cool slate (#475569 / #334155 / #94A3B8).
- [ ] Ссылки hover → темнеют к text-primary, НЕ меняют hue.
- [ ] **--shadow-brand** = slate-tinted (`rgba(71, 85, 105, 0.3)`).
- [ ] Hero = БЕЗ neon/gradient, допустим subtle grid overlay.
- [ ] Кнопки = `rounded-md`, НЕ `rounded-full`.
- [ ] Footer = `bg-[var(--color-bg-alt)]`.
- [ ] **Все цвета через var(--color-*)** — ноль hardcoded hex в компонентах.
- [ ] Dark mode работает через `[data-theme="dark"]`.
- [ ] **НЕ #FDB900, НЕ #B45309, НЕ #F59E0B, НЕ #EA580C** — только slate family.
- [ ] Accent ≤5% площади — slate только на CTA, links, key interactive elements.
- [ ] Metrics/numbers = `font-mono tabular-nums`.
