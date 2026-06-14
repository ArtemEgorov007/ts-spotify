import { useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Sparkles } from 'lucide-react';
import { BrandLogo } from '@/app/components/BrandLogo';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { VkOneTapAuth } from '@/modules/auth/VkOneTapAuth';
import { LandingPreview } from '@/modules/auth/LandingPreview';
import { authStore } from '@/store/store';
import { loginWithLocalDemo, loginWithVkIdentity } from '@/modules/auth/authService';
import { APP_ROUTES } from '@/app/config/routes';
import { useIsMobileShell } from '@/shared/hooks/useMediaQuery';

const LANDING_FEATURES = [
  'Подборки по настроению',
  'Поиск через Jamendo API',
  'Плеер с hotkeys',
] as const;

export const LandingPage = observer(function LandingPage() {
  const navigate = useNavigate();
  const isMobileShell = useIsMobileShell();
  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasHttpsOrigin = window.location.protocol === 'https:';

  const onLogin = useCallback(() => loginWithLocalDemo(navigate), [navigate]);

  const onVkSuccess = useCallback(
    (payload: { username: string; email: string }) => loginWithVkIdentity(payload, navigate),
    [navigate],
  );

  if (authStore.authHydrated && authStore.isAuthenticated) {
    return <Navigate to={APP_ROUTES.app} replace />;
  }

  const showLocalDemo = isLocalhost;
  const showVkAuth = hasHttpsOrigin;
  const showVkHint = isLocalhost && !hasHttpsOrigin;
  const showStickyCta = isMobileShell && showLocalDemo;

  return (
    <main className="landing-page">
      <div className="landing-backdrop" aria-hidden="true">
        <span className="landing-orb landing-orb-1" />
        <span className="landing-orb landing-orb-2" />
        <span className="landing-orb landing-orb-3" />
      </div>

      <header className="landing-header">
        <BrandLogo />
        {isMobileShell ? <ThemeToggle compact /> : null}
      </header>

      <div className="landing-shell">
        <section className="landing-auth" aria-labelledby="landing-title">
          <p className="landing-auth-kicker">Portfolio · React 19 · TypeScript</p>
          <h1 id="landing-title">Музыка под твоё настроение</h1>
          <p className="landing-auth-lead">
            Подборки, поиск и плеер в одном интерфейсе — демо-проект в духе Spotify с API Jamendo.
          </p>

          <ul className="landing-features">
            {LANDING_FEATURES.map((feature) => (
              <li key={feature}>
                <Sparkles aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="landing-actions" id="landing-actions">
            {showLocalDemo ? (
              <button
                type="button"
                className="btn btn-primary btn-lg landing-cta"
                onClick={onLogin}
              >
                Начать слушать
              </button>
            ) : null}

            {showVkAuth ? (
              <>
                {showLocalDemo ? <div className="landing-divider">или</div> : null}
                <VkOneTapAuth onSuccess={onVkSuccess} />
              </>
            ) : null}

            {showVkHint ? (
              <p className="landing-hint">VK ID доступен на проде с HTTPS.</p>
            ) : null}

            {!showLocalDemo && !showVkAuth ? (
              <p className="landing-error">Для VK ID нужен HTTPS origin (например, GitHub Pages).</p>
            ) : null}
          </div>
        </section>

        <LandingPreview />
      </div>

      {showStickyCta ? (
        <div className="landing-sticky-cta">
          <button type="button" className="btn btn-primary btn-lg" onClick={onLogin}>
            Начать слушать
          </button>
        </div>
      ) : null}

      <footer className="landing-footer">
        <span>Учебный проект</span>
        <span aria-hidden="true">·</span>
        <span>Midnight Broadcast UI</span>
      </footer>
    </main>
  );
});
