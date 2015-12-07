'use strict';

var combineReducers = require('redux').combineReducers;
var actions = require('../actions');

function account (state, action) {
	switch (action.type) {
		case actions.RECEIVE_ACCOUNT:
			return action.payload;
		default: {
			return {};
		}
	}
}

module.exports = combineReducers({
	account: account
});
