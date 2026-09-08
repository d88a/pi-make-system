# Few-Shot: «провинциально» vs «со вкусом»

> Библиотека пар ❌/✅ для AI-генерации UI. Каждая пара — один компонент.
> Используй перед генерацией: сверь свой план с парами, избегай колонки ❌.
> Цвета и токены — из `tokens.md` + темы (`warm-minimal`, `modern-clean` и др.).
> Примеры переносимы между темами: подставь accent/border/bg своей темы.

---

## 1. Hero

**❌ Провинциально (шаблонный вход):**
- Симметричный split 50/50: текст слева, картинка справа — как 1000 других лендингов
- `h1` = `text-4xl` (36px), body = `text-base` (16px) → контраст 2.2x, нет драмы
- Hero на всю высоту экрана: `min-h-screen` → пустая трата пространства
- Один `bg-white` (или `bg-stone-50`) без градиента — плоско
- Единственная CTA = accent-кнопка: `bg-amber-600` (warm-minimal) или `bg-indigo-500` (modern-clean)
- `text-center` без композиционного якоря — текст плавает

```html
<!-- ❌ -->
<section class="bg-white min-h-screen flex items-center">
  <div class="grid grid-cols-2 gap-12 max-w-7xl mx-auto px-8">
    <div>
      <h1 class="text-4xl font-bold text-slate-900">Мы делаем мир лучше</h1>
      <p class="mt-4 text-base text-slate-600">Инновационные решения для бизнеса.</p>
      <a href="#" class="mt-8 inline-block rounded-md bg-indigo-500 px-6 py-3 text-white">Начать</a>
    </div>
    <div><img src="hero.png" class="rounded-xl"></div>
  </div>
</section>
```

**✅ Со вкусом (один визуальный якорь):**
- Асимметричный split 60/40 или centered с `max-w-3xl` — текст дышит
- `h1` = `text-6xl`..`text-7xl` (60-72px), subtitle = `text-lg`..`text-xl` → контраст ≥ 4x
- Конкретные отступы: `pt-32 pb-24` (modern-clean) или `pt-40 pb-32` (warm-minimal)
- Subtle фон: `bg-gradient-to-b from-slate-50 to-slate-100` (modern-clean) или `bg-stone-50` (warm-minimal)
- Две кнопки: primary нейтральная (`bg-slate-900` → warm-minimal) + secondary outlined
- `tracking-tight` на заголовке — ОБЯЗАТЕЛЕН
- Eyebrow-текст над заголовком: `text-xs tracking-wider uppercase text-accent`

```html
<!-- ✅ (modern-clean) -->
<section class="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 pt-32 pb-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-3xl text-center">
      <span class="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium tracking-wider uppercase text-indigo-600">
        Запуск · v2.0
      </span>
      <h1 class="mt-6 text-6xl font-bold tracking-tight text-slate-900">
        Собирайте быстрее.<br>Сдавайте чище.
      </h1>
      <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
        Платформа для команд, которые сдают в срок. Без конфигов, без боли.
      </p>
      <div class="mt-10 flex items-center justify-center gap-4">
        <a href="#" class="rounded-md bg-indigo-500 px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-indigo-600">
          Попробовать бесплатно
        </a>
        <a href="#" class="rounded-md border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50">
          Смотреть демо
        </a>
      </div>
    </div>
  </div>
</section>
```

**Чем отличается:** контраст масштаба (4.5x vs 2.2x), асимметрия вместо 50/50, конкретные отступы вместо `min-h-screen`, две кнопки разной иерархии, eyebrow задаёт контекст. См. Composition Principles → Typographic Contrast, Visual Focal Point.

---

## 2. Features Grid

**❌ Провинциально (механическая сетка):**
- Все карточки одинаковые: `grid-cols-3 gap-6`, каждая = `p-6 rounded-2xl border`
- Иконка в accent-квадрате → title → description → всё. 6 карточек подряд, без вариации
- Одна секция = `py-28`, как и все остальные — монотонный ритм
- Нет staggered reveal — всё появляется одновременно
- Карточки не реагируют на hover (или только `shadow-md`)

```html
<!-- ❌ -->
<section class="py-28">
  <div class="max-w-7xl mx-auto px-8">
    <h2 class="text-3xl font-semibold text-center mb-12">Возможности</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- 6 одинаковых карточек -->
      <div class="rounded-2xl border p-6">
        <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
          <svg class="w-6 h-6 text-indigo-500">...</svg>
        </div>
        <h3 class="mt-4 text-lg font-semibold">Фича 1</h3>
        <p class="mt-2 text-sm text-slate-600">Описание фичи.</p>
      </div>
      <!-- ... ещё 5 таких же -->
    </div>
  </div>
</section>
```

**✅ Со вкусом (вариация плотности и ритма):**
- Чередование композиций: grid (3 карточки) → split (2 карточки с иллюстрацией) → list (вертикальный стек)
- Разная плотность: feature-карточки = `p-8`, каталог = `p-5..6`
- НЕ все карточки с иконкой в квадрате. Часть — с номером (`text-accent`), часть — с иллюстрацией
- Staggered reveal: `transition-delay: +100ms` на каждую следующую карточку
- Hover: `hover:-translate-y-0.5 hover:shadow-md hover:border-accent/30` — мягкий акцент
- Фон секции отличается от предыдущей: `bg-white` → `bg-slate-50` (layered depth)

```html
<!-- ✅ (modern-clean) — grid с вариацией -->
<section class="bg-white py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Всё что нужно для запуска</h2>
      <p class="mt-4 text-lg text-slate-600">Ни одной лишней кнопки. Только то что работает.</p>
    </div>

    <!-- Row 1: 3 feature cards (плотные, p-8) -->
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="reveal group rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-indigo-200">
        <span class="text-sm font-medium text-indigo-500">01</span>
        <h3 class="mt-4 text-lg font-semibold text-slate-900">Автоматический деплой</h3>
        <p class="mt-3 text-base leading-relaxed text-slate-600">Пуш в main — и сайт в продакшене. Без ручного нажатия кнопок.</p>
      </div>
      <!-- ... variant 2: иконка в квадрате ... -->
      <!-- ... variant 3: иллюстрация ... -->
    </div>

    <!-- Row 2: split 60/40 — крупная фича с иллюстрацией -->
    <div class="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
      <div class="lg:col-span-3 reveal">
        <span class="text-sm font-medium text-indigo-500">Ключевое</span>
        <h3 class="mt-3 text-2xl font-semibold text-slate-900">Мгновенные откаты</h3>
        <p class="mt-4 text-base leading-relaxed text-slate-600">Ошибка в проде? Один клик — и вы на 5 минут назад. Без паники.</p>
      </div>
      <div class="lg:col-span-2 reveal">
        <div class="aspect-[4/3] rounded-2xl bg-slate-100"></div>
      </div>
    </div>
  </div>
</section>
```

**Чем отличается:** вариация композиций (grid → split → list), разная плотность карточек, staggered reveal, layered фон между секциями. См. Composition Principles → Section Variation, Whitespace Rhythm.

---

## 3. Pricing Cards

**❌ Провинциально (плоские одинаковые):**
- 3 карточки одинаковой высоты, `border`, `rounded-2xl`, `p-6`
- Все три визуально равны — ни одна не выделена
- Кнопка CTA везде accent-цвета — нет иерархии действий
- «Популярный» тариф помечен словом «Popular» без визуального отличия
- Нет фонового контраста между тарифами

```html
<!-- ❌ -->
<div class="grid grid-cols-3 gap-6">
  <div class="rounded-2xl border p-6 text-center">
    <h3 class="text-lg font-semibold">Базовый</h3>
    <p class="mt-2 text-4xl font-bold">$9</p>
    <ul class="mt-6 space-y-2 text-sm text-slate-600"><li>Фича 1</li>...</ul>
    <a href="#" class="mt-8 block rounded-md bg-indigo-500 px-4 py-2 text-white">Выбрать</a>
  </div>
  <!-- Popular: только текст -->
  <div class="rounded-2xl border p-6 text-center">
    <span class="text-xs text-indigo-500">Popular</span>
    <h3 class="text-lg font-semibold">Про</h3>
    <p class="mt-2 text-4xl font-bold">$29</p>
    <!-- ... -->
  </div>
  <!-- ... -->
</div>
```

**✅ Со вкусом (layered с акцентом):**
- Популярный тариф ВИЗУАЛЬНО выделен: `ring-2 ring-accent`, `shadow-md`, или `bg-accent/5` (warm-minimal: `bg-amber-50`)
- Разная высота карточек: популярный чуть крупнее (`scale-105` или `py-10` vs `py-8`)
- Кнопка популярного тарифа — accent (`bg-amber-600` / `bg-indigo-500`), остальные — нейтральные (`bg-slate-900` / `border`)
- Фон секции отличается от карточек: `bg-slate-50` секция, `bg-white` карточки (layered depth)
- Цена крупная: `text-5xl font-bold tracking-tight`, валюта мельче: `text-lg text-muted`

```html
<!-- ✅ (modern-clean) -->
<section class="bg-slate-50 py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-slate-900">Простой тариф</h2>
      <p class="mt-4 text-lg text-slate-600">Никаких скрытых платежей. Меняйте тариф когда угодно.</p>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      <!-- Базовый -->
      <div class="reveal rounded-2xl border border-slate-200 bg-white p-8">
        <h3 class="text-lg font-semibold text-slate-900">Старт</h3>
        <p class="mt-4 text-5xl font-bold tracking-tight text-slate-900">$9<span class="text-lg font-normal text-slate-400">/мес</span></p>
        <ul class="mt-8 space-y-3 text-sm text-slate-600">
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> 3 проекта</li>
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> 1 ГБ хранилища</li>
        </ul>
        <a href="#" class="mt-8 block rounded-md border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          Начать
        </a>
      </div>

      <!-- Популярный (выделен) -->
      <div class="reveal relative rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-md">
        <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium text-white">
          Популярный
        </span>
        <h3 class="text-lg font-semibold text-slate-900">Про</h3>
        <p class="mt-4 text-5xl font-bold tracking-tight text-slate-900">$29<span class="text-lg font-normal text-slate-400">/мес</span></p>
        <ul class="mt-8 space-y-3 text-sm text-slate-600">
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> 20 проектов</li>
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> 10 ГБ хранилища</li>
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> Приоритетная поддержка</li>
        </ul>
        <a href="#" class="mt-8 block rounded-md bg-indigo-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-indigo-600 transition-colors">
          Попробовать бесплатно
        </a>
      </div>

      <!-- Максимальный -->
      <div class="reveal rounded-2xl border border-slate-200 bg-white p-8">
        <h3 class="text-lg font-semibold text-slate-900">Бизнес</h3>
        <p class="mt-4 text-5xl font-bold tracking-tight text-slate-900">$99<span class="text-lg font-normal text-slate-400">/мес</span></p>
        <ul class="mt-8 space-y-3 text-sm text-slate-600">
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> Без ограничений</li>
          <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500">...</svg> 100 ГБ хранилища</li>
        </ul>
        <a href="#" class="mt-8 block rounded-md bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-slate-800 transition-colors">
          Связаться с нами
        </a>
      </div>
    </div>
  </div>
</section>
```

**Чем отличается:** популярный тариф визуально доминирует (border-2 accent + shadow + floating badge), нейтральные кнопки на обычных тарифах vs accent на популярном, layered фон (секция ≠ карточки), цена с иерархией (цифра крупная, валюта мелкая). См. Composition Principles → Layered Depth, Accent Discipline.

---

## 4. Testimonials

**❌ Провинциально (безликие цитаты):**
- Только текст: курсивная цитата без фото, без имени, без контекста
- Одна карточка на весь ряд — не используется пространство
- Нет социального доказательства: «Клиенты нас любят» без конкретики
- Звёздочки как единственный визуальный элемент — клише
- `bg-white` карточка без отличия от фона секции

```html
<!-- ❌ -->
<section class="py-20 bg-white">
  <div class="max-w-3xl mx-auto text-center px-8">
    <h2 class="text-3xl font-semibold">Отзывы</h2>
    <blockquote class="mt-8 text-lg italic text-slate-600">
      «Отличный сервис, очень понравилось!»
    </blockquote>
    <p class="mt-4 text-sm text-slate-400">— Клиент</p>
  </div>
</section>
```

**✅ Со вкусом (глубина: фото + цитата + контекст):**
- Фото человека (аватар `rounded-full`, `w-12 h-12`) + имя + должность + компания
- Реальная цитата с конкретикой: «Сократили время деплоя с 40 минут до 3» вместо «Отличный сервис»
- Карточка с фоном, отличным от секции: `bg-white` на `bg-slate-50` (layered)
- Grid из 2-3 карточек: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Логотип компании (монохромный, мелкий) — социальное доказательство
- Декоративная кавычка: крупная `text-6xl text-accent/20` как фон

```html
<!-- ✅ (warm-minimal, layered) -->
<section class="bg-stone-50 py-28">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-stone-900">Нам доверяют</h2>
      <p class="mt-4 text-lg text-stone-500">Команды, которые уже перешли — и не жалеют.</p>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="reveal relative rounded-2xl border border-stone-200 bg-white p-8">
        <span class="absolute top-6 right-8 text-6xl font-serif text-amber-200">"</span>
        <p class="relative text-base leading-relaxed text-stone-600">
          Сократили время деплоя с 40 минут до 3. Команда перестала бояться пятничных релизов. Это изменило всё.
        </p>
        <div class="mt-6 flex items-center gap-3">
          <img src="https://placehold.co/48x48/e7e5e4/a8a29e?text=АК" alt="Анна К." class="h-12 w-12 rounded-full object-cover">
          <div>
            <p class="text-sm font-medium text-stone-900">Анна К.</p>
            <p class="text-xs text-stone-400">Tech Lead, Яндекс</p>
          </div>
        </div>
      </div>
      <!-- ... ещё 2 карточки ... -->
    </div>
  </div>
</section>
```

**Чем отличается:** фото + полное имя + должность + компания = социальное доказательство, конкретная цитата с цифрами, декоративная кавычка (accent/20 — не отвлекает), layered фон секции, grid из нескольких карточек. См. Composition Principles → Layered Depth.

---

## 5. CTA Section

**❌ Провинциально (generic призыв):**
- Градиентный фон: `bg-gradient-to-r from-accent to-accent-dark` — грубо, дёшево
- Размытый текст: «Готовы начать? Присоединяйтесь к тысячам клиентов!»
- Одна accent-кнопка «Начать» без уточнения ЧТО произойдёт
- `py-16` — маловато для CTA, секция не дышит
- Нет социального доказательства, нет конкретного обещания

```html
<!-- ❌ -->
<section class="bg-gradient-to-r from-indigo-500 to-violet-500 py-16">
  <div class="max-w-3xl mx-auto text-center px-8">
    <h2 class="text-3xl font-bold text-white">Готовы начать?</h2>
    <p class="mt-4 text-indigo-100">Присоединяйтесь к тысячам довольных клиентов!</p>
    <a href="#" class="mt-8 inline-block rounded-md bg-white px-6 py-3 font-medium text-indigo-600">Начать</a>
  </div>
</section>
```

**✅ Со вкусом (конкретное обещание):**
- Нейтральный фон: `bg-slate-900` (modern-clean) или `bg-stone-900` (warm-minimal) — тёмный, солидный
- Конкретный заголовок с обещанием: «Начните за 5 минут. Без регистрации.»
- Кнопка с глаголом действия: «Создать первый проект» / «Попробовать бесплатно»
- Мелкий текст под кнопкой: «Без карты. 14 дней доступа.» — снимает трение
- `py-24` (96px) — CTA дышит
- Опционально: 1-2 логотипа или цифра («5,000+ команд») — микро-доказательство

```html
<!-- ✅ (modern-clean) -->
<section class="bg-slate-900 py-24">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Начните за 5 минут. Без регистрации.
      </h2>
      <p class="mt-4 text-lg text-slate-400">
        Импортируйте репозиторий — и первый деплой через 5 минут. Никаких форм на 10 полей.
      </p>
      <div class="mt-10">
        <a href="#" class="inline-flex items-center rounded-md bg-indigo-500 px-6 py-3 text-base font-medium text-white transition-colors duration-150 hover:bg-indigo-600">
          Создать первый проект
          <svg class="ml-2 h-4 w-4">...</svg>
        </a>
        <p class="mt-4 text-sm text-slate-500">Без карты. 14 дней полного доступа.</p>
      </div>
    </div>
  </div>
</section>
```

**Чем отличается:** тёмный нейтральный фон вместо градиента, конкретное обещание в заголовке, глагол действия на кнопке, микро-текст снимает трение (no credit card), accent только на кнопке. См. Composition Principles → Accent Discipline (≤5% площади).

---

## 6. Footer

**❌ Провинциально (шаблонный 4-колонник):**
- 4 колонки: «Компания», «Продукт», «Ресурсы», «Правовая информация»
- Механический список ссылок без иерархии
- Copyright отдельно: `© 2025 Company. All rights reserved.`
- `bg-slate-50` (или `bg-stone-50`) без отличия от фона страницы
- Нет логотипа, нет подписи, нет personality

```html
<!-- ❌ -->
<footer class="bg-slate-50 border-t py-12">
  <div class="max-w-7xl mx-auto px-8">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h4 class="text-sm font-semibold text-slate-900">Компания</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-slate-600 hover:text-slate-900">О нас</a></li>
          <li><a href="#" class="text-sm text-slate-600 hover:text-slate-900">Карьера</a></li>
        </ul>
      </div>
      <!-- ... ещё 3 колонки ... -->
    </div>
    <div class="mt-12 pt-8 border-t border-slate-200 text-center">
      <p class="text-sm text-slate-400">© 2025 Company. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**✅ Со вкусом (брендированный с подписью):**
- Логотип + tagline сверху: «Платформа для тех, кто сдаёт в срок.»
- 2-3 колонки (НЕ 4) — меньше шума, больше воздуха
- Социальные сети иконками (inline SVG, `text-muted hover:text-accent`)
- Copyright с personality: «© 2025 Company. Сделано с ❤️ в Берлине.» или «Собрано удалённо.»
- `bg-slate-900 text-slate-400` (modern-clean) или `bg-stone-100` (warm-minimal) — фон отличается от страницы
- Newsletter-форма (опционально) — вовлечение

```html
<!-- ✅ (modern-clean) -->
<footer class="bg-slate-900 pt-16 pb-12">
  <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand column -->
      <div class="md:col-span-1">
        <a href="/" class="text-xl font-bold text-white">Company</a>
        <p class="mt-3 text-sm text-slate-400 max-w-xs">
          Платформа для команд, которые сдают в срок. Без конфигов, без боли.
        </p>
        <div class="mt-6 flex items-center gap-4">
          <a href="#" class="text-slate-500 hover:text-slate-300 transition-colors">
            <svg class="h-5 w-5">...</svg><!-- GitHub -->
          </a>
          <a href="#" class="text-slate-500 hover:text-slate-300 transition-colors">
            <svg class="h-5 w-5">...</svg><!-- Twitter -->
          </a>
        </div>
      </div>
      <!-- Links columns (2, не 4) -->
      <div>
        <h4 class="text-sm font-semibold text-white">Продукт</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Возможности</a></li>
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Тарифы</a></li>
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Changelog</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-sm font-semibold text-white">Компания</h4>
        <ul class="mt-4 space-y-2">
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">О нас</a></li>
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Блог</a></li>
          <li><a href="#" class="text-sm text-slate-400 hover:text-white transition-colors">Контакты</a></li>
        </ul>
      </div>
    </div>
    <div class="mt-12 pt-8 border-t border-slate-800">
      <p class="text-sm text-slate-500">© 2025 Company. Собрано удалённо — из Берлина, Токио и Нью-Йорка.</p>
    </div>
  </div>
</footer>
```

**Чем отличается:** логотип + tagline вместо 4-й колонки, 2-3 колонки (меньше шума), социальные иконки, copyright с personality, фон темнее страницы (layered depth). См. Composition Principles → Layered Depth, Whitespace Rhythm.

---

## Как использовать

1. **Перед генерацией** компонента — прочитай соответствующую пару ❌/✅ в этом файле
2. **Сверь свой план** с колонкой ❌ — если твой план совпадает с «провинциальным» вариантом, пересмотри
3. **Подставь тему:** замени `slate`/`stone`/`indigo`/`amber` на цвета своей темы
4. **НЕ копируй 1:1** — это примеры структуры, не шаблоны. Адаптируй под конкретный контент
5. **Применяй Composition Principles** из `tokens.md` — это why, а few-shot — это what

## Связанные файлы

- `tokens.md` — Composition Principles (Whitespace Rhythm, Typographic Contrast, Layered Depth, etc.)
- `themes/warm-minimal.md` — тёплая палитра (stone + amber), примеры компонентов
- `themes/modern-clean.md` — холодная палитра (slate + indigo), примеры компонентов
- `style-guide.md` — эталонные дизайн-системы реальных сайтов
- `prompts/make-ui.md` — главный UI-промпт (ссылается на этот файл)