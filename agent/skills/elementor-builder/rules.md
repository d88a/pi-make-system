# Правила сборки Elementor

## Формат: section + column (универсальный)

```json
[{
  "id": "section_id",
  "elType": "section",
  "settings": {
    "background_background": "classic",
    "background_color": "#FAF6EC",
    "padding": {"unit": "px", "top": "112", "right": "16", "bottom": "112", "left": "16", "isLinked": false},
    "gap": "no"
  },
  "elements": [{
    "id": "col_id",
    "elType": "column",
    "settings": {"_column_size": 100},
    "elements": [...виджеты...]
  }]
}]
```

## Размеры колонок

- 1 колонка: `_column_size: 100`
- 3 колонки: `_column_size: 33.3333` (каждая)
- 4 колонки: `_column_size: 25` (каждая)
- 5 колонок: `_column_size: 20` (каждая)
- Отступ между колонками: `column_gap: {"unit": "px", "size": "24"}`

## Виджеты

### Heading
```json
{
  "id": "widget_id",
  "elType": "widget",
  "widgetType": "heading",
  "settings": {
    "title": "Текст заголовка",
    "header_size": "h2",
    "align": "center",
    "title_color": "#2F4A33",
    "typography_typography": "custom",
    "typography_font_family": "Playfair Display",
    "typography_font_size": {"unit": "px", "size": 48},
    "typography_font_weight": "700",
    "typography_line_height": {"unit": "em", "size": 1.08}
  },
  "elements": []
}
```

### Text Editor
```json
{
  "id": "widget_id",
  "elType": "widget",
  "widgetType": "text-editor",
  "settings": {
    "editor": "<p style=\"font-size:18px; color:#2B2620;\">Текст</p>"
  },
  "elements": []
}
```

### Image
```json
{
  "id": "widget_id",
  "elType": "widget",
  "widgetType": "image",
  "settings": {
    "image": {"url": "https://...", "id": ""},
    "image_size": "full"
  },
  "elements": []
}
```

### Button
```json
{
  "id": "widget_id",
  "elType": "widget",
  "widgetType": "button",
  "settings": {
    "text": "Текст кнопки",
    "link": {"url": "#contacts"},
    "align": "center",
    "background_color": "#B8963E",
    "button_text_color": "#2B2620",
    "typography_typography": "custom",
    "typography_font_size": {"unit": "px", "size": 16},
    "typography_font_weight": "600",
    "border_radius": {"unit": "px", "top": "0", "right": "0", "bottom": "0", "left": "0", "isLinked": true}
  },
  "elements": []
}
```

## Typography — ПЛОСКИЕ ключи

```json
"typography_typography": "custom",
"typography_font_family": "Playfair Display",
"typography_font_size": {"unit": "px", "size": 48},
"typography_font_weight": "700",
"typography_font_style": "italic",
"typography_line_height": {"unit": "em", "size": 1.7},
"typography_letter_spacing": {"unit": "px", "size": 3},
"typography_text_transform": "uppercase"
```

❌ НЕ ИСПОЛЬЗОВАТЬ вложенный объект:
```json
// НЕПРАВИЛЬНО:
"typography": {"font_family": "Playfair Display", ...}
```

## Карточки — стилизация колонки

```json
{
  "id": "card_col",
  "elType": "column",
  "settings": {
    "_column_size": 33.3333,
    "background_background": "classic",
    "background_color": "#FFFFFF",
    "border_border": "solid",
    "border_width": {"unit": "px", "top": "1", "right": "1", "bottom": "1", "left": "1", "isLinked": true},
    "border_color": "#E3D9C6",
    "padding": {"unit": "px", "top": "0", "right": "0", "bottom": "24", "left": "0", "isLinked": false}
  }
}
```

## Сохранение в БД (через wp eval)

```php
$json = json_encode($data, JSON_UNESCAPED_UNICODE);
update_post_meta($post_id, '_elementor_data', wp_slash($json));
delete_post_meta($post_id, '_elementor_css');
delete_post_meta($post_id, '_elementor_page_assets');
\Elementor\Plugin::$instance->files_manager->clear_cache();
wp_cache_flush();
```

## Экспорт шаблона

```json
{
  "content": [...элементы...],
  "title": "Название шаблона",
  "type": "section"
}
```

## Совместимость версий

- section+column — работает в Elementor 3.x и 4.x
- container/flex — ТОЛЬКО 4.2+
- У заказчика может быть 4.1.3 без container/flex → всегда section+column
- `$$type` формат — не использовать (4.2+)

## Адаптивность

- CSS вставляется в Appearance → Customize → Additional CSS
- Селекторы: `div[style*="grid-template-columns"]` для HTML-виджетов
- Селекторы: `.elementor-col-25`, `.elementor-col-33\.3333` для колонок
- Медиа-запросы: `@media (max-width: 1024px)` — планшет, `@media (max-width: 767px)` — телефон