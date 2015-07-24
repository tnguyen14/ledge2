'use strict';

var View = require('ampersand-view');
var template = require('templates/transaction');
var $ = require('jquery');

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
				}
			}, {wait: true});
		});
	},
	toggle: function () {
		this.model.active = !this.model.active;
	}
});
