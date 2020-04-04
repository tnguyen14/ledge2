import React from 'react';
import PropTypes from 'prop-types';
import Octicon, { Info } from '@githubprimer/octicons-react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const inputTypes = ['text', 'date', 'time', 'number', 'hidden'];
function Field(props) {
	const {
		type,
		label,
		name,
		hint,
		attributes,
		value,
		options,
		placeholder,
		handleChange,
		datalist,
		inputRef
	} = props;
	let inputEl;
	if (inputTypes.includes(type)) {
		inputEl = (
			<input
				className="form-control"
				type={type}
				name={name}
				value={value}
				onChange={handleChange}
				ref={inputRef}
				placeholder={placeholder}
				{...attributes}
			/>
		);
	} else if (type === 'select') {
		inputEl = (
			<select
				className="form-control"
				name={name}
				value={value}
				onChange={handleChange}
				ref={inputRef}
			>
				<option value="">{placeholder || `Select ${label}`}</option>
				{options.map(option => {
					return (
						<option key={option.slug} value={option.slug}>
							{option.value}
						</option>
					);
				})}
			</select>
		);
	} else if (type === 'textarea') {
		inputEl = (
			<textarea
				className="form-control"
				name={name}
				value={value}
				placeholder={placeholder}
				onChange={handleChange}
				ref={inputRef}
			/>
		);
	}
	// no wrapper for hidden element
	if (type === 'hidden') {
		return inputEl;
	}
	return (
		<div className="form-group" data-form-name={name}>
			<label className="control-label">{label}</label>
			<div className="input-group">
				{hint && (
					<OverlayTrigger
						placement="top"
						overlay={<Tooltip id={`${name}-hint`}>{hint}</Tooltip>}
					>
						<div className="input-group-prepend hint">
							<div className="input-group-text">
								<Octicon icon={Info} />
							</div>
						</div>
					</OverlayTrigger>
				)}
				{inputEl}
				{datalist && (
					<datalist id={attributes.list}>
						{datalist.map(option => (
							<option key={option}>{option}</option>
						))}
					</datalist>
				)}
			</div>
		</div>
	);
}

Field.propTypes = {
	type: PropTypes.string.isRequired,
	label: PropTypes.string,
	name: PropTypes.string,
	hint: PropTypes.string,
	attributes: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	options: PropTypes.array,
	placeholder: PropTypes.string,
	datalist: PropTypes.array,
	handleChange: PropTypes.func.isRequired,
	inputRef: PropTypes.func
};

export default Field;
