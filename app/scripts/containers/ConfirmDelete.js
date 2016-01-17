import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { cancelDelete, deleteTransaction } from '../actions';

function ConfirmDelete (props) {
	return (
		<Modal show={props.active} bsSize="small" onHide={props.cancelDelete}>
			<Modal.Header>
				<Modal.Title>Are you sure you want to delete this transaction?</Modal.Title>
			</Modal.Header>
			<Modal.Footer>
				<Button onClick={props.cancelDelete}>Go back</Button>
				<Button bsStyle="danger" onClick={props.deleteTransaction.bind(this, props.id)}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);
}

function mapStateToProps (state) {
	return {
		active: state.confirmDelete.active,
		id: state.confirmDelete.id
	};
}

function mapDispatchToProps (dispatch) {
	return bindActionCreators({cancelDelete, deleteTransaction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmDelete);
