# PROphysics (Next.js + Ruffle)

Платформа для уроков физики 7–9 классов с запуском legacy SWF через Ruffle.

## Быстрый старт

```bash
npm install
npm run dev
```

## Куда класть первые уроки (SWF + XML)

Каждый урок — это отдельная папка внутри класса:

```text
public/content/
  7/
    1.1-demo-tema/
      imsmanifest.xml
      LOM_resource.xml
      1_1.swf
  8/
  9/
```

Правила:
- папка класса: `7`, `8` или `9`;
- папка урока: любой slug (лучше начинать с номера: `1.1-...`, `2.3-...`), чтобы корректно работала сортировка;
- желательно положить `imsmanifest.xml` и `LOM_resource.xml` (или `lom_resource.xml`);
- если `imsmanifest.xml` отсутствует, индексатор возьмёт первый найденный `.swf` в папке урока;
- если `LOM_resource.xml` отсутствует, заголовок темы будет взят из имени папки урока (`slug`);

После добавления уроков пересоберите индекс:

```bash
npm run build:index
```

Скрипт просканирует `public/content/{7,8,9}` и обновит `public/contentIndex.json`.

## Ruffle

Основной источник: `public/ruffle/ruffle.js` (self-hosted).

Сейчас в репозитории лежит заглушка, поэтому для продакшна замените её на официальный bundle с https://ruffle.rs/downloads.

Если локальный bundle отсутствует/невалиден, `SwfPlayer` автоматически пробует CDN fallback:
`https://unpkg.com/@ruffle-rs/ruffle/ruffle.js`.

## Деплой на Vercel

- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output: стандартный для Next.js

`npm run build` сначала выполняет `npm run build:index`, поэтому дополнительных шагов не нужно.
