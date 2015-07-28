'use strict';

var View = require('ampersand-view');
var template = require('../../templates/week.hbs');
var TransactionView = require('./transaction');

var Week = View.extend({
	initialize: function () {
		// bubble the `edit` event up
		this.listenTo(this.model.transactions, 'edit', function (transaction) {
			this.parent.trigger('edit', transaction);
		});
		this.stats = this.model.getStats();
	},
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		this.transactionsView = this.renderCollection(this.model.transactions, TransactionView, this.query('tbody'));
		return this;
	}
});

module.exports = Week;
