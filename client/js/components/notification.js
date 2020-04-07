import React from 'react';
import PropTypes from 'prop-types';
import Toast from 'react-bootstrap/Toast';

function Notification(props) {
	const { content, title } = props;
	let show = content != '';
	return (
		<div aria-live="polite" aria-atomic="true" className="notification">
			<Toast show={show}>
				<Toast.Header>{title}</Toast.Header>
				<Toast.Body>{content}</Toast.Body>
			</Toast>
		</div>
	);
}

Notification.propTypes = {
	title: PropTypes.string,
	content: PropTypes.string
};

Notification.defaultProps = {
	title: '',
	content: ''
};

export default Notification;
