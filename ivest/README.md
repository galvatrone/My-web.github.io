# Vector Autonomous — Fix Pack

Точечные CSS-патчи, иконки и фотографии для сайта Vector Autonomous Systems.
Все правки лежат поверх вашего существующего кода — ничего удалять не нужно.

## Что в пакете

```
patches.css                — 18 CSS-блоков, каждый фиксит один баг из ревью
assets/icons/              — 15 иконок SVG (строчные, 24×24, #1E8AE8)
assets/img/                — 9 фотографий JPEG (hero, parachute, market-сегменты и т.д.)
index.html                 — ваш index с одной добавленной строкой (link на patches.css)
assets/content.js          — с добавленным полем slug у сегментов рынка
assets/script.js           — с data-segment атрибутом на .segment-card
```

## Как установить

1. Скопируйте содержимое папки `assets/` поверх `your-site/assets/` — заменит `content.js`, `script.js`, добавит `patches.css`, `icons/`, `img/`.
2. Скопируйте `index.html` поверх вашего — отличие всего в одной строке (подключение `patches.css` после `ivest.css`).

Или, если предпочитаете вручную:

```html
<!-- в <head>, СРАЗУ после ivest.css -->
<link rel="stylesheet" href="./assets/ivest.css" />
<link rel="stylesheet" href="./assets/patches.css" />
```

И в `content.js` у каждого объекта в массиве `segments` добавьте поле `slug: "express"` (или `medical`, `regional`, `inspection`), а в `script.js` в шаблоне `segment-card` пропишите `data-segment="${item.slug}"` — без этого фотографии рынка не появятся.

## Что чинится

| # | Баг | Фикс |
|---|---|---|
| 1 | Три pillar-карточки ломают кириллицу и наезжают на hero media | Вертикальная раскладка в hero__copy, без агрессивного hyphens |
| 2 | Дубль оранжевой кнопки в хедере | `.site-header__cta { display: none }` |
| 3 | Sticky header + tab-bar на мобильном съедает 30% экрана | На `max-width: 900px` tab-bar становится `position: static` |
| 4 | Pitch-panel обрезают кириллицу по правому краю | Уменьшен padding, `clamp()` font-size, `hyphens: auto` |
| 5 | `$XX B TAM` оранжевый — выглядит как баг | Приглушён в uppercase gray |
| 6 | Reason-карточки плохо читаются | Более сильный border + лёгкая тень |
| 7 | «Смотреть overview» ведёт в никуда | Скрыта `.button--ghost` в hero actions |
| 8 | Пустой navy-бокс в hero | Фон заменён на реальный рендер H2 HYBRID |
| 9 | Solution visual — плейсхолдер дрона | Фон — тот же hero-drone.jpg |
|10 | Spec drawing — плоский SVG | Фон — технический чертёж (top + side view) |
|11 | Parachute demo — абстракция | Фон — реальное фото спасения с парашютом |
|12 | Traction — серые столбики | Фон — фото field demo (логистический хаб) |
|13 | Reserve banner — пустой navy | Фон — drone cinematic shot |
|14 | Market-сегменты — 4 одинаковых navy-плитки | Каждая с реальным фото: express / medical / regional / inspection |
|15 | Demo photo card — серый квадрат | Фон — field demo JPG |
|16 | Feature/safety/spec карточки — просто точки-кружочки | SVG-иконки check / shield / gauge |
|17 | Mixed RU/EN заголовки | Лёгкий letter-spacing для латиницы |
|18 | Mobile CTA закрывает футер | Добавлен `padding-bottom: 96px` в `.site-footer` на мобилке |

## Замена заглушек на реальные данные

- **TAM цифры.** В `content.js` → `segments[i].tam` замените `"$XX B TAM"` на реальное число, например `"$12B TAM"`. Стиль уже скорректирован на приглушённый.
- **Команда (expert cards).** Пока там `"Имя Фамилия"` — замените в `content.js` → `experts` на реальные имена и роли.
- **Quote / press.** `content.js` → `pressQuote` — вставьте настоящий отзыв советника или партнёра.
- **Traction numbers (120k+, 4.8k, 18).** В `content.js` → `tractionStats` — замените на свои реальные метрики.

## Усиления v2 (24 апреля)

### Глобальный layout
- `.offering-shell` остаытся двухколоночным (main + 360px sidebar), но Reserve-карточка висит только на hero — дальше sticky отключён.
- Все секции кроме hero растягиваются на полную 1200px через `margin-right: -392px`.
- На `max-width: 1180px` shell складывается в одну колонку.

### Стратегия Battery → H₂
Секция сравнения переименована в "ОТ АККУМУЛЯТОРНОГО ПРОТОТИПА — К ВОДОРОДНО-ГИБРИДНОМУ ПРОДУКТУ". Колонка ДВС удалена, остались две: ЭТАП 1 (Аккумуляторный, прототип) и ЭТАП 2 · ЦЕЛЬ (H₂-гибрид, выделен голубым). Добавлен последний ряд "Роль в roadmap".

## Совместимость

- Работает поверх существующего `ivest.css` (v1716 строк от 24 апреля 2026).
- Не меняет токены дизайн-системы (`--color-primary`, `--shell` и т.д.) — только override для 18 точечных проблем.
- Все правила ограничены max-width 900px для мобильных адаптаций.

## Откат

Чтобы отключить все патчи разом — удалите строку подключения `patches.css` из `index.html`. Всё остальное (добавленные фотки и иконки) можно оставить, они не вредят.
