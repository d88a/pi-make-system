#!/bin/bash
# arXiv Search — free, no API key needed
# Usage: arxiv_search.sh <query> [max_results]
# Examples:
#   arxiv_search.sh "crypto market microstructure reversal"
#   arxiv_search.sh "order book prediction deep learning" 5

set -euo pipefail
# Source shared search helpers (proxy / url-encode / curl-retry) — A-27
source "$(dirname "$0")/search_common.sh"
search_proxy_setup

QUERY="${1:?Usage: arxiv_search.sh <query> [max_results]}"
MAX_RESULTS="${2:-5}"

# URL-encode query (replace spaces with +, encode special chars)
ENCODED_QUERY=$(url_encode "$QUERY" plus)

URL="https://export.arxiv.org/api/query?search_query=all:${ENCODED_QUERY}&max_results=${MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending"

RESPONSE=$(curl_search -L "$URL")

if [ $? -ne 0 ]; then
    echo "❌ Ошибка доступа к arXiv API. Попробуйте позже." >&2
    exit 1
fi

if [ -z "$RESPONSE" ]; then
    echo "ERROR: arXiv API returned empty response"
    exit 1
fi

echo "$RESPONSE" | python3 -c "
import sys, xml.etree.ElementTree as ET

data = sys.stdin.read()
root = ET.fromstring(data)
ns = {'atom': 'http://www.w3.org/2005/Atom'}

total = root.find('atom:totalResults', {'atom': 'http://a9.com/-/spec/opensearch/1.1/'})
entries = root.findall('atom:entry', ns)

print(f'Total results: {total.text if total is not None else \"?\"}, showing {len(entries)}')
print()

for e in entries:
    title = e.find('atom:title', ns).text.strip().replace('\n', ' ')
    published = e.find('atom:published', ns).text[:10]
    arxiv_id = e.find('atom:id', ns).text.split('/abs/')[-1]
    authors = [a.find('atom:name', ns).text for a in e.findall('atom:author', ns)[:5]]
    summary = e.find('atom:summary', ns).text.strip()[:300].replace('\n', ' ')

    print(f'[{published}] {title}')
    print(f'  ID: {arxiv_id}')
    print(f'  Authors: {\", \".join(authors)}')
    print(f'  URL: https://arxiv.org/abs/{arxiv_id}')
    print(f'  Abstract: {summary}...')
    print()
"
