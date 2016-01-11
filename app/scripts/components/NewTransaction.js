import React from 'react';
import Input from './Input';
import config from 'config';

export default function NewTransaction (props) {
	const statuses = [{
		slug: 'POSTED',
		value: 'POSTED'
	}];
	return (
		<form className="new-transaction">
			<h2>Add a new transaction</h2>
			<Input label="Amount" type="number" />
			<Input label="Merchant" />
			<Input label="Date" type="date" />
			<Input label="Time" type="time" />
			<Input label="Category" type="select" options={config.categories} placeholder="Select a category" />
			<Input label="Source" type="select" options={config.sources} placeholder="Select a source" />
			<Input label="Description" type="textarea" />
			<Input label="Status" type="select" options={statuses} />
			<button className="btn btn-primary" type="submit">Add</button>
		</form>
	);
}
