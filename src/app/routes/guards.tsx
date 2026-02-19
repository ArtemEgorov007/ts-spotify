import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/store/store';
import { APP_ROUTES } from '@/app/config/routes';

type GuardProps = {
  children: ReactElement;
};

export const RequireAuth = observer(function RequireAuth({ children }: GuardProps) {
  if (!authStore.authHydrated) {
    return <main className="guard-state">Проверяем сессию...</main>;
  }

  if (authStore.isAuthenticated) {
    return children;
  }

  return <Navigate to={APP_ROUTES.landing} replace />;
});
