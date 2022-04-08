import React from 'https://cdn.skypack.dev/react@17';
import { render } from 'https://cdn.skypack.dev/react-dom@17';
import { Provider } from 'https://cdn.skypack.dev/react-redux@7';
import { Auth0Provider } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
import store from './store.js';
import App from './components/App/index.js';
import { AUTH0_DOMAIN } from './util/constants.js';

render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId="z3IK464A6PogdpKe0LY0vTaKr6izei2a"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    redirectUri={window.location.href}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </Auth0Provider>,
  document.querySelector('.main')
);
