<?php
/**
 * StroyMaks 2026 — functions and definitions.
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * WooCommerce Catalog Mode (NO e-commerce, lead form only).
 * Tailwind CSS + Google Fonts.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

// ═══════════════════════════════════════════════════════════════
// Theme Setup
// ═══════════════════════════════════════════════════════════════

function stroymaks2026_setup() {
    // Core theme supports
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'custom-logo', [
        'height'      => 60,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ] );
    add_theme_support( 'html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ] );

    // WooCommerce supports
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    // Site icon (favicon) — allows Customizer upload, fallback SVG if not set
    add_theme_support( 'site-icon' );

    // Register navigation menus
    register_nav_menus( [
        'primary' => __( 'Primary Menu', 'stroymaks2026' ),
        'footer'  => __( 'Footer Menu', 'stroymaks2026' ),
    ] );

    // Set image sizes
    update_option( 'thumbnail_size_w', 300 );
    update_option( 'thumbnail_size_h', 300 );
    update_option( 'medium_size_w', 600 );
    update_option( 'medium_size_h', 600 );
    update_option( 'large_size_w', 1200 );
    update_option( 'large_size_h', 1200 );
}
add_action( 'after_setup_theme', 'stroymaks2026_setup' );

// ═══════════════════════════════════════════════════════════════
// Enqueue Styles & Scripts
// ═══════════════════════════════════════════════════════════════

function stroymaks2026_scripts() {
    $theme_version = wp_get_theme()->get( 'Version' );

    // Google Fonts: Playfair Display (display) + Source Serif 4 (body)
    wp_enqueue_style(
        'stroymaks2026-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&display=swap',
        [],
        null
    );

    // Tailwind CSS: built CSS (production), CDN fallback (dev)
    $build_css = get_template_directory() . '/assets/css/tailwind.css';
    if ( file_exists( $build_css ) && filesize( $build_css ) > 5000 ) {
        // Production: built CSS
        wp_enqueue_style(
            'stroymaks2026-tailwind',
            get_template_directory_uri() . '/assets/css/tailwind.css',
            [],
            $theme_version
        );
    } else {
        // Dev fallback: Tailwind CDN
        wp_enqueue_script(
            'tailwind-cdn',
            'https://cdn.tailwindcss.com',
            [],
            null,
            false // in <head>
        );
        wp_add_inline_script(
            'tailwind-cdn',
            'tailwind.config={darkMode:"class",theme:{extend:{fontFamily:{display:["Playfair Display","Georgia","serif"],body:["Source Serif 4","Georgia","serif"]},colors:{primary:"#32598f","primary-hover":"#274a7c"},borderRadius:{DEFAULT:"16px",lg:"16px",xl:"16px"}}}}'
        );
    }

    // Main theme JS
    wp_enqueue_script(
        'stroymaks2026-main',
        get_template_directory_uri() . '/assets/js/main.js',
        [],
        $theme_version,
        true // in footer
    );

    // Pass data to JS
    wp_localize_script( 'stroymaks2026-main', 'stroymaks2026Data', [
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'homeUrl' => home_url( '/' ),
        'calculatorUrl' => home_url( '/calculator' ),
    ] );
}
add_action( 'wp_enqueue_scripts', 'stroymaks2026_scripts' );

// ═══════════════════════════════════════════════════════════════
// :root CSS Custom Properties (24 properties from design system)
// ═══════════════════════════════════════════════════════════════

function stroymaks2026_root_css() {
    ?>
    <style id="stroymaks2026-design-tokens">
        :root {
            --color-bg-page: #F8FAFC;
            --color-bg-alt: #F1F5F9;
            --color-surface: #FFFFFF;
            --color-bg-elevated: #F8FAFC;
            --color-text-primary: #0F172A;
            --color-text-secondary: #475569;
            --color-text-muted: #475569;
            --color-primary: #32598f;
            --color-primary-hover: #274a7c;
            --color-primary-glow: rgba(50,89,143,0.4);
            --color-primary-subtle: rgba(50,89,143,0.08);
            --color-success: #059669;
            --color-danger: #DC2626;
            --color-border: #E2E8F0;
            --color-border-hover: #CBD5E1;
            --gradient-subtle: linear-gradient(180deg, #F8FAFC, #F1F5F9);
            --shadow-brand: 0 10px 30px -10px rgba(50,89,143,0.35);
            --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
            --shadow-card-hover: 0 8px 24px -8px rgba(50,89,143,0.15);
            --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            --radius: 16px;
            --font-display: 'Playfair Display', 'Georgia', serif;
            --font-body: 'Source Serif 4', 'Georgia', serif;
            --color-text-on-primary: #FFFFFF;
        }

        /* Base body */
        body {
            font-family: var(--font-body);
            background: var(--color-bg-page);
            color: var(--color-text-primary);
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        /* Smooth scroll */
        html { scroll-behavior: smooth; }

        /* Focus ring for accessibility */
        *:focus-visible {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
            border-radius: var(--radius);
        }

        /* Steel beam divider */
        .steel-divider {
            height: 3px;
            background: var(--gradient-subtle);
            border: none;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'stroymaks2026_root_css', 1 );

// ═══════════════════════════════════════════════════════════════
// WooCommerce Catalog Mode (NO e-commerce, lead form only)
// ═══════════════════════════════════════════════════════════════

// Remove WC default styles (we use Tailwind)
add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );

// Remove add_to_cart buttons
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );

// Remove cart fragments (no cart needed)
add_filter( 'woocommerce_add_to_cart_fragments', '__return_empty_array' );

// Disable AJAX add to cart
add_filter( 'woocommerce_product_supports', function( $supports, $feature, $product ) {
    if ( $feature === 'ajax_add_to_cart' ) {
        return false;
    }
    return $supports;
}, 10, 3 );

// Redirect cart/checkout to calculator
function stroymaks2026_redirect_cart_checkout() {
    if ( is_cart() || is_checkout() ) {
        wp_redirect( home_url( '/calculator' ) );
        exit;
    }
}
add_action( 'template_redirect', 'stroymaks2026_redirect_cart_checkout' );

// Replace «Add to cart» text with «Рассчитать стоимость»
add_filter( 'woocommerce_product_add_to_cart_text', 'stroymaks2026_cart_button_text' );
add_filter( 'woocommerce_product_single_add_to_cart_text', 'stroymaks2026_cart_button_text' );
function stroymaks2026_cart_button_text() {
    return __( 'Рассчитать стоимость', 'stroymaks2026' );
}

// Enquiry button on single product (replaces add_to_cart)
function stroymaks2026_enquiry_button() {
    ?>
    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>"
       class="flex-1 rounded-2xl bg-[var(--color-primary)] px-6 py-4 text-center font-body text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]"
       style="box-shadow: var(--shadow-brand);"
       onclick="this.style.boxShadow='none'; setTimeout(()=>this.style.boxShadow='var(--shadow-brand)',200);">
        <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
    </a>
    <?php
}
add_action( 'woocommerce_single_product_summary', 'stroymaks2026_enquiry_button', 30 );

// Hide WC "short description" (post_excerpt) in summary — мы парсим его в структурированную таблицу «Характеристики» (D-155).
// Без этого: post_excerpt выводится как текст → дублирует характеристики (Цвет/Размер повторяются 5×).
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );

// Hide WC meta (SKU/категории/теги) in summary — дублирует (теги «Серый/Цветной/Белый» из БД повторяют цвета из таблицы цен). D-158.
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );

// Hide WC add-to-cart hook (D-161): Catalog Mode + мы выводим Блок A (color-swatch) напрямую через get_template_part
// в single-product.php. Без этого remove_action WC выведет variable.php через хук 30 → дубль с нашим get_template_part.
// (remove_action выше, строка 191, уже это делает — здесь только комментарий-объяснение.)

// Loop enquiry button REMOVED (v8): product-card.php handles CTA inline.
// No duplicate button needed — each card has its own «Подробнее»/«Рассчитать стоимость».

// Hide "sale" flash on catalog mode (no purchases)
add_filter( 'woocommerce_sale_flash', '__return_empty_string' );

// ═══════════════════════════════════════════════════════════════
// Fallback Menus — when no menu assigned in WP admin
// ═══════════════════════════════════════════════════════════════

/**
 * Fallback desktop menu — matches Stroymaks2026_Nav_Walker link classes.
 */
function stroymaks2026_fallback_menu_desktop() {
    $items = [
        [ 'url' => home_url( '/' ),            'title' => 'Главная' ],
        [ 'url' => home_url( '/shop/' ),       'title' => 'Каталог' ],
        [ 'url' => home_url( '/category/novosti/' ), 'title' => 'Статьи' ],
        [ 'url' => home_url( '/company-about/' ),      'title' => 'О компании' ],
        [ 'url' => home_url( '/dostavka/' ),   'title' => 'Доставка' ],
        [ 'url' => home_url( '/contact-us/' ),   'title' => 'Контакты' ],
    ];

    $link_class = 'font-body text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)] whitespace-nowrap';

    // D-164: обёртка hidden lg:flex — имитирует wp_nav_menu container_class.
    // БЕЗ обёртки 5 пунктов выводились на мобильном в строку → horizontal overflow 653px (logo+menu+CTA+hamburger).
    echo '<div class="hidden items-center gap-5 lg:flex">';
    foreach ( $items as $item ) {
        printf(
            '<a href="%s" class="%s" role="menuitem">%s</a>',
            esc_url( $item['url'] ),
            esc_attr( $link_class ),
            esc_html( $item['title'] )
        );
    }
    echo '</div>';

    // CTA «Рассчитать стоимость» — НЕ здесь. Кнопка живёт в header.php (Right actions, рядом с телефоном) —
    // всегда показывается на desktop+mobile. Здесь только пункты навигации (иначе дубликат кнопки в меню).
}

/**
 * Fallback mobile menu — matches Stroymaks2026_Mobile_Nav_Walker link classes.
 * No <ul> wrapper (items_wrap='%3$s' in wp_nav_menu).
 */
function stroymaks2026_fallback_menu_mobile() {
    $items = [
        [ 'url' => home_url( '/' ),            'title' => 'Главная' ],
        [ 'url' => home_url( '/shop/' ),       'title' => 'Каталог' ],
        [ 'url' => home_url( '/category/novosti/' ), 'title' => 'Статьи' ],
        [ 'url' => home_url( '/company-about/' ),      'title' => 'О компании' ],
        [ 'url' => home_url( '/dostavka/' ),   'title' => 'Доставка' ],
        [ 'url' => home_url( '/contact-us/' ),   'title' => 'Контакты' ],
    ];

    $link_class = 'block rounded-2xl px-3 py-2.5 font-body text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]';

    foreach ( $items as $item ) {
        printf(
            '<a href="%s" class="%s" role="menuitem">%s</a>',
            esc_url( $item['url'] ),
            esc_attr( $link_class ),
            esc_html( $item['title'] )
        );
    }

    // CTA «Рассчитать стоимость» — НЕ здесь (дублирует header.php Right actions, видна на mobile рядом с hamburger).
}

// ═══════════════════════════════════════════════════════════════
// WooCommerce Russian Labels (override — no .mo files needed)
// ═══════════════════════════════════════════════════════════════

// Product tabs headings
add_filter( 'woocommerce_product_description_heading', function() {
    return 'Описание';
} );
add_filter( 'woocommerce_product_additional_information_heading', function() {
    return 'Характеристики';
} );
add_filter( 'woocommerce_related_products_heading', function() {
    return 'Похожие товары';
} );
add_filter( 'woocommerce_product_reviews_heading', function() {
    return 'Отзывы';
} );

// Breadcrumb "Home" → "Главная"
add_filter( 'woocommerce_breadcrumb_defaults', function( $defaults ) {
    $defaults['home'] = 'Главная';
    return $defaults;
} );

// Catalog ordering dropdown
add_filter( 'woocommerce_catalog_orderby', function( $options ) {
    return [
        'menu_order' => 'По умолчанию',
        'popularity' => 'По популярности',
        'rating'     => 'По рейтингу',
        'date'       => 'Новинки',
        'price'      => 'Сначала дешевле',
        'price-desc' => 'Сначала дороже',
    ];
} );

// "Showing all X results" → русский
add_filter( 'woocommerce_result_count_text', function() {
    return 'Показано всех товаров';
} );

// General gettext overrides for WC strings
add_filter( 'woocommerce_gettext', function( $translation, $text ) {
    $ru = [
        'Default sorting'                        => 'По умолчанию',
        'Show sidebar'                           => 'Показать фильтры',
        'Search products:'                       => 'Поиск товаров:',
        'Search'                                 => 'Поиск',
        'No products found'                      => 'Товары не найдены',
        'No products were found matching your selection.' => 'Товары по вашему запросу не найдены.',
    ];
    return $ru[ $text ] ?? $translation;
}, 20, 2 );

// ═══════════════════════════════════════════════════════════════
// Customizer: StroyMaks 2026 Settings
// ═══════════════════════════════════════════════════════════════

function stroymaks2026_customizer( $wp_customize ) {

    // ── Panel: StroyMaks Settings ────────────────────────────────
    $wp_customize->add_panel( 'stroymaks2026_panel', [
        'title'       => __( 'StroyMaks 2026', 'stroymaks2026' ),
        'priority'    => 30,
        'description' => __( 'Настройки темы StroyMaks 2026: контакты, hero, каталог, формы.', 'stroymaks2026' ),
    ] );

    // ── Section: Contacts ────────────────────────────────────────
    $wp_customize->add_section( 'stroymaks2026_contacts', [
        'title' => __( 'Контакты', 'stroymaks2026' ),
        'panel' => 'stroymaks2026_panel',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_phone', [
        'default'           => '+7 982 341 69 70',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_phone', [
        'label'   => __( 'Телефон', 'stroymaks2026' ),
        'section' => 'stroymaks2026_contacts',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_email', [
        'default'           => 'maksimdyd@gmail.com',
        'sanitize_callback' => 'sanitize_email',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_email', [
        'label'   => __( 'Email', 'stroymaks2026' ),
        'section' => 'stroymaks2026_contacts',
        'type'    => 'email',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_address', [
        'default'           => 'г. Юрюзань, Челябинская обл., ул. Тимирязева, 15а',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_address', [
        'label'   => __( 'Адрес', 'stroymaks2026' ),
        'section' => 'stroymaks2026_contacts',
        'type'    => 'textarea',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hours', [
        'default'           => 'Пн-Пт: 8:00–18:00',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_hours', [
        'label'   => __( 'Часы работы (будни)', 'stroymaks2026' ),
        'section' => 'stroymaks2026_contacts',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hours_sat', [
        'default'           => 'Сб: 9:00–15:00',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_hours_sat', [
        'label'   => __( 'Часы работы (суббота)', 'stroymaks2026' ),
        'section' => 'stroymaks2026_contacts',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_map_embed', [
        'default'           => '',
        'sanitize_callback' => 'wp_kses_post',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_map_embed', [
        'label'       => __( 'Код карты (iframe)', 'stroymaks2026' ),
        'description' => __( 'Вставьте iframe-код Яндекс.Карт или Google Maps', 'stroymaks2026' ),
        'section'     => 'stroymaks2026_contacts',
        'type'        => 'textarea',
    ] );

    // ── Section: Hero ────────────────────────────────────────────
    $wp_customize->add_section( 'stroymaks2026_hero', [
        'title' => __( 'Hero (Главная)', 'stroymaks2026' ),
        'panel' => 'stroymaks2026_panel',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hero_eyebrow', [
        'default'           => 'Производство в Юрюзани с 2015',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_hero_eyebrow', [
        'label'   => __( 'Hero — надзаголовок', 'stroymaks2026' ),
        'section' => 'stroymaks2026_hero',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hero_title', [
        'default'           => 'Кевларбетонная плитка СтройМакс',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_hero_title', [
        'label'   => __( 'Hero — заголовок', 'stroymaks2026' ),
        'section' => 'stroymaks2026_hero',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hero_subtitle', [
        'default'           => 'Производим тротуарную плитку и брусчатку с кевларовым волокном в Челябинской области. Повышенная прочность, морозостойкость, 22 вида продукции.',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_hero_subtitle', [
        'label'   => __( 'Hero — подзаголовок', 'stroymaks2026' ),
        'section' => 'stroymaks2026_hero',
        'type'    => 'textarea',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_hero_image', [
        'default'           => 0,
        'sanitize_callback' => 'absint',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'stroymaks2026_hero_image', [
        'label'   => __( 'Hero — фото', 'stroymaks2026' ),
        'section' => 'stroymaks2026_hero',
    ] ) );

    // ── Section: CF7 IDs ─────────────────────────────────────────
    $wp_customize->add_section( 'stroymaks2026_cf7', [
        'title'       => __( 'CF7 Формы', 'stroymaks2026' ),
        'panel'       => 'stroymaks2026_panel',
        'description' => __( 'ID форм Contact Form 7. Создайте форму в CF7 → скопируйте ID сюда.', 'stroymaks2026' ),
    ] );

    $wp_customize->add_setting( 'stroymaks2026_cf7_lead_id', [
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_cf7_lead_id', [
        'label'       => __( 'CF7 ID — Форма «Рассчитать стоимость»', 'stroymaks2026' ),
        'description' => __( 'Основная форма захвата лидов (имя, телефон, объём, комментарий).', 'stroymaks2026' ),
        'section'     => 'stroymaks2026_cf7',
        'type'        => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_cf7_calculator_id', [
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_cf7_calculator_id', [
        'label'       => __( 'CF7 ID — Форма калькулятора', 'stroymaks2026' ),
        'description' => __( 'Расширенная форма на странице /calculator (имя, телефон, email, тип, объём, комментарий).', 'stroymaks2026' ),
        'section'     => 'stroymaks2026_cf7',
        'type'        => 'text',
    ] );

    // ── Section: Catalog ─────────────────────────────────────────
    $wp_customize->add_section( 'stroymaks2026_catalog', [
        'title' => __( 'Каталог', 'stroymaks2026' ),
        'panel' => 'stroymaks2026_panel',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_catalog_title', [
        'default'           => 'Каталог продукции',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_catalog_title', [
        'label'   => __( 'Заголовок каталога', 'stroymaks2026' ),
        'section' => 'stroymaks2026_catalog',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_catalog_subtitle', [
        'default'           => '22 продукта из кевларбетона. Тротуарная плитка, брусчатка, бордюры, водостоки и памятники. Производство в Юрюзани с 2015 года. Доставка по всей России.',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_catalog_subtitle', [
        'label'   => __( 'Подзаголовок каталога', 'stroymaks2026' ),
        'section' => 'stroymaks2026_catalog',
        'type'    => 'textarea',
    ] );

    // ── Section: Home Page ───────────────────────────────────────
    $wp_customize->add_section( 'stroymaks2026_home', [
        'title' => __( 'Главная страница', 'stroymaks2026' ),
        'panel' => 'stroymaks2026_panel',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_popular_heading', [
        'default'           => 'Популярная продукция',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_popular_heading', [
        'label'   => __( 'Заголовок блока «Популярная продукция»', 'stroymaks2026' ),
        'section' => 'stroymaks2026_home',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_lead_heading', [
        'default'           => 'Рассчитаем стоимость за 15 минут',
        'sanitize_callback' => 'sanitize_text_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_lead_heading', [
        'label'   => __( 'Заголовок lead-формы', 'stroymaks2026' ),
        'section' => 'stroymaks2026_home',
        'type'    => 'text',
    ] );

    $wp_customize->add_setting( 'stroymaks2026_lead_subtitle', [
        'default'           => 'Оставьте заявку — инженер перезвонит, уточнит объём и подготовит точный расчёт. Без обязательств.',
        'sanitize_callback' => 'sanitize_textarea_field',
        'transport'         => 'refresh',
    ] );
    $wp_customize->add_control( 'stroymaks2026_lead_subtitle', [
        'label'   => __( 'Подзаголовок lead-формы', 'stroymaks2026' ),
        'section' => 'stroymaks2026_home',
        'type'    => 'textarea',
    ] );

}
add_action( 'customize_register', 'stroymaks2026_customizer' );

// ═══════════════════════════════════════════════════════════════
// SEO: Show all posts on category archive (no pagination)
// ═══════════════════════════════════════════════════════════════

/**
 * Show all posts on category archives (no pagination).
 * Ensures all 12 articles in «Новости» are accessible on one page for SEO.
 *
 * @since 2026-08-02
 */
add_action( 'pre_get_posts', 'stroymaks2026_category_all_posts' );
function stroymaks2026_category_all_posts( $query ) {
	if ( ! is_admin() && $query->is_main_query() && $query->is_category() ) {
		$query->set( 'posts_per_page', -1 );
	}
}

// ═══════════════════════════════════════════════════════════════
// Remove useless WP stuff for catalog mode
// ═══════════════════════════════════════════════════════════════

// Remove WooCommerce sidebar
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

// Remove emoji script (perf)
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// Remove Gutenberg block CSS (if not using blocks)
add_action( 'wp_enqueue_scripts', function() {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
}, 100 );

// ═══════════════════════════════════════════════════════════════
// Custom Nav Walker — Tailwind-styled wp_nav_menu
// ═══════════════════════════════════════════════════════════════

if ( ! class_exists( 'Stroymaks2026_Nav_Walker' ) ) :

class Stroymaks2026_Nav_Walker extends Walker_Nav_Menu {
    /**
     * Start the element output — desktop nav.
     */
    public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $classes   = empty( $item->classes ) ? [] : (array) $item->classes;
        $is_active = in_array( 'current-menu-item', $classes ) || in_array( 'current_page_item', $classes );

        $active_class = $is_active
            ? 'font-body text-sm font-medium text-[var(--color-primary)] transition-colors duration-150'
            : 'font-body text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]';

        $atts           = [];
        $atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
        $atts['target'] = ! empty( $item->target ) ? $item->target : '';
        $atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
        $atts['href']   = ! empty( $item->url ) ? $item->url : '';
        $atts['class']  = $active_class;
        $atts['role']   = 'menuitem';

        if ( $is_active ) {
            $atts['aria-current'] = 'page';
        }

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) || '0' === (string) $value ) {
                $value      = esc_attr( $value );
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $output .= '<a' . $attributes . '>';
        $output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
        $output .= '</a>';
    }
}

endif;

if ( ! class_exists( 'Stroymaks2026_Mobile_Nav_Walker' ) ) :

class Stroymaks2026_Mobile_Nav_Walker extends Walker_Nav_Menu {
    /**
     * Start the element output — mobile nav.
     */
    public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
        $classes   = empty( $item->classes ) ? [] : (array) $item->classes;
        $is_active = in_array( 'current-menu-item', $classes ) || in_array( 'current_page_item', $classes );

        $active_class = $is_active
            ? 'block rounded-2xl px-3 py-2.5 font-body text-sm font-medium text-[var(--color-primary)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)]'
            : 'block rounded-2xl px-3 py-2.5 font-body text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)]';

        $atts           = [];
        $atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
        $atts['target'] = ! empty( $item->target ) ? $item->target : '';
        $atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
        $atts['href']   = ! empty( $item->url ) ? $item->url : '';
        $atts['class']  = $active_class;
        $atts['role']   = 'menuitem';

        if ( $is_active ) {
            $atts['aria-current'] = 'page';
        }

        $attributes = '';
        foreach ( $atts as $attr => $value ) {
            if ( ! empty( $value ) || '0' === (string) $value ) {
                $value      = esc_attr( $value );
                $attributes .= ' ' . $attr . '="' . $value . '"';
            }
        }

        $output .= '<a' . $attributes . '>';
        $output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
        $output .= '</a>';
    }
}

endif;

// ═══════════════════════════════════════════════════════════════
// Post Excerpt Parser: extract structured specs for single-product
// ═══════════════════════════════════════════════════════════════

/**
 * Parse product post_excerpt into structured specs array.
 *
 * Handles 4 real-world formats:
 *   1. Simple text with inline color:price lines
 *   2. Text + HTML table for color→price
 *   3. Text + HTML table with 3 colors
 *   4. Bordyury: size→price lines (no color table)
 *
 * @param string $excerpt Raw post_excerpt (may contain HTML).
 * @return array { sizes, thickness, qty, color_prices, size_prices }
 */
function stroymaks2026_parse_excerpt_specs( $excerpt ) {
    $result = [
        'sizes'        => [],
        'thickness'    => null,
        'qty'          => null,
        'color_prices' => [],
        'size_prices'  => [],
    ];

    if ( empty( trim( $excerpt ) ) ) {
        return $result;
    }

    // Normalize non-breaking spaces
    $excerpt = str_replace( [ "\xC2\xA0", '&nbsp;' ], ' ', $excerpt );

    // Step 1: Extract HTML table rows (color→price)
    $table_color_prices = [];
    if ( preg_match_all( '/<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<\/tr>/is', $excerpt, $table_rows, PREG_SET_ORDER ) ) {
        foreach ( $table_rows as $row ) {
            $cell1 = trim( wp_strip_all_tags( $row[1] ) );
            $cell2 = trim( wp_strip_all_tags( $row[2] ) );
            if ( mb_strtolower( $cell1 ) === 'цвет' || $cell1 === '' ) {
                continue;
            }
            $table_color_prices[] = [
                'color' => $cell1,
                'price' => stroymaks2026_normalize_price( $cell2, false ),
            ];
        }
    }

    // Step 2: Strip HTML, work with plain text
    $plain = wp_strip_all_tags( $excerpt );
    $plain = preg_replace( '/\n\s*\n\s*\n+/', "\n\n", $plain );
    $lines_raw = explode( "\n", $plain );
    $lines = [];
    foreach ( $lines_raw as $l ) {
        $l = trim( $l );
        if ( $l !== '' ) {
            $lines[] = $l;
        }
    }

    // Step 3: Extract sections
    $text_color_prices = [];
    $is_bordyury      = false;

    foreach ( $lines as $line ) {
        // Skip "Цена за кв. м." header
        if ( preg_match( '/^Цена\s+за/ui', $line ) ) {
            continue;
        }

        // 3a. Sizes: "Размеры, мм: 300х150" or multiline
        if ( preg_match( '/^Размеры,?\s*мм[\s:]+(.+)$/ui', $line, $m ) ) {
            $size_str = trim( $m[1] );
            if ( $size_str !== '' ) {
                // Split by comma — handles "195х140х40, 210х210х40," (multiple sizes on one line)
                $size_parts = array_map( 'trim', explode( ',', $size_str ) );
                foreach ( $size_parts as $part ) {
                    if ( $part === '' ) {
                        continue;
                    }
                    // Check bordyury: "500х200х60 – 150 руб."
                    if ( preg_match( '/(\d+[×xх]\d+[×xх]?\d*)\s*[–\-]\s*(.+)/ui', $part, $sm ) ) {
                        $result['size_prices'][] = [
                            'size'  => stroymaks2026_normalize_size( $sm[1] ),
                            'price' => stroymaks2026_normalize_price( $sm[2], true ),
                        ];
                        $is_bordyury = true;
                    } elseif ( preg_match( '/\d+[×xх]\d+/ui', $part ) ) {
                        $result['sizes'][] = stroymaks2026_normalize_size( $part );
                    }
                }
            }
            continue;
        }

        // 3b. Subsequent dimension lines (no label prefix)
        if ( preg_match( '/^(\d+[×xх]\d+(?:[×xх]\d+)?)\s*[–\-]?\s*(.*)$/ui', $line, $m ) ) {
            $dim  = $m[1];
            $rest = trim( $m[2] );
            if ( $rest !== '' && preg_match( '/\d+\s*руб/ui', $rest ) ) {
                $result['size_prices'][] = [
                    'size'  => stroymaks2026_normalize_size( $dim ),
                    'price' => stroymaks2026_normalize_price( $rest, true ),
                ];
                $is_bordyury = true;
            } elseif ( $rest === '' ) {
                $result['sizes'][] = stroymaks2026_normalize_size( $dim );
            } elseif ( ! preg_match( '/руб/ui', $rest ) && preg_match( '/\d+[×xх]\d+/ui', $rest ) ) {
                // $dim is the first size on the line; $rest holds comma-separated remaining sizes
                // e.g. line "195х140х40, 210х210х40," → dim="195х140х40", rest=", 210х210х40,"
                $result['sizes'][] = stroymaks2026_normalize_size( $dim );
                $rest_parts = array_map( 'trim', explode( ',', $rest ) );
                foreach ( $rest_parts as $rp ) {
                    if ( $rp === '' ) {
                        continue;
                    }
                    if ( preg_match( '/\d+[×xх]\d+/ui', $rp ) ) {
                        $result['sizes'][] = stroymaks2026_normalize_size( $rp );
                    }
                }
            }
            continue;
        }

        // 3c. Thickness: "Толщина, мм: 35"
        if ( preg_match( '/^Толщина,?\s*мм\s*:?\s*(\d+)/ui', $line, $m ) ) {
            $result['thickness'] = $m[1];
            continue;
        }

        // 3d. Quantity: "В 1м2: 34 шт." / "Кол-во в 1м2: 11 шт."
        if ( preg_match( '/(?:В|Кол-во\s*в)\s*1\s*м\s*[²2]\s*:?\s*(\d+\s*шт\.?)/ui', $line, $m ) ) {
            $result['qty'] = trim( $m[1] );
            continue;
        }

        // 3e. Color→Price: "Серый: 850 руб. кв. м"
        if ( preg_match( '/^(.+?)\s*:\s*(\d+\s*руб.+)$/ui', $line, $m ) ) {
            $color_label = trim( $m[1] );
            $price_raw   = trim( $m[2] );
            if ( ! preg_match( '/^(размер|толщин|кол-?во|цена|кв\.?\s*м)/ui', $color_label ) ) {
                $text_color_prices[] = [
                    'color' => $color_label,
                    'price' => stroymaks2026_normalize_price( $price_raw, false ),
                ];
            }
            continue;
        }
    }

    // Step 4: Merge color prices (HTML table takes priority)
    if ( ! empty( $table_color_prices ) ) {
        $result['color_prices'] = $table_color_prices;
    } elseif ( ! empty( $text_color_prices ) ) {
        $result['color_prices'] = $text_color_prices;
    }

    // Bordyury mode: size_prices replace color_prices
    if ( $is_bordyury && ! empty( $result['size_prices'] ) ) {
        $result['color_prices'] = [];
    }

    return $result;
}

/**
 * Normalize size: "300х150" → "300×150"
 */
function stroymaks2026_normalize_size( $size ) {
    return str_replace( [ 'х', 'x' ], '×', trim( $size ) );
}

/**
 * Normalize price: "850 руб. кв. м" → "850 ₽/м²"
 * For bordyury: "150 руб. кв. м" → "150 ₽/шт"
 */
function stroymaks2026_normalize_price( $price_raw, $is_per_piece = false ) {
    $price = trim( $price_raw );
    $price = rtrim( $price, '. ' );
    $price = preg_replace( '/\s*руб\.?\s*/ui', ' ', $price );
    $price = preg_replace( '/\s*кв\.?\s*м\.?\s*(²|2)?/ui', '', $price );
    $price = preg_replace( '/\s*м\s*[²2]\s*/ui', '', $price );
    $price = trim( $price );

    if ( $is_per_piece ) {
        $price .= ' ₽/шт';
    } else {
        $price .= ' ₽/м²';
    }

    return $price;
}

/**
 * Get color swatch hex for a given color name.
 */
function stroymaks2026_color_swatch( $color_name ) {
    $map = [
        'серый'              => '#9CA3AF',
        'цветной'            => '#32598f',
        'в цвете'            => '#32598f',
        'мрамор из бетона'   => '#E5E7EB',
        'белый'              => '#F9FAFB',
        'красный'            => '#DC2626',
        'коричневый'         => '#8B4513',
        'чёрный'             => '#1F2937',
        'черный'             => '#1F2937',
        'жёлтый'             => '#FBBF24',
        'желтый'             => '#FBBF24',
        'зелёный'            => '#059669',
        'зеленый'            => '#059669',
        'синий'              => '#2563EB',
    ];
    $lower = mb_strtolower( trim( $color_name ) );
    return isset( $map[ $lower ] ) ? $map[ $lower ] : '#CBD5E1';
}

/**
 * SEO: Geo meta tags + LocalBusiness JSON-LD (D-165).
 *
 * Регион: Челябинская область, Юрюзань, Катав-Ивановский район.
 * SEOPress генерит WebSite + Organization JSON-LD + og: + twitter: + meta description,
 * но НЕ генерит geo-метатеги и LocalBusiness (toggle выключен, поля не подхватываются).
 * Этот блок дополняет: geo.region/placename/position/ICBM + schema.org LocalBusiness с адресом.
 * Цель: Яндекс показывал сайт с региона Челябинская область / Юрюзань (lr=11219).
 */
add_action( 'wp_head', function () {
    $phone    = get_theme_mod( 'stroymaks2026_phone', '+79823416970' );
    $site_url = home_url( '/' );
    $site_name = get_bloginfo( 'name' );

    // Geo meta tags (стандартные HTML geo meta — для регионального SEO Яндекса)
    echo "<meta name=\"geo.region\" content=\"RU-CHE\" />\n";
    echo "<meta name=\"geo.placename\" content=\"Юрюзань, Катав-Ивановский район, Челябинская область\" />\n";
    echo "<meta name=\"geo.position\" content=\"54.850;58.430\" />\n";
    echo "<meta name=\"ICBM\" content=\"54.850, 58.430\" />\n";

    // LocalBusiness JSON-LD — карточка организации для Яндекса/Google
    $lb = [
        '@context'  => 'https://schema.org',
        '@type'     => 'LocalBusiness',
        '@id'       => $site_url . '#localbusiness',
        'name'      => $site_name,
        'url'       => $site_url,
        'telephone' => $phone,
        'priceRange'=> '₽₽',
        'address'   => [
            '@type'           => 'PostalAddress',
            'streetAddress'   => 'г. Юрюзань, Катав-Ивановский район',
            'addressLocality' => 'Юрюзань',
            'addressRegion'   => 'Челябинская область',
            'postalCode'      => '456120',
            'addressCountry'  => 'RU',
        ],
        'geo' => [
            '@type'      => 'GeoCoordinates',
            'latitude'   => '54.850',
            'longitude'  => '58.430',
        ],
        'areaServed'   => [ 'Юрюзань', 'Катав-Ивановский район', 'Челябинская область' ],
        'openingHours' => 'Mo-Fr 09:00-18:00',
    ];
    echo '<script type="application/ld+json">' . wp_json_encode( $lb ) . '</script>' . "\n";
}, 5 );

/**
 * Favicon fallback — SVG inline (letter "С" for СтройМакс) when site_icon not set.
 *
 * site_icon support (Customizer → Site Identity → Site Icon) is enabled via add_theme_support('site-icon').
 * If admin uploads a site icon — this hook does nothing (site_icon returns ID).
 * If not set — outputs inline SVG favicon with letter "С" in Dusty Blue #32598f.
 */
add_action( 'wp_head', function() {
    if ( get_option( 'site_icon' ) ) {
        return; // Site icon is set via Customizer — do not interfere
    }
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#32598f"/><text x="32" y="44" font-family="Georgia,serif" font-size="40" font-weight="bold" text-anchor="middle" fill="#FBF9F4">С</text></svg>';
    $href = 'data:image/svg+xml;base64,' . base64_encode( $svg );
    echo "<link rel=\"icon\" href=\"{$href}\" sizes=\"any\">\n";
    echo "<link rel=\"apple-touch-icon\" href=\"{$href}\">\n";
    echo "<link rel=\"mask-icon\" href=\"{$href}\" color=\"#32598f\">\n";
}, 20 );

// ═══════════════════════════════════════════════════════════════
// Mail: postfix local delivery via MX (NetAngels blocks 25/465/587
// to external SMTP, but port 25 to mx0/mx1.maksplit.ru is OPEN).
// Recipient me@maksplit.ru → NetAngels forwarding → owner inbox.
// From must be @maksplit.ru for SPF (v=spf1 a include:netangels.ru).
// ═══════════════════════════════════════════════════════════════

// From address: @maksplit.ru so SPF passes (our VDS = A record).
// No SMTP relay — use default postfix/sendmail (PHP mail()).
add_filter( 'wp_mail_from', function( $email ) {
    return 'admin@maksplit.ru';
} );

// From name: brand.
add_filter( 'wp_mail_from_name', function( $name ) {
    return 'СтройМакс';
} );

// Envelope sender = From header. Postfix default uses user@hostname
// (e.g. www-data@vm-006d10f9.na4u.ru) which fails SPF at NetAngels
// (451 4.7.1 Try again later). Force MAIL FROM = admin@maksplit.ru.
add_action( 'phpmailer_init', function( $phpmailer ) {
    $phpmailer->Sender = $phpmailer->From;
} );

// ═══════════════════════════════════════════════════════════════
// CF7 Form Styling — Dusty Slate design system (D-192 follow-up)
// ═══════════════════════════════════════════════════════════════

/**
 * Style Contact Form 7 forms to match the Dusty Slate design tokens.
 *
 * Targets: input fields, textarea, submit button, validation messages.
 * Uses var(--color-*) CSS custom properties (D-042 — no hardcoded hex).
 * Inline <style> via wp_head — no npm build required.
 *
 * Priority 30: after favicon (20), after design tokens (1).
 */
add_action( 'wp_head', function() {
    ?>
    <style id="stroymaks2026-cf7-styles">
        /* ═══════════════════════════════════════════════════════
           CF7 Form Styling — Dusty Slate design system
           Uses var(--color-*) tokens from stroymaks2026-design-tokens
           ═══════════════════════════════════════════════════════ */

        /* — Form container — */
        .wpcf7-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        /* — smaks form grid (new label-based layout) — */
        .wpcf7-form .smaks-form-grid {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
        }

        @media (min-width: 768px) {
            .wpcf7-form .smaks-form-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.25rem;
            }
            .wpcf7-form .smaks-field:nth-child(3),
            .wpcf7-form .smaks-field:nth-child(4),
            .wpcf7-form .smaks-submit-row,
            .wpcf7-form .smaks-consent {
                grid-column: 1 / -1;
            }
        }

        /* — smaks field wrapper — */
        .wpcf7-form .smaks-field {
            margin-bottom: 0;
        }

        /* — Label styling — */
        .wpcf7-form .smaks-field label,
        .wpcf7-form label {
            display: block;
            font-family: var(--font-body);
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--color-text-primary);
            margin-bottom: 0.375rem;
            line-height: 1.4;
        }

        /* — Required asterisk — */
        .wpcf7-form .smaks-req {
            color: var(--color-danger);
        }

        /* — Submit row — */
        .wpcf7-form .smaks-submit-row {
            margin-top: 0.25rem;
        }

        /* — Submit button (smaks class) — */
        .wpcf7-form input.smaks-submit {
            width: 100%;
            padding: 0.875rem 1.5rem;
            font-family: var(--font-body);
            font-size: 1rem;
            font-weight: 600;
            color: var(--color-text-on-primary);
            background-color: var(--color-primary);
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: var(--shadow-brand);
        }

        .wpcf7-form input.smaks-submit:hover {
            background-color: var(--color-primary-hover);
            transform: translateY(-1px);
        }

        .wpcf7-form input.smaks-submit:active {
            transform: translateY(0);
            box-shadow: none;
        }

        /* — Consent text — */
        .wpcf7-form .smaks-consent {
            font-family: var(--font-body);
            font-size: 0.75rem;
            color: var(--color-text-muted);
            text-align: center;
            margin-top: 0.75rem;
            line-height: 1.5;
        }

        /* — Reset old Bootstrap grid wrappers (from old CF7 form template) — */
        .wpcf7-form .row {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 0;
        }

        .wpcf7-form .col-xs-12,
        .wpcf7-form .col-sm-12,
        .wpcf7-form .col-md-6,
        .wpcf7-form .col-lg-6,
        .wpcf7-form .col-12 {
            flex: 1 1 100%;
            max-width: 100%;
            padding: 0;
        }

        @media (min-width: 768px) {
            .wpcf7-form .col-md-6,
            .wpcf7-form .col-lg-6 {
                flex: 1 1 calc(50% - 0.5rem);
                max-width: calc(50% - 0.5rem);
            }
        }

        /* — Reset input-filled wrapper — */
        .wpcf7-form .input-filled {
            width: 100%;
        }

        /* — CF7 control wrap (spans each input) — */
        .wpcf7-form .wpcf7-form-control-wrap {
            display: block;
            width: 100%;
        }

        /* — Input fields: text, email, tel — */
        .wpcf7-form input[type="text"],
        .wpcf7-form input[type="email"],
        .wpcf7-form input[type="tel"] {
            width: 100%;
            padding: 0.75rem 1rem;
            font-family: var(--font-body);
            font-size: 0.875rem;
            line-height: 1.5;
            color: var(--color-text-primary);
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            transition: var(--transition-fast);
            box-sizing: border-box;
            outline: none;
        }

        .wpcf7-form input[type="text"]:focus,
        .wpcf7-form input[type="email"]:focus,
        .wpcf7-form input[type="tel"]:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(50,89,143,0.15);
        }

        .wpcf7-form input[type="text"]::placeholder,
        .wpcf7-form input[type="email"]::placeholder,
        .wpcf7-form input[type="tel"]::placeholder {
            color: var(--color-text-muted);
            opacity: 0.7;
        }

        /* — Textarea — */
        .wpcf7-form textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            font-family: var(--font-body);
            font-size: 0.875rem;
            line-height: 1.5;
            color: var(--color-text-primary);
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            transition: var(--transition-fast);
            box-sizing: border-box;
            outline: none;
            min-height: 120px;
            resize: vertical;
        }

        .wpcf7-form textarea:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px rgba(50,89,143,0.15);
        }

        .wpcf7-form textarea::placeholder {
            color: var(--color-text-muted);
            opacity: 0.7;
        }

        /* — Submit button — */
        .wpcf7-form input.wpcf7-submit {
            width: 100%;
            padding: 0.875rem 1.5rem;
            font-family: var(--font-body);
            font-size: 1rem;
            font-weight: 600;
            color: var(--color-text-on-primary);
            background-color: var(--color-primary);
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            transition: var(--transition-smooth);
            box-shadow: var(--shadow-brand);
        }

        .wpcf7-form input.wpcf7-submit:hover {
            background-color: var(--color-primary-hover);
            transform: translateY(-1px);
        }

        .wpcf7-form input.wpcf7-submit:active {
            transform: translateY(0);
            box-shadow: none;
        }

        /* — Response output (success / error / spam) — */
        .wpcf7-form .wpcf7-response-output {
            margin: 1rem 0 0 0;
            padding: 0.75rem 1rem;
            font-family: var(--font-body);
            font-size: 0.875rem;
            border-radius: var(--radius);
            border: 1px solid;
        }

        /* Success */
        .wpcf7-form .wpcf7-mail-sent-ok,
        .wpcf7-form .wpcf7-form.sent .wpcf7-response-output {
            background-color: #ecfdf5;
            color: #065f46;
            border-color: #a7f3d0;
        }

        /* Validation error */
        .wpcf7-form .wpcf7-validation-errors,
        .wpcf7-form .wpcf7-form.invalid .wpcf7-response-output,
        .wpcf7-form .wpcf7-acceptance-missing {
            background-color: #fef2f2;
            color: #991b1b;
            border-color: #fecaca;
        }

        /* Spam */
        .wpcf7-form .wpcf7-spam-blocked {
            background-color: #fffbeb;
            color: #92400e;
            border-color: #fde68a;
        }

        /* — Inline validation tip (red text below field) — */
        .wpcf7-form .wpcf7-not-valid-tip {
            font-family: var(--font-body);
            font-size: 0.75rem;
            color: var(--color-danger);
            margin-top: 0.25rem;
        }

        /* — AJAX loader spacing — */
        .wpcf7-form .ajax-loader {
            margin-left: 0.5rem;
        }

        /* — Screen reader only (hidden from visual view) — */
        .wpcf7-form .screen-reader-response {
            clip: rect(1px, 1px, 1px, 1px);
            height: 1px;
            overflow: hidden;
            position: absolute !important;
            width: 1px;
        }
    </style>
    <?php
}, 30 );