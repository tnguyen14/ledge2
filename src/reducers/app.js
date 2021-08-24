import {
  SET_FILTER,
  SET_DISPLAY_FROM,
  SET_TOKEN,
  REFRESH_APP,
  INITIAL_LOAD_EXPENSE_SUCCESS
} from '../actions/app.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS
} from '../actions/transactions.js';

const numVisibleWeeks = 12;

const defaultState = {
  appReady: false,
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
  loadedTransactions: false
};

export default function app(state = defaultState, action) {
  switch (action.type) {
    case LOAD_TRANSACTIONS:
      return {
        ...state,
        isLoading: true
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
    case INITIAL_LOAD_EXPENSE_SUCCESS:
      return {
        ...state,
        initialLoad: true
      };
    case REFRESH_APP:
      return {
        ...state,
        appReady: true,
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
      return {
        ...state,
        displayFrom: action.data
      };
    default:
      return state;
  }
}
