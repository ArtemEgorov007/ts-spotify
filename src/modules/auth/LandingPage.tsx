import { useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { VkOneTapAuth } from '@/modules/auth/VkOneTapAuth';
import { authStore } from '@/store/store';
import { loginWithLocalDemo, loginWithVkIdentity } from '@/modules/auth/authService';

export const LandingPage = observer(function LandingPage() {
  const navigate = useNavigate();
  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  const onLogin = useCallback(() => loginWithLocalDemo(navigate), [navigate]);

  const onVkSuccess = useCallback(
    (payload: { username: string; email: string }) => loginWithVkIdentity(payload, navigate),
    [navigate],
  );

  if (authStore.authHydrated && authStore.isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <main className="landing-page">
      <section className="auth-hero">
        <p className="auth-hero-kicker">ts-spotify</p>
        <h1>Вход</h1>
        <p>Открой музыку, подборки и библиотеку.</p>

        {isLocalhost ? (
          <>
            <button type="button" className="btn btn-primary auth-login-btn" onClick={onLogin}>
              Войти в демо
            </button>
            <div className="auth-divider">или</div>
            <VkOneTapAuth onSuccess={onVkSuccess} />
          </>
        ) : (
          <VkOneTapAuth onSuccess={onVkSuccess} />
        )}
      </section>
    </main>
  );
});
