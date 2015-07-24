'use strict';

var View = require('ampersand-view');

var template = require('templates/stats');

var statsUtil = require('../util/stats');

module.exports = View.extend({
	template: template,
	render: function () {
		var stats = {
			averages: {
				dineout: 0
			}
		};
		var dineouts, dineoutsTotal, weeks;
		if (this.model.transactions.length !== 0) {
			dineouts = this.model.transactions.models.filter(function (t) {
				return t.category === 'dineout';
			});
			dineoutsTotal = dineouts.reduce(function (total, t) {
				return total += t.amount;
			}, 0);
			weeks = statsUtil.totalWeeks(this.model.transactions);
			stats.averages.dineout = dineoutsTotal / weeks;
		}
		this.renderWithTemplate(stats);
	}
});
