#!/bin/bash
# search_common.sh — shared library for search scripts (A-27, audit 2026-06-30)
#
# Extracts common boilerplate previously duplicated across *_search.sh:
#   - proxy setup (source proxy_setup.sh)
#   - URL-encoding via python3 urllib.parse
#   - curl with unified retry / max-time (proxy picked up from env)
#
# Usage in a search script:
#   source "$(dirname "$0")/search_common.sh"
#   search_proxy_setup
#   ENCODED=$(url_encode "$QUERY")
#   RESPONSE=$(curl_search "$URL")
#
# NOTE: sourced library; defines functions only, no execution at load time.

# search_proxy_setup — single entry point for proxy configuration.
# Sources proxy_setup.sh which exports HTTP_PROXY/HTTPS_PROXY/NO_PROXY.
search_proxy_setup() {
    source "$(dirname "$0")/proxy_setup.sh"
}

# url_encode <string> [mode] — URL-encode a string via python3.
#   mode="" (default): urllib.parse.quote(safe='')  — spaces -> %20
#   mode="plus":       urllib.parse.quote_plus      — spaces -> + (form-style)
url_encode() {
    local mode="${2:-}"
    if [ "$mode" = "plus" ]; then
        python3 -c "import urllib.parse, sys; print(urllib.parse.quote_plus(sys.argv[1]))" "$1"
    else
        python3 -c "import urllib.parse, sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$1"
    fi
}

# curl_search <url> [extra curl opts...] — curl with unified retry/max-time.
# Proxy is applied automatically from HTTP_PROXY/HTTPS_PROXY env vars set by
# search_proxy_setup. Pass extra flags (e.g. -L) as leading args before URL.
curl_search() {
    curl -s --max-time 30 --retry 3 --retry-delay 2 --retry-all-errors "$@"
}
