# Mood Axis — Mood → Layout + Palette + Font Mapping

**Source:** D:/pi/corpus (88 sites, 5 galleries, scraped 2026-07-22)
**Generated:** 2026-07-23T12:53:44.918Z
**Purpose:** По заданному mood (настроению) подобрать layout pattern, palette, fonts.

> Каждый mood определён через числа из corpus (radius, density, shadow, animation).
> ⚠️ **Font detection rate: 55%** — font-рекомендации приблизительные, основаны на частичных данных.

---

## Mood Distribution in Corpus

| Mood | Radius | Density | Shadow | Animation | Gradient | Dark |
|------|--------|---------|--------|-----------|----------|------|
| Bold | round (12-20px) | normal (16-32px) | light-medium | some (5-30) | often | often |
| Serene | soft-round (4-20px) | airy (≥32px) | none-light | none-some | rare | light |
| Premium | sharp-soft (0-8px) | airy (≥32px) | none | none (<5) | rare | dark |
| Industrial | sharp (<4px) | tight-normal (8-24px) | none | none-some | rare | mix |
| Editorial | sharp (<4px) | airy (≥32px) | none | none (<5) | no | light |
| Playful | round-pill (12-999px) | normal-airy (16-48px) | light-medium | lots (≥30) | often | mix |
| Friendly | round-pill (12-999px) | normal (16-32px) | light | some (5-30) | sometimes | light |

---

## Bold / Дерзкий

**Определение:** Крупная типографика, высокий контраст, насыщенные цвета, уверенные формы

### Характеристики (из corpus)

- **Radius:** round (12-20px)
- **Density:** normal (16-32px)
- **Shadow:** light to medium
- **Animation:** some (5-30)
- **Gradient:** часто
- **Dark mode:** часто dark mode

### Recommended

- **Layout pattern:** Asymmetric Hero Split или Bento Mosaic (см. layout-patterns.md)
- **Palette:** Dark Neon Cyan или Bold Cobalt (см. palette-patterns.md)
- **Font pair:** Display: жирный sans (Inter/Plus Jakarta Sans bold 700-800), Body: neutral sans

### Anti-pattern

Sharp corners (<4px), monochrome palette, tight spacing, no animation

---

## Serene / Спокойный

**Определение:** Мягкие цвета, свободное пространство, плавные переходы, минимум визуального шума

### Характеристики (из corpus)

- **Radius:** soft to round (4-20px)
- **Density:** airy (≥32px)
- **Shadow:** none or light
- **Animation:** none or some
- **Gradient:** редко
- **Dark mode:** обычно light

### Recommended

- **Layout pattern:** Centered Marketing или Typography Editorial (см. layout-patterns.md)
- **Palette:** Serene Sage или Warm Editorial Cream (см. palette-patterns.md)
- **Font pair:** Display: light weight (300-400), Body: light serif/sans

### Anti-pattern

Heavy shadows, bold typography, dense layouts, high saturation

---

## Premium / Премиальный

**Определение:** Сдержанная палитра, качественная типографика, минимализм в деталях, дорогой вид

### Характеристики (из corpus)

- **Radius:** sharp to soft (0-8px)
- **Density:** airy (≥32px)
- **Shadow:** none
- **Animation:** none (<5)
- **Gradient:** редко
- **Dark mode:** часто dark mode

### Recommended

- **Layout pattern:** Full-Bleed Product Showcase или Typography Editorial (см. layout-patterns.md)
- **Palette:** Dark Minimal или Cool Industrial (см. palette-patterns.md)
- **Font pair:** Display: тонкий serif (Playfair, Cormorant) или light sans, Body: neutral

### Anti-pattern

Pill buttons, яркие акценты, много анимации, crowded layouts

---

## Industrial / Индустриальный

**Определение:** Грубые текстуры, монохром, прямые линии, utilitarian aesthetic

### Характеристики (из corpus)

- **Radius:** sharp (<4px)
- **Density:** tight to normal (8-24px)
- **Shadow:** none
- **Animation:** none or some
- **Gradient:** редко
- **Dark mode:** mix

### Recommended

- **Layout pattern:** Gallery-Heavy Story или Architecture Portfolio (см. layout-patterns.md)
- **Palette:** Earth Architecture или Cool Industrial (см. palette-patterns.md)
- **Font pair:** Display: моноширинный или гротеск (Mono, Helvetica), Body: neutral sans

### Anti-pattern

Rounded corners, pastel palette, gradient, decorative elements

---

## Editorial / Редакционный

**Определение:** Типографика — главный герой, контент-центричный, воздушный дизайн

### Характеристики (из corpus)

- **Radius:** sharp (<4px)
- **Density:** airy (≥32px)
- **Shadow:** none
- **Animation:** none (<5)
- **Gradient:** нет
- **Dark mode:** обычно light

### Recommended

- **Layout pattern:** Typography-First Editorial или Magazine Editorial (см. layout-patterns.md)
- **Palette:** Warm Editorial Cream или Cool Industrial (см. palette-patterns.md)
- **Font pair:** Display: serif (Playfair, Georgia, Cormorant), Body: serif/sans 16-18px, line-height 1.5-1.7

### Anti-pattern

Bold colors, heavy shadows, pill buttons, dense grids

---

## Playful / Игривый

**Определение:** Яркие цвета, нестандартные формы, анимация, неожиданные решения

### Характеристики (из corpus)

- **Radius:** round to pill (12-999px)
- **Density:** normal to airy (16-48px)
- **Shadow:** light to medium
- **Animation:** lots (≥30)
- **Gradient:** часто
- **Dark mode:** mix

### Recommended

- **Layout pattern:** Bento Mosaic или Single CTA Landing (см. layout-patterns.md)
- **Palette:** Playful Gradient или Dark Neon Cyan (см. palette-patterns.md)
- **Font pair:** Display: креативный (display fonts, variable), Body: friendly sans

### Anti-pattern

Monochrome, sharp corners, no animation, conservative layout

---

## Friendly / Дружелюбный

**Определение:** Тёплые тона, округлые формы, human-centric, inviting

### Характеристики (из corpus)

- **Radius:** round to pill (12-999px)
- **Density:** normal (16-32px)
- **Shadow:** light
- **Animation:** some (5-30)
- **Gradient:** иногда
- **Dark mode:** обычно light

### Recommended

- **Layout pattern:** Centered Marketing или Stats-Heavy Credibility (см. layout-patterns.md)
- **Palette:** Warm Editorial Cream или Serene Sage (см. palette-patterns.md)
- **Font pair:** Display: округлый sans (Nunito, Plus Jakarta Sans), Body: friendly sans

### Anti-pattern

Sharp corners, cold palette, dark mode, dense text

---

