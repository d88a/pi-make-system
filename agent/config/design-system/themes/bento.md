# Theme: Bento Grid

> Стиль Apple / Linear Features / Vercel Marketing.
> Мозаика из карточек разных размеров. Каждая карточка — отдельная история.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Mood

**Editorial, premium, asymmetric, visual storytelling.**

- Hero = огромная карточка на 2/3 ширины + sidebar из мелких
- Features = bento grid (1×1, 2×1, 1×2, 2×2 ячейки в одной сетке)
- Минимум текста, максимум визуала
- Каждая карточка имеет уникальный layout внутри
- Скролл = путешествие по "журналу"

### When to use

Лендинги продуктов (SaaS, app, tool), портфолио, showcase,
feature-страницы, продуктовые анонсы, презентации.
НЕ для: блогов, магазинов, dashboards.

---

## Colors

| Роль | Hex | Tailwind | Где |
|------|-----|----------|-----|
| bg (page) | `#fafafa` | `bg-stone-50` | основной фон |
| bg (card) | `#ffffff` | `bg-white` | карточки bento |
| bg (accent card) | `#0f0f0f` | `bg-stone-900` | контрастные тёмные карточки |
| text (headings) | `#0f0f0f` | `text-stone-900` | заголовки |
| text (body) | `#57534e` | `text-stone-600` | описания |
| text (muted) | `#a8a29e` | `text-stone-400` | secondary |
| text (on dark card) | `#fafafa` | `text-stone-50` | текст на тёмных карточках |
| accent | `#6366f1` | `text-indigo-500` | CTA, links, interactive |
| accent warm | `#f97316` | `text-orange-500` | highlight акцент (точечно!) |
| border | `#e7e5e4` | `border-stone-200` | card border |
| border (dark card) | `#292524` | `border-stone-800` | border тёмных карточек |

---

## Bento Grid System

### Базовая сетка

```css
grid-template-columns: repeat(4, 1fr);
grid-auto-rows: minmax(200px, auto);
gap: 16px;
```

Tailwind:
```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
```

### Размеры карточек

| Имя | cols × rows | Tailwind | Применение |
|-----|-------------|----------|-----------|
| small | 1×1 | `col-span-1 row-span-1` | Иконка + текст, статистика |
| wide | 2×1 | `col-span-2 row-span-1` | Feature с иллюстрацией |
| tall | 1×2 | `col-span-1 row-span-2` | Список, вертикальный контент |
| large | 2×2 | `col-span-2 row-span-2` | Hero-карточка, главный feature |
| hero | 3×2 | `col-span-3 row-span-2` | Главный hero |
| strip | 4×1 | `col-span-4 row-span-1` | CTA-полоса, социальное доказательство |

### Layout паттерны

#### Hero (hero + 2 sidebar)

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
  <!-- Main hero: 3 cols, 2 rows -->
  <div class="col-span-2 md:col-span-3 row-span-2 rounded-3xl bg-white border border-stone-200 p-8 flex flex-col justify-between">
    <div>
      <h1 class="text-5xl font-bold tracking-tight text-stone-900">Заголовок продукта</h1>
      <p class="mt-4 text-lg text-stone-600 max-w-lg">Краткое описание в одно-два предложения</p>
    </div>
    <div class="flex gap-3">
      <a class="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white">Начать</a>
      <a class="rounded-md border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-700">Подробнее</a>
    </div>
  </div>
  
  <!-- Sidebar top: 1 col, 1 row -->
  <div class="hidden md:flex col-span-1 row-span-1 rounded-3xl bg-stone-900 p-6 items-end text-stone-50">
    <div>
      <span class="text-4xl font-bold">99.9%</span>
      <p class="text-sm text-stone-400 mt-1">Uptime</p>
    </div>
  </div>
  
  <!-- Sidebar bottom: 1 col, 1 row -->
  <div class="hidden md:flex col-span-1 row-span-1 rounded-3xl bg-white border border-stone-200 p-6 items-center justify-center">
    <!-- Логотипы клиентов или иконки -->
  </div>
</div>
```

#### Features (bento mosaic)

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
  <!-- Feature 1: wide -->
  <div class="col-span-2 row-span-1 rounded-3xl bg-white border border-stone-200 p-8">
    <h3 class="text-xl font-semibold text-stone-900">Аналитика</h3>
    <p class="mt-2 text-stone-600">Отслеживайте метрики в реальном времени</p>
    <!-- Мини-график внизу карточки -->
  </div>
  
  <!-- Feature 2: small -->
  <div class="col-span-1 row-span-1 rounded-3xl bg-stone-900 p-6 flex flex-col justify-between text-stone-50">
    <svg class="w-8 h-8 text-indigo-400" ...></svg>
    <div>
      <span class="text-3xl font-bold">50+</span>
      <p class="text-sm text-stone-400">Интеграций</p>
    </div>
  </div>
  
  <!-- Feature 3: small -->
  <div class="col-span-1 row-span-1 rounded-3xl bg-white border border-stone-200 p-6 flex flex-col justify-center items-center text-center">
    <span class="text-5xl">⚡</span>
    <p class="mt-3 text-sm font-medium text-stone-900">Мгновенно</p>
  </div>
  
  <!-- Feature 4: tall -->
  <div class="col-span-1 row-span-2 rounded-3xl bg-gradient-to-b from-indigo-500 to-violet-600 p-6 flex flex-col justify-between text-white">
    <h3 class="text-xl font-semibold">Автоматизация</h3>
    <div class="space-y-2">
      <div class="rounded-lg bg-white/20 p-3 text-sm">Триггер → Действие</div>
      <div class="rounded-lg bg-white/20 p-3 text-sm">Условие → Уведомление</div>
      <div class="rounded-lg bg-white/20 p-3 text-sm">Расписание → Отчёт</div>
    </div>
  </div>
  
  <!-- Feature 5: wide -->
  <div class="col-span-1 row-span-1 rounded-3xl bg-white border border-stone-200 p-6">
    <h3 class="text-lg font-semibold text-stone-900">Безопасность</h3>
    <p class="mt-1 text-sm text-stone-600">SOC 2, шифрование, 2FA</p>
  </div>
  
  <!-- Feature 6: wide -->
  <div class="col-span-1 row-span-1 rounded-3xl bg-white border border-stone-200 p-6">
    <h3 class="text-lg font-semibold text-stone-900">API</h3>
    <p class="mt-1 text-sm text-stone-600">REST + GraphQL + Webhooks</p>
  </div>
</div>
```

---

## Карточки

### Light card

```html
<div class="rounded-3xl bg-white border border-stone-200 p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
```

### Dark accent card

```html
<div class="rounded-3xl bg-stone-900 border border-stone-800 p-8 text-stone-50">
```

### Gradient accent card

```html
<div class="rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 p-8 text-white">
```

### Stat card

```html
<div class="rounded-3xl bg-white border border-stone-200 p-8 flex flex-col justify-between">
  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
    <svg ...></svg>
  </div>
  <div>
    <span class="text-4xl font-bold text-stone-900">2.4M</span>
    <p class="text-sm text-stone-500 mt-1">Активных пользователей</p>
  </div>
</div>
```

---

## Typography

- Заголовки: `font-bold tracking-tight text-stone-900`
- Огромные числа: `text-5xl md:text-7xl font-bold tracking-tight`
- Подписи: `text-sm text-stone-500`
- Внутри тёмных карточек: `text-stone-50` для заголовков, `text-stone-400` для текста

---

## Чек-лист bento

- [ ] Сетка 4 колонки (`md:grid-cols-4`), не 3!
- [ ] Карточки РАЗНЫХ размеров (small + wide + tall + large)
- [ ] Минимум одна тёмная карточка (`bg-stone-900`) для контраста
- [ ] Минимум одна gradient-карточка для акцента
- [ ] `rounded-3xl` (24px) для всех bento-карточек
- [ ] `gap-4` (16px) — плотная мозаика
- [ ] `auto-rows-[200px]` — фиксированная высота строк
- [ ] Каждая карточка рассказывает свою историю (не копия соседней)
- [ ] Hero = bento (НЕ центрированный текст)
- [ ] Много пустого пространства внутри карточек
