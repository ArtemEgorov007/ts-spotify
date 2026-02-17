# ts-spotify

Чистый стартовый проект стриминговой платформы.

## Что уже есть

- Главная страница входа:
  - вход через Auth0
  - переход в админку только после авторизации (если роль `admin`)
- Каркас пользовательской зоны:
  - сайдбар
  - главная лента треков
  - поиск
  - медиатека
  - нижний плеер
- Каркас админки:
  - карточки метрик
  - таблица модерации
- Локальные заглушки:
  - иконки
  - обложки
  - мок-данные

## Стек

- React + TypeScript
- Vite
- MobX + mobx-react-lite
- react-router-dom
- Auth0 React SDK

## Алиасы

- `@/*` -> `src/*`

Примеры:

- `import { AppRouter } from '@/app/routes/AppRouter'`
- `import { musicPlatformStore } from '@/store/store'`
- `import { mockTracks } from '@/shared/mock/media'`

## Auth0

Переменные (`.env`):

```env
VITE_AUTH0_DOMAIN=...
VITE_AUTH0_CLIENT_ID=...
VITE_AUTH0_REDIRECT_URI=http://localhost:33000
```

В Auth0 Application Settings должны быть:

- Allowed Callback URLs: `http://localhost:33000`
- Allowed Logout URLs: `http://localhost:33000`
- Allowed Web Origins: `http://localhost:33000`

Без этих трёх пунктов будет ошибка `Callback URL mismatch`.

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```
