# Composition Plan Protocol

`composition-plan.json` is the executable composition contract for generated pages.

## Pipeline

```text
user input
  ↓
Design Director → design-brief.json
  ↓
Composition Planner → composition-plan.json
  ↓
Design System / tokens
  ↓
UI Coder → HTML
  ↓
Screenshot → Designer → Polish
  ↓
Deterministic QA
```

## Responsibility split

| Artifact | Responsibility |
|---|---|
| `design-brief.json` | WHY: content strategy, hierarchy, aesthetic direction, brand character, forbidden patterns |
| `composition-plan.json` | HOW: hero composition, section order, rhythm, grid, focal points, image art direction |
| `design-tokens.json` | IMPLEMENTATION: colors, type, spacing, radius, shadows |
| `components.json` | REUSE: shared implementation units |
| HTML | EXECUTION |

## Non-negotiable rule

The UI Coder must never replace `composition-plan.json` with a corpus skeleton, canonical hero, or component-first page structure.

Corpus files and `composition-primitives.md` are implementation references only. They cannot override the composition plan.

## Validation

A generated page is composition-compliant only when:

- the hero composition matches the plan;
- section order matches `section_sequence`;
- section composition matches its declared purpose;
- rhythm is visibly reflected in spacing/density;
- grid and responsive break rules are respected;
- image subject/crop/negative-space direction is respected;
- forbidden composition patterns are absent.

A uniqueness score is NOT evidence of composition quality. `anti-template.js` remains a guard against obvious template signals, not a beauty metric.
