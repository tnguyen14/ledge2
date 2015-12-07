'use strict';

var createStore = require('redux').createStore;

module.exports = function (initialState) {
	return createStore(function () {
		return {};
	}, initialState);
};
