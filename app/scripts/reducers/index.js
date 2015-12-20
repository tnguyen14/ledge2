'use strict';

var combineReducers = require('redux').combineReducers;
var actions = require('../actions');
var moment = require('moment-timezone');

function account (state, action) {
	switch (action.type) {
		case actions.RECEIVE_ACCOUNT:
			return Object.assign({}, action.payload, {
				weeks: weeks(action.payload.transactions)
			});
		default:
			return {
				weeks: []
			};
	}
}

/**
 * @param {Array} transactions
 * @return {Object} weeks
 */
function weeks (transactions) {
	if (!transactions || !transactions.length) {
		return {};
	}
	return [
		getWeek(0, transactions),
		getWeek(-1, transactions),
		getWeek(-2, transactions),
		getWeek(-3, transactions)
	];

}

/**
 * @param {Number} offset
 * @param {Array} transactions
 * @return {Object} week
 */
function getWeek (offset, transactions) {
	var start = moment().isoWeekday(1 + offset * 7).startOf('isoWeek');
	var end = moment().isoWeekday(7 + offset * 7).endOf('isoWeek');
	return {
		start: start,
		end: end,
		transactions: transactions.filter(function (t) {
			return t.date >= start.toISOString() && t.date <= end.toISOString();
		})
	};
}

module.exports = combineReducers({
	account: account
});
