'use strict';

var template = require('../../templates/alert.hbs');
var $ = require('jquery');

/**
 * @param {Object} opts
 * @param {String} opts.type possible values are 'success', 'warning', 'info', 'danger' and 'error'. Defaults to 'info'
 * @param {String} opts.heading short important description, to be displayed in bold
 * @param {String} opts.message alert message
 * @param {Boolean} opts.dismissable whether the alert can be dismissed, defaults to true
 */
module.exports = function (opts) {
	if (!opts.type) {
		opts.type = 'info';
	}
	if (opts.type === 'error') {
		opts.type = 'danger';
	}
	if (opts.dismissable === undefined) {
		opts.dismissable = true;
	}
	var alert = template(opts);
	$('.alert-container').append(alert);
};
