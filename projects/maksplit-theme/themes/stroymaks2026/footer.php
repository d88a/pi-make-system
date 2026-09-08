<?php
/**
 * Footer template — StroyMaks 2026
 *
 * Dusty Slate design system: 4-column footer.
 * Brand + navigation + catalog + contacts + bottom bar.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;
?>

<!-- ============================================================ -->
<!-- FOOTER — Dusty Slate #32598f -->
<!-- Brand + navigation + catalog + contacts + bottom bar. -->
<!-- ============================================================ -->
<footer class="bg-[var(--color-bg-alt)] py-16" role="contentinfo">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- 4-column grid -->
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Column 1: Brand + tagline -->
            <div class="lg:col-span-1">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="inline-flex items-center gap-2 font-display text-xl font-bold text-[var(--color-text-primary)] transition-opacity duration-150 hover:opacity-80" aria-label="<?php bloginfo( 'name' ); ?> — <?php esc_attr_e( 'на главную', 'stroymaks2026' ); ?>">
                    <svg width="26" height="26" viewBox="0 0 28 28" fill="none" class="text-[var(--color-primary)]" aria-hidden="true">
                        <rect x="2" y="2" width="10" height="24" rx="1" fill="currentColor"/>
                        <rect x="16" y="2" width="10" height="24" rx="1" fill="currentColor" opacity="0.5"/>
                        <rect x="2" y="12" width="24" height="4" rx="1" fill="currentColor" opacity="0.7"/>
                    </svg>
                    <?php bloginfo( 'name' ); ?>
                </a>
                <p class="mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    <?php bloginfo( 'description' ); ?>
                </p>
                <div class="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--color-primary)]">
                    <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                    <?php esc_html_e( 'Принимаем заказы', 'stroymaks2026' ); ?>
                </div>
                <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-alt)]" style="box-shadow: var(--shadow-brand);">
                    <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                </a>
            </div>

            <!-- Column 2: Navigation -->
            <div>
                <h4 class="text-xs font-semibold tracking-wider uppercase text-[var(--color-text-muted)]"><?php esc_html_e( 'Навигация', 'stroymaks2026' ); ?></h4>
                <?php
                wp_nav_menu( [
                    'theme_location'  => 'footer',
                    'container'       => false,
                    'menu_class'      => 'mt-4 space-y-3',
                    'fallback_cb'     => false,
                    'depth'           => 1,
                    'items_wrap'      => '<ul class="%2$s">%3$s</ul>',
                    'link_before'     => '',
                    'link_after'      => '',
                ] );
                ?>
            </div>

            <!-- Column 3: Catalog links -->
            <div>
                <h4 class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]"><?php esc_html_e( 'Каталог', 'stroymaks2026' ); ?></h4>
                <ul class="mt-4 space-y-2.5">
                    <?php
                    // Get WC product categories for footer
                    $footer_categories = get_terms( [
                        'taxonomy'   => 'product_cat',
                        'hide_empty' => true,
                        'number'     => 4,
                        'orderby'    => 'count',
                        'order'      => 'DESC',
                    ] );

                    if ( ! is_wp_error( $footer_categories ) && ! empty( $footer_categories ) ) :
                        foreach ( $footer_categories as $cat ) :
                            ?>
                            <li><a href="<?php echo esc_url( get_term_link( $cat ) ); ?>" class="font-body text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"><?php echo esc_html( $cat->name ); ?></a></li>
                            <?php
                        endforeach;
                    endif;
                    ?>
                    <li><a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="font-body text-sm font-medium text-[var(--color-primary)] transition-colors duration-150 hover:text-[var(--color-primary-hover)]"><?php esc_html_e( 'Весь каталог', 'stroymaks2026' ); ?> →</a></li>
                </ul>
            </div>

            <!-- Column 4: Contacts -->
            <div>
                <h4 class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]"><?php esc_html_e( 'Контакты', 'stroymaks2026' ); ?></h4>
                <ul class="mt-4 space-y-3">
                    <li class="flex items-start gap-3">
                        <svg class="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                        <span class="text-sm text-[var(--color-text-secondary)]"><?php echo esc_html( get_theme_mod( 'stroymaks2026_address', 'г. Юрюзань, Челябинская область, Катав-Ивановский район, ул. Тимирязева, 15а' ) ); ?></span>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                        <a href="tel:<?php echo esc_attr( get_theme_mod( 'stroymaks2026_phone', '+79823416970' ) ); ?>" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"><?php echo esc_html( get_theme_mod( 'stroymaks2026_phone', '+7 982 341 69 70' ) ); ?></a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                        <a href="mailto:<?php echo esc_attr( get_theme_mod( 'stroymaks2026_email', 'maksimdyd@gmail.com' ) ); ?>" class="text-sm text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)]"><?php echo esc_html( get_theme_mod( 'stroymaks2026_email', 'maksimdyd@gmail.com' ) ); ?></a>
                    </li>
                    <li class="flex items-center gap-3">
                        <svg class="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        <span class="text-sm text-[var(--color-text-secondary)]"><?php esc_html_e( 'Пн-Пт 9:00–18:00', 'stroymaks2026' ); ?></span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-12 border-t border-[var(--color-border)] pt-8">
            <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p class="text-sm text-[var(--color-text-muted)]">
                    &copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'Все права защищены.', 'stroymaks2026' ); ?>
                </p>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>