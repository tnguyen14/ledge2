'use strict';

var Model = require('ampersand-model');

var Transaction = Model.extend({
	idAttribute: '_id',
	props: {
		_id: 'string',
		amount: ['number', true, 0],
		merchant: ['string', true, ''],
		date: {
			type: 'string'
		},
		description: ['string', false, ''],
		category: ['string', false, 'Default'],
		status: ['string', true, 'POSTED'],
		source: {
			type: 'string'
		},
		active: {
			type: 'boolean',
			default: false
		}
	}
});

module.exports = Transaction;
