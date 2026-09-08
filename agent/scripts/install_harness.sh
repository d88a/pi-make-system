#!/bin/bash
# Pi Harness Installer from GitHub
# Usage: install_harness.sh <github_repo_url> [--update]
#
# NO interactive questions — fully automated.
# Detects project directory from CWD.
# Uses CLIPPROXY_HOST env var or default 192.168.0.8.

set -e

REPO_URL="$1"
MODE="${2:-install}"

if [ -z "$REPO_URL" ]; then
    echo "Usage: install_harness.sh <github_repo_url> [--update]"
    exit 1
fi

PI_AGENT_DIR="$HOME/.pi/agent"
PROJECT_DIR="$(pwd)"
TEMP_DIR="/tmp/pi-harness-install-$$"
CLIP_IP="${CLIPPROXY_HOST:-192.168.0.8}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$MODE" = "--update" ]; then
    echo "  Pi Harness UPDATE"
else
    echo "  Pi Harness INSTALL"
fi
echo "  Repo:    $REPO_URL"
echo "  Project: $PROJECT_DIR"
echo "  ClipProxy: $CLIP_IP:8320"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check git
if ! command -v git &>/dev/null; then
    echo "[ERROR] git not found"
    exit 1
fi

# Clone (always fresh clone — simpler than tracking temp state)
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
echo "Cloning..."
if ! git clone "$REPO_URL" "$TEMP_DIR/pi-harness" 2>&1; then
    echo "[ERROR] git clone failed"
    exit 1
fi

HARNESS_DIR="$TEMP_DIR/pi-harness"

# Check structure
if [ ! -d "$HARNESS_DIR/pi-agent" ]; then
    echo "[ERROR] Repository does not contain pi-agent/ directory"
    exit 1
fi

echo "Repository cloned successfully"
echo ""

# Backup existing (only on first install, not updates)
if [ "$MODE" != "--update" ] && [ -d "$PI_AGENT_DIR/agents" ]; then
    BACKUP="$PI_AGENT_DIR.backup.$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$BACKUP"
    cp -r "$PI_AGENT_DIR/"* "$BACKUP/" 2>/dev/null || true
    echo "Backup: $BACKUP"
fi

# Install pi-agent/ → ~/.pi/agent/
echo "Installing pi-agent/ → $PI_AGENT_DIR/"
mkdir -p "$PI_AGENT_DIR"

for dir in agents extensions skills scripts prompts config; do
    if [ -d "$HARNESS_DIR/pi-agent/$dir" ]; then
        mkdir -p "$PI_AGENT_DIR/$dir"
        cp -r "$HARNESS_DIR/pi-agent/$dir/"* "$PI_AGENT_DIR/$dir/" 2>/dev/null || true
        COUNT=$(find "$PI_AGENT_DIR/$dir" -type f | wc -l)
        echo "  ✅ $dir/ ($COUNT files)"
    fi
done

for file in settings.json AGENTS.md; do
    if [ -f "$HARNESS_DIR/pi-agent/$file" ]; then
        cp "$HARNESS_DIR/pi-agent/$file" "$PI_AGENT_DIR/$file"
        echo "  ✅ $file"
    fi
done

# Patch clipproxy URL
if [ -f "$PI_AGENT_DIR/settings.json" ]; then
    if grep -q "CLIPPROXY_HOST" "$PI_AGENT_DIR/settings.json"; then
        sed -i "s/CLIPPROXY_HOST/$CLIP_IP/g" "$PI_AGENT_DIR/settings.json"
    fi
    # Also try to detect and use local IP if on same network
    echo "  ✅ settings.json (clipproxy: $CLIP_IP)"
fi

# Init project
if [ -d "$HARNESS_DIR/project-template" ]; then
    echo ""
    echo "Initializing project in: $PROJECT_DIR"
    
    # AGENTS.md
    if [ ! -f "$PROJECT_DIR/AGENTS.md" ]; then
        if [ -f "$HARNESS_DIR/project-template/AGENTS.md" ]; then
            cp "$HARNESS_DIR/project-template/AGENTS.md" "$PROJECT_DIR/AGENTS.md"
            echo "  ✅ AGENTS.md"
        fi
    else
        echo "  ⏭️  AGENTS.md already exists"
    fi
    
    # memory/
    if [ ! -d "$PROJECT_DIR/memory" ]; then
        mkdir -p "$PROJECT_DIR/memory/research"
        for f in STATUS DECISIONS FROZEN ISSUES ROLES ARCHITECTURE; do
            echo "# $f" > "$PROJECT_DIR/memory/$f.md"
        done
        for f in observations hypotheses experiments insights; do
            echo "# $f" > "$PROJECT_DIR/memory/research/$f.md"
        done
        echo "  ✅ memory/ structure"
    else
        echo "  ⏭️  memory/ already exists"
    fi
fi

# Agent memory directories — A-35: scan agents/*.md (by filename) instead of a hardcoded list
AGENT_MEM_ROOT="$HOME/.pi/agent-memory"
if [ -d "$PI_AGENT_DIR/agents" ]; then
    while IFS= read -r agent_md; do
        [ -z "$agent_md" ] && continue
        agent="$(basename "$agent_md" .md)"
        [ -n "$agent" ] && mkdir -p "$AGENT_MEM_ROOT/$agent"
    done < <(find "$PI_AGENT_DIR/agents" -maxdepth 1 -type f -name '*.md' 2>/dev/null)
else
    echo "  ⚠️  no $PI_AGENT_DIR/agents/ dir — skipping agent-memory dirs" >&2
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ DONE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Project: $PROJECT_DIR"
echo "Harness: $PI_AGENT_DIR/"
echo "ClipProxy: $CLIP_IP:8320"
echo ""
if [ "$MODE" = "--update" ]; then
    echo "Harness updated. Restart pi to apply changes."
else
    echo "To start: cd $PROJECT_DIR && pi"
fi
echo ""
