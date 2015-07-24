'use strict';

var View = require('ampersand-view');
var template = require('templates/week');
var TransactionView = require('./transaction');

var Week = View.extend({
	initialize: function (options) {
		// bubble the `edit` event up
		this.listenTo(this.model.transactions, 'edit', function (transaction) {
			this.parent.trigger('edit', transaction);
		});
	},
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		this.transactionsView = this.renderCollection(this.model.transactions, TransactionView, this.query('tbody'));
		return this;
	}
});

module.exports = Week;
