import React from 'https://cdn.skypack.dev/react@16';
import Modal from 'https://cdn.skypack.dev/react-bootstrap@1/Modal.js';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import { CANCEL_REMOVE_TRANSACTION } from '../actions/account.js';
import { removeTransaction } from '../actions/transaction.js';

function DeleteDialog(props) {
  const isRemovingTransaction = useSelector(
    (state) => state.account.isRemovingTransaction
  );
  const transactionToBeRemoved = useSelector(
    (state) => state.account.transactionToBeRemoved
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
