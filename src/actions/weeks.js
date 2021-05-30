import { utcToZonedTime } from 'https://cdn.skypack.dev/date-fns-tz@1';
import { getTransactions } from '../util/api.js';
import { getWeekId, getWeekStart, getWeekEnd } from '../selectors/week.js';
import { getWeekById } from '../selectors/transactions.js';
import { logout } from './user.js';
import { TIMEZONE } from '../util/constants.js';

export const LOAD_WEEK = 'LOAD_WEEK';
export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';
export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch, getState) {
    const {
      user: { idToken },
      transactions
    } = getState();

    dispatch({
      type: LOAD_WEEK
    });
    try {
      const transactions = await getTransactions(
        idToken,
        getWeekStart({ date: weekId }),
        getWeekEnd({ date: weekId })
      );
      dispatch({
        type: LOAD_WEEK_SUCCESS,
        data: {
          weekId,
          transactions
        }
      });
    } catch (err) {
      if (err.message == 'Unauthorized') {
        dispatch(logout());
        return;
      }
      throw err;
    }
  };
}

export const SHOW_WEEK = 'SHOW_WEEK';

export function showMore(ahead) {
  return function showMoreAsync(dispatch, getState) {
    const {
      app: { weeksMeta }
    } = getState();
    const visibleWeeks = Object.keys(weeksMeta)
      .filter((weekId) => weeksMeta[weekId].visible)
      .map((weekId) => utcToZonedTime(new Date(weekId)), TIMEZONE)
      .sort((a, b) => b - a);

    const data = {
      weekId: getWeekId(
        ahead == true
          ? { date: visibleWeeks[0], offset: 1 }
          : { date: visibleWeeks.pop(), offset: -1 }
      )
    };
    // show the week in UI
    dispatch({
      type: SHOW_WEEK,
      data
    });
  };
}
