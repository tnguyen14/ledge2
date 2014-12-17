'use strict';

var View = require('ampersand-view');
var template = require('templates/week');
var moment = require('moment-timezone');

var Week = View.extend({
	props: {
		offset: ['number', true, 0]
	},
	derived: {
		weekStart: {
			deps: ['offset'],
			fn: function () {
				return moment().day(1 + this.offset * 7).startOf('isoWeek');
			}
		},
		weekEnd: {
			deps: ['offset'],
			fn: function () {
				return moment().day(7 + this.offset * 7).endOf('isoWeek');
			}
		}
	},
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		return this;
	}
});

module.exports = Week;
