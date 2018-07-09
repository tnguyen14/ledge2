import React from 'react';
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import reducer from './reducers';
import { Router, Route } from 'react-router-dom';
import history from './history';
import { handleAuthentication } from './auth';

const store = createStore(reducer, applyMiddleware(thunk));

render(
	<Provider store={store}>
		<Router history={history}>
			<div>
				<Route exact path="/ledge/" component={App} />
				<Route
					path="/ledge/callback.html"
					render={() => {
						handleAuthentication();
						return <div>Loading...</div>;
					}}
				/>
			</div>
		</Router>
	</Provider>,
	document.querySelector('.main')
);
