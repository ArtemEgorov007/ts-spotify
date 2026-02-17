import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

type GuardProps = {
  children: ReactElement;
};

export function RequireAuth({ children }: GuardProps) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <main className="guard-state">Проверяем сессию...</main>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
