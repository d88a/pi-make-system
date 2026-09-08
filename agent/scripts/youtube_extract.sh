#!/bin/bash
# YouTube Extract — extracts frames and transcript from a YouTube video
# Usage: youtube_extract.sh <youtube_url> [frames_per_minute=6] [language=ru]
#
# Output: JSON to stdout, progress/debug to stderr
# Requires: yt-dlp, ffmpeg, ffprobe
# Optional: jq (if absent, python3 builds JSON — A-32), Deepgram API key in ~/.pi/agent/secrets/search_keys.yaml

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$HOME/.pi/agent/secrets/search_keys.yaml"

# ── Args ──────────────────────────────────────────────────────────────────
URL="${1:?Usage: youtube_extract.sh <youtube_url> [frames_per_minute=6] [language=ru]}"
FPM="${2:-6}"       # frames per minute
LANG="${3:-ru}"     # speech language

# Validate FPM is a positive integer
if ! [[ "$FPM" =~ ^[1-9][0-9]*$ ]]; then
    echo '{"error": "frames_per_minute must be a positive integer"}' >&2
    exit 1
fi

# ── Deps check ────────────────────────────────────────────────────────────
command -v yt-dlp >/dev/null 2>&1 || {
    echo '{"error": "yt-dlp not installed. Run: pip install yt-dlp"}' >&2
    exit 1
}
command -v ffmpeg >/dev/null 2>&1 || {
    echo '{"error": "ffmpeg not installed. Run: sudo apt install ffmpeg"}' >&2
    exit 1
}
command -v ffprobe >/dev/null 2>&1 || {
    echo '{"error": "ffprobe not installed. Run: sudo apt install ffprobe"}' >&2
    exit 1
}
# A-32: jq is optional — fall back to python3 for JSON building
JQ_AVAILABLE=0
if command -v jq >/dev/null 2>&1; then
    JQ_AVAILABLE=1
else
    echo "ℹ️  [youtube] jq not found — using python3 for JSON (A-32)" >&2
    command -v python3 >/dev/null 2>&1 || {
        echo '{"error": "neither jq nor python3 installed. Run: sudo apt install jq python3"}' >&2
        exit 1
    }
fi

# ── Proxy setup (YouTube works directly, no proxy needed) ─────────────────
# We source proxy_setup.sh only for Deepgram API calls, not for yt-dlp
PROXY_FOR_DEEPGRAM=""
source "$SCRIPT_DIR/proxy_setup.sh" 2>/dev/null || true
if [ -n "$HTTPS_PROXY" ]; then
    PROXY_FOR_DEEPGRAM="--proxy $HTTPS_PROXY"
fi

# ── Deepgram keys (rotation) ─────────────────────────────────────────────
DEEPGRAM_KEYS=()
if [ -f "$CONFIG_FILE" ]; then
    readarray -t DEEPGRAM_KEYS < <(python3 -c "
import sys, yaml
try:
    with open('$CONFIG_FILE') as f:
        cfg = yaml.safe_load(f)
    dg = (cfg or {}).get('deepgram', {})
    if isinstance(dg, dict):
        keys = dg.get('keys', [])
        if isinstance(keys, list):
            for k in keys:
                if k:
                    print(k)
        elif dg.get('api_key'):
            print(dg['api_key'])
except Exception:
    pass
" 2>/dev/null || true)
fi

TOTAL_DG_KEYS=${#DEEPGRAM_KEYS[@]}
if [ "$TOTAL_DG_KEYS" -eq 0 ]; then
    echo "⚠️  [youtube] Deepgram API keys not found in $CONFIG_FILE" >&2
    echo "   Transcript extraction will be skipped." >&2
    echo "   Add: deepgram: keys: [...]" >&2
else
    echo "🔑 [youtube] Deepgram: $TOTAL_DG_KEYS keys loaded" >&2
fi

# ── Temp dir ──────────────────────────────────────────────────────────────
TMPDIR="/tmp/youtube_extract-$$"
WORKDIR="$TMPDIR/work"
FRAMESDIR="$WORKDIR/frames"
mkdir -p "$FRAMESDIR"

# A-32: cleanup is opt-in. Default: leave temp files for the agent to read frames.
# Set YT_CLEANUP=1 to rm -rf the temp dir on exit.
_youtube_cleanup() {
    if [ "${YT_CLEANUP:-0}" = "1" ]; then
        rm -rf "$TMPDIR" 2>/dev/null || true
        echo "🧹 [youtube] Cleaned up temp dir (YT_CLEANUP=1): $TMPDIR" >&2
    else
        echo "🧹 [youtube] Temp files left for agent to process: $TMPDIR" >&2
    fi
}
trap '_youtube_cleanup' EXIT

# ── Download ──────────────────────────────────────────────────────────────
echo "📥 [youtube] Downloading video metadata..." >&2

# First get title
TITLE=$(yt-dlp --print title "$URL" 2>/dev/null || true)
if [ -z "$TITLE" ]; then
    echo '{"error": "Failed to fetch video info — video may be unavailable"}' >&2
    exit 1
fi

echo "📹 [youtube] Title: $TITLE" >&2

# Get duration (seconds)
DURATION=$(yt-dlp --print duration_string "$URL" 2>/dev/null || echo "0")
DURATION_SEC=$(yt-dlp --print duration "$URL" 2>/dev/null || echo "0")
DURATION_SEC=${DURATION_SEC%.*}

echo "⏱️  [youtube] Duration: $DURATION ($DURATION_SEC s)" >&2

# Enforce 30 min limit
MAX_SEC=$((30 * 60))
if [ "$DURATION_SEC" -gt "$MAX_SEC" ]; then
    echo "⚠️  [youtube] Video >30 min (${DURATION_SEC}s). Extracting only first 30 min." >&2
    CAPTURE_DURATION=$MAX_SEC
    # For frame calc, use 30 min
    EFFECTIVE_SEC=$MAX_SEC
else
    CAPTURE_DURATION=$DURATION_SEC
    EFFECTIVE_SEC=$DURATION_SEC
fi

# ── Download full video ───────────────────────────────────────────────────
echo "📥 [youtube] Downloading video..." >&2
VIDEO_FILE="$WORKDIR/video.mp4"

# Download full video (--download-sections is unreliable for longer videos)
yt-dlp \
    -f "best[ext=mp4]/best" \
    -o "$VIDEO_FILE" \
    "$URL" >&2 || {
    echo '{"error": "Failed to download video"}' >&2
    exit 1
}

if [ ! -f "$VIDEO_FILE" ] || [ ! -s "$VIDEO_FILE" ]; then
    echo '{"error": "Downloaded video file is empty or missing"}' >&2
    exit 1
fi

# Verify actual duration from downloaded file
ACTUAL_DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO_FILE" 2>/dev/null || echo "$EFFECTIVE_SEC")
ACTUAL_DURATION=${ACTUAL_DURATION%.*}
if [ "$ACTUAL_DURATION" -eq 0 ] 2>/dev/null; then
    ACTUAL_DURATION=$EFFECTIVE_SEC
fi

# Cap at EFFECTIVE_SEC (30 min max) for frame/audio extraction
if [ "$ACTUAL_DURATION" -gt "$EFFECTIVE_SEC" ]; then
    echo "⚠️  [youtube] Capping analysis to first 30 min (${EFFECTIVE_SEC}s of ${ACTUAL_DURATION}s)" >&2
    ACTUAL_DURATION=$EFFECTIVE_SEC
fi

# ── Calculate frame interval ──────────────────────────────────────────────
# interval (sec) = 60 / FPM
INTERVAL=$(python3 -c "print(max(1, int(60 / max(1, $FPM))))")
MAX_FRAMES=100

# If max frames would be exceeded, increase interval
CALC_FRAMES=$(( ACTUAL_DURATION / INTERVAL ))
if [ "$CALC_FRAMES" -gt "$MAX_FRAMES" ]; then
    INTERVAL=$(( ACTUAL_DURATION / MAX_FRAMES ))
    # Round up to nearest integer
    INTERVAL=$(( INTERVAL + 1 ))
    echo "📐 [youtube] Adjusted interval to $INTERVAL s (max $MAX_FRAMES frames)" >&2
fi

echo "🖼️  [youtube] Extracting frames every ${INTERVAL}s..." >&2

# ── Extract frames ───────────────────────────────────────────────────────
ffmpeg -y -v error -stats \
    -i "$VIDEO_FILE" \
    -t "$ACTUAL_DURATION" \
    -vf "fps=1/${INTERVAL}" \
    -q:v 3 \
    -start_number 0 \
    "$FRAMESDIR/frame_%03d.jpg" >&2

# ── Build frames list (A-32: jq optional, python3 fallback) ───────────────
FRAME_FILES=()
if ls "$FRAMESDIR"/frame_*.jpg >/dev/null 2>&1; then
    while IFS= read -r -d '' f; do
        FRAME_FILES+=("$f")
    done < <(find "$FRAMESDIR" -maxdepth 1 -name 'frame_*.jpg' -print0 2>/dev/null | sort -z)
fi

# Collect per-frame fields into parallel arrays (avoids per-frame subprocesses)
FRAME_TIMES=()
FRAME_SECS=()
FRAME_PATHS=()
for f in "${FRAME_FILES[@]}"; do
    BASENAME=$(basename "$f")
    # Extract frame number from filename
    NUM=$(echo "$BASENAME" | sed 's/frame_0*//;s/\.jpg//')
    SEC=$(( NUM * INTERVAL ))
    # Format as mm:ss
    M=$(( SEC / 60 ))
    S=$(( SEC % 60 ))
    TIME=$(printf "%02d:%02d" "$M" "$S")
    FRAME_TIMES+=("$TIME")
    FRAME_SECS+=("$SEC")
    FRAME_PATHS+=("$f")
done

if [ "$JQ_AVAILABLE" -eq 1 ]; then
    FRAMES_JSON="[]"
    for i in "${!FRAME_PATHS[@]}"; do
        FRAMES_JSON=$(echo "$FRAMES_JSON" | jq \
            --arg t "${FRAME_TIMES[$i]}" \
            --argjson s "${FRAME_SECS[$i]}" \
            --arg p "${FRAME_PATHS[$i]}" \
            '. + [{"time": $t, "seconds": $s, "path": $p}]')
    done
    FRAMES_COUNT=$(echo "$FRAMES_JSON" | jq length)
else
    # python3 fallback — build frames JSON in a single pass (\x1f = unit separator)
    FRAMES_JSON=$(python3 -c '
import sys, json
times = sys.argv[1].split("\x1f")
secs  = sys.argv[2].split("\x1f")
paths = sys.argv[3].split("\x1f")
rows = []
for t, s, p in zip(times, secs, paths):
    if not p:
        continue
    try:
        s_int = int(s)
    except ValueError:
        continue
    rows.append({"time": t, "seconds": s_int, "path": p})
print(json.dumps(rows, ensure_ascii=False))
' "$(printf '%s\x1f' "${FRAME_TIMES[@]}")" "$(printf '%s\x1f' "${FRAME_SECS[@]}")" "$(printf '%s\x1f' "${FRAME_PATHS[@]}")")
    FRAMES_COUNT=$(printf '%s' "$FRAMES_JSON" | python3 -c 'import sys, json; print(len(json.load(sys.stdin)))')
fi

echo "🖼️  [youtube] Extracted $FRAMES_COUNT frames" >&2

# ── Extract audio ─────────────────────────────────────────────────────────
AUDIO_FILE="$WORKDIR/audio.wav"
echo "🎵 [youtube] Extracting audio (16kHz mono)..." >&2
ffmpeg -y -v error -stats \
    -i "$VIDEO_FILE" \
    -t "$ACTUAL_DURATION" \
    -vn \
    -acodec pcm_s16le \
    -ar 16000 \
    -ac 1 \
    "$AUDIO_FILE" >&2

# ── Transcribe via Deepgram (with key rotation) ───────────────────────────
TRANSCRIPT=""

if [ "$TOTAL_DG_KEYS" -gt 0 ] && [ -f "$AUDIO_FILE" ] && [ -s "$AUDIO_FILE" ]; then
    echo "🎙️  [youtube] Transcribing via Deepgram (model: nova-2, lang: $LANG)..." >&2

    AURL="https://api.deepgram.com/v1/listen"
    RESPONSE_FILE="$WORKDIR/dg_response.json"
    TRANSCRIBED=false

    for dg_attempt in $(seq 0 $((TOTAL_DG_KEYS - 1))); do
        DG_KEY="${DEEPGRAM_KEYS[$dg_attempt]}"
        DG_NUM=$((dg_attempt + 1))
        echo "🔑 [youtube] Deepgram key $DG_NUM/$TOTAL_DG_KEYS (${DG_KEY:0:8}...)" >&2

        HTTP_CODE=$(curl -s -w "%{http_code}" \
            -X POST "${AURL}?model=nova-2&language=${LANG}&smart_format=true" \
            -H "Authorization: Token ${DG_KEY}" \
            -H "Content-Type: audio/wav" \
            --data-binary "@${AUDIO_FILE}" \
            -o "$RESPONSE_FILE" 2>/dev/null || echo "000")

        if [ "$HTTP_CODE" = "200" ] && [ -s "$RESPONSE_FILE" ]; then
            if [ "$JQ_AVAILABLE" -eq 1 ]; then
                TRANSCRIPT=$(jq -r '.results.channels[0].alternatives[0].transcript // ""' "$RESPONSE_FILE" 2>/dev/null || true)
            else
                # A-32: python3 fallback for transcript extraction
                TRANSCRIPT=$(python3 -c '
import sys, json
try:
    d = json.load(open(sys.argv[1]))
    ch = (d.get("results") or {}).get("channels") or []
    alts = ch[0].get("alternatives") if ch else []
    print((alts[0].get("transcript") or "") if alts else "")
except Exception:
    print("")
' "$RESPONSE_FILE" 2>/dev/null || true)
            fi
            TRANSCRIBED=true
            break
        elif [ "$HTTP_CODE" = "429" ] || [ "$HTTP_CODE" = "402" ]; then
            echo "⚠️  [youtube] Deepgram key $DG_NUM rate-limited (HTTP $HTTP_CODE), trying next..." >&2
        else
            echo "⚠️  [youtube] Deepgram API error (HTTP $HTTP_CODE)" >&2
            if [ -f "$RESPONSE_FILE" ] && [ -s "$RESPONSE_FILE" ]; then
                if [ "$JQ_AVAILABLE" -eq 1 ]; then
                    jq -c '.' "$RESPONSE_FILE" >&2 2>/dev/null || true
                else
                    python3 -c 'import sys, json; print(json.dumps(json.load(open(sys.argv[1])), ensure_ascii=False))' "$RESPONSE_FILE" >&2 2>/dev/null || true
                fi
            fi
            break
        fi
    done

    if [ "$TRANSCRIBED" = false ]; then
        echo "⚠️  [youtube] All Deepgram keys exhausted — transcript skipped" >&2
    elif [ -z "$TRANSCRIPT" ]; then
        echo "⚠️  [youtube] Deepgram returned empty transcript" >&2
    fi
else
    echo "🔇 [youtube] Deepgram keys not available — transcript skipped" >&2
fi

# ── Output JSON (A-32: jq if available, else python3) ─────────────────────
if [ "$JQ_AVAILABLE" -eq 1 ]; then
    jq -n \
        --arg title "$TITLE" \
        --arg duration "$DURATION" \
        --argjson duration_seconds "$DURATION_SEC" \
        --argjson frames "$FRAMES_JSON" \
        --arg transcript "${TRANSCRIPT:-}" \
        --arg language "$LANG" \
        --argjson frames_count "$FRAMES_COUNT" \
        --arg output_dir "$TMPDIR" \
        '{
            title: $title,
            duration: $duration,
            duration_seconds: $duration_seconds,
            frames: $frames,
            transcript: (if $transcript == "" then null else $transcript end),
            language: $language,
            frames_count: $frames_count,
            output_dir: $output_dir
        }'
else
    python3 -c '
import sys, json
title, duration, dur_sec, frames, transcript, language, fcount, outdir = sys.argv[1:9]
def _to_int(v, default=0):
    v = (v or "").strip()
    return int(v) if v.lstrip("-").isdigit() else default
out = {
    "title": title,
    "duration": duration,
    "duration_seconds": _to_int(dur_sec),
    "frames": json.loads(frames) if frames else [],
    "transcript": transcript if transcript else None,
    "language": language,
    "frames_count": _to_int(fcount),
    "output_dir": outdir,
}
print(json.dumps(out, ensure_ascii=False))
' "$TITLE" "$DURATION" "$DURATION_SEC" "$FRAMES_JSON" "${TRANSCRIPT:-}" "$LANG" "$FRAMES_COUNT" "$TMPDIR"
fi

echo "✅ [youtube] Done. Output in: $TMPDIR" >&2