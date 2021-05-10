import React from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import Dialog from 'https://cdn.skypack.dev/@material-ui/core@4/Dialog';
import DialogTitle from 'https://cdn.skypack.dev/@material-ui/core@4/DialogTitle';
import DialogContent from 'https://cdn.skypack.dev/@material-ui/core@4/DialogContent';
import DialogContentText from 'https://cdn.skypack.dev/@material-ui/core@4/DialogContentText';
import DialogActions from 'https://cdn.skypack.dev/@material-ui/core@4/DialogActions';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
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
    <Dialog
      className="delete-dialog"
      open={isRemovingTransaction}
      onClose={cancelRemoveTransaction}
    >
      <DialogTitle>Delete Transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this transaction?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="secondary" onClick={cancelRemoveTransaction}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => dispatch(removeTransaction(transactionToBeRemoved))}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
