'use strict';

var AppView = require('./views/app');
var NewTransactionView = require('./views/newTransaction');
var TransactionsView = require('./views/transactions');
var AccountModel = require('./models/account');

require('./util/handlebars');

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

		account.fetch({
			success: function (model, response, options) {
				transactions.render();
			}
		});
	}
};

module.exports = App;

App.launch();
