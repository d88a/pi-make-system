<?php
/**
 * Template part: Category Grid (v8)
 *
 * Playfair Display + Source Serif 4, #32598f accent.
 * Photos: object-contain (D-134 — владелица: не обрезать).
 * Cards: rounded-2xl, border, hover lift.
 * Grid: 1-col mobile → 2-col sm → 4-col lg.
 *
 * @package stroymaks2026
 * @var array $args {
 *     @type string $heading    Section heading (Customizer / fallback).
 *     @type string $subtitle   Section subtitle (Customizer / fallback).
 *     @type int    $number     Max categories to show (default: 4).
 * }
 */

defined( 'ABSPATH' ) || exit;

$section_heading  = isset( $args['heading'] ) ? $args['heading'] : get_theme_mod( 'stroymaks2026_categories_heading', 'Каталог продукции' );
$section_subtitle = isset( $args['subtitle'] ) ? $args['subtitle'] : get_theme_mod( 'stroymaks2026_categories_subtitle', 'Четыре категории для любых задач благоустройства' );
$max_cats         = isset( $args['number'] ) ? (int) $args['number'] : 4;

// Get WC product categories
$categories = get_terms( [
    'taxonomy'   => 'product_cat',
    'hide_empty' => true,
    'number'     => $max_cats,
    'orderby'    => 'count',
    'order'      => 'DESC',
] );

$use_wc = ( ! is_wp_error( $categories ) && ! empty( $categories ) );
?>

<section class="bg-[var(--color-bg-page)] py-24" aria-labelledby="categories-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section header -->
        <div class="mx-auto max-w-2xl text-center">
            <h2 id="categories-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                <?php echo esc_html( $section_heading ); ?>
            </h2>
            <?php if ( $section_subtitle ) : ?>
                <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php echo esc_html( $section_subtitle ); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- Category cards grid -->
        <div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <?php if ( $use_wc ) : ?>
                <?php
                foreach ( $categories as $cat ) :
                    $cat_link = get_term_link( $cat );
                    if ( is_wp_error( $cat_link ) ) {
                        continue;
                    }

                    // Try to get category thumbnail
                    $thumbnail_id = get_term_meta( $cat->term_id, 'thumbnail_id', true );
                    $has_image    = ( $thumbnail_id && wp_get_attachment_image_url( $thumbnail_id, 'medium' ) );
                    ?>
                    <a href="<?php echo esc_url( $cat_link ); ?>"
                       class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                       style="border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
                       aria-label="<?php echo esc_attr( sprintf( __( 'Перейти в категорию %s', 'stroymaks2026' ), $cat->name ) ); ?>">
                        <!-- Photo -->
                        <div class="aspect-[4/3] bg-[var(--color-bg-alt)] overflow-hidden flex items-center justify-center">
                            <?php if ( $has_image ) : ?>
                                <img src="<?php echo esc_url( wp_get_attachment_image_url( $thumbnail_id, 'medium' ) ); ?>"
                                     alt="<?php echo esc_attr( $cat->name ); ?>"
                                     class="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                     loading="lazy">
                            <?php else : ?>
                                <svg class="h-16 w-16 text-[var(--color-primary)]/30 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/>
                                </svg>
                            <?php endif; ?>
                        </div>
                        <!-- Content -->
                        <div class="p-5">
                            <h3 class="font-display text-lg font-semibold text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                                <?php echo esc_html( $cat->name ); ?>
                            </h3>
                            <p class="mt-1 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                                <?php
                                // translators: %d: number of products in category
                                printf( esc_html( _n( '%d вид', '%d видов', $cat->count, 'stroymaks2026' ) ), (int) $cat->count );
                                ?>
                            </p>
                        </div>
                    </a>
                <?php endforeach; ?>

            <?php else : ?>
                <!-- Static fallback: 4 real categories (WC DB empty) -->
                <?php
                $fallback_cats = [
                    [
                        'name'  => 'Брусчатка тротуарная',
                        'count' => '9',
                        'link'  => home_url( '/shop' ),
                        'img'   => '',
                    ],
                    [
                        'name'  => 'Тротуарная плитка',
                        'count' => '7',
                        'link'  => home_url( '/shop' ),
                        'img'   => '',
                    ],
                    [
                        'name'  => 'Бордюры, водостоки',
                        'count' => '3',
                        'link'  => home_url( '/shop' ),
                        'img'   => '',
                    ],
                    [
                        'name'  => 'Памятники из бетона',
                        'count' => '3',
                        'link'  => home_url( '/shop' ),
                        'img'   => '',
                    ],
                ];
                foreach ( $fallback_cats as $fcat ) :
                    ?>
                    <a href="<?php echo esc_url( $fcat['link'] ); ?>"
                       class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
                       style="border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
                       aria-label="<?php echo esc_attr( sprintf( __( 'Перейти в категорию %s', 'stroymaks2026' ), $fcat['name'] ) ); ?>">
                        <!-- Photo placeholder -->
                        <div class="aspect-[4/3] bg-gradient-to-br from-[var(--color-bg-alt)] to-[var(--color-primary-subtle)] flex items-center justify-center overflow-hidden">
                            <svg class="h-16 w-16 text-[var(--color-primary)]/30 transition-transform duration-500 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"/>
                            </svg>
                        </div>
                        <!-- Content -->
                        <div class="p-5">
                            <h3 class="font-display text-lg font-semibold text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                                <?php echo esc_html( $fcat['name'] ); ?>
                            </h3>
                            <p class="mt-1 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                                <?php echo esc_html( $fcat['count'] ); ?> <?php esc_html_e( 'видов', 'stroymaks2026' ); ?>
                            </p>
                        </div>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <!-- All catalog link -->
        <?php $shop_page_id = wc_get_page_id( 'shop' ); ?>
        <?php if ( $shop_page_id ) : ?>
            <div class="mt-12 text-center">
                <a href="<?php echo esc_url( get_permalink( $shop_page_id ) ); ?>"
                   class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                   style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Смотреть весь каталог', 'stroymaks2026' ); ?>
                    <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            </div>
        <?php endif; ?>
    </div>
</section>