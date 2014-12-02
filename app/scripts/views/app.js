'use strict';

var template = require('templates/app');
var View = require('ampersand-view');

var AppView = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		document.body.appendChild(this.el);
		return this;
	}
});

module.exports = AppView;