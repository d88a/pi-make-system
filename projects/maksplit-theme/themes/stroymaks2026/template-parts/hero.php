<?php
/**
 * Template part: Hero Section (v8)
 *
 * Dusty Slate palette #32598f. Asymmetric split 60/40.
 * Playfair Display headings, Source Serif body.
 * Photo: hero-bruschatka.jpg in rounded-2xl shadow-brand.
 * CTA: «Рассчитать стоимость»→/calculator, «Смотреть каталог»→/shop.
 *
 * @package stroymaks2026
 * @var array $args {
 *     @type string $eyebrow    Badge text (Customizer).
 *     @type string $title      Hero title (Customizer).
 *     @type string $subtitle   Hero subtitle (Customizer).
 *     @type int    $image_id   Hero image attachment ID (Customizer).
 * }
 */

defined( 'ABSPATH' ) || exit;

$hero_eyebrow  = isset( $args['eyebrow'] ) ? $args['eyebrow'] : get_theme_mod( 'stroymaks2026_hero_eyebrow', 'Кевларовая брусчатка' );
$hero_title    = isset( $args['title'] ) ? $args['title'] : get_theme_mod( 'stroymaks2026_hero_title', 'Брусчатка, которая служит десятилетиями' );
$hero_subtitle = isset( $args['subtitle'] ) ? $args['subtitle'] : get_theme_mod( 'stroymaks2026_hero_subtitle', 'Производим тротуарную плитку и брусчатку с кевларовым волокном в Челябинской области. Повышенная прочность, морозостойкость, 22 вида продукции.' );
$hero_image_id = isset( $args['image_id'] ) ? $args['image_id'] : get_theme_mod( 'stroymaks2026_hero_image', 0 );
?>

<section class="relative flex items-center bg-[var(--color-bg-page)] min-h-[600px] lg:min-h-[70vh] overflow-hidden" aria-labelledby="hero-heading">
    <!-- Subtle grid pattern overlay (L1) -->
    <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><defs><pattern id=&quot;g&quot; width=&quot;60&quot; height=&quot;60&quot; patternUnits=&quot;userSpaceOnUse&quot;><path d=&quot;M60 0H0v60&quot; fill=&quot;none&quot; stroke=&quot;%2332598f&quot; stroke-width=&quot;1&quot;/></pattern></defs><rect width=&quot;100%25&quot; height=&quot;100%25&quot; fill=&quot;url(%23g)&quot;/></svg>');"></div>

    <div class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8 w-full">
        <!-- Left: text block (60% = 3/5) -->
        <div class="lg:col-span-3 flex flex-col justify-center py-12 lg:py-20 reveal">
            <?php if ( $hero_eyebrow ) : ?>
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                    <?php echo esc_html( $hero_eyebrow ); ?>
                </span>
            <?php endif; ?>

            <h1 id="hero-heading" class="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl" style="font-family: var(--font-display);">
                <?php
                // If title contains «десятилетиями» — render hardcoded HTML with <br> + colored span (matches home-v8.html)
                if ( stripos( $hero_title, 'десятилетиями' ) !== false ) :
                    $allowed_html = [
                        'br'   => [],
                        'span' => [ 'class' => [] ],
                    ];
                    echo wp_kses( 'Брусчатка,<br>которая служит<br><span class="text-[var(--color-primary)]">десятилетиями</span>', $allowed_html );
                else :
                    echo esc_html( $hero_title );
                endif;
                ?>
            </h1>

            <?php if ( $hero_subtitle ) : ?>
                <p class="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php echo esc_html( $hero_subtitle ); ?>
                </p>
            <?php endif; ?>

            <!-- CTA buttons -->
            <div class="mt-8 flex flex-wrap gap-4">
                <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                    <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
                <a href="<?php echo esc_url( home_url( '/shop' ) ); ?>" class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]" style="font-family: var(--font-body); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <?php esc_html_e( 'Смотреть каталог', 'stroymaks2026' ); ?>
                </a>
            </div>

            <!-- Trust indicators -->
            <div class="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                <span class="flex items-center gap-1.5">
                    <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <?php esc_html_e( 'Бесплатный расчёт', 'stroymaks2026' ); ?>
                </span>
                <span class="flex items-center gap-1.5">
                    <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <?php esc_html_e( 'Доставка по всей России', 'stroymaks2026' ); ?>
                </span>
            </div>
        </div>

        <!-- Right: image (40% = 2/5) -->
        <div class="lg:col-span-2 reveal">
            <div class="relative overflow-hidden rounded-2xl shadow-[var(--shadow-brand)]" style="border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                <?php if ( $hero_image_id ) : ?>
                    <?php echo wp_get_attachment_image( $hero_image_id, 'large', false, [
                        'class'   => 'w-full h-auto max-h-[500px] lg:max-h-[600px] object-cover',
                        'alt'     => esc_attr( $hero_title ),
                        'loading' => 'eager',
                    ] ); ?>
                <?php else : ?>
                    <img
                        src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/hero-bruschatka.jpg' ); ?>"
                        alt="<?php echo esc_attr( $hero_title ); ?>"
                        class="w-full h-auto max-h-[500px] lg:max-h-[600px] object-cover"
                        loading="eager"
                        onerror="this.style.display='none'"
                    />
                <?php endif; ?>
                <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--color-border)]" aria-hidden="true" style="border-radius: var(--radius);"></div>
            </div>
        </div>
    </div>
</section>