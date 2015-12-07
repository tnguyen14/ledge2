var React = require('react');
var ReactDOM = require('react-dom');

var Provider = require('react-redux').Provider;
var App = require('./components/App');
var configureStore = require('./store');

ReactDOM.render(
	<Provider store={configureStore()}>
		<App/>
	</Provider>,
	document.body
);
