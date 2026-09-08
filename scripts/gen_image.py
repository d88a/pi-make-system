#!/usr/bin/env python3
"""
Image generation via DashScope Wanx API (async task-based).

Usage:
    python gen_image.py --prompt "cyberpunk AI dashboard" --output hero.png
    python gen_image.py --prompt "..." --size 1280*720 --model wan2.7-image-pro --output hero.png
    python gen_image.py --batch prompts.json --output-dir images/

Batch JSON format:
    [
        {"name": "hero", "prompt": "...", "size": "1280*720"},
        {"name": "feature1", "prompt": "...", "size": "1024*1024"}
    ]
"""

import argparse
import json
import sys
import time
import os
import urllib.request
import urllib.error

API_KEY = os.environ.get("DASHSCOPE_API_KEY")
BASE_URL = "https://dashscope.aliyuncs.com"
SUBMIT_URL = f"{BASE_URL}/api/v1/services/aigc/text2image/image-synthesis"
TASK_URL = f"{BASE_URL}/api/v1/tasks"

# Default: fast model, good quality
DEFAULT_MODEL = "wanx2.1-t2i-turbo"
DEFAULT_SIZE = "1280*720"  # widescreen, good for web

# Allowed sizes per model
ALLOWED_SIZES = {
    "wanx2.1-t2i-turbo": ["1024*1024", "720*1280", "1280*720", "768*1152"],
    "wanx-v1": ["1024*1024", "720*1280", "1280*720"],
    "wan2.7-image": ["1024*1024", "720*1280", "1280*720", "768*1152"],
    "wan2.7-image-pro": ["1024*1024", "720*1280", "1280*720", "768*1152"],
}

MAX_POLL_SECONDS = 120
POLL_INTERVAL = 3


def api_request(url, data=None, method="GET"):
    """Make API request with auth header."""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    if data and method == "POST":
        headers["X-DashScope-Async"] = "enable"

    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else ""
        print(f"HTTP {e.code}: {error_body}", file=sys.stderr)
        return None


def submit_task(prompt, size=DEFAULT_SIZE, model=DEFAULT_MODEL):
    """Submit image generation task. Returns task_id or None."""
    payload = {
        "model": model,
        "input": {"prompt": prompt},
        "parameters": {"size": size, "n": 1},
    }
    result = api_request(SUBMIT_URL, data=payload, method="POST")
    if result and "output" in result:
        task_id = result["output"].get("task_id")
        print(f"  Task submitted: {task_id}", file=sys.stderr)
        return task_id
    else:
        print(f"  Submit failed: {result}", file=sys.stderr)
        return None


def poll_task(task_id):
    """Poll task until complete. Returns image URL or None."""
    start = time.time()
    while time.time() - start < MAX_POLL_SECONDS:
        result = api_request(f"{TASK_URL}/{task_id}")
        if not result:
            time.sleep(POLL_INTERVAL)
            continue

        status = result["output"]["task_status"]
        if status == "SUCCEEDED":
            url = result["output"]["results"][0]["url"]
            print(f"  Generated: {url[:80]}...", file=sys.stderr)
            return url
        elif status == "FAILED":
            msg = result["output"].get("message", "unknown error")
            print(f"  Failed: {msg}", file=sys.stderr)
            return None
        else:
            time.sleep(POLL_INTERVAL)

    print(f"  Timeout after {MAX_POLL_SECONDS}s", file=sys.stderr)
    return None


def download_image(url, output_path):
    """Download image from URL to local path."""
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
    try:
        urllib.request.urlretrieve(url, output_path)
        size_kb = os.path.getsize(output_path) / 1024
        print(f"  Saved: {output_path} ({size_kb:.0f}KB)", file=sys.stderr)
        return True
    except Exception as e:
        print(f"  Download failed: {e}", file=sys.stderr)
        return False


def generate_single(prompt, output_path, size=DEFAULT_SIZE, model=DEFAULT_MODEL):
    """Full pipeline: submit → poll → download. Returns path or None."""
    # Validate size
    allowed = ALLOWED_SIZES.get(model, ALLOWED_SIZES[DEFAULT_MODEL])
    if size not in allowed:
        print(f"  Size {size} not allowed for {model}. Using {allowed[0]}", file=sys.stderr)
        size = allowed[0]

    print(f"Generating: {prompt[:60]}...", file=sys.stderr)
    task_id = submit_task(prompt, size, model)
    if not task_id:
        return None

    url = poll_task(task_id)
    if not url:
        return None

    if download_image(url, output_path):
        return output_path
    return None


def generate_batch(batch_file, output_dir, model=DEFAULT_MODEL):
    """Generate multiple images from batch JSON file."""
    with open(batch_file) as f:
        prompts = json.load(f)

    os.makedirs(output_dir, exist_ok=True)
    results = []

    # Submit all tasks first (parallel-ish)
    tasks = []
    for item in prompts:
        name = item["name"]
        prompt = item["prompt"]
        size = item.get("size", DEFAULT_SIZE)
        output_path = os.path.join(output_dir, f"{name}.png")

        task_id = submit_task(prompt, size, model)
        tasks.append((name, task_id, output_path))
        print(f"[{name}] submitted", file=sys.stderr)

    # Poll all tasks
    for name, task_id, output_path in tasks:
        if not task_id:
            results.append({"name": name, "status": "failed", "error": "submit failed"})
            continue

        print(f"[{name}] polling...", file=sys.stderr)
        url = poll_task(task_id)
        if not url:
            results.append({"name": name, "status": "failed", "error": "generation failed"})
            continue

        if download_image(url, output_path):
            results.append({"name": name, "status": "ok", "path": output_path})
        else:
            results.append({"name": name, "status": "failed", "error": "download failed"})

    return results


def main():
    parser = argparse.ArgumentParser(description="Generate images via DashScope Wanx API")
    parser.add_argument("--prompt", help="Image description (English recommended)")
    parser.add_argument("--size", default=DEFAULT_SIZE, help=f"Image size: {DEFAULT_SIZE}")
    parser.add_argument("--model", default=DEFAULT_MODEL, help=f"Model: {DEFAULT_MODEL}")
    parser.add_argument("--output", "-o", help="Output file path")
    parser.add_argument("--batch", help="Batch JSON file with multiple prompts")
    parser.add_argument("--output-dir", help="Output directory for batch mode")
    args = parser.parse_args()

    if not API_KEY:
        print("ERROR: DASHSCOPE_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    if args.batch:
        if not args.output_dir:
            print("--output-dir required with --batch", file=sys.stderr)
            sys.exit(1)
        results = generate_batch(args.batch, args.output_dir, args.model)
        print(json.dumps(results, indent=2))
    elif args.prompt and args.output:
        path = generate_single(args.prompt, args.output, args.size, args.model)
        if path:
            print(json.dumps({"status": "ok", "path": path}))
        else:
            print(json.dumps({"status": "failed"}))
            sys.exit(1)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
