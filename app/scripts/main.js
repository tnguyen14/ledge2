'use strict';

var AppView = require('./views/app');
var NewTransactionView = require('./views/newTransaction');
var StatsView = require('./views/stats');
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
		new AppView({
			model: account
		}).render();

		var newTransactionView = new NewTransactionView({
			model: account,
			el: document.querySelector('.new-transaction')
		});

		var statsView = new StatsView({
			model: account,
			el: document.querySelector('.stats')
		});

		var transactionsView = new TransactionsView({
			el: document.querySelector('.transactions'),
			model: account
		});

		transactionsView.on('edit', function (transaction) {
			newTransactionView.editTransaction(transaction);
		});

		account.fetch({
			success: function () {
				transactionsView.render();
				statsView.render();
			}
		});
	}
};

module.exports = App;

App.launch();
