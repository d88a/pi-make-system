# Бриф для эксперта — Pi Make System

> **Дата:** 2026-09-08 (обновлено)
> **Цель:** Получить внешний взгляд на архитектуру, слабые места и направления развития

---

## 1. Что такое Pi Make System

**Pi Make System** — система генерации UI/сайтов через AI-агентов (оркестратор Pi). Аналог v0.dev / Figma Make / Lovable, но локальный, кастомизируемый, с верификацией.

### Как работает (упрощённо)
```
Владелец описывает сайт → Архитектор (AI) определяет стиль/структуру
→ UI-Coder (AI) генерирует HTML+Tailwind
→ Скриншот → Дизайнер (AI) ревью → Кодер фиксит
→ Готовый результат в одном из 3 форматов
```

### 3 pipeline генерации

| Pipeline | Что на выходе | Когда использовать | Пример |
|----------|--------------|-------------------|--------|
| **1. HTML+Tailwind CDN** | Статический HTML | Прототип, лендинг без CMS | ЛапЛап, CyberSpace |
| **2. Кастомная WP-тема** | PHP+Tailwind build, WP hooks | Полный контроль, SEO, e-commerce | СтройМакс (maksplit.ru) |
| **3. Elementor JSON** | JSON секции для импорта в WP+Elementor | Заказчик сам правит через визуальный редактор | Барышня-крестьянка (usadba) |

### Технический стек
- **Оркестратор:** Pi (TypeScript, локально на Windows, bun runtime)
- **Модели:** 96 моделей через 4 провайдера (DashScope, clipproxy 90+, TokenRouter, NVIDIA)
- **Агенты:** 19 специализированных (архитектор, ui-coder, дизайнер, code-auditor, researcher, wp-coder, wp-integration и др.)
- **Верификация:** Playwright скриншоты + a11y-check.js (WCAG AA) + grep-аудит

### Что уже сделано (реальные проекты)

| Проект | Pipeline | Статус | Описание |
|--------|----------|--------|----------|
| **СтройМакс** (maksplit.ru) | Кастомная WP-тема | ✅ **Задеплоен на live, заморожен** | 7 страниц + 22 товара + блог 12 статей, WooCommerce Catalog Mode, CF7 формы, SEO, postfix почта |
| **Барышня-крестьянка** (usadba) | Elementor JSON | 🔄 6/9 блоков готовы | Усадьба, лендинг возрождения. HTML одобрен, Elementor JSON шаблоны, skill elementor-builder создан |
| **Портфолио DevUp** (dev-up.ru) | Next.js (не Pi Make) | ✅ Задеплоен, 38 страниц | Портфолио разработчика, Cloudflare обход РКН |
| SitAndEat.ru | HTML pixel-perfect | ✅ 80% совпадение | Копия ресторана, тест pixel-perfect pipeline |
| ЛапЛап / CyberSpace / NeuralEye | HTML | ✅ Тесты pipeline | Multi-page, вау-паттерны |
| Полярная сова | HTML | ⚠️ Частично | Smoke-test новых скиллов |

---

## 2. Архитектура

### 2.1 Make UI 2.0 (ядро системы)
```
Input (7 типов) × Fidelity (4 уровня) × Scope (4 типа)
  ↓
Dashboard (9 осей) → Style Guide (12 категорий) → Corpus patterns
  ↓
Components → Pages → Verify Loop → Готово
```

### 2.2 Design System (глобальная)
- **tokens.md** — базовые правила (spacing, typography, radius, shadows, layout, WCAG AA)
- **16 тем** — 7 light + 5 dark + 4 special (bento, mesh-gradient, aurora, luxury)
- **Corpus patterns** — layout-patterns, palette-patterns, mood-axis, composition-primitives (из 88 реальных сайтов)
- **wow-patterns.md** — 10 CSS-приёмов (stagger, shimmer, spotlight, marquee...)
- **few-shot.md** — 6 пар ❌/✅ (AI-slop vs хороший дизайн)
- **dashboard.html** — визуальный выбор 9 осей (тема × ниша × акцент × фон × mood × radius × шрифты × layout × card variant)
- **a11y-check.js** — WCAG AA аудит (contrast, landmarks, alt, keyboard, ARIA)

### 2.3 Корпус (corpus)
- **5609 сайтов** из 6 галерей веб-дизайна
- **88 сайтов** с полным CSS-extraction (Playwright getComputedStyle)
- **4 patterns/*.md** — кластеризованные паттерны (layout, palette, mood, composition)
- **110 сайтов** отобраны по 9 нишам (architecture-realestate 20 сайтов — для СтройМакс)
- Цель: Pi НЕ придумывает дизайн — извлекает из реальных сайтов

### 2.4 WordPress Pipeline (Pipeline 2: кастомная тема)
```
HTML-прототип → wp-integration skill (9 этапов):
  1. Анализ прототипа
  1.5. Pre-flight БД-аудит (data-analyst)
  1.6. HTML→WP Content Mapping
  2. Каркас темы (functions.php, style.css, header/footer)
  3. Dynamic map (хардкод→WP functions)
  4. Template-parts (hero, features, product-card...)
  5. Tailwind CLI build (НЕ CDN)
  6. WooCommerce overrides (Catalog Mode)
  7. CF7 формы + Customizer
  8. Деплой (scp + SQL активация)
  9. Post-deploy verification (12 чекпоинтов)
```

### 2.5 Elementor Pipeline (Pipeline 3: НОВЫЙ)
```
HTML-прототип → конвертация в Elementor JSON:
  1. HTML секции → section+column JSON
  2. CSS → нативные настройки (typography_*, text_color, background_color)
  3. Декоративный CSS → Custom CSS (Elementor Pro)
  4. Экспорт: {"content": [...], "title": "...", "type": "section"}
  5. Импорт: Elementor → Templates → Import
  6. Site Settings (глобальные цвета/шрифты — вручную)
```

**Ключевые правила Elementor:**
- Формат: **section+column** (классический, НЕ container/flex — работает в 3.x и 4.x)
- typography_* — **плоские ключи** (typography_font_family, НЕ вложенные объекты)
- `$$type` формат — НЕ работает в Elementor 4.1.3
- Inline-стили работают в section+column (не в container)
- Copy-paste между сайтами НЕ работает (разные версии Elementor)

### 2.6 Verify Loop (обязательный для всех pipeline)
```
UI-Coder → Playwright скриншот → Дизайнер (вкус, ДА — субъективно)
→ Code-auditor (spec compliance, grep, ТОЧНО) → UI-Coder фиксит
→ a11y-check.js (WCAG AA) → Consistency check
```

### 2.7 Принципы
- **P1** Single Source of Truth — каждая сущность в одном месте
- **P3** Design Tokens Mandatory — нет hardcoded hex вне :root
- **P4** Incremental First — Component → Section → Page → Project
- **P5** Canonical Components — правка в shared/ → propagate на все страницы
- **ZERO INVENTION** — кодер не придумывает контент (реальные данные из products.json, БД и т.д.)
- **D-053** — дизайнер ГАЛЛЮЦИНИРУЕТ (vision-модель не может точно читать текст/цвета). Каждая претензия проверяется grep

---

## 3. Реальные проекты (детали)

### 3.1 СтройМакс (maksplit.ru) — ЗАВЕРШЁН ✅

**Pipeline 2:** кастомная WP-тема `stroymaks2026`.

| Параметр | Значение |
|----------|----------|
| PHP файлов | 23 |
| Страниц | 7 + /shop/ + 22 товара + /category/novosti/ (12 статей) |
| CSS | Tailwind build 31KB |
| Сервер | VDS NetAngels, nginx + php8.2-fpm + MariaDB 10.11 |
| SSH | `ssh eis-vds` (SERVER_IP) |
| Тема | Dusty Slate + #32598f + Playfair/Source Serif + round 16px |
| SEO | SEOPress + geo-метатеги + LocalBusiness JSON-LD + schema.org Product |
| Почта | CF7 4724 → me@maksplit.ru → postfix → MX mx0.maksplit.ru:25 → NetAngels пересылка |

**Выстраданные уроки (16 проблем → 16 решений):**
- wp-coder ломает PHP-синтаксис → **php -l ОБЯЗАТЕЛЕН** после каждого вызова
- Мёртвые HTML-формы с localStorage вместо отправки → проверять ВСЕ страницы grep'ом
- Дубли характеристик (3 блока на странице товара) → post_excerpt = 1 место
- Cyrillic slugи в WP = SEO-самоубийство (sitemap декодирует → 404) → всегда Latin
- SMTP порты заблокированы провайдером → postfix + собственный MX
- theme_mods Customizer = serialized array → НЕ переносится через scp

### 3.2 Барышня-крестьянка (usadba) — В ПРОЦЕССЕ 🔄

**Pipeline 3:** Elementor JSON.

| Параметр | Значение |
|----------|----------|
| Тип | Лендинг усадьбы, Тамбовская обл. |
| Финальная цель | WordPress + Elementor Pro на хостинге заказчика |
| Дизайн | Зелёный #2F4A33 + терракота #B0603F + золото #B8963E + ivory #FAF6EC, Playfair Display |
| HTML-прототип | ✅ Одобрен владельцем |
| Elementor блоки | 6/9 готовы (Hero, Heritage, Mission, Economics, Partners, Visit, Contacts) |
| Docker | localhost:8080, Elementor 4.1.3 + Hello Elementor 2.7.1 |

**8 выстраданных проблем (задокументированы):**
1. Несовместимость версий Elementor (Hello + Elementor)
2. Программная запись `_elementor_data` не рендерится (typography плоские ключи)
3. Inline-стили ломают container (но работают в section+column)
4. Copy-paste не работает между сайтами (разные версии)
5. Импорт шаблона «Invalid Content In File» (формат `{content:[]}`)
6. Шаблон импортируется но пустой (`$$type` не работает в 4.1.3)
7. Контейнеры (flex/grid) не поддерживаются в 4.1.3
8. Внешний CSS не виден в редакторе

**Skill создан:** `~/.pi/agent/skills/elementor-builder/` (SKILL.md + rules.md + 10 шаблонов + decorative CSS)

### 3.3 Портфолио DevUp — ЗАВЕРШЁН ✅

Next.js 16.2.10, 38 страниц, задеплоен на dev-up.ru. Cloudflare обходит РКН. Модульная ценовая модель (WP 6k+2k+5k, Next.js 8k+3k+7k). Не через Pi Make, но показывает уровень владелицы.

---

## 4. Слабые места и трудности

### 🔴 Критичные

#### 4.1 Clipproxy ПОЧИНЕН, но хрупкий
**Было:** clipproxy (CLIPPROXY_HOST) подменял function calling tools на Notion tools → 15 агентов отказывались.
**Сейчас:** clipproxy настроен (96 моделей в enabledModels с префиксом `clipproxy/`), 90 моделей в models.json. Работает для coding (kp/deepseek-v4-pro, kp/qwen3.7-max) и vision (vl/qwen3-vl-plus).
**Риск:** Таймауты на некоторые моделях (grok, gpt-5.5, sonnet). Нет доступа к конфигу прокси для диагностики.
**Резерв:** DashScope (direct API) — 6 моделей, стабильно.

#### 4.2 Дизайнер галлюцинирует (D-053) — НЕ решено системно
**Суть:** Vision-модель (qwen-vl-max) не может точно читать текст/цвета со скриншота. Описывает выдуманные элементы.
**Текущий workaround:** Дизайнер = только вкус (красиво/композиция). Spec compliance = code-auditor (grep/read, точно). Архитектор ОБЯЗАН grep'ить каждую претензию.
**Открытый вопрос:** Vision-модели принципиально не годятся для точного UI-аудита? Или есть альтернатива?

#### 4.3 Subagent spawn — хрупкий Windows workaround
**Суть:** `spawn("pi", {shell:false})` падает ENOENT на Windows (Pi запущен под bun, виртуальный скрипт).
**Workaround:** Extension находит `dist/cli.js` на диске + `process.execPath + cli.js`. Fallback: `pi.cmd` с `shell:true`. + Guard на несуществующий cwd.
**Риск:** Зависит от внутренней структуры npm-пакета Pi. Обновление pi может сломать.

#### 4.4 wp-coder ломает PHP-синтаксис
**Суть:** При многофайловых правках wp-coder оставляет висячие `endif;`, пропущенные `?>`, мусор. Сайт падает с HTTP 500.
**Workaround:** `php -l` ОБЯЗАТЕЛЕН после каждого вызова wp-coder. Архитектор = верификатор последней инстанции.
**Открытый вопрос:** Как сделать wp-coder надёжным для PHP? Или PHP генерация AI принципиально ненадёжна?

### 🟡 Средние

#### 4.5 Нет итеративной работы с владельцем
Pipeline: запрос → генерация → verify → готово. Нет цикла «владелец видит → правит → Pi применяет». Владелец описывает правки текстом, Pi перегенерирует. Нет visual editor / live preview (кроме dashboard.html для выбора стиля).
**Elementor частично решает это** — заказчик может править контент в визуальном редакторе без Pi.

#### 4.6 Corpus extraction неполный
88/110 сайтов извлечены (80%). Font detection 55% (TNR fallback). Hero type classifier 73% centered (грубый). Section sequence 45% пустой.
Паттерны из corpus — кластеризация, не ручное курирование. Качество паттернов не верифицировано.

#### 4.7 Tailwind CDN в production
Для standalone HTML используется CDN (`cdn.tailwindcss.com`) — зависимость от внешнего сервиса, медленная загрузка. Для WP-тем — Tailwind CLI build (OK). Для Elementor — не используется.

#### 4.8 Нет регрессионного тестирования
После системных фиксов нет автоматического прогона. Каждая задача — ручной запуск + проверка. Smoke-test bookshop показал что новые скиллы работают частично (Pre-build Critique не выводится, дизайнер галлюцинирует СИЛЬНЕЕ в Deep Critique).

#### 4.9 Elementor pipeline — новый, не обкатан на production
Только Барышня-крестьянка (в процессе). Skill создан, но не тестировался на реальных заказах. 10 шаблонов — generic, не адаптированы под конкретные ниши.
**Вопрос:** Какие подводные камни при массовом использовании? Elementor версии заказчика могут отличаться.

### 🟢 Низкие

#### 4.10 «Какашечный везде» (D-117) — решено
AGENTS.md имел правило автовыбора warm-minimal. Удалено → интеллектуальное предложение + dashboard с 9 осями.

#### 4.11 Nav links на multi-page сайтах (D-138) — паттерн записан
UI-Coder копирует nav буквально (`#section`) → битые на других страницах. Паттерн записан но не автоматизирован.

#### 4.12 Cyrillic slugи = SEO-самоубийство (D-196)
WP с кириллическими slugами → SEOPress sitemap декодирует → 404 → Яндекс не индексирует. Правило: всегда Latin slugи.

---

## 5. Вопросы к эксперту

### Архитектура
1. **3 pipeline** — правильная ли стратегия? HTML / кастомная WP-тема / Elementor JSON. Или лучше унифицировать?
2. **Vision reliability** — qwen-vl-max галлюцинирует. Есть ли альтернатива для точного UI-аудита? Или vision принципиально не подходит?
3. **Subagent architecture** — 19 агентов, orchestration через TypeScript extension. Это overkill или оправдано?
4. **wp-coder + PHP** — AI генерация PHP ненадёжна (висячие endif, пропущенные ?>). Это известная проблема или нужно менять подход?

### Elementor pipeline (НОВЫЙ)
5. **section+column vs container** — мы используем section+column потому что у заказчика Elementor 4.1.3 без flex. Это тупиковый путь? Все переходят на containers?
6. **Версионная совместимость** — Elementor JSON из 4.1.3 может сломаться в 4.5+. Как делать forward-compatible шаблоны?
7. **Масштабирование skill** — 10 шаблонов, 1 проект. Как превратить в production-ready инструмент? Нужна ли библиотека секций (hero/feature/cta/testimonial) как компоненты?
8. **Elementor vs кастомная тема** — когда рекомендовать какой pipeline? Есть ли чёткие критерии выбора?

### Production readiness
9. **Что нужно для production?** Система прошла 116+ задач, 2 проекта на live (СтройМакс + DevUp). Какие тесты/метрики нужны?
10. **Регрессионное тестирование** — как автоматизировать? Прогон smoke-test после каждого системного фикса?
11. **Итеративная работа** — Elementor частично решает (заказчик правит сам). Но для кастомных тем — как сделать цикл без полной перегенерации?

### Масштабирование
12. **Новые заказчики** — как тиражировать систему? Каждый проект = новая память, новые решения. Как переиспользовать corpus + patterns + темы?
13. **WordPress as a service** — Pi Make → HTML → автоконвертация в WP-тему/Elementor → деплой. Насколько реалистично автоматизировать?

---

## 6. Цифры

| Метрика | Значение |
|---------|----------|
| Агентов | 19 |
| Тем | 16 (7 light + 5 dark + 4 special) |
| Моделей доступно | 96 через clipproxy + 6 DashScope + TokenRouter + NVIDIA |
| Сайтов в корпусе | 5609 (88 с полным extraction) |
| Elementor шаблонов | 10 (ai-saas, analytics, app, blog, conference, education, portfolio, pricing, studio, team) |
| Задач выполнено | 116+ (T-001...T-116) |
| Решений принято | 197 (D-001...D-197) |
| Production проектов | 2 (СтройМакс WP + DevUp Next.js) |
| В процессе | 1 (Барышня-крестьянка, Elementor) |
| PHP файлов (СтройМакс тема) | 23 |
| HTML страниц (СтройМакс) | 7 + 22 товара + 12 статей |
| Dashboard осей | 9 (тема × ниша × акцент × фон × mood × radius × шрифты × layout × card) |
| Design tokens | 24 CSS custom properties |

---

## 7. Структура проекта (для навигации)

```
C:/Users/Ваня/.pi/agent/              ← Глобальный харнес Pi
├── agents/ (19 .md файлов)            ← Определения агентов
├── config/design-system/              ← Токены, темы, паттерны
│   ├── tokens.md
│   ├── themes/ (16 тем)
│   ├── layout-patterns.md             ← Corpus: 9 layout скелетов
│   ├── palette-patterns.md            ← Corpus: 8-10 живых палитр
│   ├── mood-axis.md                   ← Corpus: 7 moods
│   ├── composition-primitives.md      ← Corpus: hero/feature/cta/footer
│   ├── wow-patterns.md                ← 10 CSS-приёмов
│   ├── few-shot.md                    ← 6 пар ❌/✅
│   └── dashboard.html                 ← 9-осный визуальный выбор
├── prompts/make-ui.md                 ← Главный UI-промпт
├── scripts/                           ← Системные скрипты
│   ├── extract-reference.js           ← CSS+DOM extraction (pixel-perfect)
│   ├── a11y-check.js                  ← WCAG AA аудит
│   └── image-analyzer.js              ← Анализ фото (IADS)
├── skills/                            ← Навыки
│   ├── elementor-builder/             ← 🆕 Elementor JSON (10 шаблонов)
│   ├── wp-integration/                ← HTML→WP тема (9 этапов)
│   ├── deep-research/
│   └── ...
├── extensions/subagent/               ← Оркестрация
│   ├── index.ts
│   └── agents.ts
└── models.json / settings.json        ← Конфигурация моделей

D:/pi/                                 ← Проект Pi Make System
├── AGENTS.md                          ← Проектные инструкции + summaries
├── memory/                            ← Память проекта
│   ├── STATUS.md (~930 строк)
│   ├── DECISIONS.md (~210 строк, 197 решений)
│   ├── ARCHITECTURE.md
│   ├── ISSUES.md / FROZEN.md
│   ├── EXPERT-BRIEF.md               ← ЭТОТ ФАЙЛ
│   └── research/                      ← Исследования
└── projects/                          ← Сгенерированные сайты
    ├── maksplit/                      ← СтройМакс (HTML прототип)
    ├── sitandeat/
    └── smoke-test-bookshop/

D:/Anna/Сайты/                         ← Реальные проекты
├── maksplit.ru/                       ← СтройМакс (WP тема + бэкапы)
├── usadba/                            ← Барышня-крестьянка (Elementor)
│   ├── elementor-templates/
│   ├── html2elementor/
│   └── memory/
├── portfolio/                         ← DevUp (Next.js)
│   └── memory/
├── school/                            ← Школьный сайт
└── trktvs.info/                       ← Тракторный сайт
```

---

## 8. Timeline проекта

| Дата | Событие |
|------|---------|
| 2026-07-09 | Старт Pi Make System, первые темы и промпты |
| 2026-07-14 | Make UI 2.0 спроектирован (3 оси, Project Model, SSOT) |
| 2026-07-15 | SitAndEat pixel-perfect, D-053 (дизайнер галлюцинирует) |
| 2026-07-18 | Полный аудит (22 проблемы), clipproxy→dashscope (D-098) |
| 2026-07-22 | 7-stage reboot, corpus pipeline (5609 сайтов), skills upgrade |
| 2026-07-24 | Dashboard v2 (6→9 осей), СтройМакс v8 HTML (7 страниц) |
| 2026-07-26 | WP тема stroymaks2026 (23 PHP), Docker локальный запуск, 6 фиксов по жалобам |
| 2026-07-28 | **Деплой СтройМакс на live** (SSH eis-vds, scp + SQL). SMTP postfix+MX |
| 2026-08-02 | Блог (12 статей), SEO Cyrillic fix, CF7+labels+pre-fill, мёртвая форма D-192 |
| 2026-08-20 | **Барышня-крестьянка** старт — HTML-прототип, Elementor pipeline |
| 2026-08-23 | Elementor 6/9 блоков, skill elementor-builder создан |
| 2026-09-02 | **DevUp** портфолио — Next.js 38 страниц, Cloudflare, деплой |
| 2026-09-07 | DevUp: consistency pass (20 фиксов), SEO, ценовая модель |
| 2026-09-08 | Clipproxy настроен (96 моделей), **3 pipeline формализованы**, FROZEN СтройМакс |
