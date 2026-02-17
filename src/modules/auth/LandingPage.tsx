import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading, isAuthenticated, error } = useAuth0();

  const onLogin = () => {
    void loginWithRedirect({ appState: { returnTo: '/app' } });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="landing-page">
      <section className="auth-hero">
        <p className="auth-hero-kicker">Музыкальная платформа</p>
        <h1>Войти в ts-spotify</h1>
        <p>Продолжай в аккаунте, чтобы открыть библиотеку, поиск и плеер.</p>

        <button type="button" className="btn btn-primary auth-login-btn" onClick={onLogin} disabled={isLoading}>
          {isLoading ? 'Открываем вход...' : 'Войти'}
        </button>

        {error ? <p className="landing-error">{error.message}</p> : null}
      </section>
    </main>
  );
}
