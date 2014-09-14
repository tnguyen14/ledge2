'use strict';

var AppView = require('./views/app');

var App = {
	launch: function () {
		var view = new AppView().render();
	}
};

App.launch();