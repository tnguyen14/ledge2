import { startOfDay, setISODay, sub } from 'https://cdn.skypack.dev/date-fns@2';
import { getTransactions } from '../util/api.js';

export const LOAD_YEARS_SUCCESS = 'LOAD_YEARS_SUCCESS';
export function loadYears() {
  return async function loadYearAsync(dispatch, getState) {
    const {
      app: { yearsToLoad, token }
    } = getState();
    const now = new Date();
    const start = sub(now, {
      years: yearsToLoad
    });
    const startMonday = startOfDay(setISODay(start, 1));
    const endMonday = startOfDay(setISODay(now, 8));
    const transactions = await getTransactions(token, startMonday, endMonday);
    dispatch({
      type: LOAD_YEARS_SUCCESS,
      data: {
        start: startMonday,
        end: endMonday,
        transactions
      }
    });
  };
}
