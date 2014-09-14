'use strict';

var Model = require('ampersand-model');
var Transactions = require('../collections/transactions');
var config = require('config');

var Account = Model.extend({
	idAttribute: 'name',
	urlRoot: config.SERVER_URL + '/accounts',
	props: {
		starting_balance: ['number', true, 0],
		type: ['string', true, 'BUDGET'],
		period_length: ['number', true, 7]
	},
	collections: {
		transactions: Transactions
	}
});

module.exports = Account;