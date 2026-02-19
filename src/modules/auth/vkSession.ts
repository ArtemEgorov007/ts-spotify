const VK_SESSION_KEY = 'ts_spotify_vk_session';

export type VkSession = {
  username: string;
  email: string;
  authMethod?: 'vk' | 'local';
};

export function saveVkSession(session: VkSession) {
  localStorage.setItem(VK_SESSION_KEY, JSON.stringify(session));
}

export function loadVkSession(): VkSession | null {
  const raw = localStorage.getItem(VK_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<VkSession>;
    const email = typeof parsed.email === 'string' ? parsed.email.trim() : '';
    const rawUsername = typeof parsed.username === 'string' ? parsed.username.trim() : '';
    const lowerUsername = rawUsername.toLowerCase();
    const isFallbackName =
      !rawUsername ||
      lowerUsername === 'vk пользователь' ||
      lowerUsername === 'пользователь' ||
      lowerUsername === 'user';
    const normalizedUsername = !isFallbackName
      ? rawUsername
      : email.includes('@')
        ? email.split('@')[0]
        : '';

    return {
      username: normalizedUsername,
      email,
      authMethod: parsed.authMethod === 'local' ? 'local' : 'vk',
    };
  } catch {
    return null;
  }
}

export function clearVkSession() {
  localStorage.removeItem(VK_SESSION_KEY);
}
