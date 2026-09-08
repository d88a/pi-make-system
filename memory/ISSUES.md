# ISSUES.md — Известные проблемы

## Активные

| ID | Проблема | Severity | Статус |
|----|----------|----------|--------|
| I-003 | stakly-bold неполный — только navbar + hero (160 строк) | MED | открыто |
| I-004 | 15 агентов вместо 13 (лишние: trader-analyst, triz-expert) | LOW | открыто |
| I-005 | python3 не найден на Windows, используется python | LOW | открыто |
| I-013 | consistency-checker агент НЕ зарегистрирован. ✅ ЗАКРЫТО (D-157): architect.md Шаг 8.5 + таблица агентов переведены на code-auditor (читает код, не скриншоты — надёжнее designer per D-053). Примечание I-013 оставлено в Шаге 8.5 для контекста | MEDIUM | ✅ закрыто |

## Решённые

| ID | Проблема | Решение | Дата |
|----|----------|---------|------|
| I-001 | clipproxy (CLIPPROXY_HOST) недоступен | Возвращён как primary, fallback — DashScope | 2026-07-13 |
| I-002 | *(пропуск нумерации — проблема не заведена)* | — | — |
| I-006 | Все агенты на clipproxy (недоступен) | Миграция на DashScope (прямой доступ) — ОТМЕНЕНО | 2026-07-13 |
| I-007 | Vision-модели недоступны через clipproxy | Подключены qwen-vl-max через DashScope как fallback | 2026-07-13 |
| I-008 | settings.json указывал на clipproxy как default | Возвращён defaultProvider на clipproxy | 2026-07-13 |
| I-009 | Архитектор на vision-модели (qwen-vl-max) | Переключён на deepseek-v4-pro (reasoning) | 2026-07-13 |
| I-010 | Coder — Python-разработчик, не фронтенд | Создан ui-coder агент для HTML/Tailwind/UI | 2026-07-13 |
| I-011 | make-ui.md ссылался на coder вместо ui-coder | Обновлены все ссылки на ui-coder | 2026-07-13 |
| I-012 | extract-reference.js: 4 системных бага (SitAndEat) | D-068: Tailwind CDN пропущен. D-070: не захватывал input/form/grid/card-info. D-072: не захватывал CSS дочерних элементов карточек (title/info/price/overlay). Все исправлены. | 2026-07-15 |
