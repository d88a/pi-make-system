# STATUS — Усадьба «Барышня-крестьянка»

**Обновлено:** 2026-08-23 23:30

## ✅ Выполнено

### Этап 1: HTML-прототип
- [x] Прототип создан, одобрен, правки внесены, развёрнут на сервере

### Этап 2: WordPress + Elementor (локально)
- [x] Docker WordPress 7.1 + Elementor 4.1.3 + Hello Elementor 2.7.1
- [x] Страница ID 25 — главная, elementor_canvas
- [x] ✅ Hero — ГОТОВ (section+column, typography, отступы 1:1)
- [x] ✅ Hero — ПЕРЕНЕСЁН на сервер заказчика (Elementor 4.1.3 Pro)

### Этап 3: Инфраструктура переноса
- [x] Выяснен формат шаблонов для Elementor 4.1.3
- [x] Найден рабочий метод переноса: JSON с `{"content": [...], "title": "...", "type": "section"}`
- [x] Задокументированы все проблемы

## 🔄 В процессе

- [ ] Блок 3: О проекте (about)
- [ ] Блок 4: История (history + timeline)
- [x] ✅ Heritage — ГОТОВ (нативные: image+heading+text, 2 секции, 3 карточки)
- [x] ✅ Mission — ГОТОВ (нативные: heading+text, 2 секции, 4 стат-карточки)
- [x] ✅ Economics — ГОТОВ (нативные: heading+text, 4 карточки, финальный блок)
- [x] ✅ Partners — ГОТОВ (нативные: heading+text, список, тёмная карточка)
- [x] ✅ Visit — ГОТОВ (нативные: heading+text, Яндекс.Карта, CTA)
- [x] ✅ Contacts — ГОТОВ (нативные: heading+text, контакты с SVG, форма)
- [ ] Блок 6: Миссия (mission + stats)
- [ ] Блок 6.5: Экономическая концепция (economics — НОВЫЙ)
- [ ] Блок 7: Партнёры (partners)
- [ ] Блок 8: Визит (visit + карта)
- [ ] Блок 9: Контакты (contacts + форма)

## 📋 ПРАВИЛА СБОРКИ (выстраданные)

### Формат элементов
- **section + column** (не container!) — универсальный формат, работает в Elementor 3.x и 4.x
- `elType: "section"` → внутри `elType: "column"` → внутри виджеты
- `_column_size: 100` для одной колонки

### Настройки
- typography_* — ПЛОСКИЕ ключи (typography_font_family, typography_font_size, не вложенные)
- `$$type` формат — НЕ использовать (не работает в 4.1.3)
- `title` в heading — простая строка, не объект
- Inline-стили в text-editor — РАБОТАЮТ в section+column (в отличие от container)
- `styles: []`, `interactions: []`, `editor_settings: []`, `version: "0.0"` — можно опустить

### Экспорт для заказчика
```json
{
  "content": [...элементы...],
  "title": "Название шаблона",
  "type": "section"
}
```
- Импорт: Elementor → Templates → Import
- Site Settings (глобальные цвета/шрифты) — настраивать вручную
- Декоративный CSS — в Custom CSS (Elementor Pro)

## 🔑 Доступы
- Локально: http://localhost:8080/wp-admin (admin / admin123)
- Страница: ID 25
- Сервер: ssh root@213.189.219.55
- Прототип: http://213.189.219.55:8080/
## Skill elementor-builder (создан 29.08.2026)

**Расположение:** `C:/Users/Ваня/.pi/agent/skills/elementor-builder/`

**Содержимое:**
- `SKILL.md` - описание навыка
- `rules.md` - правила и форматы Elementor JSON
- `css/decorative.css` - примеры декоративных стилей
- `templates/` - 10 готовых шаблонов с превью:
  - ai-saas, analytics, app, blog, conference
  - education, portfolio, pricing, studio, team
- `templates/catalog.html` - визуальный каталог (открыть в браузере)

**Что включает каждый шаблон:**
- `.json` - Elementor шаблон (импорт через Templates → Import)
- `.kit.json` - глобальные цвета и шрифты
- `.png` - превью скриншот
- `.html` - исходный HTML для просмотра

**Как использовать:**
1. Открыть `templates/catalog.html` в браузере
2. Выбрать шаблон → скачать `.json`
3. В Elementor: Templates → Import → выбрать файл
4. Применить к странице

