'use strict';

var View = require('ampersand-view');
var TransactionsCollection = require('../collections/transactions');
var WeekView = require('./week');
var template = require('templates/transactions');
var SubCollection = require('ampersand-subcollection');
var moment = require('moment-timezone');

/**
 * @description compare the date to see whether it falls within the week
 * @param date the date ISO string to be compared
 * @param offset the number of week offset, default to 0, i.e. the current week
 **/
var dateFilter = function (date, offset) {
	offset = (offset || 0) * 7;
	var weekStart = moment().day(1 + offset).startOf('isoWeek').toISOString();
	var weekEnd = moment().day(7 + offset).endOf('isoWeek').toISOString();
	return date >= weekStart && date <= weekEnd;
};

var Transactions = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();

		var currentWeek = new SubCollection(this.model.transactions, {
			filter: function (model) {
				return dateFilter(model.date);
			},
			comparator: function (model) {
				return model.date;
			}
		});

		var prevWeek = new SubCollection(this.model.transactions, {
			filter: function (model) {
				return dateFilter(model.date, -1);
			},
			comparator: function (model) {
				return model.date;
			}
		});

		this.currentWeekView = new WeekView({
			offset: 0,
			collection: currentWeek
		});
		this.prevWeekView = new WeekView({
			offset: -1,
			collection: prevWeek
		});
		this.renderSubview(this.currentWeekView);
		this.renderSubview(this.prevWeekView);
		return this;
	}
});

module.exports = Transactions;
