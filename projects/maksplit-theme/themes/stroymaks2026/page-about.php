<?php
/**
 * Page About — StroyMaks 2026 (v8 Editorial)
 *
 * Typography-First Editorial layout: Playfair Display + Source Serif 4.
 * Sections: hero + kevlarobeton + technology + GOST table + production + delivery + CTA.
 * Real data from about.html v8 (D-134 — НЕ выдумывать).
 *
 * Template Name: О компании
 *
 * @package stroymaks2026
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main role="main" aria-label="<?php esc_attr_e( 'Страница о компании', 'stroymaks2026' ); ?>">

    <!-- ════════════════ HERO: Typography-First Editorial ════════════════ -->
    <section class="relative flex flex-col justify-center bg-[var(--color-bg-page)] px-4 py-24 sm:px-6 lg:px-8 lg:py-32" aria-labelledby="about-hero-heading">
        <!-- Subtle grid pattern -->
        <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><defs><pattern id=&quot;g&quot; width=&quot;60&quot; height=&quot;60&quot; patternUnits=&quot;userSpaceOnUse&quot;><path d=&quot;M60 0H0v60&quot; fill=&quot;none&quot; stroke=&quot;%2332598f&quot; stroke-width=&quot;1&quot;/></pattern></defs><rect width=&quot;100%25&quot; height=&quot;100%25&quot; fill=&quot;url(%23g)&quot;/></svg>');"></div>

        <div class="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-5 w-full">
            <!-- Left: editorial typography (3/5) -->
            <div class="lg:col-span-3 reveal">
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Юрюзань, Челябинская область', 'stroymaks2026' ); ?>
                </span>
                <h1 id="about-hero-heading" class="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.02em] text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl" style="font-family: var(--font-display);">
                    <?php
                    if ( have_posts() ) :
                        the_post();
                        esc_html_e( 'О компании', 'stroymaks2026' );
                        echo '<br><span class="text-[var(--color-primary)]">';
                        the_title();
                        echo '</span>';
                    endif;
                    ?>
                </h1>
                <div class="editorial-divider my-8"></div>
                <p class="max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Компания «СтройМакс» производит изделия для благоустройства территорий из материала кевларобетон методом вибролитья. Качество, подтверждённое лабораторными испытаниями и реальными проектами.', 'stroymaks2026' ); ?>
                </p>
                <div class="mt-8 flex flex-wrap gap-4">
                    <a href="#cta" class="inline-flex items-center rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Связаться с нами', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </a>
                    <a href="#cta" class="inline-flex items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3.5 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]" style="font-family: var(--font-body); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Связаться с нами', 'stroymaks2026' ); ?>
                    </a>
                </div>
            </div>

            <!-- Right: bounded image (2/5) -->
            <div class="lg:col-span-2 reveal">
                <div class="relative overflow-hidden rounded-2xl shadow-[var(--shadow-brand)]" style="border-radius: var(--radius);">
                    <?php
                    $hero_img = get_template_directory_uri() . '/assets/images/hero-bruschatka.jpg';
                    ?>
                    <img src="<?php echo esc_url( $hero_img ); ?>" alt="<?php esc_attr_e( 'Кевларовая брусчатка СтройМакс — продукция компании', 'stroymaks2026' ); ?>" class="w-full h-auto max-h-[400px] lg:max-h-[500px] object-cover" loading="eager">
                    <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--color-border)]" aria-hidden="true" style="border-radius: var(--radius);"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════════════ SECTION 1: Что такое кевларобетон ════════════════ -->
    <section class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="kevlar-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
                <!-- Left: image (2/5) -->
                <div class="lg:col-span-2 reveal">
                    <div class="relative overflow-hidden rounded-2xl" style="border-radius: var(--radius);">
                        <?php
                        $kevlar_img = get_template_directory_uri() . '/assets/images/p-staryj-gorod.png';
                        ?>
                        <img src="<?php echo esc_url( $kevlar_img ); ?>" alt="<?php esc_attr_e( 'Брусчатка Старый город — пример изделия из кевларобетона', 'stroymaks2026' ); ?>" class="w-full h-auto object-cover" loading="lazy">
                        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--color-border)]" aria-hidden="true" style="border-radius: var(--radius);"></div>
                    </div>
                </div>

                <!-- Right: text (3/5) -->
                <div class="lg:col-span-3 reveal">
                    <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Материал', 'stroymaks2026' ); ?>
                    </span>
                    <h2 id="kevlar-heading" class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Что такое кевларобетон', 'stroymaks2026' ); ?>
                    </h2>
                    <div class="editorial-divider my-6"></div>
                    <div class="space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <p>
                            <?php esc_html_e( 'Кевларобетон — это уникальный материал, превосходящий обычный бетон по своим прочностным характеристикам. Его повышенная прочность, твердость и устойчивость к нагрузкам достигаются за счет использования специальных компонентов и особой технологии производства.', 'stroymaks2026' ); ?>
                        </p>
                        <p>
                            <?php esc_html_e( 'Тротуарная плитка, созданная с помощью технологии вибролитья, завоевала популярность благодаря своему эстетическому виду и долговечности. Этот процесс включает в себя использование вибрационных форм, в которых бетон заполняется насыпным способом. Благодаря этому методу достигается высокая плотность и прочность изделия, что особенно важно для тротуарной плитки, которая подвергается значительным нагрузкам.', 'stroymaks2026' ); ?>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════════════ SECTION 2: Технология вибролитья ════════════════ -->
    <section class="bg-[var(--color-bg-page)] py-24" aria-labelledby="tech-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-3xl reveal">
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Технология', 'stroymaks2026' ); ?>
                </span>
                <h2 id="tech-heading" class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Технология вибролитья', 'stroymaks2026' ); ?>
                </h2>
                <div class="editorial-divider my-6"></div>
                <div class="space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <p>
                        <?php esc_html_e( 'Производим изделия из кевларобетона методом вибролитья. Используем качественные материалы — цемент, наполнитель, кевларовое волокно и пластификаторы.', 'stroymaks2026' ); ?>
                    </p>
                    <p>
                        <?php esc_html_e( 'Вибролитьё обеспечивает высокую плотность, отсутствие пористости и гладкую поверхность. Каждое изделие проходит контроль качества.', 'stroymaks2026' ); ?>
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════════════ SECTION 4: Производство ════════════════ -->
    <section class="bg-[var(--color-bg-page)] py-24" aria-labelledby="production-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
                <!-- Left: text (3/5) -->
                <div class="lg:col-span-3 reveal">
                    <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Производство', 'stroymaks2026' ); ?>
                    </span>
                    <h2 id="production-heading" class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                        <?php esc_html_e( 'Где мы производим', 'stroymaks2026' ); ?>
                    </h2>
                    <div class="editorial-divider my-6"></div>
                    <p class="text-base leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                        <?php esc_html_e( 'Производство расположено в городе Юрюзань Челябинской области, Катав-Ивановский район. У компании «СтройМакс» можно купить разнообразную продукцию высокого качества. В наличии широкий ассортимент. Организуем доставку по всей России.', 'stroymaks2026' ); ?>
                    </p>
                    <div class="mt-6 space-y-3">
                        <div class="flex items-start gap-3">
                            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
                            <span class="text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body);"><?php esc_html_e( 'г. Юрюзань, Челябинская область, Катав-Ивановский район, ул. Тимирязева, 15а', 'stroymaks2026' ); ?></span>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg class="h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                            <a href="tel:+79823416970" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors" style="font-family: var(--font-body);">+7 982 341 69 70</a>
                        </div>
                        <div class="flex items-center gap-3">
                            <svg class="h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                            <span class="text-sm text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">maksimdyd@gmail.com</span>
                        </div>
                    </div>
                </div>

                <!-- Right: production image (2/5) -->
                <div class="lg:col-span-2 reveal">
                    <div class="relative overflow-hidden rounded-2xl" style="border-radius: var(--radius);">
                        <?php
                        $prod_img = get_template_directory_uri() . '/assets/images/c-eko-parkovka.png';
                        ?>
                        <img src="<?php echo esc_url( $prod_img ); ?>" alt="<?php esc_attr_e( 'Производство СтройМакс — эко-парковка, пример продукции', 'stroymaks2026' ); ?>" class="w-full h-auto object-cover" loading="lazy">
                        <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[var(--color-border)]" aria-hidden="true" style="border-radius: var(--radius);"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════════════ SECTION 5: Доставка ════════════════ -->
    <section class="bg-[var(--color-bg-alt)] py-24" aria-labelledby="delivery-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mx-auto max-w-2xl text-center reveal">
                <span class="inline-flex items-center rounded-2xl bg-[var(--color-primary-subtle)] px-4 py-1.5 text-sm font-medium tracking-wide text-[var(--color-primary)] w-fit" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Логистика', 'stroymaks2026' ); ?>
                </span>
                <h2 id="delivery-heading" class="mt-4 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Транспортные компании', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 text-lg leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Отгружаем продукцию в любую точку страны. Работаем с транспортными компаниями КИТ, ЛУЧ, СДЭК. Точные сроки и бережная упаковка.', 'stroymaks2026' ); ?>
                </p>
            </div>

            <div class="mt-12 stagger grid grid-cols-1 gap-6 md:grid-cols-3">
                <?php
                $tk_cards = [
                    [
                        'name'    => __( 'Транспортная компания КИТ', 'stroymaks2026' ),
                        'desc'    => __( 'Доступные грузоперевозки для людей и бизнеса, многолетний опыт, широчайшая география присутствия и выгодные тарифы.', 'stroymaks2026' ),
                        'url'     => 'https://tk-kit.com/order',
                        'label'   => __( 'Рассчитать доставку через транспортную компанию КИТ', 'stroymaks2026' ),
                    ],
                    [
                        'name'    => __( 'Транспортная компания ЛУЧ', 'stroymaks2026' ),
                        'desc'    => __( 'Логистическая сеть, представлена в 85 городах: 48 полноценных складов и 37 пунктов выдачи с борта автомобиля.', 'stroymaks2026' ),
                        'url'     => 'https://xn----stbeziy.xn--p1ai/',
                        'label'   => __( 'Рассчитать доставку через транспортную компанию ЛУЧ', 'stroymaks2026' ),
                    ],
                    [
                        'name'    => __( 'Транспортная компания СДЭК', 'stroymaks2026' ),
                        'desc'    => __( 'Гораздо больше, чем просто доставка. Экосистема сервисов для людей. Главный принцип — забота о клиенте.', 'stroymaks2026' ),
                        'url'     => 'https://www.cdek.ru/ru/',
                        'label'   => __( 'Рассчитать доставку через транспортную компанию СДЭК', 'stroymaks2026' ),
                    ],
                ];
                foreach ( $tk_cards as $card ) :
                ?>
                    <div class="reveal hover-lift group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 flex flex-col" style="border-radius: var(--radius);">
                        <div class="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary-subtle)]" style="border-radius: 9999px;">
                            <span class="text-2xl" aria-hidden="true">🚚</span>
                        </div>
                        <h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-[var(--color-text-primary)]" style="font-family: var(--font-display);">
                            <?php echo esc_html( $card['name'] ); ?>
                        </h3>
                        <p class="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]" style="font-family: var(--font-body);">
                            <?php echo esc_html( $card['desc'] ); ?>
                        </p>
                        <a href="<?php echo esc_url( $card['url'] ); ?>" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-brand)]" style="font-family: var(--font-body); border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);" aria-label="<?php echo esc_attr( $card['label'] ); ?>">
                            <?php esc_html_e( 'Рассчитать', 'stroymaks2026' ); ?>
                            <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- ════════════════ SECTION 6: CTA «Рассчитать стоимость» ════════════════ -->
    <section id="cta" class="bg-[var(--color-bg-page)] py-24" aria-labelledby="cta-heading">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="reveal rounded-2xl bg-[var(--color-primary)] px-8 py-14 sm:px-12 lg:px-16 text-center shadow-[var(--shadow-brand)]" style="border-radius: var(--radius);">
                <h2 id="cta-heading" class="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl" style="font-family: var(--font-display);">
                    <?php esc_html_e( 'Рассчитайте стоимость вашего проекта', 'stroymaks2026' ); ?>
                </h2>
                <p class="mt-4 mx-auto max-w-2xl text-lg leading-relaxed text-white/80" style="font-family: var(--font-body);">
                    <?php esc_html_e( 'Оставьте заявку и получите точный расчёт стоимости с учётом доставки в ваш регион в течение 24 часов.', 'stroymaks2026' ); ?>
                </p>
                <div class="mt-8 flex flex-wrap justify-center gap-4">
                    <a href="<?php echo esc_url( home_url( '/calculator' ) ); ?>" class="inline-flex items-center rounded-2xl bg-white px-6 py-3.5 text-base font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-white/90 hover:shadow-lg" style="font-family: var(--font-body); border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Рассчитать стоимость', 'stroymaks2026' ); ?>
                        <svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                    <a href="tel:+79823416970" class="inline-flex items-center rounded-2xl border border-white/30 bg-transparent px-6 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-white/10" style="font-family: var(--font-body); border-radius: var(--radius); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
                        <?php esc_html_e( 'Позвонить', 'stroymaks2026' ); ?>
                    </a>
                </div>
            </div>
        </div>
    </section>

</main>

<?php
get_footer();