import { NavigateFunction } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/routes';
import { authStore, playerStore } from '@/store/store';
import { clearVkSession, loadVkSession, saveVkSession, VkSession } from '@/modules/auth/vkSession';

type AuthIdentity = {
  username: string;
  email: string;
};

function navigateToApp(navigate: NavigateFunction) {
  navigate(APP_ROUTES.app, { replace: true });
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
    authMethod: vkSession.authMethod,
  });
}

export function loginWithLocalDemo(navigate: NavigateFunction) {
  const localUser: VkSession = {
    username: 'local-user',
    email: 'local@ts-music.dev',
    authMethod: 'local',
  };

  saveVkSession(localUser);
  authStore.applyAuthUser(localUser.username, localUser.email, localUser.authMethod);
  navigateToApp(navigate);
}

export function loginWithVkIdentity(identity: AuthIdentity, navigate: NavigateFunction) {
  const session: VkSession = {
    username: identity.username,
    email: identity.email,
    authMethod: 'vk',
  };

  saveVkSession(session);
  authStore.applyAuthUser(session.username, session.email, session.authMethod);
  navigateToApp(navigate);
}

export function logoutUser(navigate: NavigateFunction) {
  authStore.clearAuthUser();
  playerStore.pause();
  clearVkSession();
  navigate(APP_ROUTES.landing);
}
