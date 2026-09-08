<?php
/**
 * Single Product Image — StroyMaks 2026 v8
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Gallery: object-contain (НЕ crop), rounded-2xl, sticky.
 * Thumbnails: rounded-2xl, object-contain.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

global $product;

$product_id        = $product->get_id();
$gallery_image_ids = $product->get_gallery_image_ids();
$main_image_id     = get_post_thumbnail_id( $product_id );
$main_image_url    = $main_image_id ? wp_get_attachment_image_url( $main_image_id, 'large' ) : wc_placeholder_img_src( 'large' );
$main_image_alt    = $main_image_id ? ( get_post_meta( $main_image_id, '_wp_attachment_image_alt', true ) ?: $product->get_name() ) : $product->get_name();
?>

<div class="sticky top-24 space-y-4">
    <!-- Main image: object-contain, rounded-2xl -->
    <div class="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]" style="border-radius: var(--radius);">
        <?php if ( $main_image_id ) : ?>
            <img
                id="main-photo"
                src="<?php echo esc_url( $main_image_url ); ?>"
                alt="<?php echo esc_attr( $main_image_alt ); ?>"
                class="w-full aspect-square object-contain"
                loading="eager"
                width="800"
                height="800"
            />
        <?php else : ?>
            <div class="flex aspect-square items-center justify-center">
                <span class="text-sm text-[var(--color-text-muted)]"><?php esc_html_e( 'Нет фото', 'stroymaks2026' ); ?></span>
            </div>
        <?php endif; ?>
    </div>

    <!-- Thumbnails row: rounded-2xl, object-contain -->
    <?php
    // Build thumbnail list: main image first, then gallery images (no duplicates)
    $all_thumb_ids = $main_image_id ? array_merge( [ $main_image_id ], $gallery_image_ids ) : $gallery_image_ids;
    $all_thumb_ids = array_unique( $all_thumb_ids );
    ?>
    <?php if ( ! empty( $all_thumb_ids ) ) : ?>
        <div class="flex gap-3 overflow-x-auto pb-1" role="list" aria-label="<?php esc_attr_e( 'Галерея изображений', 'stroymaks2026' ); ?>">
            <?php
            $is_first = true;
            $thumb_counter = 0;
            foreach ( $all_thumb_ids as $gallery_image_id ) :
                $thumb_counter++;
                $thumb_url = wp_get_attachment_image_url( $gallery_image_id, 'thumbnail' );
                $full_url  = wp_get_attachment_image_url( $gallery_image_id, 'large' );
                $thumb_alt = get_post_meta( $gallery_image_id, '_wp_attachment_image_alt', true ) ?: $product->get_name();
                if ( ! $thumb_url ) {
                    continue;
                }
                $active_border = $is_first ? 'var(--color-primary)' : 'transparent';
                $active_opacity = $is_first ? ' opacity-100' : ' opacity-60';
                $aria_current = $is_first ? 'true' : 'false';
                ?>
                <button
                    class="gallery-thumb flex-shrink-0 h-16 w-16 overflow-hidden rounded-2xl border-2 bg-[var(--color-bg-alt)] transition-all duration-200 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2<?php echo esc_attr( $active_opacity ); ?>"
                    style="border-color: <?php echo esc_attr( $active_border ); ?>; transition: var(--transition-fast);"
                    data-src="<?php echo esc_url( $full_url ); ?>"
                    data-alt="<?php echo esc_attr( $thumb_alt ); ?>"
                    aria-label="<?php echo esc_attr( sprintf( __( 'Фото %d', 'stroymaks2026' ), $thumb_counter ) ); ?>"
                    aria-current="<?php echo esc_attr( $aria_current ); ?>"
                    role="listitem"
                    type="button"
                >
                    <img src="<?php echo esc_url( $thumb_url ); ?>" alt="" class="h-full w-full object-contain" loading="lazy" width="64" height="64" />
                </button>
                <?php $is_first = false; ?>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<style>
.gallery-thumb.active { border-color: var(--color-primary) !important; opacity: 1; }
</style>

<script>
(function() {
    var mainPhoto = document.getElementById('main-photo');
    var thumbs = document.querySelectorAll('.gallery-thumb');
    if (mainPhoto && thumbs.length) {
        thumbs.forEach(function(btn) {
            btn.addEventListener('click', function() {
                mainPhoto.src = btn.dataset.src;
                mainPhoto.alt = btn.dataset.alt;
                thumbs.forEach(function(b) {
                    b.classList.remove('active');
                    b.style.borderColor = 'transparent';
                    b.setAttribute('aria-current', 'false');
                });
                btn.classList.add('active');
                btn.style.borderColor = 'var(--color-primary)';
                btn.setAttribute('aria-current', 'true');
            });
        });
    }
})();
</script>