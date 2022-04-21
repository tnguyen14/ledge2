import { DateTime } from 'https://cdn.skypack.dev/luxon@2.3.0';
import {
  SET_DISPLAY_FROM,
  SET_TOKEN,
  SET_LISTNAME,
  REFRESH_APP,
  SHOW_CASHFLOW,
  SET_SEARCH_MODE,
  INTEND_TO_REMOVE_TRANSACTION,
  CANCEL_REMOVE_TRANSACTION,
  SET_USER_SETTINGS_OPEN,
  SET_APP_ERROR
} from '../actions/app.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  REMOVING_TRANSACTION,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';
import { SET_SEARCH } from '../actions/form.js';

const defaultState = {
  appReady: false,
  isLoading: false,
  filter: '',
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  showCashflow: false,
  isUserSettingsOpen: false,
  error: null
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
          content: `Finished loading transactions from ${action.data.start.toLocaleString(
            DateTime.DATETIME_FULL
          )} to ${action.data.end.toLocaleString(DateTime.DATETIME_FULL)}`,
          autohide: 3000
        }
      };
    case REFRESH_APP:
      return {
        ...state,
        appReady: true,
        lastRefreshed: new Date().valueOf()
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.data
      };
    case SET_LISTNAME:
      return {
        ...state,
        listName: action.data
      };
    case SET_DISPLAY_FROM:
      return {
        ...state,
        displayFrom: action.data
      };
    case SHOW_CASHFLOW:
      return {
        ...state,
        showCashflow: action.data
      };
    case SET_SEARCH_MODE:
      return {
        ...state,
        search: action.data ? {} : undefined
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.data
      };
    case INTEND_TO_REMOVE_TRANSACTION:
      return {
        ...state,
        transactionRemovalIntended: true,
        transactionToBeRemoved: action.data
      };
    case REMOVING_TRANSACTION:
      return {
        ...state,
        waitingTransactionRemoval: true
      };
    case REMOVE_TRANSACTION_SUCCESS:
    case CANCEL_REMOVE_TRANSACTION:
      return {
        ...state,
        transactionRemovalIntended: false,
        waitingTransactionRemoval: false,
        transactionToBeRemoved: undefined
      };
    case SET_USER_SETTINGS_OPEN:
      return {
        ...state,
        isUserSettingsOpen: action.data
      };
    case SET_APP_ERROR:
      return {
        ...state,
        error: action.data
      };
    default:
      return state;
  }
}
