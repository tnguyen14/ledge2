import { getJson } from '../util/fetch';
import { LOGOUT } from './user';
import config from 'config';
export const ADD_WEEK = 'ADD_WEEK';

export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

const serverUrl = process.env.SERVER_URL;
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
    dispatch({
      type: ADD_WEEK,
      data: {
        offset
      }
    });
    const {
      user: { idToken }
    } = getState();
    try {
      const transactions = await getJson(
        idToken,
        `${serverUrl}/accounts/${config.account_name}/weekly/${offset}`
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
    // the next week doesn't exist
    if (!weeks[nextIndex] || !weeks[nextIndex].hasLoaded) {
      dispatch(addWeek(nextIndex));
    }
    dispatch({
      type: SHOW_WEEK,
      data: {
        index: nextIndex
      }
    });
  };
}
