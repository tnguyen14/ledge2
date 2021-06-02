/**
 * @format
 */

import { AppRegistry } from 'react-native';
import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import App from './App';
import reducer from '../src/reducers/index.js';
import { name as appName } from '../static/manifest.json';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <App />
  </Provider>
));
