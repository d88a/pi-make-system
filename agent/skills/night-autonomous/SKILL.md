---
name: night-autonomous
description: >
  Методология безостановочного исследовательского цикла на живых данных в реальном
  времени. Цикл знания: наблюдение → верификация хода → гипотеза → апробация →
  верификация апробации → выводы → корректировки → новая гипотеза → по кругу.
  Архитектор в цикле надзора (НЕ "launch and leave"), накапливает corpus полезных
  открытий. Domain-agnostic — контекст домена владелец указывает при вызове
  (рынок/логи/процесс/система). "Отговорки не принимаются" — продолжать пока
  владелец не остановит.
triggers:
  - night_lab
  - forward_test
  - autonomous_research
  - night_watch
  - heartbeat_cycle
  - knowledge_cycle
  - overnight
---

# Night Autonomous Research Skill

## Назначение

Безостановочный исследовательский цикл на живых данных в реальном времени. НЕ
разовое исследование, НЕ "launch and leave". Архитектор остаётся в цикле надзора
и **каждая итерация производит знание** — накапливается corpus полезных открытий.

Применяется когда:
- Владелец уходит надолго / на ночь
- Forward-test гипотез на живом объекте (hypothesis → object → verify → correct)
- "Отговорки не принимаются" — продолжать пока владелец не остановит
- Один объект исследования — **глубина > широты**
- Владелец указывает контекст домена при вызове (рынок / логи / процесс / система)

## Предпосылки (prerequisites)

Checklist ПЕРЕД стартом. Если хоть один пункт fail → почини ПЕРЕД стартом.
Ночь с упавшим process = потерянное время.

- [ ] **Detector система live** — `systemctl --user is-active <unit>` = active
- [ ] **Dashboard live** — визуальный мониторинг
- [ ] **Data ingestion live** — сырые данные пишутся (collector)
- [ ] **State file на ext4** (НЕ vboxsf — flush/buffering теряет данные): `active_hypotheses.json`
- [ ] **Diary file на ext4**: `investigation_diary.md` + per-day diary
- [ ] **LLM second-opinion** сконфигурирован (через cliproxy, keypool `kp/` only — НЕ `om/`)
- [ ] **Диск свободен** >10G (`df -h` — иначе silent data loss)
- [ ] **Health-check** всех units PASS
- [ ] **Reasoning partner** доступен (или настроен fallback)
- [ ] **FROZEN.md проверен** — сессия не затронет замороженные направления
- [ ] **Контекст домена получен от владельца** — термины, ключевые метрики, что считать «событием»
- [ ] **Ключевые метрики домена квантифицированы** (числовые) — цикл требует предсказаний с direction/magnitude/horizon. Если домен качественный — operationalize (превратить в измеримое) перед применением

## Методологический цикл (ЯДРО)

Это ради чего существует skill. Каждый heartbeat = одна итерация цикла. Цикл
**спиральный** — каждая итерация верифицирует гипотезу предыдущей и рождает
новую. Не плоский конвейер, а разворачивающаяся спираль знания.

```
Итерация N:
1. НАБЛЮДЕНИЕ
   Прочитать состояние объекта: trajectory, недавние события, метрики.

2. ВЕРИФИКАЦИЯ (двойная)
   (a) ХОД: сверить с прошлой итерацией — что предсказывали в апробации N-1?
   (b) АПРОБАЦИЯ N-1: объект ответил на гипотезу предыдущей итерации?
       Классифицировать исход: HIT / near-HIT / miss / invalidated /
       false-positive / false-negative (определения — «Протокол верификации»).
   Это проверка И цикла И объекта.

3. ГИПОТЕЗА
   Сформулировать: что произойдёт дальше / почему наблюдаем текущее.
   Рождается из выводов прошлых итераций (шаг 5), НЕ из априорной теории.

4. АПРОБАЦИЯ
   Превратить гипотезу в проверяемое предсказание с PREDEFINED критериями:
     - direction / тип ожидаемого события
     - magnitude (диапазон, не точка)
     - horizon (за какое время должно случиться)
     - invalidation boundary (что опровергает гипотезу ДО horizon)
   Критерии фиксируются ДО проверки — НЕ подгоняются пост-фактум.

5. ВЫВОДЫ
   Что узнали: паттерн подтверждён / опровергнут / найден нюанс / обнаружен
   НОВЫЙ паттерн (не описан ни детектором, ни LLM). Записать в corpus.

6. КОРРЕКТИРОВКИ
   Подстроить детектор под новые данные: пороги / правила / инвалидация.
   Архитектор ФОРМУЛИРУЕТ изменение (в diary) → делегирует coder для внесения
   в код (pending если coder недоступен — см. протокол корректировок) →
   проверяет на следующей итерации.
   ↓
  Итерация N+1: шаг 2 верифицирует апробацию из шага 4 итерации N.
```

**Каждая итерация производит знание.** Даже false-positive — это данные для
следующей корректировки, не повод остановиться. Цикл продолжается пока владелец
не остановит. Спираль накапливает corpus: итерация N+1 стоит на плечах N.

## Архитектура сессии

```
┌──────────────────────────────────────────────────┐
│  Owner (отсутствует)                             │
│   ↓ "отговорки не принимаются, продолжай"        │
│  Architect (heartbeat cycle, 15 мин)             │
│   ├─ sleep                                       │
│   ├─ шаги 1-6 методологического цикла            │
│   ├─ при significant event → deep dive           │
│   └─ append iteration → diary                    │
│         │                                        │
│         ▼                                        │
│  Detector system (autonomous, systemd)           │
│   ├─ raw data ingestion (collector)              │
│   ├─ signal rules → hypotheses                   │
│   ├─ LLM second-opinion (via cliproxy)           │
│   ├─ verify loop (predefined criteria)           │
│   └─ state → active_hypotheses.json              │
│         │                                        │
│         ▼                                        │
│  Dashboard (live visual)                         │
└──────────────────────────────────────────────────┘
```

Architect = надзор + цикл знания (формулирует, верифицирует, корректирует).
Detector = автономный ingestion + сигналы. Dashboard = визуал.
Архитектор НЕ редактирует код детектора напрямую — делегирует coder.

## Роль архитектора: НЕ "launch and leave"

Критическая дисциплина. Архитектор остаётся **активным** всю сессию:

- **Каждые 15 мин** — полная итерация методологического цикла
- **Не засыпать на часы** — даже "ничего не происходит" = информация (норма для понимания аномалий)
- **Не останавливаться после неудач** — false-positive / miss = данные для следующей итерации
- **Корректировать в реальном времени** — формулировать изменение, делегировать coder, проверять на следующей итерации
- **Документировать хронологически** — diary = расследование (данные→интерпретация→что искать дальше), НЕ summary table
- **Глубокий анализ — по запросу** (significant event), не каждый цикл
- **Не льстить себе** — фиксировать false-positive и miss ЧЕСТНО; near-HIT ≠ HIT

## Heartbeat протокол (механика цикла)

### 1. Sleep
```bash
sleep 900  # 15 мин (600 для активного объекта)
```

### 2. Woke → read state (шаг 1: НАБЛЮДЕНИЕ)
```bash
python3 -c "
import json
d=json.load(open('${STATE_FILE}'))
print('seq:', d.get('seq'), 'active:', len(d.get('active',[])))
for h in d.get('active',[]):
    print(' ', h.get('id'), h.get('rule_id'), h.get('direction'),
          'outcome', h.get('outcome'), 'entry', h.get('entry_point'),
          'target', h.get('target'))
"
```

### 3. Read trajectory of object (шаг 1 продолж.)
```bash
grep -E "${KEY_METRIC}=" ${DIARY} | tail -9 | sed "s/.*${KEY_METRIC}=\([0-9.-]*\).*/\1/" | tr '\n' ' '
```

### 4. Read recent events (шаг 2: ВЕРИФИКАЦИЯ — ход + апробация N-1)
```bash
tail -20 ${DIARY} | grep -E "## \[|ИНТЕРПРЕТАЦИЯ|hit|miss|INVALID|NEW|LLM|ПРОВЕРКА"
```

### 5. IF significant event → deep dive (шаги 3-5: ГИПОТЕЗА → АПРОБАЦИЯ → ВЫВОДЫ)
- **сигнал детектора** → проверить entry/target/outcome + физику (ключевые метрики в момент)
- **LLM second-opinion** → сверить прогноз с реальным движением (HIT/miss/near)
- **аномальное событие** → ключевые метрики в момент (кто/что двигает? дельты ключевых величин × направление)
- **near-HIT** → analyze WHY miss: verify logic? boundary преждевременный? target слишком строгий?

### 6. IF correction needed → formulate + delegate (шаг 6: КОРРЕКТИРОВКИ, pending если coder недоступен)
См. «Протокол корректировок».

### 7. Append iteration to diary (все 6 шагов)
```markdown
## Iteration N — HH:MM UTC

### НАБЛЮДЕНИЕ: <object trajectory>
### ВЕРИФИКАЦИЯ (ход + апробация N-1): <что предсказывали? какой исход апробации прошлой итерации?>
### ГИПОТЕЗА: <новая, из выводов>
### АПРОБАЦИЯ: direction/magnitude/horizon/invalidation — predefined
### ВЫВОДЫ: <что узнали, запись в corpus>
### КОРРЕКТИРОВКИ: <если нужны — formulation для coder>
### State: seq, active, outcomes
### Дальше: Iteration N+1 — <что watch>
```

### 8. Sleep → repeat (цикл безостановочен)

## Протокол верификации

Определения исходов апробации (PREDEFINED критерии, НЕ подгоняются пост-фактум):

| Исход | Критерий |
|-------|----------|
| **HIT** | Объект достиг целевого критерия (полный, в рамках horizon) |
| **near-HIT** | Объект достиг нижней границы magnitude, но НЕ полный target. **НЕ считается HIT**, но требует анализа: почему не дошёл? boundary преждевременный? target слишком строгий? |
| **miss** | Horizon истёк, target не достигнут |
| **invalidated** | Invalidation boundary сработал ДО horizon — гипотеза опровергнута раньше |
| **false-positive** | Детектор сработал, объект пошёл иначе (проблема в правиле детектора) |
| **false-negative** | Детектор пропустил, объект сделал то что гипотеза предсказала бы (проблема в порогах детектора) |

Критерии HIT/miss (т.е. что считать «достиг») — часть **baseline-логики**, НЕ
меняются ночью (см. протокол корректировок).

## Протокол корректировок

Корректировки = сердце forward-test. Live-итерации, не теория.

### Когда корректировать:
- **False-positive** → tighten gates / fix invalidation boundary
- **Near-HIT** → relax target to lower bound / fix premature boundary
- **Пропуск паттерна** (LLM видит, детектор не сработал) → ослабить пороги ИЛИ добавить новое правило
- **Новый паттерн** (не описан ни детектором, ни LLM) → задокументировать + закодировать правило

### Корректировка vs baseline-логика (важная граница):
- **Корректировка** = пороги / правила / инвалидация в существующей логике детектора. МОЖНО ночью.
- **Baseline** = verify-логика (критерии HIT/miss), формат state-файла, имена полей, способ чтения данных. **НЕ трогать ночью** — ломает статистику сравнения между итерациями. → отложить в candidates для обсуждения с владельцем.

### Правила:
1. **КАЖДАЯ корректировка** = rationale в diary (почему, что наблюдаем)
2. **Проверка на следующей итерации** — корректировка валидируется живым объектом
3. **Одна корректировка за раз** — не вали пять порогов сразу (не поймёшь что сработало)
4. **Versioning в diary** — номер (#1, #2...) + что изменилось + rationale
5. **Архитектор формулирует → делегирует coder** → проверяет на следующей итерации. Архитектор НЕ редактирует код детектора напрямую. **Если coder недоступен (ночь/нет активной сессии)** → корректировка = PENDING в diary (формулировка + rationale), применить при первой возможности. Детектор продолжает на старых правилах — это НЕ блокер для цикла (верификация продолжается на данных, pending-корректировка ждёт утра).

### Anti-patterns:
- ❌ Менять baseline-логику ночью (HIT/miss criteria, формат state)
- ❌ Вали 5 порогов сразу — не поймёшь эффект каждой
- ❌ Корректировать без rationale — потеряешь trace почему
- ❌ Игнорировать LLM second-opinion когда он правее правил
- ❌ Останавливаться после 3 неудач подряд — это данные, не повод сдаться

## Накопление опыта (corpus)

Каждая итерация добавляет запись. К концу сессии должны быть:

- `investigation_diary.md` — iteration-by-iteration хронология (главный артефакт, шаблон для будущих сессий)
- per-day детекторный diary (detector-generated raw cycles)
- `active_hypotheses.json` — state (seq, active, closed, outcomes)
- **Corpus паттернов**: `{name, signature, cases[], status: verified/outdated/provisional, raw evidence}` — накапливается между сессиями
- **Corpus корректировок**: `{#N, what changed, rationale, outcome on next iteration}` — накапливается
- **LLM second-opinion score**: hit/miss/near со счётом + архитектурные выводы (LLM vs правила)
- **Candidates для review**: корректировки baseline-уровня, требующие владельца

## Contingency protocols (edge cases)

- **Detector упал во время sleep** → немедленно `systemctl restart` + `RECOVERY_EVENT` в diary. Если 3 рестарта подряд → `STATE_CORRUPTED`, прервать сессию, записать причину.
- **LLM keys exhausted** → fallback на резервную модель. Если все иссякли → **rules-only mode**: heartbeat увеличить до 30 мин, фокус на manual observation, LLM-second-opinion выключить (записать в diary когда восстановился).
- **Диск <2G** → `LOW_DISK` в diary + остановить collector (сохранить существующие данные) + manual observation без записи raw.
- **Владелец >HORIZON+1h не вернулся** → `FINAL_SUMMARY` + passive monitoring (heartbeat 60 мин). Detector НЕ останавливать.
- **5+ итераций «ничего не происходит»** (seq не меняется, нет events) → (a) снизить heartbeat до 600s; (b) запросить LLM second-opinion «что я упускаю?»; (c) записать `NULL_PATTERN` в diary (это тоже знание — норма объекта).
- **COMPOUND_FAILURE** (несколько аварий сразу — напр. detector упал И диск полный) → priority: **сохранить существующие данные** → passive mode (heartbeat 60 мин, manual observation). НЕ рестартовать detector пока диск не очищен. Записать compound-сценарий в diary.
- **OWNER_STOP_DURING_RECOVERY** (владелец остановил во время RECOVERY_EVENT) → detector оставить в текущем состоянии (НЕ рестартовать дополнительно), запись финализировать как есть, RECOVERY_EVENT отметить как `interrupted`.
- **LLM_DIVERGENCE** (2 модели дают противоречивые интерпретации одного события) → log both в diary, перейти в rules-only для этой гипотезы, пометить `MANUAL_REVIEW_REQUIRED` (владелец утром). НЕ выбирать одну произвольно — расхождение = сигнал что событие неоднозначно.

## Завершение сессии

Когда владелец просыпается / останавливает:

1. **Comprehensive summary в diary** — финальная итерация:
   - trajectory full night (start → peak → trough → end)
   - гипотез: total / invalidated / miss / HIT / near-HIT
   - LLM second-opinion hit rate
   - корректировок count
   - паттернов найдено (verified / provisional)
   - lifecycle объекта за ночь (повествование на языке домена)

2. **Отчёт владельцу** на языке домена:
   - история объекта (последовательность событий с метками/временем)
   - что система поймала / пропустила
   - чему научились (инсайты)
   - оправдал ли себя подход (оценка)
   - candidates для review + что дальше (рекомендации)

3. **State сохранён**, detector продолжает автономно (если владелец не остановил)

4. **Memory actualization** — обновить STATUS.md / insights.md / observations.md / AGENTS.md summaries по протоколу AGENTS.md

## Воспроизводимость (быстрый старт)

```bash
# 1. Parameterize (владелец указывает контекст домена)
export NIGHT_OBJECT=<object>
export NIGHT_HORIZON=10h
export HEARTBEAT_INTERVAL=900  # 15 мин (600 для активного)
export STATE_FILE=<path>
export DIARY=<path>
export KEY_METRIC=<метрика для trajectory grep>

# 2. Verify prerequisites (см. выше)
systemctl --user is-active <detector> <collector> <dashboard>

# 3. Backup + clean slate
cp -r <STATE_DIR> <STATE_DIR>.backup-$(date +%Y%m%d-%H%M%S)
echo '{"seq":0,"active":[],"closed":[]}' > ${STATE_FILE}

# 4. Start detector + dashboard (если не active)
systemctl --user start <detector> <collector> <dashboard>

# 5. Запусти heartbeat цикл (architect):
#    sleep $HEARTBEAT_INTERVAL → шаги 1-6 методологического цикла → repeat
#    до остановки владельцем
```

### State JSON schema (формальная конвенция)

```json
{
  "seq": "<int, monotonic counter>",
  "active": [
    {
      "id": "<str, уникальный>",
      "rule_id": "<str, имя правила детектора>",
      "direction": "<str, направление/тип ожидаемого события>",
      "entry_point": "<float, точка апробации (domain-агностично: цена/timestamp/уровень)>",
      "target": "<float|tuple, целевой критерий HIT>",
      "magnitude_pct": "<float|tuple, диапазон ожидаемого изменения>",
      "horizon": "<str|float, за какое время должно случиться>",
      "invalidation_boundary": "<float|str, что опровергает ДО horizon>",
      "created_at": "<ISO timestamp, когда выдвинута>",
      "verified_at": "<ISO timestamp|null, когда классифицирован outcome>",
      "outcome": "<str|null, HIT|near-HIT|miss|invalidated|None>",
      "close_reason": "<str|null>",
      "close_point": "<float|null>"
    }
  ],
  "closed": ["<те же поля + final outcome>"]
}
```

## Domain Appendix: рынок / микроструктура (ПРИМЕР)

Владелец указывает контекст домена при вызове. Здесь — пример применения методологии
к микроструктуре рынка Bybit (OUSDT, 29→30.06.2026, 10ч / 32 итерации). Показывает
как общая методология проявляется в конкретном домене.

### Домен-термины
- **Ключевые метрики**: OI (open interest), CVD (cumulative volume delta), orderbook imbalance, walls, funding, spoofing rate, liquidations
- **trajectory**: цена
- **события**: squeeze (short/long), distribution spike, absorption bounce, buildup, dump, pump, breakdown

### Паттерны (corpus, raw-верифицированы на OUSDT)
1. **Short Squeeze** (terminal catalyst): OI↓ + CVD↑ + liq DEFENSIVE → цена UP. Сигнал не продолжение — закрытые шорты не закроются снова, топливо иссякает.
2. **Absorption Bounce**: fakeout low + OI stable + bid walls heavy → цена UP (стены поглощают продажи).
3. **Distribution Spike**: spike high + OI↑ + CVD↓ → цена DOWN (новые шорты зашли на ложный пробой).
4. **Buildup**: OI↑ + CVD↑ → continuation (новые лонги входят).

### Домен-принципы
- **Знак дельты OI = компас**: OI↓+CVD↑ = covering (bull) | OI↑+CVD↓ = new shorts (bear) | OI↑+CVD↑ = buildup | OI↓+CVD↓ = liquidation (bear). Один «рост цены» = 3 разные истории.
- **Squeeze = terminal catalyst НЕ continuation**: топливо иссякает → цена возвращается. Сигнал = что ПОСЛЕ сквиза.
- **Squeeze = многоволновый**: OI осциллирует, стоп на 1 батч OI↑ premature. Нужен sustained-сигнал.
- **Spoofing-парадокс**: orderbook imbalance отрицательный + цена растёт = фейковые офферы (spoof) снимаются. LLM видит, правила нет.
- **verify target = min magnitude** (не mid) — near-HIT должен засчитываться (candidate для baseline review).

### LLM second-opinion vs статичные правила (архитектурный вывод)
glm LLM: 4 HIT + 1 partial + 1 near-HIT (75%+ hit rate). Правила: 0 HIT.
LLM адаптивна (видит паттерн со слабыми значениями + парадоксы), правила требуют
сильных порогов и слепы к mini-moves. → **LLM = primary детектор, правила = coarse
pre-filter для cost-control.** (candidate для архитектурного изменения.)

## Living document

Skill — живой документ. После каждой ночной сессии:

1. **Архитектор формулирует delta-skill** — что изменилось в методологии по опыту:
   - новые паттерны → Domain Appendix
   - уточнённые пороги/правила корректировок → протокол корректировок
   - новые anti-patterns которые проявились → anti-patterns секция
   - hit-rate тренд (правила vs LLM) → архитектурные выводы
2. **Delta-skill = PR в skill-файл** с diff (старая строка → новая строка + rationale). НЕ просто раздел в diary — постоянное изменение skill-файла `/home/ilya/.pi/agent/skills/night-autonomous/SKILL.md`.
3. **Делегирует coder** для внесения правок в skill-файл
4. **Code-audit + logic-audit** обновлённого skill (как для любого protocol-документа)
5. **Owner sign-off** — владелец подтверждает правки (skill методологический, требует human review)
6. **Обновление считается выполненным** только после: code-audit PASS + logic-audit PASS + owner sign-off

Для hotfix (критический баг найден во время сессии): appendix в `investigation_diary.md` с reference на будущий PR, применяется немедленно к сессии, формальный PR после сессии.
