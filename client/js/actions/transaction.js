// @ts-check

import { getJson, postJson, patchJson, deleteJson } from '../util/fetch';
import {
  getUniqueTransactionId,
  decorateTransaction
} from '../util/transaction';
import {
  addMerchantToCounts,
  removeMerchantFromCounts
} from '../util/merchants';
import { updateMerchantCounts } from './account';
import qs from 'qs';

export const ADD_TRANSACTION_SUCCESS = 'ADD_TRANSACTION_SUCCESS';
export const UPDATE_TRANSACTION_SUCCESS = 'UPDATE_TRANSACTION_SUCCESS';
export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

async function getTransactionsWithMerchantName(idToken, merchant) {
  return await getJson(
    idToken,
    `${window.SERVER_URL}/items?${qs.stringify({
      where: [
        {
          field: 'merchant',
          op: '==',
          value: merchant
        }
      ]
    })}`
  );
}

export function addTransaction(transaction) {
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();

    const decoratedTransaction = decorateTransaction(transaction);
    const id = await getUniqueTransactionId(idToken, decoratedTransaction.date);
    // TODO handle error
    await postJson(idToken, `${window.SERVER_URL}/items`, {
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
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();

    // TODO handle error
    await patchJson(
      idToken,
      `${window.SERVER_URL}/items/${transaction.id}`,
      decorateTransaction(transaction)
    );
    dispatch({
      type: UPDATE_TRANSACTION_SUCCESS,
      data: transaction
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
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();

    await deleteJson(idToken, `${window.SERVER_URL}/items/${transaction.id}`);
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
