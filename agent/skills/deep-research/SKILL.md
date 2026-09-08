---
name: deep-research
description: >
  Исследовательский режим: наблюдения → гипотезы → эксперименты → инсайты.
  Используется при мозговом штурме, выдвижении гипотез, ночной автономной работе.
triggers:
  - brainstorm
  - hypothesis
  - research
  - observation
  - experiment
---

# Deep Research Skill

## Research Notebook

Каждый проект имеет `memory/research/` с 4 файлами:

| Файл | Назначение |
|------|-----------|
| `observations.md` | Сырые наблюдения (свободная форма) |
| `hypotheses.md` | Гипотезы с lifecycle |
| `experiments.md` | Методы проверки + результаты |
| `insights.md` | Подтверждённые выводы |

## Lifecycle знания

```
Наблюдение → Гипотеза → Эксперимент → Инсайт
    ↓           ↓           ↓           ↓
(сырое)    (proposed)  (completed) (validated)
                ↓
          (killed/frozen)
```

## Записи в каждом файле

### observations.md

```markdown
## YYYY-MM-DD HH:MM

<Сырое наблюдение в свободной форме>
Что заметил. Почему обратил внимание. Догадки.
```

### hypotheses.md

```markdown
## H-NNN: <название>
**Status:** proposed | testing | validated | killed | frozen
**Created:** YYYY-MM-DD
**Confidence:** 0.0 — 1.0
**Evidence:** observations.md:YYYY-MM-DD, EXP-NNN
**Rationale:** <почему так думаем>
**How to test:** <как проверить>
**Related:** H-XXX, INS-XXX
```

### experiments.md

```markdown
## EXP-NNN: <название>
**Hypothesis:** H-NNN
**Status:** proposed | running | completed
**Methodology:** <методология>
**Results:** <результаты>
**Conclusion:** <вывод>
**Created:** YYYY-MM-DD
```

### insights.md

```markdown
## INS-NNN: <название>
**Confidence:** 0.0 — 1.0
**Evidence:** H-NNN, EXP-NNN
**Insight:** <формулировка>
**Implications:** <что это значит для стратегии>
```

## Когда использовать

- Мозговой штурм (`/brainstorm`)
- Выдвижение гипотез
- Анализ данных
- Ночная автономная работа
- Запрос внешнего эксперта (`/expert`)

## Правила

1. Наблюдения — свободная форма, не фильтруй
2. Гипотезы — всегда с rationale и how-to-test
3. Эксперименты — всегда с methodology и results
4. Инсайты — только после подтверждения (confidence >= 0.7)
5. KILLED гипотезы — НЕ удаляй, сохраняй с причиной
6. Критические insights (>= 0.7) → summaries в project/AGENTS.md
