import { loadAccount } from './account.js';

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

export const REFRESH_APP = 'REFRESH_APP';
export function refreshApp() {
  return async function refreshApp(dispatch) {
    await dispatch(loadAccount());
    // update lastRefreshed
    dispatch({
      type: REFRESH_APP
    });
  };
}
