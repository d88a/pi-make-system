# Corpus Analysis Report — Wave D

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** 2026-07-23T12:53:44.918Z

---

## 1. Hero Type Distribution

| Type | Count | % |
|------|-------|---|
| centered | 64 | 72.7% |
| asymmetric-split | 11 | 12.5% |
| product-showcase | 9 | 10.2% |
| typography | 4 | 4.5% |

> ⚠️ **Data quality note:** hero_type "centered" = 73% — классификатор слишком грубый. В реальности многие "centered" hero — это full-bleed с centred text overlay, или product-showcase с centred layout. Нужна ручная реклассификация для точных скелетов.

## 2. Hero Signal Analysis

| Signal | Count |
|--------|-------|
| Image Center | 13 |
| Image Left | 10 |
| Image Right | 1 |
| No Image | 64 |
| Centered Text | 16 |
| Not Centered | 72 |

## 3. Top Section Sequences

| Sequence | Count | % | Examples |
|----------|-------|---|----------|
|  | 40 | 45.5% | abcdinamo.com, aikawakenichi.com, antimetal.com |
| hero→gallery | 3 | 3.4% | artemiilebedev.com, lusano.com, teardwn.com |
| hero | 3 | 3.4% | chems.studio, faces.app, iyo.ai |
| hero→content | 3 | 3.4% | cinedept.com, truekindskincare.com, usalproject.com |
| hero→nav→features→hero→content→about→content→footer | 1 | 1.1% | 25residences.com |
| hero→footer | 1 | 1.1% | aboutluca.com |
| hero→features→content→features→content→gallery→content→footer | 1 | 1.1% | alias.studio |
| nav→features→hero→content→about→content→features | 1 | 1.1% | arago.inc |
| nav→cta→content→footer | 1 | 1.1% | becaneparis.com |
| hero→content→stats→content→stats→content→stats→content→stats→content | 1 | 1.1% | blueyard.com |

## 4. Section Type Frequencies

| Type | Count |
|------|-------|
| hero | 185 |
| content | 151 |
| gallery | 60 |
| features | 46 |
| footer | 30 |
| nav | 20 |
| stats | 10 |
| cta | 9 |
| about | 6 |
| testimonial | 6 |
| contact | 5 |
| logos | 3 |

## 5. Palette Clusters (Top 8)

| Cluster | Count | % | Dark | Primary Hue | Accent Hue | Sat | Repr. BG | Repr. Text |
|---------|-------|---|------|-------------|------------|-----|-----------|-------------|
| 0-29 (Red) | 0-29 (Red) | low (<30%) | 44 | 50.0% | — | 0-29 (Red) | 0-29 (Red) | low (<30%) | #FFFFFF | #000000 |
| 0-29 (Red) | 0-29 (Red) | low (<30%) | 7 | 8.0% | ✓ | 0-29 (Red) | 0-29 (Red) | low (<30%) | #000000 | #FFFFFF |
| 240-269 (Indigo) | 240-269 (Indigo) | high (≥70%) | 7 | 8.0% | — | 240-269 (Indigo) | 240-269 (Indigo) | high (≥70%) | #F0F0F0 | #000000 |
| 210-239 (Blue) | 210-239 (Blue) | low (<30%) | 2 | 2.3% | ✓ | 210-239 (Blue) | 210-239 (Blue) | low (<30%) | #151515 | #FFFFFF |
| 210-239 (Blue) | 210-239 (Blue) | low (<30%) | 2 | 2.3% | — | 210-239 (Blue) | 210-239 (Blue) | low (<30%) | #FDFDF8 | #374151 |
| 240-269 (Indigo) | 240-269 (Indigo) | high (≥70%) | 1 | 1.1% | ✓ | 240-269 (Indigo) | 240-269 (Indigo) | high (≥70%) | #0000FF | #FFFFFF |
| 210-239 (Blue) | 30-59 (Orange) | high (≥70%) | 1 | 1.1% | — | 210-239 (Blue) | 30-59 (Orange) | high (≥70%) | #FFFFFF | #090B11 |
| 30-59 (Orange) | 240-269 (Indigo) | mid (30-70%) | 1 | 1.1% | — | 30-59 (Orange) | 240-269 (Indigo) | mid (30-70%) | #FFFFFF | #130F4B |

## 6. Typography

### Top Font Pairs
| Display | Body | Count | % |
|---------|------|-------|---|
| unknown | unknown | 24 | 27.3% |
| Times New Roman | Times New Roman | 14 | 15.9% |
| Fragment Mono | Fragment Mono | 2 | 2.3% |
| Inter | Inter | 2 | 2.3% |
| Europa Medium Condensed | Europa Light | 1 | 1.1% |
| IBM Plex Mono | IBM Plex Mono | 1 | 1.1% |
| Satoshi | Satoshi | 1 | 1.1% |
| Antartica | Antartica | 1 | 1.1% |
| VVDS Fifties | VVDS Fifties | 1 | 1.1% |
| Based | Based | 1 | 1.1% |

### Hero H1 Size
- Min: 9px
- Max: 257px
- Median: 62px
- Average: 71.5px

### Body Text
- Size: 9-40px, median 16px
- Line height: 1.00-2.70, median 1.50

## 7. Mood Distribution

| Dimension | Category | Count | % |
|-----------|----------|-------|---|
| radius | sharp (<4px) | 61 | 74.4% |
| radius | pill (≥20px) | 11 | 13.4% |
| radius | soft (4-12px) | 6 | 7.3% |
| radius | round (12-20px) | 4 | 4.9% |
| density | normal (16-32px) | 40 | 45.5% |
| density | tight (<16px) | 30 | 34.1% |
| density | airy (≥32px) | 18 | 20.5% |
| shadow | none | 77 | 87.5% |
| shadow | medium | 6 | 6.8% |
| shadow | heavy | 3 | 3.4% |
| shadow | light | 2 | 2.3% |
| animation | none (<5) | 43 | 48.9% |
| animation | lots (≥30) | 34 | 38.6% |
| animation | some (5-30) | 11 | 12.5% |
| gradient | no | 77 | 87.5% |
| gradient | yes | 11 | 12.5% |
| dark_mode | no | 69 | 78.4% |
| dark_mode | yes | 19 | 21.6% |
| monochrome | yes | 56 | 63.6% |
| monochrome | no | 32 | 36.4% |

## 8. Architecture-Realestate Cluster (20 sites)

### Hero Types
- centered: 12 (60.0%)
- product-showcase: 4 (20.0%)
- asymmetric-split: 3 (15.0%)
- typography: 1 (5.0%)

### Representative Palette
- **BG main (non-trivial)**: #F0F0F0
- **Text main (non-trivial)**: #1C1C1C
- **Primary hue median**: 0° (0-29 (Red))
- **Accent hue median**: 0° (0-29 (Red))
- **Accent saturation median**: 0%
- **Dark sites**: 4/20 (20.0%)

### Top Hexes
- #000000 (weight: 0.268)
- #FFFFFF (weight: 0.074)
- #322018 (weight: 0.043)
- #9C9C9C (weight: 0.038)
- #F0F0F0 (weight: 0.038)
- #00FFE5 (weight: 0.037)
- #252525 (weight: 0.034)
- #1D1D1D (weight: 0.031)

### Mood
- Radius: sharp 15, soft 1, round 0, pill 4
- Density avg: 38.0px
- Shadow: {"none":18,"light":1,"medium":1}
- Gradient: 3/20

### Sites
- 25residences.com
- archi-malinstudio.com
- batcloud.art
- biga.cat
- ch-projects.com
- christophecoenon.com
- clearwater.london
- clouarchitects.com
- composites.archi
- dancerobotphl.com
- diamondrosesanctuary.com
- era.estate
- ericpetschek.com
- explore.ownprimland.com
- ingraoinc.com
- lusano.com
- powerhouse-company.com
- radga.com
- thedamai.com
- thisisstudiox.com

## 9. "Детская неожиданность" Zone (Dirty Amber)

**Criteria:** accent hue 25-45°, saturation < 50%
**Count:** 2 sites
**Recommendation:** Использовать осторожно, не как default. Владелица отвергла warm-minimal/amber по умолчанию.

- diamondrosesanctuary.com: accent hue 40°, sat 40%, bg #DFD7C9, dark=false
- era.estate: accent hue 30°, sat 47%, bg #051936, dark=true

## 10. Page Metrics

| Metric | Average | Median |
|--------|---------|--------|
| Page Height | 11512px | 5967px |
| Section Count | 6.1 | 1 |
| Nav Links | 7.3 | 2 |
| Button Radius | 5.1px | 0px |

- Sticky Nav: 33/88 (37.5%)
- Announcement Bar: 0/88 (0.0%)

## 11. Data Quality Notes

- **Font detection rate:** 55% — низкая точность. Многие font pair — угаданы, не извлечены достоверно.
- **Hero type:** 73% "centered" — классификатор слишком грубый. Требуется ручная реклассификация.
- **Zero hue:** 51 sites с primary_hue=accent_hue=0 — это grayscale/monochrome сайты (не баг, а feature).
- **Body size bugs:** 1 sites с body_size_px ≤ 1 — extraction артефакт.
- **Radius outlier:** некоторые radius_avg_px > 1000 — исключены из статистик.
