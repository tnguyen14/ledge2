'use strict';

var Handlebars = require('handlebars');
var moment = require('moment-timezone');

Handlebars.registerHelper('log', function (stuff) {
	console.log(stuff);
});

Handlebars.registerHelper('date', function (format, date) {
	return moment(date).format(format);
});