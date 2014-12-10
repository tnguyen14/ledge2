'use strict';

var View = require('ampersand-view');
var TransactionsCollection = require('../collections/transactions');
var WeekView = require('./week');
var template = require('templates/transactions');

var Transactions = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		var currentWeekTransactions = new TransactionsCollection([], {
			week: 'current',
			account: this.model.getId()
		});
		this.currentWeekView = new WeekView({
			collection: currentWeekTransactions
		});
		currentWeekTransactions.fetch({
			success: function () {
				this.renderSubview(this.currentWeekView);
			}.bind(this)
		});
		return this;
	}
});

module.exports = Transactions;
