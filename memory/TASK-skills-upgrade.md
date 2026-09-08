# ТЗ: Допилка скиллов Pi Make System (T-068)

**Дата:** 2026-07-22
**Заказчик:** Владелец (через архитектора)
**Исполнитель:** coder / ui-coder / logic-auditor (по этапам)
**Основания:** D-100, D-101, INS-014..INS-018 (memory/research/insights.md)
**Оценка до:** 7.5/10 → **Оценка после:** 8.5/10
**Усилие:** ~9 часов

---

## 0. Контекст — что такое Pi Make System и где мы

Pi Make System — собственная система AI-агентов для генерации pixel-perfect UI (сайтов) через Pi harness. Ядро живёт в `C:/Users/Ваня/.pi/agent/`:

- `prompts/make-ui.md` — главный UI-промпт (3-осная модель, 5 пайплайнов, P1-P7, DoD 14 пунктов)
- `config/design-system/tokens.md` — базовые дизайн-токены (spacing, typography, radius, shadows, layout, Composition Principles)
- `config/design-system/themes/*.md` — **15 тем** (warm-minimal, modern-clean, bold-tech, aurora, bento, mesh-gradient, luxury, gaming, dark-tech, editorial-cream, sage-stone, earth-stone, dusty-slate, graphite-mono, industrial-dark)
- `config/design-system/wow-patterns.md` — 10 CSS-вау-приёмов
- `config/design-system/style-guide.md` — 8 индустриальных категорий с реальными примерами
- `agents/architect.md`, `agents/ui-coder.md`, `agents/designer.md`, `agents/consistency-checker.md` — агенты
- `scripts/extract-reference.js` — pixel-perfect CSS extraction (856 строк, уникальная capability)

**Системный контекст (читать обязательно перед стартом):**
- `D:/pi/memory/STATUS.md` — текущий статус, что сделано
- `D:/pi/memory/DECISIONS.md` — D-100 (не ставить Superpowers), D-101 (не вливать frontend-design целиком), D-053 (дизайнер галлюцинирует — всегда grep-верификация), D-068 (Tailwind CDN обязательный), D-077 (grid extraction)

## 1. Наша позиция и решение (ЗАЧЕМ эта задача)

Разобраны 2 внешних источника скиллов: **Superpowers** (obra/superpowers, 14 скиллов, поддерживает Pi) и **frontend-design** (anthropics/skills, 55 строк мета-принципов).

**Решение (D-100, D-101): НЕ ставить готовое, ДОПИЛИВАТЬ СВОЁ.**

Почему НЕ ставить Superpowers целиком (D-100):
1. Философский конфликт: Superpowers = «агент делает всё сам через TDD»; наш Pi = «архитектор делегирует, UI через design system».
2. Bootstrap `using-superpowers` инжектится как `<EXTREMELY_IMPORTANT>` user-message → может перезаписать наш AGENTS.md (user-сообщения имеют приоритет).
3. Brainstorming hard gate требует полный цикл даже для «поправь кнопку» — overhead для quick-fix.
4. Git worktrees нерелевантны (Windows, нет git-repo).
5. TDD iron law нерелевантен для HTML-генерации.

Почему НЕ вливать frontend-design целиком (D-101):
- Anthropic = 55 строк мета-уровня («будь не шаблонным»). Мы = 687 строк конкретики (hex, шрифты, 15 тем, pixel-perfect pipeline). Подходы комплементарны, не конкурентны.
- Наше ядро СИЛЬНЕЕ в: tokens (462 строки vs 4 абстрактные оси), темах (15 vs 0), pixel-perfect (extract-reference.js — уникально), verify loop с D-053.
- Anthropic СИЛЬНЕЕ в: философии уникальности, pre-build critique, signature element, UX-копирайтинге, Chanel's rule, few-shot библиотеке.

**Стратегия:** перенять точечно 5 концептов из Anthropic + 5 паттернов из Superpowers + закрыть 5 собственных пробелов. Не терять ничего наработанного.

---

## ЭТАП 1. Концепты из Anthropic frontend-design

**Цель:** добавить философию «не быть шаблонным» в наши промпты. Это МЕНТАЛЬНАЯ установка, которой не хватает нашему конкретному ядру.

### 1.1. Новый файл: `config/design-system/few-shot.md` 🔴 ПРИОРИТЕТ

**Проблем:** у нас 1 пример «провинциально vs со вкусом» в make-ui.md. Anthropic оперирует десятками. Few-shot — самый дешёвый способ поднять качество генерации.

**Создать файл `C:/Users/Ваня/.pi/agent/config/design-system/few-shot.md`** с 6 парами ❌/✅ для разных компонентов. Для каждой пары:
- Название компонента
- ❌ «провинциально/шаблонно»: короткое описание + примерные Tailwind-классы
- ✅ «со вкусом»: короткое описание + примерные Tailwind-классы + ЧЕМ отличается (1-2 строки)

Компоненты для пар (выбрать 6):
1. Hero (уже есть в make-ui.md — вынести сюда и расширить)
2. Features grid (монотонно vs с вариацией секций)
3. Pricing cards (плоские vs layered с акцентом на популярном тарифе)
4. Testimonials (скучно vs с глубиной: фото + цитата + контекст)
5. CTA section (generic gradient button vs compelling с конкретным обещанием)
6. Footer (шаблонный 4-колонный vs брендированный с подписью)

**Требования к парам:** использовать НАШИ темы и токены (не выдумывать цвета). Сослаться на warm-minimal / modern-clean. Примеры должны быть переносимы между темами. Каждая пара ~15-25 строк markdown.

**Связать с make-ui.md:** добавить ссылку на few-shot.md в секцию инструкций кодеру: «Перед генерацией прочитай few-shot.md и сверь свой план с парами ❌/✅».

### 1.2. `prompts/make-ui.md` — секция «Anti-Slop Design Principles»

Добавить НОВУЮ секцию (предложенное место — после Composition Principles-ссылки, до пайплайнов). Текст дословно (исполнитель может слегка перефразировать под наш тон, но смысл сохранить):

```markdown
## Anti-Slop Design Principles (из Anthropic frontend-design)

### Запретные AI-клише (defaults, не choices)
Эти 3 паттерна AI выдаёт ПО УМОЛЧАНИЮ. Использовать ТОЛЬКО если бриф явно того требует:
1. Тёплый cream-фон (~#F4F1EA) + serif display + terracotta-акцент
2. Почти-чёрный фон + единственный кислотный green/vermilion-акцент
3. Broadsheet-раскладка: hairline-линейки, zero border-radius, плотные газетные колонки

### Hero-антипаттерн
«Большое число + маленькая подпись + supporting stats + gradient-акцент» — это ШАБЛОННЫЙ hero. Использовать только если это правда лучший вариант для данного брифа. Иначе — hero как тезис: открой самой характерной вещью в мире субъекта (заголовок, изображение, анимация, интерактив).

### Numbered markers (01/02/03)
Нумерованные метки уместны ТОЛЬКО если контент ДЕЙСТВИТЕЛЬНО является последовательностью. Не используй их как украшение.

### Signature Element ⭐
Определи 1 signature element — единственную вещь, по которой страницу запомнят. Всё остальное — тихое и дисциплинированное обрамление. Signature должен быть осмысленным для субъекта, не декоративным.

### Pre-build Self-Critique ⭐
После составления дизайн-плана, но ДО написания кода: пройди по каждой оси (color, type, layout, signature). Если любая читается как «дефолт, который ты выдал бы для любого похожего проекта» — пересмотри. Скажи что изменил и почему. Только после подтверждения уникальности плана — начинай код, выводя каждое color/type-решение из плана.
```

### 1.3. `prompts/make-ui.md` — Chanel's Rule в verify loop

В секцию verify loop (Шаг screenshot→designer→fix) добавить строку:
```markdown
**Chanel's Rule (финальная проверка):** перед сдачей посмотри на дизайн и убери один декоративный элемент. Если стало лучше — он был лишним. (Правило Anthropic: «before leaving the house, take a look in the mirror and remove one accessory».)
```

### 1.4. `agents/ui-coder.md` — UX-writing principles

Добавить НОВУЮ секцию «UX-Writing»:
```markdown
## UX-Writing Principles
Текст в интерфейсе — дизайн-материал, не украшение.
- Active voice по умолчанию
- Контрол должен говорить ЧТО произойдёт: «Save changes», не «Submit»
- Ошибки не извиняются и никогда не бывают абстрактными: «Email required», не «Something went wrong :(»
- Empty states = приглашение к действию, не «No data»
- Sentence case, без filler-слов
- Заголовки секций — осмысленные, не «Features»/«About» (это разделы, не заголовки)
```

### 1.5. `agents/designer.md` — Deep Critique Protocol 🔴 ПРИОРИТЕТ

**Проблем:** designer даёт числовые оценки + список проблем, но без «почему и как». Anthropic critique глубже.

Расширить существующий taste review. Для КАЖДОЙ найденной проблемы designer теперь обязан выдать 4 пункта:
```markdown
### Deep Critique Protocol
Для каждой проблемы:
(a) Что вижу — конкретный элемент + screenshot-reference
(b) Почему это проблема — какой принцип нарушен (Composition Principle / Anti-Slop / token violation)
(c) Как исправить — конкретные Tailwind-классы или значения из tokens.md
(d) Before/after — словесное описание «как будет выглядеть после исправления»

Запрещено: «looks off», «could be better», абстрактная критика без класса/значения. Каждое замечание = file:line или selector + что не так + почему + фикс.
```

---

## ЭТАП 2. Паттерны из Superpowers (без установки пакета)

**Цель:** улучшить оркестрацию субагентов и устойчивость к compaction. Берём ИДЕИ, не код Superpowers.

### 2.1. Progress Ledger 🔴 ПРИОРИТЕТ (решает реальную боль)

**Проблем:** при compaction архитектор теряет контекст о том, какие компоненты уже сгенерированы/проверены. project.json.status сейчас бинарный (todo/done). Без ledger контроллеры в реальных сессиях Superpowers перезапускали целые цепочки завершённых задач — самая дорогая ошибка.

**Реализация — 2 части:**

**(a) Расширить schema project.json.status** (описать в make-ui.md и architect.md в секции Project Model):
```json
"status": {
  "components": {
    "nav":    { "state": "approved", "reviewer": "designer", "score": 9.0 },
    "hero":   { "state": "review",   "reviewer": "designer" },
    "card":   { "state": "generated", "agent": "ui-coder" },
    "footer": { "state": "todo" }
  },
  "pages": {
    "index": { "state": "approved" },
    "about": { "state": "building" }
  },
  "ledger": "path/to/ledger.md"
}
```
States: `todo` → `generated` → `review` → `fixed` → `approved`.

**(b) Создать файл-правило для архитектора** (добавить секцию в `agents/architect.md`):
```markdown
## Progress Ledger Protocol
Для multi-page проектов архитектор ОБЯЗАН:
1. При старте — прочитать project.json.status (если есть) и .pi/progress/<project>/ledger.md. НЕ перегенерировать компоненты в state=approved.
2. После каждого subagent-вызова — append строку в ledger.md (одна строка = одна задача):
   `Task N (agent, компонент): state (reviewer score, commits/артефакты)`
3. После compaction — ПЕРЕЧИТАТЬ ledger первым делом, восстановить план.

Ledger — дешёвая защита от потери контекста. Git-коммиты/артефакты существуют даже когда контекст потерян.
```

### 2.2. Task-brief pattern (file handoff)

**Проблем:** архитектор вставляет полный промпт/план в контекст subagent'а → раздувает контекст. Superpowers извлекает ТОЛЬКО нужную задачу в отдельный файл.

**Реализация:** добавить правило в `agents/architect.md`:
```markdown
## File Handoff Protocol
При делегировании задачи субагенту — НЕ вставляй полный план/контекст в промпт. Вместо:
1. Запиши task-brief в файл (D:/pi/.tasks/<project>/task-N-brief.md) — только эта задача + нужные интерфейсы + контекст.
2. В промпте субагенту передай ПУТЬ к файлу: «Прочитай brief в <path>, выполни, отчёт запиши в <path>.report.md».
3. Отчёт субагента — тоже файл, не вставка в контекст архитектора.

Экономия ~80% контекста. Контроллер не читает эти файлы — только субагенты.
```

### 2.3. Two-stage review

**Проблем:** наш verify loop = один designer pass. Superpowers разделяет: spec compliance + code quality — два отдельных verdict.

**Реализация:** обновить verify loop в make-ui.md (Шаг screenshot→review→fix):
```markdown
### Two-Stage Review
**Stage 1 — Spec Compliance (designer):** соответствует ли результат дизайн-плану и токенам?
- Missing: что пропустили
- Extra: что не просили (over-engineering)
- Misunderstood: правильная фича построена неправильно
- Verdict: ✅ Spec compliant | ❌ Issues | ⚠ Cannot verify

**Stage 2 — Code Quality (code-auditor):** чистый ли код?
- Tailwind best practices, responsive, accessibility, DRY без premature abstraction
- Findings: Critical (Must Fix) → Important (Should Fix) → Minor (Nice to Have)
- Каждый finding = file:line + что не так + почему
```

### 2.4. Model selection по сложности

**Проблем:** сейчас все задачи идут на deepseek-v4-pro. Superpowers: дешёвая модель для механических задач, дорогая для архитектурных. НО caveat: «turn count beats token price» — дешёвая модель может взять 2-3× больше ходов и стоить дороже.

**Реализация:** добавить матрицу в `agents/architect.md` (как рекомендация, не жёстко):
```markdown
## Model Selection (рекомендация)
| Тип задачи | Модель |
|-----------|--------|
| Механическая (1-2 файла, точные токены, CSS-фикс) | dashscope/qwen3.7-max |
| Интеграция (multi-file, debugging, pattern matching) | dashscope/deepseek-v4-pro |
| Архитектура / новая страница / final review | dashscope/deepseek-v4-pro |

Внимание: дешёвая модель может взять больше ходов — следи за turn count. При сомнении бери v4-pro.
```

### 2.5. Bulletproofing / Rationalization tables

**Проблем:** агент знает правило, но нарушает под давлением («это просто, скилл не нужен»). Superpowers закрывает это таблицами «отмазок».

**Реализация:** добавить rationalization tables в `prompts/make-ui.md` (в секцию Anti-Slop) и `agents/ui-coder.md`:
```markdown
### Rationalization Table (защита от отмазок)
| Excuse | Reality |
|--------|--------|
| «Эта секция простая, обойдусь без дизайн-системы» | Простые секции ломают консистентность. Tokens обязательны ВСЕГДА. |
| «Tailwind-дефолт достаточно близок» | Значения дизайн-системы ТОЧНЫЕ. Дефолты запрещены. |
| «CDN добавлю в конце» | Без CDN ничего не рендерится (D-068). CDN первым. |
| «Это просто, skip pre-build critique» | Pre-build critique экономит итерации. Делай всегда. |
| «Hero-шаблон сойдёт» | Hero-шаблон = AI-slop. Пересмотри через Signature Element. |
```

---

## ЭТАП 3. Оставшиеся пробелы

4 из 5 пробелов уже покрыты выше:
- ✅ Few-shot библиотека → Этап 1.1
- ✅ Progress Ledger → Этап 2.1
- ✅ Deep Critique → Этап 1.5
- ✅ File handoff → Этап 2.2

Остался один пробел:

### 3.1. Accessibility audit в verify loop 🔴 ПРИОРИТЕТ

**Проблем:** нигде не проверяется a11y. Нет контрастов, нет aria, нет keyboard-nav. Это ниже индустрии.

**Реализация — 2 части:**

**(a) Скрипт `C:/Users/Ваня/.pi/agent/scripts/a11y-check.js`** (новый):
- Запускать через Playwright (как extract-reference.js) ИЛИ через `npx @axe-core/cli`
- Принимать путь к HTML-файлу
- Проверять: WCAG AA contrast (text/headings), aria-роли, alt-тексты, keyboard-focusable элементы, landmarks (header/nav/main/footer)
- Вывод: JSON-отчёт + человекочитаемый summary (violations по severity: critical/serious/moderate/minor)
- Exit code: 0 если нет critical/serious, 1 если есть

**(b) Интеграция в verify loop** (make-ui.md, после Шага screenshot→designer):
```markdown
### Шаг: Accessibility Audit
После дизайнер-ревью запусти: `node scripts/a11y-check.js <path-to-html>`
- Если есть critical/serious violations → передай ui-coder'у на исправление (как часть Stage 2 code quality)
- moderate/minor — отметить в отчёте, не блокируют
- Добавить в tokens.md: WCAG AA contrast ratios для text (4.5:1) и large text (3:1) — как обязательное правило выбора цветов
```

**(c) Дополнить `config/design-system/tokens.md`** секцией про контрасты:
```markdown
## Accessibility — Contrast (WCAG AA, обязательно)
- Body text: минимум 4.5:1 контраст с фоном
- Large text (≥18px / 14px bold): минимум 3:1
- UI-компоненты и графические элементы: 3:1
- Не использовать stone-400/slate-400 и светлее на белом фоне для основного текста
- Проверка: перед сдачей запускать a11y-check.js
```

---

## ПОРЯДОК ВЫПОЛНЕНИЯ

**Архитектор делегирует по этапам. Рекомендуемый порядок (по ROI):**

1. **Спринт 1 (~3ч, быстрый ROI):** Этап 1 целиком
   - 1.1 few-shot.md (новый файл) → ui-coder
   - 1.2 Anti-Slop секция в make-ui.md → coder
   - 1.3 Chanel's Rule в make-ui.md → coder (вместе с 1.2)
   - 1.4 UX-writing в ui-coder.md → coder
   - 1.5 Deep Critique в designer.md → coder

2. **Спринт 2 (~4ч, решает боль compaction):** Этап 2
   - 2.1 Progress Ledger (architect.md + make-ui.md schema) → logic-auditor (требует согласованности schema)
   - 2.2 File Handoff в architect.md → coder
   - 2.3 Two-stage review в make-ui.md → coder
   - 2.4 Model selection в architect.md → coder
   - 2.5 Rationalization tables в make-ui.md + ui-coder.md → coder

3. **Спринт 3 (~2ч, a11y):** Этап 3
   - 3.1a a11y-check.js скрипт → coder
   - 3.1b Интеграция в verify loop (make-ui.md) → coder
   - 3.1c Contrast секция в tokens.md → coder

**Параллелизм:** Спринт 1 и Спринт 3 независимы — можно запускать параллельно (coder + ui-coder). Спринт 2 лучше после 1 (schema зависит от терминологии).

## DEFINITION OF DONE

- [ ] `config/design-system/few-shot.md` создан, 6 пар ❌/✅, использует наши темы/tokens, ссылка из make-ui.md
- [ ] make-ui.md: секция «Anti-Slop Design Principles» (3 AI-клише + hero-антипаттерн + numbered markers + Signature Element + Pre-build Self-Critique)
- [ ] make-ui.md: Chanel's Rule в verify loop
- [ ] ui-coder.md: секция «UX-Writing Principles»
- [ ] designer.md: Deep Critique Protocol (4 пункта на проблему)
- [ ] architect.md: Progress Ledger Protocol + File Handoff Protocol + Model Selection
- [ ] make-ui.md: project.json.status schema расширена (states: todo→generated→review→fixed→approved)
- [ ] make-ui.md: Two-Stage Review в verify loop
- [ ] make-ui.md + ui-coder.md: Rationalization Tables
- [ ] `scripts/a11y-check.js` создан и запускается (exit code 0/1, JSON+summary)
- [ ] make-ui.md: Шаг Accessibility Audit в verify loop
- [ ] tokens.md: секция «Accessibility — Contrast (WCAG AA)»
- [ ] **Smoke-тест:** запустить make-ui на простом лендинге, проверить что новые секции читаются агентом и не конфликтуют с существующими (P1-P7, Composition Principles, ZERO INVENTION)
- [ ] memory/STATUS.md обновить: T-068 завершён, оценка 8.5/10

## ОГРАНИЧЕНИЯ — что НЕЛЬЗЯ трогать

- ❌ НЕ заменять make-ui.md / tokens.md / темы на внешние. Только ДОБАВЛЯТЬ секции.
- ❌ НЕ трогать 15 тем (themes/*.md) — они вылизаны.
- ❌ НЕ трогать extract-reference.js (856 строк, production-grade, D-064..D-077).
- ❌ НЕ удалять существующие секции (P1-P7, Composition Principles, ZERO INVENTION/LOSS, DoD 14 пунктов, Conversational UX).
- ❌ НЕ нарушать D-053 (дизайнер галлюцинирует — все проверки grep'ом), D-068 (Tailwind CDN обязателен), D-077 (grid extraction).
- ❌ НЕ устанавливать Superpowers как пакет (D-100). НЕ вливать frontend-design целиком (D-101).
- ❌ Комментарии в скриптах — на английском. Документация/промпты — на русском (текущий язык системы).

## ИСТОЧНИКИ (для исполнителя)

- Anthropic frontend-design: `github.com/anthropics/skills` (полный разбор в отчёте researcher, INS-017)
- Superpowers: `github.com/obra/superpowers` (INS-015, INS-016)
- Наши решения: D:/pi/memory/DECISIONS.md (D-100, D-101)
- Контекст системы: D:/pi/memory/STATUS.md, AGENTS.md
- Существующие промпты: C:/Users/Ваня/.pi/agent/prompts/make-ui.md, agents/*.md, config/design-system/tokens.md

**Перед стартом исполнитель ОБЯЗАН прочитать:** STATUS.md, DECISIONS.md (D-053, D-068, D-077, D-100, D-101), текущий make-ui.md, tokens.md, architect.md, ui-coder.md, designer.md.

