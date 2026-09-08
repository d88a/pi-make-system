# Theme: Bold Tech

> Стиль Raycast / GitHub / Vercel dark mode. Контрастный, технический, дерзкий.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема **dark-first** — но light mode тоже поддерживается.

---

## Mood

**Bold, technical, precise, developer-focused.**

- Тёмный фон, яркие акценты (cyan/violet/green).
- Моноширинные элементы для чисел, кода, технических данных.
- Чёткие границы, минимализм с edge.
- Контраст — главный инструмент визуальной иерархии.
- Glow-эффекты вместо теней (светящиеся borders/rings).

### When to use

Crypto-платформы, developer tools, gaming, SaaS для инженеров,
dashboards с данными, API-документация, хакерские проекты,
ночные интерфейсы, fintech.

---

## Colors

### Dark mode (основной)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#0a0a0a` | `bg-neutral-950` | основной фон (почти чёрный) |
| bg (elevated) | `#171717` | `bg-neutral-900` | карточки, панели, sidebar |
| bg (surface) | `#262626` | `bg-neutral-800` | hover states, inputs, code blocks |
| text (headings) | `#fafafa` | `text-neutral-50` | заголовки, hero title |
| text (body) | `#a3a3a3` | `text-neutral-400` | основной текст, параграфы |
| text (muted) | `#525252` | `text-neutral-600` | secondary, placeholder, disabled |
| accent primary | `#06b6d4` | `text-cyan-500` / `bg-cyan-500` | CTA, links, active states |
| accent hover | `#0891b2` | `hover:bg-cyan-600` | hover на accent-элементах |
| accent secondary | `#8b5cf6` | `text-violet-500` | secondary accent, badges |
| success / positive | `#22c55e` | `text-green-500` | positive metrics, checkmarks |
| danger / negative | `#ef4444` | `text-red-500` | negative metrics, warnings |
| warning | `#eab308` | `text-yellow-500` | caution states |
| border | `#262626` | `border-neutral-800` | card border, divider |
| border (subtle) | `#171717` | `border-neutral-900` | section borders |
| code-bg | `#171717` | `bg-neutral-900` | inline code, code blocks |

### Accent glow (уникально для bold-tech)

```css
/* Glow ring вместо shadow */
.glow-cyan {
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.3), 0 0 20px rgba(6, 182, 212, 0.1);
}

.glow-violet {
  box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.3), 0 0 20px rgba(139, 92, 246, 0.1);
}

/* Hover glow на карточках */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.15);
}
```

Tailwind (inline): `hover:shadow-[0_0_0_1px_rgba(6,182,212,0.4),0_0_30px_rgba(6,182,212,0.15)]`

### Light mode (опционально)

| Роль | Light | Tailwind |
|------|-------|----------|
| bg (page) | `#fafafa` | `bg-neutral-50` |
| bg (elevated) | `#ffffff` | `bg-white` |
| text (headings) | `#0a0a0a` | `text-neutral-950` |
| text (body) | `#525252` | `text-neutral-600` |
| accent | `#0891b2` | `text-cyan-600` |
| border | `#e5e5e5` | `border-neutral-200` |

---

## Typography

### Моноширинные элементы (уникально для bold-tech)

В отличие от других тем, bold-tech активно использует `font-mono`:

| Элемент | Шрифт | Tailwind |
|---------|-------|----------|
| Код, команды | JetBrains Mono | `font-mono` |
| Числа (метрики, цены) | JetBrains Mono | `font-mono tabular-nums` |
| Бейджи, labels | JetBrains Mono | `font-mono text-xs uppercase tracking-wider` |
| Eyebrow / надзаголовки | JetBrains Mono | `font-mono text-xs` |
| Body text | Inter | `font-sans` (как обычно) |
| Заголовки | Inter | `font-sans` (как обычно) |

### Letter-spacing

- Hero: `tracking-tight` (обязательно, как в tokens)
- Eyebrow/labels: `tracking-wider` (0.05em) + `uppercase` + `font-mono`
- Section headings: `tracking-tight`

---

## Shadows (заменены на glow)

В dark mode **тени не работают** — вместо них glow-эффекты:

| Применение | CSS | Вместо shadow |
|-----------|-----|---------------|
| Карточка в покое | `border border-neutral-800` | shadow-sm |
| Карточка hover | `border-cyan-500/40` + `shadow-[0_0_0_1px_...,0_0_30px_...]` | shadow-md |
| Кнопка primary | `shadow-[0_0_20px_rgba(6,182,212,0.3)]` | shadow-lg |
| Модалка | `border border-neutral-700` + `shadow-2xl` | shadow-2xl |
| Focus ring | `ring-2 ring-cyan-500 ring-offset-2 ring-offset-neutral-950` | ring-indigo |

### Hover эффект карточки (bold-tech)

```html
<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-200 
            hover:border-cyan-500/40 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.4),0_0_30px_rgba(6,182,212,0.15)] 
            hover:-translate-y-0.5">
```

---

## Gradients

### Hero background — radial glow

```css
background: radial-gradient(ellipse 50% 50% at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
```

Tailwind: `bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(6,182,212,0.15)_0%,transparent_70%)]`

### Accent gradient (CTA buttons)

```css
background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
```

Tailwind: `bg-gradient-to-r from-cyan-500 to-violet-500`

> ⚠️ В bold-tech gradient на кнопках **разрешён** (в отличие от других тем) — но только для primary CTA.

### Grid background (опционально)

```css
background-image: 
  linear-gradient(rgba(38, 38, 38, 0.5) 1px, transparent 1px),
  linear-gradient(90deg, rgba(38, 38, 38, 0.5) 1px, transparent 1px);
background-size: 64px 64px;
```

Tailwind: `bg-[linear-gradient(rgba(38,38,38,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.5)_1px,transparent_1px)] bg-[size:64px_64px]`

---

## Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- logo / nav links / CTA -->
  </nav>
</header>
```

- `bg-neutral-950/80` — почти чёрный полупрозрачный.
- `border-neutral-800` — тёмная граница.
- `backdrop-blur-md` — blur 12px.

---

## Примеры компонентов

### Hero-секция

```html
<section class="relative overflow-hidden bg-neutral-950 pt-32 pb-24">
  <!-- Radial glow background -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(6,182,212,0.15)_0%,transparent_70%)]"></div>
  <!-- Optional grid pattern -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(38,38,38,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(38,38,38,0.3)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
  
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <!-- eyebrow (mono!) -->
      <span class="font-mono text-xs font-medium tracking-wider uppercase text-cyan-500">
        → Crypto analytics platform
      </span>
      <!-- hero title -->
      <h1 class="mt-6 text-5xl font-bold tracking-tight text-neutral-50 sm:text-6xl lg:text-7xl">
        Make data-driven<br>
        <span class="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
          token decisions
        </span>
      </h1>
      <!-- subtitle -->
      <p class="mx-auto mt-8 max-w-xl text-lg text-neutral-400">
        Real-time metrics. Risk scoring. Smart alerts.
        Everything you need to evaluate any token.
      </p>
      <!-- CTAs -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#" class="rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-base font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-150 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
          Get started free
        </a>
        <a href="#" class="rounded-md border border-neutral-700 bg-neutral-900 px-6 py-3 text-base font-medium text-neutral-300 transition-colors duration-150 hover:border-neutral-600 hover:text-neutral-50">
          View demo
        </a>
      </div>
    </div>
  </div>
</section>
```

Ключевые отличия от modern-clean:
- `bg-neutral-950` (почти чёрный) вместо `bg-gradient-to-b from-slate-50 to-slate-100`
- Radial glow + grid pattern на фоне
- Gradient text на ключевых словах (`bg-clip-text text-transparent`)
- Gradient CTA кнопка (разрешено в bold-tech!)
- Mono eyebrow (`font-mono text-xs uppercase tracking-wider`)

### Кнопка Primary

```html
<button class="rounded-md bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-150 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-neutral-950">
  Get started
</button>
```

Варианты:
- **Secondary:** `border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-600 hover:text-neutral-50`
- **Ghost:** `text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200`
- **Solid accent:** `bg-cyan-500 hover:bg-cyan-600 text-white` (без gradient)

### Карточка

```html
<div class="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-500/40 hover:shadow-[0_0_0_1px_rgba(6,182,212,0.4),0_0_30px_rgba(6,182,212,0.15)]">
  <!-- icon -->
  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
    <svg class="h-6 w-6" ...></svg>
  </div>
  <!-- title -->
  <h3 class="mt-4 text-lg font-semibold tracking-tight text-neutral-50">
    Token Scoring
  </h3>
  <!-- description -->
  <p class="mt-2 text-sm text-neutral-400">
    Get a comprehensive score based on liquidity, volume, holder distribution, and smart money activity.
  </p>
</div>
```

Отличия: glow при hover, иконка в `bg-cyan-500/10`, text-neutral-50 для заголовков.

### Метрика-карточка (для дашбордов/crypto)

```html
<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
  <span class="font-mono text-xs font-medium tracking-wider uppercase text-neutral-600">
    24h Volume
  </span>
  <div class="mt-3 flex items-baseline gap-2">
    <span class="font-mono text-3xl font-bold text-neutral-50">$2.4M</span>
    <span class="font-mono text-sm text-green-500">+12.4%</span>
  </div>
  <!-- mini bar chart (опционально) -->
  <div class="mt-4 flex items-end gap-1 h-8">
    <div class="w-full bg-cyan-500/20 rounded-sm" style="height: 40%"></div>
    <div class="w-full bg-cyan-500/20 rounded-sm" style="height: 65%"></div>
    <div class="w-full bg-cyan-500/20 rounded-sm" style="height: 50%"></div>
    <div class="w-full bg-cyan-500/40 rounded-sm" style="height: 80%"></div>
    <div class="w-full bg-cyan-500 rounded-sm" style="height: 100%"></div>
  </div>
</div>
```

---

## Чек-лист bold-tech

- [ ] Фон = `bg-neutral-950` (почти чёрный), не `bg-gray-900`.
- [ ] CTA = gradient `from-cyan-500 to-violet-500` + glow shadow.
- [ ] Eyebrow/labels = `font-mono text-xs uppercase tracking-wider`.
- [ ] Числа = `font-mono tabular-nums`.
- [ ] Карточки hover = glow (cyan ring + shadow), НЕ translateY.
- [ ] Иконки = `bg-cyan-500/10 text-cyan-500` (tinted background).
- [ ] Section padding ≥ `py-20` (как в tokens).
- [ ] Border = `border-neutral-800` (тёмный, не slate).
- [ ] Тени заменены на glow-эффекты.
- [ ] Success/danger = `text-green-500` / `text-red-500` для метрик.
