import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0';
import { loadTransactions } from './transactions.js';
import { TIMEZONE } from '../util/constants.js';

import { getWeekStart, getWeekStartFromWeekId } from '../selectors/week.js';

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

export const SET_LISTNAME = 'SET_LISTNAME';
export function setListName(listName) {
  return {
    type: SET_LISTNAME,
    data: listName
  };
}

export const REFRESH_APP = 'REFRESH_APP';
export function refreshApp() {
  // update lastRefreshed
  return {
    type: REFRESH_APP
  };
}

export function loadPastYears(yearsToLoad) {
  return async function loadPastYearsAsync(dispatch) {
    console.log('loading past year');
    const now = DateTime.now().setZone(TIMEZONE);
    const start = now.minus({
      years: yearsToLoad
    });
    const startMonday = start.startOf('week');
    const endMonday = now.startOf('week').plus({ weeks: 1 });
    await dispatch(loadTransactions(startMonday, endMonday));
  };
}

export function loadWeek({ weekId }) {
  return async function loadWeekAsync(dispatch) {
    dispatch(
      loadTransactions(
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }) }),
        getWeekStart({ date: getWeekStartFromWeekId({ weekId }), offset: 1 })
      )
    );
  };
}

export const SHOW_CASHFLOW = 'SHOW_CASHFLOW';
export function showCashflow(state) {
  return {
    type: SHOW_CASHFLOW,
    data: state
  };
}

export const SET_SEARCH_MODE = 'SET_SEARCH_MODE';
export function setSearchMode(state) {
  return {
    type: SET_SEARCH_MODE,
    data: state
  };
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export function editTransaction(transaction) {
  return {
    type: EDIT_TRANSACTION,
    data: transaction
  };
}

export const INTEND_TO_REMOVE_TRANSACTION = 'INTEND_TO_REMOVE_TRANSACTION';
export function intendToRemoveTransaction(transaction) {
  return {
    type: INTEND_TO_REMOVE_TRANSACTION,
    data: transaction
  };
}

export const CANCEL_REMOVE_TRANSACTION = 'CANCEL_REMOVE_TRANSACTION';
export function cancelRemoveTransaction() {
  return {
    type: CANCEL_REMOVE_TRANSACTION
  };
}

export const SET_USER_SETTINGS_OPEN = 'SET_USER_SETTINGS_OPEN';
export function setUserSettingsOpen(isOpen) {
  return {
    type: SET_USER_SETTINGS_OPEN,
    data: isOpen
  };
}
