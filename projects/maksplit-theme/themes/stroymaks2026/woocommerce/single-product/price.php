<?php
/**
 * Single Product Price — StroyMaks 2026 v8
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Playfair Display price, «По запросу» fallback for monuments.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;

$price_html = $product->get_price_html();
$price_raw  = $product->get_price();

// Monuments and products with empty/zero price → «По запросу»
if ( empty( $price_raw ) || (float) $price_raw <= 0 ) : ?>
    <div class="mt-6">
        <span class="price font-display text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
            <?php esc_html_e( 'По запросу', 'stroymaks2026' ); ?>
        </span>
    </div>
<?php else : ?>
    <div class="mt-6">
        <span class="price font-display text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
            <?php echo wp_kses_post( $price_html ); ?>
        </span>
        <span class="ml-1 text-sm text-[var(--color-text-muted)]">/ м²</span>
    </div>
<?php endif; ?>