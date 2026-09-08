# Insights — Pi Make System

> Критические инсайты (confidence ≥ 0.7). Не удалять.

## INS-014: Скиллы фрилансера — разбор видео Vibecoder School (2026-07-22)

**Источник:** YouTube `fXxkGaT8uQE` «Главные инструменты фрилансера» (Vibecoder School / Bystricky). Разобрано через субтитры + описание.
**Confidence:** 1.0

**Конвейер автора (от лида до денег):**
1. Поиск: бот-парсер бирж (FL.ru/Kwork/Яндекс/Profit) + AI-фильтр + AIDA-отклик → Telegram
2. Поиск: Авито + Adviz (автопостинг)
3. Поиск: YouTube + портфолио (основной, органические прогретые клиенты)
4. Конверсия: cal.com (виджет созвона)
5. Поиск: Clay + Instantly (Cold Outreach)
6. Конверсия: расшифровка созвона (Teamlogs 8₽/мин → свой faster-whisper = 0₽)
7. Конверсия: скилл КП (Markdown, блоки как LEGO, принцип взаимности, 7-8 из 10)
8. Разработка: Claude Code / Codex / Superpowers / Figma MCP
9. Разработка: Toggl (реальная почасовка — цель, не общий доход)
10. Деплой: Amvera (РФ-аналог Vercel, ПДн в РФ) / свой скилл деплоя
11. Ведение: Notion → Weeek CRM (повторные продажи = 46% заказов)

**Стоимость стека:** ~7000₽/мес (без подписки Claude).

**Главная ошибка новичков:** искать новых клиентов вместо наведения порядка в старых контактах (CRM с первого дня).

**Для нас (Pi Make System уже покрывает):** Claude Code/Codex/Superpowers→Pi агенты; Figma MCP→extract-reference.js; faster-whisper→youtube-reader skill; скилл КП→можно сделать в Pi.

## INS-015: Superpowers (obra/superpowers) поддерживает Pi (2026-07-22)

**Источник:** github.com/obra/superpowers, researcher разбор
**Confidence:** 0.95

- 14 скиллов, MIT, v6.1.1. **Поддерживает Pi** (TypeScript extension superpowers.ts).
- Архитектура: SKILLS (harness-agnostic SKILL.md) + TOOL MAPPING (per-harness references/) + BOOTSTRAP injection.
- Жемчужина: **subagent-driven-development** — свежий сабагент на задачу + двухэтапное ревью (spec compliance + code quality) + progress ledger (защита от compaction).
- Паттерны: **file handoffs** (артефакты через файлы, не в промпт), **bulletproofing** (Red Flags таблицы против рационализации), model selection по сложности.
- `writing-skills` — TDD для скиллов (RED baseline → GREEN скилл → REFACTOR закрыть лазейки).

**Для нас:** subagent-driven-development + file handoffs + progress ledger — прямые улучшения multi-page pipeline.

## INS-016: MCP не привязан к Claude — Pi может быть MCP-клиентом (2026-07-22)

**Источник:** researcher, MCP spec + Figma MCP исходники
**Confidence:** 0.85

- MCP = JSON-RPC 2.0 over stdio/HTTP. Любой клиент может использовать.
- Figma MCP (Framelink, GLips) — упрощает данные макетов: SimplifiedDesign (nodes + globalVars + dedup).
- Playwright MCP (microsoft, 35K★) — accessibility-first (не скриншоты), генерация тестов.
- 21st.dev Magic MCP — генерация UI-компонентов.
- Для Pi нужен MCP Manager модуль: spawn stdio → listTools → конвертация inputSchema (JSON Schema = OpenAI function params) → route tool_calls. Оценка: 2-3 дня базовой интеграции.

## INS-017: anthropics/skills — эталон + frontend-design анти-шаблоны (2026-07-22)

**Источник:** github.com/anthropics/skills (163K★), researcher
**Confidence:** 0.9

- Эталон формата SKILL.md (YAML frontmatter name+description + Markdown). Наш формат совместим.
- `frontend-design` скилл: 3 анти-паттерна AI-дизайна — (1) cream #F4F1EA + terracotta, (2) near-black + acid-green, (3) broadsheet zero-radius. Дизайн-токены (4-6 hex, 2+ type roles, layout, signature). Процесс brainstorm→critique→build→critique.
- `theme-factory` — 10 тем + кастомные (аналог наших themes/).
- `web-artifacts-builder` — React+Vite→HTML бандл (поставка клиентам).
- **Ниша генерации сайтов через AI-скиллы почти пуста** — Pi Make System может быть первой целостной системой.

## INS-018: Каталоги скиллов в интернете (2026-07-22)

**Источник:** researcher, GitHub API
**Confidence:** 0.85

ТОП: anthropics/skills (163K★), awesome-mcp-servers (91K★), awesome-claude-code (50K★), awesome-cursorrules (40K★, 200+ .cursorrules для фреймворков), claude-plugins-official (32K★), frontend-slides (26K★), awesome-claude-skills (14K★), agent-rules (5.7K★), awesome-claude-code-toolkit (2.4K★, 135 агентов + 35 скиллов).

Ценные мелочи: taches-cc-resources (/audit-skill, /heal-skill, thinking models /consider:pareto/first-principles/inversion), awesome-cursorrules (Next.js+Tailwind+TS правила).

## INS-019: Smoke-test новых скиллов — ЧАСТИЧНЫЙ успех (2026-07-22)

**Источник:** make-ui smoke-test на лендинге книжного магазина «Полярная сова» (D:/pi/projects/smoke-test-bookshop/). ui-coder → a11y-check.js → designer (Stage 1+Deep Critique) → code-auditor (Stage 2) → grep-верификация.
**Confidence:** 0.95 (артефакты сохранены)

**✅ РАБОТАЕТ (новые секции применяются):**
- Anti-Slop: 3 клише избегнуты (cream #F4F1EA=0, acid green=0), hero-шаблон избегнут (нет min-h-screen, нет 50/50 split, text-5xl→7xl драма 4.25x), numbered markers не как украшение (только в SVG path data)
- ZERO INVENTION: 4 hex (#1c1917/#d97706/#f5f5f4/#faf9f7) — все из warm-minimal
- **a11y-check.js — ОЧЕНЬ ценный**: реально запущен, нашёл 7 violations (2 serious stone-400 контраст 2.31:1, 5 moderate amber-600 white 3.19:1), exit 1, a11y-report.json создан. Ловит нарушения которые агент пропускает. Новый шаг Accessibility Audit ОПРАВДАН.
- Chanel's Rule: ui-coder применил (убрал shadow-sm с обложки)
- Two-Stage Review Stage 2 (code-auditor): ТОЧНЫЙ, file:line, нашёл critical контрасты + невидимые SVG глаза совы (fill=#faf9f7=фон)
- Tailwind CDN первым (D-068), 18 a11y атрибутов

**❌ НЕ РАБОТАЕТ / слабо:**
- **Pre-build Self-Critique НЕ выведен явно**: ui-coder дал «Секции + Self-test + Learnings» вместо требуемой Часть 1 (4 оси color/type/layout/signature). Возможно сделал внутренне, но не продемонстрировал. Правило записано, демонстрации нет.
- **few-shot.md сверка НЕ упомянута** в выводе ui-coder (хотя файл прочитан)
- **Signature Element**: owl SVG задуман (кандидат ✅ концептуально), НО технически сломан — глаза залиты #faf9f7 = цвет фона → невидимы

## INS-020: 🚨 D-053 НЕ решён Deep Critique Protocol — дизайнер галлюцинирует СИЛЬНЕЕ (2026-07-22)

**Источник:** smoke-test, grep-верификация designer вывода vs реальный index.html
**Confidence:** 1.0 (grep-доказано)

Designer описал ВЫДУМАННЫЙ лендинг вместо реального:
- Утверждал «tagline "Добро пожаловать"» → реально «Бумага пахнет тишиной. Читайте медленно.»
- Утверждал «кнопка bg-emerald-600» → реально bg-amber-600 + bg-stone-900
- Утверждал «text-4xl» → реально text-5xl/6xl/7xl
- Утверждал «нет секции Книга месяца» → реально `<section id="book-of-month">` существует
- Утверждал «footer только копирайт» → реально адрес+часы+3 соцсети

**Вывод:** Deep Critique Protocol (4 пункта что/почему/как/before-after) НЕ решил D-053. Возможно даже УХУДШИЛ — дизайнер стал увереннее галлюцинировать внутри «структурированной» 4-пунктной рамки, что звучит авторитетнее. **Grep-верификация остаётся ОБЯЗАТЕЛЬНОЙ** (D-053 в силе). Stage 1 Spec Compliance от designer — НЕНАДЁЖЕН без верификации кодом.

**Рекомендация:** Stage 1 (spec compliance) возможно стоит перенести на code-auditor (читает код, не галлюцинирует) ИЛИ добавить обязательный grep-чек каждой designer-претензии перед действием. Designer оставить только на визуальную/aesthetic критику, не на spec-fact проверку.

## INS-021: Правило WCAG AA в tokens.md НЕ предотвращает нарушения (2026-07-22)

**Источник:** smoke-test, ui-coder нарушил контраст несмотря на правило
**Confidence:** 0.9

ui-coder сгенерил text-stone-400 на stone-50 (2.31:1, нужно 4.5:1) и amber-600 white text (3.19:1) ДАЖЕ при наличии WCAG AA секции в tokens.md и accessibility шага в make-ui.md. Правило записано → агент всё равно нарушает. **Только автоматический a11y-check.js (запускаемый архитектором ПОСЛЕ генерации) поймал.**

**Вывод:** Текстовые правила accessibility в промптах НЕ достаточны. Нужен enforcement через инструмент (a11y-check.js) в verify loop — это единственный надёжный механизм. Это подтверждает ценность Sprint 3 (a11y).

**warm-minimal тема нуждается в фиксах:** text-amber-600 на bg-amber-50 (badge паттерн) = 3.07:1 — штатный паттерн темы нарушает WCAG AA. Нужно text-amber-700. text-white на bg-amber-600 (CTA) = 3.19:1 — нужно bg-amber-700 или text-stone-900. text-stone-400 на stone-100 = 2.31:1 — недопустимо, минимум text-stone-500.
