# Pi Make System

AI-powered UI generation system — аналог v0.dev / Figma Make / Lovable, работающий локально через Pi + AI-агентов.

## Возможности

- **3 pipeline:** HTML+Tailwind / Кастомная WordPress тема / Elementor JSON
- **16 дизайн-тем** (light + dark)
- **Corpus-driven:** паттерны из реальных сайтов
- **9-осный dashboard** для выбора стиля (тема × ниша × акцент × фон × mood × radius × шрифты × layout × card variant)
- **Верификация:** WCAG AA, screenshot review, grep-аудит
- **19 AI-агентов** (архитектор, ui-coder, дизайнер, code-auditor, wp-coder...)

## Проекты

| Проект | Pipeline | Статус |
|--------|----------|--------|
| СтройМакс (maksplit.ru) | Кастомная WP-тема | ✅ Live |
| Барышня-крестьянка | Elementor JSON | 🔄 В процессе |
| DevUp (dev-up.ru) | Next.js портфолио | ✅ Live |

## Структура

```
memory/          — память проекта (STATUS, DECISIONS, ARCHITECTURE)
corpus/          — corpus реальных сайтов (links, extractions JSON)
projects/        — сгенерированные проекты (HTML/WP)
scripts/         — системные скрипты (image generation, a11y check)
```

## Setup

Проект работает через [Pi Coding Agent](https://github.com/earendil-works/pi-coding-agent).
Дизайн-система, промпты и агенты — в `~/.pi/agent/`.

## Лицензия

Private project.