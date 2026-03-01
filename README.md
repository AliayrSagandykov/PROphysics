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

## Troubleshooting Vercel deploy

- Warning `deprecated next@14.2.7` means package is outdated and may have security issues.
  This repository now pins patched `next@14.2.33`.
- If build fails on XML encoding parsing, ensure Node 20+ runtime in Vercel settings; indexer uses `TextDecoder('windows-1251')` with safe UTF-8 fallback.
- If lessons open but SWF does not start, replace `public/ruffle/ruffle.js` stub with official self-hosted Ruffle bundle.
