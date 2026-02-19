export const APP_ROUTES = {
  landing: '/',
  app: '/app',
  search: '/app/search',
  library: '/app/library',
  admin: '/admin',
} as const;

export const APP_CHILD_ROUTES = {
  search: 'search',
  library: 'library',
} as const;

export function getAppSectionTitle(pathname: string) {
  if (pathname.startsWith(APP_ROUTES.search)) {
    return 'Поиск';
  }

  if (pathname.startsWith(APP_ROUTES.library)) {
    return 'Медиатека';
  }

  return 'Главная';
}
