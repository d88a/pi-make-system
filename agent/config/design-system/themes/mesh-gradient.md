# Theme: Mesh Gradient

> Стиль Stripe / Nubank / Revolut Premium.
> Яркие размытые цветовые пятна, перетекающие друг в друга.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Mood

**Vibrant, fluid, premium, expressive.**

- Фоновые mesh-градиенты (CSS radial-gradient множественные пятна)
- Glassmorphism-карточки поверх градиентов (blur + прозрачность)
- Движение и глубина через цвет, не через анимацию
- Светлый base, но секции могут иметь свой "цветовой остров"
- Текст — контрастный на белых/стеклянных карточках

### When to use

Финтех, банки, платёжные системы, премиум-SaaS, мобильные приложения,
consumer-facing продукты, где нужен "вау" от первого взгляда.

---

## Colors

| Роль | Hex | Tailwind | Где |
|------|-----|----------|-----|
| bg (page) | `#ffffff` | `bg-white` | основной фон |
| bg (card) | `rgba(255,255,255,0.7)` | `bg-white/70` | стеклянные карточки |
| bg (card solid) | `#ffffff` | `bg-white` | обычные карточки |
| text (headings) | `#09090b` | `text-zinc-900` | заголовки |
| text (body) | `#3f3f46` | `text-zinc-700` | описания |
| text (muted) | `#a1a1aa` | `text-zinc-400` | secondary |
| accent primary | `#7c3aed` | `text-violet-600` | CTA, links |
| accent hover | `#6d28d9` | `hover:bg-violet-700` | hover |
| gradient blob 1 | `#c084fc` | — | mesh: violet |
| gradient blob 2 | `#38bdf8` | — | mesh: sky |
| gradient blob 3 | `#fb923c` | — | mesh: orange |
| gradient blob 4 | `#4ade80` | — | mesh: green |
| gradient blob 5 | `#f472b6` | — | mesh: pink |
| border (glass) | `rgba(255,255,255,0.3)` | `border-white/30` | glass border |
| border (solid) | `#e4e4e7` | `border-zinc-200` | card border |

---

## Mesh Gradient Backgrounds

### Hero mesh (главный приём темы)

```css
background-color: #ffffff;
background-image:
  radial-gradient(at 20% 30%, rgba(192, 132, 252, 0.3) 0px, transparent 50%),
  radial-gradient(at 80% 20%, rgba(56, 189, 248, 0.25) 0px, transparent 50%),
  radial-gradient(at 60% 80%, rgba(251, 146, 60, 0.2) 0px, transparent 50%);
```

Tailwind:
```html
<div class="relative">
  <div class="absolute inset-0 -z-10" style="
    background-image:
      radial-gradient(at 20% 30%, rgba(192,132,252,0.3) 0, transparent 50%),
      radial-gradient(at 80% 20%, rgba(56,189,248,0.25) 0, transparent 50%),
      radial-gradient(at 60% 80%, rgba(251,146,60,0.2) 0, transparent 50%);
  "></div>
  <!-- content -->
</div>
```

### Feature section mesh (другие цвета)

```css
background-image:
  radial-gradient(at 10% 50%, rgba(74, 222, 128, 0.2) 0px, transparent 50%),
  radial-gradient(at 90% 30%, rgba(244, 114, 182, 0.25) 0px, transparent 50%);
```

### Dark section mesh

```css
background-color: #09090b;
background-image:
  radial-gradient(at 30% 40%, rgba(124, 58, 237, 0.4) 0px, transparent 50%),
  radial-gradient(at 70% 60%, rgba(56, 189, 248, 0.3) 0px, transparent 50%);
```

### Правила mesh

- **3-5 blobs** на секцию (не больше — каша)
- **Opacity 0.15-0.35** (тонко, не кричаще)
- **Blur radius 50%** (мягкие края)
- Каждая секция имеет **свой набор цветов** (не повторяй hero mesh)
- `-z-10` чтобы mesh был ПОД контентом

---

## Glassmorphism Card

```html
<div class="rounded-2xl border border-white/30 bg-white/70 p-6 backdrop-blur-xl transition-all duration-200 hover:bg-white/80 hover:-translate-y-0.5 hover:shadow-lg">
  <h3 class="text-lg font-semibold text-zinc-900">Заголовок</h3>
  <p class="mt-2 text-sm text-zinc-700">Описание фичи в одно-два предложения</p>
</div>
```

Ключевые классы:
- `bg-white/70` — 70% белый (полупрозрачный)
- `backdrop-blur-xl` — blur 24px (размывает mesh за карточкой)
- `border border-white/30` — тонкая светлая граница
- `hover:bg-white/80` — менее прозрачный при hover

### Glass dark variant (для тёмных секций)

```html
<div class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl text-white">
```

---

## Hero-секция

```html
<section class="relative overflow-hidden pt-32 pb-24">
  <!-- Mesh gradient background -->
  <div class="absolute inset-0 -z-10" style="
    background-image:
      radial-gradient(at 20% 30%, rgba(192,132,252,0.3) 0, transparent 50%),
      radial-gradient(at 80% 20%, rgba(56,189,248,0.25) 0, transparent 50%),
      radial-gradient(at 50% 90%, rgba(251,146,60,0.2) 0, transparent 50%);
  "></div>
  
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <h1 class="text-6xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
        Платежи без
        <span class="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">границ</span>
      </h1>
      <p class="mx-auto mt-8 max-w-xl text-lg text-zinc-700">
        Принимайте платежи из 180+ стран. Конвертация в реальном времени. Zero fees на первые 3 месяца.
      </p>
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#" class="rounded-md bg-violet-600 px-6 py-3 text-base font-medium text-white hover:bg-violet-700 transition-colors duration-150 shadow-lg shadow-violet-500/25">
          Начать бесплатно
        </a>
        <a href="#" class="rounded-md border border-zinc-200 bg-white/70 backdrop-blur-md px-6 py-3 text-base font-medium text-zinc-700 hover:bg-white transition-colors duration-150">
          Смотреть демо
        </a>
      </div>
    </div>
    
    <!-- Glass cards below hero -->
    <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="rounded-2xl border border-white/30 bg-white/70 p-6 backdrop-blur-xl">
        <span class="text-3xl font-bold text-zinc-900">180+</span>
        <p class="text-sm text-zinc-600 mt-1">Стран</p>
      </div>
      <div class="rounded-2xl border border-white/30 bg-white/70 p-6 backdrop-blur-xl">
        <span class="text-3xl font-bold text-zinc-900">0.3с</span>
        <p class="text-sm text-zinc-600 mt-1">Среднее время транзакции</p>
      </div>
      <div class="rounded-2xl border border-white/30 bg-white/70 p-6 backdrop-blur-xl">
        <span class="text-3xl font-bold text-zinc-900">99.99%</span>
        <p class="text-sm text-zinc-600 mt-1">Uptime</p>
      </div>
    </div>
  </div>
</section>
```

---

## Кнопка Primary

```html
<button class="rounded-md bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all duration-150 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/30">
  Начать бесплатно
</button>
```

Особенность: `shadow-violet-500/25` — цветная тень кнопки (вместо серой).

---

## Чек-лист mesh-gradient

- [ ] Hero имеет mesh-градиент (3-5 radial-gradient blobs)
- [ ] Glass-карточки поверх mesh: `bg-white/70 backdrop-blur-xl`
- [ ] Gradient text на ключевых словах: `bg-clip-text text-transparent`
- [ ] Цветная тень кнопок: `shadow-lg shadow-violet-500/25`
- [ ] Каждая секция = свой mesh (НЕ копировать hero mesh)
- [ ] Opacity blobs 0.15-0.35 (не ярче)
- [ ] `-z-10` на mesh background (под контентом)
- [ ] Контраст текста: `text-zinc-900` на glass (НЕ серый)
- [ ] Hover: `bg-white/80` (менее прозрачный) + lift
