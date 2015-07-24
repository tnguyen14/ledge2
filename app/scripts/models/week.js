'use strict';

var Model = require('ampersand-model');
var moment = require('moment-timezone');
var Transactions = require('../collections/transactions');
var SubCollection = require('ampersand-filtered-subcollection');

var Week = Model.extend({
	props: {
		offset: ['number', true, 0]
	},
	collections: {
		transactions: Transactions
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
				return this.transactions.models.reduce(function (total, t) {
					return total + t.amount;
				}, 0);
			}
		}
	},
	initialize: function (options) {
		if (!options.transactions) {
			return;
		}
		var self = this;
		this.transactions = new SubCollection(options.transactions, {
			filter: function (t) {
				return t.date >= self.weekStart.toISOString() && t.date <= self.weekEnd.toISOString();
			},
			comparator: function (t) {
				return -t.date;
			}
		});
	}
});

module.exports = Week;
