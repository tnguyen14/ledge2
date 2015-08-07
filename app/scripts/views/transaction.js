'use strict';

var View = require('ampersand-view');
var template = require('../../templates/transaction.hbs');
var $ = require('jquery');
var alert = require('../util/alert');

module.exports = View.extend({
	template: template,
	events: {
		'click .action .edit': 'edit',
		'click .action .remove': 'removePrompt',
		'click': 'toggle'
	},
	bindings: {
		'model.active': {
			type: 'booleanClass',
			name: 'active'
		}
	},
	edit: function () {
		this.collection.trigger('edit', this.model);
	},
	removePrompt: function () {
		var self = this;
		$('.remove-transaction-modal').modal();
		$('.confirm-delete').on('click', function () {
			self.model.destroy({
				success: function () {
					$('.remove-transaction-modal').modal('hide');
				},
				error: function (model, response) {
					var message;
					$('.remove-transaction-modal').modal('hide');
					try {
						message = JSON.parse(response.body).message;
					} catch (e) {
						message = response.body;
					}
					alert({
						type: 'error',
						heading: 'Error removing transaction',
						message: message,
						dismissable: true
					});

				}
			}, {wait: true});
		});
	},
	toggle: function () {
		this.model.active = !this.model.active;
	}
});
