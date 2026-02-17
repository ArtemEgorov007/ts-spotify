import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { VkOneTapAuth } from '@/modules/auth/VkOneTapAuth';
import { saveVkSession } from '@/modules/auth/vkSession';
import { musicPlatformStore } from '@/store/store';

export const LandingPage = observer(function LandingPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isLoading, isAuthenticated, error } = useAuth0();
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const onLogin = () => {
    if (isLocalhost) {
      const localUser = { username: 'local-user', email: 'local@ts-spotify.dev', authMethod: 'local' as const };
      saveVkSession(localUser);
      musicPlatformStore.applyAuthUser(localUser.username, localUser.email, localUser.authMethod);
      navigate('/app', { replace: true });
      return;
    }

    void loginWithRedirect({ appState: { returnTo: '/app' } });
  };

  const onVkSuccess = (payload: { username: string; email: string }) => {
    saveVkSession(payload);
    musicPlatformStore.applyAuthUser(payload.username, payload.email, 'vk');
    navigate('/app', { replace: true });
  };

  useEffect(() => {
    if (isAuthenticated || musicPlatformStore.isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate, musicPlatformStore.isAuthenticated]);

  return (
    <main className="landing-page">
      <section className="auth-hero">
        <p className="auth-hero-kicker">ts-spotify</p>
        <h1>Вход</h1>
        <p>Открой музыку, подборки и библиотеку.</p>

        <button type="button" className="btn btn-primary auth-login-btn" onClick={onLogin} disabled={isLoading}>
          {isLocalhost ? 'Войти в демо' : isLoading ? 'Открываем вход...' : 'Войти'}
        </button>

        {!isLocalhost ? (
          <>
            <div className="auth-divider">или</div>
            <VkOneTapAuth onSuccess={onVkSuccess} />
            {error ? <p className="landing-error">{error.message}</p> : null}
          </>
        ) : null}
      </section>
    </main>
  );
});
