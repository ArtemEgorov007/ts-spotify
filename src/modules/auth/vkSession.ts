const VK_SESSION_KEY = 'ts_spotify_vk_session';

export type VkSession = {
  username: string;
  email: string;
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
    return {
      username: typeof parsed.username === 'string' ? parsed.username : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
    };
  } catch {
    return null;
  }
}

export function clearVkSession() {
  localStorage.removeItem(VK_SESSION_KEY);
}
