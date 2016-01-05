import React from 'react';
import Input from './Input';

export default function NewTransaction (props) {
	return (
		<form className="new-transaction">
			<h2>Add a new transaction</h2>
			<Input label="Amount" type="number" />
			<Input label="Merchant" />
			<Input label="Date" type="date" />
			<button className="btn btn-primary" type="submit">Add</button>
		</form>
	);
}
