import {
  RENEWING_SESSION,
  AUTHENTICATED,
  RENEWED_SESSION
} from '../actions/user.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  SET_FILTER
} from '../actions/app.js';
import { SHOW_WEEK, LOAD_WEEK, LOAD_WEEK_SUCCESS } from '../actions/weeks.js';
import { getWeekId } from '../selectors/week.js';

const defaultState = {
  isLoading: false,
  filter: '',
  yearsToLoad: 3,
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  weeksMeta: {
    [getWeekId({ date: today })]: {
      visible: true
    },
    [getWeekId({ date: today, offset: -1 })]: {
      visible: true
    },
    [getWeekId({ date: today, offset: -2 })]: {
      visible: true
    },
    [getWeekId({ date: today, offset: -3 })]: {
      visible: true
    }
  }
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case RENEWING_SESSION:
      return {
        ...state,
        notification: {
          title: 'Authentication',
          content: 'Renewing session...'
        }
      };
    case AUTHENTICATED:
    case RENEWED_SESSION:
      return {
        ...state,
        notification: {
          title: '',
          content: ''
        }
      };
    case LOAD_TRANSACTIONS:
    case LOAD_WEEK:
      return {
        ...state,
        isLoading: true
      };
    case LOAD_WEEK_SUCCESS:
      return {
        ...state,
        isLoading: false,
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
        lastRefreshed: new Date().valueOf(),
        notification: {
          title: 'App',
          content: 'Finished loading transactions',
          autohide: 3000
        }
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.data
      };
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
