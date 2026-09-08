# Gaming Theme — Neon/Retro

## Цвета
- Background: #000000
- Surface: #121212
- Accent: #00FF00
- Secondary: #0000FF
- Text: #FFFFFF
- Disabled: #666666
- Hover: #00CC00
- Border: #333333

## Типографика
- Font: Press Start 2P (Inter как fallback)
- Headings: font-weight: 700, line-height: 1.1
- Body: font-weight: 500, line-height: 1.4
- Caption: font-size: 10px, font-weight: 600

## Отступы
- Padding: px-3 py-1 → 0.75rem
- Spacing: gap-3 → 0.75rem
- Margin: mt-4 → 1rem

## Компоненты
- Кнопки: `rounded`, `border`, `bg-gradient-to-r from-green-400 to-blue-500`, `text-white`, `hover:shadow-neon`
- Карточки: `border`, `shadow-lg`, `rounded`, `bg-black`, `text-green-400`
- Навигация: `flex`, `gap-6`, `text-green-400`, `hover:text-cyan-400`

## Анимации
- Neon glow: `animate-pulse`, `shadow-[0_0_10px_rgba(0,255,0,0.5)]`
- Blink: `animate-blink` (every 1s)
- Pulse: `transition-all duration-300 ease-in-out`

## Анти-паттерны
- Не используйте `rounded-xl`, `shadow-sm`
- Избегайте светлых цветов (белый, серый)
- Не используйте `border-none`, `bg-white`