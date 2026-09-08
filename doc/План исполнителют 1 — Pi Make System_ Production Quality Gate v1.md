# Pi Make System — план работ

## Цель

Довести текущую архитектуру Pi Make System до состояния, где результат генерации принимается **по объективным проверкам**, а не по декларациям агентов или субъективной оценке Designer.

Не добавлять новых агентов, тем и шаблонов, пока не закрыты пункты ниже.

\---

# Этап 0. Зафиксировать текущее состояние

Перед изменениями:

1. Проверить текущий `main`.
2. Зафиксировать commit SHA.
3. Составить фактический список:

   * всех `agent/agents/\*.md`;
   * всех `agent/scripts/\*`;
   * всех `scripts/\*`;
   * `agent/extensions/subagent/\*`;
   * `skills/\*`;
   * build/test/verify команд;
   * существующих CI/checks.
4. Отдельно проверить, существует ли уже какой-либо quality gate, чтобы не реализовывать дубликат.

Результат:

```text
CURRENT\_STATE.md
```

с фактической картиной системы.

\---

# Этап 1 — P0. Устранить противоречие Designer

## Проблема

`designer.md` одновременно:

* разрешает Designer определять точные значения `hex`, `px`, fonts, radius и т.п.;
* содержит D-053, согласно которому Designer не должен использовать vision для фактической проверки спецификации.

Это два разных контракта.

## Что сделать

Designer должен отвечать **только за визуальную/эстетическую оценку**:

* hierarchy;
* composition;
* spacing perception;
* visual balance;
* typography impression;
* density;
* consistency;
* visual quality;
* wow/signature element.

Designer **не имеет права быть источником истины** для:

* exact hex;
* exact px;
* exact font-size;
* exact radius;
* exact text;
* наличия/отсутствия DOM-элементов;
* ссылок;
* token compliance;
* component compliance;
* accessibility compliance.

Все такие проверки выполняются кодом / grep / DOM / computed styles / deterministic scripts.

## Изменить

`agent/agents/designer.md`

и связанные prompt'ы.

## Acceptance criteria

В документации не должно остаться противоречия:

```text
Designer = visual/taste reviewer
Code auditor/scripts = factual/specification reviewer
```

\---

# Этап 2 — P0. Реализовать настоящий SSOT для компонентов

## Проблема

Сейчас заявлено:

```text
shared/components/nav.html
        ↓
pages/\*.html
```

и одновременно предполагается, что изменение `nav.html` автоматически распространяется на страницы.

Если компонент физически inline-копируется в HTML, автоматического распространения нет.

## Выбрать и реализовать один реальный механизм

Предпочтительно:

```text
shared/components/\*.html
        ↓
build / assembler
        ↓
dist/pages/\*.html
```

То есть:

* source components — SSOT;
* pages содержат references/includes;
* build собирает финальные HTML;
* generated output не считается source.

Либо другой механизм, но он должен обеспечивать реальную propagation semantics.

## Обязательно

Документировать:

```text
SOURCE
  ↓
COMPONENTS
  ↓
ASSEMBLY
  ↓
GENERATED PAGES
```

и указать, какие файлы редактируются человеком/агентом, а какие генерируются.

## Acceptance test

1. Изменить `shared/components/nav.html`.
2. Запустить build.
3. Проверить все страницы.
4. Убедиться, что изменение присутствует во всех соответствующих страницах.

Автоматизировать этот тест.

\---

# Этап 3 — P0. Production Quality Gate v1

Создать единый deterministic pipeline:

```text
GENERATE
   ↓
BUILD
   ↓
STATIC AUDIT
   ↓
PLAYWRIGHT
   ↓
A11Y
   ↓
DESIGNER
   ↓
FINAL GATE
```

Designer здесь **не должен иметь права самостоятельно поставить PASS**.

\---

## 3.1 Static Audit

Создать единый запускаемый скрипт, например:

```text
agent/scripts/quality-gate.ts
```

или аналогичный существующей архитектуре.

Он должен проверять минимум:

### Design tokens

* используются существующие tokens;
* нет неожиданных hardcoded цветов;
* нет произвольных значений там, где обязательны tokens;
* CSS Custom Properties присутствуют там, где это требуется архитектурой.

### Components / SSOT

* canonical components существуют;
* pages не содержат запрещённые дубликаты компонентов;
* component references/assembly корректны;
* generated output соответствует source.

### Project model

Проверить согласованность:

```text
project.json
pages.json
components.json
```

Минимум:

* страницы существуют;
* заявленные страницы реально генерируются;
* компоненты существуют;
* paths корректны;
* нет orphan entries;
* нет generated files, отсутствующих в model.

### Content

Для existing-site redesign:

```text
SOURCE INVENTORY
        ↓
GENERATED CONTENT
        ↓
CONTENT DIFF
```

Проверять:

* text loss;
* image loss;
* link loss;
* missing sections;
* invented content.

Правило:

```text
ZERO INVENTION
ZERO LOSS
```

### Links

Проверять:

* внутренние ссылки;
* отсутствующие targets;
* очевидные broken links;
* navigation consistency.

### HTML

Проверять:

* malformed HTML;
* duplicate IDs;
* missing required attributes;
* очевидные structural errors.

\---

# Этап 4 — P1. Расширить Code Auditor

`code-auditor.md` сейчас слишком общий.

Он должен иметь обязательный Make UI checklist.

Добавить обязательные проверки:

```text
\[ ] Design tokens
\[ ] Hardcoded colors
\[ ] CSS variables
\[ ] Components
\[ ] SSOT
\[ ] project.json
\[ ] pages.json
\[ ] components.json
\[ ] ZERO INVENTION
\[ ] ZERO LOSS
\[ ] Links
\[ ] HTML validity
\[ ] Responsive behavior
\[ ] Breakpoints
\[ ] Accessibility
\[ ] Console errors
\[ ] Generated artifact integrity
```

Каждый FAIL должен содержать:

```text
file
line / selector
problem
expected
actual
fix
```

Никаких формулировок вида:

```text
"looks wrong"
"probably"
"seems inconsistent"
```

если утверждение можно проверить детерминированно.

\---

# Этап 5 — P1. Сделать Pre-build Critique проверяемым

Сейчас UI-Coder обязан перед генерацией заявить, что он соблюдает правила.

Это недостаточно.

Например:

```text
Token compliance: YES
SSOT: YES
Responsive: YES
```

не является проверкой.

## Что сделать

Pre-build Critique оставить как planning artifact.

После генерации quality gate должен независимо проверить заявленные свойства.

Принцип:

```text
AI CLAIM
   ↓
DETERMINISTIC CHECK
   ↓
PASS / FAIL
```

AI не может сам подтвердить собственное соответствие.

\---

# Этап 6 — P1. Playwright regression

Добавить обязательный автоматический запуск:

### Desktop

Минимум:

```text
1440px
```

### Mobile

Минимум:

```text
390px
```

Проверять:

* page loads;
* no uncaught console errors;
* no failed critical requests;
* no horizontal overflow;
* navigation works;
* основные CTA существуют;
* изображения загружаются;
* screenshots создаются.

Если проект имеет дополнительные breakpoints — использовать их из project model.

\---

# Этап 7 — P1. Screenshot regression

Для каждой страницы сохранять baseline:

```text
screenshots/
  desktop/
  mobile/
```

При повторной генерации:

```text
NEW
 ↓
COMPARE
 ↓
DIFF
```

Не требуется сразу идеальный pixel-diff.

На первом этапе достаточно:

* наличие baseline;
* генерация нового screenshot;
* фиксация diff;
* FAIL при превышении заданного порога.

Порог сделать конфигурируемым.

\---

# Этап 8 — P1. A11Y как обязательный gate

Использовать существующий:

```text
a11y-check.js
```

Но его результат должен входить именно в общий gate.

Pipeline:

```text
a11y
  ↓
PASS / FAIL
```

а не просто создавать отчёт, который никто не учитывает.

Минимум:

* WCAG AA checks;
* images alt;
* labels;
* buttons/links;
* contrast;
* heading structure;
* keyboard/focus issues, если проверка поддерживает.

\---

# Этап 9 — P2. Сверить количество агентов

В документации заявлено:

```text
17 agents
```

Фактическое содержимое второго push нужно пересчитать.

Команда:

```text
find agent/agents -name "\*.md"
```

или эквивалент.

После этого:

* либо исправить документацию;
* либо удалить/обосновать лишних агентов.

Источник истины должен быть один.

\---

# Этап 10 — P2. Elementor compatibility matrix

Elementor pipeline пока нельзя считать production-proven только потому, что JSON генерируется.

Создать matrix:

```text
Template
Elementor version
Widget
Structure
Render
Responsive
Links
A11Y
PASS/FAIL
```

Проверить все 10 текущих templates.

Особенно:

```text
section
column
widget
responsive settings
```

Не переходить на новые container semantics без отдельной проверки совместимости.

\---

# Финальный orchestrator

После всех изменений должна существовать одна понятная команда:

```text
make / verify / quality-gate
```

которая выполняет весь цикл.

Пример логики:

```text
1. validate project model
2. build
3. static audit
4. Playwright desktop
5. Playwright mobile
6. console/network audit
7. a11y
8. screenshot regression
9. optional Designer review
10. final decision
```

\---

# Главное правило PASS/FAIL

Финальный результат должен выглядеть примерно так:

```text
PI MAKE SYSTEM — QUALITY GATE

Build                 PASS
Project model         PASS
Tokens                PASS
Components / SSOT     PASS
Content integrity     PASS
Links                 PASS
HTML                  PASS
Playwright desktop    PASS
Playwright mobile     PASS
Console               PASS
A11Y                   PASS
Visual regression     PASS
Designer              8.2/10  \[ADVISORY]

FINAL: PASS
```

Designer score **не должен превращаться в gate**, если только отдельное правило проекта явно не требует визуального порога.

\---

# Что считать завершением

Работа считается законченной только когда есть:

1. Исправленный `designer.md`.
2. Реальный component/SSOT build mechanism.
3. Один deterministic Quality Gate.
4. Static audit.
5. Make UI checklist в Code Auditor.
6. Playwright desktop + mobile.
7. Console/network проверки.
8. A11Y включён в PASS/FAIL.
9. Screenshot regression.
10. Project-model consistency check.
11. Content diff для existing-site режима.
12. Исправлена документация по количеству агентов.
13. Elementor compatibility matrix.
14. Полный прогон на **минимум одном существующем проекте** и **одном новом generated project**.
15. В репозитории есть пример реального `PASS` и реального `FAIL`.

## Критически важно

Не закрывать задачу изменением только `.md`-файлов.

Если правило нельзя проверить автоматически — считать его **декларацией**, а не quality gate.

Приоритет:

```text
P0
Designer contract
SSOT/components
Quality Gate

P1
Code Auditor
Static checks
Playwright
A11Y
Regression

P2
Agent count
Elementor matrix
```

Сначала добиться **воспроизводимого PASS/FAIL**, потом расширять систему.

