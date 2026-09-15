# V6 — Reference-driven Visual Direction

## Goal

Проверить, улучшает ли отдельный слой `visual-direction.json` визуальное качество страницы по сравнению с V5 baseline.

Pipeline:

`Design Brief → Visual Direction → Composition Plan → UI Coder → Screenshot → Vision Critic → Polish → QA`

## Project

Северный Дом — строительство загородных домов премиум-класса.

Используется тот же Design Brief и тот же исходный контент, что в E2E baseline. Меняется только visual direction layer и последующий visual review.

## Reference set

Референсы выбраны не для копирования layout, а для извлечения принципов image-led / editorial / searchable architecture presentation:

1. Foster + Partners — глубина project archive и findability.
2. BIG — проектная история через визуальные материалы и понятную коммуникацию.
3. OMA — editorial treatment, где исследование и содержание являются частью сайта.

Дополнительный benchmark: Meridian Studio case study — full-bleed photography, sequential project navigation и restrained motion.

## Acceptance

V6 не считается успешным только потому, что visual-direction.json существует.
Успех = screenshot V6 визуально заметно сильнее V5 baseline при сохранении ясности контента.

Не использовать uniqueness/diversity score как основную метрику.
