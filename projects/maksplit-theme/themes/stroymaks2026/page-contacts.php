<?php
/**
 * Page Contacts — StroyMaks 2026 (v8)
 *
 * Playfair Display + Source Serif 4, Dusty Blue #32598f accent.
 * Split layout: contact info card + Google Maps iframe.
 * Real contacts (D-134): Юрюзань, Тимирязева 15а, +7 982 341 69 70, maksimdyd@gmail.com.
 * Contacts from Customizer with REAL defaults.
 * CF7-aware form: do_shortcode() if cf7_contacts_id is set, else HTML fallback.
 *
 * Template Name: Контакты
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();

// ── Real contacts (D-134) from Customizer ──
$phone    = get_theme_mod( 'stroymaks2026_phone', '+79823416970' );
$phone_d  = get_theme_mod( 'stroymaks2026_phone_display', '+7 982 341 69 70' );
$email    = get_theme_mod( 'stroymaks2026_email', 'maksimdyd@gmail.com' );
$address  = get_theme_mod( 'stroymaks2026_address', 'г. Юрюзань, Челябинская область, Катав-Ивановский район, ул. Тимирязева, 15а' );
$hours    = get_theme_mod( 'stroymaks2026_hours', 'Пн-Пт: 9:00 – 18:00' );

// CF7 integration
$cf7_contacts_id = get_theme_mod( 'stroymaks2026_cf7_contacts_id', '' );
$form_id = 'contacts-form';
?>

<main class="bg-[var(--color-bg-page)]" role="main">

    <!-- ════════════════ HERO (Compact) ════════════════ -->
    <section class="relative bg-[var(--color-bg-page)] py-20 lg:py-28" aria-labelledby="contacts-hero-heading">
        <!-- Subtle grid pattern -->
        <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true"
             style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><defs><pattern id=&quot;g&quot; width=&quot;60&quot; height=&quot;60&quot; patternUnits=&quot;userSpaceOnUse&quot;><path d=&quot;M60 0H0v60&quot; fill=&quot;none&quot; stroke=&quot;%2332598f&quot; stroke-width=&quot;1&quot;/></pattern></defs><rect width=&quot;100%25&quot; height=&quot;100%25&quot; fill=&quot;url(%23g)&quot;/></svg>');"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl text-center reveal">
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit">
                    <?php esc_html_e( 'Свяжитесь с нами', 'stroymaks2026' ); ?>
                </span>
                <h1 id="contacts-hero-heading" class="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl">
                    <?php
                    while ( have_posts() ) : the_post();
                        the_title();
                    endwhile;
                    ?>
                </h1>
                <p class="mt-6 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                    <?php esc_html_e( 'Мы находимся в Юрюзани, Челябинская область. Производство, склад и офис — всё в одном месте. Приезжайте посмотреть продукцию лично.', 'stroymaks2026' ); ?>
                </p>
            </div>
        </div>
    </section>

    <!-- ════════════════ SPLIT: Contacts + Map ════════════════ -->
    <section class="bg-[var(--color-bg-page)] pb-24" aria-labelledby="split-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">

                <!-- LEFT: Contact Info Card -->
                <div class="reveal hover-lift rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]"
                     style="transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                    <h2 id="split-heading" class="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                        <?php esc_html_e( 'Наши контакты', 'stroymaks2026' ); ?>
                    </h2>
                    <p class="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        <?php esc_html_e( 'Работаем по будням. Звоните, пишите или приезжайте — всегда рады.', 'stroymaks2026' ); ?>
                    </p>

                    <div class="mt-8 space-y-6">
                        <!-- Address -->
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]" aria-hidden="true">
                                <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Адрес', 'stroymaks2026' ); ?></p>
                                <p class="mt-0.5 text-base leading-relaxed text-[var(--color-text-secondary)]">
                                    <?php echo esc_html( $address ); ?>
                                </p>
                            </div>
                        </div>

                        <!-- Phone -->
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]" aria-hidden="true">
                                <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Телефон', 'stroymaks2026' ); ?></p>
                                <a href="tel:<?php echo esc_attr( $phone ); ?>"
                                   class="mt-0.5 block text-base leading-relaxed text-[var(--color-primary)] transition-colors duration-150 hover:text-[var(--color-primary-hover)]">
                                    <?php echo esc_html( $phone_d ); ?>
                                </a>
                            </div>
                        </div>

                        <!-- Email -->
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]" aria-hidden="true">
                                <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Email', 'stroymaks2026' ); ?></p>
                                <a href="mailto:<?php echo esc_attr( $email ); ?>"
                                   class="mt-0.5 block text-base leading-relaxed text-[var(--color-primary)] transition-colors duration-150 hover:text-[var(--color-primary-hover)]">
                                    <?php echo esc_html( $email ); ?>
                                </a>
                            </div>
                        </div>

                        <!-- Hours -->
                        <div class="flex items-start gap-4">
                            <div class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]" aria-hidden="true">
                                <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-sm font-semibold text-[var(--color-text-primary)]"><?php esc_html_e( 'Часы работы', 'stroymaks2026' ); ?></p>
                                <p class="mt-0.5 text-base leading-relaxed text-[var(--color-text-secondary)]">
                                    <?php echo esc_html( $hours ); ?>
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- CTA buttons -->
                    <div class="mt-10 flex flex-col gap-3 sm:flex-row">
                        <a href="tel:<?php echo esc_attr( $phone ); ?>"
                           class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] sm:w-auto"
                           style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
                           aria-label="<?php esc_attr_e( 'Позвонить по телефону', 'stroymaks2026' ); ?>">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/>
                            </svg>
                            <?php esc_html_e( 'Позвонить', 'stroymaks2026' ); ?>
                        </a>
                        <a href="mailto:<?php echo esc_attr( $email ); ?>"
                           class="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-semibold text-[var(--color-text-primary)] transition-all duration-200 hover:bg-[var(--color-bg-alt)] sm:w-auto"
                           style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
                           aria-label="<?php esc_attr_e( 'Написать email', 'stroymaks2026' ); ?>">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                            </svg>
                            <?php esc_html_e( 'Написать', 'stroymaks2026' ); ?>
                        </a>
                    </div>
                </div>

                <!-- RIGHT: Google Maps -->
                <div class="reveal">
                    <div class="overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[var(--shadow-card)]">
                        <iframe
                            title="<?php esc_attr_e( 'Карта Юрюзань ул. Тимирязева 15а', 'stroymaks2026' ); ?>"
                            src="https://maps.google.com/maps?q=%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D0%B3.%20%D0%AE%D1%80%D1%8E%D0%B7%D0%B0%D0%BD%D1%8C%2C%20%D1%83%D0%BB.%20%D0%A2%D0%B8%D0%BC%D0%B8%D1%80%D1%8F%D0%B7%D0%B5%D0%B2%D0%B0%2C%2015%D0%B0&amp;t=m&amp;z=17&amp;output=embed&amp;iwloc=near"
                            width="100%"
                            height="400"
                            style="border:0;"
                            allowfullscreen=""
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="block h-[400px] w-full"
                            aria-label="<?php esc_attr_e( 'Карта проезда: Челябинская область, г. Юрюзань, ул. Тимирязева, 15а', 'stroymaks2026' ); ?>"
                        ></iframe>
                    </div>
                    <p class="mt-3 text-center text-sm text-[var(--color-text-muted)]">
                        <?php esc_html_e( 'г. Юрюзань, Челябинская область, ул. Тимирязева, 15а', 'stroymaks2026' ); ?>
                    </p>
                </div>

            </div>
        </div>
    </section>

    <!-- ════════════════ CONTACT FORM ════════════════ -->
    <section id="quote-form" class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="form-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl reveal">
                <h2 id="form-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl text-center">
                    <?php esc_html_e( 'Напишите нам', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 text-center text-lg leading-relaxed text-[var(--color-text-secondary)]">
                    <?php esc_html_e( 'Заполните форму, и мы ответим в течение 24 часов. Или сразу позвоните по телефону.', 'stroymaks2026' ); ?>
                </p>

                <?php if ( $cf7_contacts_id && shortcode_exists( 'contact-form-7' ) ) : ?>
                    <!-- CF7 Form -->
                    <div class="cf7-contacts-wrapper mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
                        <?php echo do_shortcode( '[contact-form-7 id="' . esc_attr( $cf7_contacts_id ) . '"]' ); ?>
                    </div>
                <?php else : ?>
                    <!-- HTML Fallback -->
                    <form id="<?php echo esc_attr( $form_id ); ?>"
                          class="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]"
                          aria-label="<?php esc_attr_e( 'Форма обратной связи', 'stroymaks2026' ); ?>"
                          novalidate>
                        <?php wp_nonce_field( 'stroymaks2026_contacts_form', 'contacts_form_nonce' ); ?>

                        <!-- Success message -->
                        <div id="<?php echo esc_attr( $form_id ); ?>-success"
                             class="hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
                             role="status"
                             aria-live="polite">
                            <svg class="mx-auto h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p class="mt-3 font-display text-lg font-semibold text-emerald-700"><?php esc_html_e( 'Заявка отправлена!', 'stroymaks2026' ); ?></p>
                            <p class="mt-1 text-sm text-emerald-600"><?php esc_html_e( 'Мы свяжемся с вами в ближайшее время.', 'stroymaks2026' ); ?></p>
                        </div>

                        <!-- Form fields -->
                        <div id="<?php echo esc_attr( $form_id ); ?>-fields">
                            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <!-- Name -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-name" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Имя', 'stroymaks2026' ); ?>
                                        <span class="text-[var(--color-danger)]" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="<?php echo esc_attr( $form_id ); ?>-name"
                                        type="text"
                                        placeholder="<?php esc_attr_e( 'Ваше имя', 'stroymaks2026' ); ?>"
                                        required
                                        aria-required="true"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    />
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-phone" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Телефон', 'stroymaks2026' ); ?>
                                        <span class="text-[var(--color-danger)]" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        id="<?php echo esc_attr( $form_id ); ?>-phone"
                                        type="tel"
                                        placeholder="+7 (999) 123-45-67"
                                        required
                                        aria-required="true"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    />
                                </div>

                                <!-- Email -->
                                <div class="sm:col-span-2">
                                    <label for="<?php echo esc_attr( $form_id ); ?>-email" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Email', 'stroymaks2026' ); ?>
                                    </label>
                                    <input
                                        id="<?php echo esc_attr( $form_id ); ?>-email"
                                        type="email"
                                        placeholder="ivan@example.com"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    />
                                </div>

                                <!-- Message -->
                                <div class="sm:col-span-2">
                                    <label for="<?php echo esc_attr( $form_id ); ?>-message" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Сообщение', 'stroymaks2026' ); ?>
                                    </label>
                                    <textarea
                                        id="<?php echo esc_attr( $form_id ); ?>-message"
                                        rows="4"
                                        placeholder="<?php esc_attr_e( 'Опишите ваш вопрос или проект: площадь, регион, пожелания...', 'stroymaks2026' ); ?>"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Submit -->
                            <button
                                id="<?php echo esc_attr( $form_id ); ?>-submit"
                                type="submit"
                                class="mt-8 w-full rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] sm:w-auto"
                                style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
                                <?php esc_html_e( 'Отправить', 'stroymaks2026' ); ?>
                            </button>

                            <p class="mt-4 text-xs text-[var(--color-text-muted)]">
                                <?php esc_html_e( 'Нажимая кнопку, вы соглашаетесь с обработкой персональных данных. Никакого спама.', 'stroymaks2026' ); ?>
                            </p>
                        </div>
                    </form>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- ════════════════ CTA BANNER ════════════════ -->
    <section class="bg-[var(--color-bg-page)] py-20" aria-labelledby="cta-banner-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="reveal rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 shadow-[var(--shadow-card)]">
                <div class="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
                    <div>
                        <h3 id="cta-banner-heading" class="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                            <?php esc_html_e( 'Готовы обсудить проект?', 'stroymaks2026' ); ?>
                        </h3>
                        <p class="mt-2 text-base leading-relaxed text-[var(--color-text-secondary)]">
                            <?php esc_html_e( 'Рассчитаем стоимость, подберём продукцию, организуем доставку.', 'stroymaks2026' ); ?>
                        </p>
                    </div>
                    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>"
                       class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] flex-shrink-0"
                       style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<?php
// ── Inline JS for HTML fallback form (only if CF7 is NOT active) ──
if ( ! ( $cf7_contacts_id && shortcode_exists( 'contact-form-7' ) ) ) :
?>
<script>
(function() {
    var form = document.getElementById('<?php echo esc_js( $form_id ); ?>');
    if (!form) return;

    var fields  = document.getElementById('<?php echo esc_js( $form_id ); ?>-fields');
    var success = document.getElementById('<?php echo esc_js( $form_id ); ?>-success');
    var submitBtn = document.getElementById('<?php echo esc_js( $form_id ); ?>-submit');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var nameVal  = document.getElementById('<?php echo esc_js( $form_id ); ?>-name').value.trim();
        var phoneVal = document.getElementById('<?php echo esc_js( $form_id ); ?>-phone').value.trim();
        var emailVal = document.getElementById('<?php echo esc_js( $form_id ); ?>-email').value.trim();
        var msgVal   = document.getElementById('<?php echo esc_js( $form_id ); ?>-message').value.trim();

        if (!nameVal || !phoneVal) {
            alert('<?php echo esc_js( __( 'Пожалуйста, заполните обязательные поля: Имя и Телефон.', 'stroymaks2026' ) ); ?>');
            return;
        }

        var lead = {
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
            message: msgVal,
            timestamp: new Date().toISOString()
        };

        try {
            var leads = JSON.parse(localStorage.getItem('stroymax_leads') || '[]');
            leads.push(lead);
            localStorage.setItem('stroymax_leads', JSON.stringify(leads));
        } catch (err) {}

        fields.classList.add('hidden');
        success.classList.remove('hidden');
        if (submitBtn) submitBtn.classList.add('hidden');

        setTimeout(function() {
            fields.classList.remove('hidden');
            success.classList.add('hidden');
            if (submitBtn) submitBtn.classList.remove('hidden');
            form.reset();
        }, 4000);
    });
})();
</script>
<?php endif; ?>

<?php
get_footer();