#!/bin/bash
# Firecrawl Search with key rotation
# Usage: firecrawl_search.sh "query" [limit] [time_filter]
# Example: firecrawl_search.sh "crypto cascade liquidations" 10 "qdr:w"

set -euo pipefail
# Source shared search helpers (proxy setup) — A-27
# NOTE: key rotation + flock below are firecrawl-specific (A-25), kept as-is.
source "$(dirname "$0")/search_common.sh"
search_proxy_setup

QUERY="${1:?Usage: firecrawl_search.sh <query> [limit] [time_filter] [--titles-only]}"
LIMIT="${2:-10}"
TIME_FILTER="${3:-}"

# Check for --titles-only flag (saves context by skipping full page content)
TITLES_ONLY=false
for arg in "$@"; do
    if [ "$arg" = "--titles-only" ]; then
        TITLES_ONLY=true
    fi
done

CONFIG_DIR="$HOME/.pi/agent/config"
STATE_FILE="$CONFIG_DIR/.firecrawl_key_index"
KEYS_FILE="$HOME/.pi/agent/secrets/search_keys.yaml"

# Extract keys from YAML (simple grep approach)
mapfile -t KEYS < <(grep -A 100 'firecrawl:' "$KEYS_FILE" | grep '^\s*- fc-' | sed 's/.*- //' | head -10)
TOTAL_KEYS=${#KEYS[@]}

if [ "$TOTAL_KEYS" -eq 0 ]; then
    echo "ERROR: No Firecrawl keys found in $KEYS_FILE" >&2
    exit 1
fi

# Lock the key index to prevent race conditions between parallel calls
# (duplicate key usage / false "all keys exhausted" from concurrent read-write).
# Hold the lock for the rotation+request loop; released on script exit (fd 9 closes).
INDEX_LOCK="$STATE_FILE.lock"
exec 9>"$INDEX_LOCK"
flock 9

# Get current key index (rotate)
if [ -f "$STATE_FILE" ]; then
    INDEX=$(cat "$STATE_FILE")
else
    INDEX=0
fi
INDEX=$((INDEX % TOTAL_KEYS))

# Search function with retry on 429
attempt=0
while [ $attempt -lt $TOTAL_KEYS ]; do
    KEY="${KEYS[$INDEX]}"
    KEY_NUM=$((INDEX + 1))
    
    echo "🔑 Using Firecrawl key $KEY_NUM/$TOTAL_KEYS (${KEY:0:12}...)" >&2
    
    # Build request body
    BODY="{\"query\": \"$QUERY\", \"limit\": $LIMIT"
    if [ -n "$TIME_FILTER" ]; then
        BODY="$BODY, \"tbs\": \"$TIME_FILTER\""
    fi
    if [ "$TITLES_ONLY" = true ]; then
        BODY="$BODY}"  # No scrapeOptions — titles + descriptions only
    else
        BODY="$BODY, \"scrapeOptions\": {\"formats\": [\"markdown\"]}}"
    fi
    
    RESPONSE=$(curl -s --retry 3 --retry-delay 2 --retry-all-errors -w "\n%{http_code}" -X POST 'https://api.firecrawl.dev/v1/search' \
        -H "Authorization: Bearer $KEY" \
        -H 'Content-Type: application/json' \
        -d "$BODY" 2>/dev/null)
    
    if [ $? -ne 0 ]; then
        echo "❌ Ошибка доступа к Firecrawl API. Попробуйте позже." >&2
        continue
    fi
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    BODY_RESP=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "429" ]; then
        echo "⚠️  Key $KEY_NUM rate limited (429). Switching to next key..." >&2
        INDEX=$(( (INDEX + 1) % TOTAL_KEYS ))
        echo "$INDEX" > "$STATE_FILE"
        attempt=$((attempt + 1))
        sleep 1
        continue
    fi
    
    if [ "$HTTP_CODE" = "402" ] || [ "$HTTP_CODE" = "403" ]; then
        echo "⚠️  Key $KEY_NUM exhausted/invalid ($HTTP_CODE). Switching..." >&2
        INDEX=$(( (INDEX + 1) % TOTAL_KEYS ))
        echo "$INDEX" > "$STATE_FILE"
        attempt=$((attempt + 1))
        continue
    fi
    
    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
        # Success — save index for next time (round-robin)
        NEXT_INDEX=$(( (INDEX + 1) % TOTAL_KEYS ))
        echo "$NEXT_INDEX" > "$STATE_FILE"
        
        # Check if we're on the last key
        if [ $INDEX -eq $((TOTAL_KEYS - 1)) ]; then
            echo "" >&2
            echo "⚠️  WARNING: All Firecrawl keys have been used in rotation." >&2
            echo "   Current: key $KEY_NUM/$TOTAL_KEYS. Consider adding more keys." >&2
            echo "" >&2
        fi
        
        echo "$BODY_RESP"
        exit 0
    fi
    
    echo "❌ Unexpected HTTP $HTTP_CODE from key $KEY_NUM" >&2
    echo "$BODY_RESP" >&2
    INDEX=$(( (INDEX + 1) % TOTAL_KEYS ))
    echo "$INDEX" > "$STATE_FILE"
    attempt=$((attempt + 1))
done

echo "❌ All $TOTAL_KEYS Firecrawl keys exhausted. Please add more keys to $KEYS_FILE" >&2
exit 1
