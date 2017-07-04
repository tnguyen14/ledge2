import React from 'react';
import config from 'config';
import moment from 'moment-timezone';
import Field from '../components/field';

const dateFormat = 'YYYY-MM-DD';
const timeFormat = 'HH:mm';
const timezone = 'America/New_York';
const fields = [{
	type: 'number',
	attributes: {
		min: 0,
		step: 'any',
		required: true
	},
	label: 'Amount',
	name: 'amount'
}, {
	type: 'text',
	label: 'Merchant',
	name: 'merchant',
	attributes: {
		required: true,
		list: 'merchant-list'
	},
	datalist: {
		id: 'merchant-list',
		options: []
	}
}, {
	type: 'date',
	label: 'Date',
	name: 'date',
	attributes: {
		required: true
	}
}, {
	type: 'time',
	label: 'Time',
	name: 'time',
	attributes: {
		required: true
	}
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
}];

const values = {
	amount: '',
	merchant: '',
	date: moment.tz(timezone).format(dateFormat),
	time: moment.tz(timezone).format(timeFormat),
	category: config.categories[0].slug,
	source: config.sources[0].slug,
	description: '',
	status: 'POSTED'
};

function renderFields(values) {
	return fields.map((field) => {
		const props = Object.assign({}, field, {
			value: values[field.name]
		});
		return <Field key={field.name} {...props}/>;
	});
}

function renderField(props) {
}
function Form() {
	return (
		<form className="new-transaction" method="POST">
			<h2>Add a new transaction</h2>
			{renderFields(values)}
		</form>
	);
}

export default Form;
