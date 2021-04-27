import {
  RENEWING_SESSION,
  AUTHENTICATED,
  RENEWED_SESSION
} from '../actions/user';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  SET_FILTER
} from '../actions/app';
import { SHOW_WEEK, LOAD_WEEK, LOAD_WEEK_SUCCESS } from '../actions/weeks';
import moment from 'moment-timezone';
import { getWeekId } from '../selectors/week';

const defaultState = {
  isLoading: false,
  filter: '',
  yearsToLoad: 3,
  // show last 4 weeks by default
  visibleWeeks: [...Array(4).keys()].map((offset) => ({
    weekId: getWeekId({ offset: -offset }),
    offset: -offset
  })),
  notification: {
    content: '',
    title: ''
  },
  lastRefreshed: 0
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
        isLoading: false
      };
    case LOAD_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        lastRefreshed: new Date().valueOf(),
        notification: {
          title: 'App',
          content: `Finished loading transactions`,
          autohide: true
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
        visibleWeeks: state.visibleWeeks.concat(action.data)
      };
    default:
      return state;
  }
}
