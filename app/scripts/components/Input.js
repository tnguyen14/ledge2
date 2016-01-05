import React from 'react';

export default function Input (props) {
	return (
		<div className="form-group">
			<label className="control-label">{props.label}</label>
			<div className="input-container">
				<input className="form-control" type={props.type} />
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
