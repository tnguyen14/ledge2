'use strict';

var View = require('ampersand-view');
var template = require('templates/week');

var Week = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate({
			transactions: [{
				merchant: 'One',
				amount: 50.34,
				category: 'yep',
				day: 'Monday'
			}, {
				merchant: 'Two',
				amount: 40.34,
				category: 'nope',
				day: 'Wednesday'
			}]
		});
		return this;
	}
});

module.exports = Week;