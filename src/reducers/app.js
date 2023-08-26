import { createReducer } from 'https://esm.sh/@reduxjs/toolkit';
import { DateTime } from 'https://esm.sh/luxon@3';
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
import {
  SAVE_USER_SETTINGS,
  SAVE_USER_SETTINGS_SUCCESS,
  SAVE_USER_SETTINGS_FAILURE
} from '../actions/meta.js';
import { SET_SEARCH_PARAMS } from '../actions/form.js';

const initialState = {
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
  error: null,
  searchParams: {}
};

export default createReducer(initialState, (builder) => {
  builder
    .addCase(LOAD_TRANSACTIONS, (state) => {
      state.isLoading = true;
    })
    .addCase(LOAD_TRANSACTIONS_SUCCESS, (state, action) => {
      (state.isLoading = false),
        (state.loadedTransactions = true),
        (state.notification = {
          title: 'App',
          content: `Finished loading transactions from ${action.payload.start.toLocaleString(
            DateTime.DATETIME_FULL
          )} to ${action.payload.end.toLocaleString(DateTime.DATETIME_FULL)}`,
          autohide: 3000
        });
    })
    .addCase(REFRESH_APP, (state) => {
      (state.appReady = true), (state.lastRefreshed = new Date().valueOf());
    })
    .addCase(SET_TOKEN, (state, action) => {
      state.token = action.payload;
    })
    .addCase(SET_LISTNAME, (state, action) => {
      state.listName = action.payload;
    })
    .addCase(SET_DISPLAY_FROM, (state, action) => {
      state.displayFrom = action.payload;
    })
    .addCase(SHOW_CASHFLOW, (state, action) => {
      state.showCashflow = action.payload;
    })
    .addCase(SET_SEARCH_MODE, (state, action) => {
      state.isSearch = action.payload;
    })
    .addCase(SET_SEARCH_PARAMS, (state, action) => {
      state.searchParams = action.payload;
    })
    .addCase(INTEND_TO_REMOVE_TRANSACTION, (state, action) => {
      (state.transactionRemovalIntended = true),
        (state.transactionToBeRemoved = action.payload);
    })
    .addCase(REMOVING_TRANSACTION, (state) => {
      state.waitingTransactionRemoval = true;
    })
    .addCase(REMOVE_TRANSACTION_SUCCESS, (state) => {
      state.transactionRemovalIntended = false;
      state.waitingTransactionRemoval = false;
      state.transactionToBeRemoved = undefined;
    })
    .addCase(CANCEL_REMOVE_TRANSACTION, (state) => {
      state.transactionRemovalIntended = false;
      state.waitingTransactionRemoval = false;
      state.transactionToBeRemoved = undefined;
    })
    .addCase(SET_USER_SETTINGS_OPEN, (state, action) => {
      state.isUserSettingsOpen = action.payload;
    })
    .addCase(SAVE_USER_SETTINGS, (state) => {
      state.savingUserSettings = true;
    })
    .addCase(SAVE_USER_SETTINGS_SUCCESS, (state) => {
      state.savingUserSettings = false;
    })
    .addCase(SAVE_USER_SETTINGS_FAILURE, (state, action) => {
      state.savingUserSettings = false;
      state.userSettingsError = action.payload;
    })
    .addCase(SET_APP_ERROR, (state, action) => {
      state.error = action.payload;
    });
});
