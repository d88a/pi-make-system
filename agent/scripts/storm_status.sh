#!/bin/bash
# Storm Status — показывает текущее состояние активного штурма в проекте
# Использование: bash ~/.pi/agent/scripts/storm_status.sh [project_path]

PROJECT_PATH="${1:-.}"
PROJECT_NAME=$(basename "$PROJECT_PATH")

# Convert path to session dir format
# /media/sf_sip_both/change/absorb → --media-sf_sip_both-change-absorb--
# /home/ilya/mex → --home-ilya-mex--
# Strip leading /, replace remaining / with -, wrap with --
ABS_PATH=$(cd "$PROJECT_PATH" && pwd)
STRIPPED="${ABS_PATH#/}"
CONVERTED="${STRIPPED//\//-}"
SESSION_DIR_NAME="--${CONVERTED}--"
SESSIONS_DIR="$HOME/.pi/agent/sessions"

# Find latest session for this project
LATEST=$(ls -t "$SESSIONS_DIR/$SESSION_DIR_NAME"/*.jsonl 2>/dev/null | head -1)

if [ -z "$LATEST" ]; then
    echo "❌ Сессия для $PROJECT_PATH не найдена"
    exit 1
fi

SESSION_SIZE=$(wc -c < "$LATEST" 2>/dev/null || echo 0)
SESSION_LINES=$(wc -l < "$LATEST" 2>/dev/null || echo 0)
SESSION_MODIFIED=$(stat -c "%y" "$LATEST" 2>/dev/null | cut -d. -f1)
NOW=$(date +%s)
MODIFIED_TS=$(date -d "$SESSION_MODIFIED" +%s 2>/dev/null || echo 0)
AGE_SEC=$((NOW - MODIFIED_TS))
AGE_MIN=$((AGE_SEC / 60))

echo "╔══════════════════════════════════════════╗"
echo "║  ШТУРМ: $PROJECT_NAME"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Сессия: $(basename "$LATEST")"
echo "Размер: $(echo "$SESSION_SIZE" | awk '{printf "%.1f MB", $1/1024/1024}') | $SESSION_LINES сообщений"
echo "Обновлена: $AGE_MIN мин назад"

# Pi processes for this project
echo ""
echo "━━━ Pi процессы ━━━"
for PID in $(ps aux | grep "[p]i$" | grep ilya | awk '{print $2}'); do
    CWD=$(readlink /proc/$PID/cwd 2>/dev/null || echo "")
    if [ "$CWD" = "$PROJECT_PATH" ]; then
        RSS=$(ps -p $PID -o rss= 2>/dev/null | awk '{printf "%.0f MB", $1/1024}')
        ELAPSED=$(ps -p $PID -o etime= 2>/dev/null | xargs)
        STATE=$(cat /proc/$PID/status 2>/dev/null | grep "^State:" | awk '{print $2, $3}')
        echo "  PID $PID: $RSS, uptime $ELAPSED, $STATE"
        
        # Check children
        for CHILD in $(ps --ppid $PID -o pid= 2>/dev/null); do
            CHILD_RSS=$(ps -p $CHILD -o rss= 2>/dev/null | awk '{printf "%.0f MB", $1/1024}')
            CHILD_ELAPSED=$(ps -p $CHILD -o etime= 2>/dev/null | xargs)
            CHILD_CMD=$(ps -p $CHILD -o cmd= 2>/dev/null | head -c 100)
            echo "    └─ PID $CHILD: $CHILD_RSS, uptime $CHILD_ELAPSED"
            echo "       $CHILD_CMD"
            
            # Check grandchildren (python, etc.)
            for GCHILD in $(ps --ppid $CHILD -o pid= 2>/dev/null); do
                GCHILD_RSS=$(ps -p $GCHILD -o rss= 2>/dev/null | awk '{printf "%.0f MB", $1/1024}')
                GCHILD_CPU=$(ps -p $GCHILD -o %cpu= 2>/dev/null)
                GCHILD_ELAPSED=$(ps -p $GCHILD -o etime= 2>/dev/null | xargs)
                GCHILD_CMD=$(ps -p $GCHILD -o args= 2>/dev/null | head -c 120)
                echo "         └─ PID $GCHILD: $GCHILD_RSS, CPU $GCHILD_CPU%, uptime $GCHILD_ELAPSED"
                echo "            $GCHILD_CMD"
            done
        done
    fi
done

# Parse last messages from session
echo ""
echo "━━━ Последние события ━━━"
python3 << PYEOF
import json, sys

with open("$LATEST") as f:
    lines = f.readlines()

# Show last 8 meaningful events
shown = 0
for line in reversed(lines):
    if shown >= 8:
        break
    line = line.strip()
    if not line:
        continue
    try:
        d = json.loads(line)
        ts = d.get("timestamp", "")
        if not ts.startswith("2026-06-21"):
            continue
        
        msg = d.get("message", {})
        role = msg.get("role", "?")
        content = msg.get("content", "")
        
        if isinstance(content, list):
            for item in content:
                if isinstance(item, dict):
                    t = item.get("type", "")
                    if t == "text":
                        txt = item.get("text", "")
                        if len(txt) > 30:
                            preview = txt[:300].replace('\n', ' ')
                            print(f"  [{ts[11:19]}] {role}: {preview}")
                            shown += 1
                            break
                    elif t == "tool_use":
                        name = item.get("name", "?")
                        inp = item.get("input", {})
                        if name == "subagent":
                            tasks = inp.get("tasks", [])
                            if isinstance(tasks, list):
                                agents = [t.get("agent", "?") for t in tasks if isinstance(t, dict)]
                                print(f"  [{ts[11:19]}] {role} → ЗАПУСК {len(tasks)} агентов: {', '.join(agents)}")
                            else:
                                print(f"  [{ts[11:19]}] {role} → ЗАПУСК: {inp.get('agent', '?')}")
                            shown += 1
                        elif name == "bash":
                            cmd = inp.get("command", "")[:100].replace('\n', ' ')
                            print(f"  [{ts[11:19]}] {role} → BASH: {cmd}")
                            shown += 1
                        elif name == "read":
                            print(f"  [{ts[11:19]}] {role} → READ: {inp.get('path', '?')}")
                            shown += 1
                        elif name == "write":
                            print(f"  [{ts[11:19]}] {role} → WRITE: {inp.get('path', '?')}")
                            shown += 1
                    elif t == "toolResult":
                        pass  # Skip tool results for cleaner output
    except:
        pass
PYEOF

echo ""
echo "━━━ Активность в последний час ━━━"
# Count messages in last hour
HOUR_AGO=$(date -d "1 hour ago" +%Y-%m-%dT%H:%M 2>/dev/null)
python3 << PYEOF
import json

with open("$LATEST") as f:
    lines = f.readlines()

roles = {}
tools = {}
for line in lines:
    try:
        d = json.loads(line.strip())
        ts = d.get("timestamp", "")
        if ts < "$HOUR_AGO":
            continue
        msg = d.get("message", {})
        role = msg.get("role", "?")
        content = msg.get("content", "")
        
        roles[role] = roles.get(role, 0) + 1
        
        if isinstance(content, list):
            for item in content:
                if isinstance(item, dict) and item.get("type") == "tool_use":
                    name = item.get("name", "?")
                    tools[name] = tools.get(name, 0) + 1
    except:
        pass

for role, count in sorted(roles.items(), key=lambda x: -x[1]):
    print(f"  {role}: {count} сообщений")

if tools:
    print()
    print("  Инструменты:")
    for name, count in sorted(tools.items(), key=lambda x: -x[1]):
        print(f"    {name}: {count}")
PYEOF
