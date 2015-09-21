'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var moment = require('moment-timezone');
var map = require('lodash/collection/map');
var extend = require('lodash/object/extend');
var config = require('config');
var $ = require('jquery');

/*eslint-disable indent */
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
/* esling-enable indent*/

var NewTransaction = FormView.extend({
	submitCallback: function (data) {
		var transaction = data;
		// multiply by 100 to store to database
		transaction.amount = transaction.amount * 100;
		if (transaction._id && this.transactionBeingEdited) {
			transaction = extend(this.transactionBeingEdited, transaction);
			delete this.transactionBeingEdited;
		} else if (transaction._id === '') {
			// delete _id to have it initialized to undefined
			delete transaction._id;
		}
		this.trigger('newtransaction', transaction);
	},
	clearFields: function () {
		// clear the input fields
		this._fieldViewsArray.forEach(function (view) {
			// check on clear, but use setValue to skip validation
			if (view.clear && typeof view.clear === 'function') {
				view.shouldValidate = false;
				view.setValue('', true);
			}
		});
		// reset submit button
		this.el.querySelector('[type="submit"]').innerHTML = 'Add';
	},
	editTransaction: function (transaction) {
		var date = moment.tz(transaction.date, 'America/New_York');
		for (var field in this._fieldViews) {
			var fieldValue = transaction[field];
			if (field === 'date') {
				fieldValue = date.format('YYYY-MM-DD');
			}
			if (field === 'time') {
				fieldValue = date.format('HH:mm');
			}
			if (field === 'amount') {
				fieldValue = fieldValue / 100;
			}
			this._fieldViews[field].setValue(fieldValue);
		}
		// store reference to transaction for submitCallback
		this.transactionBeingEdited = transaction;
		this.el.querySelector('[type="submit"]').innerHTML = 'Update';
		$('html, body').animate({scrollTop: $(this.el).scrollTop()});
	},
	fields: function () {
		return [
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
			new InputViewBS({
				name: 'date',
				type: 'date',
				label: 'Date',
				parent: this,
				value: moment().format('YYYY-MM-DD')
			}),
			new InputViewBS({
				name: 'time',
				type: 'time',
				label: 'Time',
				parent: this,
				value: moment().format('HH:mm')
			}),
			new SelectView({
				template: selectTemplate,
				name: 'category',
				label: 'Category',
				options: map(config.categories, function (cat) {
					return [cat.slug, cat.value];
				}),
				value: config.categories[0].slug,
				parent: this,
				unselectedText: 'Select a category'
			}),
			new SelectView({
				template: selectTemplate,
				name: 'source',
				label: 'Source',
				options: map(config.sources, function (source) {
					return [source.slug, source.value];
				}),
				value: config.sources[0].slug,
				parent: this,
				unselectedText: 'Select a payment type'
			}),
			new TextAreaViewBS({
				name: 'description',
				label: 'Description',
				required: false,
				parent: this
			}),
			new SelectView({
				template: selectTemplate,
				name: 'status',
				label: 'Status',
				options: ['POSTED', 'SCHEDULED', 'PENDING'],
				value: 'POSTED',
				parent: this,
				unselectedText: 'Select a status'
			}),
			new InputViewBS({
				name: '_id',
				type: 'hidden',
				required: false,
				parent: this
			})
		];
	}
});

module.exports = NewTransaction;
