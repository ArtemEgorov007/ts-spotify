import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import App from '@/App';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const baseUrl = import.meta.env.BASE_URL || '/';

function resolveRedirectUri() {
  const envRedirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;
  const fallbackRedirectUri = new URL(baseUrl, window.location.origin).toString();

  if (!envRedirectUri) {
    return fallbackRedirectUri;
  }

  try {
    const envOrigin = new URL(envRedirectUri).origin;
    return envOrigin === window.location.origin ? envRedirectUri : fallbackRedirectUri;
  } catch {
    return fallbackRedirectUri;
  }
}

const redirectUri = resolveRedirectUri();

if (!domain || !clientId) {
  throw new Error('Не заданы VITE_AUTH0_DOMAIN и VITE_AUTH0_CLIENT_ID в .env');
}

const onRedirectCallback = (appState?: AppState) => {
  const returnTo = appState?.returnTo || '/app';
  const route = returnTo.startsWith('/') ? returnTo : `/${returnTo}`;
  window.history.replaceState({}, document.title, `${window.location.pathname}#${route}`);
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
