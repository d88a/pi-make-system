---
name: prntsc-reader
description: Extracts and OCR-recognizes screenshots from prnt.sc / Lightshot links. Use when the user shares a prnt.sc URL (e.g., https://prnt.sc/XXXXXX) — fetches the actual image from the Lightshot CDN and runs OCR to read text from chart screenshots, trading interfaces, Bybit/Binance UI, or any screenshot shared via Lightshot.
license: MIT
compatibility: python3, tesseract-ocr, pytesseract, Pillow
metadata:
  category: utility
  platform: global
---

# prnt.sc Screenshot Reader

Reads screenshots shared via Lightshot (prnt.sc links).

## How It Works

1. Parse prnt.sc URL → extract code
2. Fetch prnt.sc page → extract actual image URL from `<meta og:image>` or `<img>` tag
3. Image CDN hosts: `img.lightshot.app`, `image.prntscr.com`
4. Download image to `/tmp/prntsc_screenshots/<code>.png`
5. Run OCR via tesseract (eng+rus) to extract visible text

## Setup (one-time)

```bash
sudo apt-get install -y tesseract-ocr tesseract-ocr-rus
pip3 install pytesseract Pillow
```

## Usage

```bash
# Full URL
python3 /home/ilya/.pi/agent/skills/prntsc-reader/prntsc_reader.py "https://prnt.sc/9ca_OkNu_1zw"

# Just the code
python3 /home/ilya/.pi/agent/skills/prntsc-reader/prntsc_reader.py "9ca_OkNu_1zw"

# Without OCR (just download)
python3 /home/ilya/.pi/agent/skills/prntsc-reader/prntsc_reader.py "9ca_OkNu_1zw" --no-ocr
```

## Output

- Downloads image to `/tmp/prntsc_screenshots/<code>.png`
- Returns: `code`, `image_url` (CDN), `local_path`, `dimensions`, `ocr_text`
- OCR extracts: exchange name, symbol, O/H/L/C, timestamp, price levels, volume

## Typical OCR Result

For Bybit/Binance trading chart screenshots:
- Exchange + token (e.g., "© BSBUSDT Perpetual Contract - 1m - Bybit")
- OHLC: ОТКРО (Open), МАКСО (High), МИНИМО (Low), ЗАКРО (Close)
- Timestamp: "42:35:13 UTC+5"
- Price levels from chart axis

## Example Session

User: "Посмотри этот скрин https://prnt.sc/9ca_OkNu_1zw"

Agent actions:
1. `python3 /home/ilya/.pi/agent/skills/prntsc-reader/prntsc_reader.py "9ca_OkNu_1zw"`
2. Reports: "BSBUSDT на Bybit, 1m свечи, падение −1.71%, объём 1.55 BSB, время 12:35 UTC+5"
