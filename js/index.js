import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import App from './components/App';
import Header from './components/header';
import reducer from './reducers';
import { BrowserRouter, Route } from 'react-router-dom';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

window.SERVER_URL = process.env.SERVER_URL;
window.AUTH_TOKEN = process.env.AUTH_TOKEN;
window.ACCOUNT_NAME = 'daily';

render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Header />
        <Route path="/" component={App} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.querySelector('.main')
);
