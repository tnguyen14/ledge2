import formTemplate from '../templates/form.hbs';
import config from 'config';
import moment from 'moment-timezone';
import {postJson, patchJson} from 'simple-fetch';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const timezone = 'America/New_York';

const context = {
	inputElTypes: ['text', 'date', 'time', 'number'],
	fields: [{
		type: 'number',
		attributes: {
			min: 0,
			step: 'any'
		},
		label: 'Amount',
		name: 'amount'
	}, {
		type: 'text',
		label: 'Merchant',
		name: 'merchant'
	}, {
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
		amount: '',
		merchant: '',
		date: moment.tz(timezone).format(dateFormat),
		time: moment.tz(timezone).format(timeFormat),
		category: config.categories[0].slug,
		source: config.sources[0].slug,
		description: '',
		status: 'POSTED'
	}
};

let rootEl;

function handleSubmit (e) {
	e.preventDefault();
	let entry = {};
	const button = rootEl.querySelector('button');
	/* global FormData */
	let formData = new FormData(rootEl);
	let isUpdating = false;
	for (var [key, value] of formData.entries()) {
		entry[key] = value;
	}
	entry.amount = entry.amount * 100;
	if (entry.id) {
		isUpdating = true;
	}
	const action = isUpdating ? patchJson : postJson;
	const updateText = isUpdating ? 'Updating...' : 'Adding...';
	const url = config.server_url + '/accounts/' + config.account_name + '/transactions' + (isUpdating ? '/' + entry.id : '');

	button.innerHTML = updateText;
	button.setAttribute('disabled', '');
	action(url, entry)
		.then(function (json) {
			button.innerHTML = 'Add';
			button.removeAttribute('disabled');
			resetForm();
		});
}

function resetForm () {
	// reset date and tiem values;
	context.values.date = moment().format('YYYY-MM-DD');
	context.values.time = moment().format('HH:mm');
	Object.keys(context.values).forEach((field) => {
		rootEl.querySelector('[name=' + field + ']').value = context.values[field];
	});
}

export function updateTransaction (tx) {
	const transaction = Object.assign({}, tx);
	const date = moment.tz(transaction.date, timezone);
	transaction.amount = transaction.amount / 100;
	transaction.date = date.format(dateFormat);
	transaction.time = date.format(timeFormat);
	Object.keys(context.values).forEach((field) => {
		if (transaction[field]) {
			rootEl.querySelector('[name=' + field + ']').value = transaction[field];
		}
	});
	rootEl.querySelector('[name=id]').value = transaction.id;
	rootEl.querySelector('button').innerHTML = 'Update';
}

export function render () {
	if (!rootEl) {
		rootEl = document.createElement('form');
		rootEl.className = 'new-transaction';
		rootEl.setAttribute('method', 'POST');
	}
	rootEl.innerHTML = formTemplate(context);
	rootEl.addEventListener('submit', handleSubmit);
	return rootEl;
}
