'use strict';

var AppView = require('./views/app');
var TransactionsView = require('./views/transactions');
var Account = require('./models/account');

var App = {
	launch: function () {
		var account = new Account({
			name: 'daily'
		});

		window.account = account;
		var view = new AppView().render();
		var transactions = new TransactionsView({
			el: document.querySelector('.transactions'),
			collection: account.transactions
		}).render();
	}
};

module.exports = App;

App.launch();