<?php
/**
 * Header template — StroyMaks 2026
 *
 * Dusty Slate design system: sticky nav, Dusty Blue #32598f accent, Playfair Display.
 * Uses wp_nav_menu() for primary navigation.
 * Mobile hamburger menu with JS toggle.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'font-body min-h-screen antialiased' ); ?>>
<?php wp_body_open(); ?>

<!-- ============================================================ -->
<!-- NAVIGATION — Dusty Slate #32598f -->
<!-- Sticky, backdrop-blur, border-b. -->
<!-- ============================================================ -->
<header class="sticky top-0 z-50 h-16 border-b border-[var(--color-border)] bg-[var(--color-bg-page)]/80 backdrop-blur-md" role="banner">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="<?php esc_attr_e( 'Основная навигация', 'stroymaks2026' ); ?>">
        <!-- Logo -->
        <?php if ( has_custom_logo() ) : ?>
            <div class="shrink-0">
                <?php the_custom_logo(); ?>
            </div>
        <?php else : ?>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-center gap-3 font-display text-xl font-bold text-[var(--color-text-primary)] transition-opacity duration-150 hover:opacity-80" aria-label="<?php bloginfo( 'name' ); ?> — <?php esc_attr_e( 'на главную', 'stroymaks2026' ); ?>">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" class="text-[var(--color-primary)]" aria-hidden="true">
                    <rect x="2" y="2" width="10" height="24" rx="1" fill="currentColor"/>
                    <rect x="16" y="2" width="10" height="24" rx="1" fill="currentColor" opacity="0.5"/>
                    <rect x="2" y="12" width="24" height="4" rx="1" fill="currentColor" opacity="0.7"/>
                </svg>
                <span class="tracking-tight"><?php bloginfo( 'name' ); ?></span>
            </a>
        <?php endif; ?>

        <!-- Desktop menu -->
        <?php
        wp_nav_menu( [
            'theme_location'  => 'primary',
            'container'       => 'div',
            'container_class' => 'hidden items-center gap-5 lg:flex',
            'menu_class'      => 'flex items-center gap-5',
            'fallback_cb'     => 'stroymaks2026_fallback_menu_desktop',
            'depth'           => 1,
            'link_before'     => '',
            'link_after'      => '',
            'walker'          => new Stroymaks2026_Nav_Walker(),
        ] );
        ?>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
            <a href="tel:<?php echo esc_attr( get_theme_mod( 'stroymaks2026_phone', '+79823416970' ) ); ?>" class="hidden items-center gap-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-text-primary)] lg:flex">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                </svg>
                <?php echo esc_html( get_theme_mod( 'stroymaks2026_phone', '+7 982 341 69 70' ) ); ?>
            </a>
            <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="rounded-2xl bg-[var(--color-primary)] px-5 py-2.5 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg-page)]" style="box-shadow: var(--shadow-brand);">
                <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
            </a>
            <!-- Mobile hamburger -->
            <button id="mobile-toggle" class="rounded-2xl p-2 text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-text-primary)] lg:hidden" aria-label="<?php esc_attr_e( 'Открыть меню', 'stroymaks2026' ); ?>" aria-expanded="false" aria-controls="mobile-menu">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                </svg>
            </button>
        </div>
    </nav>

    <!-- Mobile menu -->
    <div id="mobile-menu" class="hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] lg:hidden" role="menu" aria-label="<?php esc_attr_e( 'Мобильное меню', 'stroymaks2026' ); ?>">
        <div class="space-y-1 px-4 py-4">
            <?php
            wp_nav_menu( [
                'theme_location'  => 'primary',
                'container'       => false,
                'menu_class'      => 'flex flex-col space-y-1',
                'fallback_cb'     => 'stroymaks2026_fallback_menu_mobile',
                'depth'           => 1,
                'items_wrap'      => '%3$s',
                'link_before'     => '',
                'link_after'      => '',
                'walker'          => new Stroymaks2026_Mobile_Nav_Walker(),
            ] );
            ?>
            <a href="tel:<?php echo esc_attr( get_theme_mod( 'stroymaks2026_phone', '+79823416970' ) ); ?>" class="flex items-center gap-2 rounded-2xl px-3 py-2.5 font-body text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-bg-alt)]" role="menuitem">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                <?php echo esc_html( get_theme_mod( 'stroymaks2026_phone', '+7 982 341 69 70' ) ); ?>
            </a>
        </div>
    </div>
</header>

<script>
(function() {
    var toggle = document.getElementById('mobile-toggle');
    var menu = document.getElementById('mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            menu.classList.toggle('hidden');
        });
    }
})();
</script>