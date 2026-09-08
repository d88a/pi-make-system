<?php
/**
 * Latest Posts Section — template part for front-page.php
 *
 * Dusty Slate: 3 recent blog posts, 📰 icon, excerpt, «Все статьи» CTA.
 * Hidden entirely if no posts found.
 *
 * @package stroymaks2026
 * @since   1.0.0
 */

defined( 'ABSPATH' ) || exit;

$latest_posts = new WP_Query( [
    'post_type'           => 'post',
    'post_status'         => 'publish',
    'posts_per_page'      => 3,
    'orderby'             => 'date',
    'order'               => 'DESC',
    'ignore_sticky_posts' => true,
    'no_found_rows'       => true,
] );

if ( ! $latest_posts->have_posts() ) {
    return; // No posts — don't render section
}
?>

<section id="latest-posts" class="bg-[var(--color-bg-alt)] py-20 lg:py-24" aria-labelledby="latest-posts-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <!-- Section Header -->
        <div class="mx-auto max-w-2xl text-center">
            <span class="font-display text-xs font-semibold tracking-widest uppercase text-[var(--color-text-muted)]">
                <?php esc_html_e( 'Блог', 'stroymaks2026' ); ?>
            </span>
            <h2 id="latest-posts-heading" class="mt-3 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                <?php esc_html_e( 'Полезные статьи', 'stroymaks2026' ); ?>
            </h2>
            <p class="mt-4 text-lg text-[var(--color-text-secondary)]">
                <?php esc_html_e( 'Советы по выбору, укладке и уходу за тротуарной плиткой', 'stroymaks2026' ); ?>
            </p>
        </div>

        <!-- Cards Grid -->
        <div class="stagger mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <?php
            while ( $latest_posts->have_posts() ) :
                $latest_posts->the_post();
                ?>
                <div class="reveal">
                    <article class="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-200 hover:shadow-[var(--shadow-card)]">
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
                        <h3 class="mt-2 font-display text-lg font-semibold leading-tight text-[var(--color-text-primary)]">
                            <a href="<?php the_permalink(); ?>" class="transition-colors duration-150 hover:text-[var(--color-primary)]">
                                <?php the_title(); ?>
                            </a>
                        </h3>

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
                </div>
                <?php
            endwhile;
            wp_reset_postdata();
            ?>
        </div>

        <!-- All Articles CTA -->
        <div class="mt-10 text-center">
            <a href="<?php echo esc_url( home_url( '/category/novosti/' ) ); ?>"
               class="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 font-body text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)]"
               style="box-shadow: var(--shadow-brand);">
                <?php esc_html_e( 'Все статьи', 'stroymaks2026' ); ?>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>

    </div>
</section>