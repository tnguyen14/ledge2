'use strict';

var View = require('ampersand-view');

var AppView = View.extend({
	render: function () {
		this.renderWithTemplate();
		document.body.append(this.el);
	}
});