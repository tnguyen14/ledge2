import { format } from 'https://cdn.skypack.dev/date-fns@2';
import {
  SET_DISPLAY_FROM,
  SET_TOKEN,
  REFRESH_APP,
  SHOW_CASHFLOW,
  SET_SEARCH_MODE,
  INTEND_TO_REMOVE_TRANSACTION,
  CANCEL_REMOVE_TRANSACTION
} from '../actions/app.js';
import {
  LOAD_TRANSACTIONS,
  LOAD_TRANSACTIONS_SUCCESS,
  REMOVE_TRANSACTION_SUCCESS
} from '../actions/transactions.js';
import { SET_SEARCH } from '../actions/form.js';
import { DISPLAY_DATE_FORMAT } from '../util/constants.js';

const numVisibleWeeks = 12;

const defaultState = {
  appReady: false,
  isLoading: false,
  filter: '',
  yearsToLoad: 3,
  notification: {
    content: '',
    title: '',
    type: 'info'
  },
  lastRefreshed: 0,
  loadedTransactions: false,
  showCashflow: false
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
          content: `Finished loading transactions from ${format(
            action.data.start,
            DISPLAY_DATE_FORMAT
          )} to ${format(action.data.end, DISPLAY_DATE_FORMAT)}`,
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
        isRemovingTransaction: true,
        transactionToBeRemoved: action.data
      };
    case REMOVE_TRANSACTION_SUCCESS:
    case CANCEL_REMOVE_TRANSACTION:
      return {
        ...state,
        isRemovingTransaction: false,
        transactionToBeRemoved: undefined
      };
    default:
      return state;
  }
}
