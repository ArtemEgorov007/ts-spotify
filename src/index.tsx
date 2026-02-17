import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import App from '@/App';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import './index.css';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const baseUrl = import.meta.env.BASE_URL || '/';
const redirectUri = new URL(baseUrl, window.location.origin).toString();

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
    <ThemeProvider>
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
    </ThemeProvider>
  </React.StrictMode>
);
