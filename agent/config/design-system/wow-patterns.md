# Wow Patterns — Библиотека вау-приёмов

> Дополнительные CSS-паттерны, которые можно добавить к ЛЮБОЙ теме.
> Используй когда архитектор запрашивает "вау-уровень" или когда сайт
> должен выделяться визуально.

## Как использовать

1. Выбери тему (modern-clean, bento, aurora, и т.д.)
2. Если нужен "вау" — добавь 1-3 паттерна из этого файла
3. НЕ комбинируй больше 3 паттернов — перегруз
4. Паттерны = CSS, работают с Tailwind inline

---

## 1. Animated Gradient Border

Светящаяся анимированная рамка вокруг карточки/секции.

```html
<style>
@keyframes gradient-rotate {
  0% { --angle: 0deg; }
  100% { --angle: 360deg; }
}
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.gradient-border {
  position: relative;
  border-radius: 16px;
  background: #0a0a0a;
}
.gradient-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: conic-gradient(from var(--angle), #a78bfa, #34d399, #38bdf8, #fb7185, #a78bfa);
  animation: gradient-rotate 4s linear infinite;
  z-index: -1;
}
</style>

<div class="gradient-border p-8">
  <h3>Анимированная рамка</h3>
</div>
```

**Когда:** CTA-карточка, pricing highlight, "главная" карточка.

---

## 2. Spotlight Follow Cursor

Свечение за курсором на карточке (aurora-стиль, но работает с любой темой).

```html
<div class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6">
  <div class="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
       style="background: radial-gradient(400px circle at var(--x) var(--y), rgba(99,102,241,0.08), transparent 40%);">
  </div>
  <!-- content -->
</div>

<script>
document.querySelectorAll('.group').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const spotlight = card.querySelector('[style*="--x"]');
    if (spotlight) {
      spotlight.style.setProperty('--x', `${e.clientX - rect.left}px`);
      spotlight.style.setProperty('--y', `${e.clientY - rect.top}px`);
    }
  });
});
</script>
```

**Когда:** Feature-карточки, pricing, testimonials.

---

## 3. Text Shimmer (мерцание текста)

Бегущий градиент по тексту (как Stripe "New" badge).

```html
<style>
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.text-shimmer {
  background: linear-gradient(90deg, currentColor 40%, #a78bfa 50%, currentColor 60%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
</style>

<span class="text-shimmer text-lg font-semibold">Новый релиз →</span>
```

**Когда:** Eyebrow, badge, "New", "Beta", акцентные слова.

---

## 4. Marquee (бегущая строка)

Бесконечная лента логотипов/текста.

```html
<style>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-track {
  display: flex;
  animation: marquee 30s linear infinite;
}
</style>

<div class="overflow-hidden border-y border-gray-200 py-6">
  <div class="marquee-track">
    <!-- Повтори контент 2 раза для seamless loop -->
    <div class="flex shrink-0 items-center gap-12 px-6">
      <span class="text-xl font-semibold text-gray-400">Vercel</span>
      <span class="text-xl font-semibold text-gray-400">Linear</span>
      <span class="text-xl font-semibold text-gray-400">Stripe</span>
      <span class="text-xl font-semibold text-gray-400">Notion</span>
      <span class="text-xl font-semibold text-gray-400">Figma</span>
      <span class="text-xl font-semibold text-gray-400">GitHub</span>
    </div>
    <div class="flex shrink-0 items-center gap-12 px-6">
      <span class="text-xl font-semibold text-gray-400">Vercel</span>
      <span class="text-xl font-semibold text-gray-400">Linear</span>
      <span class="text-xl font-semibold text-gray-400">Stripe</span>
      <span class="text-xl font-semibold text-gray-400">Notion</span>
      <span class="text-xl font-semibold text-gray-400">Figma</span>
      <span class="text-xl font-semibold text-gray-400">GitHub</span>
    </div>
  </div>
</div>
```

**Когда:** "Нам доверяют", логотипы клиентов, бесконечный список интеграций.

---

## 5. Stagger Reveal (каскадное появление)

Элементы появляются один за другим при скролле.

```html
<style>
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease, transform 600ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger: каждый следующий элемент с задержкой +100ms */
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 100ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 200ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 300ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 400ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 500ms; }
</style>

<div class="stagger grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="reveal rounded-2xl border border-gray-200 p-6">Карточка 1</div>
  <div class="reveal rounded-2xl border border-gray-200 p-6">Карточка 2</div>
  <div class="reveal rounded-2xl border border-gray-200 p-6">Карточка 3</div>
</div>

<script>
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
```

**Когда:** Feature-сетка, testimonials, шаги, pricing. ВСЕГДА добавляй на лендингах.

---

## 6. Number Counter (анимированный счётчик)

Число "считает" от 0 до значения при появлении в viewport.

```html
<span class="counter" data-target="2400000" data-suffix="+" data-prefix="">0</span>

<script>
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        // Format large numbers
        let display = current >= 1000000
          ? (current / 1000000).toFixed(1) + 'M'
          : current >= 1000
          ? (current / 1000).toFixed(current >= 10000 ? 0 : 1) + 'K'
          : current.toString();
        el.textContent = prefix + display + suffix;
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));
</script>
```

**Когда:** Статистика (пользователи, транзакции, uptime, revenue).

---

## 7. Morphing Blob (CSS blob-форма)

Анимированная органическая форма для фона.

```html
<style>
@keyframes blob-morph {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  50% { border-radius: 50% 60% 30% 40% / 30% 50% 70% 60%; }
  75% { border-radius: 40% 30% 60% 50% / 60% 40% 50% 70%; }
}
.morph-blob {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3));
  filter: blur(40px);
  animation: blob-morph 8s ease-in-out infinite;
}
</style>

<div class="absolute top-20 right-0 morph-blob -z-10"></div>
```

**Когда:** Декоративный фон в hero/about, вместо статичного gradient.

---

## 8. Typewriter (эффект печатной машинки)

```html
<h2 class="font-mono text-xl">
  <span class="typewriter" data-strings='["Быстро.", "Надёжно.", "Безопасно."]'></span>
  <span class="animate-pulse">|</span>
</h2>

<script>
document.querySelectorAll('.typewriter').forEach(el => {
  const strings = JSON.parse(el.dataset.strings);
  let stringIndex = 0, charIndex = 0, isDeleting = false;
  
  function type() {
    const current = strings[stringIndex];
    el.textContent = isDeleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);
    
    let delay = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === current.length) {
      delay = 2000; isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      delay = 500;
    }
    setTimeout(type, delay);
  }
  type();
});
</script>
```

**Когда:** Hero subtitle, tagline, "Мы делаем..." → варианты.

---

## 9. Parallax Scroll (лёгкий параллакс)

```html
<style>
.parallax-slow { transform: translateY(calc(var(--scroll) * -0.1px)); }
.parallax-medium { transform: translateY(calc(var(--scroll) * -0.2px)); }
</style>

<script>
window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll', window.scrollY);
});
</script>

<div class="parallax-slow">Медленно двигается</div>
<div class="parallax-medium">Средняя скорость</div>
```

**Когда:** Hero-элементы, декоративные фигуры, фоновые blob'ы.

---

## 10. Gradient Border on Hover

Тонкая градиентная рамка при hover (без анимации, проще).

```html
<style>
.hover-gradient-border {
  position: relative;
}
.hover-gradient-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #a78bfa, #38bdf8, #34d399);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms;
}
.hover-gradient-border:hover::after {
  opacity: 1;
}
</style>

<div class="hover-gradient-border rounded-2xl bg-white p-6 border border-gray-200">
  Hover me
</div>
```

**Когда:** Feature-карточки, pricing, CTA blocks.

---

## Комбинации по типу сайта

| Тип сайта | Рекомендуемые паттерны |
|-----------|----------------------|
| SaaS лендинг | Stagger Reveal + Number Counter + Spotlight |
| AI-продукт | Aurora + Typewriter + Gradient Border |
| Портфолио | Bento + Stagger Reveal + Marquee |
| Крипто/финтех | Mesh Gradient + Number Counter + Animated Border |
| Блог/контент | Stagger Reveal + Parallax |
| Магазин | Marquee + Stagger Reveal + Spotlight |
| Корпоративный | Number Counter + Stagger Reveal + Marquee |

## Правила

1. **НЕ больше 3 паттернов** на страницу (перегруз = хаос)
2. **Stagger Reveal — ВСЕГДА** добавляй на любой лендинг (бесплатный вау)
3. **Number Counter** — для любой статистики (цифры оживают)
4. **Spotlight** — для карточек features (интерактивность)
5. **Aurora/Mesh** — ТОЛЬКО в темах которые их поддерживают
6. **Marquee** — только для "trust" секции (логотипы клиентов)
7. **Animated Gradient Border** — максимум ОДНА карточка на странице
8. **Typewriter** — только в hero, только 3-5 строк
