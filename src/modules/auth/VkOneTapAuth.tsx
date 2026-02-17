import { useEffect, useRef, useState } from 'react';

type VkOneTapAuthProps = {
  onSuccess: (payload: { username: string; email: string }) => void;
};

type VkPayload = {
  code: string;
  device_id: string;
  user?: unknown;
  email?: unknown;
};

const VK_SDK_URL = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';

function getWindowSdk() {
  return (window as Window & { VKIDSDK?: any }).VKIDSDK;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function pickString(objects: Record<string, unknown>[], keys: string[]) {
  for (const object of objects) {
    for (const key of keys) {
      const raw = object[key];
      if (typeof raw === 'string') {
        const value = raw.trim();
        if (value) {
          return value;
        }
      }
    }
  }

  return '';
}

function resolveIdentity(data: unknown, payload: VkPayload) {
  const root = asRecord(data);
  const user = asRecord(root.user);
  const profile = asRecord(root.profile);
  const response = asRecord(root.response);
  const responseUser = asRecord(response.user);
  const nestedData = asRecord(root.data);
  const nestedDataUser = asRecord(nestedData.user);
  const payloadUser = asRecord(payload.user);

  const sources = [user, profile, responseUser, nestedDataUser, root, response, nestedData, payloadUser];

  const firstName = pickString(sources, ['first_name', 'firstName']);
  const lastName = pickString(sources, ['last_name', 'lastName']);
  const fullName = `${firstName} ${lastName}`.trim();
  const email = pickString(sources, ['email', 'mail']) || (typeof payload.email === 'string' ? payload.email.trim() : '');

  const username =
    fullName ||
    pickString(sources, ['name', 'display_name', 'displayName', 'nickname', 'screen_name', 'screenName', 'login']) ||
    (email.includes('@') ? email.split('@')[0] : '') ||
    'Пользователь';

  return { username, email };
}

export function VkOneTapAuth({ onSuccess }: VkOneTapAuthProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const [error, setError] = useState('');

  const appId = Number(import.meta.env.VITE_VK_APP_ID || 0);
  const redirectUrl = new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString();
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

        const oAuth = new VKID.OAuthList();
        containerRef.current.innerHTML = '';
        initializedRef.current = true;

        oAuth
          .render({
            container: containerRef.current,
            oauthList: ['vkid'],
          })
          .on(VKID.WidgetEvents.ERROR, (vkError: unknown) => {
            if (!cancelled) {
              setError('Ошибка VK ID. Проверь настройки приложения.');
            }
            void vkError;
          })
          .on(VKID.OAuthListInternalEvents.LOGIN_SUCCESS, (payload: VkPayload) => {
            VKID.Auth.exchangeCode(payload.code, payload.device_id)
              .then((data: unknown) => {
                if (!cancelled) {
                  onSuccess(resolveIdentity(data, payload));
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
