'use strict';

var AppView = require('./views/app');
var TransactionsView = require('./views/transactions');
var Account = require('./models/account');

require('./util/handlebars');

var App = {
	launch: function () {
		var account = new Account({
			name: 'daily'
		});

		window.account = account;
		var appView = new AppView({
			model: account
		}).render();

		var transactions = new TransactionsView({
			el: document.querySelector('.transactions'),
			collection: account.transactions
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