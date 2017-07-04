import React from 'react';

const inputTypes = ['text', 'date', 'time', 'number'];
function Field(props) {
	const {type, label, name, attributes, value, options} = props;
	let inputEl;
	if (inputTypes.includes(type)) {
		inputEl = (
			<input className="form-control" type={type} name={name}
				value={value} {...attributes}
				/>
		);
		// @TODO add datalist
	} else if (type === 'select') {
		inputEl = (
			<select className="form-control" name={name}>
				<option value="">
					{/*handle default */}
				</option>
				{options.map((option) => {
					// @TODO handle selected
					return (
						<option key={option.slug} value={option.slug}>{value}</option>
					);
				})}
			</select>
		);
	}
	// @TODO textarea
	return (
		<div className="form-group">
			<label className="control-label">{label}</label>
			<div className="input-container">
				{inputEl}
			</div>
		</div>
	);
}

export default Field;
