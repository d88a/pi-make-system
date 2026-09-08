#!/bin/bash
# GitHub Search — free, no API key needed (60 req/h without key)
# Usage: github_search.sh <query> [limit] [language]
# Examples:
#   github_search.sh "crypto orderbook prediction"
#   github_search.sh "market microstructure" 5 python
#   github_search.sh "trading bot framework" 10

set -euo pipefail
# Source shared search helpers (proxy / url-encode / curl-retry) — A-27
source "$(dirname "$0")/search_common.sh"
search_proxy_setup

QUERY="${1:?Usage: github_search.sh <query> [limit] [language]}"
LIMIT="${2:-5}"
LANGUAGE="${3:-}"

FULL_QUERY="$QUERY"
if [ -n "$LANGUAGE" ]; then
    FULL_QUERY="$QUERY language:$LANGUAGE"
fi

ENCODED_QUERY=$(url_encode "$FULL_QUERY")

URL="https://api.github.com/search/repositories?q=${ENCODED_QUERY}&sort=stars&order=desc&per_page=${LIMIT}"

RESPONSE=$(curl_search "$URL")

if [ $? -ne 0 ]; then
    echo "❌ Ошибка доступа к GitHub API. Попробуйте позже." >&2
    exit 1
fi

echo "$RESPONSE" | python3 -c "
import sys, json

d = json.load(sys.stdin)

if 'message' in d and 'rate limit' in d.get('message', '').lower():
    print('ERROR: GitHub API rate limit exceeded (60 req/h without key)')
    print('Wait or set GITHUB_TOKEN env var')
    sys.exit(1)

total = d.get('total_count', 0)
items = d.get('items', [])

print(f'Total repos: {total}, showing top {len(items)}')
print()

for r in items:
    name = r['full_name']
    stars = r['stargazers_count']
    forks = r.get('forks_count', 0)
    lang = r.get('language') or 'N/A'
    desc = (r.get('description') or '')[:150]
    updated = r['updated_at'][:10]
    topics = ', '.join(r.get('topics', [])[:5])

    print(f'⭐{stars} (🍴{forks}) {name} [{lang}]')
    print(f'  Updated: {updated}')
    print(f'  URL: {r[\"html_url\"]}')
    print(f'  Description: {desc}')
    if topics:
        print(f'  Topics: {topics}')
    print()
"
