<?php
/**
 * Single Post template — StroyMaks 2026
 *
 * Dusty Slate: full article with semantic HTML, JSON-LD Article schema
 * (critical for Yandex SEO), breadcrumb, entry-content styling, related posts.
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<style id="stroymaks2026-entry-content">
    /* Entry content styling — Dusty Slate design system */
    .entry-content p {
        font-family: var(--font-body);
        font-size: 1.125rem;
        line-height: 1.75;
        color: var(--color-text-secondary);
        margin-bottom: 1.5rem;
    }
    .entry-content h2 {
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-top: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.3;
    }
    .entry-content h3 {
        font-family: var(--font-display);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-top: 2rem;
        margin-bottom: 0.75rem;
        line-height: 1.4;
    }
    .entry-content ul,
    .entry-content ol {
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .entry-content ul {
        list-style-type: disc;
    }
    .entry-content ol {
        list-style-type: decimal;
    }
    .entry-content li {
        font-family: var(--font-body);
        font-size: 1.0625rem;
        line-height: 1.7;
        color: var(--color-text-secondary);
        margin-bottom: 0.5rem;
    }
    .entry-content strong {
        font-weight: 600;
        color: var(--color-text-primary);
    }
    .entry-content img {
        max-width: 100%;
        height: auto;
        border-radius: 16px;
        margin: 1.5rem 0;
    }
    .entry-content a {
        color: var(--color-primary);
        text-decoration: underline;
        text-underline-offset: 2px;
    }
    .entry-content a:hover {
        color: var(--color-primary-hover);
    }
    .entry-content blockquote {
        border-left: 3px solid var(--color-primary);
        padding-left: 1.25rem;
        margin: 1.5rem 0;
        color: var(--color-text-muted);
        font-style: italic;
    }
    .entry-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
    }
    .entry-content th,
    .entry-content td {
        border: 1px solid var(--color-border);
        padding: 0.75rem 1rem;
        text-align: left;
        font-size: 0.9375rem;
    }
    .entry-content th {
        background: var(--color-bg-alt);
        font-weight: 600;
        color: var(--color-text-primary);
    }
</style>

<main class="pt-20 lg:pt-28 pb-20 bg-[var(--color-bg-page)]" role="main">

    <article class="max-w-3xl mx-auto px-4 sm:px-6">

        <?php
        while ( have_posts() ) :
            the_post();
            ?>

            <!-- Breadcrumb -->
            <nav class="mb-8" aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-text-muted)]">
                    <li><a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="transition-colors duration-150 hover:text-[var(--color-text-primary)]"><?php esc_html_e( 'Главная', 'stroymaks2026' ); ?></a></li>
                    <li aria-hidden="true">/</li>
                    <li><a href="<?php echo esc_url( home_url( '/category/novosti/' ) ); ?>" class="transition-colors duration-150 hover:text-[var(--color-text-primary)]"><?php esc_html_e( 'Статьи', 'stroymaks2026' ); ?></a></li>
                    <li aria-hidden="true">/</li>
                    <li class="text-[var(--color-text-primary)] font-medium truncate max-w-[200px] sm:max-w-xs"><?php the_title(); ?></li>
                </ol>
            </nav>

            <!-- Article Header -->
            <header>
                <?php
                $categories = get_the_category();
                if ( ! empty( $categories ) ) :
                    foreach ( $categories as $cat ) :
                        ?>
                        <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>"
                           class="inline-block rounded-2xl bg-[var(--color-primary-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] transition-colors duration-150 hover:bg-[var(--color-primary)] hover:text-[var(--color-text-on-primary)]">
                            <?php echo esc_html( $cat->name ); ?>
                        </a>
                        <?php
                    endforeach;
                endif;
                ?>

                <h1 class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] lg:text-4xl">
                    <?php the_title(); ?>
                </h1>

                <div class="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-muted)]">
                    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                        <?php echo esc_html( get_the_date() ); ?>
                    </time>
                    <span aria-hidden="true">·</span>
                    <span><?php echo esc_html( get_the_author() ); ?></span>
                </div>
            </header>

            <!-- Article Content -->
            <div class="entry-content mt-10">
                <?php the_content(); ?>
            </div>

            <!-- Article JSON-LD Structured Data (Yandex SEO) -->
            <script type="application/ld+json">
            <?php
            $article_schema = [
                '@context'       => 'https://schema.org',
                '@type'          => 'Article',
                'headline'       => get_the_title(),
                'datePublished'  => get_the_date( 'c' ),
                'dateModified'   => get_the_modified_date( 'c' ),
                'author'         => [
                    '@type' => 'Person',
                    'name'  => get_the_author(),
                ],
                'publisher'      => [
                    '@type' => 'Organization',
                    'name'  => 'СтройМакс',
                ],
                'mainEntityOfPage' => [
                    '@type' => 'WebPage',
                    '@id'   => get_permalink(),
                ],
            ];
            echo wp_json_encode( $article_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
            ?>
            </script>

            <?php
        endwhile;
        wp_reset_postdata();
        ?>

        <!-- Related Posts -->
        <?php
        $current_id    = get_the_ID();
        $related_query = new WP_Query( [
            'post_type'           => 'post',
            'post_status'         => 'publish',
            'posts_per_page'      => 3,
            'post__not_in'        => [ $current_id ],
            'orderby'             => 'rand',
            'ignore_sticky_posts' => true,
            'no_found_rows'       => true,
        ] );

        if ( $related_query->have_posts() ) :
            ?>
            <aside class="mt-16 border-t border-[var(--color-border)] pt-12" aria-labelledby="related-heading">
                <h2 id="related-heading" class="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                    <?php esc_html_e( 'Читайте также', 'stroymaks2026' ); ?>
                </h2>

                <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <?php
                    while ( $related_query->have_posts() ) :
                        $related_query->the_post();
                        ?>
                        <article class="flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-200 hover:shadow-[var(--shadow-card)]">
                            <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-bg-alt)] text-xl">
                                📰
                            </div>
                            <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>" class="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                                <?php echo esc_html( get_the_date() ); ?>
                            </time>
                            <h3 class="mt-2 font-display text-base font-semibold text-[var(--color-text-primary)]">
                                <a href="<?php the_permalink(); ?>" class="transition-colors duration-150 hover:text-[var(--color-primary)]">
                                    <?php the_title(); ?>
                                </a>
                            </h3>
                            <a href="<?php the_permalink(); ?>" class="mt-3 self-start text-sm font-medium text-[var(--color-primary)] transition-colors duration-150 hover:text-[var(--color-primary-hover)]">
                                <?php esc_html_e( 'Читать →', 'stroymaks2026' ); ?>
                            </a>
                        </article>
                        <?php
                    endwhile;
                    wp_reset_postdata();
                    ?>
                </div>
            </aside>
            <?php
        endif;
        ?>

    </article>

</main>

<?php
get_footer();