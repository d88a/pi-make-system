# Make UI 2.0 — Расширенный план

> **Статус:** РЕАЛИЗОВАНО (фазы 1-8, кроме 3B/3C/3D — отложены)
> **Дата:** 2026-07-14 (обновлено 2026-07-18)
> **Зависимости:** tokens.md ✅, 9 тем ✅, wow-patterns.md ✅, style-guide.md ✅, image-gen ✅

---

## Контекст

### Что есть сейчас (Make UI 1.0)
- 9 тем (modern-clean → aurora)
- tokens.md (правила spacing/typography/layout)
- wow-patterns.md (10 CSS-приёмов)
- style-guide.md (примеры реальных сайтов)
- image-gen (DashScope Wanx)
- make-ui.md промпт (выбор темы → ui-coder → screenshot → designer → fix)
- ui-coder.md (single-page, HTML+Tailwind)

### Что НЕ работает
- ❌ Многостраничность (один HTML = один сайт)
- ❌ Генерация стиля из описания (только "выбери из 9 тем")
- ❌ Копирование стиля из скриншота/Figma
- ❌ Консистентность между страницами
- ❌ Редизайн существующего сайта
- ❌ Франкенштейн (микс из нескольких референсов)
- ❌ Бренд-кит (цвета + шрифты из брендбука)
- ❌ Точечные правки ("поменяй hero")

### Что хотим (Make UI 2.0)

**3-осная модель:**

```
Ось 1: INPUT (что дали системе)
  ├── Reference (скриншот/Figma/URL)
  ├── References[] (2-5 референсов)
  ├── Frankenstein (микс: навбар отсюда, hero отсюда)
  ├── Existing Site (редизайн)
  ├── Brand (брендбук: цвета + шрифты + логотип)
  ├── Description (текстовое описание)
  └── Nothing (удиви)

Ось 2: FIDELITY (точность следования)
  ├── Pixel-perfect (1:1 копия)
  ├── Inspired-by (возьми настроение, адаптируй)
  ├── Guided (вот направление, детали на тебе)
  └── Free (полная свобода AI)

Ось 3: SCOPE (объём генерации)
  ├── Single-page (лендинг)
  ├── Multi-page (сайт: 3-10 страниц)
  ├── App (dashboard, SaaS)
  └── Fix (точечная правка)
```

**8 сценариев = все комбинации:**

| # | Сценарий | Input | Fidelity | Scope |
|---|----------|-------|----------|-------|
| 1 | "Скопируй Figma 1:1" | reference | pixel-perfect | any |
| 2 | "Вдохновись этими сайтами" | references[] | inspired-by | any |
| 3 | "Навбар отсюда, hero отсюда" | frankenstein | inspired-by | single |
| 4 | "Редизайн этого сайта" | existing | guided | multi |
| 5 | "Вот брендбук, сделай сайт" | brand | guided | multi |
| 6 | "Сайт клиники, светлый" | description | guided | multi |
| 7 | "Удиви" | nothing | free | single |
| 8 | "Поменяй hero, остальное норм" | existing + пожелание | mixed | fix |

---

## Ключевые архитектурные решения

### A. Project Model — ядро системы (из экспертного фидбека)

**Проблема:** Сейчас `style.generated.md` — единственный артефакт. Нет глобального состояния проекта. Нельзя сказать "добавь страницу Careers" без пересборки.

**Решение:** 5 артефактов, каждый для своей цели:

```
projects/site/
├── project.json              ← Глобальное состояние проекта (бренд, решения, структура)
├── design-tokens.json        ← Машиночитаемые токены (цвета, размеры, шрифты)
├── components.json           ← Реестр компонентов (nav, footer, hero, card, ...)
├── pages.json                ← Карта сайта (каждая страница + её секции)
├── shared/
│   ├── style.generated.md    ← Человекочитаемый Style Guide (12 категорий)
│   ├── components/           ← HTML-компоненты (nav.html, footer.html, ...)
│   └── assets/               ← Картинки, иконки, логотипы
├── index.html
├── about.html
└── ...
```

**project.json — пример:**
```json
{
  "name": "Ветклиника",
  "created": "2026-07-14",
  "status": {
    "style": "done",
    "components": "done",
    "review": "pending",
    "pages": {
      "index": "done",
      "services": "done",
      "doctors": "todo",
      "contact": "todo"
    }
  },
  "pages": ["index", "services", "doctors", "contact"],
  "components": ["nav", "footer", "doctor-card", "service-card"],
  "brand": {
    "colors": ["#0d9488", "#0f172a", "#fafafa"],
    "fonts": ["Nunito", "Inter"]
  },
  "assets": {
    "images": ["hero.png", "team.jpg"],
    "icons": 12
  },
  "decisions": [
    "Тёплый стиль для молодой аудитории",
    "Rounded corners (friendly)"
  ],
  "rejected": [
    "Dark theme — не для medical",
    "Serif headings — слишком формально"
  ],
  "todo": [
    "Добавить форму записи",
    "Интеграция с CRM"
  ]
}
```

**design-tokens.json — пример:**
```json
{
  "color.primary": "#0d9488",
  "color.secondary": "#6366f1",
  "color.accent": "#f97316",
  "color.bg": "#fafafa",
  "color.surface": "#ffffff",
  "color.text": "#0f172a",
  "color.text-muted": "#64748b",
  "color.border": "#e2e8f0",
  "font.heading": "Nunito",
  "font.heading-weight": "700",
  "font.body": "Inter",
  "font.body-weight": "400",
  "font.body-size": "16",
  "radius.card": "16",
  "radius.button": "6",
  "spacing.section": "96",
  "spacing.card": "24",
  "spacing.gap": "24",
  "shadow.card": "none",
  "shadow.card-hover": "0 4px 6px rgba(0,0,0,0.1)"
}
```

**components.json — пример:**
```json
{
  "components": {
    "nav": {
      "id": "nav-main",
      "type": "nav",
      "file": "shared/components/nav.html",
      "variant": "sticky-backdrop",
      "version": 1,
      "slots": ["logo", "links", "cta"],
      "used_by": ["index", "services", "doctors", "contact"],
      "props": {
        "sticky": true,
        "backdrop-blur": true,
        "active-page": "services"
      }
    },
    "hero": {
      "id": "hero-main",
      "type": "hero",
      "file": "shared/components/hero.html",
      "variant": "centered-cta",
      "version": 1,
      "slots": ["eyebrow", "title", "subtitle", "buttons"],
      "used_by": ["index"]
    },
    "button": {
      "id": "button-primary",
      "type": "button",
      "file": "shared/components/button.html",
      "variant": "primary",
      "version": 1,
      "slots": ["label"],
      "used_by": ["hero", "cta", "pricing-card"]
    },
    "card": {
      "id": "card-service",
      "type": "card",
      "file": "shared/components/card.html",
      "variant": "border-hover",
      "version": 1,
      "slots": ["icon", "title", "description"],
      "used_by": ["services"]
    },
    "footer": {
      "id": "footer-main",
      "type": "footer",
      "file": "shared/components/footer.html",
      "variant": "minimal",
      "version": 1,
      "slots": ["links", "social", "copyright"],
      "used_by": ["index", "services", "doctors", "contact"]
    }
  }
}
```

**pages.json — пример:**
```json
{
  "pages": {
    "index": {
      "title": "Главная",
      "url": "/",
      "sections": ["hero", "services-preview", "stats", "cta"],
      "components": ["nav", "footer"]
    },
    "services": {
      "title": "Услуги",
      "url": "/services",
      "sections": ["page-header", "services-grid"],
      "components": ["nav", "footer", "service-card"]
    },
    "doctors": {
      "title": "Наши врачи",
      "url": "/doctors",
      "sections": ["page-header", "doctors-grid"],
      "components": ["nav", "footer", "doctor-card"]
    }
  }
}
```

**Зачем это нужно:**
- `project.json` — память проекта (можно сказать "добавь страницу" без пересборки)
- `design-tokens.json` — programmatic use (HTML/CSS/React все используют одни данные)
- `components.json` — реестр (не копии, а именно компоненты)
- `pages.json` — карта сайта (структура для генерации)
- `style.generated.md` — человекочитаемый (для ui-coder'а)

### A2. Архитектурные принципы

Четыре столпа Make UI 2.0:

```
1. Project Model    — единое состояние проекта
2. Component-first  — страницы из компонентов, не HTML с нуля
3. Incremental      — изменения затрагивают минимум
4. Strict Contracts — чёткие Input/Output между агентами
```

#### P1. Single Source of Truth

Каждая сущность хранится только в ОДНОМ месте:

```
design-tokens.json   → все цвета, размеры, радиусы, тени
components.json      → все компоненты (+ версии + зависимости)
pages.json           → структура страниц
project.json         → состояние проекта (+ status + build-state)
style.generated.md   → человекочитаемый Style Guide
```

**Запрещено:** дублировать данные между файлами.
**Пример нарушения:** цвет `#0d9488` записан в design-tokens.json И захардкожен в nav.html.

#### P2. Компоненты не копируются

Все страницы используют один Component Registry:

```
shared/components/nav.html
        ↓
   index.html   about.html   pricing.html   contact.html
```

Изменение `nav.html` **автоматически** применяется на всех страницах.
UI-coder **никогда** не пишет nav заново — только вставляет INLINE из shared/components/.

#### P3. Design Tokens обязательны

UI Agent **никогда** не придумывает:
- цвета
- radius
- spacing
- shadows
- font sizes

**Если токена нет в design-tokens.json** → остановиться → запросить у архитектора → архитектор добавит токен → продолжить.

**Запрещено:** `bg-[#0d9488]` (hardcoded). **Обязательно:** `bg-[var(--color-primary)]` или `bg-teal-600` (из tokens).

#### P4. Incremental First

**Приоритет изменений (сверху вниз):**

```
1. Component    (поменяй кнопку → обнови shared/components/button.html → все страницы)
2. Section      (поменяй hero → обнови hero.html → вставь на нужные страницы)
3. Page         (поменяй index → пересобери только index.html)
4. Whole Project (редизайн → пересобери всё)
```

**НЕ пересобирать страницу**, если можно изменить только компонент.

#### P5. Canonical Components

Любая правка компонента **сначала** обновляет `shared/components/`, **потом** все страницы.

**Запрещено:** исправить баг только в `index.html`, оставив `shared/components/nav.html` со старым багом.
**Почему:** проект начнёт «расползаться» — разные версии одного компонента на разных страницах.

#### P6. Fallback Policy

Если агент не может принять решение:

```
1. Проверь project.json (decisions[], brand{})
   ↓ нет ответа
2. Проверь design-tokens.json
   ↓ нет ответа
3. Проверь style.generated.md
   ↓ нет ответа
4. Спроси пользователя (макс 2 вопроса, потом решай сам)
```

**НЕ наоборот** (сначала спросить, потом искать).

#### P7. UX правило: максимум 2 вопроса

Архитектор задаёт **максимум 2 вопроса**. После этого:
- Принимает решение сам
- Показывает его пользователю
- Начинает работу

**Формат:**
```
Определил задачу:
- Input: описание (ветклиника)
- Fidelity: guided
- Scope: multi-page (5 страниц)
- Стиль: тёплый, дружелюбный (sage green + Nunito)

Начинаю генерацию Style Guide...
```

### A3. Agent Contracts (контракты между агентами)

Каждый агент имеет чётко определённые **Input** и **Output**:

| Агент | Input | Output |
|-------|-------|--------|
| **architect** | user query (текст) | project.json, pages.json (план), task для ui-coder |
| **ui-coder (Style Guide)** | project.json, style-guide.md | style.generated.md, design-tokens.json |
| **ui-coder (Components)** | design-tokens.json, style.generated.md | shared/components/*.html, components.json |
| **ui-coder (Page)** | design-tokens.json, components.json, shared/components/ | pages/*.html |
| **ui-coder (Change)** | components.json, dependency graph | список затронутых файлов, обновлённые компоненты |
| **designer** | screenshots всех страниц | score (1-10), список проблем |
| **consistency-checker** | screenshots всех страниц | отчёт: расхождения между страницами |
| **image-gen** | промпт + стиль | PNG файл в shared/assets/ |

**Правило:** агент не может работать без указанных Input. Если Input отсутствует — запросить у вызывающего агента (architect).

### A4. Change Protocol (вместо отдельного Change Planner агента)

Перед любым изменением ui-coder **обязан**:

```
Шаг 1: ANALYZE (что менять?)
  → Прочитать components.json
  → Определить какие компоненты затронуты
  → Построить dependency chain:
     button → hero, pricing-card → index, pricing

Шаг 2: PLAN (что пересобирать?)
  → Затронутые компоненты: [button.html]
  → Затронутые страницы: [index.html, pricing.html]
  → НЕ затронуты: [about.html, contact.html]

Шаг 3: EXECUTE (минимальный набор)
  → Обновить shared/components/button.html
  → Пересобрать index.html (вставить новый button)
  → Пересобрать pricing.html (вставить новый button)
  → НЕ трогать about.html, contact.html
```

**Dependency graph** встроен в `components.json`:

```json
{
  "components": {
    "button": {
      "file": "shared/components/button.html",
      "variant": "primary",
      "version": 1,
      "used_by": ["hero", "pricing-card", "cta"]
    },
    "hero": {
      "file": "shared/components/hero.html",
      "variant": "split",
      "version": 2,
      "used_by": ["index"]
    },
    "nav": {
      "file": "shared/components/nav.html",
      "variant": "sticky-backdrop",
      "version": 1,
      "used_by": ["index", "about", "services", "contact"]
    }
  }
}
```

**Почему не отдельный файл dependency-graph.json:** dependency — это свойство компонента, а не отдельная сущность. Хранить рядом = Single Source of Truth.

### A5. Build State (встроен в project.json)

**Не отдельный файл**, а секция в `project.json`:

```json
{
  "name": "Ветклиника",
  "status": {
    "style": "done",
    "components": "done",
    "review": "pending",
    "pages": {
      "index": "done",
      "about": "done",
      "services": "building",
      "contact": "todo"
    }
  },
  ...
}
```

**Зачем:**
- Если процесс упал → продолжить с последней готовой страницы
- Не генерировать повторно уже готовые страницы
- Видеть прогресс: 3/5 страниц готово

**Статусы:** `todo`, `building`, `done`, `failed`, `review`

### B. Style Guide — артефакт ДО генерации страниц (из Relume)

```
Запрос → [Анализ Input] → STYLE GUIDE → COMPONENTS → PAGES
                ↑              ↓              ↓
         Цвета, шрифты,   style.generated.md  shared/components/
         spacing, кнопки,  design-tokens.json  nav.html, footer.html,
         borders, shadows  components.json     hero.html, card.html
         images, animations
         icons, forms,
         tables, nav
```

Style Guide сохраняется в `shared/style.generated.md` + `design-tokens.json` и читается **каждой страницей**.

### C. 12 Style Categories (расширено из Webflow Flowkit + экспертный фидбек)

```markdown
# Generated Style Guide

## 1. Colors
- primary: #0d9488
- secondary: #6366f1
- accent: #f97316
- background: #fafafa
- surface: #ffffff
- text: #0f172a
- text-muted: #64748b
- border: #e2e8f0

## 2. Typography
- heading-font: 'Inter'
- heading-weight: 700
- body-font: 'Inter'
- body-weight: 400
- body-size: 16px
- line-height: 1.6

## 3. Buttons
- primary: bg-{accent}, text-white, rounded-md, px-6 py-3
- secondary: border border-{border}, bg-white, rounded-md
- hover: -translate-y-0.5, shadow-md
- cta-shadow: shadow-{accent}/25

## 4. Spacing
- section-padding: py-24
- card-padding: p-6
- card-gap: gap-6
- hero-padding: pt-32 pb-24

## 5. Borders & Radius
- card-radius: rounded-2xl (16px)
- button-radius: rounded-md (6px)
- card-border: border border-{border}
- hover-border: hover:border-{accent}/40

## 6. Shadows & Effects
- card-rest: none (border only)
- card-hover: shadow-md
- floating: shadow-lg
- glow: (dark themes only)

## 7. Images
- treatment: rounded-2xl
- aspect-hero: 16:9
- aspect-card: 4:3
- placeholder: placehold.co with theme colors

## 8. Animations
- entrance: reveal (translateY 24px, 600ms)
- hover: -translate-y-0.5 (200ms)
- stagger: +100ms per item
- scroll: IntersectionObserver

## 9. Icons (НОВОЕ)
- style: outline (Lucide-like)
- stroke-width: 1.5
- size: 24x24 (default), 16x16 (inline)
- color: currentColor (наследуется от текста)
- examples: menu, arrow-right, check, x, star

## 10. Forms (НОВОЕ)
- input: border border-{border}, rounded-md, px-4 py-2.5
- input-focus: ring-2 ring-{primary}, border-{primary}
- label: text-sm font-medium text-{text}
- error: text-red-500 text-sm
- help-text: text-xs text-{text-muted}
- button-submit: (использует Buttons.primary)

## 11. Tables (НОВОЕ)
- header: bg-{surface}, text-{text}, font-semibold, text-left
- row: border-b border-{border}
- row-hover: bg-{surface}/50
- cell: px-4 py-3
- zebra: odd:bg-{surface}/30 (опционально)

## 12. Navigation (НОВОЕ)
- nav-height: h-16 (64px)
- sticky: top-0 z-50
- backdrop: backdrop-blur-md bg-{bg}/80
- border-bottom: border-b border-{border}
- link: text-{text-muted}, hover:text-{text}
- link-active: text-{primary}, font-medium
- mobile-menu: hamburger, slide-in from right
- dropdown: bg-{surface}, shadow-lg, rounded-lg
```

### D. Pipeline для Multi-page (из Relume + Component Registry)

**Основной pipeline (Input = description / brand / nothing):**

```
Шаг 0: PROJECT MODEL
  → Архитектор создаёт project.json (name, brand, decisions)
  → Определяет pages.json (карта сайта)
  → Определяет scope, fidelity, input

Шаг 1: SITEMAP
  → AI определяет список страниц из описания
  → Сохраняет в pages.json
  → Пользователь подтверждает/правит

Шаг 2: STYLE GUIDE
  → AI генерирует 12 категорий
  → Сохраняет в shared/style.generated.md + design-tokens.json
  → Пользователь подтверждает/правит
  → project.json.status.style = "done"

Шаг 3: COMPONENTS
  → AI генерирует shared/components/:
     - nav.html (sticky, backdrop-blur, active page)
     - footer.html (контакты, соцсети, copyright)
     - hero.html (eyebrow + title + subtitle + CTA)
     - card.html (border + hover + icon + title + description)
     - button.html (primary, secondary)
     - ... другие компоненты
  → Сохраняет реестр в components.json (с version + used_by)
  → project.json.status.components = "done"

Шаг 4: PAGES (Incremental First)
  → Для каждой страницы из pages.json:
     → Проверить status.pages[name] != "done" (не пересобирать готовое)
     → ui-coder читает design-tokens.json + components.json
     → Читает shared/components/ (INLINE, не fetch)
     → Генерирует страницу как композицию компонентов
     → project.json.status.pages[name] = "done"

Шаг 5: REVIEW
  → Screenshot каждой страницы
  → Designer проверяет консистентность (Definition of Done)
  → Consistency Checker проверяет tokens
  → Fix если нужно
  → project.json.status.review = "done"

Шаг 6: PROJECT UPDATE
  → Обновить project.json (статусы, новые решения, todo)
```

**Reference pipeline (Input = reference / references[] / frankenstein):**

```
Шаг 0: REFERENCE INTAKE
  → Получить скриншоты/URL/Figma
  → Сохранить в shared/assets/references/

Шаг 0.5: STYLE EXTRACTION (vision-модель qwen-vl-max)
  → Анализирует каждый референс
  → Извлекает НЕ только цвета, но и:
     - Grid (columns, gaps, max-width)
     - Spacing (section padding, card padding)
     - Typography (font family, sizes, weights)
     - Radius (rounded-sm, rounded-lg, rounded-full)
     - Density (compact vs spacious)
     - Mood (playful, serious, corporate, edgy)
     - Shadows (none, subtle, dramatic)
     - Border style (thin, thick, none, gradient)
     - Animation style (subtle, bouncy, none)
  → Формирует design-tokens.json + style.generated.md

Шаг 1+: Дальше по основному pipeline (с Step 3: COMPONENTS)
  → Но компоненты тоже извлекаются из референса:
     "Какие блоки есть на скриншоте?" → список компонентов
```

**Change pipeline (Scope = fix):**

```
Шаг 1: ANALYZE
  → Прочитать components.json
  → Определить затронутые компоненты
  → По used_by[] найти затронутые страницы

Шаг 2: PLAN
  → Список: какие компоненты обновить
  → Список: какие страницы пересобрать
  → Список: что НЕ трогать

Шаг 3: EXECUTE (Incremental First)
  → Обновить shared/components/ (canonical!)
  → Пересобрать только затронутые страницы
  → НЕ трогать незатронутые

Шаг 4: REVIEW
  → Screenshot затронутых страниц
  → Сравнить с остальными (консистентность)
```

**Почему Component Registry важен:**
- Страницы = композиция компонентов (не HTML с нуля)
- `about.html`, `services.html`, `contact.html` используют **один** `nav.html`, `footer.html`, `card.html`
- Не копии, а именно переиспользование
- Изменение `nav.html` = изменение на всех страницах

### E. Conversational UX (баланс)

**Определение параметров:**

```
Архитектор получает запрос:
  1. Парсит ключевые слова → определяет Input/Fidelity/Scope
  2. Если всё ясно → начинает работу, показывая что понял:
     "Задача: вдохновение по 3 референсам, fidelity = inspired-by, 
      scope = multi-page. Генерирую Style Guide..."
  3. Если что-то неясно → задаёт 1-2 вопроса:
     "У тебя есть конкретное видение, или сделать на свой вкус?"
     "Это одна страница или весь сайт?"
  4. Максимум 2 вопроса, потом начинает работу
```

**Парсинг ключевых слов:**

| Слова | → Ось | → Значение |
|-------|-------|-----------|
| "скопируй, точно, 1:1, как есть" | Fidelity | pixel-perfect |
| "вдохновись, в стиле, похоже" | Fidelity | inspired-by |
| "хочу, нужен, сделай, с ..." | Fidelity | guided |
| "удиви, вау, красиво, сам реши" | Fidelity | free |
| "лендинг, страница, одностраничник" | Scope | single-page |
| "сайт, клиника, магазин" | Scope | multi-page |
| "dashboard, приложение, SaaS" | Scope | app |
| "поменяй, исправь, переделай блок" | Scope | fix |
| "вот скриншот, вот сайт" | Input | reference |
| "вот 3 сайта, референсы" | Input | references[] |
| "навбар отсюда, hero отсюда" | Input | frankenstein |
| "переделай, редизайн, устарел" | Input | existing |
| "брендбук, бренд, фирменный стиль" | Input | brand |

---

## Фазы реализации

### Фаза 1: Фундамент (3-осная модель + Project Model + Архитектурные принципы + Style Guide)
**Приоритет:** 🔴 Критический
**Время:** ~90 мин

#### Задачи:
1. **Обновить `architect.md`:**
   - Добавить секцию "3-осная модель"
   - Таблица парсинга ключевых слов
   - Conversational UX: когда спрашивать, когда действовать (макс 2 вопроса)
   - Показывать владельцу определённые параметры
   - Убрать "ШАГ 1: ОПРЕДЕЛИ ТЕМУ" → заменить на определение Input/Fidelity/Scope
   - Добавить: "После определения параметров — создай project.json (имя, страницы, бренд, решения, status)"
   - **НОВОЕ:** Добавить секцию "Архитектурные принципы" (P1-P7)
     - Single Source of Truth
     - Компоненты не копируются
     - Design Tokens обязательны
     - Incremental First
     - Canonical Components
     - Fallback Policy
     - UX правило (макс 2 вопроса)
   - **НОВОЕ:** Добавить секцию "Agent Contracts" (Input/Output для каждого агента)
   - **НОВОЕ:** Добавить "Change Protocol" (Analyze → Plan → Execute)

2. **Обновить `make-ui.md`:**
   - Убрать таблицу автоопределения темы
   - Добавить секцию Style Guide (12 категорий)
   - Добавить секцию Project Model (project.json + design-tokens.json + components.json + pages.json)
   - **НОВОЕ:** Добавить секцию Build State (встроен в project.json.status)
   - Добавить секцию Input-обработка:
     - Input = reference → Style Extraction (vision: Grid, Spacing, Typography, Radius, Density, Mood) + pixel-perfect copy
     - Input = description → style-guide.md + attribute extraction
     - Input = nothing → вау-тема + wow-patterns
   - Добавить multi-page секцию (Project Model → Sitemap → Style Guide → Components → Pages)
   - Добавить `{{style_guide}}`, `{{project_model}}`, `{{contracts}}` переменные
   - **НОВОЕ:** Добавить Definition of Done (не только Designer 7/10, но и 6 пунктов консистентности)

3. **Обновить `ui-coder.md`:**
   - **НОВОЕ:** Добавить "Архитектурные принципы" в начало (обязательно к прочтению)
   - **НОВОЕ:** Добавить "Design Tokens — ЗАКОН" (hardcoded = нарушение)
   - **НОВОЕ:** Добавить "Incremental First" (не пересобирать страницу если можно компонент)
   - **НОВОЕ:** Добавить "Canonical Components" (правка только в shared/, потом все страницы)
   - Добавить "Режим: Style Guide Generation"
     - Как читать style-guide.md (примеры)
     - Как генерировать 12 категорий
     - Как сохранять в shared/style.generated.md + design-tokens.json
   - Добавить "Режим: Project Model Generation"
     - Как создавать project.json (имя, страницы, бренд, решения, **status**)
     - Как создавать pages.json (карта сайта)
     - Как создавать components.json (реестр + **version** + **used_by**)
   - Добавить "Режим: Multi-page"
     - Как читать design-tokens.json + components.json на каждой странице
     - Как читать shared/components/ (INLINE, не fetch)
     - Как проверять status.pages[name] != "done" (Incremental)
     - Структура проекта (project.json + shared/ + pages)
   - Добавить "Режим: Reference Copy"
     - **Style Extraction:** извлекать Grid, Spacing, Typography, Radius, Density, Mood, Shadows, Borders, Animation
     - Pixel-perfect инструкции
     - Что можно менять, что нельзя
   - Добавить "Режим: Inspired-by"
     - Как извлекать настроение из референса
     - Как адаптировать под свой контент
   - Добавить "Режим: Change (точечная правка)"
     - Analyze → Plan → Execute (Incremental First)
     - Запрет: править компонент только в одной странице
   - Обновить антипаттерны:
     - ❌ `bg-[#0d9488]` (hardcoded color)
     - ❌ Правка nav только в index.html (canonical violation)
     - ❌ Пересборка всего проекта при точечной правке

4. **Обновить `make-ui.md` промпт:**
   - Новая секция: "ARCHITECTURAL PRINCIPLES" (P1-P7)
   - Новая секция: "PROJECT MODEL GENERATION" (project.json + status, pages.json, components.json + version + used_by)
   - Новая секция: "STYLE GUIDE GENERATION" (12 категорий + design-tokens.json)
   - Новая секция: "MULTI-PAGE PIPELINE" (Project Model → Sitemap → Style Guide → Components → Pages)
   - Новая секция: "REFERENCE PIPELINE" (Style Extraction → tokens → components → pages)
   - Новая секция: "CHANGE PROTOCOL" (Analyze → Plan → Execute, Incremental First)
   - Новая секция: "REFERENCE MODES" (copy / inspired / guided)
   - Новая секция: "DEFINITION OF DONE" (14 пунктов)

#### Тест-кейс:
- Описание: "Сайт ветеринарной клиники" (Input=description, Fidelity=guided, Scope=multi)
- Ожидаемый результат:
  - Архитектор определяет параметры
  - ui-coder создаёт project.json (name, pages, brand, decisions, **status: {style: todo, ...}**)
  - ui-coder создаёт pages.json (карта сайта)
  - ui-coder создаёт components.json (реестр + **version** + **used_by**)
  - ui-coder генерирует Style Guide (12 категорий: sage green, Nunito, playful)
  - ui-coder сохраняет в shared/style.generated.md + design-tokens.json
  - ui-coder генерирует shared/components/ (nav.html, footer.html, button.html, service-card.html)
  - ui-coder генерирует 3 страницы: index.html, services.html, contact.html
  - Все страницы используют компоненты из shared/components/ (INLINE)
  - **Нет hardcoded цветов** (только через Tailwind-классы из tokens)
  - **project.json.status обновлён** (style: done, components: done, pages: {index: done, ...})
  - Все страницы консистентны

---

### Фаза 2: Multi-page support (обновлено под Project Model)
**Приоритет:** 🔴 Критический
**Время:** ~40 мин

#### Задачи:
1. **Структура multi-page проекта (обновлена):**
   ```
   projects/site/
   ├── project.json              ← Глобальное состояние (имя, бренд, решения, todo)
   ├── design-tokens.json        ← Машиночитаемые токены (цвета, размеры, шрифты)
   ├── components.json           ← Реестр компонентов (nav, footer, hero, card)
   ├── pages.json                ← Карта сайта (каждая страница + секции)
   ├── shared/
   │   ├── style.generated.md    ← Человекочитаемый Style Guide (12 категорий)
   │   ├── components/           ← HTML-компоненты (nav.html, footer.html, ...)
   │   │   ├── nav.html
   │   │   ├── footer.html
   │   │   ├── hero.html
   │   │   ├── card.html
   │   │   └── ...
   │   └── assets/               ← Картинки, иконки, логотипы
   │       ├── hero.png
   │       ├── team.jpg
   │       └── ...
   ├── index.html                ← Главная (композиция компонентов)
   ├── about.html                ← О нас (композиция компонентов)
   ├── services.html             ← Услуги (композиция компонентов)
   └── contact.html              ← Контакт (композиция компонентов)
   ```

2. **Обновить `ui-coder.md`:**
   - Инструкция: "Сначала создай project.json (имя, страницы, бренд, решения)"
   - Инструкция: "Потом создай pages.json (карта сайта)"
   - Инструкция: "Потом создай components.json (реестр компонентов)"
   - Инструкция: "Потом создай shared/style.generated.md + design-tokens.json"
   - Инструкция: "Потом генерируй shared/components/ (nav.html, footer.html, ..."
   - Инструкция: "Потом генерируй страницы по одной (читай design-tokens.json + components.json)"
   - Инструкция: "Вставляй компоненты INLINE (копировать HTML из shared/components/, не fetch)"
   - НЕ использовать `fetch()` для shared/ (CORS при file://)

3. **Обновить `architect.md`:**
   - Протокол определения страниц:
     - Из описания: "сайт клиники" → index, doctors, services, prices, appointment, contact
     - Из существующего сайта: парсить sitemap
     - Спросить владельца: "Какие страницы нужны?" (если неясно)
   - Делегирование: одна страница = один subagent вызов
   - Контроль: screenshot каждой страницы
   - После генерации: обновить project.json (добавить сгенерированные страницы/компоненты)

4. **Shared components (обновлено):**
   - Nav: sticky, backdrop-blur, border-b, активная страница подсвечена
   - Footer: контакты, соцсети, copyright
   - Hero: eyebrow + title + subtitle + CTA buttons
   - Card: border + hover + icon + title + description
   - Все генерируются ОДИН раз, сохраняются в shared/components/
   - Реестр сохраняется в components.json
   - Вставляются в каждый HTML INLINE (копировать, не fetch)

#### Тест-кейс:
- 3-страничный сайт: index + about + contact
- Проверить:
  - project.json создан (name, pages, brand, decisions)
  - design-tokens.json создан (цвета, шрифты, размеры)
  - components.json создан (реестр: nav, footer, hero, card)
  - pages.json создан (карта сайта)
  - shared/style.generated.md создан (12 категорий)
  - shared/components/ создан (nav.html, footer.html, hero.html, card.html)
  - nav одинаковый на всех страницах (INLINE, не fetch)
  - footer одинаковый
  - цвета идентичные (из design-tokens.json)
  - Все страницы открываются (file://)

#### Тест-кейс:
- 3-страничный сайт: index + about + contact
- Проверить:
  - nav одинаковый на всех страницах
  - footer одинаковый
  - цвета идентичные (из style.generated.md)
  - Все страницы открываются (file://)

---

### Фаза 3: Input-типы
**Приоритет:** 🟡 Высокий
**Время:** ~60 мин (по 15 мин на тип)

#### 3A: Reference Copy (pixel-perfect)

**Обновить `ui-coder.md`:**
- Режим: "Pixel-perfect copy"
- Инструкция: "Копируй ТОЧНО. Не меняй цвета, шрифты, layout."
- Допустимые изменения: только текст (перевод, адаптация)
- Извлечение стиля: vision-модель анализирует скриншот → 8 категорий
- Сохранение в style.generated.md

**Тест-кейс:** скриншот Stripe hero → точная копия с другим текстом

#### 3B: Inspired-by (multiple references)

**Обновить `ui-coder.md`:**
- Режим: "Inspired-by N references"
- Инструкция: "Анализируй каждый референс, найди ОБЩИЕ атрибуты"
- НЕ копировать ни один 1:1, взять настроение
- Генерация Style Guide из общих атрибутов

**Тест-кейс:** 3 скриншота (Linear + Vercel + Stripe) → свой стиль

#### 3C: Frankenstein (mix references)

**Обновить `ui-coder.md`:**
- Режим: "Frankenstein — микс из референсов"
- Инструкция: "Пользователь указывает какой элемент откуда брать"
- Навбар от Ref1, Hero от Ref2, Features от Ref3
- Каждый элемент адаптируется под общий Style Guide

**Тест-кейс:** "Навбар от Stripe, hero от Linear, карточки от Vercel"

#### 3D: Brand kit

**Обновить `ui-coder.md`:**
- Режим: "Brand kit — цвета и шрифты из брендбука"
- Бренд = ЗАКОН (цвета, шрифты, логотип — не менять)
- Layout, spacing, компоненты — на AI (в рамках tokens.md)
- Генерация Style Guide: цвета из бренда, остальное из tokens

**Тест-кейс:** "Вот цвета: #ff6b35, #004e89. Шрифт: Inter. Сделай лендинг."

---

### Фаза 4: Fidelity levels
**Приоритет:** 🟡 Высокий
**Время:** ~20 мин

#### Задачи:

**Обновить `ui-coder.md`:**
- Секция "Fidelity levels"
- Pixel-perfect: "Копируй ТОЧНО. Только текст можно менять."
- Inspired-by: "Возьми стиль, адаптируй контент."
- Guided: "Следуй описанию, детали на тебе."
- Free: "Полная свобода. Используй вау-темы + wow-patterns."

**Обновить `architect.md`:**
- Как определить fidelity из запроса (таблица ключевых слов)
- Как передать fidelity в task для ui-coder

**Тест-кейс:** одно описание, 4 fidelity → 4 разных результата

---

### Фаза 5: Conversational UX
**Приоритет:** 🟢 Средний
**Время:** ~20 мин

#### Задачи:

**Обновить `architect.md`:**
- Протокол: "Покажи что понял, потом действуй"
- Формат показа:
  ```
  Определил задачу:
  - Input: описание (сайт клиники)
  - Fidelity: guided (есть направление)
  - Scope: multi-page (~5 страниц)
  
  Предполагаемые страницы: index, doctors, services, prices, contact
  
  Начинаю генерацию Style Guide...
  ```
- Когда спрашивать:
  - Scope неясен: "Это одна страница или весь сайт?"
  - Fidelity неясен: "У тебя есть видение или сделать на свой вкус?"
  - Максимум 1-2 вопроса, потом работать

**Обновить `make-ui.md`:**
- Добавить `{{input_type}}`, `{{fidelity}}`, `{{scope}}` переменные
- Убрать `{{theme}}` (Style Guide заменяет тему)

**Тест-кейс:** 
- Запрос: "сделай сайт" → архитектор спрашивает scope
- Запрос: "сделай лендинг AI-стартапа" → архитектор определяет всё, начинает
- Запрос: "удиви" → архитектор определяет free + вау-темы

---

### Фаза 6: Редизайн и точечные правки
**Приоритет:** 🟢 Средний
**Время:** ~20 мин

#### 6A: Редизайн (Input = existing site)

**Обновить `architect.md`:**
- Протокол: "Сначала скриншот + дизайнер-анализ"
- Дизайнер: "Что сломано? Что сохранить?"
- UI-coder: "Пересобери с нуля по tokens.md, сохрани контент"
- НЕ "сохрани структуру" — пересобрать layout

**Тест-кейс:** maksplit.ru → современный редизайн

#### 6B: Точечная правка (Scope = fix)

**Обновить `architect.md`:**
- Протокол: "Не трогай остальное, только указанный блок"
- Прочитать текущий HTML
- Изменить только запрошенный блок
- Screenshot ДО и ПОСЛЕ

**Тест-кейс:** "Поменяй hero на NeuralEye, остальное норм"

---

### Фаза 7: Post-generation review (из Framer)
**Приоритет:** 🟢 Средний
**Время:** ~15 мин

#### Задачи:

**Создать `agents/consistency-checker.md`:**
- Модель: vision (qwen-vl-max)
- Инструменты: read, screenshot
- Задача: скриншоты всех страниц → проверка консистентности
- Проверяет:
  - Одинаковые цвета?
  - Одинаковые шрифты?
  - Одинаковые отступы?
  - Одинаковый стиль кнопок?
  - Нет ли contrast issues?
- Отчёт: "Страница X использует цвет Y вместо Z"

**Обновить `architect.md`:**
- После генерации multi-page → запустить consistency-checker
- Если нашёл проблемы → ui-coder фиксит

**Тест-кейс:** 3-страничный сайт, намеренно разный стиль → checker находит

---

### Фаза 8: End-to-end тесты
**Приоритет:** 🔴 Критический
**Время:** ~60 мин

#### Тесты:

**Тест 1: Description → Multi-page (guided)**
```
Запрос: "Сайт ветеринарной клиники, дружелюбный, для молодых владельцев"
Ожидание:
  - Архитектор определяет: Input=description, Fidelity=guided, Scope=multi
  - ui-coder генерирует Style Guide (sage green, Nunito, playful)
  - Генерирует 3 страницы: index, services, contact
  - Все страницы консистентны
  - Designer ставит ≥ 7/10
```

**Тест 2: Reference → Single-page (pixel-perfect)**
```
Запрос: "Скопируй hero Stripe 1:1, но текст наш"
Ожидание:
  - Архитектор определяет: Input=reference, Fidelity=pixel-perfect, Scope=single
  - ui-coder извлекает стиль Stripe из скриншота
  - Генерирует hero с mesh gradient, glass cards, gradient text
  - Текст заменён на "наш"
  - Визуально идентичен Stripe
```

**Тест 3: Nothing → Single-page (free/wow)**
```
Запрос: "Удиви. AI-стартап."
Ожидание:
  - Архитектор определяет: Input=nothing, Fidelity=free, Scope=single
  - ui-coder выбирает aurora-тему + wow-patterns (spotlight, stagger)
  - Генерирует вау-лендинг
  - Designer ставит ≥ 8/10
```

**Тест 4: Brand kit → Multi-page (guided)**
```
Запрос: "Вот цвета: #ff6b35, #004e89. Шрифт: Inter. Сделай лендинг кофейни."
Ожидание:
  - Архитектор определяет: Input=brand, Fidelity=guided, Scope=single
  - ui-coder использует ТОЛЬКО указанные цвета и шрифт
  - Layout/spacing из tokens.md
  - Результат выглядит как брендовый сайт
```

**Тест 5: Existing → Multi-page (redesign)**
```
Запрос: "Редизайн maksplit.ru"
Ожидание:
  - Архитектор: скриншот → дизайнер-анализ
  - Дизайнер: что сломано, рекомендации
  - ui-coder: новый Style Guide, те же страницы
  - Контент сохранён, дизайн улучшен
  - Designer ставит ≥ 7/10
```

---

## Сводка файлов для обновления

| Файл | Фаза | Что изменить |
|------|------|-------------|
| `agents/architect.md` | 1, 2, 5, 6, 7 | 3-осная модель, Project Model генерация, conversational UX, multi-page протокол, редизайн, consistency-check |
| `agents/ui-coder.md` | 1, 2, 3, 4 | Style Guide gen (12 категорий), Project Model gen, Component Registry, multi-page, input-типы, fidelity levels |
| `prompts/make-ui.md` | 1, 5 | Убрать "выбор темы", добавить Style Guide (12 категорий), Project Model, input/fidelity/scope переменные |
| `agents/consistency-checker.md` | 7 | НОВЫЙ файл: vision-агент для проверки консистентности |
| `memory/DECISIONS.md` | — | Обновить по ходу (новые решения) |
| `memory/STATUS.md` | — | Обновить после каждой фазы |
| `AGENTS.md` (project) | — | Обновить summaries после завершения |

---

## Порядок выполнения

```
Фаза 1 (Фундамент + Project Model)          ← НАЧАТЬ ОТСЮДА
  ↓
Фаза 2 (Multi-page + Components)            ← без неё multi не работает
  ↓
Фаза 3A (Reference Copy)                    ← самый востребованный input
  ↓
Фаза 4 (Fidelity)                           ← быстрая, нужна для 3A
  ↓
Фаза 5 (Conversational UX)                  ← чтобы архитектор спрашивал
  ↓
Фаза 8: Тест 1 (Description → Multi)        ← ПЕРВЫЙ e2e тест
  ↓
Фаза 3B (Inspired-by)       
  ↓
Фаза 3C (Frankenstein)      
  ↓
Фаза 3D (Brand kit)         
  ↓
Фаза 6 (Редизайн + Fix)     
  ↓
Фаза 7 (Consistency checker)
  ↓
Фаза 8: Тесты 2-5                           ← все остальные e2e тесты
```

**Общее время:** ~6-7 часов (с тестами, +2 часа на Project Model + архитектурные принципы + contracts)

---

## Зависимости от внешних систем

| Компонент | Нужен для | Статус |
|-----------|-----------|--------|
| clipproxy | Все агенты | ✅ Работает |
| DashScope | Fallback + image-gen | ✅ Работает |
| qwen-vl-max | Reference copy, designer, consistency-checker | ✅ Работает |
| deepseek-v4-pro | architect, ui-coder | ✅ Работает |
| Playwright | Screenshots | ⚠️ Нужно проверить |
| gen_image.py | Генерация картинок | ✅ Работает |

---

## Риски

| Риск | Влияние | Митигация |
|------|---------|-----------|
| ui-coder "забывает" читать style.generated.md | Стили плывут между страницами | Жёсткая инструкция в ui-coder.md: "ПЕРЕД каждой страницей прочитай style.generated.md" |
| Модель не может извлечь стиль из скриншота | Reference copy не работает | Fallback: "опиши стиль текстом, я применю" |
| CORS при file:// для shared/ | Nav/footer не грузятся | Вставлять INLINE, не через fetch |
| Слишком много переменных в make-ui.md | Модель путается | Разбить на секции по режимам |
| Consistency-checker ложные срабатывания | Лишние итерации | Threshold: фиксить только если разница очевидна |
| ui-coder хардкодит цвета | Нарушение Design Tokens | Антипаттерн: hardcoded hex = нарушение. Только Tailwind-классы из tokens |
| ui-coder правит компонент только в одной странице | Проект "расползается" | Canonical Components: правка только в shared/components/, потом все страницы |
| project.json.status не обновляется | Нельзя продолжить после ошибки | Жёсткая инструкция: после каждого шага обновлять status |
| components.json.used_by не актуален | Change Protocol не работает | Обновлять used_by при добавлении компонента на страницу |
| Incremental First игнорируется | Полная пересборка при точечной правке | Приоритет: Component → Section → Page → Project |

---

## Критерии готовности (Definition of Done)

### Функциональные

- [ ] Все 8 сценариев работают end-to-end
- [ ] Multi-page (3+ страницы) консистентны
- [ ] Reference copy визуально идентичен оригиналу (≥ 8/10)
- [ ] "Удиви" генерирует вау-уровень (≥ 8/10)
- [ ] Архитектор спрашивает максимум 1-2 вопроса
- [ ] Style Guide генерируется за < 30 сек
- [ ] Каждая страница генерируется за < 2 мин
- [ ] Designer ставит ≥ 7/10 на первом проходе

### Артефакты

- [ ] project.json, design-tokens.json, components.json, pages.json создаются автоматически
- [ ] project.json.status обновляется после каждого шага (todo → building → done)
- [ ] components.json содержит version + used_by для каждого компонента
- [ ] shared/components/ содержит переиспользуемые HTML-компоненты

### Консистентность

- [ ] Все страницы используют одинаковые Design Tokens (из design-tokens.json)
- [ ] Нет компонентов вне Registry (все в shared/components/)
- [ ] Нет hardcoded цветов (только через CSS-переменные или Tailwind-классы из tokens)
- [ ] Нет дублирования компонентов (один nav.html для всех страниц)
- [ ] Все страницы проходят Consistency Checker
- [ ] Нет расхождений между project.json и pages.json

### Incremental

- [ ] Точечная правка (Scope=fix) не пересобирает весь проект
- [ ] Изменение компонента → обновление shared/components/ → все зависящие страницы
- [ ] Нельзя исправить компонент только в одной странице (Canonical Components rule)

---

## Экспертная оценка (2026-07-14)

### Что эксперт оценил высоко (оставляем)

1. **3-осная модель (Input × Fidelity × Scope)** — 10/10
   - "Пространство состояний, а не if/else"
   - Легко расширяется (добавить Input: Sketch/PDF/MCP без переписывания)

2. **Style Guide ДО генерации** — 10/10
   - "Самое правильное решение во всём документе"
   - Именно так работают Relume, Framer, Webflow

3. **Multi-page через shared** — 10/10
   - shared/style.generated.md + shared/components/ — отличное решение

4. **Consistency Checker** — 9.5/10
   - "Отдельный агент — отличная идея"
   - Не заставлять UI Agent оценивать самого себя

### Что эксперт предложил добавить (ПРИНЯТО)

1. **Project Model (project.json)** — ядро системы
   - **Проблема:** Нет памяти проекта. Нельзя сказать "добавь страницу" без пересборки
   - **Решение:** project.json хранит бренд, решения, структуру, todo, rejected
   - **Статус:** ✅ Добавлено в план (секция A, структура проекта)

2. **Design Tokens в JSON** — машиночитаемые токены
   - **Проблема:** markdown для людей, но программам нужен JSON
   - **Решение:** design-tokens.json (color.primary, radius.card, spacing.section)
   - **Статус:** ✅ Добавлено в план (секция A, структура проекта)

3. **Component Registry** — реестр компонентов
   - **Проблема:** Страницы копируют nav/footer, а не переиспользуют
   - **Решение:** components.json + shared/components/*.html
   - **Статус:** ✅ Добавлено в план (секция D, pipeline)

4. **pages.json** — карта сайта
   - **Проблема:** Нет явной структуры страниц
   - **Решение:** pages.json (каждая страница + её секции + компоненты)
   - **Статус:** ✅ Добавлено в план (секция A, структура проекта)

5. **Style Guide: 8 → 12 категорий** (упрощено с 25)
   - **Проблема:** 8 категорий хватит для лендинга, но не для больших сайтов
   - **Компромисс:** Добавил 4 критичных: Icons, Forms, Tables, Navigation
   - **Остальные (Illustration, Photography, Tone):** добавлю когда понадобится
   - **Статус:** ✅ Добавлено в план (секция C)

### Раунд 2: Углубление архитектуры (2026-07-14)

#### ✅ Принято (12 пунктов)

1. **Архитектурные принципы (P1-P7)** — Single Source of Truth, Компоненты не копируются, Design Tokens обязательны, Incremental First, Canonical Components, Fallback Policy, UX макс 2 вопроса
   - **Статус:** ✅ Добавлено в секцию A2

2. **project.json + status (Build State)** — встроен в project.json, не отдельный файл
   - Статусы: todo, building, done, failed, review
   - Позволяет продолжить генерацию после ошибки
   - **Статус:** ✅ Добавлено (секция A5)

3. **dependency graph встроен в components.json** (поле `used_by`)
   - Не отдельный dependency-graph.json (Single Source of Truth)
   - `"button": {"used_by": ["hero", "pricing-card"]}` — сразу видно что затронет изменение
   - **Статус:** ✅ Добавлено (секция A4, components.json)

4. **Change Protocol** (вместо отдельного Change Planner агента)
   - Analyze → Plan → Execute (3 шага внутри ui-coder)
   - Определяет затронутые компоненты и страницы ДО начала работы
   - **Статус:** ✅ Добавлено (секция A4)

5. **Component Version** — поле `version` в components.json
   - `{"hero": {"version": 2, "variant": "split"}}`
   - **Статус:** ✅ Добавлено (components.json)

6. **Incremental First** — приоритет изменений: Component → Section → Page → Project
   - Не пересобирать страницу если можно изменить компонент
   - **Статус:** ✅ Добавлено (принцип P4)

7. **Усиленный Reference Pipeline** — Style Extraction как отдельный этап
   - Извлекать не только цвета, но и: Grid, Spacing, Typography, Radius, Density, Mood, Shadows, Borders, Animation
   - **Статус:** ✅ Добавлено (секция D, Reference pipeline)

8. **Fallback Policy** — чёткая цепочка: project.json → design-tokens → style-guide → спросить
   - **Статус:** ✅ Добавлено (принцип P6)

9. **Canonical Components** — правка сначала в shared/components/, потом все страницы
   - Запрет: исправлять компонент только в одной странице
   - **Статус:** ✅ Добавлено (принцип P5)

10. **Agent Contracts** — чёткие Input/Output для каждого агента
    - Таблица: агент | input | output
    - **Статус:** ✅ Добавлено (секция A3)

11. **Definition of Done расширен** — 14 пунктов вместо 8
    - +Консистентность токенов, +Нет компонентов вне Registry, +Нет hardcoded, +Нет дублирования, +Consistency Checker, +project.json ↔ pages.json
    - **Статус:** ✅ Добавлено (секция Критерии готовности)

12. **UX правило (макс 2 вопроса)** — усилено как принцип P7
    - После 2 вопросов архитектор принимает решение сам
    - **Статус:** ✅ Добавлено (принцип P7, уже было в D-034)

#### ❌ Отклонено / отложено (2 пункта)

1. **build-state.json (отдельный файл)** — объединено с project.json.status
   - Дублирование данных = нарушение Single Source of Truth
   - **Статус:** ❌ Отклонено (объединено в A5)

2. **Version History (history/ или project-history.json)** — отложено
   - Полезно, но сейчас нет механизма итеративной работы
   - **Когда:** После первых реальных проектов, когда ui-coder начнёт работать итеративно
   - **Статус:** ⏳ Отложено

#### Отклонено ранее (Раунд 1)

1. **Style Guide: 25 категорий** — Overkill. 12 достаточно.
2. **Architect → 4 агента** — Over-engineering. 7 hops = 2-3 мин latency.
3. **Reference Analyzer (отдельный агент)** — Отложено до Фазы 3A.
4. **Intent Parser (отдельный агент)** — Отложено.
5. **Asset Pipeline (отдельный агент)** — image-gen достаточно.

### Итоговая оценка

- **Концепция:** 10/10
- **Архитектура:** 9.5/10 → **10/10** (после 4 принципов + contracts)
- **Масштабируемость:** 9.5/10 (после Project Model)
- **Промышленное качество:** 9/10 (после Incremental First + Canonical + Fallback + DoD)
- **Готовность к Framer/Lovable:** 9/10 → **9.5/10**

### Сводка всех изменений

| Изменение | Раунд | Секция | Статус |
|-----------|-------|--------|--------|
| Project Model (project.json) | 1 | A | ✅ |
| Design Tokens (design-tokens.json) | 1 | A | ✅ |
| Component Registry (components.json) | 1 | A, D | ✅ |
| pages.json (карта сайта) | 1 | A | ✅ |
| Style Guide: 8 → 12 категорий | 1 | C | ✅ |
| Pipeline: Component Registry | 1 | D | ✅ |
| Структура проекта | 1 | Фаза 2 | ✅ |
| Архитектурные принципы (P1-P7) | 2 | A2 | ✅ |
| Agent Contracts (Input/Output) | 2 | A3 | ✅ |
| Change Protocol (Analyze→Plan→Execute) | 2 | A4 | ✅ |
| Build State (в project.json.status) | 2 | A5 | ✅ |
| Component Version + used_by | 2 | components.json | ✅ |
| Incremental First | 2 | P4 | ✅ |
| Canonical Components | 2 | P5 | ✅ |
| Fallback Policy | 2 | P6 | ✅ |
| Усиленный Reference Pipeline (Style Extraction) | 2 | D | ✅ |
| Definition of Done расширен (14 пунктов) | 2 | Критерии | ✅ |
| UX правило (макс 2 вопроса) | 2 | P7 | ✅ |
| build-state.json (отдельный файл) | 2 | — | ❌ Объединено |
| Version History | 2 | — | ⏳ Отложено |
| 25 категорий Style Guide | 1 | — | ❌ Overkill |
| Architect → 4 агента | 1 | — | ❌ Over-engineering |
| Reference Analyzer (отдельный агент) | 1 | — | ⏳ Отложено |
| Intent Parser (отдельный агент) | 1 | — | ⏳ Отложено |
| Asset Pipeline (отдельный агент) | 1 | — | ❌ Не нужно |
