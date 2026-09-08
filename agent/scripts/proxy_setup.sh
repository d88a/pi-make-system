#!/bin/bash
# Proxy Setup — configures proxy from config/proxy.json (secrets out of source)
# Source in any search script: source "$(dirname "$0")/proxy_setup.sh"
# Exports: HTTP_PROXY, HTTPS_PROXY, NO_PROXY, PROXY_LABEL
#
# A-02 fix (audit 2026-06-30): creds read from config/proxy.json (gitignored),
#   no hardcode in source. Supersedes inline PROXY_RUS/PROXY_FOREIGN literals.
# A-07 fix (audit 2026-06-30): external IP cached (TTL 300s) to avoid leaking
#   the host IP to ifconfig.me / ipapi.co on every search-script invocation.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF="$SCRIPT_DIR/../config/proxy.json"
CACHE="$SCRIPT_DIR/../state/.proxy_ip_cache"
CACHE_TTL=300

read_proxy() {
  python3 -c "
import json
try:
    d=json.load(open('$CONF'))
    print(d.get('$1',{}).get('url',''))
except Exception:
    print('')
" 2>/dev/null
}
PROXY_RUS="$(read_proxy rus)"
PROXY_FOREIGN="$(read_proxy foreign)"

if [ -z "$PROXY_RUS" ] || [ -z "$PROXY_FOREIGN" ]; then
    echo "⚠️ [proxy] config/proxy.json missing or incomplete — proxies empty" >&2
fi

# A-07: cache {ip country} to skip network calls within TTL
IP=""
COUNTRY=""
need_refresh=1
if [ -f "$CACHE" ]; then
    age=$(( $(date +%s) - $(stat -c %Y "$CACHE" 2>/dev/null || echo 0) ))
    if [ "$age" -lt "$CACHE_TTL" ]; then
        need_refresh=0
        IP="$(python3 -c "import json;print(json.load(open('$CACHE')).get('ip',''))" 2>/dev/null)"
        COUNTRY="$(python3 -c "import json;print(json.load(open('$CACHE')).get('country',''))" 2>/dev/null)"
    fi
fi

if [ "$need_refresh" = "1" ]; then
    IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || true)
    if [ -n "$IP" ]; then
        INFO=$(curl -s --max-time 5 "https://ipapi.co/${IP}/json/" 2>/dev/null || true)
        COUNTRY=$(echo "$INFO" | python3 -c "import sys,json
try: print(json.load(sys.stdin).get('country_code',''))
except: print('')" 2>/dev/null || true)
    fi
    python3 -c "import json,time;json.dump({'ip':'$IP','country':'$COUNTRY','ts':int(time.time())},open('$CACHE','w'))" 2>/dev/null || true
    chmod 600 "$CACHE" 2>/dev/null || true
fi

if [ "$COUNTRY" = "RU" ]; then
    export HTTP_PROXY="$PROXY_RUS"
    export HTTPS_PROXY="$PROXY_RUS"
    PROXY_LABEL="RU"
    PROXY_URL="$PROXY_RUS"
else
    export HTTP_PROXY="$PROXY_FOREIGN"
    export HTTPS_PROXY="$PROXY_FOREIGN"
    PROXY_LABEL="EN"
    PROXY_URL="$PROXY_FOREIGN"
fi

export NO_PROXY="localhost,127.0.0.1"

if [ -n "$IP" ]; then
    echo "🌐 [proxy] IP: ${IP} (${COUNTRY:-?}), тип: ${PROXY_LABEL}" >&2
else
    echo "🌐 [proxy] IP не определён, fallback: ${PROXY_LABEL}" >&2
fi
