import { getTransactions } from '../util/api.js';
import {
  getWeekId,
  getWeekStart,
  getWeekEnd,
  getWeekStartFromWeekId
} from '../selectors/week.js';
import { getVisibleWeeks } from '../selectors/weeks.js';

export const LOAD_WEEK = 'LOAD_WEEK';
export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';
export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch, getState) {
    const {
      app: { token }
    } = getState();

    dispatch({
      type: LOAD_WEEK
    });
    const transactions = await getTransactions(
      token,
      getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
      getWeekEnd({ date: getWeekStartFromWeekId({ weekId }) })
    );
    dispatch({
      type: LOAD_WEEK_SUCCESS,
      data: {
        weekId,
        transactions
      }
    });
  };
}

export const SHOW_WEEK = 'SHOW_WEEK';

export function showMore(ahead) {
  return function showMoreAsync(dispatch, getState) {
    const {
      app: { weeksMeta }
    } = getState();
    const visibleWeeks = getVisibleWeeks(weeksMeta);

    const referenceWeekId =
      ahead == true ? visibleWeeks[0] : visibleWeeks.pop();
    const offset = ahead == true ? 1 : -1;

    const data = {
      weekId: getWeekId({
        date: getWeekStartFromWeekId({ weekId: referenceWeekId }),
        offset
      })
    };
    // show the week in UI
    dispatch({
      type: SHOW_WEEK,
      data
    });
  };
}
