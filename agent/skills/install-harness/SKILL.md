---
name: install-harness
description: Установка или обновление Pi Harness из GitHub. Когда пользователь даёт ссылку на репозиторий или просит установить/обновить harness.
---

# Установка Pi Harness

## Когда использовать

Пользователь говорит что-то вроде:
- "установи harness с репозитория https://github.com/..."
- "обнови harness"
- "скачай агентов из github"
- Просто даёт ссылку на GitHub репозиторий в контексте установки

## Установка (новая)

```bash
cd $(pwd) && ~/.pi/agent/scripts/install_harness.sh <repo_url>
```

Скрипт:
1. Клонирует репозиторий
2. Копирует `pi-agent/` в `~/.pi/agent/`
3. Создаёт `AGENTS.md` и `memory/` в текущей директории
4. Патчит `settings.json` с IP clipproxy (по умолчанию 192.168.0.8)
5. Создаёт директории для памяти агентов

**Всё автоматически, без вопросов.**

## Обновление

```bash
cd $(pwd) && ~/.pi/agent/scripts/install_harness.sh <repo_url> --update
```

Обновляет `~/.pi/agent/` из репозитория, не пересоздавая `memory/`.

## Переменная CLIPPROXY_HOST

Если clipproxy на другом IP, установить переменную:
```bash
export CLIPPROXY_HOST=10.0.0.5
~/.pi/agent/scripts/install_harness.sh <repo_url>
```

Или в одну строку:
```bash
CLIPPROXY_HOST=10.0.0.5 ~/.pi/agent/scripts/install_harness.sh <repo_url>
```

## После установки

Сообщить пользователю:
- ✅ Harness установлен
- Отредактируйте `AGENTS.md` — впишите название и стек проекта
- Запустите `pi` в этой директории
- Проверьте: `/health`
