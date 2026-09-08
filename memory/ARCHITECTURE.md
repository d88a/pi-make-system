# ARCHITECTURE.md — Архитектура Pi Make System

> **SSOT:** подробная архитектура в `D:/pi/AGENTS.md` секция «🆕 Make UI 2.0» + `memory/PLAN.md` + `memory/DECISIONS.md`. Этот файл — краткая карта.

## Обзор
Pi Make System — генерация UI/сайтов через Pi + AI-агентов. Make UI 2.0: 3-осная модель (Input × Fidelity × Scope), multi-page, Style Guide first, verify loop.

**3 pipeline:** (1) HTML+Tailwind CDN — прототип/лендинг; (2) кастомная WP-тема (PHP+Tailwind build); (3) **Elementor JSON** (section+column) — заказчик правит через визуальный редактор.

## Структура
```
~/.pi/agent/                      ← глобальный харнес
├── agents/ (17 .md)              ← architect, ui-coder, designer, ...
├── config/design-system/
│   ├── tokens.md                 ← базовые токены + theme exceptions (L-8/L-9/L-10)
│   ├── themes/ (9 тем)           ← modern-clean, warm-minimal, bold-tech, ...
│   ├── style-guide.md            ← примеры реальных сайтов
│   └── wow-patterns.md           ← 10 CSS-приёмов
├── prompts/make-ui.md            ← главный UI-промпт (11 переменных)
├── scripts/extract-reference.js  ← CSS+DOM extraction (D-064/D-077)
├── extensions/subagent/          ← оркестрация + fallback + health check
└── memory/ (global)              ← ROLES.md, ARCHITECTURE.md, ...

D:/pi/                            ← проект
├── AGENTS.md                     ← проектные инструкции + summaries
├── memory/                       ← STATUS, DECISIONS, FROZEN, ISSUES, PLAN, AUDIT
└── projects/<name>/              ← сгенерированные сайты
    ├── index.html, *.html
    ├── project.json              ← Project Model (SSOT состояния)
    ├── design-tokens.json        ← JSON-токены
    ├── components.json           ← Component Registry (+ version, used_by)
    └── pages.json                ← sitemap
```

## Pipeline (Make UI 2.0)
```
Запрос → architect определяет 3 оси (Input/Fidelity/Scope)
       → Style Guide (12 категорий) из reference/description/brand
       → Components (shared/) → Pages (index, about, ...)
       → screenshot → designer review (grep-верификация D-053)
       → ui-coder fix → Consistency Checker → DoD (14 пунктов)
```

## Ключевые принципы
- **P1** Single Source of Truth — каждая сущность в одном месте
- **P3** Design Tokens Mandatory — нет hardcoded hex
- **P4** Incremental First — Component → Section → Page → Project
- **P5** Canonical Components — правка в shared/ → propagate
- **D-053** Дизайнер галлюцинирует — grep-верификация ВСЕГДА
- **D-064** Pixel-Perfect Pipeline — extract-reference.js точнее vision

## Режимы работы
См. `~/.pi/agent/AGENTS.md` (🔬 Штурм / ⚡ Quick / 👁️ Эксперт).

## Заметки
- Pixel-perfect через extract-reference.js (НЕ vision-анализ скриншота) — D-064
- Fidelity levels: pixel-perfect / inspired-by / guided / free — ui-coder.md
- Conversational UX: 3 оси → показ → макс 1-2 вопроса — architect.md (D-034)
