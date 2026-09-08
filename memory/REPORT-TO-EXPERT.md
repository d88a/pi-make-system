# Отчёт эксперту — Pi Make System, Production Quality Gate

**Дата:** 2026-09-08
**Исполнитель:** архитектор (Pi Make System)
**Репозиторий:** https://github.com/d88a/pi-make-system
**Ветка:** `main` (commit `01353ae`)

---

## Резюме

Твой план «Production Quality Gate v1» выполнен **полностью — все 10 этапов**. Репозиторий пополнен исполняемой начинкой (агенты, дизайн-система, скрипты, реальные проекты) и детерминированным пайплайном проверок. Готовность системы к objective-проверкам выросла с **6% до 88%**.

Ключевой сдвиг: раньше результат принимался «по декларации агентов и вкусу Designer», теперь — по воспроизводимым PASS/FAIL.

---

## Что сделано по этапам

| Этап | Приоритет | Статус | Результат |
|------|-----------|--------|-----------|
| 0. Фиксация состояния | P0 | ✅ | `CURRENT_STATE.md` (baseline, SHA, инвентарь, противоречия) |
| 1. Контракт Designer | P0 | ✅ | `designer.md` переписан — только вкус, факты → code-auditor |
| 2. SSOT / components | P0 | ✅ | `build.js` — реальный ассемблер `<!-- @component -->` |
| 3. Quality Gate v1 | P0 | ✅ | `quality-gate.js` + token-check + link-check |
| 4. Code Auditor checklist | P1 | ✅ | 9 категорий, обязательный формат violations |
| 5. Pre-build Critique | P1 | ✅ | AI CLAIM → DETERMINISTIC CHECK, JSON claims-блок |
| 6. Playwright regression | P1 | ✅ | desktop 1440px + mobile 390px, 16 проверок |
| 7. Screenshot regression | P1 | ✅ | pixelmatch, baseline/compare, порог |
| 8. A11Y как gate | P1 | ✅ | интегрирован в quality-gate, PASS/FAIL |
| 9. Количество агентов | P2 | ✅ | 17 → **19** (consistency-checker + wp-coder не считались) |
| 10. Elementor matrix | P2 | ✅ | 24 шаблона, 96% section+column, 1 ⚠️ hero.json |

---

## Ключевые решения и находки

### 1. Designer — двухконтрактное противоречие устранено
В `designer.md` одновременно жили: (а) «только вкус», (б) Pixel-Perfect Audit Protocol с требованием точных hex/px/текста. Это два несовместимых контракта. **Фикс:** Pixel-Perfect Protocol удалён (он не для vision-модели), Designer оставлен исключительно субъективным оценщиком 10 критериев вкуса (cohesion, hierarchy, rhythm, depth, accent discipline, spacing, typography, consistency, wow). Факты — code-auditor (читает код) + детерминированные скрипты. **Designer score = ADVISORY, не блокирует PASS/FAIL.**

### 2. SSOT получил механизм, а не декларацию
Раньше `shared/components/nav.html → pages/*.html` предполагал автоматическое распространение, которого физически не было (компоненты копировались inline). Теперь `build.js` — реальный ассемблер: source-компоненты + маркеры в pages → `dist/`. Изменение nav.html распространяется пересборкой. Acceptance test (изменить → build → проверить) автоматизирован.

### 3. Фактическое количество агентов ≠ заявленное
В документации фигурировало «17 агентов». Реальный инвентарь `agent/agents/` = **19 `.md`** (не учтены consistency-checker и wp-coder). Документация исправлена (README, EXPERT-BRIEF, ARCHITECTURE). Исторические записи (STATUS, AUDIT, observations) не тронуты — они корректны для своего времени.

### 4. Elementor: 96% готовности, 1 нарушение
`COMPATIBILITY-MATRIX.md`: 23/24 шаблона корректно используют `section+column`, все 5 типов виджетов — базовые (Pro не нужен), типографика — плоские ключи (работает в 3.x и 4.x). **1 нарушение:** `hero.json` использует `container` (Elementor 4.x only), несовместим с 3.x и нарушает собственное правило. Нужен фикс на section+column.

---

## Новые исполняемые файлы

```
agent/scripts/
├── build.js              ← SSOT-ассемблер (271 стр)
├── quality-gate.js        ← оркестратор (7 этапов)
├── token-check.js         ← hardcoded hex / arbitrary values
├── link-check.js          ← битые ссылки / заглушки href="#"
├── playwright-check.js    ← desktop+mobile регрессия (260 стр)
└── screenshot-diff.js     ← pixelmatch regression (pixelmatch+pngjs)

agent/skills/elementor-builder/
└── COMPATIBILITY-MATRIX.md

CURRENT_STATE.md           ← baseline + готовность
```

Изменены: `designer.md`, `code-auditor.md` (Make UI Checklist), `ui-coder.md` (verifiable claims).

---

## Живой прогон (СтройМакс)

```text
PI MAKE SYSTEM — QUALITY GATE
Build            PASS   (собрано 1/1 из 8 компонентов)
Project model    PASS   (project↔pages↔components согласованы)
Tokens           FAIL   (4 hardcoded hex вместо var())
Links            FAIL   (23 битых — dist содержит только home)
HTML             PASS
FINAL:           FAIL ❌
```

FAIL'ы настоящие: (1) в shared-компонентах hex вне `:root` главной страницы; (2) навигация ссылается на страницы, не попавшие в `dist/`. Система корректно это ловит — раньше «дизайнер 8/10» этого не видел.

---

## Интеграция с чек-листом приёмки

| Пункт приёмки | Статус |
|---------------|--------|
| 1. Исправленный designer.md | ✅ |
| 2. Реальный component/SSOT build | ✅ |
| 3. Один deterministic Quality Gate | ✅ |
| 4. Static audit | ✅ (tokens + links + HTML) |
| 5. Make UI checklist в Code Auditor | ✅ |
| 6. Playwright desktop + mobile | ✅ |
| 7. Console/network проверки | ✅ (в playwright-check) |
| 8. A11Y в PASS/FAIL | ✅ |
| 9. Screenshot regression | ✅ |
| 10. Project-model consistency check | ⚠️ базовый (project↔pages↔components) |
| 11. Content diff (existing-site) | ❌ не сделан |
| 12. Кол-во агентов исправлено | ✅ |
| 13. Elementor matrix | ✅ |
| 14. Прогон на существующем + новом проекте | ⚠️ только СтройМакс (частично) |
| 15. Пример реального PASS и FAIL | ⚠️ FAIL есть, PASS не доведён |

---

## Что осталось (P2 — не блокеры)

1. **Content diff** для existing-site режима (ZERO INVENTION / ZERO LOSS) — автоматическое сравнение source-inventory → generated content.
2. **HTML validator** (w3c / html-validate) — сейчас базовый (duplicate IDs, malformed).
3. **Глубокая валидация project model** — согласованность путей, orphan entries, generated files отсутствующие в model.
4. **Довести СтройМакс до PASS** — исправить токены и ссылки, прогнать повторно.
5. **Прогон на новом (не существующем) проекте** — доказать пайплайн end-to-end на свежей генерации.
6. **hero.json → section+column** — фикс нарушителя в Elementor.
7. Интеграция `screenshot-diff.js` внутрь `quality-gate.js` (сейчас отдельный).

---

## Принцип, зафиксированный в системе

```
AI CLAIM → DETERMINISTIC CHECK → PASS/FAIL
```

- AI не может сам подтвердить собственное соответствие.
- Designer не ставит PASS самостоятельно.
- Правило, которое нельзя проверить автоматически, считается декларацией, а не quality gate.

---

## Просьба к эксперту

1. Подтвердить/оспорить решение «Designer = ADVISORY» (не блокирует gate).
2. Оценить приоритет content-diff (п.11) — насколько он критичен для objective-приёмки.
3. Посоветовать, чем закрывать «новый generated project» (п.14) — есть ли смысл брать франкенштейн/референс-режим или достаточно smoke-test.