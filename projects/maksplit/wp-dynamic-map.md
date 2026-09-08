# WP Dynamic Map — StroyMaks 2026

Карта замен хардкод-контента → WP-функции для всех страниц и компонентов.
Дата: 2026-07-23. Проект: СтройМакс (stroymaks2026), Concrete Steel design.

---

## Глобальные замены (все страницы)

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| `СтройМакс` (logo text) | `bloginfo('name')` | custom_logo приоритетнее |
| `+7 (35147) 1-23-45` | `get_theme_mod('stroymaks2026_phone')` | Customizer |
| `info@maksplit.ru` | `get_theme_mod('stroymaks2026_email')` | Customizer |
| `г. Юрюзань...` | `get_theme_mod('stroymaks2026_address')` | Customizer |
| `© 2015–2025 СтройМакс` | `© 2015–<?php echo date('Y'); ?> <?php bloginfo('name'); ?>` | footer.php |
| `Кевларбетон с душой...` | `bloginfo('description')` | footer tagline |
| Меню (Главная/Каталог/...) | `wp_nav_menu('primary')` | header.php |
| Footer menu | `wp_nav_menu('footer')` | footer.php |
| Каталог ссылки (footer) | `get_terms('product_cat')` | footer.php — динамически |
| `Рассчитать стоимость` (CTA) | `home_url('/calculator')` | глобальная кнопка |

---

## home.html → front-page.php

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| Hero: `Производство в Юрюзани с 2015` | `get_theme_mod('stroymaks2026_hero_eyebrow', 'Производство в Юрюзани с 2015')` | Customizer field |
| Hero: `Кевларбетонная плитка СтройМакс` | `get_theme_mod('stroymaks2026_hero_title', 'Кевларбетонная плитка СтройМакс')` | Customizer field |
| Hero: subtitle про армирование | `get_theme_mod('stroymaks2026_hero_subtitle', '...')` | Customizer field |
| Hero: фото Домино | `get_theme_mod('stroymaks2026_hero_image')` → `wp_get_attachment_image_url()` | Customizer media |
| Hero: stats F200, W6, 22 | `get_theme_mod('stroymaks2026_hero_stats', [])` | Customizer, массив/JSON |
| Hero: CTA → `#calculate` / `/catalog` | `home_url('/catalog')` + `#calculate` | |
| Features: `Почему СтройМакс` | `get_theme_mod('stroymaks2026_features_heading', 'Почему СтройМакс')` | Customizer |
| Features: 4 карточки (01/02/03/04) | `get_theme_mod('stroymaks2026_features', [])` | Customizer repeater ИЛИ ACF |
| Category grid: 4 категории | `get_terms(['taxonomy'=>'product_cat','hide_empty'=>true,'number'=>4])` | Динамически из WC |
| Category grid: заголовок `Всё для благоустройства` | `get_theme_mod('stroymaks2026_categories_heading', 'Всё для благоустройства')` | Customizer |
| Popular products: заголовок | `get_theme_mod('stroymaks2026_popular_heading', 'Популярная продукция')` | Customizer |
| Popular products: 6 карточек | `wc_get_products(['limit'=>6,'orderby'=>'meta_value_num','meta_key'=>'_popular'])` | WC loop |
| Lead form: `Рассчитаем стоимость за 15 минут` | `get_theme_mod('stroymaks2026_lead_heading', 'Рассчитаем стоимость за 15 минут')` | Customizer |
| Lead form: subtitle | `get_theme_mod('stroymaks2026_lead_subtitle', '...')` | Customizer |

---

## catalog.html → archive-product.php (WC override)

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| Breadcrumb | `woocommerce_breadcrumb()` | `woocommerce/global/breadcrumb.php` |
| `Каталог продукции` | `get_theme_mod('stroymaks2026_catalog_title', 'Каталог продукции')` ИЛИ `woocommerce_page_title()` | |
| `22 продукта из кевларбетона...` | `get_theme_mod('stroymaks2026_catalog_subtitle', '...')` | Customizer |
| Quick stats: 22/5/850₽ | `wp_count_posts('product')->publish` + `wp_count_terms('product_cat')` | Динамически |
| Filter pills: Все/Плитка/Брусчатка... | `get_terms('product_cat')` → динамические кнопки | data-category из term.name |
| Product grid: 22 карточки | `woocommerce_product_loop()` → `wc_get_products()` | Стандартный WC loop |
| Product card: фото | `the_post_thumbnail('medium')` | object-contain |
| Product card: категория | `wc_get_product_category_list()` | |
| Product card: название | `the_title()` | |
| Product card: цена | `$product->get_price_html()` | |
| Product card: CTA «Подробнее» | `get_permalink()` | |
| Lead form: `Рассчитаем стоимость...` | `get_template_part('template-parts/lead-form')` | |

---

## product.html → single-product.php (WC override)

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| Breadcrumb | `woocommerce_breadcrumb()` | |
| Категория badge | `wc_get_product_category_list()` | |
| Название товара | `the_title()` | |
| Subtitle | `get_theme_mod('stroymaks2026_product_subtitle_fallback')` ИЛИ ACF/custom field | |
| Описание | `the_content()` / `$product->get_short_description()` | |
| Цена | `$product->get_price_html()` | |
| Цена за м² | `$product->get_price()` + '₽/м²' | |
| Gallery: main photo | `the_post_thumbnail('large')` | object-contain |
| Gallery: thumbnails | `$product->get_gallery_image_ids()` | динамический loop |
| Color picker: Белый/Цветной | `$product->get_available_variations()` | WC variable product |
| Color picker: цена варианта | `$variation['display_price']` | display-only |
| Характеристики (Размеры/Толщина/...) | `$product->get_attributes()` + `wc_get_product_terms()` | attributes loop |
| CTA «Рассчитать стоимость» | `home_url('/calculator')` | enquiry button |
| CTA «Позвонить» | `tel:` + `get_theme_mod('stroymaks2026_phone')` | |
| Delivery info | `get_theme_mod('stroymaks2026_address')` | |
| Full description | `the_content()` / `wc_get_template('single-product/tabs/description.php')` | |
| Features (4 карточки) | `get_template_part('template-parts/features')` | переиспользование |
| Related products: заголовок | `get_theme_mod('stroymaks2026_related_heading', 'Похожие модели')` | |
| Related products: 3 карточки | `woocommerce_related_products(['posts_per_page'=>3])` | WC related |
| Lead form | `get_template_part('template-parts/lead-form')` | |

---

## about.html → page-about.php

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| `Производитель кевларбетона №1` | `the_title()` | |
| `С 2015 года мы производим...` | `the_content()` | WP editor |
| Stats: 11 лет/200000+ м²/F200/1000+ | ACF repeater | `get_field('about_stats')` |
| Timeline: 2015/2017/2019/2022/2026 | ACF repeater | `get_field('about_timeline')` |
| Advantages: 6 карточек | ACF repeater | `get_field('about_advantages')` |
| Process: 4 шага | ACF repeater | `get_field('about_process')` |
| Lead form | `get_template_part('template-parts/lead-form')` | |

---

## contacts.html → page-contacts.php

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| `Контакты` | `the_title()` | |
| Content | `the_content()` | WP editor |
| Address/Phone/Email/Hours | ACF fields | `get_field('contact_address')` etc. |
| Map embed | ACF oembed | `get_field('contact_map')` |
| Lead form | `get_template_part('template-parts/lead-form')` | |

---

## delivery.html → page-delivery.php

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| `Доставка и оплата` | `the_title()` | |
| Content | `the_content()` | WP editor |
| Delivery options (3) | ACF repeater | `get_field('delivery_options')` |
| Payment methods (2) | ACF repeater | `get_field('payment_methods')` |
| FAQ (4 вопроса) | ACF repeater | `get_field('delivery_faq')` |
| Lead form | `get_template_part('template-parts/lead-form')` | |

---

## calculator.html → page-calculator.php

| Хардкод | WP-функция | Примечание |
|---------|-----------|-----------|
| `Рассчитать стоимость` | `the_title()` | |
| `Бесплатный расчёт за 15 минут...` | `the_content()` | WP editor |
| How it works (3 шага) | ACF repeater | `get_field('calculator_steps')` |
| Form fields | CF7 shortcode | `do_shortcode('[contact-form-7 id="X"]')` |
| Lead form | `get_template_part('template-parts/lead-form')` | |

---

## Компоненты → template-parts

| Компонент | PHP | Источники данных |
|-----------|-----|-----------------|
| hero.html | `template-parts/hero.php` | Customizer: hero_eyebrow, hero_title, hero_subtitle, hero_image, hero_stats |
| features.html | `template-parts/features.php` | Customizer/ACF: features repeater |
| product-card.html | `template-parts/product-card.php` | WC: `global $product`, `the_title()`, `get_price_html()`, `get_permalink()`, `the_post_thumbnail()` |
| category-grid.html | `template-parts/category-grid.php` | WC: `get_terms('product_cat')` |
| lead-form.html | `template-parts/lead-form.php` | HTML форма (→ CF7 на Этап 7) + localStorage JS |
| product-detail.html | `template-parts/product-detail.php` | WC: `global $product`, gallery, variations, attributes |

---

## Customizer Fields (новые)

```php
// Hero
'stroymaks2026_hero_eyebrow'    → default: 'Производство в Юрюзани с 2015'
'stroymaks2026_hero_title'       → default: 'Кевларбетонная плитка СтройМакс'
'stroymaks2026_hero_subtitle'    → default: 'Армирование кевларовым волокном...'
'stroymaks2026_hero_image'       → default: 0 (media)

// Contacts
'stroymaks2026_phone'            → default: '+7 (35147) 1-23-45'
'stroymaks2026_email'            → default: 'info@maksplit.ru'
'stroymaks2026_address'          → default: 'г. Юрюзань, Челябинская область, ул. Строителей, 15'

// Home sections
'stroymaks2026_features_heading' → default: 'Почему СтройМакс'
'stroymaks2026_categories_heading' → default: 'Всё для благоустройства'
'stroymaks2026_popular_heading'  → default: 'Популярная продукция'
'stroymaks2026_lead_heading'     → default: 'Рассчитаем стоимость за 15 минут'
'stroymaks2026_lead_subtitle'    → default: 'Оставьте заявку — инженер перезвонит...'

// Catalog
'stroymaks2026_catalog_title'    → default: 'Каталог продукции'
'stroymaks2026_catalog_subtitle' → default: '22 продукта из кевларбетона...'

// Product
'stroymaks2026_related_heading'  → default: 'Похожие модели'
```

---

## Итого замен

- **Глобальные:** 10 замен
- **home.html:** 15 замен
- **catalog.html:** 10 замен
- **product.html:** 18 замен
- **about.html:** 6 замен (ACF)
- **contacts.html:** 5 замен (ACF)
- **delivery.html:** 5 замен (ACF)
- **calculator.html:** 4 замены (CF7 + ACF)
- **Компоненты:** 6 файлов

**Всего замен:** ~73 mapped.