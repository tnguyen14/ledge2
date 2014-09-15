'use strict';

var View = require('ampersand-view');
var WeekView = require('./week');
var template = require('templates/transactions');

var Transactions = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();

		this.renderSubview(new WeekView({
			collection: this.collection
		}));
		return this;
	}
});

module.exports = Transactions;