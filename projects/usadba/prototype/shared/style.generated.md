# Style Guide — Усадьба «Барышня-крестьянка»

> Кастомная «дворянская» тема (D-004). Сгенерировано 2026-08-20.
> Mood: premium / heritage. Палитра и шрифты — прямое требование ТЗ заказчика.

## 1. Colors

| Роль | Hex | CSS var | Применение |
|------|-----|---------|-----------|
| Primary (зелёный герб) | #2F4A33 | --color-primary | Хедер, футер, заголовки, секция миссии |
| Primary deep | #263D2A | --color-primary-deep | Футер (темнее хедера), hover |
| Secondary (терракота) | #B0603F | --color-secondary | Eyebrow-метки, кнопки «Записаться»/«Отправить», рамки |
| Accent (золото) | #B8963E | --color-accent | Разделители, рамки, hover, декор — ≤5% площади |
| Accent soft | #C9A227 | --color-accent-soft | Hover кнопок CTA |
| BG page | #FAF6EC | --color-bg-page | Основной фон (слоновая кость) |
| BG alt | #F5EFE3 | --color-bg-alt | Чередующиеся секции (бежевый) |
| Surface | #FFFFFF | --color-surface | Карточки, инпуты, паспарту |
| Text | #2B2620 | --color-text-primary | Основной текст (тёплый почти-чёрный) |
| Text muted | #6B6156 | --color-text-muted | Подписи, placeholder |
| Text inverse | #F5EFE3 | --color-text-inverse | Текст на зелёном |
| Border | #E3D9C6 | --color-border | Границы карточек |

**Правило золота:** ≤5% площади. Только декор/разделители/hover. Не заливать фоны.

## 2. Typography
- Display: **Playfair Display** (400/600/700 + italic) — h1–h3, цитаты, логотип
- Body: **Open Sans** (400/500/600/700) — текст, UI, кнопки
- Hero: text-4xl→7xl, tracking-tight, контраст 4.5x к body
- Секции: text-3xl→5xl Playfair bold
- Lead/цитаты: Playfair italic text-xl–2xl
- Body: text-base (16px), line-height 1.6–1.7 (мобильный ≥16px — ТЗ)
- Eyebrow: 12px, uppercase, letter-spacing 0.22em, semibold

## 3. Buttons
- Radius: rounded-md (6px), solid color, без градиентов
- Primary CTA: bg-gold + text-ink, hover → gold-soft
- Secondary CTA: bg-terra + text-cream, hover → darken 15%
- Ghost (на тёмном): border cream/40, hover → border-gold + text-gold
- Padding: px-6..8 py-3..4, font-semibold

## 4. Spacing
- Секции: py-24 (96px) базово, py-28/32 для ключевых, hero pt-36 pb-20..28
- Ритм: чередование py-24 / py-28 / py-32, без монотонности
- Карточки: p-8 (feature), gap-6 в сетках
- Контейнер: max-w-7xl px-4 sm:px-6 lg:px-8

## 5. Borders & Radius
- Карточки: radius 0–8px (острые/почти острые углы = историческая эстетика, НЕ rounded-2xl)
- Двойные винтажные рамки: внешняя 1px gold + padding 10px + внутренняя 1px gold/50 + padding 4px
- Инпуты/кнопки: rounded-md

## 6. Shadows & Effects
- Покой: border, без теней
- --shadow-brand: 0 10px 30px -10px rgba(47,74,51,0.25) — цветная зелёная тень (рамы, hover)
- Paper texture: SVG feTurbulence noise, opacity 0.035 (класс .paper-texture)

## 7. Images
- Placeholder: placehold.co в цветах палитры (2F4A33, B0603F, 3A5A40 / текст F5EFE3)
- Hero: full-bleed cover + gradient overlay rgba(24,36,26, .35→.88)
- Портреты: винтажные рамы с tilt ±1.5°, hover → выпрямление + подъём
- Панорама миссии: full-bleed h-64/h-96
- Всегда width/height атрибуты, loading="lazy" кроме hero

## 8. Animations
- Scroll reveal: opacity+translateY(24px), 600ms ease, IntersectionObserver
- Stagger: +100ms на каждый child (до 5)
- Hover cards: -translate-y-1 + border-gold/60, 200ms
- Easing: cubic-bezier(0.4,0,0.2,1)
- Smooth scroll с offset 80px под sticky header

## 9. Icons
- Inline SVG, Lucide/Heroicons outline, stroke-width 1.5, currentColor
- Соцсети: filled brand SVG (VK, Telegram, YouTube) — placeholder href="#"

## 10. Forms
- Инпуты: rounded-md, border-line, bg-surface, px-4 py-3, focus ring gold/40
- Форма на зелёном: карточка bg-cream + border gold/40
- Action: send.php (заглушка под WP-бэкенд)

## 11. Tables
- Не используются на этой странице

## 12. Navigation
- Sticky header: bg-pine/95 backdrop-blur-md, h-16/h-20, border-b white/10
- Логотип: SVG-эмблема (двойной ромб + точка) + Playfair bold
- Mobile: hamburger → выпадающее меню, закрытие по клику на ссылку
- Footer: bg-pine-deep, py-10, 1 строка (бренд + copyright)

## Орнаментальная система (signature)
- **Divider:** линия–золотой ромб–линия между секциями (72px линии, 8px ромб)
- **Vintage frame:** двойная золотая рамка-паспарту для портретов и примечаний
- **Эмблема:** двойной повёрнутый квадрат (ромб) с точкой в центре — герб-плейсхолдер
