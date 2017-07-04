import React from 'react';

const inputTypes = ['text', 'date', 'time', 'number'];
function Field(props) {
	const {type, label, name, attributes, value, options, datalist, placeholder} = props;
	let inputEl;
	let dataListEl;
	if (inputTypes.includes(type)) {
		inputEl = (
			<input className="form-control" type={type} name={name}
				value={value} {...attributes}
				/>
		);
		if (datalist) {
			dataListEl = (
				<datalist id={datalist.id}>
					{datalist.options.map((opt) => {
						return <option key={opt}>{opt}</option>;
					})}
				</datalist>
			);
		}
	} else if (type === 'select') {
		inputEl = (
			<select className="form-control" name={name} value={value}>
				<option value="">
					{(placeholder || `Select ${label}`)}
				</option>
				{options.map((option) => {
					const optionProps = {
						key: option.slug,
						value: option.slug
					};
					return (
						<option {...optionProps}>{option.value}</option>
					);
				})}
			</select>
		);
	} else if (type === 'textarea') {
		inputEl = (
			<textarea className="form-control" name={name}></textarea>
		);
	}
	return (
		<div className="form-group">
			<label className="control-label">{label}</label>
			<div className="input-container">
				{inputEl}
				{dataListEl}
			</div>
		</div>
	);
}

export default Field;
