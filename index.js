// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
// import App from './containers/App';
// import configureStore from './store';
// import { getAccount } from './actions';

// const store = configureStore();
// store.dispatch(getAccount());

// ReactDOM.render(
// 	<Provider store={store}>
// 		<App/>
// 	</Provider>,
// 	document.getElementById('root')
// );

import Handlebars from 'hbsfy/runtime';
import helpers from 'handlebars-helpers';
import {render as formRender} from './components/form';

helpers({
	handlebars: Handlebars
});

formRender('.main');
