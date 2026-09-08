# Industrial Dark

> Промышленный dark-стиль для B2B+B2C сайтов. Тёмный монументальный фон + жёлтый brand-акцент.
> Без неона. Серьёзный, премиальный, надёжный.
> Базовые токены (spacing, typography, radius, shadows, layout) — см. `tokens.md`.

## Как использовать

1. Применяй **базовые токены** из `tokens.md` (обязательно).
2. Цвета бери из таблицы ниже.
3. Компоненты собирай по примерам — они готовы к копированию.
4. Эта тема **dark-only** — рассчитана на тёмный фон, light mode не предусмотрен.

---

## Mood

**Serious, industrial, premium, trustworthy.**

- Глубокий тёмно-синий фон — монументальность, прочность, надёжность.
- Жёлтый акцент — энергия, видимость, brand-узнаваемость.
- Чёткая структура, читаемые таблицы, моноширинный шрифт для тех. данных.
- Карточки через border, не heavy shadow — чисто, по-деловому.
- Hover-эффекты тонкие: жёлтая подсветка border, лёгкое свечение (НЕ неон).

### Когда использовать

- Стройматериалы (бетон, плитка, кирпич, металлоконструкции)
- Промышленное оборудование и станки
- Производственные компании и заводы
- B2B-сервисы где нужны надёжность и солидность
- Инженерные и строительные портфолио
- Логистика, складские комплексы

### Когда НЕ использовать

- Gaming / киберпанк / neon-проекты (для этого есть bold-tech и dark-tech)
- SaaS стартапы с «лёгкой» эстетикой (лучше modern-clean)
- Креативные портфолио (лучше bento или aurora)

---

## Цветовая палитра

### Dark mode (единственный режим)

| Роль | Hex | Tailwind | Где использовать |
|------|-----|----------|------------------|
| bg (page) | `#0B2653` | `bg-[#0B2653]` | основной фон страницы (глубокий тёмно-синий) |
| bg (alt surface) | `#0F172A` | `bg-slate-900` | альтернативный фон для секций, footer |
| bg (elevated) | `#1E293B` | `bg-slate-800` | карточки, панели, sidebar |
| bg (surface) | `#13294F` | `bg-[#13294F]` | hover states, inputs, code blocks |
| text (headings) | `#F8FAFC` | `text-slate-50` | заголовки, hero title |
| text (body) | `#94A3B8` | `text-slate-400` | основной текст, параграфы |
| text (muted) | `#64748B` | `text-slate-500` | secondary, placeholder, disabled |
| **accent primary** | `#FDB900` | `text-[#FDB900]` / `bg-[#FDB900]` | CTA, links, active states, brand-жёлтый |
| **accent hover** | `#E5A600` | `hover:bg-[#E5A600]` | hover на accent-элементах |
| accent subtle bg | `rgba(253,185,0,0.1)` | `bg-[#FDB900]/10` | иконки в карточках, tinted фоны |
| success / positive | `#10B981` | `text-emerald-500` | positive metrics, checkmarks |
| danger / negative | `#EF4444` | `text-red-500` | negative metrics, warnings |
| warning | `#F59E0B` | `text-amber-500` | caution states |
| border (default) | `#1E293B` | `border-slate-800` | card border, divider |
| border (hover) | `#334155` | `border-slate-700` | border на hover карточек без accent |
| border (accent hover) | `rgba(253,185,0,0.5)` | `border-[#FDB900]/50` | border карточки при hover с акцентом |

### Жёлтый accent — главное правило

**#FDB900 — единственный акцентный цвет.** Никаких cyan, violet, magenta, green (кроме системных success/error).
Все CTA, ссылки, активные состояния, hover-подсветки — только жёлтый и его производные.

```css
/* Accent glow — ТОНКИЙ, НЕ неоновый */
.glow-amber-subtle {
  box-shadow: 0 0 0 1px rgba(253, 185, 0, 0.15), 0 0 15px rgba(253, 185, 0, 0.08);
}

/* Hover glow на карточках — очень тонкий */
.card-glow:hover {
  box-shadow: 0 0 0 1px rgba(253, 185, 0, 0.25), 0 0 20px rgba(253, 185, 0, 0.1);
}
```

Tailwind (inline):
- Покой: `shadow-none`
- Hover: `hover:shadow-[0_0_0_1px_rgba(253,185,0,0.25),0_0_20px_rgba(253,185,0,0.1)]`

---



## Композиция (Layout Patterns)

Эти паттерны = стартер. Каждый industrial-dark сайт должен иметь ≥1 уникальную композиционную черту.
НЕ копируй 1:1. Выбирай под контекст проекта.

### Hero Layouts (3 варианта)

**A. Centered (default — главная, about)**
max-w-3xl mx-auto text-center. Eyebrow → h1 (6xl-7xl tracking-tight) → subtitle → CTAs.
Идеально для имиджевого hero с tagline.

**B. Split 60/40 (продуктовые страницы)**
grid lg:grid-cols-5 gap-16, left col-span-3 (галерея продукта), right col-span-2 (описание + цена + CTA).
Идеально для страницы товара где продукт = визуальный якорь.

**C. Full-bleed photo (каталог/главная)**
section py-0, фото absolute inset-0 object-cover, overlay bg-gradient-to-t from-[#0B2653] to-transparent,
content relative z-10 в нижней части. Идеально для «проекты», «производство».

### Whitespace Rhythm (для industrial)

Industrial = монументальность. Отступы крупнее чем в SaaS.

| Секция | Padding (y) | Tailwind | Характер |
|--------|------------|----------|----------|
| Hero | top: 144-160px, bottom: 112-128px | pt-36..40 pb-28..32 | Монументальный вход |
| Features / Advantages | 112-128px | py-28..32 | Просторно, уверенно |
| Comparison / Specs | 80px | py-20 | Компактно, по делу |
| CTA / Form | 96px | py-24 | Акцент на действии |
| Catalog grid | 80px | py-20 | Плотно, много карточек |
| Footer | top: 64px, bottom: 48px | pt-16 pb-12 | Завершение |

### Depth Layering (5 уровней)

| Level | Цвет | Tailwind | Назначение |
|-------|------|----------|-----------|
| Level 0 | #0B2653 | bg-[#0B2653] | Page background |
| Level 1 | #0F172A | bg-slate-900 | Alt sections, footer |
| Level 2 | rgba(30,41,59,0.5) | bg-slate-800/50 | Cards, panels |
| Level 3 | #0F172A | bg-slate-900 | Input fields (глубже карточек) |
| Level 4 | #FDB900 | bg-[#FDB900] | Accent (≤5% площади) |

Минимум 3 уровня на странице. Типичная страница: Level 0 (page) → Level 1 (alt section) → Level 2 (cards) → Level 4 (CTA accent).

### Hero Typography Scale (industrial)

| Элемент | Размер | Tailwind | Вес | Особенность |
|---------|--------|----------|-----|-------------|
| Eyebrow | 14px | text-sm tracking-wider uppercase | font-medium | Цвет accent (#FDB900) |
| h1 | 60-72px | text-6xl..7xl tracking-tight | font-bold | Белый (text-slate-50) |
| Subtitle | 18-20px | text-lg..xl | font-normal | text-slate-400 |
| Stats (числа) | 30px | text-3xl | font-bold | font-mono tabular-nums |
| Stats (подписи) | 14px | text-sm | font-medium | text-slate-500 |

Контраст hero: 72px / 14px = 5.1x → премиум. Ниже 4x не опускаться.

### Variation Note

Эти паттерны — стартер, не финальный рецепт. Каждый industrial-dark сайт должен иметь ≥1
уникальную композиционную черту. Примеры из эталонной библиотеки:

- **Randers Tegl:** hover-image навигация (nav hover → hero photo меняется)
- **Wienerberger:** teaser-rows (ритмичное чередование фото↔текст)
- **Marshalls:** audience segmentation (3 входа: частник / профи / архитектор)
- **Agrob Buchtal:** sticky product sub-nav + project reference library

Выбери 1-2 приёма из references/industrial-b2b.md и адаптируй под конкретный проект.

## Типографика

### Семейства шрифтов

| Элемент | Шрифт | Tailwind | Почему |
|---------|-------|----------|--------|
| Заголовки (h1–h6) | Inter | `font-sans` | Чистый, современный, читаемый |
| Body text | Inter | `font-sans` | Стандарт для веба |
| **Тех. данные** (размеры, цены, характеристики) | JetBrains Mono | `font-mono tabular-nums` | УНИКАЛЬНО для industrial — подчёркивает точность |
| Надзаголовки (eyebrow) | Inter | `font-sans` | (НЕ mono — industrial всё же B2C, не dev-tool) |
| Badge, labels | Inter | `font-sans font-medium` | Чистые бейджи |

### Веса

| Weight | Tailwind | Применение |
|--------|----------|-----------|
| 400 | `font-normal` | body text |
| 500 | `font-medium` | UI labels, nav links, кнопки, тех. данные в mono |
| 600 | `font-semibold` | card titles, section headings |
| 700 | `font-bold` | hero titles |
| 800 | `font-extrabold` | hero titles (опционально для максимального контраста) |

### Letter-spacing

- Hero: `tracking-tight` (обязательно, как в tokens)
- Section headings: `tracking-tight`
- Eyebrow/labels: `tracking-wider` (0.05em) + `uppercase`
- Body / UI: `tracking-normal`

---

## Компоненты

### Navbar

```html
<header class="sticky top-0 z-50 h-16 border-b border-slate-700 bg-[#0B2653]/80 backdrop-blur-md">
  <nav class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 text-xl font-bold text-slate-50">
      <!-- logo icon -->
      <span class="text-[#FDB900]">Строй</span>Макс
    </a>

    <!-- Nav links -->
    <div class="hidden items-center gap-8 lg:flex">
      <a href="#catalog" class="text-sm font-medium text-slate-400 transition-colors duration-150 hover:text-[#FDB900]">
        Каталог
      </a>
      <a href="#about" class="text-sm font-medium text-slate-400 transition-colors duration-150 hover:text-[#FDB900]">
        О компании
      </a>
      <a href="#contacts" class="text-sm font-medium text-slate-400 transition-colors duration-150 hover:text-[#FDB900]">
        Контакты
      </a>
    </div>

    <!-- CTA -->
    <a href="#order" class="rounded-md bg-[#FDB900] px-5 py-2.5 text-sm font-semibold text-[#0B2653] transition-colors duration-150 hover:bg-[#E5A600]">
      Заказать расчёт
    </a>
  </nav>
</header>
```

Ключевые моменты:
- `bg-[#0B2653]/80` — полупрозрачный brand-синий.
- `border-slate-700` — тёмная граница, ненавязчивая.
- `backdrop-blur-md` — blur 12px при скролле.
- Ссылки hover → `text-[#FDB900]` (жёлтый).
- CTA кнопка: жёлтый фон + тёмно-синий текст.

### Hero

```html
<section class="relative overflow-hidden bg-[#0B2653] pt-32 pb-24">
  <!-- Subtle amber radial glow (НЕ неон, очень тонкий) -->
  <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(253,185,0,0.08)_0%,transparent_70%)]"></div>

  <!-- Hero image overlay (опционально: фото продукции) -->
  <div class="absolute inset-0 bg-cover bg-center opacity-10" style="background-image: url('/hero-bg.jpg');"></div>

  <div class="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <!-- eyebrow -->
      <span class="text-sm font-medium tracking-wider uppercase text-[#FDB900]">
        Тротуарная плитка из кевларобетона
      </span>
      <!-- hero title -->
      <h1 class="mt-6 text-5xl font-bold tracking-tight text-slate-50 sm:text-6xl lg:text-7xl">
        Надёжное покрытие<br>
        <span class="text-[#FDB900]">на десятилетия</span>
      </h1>
      <!-- subtitle -->
      <p class="mx-auto mt-8 max-w-xl text-lg text-slate-400">
        Кевларобетон — инновационный материал с прочностью стали.
        Плитка выдерживает 50+ тонн и 20+ лет эксплуатации.
      </p>
      <!-- CTA buttons -->
      <div class="mt-12 flex items-center justify-center gap-4">
        <a href="#catalog" class="rounded-md bg-[#FDB900] px-6 py-3 text-base font-semibold text-[#0B2653] transition-all duration-150 hover:bg-[#E5A600] hover:shadow-[0_0_0_1px_rgba(253,185,0,0.3),0_0_20px_rgba(253,185,0,0.12)]">
          Смотреть каталог
        </a>
        <a href="#calculator" class="rounded-md border border-slate-600 bg-transparent px-6 py-3 text-base font-medium text-slate-100 transition-all duration-150 hover:border-[#FDB900] hover:text-[#FDB900]">
          Рассчитать стоимость
        </a>
      </div>

      <!-- Key stats (опционально, для industrial) -->
      <div class="mt-16 grid grid-cols-3 gap-8">
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-slate-50">50+</span>
          <p class="mt-1 text-sm text-slate-500">тонн нагрузка</p>
        </div>
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-slate-50">20+</span>
          <p class="mt-1 text-sm text-slate-500">лет гарантии</p>
        </div>
        <div>
          <span class="font-mono text-3xl font-bold tabular-nums text-slate-50">12</span>
          <p class="mt-1 text-sm text-slate-500">коллекций</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

Ключевые особенности:
- `bg-[#0B2653]` — глубокий синий фон (не чёрный).
- Radial gradient — очень тонкий, amber, едва заметный (opacity 0.08, не 0.15 как в bold-tech).
- Hero фото с `opacity-10` — для фактурности.
- Статистика в `font-mono tabular-nums` — industrial-фишка.
- CTA: жёлтый solid (НЕ gradient) + лёгкое свечение на hover.

### Карточки (каталог продукции)

```html
<div class="group rounded-2xl border border-slate-700 bg-slate-800/50 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FDB900]/50 hover:shadow-[0_0_0_1px_rgba(253,185,0,0.25),0_0_20px_rgba(253,185,0,0.1)]">
  <!-- image -->
  <div class="overflow-hidden rounded-xl">
    <img src="/product.jpg" alt="Плитка Брусчатка" class="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
  </div>
  <!-- content -->
  <h3 class="mt-4 text-lg font-semibold tracking-tight text-slate-50">
    Брусчатка «Классик»
  </h3>
  <p class="mt-2 text-sm text-slate-400">
    Серый, 200×100×60 мм. Для парковок и подъездных путей.
  </p>
  <!-- specs in mono -->
  <div class="mt-4 flex flex-wrap gap-3">
    <span class="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs tabular-nums text-slate-300">
      50 т нагрузка
    </span>
    <span class="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-mono text-xs tabular-nums text-slate-300">
      200×100×60 мм
    </span>
  </div>
  <!-- price in mono -->
  <div class="mt-4 flex items-baseline gap-2 border-t border-slate-700 pt-4">
    <span class="font-mono text-xl font-bold tabular-nums text-[#FDB900]">1 200 ₽</span>
    <span class="font-mono text-sm text-slate-500">/ м²</span>
  </div>
</div>
```

Отличия от bold-tech:
- Иконки на `bg-[#FDB900]/10` (жёлтый tinted фон, не cyan).
- Border hover → `border-[#FDB900]/50` (жёлтый, не cyan).
- Glow очень тонкий (opacity 0.1–0.25, не 0.3–0.5).
- Hover translate: `-translate-y-0.5` (есть, НЕ убран — industrial карточки должны «приподниматься»).
- Тех. данные в `font-mono text-xs tabular-nums` — фишка industrial.

### Кнопки

**Primary (solid accent):**

```html
<button class="rounded-md bg-[#FDB900] px-6 py-3 text-sm font-semibold text-[#0B2653] transition-all duration-150 hover:bg-[#E5A600] hover:shadow-[0_0_0_1px_rgba(253,185,0,0.3),0_0_20px_rgba(253,185,0,0.12)] focus:outline-none focus:ring-2 focus:ring-[#FDB900] focus:ring-offset-2 focus:ring-offset-[#0B2653]">
  Заказать расчёт
</button>
```

**Secondary (outline):**

```html
<button class="rounded-md border border-slate-600 bg-transparent px-6 py-3 text-sm font-medium text-slate-100 transition-all duration-150 hover:border-[#FDB900] hover:text-[#FDB900] focus:outline-none focus:ring-2 focus:ring-[#FDB900] focus:ring-offset-2 focus:ring-offset-[#0B2653]">
  Смотреть каталог
</button>
```

**Ghost:**

```html
<button class="rounded-md bg-transparent px-4 py-2 text-sm font-medium text-slate-400 transition-colors duration-150 hover:bg-slate-800 hover:text-[#FDB900]">
  Подробнее →
</button>
```

Варианты по приоритету:
| Вариант | Tailwind | Когда |
|---------|----------|-------|
| Primary | `bg-[#FDB900] text-[#0B2653]` | Основной CTA, «Заказать», «Купить» |
| Secondary | `border-slate-600 text-slate-100` | Второстепенное действие, «Подробнее» |
| Ghost | `text-slate-400 hover:text-[#FDB900]` | Навигация внутри секции, «Все товары →» |

**Правило:** gradient на кнопках НЕ использовать. Только solid `#FDB900` с затемнением `#E5A600` на hover.
Исключение: gradient разрешён в theme-specific exceptions (см. ниже), но только для hero CTA.

### Таблица характеристик

```html
<div class="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50">
  <table class="w-full text-left text-sm">
    <thead>
      <tr class="border-b border-slate-700">
        <th class="px-6 py-4 font-medium text-slate-300">Характеристика</th>
        <th class="px-6 py-4 font-medium text-slate-300">Значение</th>
        <th class="px-6 py-4 font-medium text-slate-300">Стандарт</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-slate-700/50 transition-colors duration-150 hover:bg-slate-700/50">
        <td class="px-6 py-4 text-slate-400">Прочность на сжатие</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-50">B50 (M600)</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-500">ГОСТ 17608-2017</td>
      </tr>
      <tr class="border-b border-slate-700/50 transition-colors duration-150 hover:bg-slate-700/50">
        <td class="px-6 py-4 text-slate-400">Морозостойкость</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-50">F300</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-500">ГОСТ 10060-2012</td>
      </tr>
      <tr class="border-b border-slate-700/50 transition-colors duration-150 hover:bg-slate-700/50">
        <td class="px-6 py-4 text-slate-400">Истираемость</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-50">0.3 г/см²</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-500">ГОСТ 13087-2018</td>
      </tr>
      <tr class="transition-colors duration-150 hover:bg-slate-700/50">
        <td class="px-6 py-4 text-slate-400">Водопоглощение</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-50">&le; 3%</td>
        <td class="px-6 py-4 font-mono tabular-nums text-slate-500">ГОСТ 12730.3-2020</td>
      </tr>
    </tbody>
  </table>
</div>
```

Ключевые моменты:
- `rounded-2xl` — соответствует карточкам.
- `bg-slate-800/50` — полупрозрачный elevated фон.
- Тех. значения в `font-mono tabular-nums` — подчёркивает точность.
- `hover:bg-slate-700/50` — тонкий hover строк.
- Границы: `border-slate-700` (между thead/tbody) и `border-slate-700/50` (между строками).

### Форма заявки

```html
<form class="rounded-2xl border border-slate-700 bg-slate-800/50 p-8">
  <h3 class="text-xl font-semibold tracking-tight text-slate-50">Оставить заявку</h3>
  <p class="mt-2 text-sm text-slate-400">Менеджер свяжется с вами в течение 30 минут</p>

  <div class="mt-6 space-y-4">
    <!-- Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-slate-300">Имя</label>
      <input
        id="name" type="text" placeholder="Иван Петров"
        class="mt-1.5 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 transition-colors duration-150 focus:border-[#FDB900] focus:outline-none focus:ring-1 focus:ring-[#FDB900]"
      />
    </div>

    <!-- Phone -->
    <div>
      <label for="phone" class="block text-sm font-medium text-slate-300">Телефон</label>
      <input
        id="phone" type="tel" placeholder="+7 (999) 123-45-67"
        class="mt-1.5 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 transition-colors duration-150 focus:border-[#FDB900] focus:outline-none focus:ring-1 focus:ring-[#FDB900]"
      />
    </div>

    <!-- Message -->
    <div>
      <label for="message" class="block text-sm font-medium text-slate-300">Комментарий</label>
      <textarea
        id="message" rows="3" placeholder="Какая плитка интересует, площадь, адрес доставки..."
        class="mt-1.5 block w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-50 placeholder:text-slate-500 transition-colors duration-150 focus:border-[#FDB900] focus:outline-none focus:ring-1 focus:ring-[#FDB900]"
      ></textarea>
    </div>
  </div>

  <!-- Submit -->
  <button type="submit" class="mt-6 w-full rounded-md bg-[#FDB900] px-6 py-3 text-sm font-semibold text-[#0B2653] transition-all duration-150 hover:bg-[#E5A600] hover:shadow-[0_0_0_1px_rgba(253,185,0,0.3),0_0_20px_rgba(253,185,0,0.12)] focus:outline-none focus:ring-2 focus:ring-[#FDB900] focus:ring-offset-2 focus:ring-offset-[#0B2653]">
    Отправить заявку
  </button>

  <p class="mt-3 text-center text-xs text-slate-500">
    Нажимая кнопку, вы соглашаетесь с <a href="#" class="underline transition-colors duration-150 hover:text-[#FDB900]">политикой обработки данных</a>
  </p>
</form>
```

Ключевые моменты:
- Inputs: `bg-slate-900` (глубже чем surface) + `border-slate-600`.
- Focus: `border-[#FDB900]` + `ring-1 ring-[#FDB900]` (жёлтый).
- Placeholder: `text-slate-500`.
- Submit: жёлтый solid, как primary button.

### Footer

```html
<footer class="bg-slate-900 py-16">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
      <!-- Brand -->
      <div>
        <a href="/" class="text-xl font-bold text-slate-50">
          <span class="text-[#FDB900]">Строй</span>Макс
        </a>
        <p class="mt-3 text-sm text-slate-500">
          Производство тротуарной плитки из кевларобетона с 2010 года.
        </p>
      </div>

      <!-- Links column -->
      <div>
        <h4 class="text-sm font-semibold tracking-wider uppercase text-slate-300">Каталог</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">Брусчатка</a></li>
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">Плиты дорожные</a></li>
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">Бордюры</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold tracking-wider uppercase text-slate-300">Компания</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">О нас</a></li>
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">Производство</a></li>
          <li><a href="#" class="text-sm text-slate-500 transition-colors duration-150 hover:text-[#FDB900]">Контакты</a></li>
        </ul>
      </div>

      <div>
        <h4 class="text-sm font-semibold tracking-wider uppercase text-slate-300">Контакты</h4>
        <ul class="mt-4 space-y-2">
          <li class="font-mono text-sm tabular-nums text-slate-400">+7 (999) 123-45-67</li>
          <li class="text-sm text-slate-500">info@stroymax.ru</li>
          <li class="text-sm text-slate-500">г. Москва, ул. Промышленная, 15</li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="mt-12 border-t border-slate-700 pt-8 text-center">
      <p class="text-sm text-slate-600">
        © 2024 СтройМакс. Все права защищены.
      </p>
    </div>
  </div>
</footer>
```

Ключевые моменты:
- `bg-slate-900` — глубже основного bg `#0B2653` (footer утапливается).
- Ссылки hover → `text-[#FDB900]` (жёлтый).
- Телефон в `font-mono tabular-nums` — industrial-фишка.
- Разделитель `border-slate-700`.

---

## Wow-паттерны (тонкие)

Для industrial-dark выбраны ТОЛЬКО тонкие, не-неоновые паттерны. Максимум 3 на страницу.

### 1. Stagger Reveal (каскадное появление) — ВСЕГДА

Из `wow-patterns.md`, без изменений. Идеален для industrial: появление карточек каталога
одна за другой при скролле подчёркивает солидность, а не игривость.

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
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 100ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 200ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 300ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 400ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 500ms; }
</style>

<div class="stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="reveal rounded-2xl border border-slate-700 bg-slate-800/50 p-6">...</div>
  <div class="reveal rounded-2xl border border-slate-700 bg-slate-800/50 p-6">...</div>
  <div class="reveal rounded-2xl border border-slate-700 bg-slate-800/50 p-6">...</div>
</div>
```

### 2. Text Shimmer — адаптирован под amber

Из `wow-patterns.md`, перекрашен с violet на amber. Использовать ТОЛЬКО для:
- Бейджа «Новинка» на карточке товара
- Eyebrow «Акция» / «Спецпредложение»
- Ключевого слова в hero

```html
<style>
@keyframes shimmer-amber {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.text-shimmer-amber {
  background: linear-gradient(90deg, #FDB900 40%, #FFF3CC 50%, #FDB900 60%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer-amber 3s linear infinite;
}
</style>

<span class="text-shimmer-amber text-sm font-semibold">Новинка</span>
```

### 3. Gradient Border on Hover — адаптирован под amber

Из `wow-patterns.md`, с заменой цвета на amber. Тонкая рамка при hover.
Использовать для: feature-карточек, «главного» товара, CTA-секций.

```html
<style>
.hover-gradient-border-amber {
  position: relative;
}
.hover-gradient-border-amber::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, #FDB900, #E5A600, #FDB900);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms;
}
.hover-gradient-border-amber:hover::after {
  opacity: 1;
}
</style>

<div class="hover-gradient-border-amber rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
  <!-- «главная» карточка -->
</div>
```

### НЕ использовать (запрещено для industrial-dark)

| ❌ Паттерн | Почему |
|-----------|--------|
| Spotlight Follow Cursor | Неоновое свечение — противоречит industrial mood |
| Animated Gradient Border (conic-gradient) | Слишком яркий, cyberpunk-эффект |
| Morphing Blob | Слишком игривый, не industrial |
| Typewriter | Игривый, не для серьёзного B2B |
| Marquee (бегущая строка) | Допустимо, но не для логотипов — лучше для «объектов» |
| Number Counter | Допустимо, но только если без анимации избыточной |

---

## Theme-specific exceptions (D-081)

Эта тема переопределяет некоторые базовые anti-patterns из `tokens.md`:

| Базовый запрет | Исключение в industrial-dark | Обоснование |
|---------------|---------------------------|-------------|
| Heavy shadows (blur > 15px) на карточках | Лёгкое amber-свечение на hover (`blur: 20px, opacity 0.1`) | Тонкая жёлтая подсветка = brand-узнаваемость, НЕ неон. Промышленная эстетика. |
| Gradient buttons | **НЕ переопределяется.** Gradient на кнопках ЗАПРЕЩЁН. | Industrial = solid, надёжный, без украшательств. |
| `rounded-3xl` запрещён на карточках | `rounded-3xl` разрешён для hero-блоков и больших секций | Как в bento — монументальные скругления для крупных блоков |
| Карточки без border, только shadow | Карточки = border + ЛЁГКОЕ свечение на hover | Тёмный фон требует border для читаемости |
| `font-mono` только для кода | `font-mono` для тех. данных (размеры, цены, ГОСТы) | Industrial-специфика: точность и стандарты |

### Что НЕ переопределяется (строго как в tokens):

- Кнопки — `rounded-md`, НЕ `rounded-full`.
- Section padding ≥ `py-20`.
- Container — `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Navbar — `sticky top-0 h-16 backdrop-blur-md border-b`.
- Hero titles — `tracking-tight` обязательно.

---

## Сравнение с другими dark-темами

| Характеристика | industrial-dark | bold-tech | dark-tech |
|---------------|----------------|-----------|-----------|
| Основной фон | `#0B2653` (глубокий синий) | `#0a0a0a` (почти чёрный) | `#0A0A0A` (чёрный) |
| Акцент | `#FDB900` (жёлтый) | `#06b6d4` (cyan) | `#00BFFF` (neon cyan) |
| Glow на hover | Тонкий, amber, opacity 0.1–0.15 | Яркий cyan/violet, opacity 0.3–0.5 | Neon pulse, opacity 0.6 |
| Gradient на CTA | НЕТ (solid жёлтый) | ДА (cyan→violet) | ДА (cyan→purple) |
| Mood | Промышленный, надёжный | Дерзкий, технический | Киберпанк, неон |
| Для кого | Стройка, производство, B2B | Dev-tools, crypto, SaaS | Gaming, crypto dark UI |

---

## Чек-лист industrial-dark

- [ ] Фон страницы = `bg-[#0B2653]` (глубокий синий), НЕ `bg-neutral-950` и НЕ `bg-black`.
- [ ] Карточки = `bg-slate-800/50 border border-slate-700 rounded-2xl`.
- [ ] CTA = solid `bg-[#FDB900] text-[#0B2653]` (НЕ gradient!).
- [ ] Hover карточек = `border-[#FDB900]/50` + тонкое свечение (opacity ≤ 0.15).
- [ ] Тех. данные (размеры, цены, ГОСТы) = `font-mono tabular-nums`.
- [ ] Ссылки hover = `text-[#FDB900]`, НЕ cyan/violet.
- [ ] Section padding ≥ `py-20`.
- [ ] Hero titles = `tracking-tight`.
- [ ] Navbar = `sticky top-0 h-16 backdrop-blur-md`.
- [ ] Container = `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- [ ] **НИКАКОГО неона** — glow только тонкий, amber, НЕ pulse/cyan/violet.
- [ ] Кнопки = `rounded-md`, НЕ `rounded-full`.
- [ ] Footer = `bg-slate-900` (глубже основного bg).

---

## Запрещено (НЕ cyberpunk, НЕ bold-tech)

- ❌ Неоновые glow-эффекты (cyan, violet, magenta — любые цвета кроме amber)
- ❌ `animate-pulse` на неоновых элементах
- ❌ Cyan / violet / magenta акценты (единственный акцент = #FDB900)
- ❌ Gradient на кнопках (даже amber→amber — только solid)
- ❌ Grid-pattern cyberpunk background
- ❌ Glitch-анимации
- ❌ Scanline-эффекты
- ❌ `shadow-[0_0_40px_...]` с opacity > 0.2
- ❌ `bg-neutral-950` — используй `bg-[#0B2653]` или `bg-slate-900`

---

## Примеры использования

- **СтройМакс** — тротуарная плитка из кевларобетона (брусчатка, дорожные плиты, бордюры)
- **Бетонный завод** — ЖБИ, бетонные смеси, фундаментные блоки
- **Металлоконструкции** — ангары, каркасы, опоры ЛЭП
- **Промышленное оборудование** — станки, прессы, конвейеры
- **Кирпичный завод** — кирпич, керамзит, сухие смеси
- **Логистический комплекс** — склады, распределительные центры
- **Инженерное портфолио** — проекты мостов, дорог, промышленных объектов
