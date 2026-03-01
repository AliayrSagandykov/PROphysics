# PROphysics (Next.js + Ruffle)

Платформа для уроков физики 7–9 классов с запуском legacy SWF через Ruffle.

## Быстрый старт

```bash
npm install
npm run dev
```

## Сборка индекса контента

```bash
npm run build:index
```

Скрипт сканирует `public/content/{7,8,9}` и генерирует `public/contentIndex.json` на основе
`imsmanifest.xml` и `LOM_resource.xml`.

## Деплой на Vercel

- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output: стандартный для Next.js

`npm run build` сначала выполняет `npm run build:index`, поэтому дополнительных шагов не нужно.

## Ruffle

Основной источник: `public/ruffle/ruffle.js` (self-hosted).

Если локальный bundle отсутствует или невалиден, `SwfPlayer` пробует CDN fallback
`https://unpkg.com/@ruffle-rs/ruffle/ruffle.js`.
