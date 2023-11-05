import {
  getUniqueTransactionId,
  decorateTransaction
} from '../util/transaction.js';
import {
  addMerchantToCounts,
  removeMerchantFromCounts
} from '../util/merchants.js';
import { updateMerchantCounts } from './meta.js';
import {
  getTransactions,
  getTransactionsWithMerchantName,
  postTransaction,
  patchTransaction,
  deleteTransaction
} from '../util/api.js';
import {
  loadTransactionsSuccess,
  addTransactionSuccess,
  updateTransactionSuccess,
  removeTransactionSuccess
} from '../slices/transactions.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export function loadTransactions(startDate, endDate) {
  return async function loadTransactionsAsync(dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    dispatch(
      loadTransactionsSuccess({
        start: startDate,
        end: endDate,
        transactions: await getTransactions(startDate, endDate)
      })
    );
  };
}

export const ADD_TRANSACTION_FAILURE = 'ADD_TRANSACTION_FAILURE';
export const UPDATE_TRANSACTION_FAILURE = 'UPDATE_TRANSACTION_FAILURE';

export function addTransaction(transaction) {
  return async function addTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    try {
      const decoratedTransaction = decorateTransaction(transaction);
      const id = await getUniqueTransactionId(
        new Date(decoratedTransaction.date).valueOf()
      );
      await postTransaction({
        ...decoratedTransaction,
        id
      });
      dispatch(
        addTransactionSuccess({
          ...decoratedTransaction,
          id
        })
      );
      dispatch(
        updateMerchantCounts(
          addMerchantToCounts(merchants_count, transaction.merchant)
        )
      );
    } catch (e) {
      console.error(e);
      dispatch({
        type: ADD_TRANSACTION_FAILURE
      });
    }
  };
}

export function updateTransaction(transaction, oldMerchant) {
  return async function updateTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    try {
      const decoratedTransaction = decorateTransaction(transaction);
      const id = transaction.id;

      await patchTransaction({
        ...decoratedTransaction,
        id
      });
      dispatch(
        updateTransactionSuccess({
          ...decoratedTransaction,
          id
        })
      );
      if (transaction.merchant != oldMerchant) {
        const transactionsWithOldMerchantName =
          await getTransactionsWithMerchantName(oldMerchant);
        const updatedMerchantsCount = addMerchantToCounts(
          removeMerchantFromCounts(
            merchants_count,
            oldMerchant,
            transactionsWithOldMerchantName.length
          ),
          transaction.merchant
        );
        dispatch(updateMerchantCounts(updatedMerchantsCount));
      }
    } catch (e) {
      console.error(e);
      dispatch({
        type: UPDATE_TRANSACTION_FAILURE
      });
    }
  };
}

export const REMOVING_TRANSACTION = 'REMOVING_TRANSACTION';
export function removeTransaction(transaction) {
  return async function removeTransactionAsync(dispatch, getState) {
    const {
      meta: { merchants_count }
    } = getState();

    dispatch({
      type: REMOVING_TRANSACTION
    });
    await deleteTransaction(transaction.id);
    dispatch(removeTransactionSuccess(transaction.id));
    const transactionsWithMerchantName = await getTransactionsWithMerchantName(
      transaction.merchant
    );
    const updatedMerchantsCount = removeMerchantFromCounts(
      merchants_count,
      transaction.merchant,
      transactionsWithMerchantName.length
    );
    dispatch(updateMerchantCounts(updatedMerchantsCount));
  };
}
