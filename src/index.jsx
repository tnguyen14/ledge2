import React from 'https://esm.sh/react@18.2.0';
import { render } from 'https://esm.sh/react-dom@18.2.0';
import { Provider } from 'https://esm.sh/react-redux@9.1.1';
import { Auth0Provider } from 'https://esm.sh/@auth0/auth0-react@2';
import store from './store.js';
import App from './components/App/index.jsx';
import {
  AUTH0_DOMAIN,
  API_AUDIENCE,
  LISTS_SCOPE,
  PROFILE_SCOPE
} from './util/constants.js';

render(
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
  </Auth0Provider>,
  document.querySelector('.main')
);
