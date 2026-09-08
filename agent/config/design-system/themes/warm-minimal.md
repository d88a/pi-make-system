# Theme: Warm Minimal

> Стиль Notion / Stripe / Ghost. Тёплый, редакционный, спокойный.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема любит **больше воздуха** чем modern-clean: section padding `py-28`–`py-40`.

---

## Mood

**Warm, editorial, calm, trustworthy.**

- Тёплые нейтральные тона (stone) вместо холодных (slate).
- Один акцент — янтарный (amber), используется крайне точечно.
- Много белого пространства, крупные отступы между секциями.
- Спокойная, уверенная типографика. Без агрессии.
- Серифный заголовок (опционально) добавляет редакционности.

### When to use

Блоги, контентные платформы, lifestyle-бренды, документация,
SaaS с фокусом на текст, портфолио, издательства, образовательные платформы.

---

## Colors

Палитра: stone (тёплые neutrals) + amber (акцент).

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#faf9f7` | `bg-stone-50` | основной фон (тёплый белый) |
| bg (alt sections) | `#ffffff` | `bg-white` | чередующиеся секции |
| text (headings) | `#1c1917` | `text-stone-900` | заголовки, hero title |
| text (body) | `#57534e` | `text-stone-600` | основной текст |
| text (muted) | `#57534e` | `text-stone-600` | secondary, placeholder, meta (WCAG AA: ~6.5:1 on stone-50) |
| accent | `#b45309` | `text-amber-700` / `bg-amber-700` | CTA, links, active states |
| accent hover | `#92400e` | `hover:bg-amber-800` | hover на accent-элементах |
| border | `#e7e5e4` | `border-stone-200` | card border, divider |
| card-bg | `#ffffff` | `bg-white` | фон карточек |
| code-bg | `#f5f5f4` | `bg-stone-100` | inline code, code blocks |

### Accent-токены (производные)

| Роль | Hex | Tailwind |
|------|-----|----------|
| accent text | `#b45309` | `text-amber-700` |
| accent bg | `#b45309` | `bg-amber-700` |
| accent ring | `#b45309` | `ring-amber-700` |
| accent soft bg | `#fffbeb` | `bg-amber-50` (subtle highlight, badge; text = `text-amber-700` для WCAG AA) |

> **WCAG AA note:** amber-600 (#d97706) на белом = 3.19:1 (fail, нужно 4.5:1). Amber-700 (#b45309) = pass. Используй text-amber-700 на светлом фоне, bg-amber-700 + white текст для CTA.

---

## Typography (отличия от tokens)

### Serif заголовки (опционально)

Для редакционного стиля можно подключить serif:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
```

```js
// tailwind.config
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  serif: ['Playfair Display', 'Georgia', 'serif'],
}
```

Правило: serif ТОЛЬКО на `<h1>` в hero. Всё остальное — Inter.
Если не хочешь serif — оставь Inter на всех заголовках (тоже выглядит отлично).

### Больше пространства в типографике

- Hero subtitle: `text-xl` (вместо `text-lg` как в modern-clean)
- Body lead: `text-lg leading-relaxed` (вместо `text-lg`)
- Card description: `text-base` (вместо `text-sm`)

---

## Spacing (отличия от tokens)

Эта тема любит воздух. Увеличивай отступы:

| Контекст | Modern-clean | Warm-minimal |
|----------|-------------|--------------|
| Section padding | `py-20`–`py-32` | `py-28`–`py-40` |
| Hero padding | `pt-32 pb-24` | `pt-40 pb-32` |
| Section gap | `gap-20` | `gap-28` |
| Card internal | `p-6` | `p-8` |
| Content max-width | `max-w-3xl` (text) | `max-w-2xl` (ещё уже, больше воздуха) |

---

## Gradients

### Почти нет градиентов

Warm-minimal избегает градиентов. Фон — solid colors.

Если очень нужен subtle hero background:

```css
background: linear-gradient(180deg, #faf9f7 0%, #ffffff 100%);
```

Tailwind: `bg-gradient-to-b from-stone-50 to-white`.

> ⚠️ Максимум один градиент на страницу, и только фоновый. Никаких gradient кнопок/акцентов.

---

## Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- logo / nav links / CTA -->
  </nav>
</header>
```

Отличия от modern-clean:
- `bg-stone-50/90` — тёплый полупрозрачный фон.
- `backdrop-blur-sm` — лёгкий blur (вместо `backdrop-blur-md`).
- `border-stone-200` — тёплая граница.

Альтернатива (ещё минимальнее): **без backdrop-blur**, просто `bg-stone-50 border-b`.

---

## Dark mode

| Роль | Light | Dark | Tailwind dark: |
|------|-------|------|----------------|
| bg (page) | `bg-stone-50` | `#1c1917` | `dark:bg-stone-900` |
| text (headings) | `text-stone-900` | `#fafaf9` | `dark:text-stone-50` |
| text (body) | `text-stone-600` | `#d6d3d1` | `dark:text-stone-300` |
| accent | `amber-700` | `#fbbf24` | `dark:text-amber-400` |
| border | `border-stone-200` | `#292524` | `dark:border-stone-800` |
| card-bg | `bg-white` | `#292524` | `dark:bg-stone-800` |

---

## Примеры компонентов

### Hero-секция

```html
<section class="bg-stone-50 pt-40 pb-32">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <!-- eyebrow -->
      <span class="text-xs font-medium tracking-wider uppercase text-amber-700">
        Introducing
      </span>
      <!-- hero title -->
      <h1 class="mt-6 text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl">
        Write with clarity.
      </h1>
      <!-- hero subtitle -->
      <p class="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-stone-500">
        A minimal writing tool for people who think in long form.
        No distractions. Just words.
      </p>
      <!-- CTA -->
      <div class="mt-12">
        <a href="#" class="inline-flex items-center rounded-md bg-stone-900 px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-stone-800">
          Start writing
        </a>
      </div>
    </div>
  </div>
</section>
```

Ключевые отличия от modern-clean:
- `pt-40 pb-32` (больше воздуха).
- Нет градиентного фона — solid `bg-stone-50`.
- `max-w-2xl` (уже — больше фокус).
- CTA = `bg-stone-900` (тёмный нейтральный, не цветной акцент).
- `text-xl leading-relaxed` subtitle (крупнее, свободнее).
- Accent используется в eyebrow-тексте, не в кнопке.

### Кнопка Primary

```html
<button class="inline-flex items-center justify-center rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:ring-offset-stone-50">
  Start writing
</button>
```

Варианты:
- **Accent:** `bg-amber-700 hover:bg-amber-800` (когда нужен яркий CTA).
- **Secondary:** `border border-stone-300 bg-white text-stone-700 hover:bg-stone-50`.
- **Ghost:** `text-stone-600 hover:bg-stone-100` (без border).

> В warm-minimal primary CTA часто **тёмно-нейтральный** (stone-900), а не цветной.
> Цветной (amber) — для особого акцента или secondary action.

### Карточка

```html
<div class="group rounded-2xl border border-stone-200 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-stone-300">
  <!-- icon or number -->
  <span class="text-sm font-medium text-amber-700">01</span>
  <!-- title -->
  <h3 class="mt-4 text-lg font-semibold text-stone-900">
    Distraction-free editor
  </h3>
  <!-- description -->
  <p class="mt-3 text-base leading-relaxed text-stone-500">
    A clean canvas that gets out of your way. No toolbars,
    no clutter — just you and your thoughts.
  </p>
</div>
```

Отличия от modern-clean:
- `p-8` (больше воздуха внутри).
- `text-base leading-relaxed` (крупнее, свободнее).
- Номер/иконка — `text-amber-700` (accent text), не в цветном квадрате.
- `hover:border-stone-300` (тёплый hover).

### Блог-карточка (уникально для warm-minimal)

```html
<article class="group">
  <a href="#" class="block">
    <div class="aspect-[16/9] overflow-hidden rounded-2xl bg-stone-100">
      <img src="https://placehold.co/800x450/e7e5e4/a8a29e?text=Article" alt="" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
    </div>
    <div class="mt-6">
      <span class="text-xs font-medium tracking-wider uppercase text-amber-700">
        Design
      </span>
      <h3 class="mt-2 text-xl font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
        The case for simplicity
      </h3>
      <p class="mt-2 text-base text-stone-500 leading-relaxed">
        Why the best tools disappear into the work, letting you focus on what matters.
      </p>
      <div class="mt-4 flex items-center gap-3">
        <div class="h-8 w-8 rounded-full bg-stone-200"></div>
        <span class="text-sm text-stone-400">Jane Doe · 5 min read</span>
      </div>
    </div>
  </a>
</article>
```

---

## Чек-лист warm-minimal

- [ ] Фон страницы = `bg-stone-50` (тёплый), не `bg-white` или `bg-gray-50`.
- [ ] CTA кнопки = `bg-stone-900` (тёмный нейтральный) или `bg-amber-700` (редко, яркий).
- [ ] Section padding ≥ `py-28` (112px) — БОЛЬШЕ чем modern-clean.
- [ ] Text max-width = `max-w-2xl` (уже, больше воздуха).
- [ ] Карточки = `p-8` (больше внутреннего пространства).
- [ ] Нет градиентных кнопок/акцентов.
- [ ] Navbar = `backdrop-blur-sm` или вообще без blur.
- [ ] Serif заголовки — опционально, только hero `<h1>`.
