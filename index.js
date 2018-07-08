import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import reducer from './reducers';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();

const store = createStore(reducer, applyMiddleware(thunk));

render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App} />
		</Router>
	</Provider>,
	document.querySelector('.main')
);
