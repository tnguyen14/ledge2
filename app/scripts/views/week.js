'use strict';

var View = require('ampersand-view');
var template = require('templates/week');

var Week = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate(this.collection);
		return this;
	}
});

module.exports = Week;