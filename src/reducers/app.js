import {
  SET_FILTER,
  SET_DISPLAY_FROM,
  SET_TOKEN,
  REFRESH_APP
} from '../actions/app.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS
} from '../actions/transaction.js';
import { SHOW_WEEK, LOAD_WEEK, LOAD_WEEK_SUCCESS } from '../actions/weeks.js';
import { LOAD_YEARS_SUCCESS } from '../actions/years.js';
import { getPastWeeksIds } from '../selectors/week.js';
import { getVisibleWeeks } from '../selectors/weeks.js';

const defaultState = {
  isLoading: false,
  initialLoad: false,
  filter: '',
  yearsToLoad: 3,
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  weeksMeta: {},
  numInitialVisibleWeeks: 12
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_WEEK_SUCCESS:
      return {
        ...state,
        weeksMeta: {
          ...state.weeksMeta,
          [action.data.weekId]: {
            ...state.weeksMeta[action.data.weekId],
            loaded: true
          }
        }
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        loadedTransactions: true,
        notification: {
          title: 'App',
          content: `Finished loading transactions from ${action.data.start} to ${action.data.end}`,
          autohide: 3000
        }
      };
    case LOAD_YEARS_SUCCESS:
      return {
        ...state,
        initialLoad: true
      };
    case REFRESH_APP:
      return {
        ...state,
        lastRefreshed: new Date().valueOf()
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.data
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.data
      };
    case SET_DISPLAY_FROM:
      const previousVisibleWeeks = getVisibleWeeks(state.weeksMeta);
      // show 4 weeks by default
      const newVisibleWeeks = getPastWeeksIds({
        weekId: action.data,
        numWeeks: state.numInitialVisibleWeeks
      });
      const newState = {
        ...state,
        displayFrom: action.data
      };
      for (let week of previousVisibleWeeks) {
        newState.weeksMeta[week] = {
          ...newState.weeksMeta[week],
          visible: false
        };
      }
      for (let week of newVisibleWeeks) {
        newState.weeksMeta[week] = {
          ...newState.weeksMeta[week],
          visible: true
        };
      }
      return newState;
    case SHOW_WEEK:
      return {
        ...state,
        weeksMeta: {
          ...state.weeksMeta,
          [action.data.weekId]: {
            ...state.weeksMeta[action.data.weekId],
            visible: true
          }
        }
      };
    default:
      return state;
  }
}
