'use strict';

var AppView = require('./views/app');
var NewTransactionView = require('./views/newTransaction');
var StatsView = require('./views/stats');
var TransactionsView = require('./views/transactions');
var AccountModel = require('./models/account');
var $ = require('jquery');
var Bloodhound = require('bloodhound');

require('./util/handlebars');
require('typeahead');
// define global jQuery for bootstrap
window.jQuery = $;
require('../../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal');
require('../../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/alert');

function merchantTypeahead(merchants) {
	$('input[name="merchant"]').typeahead({
		highlight: true
	}, {
		name: 'merchants',
		source: new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.whitespace,
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			local: merchants
		})
	});
}

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
			autoRender: true,
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
			success: function (model) {
				merchantTypeahead(Object.keys(model.merchants_count).reduce(function (merchants, merchant) {
					return merchants.concat(model.merchants_count[merchant].values);
				}, []));
				transactionsView.render();
				statsView.render();
			}
		});

		appView.listenTo(newTransactionView, 'newtransaction', function (data) {
			account.transactions.create(data, {
				wait: true,
				success: function () {
					newTransactionView.clearFields();
				}
			});
		});
	}
};

module.exports = App;

App.launch();
