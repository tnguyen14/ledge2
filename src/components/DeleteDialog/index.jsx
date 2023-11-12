import React from 'https://esm.sh/react@18';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@7';
import Dialog from 'https://esm.sh/@mui/material@5/Dialog';
import DialogTitle from 'https://esm.sh/@mui/material@5/DialogTitle';
import DialogContent from 'https://esm.sh/@mui/material@5/DialogContent';
import DialogContentText from 'https://esm.sh/@mui/material@5/DialogContentText';
import DialogActions from 'https://esm.sh/@mui/material@5/DialogActions';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import CompactTransaction from '../Transactions/CompactTransaction.js';
import { cancelRemoveTransaction } from '../../slices/app.js';
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
