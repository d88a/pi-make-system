# Component Variants Catalog

> **Правило:** Вариант компонента выбирается на основании Design Brief, а не случайно.
> Design Director указывает character компонента в design-brief.json.
> ui-coder выбирает подходящий variant из каталога.

---

## Hero Variants

| # | Variant | Характер | Когда использовать |
|---|---------|----------|-------------------|
| 1 | `hero-centered` | Центрированный, солидный, симметричный | Консервативные проекты, «никаких экспериментов» |
| 2 | `hero-split` | 60/40 split, текст слева, изображение справа | SaaS, tech, информационные |
| 3 | `hero-asymmetric` | Асимметрия 8-9/10, текст на изображении со смещением | Смелые, дизайнерские, премиум |
| 4 | `hero-editorial` | Только типографика, без изображений, как журнальный разворот | Редакционные, контентные, luxury |
| 5 | `hero-typographic` | Гигантский текст 72-120px на всю ширину | Брендинговые, fashion, art |
| 6 | `hero-visual-led` | Изображение на весь экран, текст overlay | Фото-тяжёлые: архитектура, отели, рестораны |
| 7 | `hero-layered` | Несколько слоёв: фон → текстура → изображение → текст | Премиум, immersive |
| 8 | `hero-full-bleed` | Изображение от края до края без отступов | Портфолио, строительство, недвижимость |

### Структура hero-centered
```html
<section class="min-h-[90vh] flex flex-col items-center justify-center text-center px-8">
  <h1 class="...">...</h1>
  <p class="...">...</p>
  <div class="flex gap-4">...</div>
</section>
```

### Структура hero-split
```html
<section class="min-h-[90vh] grid grid-cols-1 md:grid-cols-2 items-center">
  <div class="px-8 md:px-20">...</div>
  <div class="relative h-full"><img class="absolute inset-0 object-cover"/></div>
</section>
```

### Структура hero-asymmetric
```html
<section class="relative min-h-screen overflow-hidden">
  <div class="absolute right-0 top-0 w-[55%] h-full">...</div>
  <div class="relative z-10 ml-[8%] mt-[20vh] max-w-xl">...</div>
</section>
```

---

## Card Variants

| # | Variant | Характер | Border | Shadow | Radius |
|---|---------|----------|--------|--------|--------|
| 1 | `card-plain` | Строгий информационный | subtle | none | sharp |
| 2 | `card-elevated` | Приподнятая карточка | none | medium | 8px |
| 3 | `card-outline` | Контурная | prominent | none | sharp |
| 4 | `card-glass` | Стеклянная | subtle | none | 12px |
| 5 | `card-brutal` | Брутальная | thick (2px) | none | 0 |

---

## Button Variants

| # | Variant | Character | Radius | Weight | Hover |
|---|---------|-----------|--------|--------|-------|
| 1 | `btn-solid` | Солидный | sharp | semibold | color-swap |
| 2 | `btn-ghost` | Лёгкий | sharp | medium | subtle-bg |
| 3 | `btn-pill` | Закруглённый | pill | medium | scale |
| 4 | `btn-outline` | Контурный | 4px | medium | fill |
| 5 | `btn-brutal` | Брутальный | 0 | bold | shadow-pop |

---

## Navigation Variants

| # | Variant | Character | Sticky | Transparency |
|---|---------|-----------|--------|-------------|
| 1 | `nav-solid` | Строгий верхний | yes | solid |
| 2 | `nav-glass` | Стеклянный плавающий | yes | glass (backdrop-blur) |
| 3 | `nav-transparent` | Прозрачный → цветной | yes | transparent-to-solid |
| 4 | `nav-sidebar` | Боковой | yes | solid |
| 5 | `nav-minimal` | Минимальный (только лого + бургер) | no | solid |

---

## Использование в Design Brief

Design Director указывает character для каждого компонента:

```json
{
  "component_character": {
    "hero": "asymmetric",
    "card": "card-plain",
    "button": "btn-solid",
    "navigation": "nav-glass"
  }
}
```

ui-coder выбирает соответствующий variant и НЕ использует дефолтный.

---

## Правила

1. **Design Brief диктует variant.** Не ui-coder, не тема.
2. **Один variant на весь проект.** Для консистентности.
3. **Variants ≠ больше шаблонов.** Это ограниченный набор осмысленных вариантов, выбранных на основании концепции.
4. **Hero-centered — ТОЛЬКО если brief явно просит «солидно, без экспериментов».**
5. **Card-plain — default для не-ecommerce.**
6. **Btn-pill — НЕ default.** Только для playful/friendly mood.