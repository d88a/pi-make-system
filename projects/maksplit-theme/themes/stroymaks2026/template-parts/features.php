<?php
/**
 * Template part: Features / Advantages (v8)
 *
 * Dusty Slate #32598f. 4 advantage cards + GOST tech table.
 * Playfair Display headings, Source Serif body.
 * Real СтройМакс data: Кевларобетон, Вибролитьё, Морозостойкость, Доставка.
 *
 * @package stroymaks2026
 * @var array $args {
 *     @type string $heading    Section heading (Customizer).
 *     @type string $subtitle   Section subtitle (Customizer).
 *     @type string $eyebrow    Section eyebrow (Customizer).
 * }
 */

defined( 'ABSPATH' ) || exit;

$section_eyebrow  = isset( $args['eyebrow'] ) ? $args['eyebrow'] : get_theme_mod( 'stroymaks2026_features_eyebrow', '' );
$section_heading  = isset( $args['heading'] ) ? $args['heading'] : get_theme_mod( 'stroymaks2026_features_heading', 'Почему выбирают СтройМакс' );
$section_subtitle = isset( $args['subtitle'] ) ? $args['subtitle'] : get_theme_mod( 'stroymaks2026_features_subtitle', 'Качество, подтверждённое лабораторными испытаниями и реальными проектами' );

// ── 4 advantage cards (real data) ──
$advantages = [
    [
        'icon'  => 'shield',
        'title' => 'Кевларобетон',
        'text'  => 'Армирование кевларовым волокном повышает прочность и исключает образование трещин. Изделия служат дольше обычного бетона.',
    ],
    [
        'icon'  => 'vibro',
        'title' => 'Вибролитьё',
        'text'  => 'Метод вибролитья обеспечивает высокую плотность, отсутствие пористости и гладкую поверхность каждого изделия.',
    ],
    [
        'icon'  => 'frost',
        'title' => 'Морозостойкость',
        'text'  => 'Материал выдерживает морозы и перепады температур — создан для российского климата.',
    ],
    [
        'icon'  => 'truck',
        'title' => 'Доставка по России',
        'text'  => 'Отгружаем продукцию в любую точку страны. Работаем с транспортными компаниями КИТ, ЛУЧ, СДЭК. Точные сроки и бережная упаковка.',
    ],
];
?>


<!-- ════════════════ FEATURES: 4 advantages ════════════════ -->
<section class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="features-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Section header -->
        <div class="mx-auto max-w-2xl text-center reveal">
            <?php if ( $section_eyebrow ) : ?>
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)]" style="font-family: var(--font-body);">
                    <?php echo esc_html( $section_eyebrow ); ?>
                </span>
            <?php endif; ?>
            <h2 id="features-heading" class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                <?php echo esc_html( $section_heading ); ?>
            </h2>
            <?php if ( $section_subtitle ) : ?>
                <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php echo esc_html( $section_subtitle ); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- 4 advantage cards: 1→2→4 grid -->
        <div class="stagger mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <?php foreach ( $advantages as $adv ) : ?>
                <div class="reveal hover-lift group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8" style="border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)]" style="border-radius: var(--radius);">
                        <?php if ( $adv['icon'] === 'shield' ) : ?>
                            <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                        <?php elseif ( $adv['icon'] === 'vibro' ) : ?>
                            <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
                        <?php elseif ( $adv['icon'] === 'frost' ) : ?>
                            <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>
                        <?php else : ?>
                            <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg>
                        <?php endif; ?>
                    </div>
                    <h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                        <?php echo esc_html( $adv['title'] ); ?>
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php echo esc_html( $adv['text'] ); ?>
                    </p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>


<style>
.hover-lift { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.hover-lift:hover { transform: translateY(-2px); box-shadow: var(--shadow-card-hover); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1); }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
.stagger > .reveal:nth-child(1) { transition-delay: 0ms; }
.stagger > .reveal:nth-child(2) { transition-delay: 80ms; }
.stagger > .reveal:nth-child(3) { transition-delay: 160ms; }
.stagger > .reveal:nth-child(4) { transition-delay: 240ms; }
</style>

<script>
(function() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
})();
</script>