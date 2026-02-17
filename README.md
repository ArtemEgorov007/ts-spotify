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
VITE_AUTH0_REDIRECT_URI=http://localhost:33000
```

В Auth0 приложении:

- `Allowed Callback URLs`: `http://localhost:33000`
- `Allowed Logout URLs`: `http://localhost:33000`
- `Allowed Web Origins`: `http://localhost:33000`

## Команды

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Alias

- `@/*` -> `src/*`
