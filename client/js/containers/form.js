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
			action,
			datalists,
			submitForm,
			pending,
			resetForm
		} = this.props;
		const buttonAttrs = {
			disabled: Boolean(pending)
		};
		return (
			<form className="new-transaction" method="POST">
				<ReactHint autoPosition events={{ click: true }} />
				<h2>Add a new transaction</h2>
				{fields.map(field => {
					let datalist;
					if (field.attributes && field.attributes.list) {
						datalist = datalists[field.attributes.list];
					}
					return (
						<Field
							inputRef={input => {
								this[field.name] = input;
							}}
							key={field.name}
							handleChange={this.handleInputChange(field.name)}
							datalist={datalist}
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
		'merchants-list': PropTypes.array,
		'spans-list': PropTypes.array
	}),
	loadAccount: PropTypes.func,
	inputChange: PropTypes.func,
	resetForm: PropTypes.func
};

function mapStateToProps(state) {
	return {
		...state.form,
		datalists: {
			'merchants-list': state.account.merchants,
			'spans-list': [1, 7, 30, 91, 365]
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
