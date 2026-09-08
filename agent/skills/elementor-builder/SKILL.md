---
name: elementor-builder
description: Конвертация HTML-прототипов в JSON-шаблоны Elementor. Используется когда нужно автоматически собрать страницу WordPress + Elementor из готового HTML-макета. Знает формат section+column, typography-ключи, экспорт/импорт шаблонов, адаптивность через CSS.
metadata:
  category: site-building
  platform: global
---

# Elementor Builder

Конвертирует HTML-прототип → JSON-шаблоны Elementor для импорта через Templates → Import.

## Когда использовать

- Нужно перенести HTML-макет (Tailwind/чистый HTML) в WordPress + Elementor
- Сборка страницы 1:1 с прототипом
- Массовая генерация блоков (hero, cards, формы, футер)

## Шаги

1. Прочитать HTML-прототип → разложить на блоки
2. Для каждого блока сгенерировать JSON (формат в `rules.md`)
3. Сохранить через `wp_slash()` + `update_post_meta`
4. Экспорт: `{"content": [...], "title": "...", "type": "section"}`
5. Сгенерировать `decorative.css` для декоративных элементов

## Ключевые правила → `rules.md`

## Примеры → `templates/`

## Пример CSS → `css/decorative.css`