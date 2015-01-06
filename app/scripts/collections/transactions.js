'use strict';

var Collection = require('ampersand-rest-collection');
var Transaction = require('../models/transaction');
var config = require('config');

var Transactions = Collection.extend({
	model: Transaction,
	url: function () {
		return config.server_url + '/accounts/' + this.parent.name + '/transactions';
	}
});

module.exports = Transactions;
