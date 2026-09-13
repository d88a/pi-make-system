---
description: Сгенерировать UI через Design Director → Composition Planner → UI Coder
argument-hint: "<что построить: лендинг / дашборд / приложение>"
---

# Make UI: $@

Ты — orchestration prompt для UI generation. НЕ пиши UI сам: делегируй `ui-coder`.

## Mandatory design pipeline

```text
Input / source
  ↓
3 axes: input_type × fidelity × scope
  ↓
Design Director → design-brief.json (WHY)
  ↓
Composition Planner → composition-plan.json (HOW)
  ↓
Design System / Theme / Tokens (WITH WHAT)
  ↓
UI Coder (EXECUTE)
  ↓
Images / art direction
  ↓
Screenshot / Designer review / Polish
  ↓
Deterministic QA
```

Для new / inspired-by / guided / free задач Design Director обязателен. Для existing/reference сохраняй соответствующий fidelity/extraction pipeline, но при новом дизайне также используй Design Brief.

## Inputs

Архитектор должен определить:
- `description` — что строим;
- `input_type` — reference / references / frankenstein / existing / brand / description / nothing;
- `fidelity` — pixel-perfect / inspired-by / guided / free;
- `scope` — single-page / multi-page / app / fix;
- `output_dir`;
- `project_model` / `pages.json`;
- `design_system` / theme;
- `design_brief` — путь к `design-brief.json`;
- `composition_plan` — путь к `composition-plan.json`;
- reference/source artifacts, если есть.

Не выбирай `layout_pattern` как замену composition plan.

## Design Director

До design system делегируй Design Director. Он создаёт `design-brief.json` с:
- content strategy;
- visual hierarchy;
- aesthetic direction;
- brand character;
- visual principles;
- forbidden patterns.

Приоритет: content clarity → user task → visual hierarchy → aesthetics → individuality → experimental details.

## Composition Planner — ОБЯЗАТЕЛЬНО

После Design Brief и до UI-Coder делегируй Composition Planner.

Он читает `design-brief.json`, `project.json`, `pages.json` и source content и создаёт `composition-plan.json` по `agent/config/design-system/composition-plan.schema.json`.

Для КАЖДОЙ страницы определи:
- visual intent / focal points;
- hero composition;
- content position / text width / CTA / nav;
- section sequence с purpose и composition;
- rhythm;
- grid + responsive break rules;
- image direction: subject, composition, crop, light, negative space, camera;
- forbidden composition patterns.

Не придумывай контент. Не делай один универсальный skeleton для всех страниц.

## UI Coder

Передай `design-brief.json` и `composition-plan.json` явно. UI-Coder обязан считать composition plan SSOT композиции.

Design system, themes, corpus (`layout-patterns.md`, `palette-patterns.md`, `composition-primitives.md`, `mood-axis.md`) — implementation vocabulary. Они не могут переопределять plan.

UI-Coder должен:
1. реализовать plan без нормализации в `hero → features → grid → cta`;
2. сохранить content integrity;
3. использовать design tokens;
4. переиспользовать canonical components там, где они совместимы с plan;
5. обеспечить responsive + accessibility;
6. использовать image direction при подборе/генерации изображений;
7. передать claims только как декларацию, не как доказательство.

Если composition plan отсутствует — остановить генерацию.

## Theme / corpus

Тема — предложение под контекст, а не тупое правило по нише. При наличии brand colors сохраняй brand intent. Corpus используется для анализа и реализации, но не для принудительного выбора skeleton.

Запрещено оптимизировать «уникальность» за счёт ухудшения понимания. Красота должна помогать контенту.

## Existing site — ZERO LOSS

Если `input_type=existing`:
- inventory всего контента ДО генерации;
- тексты, изображения, ссылки, цены и характеристики — источник истины;
- не удалять и не сокращать без явного требования;
- не заменять реальные изображения placeholders;
- после генерации выполнить content diff;
- fidelity меняет дизайн, но не разрешает выдумывать/терять контент.

Источник приоритетов: DB/export → scraping fallback → vision только для визуального анализа.

Для WordPress сохраняй существующий DB preflight и `wp-integration` pipeline.

## Vision

Если задача требует reference/frankenstein vision и vision-модель недоступна — pipeline остановить. Не заменять vision текстовым предположением.

## Handoff и review

После UI-Coder:
1. image selection/generation по `image_direction`;
2. Playwright desktop + mobile;
3. Designer review: clarity → hierarchy → aesthetics → polish;
4. если проблема композиции — изменить `composition-plan.json` и повторить UI-Coder;
5. если implementation problem — исправить UI без изменения plan;
6. deterministic quality gate / a11y / links / consistency.

## Definition of Done

Нельзя считать задачу завершённой, пока:
- применимый `design-brief.json` существует;
- `composition-plan.json` валиден для каждой страницы;
- UI реализует plan;
- контент не потерян и ничего не выдумано;
- screenshot review/polish пройдены;
- deterministic QA пройден;
- project/page model согласованы.