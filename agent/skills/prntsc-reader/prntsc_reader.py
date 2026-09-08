#!/usr/bin/env python3
"""
prnt.sc Screenshot Recognizer
Usage:
    python3 scripts/prntsc_reader.py <prnt.sc URL>
    python3 scripts/prntsc_reader.py 9ca_OkNu_1zw

Extracts the image from a prnt.sc / Lightshot link, downloads it,
and optionally runs OCR (if tesseract + pytesseract are available).
"""
import sys, os, re
import urllib.request
import urllib.error
import ssl
from pathlib import Path
from html.parser import HTMLParser  # A-34: stdlib HTML parser (replaces fragile regex)

# ── Configuration ──────────────────────────────────────────
OUT_DIR = Path("/tmp/prntsc_screenshots")


def _build_ssl_context() -> ssl.SSLContext:
    """Build a certificate-verifying SSL context.

    Prefers the certifi CA bundle when available so verification keeps
    working on systems with an outdated OS certificate store.
    """
    try:
        import certifi
        return ssl.create_default_context(cafile=certifi.where())
    except ImportError:
        return ssl.create_default_context()


# Verified context used for every request by default (MITM protection).
SSL_CONTEXT = _build_ssl_context()

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
}

# ── Core functions ─────────────────────────────────────────

def _cert_error_of(exc: BaseException):
    """Return the wrapped ssl.SSLCertError if exc is/wraps one, else None.

    urlopen wraps SSL errors in urllib.error.URLError; the underlying
    ssl error lives on the ``reason`` attribute.
    """
    if isinstance(exc, ssl.SSLCertError):
        return exc
    if isinstance(exc, urllib.error.URLError) and isinstance(exc.reason, ssl.SSLCertError):
        return exc.reason
    return None


def _urlopen_verified(req: urllib.request.Request, timeout: int):
    """Open ``req`` with TLS certificate verification enabled.

    Verification stays on by default. If the endpoint serves a broken
    certificate (ssl.SSLCertError) we log a warning and retry that single
    request without verification so the tool keeps working. Verification
    is never disabled globally for every request.
    """
    try:
        return urllib.request.urlopen(req, context=SSL_CONTEXT, timeout=timeout)
    except (urllib.error.URLError, ssl.SSLCertError) as exc:
        cert_err = _cert_error_of(exc)
        if cert_err is None:
            raise
        print(
            f"  [WARN] SSL certificate verification failed for "
            f"{req.full_url}: {cert_err}; retrying without verification",
            file=sys.stderr,
        )
        return urllib.request.urlopen(
            req, context=ssl._create_unverified_context(), timeout=timeout
        )


def extract_prntsc_code(url_or_code: str) -> str:
    """Extract the prnt.sc code from various input formats."""
    # Direct code
    if re.match(r'^[a-zA-Z0-9_-]+$', url_or_code) and '.' not in url_or_code:
        return url_or_code
    # Full URL
    m = re.search(r'prnt\.sc/([a-zA-Z0-9_-]+)', url_or_code)
    if m:
        return m.group(1)
    raise ValueError(f"Cannot extract prnt.sc code from: {url_or_code}")


class _PrntscImageParser(HTMLParser):
    """Parse prnt.sc HTML to extract the screenshot image URL (A-34).

    Replaces fragile regex against raw HTML with the stdlib html.parser.
    Collects, in order of reliability:
      1. og:image meta tag content
      2. <img class="...screenshot-image..."> src
      3. any <img src> pointing at a png/jpg/jpeg URL
    """

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.og_image = None
        self.screenshot_src = None
        self.fallback_src = None

    def handle_starttag(self, tag, attrs):
        # HTMLParser lowercases tag and attribute names; values stay as-is.
        if tag not in ("meta", "img"):
            return
        d = {}
        for name, value in attrs:
            d[name] = value if value is not None else ""
        if tag == "meta":
            if d.get("property") == "og:image" and d.get("content") and self.og_image is None:
                self.og_image = d["content"]
            return
        # tag == "img"
        src = d.get("src")
        if not src:
            return
        cls = d.get("class", "")
        if "screenshot-image" in cls and self.screenshot_src is None:
            self.screenshot_src = src
        if self.fallback_src is None and src.startswith("http"):
            if re.search(r"\.(?:png|jpe?g)(?:\?|$)", src.lower()):
                self.fallback_src = src


def fetch_image_url(code: str) -> str:
    """Fetch the prnt.sc page and extract the actual image URL.

    Uses html.parser (stdlib) instead of fragile regex against raw HTML.
    Priority: og:image meta -> screenshot-image img -> any png/jpg img.
    """
    page_url = f"https://prnt.sc/{code}"
    req = urllib.request.Request(page_url, headers=HEADERS)

    try:
        with _urlopen_verified(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='replace')
    except Exception as e:
        raise RuntimeError(f"Failed to fetch prnt.sc page: {e}")

    parser = _PrntscImageParser()
    try:
        parser.feed(html)
    except Exception as e:
        raise RuntimeError(f"Failed to parse prnt.sc page: {e}")

    # A-34: prefer structured parse results over regex on raw HTML
    image_url = parser.og_image or parser.screenshot_src or parser.fallback_src
    if image_url:
        return image_url

    raise RuntimeError(f"Could not find image URL on prnt.sc/{code}")


def download_image(image_url: str, code: str) -> Path:
    """Download the image and save locally."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Determine extension
    ext = ".png"
    if image_url.endswith('.jpg') or image_url.endswith('.jpeg'):
        ext = ".jpg"
    
    out_path = OUT_DIR / f"{code}{ext}"
    
    req = urllib.request.Request(image_url, headers=HEADERS)
    try:
        with _urlopen_verified(req, timeout=30) as resp:
            data = resp.read()
    except Exception as e:
        raise RuntimeError(f"Failed to download image: {e}")
    
    out_path.write_bytes(data)
    size_kb = len(data) / 1024
    
    # Get image dimensions
    try:
        from PIL import Image
        img = Image.open(out_path)
        w, h = img.size
        print(f"  Downloaded: {out_path}")
        print(f"  Size: {size_kb:.0f} KB, Dimensions: {w}×{h}, Format: {img.format}")
        img.close()
    except ImportError:
        print(f"  Downloaded: {out_path} ({size_kb:.0f} KB)")
    
    return out_path


def ocr_image(image_path: Path, lang: str = "eng+rus") -> str:
    """Run OCR on the downloaded image."""
    try:
        from PIL import Image
        import pytesseract
        
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang=lang)
        img.close()
        return text.strip()
    except ImportError:
        # Fallback: use tesseract CLI
        import subprocess
        ocr_out = str(image_path.with_suffix('.txt'))
        result = subprocess.run(
            ['tesseract', str(image_path), str(image_path.with_suffix('')),
             '-l', lang],
            capture_output=True, text=True, timeout=60
        )
        if result.returncode == 0:
            return open(ocr_out).read().strip()
        else:
            raise RuntimeError(f"tesseract failed: {result.stderr}")


# ── Main ───────────────────────────────────────────────────

def read_screenshot(url_or_code: str, ocr: bool = True, lang: str = "eng+rus") -> dict:
    """
    Main entry point: extract, download, and optionally OCR a prnt.sc screenshot.
    
    Returns dict with:
        - code: prnt.sc code
        - image_url: actual image CDN URL
        - local_path: path to downloaded image
        - ocr_text: OCR result (if ocr=True and tools available)
        - dimensions: (width, height)
    """
    code = extract_prntsc_code(url_or_code)
    print(f"prnt.sc code: {code}")
    
    print("  Fetching page...")
    image_url = fetch_image_url(code)
    print(f"  Image URL: {image_url}")
    
    print("  Downloading image...")
    local_path = download_image(image_url, code)
    
    result = {
        "code": code,
        "image_url": image_url,
        "local_path": str(local_path),
        "ocr_text": None,
        "dimensions": None,
    }
    
    try:
        from PIL import Image
        img = Image.open(local_path)
        result["dimensions"] = img.size
        img.close()
    except:
        pass
    
    if ocr:
        try:
            print("  Running OCR...")
            text = ocr_image(local_path, lang)
            result["ocr_text"] = text
            print(f"  OCR: {len(text)} characters extracted")
            print(f"  Preview: {text[:200]}...")
        except Exception as e:
            print(f"  OCR failed: {e}")
    
    return result


# ── CLI ────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <prnt.sc URL or code>")
        print(f"Example: {sys.argv[0]} https://prnt.sc/9ca_OkNu_1zw")
        print(f"Example: {sys.argv[0]} 9ca_OkNu_1zw")
        sys.exit(1)
    
    try:
        input_str = sys.argv[1]
        ocr_flag = '--no-ocr' not in sys.argv
        result = read_screenshot(input_str, ocr=ocr_flag)
        
        if ocr_flag and result['ocr_text']:
            print(f"\n{'='*60}")
            print("OCR RESULT:")
            print(f"{'='*60}")
            print(result['ocr_text'])
    except Exception as e:
        print(f"ERROR: {e}")
        sys.exit(1)
