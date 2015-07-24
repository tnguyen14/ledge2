'use strict';

var View = require('ampersand-view');
var SubCollection = require('ampersand-subcollection');
var template = require('templates/week');
var TransactionView = require('./transaction');
var moment = require('moment-timezone');

window.moment = moment;

var Week = View.extend({
	props: {
		offset: ['number', true, 0]
	},
	derived: {
		weekStart: {
			deps: ['offset'],
			fn: function () {
				return moment().isoWeekday(1 + this.offset * 7).startOf('isoWeek');
			}
		},
		weekEnd: {
			deps: ['offset'],
			fn: function () {
				return moment().isoWeekday(7 + this.offset * 7).endOf('isoWeek');
			}
		},
		weekTotal: {
			fn: function () {
				return this.collection.models.reduce(function (subTotal, model) {
					return subTotal + model.amount;
				}, 0);
			}
		}
	},
	initialize: function (options) {
		if (!options.transactions) {
			return;
		}
		this.transactions = options.transactions;
		var self = this;
		this.collection = new SubCollection(this.transactions, {
			filter: function (model) {
				return model.date >= self.weekStart.toISOString() && model.date <= self.weekEnd.toISOString();
			},
			comparator: function (model) {
				return -model.date;
			}
		});
		// bubble the `edit` event up
		this.listenTo(this.collection, 'edit', function (transaction) {
			this.parent.trigger('edit', transaction);
		});
	},
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		this.transactionsView = this.renderCollection(this.collection, TransactionView, this.query('tbody'));
		return this;
	}
});

module.exports = Week;
