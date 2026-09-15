---
description: Сгенерировать UI через Design Director → Visual Director → Composition Planner → UI Coder
argument-hint: "<что построить: лендинг / дашборд / приложение>"
---

# Make UI: $@

Ты — orchestration prompt для UI generation. НЕ пиши UI сам: делегируй `design-director`, `visual-director`, `composition-planner` и `ui-coder`.

## Mandatory design pipeline

```text
Input / source
  ↓
3 axes: input_type × fidelity × scope
  ↓
Design Director → design-brief.json (WHY)
  ↓
Visual Director → visual-direction.json (LOOK)
  ↓
Composition Planner → composition-plan.json (HOW)
  ↓
Design System / Theme / Tokens (WITH WHAT)
  ↓
UI Coder (EXECUTE)
  ↓
Images / art direction
  ↓
Screenshot / Vision Designer review / Polish
  ↓
Deterministic QA
```

Для new / inspired-by / guided / free задач Design Director и Visual Director обязательны. Для existing/reference сохраняй соответствующий fidelity/extraction pipeline; при новом дизайне также используй Design Brief и Visual Direction.

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
- `visual_direction` — путь к `visual-direction.json`;
- `composition_plan` — путь к `composition-plan.json`;
- reference/source artifacts, если есть.

Не выбирай `layout_pattern` как замену composition plan.

## Visual Director — ОБЯЗАТЕЛЬНО

После Design Brief и до Composition Planner делегируй Visual Director.

Он читает Design Brief + 3–5 сильных референсов и создаёт `visual-direction.json` по `agent/config/design-system/visual-direction.schema.json`.

Он фиксирует:
- visual concept;
- reference-derived principles;
- typography direction;
- image art direction;
- scale relationships;
- whitespace strategy;
- visual rhythm;
- section transitions;
- signature visual moves;
- quality bar;
- avoid.

Не копировать референсы и не собирать Frankenstein. Цель — цельный оригинальный визуальный язык.

## Composition Planner — ОБЯЗАТЕЛЬНО

После Design Brief + Visual Direction и до UI-Coder делегируй Composition Planner.

Он читает `design-brief.json`, `visual-direction.json`, `project.json`, `pages.json` и source content и создаёт `composition-plan.json` по `agent/config/design-system/composition-plan.schema.json`.

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

Передай `design-brief.json`, `visual-direction.json` и `composition-plan.json` явно. UI-Coder обязан считать Visual Direction SSOT визуального языка, а Composition Plan SSOT композиции.

Design system, themes, corpus (`layout-patterns.md`, `palette-patterns.md`, `composition-primitives.md`, `mood-axis.md`) — implementation vocabulary. Они не могут переопределять Visual Direction или plan.

UI-Coder должен:
1. реализовать visual direction и plan без нормализации в `hero → features → grid → cta`;
2. сохранить content integrity;
3. использовать design tokens;
4. переиспользовать canonical components там, где они совместимы с plan;
5. обеспечить responsive + accessibility;
6. использовать image direction + visual art direction при подборе/генерации изображений;
7. передать claims только как декларацию, не как доказательство.

Если visual direction или composition plan отсутствует — остановить генерацию.

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
1. image selection/generation по `image_direction` + visual art direction;
2. Playwright desktop + mobile;
3. Vision-capable Designer/Visual Critic: clarity → hierarchy → aesthetics → image quality → coherence → polish;
4. максимум 3 targeted polish iterations;
5. если проблема композиции — изменить `composition-plan.json`;
6. если проблема visual language — изменить `visual-direction.json`;
7. если implementation problem — исправить UI без изменения SSOT;
8. deterministic quality gate / a11y / links / consistency.

## Definition of Done

Нельзя считать задачу завершённой, пока:
- применимый `design-brief.json` существует;
- `visual-direction.json` валиден для применимого типа задачи;
- `composition-plan.json` валиден для каждой страницы;
- UI реализует Visual Direction + plan;
- изображения соответствуют art direction;
- vision screenshot review/polish пройдены;
- deterministic QA пройден;
- project/page model согласованы.
