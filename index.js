import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import reducer from './reducers';

const store = createStore(reducer, applyMiddleware(thunk));

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.querySelector('.main')
);
