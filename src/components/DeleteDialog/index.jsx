import React from 'https://cdn.skypack.dev/react@17';
import {
  useDispatch,
  useSelector
} from 'https://cdn.skypack.dev/react-redux@7';
import Dialog from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/Dialog';
import DialogTitle from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogTitle';
import DialogContent from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContent';
import DialogContentText from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogContentText';
import DialogActions from 'https://cdn.skypack.dev/@material-ui/core@4.12.0/DialogActions';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import { cancelRemoveTransaction } from '../../actions/app.js';
import { removeTransaction } from '../../actions/transactions.js';

function DeleteDialog(props) {
  const isRemovingTransaction = useSelector(
    (state) => state.app.isRemovingTransaction
  );
  const transactionToBeRemoved = useSelector(
    (state) => state.app.transactionToBeRemoved
  );
  const dispatch = useDispatch();

  return (
    <Dialog
      data-cy="delete-dialog"
      open={isRemovingTransaction}
      onClose={() => dispatch(cancelRemoveTransaction())}
    >
      <DialogTitle>Delete Transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this transaction?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="secondary"
          onClick={() => dispatch(cancelRemoveTransaction())}
        >
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
