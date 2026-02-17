import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { observer } from 'mobx-react-lite';
import { musicPlatformStore } from '@/store/store';

type GuardProps = {
  children: ReactElement;
};

export const RequireAuth = observer(function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (musicPlatformStore.isAuthenticated) {
    return children;
  }

  if (isLoading) {
    return <main className="guard-state">Проверяем сессию...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
});
