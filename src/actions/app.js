import { loadYears } from './years.js';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions(years) {
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

export const SET_TOKEN_EXP = 'SET_TOKEN_EXP';
export function setTokenExp(exp) {
  return {
    type: SET_TOKEN_EXP,
    data: exp
  };
}
