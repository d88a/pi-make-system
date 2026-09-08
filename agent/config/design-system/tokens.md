# Design Tokens — Pi Make

> Универсальные дизайн-токены для генерации UI. Не привязаны к конкретной теме.
> Тема (цвета, настроение) задаётся отдельным файлом из `themes/`.

## Как использовать

1. **tokens.md** (этот файл) — базовые правила: отступы, шрифты, радиусы, тени, лейаут, анимации, антипаттерны. Применяй ВСЕГДА, к любой теме.
2. **themes/<theme>.md** — цветовая палитра, градиенты, настроение, примеры компонентов. Выбери ОДНУ тему под задачу.
3. При генерации UI: бери структуру/значения отсюда, а цвета — из темы.
4. Все значения даны в формате **Tailwind-класс → CSS-значение**. Используй Tailwind-классы напрямую.
5. Секция **Anti-patterns** — список ЗАПРЕЩЁННЫХ решений. Проверяй код перед сдачей.

---

## Spacing

Сетка на базе 4px (Tailwind-based). Базовая единица — 4px.

| Token | px | Tailwind | Применение |
|-------|----|----------|-----------|
| 0.5 | 2px | `p-0.5` `m-0.5` `gap-0.5` | микро-отступы, иконки в тексте |
| 1 | 4px | `p-1` `m-1` `gap-1` | плотные UI, badge padding |
| 1.5 | 6px | `p-1.5` `m-1.5` | small input padding |
| 2 | 8px | `p-2` `m-2` `gap-2` | compact spacing, label→control |
| 2.5 | 10px | `p-2.5` | средний input padding |
| 3 | 12px | `p-3` `m-3` `gap-3` | card inner small, list items |
| 4 | 16px | `p-4` `m-4` `gap-4` | стандартный отступ |
| 5 | 20px | `p-5` `m-5` | card padding medium |
| 6 | 24px | `p-6` `m-6` `gap-6` | **card internal, card gap** |
| 8 | 32px | `p-8` `m-8` `gap-8` | section inner, grid gaps large |
| 10 | 40px | `p-10` `m-10` | section sub-blocks |
| 12 | 48px | `p-12` `m-12` | крупный отступ (НЕ для section padding) |
| 16 | 64px | `p-16` `m-16` | big section spacing |
| 20 | 80px | `p-20` `m-20` | **section padding (минимум)** |
| 24 | 96px | `p-24` `m-24` | section padding |
| 28 | 112px | `py-28` | опц. для warm-minimal (контентные секции) |
| 32 | 128px | `p-32` `m-32` | **section padding (максимум)** |
| 40 | 160px | `py-40` | опц. для warm-minimal (hero/feature) |

### Контекстные правила spacing

- **Section padding:** `py-20` to `py-32` (80–128px). НИЖЕ `py-16` не опускаться.
- **Card internal:** `p-6` (24px).
- **Card gap (grid):** `gap-6` (24px).
- **Hero padding:** `pt-32 pb-24` (128px top / 96px bottom).
- **Form field spacing:** `gap-4` между полями, `space-y-4` в стеке.

---

## Typography

### Семейства шрифтов

```
Font (sans): 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
Font (mono): 'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, monospace
```

Tailwind: `font-sans` (по умолчанию Inter), `font-mono` для кода и моноширинных чисел.

### Шкала размеров

| Token | font-size / line-height | Tailwind | Применение |
|-------|------------------------|----------|-----------|
| xs | 12px / 16px | `text-xs` | метки, badge, caption |
| sm | 14px / 20px | `text-sm` | secondary text, table, nav label |
| base | 16px / 24px | `text-base` | **body text** (по умолчанию) |
| lg | 18px / 28px | `text-lg` | lead paragraph, card title |
| xl | 20px / 28px | `text-xl` | subheading |
| 2xl | 24px / 32px | `text-2xl` | section title small |
| 3xl | 30px / 36px | `text-3xl` | section title |
| 4xl | 36px / 40px | `text-4xl` | section title large |
| 5xl | 48px / 48px | `text-5xl` | hero subtitle / title medium |
| 6xl | 60px / 60px | `text-6xl` | hero title |
| 7xl | 72px / 72px | `text-7xl` | hero title large |

### Веса (font-weight)

| Weight | Tailwind | Применение |
|--------|----------|-----------|
| 400 | `font-normal` | **body text** (по умолчанию) |
| 500 | `font-medium` | UI elements, labels, buttons, nav |
| 600 | `font-semibold` | **headings**, card titles |
| 700 | `font-bold` | **hero titles**, акценты |

### Letter-spacing

- **Hero titles:** ОБЯЗАТЕЛЬНО `tracking-tight` (-0.025em) или `tracking-tighter` (-0.05em). Без negative tracking сдавать hero нельзя.
- Body / UI: `tracking-normal` (по умолчанию).
- Uppercase labels (badge, eyebrow): `tracking-wider` (0.05em) + `uppercase`.

---

## CSS Custom Properties (обязательно для всех тем, D-107)

Все темы ОБЯЗАТЕЛЬНО содержат `:root` блок с CSS Custom Properties. ui-coder ОБЯЗАН использовать эти переменные (через `style` или Tailwind arbitrary values `bg-[var(--color-primary)]`), НЕ хардкодить hex.

Минимальный набор :root в каждой теме:
- `--color-bg-page`, `--color-surface`, `--color-text-primary`, `--color-text-muted`, `--color-primary`, `--color-border`

> **Примечание:** Canonical имя accent переменной = `--color-primary` (НЕ `--color-accent`). `--color-primary` = brand/accent color темы. НЕ путать с `--color-text-primary` (цвет основного текста).
- `--shadow-brand` — ЦВЕТНОЙ shadow (rgba accent), НЕ серый. Пример: `0 10px 30px -10px rgba(87,83,78,0.3)`
- `--transition-smooth` — cubic-bezier(0.4, 0, 0.2, 1), НЕ linear
- `--font-display`, `--font-body` — шрифты из Font Pairing system

Запрещено: серые shadows (gray-500/800), linear transitions, hardcoded hex в компонентах.

---

## Font Pairing System (D-108)

Шрифты подбираются ПАРАМИ (display + body), НЕ всегда Inter. Выбор зависит от mood темы.

| Пара | Display | Body | Mood | Темы |
|------|---------|------|------|------|
| Premium | Sora | Inter | Apple/Linear премиум | graphite-mono, sage-stone |
| Industrial | Space Grotesk | Inter | техно/промышленный | dusty-slate, concrete-steel |
| SaaS | Inter | Inter | чистый корпоративный | modern-clean, warm-minimal |
| Editorial | Playfair Display | Source Serif 4 | magazine/журнальный | editorial-cream |

Правила:
- Display = заголовки (h1-h3, hero), Body = текст/параграфы/UI
- НЕ использовать Inter для display если тема указывает другой display-шрифт
- Google Fonts подключаются в <head> каждой страницы
- font-display: swap для производительности

---

## Border-radius

| Token | px | Tailwind | Применение |
|-------|----|----------|-----------|
| sm | 4px | `rounded-sm` | мелкие элементы, теги |
| md | 6px | `rounded-md` | **buttons, inputs** |
| lg | 8px | `rounded-lg` | small cards, pills |
| xl | 12px | `rounded-xl` | **modals, dropdowns** |
| 2xl | 16px | `rounded-2xl` | **cards** |
| 3xl | 24px | `rounded-3xl` | hero blocks, large panels |
| full | 9999px | `rounded-full` | **badges, avatars, pills** |

### Контекстные правила radius

- **Cards:** `rounded-2xl` (16px).
- **Buttons / inputs:** `rounded-md` (6px).
- **Modals:** `rounded-xl` (12px).
- **Badges / avatars:** `rounded-full`.
- НЕ использовать `rounded-sm`/`rounded` (4-6px) на карточках — выглядит устаревшим.

---

## Shadows (6 уровней)

| Level | CSS | Tailwind | Применение |
|-------|-----|----------|-----------|
| none | — | `shadow-none` | плоские элементы |
| sm | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-sm` | тонкий край, subtle |
| base | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | `shadow` | default |
| md | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | `shadow-md` | hover card, floating |
| lg | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | `shadow-lg` | dropdown, popover |
| xl | `0 20px 25px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.04)` | `shadow-xl` | modals, big floating |
| 2xl | `0 25px 50px rgba(0,0,0,0.25)` | `shadow-2xl` | hero spotlight, modal top |

### Современный подход (modern trend)

- **Карточки — через border, не через shadow:** `border border-<color>-200` вместо тяжёлой тени.
- **Тени — только для floating-элементов:** dropdowns, popovers, modals, sticky nav при скролле.
- Heavy shadows (blur > 15px) — ЗАПРЕЩЕНЫ (см. Anti-patterns).

---

## Layout

### Container

```
max-w-7xl (1280px), mx-auto, px-4 sm:px-6 lg:px-8
```

Tailwind: `container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`.

### Breakpoints

| Name | px | Tailwind prefix |
|------|----|----------------|
| sm | 640px | `sm:` |
| md | 768px | `md:` |
| lg | 1024px | `lg:` |
| xl | 1280px | `xl:` |
| 2xl | 1536px | `2xl:` |

Mobile-first: базовые стили = mobile, дальше `sm:` → `md:` → `lg:`.

### Grid карточек

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
```

- 1 колонка на mobile, 2 на tablet (`md`), 3 на desktop (`lg`).
- `gap-6` (24px) — стандартный gap сетки.

### Navbar

```
sticky, h-16 (64px), backdrop-filter: blur(12px), border-b
```

Tailwind: `sticky top-0 z-50 h-16 border-b backdrop-blur-md`.
Цвет фона и прозрачность задаёт тема (`bg-white/80` и т.п.).

---

## Images
- Аватары: `rounded-full`, размеры 32/40/48/64px (`w-8`/`w-10`/`w-12`/`w-16`)
- Карточки-изображения: `rounded-lg` (8px), `object-cover`, aspect-ratio из темы
- Hero-изображения: `rounded-xl` (12px) или без radius (full-bleed)
- Placeholder: placehold.co с цветом из токенов (НЕ случайные цвета)
- **Фото товара (страница товара) — ПРАВИЛО I-1: CONTAIN, НЕ cover!**
  - Контейнер: `aspect-square` или `aspect-[4/3]`, `bg-surface`, `p-4` (padding = нейтральная рамка)
  - Image: `max-w-full max-h-full object-contain` + `flex items-center justify-center` контейнера
  - Max height: `max-h-[300px] md:max-h-[360px]`
  - Max width контейнера: `max-w-xs` (20rem) или `max-w-sm` (24rem) — НЕ full-width!
  - Фото = витрина одной плиточки в нейтральной рамке, НЕ блок.
  - ⚠️ ЗАПРЕЩЕНО: `object-cover` на главной фото товара (обрезает предмет!)
  - ⚠️ ЗАПРЕЩЕНО: `h-full w-full` без `max-h` (фото захватывает весь экран)
  - ⚠️ ЗАПРЕЩЕНО: `bg-white` на dark теме (чужеродное белое пятно). Только `bg-slate-900/50`, `bg-slate-800/40`, или `bg-[#0D2E5E]`.
- **Галерея товара (если >1 фото) — ПРАВИЛО I-3 для thumbnails + I-1 для main:**
  - Main image: правило I-1 (contain + bg + padding + max-h-[300px])
  - Thumbnails: `w-14 h-14 md:w-16 md:h-16` (56-64px, ОБЯЗАТЕЛЬНО small), `object-cover`, `rounded-lg`, `overflow-hidden`
  - Active thumbnail: `border-2 border-accent` (из темы)
  - Inactive: `border-2 border-transparent opacity-70 hover:opacity-100`
  - JS: клик по thumbnail → swap `src` main image + toggle active class
  - Layout: main image сверху, thumbnails в ряд снизу (mobile) ИЛИ main слева, thumbnails в колонку справа (desktop)
  - ⚠️ ЗАПРЕЩЕНО: thumbnail > 80px (thumbnails должны быть мелкие)
  - ⚠️ ЗАПРЕЩЕНО: `object-contain` на thumbnail (визуальный шум на мелком)
- **Карточка товара в каталоге / похожих товарах — ПРАВИЛО I-2: COVER + fixed height strip:**
  - Фото: `h-32` (128px) или `h-36` (144px), `w-full object-cover`, `overflow-hidden`
  - Контейнер карточки: `overflow-hidden`, БЕЗ `aspect-ratio` на всю карточку
  - Контент: `p-5` или `p-6`, занимает БОЛЬШЕ места чем фото (фото = полоска сверху, контент = основное)
  - ⚠️ ЗАПРЕЩЕНО: `aspect-square` + `object-cover` на всю карточку (фото доминирует = КРУПНО)
  - ⚠️ ЗАПРЕЩЕНО: `h-full` на фото (высота от контента = кривые карточки)
  - ⚠️ ЗАПРЕЩЕНО: `object-contain` в каталоге (разные высоты = рваный grid)
  - ⚠️ ЗАПРЕЩЕНО: `object-cover` на фото предмета в карточке если фото square (обрезает) — для square фото можно `object-contain` в `h-32` с `bg-surface`, но это ИСКЛЮЧЕНИЕ (лучше унифицировать все карточки через cover)
- **Hero/Banner с фото — ПРАВИЛО I-5: COVER + object-position (ОБЯЗАТЕЛЕН):**
  - Контейнер: `min-h-[400px] md:min-h-[500px]`, `overflow-hidden`
  - Image: `h-full w-full object-cover` + `object-position: top` / `center` / `bottom` (выбери под фото)
  - ⚠️ ОБЯЗАТЕЛЬНО `object-position` (center crop может срезать верх/низ)
  - ⚠️ ЗАПРЕЩЕНО: `object-contain` на hero (пустые полосы = любитель)
- **Смешанные/неизвестные фото из CMS — ПРАВИЛО I-4: branch logic:**
  | Контекст | Подход |
  |----------|--------|
  | Product page main | CONTAIN (I-1) |
  | Thumbnail | COVER (I-3) |
  | Catalog card | COVER + fixed h (I-2) |
  | Hero/banner | COVER + position (I-5) |
  | About/testimonials | Natural ratio (h-auto, w-full) |
  - Если фото < 200px разрешение: НЕ растягивать, `object-contain` в маленьком контейнере
  - ВСЕГДА указывай `width` и `height` атрибуты на `<img>` (даже приблизительные) — предотвращает CLS
  - `loading="lazy"` кроме первого видимого фото

### Антипаттерны Images (ЗАПРЕЩЕНО):
| НЕ делай | Делай вместо | Почему |
|----------|-------------|--------|
| `object-fill` / без `object-fit` | Всегда `contain` или `cover` | Растягивает/искажает |
| `aspect-auto` с неизвестным фото | `aspect-square` или `aspect-[4/3]` | Layout shift |
| `h-full w-full` без parent height | `max-w-full max-h-full` bounded | Захватывает секцию |
| Нет `width`/`height` на `<img>` | `width=800 height=600` (approx) | CLS при загрузке |
| Смешанный `cover`+`contain` в одном grid | Один подход на grid | Рваные высоты |
| `bg-white` на dark теме | `bg-surface` (тёмный нейтральный) | Чужеродное пятно |
| `object-cover` на product detail | `object-contain` (I-1) | Обрезает предмет |
| Нет `overflow-hidden` на cover | `overflow-hidden rounded-XX` | Вылезает за border |

---

## Photo System — IADS Integration (D-103/105/111/112)

Перед генерацией страниц с фото — запусти `node scripts/image-analyzer.js <image-paths> --usage <context>`. Скрипт возвращает JSON с рекомендациями по каждому фото (content_type, crop_safe, recommended_handling, css).

### Правила (D-112 — решение владельца):
- **catalog-card / product-card:** `object-contain` ПРИОРИТЕТНО (владелец требует «в карточках не обрезались»). IADS crop_safe показывает какие МОЖНО crop при необходимости, но default = contain.
- **category-cover / hero-banner:** можно `object-cover` если crop_safe=true
- **texture-macro:** contain (бесшовные текстуры, обрезка теряет паттерн)
- **product-group:** contain (сохранить всю группу)
- Низкое разрешение (<400px shortest_side) → рекомендована регенерация через gen_image.py
- regenerate.needed=true → запусти сгенерированную команду перед использованием

### CSS контейнер для contain (card):
`<div class="aspect-square bg-[var(--color-surface)] flex items-center justify-center p-4"><img src="..." class="max-w-full max-h-full object-contain" /></div>`

---

## Accessibility — Contrast (WCAG AA, обязательно)
- Body text: минимум 4.5:1 контраст с фоном
- Large text (≥18px / 14px bold): минимум 3:1
- UI-компоненты и графические элементы: 3:1
- Не использовать stone-400/slate-400 и светлее на белом фоне для основного текста
- Проверка: перед сдачей запускать `node scripts/a11y-check.js <path-to-html>`
- Это ОБЯЗАТЕЛЬНОЕ правило выбора цветов — не косметика

---

## Icons
- Размеры: 16/20/24/32px (`w-4`/`w-5`/`w-6`/`w-8`)
- Stroke: 1.5px (default), 2px (bold)
- Источник: Heroicons / Lucide / Phosphor (один набор на проект)
- Цвет: inherit (текущий text color) или из токенов

---

## Forms
- Input height: 40px (default), 48px (large)
- Input padding: `px-3 py-2` (default), `px-4 py-3` (large)
- Input radius: `rounded-md` (6px) — соответствует buttons
- Input border: 1px, цвет из tokens (border-default)
- Focus ring: 2px, цвет accent из темы
- Label: `text-sm` (14px), `font-medium`, color text-secondary

---

## Navigation
- Navbar height: 64px (default), 72px (large/sticky)
- Navbar padding: `px-4` (mobile), `px-6` (desktop)
- Sticky: `sticky top-0`, `backdrop-blur-md`, bg `bg-white/80` (light) или `bg-zinc-900/80` (dark)
- Footer padding: `py-12` (default), `py-16` (large)
- Footer bg: отличается от page bg (на 1 шаг темнее/светлее)

---

## Animations

| Скорость | Duration | Easing | Назначение |
|----------|---------|--------|-----------|
| Fast | 150ms | `cubic-bezier(0.4,0,0.2,1)` | hover state, color change, button press |
| Base | 200ms | `cubic-bezier(0.4,0,0.2,1)` | default transition, toggles |
| Slow | 300ms | `cubic-bezier(0.4,0,0.2,1)` | panel open/close, modals |

Tailwind: `transition duration-150` / `duration-200` / `duration-300` + `ease-in-out`.

### Hover карточки

```
transform: translateY(-2px);
box-shadow: shadow-md;
```

Tailwind: `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`.

### Scroll reveal (появление при скролле)

```
opacity: 0 → 1;
transform: translateY(24px) → translateY(0);
duration: 600ms;
easing: ease-out;
```

Реализация: IntersectionObserver + класс `.is-visible` (или фреймворк типа Framer Motion / AOS).
Stagger: задержка +100ms на каждый следующий элемент в группе.

---


## Composition Principles (Design Intent)

> «Не просто какие значения, а как собрать страницу которая дышит.»
> Tokens = что использовать. Composition Principles = как собрать.

### 1. Typographic Contrast (иерархия через масштаб)

Иерархия строится на КОНТРАСТЕ размеров, а не на количестве разных шрифтов.

| Уровень | Размер | Tailwind | Вес | Применение |
|---------|--------|----------|-----|-----------|
| Display | 60-72px | text-6xl..7xl | font-bold (700) | Hero title |
| Heading | 30-48px | text-3xl..4xl | font-semibold (600) | Section titles |
| Subheading | 20-24px | text-xl..2xl | font-semibold (600) | Card titles, subsection headers |
| Lead | 18px | text-lg | font-normal (400) | Hero subtitle, intro paragraph |
| Body | 16px | text-base | font-normal (400) | Основной текст |
| Caption | 14px | text-sm | font-medium (500) | Labels, meta, secondary |
| Micro | 12px | text-xs | font-medium (500) | Badges, legal, footnotes |

**Правило 3x:** Hero title должен быть ≥3x крупнее body text для премиального ощущения.
- 72px hero / 16px body = 4.5x → премиум
- 36px hero / 16px body = 2.25x → провинциально, нет драмы

### 2. Whitespace Rhythm

НЕ все секции одинаковой высоты. Ритм whitespace = музыка страницы.

| Тип секции | Padding (y) | Tailwind | Характер |
|-----------|-------------|----------|----------|
| Hero | top: 128-160px, bottom: 96-128px | pt-32..40 pb-24..32 | Монументальный вход |
| Feature-heavy | 96-128px | py-24..32 | Просторно, детально |
| Compact transition | 64-80px | py-16..20 | Быстрый ритм, связка |
| Full-bleed (photo/video) | 0 | py-0 | Изображение говорит |
| CTA / Form | 96px | py-24 | Акцент на действии |
| Footer | top: 64px, bottom: 48px | pt-16 pb-12 | Завершение |

**Анти-ритм:** py-28 везде = монотонно, нет дыхания. Чередуй: 32 → 20 → 28 → 24 → 16.

### 3. Layered Depth

Минимум 3 уровня фона на странице. Плоский дизайн (2 уровня) = дёшево.

**Для светлых тем:**
- Level 0: bg-page (white/#fafafa) — основной фон
- Level 1: bg-alt (gray-50/100) — чередование секций
- Level 2: bg-elevated (white + border) — карточки
- Level 3: accent-subtle (accent/5 или accent/10) — highlight, CTA-зона

**Для тёмных тем (industrial-dark и подобные):**
- Level 0: bg-page (#0B2653) — глубокий фон
- Level 1: bg-alt (slate-900) — секции, footer
- Level 2: bg-elevated (slate-800/50 + border) — карточки
- Level 3: bg-input (slate-900) — поля ввода (ещё глубже)
- Level 4: accent-glow (accent/10, accent/5) — тонкая подсветка

**НЕ:** чередуй только 2 уровня (bg-page ↔ bg-alt). Это плоско.

### 4. Visual Focal Point

ОДИН визуальный якорь на страницу. Что-то что захватывает взгляд первым:

- Hero display type (гигантский заголовок)
- Full-bleed product photo (фото во весь экран)
- Asymmetric split 70/30 (сильный дисбаланс в сторону изображения)
- Крупная статистика (font-mono text-7xl число)

**НЕ:** все секции равного визуального веса. Если всё «важное» — ничто не важное.

### 5. Asymmetry > Symmetry

Симметрия 50/50 = мёртвое равновесие. Используй асимметрию:

- Split: 60/40 или 70/30 вместо 50/50
- Grid: 2 колонки разной ширины (col-span-3 + col-span-2 в 5-колоночной сетке)
- Hero: текст слева (40%), пустота/фото справа (60%)

**НЕ:** 50/50 split — выглядит как шаблон, нет напряжения.

### 6. Accent Discipline

Акцентный цвет ≤5% площади страницы. Где использовать:

- CTA кнопки (primary action)
- Активные состояния (current page, selected tab)
- Ключевые цифры (price, stats)
- Hover-состояния (border, text color change)

**Где НЕ использовать:**
- Фоны карточек (заливать accent цветом)
- Иконки массово (каждая иконка accent → крикливо)
- Декоративные элементы (бордеры, разделители)
- Фоны секций (accent-бэкграунд = доминирует)

**Тест:** зажмурься, открой глаза. Если accent — первое что видишь на 20%+ площади → перебор.

### 7. Section Variation

Чередуй композиции секций. Не 5 одинаковых grid-секций подряд.

Палитра композиций:
- **Centered:** max-w-3xl mx-auto text-center (hero, CTA, intro)
- **Split:** grid-cols-5 (3+2) или grid-cols-2 с асимметрией (features, about)
- **Grid:** grid-cols-3 gap-6 (каталог, карточки)
- **Full-bleed:** py-0, фото/видео на всю ширину
- **List:** вертикальный стек с иконками (преимущества, шаги)

Рекомендуемый ритм для industrial:
Centered (hero) → Split 60/40 (производство) → Grid (каталог) → Full-bleed (проект) → Centered (CTA) → List (преимущества)


## Color Zone Model (замена бинарного warm/cool)

Цвета НЕ делятся на «тёплые/холодные». Это 16M hex. Делим на зоны по характеру.

### Зоны (используется в dashboard.html accent picker + architect Theme Proposal)

| Зона | Примеры hex | Характер | Когда уместно |
|------|-------------|----------|---------------|
| 🔵 Blue | #3B5F8A, #4F46E5, #1E3A8A | доверие, фокус, стабильность | SaaS, finance, education, корпоративный |
| 🟢 Green | #047857, #0E7490, #065F46 | рост, спокойствие, экология | эко, здоровье, финтех, education |
| 🔴 Red/Coral | #BE123C, #FB7185, #E11D48 | энергия, срочность, страсть | food, fashion, акции, тревога-контроль |
| 🟡 Gold/Amber (ЧИСТЫЙ) | #CA8A04, #D97706* | премиум, тепло, изобилие | luxury, food, осень (*см. предупреждение ниже) |
| 🟣 Purple/Violet | #7C3AED, #9333EA | креатив, роскошь, мистика | creative, beauty, premium |
| ⚪ Neutral | #475569, #44403C, #57534E | сдержанность, основа | везде как база, минимализм |

### ⚠️ Зона «детская неожиданность» — НЕ default

Грязно-оранжево-коричневая зона = отвергнута владельцем как «какашечный»:
- amber #d97706 → terracotta #B45309 → rust #92400E (грязный orange-brown)
- stone(cream) фон + Playfair serif + этот accent = AI-slop клише №1
- ИСПОЛЬЗОВАТЬ только если бриф ЯВНО требует тёплого янтарного mood
- НЕ подсовывать автоматически (D-117: автовыбор удалён)
- В dashboard.html эта зона помечена «близко к отвергнутой — осторожно»

### Правила архитектора (Theme Proposal Protocol)

1. Предлагай accent ИЗ зоны подходящей под контекст (не из любимой зоны Pi)
2. Не выбирай зону по правилу «тип сайта → зона» — обосновывай под mood брифа
3. При ≥2 валидных зон → showcase.html (Showcase Decision Pattern)
4. Владелец правит через dashboard (accent picker / custom hex)


## Anti-patterns (FORBIDDEN)

Список ЗАПРЕЩЁННЫХ решений. Перед сдачей UI проверь, что НИ ОДНО из них не присутствует.

| ❌ Запрет | ✅ Вместо этого |
|----------|----------------|
| Heavy shadows (blur > 15px) на карточках | `border` + `shadow-sm` (subtle) |
| Small border-radius (4–6px) на карточках | `rounded-2xl` (16px) для cards |
| Gradient buttons (color→color фон кнопки) | solid accent color, hover darken |
| Roboto / system-ui как основной шрифт | `'Inter'` через `font-sans` |
| Нет negative letter-spacing на заголовках | `tracking-tight`/`tracking-tighter` на hero |
| `py-12` (48px) section padding | `py-20`–`py-32` (80–128px) |
| Все секции одинаковой высоты (py-28 везде) | Ритм whitespace: чередуй py-32, py-20, py-28, py-24 (см. Composition Principles) |
| h1 и body одного масштаба (контраст <3x) | Hero ≥3x крупнее body (72px vs 16px = 4.5x) — см. Typographic Contrast |
| Accent цвет на >5% площади | Accent ≤5%: CTA + key numbers + active states. Не заливай accent на карточки/фоны/иконки массово |
| Все карточки в одном ряду с одинаковым gap | Варьируй плотность: feature p-8, каталог p-5..6. Разные gap для разных рядов |
| 50/50 split (симметрия) | 60/40 или 70/30. Асимметрия = напряжение = интерес. 50/50 = мёртвое равновесие |
| Stock photo строителей в касках | Только реальная продукция/проекты. Никаких улыбающихся людей в касках на белом фоне |
| Копирование HTML-сниппета из темы 1:1 | Тема = стартер, не финал. Каждый сайт должен иметь ≥1 уникальную композиционную черту |
| Gradient backgrounds, skeuomorphism | Flat, minimal, whitespace. Никаких градиентных фонов, теней-реализма, текстур |
| «Welcome to our website» / generic tagline | Конкретный позиционирующий tagline о продукте/ценности. Никаких «Добро пожаловать» |
| 5+ цветов в палитре | 2-3 цвета: near-black/near-white + 1 accent. Остальные — оттенки серого (slate/gray) |

### Чек-лист перед сдачей

- [ ] Шрифт — Inter (`font-sans`), код — JetBrains Mono (`font-mono`).
- [ ] Hero-заголовки имеют `tracking-tight` или `tracking-tighter`.
- [ ] Section padding ≥ `py-20` (80px).
- [ ] Карточки — `rounded-2xl` + `border`, без heavy shadow.
- [ ] Кнопки — solid color (НЕ gradient), `rounded-md`.
- [ ] Тени только на floating-элементах.
- [ ] Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- [ ] Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.

---

## Theme-specific exceptions

Некоторые темы оправданно нарушают базовые anti-patterns. Это РАЗРЕШЕНО только в перечисленных темах:

| Тема | Исключение | Обоснование |
|------|-----------|-------------|
| bold-tech | Gradient на primary CTA (`from-cyan-500 to-violet-500`) | Raycast-стиль, gradient = фирменный акцент |
| gaming | Gradient buttons, neon glow (`shadow-[0_0_15px...]`), `animate-pulse` | Neon/Retro эстетика требует свечения |
| dark-tech | Gradient buttons, neon glow, heavy shadows | Cyberpunk эстетика требует глубины |
| bento | `rounded-3xl` (вместо max `rounded-2xl`) | Apple Bento Grid — крупные скруглённые плитки |
| aurora | Heavy glow (`shadow-[0_0_40px...]`) | Vercel Aurora — сияние в темноте |
| mesh-gradient | Mesh-фон (множественные radial-gradient) | Stripe Mesh — цветные пятна как фон |
| industrial-dark | Subtle amber glow на hover (`shadow-[0_0_0_1px_rgba(253,185,0,0.4)...]`), JetBrains Mono для тех.данных | Промышленный B2B — amber акцент на dark, без неона |

**Правило:** вне этих тем — anti-patterns действуют строго. ui-coder НЕ должен использовать gradient buttons / heavy shadows в modern-clean, warm-minimal, luxury.
