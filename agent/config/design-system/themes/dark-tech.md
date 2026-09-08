# Dark-Tech Theme — Cyberpunk/Neon

## Цвета
- Background: #0A0A0A
- Surface: #121212
- Accent: #00BFFF
- Secondary: #8B00FF
- Text: #FFFFFF
- Disabled: #444444
- Hover: #0099CC
- Border: #222222

## Типографика
- Font: Inter (Monospace как fallback)
- Headings: font-weight: 700, line-height: 1.2
- Body: font-weight: 500, line-height: 1.6
- Caption: font-size: 12px, font-weight: 400

## Отступы
- Padding: px-5 py-3 → 1.25rem
- Spacing: gap-6 → 1.5rem
- Margin: mt-8 → 2rem

## Компоненты
- Кнопки: `rounded-md`, `border`, `bg-gradient-to-r from-cyan-500 to-purple-600`, `text-white`, `hover:shadow-neon`
- Карточки: `border`, `shadow-lg`, `rounded-md`, `bg-black`, `text-cyan-400`
- Навигация: `flex`, `gap-8`, `text-cyan-400`, `hover:text-purple-400`

## Анимации
- Neon glow: `animate-pulse`, `shadow-[0_0_15px_rgba(0,187,255,0.6)]`
- Fade-in: `transition-opacity duration-300 ease-in-out`
- Scale: `transition-transform duration-200 ease-in-out`

## Анти-паттерны
- Не используйте `rounded-full`, `shadow-sm`
- Избегайте светлых цветов (белый, серый)
- Не используйте `border-none`, `bg-white`