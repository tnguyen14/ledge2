import { format } from 'https://cdn.skypack.dev/date-fns@2';
import { loadYears } from './years.js';
import { loadAccount } from './account.js';
import { DATE_FIELD_FORMAT } from '../util/constants.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions() {
  return async function loadTransactionsAsync(dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    await dispatch(loadYears());
    dispatch({
      type: LOAD_TRANSACTIONS_SUCCESS
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
    dispatch(setDisplayFrom(format(new Date(), DATE_FIELD_FORMAT)));
    dispatch({
      type: REFRESH_APP
    });
  };
}
