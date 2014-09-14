'use strict';

var AppView = require('./views/app');
var WeekView = require('./views/week');

var App = {
	launch: function () {
		var view = new AppView().render();
		var week = new WeekView().render();
		$('.transactions').append(week.el);
	}
};

module.exports = App;

App.launch();