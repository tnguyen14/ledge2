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
  getTransactionsWithMerchantName,
  postTransaction,
  patchTransaction,
  deleteTransaction
} from '../util/api.js';

export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

export function addTransaction(transaction) {
  return async function addTransactionAsync(dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();

    const decoratedTransaction = decorateTransaction(transaction);
    const id = await getUniqueTransactionId(
      idToken,
      new Date(decoratedTransaction.date).valueOf()
    );
    // TODO handle error
    await postTransaction(idToken, {
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
      user: { idToken },
      account: { merchants_count }
    } = getState();

    const decoratedTransaction = decorateTransaction(transaction);
    const id = transaction.id;

    // TODO handle error
    await patchTransaction(idToken, {
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
        idToken,
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
      user: { idToken },
      account: { merchants_count }
    } = getState();

    await deleteTransaction(idToken, transaction.id);
    dispatch({
      type: REMOVE_TRANSACTION_SUCCESS,
      data: transaction.id
    });
    const transactionsWithMerchantName = await getTransactionsWithMerchantName(
      idToken,
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
