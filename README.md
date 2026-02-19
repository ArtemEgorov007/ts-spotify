# ts-music

Минималистичный фронтенд музыкальной платформы на React + TypeScript.

## Стек

- React 19 + TypeScript
- MobX (state management)
- React Router (HashRouter)
- Vite (сборка)
- CSS-переменные (theming)

## Структура

```
src/
├── app/           # Роутинг, layout, провайдеры
├── modules/       # Фичи: auth, shell, library, player, admin
├── store/         # MobX store'ы
├── shared/        # Иконки, мок-данные
├── types/         # TypeScript типы
└── styles/        # CSS токены и стили
```

## Быстрый старт

```bash
npm install
```

Создай `.env` на основе `.env.example`:

```env
VITE_VK_APP_ID=your-vk-app-id
```

Запуск:

```bash
npm run dev
```

Сборка:

```bash
npm run build
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка продакшена |
| `npm run preview` | Предпросмотр сборки |
| `npm run lint` | ESLint проверка |
| `npm run lint:styles` | Stylelint проверка |
| `npm run format:check` | Проверка форматирования |
| `npm run format` | Форматирование кода |

## Функционал

### ✅ Реализовано

- Вход через VK ID (OneTap) или демо-режим
- Главная страница с треками
- Медиатека с плейлистами
- Поиск (заглушка)
- Плеер (UI, без аудио)
- Тёмная/светлая тема
- Адаптив (мобилки, планшеты, десктоп)
- Сворачиваемый сайдбар

### ⚠️ Требует доработки

- Воспроизведение аудио (нет HTML5 audio)
- Поиск (нет ввода и логики)
- Создание плейлистов
- Управление очередью
- Горячие клавиши

## VK ID

Для работы VK ID нужен HTTPS. На `localhost` доступен демо-вход.

1. Создай приложение в [VK Developers](https://dev.vk.com/)
2. Укажи `VITE_VK_APP_ID` в `.env`
3. Настрой redirect URI в приложении VK

## Деплой

Проект настроен для деплоя на GitHub Pages.

В `vite.config.ts` указан `base: '/ts-music/'`.

## Лицензия

MIT
