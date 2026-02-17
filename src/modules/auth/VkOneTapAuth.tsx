import { useEffect, useRef, useState } from 'react';

type VkOneTapAuthProps = {
  onSuccess: (payload: { username: string; email: string }) => void;
};

type VkPayload = {
  code: string;
  device_id: string;
};

const VK_SDK_URL = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';

function getWindowSdk() {
  return (window as Window & { VKIDSDK?: any }).VKIDSDK;
}

function resolveIdentity(data: any) {
  const user = data?.user ?? data?.profile ?? {};
  const firstName = typeof user.first_name === 'string' ? user.first_name : '';
  const lastName = typeof user.last_name === 'string' ? user.last_name : '';
  const fullName = `${firstName} ${lastName}`.trim();

  const email =
    (typeof user.email === 'string' && user.email) ||
    (typeof data?.email === 'string' && data.email) ||
    '';

  const username =
    fullName ||
    (typeof user.name === 'string' && user.name) ||
    (typeof user.nickname === 'string' && user.nickname) ||
    (email.includes('@') ? email.split('@')[0] : '') ||
    'VK пользователь';

  return { username, email };
}

export function VkOneTapAuth({ onSuccess }: VkOneTapAuthProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState('');

  const appId = Number(import.meta.env.VITE_VK_APP_ID || 0);
  const redirectUrl =
    import.meta.env.VITE_VK_REDIRECT_URI || new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
  const hasHttpsOrigin = window.location.protocol === 'https:';

  useEffect(() => {
    if (!appId || !hasHttpsOrigin || initializedRef.current) {
      return;
    }

    let cancelled = false;

    const initWidget = () => {
      const VKID = getWindowSdk();

      if (!VKID || !containerRef.current) {
        return;
      }

      try {
        VKID.Config.init({
          app: appId,
          redirectUrl,
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: '',
        });

        const oneTap = new VKID.OneTap();
        containerRef.current.innerHTML = '';
        initializedRef.current = true;

        oneTap
          .render({
            container: containerRef.current,
            showAlternativeLogin: true,
          })
          .on(VKID.WidgetEvents.ERROR, (vkError: unknown) => {
            if (!cancelled) {
              setError('Ошибка VK ID. Проверь настройки приложения.');
            }
            void vkError;
          })
          .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, (payload: VkPayload) => {
            VKID.Auth.exchangeCode(payload.code, payload.device_id)
              .then((data: unknown) => {
                if (!cancelled) {
                  onSuccess(resolveIdentity(data));
                }
              })
              .catch((vkError: unknown) => {
                if (!cancelled) {
                  setError('Не удалось завершить вход через VK.');
                }
                void vkError;
              });
          });
      } catch (vkError) {
        if (!cancelled) {
          setError('Не удалось инициализировать VK ID.');
        }
        void vkError;
      }
    };

    const existingScript = document.querySelector(`script[src="${VK_SDK_URL}"]`) as HTMLScriptElement | null;

    if (existingScript) {
      if (getWindowSdk()) {
        initWidget();
      } else {
        existingScript.addEventListener('load', initWidget, { once: true });
      }
    } else {
      const script = document.createElement('script');
      script.src = VK_SDK_URL;
      script.async = true;
      script.onload = initWidget;
      script.onerror = () => {
        if (!cancelled) {
          setError('SDK VK не загрузился.');
        }
      };
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [appId, hasHttpsOrigin, redirectUrl, onSuccess]);

  if (!appId) {
    return <p className="landing-error">VK ID не настроен: добавь VITE_VK_APP_ID в .env</p>;
  }

  if (!hasHttpsOrigin) {
    return <p className="landing-error">Для VK ID нужен HTTPS origin (например, прод-домен).</p>;
  }

  return (
    <div className="vk-auth-block">
      <div ref={containerRef} />
      {error ? <p className="landing-error">{error}</p> : null}
    </div>
  );
}
