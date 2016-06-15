import formTemplate from '../templates/form.hbs';
import config from 'config';
import moment from 'moment-timezone';

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
	}],
	values: {
		date: moment().format('YYYY-MM-DD'),
		time: moment().format('HH:mm'),
		category: config.categories[0].slug,
		source: config.sources[0].slug,
		status: 'POSTED'
	}
};

let rootEl;

export function render () {
	if (!rootEl) {
		rootEl = document.createElement('form');
		rootEl.className = 'new-transaction';
	}
	rootEl.innerHTML = formTemplate(context);
	return rootEl;
}
