<?php
/**
 * Loop Add to Cart — StroyMaks 2026 (v8)
 *
 * Catalog Mode (D-129): no purchase button.
 * Replaced with «Подробнее» → product permalink.
 * Rounded-2xl, Dusty Blue #32598f accent.
 *
 * Note: This template is a fallback. In functions.php,
 * WC loop purchase template is removed and
 * product-card.php handles the CTA button directly.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( ! $product instanceof WC_Product ) {
    return;
}

$product_link = get_permalink( $product->get_id() );
$product_name = $product->get_name();
?>

<a href="<?php echo esc_url( $product_link ); ?>"
   class="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] px-4 py-2 font-body text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
   style="font-family: var(--font-body); border-radius: var(--radius);"
   aria-label="<?php echo esc_attr( sprintf( __( 'Подробнее о %s', 'stroymaks2026' ), $product_name ) ); ?>">
    <?php esc_html_e( 'Подробнее', 'stroymaks2026' ); ?>
    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
    </svg>
</a>