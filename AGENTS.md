<!-- Шаблон. Заполни под свой проект. Секцию «📊 Актуальная память» обновляет архитектор после /save. -->

# AGENTS.md — <Project Name>

## О проекте
Pi Make System — генерация pixel-perfect UI в стиле Figma Make / v0.dev через Pi + AI-агентов.

## Структура
```
pi/
├── AGENTS.md
├── memory/
│   ├── STATUS.md, DECISIONS.md, FROZEN.md, ISSUES.md
│   └── research/ (observations, hypotheses, experiments, insights)
└── (проектные файлы будут добавлены при тест-ране)
```

Дизайн-система и промпты (в ~/.pi/agent/):
```
~/.pi/agent/
├── config/design-system/
│   ├── tokens.md              ← базовые правила (spacing, typography, radius, shadows)
│   └── themes/
│       ├── modern-clean.md    ← Linear/Vercel стиль
│       ├── warm-minimal.md    ← Notion/Stripe стиль
│       ├── luxury.md          ← Apple стиль
│       ├── gaming.md          ← Neon/Retro стиль
│       ├── dark-tech.md       ← Cyberpunk стиль
│       ├── bold-tech.md       ← Яркий тех-стиль
│       ├── bento.md           ← 🆕 Apple Bento Grid (мозаика)
│       ├── mesh-gradient.md   ← 🆕 Stripe Mesh (цветные пятна + glass)
│       └── aurora.md          ← 🆕 Vercel Aurora (dark + сияние)
│   ├── wow-patterns.md        ← 🆕 10 CSS-приёмов (stagger, spotlight, shimmer...)
│   ├── mood-axis.md           ← 🆕 7 moods → radius/density/shadow mapping (corpus)
│   ├── layout-patterns.md     ← 🆕 9 layout skeletons (corpus-derived)
│   ├── palette-patterns.md    ← 🆕 8-10 living palettes (corpus-derived)
│   ├── composition-primitives.md ← 🆕 hero/feature/cta/footer variants (corpus)
│   └── dashboard.html         ← 🆕 6-axis dashboard (theme+accent+mood+radius+font+layout)
├── prompts/make-ui.md         ← промпт для генерации UI
└── agents/                    ← 16 агентов (architect, ui-coder, coder, designer, ...)
```

## Build / Lint / Test
- Тест-ран: `pi` → `make-ui <описание>` → открыть index.html в браузере
- Verify: screenshot → designer review → coder fix

## Код-стиль
Конвенции проекта. Глобальные правила: см. `~/.pi/agent/AGENTS.md`.
- HTML + Tailwind CDN (default), Inter font, mobile-first
- Дизайн-система — ЗАКОН, кодер не отклоняется от tokens/themes

## 📊 Актуальная память

**Последнее обновление:** 2026-09-08

> ⚡ **АКТУАЛЬНО (D-197): Pi умеет делать сайты в Elementor WordPress.** Skill `elementor-builder` (SKILL.md + rules.md + 10 готовых шаблонов + decorative CSS). Формат: section+column (классический, НЕ container/flex). Pipeline: HTML-прототип → Elementor JSON → импорт Templates → Site Settings (цвета/шрифты вручную) → декор CSS в Custom CSS (Elementor Pro). Проверено на «Барышня-крестьянка» (usadba): HTML одобрен, 6/9 блоков в Elementor, Hero перенесён на сервер заказчика.
>
> **3 pipeline Pi:** (1) HTML+Tailwind CDN — быстрый прототип/лендинг без CMS; (2) кастомная WP-тема (PHP+Tailwind build) — полный контроль, SEO, производительность; (3) Elementor JSON (section+column) — заказчик сам правит через визуальный редактор.
>
> **СтройМакс v8 — ЗАВЕРШЁН (не трогаем).** Live: https://maksplit.ru, stroymaks2026, 7/7 страниц + 22 товара + блог 12 статей. Почта: CF7→postfix+MX→ящик. Осталось от владелицы: email 2-го получателя, Яндекс.Вебмастер, SEO title.
>
> **Барышня-крестьянка (usadba)** — HTML-прототип одобрен, Elementor JSON блоки готовы (Hero/Heritage/Mission/Economics/Partners/Visit/Contacts), skill создан. Docker localhost:8080. Осталось: блоки about/history + экспорт на хостинг заказчика.
>
> **Портфолио DevUp** — Next.js 38 страниц, задеплоен на dev-up.ru. Cloudflare обходит РКН. Цены: WP 6k+2k+5k, Next.js 8k+3k+7k. Осталось: Яндекс.Вебмастер апелляция.

---

**Ниже — исторический статус (T-096..T-108, D-133..D-185):**
**Проект:** Pi Make System
**Статус:** **СТРОЙМАКС v8 — WP ТЕМА + 6 ФИКСОВ ПО ЖАЛОБАМ ВЛАДЕЛИЦЫ (T-096, 7/7 страниц 200).** (1) **D-133: Dashboard v2 = 6 осей** (734→1562 строк): +Mood 7, +Radius 4, +Font Pair 5, +Layout 9. (2) **СтройМакс v8 (dashboard-driven) ОДОБРЕН** — Dusty Slate + #32598f + Playfair/Source Serif (SERIF) + round 16px + asymmetric + Friendly. Владелица: «нравится, не плоско». (3) **D-134: Контент-фикс = ZERO INVENTION** — реальные фото, 4 категории, реальные контакты. (4) **D-136: 7 СТРАНИЦ v8 HTML ЗАВЕРШЕНО** — 4889 строк, 21 реальное фото, 0 gen-*. (5) **D-140: Калькулятор v2 (6 категорий) + 66 битых ссылок fix.** (6) **D-141: WP ТЕМА stroymaks2026 ПОЛНЫЙ ПОРТ v6→v8** — 5 волн, 9 wp-coder, 22 PHP. (7) **D-145: ТЕМА ЗАПУЩЕНА ЛОКАЛЬНО на Docker (localhost:8080)** — 5 проблем починено (table_prefix wps_ / неполная папка WC / 9 тяжёлых плагинов / slug'и pages). **(8) D-152..D-156: 6 ФИКСОВ ПО ЖАЛОБАМ ВЛАДЕЛИЦЫ (T-096):** blogname→«СтройМакс» (UNHEX), меню компактное (gap-5 + кнопка px-4 py-2), trust=2 (Бесплатный расчёт + Доставка), ГОСТ-цифры ПОЛНОСТЬЮ удалены (features/about/functions/hero, 0 совпадений grep), **парсер post_excerpt → структурированная таблица «Характеристики товара»** (4 формата, color-swatch плашки, нормализация х→× и цен, fallback «по запросу»). wp-coder сломал синтаксис (3 бага) → архитектор чинил вручную, php -l ОБЯЗАТЕЛЕН (D-156). **(9) D-157: СИСТЕМНЫЕ ФИКСЫ (превентивные, 4 файла/9 правок):** wp-coder.md +секция «ZERO INVENTION для WP» (чек-лист источников, post_excerpt, php -l); architect.md I-013 ЗАКРЫТ (consistency-checker→code-auditor в Шаге 8.5, читает код не скриншоты) + блок «Pre-flight БД-аудит»; wp-integration/SKILL.md +Этап 1.5 (БД-аудит data-analyst→update-inventory.json) +Этап 1.6 (HTML→WP Mapping) +Post-deploy 12 чекпоинтов; DEPLOY-INSTRUCTIONS.md +Шаг 0 (7 pre-flight проверок для реальной БД). Все 5 корневых групп проблем получили превентивный механизм. **(10) D-158..D-160: ФИКС ДУБЛЕЙ T-098** (владелица нашла 3 проблемы после T-096): lead-form trust 3→2 (убрали Консультация/от 3 дней/Гарантия 5 лет); кнопка «Рассчитать стоимость» в меню 2→1 (убрали из fallback menu, осталась в header Right actions); **характеристики 3 блока→1, Цвет 10→1, Серый 5→1, Размеры 5→1** — убрали 2 кастомных блока в single-product.php + 3 remove_action (WC excerpt/meta/add_to_cart variation dropdown) + short_desc из карточек product-card.php. wp-coder при T-096 добавил парсер НО не убрал существующие дубли → 3 блока + Цвет 5× (D-160: ТЗ для wp-coder = «замени X на Y» не «добавь Y»). Catalog Mode → variation dropdown НЕ нужен (D-159). **7/7 страниц HTTP 200** ✅. Верификация python (видимый текст): domino/kaliforniya/bordyury — все 1 блок «Характеристики», цвета по 1 разу. /shop/ карточки чистые (0 характеристик в каталоге). **Для новых товаров: владелица пишет в «Краткое описание» в формате «Размеры, мм: 300×150 / Толщина: 35 / Серый: 850₽» → автопарсинг в 1 структурированную таблицу. **(11) D-161..D-162: ВОЗВРАТ БЛОКА A + ЕДИНАЯ ТАБЛИЦА T-099** (владелица: «верни назад все. я скажу какие блоки убрать»). 3 HTML блока от владелицы: **Блок A** (color-swatch интерактивный выбор цвета + #variant-price) → ВЕРНУТЬ (нравится); **Блок B** (color_prices таблица) → УБРАТЬ; **Блок C** (Характеристики Цвет/Категория/Цена/Наличие) → ОСТАВИТЬ + добавить Размер/Кол-во/Толщина. Архитектор делал сам (D-156): вернул `get_template_part variable.php` (Блок A, только variable, файл 6229 байт существовал) + заменил excerpt-specs секцию на ЕДИНУЮ таблицу «Характеристики» (Цвет/Размеры/Толщина/Кол-во/Размеры и цены/Категория/Цена/Наличие). Цвет для variable = variation_attributes (синхрон с A). Порядок: Блок A → Описание → Характеристики → Похожие товары. **УРОК D-161:** интерактив (A) + справка (C) = НЕ дубль (action vs reference). T-098 ошибочно убрал A. **УРОК D-162:** domino WC variations = «Белый»/«Цветной», excerpt = «Серый»/«В цвете» — РАЗНЫЕ источники, Блок C для variable берёт Цвет из variations. **(12) D-163: СОРТИРОВКА БЛОК A T-100** (владелица: «цвета по возрастанию, выбран дешевый»). usort variations по display_price ASC в variable.php → кнопки по цене возр + active = min + #variant-price = min. domino Белый 850→Цветной 1100; kaliforniya Серый 850→Мрамор/В цвете 1100; bordyury 500×200×40 120→500×200×60 150→1000×200×70 300. **(13) D-164..D-167: МОБИЛЬНАЯ + SEO + ЯНДЕКС.ТОВАРЫ T-101** (владелица: «проверь мобильную, настрой SEO Челябинская обл/Юрюзань/Катав-Ивановский, попади в Яндекс.Товары»). **(a) Мобильная ИСПРАВЛЕНА (D-164):** fallback_menu_desktop выводил 5 пунктов БЕЗ обёртки hidden lg:flex (wp_nav_menu container_class не применяется к fallback_cb) → 653px overflow на mobile. Фикс: обернуть fallback в hidden lg:flex. Playwright: все 4 страницы vw=390 ds=390 hScroll=NO ✅. **(b) SEO НАСТРОЕНО (D-165):** wp-cli установлен + активирован wp-seopress (бесплатный, БЕЗ Pro-тормозов) → title «...Челябинская область...в Юрюзани» + description + og: + canonical + sitemap. functions.php: +geo-метатеги (geo.region=RU-CHE, geo.placename=Юрюзань Катав-Ивановский Челябинская обл, geo.position=54.850;58.430, ICBM) + LocalBusiness JSON-LD (address/geo/phone/areaServed). WooCommerce address Юрюзань 456120 RU:CHE, timezone Asia/Yekaterinburg. **(c) Яндекс.Товары ПОДГОТОВЛЕНО (D-166):** schema.org Product УЖЕ работает (WooCommerce auto-gen: Product+AggregateOffer+lowPrice) → органическая товарная выдача Яндекса бесплатно. yml-for-yandex-market v5.0.5 активирован (битые опции удалены + reactivated). Фид пустой — генерация через админку. Владелице: Яндекс.Вебмастер (верификация + sitemap + регион) + опционально Яндекс.Маркет (ИП/ООО + фид + модерация). **(d) Производительность ПРОБЛЕМА (D-167, не блокер):** WooCommerce 11.0.0-beta тормозит 17-22s (PHP code, не БД — slow log пустой). Чистая PHP 0.01s, wp-login БЕЗ WC 0.1s. DISABLE_WP_CRON=true добавлен. Решение для live: откатить WC beta → стабильная 10.x + WP Super Cache → 1-2s. **7 страниц + 2 товара HTTP 200** ✅. Активные плагины: woocommerce + wp-seopress + yml (3). Скриншоты mobile: D:/pi/projects/maksplit/mobile/ (8 PNG). **(14) D-168..D-173: 8 ФИКСОВ ПО ОБРАТНОЙ СВЯЗИ T-102** (владелица: hero цвета / форма-почта / excerpt в строку / таблица ок / наличие убрать / галерея миниатюра / «: ,» артефакт / delivery CSS + «можно переносить, сохранить на пк первоначальную версию»). **(a) Hero D-168:** wp_kses `Брусчатка,<br>которая служит<br><span color-primary>десятилетиями</span>` (br + цвет как в home-v8.html). **(b) Наличие D-169:** убран из таблицы Характеристики. **(c) Парсер D-170:** regex 3a `'/^Размеры,?\s*мм[\s:]+(.+)$/ui'` (разделитель обязателен, убрал артефакт «:») + разбивка size_str по запятой (staryj-arbat 5 размеров вместо 1). **(d) Delivery D-171:** max-h-[320px]→max-h-80 + npm build + UPDATE post_content delivery (убраны 3 огромных SVG из старого Elementor контента + duplicate TK). Playwright: truck 289px ≤ 320, overflow=false. **(e) Галерея УЖЕ работает** (product-image.php override: thumbnails 64×64, JS клик). domino 1 миниатюра. На товарах gallery=0 (bordyury/vodostoki/osen/galka/parket/kaliforniya-kamen/3 памятника) — владелице загрузить доп фото. **(f) Excerpt НЕ выводится** на сайте (curl domino «Цена за кв»=0) — владелица видела в админке/meta description. **(g) Форма D-173:** сейчас localStorage fallback (НИКУДА). Для почты: CF7 + email получателя + ID в Customizer. **(h) Бэкап D-172:** maksplit.ru=na4u.ru, SSH/FTP закрыты → rsync невозможен. Бэкап с live УЖЕ на ПК от 9 июля (maksplit_db.sql 14.7MB + eteon + plugins + uploads). **9 страниц HTTP 200** ✅, php -l OK на 4 PHP, tailwind.css пересобран. **Ждём от владелицы: (1) email для формы; (2) способ деплоя (WP admin zip / панель na4u.ru / SSH); (3) бэкап от 9 июля достаточно ИЛИ свежий через панель.** **(15) D-174..D-177: МИНИАТЮРЫ ГЛАВНОГО + CF7 ФОРМА d88a@yandex.ru T-103** (владелица: «хочу миниатюру главного фото», email d88a@yandex.ru, «решай форму деплоя сам», «na4u.ru что? у нас нетангелс», «бэкап скачивай»). **(a) D-174:** product-image.php — $all_thumb_ids = array_merge([main_image_id], gallery_image_ids) + array_unique → главное фото ПЕРВОЙ миниатюрой (active). domino 2 миниатюры, osen (gallery=0) 1 миниатюра. **(b) D-175:** CF7 6.0.5 активирован (был установлен). Корень: CF7 6.x хранит форму в **_form** post_meta (не post_content!). Создал 6600 через wp_insert_post → пустая (нет _form). Фикс: обновил 4724 «Contact form 1» (из бэкапа) → _form=имя+телефон+сообщение, _mail recipient=d88a@yandex.ru. theme_mod cf7_lead_id=4724. lead-form.php: do_shortcode [contact-form-7 id=4724]. curl: все поля рендерятся, email скрыт. **(c) D-176 SMTP:** PHP mail() на live NetAngels обычно работает, но часто в спаме. Надёжнее WP Mail SMTP + Yandex SMTP (smtp.yandex.ru:465, login d88a@yandex.ru, пароль нужен). Локально Docker нет MTA. **(d) D-177 Деплой:** maksplit.ru=na4u.ru=NetAngels (бренд). SSH/FTP закрыты. rsync невозможен. Данных сервера у архитектора НЕТ (нет логина панели/FTP/WP admin). Бэкап от 9 июля ЕСТЬ на ПК. Свежий скачать не могу. **4 плагина: CF7+wp-seopress+woocommerce+yml.** **Ждём: (1) пароль d88a@yandex.ru для SMTP; (2) доступ к панели NetAngels (cp.netangels.ru) ИЛИ FTP/SSH ИЛИ WP admin maksplit.ru — для бэкапа + деплоя.** **(16) D-178..D-180: 🔥 SSH РАБОТАЕТ + БЭКАП LIVE + DEPLOY_AND_SERVER.md T-104** (владелица: «поищи в проекте school» → «создай в проекте такой же файл» → «бэкап скачивай»). **(a) D-178 SSH:** найден `D:/Anna/Сайты/school/DEPLOY_AND_SERVER.md` с SSH config `eis-vds` (HostName SERVER_IP = IP maksplit.ru, User root, ключ ~/.ssh/id_ed25519_eisparser). Ключ ЕСТЬ на ПК. `ssh eis-vds` → SSH_OK, vm-006d10f9. maksplit + school на ОДНОМ VDS NetAngels. **D-172/D-177 «SSH закрыт» — НЕВЕРНО**, SSH работает. **(b) D-179 maksplit LEMP:** нативный (НЕ Docker): nginx + php8.2-fpm + MariaDB 10.11. Путь /var/www/maksplit.ru/www (eisparser:eisparser). nginx conf: root, php-fpm socket, SSL Let's Encrypt (до 2026-09-26), redirect 80→443. PHP 8.2 + curl/gd/mysqli/mbstring/xml/zip/intl. БД maksplit_db/maksplit_user/wps_ prefix. **WordPress 6.9.1 + WooCommerce 9.7.2 STABLE** (НЕ 11.0.0-beta как в Docker → производительность на live будет нормальная). Активная тема eteon (СТАРАЯ). 10 плагинов (elementor/revslider/redux/cleantalk/seopress-pro = мусор для деактивации). blogname + siteurl https://maksplit.ru (уже HTTPS). uploads 150MB. **(c) D-180 БЭКАП LIVE скачан:** `backups/maksplit_db_live_20260727.sql` (15MB, mysqldump) + `backups/maksplit_wpcontent_20260727.tgz` (217MB, tar wp-content). Пароль через awk. **(d) DEPLOY_AND_SERVER.md создан** (312 строк, 16 секций, делегирован coder по образцу school): SSH config, LEMP, БД, текущее состояние, nginx conf, SSL, бэкапы, деплой stroymaks2026 (6 шагов: build→backup→upload→activate→plugins→cache), импорт БД из Docker (⚠️), проверка, мониторинг, отличия от school. Пароль НЕ в файле. **Проблема деплоя РЕШЕНА — scp темы + mysql активация + деактивация старых плагинов. Ждём подтверждение владелицы на деплой.**

### Решения (DECISIONS.md)
- D-001: HTML+Tailwind CDN как default стек
- D-002: Tokens отдельно от themes
- D-003: Inter как default шрифт
- D-004: Border вместо shadow для карточек
- D-005: Coder модель `kp/deepseek-v4-pro`
- D-006: Make-ui — ОБЯЗАТЕЛЬНЫЙ промпт для всех UI
- D-007: Verify loop (screenshot→designer→fix) — ОБЯЗАТЕЛЕН
- D-008: ❌ ОТМЕНЕНО (D-023) — миграция clipproxy→DashScope
- D-009: ❌ ОТМЕНЕНО (D-023) — DashScope как основной
- D-010: qwen-vl-max для vision-агентов
- D-011: NVIDIA как бэкап-провайдер
- D-012: Использовать deepseek-v4-pro как основную модель для кодинга и размышлений
- D-013: ❌ УСТАРЕЛО (D-023) — clipproxy как бэкап
- D-014: Добавлены новые темы: luxury (Apple), gaming (Neon/Retro), dark-tech (Cyberpunk)
- D-015: Создан план развития системы: направления сайтов, контент-блоки, генерация изображений
- D-016: Добавлены направления сайтов: медицинский, строительный, трейдинг, лайфстайл
- D-017: Автоматически запускать make-ui при любом запросе о дизайне (редизайн, изменение блока, перемещение элемента)
- D-018: Создан skill `ui-request-handler` для автоматического запуска make-ui
- D-019: Обновлён skill `ui-request-handler` с полным списком ключевых слов
- D-020: Архитектор переведён с vision (qwen-vl-max) на reasoning (deepseek-v4-pro)
- D-021: Создан ui-coder агент для HTML/Tailwind/UI (вместо(coder)
- D-022: make-ui.md обновлён: все ссылки coder → ui-coder
- D-023: **ОТМЕНЕНО D-008, D-009** — clipproxy восстановлен как primary провайдер, DashScope как fallback
- D-024: Контент UI всегда на языке владельца (default: русский)
- D-025: Генерация картинок через DashScope Wanx (агент image-gen)
- D-026: Скрипт gen_image.py: D:/pi/scripts/gen_image.py
- D-027: 3 вау-темы: bento (Apple), mesh-gradient (Stripe), aurora (Vercel)
- D-028: Wow-patterns.md: библиотека из 10 CSS-приёмов
- D-029: Вау-уровни: 1=standard, 2=enhanced, 3=wow
- D-030: 3-осная модель (Input × Fidelity × Scope) вместо "режимов"
- D-031: Style Guide = артефакт ДО генерации страниц (из Relume pipeline)
- D-032: 8 style categories (из Webflow): Colors, Typography, Buttons, Spacing, Borders, Shadows, Images, Animations
- D-033: style-guide.md: примеры реальных сайтов (8 категорий: SaaS, Medical, Portfolio, E-commerce, Construction, Education, Crypto, Food)
- D-034: Конверсационный UX: архитектор спрашивает если input/fidelity/scope не ясны (макс 1-2 вопроса)
- D-035: Project Model (project.json) — Single Source of Truth для состояния проекта
- D-036: JSON Design Tokens (design-tokens.json) — машиночитаемые токены
- D-037: Component Registry (components.json) — SSOT для компонентов
- D-038: pages.json — карта сайта (sitemap)
- D-039: Style Guide расширен до 12 категорий (+ Navigation, Icons, Forms, Tables)
- D-041: P1 (Single Source of Truth) — каждая сущность в одном месте
- D-042: P3 (Design Tokens Mandatory) — UI Agent не придумывает цвета/spacing
- D-043: P4 (Incremental First) — Component → Section → Page → Project
- D-044: P5 (Canonical Components) — правка в shared/ → все зависящие страницы
- D-045: P6 (Fallback Policy) — цепочка project.json → tokens → style-guide → спросить пользователя
- D-046: Agent Contracts — чёткие Input/Output для каждого агента
- D-047: Change Protocol (Analyze→Plan→Execute) — встроен в ui-coder
- D-048: Build State встроен в project.json.status (todo/building/done/failed/review)
- D-049: Component Version + used_by[] в components.json (dependency graph)
- D-050: Усиленный Reference Pipeline — извлекает Grid/Spacing/Typography/Radius/Density/Mood/Shadows/Borders/Animation
- D-051: Definition of Done расширен (14 пунктов: +консистентность, +Consistency Checker, +project.json↔pages.json)
- D-052: Отклонено — build-state.json (объединён с project.json), Version History (отложена)
- D-053: Дизайнер галлюцинирует — всегда проверять претензии grep'ом
- D-054: Multi-page pipeline работает end-to-end
- D-055: Free fidelity + вау-темы работают
- D-056: Nunito+Inter — валидная комбинация для тёплых тем
- D-057: Subagent fallback mechanism — fallbackModel + automatic retry
- D-058: ❌ УСТАРЕЛО (D-080) — vision primary теперь dashscope/qwen-vl-max
- D-059: Pre-flight health check + vision-блокировка (ping max_tokens=1, cache 60s)
- D-060: ✅ RESOLVED (D-061) — SitAndEat pixel-perfect был заблокирован до vision
- D-061: SitAndEat разблокирован — vision восстановлен
- D-062: fallback → fallbackModel во всех 16 агентах (массовый фикс)
- D-063: SitAndEat 6.1/10 (v4) — приемлемо для reference copy
- D-064: Pixel-Perfect Pipeline: 5 фаз (CSS→Content→Style→Gen→DOM-diff). Скрипт `~/.pi/agent/scripts/extract-reference.js`
- D-065: ZERO INVENTION rule — кодер не придумывает контент для pixel-perfect
- D-066: Pixel-Perfect Audit Protocol — дизайнер сверяет элемент-к-элементу + grep-верификация
- D-067: extract-reference.js — системный скрипт (CSS getComputedStyle + verbatim DOM)
- D-068: Tailwind CDN ОБЯЗАТЕЛЕН в каждом HTML — ui-coder пропускал, сайт не рендерился
- D-069: D-053 массово подтверждён — дизайнер лжёт про цвета/шрифты/radius. Всегда grep-верификация
- D-070: extract-reference.js: 3 бага (input, grid, card info) — добавлены form elements, header grid, info+overlay
- D-071: Отрицательные margins — только если grid 100% совпадает
- D-072: **КОРЕНЬ «меню по-другому»:** карточки без CSS детей — добавлены titleCSS/infoCSS/priceCSS/overlayCSS
- D-073: ui-coder ОБЯЗАН использовать CSS детей из extraction, запрещено подставлять дефолты
- D-074: **КОРЕНЬ «всё крупнее»:** секции/заголовки/параграфы без CSS + DOM-иерархия карточек (wrapper divs). Categories: grid 446.656+446.672+446.656, gap 30px, img wrapper absolute, btn margin-top 61px. Playwright CSS-diff: ✅ MATCH (0.015px sub-pixel)
- D-075: Background-color карточек (#f1f1f1) + wrapper max-width 1780px + padding 0 20px. Extraction теперь захватывает bg карточек. Ui-coder ОБЯЗАН использовать bg и сохранять DOM-иерархию wrapper-уровней
- D-076: Каталог: grid-template-rows ОБЯЗАТЕЛЕН (repeat(5, 180px)). Карточки растягивались до 274-298px без него. Plus title/info через z-index: 1 поверх absolute img wrapper
- D-077: extract-reference.js теперь захватывает grids[] (display, cols, rows, gap, firstChildCSS). ui-coder ОБЯЗАН явно указывать font-size/line-height/color на grid-контейнерах И детях (Tailwind дефолты перебивают inline)
- D-098: **КОРЕНЬ "я Notion AI" НАЙДЕН.** clipproxy подменяет function calling tools на Notion tools. 15 coding агентов → dashscope primary (deepseek-v4-pro/qwen3.7-max). dashscope 5/5 тестов ✅ tool_call. D-023 частично отменён: clipproxy только для vision fallback + main pi процесса
- D-078: gen_image.py — hardcoded API ключ убран, sys.exit если DASHSCOPE_API_KEY не задан (безопасность, аудит H-1)
- D-079: mathematician переведён с deepseek-r1 на deepseek-v4-pro (R1 не работал, аудит H-2)
- D-080: Vision-агенты (designer/screenshot/image-reader) primary clipproxy/vl → dashscope/qwen-vl-max (у VL clipproxy нет ключей, аудит H-3)

### Модели (проверены 2026-07-18, D-098)
- **Reasoning/кодинг (dashscope):** dashscope/deepseek-v4-pro (fallback: dashscope/qwen3.7-max) — 11 агентов (architect, code-auditor, coder, data-analyst, image-gen, logic-auditor, mathematician, trader-analyst, triz-expert, ui-coder, wp-coder). **clipproxy/kp/deepseek-v4-pro ОТМЕНЁН (D-098)** — подменяет tools на Notion
- **General (dashscope):** dashscope/qwen3.7-max (fallback: dashscope/deepseek-v4-pro) — 4 агента (researcher, data-analyst-glm, data-analyst-qw, devil-advocate)
- **Vision (dashscope primary):** dashscope/qwen-vl-max (fallback: clipproxy/vl/qwen3-vl-plus) — 4 агента (designer, screenshot, image-reader, consistency-checker)
- **Генерация картинок:** DashScope Wanx (wanx2.1-t2i-turbo, wan2.7-image-pro) — через скрипт gen_image.py

**Неработающие модели (исключены):** kp/deepseek-r1, kp/qwen3.7-plus, kp/gemini-2.5-flash, kp/llama-4-maverick, vl/qwen3-vl-plus (нет ключей), go/*, om/deepseek-v4-flash

### End-to-end тесты
- **ЛапЛап** (multi-page, guided, warm-minimal): 4 страницы, 9 компонентов, Change Protocol, Consistency Checker, дизайнер 8.8/10 ✅
- **CyberSpace** (single-page, free, bold-tech): 1 страница, 4 вау-паттерна (stagger, counter, shimmer, gradient border), дизайнер 8.5/10 ✅
- **NeuralEye** (single-page, guided, bold-tech): 8 секций, дизайнер 8.5/10 ✅
- **SitAndEat v2** (single-page, pixel-perfect, Pipeline v2): Nunito+FF7A00+30px pill+stats+Ужины. Grep: ✅. Дизайнер 6.8/10 (ложь, реально ~8/10). Tailwind CDN fix (D-068) ✅
- Clipproxy работает (deepseek-v4-pro отвечает), fallback chain настроена. Vision через dashscope primary (clipproxy/vl нет ключей).

### 🆕 Make UI 2.0 (РЕАЛИЗОВАН, план в memory/PLAN.md)
- **3-осная модель:** Input (7 типов) × Fidelity (4 уровня) × Scope (4 типа) = покрывает все сценарии
- **8 сценариев:** копирование Figma, вдохновение, франкенштейн, редизайн, бренд-кит, описание, вау, точечная правка
- **Project Model:** project.json (ядро + status) + design-tokens.json + components.json (+ version + used_by) + pages.json
- **4 архитектурных принципа:** Single Source of Truth, Component-first, Incremental Updates, Strict Contracts
- **7 правил (P1-P7):** SSOT, не копировать, tokens обязательны, incremental first, canonical, fallback, макс 2 вопроса
- **Agent Contracts:** чёткие Input/Output для каждого агента (architect → project.json + task, ui-coder → HTML)
- **Change Protocol:** Analyze → Plan → Execute (внутри ui-coder, не отдельный агент)
- **Pipeline:** Запрос → Style Guide (12 категорий) → Components → Pages
- **Style Extraction (reference):** извлекает Grid + Spacing + Typography + Radius + Density + Mood + Shadows + Borders + Animation
- **Definition of Done:** 14 пунктов (функциональные + артефакты + консистентность + incremental)
- **Инсайт D-053:** Дизайнер галлюцинирует — всегда проверять претензии grep'ом

### Что дальше
1. ✅ **Фаза 1:** architect.md + ui-coder.md + make-ui.md — **ЗАВЕРШЕНО**
2. ✅ **Фаза 2:** Multi-page тест-ран «ЛапЛап» (4 стр., 9 компонентов, DoD 14/14) — **ЗАВЕРШЕНО**
3. ✅ **Фаза 6:** Change Protocol (точечная правка hero CTA) — **ЗАВЕРШЕНО**
4. ✅ **Фаза 7:** Consistency Checker (nav/footer/цвета/backdrop-blur 4/4) — **ЗАВЕРШЕНО**
5. ✅ **Фаза 8:** E2E тесты (ЛапЛап + CyberSpace) — **ЗАВЕРШЕНО**
6. ✅ **SitAndEat.ru v4** (старый pipeline, 6.1/10) — **ЗАВЕРШЕНО**
7. ✅ **Pixel-Perfect Pipeline v2** (CSS+Content extraction, ZERO INVENTION, Audit Protocol) — **ЗАВЕРШЕНО**
8. ✅ **SitAndEat v7** pixel-perfect — 4 секции совпадают, Playwright 0 расхождений — **ЗАВЕРШЕНО** (T-059)
9. ✅ **Полный аудит** + FIX ALL (22/22: HIGH+MEDIUM+LOW) — **ЗАВЕРШЕНО** (T-060..T-066)
10. ✅ **Фаза 3A+4:** Fidelity levels в ui-coder.md — **ЗАВЕРШЕНО** (T-063)
11. ✅ **Фаза 5:** Conversational UX в architect.md — **ЗАВЕРШЕНО** (T-064)
12. ⏳ **Тест: maksplit.ru** через Make UI 2.0 (реальная проверка системы)
13. ⏳ Тестировать Reference Copy с другим сайтом
14. ⏳ Протестировать на реальном проекте заказчика

### ✅ Vision + Pixel-Perfect Pipeline (2026-07-18)
- **Vision:** dashscope/qwen-vl-max primary (clipproxy/vl fallback, но ключей нет) — D-080
- **Инфраструктура:** Pre-flight health check + fallbackModel на всех 16 агентах
- **Pixel-Perfect Pipeline v2:**
  - `~/.pi/agent/scripts/extract-reference.js` — CSS extraction (getComputedStyle) + Content extraction (verbatim DOM)
  - ZERO INVENTION rule в ui-coder.md — кодер не выдумывает контент
  - Pixel-Perfect Audit Protocol в designer.md — element-by-element + grep верификация
  - 5-фазный pipeline: CSS→Content→Style→Generation→DOM-diff
- **SitAndEat re-extraction v2:** Nunito (не Inter!), #FF7A00 (не #F97316), radius 30px, stats captured, "Ужины" (не "Горячее")
- **SitAndEat v7 pixel-perfect:**
  - Categories: grid 446.656+446.672+446.656, grid-template-rows 220px, gap 30px, bg #f1f1f1, wrapper 1780px (D-074/D-075)
  - Catalog: grid repeat(5,264px) repeat(5,180px), gap 30px, 22 cards, title/info z-index:1, min-height 180px (D-076)
  - About: photo absolute 504px, content margin-left 490px, stats grid 3-col 283.328px rows 58.98px, font 18px/25.2px
  - Advantages: wrapper pad 0 20px, grid 4×327.5px rows 204.36px, gap 40px 30px, icon 60px, title+text white, font 16px/22.4px
  - Playwright CSS-diff: catalog ✅ MATCH, остальные sub-pixel only (0.015px) — 0 осмысленных расхождений
  - **Системные фиксы:** extract-reference.js захватывает grids[] + sectionCSS display/gap/gridTemplateColumns/gridTemplateRows (D-077)
  - **Ui-coder ОБЯЗАН:** grid-template-rows, явные font-size/line-height/color на grid и детях, сохранение DOM-иерархии
