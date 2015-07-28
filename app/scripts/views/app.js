'use strict';

var template = require('../../templates/app.hbs');
var View = require('ampersand-view');

var AppView = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate(this.model);
		document.body.appendChild(this.el);
		return this;
	}
});

module.exports = AppView;
