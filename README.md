# PROphysics (Next.js + Ruffle)

Платформа для уроков физики 7–9 классов с запуском legacy SWF через Ruffle.

## Быстрый старт

```bash
npm install
npm run dev
```

## Языки контента (русский + казахский)

Русский контент остаётся в текущей структуре `public/content/{7,8,9}`.
Для казахского языка используется отдельная папка `public/content/kz/{7,8,9}`.

```text
public/content/
  7/
    1.1-demo-tema/
      imsmanifest.xml           # необязательно
      LOM_resource.xml          # необязательно
      1_1.swf                   # обязательно (или путь до SWF в manifest)
  8/
  9/
  kz/
    7/
      1.1-demo-tema/
        1_1.swf
    8/
    9/
```

> Важно: если вы хотите загрузить только SWF без XML, это поддерживается — скрипт найдёт первый `.swf` в папке урока.

Правила:
- язык интерфейса: `ru` или `kk`;
- папка класса: `7`, `8` или `9`;
- папка урока: любой slug (лучше начинать с номера: `1.1-...`, `2.3-...`), чтобы корректно работала сортировка;
- `imsmanifest.xml` и `LOM_resource.xml` — опциональны;
- если есть `imsmanifest.xml`, приоритет у `href` из `<resource ... href="...">`.

После добавления уроков пересоберите индекс:

```bash
npm run build:index
```

Скрипт просканирует:
- русский: `public/content/{7,8,9}`
- казахский: `public/content/kz/{7,8,9}`

И обновит:
- `public/contentIndex.ru.json`
- `public/contentIndex.kk.json`

## Переключение языка на сайте

На страницах классов/тем есть переключатель языка. Он меняет параметр `?lang=ru|kk`:
- `ru` берёт уроки из `public/content/{grade}/...`;
- `kk` берёт уроки из `public/content/kz/{grade}/...`.

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
