import React from 'react';
import Input from './Input';
import config from 'config';
import { reduxForm } from 'redux-form';
import { newTransaction } from '../actions';

function NewTransaction (props) {
	const statuses = [{
		slug: 'POSTED',
		value: 'POSTED'
	}];
	const {fields: {amount, merchant, date, time, category, source, description, status}, handleSubmit} = props;
	return (
		<form className="new-transaction" onSubmit={handleSubmit}>
			<h2>Add a new transaction</h2>
			<Input label="Amount" type="number" min="0" step="any" {...amount} />
			<Input label="Merchant" {...merchant} />
			<Input label="Date" type="date" {...date} />
			<Input label="Time" type="time" {...time} />
			<Input label="Category" type="select" options={config.categories} placeholder="Select a category" {...category} />
			<Input label="Source" type="select" options={config.sources} placeholder="Select a source" {...source} />
			<Input label="Description" type="textarea" {...description} />
			<Input label="Status" type="select" options={statuses} {...status} />
			<button className="btn btn-primary" type="submit">Add</button>
		</form>
	);
}

export default reduxForm({
	form: 'transaction',
	fields: ['amount', 'merchant', 'date', 'time', 'category', 'source', 'description', 'status']
},
undefined,
{
	onSubmit: newTransaction
})(NewTransaction);
