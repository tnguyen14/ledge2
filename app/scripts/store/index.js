'use strict';

var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var thunkMiddleware = require('redux-thunk');
var rootReducer = require('../reducers');

var createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
module.exports = function (initialState) {
	return createStoreWithMiddleware(rootReducer, initialState);
};
