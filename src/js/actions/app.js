import { loadYear } from './years';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';

export function loadTransactions(years) {
  return async function (dispatch) {
    dispatch({
      type: LOAD_TRANSACTIONS
    });
    await Promise.all(
      years.map((year) => {
        return dispatch(loadYear(year));
      })
    );
    dispatch({
      type: LOAD_TRANSACTIONS_SUCCESS
    });
  };
}
