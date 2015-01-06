'use strict';

var View = require('ampersand-view');
var SubCollection = require('ampersand-subcollection');
var template = require('templates/week');
var moment = require('moment-timezone');

require('../../../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal');

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
	initialize: function (options) {
		if (!options.transactions) {
			return;
		}
		this.transactions = options.transactions;
		var self = this;
		this.collection = new SubCollection(this.transactions, {
			filter: function (model) {
				return model.date >= self.weekStart.toISOString() && model.date <= self.weekEnd.toISOString();
			},
			comparator: function (model) {
				return model.date;
			}
		});
	},
	events: {
		'click .action .edit': 'editTransaction',
		'click .action .remove': 'removePrompt'
	},
	template: template,
	render: function () {
		this.renderWithTemplate(this);
		return this;
	},
	editTransaction: function (e) {
		var id = $(e.target).closest('tr').data('transactionId');
		var transaction = this.collection.find({'_id': id});

		if (!transaction) {return;}

		this.parent.trigger('edit', transaction);
	},
	removePrompt: function (e) {
		var self = this;
		var id = $(e.target).closest('tr').data('transactionId');
		var transaction = this.collection.find({'_id': id});
		$('.remove-transaction-modal').modal();
		$('.confirm-delete').on('click', function () {
			if (!transaction) {return;}
			transaction.destroy({
				success: function () {
					$('.remove-transaction-modal').modal('hide');
				}
			});
		})
	}
});

module.exports = Week;
