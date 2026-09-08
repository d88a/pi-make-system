<?php
/**
 * Front Page — StroyMaks 2026 (v8)
 *
 * Playfair Display + Source Serif 4, #32598f accent.
 * Sections: hero → features → category-grid → popular products → lead CTA.
 * Alternating backgrounds: page → alt → page → alt → page.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="bg-[var(--color-bg-page)]" role="main" id="main-content">

    <!-- Skip-link target (link in header) -->
    <div id="skip-to-content" tabindex="-1"></div>

    <!-- Hero Section -->
    <section class="bg-[var(--color-bg-page)]" aria-label="<?php esc_attr_e( 'Главный баннер', 'stroymaks2026' ); ?>">
        <?php get_template_part( 'template-parts/hero' ); ?>
    </section>

    <!-- Features Section -->
    <section class="bg-[var(--color-bg-alt)]" aria-label="<?php esc_attr_e( 'Преимущества', 'stroymaks2026' ); ?>">
        <?php get_template_part( 'template-parts/features' ); ?>
    </section>

    <!-- Category Grid -->
    <section class="bg-[var(--color-bg-page)]" aria-label="<?php esc_attr_e( 'Категории продукции', 'stroymaks2026' ); ?>">
        <?php get_template_part( 'template-parts/category-grid' ); ?>
    </section>

    <!-- Popular Products (WC loop: 6 newest) -->
    <?php
    $popular_products = wc_get_products( [
        'limit'    => 6,
        'orderby'  => 'date',
        'order'    => 'DESC',
        'status'   => 'publish',
        'return'   => 'objects',
    ] );

    if ( ! empty( $popular_products ) ) :
        ?>
        <section class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="popular-heading">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div class="mx-auto max-w-2xl text-center">
                    <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                        <?php esc_html_e( 'Продукция', 'stroymaks2026' ); ?>
                    </span>
                    <h2 id="popular-heading" class="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                        <?php echo esc_html( get_theme_mod( 'stroymaks2026_popular_heading', 'Популярная продукция' ) ); ?>
                    </h2>
                </div>

                <div class="stagger mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <?php
                    foreach ( $popular_products as $popular_product ) :
                        // Set global product for template-part
                        global $post;
                        $post = get_post( $popular_product->get_id() );
                        setup_postdata( $post );

                        // Override global $product for product-card template
                        $GLOBALS['product'] = $popular_product;
                        ?>
                        <div class="reveal">
                            <?php get_template_part( 'template-parts/product-card' ); ?>
                        </div>
                        <?php
                    endforeach;
                    wp_reset_postdata();
                    ?>
                </div>

                <div class="mt-12 text-center">
                    <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>"
                       class="inline-flex items-center gap-2 font-body text-base font-medium text-[var(--color-primary)] transition-all duration-200 hover:text-[var(--color-primary-hover)] hover:gap-3"
                       style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Весь каталог', 'stroymaks2026' ); ?>
                        <svg class="h-5 w-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    <?php endif; // End popular products section — hidden if DB empty ?>

    <!-- Latest Blog Posts -->
    <?php get_template_part( 'template-parts/latest-posts' ); ?>

    <!-- Lead CTA -->
    <section class="bg-[var(--color-bg-page)]" aria-label="<?php esc_attr_e( 'Форма заявки', 'stroymaks2026' ); ?>">
        <?php get_template_part( 'template-parts/lead-form', null, [ 'id' => 'home' ] ); ?>
    </section>

</main>

<style>
.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
}
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 80ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 160ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 240ms; }
.stagger > .reveal:nth-child(5) { transition-delay: 320ms; }
.stagger > .reveal:nth-child(6) { transition-delay: 400ms; }
</style>

<script>
(function() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
})();
</script>

<?php
get_footer();