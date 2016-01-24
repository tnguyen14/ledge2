import React, { PropTypes } from 'react';
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
			// call the inputCallback, passing ref to it
			// used in typeahead case
			input = <input className="form-control" ref={(ref) => props.inputCallback(ref)} {...props}/>;
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
	type: 'text',
	inputCallback: function () {}
};

Input.propTypes = {
	type: PropTypes.string.isRequired,
	label: PropTypes.string,
	placeholder: PropTypes.string,
	options: PropTypes.array,
	inputCallback: PropTypes.func
};
