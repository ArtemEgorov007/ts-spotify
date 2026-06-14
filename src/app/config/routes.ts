export const APP_ROUTES = {
  landing: '/',
  app: '/app',
  search: '/app/search',
  library: '/app/library',
} as const;

export const APP_CHILD_ROUTES = {
  search: 'search',
  library: 'library',
  libraryPlaylist: 'library/:playlistId',
} as const;

export function getPlaylistRoute(playlistId: string) {
  return `${APP_ROUTES.library}/${playlistId}`;
}

export function getPlaylistIdFromPath(pathname: string) {
  const match = pathname.match(/\/app\/library\/([^/]+)$/);
  return match?.[1] ?? null;
}

export function getAppSectionTitle(pathname: string, playlistTitle?: string | null) {
  if (playlistTitle) {
    return playlistTitle;
  }

  if (pathname.startsWith(APP_ROUTES.search)) {
    return 'Поиск';
  }

  if (pathname.startsWith(APP_ROUTES.library)) {
    return 'Медиатека';
  }

  return 'Главная';
}
