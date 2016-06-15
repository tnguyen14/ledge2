import formTemplate from '../templates/form.hbs';
import config from 'config';

const context = {
	inputElTypes: ['text', 'date', 'time', 'number'],
	fields: [{
		type: 'date',
		label: 'Date',
		name: 'date'
	}, {
		type: 'time',
		label: 'Time',
		name: 'time'
	}, {
		type: 'select',
		label: 'Category',
		name: 'category',
		placeholder: 'Select a category',
		options: config.categories
	}, {
		type: 'select',
		label: 'Source',
		name: 'source',
		options: config.sources
	}, {
		type: 'textarea',
		name: 'description',
		label: 'Description'
	}, {
		type: 'select',
		label: 'Status',
		name: 'status',
		options: [{
			slug: 'POSTED',
			value: 'POSTED'
		}]
	}]
};

let rootEl;

export function render (root) {
	if (!rootEl) {
		rootEl = document.querySelector(root);
		if (!rootEl) {
			throw new Error('Cannot find root element');
		}
	}
	rootEl.innerHTML = formTemplate(context);
}
