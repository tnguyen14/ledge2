import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Field from '../components/field';
import { submitForm, inputChange, resetForm } from '../actions/form';
import { loadAccount } from '../actions/account';

class Form extends Component {
	componentWillMount() {
		this.props.loadAccount();
	}

	componentDidUpdate() {
		if (this.props.focus) {
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
			values,
			action,
			merchants,
			submitForm,
			pending,
			resetForm
		} = this.props;
		const buttonAttrs = {
			disabled: Boolean(pending)
		};
		return (
			<form className="new-transaction" method="POST">
				<h2>Add a new transaction</h2>
				{fields.map(field => {
					const props = Object.assign({}, field, {
						value: values[field.name],
						handleChange: this.handleInputChange(field.name)
					});
					return (
						<Field
							inputRef={input => {
								this[field.name] = input;
							}}
							key={field.name}
							{...props}
						/>
					);
				})}
				<datalist id="merchants-list">
					{merchants.map(merchant => {
						return (
							<option key={merchant}>
								{merchant}
							</option>
						);
					})}
				</datalist>
				<button
					type="submit"
					className="btn btn-primary pull-right submit"
					onClick={submitForm}
					{...buttonAttrs}
				>
					{action}
				</button>
				<button
					type="button"
					className="btn btn-default pull-right reset"
					onClick={resetForm}
					{...buttonAttrs}
				>
					Reset
				</button>
			</form>
		);
	}
}

Form.propTypes = {
	fields: PropTypes.array.isRequired,
	values: PropTypes.object.isRequired,
	action: PropTypes.string.isRequired,
	focus: PropTypes.bool,
	submitForm: PropTypes.func,
	merchants: PropTypes.array,
	loadAccount: PropTypes.func,
	inputChange: PropTypes.func,
	resetForm: PropTypes.func
};

function mapStateToProps(state) {
	return {
		...state.form,
		merchants: state.account.merchants
	};
}

export default connect(mapStateToProps, {
	submitForm,
	loadAccount,
	inputChange,
	resetForm
})(Form);
