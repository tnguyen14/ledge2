import { createStore, applyMiddleware } from 'https://cdn.skypack.dev/redux@3';
import thunk from 'https://cdn.skypack.dev/redux-thunk@2';
import { composeWithDevTools } from 'https://cdn.skypack.dev/redux-devtools-extension@2';
import reducer from './reducers/index.js';

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
