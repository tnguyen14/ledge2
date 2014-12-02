'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');

var NewTransaction = FormView.extend({
	fields: function () {
		return [
			new InputView({
				name: 'date',
				type: 'date',
				label: 'Date',
				parent: this
			}),
			new InputView({
				name: 'amount',
				type: 'number',
				label: 'Amount',
				parent: this
			}),
			new InputView({
				name: 'merchant',
				label: 'Merchant',
				parent: this
			}),
			new InputView({
				name: 'description',
				type: 'textarea',
				label: 'Description',
				parent: this
			}),
			new SelectView({
				name: 'category',
				label: 'Category',
				options: [['default', 'Default'], ['dineout', 'Dine Out']],
				value: 'default',
				parent: this,
			}),
			new SelectView({
				name: 'status',
				label: 'Status',
				options: ['POSTED', 'SCHEDULED', 'PENDING'],
				value: 'POSTED',
				parent: this
			})
		];
	}
});

module.exports = NewTransaction;