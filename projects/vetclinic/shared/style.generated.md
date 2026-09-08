# Style Guide — Ветклиника «ЛапЛап»

> Сгенерирован: 2026-07-14
> Тема: адаптация warm-minimal + sage green (ветеринарный)
> Целевая аудитория: молодые владельцы домашних животных, 25–40 лет

---

## 1. Colors

| Роль | Hex | Tailwind | Применение |
|------|-----|----------|------------|
| Primary (sage green) | `#059669` | `emerald-600` | Кнопки CTA, ссылки, активные элементы, иконки |
| Primary hover | `#047857` | `emerald-700` | Hover на primary-элементах |
| Primary soft | `#ecfdf5` | `emerald-50` | Бейджи, подсветка, фон иконок |
| Secondary (warm amber) | `#d97706` | `amber-600` | Акценты, важные метки, цены |
| Secondary soft | `#fffbeb` | `amber-50` | Мягкая подсветка |
| Background (page) | `#faf9f7` | `stone-50` | Основной фон страницы |
| Background (alt) | `#ffffff` | `white` | Чередующиеся секции, карточки |
| Text (headings) | `#1c1917` | `stone-900` | Заголовки h1–h3 |
| Text (body) | `#57534e` | `stone-600` | Основной текст, описания |
| Text (muted) | `#a8a29e` | `stone-400` | Мета-информация, placeholder |
| Border | `#e7e5e4` | `stone-200` | Границы карточек, разделители |
| Border hover | `#d6d3d1` | `stone-300` | Hover-состояние границ |

---

## 2. Typography

| Роль | Шрифт | Вес | Размер | Tailwind |
|------|-------|-----|--------|----------|
| Hero title | Nunito | 700 | 60px | `text-6xl font-bold tracking-tight` |
| Section title | Nunito | 700 | 36px | `text-4xl font-bold tracking-tight` |
| Card title | Nunito | 600 | 20px | `text-xl font-semibold` |
| Body text | Inter | 400 | 16px | `text-base` |
| Body lead | Inter | 400 | 18px | `text-lg leading-relaxed` |
| Subtitle | Inter | 400 | 18px | `text-lg text-stone-600` |
| Meta / caption | Inter | 400 | 14px | `text-sm` |
| Button | Inter | 500 | 16px | `text-base font-medium` |
| Eyebrow | Inter | 500 | 12px | `text-xs font-medium tracking-wider uppercase` |

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 3. Buttons

| Тип | Tailwind | Применение |
|-----|----------|------------|
| Primary | `bg-emerald-600 text-white rounded-md px-6 py-3 text-base font-medium hover:bg-emerald-700 transition duration-200` | Основной CTA |
| Secondary | `border border-stone-300 bg-white text-stone-700 rounded-md px-6 py-3 text-base font-medium hover:bg-stone-50 transition duration-200` | Второстепенное действие |
| Ghost | `text-stone-600 hover:bg-stone-100 rounded-md px-4 py-2 text-sm font-medium transition duration-200` | Навигация, ссылки |

---

## 4. Spacing

| Контекст | px | Tailwind |
|----------|----|----------|
| Section padding | 112px | `py-28` |
| Section padding (alt) | 96px | `py-24` |
| Hero top | 160px | `pt-40` |
| Hero bottom | 128px | `pb-32` |
| Card internal | 32px | `p-8` |
| Card gap (grid) | 24px | `gap-6` |
| Form field gap | 16px | `gap-4` |
| Container padding | 16px→24px→32px | `px-4 sm:px-6 lg:px-8` |

---

## 5. Borders & Radius

| Элемент | px | Tailwind |
|---------|----|----------|
| Карточки | 16px | `rounded-2xl` |
| Кнопки | 6px | `rounded-md` |
| Инпуты | 6px | `rounded-md` |
| Бейджи | 9999px | `rounded-full` |
| Модалки | 12px | `rounded-xl` |
| Граница карточек | 1px | `border border-stone-200` |
| Граница при hover | 1px | `hover:border-stone-300` |

---

## 6. Shadows & Effects

| Состояние | Tailwind | Применение |
|-----------|----------|------------|
| Карточка в покое | `shadow-none` | Только border |
| Карточка hover | `hover:shadow-md hover:-translate-y-0.5` | Лёгкое поднятие |
| Floating (dropdown) | `shadow-lg` | Выпадающие меню |
| Floating (modal) | `shadow-xl` | Модальные окна |
| Navbar | `backdrop-blur-sm bg-stone-50/90` | Полупрозрачный фон |

---

## 7. Images

| Контекст | Размер | Tailwind |
|----------|--------|----------|
| Hero фото | 16:9 | `aspect-[16/9]` |
| Карточка услуги | 1:1 (иконка) | `w-12 h-12` |
| Фото врача | 1:1 | `aspect-square` |
| Placeholder | `placehold.co` | `https://placehold.co/WxH/e7e5e4/a8a29e?text=...` |

**Placeholder-цвета:** bg=`e7e5e4` (stone-200), text=`a8a29e` (stone-400)

---

## 8. Animations

| Тип | Длительность | Tailwind |
|-----|-------------|----------|
| Hover карточки | 200ms | `transition-all duration-200` |
| Hover кнопки | 200ms | `transition duration-200` |
| Scroll reveal | 600ms | CSS `.reveal` + `IntersectionObserver` |
| Stagger | +100ms | Через `transition-delay` или JS |
| Navbar sticky | мгновенно | `sticky top-0` |

---

## 9. Icons

| Параметр | Значение |
|----------|----------|
| Стиль | Lucide-style (контурные) |
| Stroke-width | 1.5 |
| Размер | 24×24 |
| Цвет | `currentColor` |
| Формат | inline SVG |

**Иконки для клиники:** лапка (paw), сердце, стетоскоп, шприц, календарь, часы, телефон, карта, почта, пользователи, звезда, галочка.

---

## 10. Forms

| Элемент | Tailwind |
|---------|----------|
| Label | `block text-sm font-medium text-stone-700 mb-1.5` |
| Input | `w-full rounded-md border border-stone-300 px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200` |
| Textarea | `w-full rounded-md border border-stone-300 px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-200` |
| Submit button | `bg-emerald-600 text-white rounded-md px-6 py-3 text-base font-medium hover:bg-emerald-700 transition duration-200` |
| Error | `text-sm text-red-600 mt-1` |
| Help text | `text-sm text-stone-400 mt-1` |

---

## 11. Tables

Не используется в текущем проекте. При необходимости:
- Header: `bg-stone-50 text-sm font-medium text-stone-600`
- Row: `border-b border-stone-100`
- Hover: `hover:bg-stone-50/50`
- Cell: `px-4 py-3`

---

## 12. Navigation

| Элемент | Tailwind |
|---------|----------|
| Navbar | `sticky top-0 z-50 h-16 border-b border-stone-200 bg-stone-50/90 backdrop-blur-sm` |
| Logo | `font-nunito font-bold text-xl text-stone-900` |
| Nav link | `text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors duration-200` |
| Nav link active | `text-emerald-600 font-semibold` |
| Mobile menu | `md:hidden` hamburger, раскрывающийся |
| Mobile menu panel | `absolute top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-lg` |
| CTA in nav | `bg-emerald-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition duration-200` |