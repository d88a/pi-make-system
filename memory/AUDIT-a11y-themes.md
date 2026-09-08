> **✅ RESOLVED (D-123, 2026-07-22):** Все 7 тем теперь WCAG AA PASS (0 violations). --color-text-muted затемнён (#57534E stone-600 / #475569 slate-600), modern-clean accent #4F46E5, dashboard.html fallback + JS синхронизирован, landmarks (nav/footer), a11y-check.js landmark role mapping фикс. См. DECISIONS D-123, D-124.

# a11y Audit — 7 тем dashboard.html (2026-07-22)

**Метод:** `a11y-check.js` логика (manual Playwright) + supplementary hex-contrast анализ CSS-переменных
**Движок:** Playwright manual checks (axe-core не установлен, fallback на встроенные проверки)
**Цель:** `config/design-system/dashboard.html` с URL-якорями `#<theme-id>`
**Дата:** 2026-07-22T14:17 UTC

---

## Сводная таблица

| Тема | Contrast | Landmarks | Alt | Keyboard/ARIA | Итог |
|------|----------|-----------|-----|---------------|------|
| concrete-steel | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| dusty-slate | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| graphite-mono | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| sage-stone | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| editorial-cream | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| modern-clean | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |
| warm-minimal | 15 ❌ serious | 2 (nav❌ footer⚠️) | 0 ✅ | 0 ✅ | **FAIL** |

**Итого:** Все 7 тем FAIL. Паттерн нарушений идентичен — проблемы в dashboard chrome + общие для всех `--color-text-muted`.

---

## Детали контраста по CSS-переменным тем

### ✅ Проходят WCAG AA (≥4.5:1 normal / ≥3.0:1 large):
| Пара | Диапазон по 7 темам | Статус |
|------|---------------------|--------|
| `--color-text-primary` on `--color-bg-page` | 14.42–17.85:1 | ✅ все |
| `--color-text-primary` on `--color-surface` | 15.17–17.85:1 | ✅ все |
| `--color-accent` on `--color-bg-page` | 3.03–9.84:1 | ⚠️ 2 темы fail |
| `--color-accent` on `--color-surface` | 3.19–10.27:1 | ⚠️ 2 темы fail |
| `#FFF` on `--color-accent` (button text) | 3.19–10.27:1 | ⚠️ 2 темы fail |

### ❌ `--color-text-muted` — системный провал ВСЕХ 7 тем

| Тема | Muted цвет | on bg-page | on surface | Need |
|------|-----------|------------|------------|------|
| concrete-steel | #A8A29E | **2.31:1** ❌ | **2.52:1** ❌ | 4.5:1 |
| dusty-slate | #94A3B8 | **2.45:1** ❌ | **2.56:1** ❌ | 4.5:1 |
| graphite-mono | #A8A29E | **2.41:1** ❌ | **2.52:1** ❌ | 4.5:1 |
| sage-stone | #A8A29E | **2.33:1** ❌ | **2.52:1** ❌ | 4.5:1 |
| editorial-cream | #9B9088 | **2.96:1** ❌ | **3.12:1** ❌* | 4.5:1 |
| modern-clean | #94A3B8 | **2.56:1** ❌ | **2.56:1** ❌ | 4.5:1 |
| warm-minimal | #A8A29E | **2.40:1** ❌ | **2.52:1** ❌ | 4.5:1 |

*editorial-cream: 3.12:1 на surface проходит для **large text** (≥18pt или 14pt bold), но FAIL для normal text.

### ⚠️ Accent-specific проблемы (2 темы)

| Тема | Accent | on bg | on surface | white on accent | Проблема |
|------|--------|-------|------------|-----------------|----------|
| **modern-clean** | #6366F1 | **4.47:1** ❌ | **4.47:1** ❌ | **4.47:1** ❌ | Не добивает 0.03 до AA |
| **warm-minimal** | #D97706 | **3.03:1** ❌ | **3.19:1** ❌ | **3.19:1** ❌ | Серьёзный провал |

Все остальные 5 тем: accent passes ≥4.5:1. ✅

---

## Детали нарушений по элементам (одинаковы для всех 7 тем)

### Contrast violations (15 на тему)

#### Dashboard Chrome (hardcoded цвета, не обновляются темами)

| # | Элемент | Текст | Фон | Ratio | Проблема |
|---|---------|-------|-----|-------|----------|
| 1 | Header "Pi Make" span | #A8A29E | #F5F5F4 | 2.31:1 | Hardcoded в HTML |
| 2 | #theme-heading | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 3 | Theme card description | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 4 | Theme card font meta | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 5 | #accent-heading | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 6 | Accent group labels (×3) | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 7 | Gold warning span | #CA8A04 | #FFFFFF | 2.94:1 | Hardcoded |
| 8 | #custom-heading | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 9 | Custom hex hint | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |
| 10 | #apply-heading | #A8A29E | #FFFFFF | 2.52:1 | Hardcoded |

#### Live Preview (использует CSS var, обновляется темами, но muted всё равно fail)

| # | Элемент | Текст | Фон | Ratio | Проблема |
|---|---------|-------|-----|-------|----------|
| 11 | Section labels (×6) | var(--text-muted) ≈ #A8A29E | var(--bg-page) | 2.31:1 | Muted too light |
| 12 | Description paragraph | var(--text-muted) ≈ #A8A29E | var(--bg-page) | 2.31:1 | Muted too light |
| 13 | Product card description | var(--text-muted) ≈ #A8A29E | #FFFFFF | 2.52:1 | Muted too light |
| 14 | Price unit "/м³" | var(--text-muted) ≈ #A8A29E | #FFFFFF | 2.52:1 | Muted too light |
| 15 | Paragraph muted span | var(--text-muted) ≈ #A8A29E | var(--bg-page) | 2.31:1 | Muted too light |

### Landmark violations (2 на тему)

| # | Severity | Issue | WCAG |
|---|----------|-------|------|
| 16 | serious | Missing `<nav>` landmark | WCAG 1.3.1 (A) |
| 17 | minor | Missing `<footer>` landmark | WCAG 1.3.1 (A) |

**Найденные landmarks:** header(1), main(1), aside(1 с aria-label ✅)
**Отсутствуют:** nav(0), footer(0)

### Alt / Keyboard / ARIA — PASS ✅

- Все `<img>` имеют `alt` атрибуты
- 20 keyboard-focusable элементов (кнопки, ссылки, инпуты)
- Нет positive tabindex
- `<aside>` имеет `aria-label="Панель управления"`

---

## Системные паттерны

### 🔴 Паттерн 1: `--color-text-muted` слишком светлый во ВСЕХ 7 темах
- **Корень:** Все темы определяют `--color-text-muted` как ~#A8A29E / ~#94A3B8 / ~#9B9088
- **Минимальный ratio:** 2.31:1 (нужно 4.5:1 — **недобор в ~2×**)
- **Минимальный pass-цвет (на #FFFFFF):** ≈#76736F (luminance ≈ 0.183)
- **Минимальный pass-цвет (на #F5F5F4):** ≈#736F6B
- **Для large text (3.0:1):** ≈#8C8884 on #FFFFFF
- **Затрагивает:** ВСЕ 7 тем, ~50% всего видимого текста на странице

### 🟡 Паттерн 2: Dashboard chrome hardcoded цвета не реагируют на темы
- **Корень:** Header, sidebar controls, theme cards, accent picker используют hardcoded `#A8A29E`, `#D6D3D1`, `#CA8A04` вместо CSS-переменных
- **Затрагивает:** 10 из 15 контрастных нарушений (67%) — не зависят от выбранной темы
- **Файл:** `config/design-system/dashboard.html` строки с inline классами Tailwind

### 🟡 Паттерн 3: Два акцентных цвета не проходят WCAG AA
- **modern-clean #6366F1 (indigo):** 4.47:1 — **не добивает 0.03** до 4.5:1. Близко к границе.
- **warm-minimal #D97706 (amber):** 3.19:1 — серьёзный провал. Особенно опасно для кнопок (white text on amber).
- **Рекомендация:** darken indigo до ~#5B54E0, darken amber до ~#B86800

---

## Рекомендации

### Critical (блокирует WCAG AA)

1. **Затемнить `--color-text-muted` во всех 7 темах**
   - Текущий диапазон: #A8A29E — #94A3B8 (ratio 2.31–3.12:1)
   - Целевой: ≥#76736F (ratio ≥4.5:1 на белом)
   - **Альтернатива:** Если muted используется только для secondary/decorative текста — можно пометить как `aria-hidden` или использовать только для large text (тогда порог 3.0:1)

2. **warm-minimal: затемнить `--color-accent` #D97706**
   - Текущий: 3.19:1 на белом (FAIL и для текста, и для кнопок)
   - Целевой: ≥#B45309 (hover-цвет уже 4.72:1 — использовать его как основной)
   - **Или:** `--color-accent: #B45309`, `--color-accent-hover: #92400E`

3. **modern-clean: скорректировать `--color-accent` #6366F1**
   - Текущий: 4.47:1 (не добивает 0.03)
   - Целевой: #5B54E0 или #4F46E5 (5.25:1)

### Serious

4. **Добавить `<nav>` landmark**
   - Header содержит навигационную ссылку "Применить" — обернуть в `<nav>` или добавить `role="navigation"`
   - Альтернатива: если навигации нет — добавить `aria-label` на header

5. **Заменить hardcoded цвета в dashboard chrome на CSS-переменные**
   - `text-[#A8A29E]` → `style="color:var(--color-text-muted)"` (в sidebar controls)
   - `border-[#D6D3D1]` → `style="border-color:var(--color-border)"` 
   - После фикса: 10 из 15 контрастных нарушений будут автоматически исправляться при смене темы

6. **Добавить `<footer>`** — даже минимальный footer с `role="contentinfo"` закроет landmark violation

### Moderate

7. **Gold warning #CA8A04** (строка "близко к отвергнутой зоне") — 2.94:1 на белом
   - Затемнить до #8B6914 (≥4.5:1) или сделать bold large text (тогда 3.0:1 достаточно)

---

## Файлы отчётов

- Индивидуальные JSON: `reports/a11y/a11y-<theme-id>.json` (7 файлов)
- Сводный JSON: `reports/a11y/a11y-combined.json`
- Batch runner: `scripts/_a11y-batch.js` (временный, можно удалить)

---

## Приложение: Минимальные pass-цвета для `--color-text-muted`

| Фон | Min hex (4.5:1 normal) | Min hex (3.0:1 large) |
|-----|------------------------|----------------------|
| #FFFFFF (surface) | #76736F | #8C8884 |
| #F5F5F4 (concrete-steel bg) | #736F6B | #898580 |
| #F8FAFC (dusty-slate bg) | #757271 | #8B8887 |
| #FAFAF9 (graphite-mono bg) | #747170 | #8A8786 |
| #F7F6F3 (sage-stone bg) | #726F6C | #898582 |
| #FBF9F4 (editorial-cream bg) | #74706C | #8A8682 |
| #FAF9F7 (warm-minimal bg) | #73706D | #898683 |

**Рекомендация:** Установить `--color-text-muted` в каждой теме индивидуально, чтобы ratio ≥ 4.5:1 на `--color-bg-page` И ≥ 4.5:1 на `--color-surface`.
