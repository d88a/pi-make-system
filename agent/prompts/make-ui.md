---
description: Сгенерировать UI через Design Director → Visual Director → Composition Planner → Image Art Director → UI Coder
argument-hint: "<что построить: лендинг / дашборд / приложение>"
---

# Make UI: $@

Ты — orchestration prompt для UI generation. НЕ пиши UI сам: делегируй design, visual, composition, image-art и UI coding stages.

## Mandatory pipeline — V6.1

```text
Input / source
  ↓
3 axes
  ↓
Design Director → design-brief.json
  ↓
Visual Director → visual-direction.json
  ↓
Composition Planner → composition-plan.json
  ↓
Image Art Director → image-art-direction.json
  ↓
Design System / Theme / Tokens
  ↓
UI Coder
  ↓
Image selection / generation
  ↓
Visual Reality Gate
  ↓
Playwright desktop + mobile
  ↓
Vision Critic / Polish
  ↓
Deterministic QA
```

## Inputs

Определи description, input_type, fidelity, scope, output_dir, project/page model, design system, design brief, visual direction, composition plan и source artifacts.

## Design stages

Для new / inspired-by / guided / free задач обязательны Design Director → Visual Director → Composition Planner.

Visual Director создаёт `visual-direction.json` по `agent/config/design-system/visual-direction.schema.json`.

Composition Planner создаёт `composition-plan.json` по `agent/config/design-system/composition-plan.schema.json`.

Не выбирай layout pattern как замену composition plan.

## Image Art Director — ОБЯЗАТЕЛЬНО

После Visual Direction + Composition Plan делегируй `image-art-director`.

Он создаёт `image-art-direction.json` по `agent/config/design-system/image-art-direction.schema.json` и фиксирует для каждого значимого asset:
- section / role;
- subject;
- framing;
- crop;
- light;
- negative space;
- camera;
- visual temperature;
- source requirement.

Image-first rule:
- `placehold.co` — запрещён;
- `picsum.photos` — запрещён;
- `via.placeholder.com` — запрещён;
- `dummyimage.com` — запрещён;
- серый блок с текстом вместо требуемого изображения — запрещён;
- один generic asset вместо нескольких primary project images — запрещён.

Если требуемого asset нет, generation не считается готовой. Не маскируй отсутствие изображения placeholder-ом.

## UI Coder

Передай UI-Coder явно:
`design-brief.json`, `visual-direction.json`, `image-art-direction.json`, `composition-plan.json`.

UI-Coder должен сохранить content integrity, реализовать composition и visual direction и использовать существующие или generated image assets.

## Visual Reality Gate — ОБЯЗАТЕЛЬНО

Перед screenshot запусти:
`node agent/scripts/visual-reality-gate.js <output>/index.html [output]/image-art-direction.json`

FAIL блокирует visual review. Исправление идёт через image pipeline/UI-Coder, после чего gate запускается повторно.

## Vision review

После PASS gate:
1. Playwright desktop + mobile;
2. vision-capable Visual Critic;
3. максимум 3 targeted polish iterations.

Visual Critic сначала проверяет Visual Reality, затем clarity → hierarchy → aesthetics → images → coherence → polish.

Если vision-модель недоступна — `BLOCKED`, не PASS.

## Existing site — ZERO LOSS

При `input_type=existing` сначала inventory всего контента. Не удалять/сокращать без требования. Не заменять реальные source images placeholders. После генерации выполнить content diff.

## Deterministic QA

После visual polish запускай code audit, a11y, links и consistency checks. Deterministic QA не заменяет screenshot review.

## Definition of Done

Нельзя считать задачу завершённой, пока:
- применимый `design-brief.json` существует;
- `visual-direction.json` валиден;
- `composition-plan.json` валиден;
- `image-art-direction.json` валиден;
- требуемые assets существуют и соответствуют art direction;
- Visual Reality Gate = PASS;
- vision screenshot review/polish = PASS;
- deterministic QA = PASS;
- project/page model согласованы.

Не оптимизируй uniqueness/diversity в ущерб качеству.
