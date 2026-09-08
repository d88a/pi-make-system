<?php
/**
 * Main template fallback — StroyMaks 2026
 *
 * Used when no more specific template matches.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
            ?>
            <article <?php post_class( 'max-w-3xl' ); ?>>
                <h1 class="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
                    <?php the_title(); ?>
                </h1>
                <div class="mt-8 prose max-w-none text-[var(--color-text-secondary)]">
                    <?php the_content(); ?>
                </div>
            </article>
            <?php
        endwhile;
    else :
        ?>
        <div class="text-center py-20">
            <h1 class="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                <?php esc_html_e( 'Ничего не найдено', 'stroymaks2026' ); ?>
            </h1>
            <p class="mt-4 text-[var(--color-text-secondary)]">
                <?php esc_html_e( 'Запрошенная страница не существует или была перемещена.', 'stroymaks2026' ); ?>
            </p>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 font-body text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]">
                <?php esc_html_e( 'На главную', 'stroymaks2026' ); ?>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </a>
        </div>
        <?php
    endif;
    ?>
</main>

<?php
get_footer();