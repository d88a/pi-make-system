# Подключение к серверу и деплой (maksplit)

Этот файл описывает текущую инфраструктуру проекта **maksplit** на домене `maksplit.ru`.
Сайт размещён на VDS NetAngels (vm-006d10f9.na4u.ru), **на одном сервере с проектом school**,
но с полностью независимым стеком: нативный LEMP (WordPress) вместо Docker (Next.js + Directus).

## Доступ

### SSH-конфигурация

```bash
Host eis-vds
  HostName 213.189.219.55
  User root
  IdentityFile ~/.ssh/id_ed25519_eisparser
  IdentitiesOnly yes
```

Подключение:
```bash
ssh eis-vds
```

## Актуальные URL

| Назначение | URL |
|---|---|
| **Сайт** | `https://maksplit.ru/` |
| **WP Admin** | `https://maksplit.ru/wp-admin/` |

## Где лежит проект на сервере

| Компонент | Путь |
|---|---|
| Корень WP | `/var/www/maksplit.ru/www` |
| Темы | `/var/www/maksplit.ru/www/wp-content/themes/` |
| Плагины | `/var/www/maksplit.ru/www/wp-content/plugins/` |
| Uploads | `/var/www/maksplit.ru/www/wp-content/uploads/` (150MB) |
| nginx conf | `/etc/nginx/sites-available/maksplit.ru.conf` |
| SSL | `/etc/letsencrypt/live/maksplit.ru/` |
| Логи nginx | `/var/log/nginx/maksplit.access.log` / `maksplit.error.log` |

Владелец файлов: `eisparser:eisparser`.

## Сервисы (LEMP)

⚠️ **НЕ Docker** — нативный LEMP-стек (nginx + PHP-FPM + MariaDB).
В отличие от school, здесь нет Docker-контейнеров и docker-compose.

| Сервис | Назначение | Управление |
|---|---|---|
| `nginx` | Web-сервер | `systemctl {status\|reload\|restart} nginx` |
| `php8.2-fpm` | PHP (unix socket) | `systemctl {status\|reload\|restart} php8.2-fpm` |
| `mariadb` | MariaDB 10.11.14 (localhost:3306) | `systemctl {status\|restart} mariadb` |

### PHP 8.2 (модули)

```
curl, gd, mysqli, mbstring, xml, SimpleXML, xmlreader, xmlwriter, zip, intl
```

PHP-FPM socket: `unix:/run/php/php8.2-fpm.sock`

## БД

| Параметр | Значение |
|---|---|
| DB_NAME | `maksplit_db` |
| DB_USER | `maksplit_user` |
| DB_HOST | `localhost` |
| table_prefix | `wps_` |
| WP_DEBUG | `false` |
| Пароль | ⚠️ **НЕ ПИСАТЬ** — хранится в `wp-config.php` |

Извлечение пароля для скриптов:
```bash
PASS=$(awk -F\' '/DB_PASSWORD/{print $4}' /var/www/maksplit.ru/www/wp-config.php)
```

## Текущее состояние (live, до деплоя stroymaks2026)

- **WordPress:** 6.9.1
- **WooCommerce:** 9.7.2 (STABLE)
- **Активная тема:** `eteon` (старая — будет заменена на `stroymaks2026`)
- **blogname:** «Производитель тротуарной плитки. Челябинская область.»
- **siteurl / home:** `https://maksplit.ru` (уже HTTPS — менять НЕ нужно)

### Активные плагины (10)

| # | Плагин | Slug |
|---|---|---|
| 1 | Redux Framework | `redux-framework` |
| 2 | CleanTalk Spam Protect | `cleantalk-spam-protect` |
| 3 | Contact Form 7 | `contact-form-7` |
| 4 | Elementor Theme Core | `elementor-theme-core` |
| 5 | Elementor | `elementor` |
| 6 | Slider Revolution | `revslider` |
| 7 | WooCommerce | `woocommerce` |
| 8 | SEOPress PRO | `wp-seopress-pro` |
| 9 | SEOPress | `wp-seopress` |
| 10 | YML for Yandex Market | `yml-for-yandex-market` |

## nginx maksplit.ru.conf

```nginx
server {
    server_name maksplit.ru www.maksplit.ru;
    root /var/www/maksplit.ru/www;
    index index.php index.html;

    access_log /var/log/nginx/maksplit.access.log timing;
    error_log  /var/log/nginx/maksplit.error.log;

    location / {
        try_files $uri $uri/ /index.php?$args;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/maksplit.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/maksplit.ru/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = maksplit.ru) { return 301 https://$host$request_uri; }
    if ($host = www.maksplit.ru) { return 301 https://$host$request_uri; }
    listen 80;
    server_name maksplit.ru www.maksplit.ru;
    return 404;
}
```

## SSL

- **Тип:** Let's Encrypt (ECDSA)
- **Домены:** `maksplit.ru` + `www.maksplit.ru`
- **Истекает:** 2026-09-26 (60 дней)
- **Авто-обновление:** `certbot.timer` (systemd)
- **Команда обновления:** `certbot --nginx -d maksplit.ru -d www.maksplit.ru`

## Бэкапы

### Свежие (2026-07-27)

| Что | Путь (на ПК) | Размер |
|---|---|---|
| БД live | `D:/Anna/Сайты/maksplit.ru/backups/maksplit_db_live_20260727.sql` | 15MB |
| wp-content live | `D:/Anna/Сайты/maksplit.ru/backups/maksplit_wpcontent_20260727.tgz` | 217MB |

### Старый (2026-07-09)

| Что | Путь (на ПК) |
|---|---|
| БД | `D:/Anna/Сайты/maksplit.ru/maksplit_db.sql` |
| Тема eteon | `D:/Anna/Сайты/maksplit.ru/` |
| Плагины | `D:/Anna/Сайты/maksplit.ru/` |
| Uploads | `D:/Anna/Сайты/maksplit.ru/` |

## Деплой новой темы stroymaks2026

### 1. Подготовка локально

```bash
# Собрать тему
cd D:/Anna/Сайты/maksplit.ru/wp-content/themes/stroymaks2026
npm run build

# Упаковать в архив
cd D:/Anna/Сайты/maksplit.ru/wp-content/themes
tar -czf /tmp/stroymaks2026.tgz stroymaks2026
```

### 2. Бэкап старой темы на сервере

```bash
ssh eis-vds 'cp -r /var/www/maksplit.ru/www/wp-content/themes/eteon \
  /var/www/maksplit.ru/www/wp-content/themes/eteon.bak_$(date +%Y%m%d)'
```

### 3. Загрузить и распаковать тему

```bash
scp /tmp/stroymaks2026.tgz eis-vds:/tmp/
ssh eis-vds 'tar -xzf /tmp/stroymaks2026.tgz \
  -C /var/www/maksplit.ru/www/wp-content/themes/ && \
  chown -R eisparser:eisparser /var/www/maksplit.ru/www/wp-content/themes/stroymaks2026'
```

### 4. Активировать тему через БД

```bash
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysql -u maksplit_user -p\"\$PASS\" maksplit_db -e \"
  UPDATE wps_options SET option_value = 'stroymaks2026' WHERE option_name = 'stylesheet';
  UPDATE wps_options SET option_value = 'stroymaks2026' WHERE option_name = 'template';
\""
```

### 5. Деактивировать старые плагины (оставить только CF7 + WooCommerce + SEOPress + YML)

```bash
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysql -u maksplit_user -p\"\$PASS\" maksplit_db -e \"
  UPDATE wps_options SET option_value = 'a:4:{i:0;s:36:\"contact-form-7/wp-contact-form-7.php\";i:1;s:27:\"woocommerce/woocommerce.php\";i:2;s:24:\"wp-seopress/seopress.php\";i:3;s:47:\"yml-for-yandex-market/yml-for-yandex-market.php\";}' WHERE option_name = 'active_plugins';
\""
```

⚠️ Это деактивирует: Elementor, Elementor Theme Core, Slider Revolution, Redux Framework,
CleanTalk, SEOPress PRO. Если сайт на них завязан — отключите выборочно.

### 6. Очистить кэш

```bash
ssh eis-vds 'nginx -t && systemctl reload nginx'
```

## Импорт БД из Docker (ОПАСНО — перезапишет live!)

⚠️ **ВНИМАНИЕ:** Эта операция перезапишет текущую БД maksplit на сервере.
Будут потеряны: товары, заказы, настройки темы eteon, формы CF7, SEOPress-настройки.

**Делать ТОЛЬКО после полного бэкапа live БД!**

```bash
# 1. Сделать свежий бэкап live БД
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysqldump -u maksplit_user -p\"\$PASS\" maksplit_db > /root/maksplit_live_backup_\$(date +%Y%m%d_%H%M%S).sql"

# 2. Скопировать дамп из Docker на хост
ssh eis-vds 'docker cp <container>:/tmp/maksplit_dump.sql /tmp/maksplit_dump.sql'

# 3. Импортировать в live БД
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysql -u maksplit_user -p\"\$PASS\" maksplit_db < /tmp/maksplit_dump.sql"

# 4. Обновить siteurl/home (если нужно)
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysql -u maksplit_user -p\"\$PASS\" maksplit_db -e \"
  UPDATE wps_options SET option_value = 'https://maksplit.ru' WHERE option_name IN ('siteurl', 'home');
\""
```

## Проверка после деплоя

```bash
# Главная страница
curl -sI https://maksplit.ru/ | head -1
# → HTTP/1.1 200 OK

# WP Admin
curl -sI https://maksplit.ru/wp-admin/ | head -1
# → HTTP/1.1 200 OK (или 302 → wp-login.php)

# Проверить активную тему и плагины
ssh eis-vds "PASS=\$(awk -F\\\" '/DB_PASSWORD/{print \$4}' /var/www/maksplit.ru/www/wp-config.php) && \
mysql -u maksplit_user -p\"\$PASS\" maksplit_db -e \"
  SELECT option_name, option_value FROM wps_options WHERE option_name IN ('stylesheet', 'template', 'active_plugins');
\""
```

## Мониторинг

```bash
# Статус сервисов
ssh eis-vds 'systemctl status nginx php8.2-fpm mariadb'

# Логи ошибок nginx
ssh eis-vds 'tail -50 /var/log/nginx/maksplit.error.log'

# Логи PHP-FPM
ssh eis-vds 'tail -50 /var/log/php8.2-fpm.log'

# Место на диске
ssh eis-vds 'df -h /'
# → / 25G, 17G used, 7.2G avail (70%)

# Размер uploads
ssh eis-vds 'du -sh /var/www/maksplit.ru/www/wp-content/uploads/'
```

## Известные отличия от school

Оба сайта на одном сервере (`213.189.219.55`), но с РАЗНЫМИ стеками:

| Параметр | maksplit | school |
|---|---|---|
| Стек | Нативный LEMP | Docker (docker-compose) |
| Платформа | WordPress | Next.js + Directus |
| Web-сервер | nginx → PHP-FPM (socket) | nginx → Docker (proxy_pass) |
| БД | MariaDB (localhost:3306) | PostgreSQL (Docker) |
| Корень проекта | `/var/www/maksplit.ru/www` | `/opt/school` |
| Деплой | SCP + распаковать тему | docker-compose build + up |
| SSL | Let's Encrypt (ECDSA) | Let's Encrypt (ECDSA) |
| Пользователь | `eisparser:eisparser` | root / Docker |

## История изменений

### 2026-07-27 — Создан файл, собрана инфраструктура

- Собрана вся инфраструктура с сервера: nginx conf, PHP-FPM, MariaDB, SSL, бэкапы
- Сделан полный бэкап live: БД (15MB) + wp-content (217MB)
- Зафиксировано текущее состояние: WP 6.9.1, WC 9.7.2, тема eteon, 10 плагинов
- Подготовлены команды деплоя темы stroymaks2026 и импорта БД из Docker