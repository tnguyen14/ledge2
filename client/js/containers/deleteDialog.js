import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  confirmedRemoveTransaction,
  cancelRemoveTransaction
} from '../actions/account';

function DeleteDialog(props) {
  const {
    isRemovingTransaction,
    transactionToBeRemoved,
    confirmedRemoveTransaction,
    cancelRemoveTransaction
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
          onClick={confirmedRemoveTransaction(transactionToBeRemoved)}
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
  confirmedRemoveTransaction: PropTypes.func.isRequired,
  cancelRemoveTransaction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    isRemovingTransaction: state.account.isRemovingTransaction,
    transactionToBeRemoved: state.account.transactionToBeRemoved
  };
}

export default connect(mapStateToProps, {
  confirmedRemoveTransaction,
  cancelRemoveTransaction
})(DeleteDialog);
