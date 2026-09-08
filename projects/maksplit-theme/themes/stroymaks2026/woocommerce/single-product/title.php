<?php
/**
 * Single Product Title — StroyMaks 2026 v8
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Playfair Display H1, no text-shadow, responsive sizing.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;
?>
<h1 class="product_title entry-title font-display text-3xl font-bold leading-[1.12] tracking-[-0.01em] text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl">
    <?php echo esc_html( get_the_title() ); ?>
</h1>