'use strict';

var Model = require('ampersand-model');

var Transaction = Model.extend({
	idAttribute: '_id',
	props: {
		amount: ['number', true, 0],
		merchant: ['string', true, ''],
		date: 'date',
		description: ['string', false, ''],
		category: ['string', false, 'Default'],
		status: ['string', true, 'POSTED']
	}
});

module.exports = Transaction;