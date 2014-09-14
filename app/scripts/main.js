'use strict';

var AppView = require('./views/app');
var WeekView = require('./views/week');
var Account = require('./models/account');

var App = {
	launch: function () {
		var account = new Account({
			name: 'daily'
		});

		window.account = account;
		var view = new AppView().render();
		var week = new WeekView().render();
		$('.transactions').append(week.el);
	}
};

module.exports = App;

App.launch();