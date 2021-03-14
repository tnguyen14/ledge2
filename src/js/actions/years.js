import moment from 'moment-timezone';
import { getTransactions } from '../util/transaction';
import { LOGOUT } from './user';

export const LOAD_YEAR_SUCCESS = 'LOAD_YEAR_SUCCESS';
export function loadYear(year) {
  const now = moment().tz(TIMEZONE);
  const start = moment(`${year}-01-01`).tz(TIMEZONE);
  let end = moment(`${year}-12-31`).tz(TIMEZONE);
  if (now.isBefore(end)) {
    end = now;
  }

  const startMonday = start.isoWeekday(1).startOf('day');
  const endMonday = end.isoWeekday(8).startOf('day');
  return async function (dispatch, getState) {
    const {
      user: { idToken }
    } = getState();
    try {
      const transactions = await getTransactions(
        idToken,
        startMonday,
        endMonday
      );
      dispatch({
        type: LOAD_YEAR_SUCCESS,
        data: {
          year: year,
          start: startMonday,
          end: endMonday,
          transactions
        }
      });
    } catch (e) {
      if (e.message == 'Unauthorized') {
        dispatch({
          type: LOGOUT
        });
        return;
      }
      throw e;
    }
  };
}
