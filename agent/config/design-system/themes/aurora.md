# Theme: Aurora

> Стиль Vercel / Framer / Radix. Тёмная база с переливающимся
> "северным сиянием" — анимированные/статичные цветные полосы.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Mood

**Immersive, futuristic, premium-dark, atmospheric.**

- Dark-first (глубокий чёрный фон)
- Aurora bands — горизонтальные переливающиеся цветные полосы (CSS gradient)
- Spotlight effect — свечение за курсором (JS: mousemove)
- Noise texture — лёгкое зерно для "плёночного" ощущения
- Карточки с тонкими светящимися border + внутренним glow
- Минимум текста, максимум атмосферы

### When to use

AI-продукты, developer tools, gaming-платформы,
крипто/NFT, портфолио агентств, презентации,
любой dark-first проект где нужен "космический" вайб.

---

## Colors

| Роль | Hex | Tailwind | Где |
|------|-----|----------|-----|
| bg (page) | `#050505` | `bg-[#050505]` | основной фон (почти чёрный) |
| bg (card) | `#0a0a0a` | `bg-[#0a0a0a]` | карточки |
| bg (card hover) | `#111111` | `bg-[#111111]` | hover state |
| text (headings) | `#f5f5f5` | `text-neutral-100` | заголовки |
| text (body) | `#a3a3a3` | `text-neutral-400` | описания |
| text (muted) | `#525252` | `text-neutral-600` | secondary |
| accent 1 | `#a78bfa` | `text-violet-400` | aurora: violet |
| accent 2 | `#34d399` | `text-emerald-400` | aurora: green |
| accent 3 | `#38bdf8` | `text-sky-400` | aurora: blue |
| accent 4 | `#fb7185` | `text-rose-400` | aurora: pink |
| border | `#1a1a1a` | `border-[#1a1a1a]` | card border |
| border (glow) | `#a78bfa33` | `border-violet-400/20` | glow border |

---

## Aurora Effect (главный приём)

### Static aurora band (CSS only, без JS)

```css
background: linear-gradient(
  135deg,
  rgba(167, 139, 250, 0.15) 0%,
  rgba(52, 211, 153, 0.1) 25%,
  rgba(56, 189, 248, 0.15) 50%,
  rgba(251, 113, 133, 0.1) 75%,
  rgba(167, 139, 250, 0.15) 100%
);
filter: blur(80px);
```

Tailwind (hero background):
```html
<section class="relative overflow-hidden bg-[#050505]">
  <!-- Aurora band -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-60"
       style="background: linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(52,211,153,0.1) 25%, rgba(56,189,248,0.15) 50%, rgba(251,113,133,0.1) 75%); filter: blur(80px);"></div>
  <!-- content -->
</section>
```

### Animated aurora (CSS animation)

```html
<style>
@keyframes aurora-shift {
  0%, 100% { transform: translateX(-10%) rotate(0deg); }
  50% { transform: translateX(10%) rotate(3deg); }
}
.aurora-bg {
  animation: aurora-shift 15s ease-in-out infinite;
}
</style>

<div class="aurora-bg absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] opacity-40"
     style="background: linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(52,211,153,0.15) 25%, rgba(56,189,248,0.2) 50%, rgba(251,113,133,0.15) 75%); filter: blur(100px);">
</div>
```

---

## Spotlight Card (hover-свечение за курсором)

```html
<div class="group relative rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-6 overflow-hidden transition-all duration-300 hover:border-violet-400/30">
  <!-- Spotlight (follows mouse via JS) -->
  <div class="spotlight pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
       style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(167,139,250,0.06), transparent 40%);">
  </div>
  <!-- Content -->
  <h3 class="relative text-lg font-semibold text-neutral-100">Заголовок</h3>
  <p class="relative mt-2 text-sm text-neutral-400">Описание фичи</p>
</div>
```

JS для spotlight (добавить в конец `<body>`):
```javascript
document.querySelectorAll('.spotlight').forEach(card => {
  const parent = card.parentElement;
  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});
```

---

## Noise Texture (зернистость)

```css
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
}
```

Tailwind (inline в `<style>`): opacity `0.03` — еле заметное зерно.

---

## Hero-секция

```html
<section class="relative overflow-hidden bg-[#050505] pt-32 pb-24">
  <!-- Aurora background -->
  <div class="aurora-bg absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] opacity-40"
       style="background: linear-gradient(135deg, rgba(167,139,250,0.2) 0%, rgba(52,211,153,0.15) 25%, rgba(56,189,248,0.2) 50%, rgba(251,113,133,0.15) 75%); filter: blur(100px);"></div>
  
  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-1.5 text-sm text-violet-400">
        <span class="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
        Новый релиз · v3.0
      </div>
      
      <!-- Title -->
      <h1 class="mt-8 text-5xl font-bold tracking-tight text-neutral-100 sm:text-7xl">
        Создавай то, что<br>
        <span class="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
          казалось невозможным
        </span>
      </h1>
      
      <!-- Subtitle -->
      <p class="mx-auto mt-8 max-w-xl text-lg text-neutral-400">
        AI-платформа нового поколения. Пиши код, генерируй дизайн,
        деплой в один клик.
      </p>
      
      <!-- CTAs -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#" class="rounded-md bg-violet-500 px-6 py-3 text-base font-medium text-white transition-all duration-150 hover:bg-violet-400 shadow-lg shadow-violet-500/25">
          Начать бесплатно
        </a>
        <a href="#" class="rounded-md border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm px-6 py-3 text-base font-medium text-neutral-300 transition-colors duration-150 hover:border-neutral-600">
          Смотреть демо
        </a>
      </div>
    </div>
  </div>
</section>
```

---

## Карточка с spotlight

```html
<div class="group relative rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-6 overflow-hidden transition-all duration-300 hover:border-violet-400/30">
  <div class="spotlight pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
       style="background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(167,139,250,0.06), transparent 40%);"></div>
  
  <div class="relative">
    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-400/10 text-violet-400">
      <svg class="h-5 w-5" ...></svg>
    </div>
    <h3 class="mt-4 text-lg font-semibold text-neutral-100">Feature Name</h3>
    <p class="mt-2 text-sm text-neutral-400">Brief description of the feature.</p>
  </div>
</div>
```

---

## Чек-лист aurora

- [ ] Фон `#050505` (НЕ neutral-950, НЕ gray-900)
- [ ] Aurora band в hero: linear-gradient + blur(80-100px)
- [ ] Animated aurora (CSS @keyframes, 15s infinite)
- [ ] Spotlight card: JS mousemove + radial-gradient hover
- [ ] Noise texture: `::before` с feTurbulence, opacity 0.03
- [ ] Gradient text: `from-violet-400 via-sky-400 to-emerald-400`
- [ ] Badge: `border-violet-400/20 bg-violet-400/5` + пульсирующая точка
- [ ] CTA shadow: `shadow-violet-500/25` (цветная)
- [ ] Card border: `#1a1a1a` (НЕ neutral-800)
- [ ] Hover: `border-violet-400/30` + spotlight opacity 100
