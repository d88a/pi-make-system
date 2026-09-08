<?php
/**
 * Template part: Product Card (v8, WC Catalog Mode)
 *
 * Playfair Display + Source Serif 4, #32598f accent.
 * Photos: object-contain (D-134 — владелица: не обрезать).
 * Cards: rounded-2xl, border, hover lift with shadow-brand.
 * Price: get_price_html() (WC dynamic). «По запросу» for памятники.
 *
 * @package stroymaks2026
 * @var WC_Product $product  Global WC product object.
 */

defined( 'ABSPATH' ) || exit;

global $product;
if ( ! $product instanceof WC_Product ) {
    return;
}

$product_id    = $product->get_id();
$product_name  = $product->get_name();
$product_link  = get_permalink( $product_id );
$has_price     = ( '' !== $product->get_price() && $product->get_price() > 0 );
$price_html    = $product->get_price_html();
$short_desc    = $product->get_short_description();
$category_list = wc_get_product_category_list( $product_id, ', ' );
?>

<article class="product-card group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
         style="border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
         role="article"
         aria-label="<?php echo esc_attr( $product_name ); ?>">

    <!-- Photo: object-contain, aspect-square -->
    <div class="aspect-square bg-[var(--color-bg-alt)] flex items-center justify-center p-6">
        <?php if ( has_post_thumbnail( $product_id ) ) : ?>
            <a href="<?php echo esc_url( $product_link ); ?>" class="block w-full h-full" aria-label="<?php echo esc_attr( $product_name ); ?>">
                <?php echo get_the_post_thumbnail( $product_id, 'medium', [
                    'class'   => 'w-full h-full object-contain transition-transform duration-500 group-hover:scale-105',
                    'loading' => 'lazy',
                    'alt'     => esc_attr( $product_name ),
                ] ); ?>
            </a>
        <?php else : ?>
            <span class="text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                <?php esc_html_e( 'Нет фото', 'stroymaks2026' ); ?>
            </span>
        <?php endif; ?>
    </div>

    <!-- Card content -->
    <div class="p-6 flex flex-col flex-1">
        <!-- Category badge -->
        <?php if ( $category_list ) : ?>
            <span class="inline-flex self-start rounded-2xl bg-[var(--color-primary-subtle)] px-3 py-0.5 text-xs font-medium text-[var(--color-primary)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                <?php echo wp_kses_post( $category_list ); ?>
            </span>
        <?php endif; ?>

        <!-- Product name -->
        <h3 class="mt-3 font-display text-lg font-semibold leading-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
            <?php echo esc_html( $product_name ); ?>
        </h3>

        <!-- Short description УБРАНО из карточки (D-158): post_excerpt = характеристики, выводятся только на странице товара в структурированной таблице. В карточке повтор → «Серый/Цветной/Размеры» 5× на странице. -->

        <!-- Price + CTA row -->
        <div class="mt-auto pt-4 flex items-center justify-between">
            <?php if ( $has_price ) : ?>
                <span class="text-base font-bold text-[var(--color-primary)]" style="font-family: var(--font-body);">
                    <?php echo $price_html; // WC price HTML already escaped ?>
                </span>
                <a href="<?php echo esc_url( $product_link ); ?>"
                   class="rounded-2xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                   style="font-family: var(--font-body); border-radius: var(--radius);">
                    <?php esc_html_e( 'Подробнее', 'stroymaks2026' ); ?>
                </a>
            <?php else : ?>
                <span class="text-sm font-medium text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Цена по запросу', 'stroymaks2026' ); ?>
                </span>
                <a href="<?php echo esc_url( $product_link ); ?>"
                   class="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]"
                   style="font-family: var(--font-body); border-radius: var(--radius);">
                    <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                </a>
            <?php endif; ?>
        </div>
    </div>
</article>