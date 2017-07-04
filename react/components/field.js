import React from 'react';
import PropTypes from 'prop-types';

const inputTypes = ['text', 'date', 'time', 'number', 'hidden'];
function Field(props) {
	const {
		type,
		label,
		name,
		attributes,
		value,
		options,
		datalist,
		placeholder
	} = props;
	let inputEl;
	let dataListEl;
	if (inputTypes.includes(type)) {
		inputEl = (
			<input
				className="form-control"
				type={type}
				name={name}
				value={value}
				{...attributes}
			/>
		);
	} else if (type === 'select') {
		inputEl = (
			<select className="form-control" name={name} value={value}>
				<option value="">
					{placeholder || `Select ${label}`}
				</option>
				{options.map(option => {
					const optionProps = {
						key: option.slug,
						value: option.slug
					};
					return (
						<option {...optionProps}>
							{option.value}
						</option>
					);
				})}
			</select>
		);
	} else if (type === 'textarea') {
		inputEl = <textarea className="form-control" name={name} />;
	}
	// no wrapper for hidden element
	if (type === 'hidden') {
		return inputEl;
	}
	return (
		<div className="form-group">
			<label className="control-label">
				{label}
			</label>
			<div className="input-container">
				{inputEl}
				{dataListEl}
			</div>
		</div>
	);
}

Field.propTypes = {
	type: PropTypes.string.isRequired,
	label: PropTypes.string,
	name: PropTypes.string,
	attributes: PropTypes.object,
	value: PropTypes.string,
	options: PropTypes.array,
	datalist: PropTypes.object,
	placeholder: PropTypes.string
};

export default Field;
