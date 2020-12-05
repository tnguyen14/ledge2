import { postJson, patchJson, deleteJson } from '../util/fetch';
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
    `${SERVER_URL}/items?${qs.stringify({
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

    const id = await getUniqueTransactionId(idToken, transaction.date);
    // TODO handle error
    await postJson(idToken, `${SERVER_URL}/items`, {
      ...decorateTransaction(transaction),
      id
    });
    dispatch({
      type: ADD_TRANSACTION_SUCCESS,
      data: transaction
    });
    dispatch(
      updatedMerchantsCount(
        addMerchantToCounts(transaction.merchant, merchants_count)
      )
    );
  };
}

export function updateTransaction(transaction, oldMerchant) {
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();

    // TODO handle error
    await patchJson(
      idToken,
      `${SERVER_URL}/items/${transaction.id}`,
      decorateTransaction(transaction)
    );
    dispatch({
      type: UPDATE_TRANSACTION_SUCCESS,
      data: transaction
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
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      account: { merchants_count }
    } = getState();

    return async function (e) {
      await deleteJson(idToken, `${SERVER_URL}/items/${transaction.id}`);
      dispatch({
        type: REMOVE_TRANSACTION_SUCCESS,
        data: id
      });
      const transactionsWithMerchantName = await getTransactionsWithMerchantName(
        transaction.merchant
      );
      const updatedMerchantsCount = removeMerchantFromCounts(
        merchant,
        merchants_count,
        transactionsWithMerchantName.length
      );
      dispatch(updateMerchantCounts(updatedMerchantsCount));
    };
  };
}
