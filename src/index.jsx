import React from 'https://esm.sh/react@18';
import { render } from 'https://esm.sh/react-dom@18';
import { Provider } from 'https://esm.sh/react-redux@7';
import { Auth0Provider } from 'https://esm.sh/@auth0/auth0-react@2';
import store from './store.js';
import App from './components/App/index.js';
import { AUTH0_DOMAIN } from './util/constants.js';

render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId="z3IK464A6PogdpKe0LY0vTaKr6izei2a"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    authorizationParams={{
      redirect_uri: window.location.href
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>,
  document.querySelector('.main')
);
