import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Field from '../components/field';

function Form(props) {
	const { fields, values, submitText } = props;
	return (
		<form className="new-transaction" method="POST">
			<h2>Add a new transaction</h2>
			{fields.map(field => {
				const props = Object.assign({}, field, {
					value: values[field.name]
				});
				return <Field key={field.name} {...props} />;
			})}
			<button type="submit" className="btn btn-primary pull-right submit">
				{submitText}
			</button>
			<button type="button" className="btn btn-default pull-right reset">
				Reset
			</button>
		</form>
	);
}

Form.propTypes = {
	fields: PropTypes.array.isRequired,
	values: PropTypes.object.isRequired,
	submitText: PropTypes.string.isRequired
};

function mapStateToProps(state) {
	return state.form;
}

export default connect(mapStateToProps)(Form);
