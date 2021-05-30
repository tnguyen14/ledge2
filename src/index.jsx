import React from 'https://cdn.skypack.dev/react@17';
import { render } from 'https://cdn.skypack.dev/react-dom@17';
import thunk from 'https://cdn.skypack.dev/redux-thunk@2';
import { createStore, applyMiddleware } from 'https://cdn.skypack.dev/redux@3';
import { composeWithDevTools } from 'https://cdn.skypack.dev/redux-devtools-extension@2';
import { Provider } from 'https://cdn.skypack.dev/react-redux@7';
import { Auth0Provider } from 'https://cdn.skypack.dev/@auth0/auth0-react@1';
import {
  BrowserRouter,
  Route
} from 'https://cdn.skypack.dev/react-router-dom@5';
import App from './components/App/index.js';
import Header from './components/Header/index.js';
import reducer from './reducers/index.js';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

render(
  <Auth0Provider
    domain="tridnguyen.auth0.com"
    clientId="z3IK464A6PogdpKe0LY0vTaKr6izei2a"
    cacheLocation="localstorage"
    useRefreshTokens={true}
    redirectUri={window.location.href}
  >
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Header />
          <Route path="/" component={App} />
        </div>
      </BrowserRouter>
    </Provider>
  </Auth0Provider>,
  document.querySelector('.main')
);
