import { startOfDay, setISODay, sub } from 'date-fns';
import { getTransactions } from '../util/api';
import { TIMEZONE } from '../util/constants';
import { logout } from './user';

export const LOAD_YEARS_SUCCESS = 'LOAD_YEARS_SUCCESS';
export function loadYears() {
  return async function loadYearAsync(dispatch, getState) {
    const {
      user: { idToken },
      app: { yearsToLoad }
    } = getState();
    const now = new Date();
    const start = sub(now, {
      years: yearsToLoad
    });
    const startMonday = startOfDay(setISODay(start, 1));
    const endMonday = startOfDay(setISODay(now, 8));
    try {
      const transactions = await getTransactions(
        idToken,
        startMonday,
        endMonday
      );
      dispatch({
        type: LOAD_YEARS_SUCCESS,
        data: {
          start: startMonday,
          end: endMonday,
          transactions
        }
      });
    } catch (e) {
      if (e.message == 'Unauthorized') {
        dispatch(logout());
        return;
      }
      throw e;
    }
  };
}
