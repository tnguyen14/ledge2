import { getJson, deleteJson } from '../util/fetch';
import { LOGOUT } from './user';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    try {
      const account = await getJson(idToken, `${SERVER_URL}`);
      dispatch({
        type: LOAD_ACCOUNT_SUCCESS,
        data: account.meta
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

export function removeTransaction(transactionId) {
  return function (dispatch) {
    // removeTransaction is an action-creator creator
    return function () {
      dispatch({
        type: REMOVE_TRANSACTION,
        data: transactionId
      });
    };
  };
}

export function confirmRemoveTransaction(transactionId) {
  return function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    return async function (e) {
      try {
        await deleteJson(
          idToken,
          `${SERVER_URL}/accounts/${ACCOUNT_NAME}/transactions/${transactionId}`
        );
        dispatch({
          type: REMOVE_TRANSACTION_SUCCESS,
          data: transactionId
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
