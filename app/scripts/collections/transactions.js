'use strict';

var Collection = require('ampersand-rest-collection');
var Transaction = require('../models/transaction');
var config = require('config');

var Transactions = Collection.extend({
	initialize: function (models, options) {
		if (options.account) {
			this.account = options.account;
		}
		if (options.week) {
			this.week = options.week;
			// if week is set, default offset to 0
			this.offset = options.offset | 0;
		}
	},
	parse: function (res, options) {
		console.log(res);
		return res;
	},
	model: Transaction,
	url: function () {
		return config.server_url + '/budget/' + this.account + '/' + this.week + (this.offset ? '/' + this.offset : '');
	}
});

module.exports = Transactions;
