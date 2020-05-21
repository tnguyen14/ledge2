import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import App from './containers/App';
import Header from './containers/header';
import reducer from './reducers';
import { Router, Route } from 'react-router-dom';
import history from './history';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

window.SERVER_URL = process.env.SERVER_URL;
window.ACCOUNT_NAME = 'daily';

render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Header />
        <Route path="/" component={App} />
      </div>
    </Router>
  </Provider>,
  document.querySelector('.main')
);
