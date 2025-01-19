import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from 'react-bootstrap/Button';
import CompactTransaction from '../Transactions/CompactTransaction.jsx';
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
