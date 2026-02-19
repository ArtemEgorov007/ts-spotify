import { NavigateFunction } from 'react-router-dom';
import { authStore, playerStore } from '@/store/store';
import { clearVkSession, loadVkSession, saveVkSession, VkSession } from '@/modules/auth/vkSession';

type AuthIdentity = {
  username: string;
  email: string;
};

function navigateToApp(navigate: NavigateFunction) {
  navigate('/app', { replace: true });
}

export function bootstrapAuthSession() {
  const vkSession = loadVkSession();
  if (!vkSession) {
    authStore.hydrateAuthUser(null);
    return;
  }

  authStore.hydrateAuthUser({
    username: vkSession.username,
    email: vkSession.email,
    authMethod: vkSession.authMethod || 'vk',
  });
}

export function loginWithLocalDemo(navigate: NavigateFunction) {
  const localUser: VkSession = {
    username: 'local-user',
    email: 'local@ts-spotify.dev',
    authMethod: 'local',
  };

  saveVkSession(localUser);
  authStore.applyAuthUser(localUser.username, localUser.email, localUser.authMethod);
  navigateToApp(navigate);
}

export function loginWithVkIdentity(identity: AuthIdentity, navigate: NavigateFunction) {
  saveVkSession(identity);
  authStore.applyAuthUser(identity.username, identity.email, 'vk');
  navigateToApp(navigate);
}

export function logoutUser(navigate: NavigateFunction) {
  authStore.clearAuthUser();
  playerStore.pause();
  clearVkSession();
  navigate('/');
}
