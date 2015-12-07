'use strict';

var combineReducers = require('redux').combineReducers;
var assign = require('lodash.assign');
var actions = require('../actions');

function account (state, action) {
	switch (action.type) {
		case actions.RECEIVE_ACCOUNT:
			return assign({}, {account: action.payload});
		default: {
			return {
				account: {}
			};
		}
	}
}

module.exports = combineReducers({
	account: account
});
