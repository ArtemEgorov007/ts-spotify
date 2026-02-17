# ts-spotify

Минималистичный фронтенд-каркас музыкальной платформы на React + TypeScript.

## Архитектура

- `src/app`:
  - роутинг
  - layout
  - guards
  - синхронизация Auth0-сессии
- `src/modules`:
  - `auth` — стартовый экран входа
  - `shell` — главная и поиск
  - `library` — медиатека
  - `player` — нижний плеер
  - `admin` — базовая админ-панель
- `src/store`:
  - MobX store для плеера и профиля пользователя
- `src/shared`:
  - иконки
  - мок-данные
- `src/types`:
  - доменные типы

## Auth0

Файл `.env`:

```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_VK_APP_ID=your-vk-app-id
```

В Auth0 приложении:

- `Allowed Callback URLs`: `http://localhost:33000`
- `Allowed Logout URLs`: `http://localhost:33000`
- `Allowed Web Origins`: `http://localhost:33000`

Для GitHub Pages добавь:

- `Allowed Callback URLs`: `https://artemegorov007.github.io/ts-spotify/`
- `Allowed Logout URLs`: `https://artemegorov007.github.io/ts-spotify/`
- `Allowed Web Origins`: `https://artemegorov007.github.io`

## VK ID

- На странице входа подключён OneTap-виджет VK.
- После успешного входа создаётся локальная сессия VK и открывается `/app`.
- Выход очищает локальную VK-сессию.
- Для работы VK ID нужен `https` origin.
- `redirectUrl` формируется автоматически из текущего домена и `VITE_BASE_PATH`.

Для GitHub Pages укажи redirect:

- `https://artemegorov007.github.io/ts-spotify/`

## Команды

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Alias

- `@/*` -> `src/*`

## GitHub Pages

- Роутинг работает через `HashRouter`.
- В workflow уже настроена сборка и деплой `dist` в Pages.
- Базовый путь для Pages: `/ts-spotify/`.

## Тема

- Переключатель темы расположен внизу sidebar.
- На странице входа переключателя нет.
