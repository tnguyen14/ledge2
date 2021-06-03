import { AppRegistry, View } from 'react-native';
import React from 'react';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import { NativeRouter, Route } from 'react-router-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import App from './components/App/index.jsx';
import Header from './components/Header/index.jsx';
import reducer from '../src/reducers/index.js';
import { name as appName } from '../static/manifest.json';
import styleGlobals from './index.style.js';

EStyleSheet.build(styleGlobals);

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

AppRegistry.registerComponent(appName, () => () => (
  <Provider store={store}>
    <NativeRouter>
      <View>
        <Header />
        <Route path="/" component={App} />
      </View>
    </NativeRouter>
  </Provider>
));
