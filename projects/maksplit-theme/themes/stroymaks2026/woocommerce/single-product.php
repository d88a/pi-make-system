<?php
/**
 * Single Product template — StroyMaks 2026 v8
 *
 * Dusty Slate design system, Dusty Blue #32598f accent.
 * Asymmetric split: gallery 2/5 + info 3/5.
 * Catalog Mode: NO add_to_cart, CTA → calculator (D-129).
 * Gallery: object-contain, rounded-2xl.
 * Playfair Display, cubic-bezier transitions.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

// Remove default enquiry button — we add styled CTAs below
remove_action( 'woocommerce_single_product_summary', 'stroymaks2026_enquiry_button', 30 );

get_header();
?>

<main class="bg-[var(--color-bg-page)]" role="main">

    <?php while ( have_posts() ) : the_post(); ?>
        <?php global $product; ?>

        <!-- Breadcrumbs -->
        <?php
        woocommerce_breadcrumb( [
            'delimiter'   => ' <span class="mx-1 text-[var(--color-border)]" aria-hidden="true">/</span> ',
            'wrap_before' => '<nav class="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8" aria-label="' . esc_attr__( 'Хлебные крошки', 'stroymaks2026' ) . '"><div class="flex flex-wrap items-center text-sm" style="font-family: var(--font-body);">',
            'wrap_after'  => '</div></nav>',
            'home'        => esc_html__( 'Главная', 'stroymaks2026' ),
        ] );
        ?>

        <!-- Product asymmetric split: gallery 2/5 + info 3/5 -->
        <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="product-heading">
            <div class="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">

                <!-- GALLERY COLUMN (2/5) -->
                <div class="lg:col-span-2">
                    <?php
                    /**
                     * Hook: woocommerce_before_single_product_summary
                     *
                     * @hooked woocommerce_show_product_sale_flash - 10
                     * @hooked woocommerce_show_product_images  - 20
                     */
                    do_action( 'woocommerce_before_single_product_summary' );
                    ?>
                </div>

                <!-- INFO COLUMN (3/5) -->
                <div class="flex flex-col lg:col-span-3">

                    <!-- Category badge -->
                    <?php $cat_list = wc_get_product_category_list( $product->get_id(), ', ' ); ?>
                    <?php if ( $cat_list ) : ?>
                        <span class="inline-flex w-fit rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium text-[var(--color-primary)]" style="font-family: var(--font-body);">
                            <?php echo wp_kses_post( strip_tags( $cat_list ) ); ?>
                        </span>
                    <?php endif; ?>

                    <?php
                    /**
                     * Hook: woocommerce_single_product_summary
                     *
                     * @hooked woocommerce_template_single_title       - 5
                     * @hooked woocommerce_template_single_rating      - 10
                     * @hooked woocommerce_template_single_price       - 10
                     * @hooked woocommerce_template_single_excerpt     - 20
                     * @hooked woocommerce_template_single_meta        - 40
                     * (enquiry_button removed — Catalog Mode CTAs below)
                     */
                    do_action( 'woocommerce_single_product_summary' );
                    ?>

                    <?php
                    /**
                     * Color swatch picker (variable products only) — D-161: restored per owner request.
                     * Variable product variations → красивый блок выбора цвета с динамической ценой.
                     * @see woocommerce/single-product/add-to-cart/variable.php
                     */
                    if ( $product->is_type( 'variable' ) ) {
                        get_template_part( 'woocommerce/single-product/add-to-cart/variable' );
                    }
                    ?>

                    <!-- CTA buttons: Catalog Mode — NO «В корзину»/«Купить» (D-129) -->
                    <div class="mt-8 flex flex-wrap gap-4">
                        <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>"
                           class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]"
                           style="box-shadow: var(--shadow-brand); transition: var(--transition-smooth); font-family: var(--font-body);">
                            <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                            <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                        <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>"
                           class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                           style="transition: var(--transition-smooth); font-family: var(--font-body);">
                            <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
                            </svg>
                            <?php esc_html_e( 'Назад в каталог', 'stroymaks2026' ); ?>
                        </a>
                    </div>

                    <!-- Delivery info -->
                    <p class="mt-6 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                        <?php
                        printf(
                            /* translators: %s: production address */
                            esc_html__( 'Производство: %s. Доставка по всей России.', 'stroymaks2026' ),
                            esc_html( get_theme_mod( 'stroymaks2026_address', 'г. Юрюзань, Челябинская обл.' ) )
                        );
                        ?>
                    </p>
                </div><!-- .lg:col-span-3 -->
            </div>
        </section>

        <!-- Description (custom — replaces WC tabs) -->
        <?php
        $product_content = get_the_content();
        if ( ! empty( trim( $product_content ) ) ) :
            // Remove <h1> (title already in single-product header)
            $product_content = preg_replace( '/<h1[^>]*>.*?<\/h1>\s*/is', '', $product_content );
            // Remove other h2-h3 heading duplicates
            $product_content = preg_replace( '/<h[2-3][^>]*>.*?<\/h[2-3]>\s*/is', '', $product_content );
            $product_content = trim( $product_content );
            // Split into paragraphs if >2 sentences AND no existing paragraph breaks
            $sentence_count = preg_match_all( '/(?<=[.!?])\s+[А-ЯA-Z]/u', $product_content );
            if ( $sentence_count >= 2 && strpos( $product_content, "\n\n" ) === false ) {
                $sentences = preg_split( '/(?<=\.)\s+/', $product_content );
                $paras = array_chunk( $sentences, 2 );
                $product_content = '';
                foreach ( $paras as $para ) {
                    $product_content .= '<p>' . implode( ' ', $para ) . '</p>' . "\n\n";
                }
            } else {
                $product_content = wpautop( $product_content );
            }
            $formatted = wptexturize( $product_content );
            ?>
            <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="desc-heading">
                <h2 id="desc-heading" class="font-display text-2xl font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Описание', 'stroymaks2026' ); ?></h2>
                <div class="mt-4 max-w-3xl text-[var(--color-text-secondary)] leading-relaxed prose-style" style="font-family: var(--font-body);">
                    <?php echo wp_kses_post( $formatted ); ?>
                </div>
            </section>
        <?php endif; ?>

        <!-- Unified Characteristics table (D-161): owner-requested format — все поля в одной таблице.
             Цвет/Размеры/Толщина/Кол-во/Размер+Цена/Категория/Цена/Наличие.
             Заменило 3 блока: dl параметров + color_prices таблицу + size_prices таблицу + fallback. -->
        <?php $excerpt_specs = stroymaks2026_parse_excerpt_specs( get_the_excerpt() ); ?>

        <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" aria-labelledby="specs-heading">
            <h2 id="specs-heading" class="font-display text-2xl font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Характеристики', 'stroymaks2026' ); ?></h2>
            <div class="mt-4 max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border)]" style="border-radius: var(--radius);">
                <table class="w-full text-left text-sm" style="font-family: var(--font-body);">
                    <tbody>
                        <?php
                        // Build spec rows: label => value (HTML flag for Цена).
                        $spec_rows = [];

                        // Цвет: variable → variation attributes «Цвет»; simple → excerpt color_prices names.
                        $color_value = '';
                        if ( $product->is_type( 'variable' ) ) {
                            $variation_attrs = $product->get_variation_attributes();
                            foreach ( $variation_attrs as $attr_name => $options ) {
                                if ( mb_strtolower( wc_attribute_label( $attr_name ) ) === 'цвет' ) {
                                    $color_value = implode( ', ', $options );
                                    break;
                                }
                            }
                        }
                        if ( ! $color_value && ! empty( $excerpt_specs['color_prices'] ) ) {
                            $color_names = [];
                            foreach ( $excerpt_specs['color_prices'] as $cp ) {
                                $color_names[] = $cp['color'];
                            }
                            $color_value = implode( ', ', $color_names );
                        }
                        if ( $color_value ) {
                            $spec_rows[ __( 'Цвет', 'stroymaks2026' ) ] = $color_value;
                        }

                        // Размеры, мм (excerpt)
                        if ( ! empty( $excerpt_specs['sizes'] ) ) {
                            $spec_rows[ __( 'Размеры, мм', 'stroymaks2026' ) ] = implode( ', ', $excerpt_specs['sizes'] );
                        }
                        // Толщина, мм (excerpt)
                        if ( ! empty( $excerpt_specs['thickness'] ) ) {
                            $spec_rows[ __( 'Толщина, мм', 'stroymaks2026' ) ] = $excerpt_specs['thickness'];
                        }
                        // Кол-во в 1 м² (excerpt)
                        if ( ! empty( $excerpt_specs['qty'] ) ) {
                            $spec_rows[ __( 'Кол-во в 1 м²', 'stroymaks2026' ) ] = $excerpt_specs['qty'];
                        }
                        // Размер → Цена (bordyury size_prices)
                        if ( ! empty( $excerpt_specs['size_prices'] ) ) {
                            $size_lines = [];
                            foreach ( $excerpt_specs['size_prices'] as $sp ) {
                                $size_lines[] = $sp['size'] . ' — ' . $sp['price'];
                            }
                            $spec_rows[ __( 'Размеры и цены', 'stroymaks2026' ) ] = implode( '; ', $size_lines );
                        }
                        // Категория
                        $cat_list = wc_get_product_category_list( $product->get_id(), ', ' );
                        if ( $cat_list ) {
                            $spec_rows[ __( 'Категория', 'stroymaks2026' ) ] = strip_tags( $cat_list );
                        }
                        // Цена (WC HTML — range для variable; «По запросу» для 0)
                        if ( $product->get_price() > 0 ) {
                            $price_html = $product->get_price_html();
                            if ( $price_html ) {
                                $spec_rows[ __( 'Цена', 'stroymaks2026' ) ] = $price_html;
                            }
                        } else {
                            $spec_rows[ __( 'Цена', 'stroymaks2026' ) ] = __( 'По запросу', 'stroymaks2026' );
                        }


                        // Render rows
                        $price_label = __( 'Цена', 'stroymaks2026' );
                        foreach ( $spec_rows as $label => $value ) :
                            $is_html = ( $label === $price_label );
                            ?>
                            <tr class="border-b border-[var(--color-border)] last:border-0">
                                <td class="bg-[var(--color-bg-alt)] px-5 py-3 font-medium text-[var(--color-text-primary)] w-1/3"><?php echo esc_html( $label ); ?></td>
                                <td class="px-5 py-3 text-[var(--color-text-secondary)]"><?php echo $is_html ? wp_kses_post( $value ) : esc_html( $value ); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <!-- Related products -->
        <?php
        $related_ids = wc_get_related_products( $product->get_id(), 4 );
        if ( ! empty( $related_ids ) ) :
            $related_args = [
                'post_type'      => 'product',
                'post_status'    => 'publish',
                'post__in'       => $related_ids,
                'posts_per_page' => 4,
                'orderby'        => 'post__in',
            ];
            $related_loop = new WP_Query( $related_args );
            if ( $related_loop->have_posts() ) :
        ?>
        <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mb-16" aria-labelledby="related-heading">
            <h2 id="related-heading" class="font-display text-2xl font-semibold text-[var(--color-text-primary)] mb-6"><?php esc_html_e( 'Похожие товары', 'stroymaks2026' ); ?></h2>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <?php
                while ( $related_loop->have_posts() ) : $related_loop->the_post();
                    wc_get_template_part( 'content', 'product' );
                endwhile;
                ?>
            </div>
        </section>
        <?php
                wp_reset_postdata();
            endif;
        endif;
        ?>

    <?php endwhile; ?>

</main>

<?php
get_footer();