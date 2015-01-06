'use strict';

var View = require('ampersand-view');
var TransactionsCollection = require('../collections/transactions');
var WeekView = require('./week');
var template = require('templates/transactions');

var Transactions = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();

		// render the weekly views before registering subview, because of this https://github.com/AmpersandJS/ampersand-view/issues/90
		this.currentWeekView = new WeekView({
			offset: 0,
			transactions: this.model.transactions
		}).render();
		this.prevWeekView = new WeekView({
			offset: -1,
			transactions: this.model.transactions
		}).render();
		this.prev2WeekView = new WeekView({
			offset: -2,
			transactions: this.model.transactions
		}).render();
		this.prev3WeekView = new WeekView({
			offset: -3,
			transactions: this.model.transactions
		}).render();
		this.el.appendChild(this.currentWeekView.el);
		this.el.appendChild(this.prevWeekView.el);
		this.el.appendChild(this.prev2WeekView.el);
		this.el.appendChild(this.prev3WeekView.el);
		this.registerSubview(this.currentWeekView);
		this.registerSubview(this.prevWeekView);
		this.registerSubview(this.prev2WeekView);
		this.registerSubview(this.prev3WeekView);
		return this;
	}
});

module.exports = Transactions;
