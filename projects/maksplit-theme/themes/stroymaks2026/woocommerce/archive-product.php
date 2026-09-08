<?php
/**
 * Product Archive template — StroyMaks 2026 (v8)
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Playfair Display + Source Serif 4.
 * Catalog Mode: NO add_to_cart, enquiry → product page.
 * Filter: category pills (JS filter by product_cat data attribute).
 * Grid: 1→2→3→4 columns, rounded-2xl cards.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="bg-[var(--color-bg-page)]" role="main">

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- CATALOG HERO — Compact centered (v8) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="bg-[var(--color-bg-page)] py-20 lg:py-24" aria-labelledby="catalog-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">

                <?php woocommerce_breadcrumb(); ?>

                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Каталог', 'stroymaks2026' ); ?>
                </span>

                <h1 id="catalog-heading" class="mt-5 font-display text-4xl font-bold tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl" style="font-family: var(--font-display);">
                    <?php
                    $catalog_title = get_theme_mod( 'stroymaks2026_catalog_title', 'Каталог продукции' );
                    echo esc_html( $catalog_title );
                    ?>
                </h1>

                <?php
                $catalog_subtitle = get_theme_mod( 'stroymaks2026_catalog_subtitle', '' );
                if ( $catalog_subtitle ) :
                    ?>
                    <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php echo esc_html( $catalog_subtitle ); ?>
                    </p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- CATEGORY FILTER TABS — sticky, rounded-2xl (v8) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <?php
    $filter_cats = get_terms( [
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ] );
    if ( ! is_wp_error( $filter_cats ) && ! empty( $filter_cats ) ) :
        ?>
        <div class="sticky top-16 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg-page)]/90 backdrop-blur-md" role="tablist" aria-label="<?php esc_attr_e( 'Фильтр по категориям', 'stroymaks2026' ); ?>">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="flex flex-wrap items-center gap-2 py-4">
                    <button
                        class="filter-tab active rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-200"
                        style="font-family: var(--font-body);"
                        role="tab"
                        aria-selected="true"
                        aria-controls="product-grid"
                        data-filter="all"
                        type="button"
                    ><?php esc_html_e( 'Все', 'stroymaks2026' ); ?></button>
                    <?php foreach ( $filter_cats as $cat ) : ?>
                        <button
                            class="filter-tab rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                            style="font-family: var(--font-body);"
                            role="tab"
                            aria-selected="false"
                            aria-controls="product-grid"
                            data-filter="<?php echo esc_attr( $cat->slug ); ?>"
                            type="button"
                        ><?php echo esc_html( $cat->name ); ?></button>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    <?php endif; ?>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- PRODUCT GRID — WC Loop (v8) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section id="product-grid" class="bg-[var(--color-bg-page)] py-16" role="tabpanel" aria-label="<?php esc_attr_e( 'Сетка товаров', 'stroymaks2026' ); ?>">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <?php if ( woocommerce_product_loop() ) : ?>

                <!-- Toolbar: result count + ordering -->
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <div class="text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php woocommerce_result_count(); ?>
                    </div>
                    <div class="w-full sm:w-auto">
                        <?php woocommerce_catalog_ordering(); ?>
                    </div>
                </div>

                <?php
                woocommerce_product_loop_start();

                if ( wc_get_loop_prop( 'total' ) ) {
                    while ( have_posts() ) {
                        the_post();

                        /**
                         * Hook: woocommerce_shop_loop
                         *
                         * @hooked WC_Structured_Data::generate_product_data() - 10
                         */
                        do_action( 'woocommerce_shop_loop' );

                        wc_get_template_part( 'content', 'product' );
                    }
                }

                woocommerce_product_loop_end();
                ?>

                <?php woocommerce_pagination(); ?>

            <?php else : ?>
                <div class="text-center py-20">
                    <h2 class="font-display text-2xl font-bold text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Товары не найдены', 'stroymaks2026' ); ?>
                    </h2>
                    <p class="mt-4 text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'В этой категории пока нет товаров.', 'stroymaks2026' ); ?>
                    </p>
                    <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>"
                       class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 font-body text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]"
                       style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Весь каталог', 'stroymaks2026' ); ?>
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                </div>
            <?php endif; ?>

        </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- BOTTOM CTA — «Не нашли нужный вариант?» (v8) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="bg-[var(--color-bg-alt)] py-20" aria-labelledby="bottom-cta-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 id="bottom-cta-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Не нашли нужный вариант?', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Свяжитесь с нами — подберём продукцию под ваш проект и рассчитаем точную стоимость с доставкой', 'stroymaks2026' ); ?>
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>"
                       class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]"
                       style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <?php
                    $phone = get_theme_mod( 'stroymaks2026_phone', '+7 982 341 69 70' );
                    $phone_clean = preg_replace( '/[^+\d]/', '', $phone );
                    ?>
                    <a href="tel:<?php echo esc_attr( $phone_clean ); ?>"
                       class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                       style="font-family: var(--font-body);">
                        <?php echo esc_html( $phone ); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<!-- ═══════════════════════════════════════════════════════════════ -->
<!-- FILTER JS — v8 filter-tab style -->
<!-- ═══════════════════════════════════════════════════════════════ -->
<script>
(function() {
    var filterTabs = document.querySelectorAll('.filter-tab');
    var productGrid = document.getElementById('product-grid');
    if (!filterTabs.length || !productGrid) return;

    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Update active state
            filterTabs.forEach(function(t) {
                t.classList.remove('active');
                t.classList.add('border', 'border-[var(--color-border)]', 'bg-[var(--color-surface)]', 'text-[var(--color-text-secondary)]');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.classList.remove('border', 'border-[var(--color-border)]', 'bg-[var(--color-surface)]', 'text-[var(--color-text-secondary)]');
            tab.setAttribute('aria-selected', 'true');

            var filter = tab.getAttribute('data-filter');
            var cards = productGrid.querySelectorAll('[data-category]');

            cards.forEach(function(card) {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
})();
</script>

<style>
/* Filter tab active state — matches v8 catalog.html */
.filter-tab {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.filter-tab.active {
    background-color: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
}
/* Product card fade transition */
.product-card {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
/* WC pagination rounded-2xl */
.woocommerce-pagination ul.page-numbers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 2rem 0 0;
}
.woocommerce-pagination ul.page-numbers li .page-numbers {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0 0.75rem;
    border-radius: 1rem;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.woocommerce-pagination ul.page-numbers li .page-numbers:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}
.woocommerce-pagination ul.page-numbers li .page-numbers.current {
    background: var(--color-primary);
    color: var(--color-text-on-primary);
    border-color: var(--color-primary);
}
/* WC breadcrumbs */
.woocommerce-breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-text-muted);
}
.woocommerce-breadcrumb a {
    color: var(--color-text-secondary);
    text-decoration: none;
    transition: color 0.15s;
}
.woocommerce-breadcrumb a:hover {
    color: var(--color-primary);
}
/* WC catalog ordering — rounded-2xl select */
.woocommerce-ordering select {
    padding: 0.625rem 2.5rem 0.625rem 1rem;
    border-radius: 1rem;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-family: var(--font-body);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none'%3E%3Cpath d='M3 4.5l3 3 3-3' stroke='%23475569' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    transition: border-color 0.2s;
}
.woocommerce-ordering select:hover,
.woocommerce-ordering select:focus {
    border-color: var(--color-primary);
    outline: none;
}
/* WC product loop grid — v8 stagger-style */
ul.products {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    list-style: none;
    padding: 0;
    margin: 0;
}
@media (min-width: 640px) {
    ul.products { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
    ul.products { grid-template-columns: repeat(3, 1fr); }
}
@media (min-width: 1280px) {
    ul.products { grid-template-columns: repeat(4, 1fr); }
}
ul.products li.product {
    margin: 0;
    padding: 0;
    float: none;
    width: 100%;
}
</style>

<?php
get_footer();