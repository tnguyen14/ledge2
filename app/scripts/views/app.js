'use strict';

var View = require('ampersand-view');
var template = require('templates/app');

var AppView = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		document.body.appendChild(this.el);
		return this;
	}
});

module.exports = AppView;