'use strict';

var Handlebars = require('handlebars');
var moment = require('moment-timezone');
var config = require('config');
var filter = require('amp-filter');

Handlebars.registerHelper('log', function (stuff) {
	console.log(stuff);
});

Handlebars.registerHelper('date', function (format, date) {
	return moment(date).format(format);
});

Handlebars.registerHelper('getCategory', function (cat) {
	var results = filter(config.categories, function (c) {
		return c.slug === cat;
	});
	if (results.length > 0) {
		return results[0].value;
	}
});
