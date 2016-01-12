import React from 'react';

export default function Input (props) {
	let input;
	switch (props.type) {
		case 'select':
			input = (
				<select className="form-control" {...props}>
					<option>{props.placeholder || 'Select ' + props.label}</option>
					{props.options.map(function (opt) {
						return <option key={opt.slug} value={opt.slug}>{opt.value}</option>;
					})}
				</select>
			);
			break;
		case 'textarea':
			input = <textarea className="form-control" {...props}></textarea>;
			break;
		case 'text':
		case 'date':
		case 'time':
		case 'number':
		default:
			input = <input className="form-control" {...props}/>;
			break;
	}
	return (
		<div className="form-group">
			<label className="control-label">{props.label}</label>
			<div className="input-container">
				{input}
				<div className="message message-below message-error">
					<p>{props.error}</p>
				</div>
			</div>
		</div>
	);
}
Input.defaultProps = {
	type: 'text'
};
