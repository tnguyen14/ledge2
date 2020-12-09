import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CANCEL_REMOVE_TRANSACTION } from '../actions/account';
import { removeTransaction } from '../actions/transaction';

function cancelRemoveTransaction() {
  return {
    type: CANCEL_REMOVE_TRANSACTION
  };
}

function DeleteDialog(props) {
  const {
    isRemovingTransaction,
    transactionToBeRemoved,
    cancelRemoveTransaction,
    removeTransaction
  } = props;

  return (
    <Modal
      show={isRemovingTransaction}
      onHide={cancelRemoveTransaction}
      className="delete-dialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelRemoveTransaction}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={removeTransaction(transactionToBeRemoved)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DeleteDialog.propTypes = {
  isRemovingTransaction: PropTypes.bool.isRequired,
  transactionToBeRemoved: PropTypes.object,
  cancelRemoveTransaction: PropTypes.func.isRequired,
  removeTransaction: PropTypes.func
};

function mapStateToProps(state) {
  return {
    isRemovingTransaction: state.account.isRemovingTransaction,
    transactionToBeRemoved: state.account.transactionToBeRemoved
  };
}

export default connect(mapStateToProps, {
  cancelRemoveTransaction,
  removeTransaction
})(DeleteDialog);
