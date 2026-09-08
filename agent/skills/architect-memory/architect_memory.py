#!/usr/bin/env python3
"""
Architect Memory — manages per-project `.architect-memory.md` file.

Commands:
  read       — print current memory
  append     — append text to the memory
  init       — create a fresh memory file
  compress   — keep last 10 entries, summarize older ones
"""
import sys, os, json
from datetime import date
from pathlib import Path

PROJECT_ROOT = Path.cwd()
MEMORY_FILE = PROJECT_ROOT / ".architect-memory.md"


def find_project_root() -> Path:
    """Walk up from cwd to find project root (has .git or is under /home/ilya/<project>)."""
    p = PROJECT_ROOT.resolve()
    for parent in [p] + list(p.parents):
        if (parent / ".git").exists():
            return parent
    return PROJECT_ROOT


def cmd_read():
    if MEMORY_FILE.exists():
        print(MEMORY_FILE.read_text())
    else:
        print(f"No memory file found. Run `init` to create one at {MEMORY_FILE}")


def cmd_init():
    if MEMORY_FILE.exists():
        print(f"Memory already exists at {MEMORY_FILE}")
        return
    project_name = PROJECT_ROOT.name
    content = f"""# Architect Memory: {project_name}

## Structure
<!-- describe project layout -->

## Conventions
<!-- code conventions, libraries, patterns -->

## Decisions
<!-- log decisions here -->

## Current Task
<!-- what we are working on -->

## Open Questions
<!-- unresolved issues -->
"""
    MEMORY_FILE.write_text(content)
    print(f"Initialized memory at {MEMORY_FILE}")


def cmd_append():
    text = sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read().strip()
    if not text:
        print("Error: no text provided. Usage: append <text> or pipe text")
        sys.exit(1)
    if not MEMORY_FILE.exists():
        cmd_init()
    # Append new entry
    with open(MEMORY_FILE, "a") as f:
        f.write(f"\n{text}\n")
    print(f"Appended to {MEMORY_FILE}")


def cmd_compress():
    if not MEMORY_FILE.exists():
        print("No memory file to compress")
        return
    lines = MEMORY_FILE.read_text().splitlines(keepends=True)
    # Better approach: sections are top-level ## headings
    import re
    sections: list[tuple[str, list[str]]] = []
    current_section = ("_preamble", [])
    for line in lines:
        if re.match(r"^## \d{4}-\d{2}-\d{2}:", line):
            sections.append(current_section)
            current_section = (line.strip(), [])
        else:
            current_section[1].append(line)
    sections.append(current_section)
    # Separate log entries from other sections
    log_entries = [s for s in sections if re.match(r"^## \d{4}-\d{2}-\d{2}:", s[0])]
    other_sections = [s for s in sections if not re.match(r"^## \d{4}-\d{2}-\d{2}:", s[0])]
    if len(log_entries) <= 10:
        print(f"Only {len(log_entries)} entries, no compression needed")
        return
    # Summarize older entries
    to_summarize = log_entries[:-10]
    to_keep = log_entries[-10:]
    summary_lines = [f"### Archived: {date.today()}\n"]
    for heading, body in to_summarize:
        title = heading.replace("## ", "").strip()
        body_text = "".join(body).strip()
        summary_lines.append(f"- {title}: {body_text[:200]}...\n")
    summary_section = ("## Archived Log", ["\n"] + summary_lines)
    # Rebuild file
    result = []
    for heading, body in other_sections:
        result.extend([heading + "\n"] if heading != "_preamble" else [])
        result.extend(body)
    result.append("\n")
    result.append(summary_section[0] + "\n")
    result.extend(summary_section[1])
    result.append("\n")
    for heading, body in to_keep:
        result.append(heading + "\n")
        result.extend(body)
        result.append("\n")
    MEMORY_FILE.write_text("".join(result))
    print(f"Compressed {len(to_summarize)} old entries into archive section")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "read":
        cmd_read()
    elif cmd == "init":
        cmd_init()
    elif cmd == "append":
        cmd_append()
    elif cmd == "compress":
        cmd_compress()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
