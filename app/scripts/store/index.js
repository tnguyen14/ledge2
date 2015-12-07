'use strict';

var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var thunkMiddleware = require('redux-thunk');
var createLogger = require('redux-logger').default;
var rootReducer = require('../reducers');

var createStoreWithMiddleware = applyMiddleware(
	thunkMiddleware,
	createLogger({
		predicate: function () {
			return process.env.NODE_ENV === 'development';
		}
	})
)(createStore);

module.exports = function (initialState) {
	return createStoreWithMiddleware(rootReducer, initialState);
};
