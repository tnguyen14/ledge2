import { DateTime } from 'https://esm.sh/luxon@3';
import { loadTransactions } from './transactions.js';
import { TIMEZONE } from '../util/constants.js';

import { getWeekStart, getWeekStartFromWeekId } from '../selectors/week.js';

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

export const EDIT_TRANSACTION = 'EDIT_TRANSACTION';
export function editTransaction(transaction) {
  return {
    type: EDIT_TRANSACTION,
    payload: transaction
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
