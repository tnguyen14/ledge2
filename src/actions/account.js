import { getAccount, patchAccount } from '../util/api.js';

export const LOAD_ACCOUNT_SUCCESS = 'LOAD_ACCOUNT_SUCCESS';

export function loadAccount() {
  return async function loadAccountAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();
    const state = getState();
    const account = await getAccount(token);
    dispatch({
      type: LOAD_ACCOUNT_SUCCESS,
      data: account
    });
  };
}

// TODO update merchant counts in account reducer
const UPDATE_MERCHANT_COUNTS_SUCCESS = 'UPDATE_MERCHANT_COUNTS_SUCCESS';

export function updateMerchantCounts(merchants_count) {
  return async function updateMerchantCountsAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();
    await patchAccount(token, {
      merchants_count
    });
    dispatch({
      type: UPDATE_MERCHANT_COUNTS_SUCCESS,
      data: merchants_count
    });
  };
}
