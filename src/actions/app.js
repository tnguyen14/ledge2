import { loadAccount } from './account.js';
import { getTransactions } from '../util/api.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions(startDate, endDate) {
  return async function loadTransactionsAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();

    dispatch({
      type: LOAD_TRANSACTIONS
    });
    const transactions = await getTransactions(token, startDate, endDate);
    dispatch({
      type: LOAD_TRANSACTIONS_SUCCESS,
      data: {
        start: startDate,
        end: endDate,
        transactions
      }
    });
  };
}

export const SET_FILTER = 'SET_FILTER';
export function setFilter(filter) {
  return {
    type: SET_FILTER,
    data: filter
  };
}

export const SET_DISPLAY_FROM = 'SET_DISPLAY_FROM';
export function setDisplayFrom(date) {
  return {
    type: SET_DISPLAY_FROM,
    data: date
  };
}

export const SET_TOKEN = 'SET_TOKEN';
export function setToken(token) {
  return {
    type: SET_TOKEN,
    data: token
  };
}

export const REFRESH_APP = 'REFRESH_APP';
export function refreshApp() {
  return async function refreshApp(dispatch) {
    await dispatch(loadAccount());
    // update lastRefreshed
    dispatch({
      type: REFRESH_APP
    });
  };
}
