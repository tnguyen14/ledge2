'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var TPromise = require('promise');

var NewTransaction = FormView.extend({
	submitCallback: function (data) {
		return TPromise.resolve($.ajax({
			url: this.model.url() + '/transactions',
			type: 'POST',
			data: data
		})).then(function (result) {
			// clear the input fields
			this._fieldViewsArray.forEach(function (view) {
				// check on clear, but use setValue to skip validation
				if (view.clear && typeof view.clear === 'function') {
					view.shouldValidate = false;
					view.setValue('', true);
				}
			})
		}.bind(this))
	},
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