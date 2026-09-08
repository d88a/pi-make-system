#!/bin/bash
# Storm Monitor — live status of active brainstorm sessions
# Usage: bash storm_monitor.sh [project_path]
# If no path given, shows all active pi sessions

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

show_session() {
    local PROJECT_PATH="$1"
    local PROJECT_NAME=$(basename "$PROJECT_PATH")
    local ABS_PATH=$(cd "$PROJECT_PATH" 2>/dev/null && pwd)
    local STRIPPED="${ABS_PATH#/}"
    local CONVERTED="${STRIPPED//\//-}"
    # A-33: FRAGILE — pi encodes the project path into a session dir name by
    # replacing "/" with "-" and wrapping in "--" (format below). Path
    # components that contain "-" (e.g. /home/ilya/my-project) collide with
    # slash boundaries, so the mapping is ambiguous and can mismatch projects.
    # This mirrors pi's current session dir convention; if that convention
    # changes, this lookup breaks. A robust fix needs dash-escaping in the
    # encoding (contract change, out of scope here). Scanning sessions/*/ and
    # matching by a project id in the jsonl is not reliable (no stable project
    # id field in the records), so the encoded-name lookup is kept.
    local SESSION_DIR_FORMAT="--%s--"
    local SESSION_DIR=$(printf "$SESSION_DIR_FORMAT" "$CONVERTED")
    local LATEST=$(ls -t "$HOME/.pi/agent/sessions/$SESSION_DIR"/*.jsonl 2>/dev/null | head -1)
    
    [ -z "$LATEST" ] && return
    
    local NOW=$(date +%s)
    local MOD_TS=$(date -d "$(stat -c '%y' "$LATEST" 2>/dev/null | cut -d. -f1)" +%s 2>/dev/null || echo 0)
    local AGE_MIN=$(( (NOW - MOD_TS) / 60 ))
    
    # Check if pi is running for this project
    local PI_PID=""
    for PID in $(ps aux | grep "[p]i$" | grep ilya | awk '{print $2}'); do
        local CWD=$(readlink /proc/$PID/cwd 2>/dev/null)
        if [ "$CWD" = "$ABS_PATH" ]; then
            PI_PID=$PID
            break
        fi
    done
    
    if [ -z "$PI_PID" ]; then
        return
    fi
    
    local ELAPSED=$(ps -p $PI_PID -o etime= 2>/dev/null | xargs)
    
    echo ""
    echo -e "${CYAN}━━━ $PROJECT_NAME ━━━${NC}"
    echo -e "  Pi: PID $PI_PID, uptime $ELAPSED"
    echo -e "  Session: $(echo "$LATEST" | xargs basename), last update ${AGE_MIN}min ago"
    
    # Process tree
    local HAS_ACTIVE=false
    for CHILD in $(ps --ppid $PI_PID -o pid= 2>/dev/null | xargs); do
        local CHILD_CMD=$(ps -p $CHILD -o args= 2>/dev/null | head -c 80)
        for GCHILD in $(ps --ppid $CHILD -o pid= 2>/dev/null | xargs); do
            for GGCHILD in $(ps --ppid $GCHILD -o pid= 2>/dev/null | xargs); do
                local GG_CMD=$(ps -p $GGCHILD -o args= 2>/dev/null | head -c 60)
                local GG_CPU=$(ps -p $GGCHILD -o %cpu= 2>/dev/null)
                local GG_ETIME=$(ps -p $GGCHILD -o etime= 2>/dev/null | xargs)
                local GG_RSS=$(ps -p $GGCHILD -o rss= 2>/dev/null | awk '{printf "%.0fM", $1/1024}')
                
                if [ -n "$GG_CPU" ] && [ "$(echo "$GG_CPU > 0" | bc 2>/dev/null)" = "1" ]; then
                    HAS_ACTIVE=true
                    if [ "$(echo "$GG_CPU > 50" | bc 2>/dev/null)" = "1" ]; then
                        echo -e "  ${GREEN}●${NC} PID $GGCHILD: CPU ${GG_CPU}%, $GG_RSS, $GG_ETIME"
                        echo -e "    $GG_CMD"
                    else
                        echo -e "  ${YELLOW}○${NC} PID $GGCHILD: CPU ${GG_CPU}%, $GG_RSS, $GG_ETIME"
                    fi
                fi
            done
        done
    done
    
    # Check progress files
    local PROGRESS_DIR="$ABS_PATH/memory/storm_progress"
    if [ -d "$PROGRESS_DIR" ]; then
        local LATEST_PROGRESS=$(ls -t "$PROGRESS_DIR"/*.md 2>/dev/null | head -1)
        if [ -n "$LATEST_PROGRESS" ]; then
            echo -e "  ${CYAN}📋 Progress:${NC}"
            tail -5 "$LATEST_PROGRESS" | sed 's/^/    /'
        fi
    fi
    
    if [ "$HAS_ACTIVE" = false ] && [ "$AGE_MIN" -lt 5 ]; then
        echo -e "  ${GREEN}●${NC} Архитектор думает (LLM запрос)..."
    elif [ "$HAS_ACTIVE" = false ] && [ "$AGE_MIN" -ge 5 ]; then
        echo -e "  ${YELLOW}⏳${NC} Ожидание ответа LLM (${AGE_MIN}min)..."
    fi
    
    # Last visible event
    python3 << PYEOF 2>/dev/null
import json
with open("$LATEST") as f:
    lines = f.readlines()
shown = 0
for line in reversed(lines[-30:]):
    if shown >= 3:
        break
    try:
        d = json.loads(line.strip())
        ts = d.get("timestamp","")
        msg = d.get("message",{})
        role = msg.get("role","?")
        content = msg.get("content","")
        if isinstance(content, list):
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    txt = item.get("text","")[:200].replace('\n',' ')
                    if len(txt) > 20:
                        print(f"  Last: [{ts[11:19]}] {role}: {txt}")
                        shown += 1
                        break
                elif isinstance(item, dict) and item.get("type") == "tool_use":
                    name = item.get("name", "?")
                    inp = item.get("input", {})
                    if name == "subagent":
                        tasks = inp.get("tasks", [])
                        n = len(tasks) if isinstance(tasks, list) else 1
                        agents = [t.get("agent","?") for t in tasks[:6] if isinstance(t, dict)]
                        print(f"  Last: [{ts[11:19]}] {role} \xe2\x86\x92 {n} agents: {', '.join(agents)}")
                        shown += 1
                        break
    except:
        pass
PYEOF
}

# Main
if [ -n "$1" ]; then
    show_session "$1"
else
    echo "╔══════════════════════════════════════════╗"
    echo "║  STORM MONITOR — активные штурмы         ║"
    echo "╚══════════════════════════════════════════╝"
    
    for PID in $(ps aux | grep "[p]i$" | grep ilya | awk '{print $2}'); do
        CWD=$(readlink /proc/$PID/cwd 2>/dev/null)
        [ -n "$CWD" ] && show_session "$CWD"
    done
fi
