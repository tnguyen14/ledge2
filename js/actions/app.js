import { loadYear } from './years';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';
export function loadTransactions(years) {
  return async function loadTransactionsAsync(dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    await Promise.all(
      years.map(function dispatchLoadYear(year) {
        return dispatch(loadYear(year));
      })
    );
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
