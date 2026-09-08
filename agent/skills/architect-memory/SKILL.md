---
name: architect-memory
description: >
  Maintains a project memory file (`.architect-memory.md`) that tracks architecture decisions,
  code conventions, project structure, and current task context. The model should update this
  file after significant exchanges to persist context across sessions.
metadata:
  category: development
  platform: per-project
  triggers: any significant architectural decision, convention change, or task completion
---

# Architect Memory

Maintains a living project memory file in the project root. This memory survives across sessions — when you start a new chat, you can read the memory to restore context.

## Memory File

`<project_root>/.architect-memory.md`

## Commands

### Read current memory
```bash
python3 /home/ilya/.pi/agent/skills/architect-memory/architect_memory.py read
```

### Append a new memory entry
```bash
python3 /home/ilya/.pi/agent/skills/architect-memory/architect_memory.py append "## 2026-06-19: Decision to use DeepSeek V4 Pro\n- Reason: best reasoning model with 16 working keys (most stable)\n- Context window: 128K"
```

### Initialize memory for a new project
```bash
python3 /home/ilya/.pi/agent/skills/architect-memory/architect_memory.py init
```

### Compress old entries (keeps last 10, summarizes older ones)
```bash
python3 /home/ilya/.pi/agent/skills/architect-memory/architect_memory.py compress
```

## When to Update Memory

Update the memory whenever:
1. A significant architectural decision is made
2. A code convention is established or changed
3. Project structure is modified (new modules, files)
4. A task is completed (mark it done)
5. A blocker or open question is identified
6. Dependencies or libraries are added/changed

## Memory Format

```
# Architect Memory: <project-name>

## Structure
<overview of project files and their responsibilities>

## Conventions
<naming, patterns, libraries, testing approach>

## Decisions
### YYYY-MM-DD: <title>
- Context: why this was considered
- Decision: what was chosen
- Rationale: why

## Current Task
<what we're working on now>

## Open Questions
- <question 1>
- <question 2>

## Log
### YYYY-MM-DD: <title>
<summary of what happened>
```
