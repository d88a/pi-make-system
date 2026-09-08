<?php
/**
 * Template part: Lead Form — «Рассчитайте стоимость» (v8)
 *
 * Playfair Display + Source Serif 4, #32598f accent.
 * Two-column: left text + right form card.
 * CF7-aware: uses do_shortcode() if cf7_lead_id is set in Customizer.
 * ELSE: HTML fallback with localStorage JS.
 *
 * @package stroymaks2026
 * @var array $args {
 *     @type string $heading   Form heading (Customizer).
 *     @type string $subtitle  Form subtitle (Customizer).
 *     @type string $id        Unique ID suffix for multiple forms on page.
 * }
 */

defined( 'ABSPATH' ) || exit;

$form_heading  = isset( $args['heading'] ) ? $args['heading'] : get_theme_mod( 'stroymaks2026_lead_heading', 'Рассчитайте стоимость вашего проекта' );
$form_subtitle = isset( $args['subtitle'] ) ? $args['subtitle'] : get_theme_mod( 'stroymaks2026_lead_subtitle', 'Оставьте заявку и получите точный расчёт стоимости с учётом доставки в ваш регион в течение 24 часов.' );
$form_id_sfx   = isset( $args['id'] ) ? sanitize_key( $args['id'] ) : 'main';
$form_id       = 'lead-form-' . $form_id_sfx;

// Check if CF7 is configured
$cf7_lead_id = get_theme_mod( 'stroymaks2026_cf7_lead_id', '' );
?>

<section id="calculate" class="bg-[var(--color-bg-page)] py-24" aria-labelledby="<?php echo esc_attr( $form_id ); ?>-heading">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">

            <!-- Left: text -->
            <div class="lg:col-span-2 reveal">
                <h2 id="<?php echo esc_attr( $form_id ); ?>-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
                    <?php echo esc_html( $form_heading ); ?>
                </h2>
                <?php if ( $form_subtitle ) : ?>
                    <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]">
                        <?php echo esc_html( $form_subtitle ); ?>
                    </p>
                <?php endif; ?>
                <div class="mt-8 space-y-4">
                    <div class="flex items-start gap-3">
                        <svg class="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="text-sm leading-relaxed text-[var(--color-text-secondary)]"><?php esc_html_e( 'Бесплатный расчёт', 'stroymaks2026' ); ?></span>
                    </div>
                    <div class="flex items-start gap-3">
                        <svg class="mt-1 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                        </svg>
                        <span class="text-sm leading-relaxed text-[var(--color-text-secondary)]"><?php esc_html_e( 'Доставка по всей России', 'stroymaks2026' ); ?></span>
                    </div>
                </div>
            </div>

            <!-- Right: form card -->
            <div class="lg:col-span-3 reveal">
                <?php if ( $cf7_lead_id && shortcode_exists( 'contact-form-7' ) ) : ?>
                    <!-- CF7 Form (configured in WP admin) -->
                    <div class="cf7-lead-wrapper rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
                        <?php echo do_shortcode( '[contact-form-7 id="' . esc_attr( $cf7_lead_id ) . '"]' ); ?>
                    </div>
                <?php else : ?>
                    <!-- HTML Fallback -->
                    <form id="<?php echo esc_attr( $form_id ); ?>"
                          class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]"
                          aria-label="<?php esc_attr_e( 'Форма расчёта стоимости', 'stroymaks2026' ); ?>"
                          novalidate>
                        <?php wp_nonce_field( 'stroymaks2026_lead_form', 'lead_form_nonce' ); ?>

                        <!-- Success message (hidden by default) -->
                        <div id="<?php echo esc_attr( $form_id ); ?>-success"
                             class="hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
                             role="status"
                             aria-live="polite">
                            <svg class="mx-auto h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <p class="mt-3 font-display text-lg font-semibold text-emerald-700"><?php esc_html_e( 'Заявка отправлена!', 'stroymaks2026' ); ?></p>
                            <p class="mt-1 text-sm text-emerald-600"><?php esc_html_e( 'Мы свяжемся с вами в течение 24 часов.', 'stroymaks2026' ); ?></p>
                        </div>

                        <!-- Form fields -->
                        <div id="<?php echo esc_attr( $form_id ); ?>-fields">
                            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <!-- Name -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-name" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Имя', 'stroymaks2026' ); ?>
                                    </label>
                                    <input
                                        id="<?php echo esc_attr( $form_id ); ?>-name"
                                        type="text"
                                        placeholder="<?php esc_attr_e( 'Иван Петров', 'stroymaks2026' ); ?>"
                                        required
                                        aria-required="true"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    />
                                    <p id="<?php echo esc_attr( $form_id ); ?>-name-error" class="mt-1.5 hidden text-xs text-[var(--color-danger)]" role="alert"><?php esc_html_e( 'Укажите имя', 'stroymaks2026' ); ?></p>
                                </div>

                                <!-- Phone -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-phone" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Телефон', 'stroymaks2026' ); ?>
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
                                    <p id="<?php echo esc_attr( $form_id ); ?>-phone-error" class="mt-1.5 hidden text-xs text-[var(--color-danger)]" role="alert"><?php esc_html_e( 'Укажите телефон', 'stroymaks2026' ); ?></p>
                                </div>

                                <!-- Email -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-email" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Email', 'stroymaks2026' ); ?>
                                    </label>
                                    <input
                                        id="<?php echo esc_attr( $form_id ); ?>-email"
                                        type="email"
                                        placeholder="ivan@example.com"
                                        required
                                        aria-required="true"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    />
                                    <p id="<?php echo esc_attr( $form_id ); ?>-email-error" class="mt-1.5 hidden text-xs text-[var(--color-danger)]" role="alert"><?php esc_html_e( 'Укажите email', 'stroymaks2026' ); ?></p>
                                </div>

                                <!-- Product type -->
                                <div>
                                    <label for="<?php echo esc_attr( $form_id ); ?>-product" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                        <?php esc_html_e( 'Тип продукции', 'stroymaks2026' ); ?>
                                    </label>
                                    <select
                                        id="<?php echo esc_attr( $form_id ); ?>-product"
                                        required
                                        aria-required="true"
                                        class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                        style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                    >
                                        <option value=""><?php esc_html_e( 'Выберите тип', 'stroymaks2026' ); ?></option>
                                        <option value="bruschatka"><?php esc_html_e( 'Брусчатка тротуарная', 'stroymaks2026' ); ?></option>
                                        <option value="plitka"><?php esc_html_e( 'Тротуарная плитка', 'stroymaks2026' ); ?></option>
                                        <option value="bordyury"><?php esc_html_e( 'Бордюры и водостоки', 'stroymaks2026' ); ?></option>
                                        <option value="pamyatniki"><?php esc_html_e( 'Памятники из бетона', 'stroymaks2026' ); ?></option>
                                        <option value="other"><?php esc_html_e( 'Другое', 'stroymaks2026' ); ?></option>
                                    </select>
                                </div>
                            </div>

                            <!-- Comment -->
                            <div class="mt-5">
                                <label for="<?php echo esc_attr( $form_id ); ?>-comment" class="block text-sm font-medium text-[var(--color-text-primary)]">
                                    <?php esc_html_e( 'Комментарий', 'stroymaks2026' ); ?>
                                </label>
                                <textarea
                                    id="<?php echo esc_attr( $form_id ); ?>-comment"
                                    rows="3"
                                    placeholder="<?php esc_attr_e( 'Опишите ваш проект: площадь, регион, пожелания по цвету...', 'stroymaks2026' ); ?>"
                                    class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
                                    style="transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);"
                                ></textarea>
                            </div>

                            <!-- Submit -->
                            <button
                                id="<?php echo esc_attr( $form_id ); ?>-submit"
                                type="submit"
                                class="mt-6 w-full rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
                                style="transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);"
                            >
                                <?php esc_html_e( 'Отправить заявку', 'stroymaks2026' ); ?>
                            </button>
                            <p class="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                                <?php esc_html_e( 'Нажимая кнопку, вы соглашаетесь с обработкой персональных данных. Никакого спама.', 'stroymaks2026' ); ?>
                            </p>
                        </div>
                    </form>
                <?php endif; ?>
            </div>

        </div>
    </div>
</section>

<?php if ( ! ( $cf7_lead_id && shortcode_exists( 'contact-form-7' ) ) ) : ?>
<script>
(function() {
    var form = document.getElementById('<?php echo esc_js( $form_id ); ?>');
    if (!form) return;

    var fields   = document.getElementById('<?php echo esc_js( $form_id ); ?>-fields');
    var success  = document.getElementById('<?php echo esc_js( $form_id ); ?>-success');
    var submitBtn = document.getElementById('<?php echo esc_js( $form_id ); ?>-submit');

    var nameInput   = document.getElementById('<?php echo esc_js( $form_id ); ?>-name');
    var phoneInput  = document.getElementById('<?php echo esc_js( $form_id ); ?>-phone');
    var emailInput  = document.getElementById('<?php echo esc_js( $form_id ); ?>-email');
    var nameErr     = document.getElementById('<?php echo esc_js( $form_id ); ?>-name-error');
    var phoneErr    = document.getElementById('<?php echo esc_js( $form_id ); ?>-phone-error');
    var emailErr    = document.getElementById('<?php echo esc_js( $form_id ); ?>-email-error');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        [nameErr, phoneErr, emailErr].forEach(function(el) { if (el) el.classList.add('hidden'); });
        var valid = true;

        if (!nameInput.value.trim()) {
            nameErr.classList.remove('hidden');
            nameInput.focus();
            valid = false;
        }
        if (!phoneInput.value.trim()) {
            phoneErr.classList.remove('hidden');
            if (valid) phoneInput.focus();
            valid = false;
        }
        if (!emailInput.value.trim()) {
            emailErr.classList.remove('hidden');
            if (valid) emailInput.focus();
            valid = false;
        }
        if (!valid) return;

        var lead = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            product: document.getElementById('<?php echo esc_js( $form_id ); ?>-product').value,
            comment: document.getElementById('<?php echo esc_js( $form_id ); ?>-comment').value,
            timestamp: new Date().toISOString()
        };

        try {
            var leads = JSON.parse(localStorage.getItem('stroymax_leads') || '[]');
            leads.push(lead);
            localStorage.setItem('stroymax_leads', JSON.stringify(leads));
        } catch (err) {}

        fields.classList.add('hidden');
        success.classList.remove('hidden');
        submitBtn.classList.add('hidden');

        setTimeout(function() {
            fields.classList.remove('hidden');
            success.classList.add('hidden');
            submitBtn.classList.remove('hidden');
            form.reset();
        }, 4000);
    });
})();
</script>
<?php endif; ?>