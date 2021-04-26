import moment from 'moment-timezone';
import { getTransactions } from '../util/api';
import { getWeekId, getWeekStart, getWeekEnd } from '../selectors/week';
import { getWeekById } from '../selectors/transactions';
import { logout } from './user';

export const LOAD_WEEK = 'LOAD_WEEK';
export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';
function loadWeek({ offset, weekId }) {
  return async function loadWeekAsync(dispatch, getState) {
    const {
      user: { idToken },
      transactions
    } = getState();
    const week = getWeekById({ transactions, weekId });
    // if there are non-carriedOver transactions, assume it's been loaded
    if (week) {
      let existingTransactions = week.transactions.filter(
        (t) => !t.carriedOver
      );
      if (existingTransactions.length > 0) {
        return;
      }
    }

    dispatch({
      type: LOAD_WEEK,
      data: {
        offset
      }
    });
    try {
      const transactions = await getTransactions(
        idToken,
        getWeekStart({ offset }),
        getWeekEnd({ offset })
      );
      dispatch({
        type: LOAD_WEEK_SUCCESS,
        data: {
          offset,
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
    const { app } = getState();
    const visibleWeeksOffsets = app.visibleWeeks
      .map((week) => week.offset)
      .sort((a, b) => b - a);
    const offset =
      ahead == true
        ? Number(visibleWeeksOffsets[0]) + 1
        : Number(visibleWeeksOffsets.pop()) - 1;

    const data = {
      offset,
      weekId: getWeekId({ offset })
    };
    dispatch(loadWeek(data));
    // show the week in UI
    dispatch({
      type: SHOW_WEEK,
      data
    });
  };
}
