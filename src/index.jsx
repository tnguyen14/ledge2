import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import store from './store.js';
import App from './components/App/index.jsx';
import {
  AUTH0_DOMAIN,
  API_AUDIENCE,
  LISTS_SCOPE,
  PROFILE_SCOPE
} from './util/constants.js';

const root = createRoot(document.querySelector('.main'));
root.render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId="z3IK464A6PogdpKe0LY0vTaKr6izei2a"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    authorizationParams={{
      redirect_uri: window.location.href,
      audience: API_AUDIENCE,
      scope: `${PROFILE_SCOPE} ${LISTS_SCOPE}`
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>
);
