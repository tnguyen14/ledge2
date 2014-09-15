'use strict';

var Collection = require('ampersand-rest-collection');
var Transaction = require('../models/transaction');

var Transactions = Collection.extend({
	model: Transaction
});

module.exports = Transactions;