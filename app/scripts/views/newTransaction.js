'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var TPromise = require('promise');
var moment = require('moment-timezone');

// Bootstrap inputs
var InputViewBS = InputView.extend({
	template: [
		'<div class="form-group">',
			'<label class="control-label" data-hook="label"></label>',
			'<div class="input-container">',
				'<input class="form-control">',
				'<div data-hook="message-container" class="message message-below message-error">',
					'<p data-hook="message-text"></p>',
				'</div>',
			'</div>',
		'</div>'
	].join('')
});

var InputAmountView = InputView.extend({
	template: [
		'<div class="form-group">',
			'<label class="control-label" data-hook="label"></label>',
			'<div class="input-container">',
				'<input class="form-control" min="0" step="any">',
				'<div data-hook="message-container" class="message message-below message-error">',
					'<p data-hook="message-text"></p>',
				'</div>',
			'</div>',
		'</div>'
	].join(''),
	props: {
		type: ['string', true, 'number']
	}
});

var TextAreaViewBS = InputView.extend({
	template: [
		'<div class="form-group">',
			'<label class="control-label" data-hook="label"></label>',
			'<div class="input-container">',
				'<textarea class="form-control"></textarea>',
				'<div data-hook="message-container" class="message message-below message-error">',
					'<p data-hook="message-text"></p>',
				'</div>',
			'</div>',
		'</div>'
	].join('')
});

var selectTemplate = [
		'<div class="form-group">',
			'<label class="control-label" data-hook="label"></label>',
			'<div class="input-container">',
				'<select class="form-control"></select>',
				'<div data-hook="message-container" class="message message-below message-error">',
					'<p data-hook="message-text"></p>',
				'</div>',
			'</div>',
		'</div>'
	].join('');

var NewTransaction = FormView.extend({
	submitCallback: function (data) {
		var url = this.model.url() + '/transactions',
			type = 'POST';
		if (data._id) {
			url += '/' + data._id;
			type = 'PATCH';
		}
		return TPromise.resolve($.ajax({
			url: url,
			type: type,
			data: data
		})).then(function (result) {
			// clear the input fields
			this._fieldViewsArray.forEach(function (view) {
				// check on clear, but use setValue to skip validation
				if (view.clear && typeof view.clear === 'function') {
					view.shouldValidate = false;
					view.setValue('', true);
				}
			});
		}.bind(this));
	},
	editTransaction: function (transaction) {
		// update date and time fields
		var date = moment(transaction.date);
		transaction.date = date.format('YYYY-MM-DD');
		transaction.time = date.format('HH:mm');
		for (var field in this._fieldViews) {
			this._fieldViews[field].setValue(transaction[field]);
		}
	},
	fields: function () {
		return [
			new InputViewBS({
				name: 'date',
				type: 'date',
				label: 'Date',
				parent: this
			}),
			new InputViewBS({
				name: 'time',
				type: 'time',
				label: 'Time',
				value: '08:00', // default to 08:00 AM
				parent: this
			}),
			new InputAmountView({
				name: 'amount',
				label: 'Amount',
				parent: this
			}),
			new InputViewBS({
				name: 'merchant',
				label: 'Merchant',
				parent: this
			}),
			new TextAreaViewBS({
				name: 'description',
				label: 'Description',
				required: false,
				parent: this
			}),
			new SelectView({
				template: selectTemplate,
				name: 'category',
				label: 'Category',
				options: [
					['default', 'Default'],
					['dineout', 'Dine Out'],
					['entertainment', 'Entertainment'],
					['gas', 'Gas'],
					['groceries', 'Groceries'],
					['household', 'Household'],
					['transportation', 'Transportation'],
					['misc', 'Miscellaneous']
				],
				value: 'default',
				parent: this,
			}),
			new SelectView({
				template: selectTemplate,
				name: 'source',
				label: 'Source',
				options: [
					['amex-1003', 'Amex'],
					['visa-0162', 'Amazon'],
					['dcu-checking', 'DCU Checking'],
					['cash', 'Cash'],
					['other', 'Other']
				],
				value: 'amex-1003',
				parent: this,
			}),
			new SelectView({
				template: selectTemplate,
				name: 'status',
				label: 'Status',
				options: ['POSTED', 'SCHEDULED', 'PENDING'],
				value: 'POSTED',
				parent: this
			}),
			new InputViewBS({
				name: '_id',
				type: 'hidden',
				parent: this
			})
		];
	}
});

module.exports = NewTransaction;
