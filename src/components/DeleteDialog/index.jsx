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
import CompactTransaction from '../Transactions/CompactTransaction.js';
import { cancelRemoveTransaction } from '../../actions/app.js';
import { removeTransaction } from '../../actions/transactions.js';

function DeleteDialog() {
  const {
    transactionRemovalIntended,
    waitingTransactionRemoval,
    transactionToBeRemoved
  } = useSelector((state) => state.app);
  const dispatch = useDispatch();

  return (
    <Dialog
      open={transactionRemovalIntended}
      onClose={() => dispatch(cancelRemoveTransaction())}
    >
      <DialogTitle>Delete Transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h4>Are you sure you want to delete this transaction?</h4>
          <p>
            <CompactTransaction transaction={transactionToBeRemoved} />
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={waitingTransactionRemoval}
          variant="secondary"
          onClick={() => dispatch(cancelRemoveTransaction())}
        >
          Cancel
        </Button>
        <Button
          disabled={waitingTransactionRemoval}
          variant="danger"
          onClick={() => dispatch(removeTransaction(transactionToBeRemoved))}
        >
          {waitingTransactionRemoval ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
