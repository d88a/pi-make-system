<?php
/**
 * Page Calculator — StroyMaks 2026 (v8)
 *
 * 6 категорий с динамическими полями (JS):
 *   Брусчатка, Тротуарная плитка, Бордюры, Водостоки, Эко-парковка, Памятники.
 * Playfair Display + Source Serif 4, rounded-2xl, #32598f.
 * Форма: CF7 (если задан в Customizer) или HTML fallback с localStorage.
 *
 * Template Name: Калькулятор
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<style>
:root {
  --color-bg-page: #F8FAFC;
  --color-bg-alt: #F1F5F9;
  --color-surface: #FFFFFF;
  --color-bg-elevated: #F8FAFC;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #475569;
  --color-primary: #32598f;
  --color-primary-hover: #274a7c;
  --color-primary-glow: rgba(50,89,143,0.4);
  --color-primary-subtle: rgba(50,89,143,0.08);
  --color-success: #059669;
  --color-danger: #DC2626;
  --color-border: #E2E8F0;
  --color-border-hover: #CBD5E1;
  --gradient-subtle: linear-gradient(180deg, #F8FAFC, #F1F5F9);
  --shadow-brand: 0 10px 30px -10px rgba(50,89,143,0.35);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03);
  --shadow-card-hover: 0 8px 24px -8px rgba(50,89,143,0.15);
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --radius: 16px;
  --font-display: 'Playfair Display', 'Georgia', serif;
  --font-body: 'Source Serif 4', 'Georgia', serif;
}

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Source Serif 4', 'Georgia', serif;
  background-color: var(--color-bg-page);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* Custom select */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 44px;
}

/* Radio group */
.radio-group input[type="radio"] {
  appearance: none;
  width: 0;
  height: 0;
  position: absolute;
  opacity: 0;
}
.radio-group label {
  cursor: pointer;
  transition: var(--transition-fast);
  user-select: none;
}
.radio-group input[type="radio"]:checked + label {
  border-color: var(--color-primary);
  background-color: var(--color-primary-subtle);
  color: var(--color-primary);
}
.radio-group input[type="radio"]:focus-visible + label {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Hide number spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

/* Result pulse */
@keyframes resultPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
.result-updated {
  animation: resultPulse 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dynamic fields */
.field-group {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.field-group-hidden {
  opacity: 0;
  max-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  pointer-events: none;
}
.field-group-visible {
  opacity: 1;
  max-height: 500px;
}
</style>

<main>
  <!-- ════════════════ HERO ════════════════ -->
  <section class="bg-[var(--color-bg-page)] pt-20 pb-12 lg:pt-28 lg:pb-16" aria-labelledby="calc-hero-heading">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center reveal">
      <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)]" style="font-family: var(--font-body);">
        <?php esc_html_e( 'Онлайн-расчёт', 'stroymaks2026' ); ?>
      </span>
      <h1 id="calc-hero-heading" class="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl" style="font-family: var(--font-display);">
        <?php
        while ( have_posts() ) : the_post();
          the_title();
        endwhile;
        ?>
      </h1>
      <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)] max-w-xl mx-auto" style="font-family: var(--font-body);">
        <?php esc_html_e( 'Рассчитайте стоимость продукции СтройМакс за 10 секунд. Выберите категорию — и получите точный расчёт.', 'stroymaks2026' ); ?>
      </p>
    </div>
  </section>

  <!-- ════════════════ CALCULATOR CARD ════════════════ -->
  <section class="bg-[var(--color-bg-page)] pb-20 lg:pb-28" aria-labelledby="calculator-heading">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 reveal">
      <div class="rounded-2xl border-2 border-[var(--color-primary)]/20 bg-[var(--color-surface)] p-6 sm:p-8 lg:p-10 shadow-[var(--shadow-card)]" style="border-radius: var(--radius);">
        <h2 id="calculator-heading" class="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
          <?php esc_html_e( 'Параметры расчёта', 'stroymaks2026' ); ?>
        </h2>

        <!-- Field 1: Категория продукции -->
        <div class="mt-6">
          <label for="calc-category" class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Тип продукции', 'stroymaks2026' ); ?>
          </label>
          <select
            id="calc-category"
            class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            style="font-family: var(--font-body); border-radius: var(--radius);"
            aria-label="<?php esc_attr_e( 'Выберите тип продукции', 'stroymaks2026' ); ?>"
          >
            <option value=""><?php esc_html_e( 'Выберите категорию', 'stroymaks2026' ); ?></option>
            <option value="bruschatka"><?php esc_html_e( 'Брусчатка тротуарная', 'stroymaks2026' ); ?></option>
            <option value="plitka"><?php esc_html_e( 'Тротуарная плитка', 'stroymaks2026' ); ?></option>
            <option value="bordyury"><?php esc_html_e( 'Бордюры', 'stroymaks2026' ); ?></option>
            <option value="vodostoki"><?php esc_html_e( 'Водостоки', 'stroymaks2026' ); ?></option>
            <option value="ecopark"><?php esc_html_e( 'Эко-парковка', 'stroymaks2026' ); ?></option>
            <option value="pamyatniki"><?php esc_html_e( 'Памятники из бетона', 'stroymaks2026' ); ?></option>
          </select>
        </div>

        <!-- DYNAMIC: Цвет (radio) — категории 1-2 -->
        <div id="field-color" class="field-group field-group-hidden mt-6">
          <fieldset>
            <legend class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
              <?php esc_html_e( 'Цвет', 'stroymaks2026' ); ?>
            </legend>
            <div class="radio-group mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="<?php esc_attr_e( 'Выберите цвет', 'stroymaks2026' ); ?>">
              <div class="relative">
                <input type="radio" id="calc-color-gray" name="calc-color" value="Серый" checked>
                <label for="calc-color-gray" class="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                  <span class="flex items-center gap-2">
                    <span class="h-5 w-5 rounded-full border border-[var(--color-border)] bg-gray-400" aria-hidden="true"></span>
                    <?php esc_html_e( 'Серый', 'stroymaks2026' ); ?>
                  </span>
                  <span class="text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">850 ₽/м²</span>
                </label>
              </div>
              <div class="relative">
                <input type="radio" id="calc-color-colored" name="calc-color" value="Цветной">
                <label for="calc-color-colored" class="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                  <span class="flex items-center gap-2">
                    <span class="h-5 w-5 rounded-full border border-[var(--color-border)] bg-amber-600" aria-hidden="true"></span>
                    <?php esc_html_e( 'Цветной', 'stroymaks2026' ); ?>
                  </span>
                  <span class="text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">1100 ₽/м²</span>
                </label>
              </div>
              <div class="relative">
                <input type="radio" id="calc-color-marble" name="calc-color" value="Мрамор из бетона">
                <label for="calc-color-marble" class="flex items-center justify-between rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                  <span class="flex items-center gap-2">
                    <span class="h-5 w-5 rounded-full border border-[var(--color-border)] bg-gradient-to-br from-stone-200 to-stone-400" aria-hidden="true"></span>
                    <?php esc_html_e( 'Мрамор', 'stroymaks2026' ); ?>
                  </span>
                  <span class="text-xs font-medium text-[var(--color-text-muted)] whitespace-nowrap">1100 ₽/м²</span>
                </label>
              </div>
            </div>
          </fieldset>
        </div>

        <!-- DYNAMIC: Площадь (м²) — категории 1-2, 5 -->
        <div id="field-area" class="field-group field-group-hidden mt-6">
          <label for="calc-area" class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Площадь, м²', 'stroymaks2026' ); ?>
          </label>
          <div class="relative mt-1.5">
            <input
              type="number"
              id="calc-area"
              min="0.1"
              step="0.1"
              placeholder="<?php esc_attr_e( 'Например: 50', 'stroymaks2026' ); ?>"
              class="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              style="font-family: var(--font-body); border-radius: var(--radius);"
              aria-label="<?php esc_attr_e( 'Площадь в квадратных метрах', 'stroymaks2026' ); ?>"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)] pointer-events-none" style="font-family: var(--font-body);">м²</span>
          </div>
        </div>

        <!-- DYNAMIC: Размер бордюра — категория 3 -->
        <div id="field-size-bordyury" class="field-group field-group-hidden mt-6">
          <label for="calc-size-bordyury" class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Размер бордюра', 'stroymaks2026' ); ?>
          </label>
          <select
            id="calc-size-bordyury"
            class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            style="font-family: var(--font-body); border-radius: var(--radius);"
            aria-label="<?php esc_attr_e( 'Выберите размер бордюра', 'stroymaks2026' ); ?>"
          >
            <option value="500×200×60">500×200×60 — 150 ₽/шт</option>
            <option value="1000×200×70">1000×200×70 — 300 ₽/шт</option>
            <option value="500×200×40">500×200×40 — 120 ₽/шт</option>
          </select>
        </div>

        <!-- DYNAMIC: Размер водостока — категория 4 -->
        <div id="field-size-vodostoki" class="field-group field-group-hidden mt-6">
          <label for="calc-size-vodostoki" class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Размер водостока', 'stroymaks2026' ); ?>
          </label>
          <select
            id="calc-size-vodostoki"
            class="mt-1.5 block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
            style="font-family: var(--font-body); border-radius: var(--radius);"
            aria-label="<?php esc_attr_e( 'Выберите размер водостока', 'stroymaks2026' ); ?>"
          >
            <option value="500×150×50">500×150×50 — 200 ₽/шт</option>
            <option value="300×150×60">300×150×60 — 150 ₽/шт</option>
            <option value="250×150×80">250×150×80 — 150 ₽/шт</option>
          </select>
        </div>

        <!-- DYNAMIC: Количество (шт) — категории 3-4 -->
        <div id="field-quantity" class="field-group field-group-hidden mt-6">
          <label for="calc-quantity" class="block text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Количество, шт', 'stroymaks2026' ); ?>
          </label>
          <div class="relative mt-1.5">
            <input
              type="number"
              id="calc-quantity"
              min="1"
              step="1"
              placeholder="<?php esc_attr_e( 'Например: 50', 'stroymaks2026' ); ?>"
              class="block w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] transition-all duration-150 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              style="font-family: var(--font-body); border-radius: var(--radius);"
              aria-label="<?php esc_attr_e( 'Количество в штуках', 'stroymaks2026' ); ?>"
            >
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-muted)] pointer-events-none" style="font-family: var(--font-body);">шт</span>
          </div>
        </div>

        <!-- DYNAMIC: Памятники — категория 6 -->
        <div id="field-pamyatniki" class="field-group field-group-hidden mt-6">
          <div class="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 text-center" style="border-radius: var(--radius);">
            <svg class="mx-auto h-10 w-10 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
            </svg>
            <p class="mt-3 text-sm font-medium text-[var(--color-text-primary)]" style="font-family: var(--font-body);">
              <?php esc_html_e( 'Памятники изготавливаются индивидуально', 'stroymaks2026' ); ?>
            </p>
            <p class="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
              <?php esc_html_e( 'Цена зависит от размера, формы и отделки. Свяжитесь с нами для точного расчёта.', 'stroymaks2026' ); ?>
            </p>
            <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a href="<?php echo esc_url( home_url( '/contacts' ) ); ?>" class="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                <?php esc_html_e( 'Связаться с нами', 'stroymaks2026' ); ?>
              </a>
              <a href="tel:+79823416970" class="inline-flex items-center justify-center rounded-2xl border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition-all duration-200 hover:bg-[var(--color-bg-alt)]" style="font-family: var(--font-body); border-radius: var(--radius);">
                <svg class="mr-1.5 h-4 w-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                <?php esc_html_e( 'Позвонить', 'stroymaks2026' ); ?>
              </a>
            </div>
          </div>
        </div>

        <!-- RESULT BLOCK -->
        <div id="result-block" class="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] p-6 text-center" style="border-radius: var(--radius);" aria-live="polite" aria-atomic="true">
          <span class="block text-sm font-medium text-[var(--color-text-muted)]" style="font-family: var(--font-body);"><?php esc_html_e( 'Итого', 'stroymaks2026' ); ?></span>
          <span id="calc-result" class="mt-2 block font-display text-4xl font-bold text-[var(--color-primary)] sm:text-5xl" style="font-family: var(--font-display);">
            —
          </span>
          <span id="calc-result-detail" class="mt-1 block text-xs text-[var(--color-text-muted)] whitespace-nowrap" style="font-family: var(--font-body);">
            &nbsp;
          </span>
        </div>

        <!-- Delivery link (replaces checkbox) -->
        <p class="mt-3 text-center">
          <a href="<?php echo esc_url( home_url( '/delivery' ) ); ?>" class="text-xs text-[var(--color-text-muted)] transition-colors duration-150 hover:text-[var(--color-primary)]" style="font-family: var(--font-body);">
            <?php esc_html_e( 'Узнать стоимость доставки', 'stroymaks2026' ); ?> →
          </a>
        </p>

        <!-- CTA: Scroll to form -->
        <button
          id="calc-submit-btn"
          onclick="scrollToForm()"
          class="mt-4 w-full rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-surface)]"
          style="font-family: var(--font-body); border-radius: var(--radius);"
        >
          <?php esc_html_e( 'Оставить заявку', 'stroymaks2026' ); ?>
        </button>
      </div>

      <!-- Trust indicators -->
      <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-text-muted)]" style="font-family: var(--font-body);">
        <span class="flex items-center gap-1.5">
          <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <?php esc_html_e( 'Бесплатный расчёт', 'stroymaks2026' ); ?>
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <?php esc_html_e( 'Точные цены', 'stroymaks2026' ); ?>
        </span>
        <span class="flex items-center gap-1.5">
          <svg class="h-5 w-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <?php esc_html_e( 'Ответ в течение 24 часов', 'stroymaks2026' ); ?>
        </span>
      </div>
    </div>
  </section>

  <!-- ════════════════ FORM SECTION ════════════════ -->
  <section id="form-section" class="bg-[var(--color-bg-alt)] py-20 lg:py-24" aria-labelledby="form-heading">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 reveal">
      <div class="text-center">
        <h2 id="form-heading" class="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
          <?php esc_html_e( 'Оформите заявку', 'stroymaks2026' ); ?>
        </h2>
        <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
          <?php esc_html_e( 'Мы свяжемся с вами для уточнения деталей и точного расчёта', 'stroymaks2026' ); ?>
        </p>
      </div>

      <?php
      $cf7_calc_id = get_theme_mod( 'stroymaks2026_cf7_calculator_id', get_theme_mod( 'stroymaks2026_cf7_lead_id', '4724' ) );
      if ( $cf7_calc_id ) :
        echo '<div class="mt-10">';
        echo do_shortcode( '[contact-form-7 id="' . intval( $cf7_calc_id ) . '"]' );
        echo '</div>';
      else :
        echo '<p class="text-center text-[var(--color-text-secondary)] mt-10" style="font-family: var(--font-body);">';
        esc_html_e( 'Форма временно недоступна. Позвоните нам:', 'stroymaks2026' );
        echo ' <a href="tel:+79823416970" class="font-medium text-[var(--color-primary)] hover:underline">+7 (982) 341-69-70</a>';
        echo '</p>';
      endif;
      ?>
    </div>
  </section>
</main>

<script>
(function() {
  // ── CATEGORY-SPECIFIC PRICE CONFIG ──
  var CATEGORY_CONFIG = {
    bruschatka: {
      name: 'Брусчатка тротуарная',
      type: 'area',
      unit: 'м²',
      prices: {
        'Серый': 850,
        'Цветной': 1100,
        'Мрамор из бетона': 1100
      }
    },
    plitka: {
      name: 'Тротуарная плитка',
      type: 'area',
      unit: 'м²',
      prices: {
        'Серый': 850,
        'Цветной': 1100,
        'Мрамор из бетона': 1100
      }
    },
    bordyury: {
      name: 'Бордюры',
      type: 'pieces',
      unit: 'шт',
      prices: {
        '500×200×60': 150,
        '1000×200×70': 300,
        '500×200×40': 120
      }
    },
    vodostoki: {
      name: 'Водостоки',
      type: 'pieces',
      unit: 'шт',
      prices: {
        '500×150×50': 200,
        '300×150×60': 150,
        '250×150×80': 150
      }
    },
    ecopark: {
      name: 'Эко-парковка',
      type: 'area_single',
      unit: 'м²',
      price: 1700
    },
    pamyatniki: {
      name: 'Памятники из бетона',
      type: 'request'
    }
  };

  // ── DOM REFS ──
  var categorySelect = document.getElementById('calc-category');
  var areaInput = document.getElementById('calc-area');
  var quantityInput = document.getElementById('calc-quantity');
  var resultEl = document.getElementById('calc-result');
  var resultDetailEl = document.getElementById('calc-result-detail');
  var resultBlock = document.getElementById('result-block');
  var orderComment = document.getElementById('order-comment');

  var fieldColor = document.getElementById('field-color');
  var fieldArea = document.getElementById('field-area');
  var fieldSizeBordyury = document.getElementById('field-size-bordyury');
  var fieldSizeVodostoki = document.getElementById('field-size-vodostoki');
  var fieldQuantity = document.getElementById('field-quantity');
  var fieldPamyatniki = document.getElementById('field-pamyatniki');

  var allFieldGroups = [fieldColor, fieldArea, fieldSizeBordyury, fieldSizeVodostoki, fieldQuantity, fieldPamyatniki];

  // ── HELPERS ──
  function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
  }

  function hideAllFields() {
    allFieldGroups.forEach(function(group) {
      group.classList.remove('field-group-visible');
      group.classList.add('field-group-hidden');
    });
  }

  function showField(group) {
    group.classList.remove('field-group-hidden');
    group.classList.add('field-group-visible');
  }

  function getSelectedColor() {
    var radios = document.querySelectorAll('input[name="calc-color"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return null;
  }

  function getSelectedSize(selectId) {
    var select = document.getElementById(selectId);
    return select ? select.value : null;
  }

  // ── CATEGORY CHANGE → SHOW/HIDE FIELDS ──
  function onCategoryChange() {
    var category = categorySelect.value;

    areaInput.value = '';
    quantityInput.value = '';
    var grayRadio = document.getElementById('calc-color-gray');
    if (grayRadio) grayRadio.checked = true;

    hideAllFields();

    if (!category) {
      resultEl.textContent = '—';
      resultDetailEl.innerHTML = '&nbsp;';
      if (orderComment) orderComment.value = '';
      resultBlock.style.opacity = '0.5';
      return;
    }

    resultBlock.style.opacity = '1';
    var config = CATEGORY_CONFIG[category];

    switch (config.type) {
      case 'area':
        showField(fieldColor);
        showField(fieldArea);
        break;
      case 'pieces':
        if (category === 'bordyury') {
          showField(fieldSizeBordyury);
        } else if (category === 'vodostoki') {
          showField(fieldSizeVodostoki);
        }
        showField(fieldQuantity);
        break;
      case 'area_single':
        showField(fieldArea);
        break;
      case 'request':
        showField(fieldPamyatniki);
        resultEl.textContent = 'По запросу';
        resultDetailEl.textContent = 'Памятники изготавливаются индивидуально';
        if (orderComment) orderComment.value = 'Расчёт: Памятники из бетона — цена по запросу';
        return;
    }

    calculate();
  }

  // ── CALCULATE ──
  function calculate() {
    var category = categorySelect.value;

    if (!category) {
      resultEl.textContent = '—';
      resultDetailEl.innerHTML = '&nbsp;';
      if (orderComment) orderComment.value = '';
      return;
    }

    var config = CATEGORY_CONFIG[category];

    if (config.type === 'request') return;

    // Area-based: categories 1-2 (брусчатка/плитка с цветом)
    if (config.type === 'area') {
      var area = parseFloat(areaInput.value);

      if (!areaInput.value || isNaN(area) || area <= 0) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Введите площадь';
        if (orderComment) orderComment.value = '';
        return;
      }

      var color = getSelectedColor();
      if (!color) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Выберите цвет';
        return;
      }

      var pricePerM2 = config.prices[color];
      if (!pricePerM2) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Выберите цвет';
        return;
      }

      var total = area * pricePerM2;
      var formatted = formatNumber(Math.round(total));

      resultEl.textContent = formatted + ' ₽';
      resultEl.classList.remove('result-updated');
      void resultEl.offsetWidth;
      resultEl.classList.add('result-updated');

      resultDetailEl.innerHTML = formatNumber(area) + ' м² × <span class="whitespace-nowrap">' + formatNumber(pricePerM2) + ' ₽/м²</span> (' + color.toLowerCase() + ') = <span class="whitespace-nowrap">' + formatted + ' ₽</span>';
      if (orderComment) orderComment.value = 'Расчёт: ' + config.name + ' / ' + color + ' / ' + formatNumber(area) + ' м² = ' + formatted + ' ₽';
      return;
    }

    // Area-based: category 5 (эко-парковка)
    if (config.type === 'area_single') {
      var areaSingle = parseFloat(areaInput.value);

      if (!areaInput.value || isNaN(areaSingle) || areaSingle <= 0) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Введите площадь';
        if (orderComment) orderComment.value = '';
        return;
      }

      var totalSingle = areaSingle * config.price;
      var formattedSingle = formatNumber(Math.round(totalSingle));

      resultEl.textContent = formattedSingle + ' ₽';
      resultEl.classList.remove('result-updated');
      void resultEl.offsetWidth;
      resultEl.classList.add('result-updated');

      resultDetailEl.innerHTML = formatNumber(areaSingle) + ' м² × <span class="whitespace-nowrap">' + formatNumber(config.price) + ' ₽/м²</span> = <span class="whitespace-nowrap">' + formattedSingle + ' ₽</span>';
      if (orderComment) orderComment.value = 'Расчёт: ' + config.name + ' / ' + formatNumber(areaSingle) + ' м² = ' + formattedSingle + ' ₽';
      return;
    }

    // Pieces-based: categories 3-4 (бордюры/водостоки)
    if (config.type === 'pieces') {
      var quantity = parseInt(quantityInput.value, 10);

      if (!quantityInput.value || isNaN(quantity) || quantity < 1) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Введите количество';
        if (orderComment) orderComment.value = '';
        return;
      }

      var sizeValue;
      if (category === 'bordyury') {
        sizeValue = getSelectedSize('calc-size-bordyury');
      } else if (category === 'vodostoki') {
        sizeValue = getSelectedSize('calc-size-vodostoki');
      }

      if (!sizeValue) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Выберите размер';
        return;
      }

      var pricePerPiece = config.prices[sizeValue];
      if (!pricePerPiece) {
        resultEl.textContent = '—';
        resultDetailEl.textContent = 'Выберите размер';
        return;
      }

      var totalPieces = quantity * pricePerPiece;
      var formattedPieces = formatNumber(totalPieces);

      resultEl.textContent = formattedPieces + ' ₽';
      resultEl.classList.remove('result-updated');
      void resultEl.offsetWidth;
      resultEl.classList.add('result-updated');

      resultDetailEl.innerHTML = quantity + ' шт × <span class="whitespace-nowrap">' + formatNumber(pricePerPiece) + ' ₽/шт</span> (' + sizeValue + ') = <span class="whitespace-nowrap">' + formattedPieces + ' ₽</span>';
      if (orderComment) orderComment.value = 'Расчёт: ' + config.name + ' / ' + sizeValue + ' / ' + quantity + ' шт = ' + formattedPieces + ' ₽';
      return;
    }
  }

  // ── SCROLL TO FORM ──
  window.scrollToForm = function() {
    var formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ── EVENT LISTENERS ──
  if (categorySelect) {
    categorySelect.addEventListener('change', onCategoryChange);
  }

  document.querySelectorAll('input[name="calc-color"]').forEach(function(radio) {
    radio.addEventListener('change', calculate);
  });

  if (areaInput) {
    areaInput.addEventListener('input', calculate);
  }

  if (quantityInput) {
    quantityInput.addEventListener('input', calculate);
  }

  var sizeBordyury = document.getElementById('calc-size-bordyury');
  if (sizeBordyury) {
    sizeBordyury.addEventListener('change', calculate);
  }

  var sizeVodostoki = document.getElementById('calc-size-vodostoki');
  if (sizeVodostoki) {
    sizeVodostoki.addEventListener('change', calculate);
  }

  // ── INITIAL STATE ──
  if (resultBlock) resultBlock.style.opacity = '0.5';
  hideAllFields();

  // ── SCROLL REVEAL ──
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) e.target.classList.add('is-visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });


})();
</script>

<!-- CF7 Pre-fill: auto-fill your-message from calculator fields -->
<script>
(function() {
  var calcCategory = document.getElementById('calc-category');
  var cf7Message = document.querySelector('textarea[name="your-message"]');

  // Only on calculator page (both elements must exist)
  if (!calcCategory || !cf7Message) return;

  var CATEGORY_NAMES = {
    bruschatka: 'Брусчатка тротуарная',
    plitka: 'Тротуарная плитка',
    bordyury: 'Бордюры',
    vodostoki: 'Водостоки',
    ecopark: 'Эко-парковка',
    pamyatniki: 'Памятники из бетона'
  };

  function buildCalcSummary() {
    var lines = [];
    var category = calcCategory.value;

    if (category) {
      var catName = CATEGORY_NAMES[category] || category;
      lines.push('• Категория: ' + catName);

      // Color (radio)
      var colorRadio = document.querySelector('input[name="calc-color"]:checked');
      if (colorRadio && colorRadio.value) {
        var fieldColor = document.getElementById('field-color');
        if (fieldColor && fieldColor.classList.contains('field-group-visible')) {
          lines.push('• Цвет: ' + colorRadio.value);
        }
      }

      // Area
      var areaEl = document.getElementById('calc-area');
      var fieldArea = document.getElementById('field-area');
      if (areaEl && areaEl.value && fieldArea && fieldArea.classList.contains('field-group-visible')) {
        lines.push('• Площадь: ' + areaEl.value + ' м²');
      }

      // Size (bordyury or vodostoki)
      var sizeBordyury = document.getElementById('calc-size-bordyury');
      var fieldSizeBordyury = document.getElementById('field-size-bordyury');
      if (sizeBordyury && fieldSizeBordyury && fieldSizeBordyury.classList.contains('field-group-visible')) {
        lines.push('• Размер: ' + sizeBordyury.value);
      }

      var sizeVodostoki = document.getElementById('calc-size-vodostoki');
      var fieldSizeVodostoki = document.getElementById('field-size-vodostoki');
      if (sizeVodostoki && fieldSizeVodostoki && fieldSizeVodostoki.classList.contains('field-group-visible')) {
        lines.push('• Размер: ' + sizeVodostoki.value);
      }

      // Quantity
      var qtyEl = document.getElementById('calc-quantity');
      var fieldQuantity = document.getElementById('field-quantity');
      if (qtyEl && qtyEl.value && fieldQuantity && fieldQuantity.classList.contains('field-group-visible')) {
        lines.push('• Количество: ' + qtyEl.value + ' шт');
      }

      // Result
      var resultEl = document.getElementById('calc-result');
      if (resultEl) {
        var resultText = resultEl.textContent.trim();
        if (resultText === '—' || resultText === '') {
          lines.push('• Итого: не рассчитано');
        } else {
          lines.push('• Итого: ' + resultText);
        }
      }
    }

    return lines.join('\n');
  }

  function fillMessage() {
    // setTimeout: wait for existing calculator script to update #calc-result first
    setTimeout(function() {
      cf7Message.value = buildCalcSummary();
    }, 50);
  }

  // Listen on all calculator inputs
  if (calcCategory) {
    calcCategory.addEventListener('change', fillMessage);
  }

  var colorRadios = document.querySelectorAll('input[name="calc-color"]');
  colorRadios.forEach(function(r) { r.addEventListener('change', fillMessage); });

  var areaInput = document.getElementById('calc-area');
  if (areaInput) areaInput.addEventListener('input', fillMessage);

  var qtyInput = document.getElementById('calc-quantity');
  if (qtyInput) qtyInput.addEventListener('input', fillMessage);

  var sizeBord = document.getElementById('calc-size-bordyury');
  if (sizeBord) sizeBord.addEventListener('change', fillMessage);

  var sizeVod = document.getElementById('calc-size-vodostoki');
  if (sizeVod) sizeVod.addEventListener('change', fillMessage);

  // Initial fill on page load (if calculator has pre-selected values)
  if (calcCategory.value) {
    fillMessage();
  }

})();
</script>

<?php
get_footer();