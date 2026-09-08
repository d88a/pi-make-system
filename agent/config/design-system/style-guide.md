# Style Guide — Примеры реальных сайтов

> Эталонные дизайн-системы. Читай когда генерируешь новый стиль.
> Используй как референс для палитры, типографики, layout.

## Как использовать

1. Получи описание сайта от архитектора
2. Найди **ближайший эталон** в этом файле (по типу/индустрии/mood)
3. Возьми **структуру стиля** (не копируй 1:1!)
4. Адаптируй под конкретную задачу

---

## 1. SaaS / Developer Tools

### Linear (linear.app)
**Mood:** Minimal, precise, technical, dark-first

```
Палитра:
- bg: #0a0a0a (almost black)
- surface: #171717 (elevated)
- text: #fafafa (headings), #a3a3a3 (body)
- accent: #5e6ad2 (indigo-violet)
- success: #26c281 (green)

Типографика:
- Headings: Inter, 700, tracking-tight
- Body: Inter, 400
- Mono: JetBrains Mono для кода

Layout:
- Sidebar navigation (fixed left)
- Content: max-w-5xl, centered
- Cards: border border-neutral-800, rounded-lg

Ключевые приёмы:
- Subtle borders (не shadows)
- Keyboard shortcuts visible (⌘K)
- Status badges (dot + text)
- Minimal decoration
```

### Vercel (vercel.com)
**Mood:** Clean, professional, black/white, confident

```
Палитра:
- bg: #ffffff
- text: #000000 (headings), #666666 (body)
- accent: #0070f3 (blue)
- border: #eaeaea

Типографика:
- Headings: Inter, 700, tracking-tight
- Hero: 64px, bold
- Body: 16px, line-height 1.6

Layout:
- Centered hero, max-w-4xl
- Feature grid: 3 columns
- Cards: rounded-xl, border, no shadow

Ключевые приёмы:
- Black/white only (no color noise)
- Generous whitespace
- Code snippets as hero visual
- Gradient text (black → gray)
```

### Stripe (stripe.com)
**Mood:** Vibrant, premium, glass-morphism, colorful

```
Палитра:
- bg: #ffffff with mesh gradient blobs
- gradient blobs: purple (#635bff), cyan, orange, pink
- text: #0a2540 (navy), #425466 (body)
- accent: #635bff (stripe purple)

Типографика:
- Headings: Custom sans-serif (похож на Inter), 700
- Hero: 56px, bold
- Body: 17px

Layout:
- Mesh gradient background (radial-gradient blobs)
- Glass cards: bg-white/70, backdrop-blur-xl
- Centered sections, max-w-6xl

Ключевые приёмы:
- Mesh gradient (3-5 color blobs, opacity 0.2-0.3)
- Glassmorphism (frosted glass cards)
- Gradient text on key words
- Color shadows on buttons (shadow-purple/25)
- Animated transitions
```

---

## 2. Medical / Healthcare

### Zocdoc (zocdoc.com)
**Mood:** Trustworthy, clean, accessible, friendly

```
Палитра:
- bg: #ffffff
- surface: #f7fafc (light gray)
- text: #1a202c (headings), #4a5568 (body)
- accent: #00a699 (teal-green)
- success: #48bb78

Типографика:
- Headings: Sans-serif, 700
- Hero: 48px
- Body: 16px, generous line-height

Layout:
- Search-first (big search bar in hero)
- Cards: doctor profiles with photo
- Grid: 3 columns desktop
- Rounded corners (rounded-xl)

Ключевые приёмы:
- Search bar as hero (prominent CTA)
- Doctor cards with ratings (stars)
- Trust badges (insurance logos)
- Appointment booking flow
- Calming colors (green/teal)
```

### Carbon Health (carbonhealth.com)
**Mood:** Modern, approachable, tech-forward

```
Палитра:
- bg: #ffffff
- text: #000000 (headings), #4a4a4a (body)
- accent: #00d4aa (mint green)
- secondary: #6366f1 (indigo)

Типографика:
- Headings: Sans-serif, 600
- Hero: 56px
- Body: 18px

Layout:
- Split hero (text left, image right)
- Service cards: large, with icons
- Testimonials: quote + photo
- CTA sections: colored backgrounds

Ключевые приёмы:
- Friendly illustrations (not stock photos)
- Clear CTAs ("Book now", "Get started")
- Insurance logos (trust)
- Patient testimonials (social proof)
- Mobile-first (app download prominent)
```

---

## 3. Portfolio / Creative

### Brittany Chiang (brittanychiang.com)
**Mood:** Minimal, personal, developer portfolio

```
Палитра:
- bg: #0a192f (dark navy)
- text: #ccd6f6 (light), #8892b0 (muted)
- accent: #64ffda (mint/teal)
- border: #233554

Типографика:
- Headings: Calibre, 700
- Body: SF Mono, 14px (mono for everything!)
- Hero name: 80px

Layout:
- Single page, scroll-based
- Sections: About, Experience, Projects, Contact
- Side elements (email, social icons fixed)
- Max-width: 1000px

Ключевые приёмы:
- Mono font for body (unique!)
- Fixed side elements (email right, social left)
- Scroll reveal animations
- Hover effects on project cards
- Accent color used sparingly (links, icons)
```

### Rauno Freiberg (rauno.me)
**Mood:** Playful, interactive, design-engineer

```
Палитра:
- bg: #fafafa (light)
- text: #1a1a1a
- accent: #ff6b6b (coral red)
- secondary: #4ecdc4 (teal)

Типографика:
- Headings: Custom, playful
- Body: Inter, 16px
- Hero: 72px, bold

Layout:
- Bento grid (asymmetric cards)
- Interactive demos embedded
- Hover effects everywhere
- Smooth transitions

Ключевые приёмы:
- Bento grid layout
- Interactive code demos
- Playful micro-animations
- Color used for emphasis (not decoration)
- Whitespace generous
```

---

## 4. E-commerce

### Allbirds (allbirds.com)
**Mood:** Sustainable, minimal, product-focused

```
Палитра:
- bg: #ffffff
- surface: #f5f5f5 (light gray)
- text: #212a30 (dark), #6b7280 (body)
- accent: #2563eb (blue)
- natural: #d4a574 (beige, sustainability)

Типографика:
- Headings: Sans-serif, 700
- Hero: 64px
- Body: 16px

Layout:
- Full-width hero (product image)
- Product grid: 3-4 columns
- Product cards: image + name + price
- Sticky add-to-cart

Ключевые приёмы:
- Product photography (high quality)
- Minimal UI (product is hero)
- Sustainability badges
- Color swatches on cards
- Quick-view on hover
```

### Graza (graza.co)
**Mood:** Playful, bold, DTC brand

```
Палитра:
- bg: #fff8e7 (cream)
- text: #1a1a1a
- accent: #ff6b35 (orange)
- secondary: #004e89 (blue)

Типографика:
- Headings: Custom display, playful
- Hero: 80px, bold
- Body: 18px

Layout:
- Full-width hero (lifestyle photo)
- Scrolling product showcase
- Bold typography
- Illustrations + photos mixed

Ключевые приёмы:
- Bold colors (orange + blue)
- Playful illustrations
- Recipe cards (content marketing)
- Subscription CTA prominent
- Scarcity ("Limited batch")
```

---

## 5. Construction / Industrial

### Buildkite (buildkite.com)
**Mood:** Industrial, reliable, technical

```
Палитра:
- bg: #ffffff
- text: #1a1a1a
- accent: #f97316 (orange)
- secondary: #3b82f6 (blue)

Типографика:
- Headings: Sans-serif, 700
- Hero: 56px
- Body: 17px

Layout:
- Split hero (text + screenshot)
- Feature sections: alternating (text left/right)
- Stats section (big numbers)
- Customer logos marquee

Ключевые приёмы:
- Orange for CTAs (construction color)
- Screenshots as proof
- Stats (99.9% uptime, 10k+ teams)
- Trust badges (security certifications)
- Case studies
```

---

## 6. Education / LMS

### Duolingo (duolingo.com)
**Mood:** Playful, gamified, friendly

```
Палитра:
- bg: #ffffff
- text: #4b4b4b
- accent: #58cc02 (duolingo green)
- secondary: #ce82ff (purple), #ff4b4b (red)

Типографика:
- Headings: Din Round, 700 (rounded sans)
- Hero: 48px
- Body: 16px

Layout:
- Character mascot in hero
- Gamified progress (hearts, gems, streaks)
- Lesson cards with icons
- Leaderboard section

Ключевые приёмы:
- Mascot (owl character)
- Gamification (XP, streaks, hearts)
- Bright colors (green primary)
- Progress bars everywhere
- Friendly illustrations
```

### Coursera (coursera.org)
**Mood:** Professional, trustworthy, academic

```
Палитра:
- bg: #ffffff
- text: #1f1f1f
- accent: #0056d2 (coursera blue)
- success: #00c853

Типографика:
- Headings: Graphik, 600
- Hero: 48px
- Body: 16px

Layout:
- Search bar hero
- Course cards: image + title + rating + price
- Category grid
- University logos (trust)

Ключевые приёмы:
- University partnerships (Stanford, Yale logos)
- Course catalog (search-first)
- Ratings + reviews (social proof)
- Certificates (career outcome)
- Free trial CTA
```

---

## 7. Crypto / Fintech

### Coinbase (coinbase.com)
**Mood:** Trustworthy, institutional, clean

```
Палитра:
- bg: #ffffff
- text: #052e52 (navy), #5b6b7d (body)
- accent: #0052ff (coinbase blue)
- success: #05b169 (green)

Типографика:
- Headings: Coinbase Sans, 700
- Hero: 56px
- Body: 16px

Layout:
- Split hero (text + product screenshot)
- Price ticker (live crypto prices)
- Feature grid: 3 columns
- Trust section (security badges)

Ключевые приёмы:
- Live price data (real-time)
- Security emphasis (2FA, insurance)
- Institutional trust (Nasdaq: COIN)
- Mobile app download
- Educational content (learn section)
```

---

## 8. Restaurant / Food

### Sweetgreen (sweetgreen.com)
**Mood:** Fresh, healthy, local

```
Палитра:
- bg: #ffffff
- text: #1a1a1a
- accent: #4a7c59 (forest green)
- natural: #f4e9d8 (cream)

Типографика:
- Headings: Serif (elegant)
- Hero: 64px
- Body: 18px

Layout:
- Full-width food photography
- Menu grid (bowls, plates, drinks)
- Location finder
- Sustainability story

Ключевые приёмы:
- Food photography (appetizing)
- Seasonal menu (changes often)
- Local sourcing story
- Nutritional info
- Order online CTA
```

---

## Как генерировать новый стиль

### Алгоритм (для ui-coder)

1. **Прочитай описание сайта**
   - Индустрия? (medical, e-commerce, portfolio)
   - Mood? (trustworthy, playful, premium, minimal)
   - Целевая аудитория? (B2B, consumers, developers)

2. **Найди ближайший эталон** в этом файле
   - Medical → Zocdoc / Carbon Health
   - SaaS → Linear / Vercel
   - Portfolio → Brittany Chiang / Rauno
   - E-commerce → Allbirds / Graza
   - Construction → Buildkite
   - Education → Duolingo / Coursera
   - Crypto → Coinbase
   - Food → Sweetgreen

3. **Извлеки атрибуты стиля**:
   - Светлый/тёмный?
   - Яркий/сдержанный?
   - Корпоративный/игривый?
   - Serif/Sans-serif заголовки?

4. **Сгенерируй мини-тему**:
   ```
   Палитра:
   - bg: [hex]
   - text: [hex]
   - accent: [hex]
   - border: [hex]
   
   Типографика:
   - Headings: [font], [weight]
   - Body: [font], [size]
   
   Layout:
   - Hero: [тип]
   - Cards: [стиль]
   - Grid: [колонки]
   ```

5. **Примени ко всем страницам** (консистентность!)

---

## Антипаттерны (что НЕ работает)

- **Слишком много цветов** (3-4 max: bg, text, accent, border)
- **Gradient buttons** (solid color лучше)
- **Heavy shadows** (borders вместо теней)
- **Роботизированный текст** (пиши как человек, не "innovative solutions")
- **Stock photos** (лучше illustrations или product shots)
- **Мелкие шрифты** (min 16px body, 48px hero)
