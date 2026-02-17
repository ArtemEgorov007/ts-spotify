import { PropsWithChildren, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { musicPlatformStore } from '@/store/store';
import { loadVkSession } from '@/modules/auth/vkSession';

export function AuthSessionSync({ children }: PropsWithChildren) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user) {
      const username =
        (typeof user.nickname === 'string' && user.nickname) ||
        (typeof user.name === 'string' && user.name) ||
        '';

      const email = (typeof user.email === 'string' && user.email) || '';

      musicPlatformStore.applyAuthUser(username, email, 'auth0');
      return;
    }

    const vkSession = loadVkSession();
    if (vkSession) {
      musicPlatformStore.applyAuthUser(vkSession.username, vkSession.email, 'vk');
      return;
    }

    musicPlatformStore.clearAuthUser();
  }, [isAuthenticated, isLoading, user]);

  return <>{children}</>;
}
