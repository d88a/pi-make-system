<?php
/**
 * Page Delivery — StroyMaks 2026 (v8)
 *
 * Delivery page with transport companies (КИТ, ЛУЧ, СДЭК).
 * Playfair Display + Source Serif 4, rounded-2xl, cubic-bezier.
 * Real TK data from official sources.
 *
 * Template Name: Доставка и оплата
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main class="bg-[var(--color-bg-page)]" role="main">

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- HERO — Asymmetric Split 60/40 -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="relative flex items-center bg-[var(--color-bg-page)] min-h-[500px] lg:min-h-[60vh] overflow-hidden" aria-labelledby="delivery-hero-heading">
        <!-- Subtle grid pattern -->
        <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><defs><pattern id=&quot;g&quot; width=&quot;60&quot; height=&quot;60&quot; patternUnits=&quot;userSpaceOnUse&quot;><path d=&quot;M60 0H0v60&quot; fill=&quot;none&quot; stroke=&quot;%2332598f&quot; stroke-width=&quot;1&quot;/></pattern></defs><rect width=&quot;100%25&quot; height=&quot;100%25&quot; fill=&quot;url(%23g)&quot;/></svg>');"></div>

        <div class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8 w-full">
            <!-- Left: text (60% = 3/5) -->
            <div class="lg:col-span-3 flex flex-col justify-center py-12 lg:py-20">
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Доставка по всей России', 'stroymaks2026' ); ?>
                </span>
                <h1 id="delivery-hero-heading" class="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl" style="font-family: var(--font-display);">
                    <?php
                    while ( have_posts() ) : the_post();
                        the_title();
                    endwhile;
                    ?>
                </h1>
                <div class="mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php the_content(); ?>
                </div>
                <div class="mt-8 flex flex-wrap gap-4">
                    <a href="#tk-companies" class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: var(--transition-smooth);">
                        <?php esc_html_e( 'Выбрать ТК', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]" style="font-family: var(--font-body); transition: var(--transition-smooth);">
                        <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                    </a>
                </div>
                <!-- Trust indicators -->
                <div class="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
                    <span class="flex items-center gap-1.5">
                        <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <?php esc_html_e( 'Челябинская область', 'stroymaks2026' ); ?>
                    </span>
                    <span class="flex items-center gap-1.5">
                        <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <?php esc_html_e( 'Вся Россия', 'stroymaks2026' ); ?>
                    </span>
                </div>
            </div>

            <!-- Right: truck illustration (40% = 2/5) -->
            <div class="lg:col-span-2">
                <div class="relative overflow-hidden rounded-2xl bg-[var(--color-bg-alt)] p-12 flex items-center justify-center">
                    <!-- Large truck SVG illustration -->
                    <svg class="w-full h-auto max-h-80 text-[var(--color-primary)]" viewBox="0 0 640 512" fill="currentColor" aria-hidden="true" style="opacity: 0.85;">
                        <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"/>
                    </svg>
                    <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--color-border)]" aria-hidden="true"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- INTRO — About delivery -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section class="bg-[var(--color-bg-alt)] py-20" aria-labelledby="intro-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-4xl">
                <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 sm:p-10 shadow-[var(--shadow-card)]">
                    <div class="flex items-start gap-4">
                        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-subtle)]">
                            <svg class="h-6 w-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>
                            </svg>
                        </div>
                        <div>
                            <h2 id="intro-heading" class="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl" style="font-family: var(--font-display);">
                                <?php esc_html_e( 'Доставка по всей России', 'stroymaks2026' ); ?>
                            </h2>
                            <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                                <?php esc_html_e( 'Компания «СтройМакс» осуществляет доставку продукции по Челябинской области и всей России транспортными компаниями. Мы работаем с проверенными логистическими партнёрами, чтобы ваша брусчатка, плитка и бордюры прибыли в целости и сохранности в любую точку страны.', 'stroymaks2026' ); ?>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- TRANSPORT COMPANIES — 3 TK cards (КИТ, ЛУЧ, СДЭК) -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section id="tk-companies" class="bg-[var(--color-bg-page)] py-24" aria-labelledby="tk-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center">
                <h2 id="tk-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Транспортные компании', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Выберите удобный способ доставки — все три партнёра работают по всей России', 'stroymaks2026' ); ?>
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">

                <!-- TK Card 1: КИТ -->
                <div class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]" style="transition: var(--transition-smooth);">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]">
                        <span class="text-2xl" aria-hidden="true">🚚</span>
                    </div>
                    <h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Транспортная компания КИТ', 'stroymaks2026' ); ?>
                    </h3>
                    <p class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Доступные грузоперевозки для людей и бизнеса, многолетний опыт, широчайшая география присутствия и выгодные тарифы.', 'stroymaks2026' ); ?>
                    </p>
                    <a href="<?php echo esc_url( 'https://tk-kit.com/order' ); ?>" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: var(--transition-smooth);" aria-label="<?php esc_attr_e( 'Рассчитать доставку через транспортную компанию КИТ', 'stroymaks2026' ); ?>">
                        <?php esc_html_e( 'Рассчитать', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                </div>

                <!-- TK Card 2: ЛУЧ -->
                <div class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]" style="transition: var(--transition-smooth);">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]">
                        <span class="text-2xl" aria-hidden="true">🚚</span>
                    </div>
                    <h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Транспортная компания ЛУЧ', 'stroymaks2026' ); ?>
                    </h3>
                    <p class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Логистическая сеть, представлена в 85 городах: 48 полноценных складов и 37 пунктов выдачи с борта автомобиля.', 'stroymaks2026' ); ?>
                    </p>
                    <a href="<?php echo esc_url( 'https://xn----stbeziy.xn--p1ai/' ); ?>" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: var(--transition-smooth);" aria-label="<?php esc_attr_e( 'Рассчитать доставку через транспортную компанию ЛУЧ', 'stroymaks2026' ); ?>">
                        <?php esc_html_e( 'Рассчитать', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                </div>

                <!-- TK Card 3: СДЭК -->
                <div class="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-card-hover)]" style="transition: var(--transition-smooth);">
                    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]">
                        <span class="text-2xl" aria-hidden="true">🚚</span>
                    </div>
                    <h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Транспортная компания СДЭК', 'stroymaks2026' ); ?>
                    </h3>
                    <p class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Гораздо больше, чем просто доставка. Экосистема сервисов для людей. Главный принцип — забота о клиенте.', 'stroymaks2026' ); ?>
                    </p>
                    <a href="<?php echo esc_url( 'https://www.cdek.ru/ru/' ); ?>" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: var(--transition-smooth);" aria-label="<?php esc_attr_e( 'Рассчитать доставку через транспортную компанию СДЭК', 'stroymaks2026' ); ?>">
                        <?php esc_html_e( 'Рассчитать', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                </div>

            </div>
        </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════ -->
    <!-- CTA BANNER — Рассчитать стоимость -->
    <!-- ═══════════════════════════════════════════════════════════ -->
    <section id="delivery-cta" class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="delivery-cta-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="rounded-2xl bg-[var(--color-primary)] px-8 py-14 sm:px-12 lg:px-16 text-center shadow-[var(--shadow-brand)]" style="transition: var(--transition-smooth);">
                <h2 id="delivery-cta-heading" class="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Рассчитайте стоимость продукции', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-white/80" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Оставьте заявку и получите точный расчёт с учётом доставки в ваш регион. Мы подберём оптимальную транспортную компанию.', 'stroymaks2026' ); ?>
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="inline-flex items-center rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-white/90 hover:shadow-lg" style="font-family: var(--font-body); transition: var(--transition-smooth);">
                        <?php esc_html_e( 'Оставить заявку', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <a href="tel:+79823416970" class="inline-flex items-center rounded-2xl border border-white/30 bg-transparent px-6 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-white/10" style="font-family: var(--font-body); transition: var(--transition-smooth);">
                        <svg class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                        +7 982 341 69 70
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<?php
get_footer();