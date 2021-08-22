import { startOfDay, setISODay, sub } from 'https://cdn.skypack.dev/date-fns@2';
import { loadTransactions } from './transactions.js';

import {
  getWeekStart,
  getWeekEnd,
  getWeekStartFromWeekId
} from '../selectors/week.js';

export const SET_FILTER = 'SET_FILTER';
export function setFilter(filter) {
  return {
    type: SET_FILTER,
    data: filter
  };
}

export const SET_DISPLAY_FROM = 'SET_DISPLAY_FROM';
export function setDisplayFrom(date) {
  return {
    type: SET_DISPLAY_FROM,
    data: date
  };
}

export const SET_TOKEN = 'SET_TOKEN';
export function setToken(token) {
  return {
    type: SET_TOKEN,
    data: token
  };
}

export const SET_TODAY = 'SET_TODAY';
export function setToday(date) {
  return {
    type: SET_TODAY,
    data: date
  };
}

export const REFRESH_APP = 'REFRESH_APP';
export function refreshApp() {
  // update lastRefreshed
  return {
    type: REFRESH_APP
  };
}

export const INITIAL_LOAD_EXPENSE_SUCCESS = 'INITIAL_LOAD_EXPENSE_SUCCESS';
export function initialLoadExpense() {
  return async function initialLoadExpenseAsync(dispatch, getState) {
    const {
      app: { yearsToLoad }
    } = getState();
    const now = new Date();
    const start = sub(now, {
      years: yearsToLoad
    });
    const startMonday = startOfDay(setISODay(start, 1));
    const endMonday = startOfDay(setISODay(now, 8));
    await dispatch(loadTransactions(startMonday, endMonday));
    dispatch({
      type: INITIAL_LOAD_EXPENSE_SUCCESS
    });
  };
}

export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch) {
    dispatch(
      loadTransactions(
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
        getWeekEnd({ date: getWeekStartFromWeekId({ weekId }) })
      )
    );
  };
}
