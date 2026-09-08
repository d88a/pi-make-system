<?php
/**
 * Content Product — loop card wrapper (v8).
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Playfair Display + Source Serif 4.
 * Wraps product-card template-part in WC <li>.
 * Adds data-category for JS filtering (v8 filter-tab).
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( ! $product instanceof WC_Product ) {
    return;
}

// Get category slug for JS filter
$cats     = get_the_terms( $product->get_id(), 'product_cat' );
$cat_slug = ( ! empty( $cats ) && ! is_wp_error( $cats ) ) ? $cats[0]->slug : '';
?>
<li <?php wc_product_class( 'product-card rounded-2xl', $product ); ?> data-category="<?php echo esc_attr( $cat_slug ); ?>">
    <?php
    /**
     * Template part: product-card (v8) — Playfair, rounded-2xl, object-contain.
     * Handles: photo, category badge, title, short_desc, price + CTA.
     * Delegates:
     *   - get_name() for product title
     *   - get_price_html() for price display
     *   - get_permalink() for product link
     * Catalog Mode: «Подробнее» / «Рассчитать стоимость» (no add-to-cart).
     * «По запросу» for zero-price products (памятники).
     *
     * @see template-parts/product-card.php
     */
    get_template_part( 'template-parts/product-card' );
    ?>
</li>