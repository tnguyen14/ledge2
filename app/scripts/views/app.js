'use strict';

var View = require('ampersand-view');
var NewTransactionView = require('./newTransaction');
var template = require('templates/app');
var config = require('config');

var AppView = View.extend({
	template: template,
	render: function () {
		var model = this.model;
		this.renderWithTemplate();
		document.body.appendChild(this.el);
		this.newTransaction = new NewTransactionView({
			el: this.query('.new-transaction'),
			submitCallback: function (data) {
				$.ajax(model.url(), {
					type: 'POST',
					data: data
				})
			}
		});
		this.registerSubview(this.newTransaction);
		return this;
	}
});

module.exports = AppView;