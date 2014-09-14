'use strict';

var Model = require('ampersand-model');
var Transactions = require('../collections/transactions');

var Account = Model.extend({
	idAttribute: '_id',
	props: {
		name: ['string', true, ''],
		starting_balance: ['number', true, 0],
		type: ['string', true, 'BUDGET'],
		period_length: ['number', true, 7]
	},
	collections: {
		transactions: Transactions
	}
});

module.exports = Account;