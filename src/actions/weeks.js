import { getTransactions } from '../util/api.js';
import { getWeekId, getWeekStart, getWeekEnd } from '../selectors/week.js';
import { getWeekById } from '../selectors/transactions.js';
import { logout } from './user.js';

export const LOAD_WEEK = 'LOAD_WEEK';
export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';
function loadWeek({ weekId }) {
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
