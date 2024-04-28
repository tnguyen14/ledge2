import React, { useCallback } from 'https://esm.sh/react@18.2.0';
import { useDispatch, useSelector } from 'https://esm.sh/react-redux@9';
import Dialog from 'https://esm.sh/@mui/material@5.15.7/Dialog';
import DialogTitle from 'https://esm.sh/@mui/material@5.15.7/DialogTitle';
import DialogContent from 'https://esm.sh/@mui/material@5.15.7/DialogContent';
import DialogContentText from 'https://esm.sh/@mui/material@5.15.7/DialogContentText';
import DialogActions from 'https://esm.sh/@mui/material@5.15.7/DialogActions';
import Button from 'https://esm.sh/react-bootstrap@2/Button';
import CompactTransaction from '../Transactions/CompactTransaction.js';
import { cancelRemoveTransaction } from '../../slices/app.js';
import {
  removingTransaction,
  removeTransactionSuccess,
  removeTransactionFailure
} from '../../slices/transactions.js';
import {
  updateMerchantCounts,
  removeRecurringTransaction
} from '../../slices/meta.js';
import {
  deleteTransaction,
  getTransactionsWithMerchantName
} from '../../util/api.js';
import { removeMerchantFromCounts } from '../../util/merchants.js';

function DeleteDialog() {
  const {
    transactionRemovalIntended,
    waitingTransactionRemoval,
    transactionToBeRemoved
  } = useSelector((state) => state.app);
  const { merchants_count } = useSelector((state) => state.meta);
  const dispatch = useDispatch();

  const removeTransaction = useCallback(async () => {
    dispatch(removingTransaction());
    try {
      if (transactionToBeRemoved.syntheticType == 'recurring') {
        dispatch(removeRecurringTransaction(transactionToBeRemoved.id));
      } else {
        await deleteTransaction(transactionToBeRemoved.id);
        dispatch(removeTransactionSuccess(transactionToBeRemoved.id));
        const transactionsWithMerchantName =
          await getTransactionsWithMerchantName(
            transactionToBeRemoved.merchant
          );
        const updatedMerchantsCount = removeMerchantFromCounts(
          merchants_count,
          transactionToBeRemoved.merchant,
          transactionsWithMerchantName.length
        );
        dispatch(updateMerchantCounts(updatedMerchantsCount));
      }
    } catch (e) {
      console.error(e);
      dispatch(removeTransactionFailure());
    }
  }, [dispatch, merchants_count, transactionToBeRemoved]);

  if (!transactionToBeRemoved) {
    return null;
  }
  return (
    <Dialog
      open={transactionRemovalIntended}
      onClose={() => dispatch(cancelRemoveTransaction())}
    >
      <DialogTitle>Delete Transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <h4>
            Are you sure you want to delete this{' '}
            {transactionToBeRemoved.syntheticType == 'recurring'
              ? 'recurring '
              : ''}
            transaction?
          </h4>
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
          onClick={() => dispatch(removeTransaction)}
        >
          {waitingTransactionRemoval ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
