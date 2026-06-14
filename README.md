# ts-music

Музыкальное приложение на React 19 + TypeScript. Реальное воспроизведение треков через Jamendo API, подборки по настроению с автовыбором на основе времени суток, полнофункциональный плеер с очередью.

## Возможности

- **Аудио**: воспроизведение реальных треков через [Jamendo API](https://www.jamendo.com/start), очередь, shuffle, repeat, управление громкостью
- **Главная**: подборки по настроению (утро / энергия / фокус / расслабление / ночь), дефолтное настроение выбирается по времени суток
- **Поиск**: debounce-поиск по Jamendo + фильтр по жанрам (mood-пресеты)
- **Медиатека**: создание и управление плейлистами
- **Тема**: dark/light переключение через CSS-переменные
- **Адаптив**: мобилки, планшеты, десктоп; сворачиваемый сайдбар
- **Авторизация**: VK ID (OneTap) или демо-вход

## Стек

| Слой | Технология |
|------|-----------|
| UI | React 19 + TypeScript |
| Роутинг | React Router 6 (HashRouter) |
| Стейт | MobX 6 |
| Сборка | Vite 5 |
| API | Jamendo REST API |
| Стили | CSS-переменные, dark/light тема |

## Быстрый старт

```bash
# 1. Создай .env на основе примера
cp .env.example .env
# Укажи свой VK App ID (для VK ID входа) — без него работает демо-вход
# VITE_VK_APP_ID=your-vk-app-id

# 2. Установи зависимости
npm install

# 3. Запусти dev-сервер
npm run dev
# → http://localhost:33000
```

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер на порту 33000 |
| `npm run build` | Продакшн-сборка |
| `npm run preview` | Предпросмотр сборки |
| `npm run typecheck` | Проверка типов (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run lint:styles` | Stylelint |
| `npm run format` | Prettier |

## Архитектура

```
src/
├── app/           # Роутинг (AppRouter), layout, провайдеры, гарды
├── modules/       # Фичи: auth, shell (Home, Search), library, player
├── store/         # MobX: playerStore (аудио + очередь), authStore
├── shared/        # API (jamendo.ts), маппер, утилиты форматирования
├── types/         # TypeScript типы (Track, Playlist)
└── styles/        # CSS-токены + тематические слои
```

**Feature-модули** изолированы по директориям. Сторы (`playerStore`, `authStore`) — глобальные синглтоны, экспортируются из `store/store.ts`. Маршруты защищены гардом `RequireAuth`.

## Деплой (GitHub Pages)

```bash
npm run build
# dist/ деплоится на GitHub Pages через .github/workflows/static.yml
```

Базовый путь задаётся через переменную окружения `VITE_BASE_PATH` (по умолчанию `/`). Для GitHub Pages укажи путь к репозиторию в настройках CI.

## VK ID

Для полноценного входа через VK ID нужен HTTPS и зарегистрированное приложение на [dev.vk.com](https://dev.vk.com/). На `localhost` доступен демо-вход без VK.
