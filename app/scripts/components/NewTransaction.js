import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Input from './Input';
import InputTypeahead from './InputTypeahead';
import config from 'config';
import { reduxForm } from 'redux-form';
import { saveTransaction } from '../actions';

function NewTransaction (props) {
	const statuses = [{
		slug: 'POSTED',
		value: 'POSTED'
	}];

	const {fields: {amount, merchant, date, time, category, source, description, status, _id}, handleSubmit, submitting} = props;
	const submitText = props.editing ? 'Update' : 'Add';
	const submittingText = props.editing ? 'Updating...' : 'Adding...';

	return (
		<form className="new-transaction" onSubmit={handleSubmit}>
			<h2>Add a new transaction</h2>
			<Input label="Amount" type="number" min="0" step="any" {...amount} />
			<InputTypeahead source={props.merchants} label="Merchant" {...merchant} />
			<Input label="Date" type="date" {...date} />
			<Input label="Time" type="time" {...time} />
			<Input label="Category" type="select" options={config.categories} placeholder="Select a category" {...category} />
			<Input label="Source" type="select" options={config.sources} placeholder="Select a source" {...source} />
			<Input label="Description" type="textarea" {...description} />
			<Input label="Status" type="select" options={statuses} {...status} />
			<input type="hidden" {..._id}/>
			<Button bsStyle="primary" className="pull-right" type="submit" disabled={submitting}>{submitting ? submittingText : submitText}</Button>
		</form>
	);
}

NewTransaction.propTypes = {
	editing: PropTypes.bool.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	fields: PropTypes.object.isRequired,
	submitting: PropTypes.bool.isRequired
};

function validate (values) {
	let errors = {};
	const requireds = ['amount', 'merchant', 'date', 'time', 'category', 'source', 'status'];
	requireds.forEach(function (required) {
		if (!values[required]) {
			errors[required] = 'This field is required.';
		}
	});
	return errors;
}

function mapStateToProps (state) {
	let merchants = [];
	if (state.account.merchants_count) {
		merchants = Object.keys(state.account.merchants_count).reduce(function (merchants, merchant) {
			return merchants.concat(state.account.merchants_count[merchant].values);
		}, []);
	}
	return {
		initialValues: state.transaction,
		editing: !!state.transaction._id,
		merchants: merchants
	};
}

export default reduxForm({
	form: 'editTransaction',
	fields: ['amount', 'merchant', 'date', 'time', 'category', 'source', 'description', 'status', '_id'],
	validate
}, mapStateToProps, {
	onSubmit: saveTransaction
})(NewTransaction);
