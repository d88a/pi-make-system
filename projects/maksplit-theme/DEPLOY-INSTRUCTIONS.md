# Инструкция по деплою темы StroyMaks 2026

> **Дата:** 2026-07-23  
> **Тема:** `stroymaks2026` (23 PHP-файла, Tailwind build 31.8KB)  
> **Цель:** запустить тему локально через Docker (localhost:8080), проверить, затем — live на maksplit.ru

---

## ❗ Важно: Docker Desktop должен быть запущен

Docker daemon на момент проверки **НЕ отвечал** (Docker Desktop не запущен).  
**Сделайте вручную:** запустите Docker Desktop → дождитесь, пока статус станет `Running`.

---

## Шаг 0: Pre-flight для реальной БД (если используешь live дамп)

**Когда:** БД-дамп с live сайта (MariaDB, 96 таблиц, prefix `wps_`, плагины). НЕ для чистой установки.

### 0.1 Проверить table_prefix в дампе

```bash
grep -m1 "CREATE TABLE" maksplit_db.sql | head -1
# Должно показать: CREATE TABLE `wps_options` ... → prefix = wps_
```

Если prefix ≠ `wp_` → в `docker-compose.yml` ОБЯЗАТЕЛЬНО добавить:
```yaml
environment:
  WORDPRESS_TABLE_PREFIX: wps_   # ← реальный prefix из дампа (D-142)
```
Без этого WP не найдёт таблицы → redirect на install.php.

### 0.2 Проверить blogname в дампе

```bash
grep "INSERT INTO.*wps_options.*blogname" maksplit_db.sql | head -1
```

Если blogname ≠ «СтройМакс» (например «Производитель тротуарной плитки...») → после Шага 1 UPDATE через UNHEX (D-147, кириллица через docker exec mysql двойная кодировка):
```bash
HEX=$(python3 -c "print('СтройМакс'.encode('utf-8').hex())")
docker exec maksplitru-db-1 mysql -u wp -pwp --default-character-set=utf8mb4 maksplit_db \
  -e "UPDATE wps_options SET option_value=UNHEX('$HEX') WHERE option_name='blogname';"
```

### 0.3 Проверить папку plugins/woocommerce/

```bash
ls wp-content/plugins/woocommerce/woocommerce.php
# Если отсутствует → папка неполная (бэкап с live скопирован не полностью, D-143)
# Фикс: скачать fresh с wordpress.org:
#   curl -L -o /tmp/wc.zip https://downloads.wordpress.org/plugin/woocommerce.zip
#   unzip /tmp/wc.zip -d wp-content/plugins/
```

### 0.4 Проверить languages/

```bash
ls wp-content/languages/ 2>/dev/null || echo "ПУСТО → WC будет на английском (D-148)"
# Фикс (без скачивания .mo): 8 программных фильтров в functions.php
# (woocommerce_product_description_heading → 'Описание', и т.д.)
```

### 0.5 Проверить активные плагины в дампе

```bash
grep "active_plugins" maksplit_db.sql | head -1
# Если 10+ плагинов (geodir/cleantalk/elementor/revslider) → отключить все кроме WC (D-145):
docker exec maksplitru-db-1 mysql -u wp -pwp maksplit_db \
  -e "UPDATE wps_options SET option_value='a:0:{}' WHERE option_name='active_plugins';"
# Затем активировать ТОЛЬКО WooCommerce (тема требует is_cart())
```

### 0.6 Проверить slug'и pages vs nav href

```bash
docker exec maksplitru-db-1 mysql -u wp -pwp maksplit_db \
  -e "SELECT post_name, post_title FROM wps_posts WHERE post_type='page' AND post_status='publish';"
# Если slug'ы ≠ nav href (company-about вместо about, D-144) → UPDATE post_name:
docker exec maksplitru-db-1 mysql -u wp -pwp maksplit_db \
  -e "UPDATE wps_posts SET post_name='about' WHERE post_title LIKE '%О компании%';"
# + flush rewrite: docker exec maksplitru-wordpress-1 wp rewrite flush --allow-root
```

### 0.7 Проверить дубль tailwind.config.js

```bash
find wp-content/themes/stroymaks2026/ -name tailwind.config.js
# Должен быть ОДИН (в theme root). Если дубль в tailwind/ → удалить (D-141: build v6 из-за дубля)
```

После Шага 0 → продолжай Шаг 1.

---

## Шаг 1: Запуск Docker с WordPress

Откройте терминал в папке `D:\Anna\Сайты\maksplit.ru\` и выполните:

```powershell
cd D:\Anna\Сайты\maksplit.ru
docker-compose up -d
```

Дождитесь ~30-60 секунд. Проверьте:

```powershell
docker-compose ps
```

Должны быть оба контейнера `UP`:
- `maksplitru_db_1` (MySQL)
- `maksplitru_wordpress_1` (WP)

Проверьте, что сайт открывается:

```powershell
curl -I http://localhost:8080
```

Или откройте браузер: **http://localhost:8080**

> **Примечание:** БД `maksplit_db.sql` импортируется автоматически при первом запуске  
> (volume mount: `./maksplit_db.sql:/docker-entrypoint-initdb.d/init.sql`).

---

## Шаг 2: Backup старой темы (eteon)

```powershell
cd D:\Anna\Сайты\maksplit.ru\wp-content\themes
cp -r eteon eteon.backup.20260723
```

---

## Шаг 3: Активация темы stroymaks2026

### Вариант A: Через WP-CLI в контейнере (рекомендуется)

```powershell
cd D:\Anna\Сайты\maksplit.ru
docker-compose exec wordpress wp theme activate stroymaks2026 --allow-root
```

### Вариант B: Через админку (если WP-CLI не работает)

1. Откройте **http://localhost:8080/wp-admin**
2. Логин/пароль — те, что были в БД (или `admin` / `admin`)
3. **Appearance → Themes**
4. Найдите **StroyMaks 2026** → нажмите **Activate**

### Вариант C: Через БД напрямую

```powershell
docker-compose exec db mysql -u wp -pwp maksplit_db -e "UPDATE wp_options SET option_value='stroymaks2026' WHERE option_name IN ('template','stylesheet','current_theme');"
```

---

## Шаг 4: Проверка после активации

Откройте в браузере:

| Страница | URL | Что проверять |
|----------|-----|---------------|
| Главная | http://localhost:8080/ | Hero, features, категории, товары, lead-форма |
| Каталог | http://localhost:8080/shop | Сетка товаров, фильтр категорий, пагинация |
| Товар | http://localhost:8080/product/любой-товар/ | Галерея (object-contain!), кнопка «Рассчитать стоимость» |
| О компании | http://localhost:8080/about | Страница с контентом |
| Контакты | http://localhost:8080/contacts | Карта, контакты, форма |
| Доставка | http://localhost:8080/delivery | Секции доставки, FAQ |
| Калькулятор | http://localhost:8080/calculator | Расширенная форма |

**Проверьте, что нет fatal errors** (белый экран = ошибка).  
Если есть ошибка — скопируйте текст ошибки и отправьте.

---

## Шаг 5: Создание CF7 форм (обязательно!)

В админке WP:

1. Установите и активируйте плагин **Contact Form 7**
2. Создайте 2 формы по инструкции в `README-CF7.md` (в папке темы)
3. Запомните ID форм (числа, например 123 и 124)
4. **Appearance → Customizer → StroyMaks 2026 → CF7 Формы**
5. Вставьте ID в поля:
   - «CF7 ID — Форма «Рассчитать стоимость»» → ID первой формы
   - «CF7 ID — Форма калькулятора» → ID второй формы
6. Нажмите «Опубликовать»

> Пока CF7 не настроен — формы работают в HTML fallback  
> (сохраняют заявки в localStorage браузера).

---

## Шаг 6: Настройка Customizer

**Appearance → Customizer → StroyMaks 2026:**

### Контакты
- Телефон, Email, Адрес, Часы работы (будни/суббота)
- Код карты (iframe Яндекс.Карт)

### Hero (Главная)
- Надзаголовок, Заголовок, Подзаголовок
- Фото hero (Media Upload)

### Каталог
- Заголовок и подзаголовок каталога

### Главная страница
- Заголовок «Популярная продукция»
- Заголовок и подзаголовок lead-формы

### Site Identity
- Логотип, Название сайта, Описание

---

## Шаг 7: Создание страниц WP

Создайте страницы в админке (Pages → Add New):

| Название | Slug | Шаблон (Page Template) |
|----------|------|------------------------|
| О компании | `about` | О компании |
| Контакты | `contacts` | Контакты |
| Доставка и оплата | `delivery` | Доставка и оплата |
| Рассчитать стоимость | `calculator` | Рассчитать стоимость |

**Как назначить шаблон:** в редакторе страницы → справа в «Page Attributes» → Template → выбрать нужный.

---

## Шаг 8: Создание меню

**Appearance → Menus:**

### Primary Menu (основное)
- Главная → Custom Link: `/`
- Каталог → Custom Link: `/shop`
- О компании → Page: О компании
- Доставка → Page: Доставка и оплата
- Контакты → Page: Контакты

### Footer Menu (подвал)
- О компании → Page
- Доставка → Page
- Контакты → Page

---

## Шаг 9: Что проверить (DoD чеклист)

### Структура
- [ ] Все 7 страниц открываются без ошибок
- [ ] header.php/footer.php на всех страницах
- [ ] Нет хардкод-текста (всё из БД/Customizer)

### Tailwind
- [ ] assets/css/tailwind.css (31.8KB) загружается
- [ ] Все стили на месте (Concrete Steel дизайн)

### WooCommerce Catalog Mode
- [ ] Каталог: товары отображаются, кнопка «Подробнее»
- [ ] Товар: галерея object-contain, кнопка «Рассчитать стоимость»
- [ ] НЕТ «В корзину» нигде
- [ ] Корзина/чекаут → редирект на /calculator

### Дизайн-система
- [ ] Steel Blue #3B5F8A — основной цвет
- [ ] Space Grotesk + Inter + JetBrains Mono
- [ ] :root 24 custom properties
- [ ] object-contain на фото товаров

### Формы
- [ ] Lead-форма на главной (CF7 или HTML fallback)
- [ ] Форма калькулятора (CF7 или HTML fallback)

### a11y
- [ ] landmarks (header/nav/main/footer)
- [ ] aria-label, aria-current
- [ ] Контраст WCAG AA

---

## Шаг 10: Деплой на live maksplit.ru (ПОСЛЕ локальной проверки)

```bash
# 1. Backup на сервере
ssh maksplit.ru "cp -r /var/www/maksplit.ru/htdocs/wp-content/themes/eteon /var/www/maksplit.ru/htdocs/wp-content/themes/eteon.backup.$(date +%Y%m%d)"

# 2. rsync темы
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  D:/Anna/Сайты/maksplit.ru/wp-content/themes/stroymaks2026/ \
  maksplit.ru:/var/www/maksplit.ru/htdocs/wp-content/themes/stroymaks2026/

# 3. Активация на сервере
ssh maksplit.ru "cd /var/www/maksplit.ru/htdocs && wp theme activate stroymaks2026"

# 4. Проверка
curl -I https://maksplit.ru/
```

> ⚠️ **НЕ деплоить на live до проверки локально на Docker!**

---

## Если что-то пошло не так

### Белый экран (fatal error)
1. Включите `WP_DEBUG` в `wp-config.php`:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
2. Откройте страницу → читайте ошибку
3. Или проверьте логи: `docker-compose exec wordpress cat /var/www/html/wp-content/debug.log`

### Тема не активируется
- Проверьте что все файлы на месте (23 .php)
- Проверьте права: `style.css` должен быть читаемым
- Проверьте `functions.php` на syntax errors (PHP 7.4+)

### Tailwind не загружается
- Проверьте что `assets/css/tailwind.css` существует (31.8KB)
- Если нет — запустите билд:
  ```bash
  cd wp-content/themes/stroymaks2026
  npm install
  npm run build
  ```