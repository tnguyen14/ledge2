import { getJson } from '../util/fetch';
import { LOGOUT } from './user';
export const ADD_WEEK = 'ADD_WEEK';

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

const numInitialWeeks = 25;

export function loadInitialWeeks() {
  return async function (dispatch, getState) {
    await Promise.all(
      [...Array(numInitialWeeks)].map((_, index) => {
        return dispatch(addWeek(-index));
      })
    );
  };
}

function addWeek(offset) {
  return async function (dispatch, getState) {
    const {
      user: { idToken },
      weeks
    } = getState();
    // week has already been loaded
    if (weeks[offset] && weeks[offset].hasLoaded) {
      return;
    }
    dispatch({
      type: ADD_WEEK,
      data: {
        offset
      }
    });
    try {
      const transactions = await getJson(
        idToken,
        `${SERVER_URL}/accounts/${ACCOUNT_NAME}/weekly/${offset}`
      );
      dispatch({
        type: LOAD_TRANSACTIONS_SUCCESS,
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

    dispatch(addWeek(nextIndex));
    // also load the 3 weeks before that, because each week needs to calculate
    // a 4 week average (see weekStats.js)
    dispatch(addWeek(nextIndex - 1));
    dispatch(addWeek(nextIndex - 2));
    dispatch(addWeek(nextIndex - 3));

    // show the week in UI
    dispatch({
      type: SHOW_WEEK,
      data: {
        index: nextIndex
      }
    });
  };
}
