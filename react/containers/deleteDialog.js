import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	confirmRemoveTransaction,
	cancelRemoveTransaction
} from '../actions/transactions';

function DeleteDialog(props) {
	const {
		isRemovingTransaction,
		transactionToBeRemoved,
		confirmRemoveTransaction,
		cancelRemoveTransaction
	} = props;
	return (
		<Modal
			isOpen={isRemovingTransaction}
			onRequestClose={cancelRemoveTransaction}
			contentLabel="Delete Transaction"
			className="modal-content delete-dialog"
		>
			<div className="modal-header">
				<button
					type="button"
					className="close cancel"
					aria-label="Close"
					onClick={cancelRemoveTransaction}
				>
					<span aria-hidden="true">&times;</span>
				</button>
				<h4 className="modal-title">Delete Transaction</h4>
			</div>
			<div className="modal-body">
				<p>Are you sure you want to delete this transaction?</p>
			</div>
			<div className="modal-footer">
				<button
					type="button"
					className="btn btn-default cancel"
					onClick={cancelRemoveTransaction}
				>
					Cancel
				</button>
				<button
					type="button"
					className="btn btn-danger confirm"
					onClick={confirmRemoveTransaction(transactionToBeRemoved)}
				>
					Delete
				</button>
			</div>
		</Modal>
	);
}

DeleteDialog.propTypes = {
	isRemovingTransaction: PropTypes.bool.isRequired,
	transactionToBeRemoved: PropTypes.string,
	confirmRemoveTransaction: PropTypes.func.isRequired,
	cancelRemoveTransaction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return {
		isRemovingTransaction: state.account.isRemovingTransaction,
		transactionToBeRemoved: state.account.transactionToBeRemoved
	};
}

export default connect(mapStateToProps, {
	confirmRemoveTransaction,
	cancelRemoveTransaction
})(DeleteDialog);
