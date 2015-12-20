'use strict';

// var Handlebars = require('hbsfy/runtime');
var moment = require('moment-timezone');
var config = require('config');

// Handlebars.registerHelper('log', function (stuff) {
// 	console.log(stuff);
// });

function date (format, date) {
	return moment(date).format(format);
}

// Handlebars.registerHelper('date', date);

var retrieveFromArray = function (array, value) {
	var results = array.filter(function (element) {
		return element.slug === value;
	});
	if (results.length > 0) {
		return results[0].value;
	}
};

function getCategory (cat) {
	return retrieveFromArray(config.categories, cat);
};

// Handlebars.registerHelper('getCategory', getCategory);

function getSource (source) {
	return retrieveFromArray(config.sources, source);
};

// Handlebars.registerHelper('getSource', getSource);
// simple money formatter
function money (amount) {
	if (!amount) {
		return Handlebars.SafeString('$0.00');
	} else {
		return '$' + (amount / 100).toFixed(2);
	}
};

// Handlebars.registerHelper('money', money);

module.exports.date = date;
module.exports.money = money;
module.exports.getCategory = getCategory;
module.exports.getSource = getSource;
