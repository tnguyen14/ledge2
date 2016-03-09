import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { dismissAlert } from '../actions';

function AlertMesage (props) {
	let title = props.title;
	let onDismiss, dismissAfter;
	if (props.autoClose) {
		dismissAfter = props.autoClose;
	}
	if (props.dismissable || props.autoClose) {
		onDismiss = props.dismissAlert;
	}
	if (props.type === 'danger' && !props.title) {
		title = 'An error has occured :(';
	}

	if (props.active) {
		return (
			<Alert bsStyle={props.type} onDismiss={onDismiss} dismissAfter={dismissAfter}>
				<h4>{title}</h4>
				<p>{props.content}</p>
			</Alert>
		);
	}
	return <div></div>;
}

AlertMesage.propTypes = {
	active: PropTypes.bool.isRequired,
	type: PropTypes.string.isRequired,
	dismissable: PropTypes.bool.isRequired,
	autoClose: PropTypes.number,
	title: PropTypes.string,
	content: PropTypes.string
};

AlertMesage.defaultProps = {
	active: false,
	dismissable: true,
	type: 'info'
};

function mapStateToProps (state) {
	return state.alert;
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({dismissAlert}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertMesage);
