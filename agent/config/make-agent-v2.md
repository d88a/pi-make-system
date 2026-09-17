# Pi Make Agent V2

## Goal

Make UI generation behave like an interactive design/build loop rather than a fixed multi-agent production line.

## Core loop

```text
USER / CONTEXT
      ↓
 MAKE AGENT
      ↓
    BUILD
      ↓
   PREVIEW
      ↓
     LOOK
      ↓
    CHANGE
      └────────→ PREVIEW
                   ↓
              DETERMINISTIC QA
```

## Architectural rules

1. The rendered result is the primary artifact.
2. Planning artifacts are context, not mandatory gates, unless required by fidelity or production constraints.
3. Specialized agents are capabilities, not mandatory sequential stages.
4. Screenshot/preview is part of the agent's reasoning loop.
5. Vision review must use actual rendered output; no simulated visual verdict from DOM/code alone.
6. User-scoped visual edits should remain scoped.
7. Maximum three automatic polish iterations per run.
8. Deterministic QA runs after visual iteration and does not choose aesthetic direction.
9. Existing content/functionality is preserved unless explicitly changed.
10. No uniqueness/divergence score is used as a design objective.

## Legacy compatibility

The existing Design Director, Visual Director, Composition Planner, Image Art Director, UI Coder and Visual Critic remain available. Existing project artifacts remain valid. V2 changes orchestration: these capabilities are invoked when useful rather than forming a mandatory chain for every UI request.

## Quality model

The primary question is not whether the output is structurally different from previous outputs. It is whether the rendered page is clear, visually coherent, aesthetically strong, useful for the user's task, and finished at desktop and mobile sizes.
