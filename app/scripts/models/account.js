'use strict';

var Model = require('ampersand-model');
var Transactions = require('../collections/transactions');
var config = require('config');

var Account = Model.extend({
	idAttribute: '_id',
	urlRoot: config.SERVER_URL + '/accounts',
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