import { loadTransactions } from './transaction.js';
import {
  getWeekId,
  getWeekStart,
  getWeekEnd,
  getWeekStartFromWeekId
} from '../selectors/week.js';

export const LOAD_WEEK = 'LOAD_WEEK';
export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';
export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch) {
    dispatch({
      type: LOAD_WEEK,
      data: {
        weekId
      }
    });
    dispatch(
      loadTransactions(
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
        getWeekEnd({ date: getWeekStartFromWeekId({ weekId }) })
      )
    );
    dispatch({
      type: LOAD_WEEK_SUCCESS,
      data: {
        weekId
      }
    });
  };
}
