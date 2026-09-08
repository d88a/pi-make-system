<?php
/**
 * Variable Product — StroyMaks 2026 v8
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Catalog Mode: display-only variations, NO purchase (D-129).
 * Color/Size swatches: text buttons (rounded-2xl), NOT circles.
 * Dynamic price update on click.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;

if ( ! $product->is_type( 'variable' ) ) {
    return;
}

$variations = $product->get_available_variations();

if ( empty( $variations ) ) {
    return;
}

// D-163: sort variations by price ASC — cheapest first (owner request).
// First variation after sort = active button + #variant-price shows min price.
usort( $variations, function ( $a, $b ) {
    $pa = isset( $a['display_price'] ) ? (float) $a['display_price'] : 0;
    $pb = isset( $b['display_price'] ) ? (float) $b['display_price'] : 0;
    return $pa <=> $pb;
} );

$attributes = $product->get_variation_attributes();
?>

<div class="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6" style="border-radius: var(--radius);">
    <?php foreach ( $attributes as $attribute_name => $options ) : ?>
        <?php
        $attribute_label = wc_attribute_label( $attribute_name );
        $attr_name_lower = mb_strtolower( $attribute_label );
        ?>
        <div class="<?php echo ( $attr_name_lower !== 'цвет' && $attr_name_lower !== 'размер' && $attr_name_lower !== 'размеры' ) ? 'mb-6' : ''; ?>">
            <h3 class="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                <?php echo esc_html( $attribute_label ); ?>
            </h3>
            <div class="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="<?php echo esc_attr( $attribute_label ); ?>">
                <?php
                $var_first = true;
                foreach ( $variations as $index => $variation ) :
                    $var_id    = $variation['variation_id'];
                    $var_price = $variation['display_price'];
                    $var_attrs = $variation['attributes'] ?? [];
                    $var_label = '';

                    foreach ( $var_attrs as $attr_key => $attr_value ) {
                        if ( $attr_value ) {
                            $var_label = $attr_value;
                            break;
                        }
                    }
                    if ( ! $var_label ) {
                        $var_label = sprintf( __( 'Вариант %d', 'stroymaks2026' ), $var_id );
                    }

                    $active_border = $var_first ? 'var(--color-primary)' : 'var(--color-border)';
                    $active_bg     = $var_first ? 'var(--color-primary-subtle)' : 'var(--color-surface)';
                    $active_color  = $var_first ? 'var(--color-primary)' : 'var(--color-text-secondary)';
                    $active_class  = $var_first ? ' active' : '';
                    $aria_checked  = $var_first ? 'true' : 'false';
                    ?>
                    <button
                        class="color-swatch rounded-2xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]<?php echo esc_attr( $active_class ); ?>"
                        style="border-color: <?php echo esc_attr( $active_border ); ?>; background-color: <?php echo esc_attr( $active_bg ); ?>; color: <?php echo esc_attr( $active_color ); ?>; transition: var(--transition-fast);"
                        role="radio"
                        aria-checked="<?php echo esc_attr( $aria_checked ); ?>"
                        data-price="<?php echo esc_attr( $var_price ); ?>"
                        data-variant="<?php echo esc_attr( $var_id ); ?>"
                        data-label="<?php echo esc_attr( $var_label ); ?>"
                        type="button"
                    >
                        <?php echo esc_html( $var_label ); ?>
                    </button>
                    <?php $var_first = false; ?>
                <?php endforeach; ?>
            </div>
        </div>
    <?php endforeach; ?>

    <!-- Dynamic price display -->
    <div class="mt-6 border-t border-[var(--color-border)] pt-4">
        <span class="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
            <?php esc_html_e( 'Цена за м²', 'stroymaks2026' ); ?>
        </span>
        <div class="mt-1 flex items-baseline gap-2">
            <span id="variant-price" class="font-display text-3xl font-bold text-[var(--color-primary)] transition-all duration-300">
                <?php echo esc_html( $variations[0]['display_price'] ); ?>
            </span>
            <span class="text-lg text-[var(--color-text-muted)]">₽</span>
        </div>
        <p id="variant-label" class="mt-2 text-sm text-[var(--color-text-muted)]"></p>
    </div>
</div>

<style>
.color-swatch.active { border-color: var(--color-primary) !important; background-color: var(--color-primary-subtle) !important; color: var(--color-primary) !important; }
</style>

<script>
(function() {
    var swatches = document.querySelectorAll('.color-swatch');
    var priceEl = document.getElementById('variant-price');
    var labelEl = document.getElementById('variant-label');
    if (swatches.length && priceEl) {
        swatches.forEach(function(swatch) {
            swatch.addEventListener('click', function() {
                priceEl.style.opacity = '0';
                priceEl.style.transform = 'translateY(-8px)';
                setTimeout(function() {
                    priceEl.textContent = swatch.dataset.price;
                    priceEl.style.opacity = '1';
                    priceEl.style.transform = 'translateY(0)';
                }, 150);
                if (labelEl) labelEl.textContent = swatch.dataset.label;
                swatches.forEach(function(s) {
                    s.setAttribute('aria-checked', 'false');
                    s.classList.remove('active');
                    s.style.borderColor = 'var(--color-border)';
                    s.style.backgroundColor = 'var(--color-surface)';
                    s.style.color = 'var(--color-text-secondary)';
                });
                swatch.setAttribute('aria-checked', 'true');
                swatch.classList.add('active');
                swatch.style.borderColor = 'var(--color-primary)';
                swatch.style.backgroundColor = 'var(--color-primary-subtle)';
                swatch.style.color = 'var(--color-primary)';
            });
        });
    }
})();
</script>