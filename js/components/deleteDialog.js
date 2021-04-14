import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { CANCEL_REMOVE_TRANSACTION } from '../actions/account';
import { removeTransaction } from '../actions/transaction';

function DeleteDialog(props) {
  const isRemovingTransaction = useSelector(
    (state) => state.account.isRemovingTransaction
  );
  const transactionToBeRemoved = useSelector(
    (state) => state.account.transactionsToBeRemoved
  );
  const dispatch = useDispatch();

  function cancelRemoveTransaction() {
    dispatch({
      type: CANCEL_REMOVE_TRANSACTION
    });
  }

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
          onClick={() => dispatch(removeTransaction(transactionToBeRemoved))}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteDialog;
