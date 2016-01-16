import React from 'react';
import classNames from 'classnames';

export default function Input (props) {
	let input, help;

	let formGroupClass = classNames({
		'form-group': true,
		'has-success': props.touched && !props.pristine && !props.error,
		'has-error': props.touched && props.error
	});
	switch (props.type) {
		case 'select':
			input = (
				<select className="form-control" {...props}>
					<option value="">{props.placeholder || 'Select ' + props.label}</option>
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
	if (props.touched && props.error) {
		help = (
			<p className="help-block">{props.error}</p>
		);
	} else if (props.help) {
		help = (
			<p className="help-block">{props.help}</p>
		);
	}
	return (
		<div className={formGroupClass}>
			<label className="control-label">{props.label}</label>
			<div className="input-container">
				{input}
				{help}
			</div>
		</div>
	);
}
Input.defaultProps = {
	type: 'text'
};
