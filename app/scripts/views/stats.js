'use strict';

var View = require('ampersand-view');
var template = require('../../templates/stats.hbs');

module.exports = View.extend({
	template: template,
	render: function () {
		var stats = this.model.getStats();
		this.renderWithTemplate(stats);
	}
});
