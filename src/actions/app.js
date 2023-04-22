import { DateTime } from 'https://cdn.skypack.dev/luxon@3';
import { loadTransactions } from './transactions.js';
import { TIMEZONE } from '../util/constants.js';

import { getWeekStart, getWeekStartFromWeekId } from '../selectors/week.js';

export const SET_DISPLAY_FROM = 'SET_DISPLAY_FROM';
export function setDisplayFrom(date) {
  return {
    type: SET_DISPLAY_FROM,
    payload: date
  };
}

export const SET_TOKEN = 'SET_TOKEN';
export function setToken(token) {
  return {
    type: SET_TOKEN,
    payload: token
  };
}

export const SET_LISTNAME = 'SET_LISTNAME';
export function setListName(listName) {
  return {
    type: SET_LISTNAME,
    payload: listName
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
    payload: state
  };
}

export const SET_SEARCH_MODE = 'SET_SEARCH_MODE';
export function setSearchMode(state) {
  return {
    type: SET_SEARCH_MODE,
    payload: state
  };
}

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export function editTransaction(transaction) {
  return {
    type: EDIT_TRANSACTION,
    payload: transaction
  };
}

export const INTEND_TO_REMOVE_TRANSACTION = 'INTEND_TO_REMOVE_TRANSACTION';
export function intendToRemoveTransaction(transaction) {
  return {
    type: INTEND_TO_REMOVE_TRANSACTION,
    payload: transaction
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
    payload: isOpen
  };
}

export const ADD_ACCOUNT = 'ADD_ACCOUNT';
export function addAccount(account) {
  return {
    type: ADD_ACCOUNT,
    payload: account
  };
}
export const REMOVE_ACCOUNT = 'REMOVE_ACCOUNT';
export function removeAccount(account) {
  return {
    type: REMOVE_ACCOUNT,
    payload: account
  };
}
export const CANCEL_REMOVE_ACCOUNT = 'CANCEL_REMOVE_ACCOUNT';
export function cancelRemoveAccount(account) {
  return {
    type: CANCEL_REMOVE_ACCOUNT,
    payload: account
  };
}

export const ADD_CATEGORY = 'ADD_CATEGORY';
export function addCategory(cat) {
  return {
    type: ADD_CATEGORY,
    payload: cat
  };
}
export const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
export function removeCategory(cat) {
  return {
    type: REMOVE_CATEGORY,
    payload: cat
  };
}
export const CANCEL_REMOVE_CATEGORY = 'CANCEL_REMOVE_CATEGORY';
export function cancelRemoveCategory(cat) {
  return {
    type: CANCEL_REMOVE_CATEGORY,
    payload: cat
  };
}
export const SET_APP_ERROR = 'SET_APP_ERROR';
export function setAppError(err) {
  return {
    type: SET_APP_ERROR,
    payload: err
  };
}
