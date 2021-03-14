import moment from 'moment-timezone';
import { getTransactions } from '../util/transaction';
import { LOGOUT } from './user';

export const LOAD_WEEK_SUCCESS = 'LOAD_WEEK_SUCCESS';

function loadWeek(offset) {
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      weeks
    } = getState();
    // if there are non-carriedOver transactions, assume it's been loaded
    if (weeks[offset]) {
      let existingTransactions = weeks[offset].transactions.filter(
        (t) => !t.carriedOver
      );
      if (existingTransactions.length > 0) {
        return;
      }
    }
    try {
      const dayOffset = Number(offset) * 7;
      // Monday is number 1 http://momentjs.com/docs/#/get-set/iso-weekday/
      const thisMonday = moment()
        .tz(TIMEZONE)
        .isoWeekday(1 + dayOffset);
      const nextMonday = moment()
        .tz(TIMEZONE)
        .isoWeekday(8 + dayOffset);
      const transactions = await getTransactions(
        idToken,
        thisMonday,
        nextMonday
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
        dispatch({
          type: LOGOUT
        });
        return;
      }
      throw err;
    }
  };
}

export const SHOW_WEEK = 'SHOW_WEEK';

export function showMore(ahead) {
  return function (dispatch, getState) {
    const { weeks } = getState();
    // get all the visible weeks' indices, sort from high to low
    const visibleWeeksIndices = Object.keys(weeks)
      .filter((weekIndex) => weeks[weekIndex].visible)
      .sort((a, b) => b - a);
    const nextIndex =
      ahead == true
        ? Number(visibleWeeksIndices[0]) + 1
        : Number(visibleWeeksIndices.pop()) - 1;

    dispatch(loadWeek(nextIndex));
    // show the week in UI
    dispatch({
      type: SHOW_WEEK,
      data: {
        index: nextIndex
      }
    });
  };
}
