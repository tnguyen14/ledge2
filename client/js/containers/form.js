import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/lib/Button';
import ReactHintFactory from 'react-hint';
import Field from '../components/field';
import { submitForm, inputChange, resetForm } from '../actions/form';
import { loadAccount } from '../actions/account';

const ReactHint = ReactHintFactory(React);

class Form extends Component {
	componentDidMount() {
		this.props.loadAccount();
	}

	componentDidUpdate(prevProps, prevState) {
		const currentAmount = this.props.fields.find(
			field => field.name === 'amount'
		).value;
		const prevAmount = prevProps.fields.find(
			field => field.name === 'amount'
		).value;
		// only focus if the amount has changed
		// avoid focusing for cases such as when categories are loaded
		if (this.props.focus && currentAmount !== prevAmount) {
			this.amount.focus();
		}
	}

	handleInputChange(fieldName) {
		return event => {
			return this.props.inputChange(fieldName, event.target.value);
		};
	}

	render() {
		const {
			fields,
			action,
			datalists,
			submitForm,
			pending,
			resetForm,
			fieldOptions
		} = this.props;
		const buttonAttrs = {
			disabled: Boolean(pending)
		};
		return (
			<form className="new-transaction" method="POST">
				<ReactHint autoPosition events={{ click: true }} />
				<h2>Add a new transaction</h2>
				{fields.map(field => {
					if (field.attributes && field.attributes.list) {
						field.datalist = datalists[field.attributes.list];
					}
					if (fieldOptions[field.name]) {
						field.options = fieldOptions[field.name];
					}
					return (
						<Field
							inputRef={input => {
								this[field.name] = input;
							}}
							key={field.name}
							handleChange={this.handleInputChange(field.name)}
							{...field}
						/>
					);
				})}
				<Button
					variant="primary"
					className="float-right"
					type="submit"
					onClick={submitForm}
					{...buttonAttrs}
				>
					{action}
				</Button>
				<Button
					variant="outline-secondary"
					className="float-right"
					onClick={resetForm}
					{...buttonAttrs}
				>
					Reset
				</Button>
			</form>
		);
	}
}

Form.propTypes = {
	fields: PropTypes.array.isRequired,
	action: PropTypes.string.isRequired,
	focus: PropTypes.bool,
	pending: PropTypes.bool,
	submitForm: PropTypes.func,
	datalists: PropTypes.shape({
		'merchants-list': PropTypes.array
	}),
	loadAccount: PropTypes.func,
	inputChange: PropTypes.func,
	resetForm: PropTypes.func,
	fieldOptions: PropTypes.shape({
		category: PropTypes.array.isRequired,
		source: PropTypes.array.isRequired
	})
};

function mapStateToProps(state) {
	return {
		...state.form,
		datalists: {
			'merchants-list': state.account.merchants
		},
		fieldOptions: {
			category: state.account.categories,
			source: state.account.sources
		}
	};
}

export default connect(
	mapStateToProps,
	{
		submitForm,
		loadAccount,
		inputChange,
		resetForm
	}
)(Form);
