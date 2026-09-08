<?php
/**
 * Category Archive template — StroyMaks 2026
 *
 * Dusty Slate: blog archive grid (/category/novosti/).
 * Card layout: icon 📰 + date + title + excerpt + «Читать →».
 * Uses var(--color-*) tokens, border NOT shadow on cards.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();

// Detect category slug for custom heading
$current_cat    = get_queried_object();
$archive_title  = __( 'Статьи', 'stroymaks2026' );
$archive_sub    = __( 'Полезные материалы о тротуарной плитке, брусчатке и укладке', 'stroymaks2026' );

if ( $current_cat && isset( $current_cat->slug ) && $current_cat->slug === 'novosti' ) {
    $archive_title = __( 'Статьи', 'stroymaks2026' );
} elseif ( is_category() ) {
    $archive_title = single_cat_title( '', false );
}
?>

<main class="bg-[var(--color-bg-page)] pt-20 pb-20 lg:pt-28" role="main">

    <!-- Archive Header -->
    <header class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 class="font-display text-4xl font-bold tracking-tight text-[var(--color-text-primary)] lg:text-5xl">
            <?php echo esc_html( $archive_title ); ?>
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-[var(--color-text-secondary)]">
            <?php echo esc_html( $archive_sub ); ?>
        </p>
    </header>

    <!-- Posts Grid -->
    <?php if ( have_posts() ) : ?>
        <div class="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                <?php
                while ( have_posts() ) :
                    the_post();
                    ?>
                    <article class="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:shadow-[var(--shadow-card)]">
                        <!-- Icon -->
                        <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-bg-alt)] text-2xl">
                            📰
                        </div>

                        <!-- Date -->
                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"
                              class="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            <?php echo esc_html( get_the_date() ); ?>
                        </time>

                        <!-- Title -->
                        <h2 class="mt-2 font-display text-lg font-semibold leading-tight text-[var(--color-text-primary)]">
                            <a href="<?php the_permalink(); ?>" class="transition-colors duration-150 hover:text-[var(--color-primary)]">
                                <?php the_title(); ?>
                            </a>
                        </h2>

                        <!-- Excerpt -->
                        <p class="mt-2 flex-grow text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            <?php
                            $excerpt = get_the_excerpt();
                            if ( empty( trim( $excerpt ) ) ) {
                                $excerpt = wp_trim_words( get_the_content(), 20 );
                            } else {
                                $excerpt = wp_trim_words( $excerpt, 20 );
                            }
                            echo esc_html( $excerpt );
                            ?>
                        </p>

                        <!-- Read more -->
                        <a href="<?php the_permalink(); ?>"
                           class="mt-4 self-start text-sm font-medium text-[var(--color-primary)] transition-colors duration-150 hover:text-[var(--color-primary-hover)]">
                            <?php esc_html_e( 'Читать →', 'stroymaks2026' ); ?>
                        </a>
                    </article>
                    <?php
                endwhile;
                ?>

            </div>

            <!-- Pagination -->
            <nav class="mt-12 flex justify-center" aria-label="<?php esc_attr_e( 'Пагинация', 'stroymaks2026' ); ?>">
                <?php
                the_posts_pagination( [
                    'mid_size'           => 2,
                    'prev_text'          => '← ' . __( 'Назад', 'stroymaks2026' ),
                    'next_text'          => __( 'Вперёд', 'stroymaks2026' ) . ' →',
                    'screen_reader_text' => __( 'Навигация по статьям', 'stroymaks2026' ),
                    'class'              => 'flex items-center gap-2',
                ] );
                ?>
            </nav>
        </div>

    <?php else : ?>
        <!-- Empty state -->
        <div class="mx-auto mt-12 max-w-7xl px-4 text-center">
            <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12">
                <div class="text-4xl">📰</div>
                <h2 class="mt-4 font-display text-xl font-semibold text-[var(--color-text-primary)]">
                    <?php esc_html_e( 'Пока нет статей', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-2 text-[var(--color-text-secondary)]">
                    <?php esc_html_e( 'Скоро здесь появятся полезные материалы о тротуарной плитке и брусчатке.', 'stroymaks2026' ); ?>
                </p>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>"
                   class="mt-6 inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3 font-body text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]"
                   style="box-shadow: var(--shadow-brand);">
                    <?php esc_html_e( 'На главную', 'stroymaks2026' ); ?>
                </a>
            </div>
        </div>
    <?php endif; ?>

</main>

<style id="stroymaks2026-pagination">
    /* Pagination styling — Dusty Slate */
    .pagination,
    .nav-links {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .pagination .page-numbers,
    .nav-links .page-numbers {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 2.5rem;
        height: 2.5rem;
        padding: 0 0.75rem;
        font-family: var(--font-body);
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        transition: var(--transition-fast);
        text-decoration: none;
    }
    .pagination .page-numbers:hover,
    .nav-links .page-numbers:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
    .pagination .page-numbers.current,
    .nav-links .page-numbers.current {
        background: var(--color-primary);
        color: var(--color-text-on-primary);
        border-color: var(--color-primary);
    }
    .pagination .page-numbers.dots,
    .nav-links .page-numbers.dots {
        border-color: transparent;
        background: transparent;
    }
    .pagination .page-numbers.dots:hover,
    .nav-links .page-numbers.dots:hover {
        color: var(--color-text-secondary);
    }
</style>

<?php
get_footer();