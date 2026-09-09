# Аудит шаблонности — корневые причины

**Дата:** 2026-09-09
**Проекты:** maksplit, vetclinic, cyberspace, neuraleye, stakly (5 проектов)

---

## 1. Фактические данные: 5 проектов

| Характеристика | maksplit | vetclinic | cyberspace | neuraleye | stakly |
|---------------|----------|-----------|------------|-----------|--------|
| **Шрифт** | Source Serif 4 | Inter | Inter | Inter | Inter |
| **Hero h1** | text-5xl | text-6xl | text-7xl | text-7xl | text-6xl |
| **Hero тип** | centered (54) | centered (28) | centered (42) | centered (47) | centered (43) |
| **Радиус** | rounded-* | rounded-md | rounded-* | rounded-sm | rounded-* |
| **Акцент** | #32598f blue | emerald | cyan #06b6d4 | purple | indigo |

**4 из 5 проектов** используют Inter. **5 из 5** используют centered hero. **5 из 5** используют text-5xl/6xl/7xl заголовки.

Только СтройМакс отличается — потому что владелица ВРУЧНУЮ выбрала шрифт через dashboard.

---

## 2. Семь корневых причин шаблонности

### Причина №1: tokens.md фиксирует Inter как дефолт

**Где:** `agent/config/design-system/tokens.md`, строка 56
```css
Font (sans): 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```
**Эффект:** Tailwind `font-sans` по умолчанию = Inter. ui-coder не меняет шрифт если тема не указывает другой display-шрифт.

**Почему это проблема:** Тема warm-minimal (дефолт для контентных сайтов) не имеет обязательного display-шрифта. ui-coder получает Inter и остаётся с ним.

---

### Причина №2: Composition-primitives.md — 73% «centered» hero

**Где:** `agent/config/design-system/composition-primitives.md`, строка 376
```
Hero type classifier (73% "centered") — классификатор грубый
```
**Эффект:** hero-варианты в composition-primitives.md: centered, asymmetric-split, full-bleed-image, typography-first, product-showcase. Но centered — самый простой для генерации (text-center + flex-col + items-center). ui-coder выбирает его по умолчанию.

**Почему это проблема:** 5/5 проектов = centered hero. Centered hero не плох сам по себе, но 100% использование = шаблонность.

---

### Причина №3: Layout-patterns.md — конкретные Tailwind-сниппеты

**Где:** `agent/config/design-system/layout-patterns.md`, строки 28-39, 62-69, 92-98
```html
<section class="min-h-screen flex items-center px-8 lg:px-20">
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto w-full">
```
**Эффект:** ui-coder БУКВАЛЬНО копирует эти сниппеты. 8 скелетов → 8 шаблонов. Даже если выбран другой скелет, px-8, max-w-7xl, grid остаются одинаковыми.

**Почему это проблема:** Это прямое нарушение правила «НЕ копировать HTML-сниппет из темы 1:1» (из Anti-Slop).

---

### Причина №4: Pre-build Critique — дефолтный путь

**Где:** `agent/agents/ui-coder.md`, строка 80
```
Pattern Selection: [layout_pattern из layout-patterns.md] — [≠ дефолт 'hero→features→grid→cta' ИЛИ обоснование]
```
**Эффект:** Правило ЗАПРЕЩАЕТ дефолт `hero→features→grid→cta`… но разрешает его «с обоснованием». ui-coder всегда находит обоснование.

**Почему это проблема:** Запрет с исключением = разрешение. Нет механизма enforcement. ui-coder говорит «обосновано для SaaS» и использует тот же скелет.

---

### Причина №5: Выбор темы → предопределяет всё

**Где:** `agent/prompts/make-ui.md`, строка 68
```
В описании есть ключевые слова → определяем И ПОКАЖИ выбор владельцу
```
**Эффект:** Выбор темы (concrete-steel, dusty-slate, etc.) предопределяет:
- палитру (:root цвета)
- шрифты (если указаны)
- радиусы
- mood

То есть **тема = дизайн-решение**. Разные проекты с одной темой визуально одинаковы. А тем всего 16.

**Почему это проблема:** Design System диктует дизайн, а не обслуживает его.

---

### Причина №6: Компоненты — единственный вариант

**Где:** `projects/*/shared/components/nav.html`, `hero.html`, `card.html` и т.д.
**Эффект:** Каждый компонент существует в ОДНОМ варианте. Hero — всегда один и тот же HTML-скелет. Карточка — всегда одна и та же структура.

**Почему это проблема:** Невозможно выбрать «асимметричный hero» или «editorial hero» — есть только один hero.html.

---

### Причина №7: Нет этапа «Visual Concept»

**Где:** pipeline Make UI 2.0
```
Brief → Theme → Tokens → Components → HTML
```
**Эффект:** Дизайн-решения принимаются в момент выбора темы. Нет отдельного этапа «придумать визуальный язык под этот проект». ui-coder сразу начинает кодить из темы.

**Почему это проблема:** Это корень всей шаблонности. Система НЕ придумывает дизайн — она применяет тему.

---

## 3. Карта причин → эффектов

```
tokens.md: Inter default ────────────→ 4/5 проектов = Inter
composition-primitives: centered 73% ─→ 5/5 проектов = centered hero
layout-patterns: сниппеты ──────────→ одинаковые px-8, max-w-7xl, grid
pre-build: запрет с обоснованием ────→ дефолтный скелет всегда «обоснован»
тема = дизайн ──────────────────────→ 16 тем = 16 визуальных языков
компоненты: 1 вариант ──────────────→ невозможно выбрать другой hero/card
нет Visual Concept ─────────────────→ система не придумывает, а применяет
```

---

## 4. Что НЕ является причиной (уже работает)

- ✅ Quality Gate — детерминированные проверки работают
- ✅ Anti-Slop правила — клише ловятся (но не предотвращаются)
- ✅ Corpus — реальные референсы используются (но как сниппеты)
- ✅ Pattern Rotation — разные скелеты для разных проектов (работает, но 8 скелетов ≠ 8 разных дизайнов)
- ✅ Dashboard — владелец может выбрать тему (но тема = всё)