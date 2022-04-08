import {
  getUniqueTransactionId,
  decorateTransaction
} from '../util/transaction.js';
import {
  addMerchantToCounts,
  removeMerchantFromCounts
} from '../util/merchants.js';
import { updateMerchantCounts } from './account.js';
import {
  getTransactions,
  getTransactionsWithMerchantName,
  postTransaction,
  patchTransaction,
  deleteTransaction
} from '../util/api.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions(startDate, endDate) {
  return async function loadTransactionsAsync(dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    dispatch({
      type: LOAD_TRANSACTIONS_SUCCESS,
      data: {
        start: startDate,
        end: endDate,
        transactions: await getTransactions(startDate, endDate)
      }
    });
  };
}

export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

export function addTransaction(transaction) {
  return async function addTransactionAsync(dispatch, getState) {
    const {
      account: { merchants_count }
    } = getState();

    const decoratedTransaction = decorateTransaction(transaction);
    const id = await getUniqueTransactionId(
      new Date(decoratedTransaction.date).valueOf()
    );
    // TODO handle error
    await postTransaction({
      ...decoratedTransaction,
      id
    });
    dispatch({
      type: ADD_TRANSACTION_SUCCESS,
      data: {
        ...decoratedTransaction,
        id
      }
    });
    dispatch(
      updateMerchantCounts(
        addMerchantToCounts(transaction.merchant, merchants_count)
      )
    );
  };
}

export function updateTransaction(transaction, oldMerchant) {
  return async function updateTransactionAsync(dispatch, getState) {
    const {
      account: { merchants_count }
    } = getState();

    const decoratedTransaction = decorateTransaction(transaction);
    const id = transaction.id;

    // TODO handle error
    await patchTransaction({
      ...decoratedTransaction,
      id
    });
    dispatch({
      type: UPDATE_TRANSACTION_SUCCESS,
      data: {
        ...decoratedTransaction,
        id
      }
    });
    if (transaction.merchant != oldMerchant) {
      const transactionsWithOldMerchantName = await getTransactionsWithMerchantName(
        oldMerchant
      );
      const updatedMerchantsCount = addMerchantToCounts(
        transaction.merchant,
        removeMerchantFromCounts(
          oldMerchant,
          merchants_count,
          transactionsWithOldMerchantName.length
        )
      );
      dispatch(updateMerchantCounts(updatedMerchantsCount));
    }
  };
}

export function removeTransaction(transaction) {
  return async function removeTransactionAsync(dispatch, getState) {
    const {
      account: { merchants_count }
    } = getState();

    await deleteTransaction(transaction.id);
    dispatch({
      type: REMOVE_TRANSACTION_SUCCESS,
      data: transaction.id
    });
    const transactionsWithMerchantName = await getTransactionsWithMerchantName(
      transaction.merchant
    );
    const updatedMerchantsCount = removeMerchantFromCounts(
      transaction.merchant,
      merchants_count,
      transactionsWithMerchantName.length
    );
    dispatch(updateMerchantCounts(updatedMerchantsCount));
  };
}
