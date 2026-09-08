# Theme: Modern Clean

> Стиль Linear / Vercel / shadcn/ui. Профессиональный, минималистичный, технический.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам (hero, button, card) — они готовы к копированию.
4. Настройки ниже — для light mode по умолчанию. Dark mode — в отдельной секции.

---

## Mood

**Professional, minimal, precise, technical.**

- Много воздуха, мало декора.
- Акцент — один (indigo), используется точечно (CTA, активные состояния).
- Карточки — белые с тонкой границей `slate-200`, без тяжёлых теней.
- Типографика несёт нагрузку: контраст весов (400 body / 600 headings / 700 hero).

### When to use

SaaS, dev tools, dashboards, технические стартапы, API-документация, admin-панели.

---

## Colors

Палитра: slate (нейтральный) + indigo (акцент).

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#ffffff` | `bg-white` | основной фон страницы |
| bg (subtle) | `#f8fafc` | `bg-slate-50` | чередующиеся секции, hero bg |
| text (headings) | `#0f172a` | `text-slate-900` | заголовки, hero title |
| text (body) | `#475569` | `text-slate-600` | основной текст, параграфы |
| text (muted) | `#475569` | `text-slate-600` | secondary, placeholder, meta (WCAG AA: ~6.8:1 on white) |
| accent | `#4f46e5` | `text-indigo-600` / `bg-indigo-600` | CTA, links, active states (WCAG AA: ~4.6:1 on white) |
| accent hover | `#4338ca` | `hover:bg-indigo-700` | hover на accent-элементах |
| border | `#e2e8f0` | `border-slate-200` | card border, divider, input border |
| card-bg | `#ffffff` | `bg-white` | фон карточек |
| code-bg | `#f1f5f9` | `bg-slate-100` | inline code, code blocks |

### Accent-токены (производные)

| Роль | Hex | Tailwind |
|------|-----|----------|
| accent text | `#4f46e5` | `text-indigo-600` |
| accent bg | `#4f46e5` | `bg-indigo-600` |
| accent ring | `#4f46e5` | `ring-indigo-600` |
| accent soft bg | `#eef2ff` | `bg-indigo-50` (subtle highlight, badge) |

---

## Gradients

### Subtle hero background

Тонкий вертикальный градиент для hero-секции (едва заметный).

```css
background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
```

Tailwind: `bg-gradient-to-b from-slate-50 to-slate-100`.

### Accent gradient (только для CTA / hero-акцента)

```css
background: linear-gradient(135deg, #4f46e5 0%, #8b5cf6 100%);
```

Tailwind: `bg-gradient-to-r from-indigo-600 to-violet-500`.

> ⚠️ Градиент разрешён ТОЛЬКО для крупных hero-акцентов и не более одного блока на страницу.
> **Обычные кнопки — solid `bg-indigo-600`, НЕ gradient** (см. Anti-patterns в `tokens.md`).

---

## Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- logo / nav links / CTA -->
  </nav>
</header>
```

- `bg-white/80` — полупрозрачный белый (80%).
- `backdrop-blur-md` — blur 12px.
- `border-b border-slate-200` — тонкая нижняя граница.

---

## Dark mode

| Роль | Light | Dark | Tailwind dark: |
|------|-------|------|----------------|
| bg (page) | `bg-white` | `#0f172a` | `dark:bg-slate-900` |
| text (headings) | `text-slate-900` | `#f1f5f9` | `dark:text-slate-100` |
| text (body) | `text-slate-600` | `#cbd5e1` | `dark:text-slate-300` |
| accent | `indigo-600` | `#818cf8` | `dark:text-indigo-400` |
| border | `border-slate-200` | `#1e293b` | `dark:border-slate-800` |
| card-bg | `bg-white` | `#1e293b` | `dark:bg-slate-800` |

Реализация: `dark:` variant (class strategy). Переключатель через `class="dark"` на `<html>`.

---

## Примеры компонентов

### Hero-секция

```html
<section class="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-32 pb-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <!-- eyebrow -->
      <span class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium tracking-wider uppercase text-indigo-600">
        New · v2.0
      </span>
      <!-- hero title -->
      <h1 class="mt-6 text-6xl font-bold tracking-tight text-slate-900">
        Build faster. Ship cleaner.
      </h1>
      <!-- hero subtitle -->
      <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        The platform for developers who ship. Type-safe, edge-ready, zero-config.
      </p>
      <!-- CTA group -->
      <div class="mt-10 flex items-center justify-center gap-4">
        <a href="#" class="rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-indigo-700">
          Get started
        </a>
        <a href="#" class="rounded-md border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50">
          Learn more
        </a>
      </div>
    </div>
  </div>
</section>
```

Ключевые классы: `pt-32 pb-24` (hero padding), `bg-gradient-to-b from-slate-50 to-slate-100` (subtle hero), `text-6xl font-bold tracking-tight` (hero title), `text-lg text-slate-600` (lead).

### Кнопка Primary

```html
<button class="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
  Get started
</button>
```

| Свойство | Класс | Назначение |
|----------|-------|------------|
| bg | `bg-indigo-600` | accent solid |
| hover | `hover:bg-indigo-700` | darken на hover |
| radius | `rounded-md` | 6px (tokens) |
| padding | `px-5 py-2.5` | medium button |
| weight | `font-medium` | UI label |
| focus | `focus:ring-2 ring-indigo-600` | accessibility |
| transition | `duration-150` | fast |

Варианты:
- **Secondary:** `border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`.
- **Ghost:** `text-slate-700 hover:bg-slate-100` (без border).
- **Danger:** `bg-red-500 hover:bg-red-600`.

### Карточка

```html
<div class="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300">
  <!-- icon -->
  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
    <svg class="h-6 w-6" ...></svg>
  </div>
  <!-- title -->
  <h3 class="mt-4 text-lg font-semibold text-slate-900">
    Feature title
  </h3>
  <!-- description -->
  <p class="mt-2 text-sm text-slate-600">
    One or two sentences describing the feature clearly and precisely.
  </p>
  <!-- link -->
  <a href="#" class="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700">
    Learn more
    <svg class="ml-1 h-4 w-4" ...></svg>
  </a>
</div>
```

Ключевые классы: `rounded-2xl` (16px card), `border border-slate-200` (border instead of shadow), `p-6` (card internal), `hover:-translate-y-0.5 hover:shadow-md` (hover lift, медленный `duration-200`), иконка в `bg-indigo-50` (accent soft).
