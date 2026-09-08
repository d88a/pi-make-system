#!/bin/bash
# Hacker News Search (via Algolia) — free, no API key needed
# Usage: hn_search.sh <query> [limit]
# Examples:
#   hn_search.sh "crypto market microstructure"
#   hn_search.sh "order book trading bot" 10

set -euo pipefail
# Source shared search helpers (proxy / url-encode / curl-retry) — A-27
source "$(dirname "$0")/search_common.sh"
search_proxy_setup

QUERY="${1:?Usage: hn_search.sh <query> [limit]}"
LIMIT="${2:-5}"

ENCODED_QUERY=$(url_encode "$QUERY")

URL="https://hn.algolia.com/api/v1/search?query=${ENCODED_QUERY}&tags=story&hitsPerPage=${LIMIT}"

RESPONSE=$(curl_search "$URL")

if [ $? -ne 0 ]; then
    echo "❌ Ошибка доступа к HN Algolia API. Попробуйте позже." >&2
    exit 1
fi

echo "$RESPONSE" | python3 -c "
import sys, json
from datetime import datetime

d = json.load(sys.stdin)
hits = d.get('hits', [])
total = d.get('nbHits', 0)

print(f'Total HN stories: {total}, showing {len(hits)}')
print()

for h in hits:
    title = h.get('title', '?')
    points = h.get('points', 0)
    comments = h.get('num_comments', 0)
    author = h.get('author', '?')
    created = h.get('created_at', '')[:10]
    url = h.get('url', '')
    hn_url = f'https://news.ycombinator.com/item?id={h.get(\"objectID\", \"\")}'

    print(f'[{created}] {title} (▲{points}, 💬{comments})')
    print(f'  Author: {author}')
    if url:
        print(f'  URL: {url}')
    print(f'  HN: {hn_url}')
    print()
"
