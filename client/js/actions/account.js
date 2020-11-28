import { getJson, deleteJson, patchJson } from '../util/fetch';
import { LOGOUT } from './user';
import { removeMerchantFromCounts } from '../util/merchants';
import qs from 'qs';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    try {
      const account = await getJson(idToken, `${SERVER_URL}/meta`);
      dispatch({
        type: LOAD_ACCOUNT_SUCCESS,
        data: account
      });
    } catch (err) {
      if (err.message == 'Unauthorized') {
        dispatch({
          type: LOGOUT
        });
        return;
      }
      throw err;
    }
  };
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';

export function editTransaction(transactionId) {
  return function (dispatch, getState) {
    // editTransaction is an action-creator creator
    return function (e) {
      const { weeks } = getState();
      let transaction;
      // iterate over each week to find the transaction
      // if it's already found, move on (short-circuiting by using
      // Array.prototype.some)
      Object.keys(weeks).some((offset) => {
        if (transaction) {
          return true;
        }
        weeks[offset].transactions.some((tx) => {
          if (tx.id === transactionId) {
            transaction = tx;
            return true;
          }
        });
      });
      dispatch({
        type: EDIT_TRANSACTION,
        data: transaction
      });
      // avoid toggling the transaction as active
      e.stopPropagation();
    };
  };
}

export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';

export const REMOVE_TRANSACTION_SUCCESS = 'REMOVE_TRANSACTION_SUCCESS';

export function removeTransaction(transaction) {
  return function (dispatch) {
    // removeTransaction is an action-creator creator
    return function () {
      dispatch({
        type: REMOVE_TRANSACTION,
        data: transaction
      });
    };
  };
}

export function confirmedRemoveTransaction(transaction) {
  return function (dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();
    return async function (e) {
      try {
        await deleteJson(idToken, `${SERVER_URL}/items/${transaction.id}`);
        const transactionsWithMerchantName = await getJson(
          idToken,
          `${SERVER_URL}/items?${qs.stringify({
            where: [
              {
                field: 'merchant',
                op: '==',
                value: transaction.merchant
              }
            ]
          })}`
        );
        const updatedMerchantsCount = removeMerchantFromCounts(
          transaction.merchant,
          merchants_count,
          transactionsWithMerchantName.length
        );
        await patchJson(idToken, `${SERVER_URL}/meta`, {
          merchants_count: updatedMerchantsCount
        });
        dispatch({
          type: REMOVE_TRANSACTION_SUCCESS,
          data: transaction.id
        });
      } catch (err) {
        if (err.message == 'Unauthorized') {
          dispatch({
            type: LOGOUT
          });
          return;
        }
        throw err;
      }
    };
  };
}

export const CANCEL_REMOVE_TRANSACTION = 'CANCEL_REMOVE_TRANSACTION';

export function cancelRemoveTransaction() {
  return {
    type: CANCEL_REMOVE_TRANSACTION
  };
}
