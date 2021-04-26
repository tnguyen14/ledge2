import moment from 'moment-timezone';
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
    const now = moment().tz(TIMEZONE);
    const start = moment().subtract(yearsToLoad, 'year');
    const startMonday = start.isoWeekday(1).startOf('day');
    const endMonday = now.isoWeekday(8).startOf('day');
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
