import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import App from '@/App';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

function resolveRedirectUri() {
  const envRedirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI;
  if (!envRedirectUri) {
    return window.location.origin;
  }

  try {
    const envOrigin = new URL(envRedirectUri).origin;
    return envOrigin === window.location.origin ? envRedirectUri : window.location.origin;
  } catch {
    return window.location.origin;
  }
}

const redirectUri = resolveRedirectUri();

if (!domain || !clientId) {
  throw new Error('Не заданы VITE_AUTH0_DOMAIN и VITE_AUTH0_CLIENT_ID в .env');
}

const onRedirectCallback = (appState?: AppState) => {
  const returnTo = appState?.returnTo || '/app';
  window.history.replaceState({}, document.title, returnTo);
  window.dispatchEvent(new PopStateEvent('popstate'));
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
