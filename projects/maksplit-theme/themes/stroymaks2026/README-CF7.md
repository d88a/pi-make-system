# CF7 Интеграция — StroyMaks 2026

## Настройка Contact Form 7 в админке WordPress

Тема поддерживает 2 формы CF7. Пока CF7 не настроен — работает HTML fallback с сохранением в localStorage.

---

## Форма 1: «Рассчитать стоимость» (основная lead-форма)

Используется на всех страницах (главная, каталог, страницы товаров, о компании, контакты, доставка).

### Создать в CF7 → Добавить новую:

```
Название: Рассчитать стоимость
```

### Шаблон формы (Form tab):

```html
<div class="form-row">
  <label>Имя <span class="required">*</span></label>
  [text* your-name placeholder "Александр"]
</div>

<div class="form-row">
  <label>Телефон <span class="required">*</span></label>
  [tel* tel-636 placeholder "+7 (999) 123-45-67"]
</div>

<div class="form-row">
  <label>Объём, м²</label>
  [number volume min:1 placeholder "100"]
</div>

<div class="form-row">
  <label>Комментарий</label>
  [textarea comment placeholder "Опишите проект: тип плитки, цвет, сроки..."]
</div>

<div class="form-row">
  [submit "Получить расчёт"]
</div>
```

### Письмо (Mail tab):

```
Кому: info@maksplit.ru
От: СтройМакс <wordpress@maksplit.ru>
Тема: Заявка на расчёт — [your-name]

Имя: [your-name]
Телефон: [tel-636]
Объём: [volume] м²
Комментарий: [comment]
```

### Куда вставить ID:

1. Запомнить ID формы (число, например `123`)
2. Перейти: **Внешний вид → Customizer → StroyMaks 2026 → CF7 Формы**
3. Вставить ID в поле **«CF7 ID — Форма «Рассчитать стоимость»**
4. Нажать «Опубликовать»

---

## Форма 2: «Расширенный расчёт» (страница калькулятора)

Используется на странице `/calculator`.

### Создать в CF7 → Добавить новую:

```
Название: Расширенный расчёт
```

### Шаблон формы (Form tab):

```html
<div class="form-row">
  <label>Имя <span class="required">*</span></label>
  [text* your-name placeholder "Александр"]
</div>

<div class="form-row">
  <label>Телефон <span class="required">*</span></label>
  [tel* tel-636 placeholder "+7 (999) 123-45-67"]
</div>

<div class="form-row">
  <label>Email</label>
  [email your-email placeholder "info@example.com"]
</div>

<div class="form-row">
  <label>Тип продукции</label>
  [select product-type "— Выберите —" "Брусчатка" "Тротуарная плитка" "Бордюры, водостоки" "Памятники"]
</div>

<div class="form-row">
  <label>Объём, м²</label>
  [number volume min:1 placeholder "100"]
</div>

<div class="form-row">
  <label>Комментарий</label>
  [textarea comment placeholder "Опишите проект, пожелания по цвету, срокам..."]
</div>

<div class="form-row">
  [submit "Получить расчёт"]
</div>
```

### Письмо (Mail tab):

```
Кому: info@maksplit.ru
От: СтройМакс <wordpress@maksplit.ru>
Тема: Расчёт стоимости — [your-name]

Имя: [your-name]
Телефон: [tel-636]
Email: [your-email]
Тип продукции: [product-type]
Объём: [volume] м²
Комментарий: [comment]
```

### Куда вставить ID:

1. Запомнить ID формы
2. Перейти: **Внешний вид → Customizer → StroyMaks 2026 → CF7 Формы**
3. Вставить ID в поле **«CF7 ID — Форма калькулятора»**
4. Нажать «Опубликовать»

---

## Проверка

После настройки обеих форм:

1. Открыть страницу Контакты → форма должна отображаться в секции с синим фоном
2. Открыть `/calculator` → расширенная форма с выбором типа продукции
3. Отправить тестовую заявку → проверить email

---

## Fallback

Если CF7 не настроен (ID не указан в Customizer):
- **lead-form.php** показывает HTML-форму с сохранением в localStorage
- **page-calculator.php** показывает HTML-форму с localStorage

После настройки CF7 HTML-формы автоматически заменяются на CF7 — никаких правок кода не требуется.