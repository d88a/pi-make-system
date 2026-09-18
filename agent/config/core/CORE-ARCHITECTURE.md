# Pi Make Core V1

## Purpose

Pi Make Core is a local visual development runtime for AI-driven website creation and editing.

The core is not a fixed chain of design agents. It is a stateful loop in which one Make Agent can inspect the project, build or edit it, render it, observe the rendered result, and make another targeted change.

## Primary loop

USER / CONTEXT -> UNDERSTAND -> BUILD / EDIT -> RUN -> PREVIEW -> OBSERVE -> DECIDE -> EDIT -> RUN -> PREVIEW

Deterministic verification happens after the visual loop.

## Core invariants

1. The rendered project is the primary artifact.
2. Project state is persistent and inspectable.
3. The agent must be able to run the project and obtain a real preview.
4. Visual observation is based on rendered output, never inferred only from source code.
5. An edit should be attributable to an observed problem or explicit user request.
6. Specialized capabilities are optional tools, not mandatory pipeline stages.
7. No uniqueness, anti-template, or diversity score is a design objective.
8. Existing content and functionality are preserved unless explicitly changed.
9. User-scoped changes remain scoped.
10. Deterministic QA verifies objective properties but does not decide aesthetic direction.

## Core state

A run has: project root, stack/runtime, pages and entry points, source/content inventory, assets, references, current preview state, screenshot history, edit history, runtime errors, and verification results.

## Modes

Create, Edit, Reference, Pixel-perfect, Production.

Production adapters add constraints without replacing the core loop.

## Capabilities

Project inspection; file read/write/edit; runtime start/stop; browser navigation; screenshot; DOM inspection; computed-style inspection; asset discovery/generation; reference analysis; code audit; accessibility audit; link/HTML checks; WordPress/Elementor adapters.

A capability is invoked because the current task needs it.

## Quality hierarchy

1. User task and content clarity
2. Usability
3. Visual hierarchy
4. Aesthetic quality
5. Coherence
6. Brand character
7. Experimental detail

## Explicitly outside the core

Design Brief JSON, Visual Direction JSON, Composition Plan JSON, Image Art Direction JSON, anti-template scoring, uniqueness scoring, and mandatory multi-agent chains are not core gates.

Legacy artifacts remain readable for compatibility.

## Run termination

A run ends when the requested change is implemented, the rendered result has been observed when visual work is involved, critical issues are addressed or recorded, and applicable deterministic verification has run.

A weak result is allowed to end as FAIL. The system must not manufacture PASS by relaxing criteria.
