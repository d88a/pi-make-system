#!/bin/bash
# Semantic Scholar Search — free, no API key needed
# Rate limit: ~100 requests per 5 minutes
# Usage: scholar_search.sh <query> [limit]
# Examples:
#   scholar_search.sh "crypto futures order book reversal prediction"
#   scholar_search.sh "market microstructure leading indicators" 10

set -euo pipefail
# Source shared search helpers (proxy / url-encode / curl-retry) — A-27
source "$(dirname "$0")/search_common.sh"
search_proxy_setup

QUERY="${1:?Usage: scholar_search.sh <query> [limit]}"
LIMIT="${2:-5}"

ENCODED_QUERY=$(url_encode "$QUERY")

URL="https://api.semanticscholar.org/graph/v1/paper/search?query=${ENCODED_QUERY}&limit=${LIMIT}&fields=title,year,authors,abstract,citationCount,url,openAccessPdf"

RESPONSE=$(curl_search "$URL")

if [ $? -ne 0 ]; then
    echo "❌ Ошибка доступа к Semantic Scholar API. Попробуйте позже." >&2
    exit 1
fi

# Check for rate limit
HTTP_CODE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('code',''))" 2>/dev/null)
if [ "$HTTP_CODE" = "429" ]; then
    echo "ERROR: Semantic Scholar rate limit exceeded (429)."
    echo "Wait 5 minutes or use Firecrawl search instead."
    exit 1
fi

echo "$RESPONSE" | python3 -c "
import sys, json

d = json.load(sys.stdin)
total = d.get('total', 0)
papers = d.get('data', [])

print(f'Total results: {total}, showing {len(papers)}')
print()

for p in papers:
    title = p.get('title', '?')
    year = p.get('year', '?')
    citations = p.get('citationCount', 0)
    abstract = (p.get('abstract') or '')[:300]
    authors = ', '.join([a.get('name', '') for a in p.get('authors', [])[:5]])
    url = p.get('url', '')
    oa_pdf = p.get('openAccessPdf', {})
    pdf_url = oa_pdf.get('url', '') if oa_pdf else ''

    print(f'[{year}] {title} (citations: {citations})')
    print(f'  Authors: {authors}')
    print(f'  URL: {url}')
    if pdf_url:
        print(f'  PDF: {pdf_url}')
    print(f'  Abstract: {abstract}...' if abstract else '  Abstract: N/A')
    print()
"
