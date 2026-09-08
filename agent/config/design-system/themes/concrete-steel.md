# Concrete Steel

> Industrial might of concrete and steel. Raw, architectural, warm monochrome.
> Accent = stone-600 (#57534E) — warm industrial grey, one tone lighter and warmer than graphite-mono #44403C.
> Not premium silence — the confidence of a building under construction. Form follows function.
> Base tokens (spacing, typography, radius, shadows, layout) — see `tokens.md`.

## How to use

1. Apply **base tokens** from `tokens.md` (mandatory).
2. Take colors from the table below — **light and dark mode**.
3. Assemble components from examples — they are ready to copy.
4. This theme is **light + dark** — light primary, dark for architectural showcase.
5. Fonts: **Space Grotesk** (display) + **Inter** (body) — industrial technical pair.

---

## CSS Custom Properties (MANDATORY for `<head>`)

### Light mode (default)

```html
<style>
:root {
  /* --- Backgrounds --- */
  --color-bg-page: #F5F5F4;
  --color-bg-alt: #E7E5E4;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #FAFAF9;
  --color-bg-inset: #D6D3D1;

  /* --- Text --- */
  --color-text-primary: #1C1917;
  --color-text-secondary: #57534E;
  --color-text-muted: #57534E;
  --color-text-inverse: #F5F5F4;

  /* --- Accent (stone-600 -- warm industrial grey) --- */
  --color-primary: #57534E;
  --color-primary-hover: #44403C;
  --color-primary-active: #292524;
  --color-primary-glow: rgba(87, 83, 78, 0.35);
  --color-primary-subtle: rgba(87, 83, 78, 0.08);

  /* --- Semantic --- */
  --color-success: #059669;
  --color-danger: #DC2626;
  --color-warning: #D97706;

  /* --- Borders --- */
  --color-border: #D6D3D1;
  --color-border-hover: #A8A29E;
  --color-border-accent-hover: rgba(87, 83, 78, 0.5);
  --color-border-subtle: #E7E5E4;

  /* --- Gradients --- */
  --gradient-primary: linear-gradient(135deg, #57534E, #44403C);
  --gradient-subtle: linear-gradient(180deg, #F5F5F4, #E7E5E4);
  --gradient-steel: linear-gradient(135deg, #78716C, #57534E, #44403C);
  --gradient-concrete: linear-gradient(180deg, #D6D3D1, #A8A29E);

  /* --- Shadows --- */
  --shadow-brand: 0 10px 30px -10px rgba(87, 83, 78, 0.35);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-card-hover: 0 8px 24px -8px rgba(87, 83, 78, 0.2);
  --shadow-elevated: 0 4px 16px -4px rgba(87, 83, 78, 0.15);
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);

  /* --- Transitions --- */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  /* --- Typography --- */
  --font-display: 'Space Grotesk', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* --- Radius --- */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --radius-xl: 16px;
}

/* --- Dark mode --- */
.dark,
[data-theme="dark"] {
  --color-bg-page: #1C1917;
  --color-bg-alt: #292524;
  --color-surface: #292524;
  --color-bg-elevated: #35312D;
  --color-bg-inset: #0C0A09;

  --color-text-primary: #F5F5F4;
  --color-text-secondary: #A8A29E;
  --color-text-muted: #78716C;
  --color-text-inverse: #1C1917;

  --color-primary: #A8A29E;
  --color-primary-hover: #D6D3D1;
  --color-primary-active: #F5F5F4;
  --color-primary-glow: rgba(168, 162, 158, 0.3);
  --color-primary-subtle: rgba(168, 162, 158, 0.1);

  --color-border: #44403C;
  --color-border-hover: #57534E;
  --color-border-accent-hover: rgba(168, 162, 158, 0.5);
  --color-border-subtle: #35312D;

  --gradient-primary: linear-gradient(135deg, #A8A29E, #78716C);
  --gradient-subtle: linear-gradient(180deg, #1C1917, #292524);
  --gradient-steel: linear-gradient(135deg, #A8A29E, #78716C, #57534E);
  --gradient-concrete: linear-gradient(180deg, #44403C, #292524);

  --shadow-brand: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-card-hover: 0 8px 24px -8px rgba(0, 0, 0, 0.4);
  --shadow-elevated: 0 4px 16px -4px rgba(0, 0, 0, 0.3);
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
```

### Google Fonts

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

---

## Mood

**Industrial, raw, architectural, confident.**

Concrete makes no apologies. Steel pretends to be nothing soft. Concrete Steel is honesty of materials.
There is no "air for air's sake" like in graphite-mono. Every element here is structural.
Borders are thicker, shadows are harder, typography is like stamped steel.

### Difference from graphite-mono

| Characteristic | graphite-mono | concrete-steel |
|----------------|---------------|----------------|
| Mood | Premium silence, Apple/Linear | Raw industrial, concrete+steel |
| Accent | #44403C (stone-700, cooler) | #57534E (stone-600, warmer) |
| Display font | Sora (geometric, soft) | Space Grotesk (technical, raw) |
| Background | #FAFAF9 (near white) | #F5F5F4 (visible concrete) |
| Borders | Thin, barely visible | Visible, structural |
| Shadows | Barely visible | More pronounced, stone-tinted |
| Dark mode | No (light-only) | Yes (architectural showcase) |
| Character | "Design = absence of design" | "Form follows function" |

### When to use

- Construction companies and developers (StroyMax, PIK, Samolet)
- Architectural bureaus (with industrial architecture focus)
- Industrial brands (manufacturing, engineering, infrastructure)
- B2B services for construction and logistics
- Engineering startups and hardware companies
- Industrial photographer portfolios
- Brands with "honest" positioning (no gloss)

### When NOT to use

- Luxury / premium SaaS (use graphite-mono instead)
- Gaming / cyberpunk / neon (use bold-tech)
- Children / entertainment projects
- Lifestyle / wellness / beauty (too brutal)
- Fintech with "friendly" positioning

---

## Color palette

### Light mode (primary)

| Role | Hex | Tailwind | Where to use |
|------|-----|----------|--------------|
| bg (page) | `#F5F5F4` | `bg-stone-100` | main background — concrete surface |
| bg (alt surface) | `#E7E5E4` | `bg-stone-200` | alternate section background, footer |
| bg (surface / cards) | `#FFFFFF` | `bg-white` | cards, panels, modals |
| bg (elevated) | `#FAFAF9` | `bg-stone-50` | hover states, dropdown |
| bg (inset) | `#D6D3D1` | `bg-stone-300` | input bg inset, recessed areas |
| text (headings) | `#1C1917` | `text-stone-900` | headings, hero title |
| text (body) | `#57534E` | `text-stone-600` | main text, paragraphs |
| text (muted) | `#57534E` | `text-stone-600` | secondary, placeholder, disabled |
| **accent primary** | `#57534E` | `text-stone-600` / `bg-stone-600` | CTA, links, active states |
| **accent hover** | `#44403C` | `hover:bg-stone-700` | hover on accent elements |
| **accent active** | `#292524` | `active:bg-stone-800` | pressed state |
| accent subtle bg | `rgba(87,83,78,0.08)` | `bg-stone-600/[0.08]` | icons in cards, tinted backgrounds |
| success / positive | `#059669` | `text-emerald-600` | positive metrics, checkmarks |
| danger / negative | `#DC2626` | `text-red-600` | errors, destructive actions |
| warning | `#D97706` | `text-amber-600` | caution states |
| border (default) | `#D6D3D1` | `border-stone-300` | card border, divider — VISIBLE |
| border (hover) | `#A8A29E` | `border-stone-400` | border on hover |
| border (accent hover) | `rgba(87,83,78,0.5)` | `border-stone-600/50` | card border on hover with accent |
| border (subtle) | `#E7E5E4` | `border-stone-200` | thin dividers |

### Dark mode

| Role | Hex | Tailwind | Where to use |
|------|-----|----------|--------------|
| bg (page) | `#1C1917` | `bg-stone-900` | main background — night concrete |
| bg (alt surface) | `#292524` | `bg-stone-800` | alternate section background |
| bg (surface / cards) | `#292524` | `bg-stone-800` | cards, panels |
| bg (elevated) | `#35312D` | `bg-[#35312D]` | hover states, dropdown |
| bg (inset) | `#0C0A09` | `bg-stone-950` | recessed areas, input inset |
| text (headings) | `#F5F5F4` | `text-stone-100` | headings |
| text (body) | `#A8A29E` | `text-stone-400` | main text |
| text (muted) | `#78716C` | `text-stone-500` | secondary, placeholder |
| **accent primary** | `#A8A29E` | `text-stone-400` / `bg-stone-400` | CTA in dark mode |
| **accent hover** | `#D6D3D1` | `hover:bg-stone-300` | hover |
| border (default) | `#44403C` | `border-stone-700` | card border |
| border (hover) | `#57534E` | `border-stone-600` | hover border |

### Stone accent — main rule

**#57534E (stone-600) is the accent in light mode.** Warm industrial grey.
Not a color — but warmer and "rawer" than graphite-mono #44403C.
In dark mode the accent inverts to #A8A29E (stone-400) for contrast.

```css
/* Raw concrete glow -- more pronounced than graphite-mono */
.glow-concrete {
  box-shadow: 0 0 0 1px rgba(87, 83, 78, 0.15), 0 0 8px rgba(87, 83, 78, 0.06);
}

/* Hover glow on cards -- industrial weight */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(87, 83, 78, 0.25), 0 8px 24px -8px rgba(87, 83, 78, 0.18);
}

/* Steel edge -- visible border like steel trim */
.steel-edge {
  border: 1.5px solid var(--color-border);
  transition: border-color 0.2s ease;
}
.steel-edge:hover {
  border-color: var(--color-border-hover);
}
```

**WARNING: Do NOT use warm colored accents:**
- NO `#FDB900`, `#F59E0B` (amber/yellow) — warm color, contradicts raw aesthetic
- NO `#B45309` (terracotta) — too warm, brick-like
- NO `#EA580C` (orange) — orange, not industrial
- NO `#4F46E5` (indigo) — techy, but not concrete
- NO `#06b6d4` (cyan) — too digital
- YES `#57534E` (stone-600) — warm industrial grey
- YES `#44403C` (stone-700) — hover, deeper
- YES `#78716C` (stone-500) — muted elements
- YES `#A8A29E` (stone-400) — dark mode accent

---

## Typography

### Font families

| Element | Font | Tailwind | Why |
|---------|------|----------|-----|
| Headings (h1-h6) | Space Grotesk | `font-display` | Technical, geometric, raw industrial feel |
| Body text | Inter | `font-body` | Reliable web standard |
| Tech data, code, numbers | JetBrains Mono | `font-mono tabular-nums` | Engineering precision |
| Eyebrow labels | Space Grotesk | `font-display` | Consistency with headings |
| Badges, labels | Inter | `font-body font-medium` | Clean technical badges |
| Caps labels | Space Grotesk | `font-display uppercase` | Stamped steel effect |

### Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 | `font-normal` | body text, descriptions |
| 500 | `font-medium` | UI labels, nav links, buttons, tech data |
| 600 | `font-semibold` | card titles, section headings (Space Grotesk) |
| 700 | `font-bold` | hero titles, major headings (Space Grotesk) |

### Letter-spacing

- Hero: `tracking-tight` (Space Grotesk looks compact by default, -0.02em)
- Section headings: `tracking-tight`
- Eyebrow/labels: `tracking-wider` (0.05em) + `uppercase` — stamped steel
- Body / UI: `tracking-normal`
- Caps labels: `tracking-widest` (0.1em) + `uppercase`

### Size scale

| Element | Size | Tailwind | Font | Weight |
|---------|------|----------|------|--------|
| Hero h1 | 56-72px | text-5xl..7xl | Space Grotesk | 700 |
| Section h2 | 36-48px | text-3xl..5xl | Space Grotesk | 700 |
| Subsection h3 | 24-30px | text-2xl..3xl | Space Grotesk | 600 |
| Card title | 18-20px | text-lg..xl | Space Grotesk | 600 |
| Body | 16px | text-base | Inter | 400 |
| Small / UI | 14px | text-sm | Inter | 500 |
| Eyebrow | 12px | text-xs | Space Grotesk | 600 |
| Badge | 11-12px | text-xs | Inter | 600 |

### Tailwind config for Space Grotesk

```html
<script>
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          display: ['Space Grotesk', 'sans-serif'],
          body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },
        colors: {
          concrete: {
            50: '#FAFAF9',
            100: '#F5F5F4',
            200: '#E7E5E4',
            300: '#D6D3D1',
            400: '#A8A29E',
            500: '#78716C',
            600: '#57534E',
            700: '#44403C',
            800: '#292524',
            900: '#1C1917',
            950: '#0C0A09',
          },
        },
      }
    }
  }
</script>
```

---

## Layout Patterns

### Hero Layouts (3 variants)

**A. Industrial Centered (default)**
max-w-3xl mx-auto text-center. Eyebrow with tracking-widest -> h1 (5xl-7xl tracking-tight, Space Grotesk) -> subtitle -> CTAs.
Background — concrete texture via subtle gradient.

**B. Split Structural (product pages)**
grid lg:grid-cols-2 gap-12, left = text, right = image/3D.
Divider — visible vertical line (steel beam).

**C. Full-width Banner (construction projects)**
w-full bg-cover with overlay. Title on concrete wall.
Overlay: `bg-stone-900/60` for readability.

### Whitespace Rhythm

Concrete Steel = structural whitespace. Not "airy" like graphite-mono, but constructive.

| Section | Padding (y) | Tailwind | Character |
|---------|------------|----------|-----------|
| Hero | top: 96-120px, bottom: 80-96px | pt-24..30 pb-20..24 | Powerful entrance |
| Features / Services | 96-112px | py-24..28 | Structural |
| Project showcase | 80-96px | py-20..24 | Portfolio |
| Stats / Numbers | 64-80px | py-16..20 | Metrics |
| CTA / Contact | 80px | py-20 | Call to action |
| Catalog grid | 64-80px | py-16..20 | Project catalog |
| Footer | top: 48px, bottom: 32px | pt-12 pb-8 | Completion |

### Depth Layering (5 levels)

| Level | Light | Dark | Tailwind | Purpose |
|-------|-------|------|----------|---------|
| Level 0 | #F5F5F4 | #1C1917 | bg-stone-100 / dark:bg-stone-900 | Page background (concrete) |
| Level 1 | #E7E5E4 | #292524 | bg-stone-200 / dark:bg-stone-800 | Alt sections, footer |
| Level 2 | #FFFFFF | #292524 | bg-white / dark:bg-stone-800 | Cards, panels |
| Level 3 | #FAFAF9 | #35312D | bg-stone-50 / dark:bg-[#35312D] | Hover states, elevated |
| Level 4 | #57534E | #A8A29E | bg-stone-600 / dark:bg-stone-400 | Accent (5% of area max) |

Difference between Level 0 and Level 1 is **visible** (unlike graphite-mono).
This creates the feeling of concrete layers, structural depth.

### Hero Typography Scale

| Element | Size | Tailwind | Weight | Note |
|---------|------|----------|--------|------|
| Eyebrow | 12px | text-xs tracking-widest uppercase | font-semibold | Space Grotesk, text-stone-400 |
| h1 | 56-72px | text-5xl..7xl tracking-tight | font-bold | Space Grotesk, text-stone-900 |
| Subtitle | 18px | text-lg | font-normal | Inter, text-stone-500, max-w-xl |
| Stats (numbers) | 36px | text-4xl | font-bold | font-mono text-stone-800 |
| Stats (labels) | 12px | text-xs | font-medium | Space Grotesk uppercase, text-stone-400 |

---

## Components

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b-2 border-[var(--color-border)] bg-[var(--color-bg-page)]/90 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <a href="/" class="flex items-center gap-3 font-display text-xl font-bold text-[var(--color-text-primary)]">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" class="text-[var(--color-primary)]">
        <rect x="2" y="2" width="10" height="24" rx="1" fill="currentColor"/>
        <rect x="16" y="2" width="10" height="24" rx="1" fill="currentColor" opacity="0.5"/>
        <rect x="2" y="12" width="24" height="4" rx="1" fill="currentColor" opacity="0.7"/>
      </svg>
      <span class="tracking-tight">StroyMax</span>
    </a>
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#projects" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Projects</a>
      <a href="#services" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Services</a>
      <a href="#about" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">About</a>
      <a href="#contacts" class="text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Contacts</a>
    </div>
    <div class="flex items-center gap-3">
      <button id="theme-toggle" class="rounded-md p-2 text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]" aria-label="Toggle theme">
        <svg class="hidden h-5 w-5 dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
        </svg>
        <svg class="block h-5 w-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
      </button>
      <a href="#start" class="rounded-md bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[var(--color-primary-hover)]">Start project</a>
    </div>
  </nav>
</header>
```

Key points:
- `border-b-2` — thickened bottom border (steel beam), not 1px like graphite-mono.
- `bg-[var(--color-bg-page)]/90` — concrete bg with transparency.
- Links hover -> darken via var(--color-text-primary).
- Dark mode toggle is mandatory.

### Hero (Industrial Centered)

```html
<section class="relative overflow-hidden bg-[var(--color-bg-page)] pt-28 pb-20">
  <!-- Subtle concrete texture overlay -->
  <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E');"></div>

  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
        Turnkey construction
      </span>
      <h1 class="mt-6 font-display text-5xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
        Building the future<br>
        <span class="text-[var(--color-primary)]">on concrete foundations</span>
      </h1>
      <p class="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
        20 years of experience. 340+ completed projects. From design to handover,
        every phase under control.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <a href="#consultation" class="rounded-md bg-[var(--color-primary)] px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_0_0_1px_rgba(87,83,78,0.3),0_8px_24px_-8px_rgba(87,83,78,0.2)]">
          Get consultation
        </a>
        <a href="#projects" class="rounded-md border-2 border-[var(--color-border)] bg-transparent px-7 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
          View projects
        </a>
      </div>
      <div class="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8 border-t-2 border-[var(--color-border)] pt-8">
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">340+</span>
          <span class="mt-1 block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">projects</span>
        </div>
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">20</span>
          <span class="mt-1 block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">years</span>
        </div>
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-[var(--color-text-primary)]">98%</span>
          <span class="mt-1 block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">on time</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

Key features:
- `border-t-2` for stats bar — thick separator (steel beam).
- Subtle concrete texture overlay — barely visible noise.
- h1 in Space Grotesk `tracking-tight` — technical power.
- CTA: solid stone-600 + visible shadow on hover.
- Hero contrast: 72px / 12px = 6x -> industrial bold.

### Hero (Split Structural)

```html
<section class="relative overflow-hidden bg-[var(--color-bg-page)] py-20">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Industrial construction</span>
        <h2 class="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Engineering<br>precision in every<br>element
        </h2>
        <p class="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
          From foundations to roofing systems. Every project is calculated,
          not guessed. BIM modeling at all stages.
        </p>
        <div class="mt-8 flex items-center gap-4">
          <a href="#services" class="rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]">Our services</a>
          <a href="#portfolio" class="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-primary)]">
            Portfolio
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-[4/3] overflow-hidden rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]">
          <img src="/images/project-hero.jpg" alt="Construction project" class="h-full w-full object-cover"/>
        </div>
        <div class="absolute -bottom-4 -left-4 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 shadow-[var(--shadow-elevated)]">
          <span class="font-mono text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">12</span>
          <span class="ml-2 font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">active<br>projects</span>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Feature Card

```html
<div class="group rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
  <div class="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-primary-subtle)]">
    <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375a2.25 2.25 0 012.25-2.25h2.25M6.75 21h2.25A2.25 2.25 0 006.75 18.75V21z"/>
    </svg>
  </div>
  <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">Design</h3>
  <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
    Full cycle of design documentation. BIM modeling, expert review, author supervision.
  </p>
  <a href="#" class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]">
    Learn more
    <svg class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
  </a>
</div>
```

Differences from graphite-mono:
- `border-2` instead of `border` — visible, structural borders.
- `rounded-lg` instead of `rounded-2xl` — less rounded, more raw.
- Icons 12x12 (h-12 w-12) — larger, industrial weight.
- Hover shadow — more pronounced (var(--shadow-card-hover)).
- Links with animated arrow (translate-x on hover).

### Project Card (for construction brand)

```html
<div class="group overflow-hidden rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
  <div class="aspect-[16/10] overflow-hidden bg-[var(--color-bg-alt)]">
    <img src="/images/projects/tower-01.jpg" alt="Horizon Residential Complex" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
  </div>
  <div class="p-5">
    <div class="flex flex-wrap gap-2">
      <span class="rounded-sm bg-[var(--color-primary-subtle)] px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-primary)]">Residential</span>
      <span class="rounded-sm bg-[var(--color-bg-alt)] px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">2024</span>
    </div>
    <h3 class="mt-3 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">Horizon Residential Complex</h3>
    <p class="mt-1.5 text-sm text-[var(--color-text-secondary)]">25-story residential complex with underground parking. Monolithic frame.</p>
    <div class="mt-4 flex items-center gap-6 border-t border-[var(--color-border-subtle)] pt-4">
      <div>
        <span class="font-mono text-sm font-bold tabular-nums text-[var(--color-text-primary)]">42,000</span>
        <span class="block text-xs text-[var(--color-text-muted)]">sq m area</span>
      </div>
      <div>
        <span class="font-mono text-sm font-bold tabular-nums text-[var(--color-text-primary)]">18</span>
        <span class="block text-xs text-[var(--color-text-muted)]">months</span>
      </div>
      <div>
        <span class="font-mono text-sm font-bold tabular-nums text-[var(--color-text-primary)]">$24M</span>
        <span class="block text-xs text-[var(--color-text-muted)]">budget</span>
      </div>
    </div>
  </div>
</div>
```

### Material / Product Card

```html
<div class="group rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
  <div class="flex items-start justify-between">
    <div class="flex h-14 w-14 items-center justify-center rounded-md bg-[var(--color-bg-alt)]">
      <svg class="h-7 w-7 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"/>
      </svg>
    </div>
    <span class="rounded-sm bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-[var(--color-success)] dark:bg-emerald-900/20">In stock</span>
  </div>
  <h4 class="mt-4 font-display text-base font-semibold text-[var(--color-text-primary)]">Concrete M400 (B30)</h4>
  <p class="mt-1 text-sm text-[var(--color-text-secondary)]">Heavy concrete class B30. Frost resistance F200.</p>
  <div class="mt-4 flex items-end justify-between">
    <div>
      <span class="font-mono text-2xl font-bold tabular-nums text-[var(--color-text-primary)]">$65</span>
      <span class="ml-1 text-sm text-[var(--color-text-muted)]">/m3</span>
    </div>
    <button class="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[var(--color-primary-hover)]">Order</button>
  </div>
</div>
```

### Buttons

**Primary (solid stone):**

```html
<button class="rounded-md bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[0_0_0_1px_rgba(87,83,78,0.3),0_8px_24px_-8px_rgba(87,83,78,0.2)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  Start project
</button>
```

**Secondary (outline — thick border):**

```html
<button class="rounded-md border-2 border-[var(--color-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  View projects
</button>
```

**Ghost:**

```html
<button class="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]">
  All services
</button>
```

**Danger:**

```html
<button class="rounded-md bg-[var(--color-danger)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-danger)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]">
  Delete object
</button>
```

| Variant | Class | When |
|---------|-------|------|
| Primary | `bg-[var(--color-primary)] text-white` | Main CTA |
| Secondary | `border-2 border-[var(--color-border)]` | Secondary action |
| Ghost | `hover:bg-[var(--color-bg-alt)]` | In-section navigation |
| Danger | `bg-[var(--color-danger)] text-white` | Destructive actions |

**Rules:**
- Buttons `rounded-md`, NOT `rounded-full`.
- Border-2 for secondary — structural style.
- Gradient on buttons allowed ONLY via `var(--gradient-primary)` for hero CTA.

### Badges

```html
<!-- Default badge -->
<span class="rounded-sm bg-[var(--color-bg-alt)] px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">
  Completed
</span>

<!-- Accent badge -->
<span class="rounded-sm bg-[var(--color-primary-subtle)] px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-primary)]">
  In progress
</span>

<!-- Success badge -->
<span class="rounded-sm bg-emerald-50 px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-success)] dark:bg-emerald-900/20">
  On schedule
</span>

<!-- Status dot badge -->
<span class="inline-flex items-center gap-1.5 rounded-sm bg-[var(--color-bg-alt)] px-2.5 py-1 font-display text-[11px] font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">
  <span class="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"></span>
  Active
</span>
```

Badge rules:
- `rounded-sm` — minimal rounding (raw).
- `font-display` + `tracking-wider` + `uppercase` — stamped steel.
- Size 11px — small, technical.

### Table (specifications / estimate)

```html
<div class="overflow-hidden rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)]">
  <div class="border-b-2 border-[var(--color-border)] bg-[var(--color-bg-alt)] px-6 py-3">
    <h4 class="font-display text-sm font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">Material specifications</h4>
  </div>
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-[var(--color-border)]">
        <th class="px-6 py-3.5 font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Material</th>
        <th class="px-6 py-3.5 font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Grade</th>
        <th class="px-6 py-3.5 font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Volume</th>
        <th class="px-6 py-3.5 text-right font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Cost</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--color-border-subtle)] transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]">
        <td class="px-6 py-3.5 font-medium text-[var(--color-text-primary)]">Concrete M400</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">B30</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">1,200 m3</td>
        <td class="px-6 py-3.5 text-right font-mono font-semibold tabular-nums text-[var(--color-text-primary)]">$780,000</td>
      </tr>
      <tr class="border-b border-[var(--color-border-subtle)] transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]">
        <td class="px-6 py-3.5 font-medium text-[var(--color-text-primary)]">Rebar A500C</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">D16</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">85 t</td>
        <td class="px-6 py-3.5 text-right font-mono font-semibold tabular-nums text-[var(--color-text-primary)]">$635,000</td>
      </tr>
      <tr class="transition-colors duration-150 hover:bg-[var(--color-bg-elevated)]">
        <td class="px-6 py-3.5 font-medium text-[var(--color-text-primary)]">Brick M150</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">Standard</td>
        <td class="px-6 py-3.5 font-mono tabular-nums text-[var(--color-text-secondary)]">45,000 pcs</td>
        <td class="px-6 py-3.5 text-right font-mono font-semibold tabular-nums text-[var(--color-text-primary)]">$459,000</td>
      </tr>
    </tbody>
    <tfoot>
      <tr class="border-t-2 border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <td colspan="3" class="px-6 py-3.5 font-display text-sm font-semibold text-[var(--color-text-primary)]">Total</td>
        <td class="px-6 py-3.5 text-right font-mono text-base font-bold tabular-nums text-[var(--color-text-primary)]">$1,874,000</td>
      </tr>
    </tfoot>
  </table>
</div>
```

Key points:
- `border-2` — visible structural borders.
- Table header in `bg-[var(--color-bg-alt)]` — steel header look.
- `font-display uppercase tracking-wider` in th — stamped labels.
- `border-t-2` on footer — thick total line.
- Row hover — `bg-[var(--color-bg-elevated)]`.

### Form (consultation request)

```html
<form class="rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-8">
  <h3 class="font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Request consultation</h3>
  <p class="mt-2 text-sm text-[var(--color-text-secondary)]">Fill the form -- engineer will contact you within 2 hours.</p>
  <div class="mt-6 space-y-5">
    <div>
      <label for="name" class="block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Name</label>
      <input id="name" type="text" placeholder="John Smith"
        class="mt-2 block w-full rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"/>
    </div>
    <div>
      <label for="phone" class="block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Phone</label>
      <input id="phone" type="tel" placeholder="+1 (555) 123-4567"
        class="mt-2 block w-full rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"/>
    </div>
    <div>
      <label for="project-type" class="block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Project type</label>
      <select id="project-type"
        class="mt-2 block w-full rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]">
        <option>Residential complex</option>
        <option>Industrial facility</option>
        <option>Commercial property</option>
        <option>Infrastructure</option>
      </select>
    </div>
    <div>
      <label for="message" class="block font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">Project description</label>
      <textarea id="message" rows="4" placeholder="Describe your project: area, location, timeline..."
        class="mt-2 block w-full rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg-page)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"></textarea>
    </div>
  </div>
  <button type="submit" class="mt-6 w-full rounded-md bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]">
    Submit request
  </button>
  <p class="mt-3 text-center text-xs text-[var(--color-text-muted)]">By clicking, you agree to the data processing policy.</p>
</form>
```

Key points:
- Inputs: `bg-[var(--color-bg-page)]` + `border-2 border-[var(--color-border)]` — inset concrete look.
- Labels: `font-display uppercase tracking-wider` — stamped steel labels.
- Focus: `border-[var(--color-primary)]` + `ring-1`.
- Submit: solid primary + brand shadow on hover.

### Feature Grid (services section)

```html
<section class="bg-[var(--color-bg-page)] py-24" id="services">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Services</span>
      <h2 class="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">Full construction cycle</h2>
      <p class="mt-4 text-lg text-[var(--color-text-secondary)]">From the first line on the blueprint to the last brick in the wall.</p>
    </div>
    <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Card 1 -->
      <div class="group rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-primary-subtle)]">
          <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">Design</h3>
        <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">Architectural solutions, structural engineering, MEP systems. BIM modeling LOD 300+.</p>
      </div>
      <!-- Card 2 -->
      <div class="group rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-primary-subtle)]">
          <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.59-3.38a.75.75 0 01-.02-1.28l5.59-3.38a.75.75 0 01.82.02l5.59 3.38a.75.75 0 01-.02 1.28l-5.59 3.38a.75.75 0 01-.78 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17l-5.59-3.38a.75.75 0 01-.02-1.28l5.59-3.38a.75.75 0 01.82.02l5.59 3.38a.75.75 0 01-.02 1.28l-5.59 3.38a.75.75 0 01-.78 0zM11.42 20.17l-5.59-3.38a.75.75 0 01-.02-1.28l5.59-3.38a.75.75 0 01.82.02l5.59 3.38a.75.75 0 01-.02 1.28l-5.59 3.38a.75.75 0 01-.78 0z"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">Construction</h3>
        <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">Monolith, masonry, steel structures. Own equipment and crews.</p>
      </div>
      <!-- Card 3 -->
      <div class="group rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]">
        <div class="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-primary-subtle)]">
          <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
          </svg>
        </div>
        <h3 class="mt-5 font-display text-lg font-semibold tracking-tight text-[var(--color-text-primary)]">Quality control</h3>
        <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">Quality control at every stage. Laboratory testing of materials.</p>
      </div>
    </div>
  </div>
</section>
```

### Stats Section (Numbers)

```html
<section class="bg-[var(--color-bg-alt)] py-20">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
      <div class="text-center">
        <span class="font-mono text-4xl font-bold tabular-nums text-[var(--color-text-primary)]">340+</span>
        <span class="mt-2 block font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Completed projects</span>
        <div class="mx-auto mt-3 h-1 w-8 rounded-full bg-[var(--color-primary)]"></div>
      </div>
      <div class="text-center">
        <span class="font-mono text-4xl font-bold tabular-nums text-[var(--color-text-primary)]">2.8M</span>
        <span class="mt-2 block font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">sq m built</span>
        <div class="mx-auto mt-3 h-1 w-8 rounded-full bg-[var(--color-primary)]"></div>
      </div>
      <div class="text-center">
        <span class="font-mono text-4xl font-bold tabular-nums text-[var(--color-text-primary)]">1,200</span>
        <span class="mt-2 block font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Employees</span>
        <div class="mx-auto mt-3 h-1 w-8 rounded-full bg-[var(--color-primary)]"></div>
      </div>
      <div class="text-center">
        <span class="font-mono text-4xl font-bold tabular-nums text-[var(--color-text-primary)]">98%</span>
        <span class="mt-2 block font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">On schedule</span>
        <div class="mx-auto mt-3 h-1 w-8 rounded-full bg-[var(--color-primary)]"></div>
      </div>
    </div>
  </div>
</section>
```

Key points:
- Background `bg-[var(--color-bg-alt)]` — recessed section (Level 1).
- Numbers in `font-mono tabular-nums` — engineering precision.
- Labels in `font-display uppercase tracking-widest` — stamped.
- Accent bar under numbers — stone-600, visual anchor.

### CTA Section (with gradient)

```html
<section class="relative overflow-hidden bg-[var(--color-primary)] py-20">
  <!-- Steel beam pattern overlay -->
  <div class="absolute inset-0 opacity-5" style="background-image: repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(255,255,255,0.1) 120px, rgba(255,255,255,0.1) 122px);"></div>
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to start construction?</h2>
      <p class="mt-4 text-lg text-white/70">Get a free engineer consultation and preliminary estimate within 48 hours.</p>
      <div class="mt-8 flex items-center justify-center gap-4">
        <a href="#consultation" class="rounded-md bg-white px-7 py-3.5 text-base font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-stone-100 hover:shadow-lg">Get estimate</a>
        <a href="tel:+18001234567" class="rounded-md border-2 border-white/30 px-7 py-3.5 text-base font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/10">+1 (800) 123-4567</a>
      </div>
    </div>
  </div>
</section>
```

### Footer

```html
<footer class="bg-[var(--color-bg-alt)] pt-12 pb-8">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <a href="/" class="flex items-center gap-2 font-display text-lg font-bold text-[var(--color-text-primary)]">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" class="text-[var(--color-primary)]">
            <rect x="2" y="2" width="10" height="24" rx="1" fill="currentColor"/>
            <rect x="16" y="2" width="10" height="24" rx="1" fill="currentColor" opacity="0.5"/>
            <rect x="2" y="12" width="24" height="4" rx="1" fill="currentColor" opacity="0.7"/>
          </svg>
          StroyMax
        </a>
        <p class="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">Full-cycle construction company. Design, build, deliver.</p>
      </div>
      <div>
        <h4 class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Services</h4>
        <ul class="mt-4 space-y-2.5">
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Design</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Construction</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Renovation</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Supervision</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Company</h4>
        <ul class="mt-4 space-y-2.5">
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">About</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Projects</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Careers</a></li>
          <li><a href="#" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Contacts</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Contacts</h4>
        <ul class="mt-4 space-y-2.5">
          <li class="text-sm text-[var(--color-text-secondary)]">+1 (800) 123-4567</li>
          <li class="text-sm text-[var(--color-text-secondary)]">info@stroymax.com</li>
          <li class="text-sm text-[var(--color-text-secondary)]">Moscow, Stroiteley St, 1</li>
        </ul>
      </div>
    </div>
    <div class="mt-10 border-t-2 border-[var(--color-border)] pt-6">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-[var(--color-text-muted)]">(c) 2024 StroyMax. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Privacy policy</a>
          <a href="#" class="text-sm text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-text-primary)]">Terms</a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

Key points:
- `bg-[var(--color-bg-alt)]` — footer recessed (Level 1).
- Section headings: `font-display uppercase tracking-widest` — stamped steel.
- `border-t-2` — thick separator line.
- Links hover -> `text-[var(--color-text-primary)]` (darken, no hue change).

---

## Dark Mode (Architectural Showcase)

### Theme toggle

```html
<script>
  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  if (localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    root.classList.add('dark');
  }
  toggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
  });
</script>
```

### Dark mode hero example

```html
<section class="relative overflow-hidden bg-[var(--color-bg-page)] pt-28 pb-20">
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">Industrial Construction</span>
      <h1 class="mt-6 font-display text-5xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
        Concrete vision,<br><span class="text-[var(--color-primary)]">steel precision</span>
      </h1>
      <p class="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">Engineering excellence delivered on time and on budget.</p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <a href="#start" class="rounded-md bg-[var(--color-primary)] px-7 py-3.5 text-base font-semibold text-[var(--color-text-inverse)] transition-all duration-200 hover:bg-[var(--color-primary-hover)]">Start your project</a>
        <a href="#portfolio" class="rounded-md border-2 border-[var(--color-border)] px-7 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">View portfolio</a>
      </div>
    </div>
  </div>
</section>
```

In dark mode:
- Background #1C1917 (stone-900) — night concrete.
- Accent inverts to #A8A29E (stone-400) — light steel on dark background.
- Text #F5F5F4 (stone-100) for headings.
- CTA `text-[var(--color-text-inverse)]` — auto-switches.
- Shadows deeper, higher opacity.

---

## Wow Patterns (Industrial)

### 1. Stagger Reveal (cascade appearance) — ALWAYS

```html
<style>
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 100ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 200ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 300ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 400ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 500ms; }
</style>

<div class="stagger grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div class="reveal rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
  <div class="reveal rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
  <div class="reveal rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6">...</div>
</div>
```

### 2. Steel Beam Divider

Horizontal separator — visible steel beam.

```html
<style>
.steel-divider {
  height: 3px;
  background: var(--gradient-steel);
  border: none;
  margin: 0;
}
.steel-divider--thin { height: 1.5px; }
</style>

<hr class="steel-divider">
```

Tailwind: `<hr class="h-0.5 border-0 bg-gradient-to-r from-stone-500 via-stone-600 to-stone-700">`

### 3. Concrete Texture Background

Subtle noise texture for hero sections.

```html
<style>
.concrete-bg { position: relative; }
.concrete-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  pointer-events: none;
}
</style>
```

### 4. Number Counter (for stats)

```html
<script>
function animateCounter(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (target - start) * eased);
    el.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
</script>
```

### 5. Progress Bar (construction phases)

```html
<div class="w-full">
  <div class="flex items-center justify-between mb-2">
    <span class="font-display text-xs font-semibold tracking-wider uppercase text-[var(--color-text-secondary)]">Phase 3: Monolith works</span>
    <span class="font-mono text-sm font-bold tabular-nums text-[var(--color-text-primary)]">67%</span>
  </div>
  <div class="h-2 w-full overflow-hidden rounded-full bg-[var(--color-bg-alt)]">
    <div class="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000" style="width: 67%"></div>
  </div>
</div>
```

### Allowed wow-patterns

| Pattern | Status | Comment |
|---------|--------|---------|
| Stagger Reveal | YES Always | Cascade card appearance |
| Steel Beam Divider | YES | Horizontal separators |
| Concrete Texture | YES | Subtle noise on hero |
| Number Counter | YES | For stats sections |
| Progress Bar | YES | For project phases |
| Hover Lift | YES | -2px translateY on cards |
| Image Zoom on Hover | YES | scale-105 for project cards |

### DO NOT use

| NO Pattern | Why |
|------------|-----|
| Text Shimmer | Too glamorous for concrete |
| Gradient Border Animation | Not industrial |
| Spotlight Follow Cursor | Digital, not physical |
| Morphing Blob | Organic, not structural |
| Neon Glow | Cyberpunk, not concrete |
| Parallax (strong) | Light parallax (0.3x) OK, no more |
| Confetti / Particles | Festive, not industrial |

---

## Anti-patterns (FORBIDDEN)

| NO | YES Instead |
|----|-------------|
| Warm colored accents (amber #FDB900, terracotta #B45309, orange #EA580C) | Stone grey: #57534E, #44403C, #78716C |
| Yellow / gold (#F59E0B, #FBBF24) | Stone-600 — warm GREY, not yellow |
| Indigo / blue / cyan / violet | Only stone spectrum |
| `rounded-full` on buttons | `rounded-md` |
| `rounded-2xl` on cards | `rounded-lg` — less rounded |
| `border` (1px) — too thin | `border-2` — structural borders |
| `font-sans` for hero | `font-display` (Space Grotesk) |
| Thin airy shadows | Pronounced stone-tinted shadows |
| Colored icons | Stone-grey icons (var(--color-primary)) |
| bg-white for page | bg-[var(--color-bg-page)] (concrete #F5F5F4) |
| Colored hover on links | Darken to text-primary, no hue change |
| Gradient buttons (colored) | Solid primary or gradient-primary (stone) |

---

## Theme-specific exceptions

| Base rule | Exception in concrete-steel | Justification |
|-----------|---------------------------|---------------|
| Heavy shadows | `--shadow-brand` blur 30px, opacity 0.35 | Industrial weight, stone-tinted |
| Border-2 (thicker than tokens) | Cards and forms = `border-2` | Structural style, steel edges |
| Noise texture overlay | Concrete texture on hero (opacity 0.03) | Concrete surface |
| `rounded-lg` instead of `rounded-2xl` | Cards = `rounded-lg` (8-12px) | Raw, less rounded |
| Gradient on CTA | Only `var(--gradient-primary)` (stone gradient) | Stone gradient allowed |

### What is NOT overridden (strictly as in tokens):

- Buttons — `rounded-md`, NOT `rounded-full`.
- Section padding >= `py-16`.
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Accessibility — focus rings, contrast ratios.

---

## Tailwind Classes Mapping

### Backgrounds

| Token | Light | Dark | Tailwind |
|-------|-------|------|----------|
| bg-page | #F5F5F4 | #1C1917 | `bg-stone-100` / `dark:bg-stone-900` |
| bg-alt | #E7E5E4 | #292524 | `bg-stone-200` / `dark:bg-stone-800` |
| surface | #FFFFFF | #292524 | `bg-white` / `dark:bg-stone-800` |
| bg-elevated | #FAFAF9 | #35312D | `bg-stone-50` / `dark:bg-[#35312D]` |
| bg-inset | #D6D3D1 | #0C0A09 | `bg-stone-300` / `dark:bg-stone-950` |

### Text

| Token | Light | Dark | Tailwind |
|-------|-------|------|----------|
| text-primary | #1C1917 | #F5F5F4 | `text-stone-900` / `dark:text-stone-100` |
| text-secondary | #57534E | #A8A29E | `text-stone-600` / `dark:text-stone-400` |
| text-muted | #57534E | #78716C | `text-stone-600` / `dark:text-stone-500` |

### Accent

| Token | Light | Dark | Tailwind |
|-------|-------|------|----------|
| primary | #57534E | #A8A29E | `bg-stone-600` / `dark:bg-stone-400` |
| primary-hover | #44403C | #D6D3D1 | `hover:bg-stone-700` / `dark:hover:bg-stone-300` |
| primary-subtle | rgba(87,83,78,0.08) | rgba(168,162,158,0.1) | `bg-stone-600/[0.08]` / `dark:bg-stone-400/[0.1]` |

### Borders

| Token | Light | Dark | Tailwind |
|-------|-------|------|----------|
| border | #D6D3D1 | #44403C | `border-stone-300` / `dark:border-stone-700` |
| border-hover | #A8A29E | #57534E | `border-stone-400` / `dark:border-stone-600` |
| border-subtle | #E7E5E4 | #35312D | `border-stone-200` / `dark:border-[#35312D]` |

### Typography

| Token | Tailwind |
|-------|----------|
| Display font | `font-display` (Space Grotesk) |
| Body font | `font-body` (Inter) |
| Mono font | `font-mono` (JetBrains Mono) |

---

## Concrete Steel checklist

- [ ] Page background = `bg-stone-100` (#F5F5F4), NOT `bg-white`.
- [ ] Dark mode: background = `dark:bg-stone-900` (#1C1917).
- [ ] Cards = `bg-white border-2 border-stone-300 rounded-lg`.
- [ ] CTA = solid `bg-stone-600 text-white` (or gradient-primary stone).
- [ ] Headings = Space Grotesk (`font-display`).
- [ ] Body = Inter (`font-body`).
- [ ] **NO warm colored accents** — amber, yellow, terracotta, orange = BAN.
- [ ] Stone grey spectrum only: stone-400 through stone-800.
- [ ] Borders = `border-2` (structural, visible).
- [ ] Links hover -> darken, NOT change hue.
- [ ] Labels = `font-display uppercase tracking-wider`.
- [ ] Buttons = `rounded-md`, NOT `rounded-full`.
- [ ] Cards = `rounded-lg`, NOT `rounded-2xl`.
- [ ] Footer = `bg-stone-200` / `dark:bg-stone-800`.
- [ ] Dark mode toggle — mandatory element.
- [ ] Stats in `font-mono tabular-nums`.
- [ ] **NOT #FDB900, NOT #B45309, NOT #F59E0B, NOT #EA580C** — only stone greys.
- [ ] Concrete texture overlay on hero (opacity <= 0.03).
- [ ] Steel beam dividers (`border-t-2` or gradient).
