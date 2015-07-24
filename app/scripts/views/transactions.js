'use strict';

var View = require('ampersand-view');
var WeekView = require('./week');
var WeekModel = require('../models/week');
var template = require('templates/transactions');

var Transactions = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.renderWeekView(0);
		this.renderWeekView(-1);
		this.renderWeekView(-2);
		this.renderWeekView(-3);
		return this;
	},
	renderWeekView: function (offset) {
		var weekModel = new WeekModel({
			offset: offset,
			transactions: this.model.transactions
		});
		var weekView = new WeekView({
			model: weekModel
		});
		this.renderSubview(weekView);
	}
});

module.exports = Transactions;
