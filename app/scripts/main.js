'use strict';

var AppView = require('./views/app');
var NewTransactionView = require('./views/newTransaction');
var TransactionsView = require('./views/transactions');
var AccountModel = require('./models/account');

require('./util/handlebars');
// define global jQuery for bootstrap
window.jQuery = require('jquery');
require('../../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal');

var App = {
	launch: function () {
		var account = new AccountModel({
			name: 'daily'
		});

		window.account = account;
		var appView = new AppView({
			model: account
		}).render();

		var newTransactionView = new NewTransactionView({
			model: account,
			el: document.querySelector('.new-transaction')
		});

		var transactions = new TransactionsView({
			el: document.querySelector('.transactions'),
			model: account
		});

		transactions.on('edit', function (transaction) {
			newTransactionView.editTransaction(transaction);
		});

		account.fetch({
			success: function (model, response, options) {
				transactions.render();
			}
		});
	}
};

module.exports = App;

App.launch();
