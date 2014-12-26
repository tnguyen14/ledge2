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

var retrieveFromArray = function (array, value) {
	var results = filter(array, function (element) {
		return element.slug === value;
	});
	if (results.length > 0) {
		return results[0].value;
	}
};

Handlebars.registerHelper('getCategory', function (cat) {
	return retrieveFromArray(config.categories, cat);
});

Handlebars.registerHelper('getSource', function (source) {
	return retrieveFromArray(config.sources, source);
});

// simple money formatter
Handlebars.registerHelper('money', function (amount) {
	if (!amount) {
		return Handlebars.SafeString('$0.00');
	} else {
		return '$' + amount.toFixed(2);
	}
})
