import { getJson } from '../util/fetch';
import config from 'config';
export const ADD_WEEK = 'ADD_WEEK';

export function addWeek(index) {
  return {
    type: ADD_WEEK,
    data: {
      index
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

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const LOAD_TRANSACTIONS_SUCCESS = 'LOAD_TRANSACTIONS_SUCCESS';

const serverUrl = process.env.SERVER_URL;

export function loadTransactions(offset) {
  return function (dispatch, getState) {
    dispatch({
      type: LOAD_TRANSACTIONS,
      data: {
        offset
      }
    });
    getJson
      .bind(
        null,
        dispatch,
        getState
      )(`${serverUrl}/accounts/${config.account_name}/weekly/${offset}`)
      .then((transactions) => {
        dispatch({
          type: LOAD_TRANSACTIONS_SUCCESS,
          data: {
            offset,
            transactions
          }
        });
      });
  };
}
