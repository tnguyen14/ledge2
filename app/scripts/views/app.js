'use strict';

var config = require('config');
var NewTransactionView = require('./newTransaction');
var template = require('templates/app');
var TPromise = require('promise');
var View = require('ampersand-view');

var AppView = View.extend({
	template: template,
	render: function () {
		var model = this.model;
		this.renderWithTemplate();
		document.body.appendChild(this.el);
		this.newTransaction = new NewTransactionView({
			el: this.query('.new-transaction'),
			submitCallback: function (data) {
				return TPromise.resolve($.ajax({
					url: model.url() + '/transactions',
					type: 'POST',
					data: data
				})).then(function (result) {
					// clear the input fields
					this._fieldViewsArray.forEach(function (view) {
						// check on clear, but use setValue to skip validation
						if (view.clear && typeof view.clear === 'function') {
							view.shouldValidate = false;
							view.setValue('', true);
						}
					})
				}.bind(this))
			}
		});
		this.registerSubview(this.newTransaction);
		return this;
	}
});

module.exports = AppView;