# ts-spotify

Минималистичный фронтенд-каркас музыкальной платформы на React + TypeScript.

## Архитектура

- `src/app`:
  - роутинг
  - layout
  - guards
  - синхронизация локальной auth-сессии
- `src/modules`:
  - `auth` — стартовый экран входа
  - `authService` — единый слой auth-use-cases (bootstrap/login/logout)
  - `shell` — главная и поиск
  - `library` — медиатека
  - `player` — нижний плеер
  - `admin` — базовая админ-панель
- `src/store`:
  - `authStore` — состояние авторизации
  - `playerStore` — очередь и управление плеером
  - `store.ts` — barrel-экспорты
- `src/shared`:
  - иконки
  - мок-данные
- `src/types`:
  - доменные типы
- `src/styles`:
  - токены, base и раздельные feature-стили (auth/layout/content/player/admin/responsive)

## VK ID

- Файл `.env`:
```env
VITE_VK_APP_ID=your-vk-app-id
```
- На странице входа подключён OneTap-виджет VK.
- После успешного входа создаётся локальная сессия VK и открывается `/app`.
- Выход очищает локальную VK-сессию.
- Для работы VK ID нужен `https` origin.
- `redirectUrl` формируется автоматически из текущего домена и `VITE_BASE_PATH`.
- На `localhost` доступен демо-вход без VK (для локальной разработки по `http`).

## Команды

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run lint:styles
npm run format:check
```

## Alias

- `@/*` -> `src/*`

## GitHub Pages

- Роутинг работает через `HashRouter`.
- В workflow уже настроена сборка и деплой `dist` в Pages.
- Базовый путь для Pages: `/ts-spotify/`.

## Тема

- Переключатель темы расположен внизу sidebar.
