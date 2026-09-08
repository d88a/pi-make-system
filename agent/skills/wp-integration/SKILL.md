---
name: wp-integration
description: >
  Перенос HTML+Tailwind прототипа (сгенерированного Make UI) на WordPress.
  Полный pipeline: анализ прототипа → WP-тема → dynamic data →
  WooCommerce override → деплой. Закрывает дыру между HTML-прототипом
  и живым WordPress-сайтом.
triggers:
  - wordpress
  - wp
  - "перенести на wordpress"
  - "развернуть на WP"
  - woocommerce
  - "wp тема"
  - "создать тему wordpress"
  - elementor
  - "залить на WP"
  - "html в wordpress"
dependencies:
  - WordPress (Docker или сервер)
  - WooCommerce (если магазин)
  - PHP 7.4+
  - Tailwind CLI (для production build)
---

# WP Integration Skill — Перенос HTML-прототипа на WordPress

## Когда использовать

Пользователь говорит:
- «Перенеси HTML на WordPress»
- «Сделай WP-тему из прототипа»
- «Разверни на maksplit.ru»
- «Залей вордпресс тему»
- Любая задача где `{{output_dir}}` от Make UI должна стать темой WordPress.

**Триггер:** HTML-прототип готов (Make UI pipeline завершён) + владелец говорит про WordPress.

## ⛔ КРИТИЧЕСКОЕ ПРАВИЛО: Не пиши код сам

Ты — **архитектор/директор**. Ты НЕ пишешь PHP код руками.
Ты делегируешь **wp-coder**'у (субагент) каждый этап.
Твоя работа: планировать pipeline, проверять результаты, принимать решения.

### Pipeline делегирования:

```
subagent(
  agent="wp-coder",
  task="<конкретный этап из pipeline ниже + контекст>"
)
```

**Каждый этап = отдельный subagent вызов.** НЕ смешивай этапы в одном вызове.
Исключения (делай сам):
- Прочитать файл прототипа (<50 строк)
- Проверить результат grep'ом
- Обновить project.json / STATUS.md

---

## 📋 Pipeline: 9 этапов

```
1. АНАЛИЗ ПРОТОТИПА      → inventory.json + страницы / компоненты
2. КАРКАС WP-ТЕМЫ        → style.css + functions.php + index.php + header.php + footer.php
3. STATIC → DYNAMIC      → карта HTML-хардкода → WP-тегов
4. COMPONENTS → PARTS    → shared/components/*.html → template-parts/*.php
5. TAILWIND В WP          → CDN / CLI build / Play CDN → functions.php
6. WOOCOMMERCE OVERRIDE   → single-product.php + archive-product.php + content-product.php
7. CF7 / FORMS            → HTML-формы → CF7 shortcodes или custom REST
8. ДЕПЛОЙ                → локальный Docker / rsync / Git → активация темы
9. POST-DEPLOY CHECKLIST  → Definition of Done
```

---

## 🧩 Подготовка: что нужно перед началом

### Переменные (архитектор заполняет перед делегированием)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `{{output_dir}}` | Где HTML-прототип (от Make UI) | `D:/pi/projects/maksplit/` |
| `{{wp_path}}` | Путь к WordPress установке | `D:/Anna/Сайты/maksplit.ru/` |
| `{{theme_name}}` | Machine name темы (lowercase, dashes) | `stroymaks` |
| `{{theme_title}}` | Человеческое название темы | `StroyMaks 2026` |
| `{{is_woocommerce}}` | Есть ли магазин | `true` / `false` |
| `{{is_elementor}}` | Активен ли Elementor | `true` / `false` |
| `{{deploy_target}}` | Куда деплоить | `docker` / `rsync` / `git` / `ftp` |
| `{{server_host}}` | Хост сервера (если удалённый) | `maksplit.ru` |
| `{{server_path}}` | Путь на сервере | `/var/www/maksplit.ru/htdocs/` |
| `{{backup_old_theme}}` | Делать ли backup старой темы | `true` |

### Зависимости

Перед началом убедись:

- [ ] WordPress установлен (локально через `docker-compose up` ИЛИ на сервере)
- [ ] PHP 7.4+ (проверить: `php -v`)
- [ ] Tailwind CLI доступен (для build mode): `npx tailwindcss --help`
- [ ] Путь `{{output_dir}}` существует, в нём HTML-файлы
- [ ] Путь `{{wp_path}}/wp-content/themes/` доступен для записи
- [ ] **Backup старой темы сделан** (если замена существующей)

### Быстрый подъём Docker (если локально)

```bash
cd {{wp_path}}
docker-compose up -d
# Проверить:
curl -I http://localhost:8080
```

Типовой `docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
    volumes:
      - db_data:/var/lib/mysql
      - ./maksplit_db.sql:/docker-entrypoint-initdb.d/init.sql
  wordpress:
    image: wordpress:latest
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - ./wp-content:/var/www/html/wp-content
volumes:
  db_data:
```

---

## 🔬 Этап 1: Анализ HTML-прототипа

### Что делает wp-coder

Читает ВСЕ файлы в `{{output_dir}}` и составляет инвентарь:

**Вход:**
- `{{output_dir}}/*.html` — все HTML-файлы
- `{{output_dir}}/shared/components/*.html` — компоненты
- `{{output_dir}}/project.json` — если есть (от Make UI)
- `{{output_dir}}/pages.json` — если есть
- `{{output_dir}}/components.json` — если есть

**Выход: `{{output_dir}}/wp-inventory.json`**

```json
{
  "theme_name": "{{theme_name}}",
  "analyzed_at": "2026-07-22",
  "pages": {
    "index.html": {
      "type": "front_page",
      "wp_template": "front-page.php",
      "sections": ["hero", "features", "catalog", "testimonials", "cta"],
      "dynamic_data": ["products_loop", "categories_list"],
      "hardcoded_content": ["hero_title", "hero_subtitle", "features_list"]
    },
    "catalog.html": {
      "type": "woocommerce_archive",
      "wp_template": "archive-product.php",
      "sections": ["breadcrumbs", "sidebar_filters", "product_grid", "pagination"],
      "dynamic_data": ["wc_product_loop", "wc_filters", "wc_breadcrumbs"],
      "hardcoded_content": []
    },
    "product.html": {
      "type": "woocommerce_single",
      "wp_template": "single-product.php",
      "sections": ["gallery", "title_price", "variations", "tabs", "related"],
      "dynamic_data": ["wc_gallery", "wc_price", "wc_variations", "wc_tabs", "wc_related"],
      "hardcoded_content": []
    },
    "about.html": {
      "type": "page",
      "wp_template": "page-about.php",
      "sections": ["page_header", "team", "history", "certificates"],
      "dynamic_data": [],
      "hardcoded_content": ["all"]
    },
    "contacts.html": {
      "type": "page",
      "wp_template": "page-contacts.php",
      "sections": ["map", "requisites", "feedback_form"],
      "dynamic_data": [],
      "hardcoded_content": ["all"]
    }
  },
  "shared_components": {
    "nav.html": { "wp_dest": "header.php", "type": "global" },
    "footer.html": { "wp_dest": "footer.php", "type": "global" },
    "card.html": { "wp_dest": "template-parts/card.php", "type": "reusable" },
    "hero.html": { "wp_dest": "template-parts/hero.php", "type": "reusable" },
    "lead-form.html": { "wp_dest": "template-parts/lead-form.php", "type": "reusable" }
  },
  "static_assets": {
    "images": ["assets/images/hero-bg.jpg", "assets/images/logo.svg"],
    "css": ["assets/css/tailwind.css"],
    "js": ["assets/js/main.js"]
  },
  "woocommerce_overrides_needed": [
    "single-product.php",
    "archive-product.php",
    "content-product.php"
  ],
  "forms_found": [
    {
      "file": "contacts.html",
      "fields": ["name", "phone", "email", "message"],
      "action": "cf7"
    },
    {
      "file": "index.html",
      "fields": ["phone"],
      "action": "cf7"
    }
  ],
  "tailwind_usage": "CDN via <script> tag",
  "recommendations": [
    "index.html hero content hardcoded → create WP customizer settings or ACF fields",
    "catalog.html ready for WooCommerce override",
    "product.html needs variable.php for variations"
  ]
}
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Проанализируй HTML-прототип в {{output_dir}}.
  Прочитай ВСЕ .html файлы. Для каждого определи:
  (1) тип страницы (front_page, woocommerce_archive, woocommerce_single, page, blog, archive),
  (2) какие WP-теги заменят хардкод,
  (3) какие WooCommerce override'ы нужны,
  (4) какие формы найдены.
  Создай wp-inventory.json.
  Стек: output_dir={{output_dir}}, is_woocommerce={{is_woocommerce}}, is_elementor={{is_elementor}}."
)
```

### Проверка архитектором

```bash
cat {{output_dir}}/wp-inventory.json | python3 -m json.tool > /dev/null && echo "JSON valid"
```

---

## 🔍 Этап 1.5: Pre-flight БД-аудит (для реальной БД, ОБЯЗАТЕЛЬНО)

**Когда:** если портация идёт на реальную БД (live дамп, не чистая установка). СтройМакс-кейс: 96 таблиц, prefix wps_, 10 плагинов, blogname ≠ ожидаемому.

**Делегирование:** data-analyst (НЕ wp-coder — это анализ, не кодинг).

### Что делает data-analyst

1. **Table prefix:** `SHOW TABLES LIKE 'wp_%'` vs `wps_%` vs др. → определить реальный prefix
   - Записать в update-inventory.json: `table_prefix: "wps_"`
   - Если ≠ `wp_` → docker-compose.yml требует `WORDPRESS_TABLE_PREFIX: wps_` (D-142)

2. **blogname:** `SELECT option_value FROM {{prefix}}options WHERE option_name='blogname'`
   - Сравнить с ожидаемым (из брифа/HTML-прототипа)
   - Если расхождение → записать `blogname_expected: "СтройМакс"` (UPDATE через UNHEX для кириллицы, D-147)

3. **Товары и характеристики:** 
   ```sql
   SELECT COUNT(*) FROM {{prefix}}posts WHERE post_type='product' AND post_status='publish';
   SELECT post_name, SUBSTRING(post_excerpt,1,200) FROM {{prefix}}posts WHERE post_type='product' LIMIT 5;
   SELECT meta_value FROM {{prefix}}postmeta WHERE meta_key='_product_attributes' LIMIT 3;
   ```
   - Записать: `products_count, excerpt_sample (какие характеристики ЕСТЬ в БД), wc_attributes`
   - КЛЮЧ: post_excerpt = источник характеристик (Размер/Толщина/Кол-во/Цвета-цены), НЕ _product_attributes

4. **Активные плагины:** `SELECT option_value FROM {{prefix}}options WHERE option_name='active_plugins'`
   - Какие включить (WC обязательно), какие отключить (тяжёлые: geodir/cleantalk/elementor/revslider виснут GET >60сек, D-145)
   - Записать: `plugins_enable: [woocommerce], plugins_disable: [...]`

5. **Slug'и pages vs nav href:**
   ```sql
   SELECT post_name, post_title FROM {{prefix}}posts WHERE post_type='page' AND post_status='publish';
   ```
   - Сравнить с nav href в HTML-прототипе (`/about` vs `company-about` → mismatch, D-144)
   - Записать: `slug_renames: [{from: "company-about", to: "about"}, ...]`

6. **File audit (на диске темы, НЕ БД):**
   - `find . -name tailwind.config.js` → должен быть ОДИН (дубль = build v6, D-141)
   - `ls plugins/woocommerce/woocommerce.php` → должен существовать (неполная папка = fatal, D-143)
   - `ls wp-content/languages/` → если пусто, WC будет на английском (D-148 → functions.php фильтры)

### Output: update-inventory.json

```json
{
  "table_prefix": "wps_",
  "blogname_expected": "СтройМакс",
  "blogname_current": "Производитель тротуарной плитки...",
  "products_count": 22,
  "excerpt_has_specs": true,
  "excerpt_format": "text + HTML table",
  "wc_attributes": "Цвет (is_taxonomy=0)",
  "plugins_enable": ["woocommerce"],
  "plugins_disable": ["geodir", "cleantalk", "elementor", "revslider", "seopress", "yml", "redux", "cf7"],
  "slug_renames": [{"from":"company-about","to":"about"},{"from":"contact-us","to":"contacts"},{"from":"dostavka","to":"delivery"}],
  "missing_pages": [{"slug":"calculator","title":"Рассчитать стоимость"}],
  "tailwind_config_duplicates": false,
  "woocommerce_complete": true,
  "languages_absent": true,
  "trust_indicators": ["Бесплатный расчёт", "Доставка по всей России"],
  "gost_numbers_invented": true,
  "gost_action": "delete"
}
```

### Делегирование

```
subagent(
  agent="data-analyst",
  task="Pre-flight БД-аудит для WP-портации. Docker контейнер БД: {{db_container}}. БД: {{db_name}}, user: {{db_user}}, pass: {{db_pass}}.
  Выполни 6 проверок (см. wp-integration SKILL.md Этап 1.5): table_prefix, blogname, products+excerpt, active_plugins, page slugs, file audit.
  Output: D:/pi/projects/{{project}}/update-inventory.json с КОНКРЕТНЫМИ значениями.
  Используй docker exec {{db_container}} mysql ... для запросов. Для кириллицы --default-character-set=utf8mb4."
)
```

### Проверка архитектором

```bash
cat {{output_dir}}/update-inventory.json | python3 -m json.tool > /dev/null && echo "JSON valid"
# Передать update-inventory.json в ТЗ wp-coder как ЖЁСТКИЕ значения
```

**Без Этапа 1.5:** wp-coder импровизирует (blogname из дампа ≠ ожидаемому, характеристики не выводит, ГОСТ выдумывает, table_prefix wps_ → сайт не видит БД).

---

## 🗺️ Этап 1.6: HTML→WP Content Mapping (обязательно перед кодингом)

**Суть:** для КАЖДОГО блока HTML-прототипа определить источник в WP. Это исключает импровизацию wp-coder (D-153: trust indicators «по описанию» ≠ verbatim; D-155: характеристики не выводились потому что post_excerpt не был в map).

### Таблица Mapping (заполняет архитектор на основе Этапа 1 + 1.5)

| HTML блок (из прототипа) | Источник в WP | Метод | verbatim? |
|--------------------------|---------------|-------|-----------|
| Название компании (header logo) | wp_options.blogname | `bloginfo('name')` | нет (динамика) |
| Hero trust indicators | home-v8.html (список) | хардкод в PHP — КОПИРОВАТЬ 1:1 | **ДА verbatim** |
| Hero title/subtitle/eyebrow | Customizer | `get_theme_mod(..., default=из прототипа)` | default=verbatim |
| Контакты (phone/email/address) | Customizer | `get_theme_mod(..., default=реальные)` | default=реальные |
| Характеристики товара (Размер/Толщина/Кол-во/Цвета) | post_excerpt | парсер → таблица | нет (парсинг) |
| Цвета/вариации товара | _product_attributes | WC API | нет (динамика) |
| ГОСТ/спецификации | client data JSON | ВСТАВЛЯТЬ ТОЛЬКО если есть источник | если нет → УБРАТЬ |
| Описание товара (маркетинг) | post_content | `the_content()` | нет (динамика) |
| Категории товаров | wp_terms + wc_get_product_category_list | WC API | нет (динамика) |
| Юридические ссылки | ТОЛЬКО если есть юрист | УБРАТЬ если нет | — |
| Изображения | wp-content/uploads/ | `wp_get_attachment_image()` | нет (динамика) |

### Делегирование

Архитектор заполняет таблицу Mapping (на основе wp-inventory.json из Этапа 1 + update-inventory.json из Этапа 1.5) и передаёт wp-coder в ТЗ на Этап 2. wp-coder ОБЯЗАН следовать карте — НЕ импровизировать.

---

## 🏗️ Этап 2: Каркас WP-темы

### Что создаётся

Минимальный набор файлов, без которого тема не активируется:

```
{{wp_path}}/wp-content/themes/{{theme_name}}/
├── style.css              ← Theme metadata (ОБЯЗАТЕЛЬНО для WP)
├── functions.php          ← Enqueue scripts, register menus, theme supports
├── index.php              ← Fallback template (ОБЯЗАТЕЛЬНО)
├── header.php             ← <head> + nav (из nav.html)
├── footer.php             ← footer (из footer.html)
├── screenshot.png         ← 1200×900 preview для админки
└── assets/                ← копия из прототипа
    ├── css/
    ├── js/
    └── images/
```

### style.css — обязательные метаданные

```php
/*
Theme Name: {{theme_title}}
Theme URI: https://{{server_host}}/
Author: Pi Make UI 2.0
Author URI: https://github.com
Description: {{description}}
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: {{theme_name}}
*/
```

### functions.php — минимальный шаблон

```php
<?php
/**
 * {{theme_title}} functions and definitions.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Theme setup
function {{theme_name}}_setup() {
    // Add theme supports
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ] );
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    // Register menus
    register_nav_menus( [
        'primary' => __( 'Primary Menu', '{{theme_name}}' ),
        'footer'  => __( 'Footer Menu', '{{theme_name}}' ),
    ] );
}
add_action( 'after_setup_theme', '{{theme_name}}_setup' );

// Enqueue styles & scripts
function {{theme_name}}_scripts() {
    // Tailwind CSS (см. Этап 5)
    wp_enqueue_style(
        '{{theme_name}}-tailwind',
        get_template_directory_uri() . '/assets/css/tailwind.css',
        [],
        wp_get_theme()->get( 'Version' )
    );

    // Google Fonts
    wp_enqueue_style(
        '{{theme_name}}-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        [],
        null
    );

    // Main JS
    wp_enqueue_script(
        '{{theme_name}}-main',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        wp_get_theme()->get( 'Version' ),
        true // in footer
    );
}
add_action( 'wp_enqueue_scripts', '{{theme_name}}_scripts' );

// WooCommerce: remove default styles (we use Tailwind)
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );
```

### header.php — минимальный шаблон

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'font-sans antialiased' ); ?>>
<?php wp_body_open(); ?>

<!-- Nav из nav.html → вставить сюда -->
<header class="sticky top-0 z-50 h-16 backdrop-blur-md border-b bg-white/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <?php if ( has_custom_logo() ) : ?>
            <?php the_custom_logo(); ?>
        <?php else : ?>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="text-xl font-bold tracking-tight">
                <?php bloginfo( 'name' ); ?>
            </a>
        <?php endif; ?>

        <?php
        wp_nav_menu( [
            'theme_location' => 'primary',
            'container'      => 'nav',
            'container_class' => 'hidden lg:flex items-center gap-8',
            'menu_class'     => 'flex gap-6 text-sm font-medium',
            'fallback_cb'    => false,
        ] );
        ?>

        <!-- Mobile hamburger (из JS прототипа) -->
        <button class="lg:hidden p-2" aria-label="Меню" id="mobile-menu-toggle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.5" stroke-linecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
        </button>
    </div>
</header>
```

### footer.php — минимальный шаблон

```php
<!-- Footer из footer.html → вставить сюда -->
<footer class="bg-slate-900 text-slate-300 py-16">
    <!-- ... контент ... -->
</footer>

<?php wp_footer(); ?>
</body>
</html>
```

### index.php — обязательный fallback

```php
<?php get_header(); ?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            the_title( '<h1 class="text-3xl font-bold tracking-tight">', '</h1>' );
            the_content();
        endwhile;
    endif;
    ?>
</main>

<?php get_footer(); ?>
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Создай каркас WP-темы {{theme_name}} в {{wp_path}}/wp-content/themes/{{theme_name}}/.
  Создай: style.css, functions.php, index.php, header.php, footer.php, screenshot.png.
  Прочитай nav.html и footer.html из прототипа ({{output_dir}}) — используй их Tailwind классы в header.php и footer.php.
  Замени хардкод-логотип на the_custom_logo(), хардкод-меню на wp_nav_menu().
  Добавь wp_head() и wp_footer().
  Стек: theme_name={{theme_name}}, theme_title={{theme_title}}, is_woocommerce={{is_woocommerce}}."
)
```

---

## 🔄 Этап 3: Static → Dynamic — Карта HTML-хардкода → WP-тегов

### Суть этапа

Каждый кусок хардкод-текста в HTML прототипе должен быть заменён на WP-функцию.
Создаётся файл-карта `{{output_dir}}/wp-dynamic-map.md`.

### Карта замен (справочная таблица для wp-coder)

| HTML-хардкод | WP-замена | Пример |
|---|---|---|
| `<h1>Название компании</h1>` | `the_title()` / `bloginfo('name')` | `<h1><?php the_title(); ?></h1>` |
| `<p>Длинный текст</p>` | `the_content()` | `<div><?php the_content(); ?></div>` |
| `<p>Краткий анонс</p>` | `the_excerpt()` | `<p><?php the_excerpt(); ?></p>` |
| `<img src="...">` | `the_post_thumbnail('large')` | `<?php the_post_thumbnail( 'large', ['class' => 'rounded-2xl'] ); ?>` |
| `<a href="/about">О нас</a>` | `wp_nav_menu()` или `get_permalink()` | `<a href="<?php echo get_permalink(42); ?>">` |
| `2024 © Компания` | `date('Y')` + `bloginfo('name')` | `<?php echo date('Y'); ?> © <?php bloginfo('name'); ?>` |
| `<title>Заголовок</title>` | `wp_head()` → авто из Yoast/SEO | Уже в header.php |
| Хардкод-список товаров | `WC_Product_Query` + цикл | См. Этап 6 |
| Хардкод-категории | `wc_get_product_category_list()` | См. Этап 6 |
| Хардкод-цена | `wc_price()` | См. Этап 6 |
| Форма заявки | CF7 shortcode | См. Этап 7 |

### Типы динамических данных

#### 1. Контент страницы (page content)
```php
<?php while ( have_posts() ) : the_post(); ?>
    <h1 class="text-4xl font-bold tracking-tight"><?php the_title(); ?></h1>
    <div class="prose max-w-none"><?php the_content(); ?></div>
<?php endwhile; ?>
```

#### 2. Настройки из Customizer (site identity)
```php
<?php bloginfo( 'name' ); ?>               // Название сайта
<?php bloginfo( 'description' ); ?>         // Описание
<?php the_custom_logo(); ?>                 // Логотип
<?php echo get_theme_mod( 'hero_title' ); ?> // Customizer field
```

#### 3. ACF поля (если используется ACF)
```php
<?php $hero_title = get_field( 'hero_title' ); ?>
<?php if ( $hero_title ) : ?>
    <h1><?php echo esc_html( $hero_title ); ?></h1>
<?php endif; ?>
```

#### 4. Меню
```php
<?php
wp_nav_menu( [
    'theme_location' => 'primary',
    'container'      => false,
    'menu_class'     => 'flex gap-6 text-sm font-medium',
] );
?>
```

#### 5. Виджеты / Sidebar
```php
<?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>
    <aside><?php dynamic_sidebar( 'sidebar-1' ); ?></aside>
<?php endif; ?>
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Проанализируй HTML-файлы в {{output_dir}}. Для каждого файла создай карту замен:
  хардкод-текст → WP-функция. Учитывай:
  - page content → the_title()/the_content()
  - site identity → bloginfo()/the_custom_logo()
  - menus → wp_nav_menu()
  - products → woocommerce functions (см. Этап 6)
  - forms → CF7 (см. Этап 7)
  Сохрани карту в {{output_dir}}/wp-dynamic-map.md.
  Не пиши PHP код пока — только составь карту."
)
```

---

## 🧱 Этап 4: Components → Template Parts

### Суть этапа

HTML-компоненты из `shared/components/*.html` превращаются в PHP template-parts,
которые вставляются через `get_template_part()`.

### Карта: HTML-компонент → PHP template-part

| HTML-компонент | PHP template-part | Slug для get_template_part() |
|---|---|---|
| `shared/components/nav.html` | `header.php` (глобальный) | N/A — в header.php |
| `shared/components/footer.html` | `footer.php` (глобальный) | N/A — в footer.php |
| `shared/components/card.html` | `template-parts/card.php` | `'card'` |
| `shared/components/hero.html` | `template-parts/hero.php` | `'hero'` |
| `shared/components/lead-form.html` | `template-parts/lead-form.php` | `'lead-form'` |
| `shared/components/testimonial.html` | `template-parts/testimonial.php` | `'testimonial'` |
| `shared/components/pricing-card.html` | `template-parts/pricing-card.php` | `'pricing-card'` |
| `shared/components/cta.html` | `template-parts/cta.php` | `'cta'` |
| `shared/components/faq-item.html` | `template-parts/faq-item.php` | `'faq-item'` |
| `shared/components/breadcrumbs.html` | `template-parts/breadcrumbs.php` | `'breadcrumbs'` |
| `shared/components/pagination.html` | `template-parts/pagination.php` | `'pagination'` |
| `shared/components/features.html` | `template-parts/features.php` | `'features'` |

### Как работает get_template_part()

```php
<!-- Вместо копирования card.html 14 раз: -->
<?php get_template_part( 'template-parts/card' ); ?>

<!-- С параметрами: -->
<?php
get_template_part( 'template-parts/card', null, [
    'title'       => get_the_title(),
    'price'       => $product->get_price_html(),
    'image'       => get_the_post_thumbnail_url( null, 'medium' ),
    'link'        => get_the_permalink(),
    'categories'  => wc_get_product_category_list( get_the_ID() ),
] );
?>
```

### Пример template-parts/card.php

```php
<?php
/**
 * Template part: Product Card (Tailwind).
 *
 * @param array $args { title, price, image, link, categories }
 */
$args = wp_parse_args( $args, [
    'title'       => '',
    'price'       => '',
    'image'       => '',
    'link'        => '#',
    'categories'  => '',
] );
?>

<article class="group bg-white rounded-2xl border border-slate-200 overflow-hidden
                hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
    <a href="<?php echo esc_url( $args['link'] ); ?>" class="block">
        <?php if ( $args['image'] ) : ?>
            <div class="aspect-[4/3] overflow-hidden bg-slate-100">
                <img src="<?php echo esc_url( $args['image'] ); ?>"
                     alt="<?php echo esc_attr( $args['title'] ); ?>"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     loading="lazy">
            </div>
        <?php endif; ?>

        <div class="p-5">
            <?php if ( $args['categories'] ) : ?>
                <div class="text-xs text-slate-500 mb-1">
                    <?php echo wp_kses_post( $args['categories'] ); ?>
                </div>
            <?php endif; ?>

            <h3 class="font-semibold text-slate-900 mb-2 line-clamp-2">
                <?php echo esc_html( $args['title'] ); ?>
            </h3>

            <?php if ( $args['price'] ) : ?>
                <div class="text-lg font-bold text-indigo-600">
                    <?php echo wp_kses_post( $args['price'] ); ?>
                </div>
            <?php endif; ?>
        </div>
    </a>
</article>
```

### Использование template-part в странице

```php
<!-- front-page.php: -->
<?php
$products = wc_get_products( [ 'limit' => 8, 'orderby' => 'date' ] );
foreach ( $products as $product ) :
    get_template_part( 'template-parts/card', null, [
        'title'      => $product->get_name(),
        'price'      => $product->get_price_html(),
        'image'      => wp_get_attachment_image_url( $product->get_image_id(), 'medium' ),
        'link'       => get_permalink( $product->get_id() ),
        'categories' => wc_get_product_category_list( $product->get_id() ),
    ] );
endforeach;
?>
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Конвертируй каждый HTML-компонент из {{output_dir}}/shared/components/*.html
  в PHP template-part в {{wp_path}}/wp-content/themes/{{theme_name}}/template-parts/.
  Правила:
  - Используй get_template_part() с параметрами $args
  - Tailwind-классы сохрани как есть (не inline styles!)
  - ВСЕ тексты из БД — не хардкодь
  - esc_html(), esc_url(), esc_attr() для вывода
  - Прочитай wp-inventory.json для списка компонентов
  - Обнови wp-inventory.json: добавь поле 'template_part_status': 'done'"
)
```

---

## 🎨 Этап 5: Tailwind в WordPress

### Три варианта — когда какой

| Вариант | Когда использовать | Плюсы | Минусы |
|---|---|---|---|
| **A: CDN** `<script src="https://cdn.tailwindcss.com">` | Разработка, staging, прототип | Мгновенно, без билда | ~300KB JS, нет purging, медленно в prod |
| **B: Tailwind CLI build** `npx tailwindcss -i ... -o ... --minify` | Production | ~10KB CSS, быстро | Нужен Node.js, билд-шаг |
| **C: Play CDN** `<script src="https://cdn.tailwindcss.com?plugins=forms,typography">` | Быстрый прототип, демо | Плагины из коробки | Как A, но с плюшками |

**Правило:**
- Новый прототип, разработка → **A (CDN)** — быстро, править легко
- Готов к деплою на production → **B (CLI build)** — обязательно
- Временное демо клиенту → **A** или **C**
- **ЗАПРЕЩЕНО:** CDN на production (D-005)

### Вариант A: Tailwind CDN (development)

В `functions.php`:
```php
function {{theme_name}}_tailwind_cdn() {
    if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
        wp_enqueue_script(
            'tailwind-cdn',
            'https://cdn.tailwindcss.com',
            [],
            null,
            false // in <head>
        );
        // Tailwind config inline
        wp_add_inline_script( 'tailwind-cdn', '
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: {
                            sans: ["Inter", "sans-serif"],
                        },
                        colors: {
                            primary: "#0d9488",
                            accent: "#6366f1",
                        }
                    }
                }
            }
        ' );
    }
}
add_action( 'wp_enqueue_scripts', '{{theme_name}}_tailwind_cdn' );
```

### Вариант B: Tailwind CLI build (production)

**Шаг 1: Структура в теме**
```
{{theme_name}}/
├── tailwind/
│   ├── input.css        ← @tailwind directives
│   └── tailwind.config.js ← конфиг
├── assets/
│   └── css/tailwind.css ← build output (сюда!)
```

**Шаг 2: `tailwind/input.css`**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    body {
        @apply font-sans antialiased text-slate-900 bg-white;
    }
}
```

**Шаг 3: `tailwind/tailwind.config.js`**
```js
module.exports = {
    content: [
        './*.php',
        './template-parts/**/*.php',
        './woocommerce/**/*.php',
        './assets/js/**/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: '#0d9488',
                accent: '#6366f1',
            },
        },
    },
    plugins: [],
}
```

**Шаг 4: Билд-команда**
```bash
cd {{wp_path}}/wp-content/themes/{{theme_name}}
npx tailwindcss -i ./tailwind/input.css -o ./assets/css/tailwind.css --minify
```

**Шаг 5: Enqueue в functions.php**
```php
// Убрать CDN, оставить только:
wp_enqueue_style(
    '{{theme_name}}-tailwind',
    get_template_directory_uri() . '/assets/css/tailwind.css',
    [],
    wp_get_theme()->get( 'Version' )
);
```

**Шаг 6: Автоматизация (package.json)**
```json
{
    "scripts": {
        "build": "tailwindcss -i ./tailwind/input.css -o ./assets/css/tailwind.css --minify",
        "watch": "tailwindcss -i ./tailwind/input.css -o ./assets/css/tailwind.css --watch"
    },
    "devDependencies": {
        "tailwindcss": "^3.4.0"
    }
}
```

### Вариант C: Play CDN (прототип)

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Настрой Tailwind в WP-теме {{theme_name}}. Используй вариант B (CLI build).
  (1) Создай tailwind/input.css и tailwind/tailwind.config.js (content указывает на *.php).
  (2) Запусти билд: npx tailwindcss -i ... -o assets/css/tailwind.css --minify.
  (3) В functions.php enqueue assets/css/tailwind.css (НЕ CDN).
  (4) Создай package.json со скриптами build/watch.
  (5) Если билд не удался (нет Node.js) → fallback: вариант A (CDN с WP_DEBUG проверкой).
  Стек: theme_name={{theme_name}}, wp_path={{wp_path}}."
)
```

---

## 🛒 Этап 6: WooCommerce Override

### ⚠️ КРИТИЧЕСКОЕ ПРАВИЛО

**НИКОГДА не редактируй файлы в `wp-content/plugins/woocommerce/`.**
Только override через тему: `{{theme_name}}/woocommerce/`.

### Структура override

```
{{theme_name}}/
└── woocommerce/
    ├── single-product.php          ← из product.html
    ├── archive-product.php         ← из catalog.html
    ├── content-product.php         ← карточка товара в петле
    ├── single-product/
    │   ├── title.php               ← H1 (the_title)
    │   ├── price.php               ← цена
    │   ├── add-to-cart/
    │   │   └── variable.php        ← selector вариаций
    │   ├── product-image.php       ← галерея
    │   ├── product-attributes.php  ← характеристики
    │   └── tabs/
    │       ├── description.php     ← описание
    │       └── additional-information.php ← доп. инфо
    ├── loop/
    │   ├── price.php               ← цена в сетке
    │   ├── sale-flash.php          ← плашка скидки
    │   └── add-to-cart.php         ← кнопка в сетке
    └── global/
        ├── breadcrumb.php
        └── sidebar.php
```

### Как работают WC шаблоны (priority chain)

WooCommerce ищет шаблоны в порядке:
1. `{{theme}}/woocommerce/single-product.php` ← **НАШ override**
2. `{{theme}}/single-product.php` ← fallback
3. `woocommerce/templates/single-product.php` ← plugin default

### Карта: product.html → single-product.php

| HTML-элемент в product.html | WC-функция | Как стилизовать |
|---|---|---|
| Галерея фоток (thumbnails слева, large фото справа) | `woocommerce_show_product_images()` = `wc_get_gallery_image_html()` | Tailwind grid + WC хуки `woocommerce_single_product_image_thumbnail_html` |
| H1 название товара | `woocommerce_template_single_title()` | Фильтр: `woocommerce_single_product_summary` priority 5 |
| Цена (обычная + скидочная) | `woocommerce_template_single_price()` | `<p class="price">` → Tailwind: `text-2xl font-bold` |
| Вариации (цвет, размер → цена меняется) | `woocommerce_template_single_add_to_cart()` → `variable.php` | Select → Tailwind styled dropdown |
| Табы: Описание / Характеристики | `woocommerce_output_product_data_tabs()` | Tailwind tabs (кнопки + panels) |
| Похожие товары | `woocommerce_related_products()` | Grid карточек (template-parts/card.php) |

### Пример single-product.php (обёртка с Tailwind)

```php
<?php
/**
 * WooCommerce Single Product override — StroyMaks theme.
 */
get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Галерея -->
            <div class="product-gallery">
                <?php
                /**
                 * Hook: woocommerce_before_single_product_summary.
                 * woocommerce_show_product_images — 20
                 */
                do_action( 'woocommerce_before_single_product_summary' );
                ?>
            </div>

            <!-- Описание + цена + корзина -->
            <div class="product-summary space-y-6">
                <?php
                /**
                 * Hook: woocommerce_single_product_summary.
                 * woocommerce_template_single_title — 5
                 * woocommerce_template_single_price — 10
                 * woocommerce_template_single_excerpt — 20
                 * woocommerce_template_single_add_to_cart — 30
                 * woocommerce_template_single_meta — 40
                 */
                do_action( 'woocommerce_single_product_summary' );
                ?>
            </div>
        </div>

        <!-- Табы + Похожие -->
        <div class="mt-16 space-y-16">
            <?php woocommerce_output_product_data_tabs(); ?>
            <?php woocommerce_related_products( [ 'posts_per_page' => 4, 'columns' => 4 ] ); ?>
        </div>
    </main>
<?php endwhile; ?>

<?php get_footer(); ?>
```

### Стилизация WC-элементов через Tailwind (CSS-классы)

WC генерирует свои классы (`.woocommerce`, `.products`, `.button`).
Их НУЖНО стилизовать — через Tailwind `@apply` в `tailwind/input.css`:

```css
/* tailwind/input.css */
@layer components {
    /* Кнопка "В корзину" */
    .single_add_to_cart_button {
        @apply w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md
               hover:bg-indigo-700 transition-colors duration-200
               disabled:opacity-50 disabled:cursor-not-allowed;
    }

    /* Селектор вариаций */
    .variations select {
        @apply w-full mt-1 px-4 py-3 border border-slate-300 rounded-md text-sm
               bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
    }

    /* Галерея: thumbnails */
    .flex-control-thumbs li img {
        @apply rounded-lg border-2 border-transparent hover:border-indigo-300
               cursor-pointer transition-all;
    }

    .flex-control-thumbs li img.flex-active {
        @apply border-indigo-600;
    }

    /* Табы */
    .woocommerce-tabs ul.tabs {
        @apply flex gap-1 border-b border-slate-200 mb-8;
    }

    .woocommerce-tabs ul.tabs li a {
        @apply block px-6 py-3 text-sm font-medium text-slate-500
               border-b-2 border-transparent hover:text-slate-900;
    }

    .woocommerce-tabs ul.tabs li.active a {
        @apply text-indigo-600 border-indigo-600;
    }

    /* Цена */
    .price del {
        @apply text-slate-400 font-normal;
    }

    .price ins {
        @apply no-underline text-red-600 font-bold;
    }

    /* Grid товаров */
    ul.products {
        @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
               list-none p-0 m-0;
    }

    ul.products li.product {
        @apply bg-white rounded-2xl border border-slate-200 overflow-hidden
               hover:-translate-y-0.5 hover:shadow-md transition-all duration-300;
    }

    /* Breadcrumbs */
    .woocommerce-breadcrumb {
        @apply flex items-center gap-2 text-sm text-slate-500 mb-8;
    }
}
```

### Полный список WC-функций (справочник для wp-coder)

#### Товар (Single Product)
```php
woocommerce_template_single_title()           // H1 название
woocommerce_template_single_price()           // цена
woocommerce_template_single_excerpt()         // short_description
woocommerce_template_single_add_to_cart()     // кнопка + вариации
woocommerce_template_single_meta()            // SKU, категории, теги
woocommerce_output_product_data_tabs()        // табы
woocommerce_related_products( $args )         // похожие товары
woocommerce_show_product_images()             // галерея
woocommerce_show_product_thumbnails()         // thumbnails
woocommerce_template_single_sharing()         // social share
```

#### Каталог (Archive / Shop)
```php
woocommerce_product_loop_start()              // <ul class="products">
woocommerce_product_loop_end()                // </ul>
woocommerce_template_loop_product_title()     // название в сетке
woocommerce_template_loop_price()             // цена в сетке
woocommerce_template_loop_add_to_cart()       // кнопка в сетке
woocommerce_result_count()                    // "Показано 1–12 из 45"
woocommerce_catalog_ordering()                // сортировка
woocommerce_pagination()                      // пагинация
woocommerce_breadcrumb()                      // хлебные крошки
wc_get_product_category_list( $product_id )   // категории товара
```

#### Корзина / Чек-аут (если нужно)
```php
woocommerce_cart_totals()                     // итоги корзины
woocommerce_checkout_form()                   // форма заказа
```

#### Хуки для изменения структуры
```php
// Убрать sidebar:
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

// Поменять кол-во товаров на странице:
add_filter( 'loop_shop_per_page', fn() => 12 );

// Поменять кол-во related:
add_filter( 'woocommerce_related_products_args', function( $args ) {
    $args['posts_per_page'] = 4;
    $args['columns'] = 4;
    return $args;
} );
```

### Вариативные товары (variable.php)

Вариации — самый сложный момент. WC подгружает JSON с `variations_data` через `wp_localize_script()`.

```php
<!-- variable.php override — минимальный -->
<form class="variations_form cart space-y-4"
      action="<?php echo esc_url( apply_filters( 'woocommerce_add_to_cart_form_action',
      $product->get_permalink() ) ); ?>"
      method="post"
      enctype="multipart/form-data"
      data-product_id="<?php echo absint( $product->get_id() ); ?>"
      data-product_variations="<?php echo htmlspecialchars(
      wp_json_encode( $available_variations ) ); ?>">

    <?php foreach ( $attributes as $attribute_name => $options ) : ?>
        <div class="variation-row">
            <label for="<?php echo esc_attr( sanitize_title( $attribute_name ) ); ?>"
                   class="block text-sm font-medium text-slate-700 mb-1">
                <?php echo wc_attribute_label( $attribute_name ); ?>
            </label>
            <?php
            wc_dropdown_variation_attribute_options( [
                'options'   => $options,
                'attribute' => $attribute_name,
                'product'   => $product,
                'class'     => 'w-full mt-1 px-4 py-3 border border-slate-300 rounded-md text-sm',
            ] );
            ?>
        </div>
    <?php endforeach; ?>

    <?php do_action( 'woocommerce_before_add_to_cart_button' ); ?>

    <button type="submit"
            class="single_add_to_cart_button w-full bg-indigo-600 text-white font-semibold
                   py-3 px-8 rounded-md hover:bg-indigo-700 transition-colors">
        <?php echo esc_html( $product->single_add_to_cart_text() ); ?>
    </button>

    <?php do_action( 'woocommerce_after_add_to_cart_button' ); ?>
</form>
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Создай WooCommerce override в {{wp_path}}/wp-content/themes/{{theme_name}}/woocommerce/.
  (1) single-product.php — из product.html, оберни в get_header/get_footer.
  (2) archive-product.php — из catalog.html, WC product loop.
  (3) content-product.php — карточка, используй get_template_part('template-parts/card').
  (4) В tailwind/input.css добавь @layer components для WC-классов (.button, .products, .tabs).
  (5) Используй ТОЛЬКО WC-функции, НЕ прямые SQL.
  (6) Если проект учебный → используй WC REST API (wc/v3) вместо override.
  Прочитай wp-inventory.json и wp-dynamic-map.md для контекста.
  Стек: theme_name={{theme_name}}, wp_path={{wp_path}}, is_woocommerce=true."
)
```

---

## 📬 Этап 7: Формы — Contact Form 7 / Custom REST

### Два подхода — когда какой

| Подход | Когда использовать | Плюсы | Минусы |
|---|---|---|---|
| **CF7 shortcode** | Простая форма (имя/телефон/email), админ хочет менять поля через админку | Готово из коробки, письма на почту, spam защита | HTML-разметка CF7 (не Tailwind-friendly) |
| **Custom REST + admin-ajax** | Сложная логика, нужен кастомный UI, интеграция с CRM | Полный контроль HTML, можно Tailwind | Писать JS + PHP обработчик |
| **WPForms / Fluent Forms** | Если заказчик хочет drag-drop builder | Удобно для не-технарей | Платный, лишний плагин |

### Вариант A: CF7 Shortcode (рекомендуемый для 90% кейсов)

**Шаг 1: Создать форму в админке WP**
```
Contact → Add New:
- Имя [text* your-name]
- Телефон [tel* your-phone]
- Email [email your-email]
- Сообщение [textarea your-message]
- [submit "Отправить"]
```

**Шаг 2: Вставить shortcode в PHP**
```php
<!-- Было в HTML: <form class="..."> -->
<!-- Стало: -->
<?php echo do_shortcode( '[contact-form-7 id="42" title="Форма заявки"]' ); ?>
```

**Шаг 3: Tailwind-стилизация CF7 (в tailwind/input.css)**
```css
@layer components {
    /* CF7 — все поля */
    .wpcf7-form input[type="text"],
    .wpcf7-form input[type="tel"],
    .wpcf7-form input[type="email"],
    .wpcf7-form textarea {
        @apply w-full mt-1 px-4 py-3 border border-slate-300 rounded-md text-sm
               bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition-shadow;
    }

    .wpcf7-form label {
        @apply block text-sm font-medium text-slate-700 mb-1;
    }

    .wpcf7-form .wpcf7-submit {
        @apply bg-indigo-600 text-white font-semibold py-3 px-8 rounded-md
               hover:bg-indigo-700 transition-colors cursor-pointer;
    }

    .wpcf7-form .wpcf7-not-valid-tip {
        @apply text-red-600 text-sm mt-1;
    }

    .wpcf7-form .wpcf7-response-output {
        @apply mt-4 p-4 rounded-md text-sm border;
    }

    .wpcf7-form.sent .wpcf7-response-output {
        @apply bg-green-50 border-green-300 text-green-800;
    }
}
```

### Вариант B: Custom REST Endpoint (для сложных кейсов)

**Шаг 1: PHP обработчик в functions.php**
```php
// REST endpoint
add_action( 'rest_api_init', function () {
    register_rest_route( '{{theme_name}}/v1', '/submit-lead', [
        'methods'             => 'POST',
        'callback'            => '{{theme_name}}_handle_lead',
        'permission_callback' => '__return_true',
    ] );
} );

function {{theme_name}}_handle_lead( WP_REST_Request $request ) {
    $name  = sanitize_text_field( $request->get_param( 'name' ) );
    $phone = sanitize_text_field( $request->get_param( 'phone' ) );

    // Nonce check
    $nonce = $request->get_param( '_wpnonce' );
    if ( ! wp_verify_nonce( $nonce, 'submit_lead' ) ) {
        return new WP_Error( 'invalid_nonce', 'Ошибка безопасности', [ 'status' => 403 ] );
    }

    // Отправить email
    $to      = get_option( 'admin_email' );
    $subject = 'Новая заявка с сайта';
    $message = "Имя: $name\nТелефон: $phone";
    wp_mail( $to, $subject, $message );

    // Сохранить в БД (если нужно)
    // wp_insert_post([ 'post_type' => 'lead', ... ]);

    return rest_ensure_response( [ 'success' => true, 'message' => 'Заявка отправлена!' ] );
}
```

**Шаг 2: JS фронт (в assets/js/main.js)**
```js
document.querySelector('#lead-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('_wpnonce', wpApiSettings.nonce);

    const res = await fetch('/wp-json/{{theme_name}}/v1/submit-lead', {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    alert(data.message);
});
```

**Шаг 3: Передать nonce в шаблон (functions.php)**
```php
wp_localize_script( '{{theme_name}}-main', 'wpApiSettings', [
    'nonce' => wp_create_nonce( 'submit_lead' ),
    'root'  => esc_url_raw( rest_url() ),
] );
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Интегрируй формы из HTML-прототипа в WP-тему {{theme_name}}.
  Используй CF7 (вариант A) для каждой формы.
  (1) Создай CF7-формы в админке (или опиши shortcode'ы для ручного создания).
  (2) В PHP-шаблонах замени HTML <form> на do_shortcode('[contact-form-7 ...]').
  (3) В tailwind/input.css добавь @layer components для .wpcf7-form полей.
  (4) Если форма сложная (AJAX + CRM) → вариант B (custom REST).
  Прочитай wp-inventory.json.forms_found для списка форм.
  Стек: theme_name={{theme_name}}."
)
```

---

## 🚀 Этап 8: Деплой

### Три варианта деплоя

| Вариант | Когда | Команда |
|---|---|---|
| **A: Локальный Docker** | Разработка, тестирование | Копирование темы в volume |
| **B: rsync на сервер** | Production, staging | `rsync -avz --delete` |
| **C: Git-based** | CI/CD, несколько разработчиков | `git push → webhook → pull` |

### Вариант A: Локальный Docker

```bash
# 1. Копируем тему в wp-content
cp -r {{wp_path}}/wp-content/themes/{{theme_name}} \
     {{wp_path}}/wp-content/themes/{{theme_name}}

# 2. Перезапускаем WP
cd {{wp_path}} && docker-compose restart wordpress

# 3. Активируем тему через WP-CLI (если доступен)
docker-compose exec wordpress wp theme activate {{theme_name}}
```

### Вариант B: rsync на сервер

```bash
# 1. Backup старой темы
ssh {{server_host}} "cp -r {{server_path}}/wp-content/themes/{{theme_name}} \
  {{server_path}}/wp-content/themes/{{theme_name}}.backup.$(date +%Y%m%d-%H%M)"

# 2. Заливаем новую тему
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'tailwind/input.css' \
  {{wp_path}}/wp-content/themes/{{theme_name}}/ \
  {{server_host}}:{{server_path}}/wp-content/themes/{{theme_name}}/

# 3. Активируем через WP-CLI на сервере
ssh {{server_host}} "cd {{server_path}} && wp theme activate {{theme_name}}"

# 4. Проверяем
curl -I https://{{server_host}}/
```

### Вариант C: Git-based деплой

```bash
# 1. Инициализируем git в теме
cd {{wp_path}}/wp-content/themes/{{theme_name}}
git init
git add -A
git commit -m "Initial theme commit"

# 2. Пушим на сервер (если настроен git remote)
git remote add production git@{{server_host}}:{{server_path}}/wp-content/themes/{{theme_name}}.git
git push production main

# 3. На сервере: хук post-receive делает checkout
```

### Активация темы в админке

1. **Через админку:** Appearance → Themes → выбрать «{{theme_title}}» → Activate
2. **Через WP-CLI:** `wp theme activate {{theme_name}}`
3. **Через БД (если нет доступа к админке):**
```sql
UPDATE wp_options SET option_value = '{{theme_name}}'
WHERE option_name = 'template'
   OR option_name = 'stylesheet'
   OR option_name = 'current_theme';
```

### Post-deploy проверка

```bash
# Проверить что тема активна
curl -s https://{{server_host}}/ | grep -o 'wp-content/themes/{{theme_name}}'

# Проверить что нет fatal errors
curl -s https://{{server_host}}/ | grep -i 'fatal error'

# Проверить WooCommerce страницы
curl -s https://{{server_host}}/shop/ | grep -o 'products'
curl -s https://{{server_host}}/product/test-product/ | grep -o 'price'

# Проверить Tailwind
curl -s https://{{server_host}}/wp-content/themes/{{theme_name}}/assets/css/tailwind.css | head -c 200
```

### Делегирование

```
subagent(
  agent="wp-coder",
  task="Выполни деплой темы {{theme_name}} на {{deploy_target}}.
  Вариант: {{deploy_target}}.
  (1) Если deploy_target=docker:
      - Копируй тему в {{wp_path}}/wp-content/themes/
      - docker-compose restart wordpress
      - Активируй через WP-CLI или админку
  (2) Если deploy_target=rsync:
      - Сделай backup старой темы на сервере
      - rsync новую тему на {{server_host}}:{{server_path}}
      - Активируй через WP-CLI
  (3) Проверь что сайт открывается без fatal errors.
  Стек: wp_path={{wp_path}}, server_host={{server_host}}, server_path={{server_path}}."
)
```

---

## ✅ Этап 9: Definition of Done (Чек-лист)

### Post-deploy verification (для реальной БД, D-152..D-156)

- [ ] `blogname` = ожидаемому (UPDATE через UNHEX если кириллица ≠)
- [ ] Hero trust indicators = HTML-прототипу 1:1 (grep совпадений)
- [ ] Характеристики товара выводятся из post_excerpt (НЕ пустые на 3+ товарах)
- [ ] ГОСТ/цифры = client data (grep В45/F700/«N лет гарантии» → 0 совпадений ИЛИ есть источник)
- [ ] `php -l` на ВСЕХ изменённых .php файлах — 0 syntax errors (D-156 ОБЯЗАТЕЛЬНО)
- [ ] ru_RU: language pack ИЛИ functions.php фильтры (WC не на английском)
- [ ] `find . -name tailwind.config.js` → ОДИН файл (нет дубля)
- [ ] `ls plugins/woocommerce/woocommerce.php` → существует
- [ ] table_prefix в docker-compose.yml = реальному из БД (wps_ если дамп MariaDB)
- [ ] Тяжёлые плагины отключены (GET страниц <10сек)
- [ ] Slug'и pages = nav href (нет mismatch → 404)
- [ ] WP_DEBUG = false на live

### 🔥 Post-deploy: ФОРМЫ И ПОЧТА (D-190, D-192, D-194 — КРИТИЧНО)

**«Отправлено» на экране ≠ письмо отправлено.** Fallback формы с localStorage ВРАЮТ — выглядят рабочими, ничего не отправляют. Проверять ОБЪЕКТИВНО:

- [ ] **theme_mods_* Customizer перенесены** (serialized array в wps_options, НЕ переносится scp темы!). После деплоя: `php -r 'require("wp-load.php");set_theme_mod("<theme>_cf7_lead_id",<ID>);'` для КАЖДОГО theme_mod (cf7_lead_id, cf7_contacts_id, cf7_calculator_id). Верификация: `get_theme_mod("<key>")` возвращает ID, НЕ empty.
- [ ] **ВСЕ страницы с формами проверены** — НЕ только главная. grep по теме: `grep -rln 'wpcf7\|order-form\|form-section\|form-success\|<form\|localStorage' wp-content/themes/<theme>/`. Для КАЖДОГО файла — определить: это CF7 shortcode ИЛИ мёртвая HTML форма? Мёртвые (без action/PHP-обработчика, с localStorage) → заменить на `do_shortcode('[contact-form-7 id="<ID>"]')`.
- [ ] **CF7 форма РЕАЛЬНО рендерится** на КАЖДОЙ странице — `curl -s https://site/<page>/ | grep -o 'wpcf7-f<ID>'` (должно совпадать). Если 0 совпадений → рендерится fallback (ДЕЦЕПТИВНЫЙ).
- [ ] **Playwright отправка с КАЖДОЙ страницы** — заполнить + submit → `data-status=sent` + API `mail_sent`. НЕ доверять «отправлено» на экране.
- [ ] **maillog = истина** — `tail /var/log/mail.log | grep 'to=<recipient> status=sent'` после Playwright. Реальная строка `250 Ok` = письмо ушло. Нет строки = форма не отправила.
- [ ] **Email поле** — для lead-форм сделать email НЕобязательным (`[email your-email]` не `[email* ...]`) — имя+телефон достаточно, иначе validation_failed блокирует отправку без email.
- [ ] **Recipient** — CF7 _mail recipient (serialized в _mail post_meta, НЕ _form) = правильному ящику. Проверить: `SELECT meta_value FROM wps_postmeta WHERE post_id=<ID> AND meta_key='_mail'`.

**ПРОТОКОЛ диагностики «писем нет» (D-194):** (1) спросить владельца КАКАЯ страница + HTML формы (скриншот); (2) grep ВСЕ формы на ВСЕХ страницах; (3) Playwright с каждой; (4) maillog; (5) НЕ доверять «отправлено».

### Обязательные проверки (все должны быть ✅)

#### Структура
- [ ] Все HTML-страницы прототипа конвертированы в PHP-шаблоны
- [ ] Тема содержит style.css с валидными метаданными (Theme Name, Version, Text Domain)
- [ ] functions.php есть, тема активируется без ошибок
- [ ] header.php и footer.php используются на ВСЕХ страницах (get_header/get_footer)
- [ ] Нет хардкод-контента в PHP (всё из БД или Customizer)

#### Tailwind
- [ ] Tailwind CSS загружается (CDN в dev / build в production)
- [ ] В production НЕ используется CDN (только build)
- [ ] WC-классы стилизованы через @apply в tailwind/input.css
- [ ] Нет inline styles в PHP (только Tailwind классы)

#### WooCommerce
- [ ] single-product.php показывает товар (галерея + цена + вариации + табы)
- [ ] archive-product.php показывает каталог (сетка товаров + пагинация)
- [ ] Вариации работают: selector меняет цену и картинку
- [ ] Галерея работает: thumbnails кликабельны, zoom/slider
- [ ] Похожие товары отображаются
- [ ] Корзина работает (добавление из каталога и со страницы товара)

#### Формы
- [ ] Форма заявки отправляет письмо на email админа
- [ ] Валидация полей работает (required поля)
- [ ] Spam-защита (CF7 встроенная или nonce)

#### Навигация
- [ ] Меню в header.php одинаковое на всех страницах (wp_nav_menu)
- [ ] Mobile hamburger меню работает (JS из прототипа)
- [ ] Footer одинаковый на всех страницах

#### Responsive
- [ ] Мобильная адаптивность сохранена (mobile-first grid)
- [ ] Нет горизонтального скролла на mobile viewport
- [ ] Изображения не вылезают за контейнер (max-w-full)

#### SEO
- [ ] title/meta генерируются через wp_head() + Yoast/SEO Press
- [ ] H1 на каждой странице один
- [ ] Изображения имеют alt-тексты
- [ ] Open Graph мета-теги (через плагин SEO)

#### Безопасность
- [ ] Все выводы экранированы: esc_html(), esc_url(), esc_attr()
- [ ] Формы с nonce (wp_nonce_field или CF7 встроенная)
- [ ] Прямые SQL-запросы заменены на WP_Query / wc_get_products
- [ ] Файлы ядра WP/WC НЕ тронуты (только override через тему)
- [ ] wp-config.php с паролями НЕ в теме

#### Деплой
- [ ] Backup старой темы сделан
- [ ] Тема активирована в админке
- [ ] Staging проверен → Production деплой
- [ ] Сайт открывается без fatal errors
- [ ] WP_DEBUG = false в production

#### Артефакты
- [ ] wp-inventory.json актуален
- [ ] wp-dynamic-map.md актуален
- [ ] project.json обновлён (status добавлен или wp_deployed = true)

---

## 🔀 Альтернативные подходы

### 1. Custom PHP Theme (стандарт, этот skill)
Классический подход — PHP-шаблоны в `wp-content/themes/`.
**Когда:** большинство проектов, полный контроль над HTML.

### 2. Elementor Override
Если заказчик хочет оставить Elementor.
**Когда:** существующий Elementor сайт, клиент привык к визуальному редактору.

```
subagent(
  agent="wp-coder",
  task="Вместо PHP-темы создай кастомные Elementor виджеты.
  (1) Для каждого компонента из shared/components/ → Elementor widget (extends Widget_Base).
  (2) Зарегистрируй через elementor/widgets/register.php.
  (3) Tailwind подключается через functions.php глобально.
  (4) Создай Elementor template для каждой страницы."
)
```

### 3. Bricks Builder Override
Современная альтернатива Elementor (быстрее, чище HTML).
**Когда:** новый проект, клиент хочет визуальный билдер без Elementor.

### 4. Headless WP + REST API
WordPress как админка, фронт на Next.js / Nuxt / Astro.
**Когда:** современный проект, SPA, нужна высокая скорость.

```
subagent(
  agent="wp-coder",
  task="Настрой Headless WP.
  (1) WP остаётся как админка (maksplit.ru/admin).
  (2) HTML-прототип → Next.js приложение.
  (3) Данные через WP REST API (/wp-json/wc/v3/products).
  (4) Tailwind в Next.js проекте."
)
```

### 5. Block Theme (FSE — Full Site Editing)
Новый подход WordPress (с 5.9+).
**Когда:** WP 6.0+, клиент хочет редактировать шапку/подвал через админку.

Структура block theme:
```
{{theme_name}}/
├── theme.json           ← глобальные настройки (аналог design-tokens.json!)
├── templates/
│   ├── index.html       ← FSE templates (HTML с WP-блоками)
│   ├── single.html
│   └── archive.html
└── parts/
    ├── header.html
    └── footer.html
```

**theme.json = дизайн-токены:**
```json
{
    "version": 2,
    "settings": {
        "color": {
            "palette": [
                { "slug": "primary", "color": "#0d9488", "name": "Primary" },
                { "slug": "accent", "color": "#6366f1", "name": "Accent" }
            ]
        },
        "typography": {
            "fontFamilies": [
                { "fontFamily": "Inter, sans-serif", "slug": "primary", "name": "Inter" }
            ]
        }
    }
}
```

---

## 🚫 Антипаттерны (ЗАПРЕЩЕНО!)

| ❌ Нельзя | ✅ Вместо | Почему |
|---|---|---|
| Хардкод текста в PHP (`<h1>Склад дверей</h1>`) | `<?php the_title(); ?>` или `bloginfo('name')` | Контент из БД, редактируется в админке |
| Tailwind CDN в production | Tailwind CLI build (`npx tailwindcss --minify`) | CDN = 300KB JS, медленно, не SEO |
| Прямые SQL-запросы (`$wpdb->get_results(...)`) | `WP_Query`, `wc_get_products()`, `get_posts()` | SQL injection, кэш, совместимость |
| Редактирование `woocommerce/templates/` | Override через `{{theme}}/woocommerce/` | При обновлении WC всё слетит |
| Деплой без backup | `cp -r theme theme.backup.DATE` | Откат невозможен |
| Один PHP-файл на все страницы | Отдельные шаблоны + template-parts | Поддержка невозможна |
| Inline styles (`style="color: red"`) | Только Tailwind классы | Консистентность дизайна |
| `<?php echo $var; ?>` без экранирования | `<?php echo esc_html( $var ); ?>` | XSS уязвимость |
| `wp-config.php` в теме | В корне WP (вне www) или .env | Пароли в репозитории |
| Тема без screenshot.png | Добавить скриншот 1200×900 | Тема невидима в админке |
| Функции без префикса (`function my_setup()`) | `function {{theme_name}}_setup()` | Конфликт с плагинами |
| Hardcoded URL (`/about`) | `<?php echo home_url( '/about' ); ?>` | Сломается при смене домена |
| Пропуск wp_head() / wp_footer() | Всегда в header.php / footer.php | Плагины не работают |
| Использование jQuery без необходимости | Vanilla JS или Alpine.js | Лишний вес, WC уже грузит jQuery |

---

## 🔒 Шпаргалка по безопасности (Escaping)

### Всегда экранируй вывод

| Контекст | Функция WP | Пример |
|---|---|---|
| HTML-текст | `esc_html()` | `<h1><?php echo esc_html( $title ); ?></h1>` |
| HTML-атрибут | `esc_attr()` | `<div class="<?php echo esc_attr( $class ); ?>">` |
| URL | `esc_url()` | `<a href="<?php echo esc_url( $url ); ?>">` |
| JS переменная | `wp_json_encode()` | `data-products="<?php echo esc_attr( wp_json_encode( $products ) ); ?>"` |
| Textarea | `esc_textarea()` | `<textarea><?php echo esc_textarea( $val ); ?></textarea>` |
| Разрешённый HTML | `wp_kses_post()` | Для контента из редактора (разрешены <a>, <strong>, etc.) |
| В начале файла | `defined( 'ABSPATH' ) || exit;` | Защита от прямого доступа |

### Формы

```php
// Nonce field
wp_nonce_field( 'submit_lead', '_wpnonce_lead' );

// Verify nonce
if ( ! wp_verify_nonce( $_POST['_wpnonce_lead'], 'submit_lead' ) ) {
    wp_die( 'Security check failed' );
}

// Sanitize input
$name  = sanitize_text_field( $_POST['name'] );
$email = sanitize_email( $_POST['email'] );
$phone = preg_replace( '/[^0-9+]/', '', $_POST['phone'] );
```

---

## 📁 Финальная структура темы (эталон)

```
{{wp_path}}/wp-content/themes/{{theme_name}}/
├── style.css                    ← Theme Name, Version, Text Domain
├── screenshot.png               ← 1200×900 preview
├── functions.php                ← Enqueue, setup, WC support, custom REST
├── index.php                    ← Fallback template
│
├── front-page.php               ← Главная (из index.html)
├── page.php                     ← Статичные страницы
├── page-about.php               ← О компании (из about.html)
├── page-contacts.php            ← Контакты (из contacts.html)
├── single.php                   ← Посты блога
├── archive.php                  ← Архив блога
├── 404.php                      ← Страница 404
│
├── header.php                   ← Шапка (из nav.html)
├── footer.php                   ← Подвал (из footer.html)
├── sidebar.php                  ← Сайдбар (если нужен)
│
├── template-parts/              ← Компоненты (из shared/components/)
│   ├── card.php                 ← Карточка товара/поста
│   ├── hero.php                 ← Hero-секция
│   ├── lead-form.php            ← Форма заявки
│   ├── testimonial.php          ← Отзыв
│   ├── cta.php                  ← Call-to-action секция
│   ├── faq-item.php             ← FAQ элемент
│   ├── breadcrumbs.php          ← Хлебные крошки
│   ├── pagination.php           ← Пагинация
│   └── features.php             ← Фичи/преимущества
│
├── woocommerce/                 ← WC override (из catalog.html + product.html)
│   ├── single-product.php       ← Товар
│   ├── archive-product.php      ← Каталог
│   ├── content-product.php      ← Карточка в петле
│   ├── single-product/
│   │   ├── title.php
│   │   ├── price.php
│   │   ├── add-to-cart/
│   │   │   └── variable.php     ← Вариации
│   │   ├── product-image.php
│   │   └── tabs/
│   │       ├── description.php
│   │       └── additional-information.php
│   ├── loop/
│   │   ├── price.php
│   │   ├── sale-flash.php
│   │   └── add-to-cart.php
│   └── global/
│       ├── breadcrumb.php
│       └── sidebar.php
│
├── tailwind/                    ← Tailwind source (только dev)
│   ├── input.css                ← @tailwind directives + @layer
│   └── tailwind.config.js       ← Конфиг (content paths)
│
├── assets/                      ← Скомпилированные ассеты
│   ├── css/tailwind.css         ← Build output (НЕ редактировать руками!)
│   ├── js/main.js               ← Кастомный JS
│   └── images/                  ← Статические картинки темы
│
├── package.json                 ← npm скрипты (build/watch)
└── .gitignore                   ← node_modules, tailwind/input.css (опционально)
```

---

## 📊 Карта HTML → WP (полная таблица)

| HTML-файл (прототип) | WP-файл (тема) | WP-Conditional Tag | Назначение |
|---|---|---|---|
| `index.html` | `front-page.php` | `is_front_page()` | Главная страница |
| `catalog.html` | `archive-product.php` | `is_shop()` + `is_product_category()` | Каталог WooCommerce |
| `product.html` | `single-product.php` | `is_product()` | Карточка товара |
| `about.html` | `page-about.php` | `is_page('about')` | Страница «О компании» |
| `contacts.html` | `page-contacts.php` | `is_page('contacts')` | Страница контактов |
| `blog.html` | `home.php` | `is_home()` | Блог (список постов) |
| `post.html` | `single.php` | `is_single()` | Пост блога |
| `category.html` | `category.php` | `is_category()` | Категория блога |
| `404.html` | `404.php` | `is_404()` | Страница 404 |
| `search.html` | `search.php` | `is_search()` | Результаты поиска |
| `checkout.html` | `woocommerce/checkout/form-checkout.php` | `is_checkout()` | Оформление заказа |
| `cart.html` | `woocommerce/cart/cart.php` | `is_cart()` | Корзина |
| `nav.html` | `header.php` | N/A (везде) | Шапка + навигация |
| `footer.html` | `footer.php` | N/A (везде) | Подвал |
| `shared/components/card.html` | `template-parts/card.php` | N/A (include) | Карточка товара |
| `shared/components/hero.html` | `template-parts/hero.php` | N/A (include) | Hero секция |
| `shared/components/lead-form.html` | `template-parts/lead-form.php` | N/A (include) | Форма заявки |
| `shared/components/testimonial.html` | `template-parts/testimonial.php` | N/A (include) | Отзыв |
| `shared/components/cta.html` | `template-parts/cta.php` | N/A (include) | CTA секция |

### WP Template Hierarchy (справочно)

WordPress выбирает шаблон в порядке приоритета:
```
front-page.php           ← Главная (приоритет 1)
↓ home.php               ← Список постов
↓ index.php              ← Fallback всего

single-product.php       ← Товар WC (специфичный)
↓ single.php             ← Пост (общий)
↓ singular.php           ← Любой singular
↓ index.php

archive-product.php      ← Каталог WC
↓ archive.php            ← Любой архив
↓ index.php

page-{slug}.php          ← Страница по slug
↓ page.php               ← Общий шаблон страниц
↓ singular.php
↓ index.php
```

---

## 🧠 Learnings-шаблон (для wp-coder)

После каждого этапа wp-coder возвращает:

```
## Статус: success | blocked

## Что создано
- Список файлов

## Файлы изменены
- `path/to/file` — описание

## Тесты/Проверки
- PHP syntax: OK/FAIL
- WP theme activation: OK/FAIL
- Tailwind build: OK/FAIL

## Learnings (для памяти)
- [pattern] ...
- [gotcha] ...
```

---

## 📝 Итоговый checklist для архитектора

Перед тем как сказать владельцу «готово»:

- [ ] wp-inventory.json создан и валидный JSON
- [ ] wp-dynamic-map.md создан (карта хардкод → WP)
- [ ] Все PHP-файлы созданы (style.css + functions.php + header.php + footer.php + шаблоны)
- [ ] get_header() и get_footer() есть на каждой странице
- [ ] wp_head() в header.php, wp_footer() в footer.php
- [ ] Tailwind: build выполнен, assets/css/tailwind.css существует
- [ ] WooCommerce override: archive-product.php + single-product.php + content-product.php
- [ ] WC стилизован через @layer components в tailwind/input.css
- [ ] Формы: CF7 shortcode'ы вставлены ИЛИ custom REST endpoint готов
- [ ] Тема активирована (в Docker или на сервере)
- [ ] Сайт открывается без fatal errors
- [ ] Backup старой темы сделан
- [ ] Все 15 пунктов Definition of Done проверены
- [ ] project.json обновлён (status.deployed = true)
- [ ] memory/STATUS.md обновлён

---

## Связанные навыки

| Навык | Связь |
|---|---|
| `make-ui` | Генерирует HTML-прототип → вход для wp-integration |
| `designer` | Проверяет визуальное соответствие после деплоя |
| `screenshot` | Скриншоты после деплоя для сравнения |
| `deep-research` | Если нужно исследование плагинов/решений для WP |
