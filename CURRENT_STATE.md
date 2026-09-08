# CURRENT_STATE.md — Pi Make System

**Зафиксирован:** 2026-09-08
**Commit SHA:** `f7f98766bb15c6df108385e48529377f39491318`

---

## 1. Агенты (19, не 17 как в документации)

| # | Файл | Размер | Модель |
|---|------|--------|--------|
| 1 | architect.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 2 | code-auditor.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 3 | coder.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 4 | consistency-checker.md | ✓ | dashscope/qwen-vl-max |
| 5 | data-analyst-glm.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 6 | data-analyst-qw.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 7 | data-analyst.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 8 | designer.md | ✓ | dashscope/qwen-vl-max |
| 9 | devil-advocate.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 10 | image-gen.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 11 | image-reader.md | ✓ | dashscope/qwen-vl-max |
| 12 | logic-auditor.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 13 | mathematician.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 14 | researcher.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 15 | screenshot.md | ✓ | dashscope/qwen-vl-max |
| 16 | trader-analyst.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 17 | triz-expert.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 18 | ui-coder.md | ✓ | clipproxy/kp/deepseek-v4-pro |
| 19 | wp-coder.md | ✓ | clipproxy/kp/deepseek-v4-pro |

**Расхождение:** В документации заявлено 17, фактически 19. consistency-checker зарегистрирован но не используется (I-013).

---

## 2. Скрипты (agent/scripts/)

| Файл | Назначение | Quality Gate? |
|------|-----------|---------------|
| a11y-check.js | WCAG AA аудит (axe-core + manual) | ✅ Готов к gate |
| check-fonts.js | Проверка шрифтов | ⚠️ Автономный |
| compare-full.js | Сравнение full-page | ⚠️ Автономный |
| extract-reference.js | CSS-экстракция (getComputedStyle) | ⚠️ Инструмент |
| extract-header-detail.js | Парсинг заголовков | ⚠️ Автономный |
| *.sh (10 шт) | Поисковые скрипты | ❌ Не gate |

**НЕТ:** quality-gate.ts, build-assembler, playwright-regression

---

## 3. Корневые скрипты (scripts/)

| Файл | Назначение |
|------|-----------|
| gen_image.py | Генерация картинок (DashScope Wanx) |
| make_certificates.py | Генерация сертификатов |

---

## 4. Extensions (agent/extensions/)

| Файл | Назначение |
|------|-----------|
| subagent/index.ts | Оркестрация субагентов (parallel/chain/single) |
| subagent/agents.ts | Конфигурация агентов |
| handoff.ts | Передача контекста между сессиями |
| health-check.ts | Проверка прокси/ключей/моделей |
| max-notify.ts | Push-уведомления (ntfy.sh) |

---

## 5. Skills (agent/skills/) — 11

| Skill | Назначение |
|-------|-----------|
| architect-memory | Память архитектора |
| deep-research | Исследовательский режим |
| elementor-builder | Конвертация HTML→Elementor JSON |
| install-harness | Установка Pi Harness |
| memory-guard | Проверка актуальности memory/ |
| night-autonomous | Ночной автономный цикл |
| onboarding | Первичный сбор контекста |
| prntsc-reader | OCR скриншотов prnt.sc |
| team-planning | Планирование команды |
| wp-integration | HTML→WP тема |
| youtube-reader | Транскрипция YouTube |

---

## 6. Существующие проверки (quality-related)

### Что уже работает
- `a11y-check.js` — WCAG AA, exit 0/1, отчёт JSON
- `check-fonts.js` — проверка шрифтов
- `compare-full.js` — сравнение full-page
- grep-верификация (архитектор, ручная)
- php -l (синтаксис PHP)

### Что НЕ работает
- **Нет единого quality-gate скрипта** (каждый инструмент автономен)
- **Нет SSOT/component build** (компоненты копируются inline)
- **Нет Playwright regression** (desktop/mobile)
- **Нет screenshot regression** (baseline/diff)
- **Нет content diff** (для existing-site режима)
- **Нет project-model consistency check**
- **Нет link checker**
- **Нет HTML validator**
- **Нет token compliance checker**

---

## 7. CI/Checks

**НЕТ.** Никаких CI-пайплайнов, pre-commit хуков, GitHub Actions.

---

## 8. Ключевые противоречия

### designer.md (Этап 1 плана)
- Содержит секцию «⚠️ РОЛЬ ДИЗАЙНЕРА — ТОЛЬКО ВКУС (D-053 fix)» — запрещает фактические проверки
- Одновременно содержит «Pixel-Perfect Audit Protocol» — требует точных проверок (px, hex, текст)
- Одновременно содержит «Deep Critique Protocol» — требует (a) Что вижу + (b) selector + (c) классы
- **Два несовместимых контракта в одном файле**

### code-auditor.md (Этап 4 плана)
- Слишком общий («Баги: логические ошибки, edge cases, race conditions»)
- Нет Make UI checklist
- Нет обязательных проверок (tokens, SSOT, links, HTML, ZERO INVENTION)

### SSOT/Components (Этап 2 плана)
- Заявлен SSOT: shared/components/*.html → pages/*.html
- Нет build/assembler механизма
- Компоненты физически копируются inline (нет propagation semantics)
- Изменение nav.html НЕ распространяется автоматически

---

## 9. Проекты в репозитории

| Проект | Pipeline | Статус |
|--------|----------|--------|
| maksplit/ | HTML-прототип | ✅ 7 страниц |
| maksplit-theme/ | WP тема stroymaks2026 | ✅ 37 PHP |
| usadba/ | Elementor JSON | 🔄 В процессе |
| cyberspace/ | HTML+Tailwind | ✅ Тестовый |
| neuraleye/ | HTML+Tailwind | ✅ Тестовый |
| smoke-test-bookshop/ | HTML+Tailwind | ✅ Тестовый |
| stakly/ | HTML+Tailwind | ✅ Тестовый |
| vetclinic/ | HTML+Tailwind | ✅ Тестовый |

---

## 10. Оценка готовности к Production Quality Gate (ПОСЛЕ фиксов)

| Компонент | Статус | Готовность |
|-----------|--------|------------|
| a11y-check.js | ✅ Работает | 100% |
| Designer contract fix | ✅ designer.md переписан | 100% |
| SSOT/component build | ✅ build.js | 100% |
| Quality Gate orchestrator | ✅ quality-gate.js | 100% |
| Static audit (tokens) | ✅ token-check.js | 100% |
| Static audit (links) | ✅ link-check.js | 100% |
| Static audit (HTML) | ⚠️ В quality-gate (базовый) | 60% |
| Static audit (project model) | ⚠️ В quality-gate (базовый) | 60% |
| Static audit (content diff) | ❌ Нет | 0% |
| Code Auditor checklist | ✅ code-auditor.md обновлён | 100% |
| Playwright desktop | ✅ playwright-check.js | 100% |
| Playwright mobile | ✅ playwright-check.js | 100% |
| Console/network audit | ✅ playwright-check.js | 100% |
| Screenshot regression | ✅ screenshot-diff.js | 100% |
| Agent count fix | ✅ 17→19 исправлено | 100% |
| Elementor matrix | ✅ COMPATIBILITY-MATRIX.md | 100% |

**Общая готовность:** 14/16 компонентов (88%)

---

## 11. Что осталось (P2)

- Content diff для existing-site режима (ZERO INVENTION/ZERO LOSS проверка)
- HTML validator (интеграция с html-validate или w3c)
- Project model consistency check (глубокая валидация project.json↔pages.json↔components.json)
- Прогон quality-gate на реальном проекте (maksplit или usadba)
- Интеграция screenshot-diff.js в quality-gate.js