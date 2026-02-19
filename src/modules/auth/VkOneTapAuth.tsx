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

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const [, payloadPart] = token.split('.');
    if (!payloadPart) {
      return {};
    }

    const normalized = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(normalized + padding);
    return asRecord(JSON.parse(json));
  } catch {
    return {};
  }
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

function buildIdentity(exchangeData: unknown, profileData: unknown, payload: VkPayload) {
  const profileRoot = asRecord(profileData);
  const profileUser = asRecord(profileRoot.user);
  const profileResponse = asRecord(profileRoot.response);
  const profileResponseUser = asRecord(profileResponse.user);

  const exchangeRoot = asRecord(exchangeData);
  const idToken = typeof exchangeRoot.id_token === 'string' ? exchangeRoot.id_token : '';
  const jwtPayload = idToken ? decodeJwtPayload(idToken) : {};
  const user = asRecord(exchangeRoot.user);
  const profile = asRecord(exchangeRoot.profile);
  const response = asRecord(exchangeRoot.response);
  const responseUser = asRecord(response.user);
  const nestedData = asRecord(exchangeRoot.data);
  const nestedDataUser = asRecord(nestedData.user);
  const payloadUser = asRecord(payload.user);

  const sources = [
    profileUser,
    profileResponseUser,
    profileRoot,
    profileResponse,
    user,
    profile,
    responseUser,
    nestedDataUser,
    jwtPayload,
    exchangeRoot,
    response,
    nestedData,
    payloadUser,
  ];

  const firstName = pickString(sources, ['first_name', 'firstName', 'given_name']);
  const lastName = pickString(sources, ['last_name', 'lastName', 'family_name']);
  const fullName = `${firstName} ${lastName}`.trim();
  const email =
    pickString(sources, ['email', 'mail']) ||
    (typeof payload.email === 'string' ? payload.email.trim() : '');

  const username =
    fullName ||
    pickString(sources, [
      'name',
      'display_name',
      'displayName',
      'nickname',
      'screen_name',
      'screenName',
      'login',
    ]) ||
    (email.includes('@') ? email.split('@')[0] : '') ||
    'Пользователь';

  return { username, email };
}

async function loadProfileByTokens(VKID: any, exchangeData: unknown) {
  const root = asRecord(exchangeData);
  const accessToken = pickString(
    [root, asRecord(root.response), asRecord(root.data)],
    ['access_token'],
  );
  const idToken = pickString([root, asRecord(root.response), asRecord(root.data)], ['id_token']);

  if (accessToken && VKID?.Auth?.userInfo) {
    try {
      return await VKID.Auth.userInfo(accessToken);
    } catch {
      // Fallback to publicInfo if userInfo is unavailable for token/scope.
    }
  }

  if (idToken && VKID?.Auth?.publicInfo) {
    try {
      return await VKID.Auth.publicInfo(idToken);
    } catch {
      return null;
    }
  }

  return null;
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
              .then(async (exchangeData: unknown) => {
                const profileData = await loadProfileByTokens(VKID, exchangeData);

                if (!cancelled) {
                  onSuccess(buildIdentity(exchangeData, profileData, payload));
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

    const existingScript = document.querySelector(
      `script[src="${VK_SDK_URL}"]`,
    ) as HTMLScriptElement | null;

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
