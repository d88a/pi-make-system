# Observations — Сырые наблюдения

## 2026-07-11
- [17:00] Проверка проекта: clipproxy недоступен (timeout), python3 не найден (Windows использует python)
- [17:00] Агентов 15 вместо 13 (лишние: trader-analyst, triz-expert)
- [17:00] stakly-bold неполный — обрезан на hero (160 строк)
- [17:00] DECISIONS.md — все решения D-001..D-007 были закомментированы
- [17:15] Настроен прямой доступ к DashScope: Qwen 3.7 Max, DeepSeek V4 Pro, Qwen VL Max
- [17:15] Настроен NVIDIA провайдер (DeepSeek V4 Pro) как бэкап
- [17:15] Оба API проверены — работают ( DashScope + NVIDIA )
- [17:20] Миграция: все 15 агентов переведены с clipproxy на DashScope
- [17:20] Vision-агенты (designer, image-reader, screenshot) → qwen-vl-max
- [17:20] Остальные агенты → deepseek-v4-pro или qwen3.7-max
- [17:20] settings.json обновлён: defaultProvider=dashscope, enabledModels обновлены
- [17:25] opencode.json: добавлены провайдеры dashscope и nvidia, модель по умолчанию dashscope/qwen3.7-max

## 2026-07-13
- [12:00] Найдена ошибка compaction: pi отправляет роль "developer" вместо "system" на DashScope API
- [12:00] DashScope не поддерживает role=developer → ошибка 400
- [12:00] Добавлен compat.supportsDeveloperRole=false ко всем моделям в models.json
- [12:30] Анализ make-ui flow: архитектор использовал vision-модель (qwen-vl-max) вместо reasoning
- [12:30] Coder агент был настроен как Python-разработчик, не знал HTML/Tailwind/UI
- [12:30] make-ui.md ссылался на coder, который не умел генерировать UI
- [12:45] Создан ui-coder.md — frontend разработчик, знает дизайн-систему, HTML+Tailwind
- [12:45] Архитектор переключён с qwen-vl-max на deepseek-v4-pro
- [12:45] Все ссылки в make-ui.md и architect.md: coder → ui-coder
- [13:00] Добавлены ключевые слова-триггеры: «дизайн», «запусти дизайнера»
